# EXCERPT FROM @docs/tmp-groupchat/phase-2/final-stretch-scratchpad.md

## Imperative Chain Repair (2025-08-07, 12:20 PM)

### Sub-W Progress from working-document.md

Executing repairs for broken fgRef→ForceGraphAdapter chain per ULTRATHINK MODE.

#### Verification Status

✅ **useImperativeHandle confirmed** - ForceGraphAdapter.tsx lines 296-309:

- Methods exposed: highlightNode (line 304), selectNode (line 305)
- Proper dependency array includes both methods
- Returns merged object with internalRef.current + custom methods

✅ **Ref properly passed** - CrypticAnimusScene.tsx line 1046:

- ForceGraph3D receives ref={fgRef}
- fgRef defined as useRef<any>(null) at line 76

#### Defensive Logging Added (commit 28bf3ef2)

1. **ForceGraphAdapter.tsx**:
   - useImperativeHandle logs when called and what methods exposed (lines 297-308)
   - Warns if internalRef.current is null
   - Lists all function methods being exposed

2. **CrypticAnimusScene.tsx**:
   - Mount effect checks ref status immediately and after 100ms delay (lines 79-96)
   - Handlers log detailed ref state before attempting calls
   - Explicit warnings when methods not available (lines 853-898)

#### Next: Test Chain

Run app and verify console shows:

1. [STYLE] useImperativeHandle logs showing methods exposed
2. [PROPS] ref check logs showing methods available
3. [STYLE] logs from highlightNode/selectNode on interaction

#### OODA Loop

**Observe**: Ref chain appears connected in code
**Orient**: Need runtime verification of actual method availability
**Decide**: Run smoke test to check if methods fire
**Act**: Ready for test execution

### Success Criteria

- ✅ ForceGraphAdapter exposes methods via useImperativeHandle
- ✅ CrypticAnimusScene ref connected to ForceGraph3D
- ✅ Defensive logging added around all ref calls
- ✅ **CRITICAL FIX: Dynamic import replaced with direct import**
- ⏳ [STYLE] logs fire on interaction (pending test)
- ⏳ Visual feedback appears (pending test)

---

## CRITICAL DISCOVERY: Dynamic Import Breaks Refs (12:25 PM)

### Root Cause Identified

**Next.js `dynamic()` doesn't forward refs!**

The chain was broken at:

```typescript
// BROKEN - dynamic() doesn't forward refs
const ForceGraph3D = dynamic(
  () => import('@refinery/canvas-r3f').then((mod) => mod.ForceGraphAdapter),
  { ssr: false }
)
```

### Fix Applied (commit 515b9454)

Replaced with direct import:

```typescript
// FIXED - Direct import preserves ref forwarding
import { ForceGraphAdapter as ForceGraph3D } from '@refinery/canvas-r3f'
```

This completes the ref chain:

1. CrypticAnimusScene creates `fgRef` ✅
2. Passes to ForceGraph3D (ForceGraphAdapter) ✅
3. ForceGraphAdapter receives via `forwardRef` ✅
4. Exposes methods via `useImperativeHandle` ✅

### Expected Behavior Now

With ref chain repaired, interactions should produce:

- [STYLE] useImperativeHandle logs on mount
- [STYLE] ForceGraphAdapter.highlightNode/selectNode logs on hover/click
- [PROBE] logs showing material mutations
- Visual feedback (yellow hover, orange selection)

# Suggestions from LLM Agent with access to Refinery Mono

Below are the most common — and **still-unresolved** — ways a ref chain can look “fixed” in code yet produce **no visible highlight at runtime**. Every bullet is based solely on what I can inspect in this (legacy) repo, mapped to the patch notes you provided.

---

## 1 Dynamic-import ref leak was only the _first_ blocker

✅ You replaced `dynamic()` with a direct import, so **`fgRef.current` finally points to the `ForceGraphAdapter` React component instance.**

BUT:

### 1-A. `internalRef.current` inside `ForceGraphAdapter` may still be `null`

