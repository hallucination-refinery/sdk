# Baseline Smoke Screen Tests

Last Updated: 6:30 PM EST, 27/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: afc96f74
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Changes: v6 "ForceGraph3D Remount Fix" implemented
- commit message - "fix: prevent ForceGraph3D remounts during visibility-only updates"

## Test 1 - Do Nothing

### Test 1: Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1922ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copying the whole console log at that time
6. Clearly document a chronological account

### Test 1: Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a cluster of colorful nodes and links **seeming** to explode out from an origin point.
2. Immidietely after, the viewport is **Paused in debugger**:
   2.1 Viewport is crammed with a cluster of oversized, colorful nodes and links.
   2.2 The DevTools window points to **line 295 of @CrypticAnimusScene.tsx**:
   ` if (simData?.nodes?.length > 0 && (window as any).__beforePos) {`
3. I click the blue "fast forward" button in the "Paused in debugger" tooltip. The crammed with a cluster of oversized, colorful nodes and links in the scene **immidietely** jolt out and settle down.
4. The scene shows sparsely spaced colored nodes thin grey edges, a **77 FPS** counter top-left, and the HUD.
5. There is a red next.js tooltip in the lower left corner flagging 2 console errors:
   5.1
   `ReferenceError: simData is not defined
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:274:25)`
   5.2
   `Error: [Window FG] Stack trace: "ReferenceError: simData is not defined\n    at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:274:25)"
at createConsoleError (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/errors/console-error.js:27:71)
at handleConsoleError (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/errors/use-error-handler.js:47:54)
at console.error (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/globals/intercept-console-error.js:47:57)
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:297:33)   `

### Test 1: Full Console Log

```
Navigated to http://localhost:3000/
main-app.js?v=1753657102986:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T22:58:24.369Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T22:58:24.369Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - incrementing version. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphVersion: 0 visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T22:58:24.384Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T22:58:24.385Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphVersion: 1 visibleIds: 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
[Violation] 'requestAnimationFrame' handler took <N>ms
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:277 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:285 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:292 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:318 [Window FG] Error during initial setup: ReferenceError: simData is not defined
    at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:295:9)
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:318
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:247
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:247
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:247
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:702
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
CrypticAnimusScene.tsx:319 [Window FG] Stack trace: ReferenceError: simData is not defined
    at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:274:25)
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:319
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:247
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:247
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:247
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:702
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
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 574397ms
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has __kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has __kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
```

## Test 2 - Hover on node

### Test 2: Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 2.7s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Click on browser window and move cursor into viewport
6. Hover over a single node & click (try to hover on only **one** node)
7. Copying the whole console log
8. Clearly document a chronological account

### Test 2: Chronological Account

1. On initial load: the HUD is visible but I **do not** see any nodes or links, only the background of the scene.
2. Immidietely after, the viewport is **Paused in debugger**. The DevTools window points to **line 295 of @CrypticAnimusScene.tsx**:
   ` if (simData?.nodes?.length > 0 && (window as any).__beforePos) {`
3. I click the blue "fast forward" button in the "Paused in debugger" tooltip. Colorful nodes and links **suddenly appear** sparsely spaced in the scene, moving a bit before settling down.
4. The scene shows sparsely spaced colored nodes thin grey edges, a **77 FPS** counter top-left, and the HUD.
5. I move my cursor into the viewport, carefully trying to avoid nodes, and **hover over** a green node labeled "cope with anxiety". Immidietely after, the viewport is **Paused in debugger**. The DevTools window points to **@ForceGraphAdapter.tsx**. However the contents of the file are empty, there is only the following 1-line:
   `Could not load content for webpack-internal:///workspace/apps/src/adapters/ForceGraphAdapter.tsx (Fetch through target failed: Unsupported URL scheme; Fallback: HTTP error: status code 404, net::ERR_UNKNOWN_URL_SCHEME)`