`useImperativeHandle` publishes

```ts
expose({ …internalRef.current, highlightNode, … })
```

If the underlying `<ForceGraph3D>` hasn’t mounted yet (three → canvas initialises _after_ React commit + one RAF), `internalRef.current` is `null`.  
Your extra `console.log` after **100 ms** helps, but on slower laptops the ref can remain `null` for several hundred ms.

➜ Result: highlight methods exist, but they early-return because `meshRef` or `__threeObj` is absent.  
_Place a guard that retries until `fgRef.current.graphData()` returns a non-empty array, **then** invoke highlight._

### 1-B. Node identity mismatch

`highlightNode('abc')` finds a node object by `id === 'abc'` **in the array stored inside `fgRef.current.graphData()`**.  
If upstream state cloned nodes after `ForceGraphAdapter` cached its pointer, the lookup fails ⇒ `undefined` ⇒ “no highlight”.

---

## 2 Imperative colour change is wiped out next render

`highlightNode()` sets

```ts
obj.material.color.setHex(0xffff00)
obj.material.needsUpdate = true
```

Great – the sprite turns yellow **for that frame**.

But on the very next React render, `CrypticAnimusScene.nodeThreeObject` is re-executed and reinstalls a _fresh_ `SpriteMaterial` whose initial colour is the default.  
→ The yellow flash disappears so quickly you never see it.

In the legacy repo the colour **persists** because the declarative side also knows which node is hovered:

```ts
const isHighlighted = highlightState?.nodeIds.has(node.id)
return isHighlighted ? LINK_COLORS.highlighted : LINK_COLORS.default
```

(See lines 312-324 in `CrypticAnimusScene.tsx`.)

If you removed the store update (or the prop carrying `highlightState`) the declarative path no longer marks the node as highlighted, so each render resets to default.

---

## 3 Hover handler still passes **object**, not id

Your audit shows you fixed `handleNodeHover` once, but double-check:  
`CrypticAnimusScene` calls `onNodeHoverProp(nodeObject)`.  
If you later refactored `handleNodeHover = (nodeId)` again, the store receives `undefined` and the declarative highlight logic never engages.

---

## 4 Blocking React re-renders to “prevent remounts” prevents highlight

If you wrapped store dispatch in `queueMicrotask()` _and_ put the highlight state itself behind `useRef` or `useMemo` to avoid extra renders, the colour callbacks will never see the new IDs.  
Highlighting is supposed to **cause** a cheap React re-render of `CrypticAnimusScene`.

---

## 5 Material subtype mismatch

`highlightNode` assumes `instanceof SpriteMaterial`; but once you switched from sprite-based glyphs to `MeshBasicMaterial` (or vice-versa) the colour mutation does nothing:

```ts
if (!(obj.material instanceof SpriteMaterial)) return // silently fails
```

Check the console warnings you added – look for “materialType = ‘MeshBasicMaterial’, skipping”.

---

## 6 Alpha / cooldown tricks still interfere

Even with `cooldownTime={Infinity}` in props, an **external reheat** (`fgRef.current.d3ReheatSimulation()`) you may have sprinkled elsewhere will call `Object.freeze` on the _new_ node objects, undoing the colour because React remounts all sprites on the next tick.

---

## Minimal checklist to see a highlight frame-by-frame

1. Wait until `fgRef.current.graphData().nodes.length > 0`.
2. Call `fgRef.current.highlightNode('abc')`.
3. In the **very next render** make sure `getLinkColor` / `nodeThreeObject` read a prop (`hoverNodeId`) that equals `'abc'`.
4. Do **NOT** recreate shallow copies of `graphData` on that render (identity must stay stable for ForceGraph to keep the same Three objects).
5. Do **NOT** re-heat physics within the same 200 ms window.

If after verifying each bullet you still see “no glow”, inspect the console probe lines you added – one of the silenced early-returns described above will be printing.

That is everything, exhaustively, that can still break highlight after the ref chain patch—using only evidence from this repo.

# QUICK SMOKE SCREEN TEST

I ran a quick smoke screen test where I tried to click on a node and **nothing fucking happened**. Here is the full console log:

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:174 [INIT POSITIONS] Spawned 213 nodes - mode: origin
ForceGraphAdapter.tsx:297 [STYLE] useImperativeHandle called, internalRef.current exists: true
ForceGraphAdapter.tsx:307 [STYLE] Exposing imperative handle with methods: (9) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh', 'highlightNode', 'selectNode']
ForceGraphAdapter.tsx:313 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:315 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:316 [FGAdapter] ref.current keys: (9) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh', 'highlightNode', 'selectNode']
ForceGraphAdapter.tsx:317 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:319 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:320 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:333 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:342 [FGAdapter] Called ref.current.refresh() successfully
ForceGraphAdapter.tsx:347 [FGAdapter] Updated window.__FG with latest ref.current
CrypticAnimusScene.tsx:76 [PROPS] CrypticAnimusScene ref check, fgRef.current: {exists: true, hasHighlightNode: true, hasSelectNode: true, methods: Array(9)}
CrypticAnimusScene.tsx:113 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:121 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:210 [PROPS] CrypticAnimusScene props updated: {mouseSelectedNodeId: null, searchResultOutlineIds: 0, gesturedNodeId: null, activeCategories: 6, activeTags: 0, …}
CrypticAnimusScene.tsx:239 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:242 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:318 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:331 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:370 [Window FG] Error during initial setup: TypeError: Cannot read properties of undefined (reading 'tick')
    at layoutTick (three-forcegraph.mjs:753:23)
    at comp.tickFrame (three-forcegraph.mjs:740:9)
    at comp.<computed> [as tickFrame] (kapsule.mjs:169:65)
    at ForceGraph.<computed> [as tickFrame] (three-forcegraph.mjs:1528:75)
    at eval (r3f-forcegraph.mjs:160:70)
    at Object.eval [as tickFrame] (r3f-forcegraph.mjs:185:24)
    at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:353:42)
    at CrypticAnimusScene.useEffect (CrypticAnimusScene.tsx:754:5)
    at react-stack-bottom-frame (react-reconciler.development.js:7241:22)
    at runWithFiberInDEV (react-reconciler.development.js:399:20)
    at commitHookEffectListMount (react-reconciler.development.js:4782:628)
    at commitHookPassiveMountEffects (react-reconciler.development.js:4817:60)
    at reconnectPassiveEffects (react-reconciler.development.js:5670:17)
    at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
    at reconnectPassiveEffects (react-reconciler.development.js:5669:17)
    at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
    at reconnectPassiveEffects (react-reconciler.development.js:5676:325)
    at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
    at reconnectPassiveEffects (react-reconciler.development.js:5684:17)
    at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5648:451)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106) Error Component Stack
    at CrypticAnimusScene (CrypticAnimusScene.tsx:57:3)
    at SceneContent (CrypticVaultScene.tsx:117:3)
    at Suspense (<anonymous>)
    at Suspense (<anonymous>)
    at ErrorBoundary (events-f681e724.esm.js:129:5)
    at m (index.js:51:1)
    at eval (events-f681e724.esm.js:105:5)
    at Provider (events-f681e724.esm.js:2045:3)