6. I click the blue "fast forward" button in the "Paused in debugger" tooltip. The viewport **remains paused** as the DevTools window now points to **line 277 in react-reconciler.development.js**.
7. I click the blue "fast forward" button in the "Paused in debugger" tooltip. The viewport **remains paused** as the DevTools window now points to **line 62 in @CrypticAnimusScene.tsx**.
8. I click the blue "fast forward" button in the "Paused in debugger" tooltip. The viewport **remains paused** as the DevTools window now points to **line 62 in @CrypticAnimusScene.tsx**.
9. I click the blue "fast forward" button in the "Paused in debugger" tooltip. The viewport **remains paused** as the DevTools window now points to **line 117 in @CrypticVaultScene.tsx**.
10. I click the blue "fast forward" button in the "Paused in debugger" tooltip. The viewport **unpauses**, the nodes and links look **exactly the same** as before (see 4.)
11. I decide to **end the test here** and copy the whole console log, I see that the DevTools window has unexpectly closed itself.
12. I reopen the window and copy the **entire console log**, it is extrodinarily long (see below). Then, the DevTool window freezes (presumably because of the console log firing) and unexpectly closes again.

13. The last thing I notice is that there is the same red next.js tooltip in the lower left corner flagging **3 errors**, not 2 like before:
    13.1
    `ReferenceError: simData is not defined
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:274:25)`
    13.2
    `Error: [Window FG] Stack trace: "ReferenceError: simData is not defined\n    at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:274:25)"
at createConsoleError (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/errors/console-error.js:27:71)
at handleConsoleError (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/errors/use-error-handler.js:47:54)
at console.error (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/globals/intercept-console-error.js:47:57)
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:297:33)   `
    13.3
    `
Error: Cannot update a component (`SceneContent`) while rendering a different component (`ForwardRef`). To locate the bad setState() call inside `ForwardRef`, follow the stack trace as described in https://react.dev/link/setstate-in-render
    at createConsoleError (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/errors/console-error.js:27:71)
    at handleConsoleError (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/errors/use-error-handler.js:47:54)
    at console.error (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/components/globals/intercept-console-error.js:47:57)
    at scheduleUpdateOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5974:201)
    at forceStoreRerender (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:2621:26)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:2606:45)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/zustand@5.0.6_@types+react@19.1.8_immer@10.1.1_react@19.1.0_use-sync-external-store@1.5.0_react@19.1.0_/node_modules/zustand/esm/vanilla.mjs:13:39)
    at Set.forEach (<anonymous>)
    at setState (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/zustand@5.0.6_@types+react@19.1.8_immer@10.1.1_react@19.1.0_use-sync-external-store@1.5.0_react@19.1.0_/node_modules/zustand/esm/vanilla.mjs:13:17)
    at store.setState (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/zustand@5.0.6_@types+react@19.1.8_immer@10.1.1_react@19.1.0_use-sync-external-store@1.5.0_react@19.1.0_/node_modules/zustand/esm/middleware/immer.mjs:11:12)
    at selectNodes (webpack-internal:///(app-pages-browser)/../../../packages/store/src/slices/ui-slice.ts:37:13)
    at Object.eval [as selectNodes] (webpack-internal:///(app-pages-browser)/../../../packages/store/src/store.ts:58:25)
    at CrypticVaultSceneContent.useCallback[handleBackgroundClick] [as onBackgroundClick] (webpack-internal:///(app-pages-browser)/./components/CrypticVaultScene.tsx:394:21)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:160:70)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:174:14)
    at Array.forEach (<anonymous>)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:173:8)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:143:66)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:217:27)
    at ForceGraphAdapter (webpack-internal:///(app-pages-browser)/../../../packages/canvas-r3f/dist/adapters/ForceGraphAdapter.js:44:13)
    at BailoutToCSR (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js:13:11)
    at Suspense (<anonymous>)
    at LoadableComponent (<anonymous>)
    at FGErrorBoundary (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:22:1)
    at CrypticAnimusScene (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:44:11)
    at SceneContent (webpack-internal:///(app-pages-browser)/./components/CrypticVaultScene.tsx:92:11)
    at Suspense (<anonymous>)
    at Suspense (<anonymous>)
    at ErrorBoundary (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/@react-three+fiber@9.1.4_@types+react@19.1.8_immer@10.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0_three@0.176.0/node_modules/@react-three/fiber/dist/events-f681e724.esm.js:129:5)
    at m (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/its-fine@2.0.0_@types+react@19.1.8_react@19.1.0/node_modules/its-fine/dist/index.js:51:1)
    at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/@react-three+fiber@9.1.4_@types+react@19.1.8_immer@10.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0_three@0.176.0/node_modules/@react-three/fiber/dist/events-f681e724.esm.js:105:5)
    at Provider (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/@react-three+fiber@9.1.4_@types+react@19.1.8_immer@10.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0_three@0.176.0/node_modules/@react-three/fiber/dist/events-f681e724.esm.js:2045:3)
`
14. The very last thing I do, just to confirm if the whole viewport/scene is frozen, is scroll to zoom in and out. The scene was **not frozen** and zooming in and out was pretty smooth (~45-60 FPS).