overrideMethod @ hook.js:608
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:370
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:754
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5669
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5676
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5684
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
commitPassiveMountOnFiber @ react-reconciler.development.js:5648
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5627
flushPassiveEffects @ react-reconciler.development.js:6567
performSyncWorkOnRoot @ react-reconciler.development.js:1361
flushSyncWorkAcrossRoots_impl @ react-reconciler.development.js:1288
commitRootImpl @ react-reconciler.development.js:6525
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performWorkOnRootViaSchedulerTask @ react-reconciler.development.js:1356
performWorkUntilDeadline @ scheduler.development.js:44
CrypticAnimusScene.tsx:371 [Window FG] Stack trace: TypeError: Cannot read properties of undefined (reading 'tick')
    at layoutTick (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:753:23)
    at comp.tickFrame (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:740:9)
    at comp.<computed> [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/kapsule@1.16.3/node_modules/kapsule/dist/kapsule.mjs:169:65)
    at ForceGraph.<computed> [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:1528:75)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:160:70)
    at Object.eval [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:185:24)
    at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:334:62)
    at CrypticAnimusScene.useEffect (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:765:13)
    at react-stack-bottom-frame (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:7241:22)
    at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:399:20)
    at commitHookEffectListMount (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:4782:628)
    at commitHookPassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:4817:60)
    at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5670:17)
    at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
    at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5669:17)
    at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
    at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5676:325)
    at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
    at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5684:17)
    at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
    at commitPassiveMountOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5648:451)
    at recursivelyTraversePassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5614:106)
    at commitPassiveMountOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5656:17)
    at recursivelyTraversePassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5614:106)
    at
overrideMethod @ hook.js:608
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:371
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:754
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5669
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5676
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5684
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
commitPassiveMountOnFiber @ react-reconciler.development.js:5648
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5627
flushPassiveEffects @ react-reconciler.development.js:6567
performSyncWorkOnRoot @ react-reconciler.development.js:1361
flushSyncWorkAcrossRoots_impl @ react-reconciler.development.js:1288
commitRootImpl @ react-reconciler.development.js:6525
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performWorkOnRootViaSchedulerTask @ react-reconciler.development.js:1356
performWorkUntilDeadline @ scheduler.development.js:44
three-forcegraph.mjs:753 Uncaught TypeError: Cannot read properties of undefined (reading 'tick')
    at layoutTick (three-forcegraph.mjs:753:23)
    at comp.tickFrame (three-forcegraph.mjs:740:9)
    at comp.<computed> [as tickFrame] (kapsule.mjs:169:65)
    at ForceGraph.<computed> [as tickFrame] (three-forcegraph.mjs:1528:75)
    at eval (r3f-forcegraph.mjs:160:70)
    at Object.eval [as tickFrame] (r3f-forcegraph.mjs:185:24)
    at CrypticAnimusScene.useFrame [as current] (CrypticAnimusScene.tsx:947:21)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
layoutTick @ three-forcegraph.mjs:753
tickFrame @ three-forcegraph.mjs:740
comp.<computed> @ kapsule.mjs:169
ForceGraph.<computed> @ three-forcegraph.mjs:1528
eval @ r3f-forcegraph.mjs:160
eval @ r3f-forcegraph.mjs:185
CrypticAnimusScene.useFrame @ CrypticAnimusScene.tsx:947
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
invalidate @ events-f681e724.esm.js:2331
eval @ events-f681e724.esm.js:1161
eval @ vanilla.mjs:13
setState @ vanilla.mjs:13
eval @ events-f681e724.esm.js:2053
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookLayoutEffects @ react-reconciler.development.js:4770
commitLayoutEffectOnFiber @ react-reconciler.development.js:5061
recursivelyTraverseLayoutEffects @ react-reconciler.development.js:5505
commitLayoutEffectOnFiber @ react-reconciler.development.js:5077
commitLayoutEffects @ react-reconciler.development.js:5501
commitRootImpl @ react-reconciler.development.js:6512
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performWorkOnRootViaSchedulerTask @ react-reconciler.development.js:1356
performWorkUntilDeadline @ scheduler.development.js:44
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c5c5cb290', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfbf127ae', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cf2bbf5ec', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cdf8bdcca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cdd55b905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c843d7870', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ceaa7c88f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c79a9247e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c74ef33e8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c652b607a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc742484d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8173ab2d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c85aa9c70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c13cebb4a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c55ba44c5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2800cc7f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cff1d4018', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca59c85d0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c535c8110', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cbc52d6c2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c33ca164a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c6361cb4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cef78a38b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cee11cbb1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ccffbc1ef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc4842cc4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c74d36234', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cee99331f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cdd956ea1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c376b7f32', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c56eb31b9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfb053573', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cedcb24bc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7d7f4b95', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2f12bdee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c25d961aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8e99e6ed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c70b1c9bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cccbea023', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3a9984dd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c03a535e4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd163d4f3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cef22c14d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb8c02222', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c4921c0e2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c5fc25157', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c972c97bd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3851db91', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8ae1016c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c56ab24c1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce2fae53e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc770fdb2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7a55b332', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cf792d1af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c82fb7647', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8e7bbb6a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c0b006cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c00285b01', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c25890dea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c6d98fb14', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfb56812c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca835c723', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2241aef0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb7331b23', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c83b96b4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c9d0588aa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c48a098c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c27d54905', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7301e7fb', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c434990c8', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb5e4ead7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd36a7b45', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c60986435', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cad773eab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca5450742', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd28770db', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c77ae9ae5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c5af9982f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb39e5d5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3c02fcb3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca41157d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7c99ba8b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c384aafcf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca78bb5af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce8b72849', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ccdcf7310', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c9c9eb43c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1a7a5d5d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ccf640cac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c5047db93', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c869352a0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1493cabc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c76a3bf25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3650d69a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1f618a24', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c340cbdad', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ceb399bca', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cf738a9e1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ccf8292e9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8ade5c49', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3c259fef', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c5e2bab0e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1f9db45c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1e4ad5b4', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c9a1cd11b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb4639457', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c17d356af', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb71b3926', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd305c2ff', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c4b721a70', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c657f8b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c0d25c673', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce898d890', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c04efe311', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd9f5bc4f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfe17f210', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd5b5d6d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce029d95e', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfdf1abed', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2f075e79', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1a54e072', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ccb2b2f6c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ceeb65581', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb178b270', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce0067c5c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cecee7df9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ccd81ff8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca9946b8d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cdacf98f1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7873dac5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cececa383', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3b0c869b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc2bbbfee', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c9e36580a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c0492e1cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cea0d59fe', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1ac0d342', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca3d2eb5a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cff96989a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c14952ea7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c50976366', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c98df5000', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c906c3f65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfa52c07a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cceee4ce9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c0f7fb9ac', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffa07a'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c26769d05', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cf88d57e3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3a56aefd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd3af37c0', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce8a87cd1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd3b05c25', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'caa5eb943', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cda217c26', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c4f1d1909', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca0c391dc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd25ec3ea', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca53a1f2f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c96dcda94', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ced8ce15d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7b48bdfa', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c88be5f44', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cea08be1c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8ecfe6cf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c5855a307', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c6b48a717', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc56234bf', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c36965f1b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c365a170a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb48197be', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c609144d7', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1bd6aaf6', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c25a9ac40', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfd668493', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7859277f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc65f5535', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3e3245cc', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc6f0738f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ca611af7d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c12bc654f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc47cce08', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ceb9d11e5', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c09300fce', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c478deb51', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1d3736ab', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c892dec8f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2bd59755', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce0d42452', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c86164a6f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c82c6b22c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c225ab6cd', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3d5f2683', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce34d16d1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c086172d2', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7df2f6f9', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cfb1f5a76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c3148c486', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc8155878', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c1b857668', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cb21b5dc1', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'ce0598a7a', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc0089e65', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cd00ccf76', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2339842d', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cffe18113', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '87ceeb'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c98ded198', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c7dc22b2c', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c0ed27a5f', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c8b20d363', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c695e0665', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ff69b4'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c2d0a70a3', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'ffd700'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'c01baf36b', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: 'da70d6'}
CrypticAnimusScene.tsx:802 [PROBE] nodeThreeObject: {nodeId: 'cc54fc001', hasExistingThreeObj: false, spriteType: 'Sprite', materialType: 'SpriteMaterial', materialColor: '32cd32'}
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 57ms
CrypticAnimusScene.tsx:76 [PROPS] CrypticAnimusScene ref check, fgRef.current: {exists: true, hasHighlightNode: true, hasSelectNode: true, methods: Array(9)}
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 72ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 56ms
CrypticAnimusScene.tsx:877 [PROPS] CrypticAnimusScene.handleNodeHover: {nodeId: 'cc742484d', hasRef: true, hasHighlightNode: true, timestamp: 1754584158313}
CrypticAnimusScene.tsx:885 [PROPS] Calling imperative highlightNode: {nodeId: 'cc742484d'}
ForceGraphAdapter.tsx:167 [STYLE] ForceGraphAdapter.highlightNode called: {nodeId: 'cc742484d', timestamp: 1754584158313}
ForceGraphAdapter.tsx:170 [STYLE] highlightNode early return - no graphData
CrypticAnimusScene.tsx:896 [PROPS] Calling parent onNodeHoverProp handler: {nodeId: 'cc742484d'}
ui-slice.ts:145 [STORE] setHoverNode called: {nodeId: 'cc742484d', timestamp: 1754584158314}
ui-slice.ts:147 [STORE] setHoverNode executing in microtask: {nodeId: 'cc742484d'}
ui-slice.ts:152 [STORE] setHoverNode state updated: {before: null, after: 'cc742484d'}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754584158342}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:877 [PROPS] CrypticAnimusScene.handleNodeHover: {nodeId: 'ccb2b2f6c', hasRef: true, hasHighlightNode: true, timestamp: 1754584173406}
CrypticAnimusScene.tsx:885 [PROPS] Calling imperative highlightNode: {nodeId: 'ccb2b2f6c'}
ForceGraphAdapter.tsx:167 [STYLE] ForceGraphAdapter.highlightNode called: {nodeId: 'ccb2b2f6c', timestamp: 1754584173406}
ForceGraphAdapter.tsx:170 [STYLE] highlightNode early return - no graphData
CrypticAnimusScene.tsx:896 [PROPS] Calling parent onNodeHoverProp handler: {nodeId: 'ccb2b2f6c'}
ui-slice.ts:145 [STORE] setHoverNode called: {nodeId: 'ccb2b2f6c', timestamp: 1754584173407}
ui-slice.ts:147 [STORE] setHoverNode executing in microtask: {nodeId: 'ccb2b2f6c'}
ui-slice.ts:152 [STORE] setHoverNode state updated: {before: 'cc742484d', after: 'ccb2b2f6c'}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754584173433}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
CrypticAnimusScene.tsx:877 [PROPS] CrypticAnimusScene.handleNodeHover: {nodeId: 'cee11cbb1', hasRef: true, hasHighlightNode: true, timestamp: 1754584174785}
CrypticAnimusScene.tsx:885 [PROPS] Calling imperative highlightNode: {nodeId: 'cee11cbb1'}
ForceGraphAdapter.tsx:167 [STYLE] ForceGraphAdapter.highlightNode called: {nodeId: 'cee11cbb1', timestamp: 1754584174785}
ForceGraphAdapter.tsx:170 [STYLE] highlightNode early return - no graphData
CrypticAnimusScene.tsx:896 [PROPS] Calling parent onNodeHoverProp handler: {nodeId: 'cee11cbb1'}
ui-slice.ts:145 [STORE] setHoverNode called: {nodeId: 'cee11cbb1', timestamp: 1754584174785}
ui-slice.ts:147 [STORE] setHoverNode executing in microtask: {nodeId: 'cee11cbb1'}
ui-slice.ts:152 [STORE] setHoverNode state updated: {before: 'ccb2b2f6c', after: 'cee11cbb1'}
ui-slice.ts:123 [STORE] clearSelection called: {timestamp: 1754584174814}
ui-slice.ts:125 [STORE] clearSelection executing in microtask
ui-slice.ts:132 [STORE] clearSelection state updated: {beforeNodes: Array(0), beforeEdges: Array(0), afterNodes: Array(0), afterEdges: Array(0)}
```