### Test 2 Entire Console Log

```
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.935Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.935Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.935Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.956Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.956Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.957Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.957Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.973Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.973Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.974Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.974Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.995Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.995Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.996Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:29.996Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.012Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.012Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.013Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.013Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.033Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.033Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.034Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.034Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.051Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.051Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.052Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.052Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.075Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.075Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.076Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.076Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.095Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.096Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.097Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.097Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.122Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.122Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.123Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.123Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.143Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.143Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.144Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.144Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.168Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.168Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.170Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.170Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.186Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.187Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.187Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.187Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.208Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.209Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.209Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.210Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.225Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.226Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.227Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.227Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.247Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.247Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.248Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.248Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.264Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.264Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.265Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.265Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.286Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.286Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.287Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.287Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.304Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.305Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: Object
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.306Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.306Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.326Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.327Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.327Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.327Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.344Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.344Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.345Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.345Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: Object
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.435Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.435Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.437Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.438Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.460Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.460Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.462Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.463Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.490Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.490Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.492Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.493Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.524Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.525Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.527Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.528Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.554Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.555Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.557Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.558Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.580Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.580Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.582Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.583Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.610Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.610Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.612Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.613Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.639Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.640Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.643Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.644Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.675Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.676Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.678Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.679Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.701Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.701Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.703Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.704Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.740Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.741Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.742Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.743Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.765Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.765Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.767Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.768Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.794Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.795Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.797Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.798Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.820Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.820Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.822Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.823Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.852Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.853Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.855Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.855Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.877Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.877Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.879Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.880Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.905Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.906Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.908Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.908Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.931Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.931Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.933Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.934Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.959Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.960Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.962Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.963Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.985Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.986Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.988Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:30.989Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.016Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.016Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.018Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.019Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.041Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.041Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.043Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.044Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.070Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.071Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.073Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.074Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.096Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.096Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.099Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.099Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.127Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.127Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.130Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.130Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.154Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.155Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.157Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.158Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.183Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.184Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.186Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.187Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.208Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.209Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.211Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.211Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.246Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.247Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.249Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.250Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.272Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.272Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.274Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.275Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.301Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.302Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.304Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.305Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.327Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.327Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.329Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.330Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.357Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.358Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.360Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.360Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.384Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.384Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.386Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.387Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.413Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.414Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.416Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.416Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.438Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.438Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.440Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.441Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.468Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.469Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.471Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.472Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.493Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:941 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.494Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.496Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.497Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.524Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.525Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.527Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.528Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.560Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.561Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.563Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.563Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.594Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.594Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.596Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.597Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.620Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.621Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.622Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.623Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.649Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.649Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.651Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.652Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.673Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.673Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.675Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.676Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.701Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.702Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.704Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.705Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.725Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.726Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.728Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.728Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.753Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.754Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.756Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.757Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.777Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.778Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.780Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.780Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.805Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.805Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.807Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.808Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.829Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.829Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.831Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.832Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.857Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.858Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.860Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.860Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.881Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.881Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.883Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.884Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.909Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.910Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.912Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.912Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.933Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.933Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.935Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.936Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.960Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.961Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.963Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.964Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.984Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.985Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.987Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:31.988Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.019Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.019Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.022Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.022Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.044Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.045Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.047Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.047Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.073Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.073Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.087Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.088Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.108Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.108Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.110Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.111Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.137Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.137Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.139Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.140Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.159Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.160Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.162Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.162Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.187Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.187Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.189Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.190Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.210Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.211Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.213Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.213Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.237Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.238Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.240Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.240Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.260Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.261Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.262Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.263Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.287Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.288Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.289Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.290Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.310Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.310Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.312Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.313Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.338Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.339Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.341Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.341Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.363Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.363Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.365Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.366Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.390Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.390Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.392Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.392Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.412Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.413Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.415Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.416Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.440Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.441Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.443Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.444Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.464Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.464Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.466Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.467Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.491Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.492Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.494Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.494Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.515Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.516Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.518Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.518Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.543Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.543Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.545Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.546Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.566Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.566Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.568Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.569Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.593Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.594Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.598Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.598Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.618Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.618Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.620Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.621Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.645Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.645Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.647Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.648Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.676Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.676Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.678Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.679Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.707Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.708Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.710Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.710Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.731Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.731Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.733Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.734Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.758Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.759Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.760Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.761Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.781Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.781Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.783Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.784Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.811Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.811Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.813Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.814Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.834Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.834Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.836Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.837Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.861Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.861Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.863Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.864Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.884Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.884Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.886Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.887Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.911Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.912Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.914Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.915Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.934Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.935Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.937Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.938Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.963Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.964Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.965Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.966Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.986Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.986Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.988Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:32.989Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.013Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.014Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.016Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.016Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.036Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.037Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.039Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.039Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.064Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.065Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.067Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.067Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.088Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.089Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.090Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.091Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.118Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.119Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.121Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.121Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.141Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.141Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.143Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.143Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.169Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.169Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.171Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.172Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.192Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.192Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.194Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.195Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.219Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.220Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.221Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.222Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.242Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.242Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.244Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.245Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.269Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.270Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.272Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.272Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.292Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.293Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.295Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.295Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.320Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.320Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.322Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.323Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.343Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.343Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.345Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.346Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.370Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.370Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.372Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.373Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.396Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.397Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.403Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.403Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.433Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.433Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.435Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.436Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.456Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.457Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.459Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.459Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.484Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.484Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.486Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.487Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.507Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.507Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.509Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.510Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.538Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.538Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.540Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.541Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.561Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.562Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.564Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.564Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.589Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.590Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.592Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.592Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.613Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.613Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.615Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.616Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.641Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.642Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.643Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.644Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.663Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.664Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.666Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.666Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.691Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.692Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.694Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.694Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.714Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.715Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.717Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.717Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.742Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.742Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.744Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.745Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.765Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.765Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.767Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.768Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.792Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.792Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.794Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.795Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.815Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.815Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.817Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.818Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.844Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.844Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.846Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.847Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.866Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.867Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.868Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.869Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.893Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.894Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.896Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.896Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.916Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.917Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.919Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.919Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.944Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.945Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.947Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.947Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.968Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.968Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.970Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.971Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.996Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.997Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.999Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:33.999Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.019Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.020Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.022Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.022Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.047Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.048Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.050Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.050Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.070Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.071Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.072Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.073Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.105Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.105Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.107Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.108Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.129Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.129Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.131Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.132Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.158Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.158Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.160Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.161Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.180Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.180Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.182Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.183Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.208Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.208Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.210Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.210Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.232Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.232Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.234Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.235Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.259Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.259Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.261Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.261Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.281Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.282Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.284Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.284Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.309Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.310Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.312Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.312Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.334Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.334Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.336Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.337Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.361Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.361Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.363Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.364Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.383Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.384Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.386Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.386Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.411Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.412Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.414Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.414Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.435Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.435Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.437Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.438Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.462Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.463Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.465Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.466Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.487Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.488Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.490Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.490Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.515Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.516Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.518Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.518Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.538Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.539Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.541Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.541Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.566Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.567Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.568Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.569Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.589Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.590Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.592Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.593Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.619Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.620Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.622Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.623Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.646Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.646Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.648Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.649Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.677Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.677Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.679Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.680Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.700Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.701Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.703Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.703Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.727Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.728Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.729Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.730Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.750Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.750Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.752Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.753Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.777Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.778Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.780Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.780Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.804Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [Animus] render ForceGraph3D
 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-27T23:32:34.804Z
 [Data debug] nodes: 213 links: 276
 [Data debug] ForceGraph3D component loaded: true
 [FILTERS] visibleIds: Set(213)
 [FILTERS] activeCategories: Set(6)
 [FILTERS] showSecrets: true
 [FILTERS] activeTags: undefined
 [FILTERS] Nodes passing filters: 213 / 213
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
 [FGAdapter] mounted
 [FGAdapter] ref type: {current: {…}}
 [FGAdapter] typeof ref: object
```
