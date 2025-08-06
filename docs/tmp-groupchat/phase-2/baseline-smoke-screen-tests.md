# Baseline Smoke Screen Tests

Last Updated: 12:05 PM EST, 06/08/2025

## Context

- Branch: `repro-fg-remount`
- Commit: 6f45dd80
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Purpose: Locate and stub all render-phase state writes or prop churn that remount ForceGraphAdapter

## General Observations

_Not_ part of any smoke-screen test and unverifiable against console logs, these are the key observations:

1. All nodes and links _are visible_ if you zoom out and/or panning.
2. Timeline scrubber and category filters toggle visibility correctly. **However this now seems to trigger a console log spam**.
3. Switching lenses _does nothing_—graph stays static; physics never re-runs. **This also seems to trigger a console log spam**
4. Hovering or clicking a node produces _no visual change_. **While hovering does not, clicking does trigger the console log spam**.

## Test 1 - Do Nothing

### Test 1: Process

1. CD @ workplace root ➜ `rm -rf .next node_modules/.cache`
2. `NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1910ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copying the whole console log at that time
6. Clearly document a chronological account

### Test 1: Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a yellow and green node, labeled "conflict" and "reassurance" respectively, drift into frame and settle down.
2. The scene is running at **~71 FPS** counter top-left, and the HUD.

### Test 1: Full Console Log

```
Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
OrbitControls.js:311 [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
OrbitControls.connect @ OrbitControls.js:311
eval @ OrbitControls.js:45
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
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
OrbitControls.js:311 [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
OrbitControls.connect @ OrbitControls.js:311
eval @ OrbitControls.js:45
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
commitPassiveMountOnFiber @ react-reconciler.development.js:5623
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
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
commitRootImpl @ react-reconciler.development.js:6522
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performSyncWorkOnRoot @ react-reconciler.development.js:1364
flushSyncWorkAcrossRoots_impl @ react-reconciler.development.js:1288
commitRootImpl @ react-reconciler.development.js:6525
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performWorkOnRootViaSchedulerTask @ react-reconciler.development.js:1356
performWorkUntilDeadline @ scheduler.development.js:44
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.__FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.__FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:289 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:302 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:328 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:331 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:335 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:338 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:339 [Debug] window.__FG has graphData method: false
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 231ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 61ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 67ms
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 59ms
```

## Test 2 - Hover & Click on Node

### Test 2: Process

1. CD @ workplace root ➜ `rm -rf .next node_modules/.cache`
2. `NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1910ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Move cursor into frame and then hover on/off one and then click
6. Copying a **representative console log excerpt** at that time
7. Clearly document a chronological account

### Test 2: Chronological Account

1. On initial load: the HUD is visible, then, maybe 0.05 secs later (it's hard to say precisely), I see a yellow and green node, labeled "conflict" and "reassurance" respectively, drift into frame and settle down.
2. The scene is running at **~73 FPS** counter top-left, and the HUD.
3. I moved my cursor into the viewport and hovered on/off only the yellow node labelled "conflicts" quickly, **the console log did not fire**
4. I clicked on the node and the console log began to spam begining with: `[FGAdapter] mounted`

### Test 2: Console Log Excerpt

`Navigated to http://localhost:3000/
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - updating ref. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphDataRef updated, visibleIds: 213
CrypticAnimusScene.tsx:204 [Physics config] Retry 1...
CrypticAnimusScene.tsx:245 [Window FG] Retry 1...
OrbitControls.js:311 [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
OrbitControls.connect @ OrbitControls.js:311
eval @ OrbitControls.js:45
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
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
OrbitControls.js:311 [Violation] Added non-passive event listener to a scroll-blocking 'wheel' event. Consider marking event handler as 'passive' to make the page more responsive. See https://www.chromestatus.com/feature/5745543795965952
OrbitControls.connect @ OrbitControls.js:311
eval @ OrbitControls.js:45
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
commitPassiveMountOnFiber @ react-reconciler.development.js:5623
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
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
commitRootImpl @ react-reconciler.development.js:6522
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performSyncWorkOnRoot @ react-reconciler.development.js:1364
flushSyncWorkAcrossRoots_impl @ react-reconciler.development.js:1288
commitRootImpl @ react-reconciler.development.js:6525
commitRoot @ react-reconciler.development.js:6480
commitRootWhenReady @ react-reconciler.development.js:6082
performWorkOnRoot @ react-reconciler.development.js:6062
performWorkOnRootViaSchedulerTask @ react-reconciler.development.js:1356
performWorkUntilDeadline @ scheduler.development.js:44
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:129 [ForceGraphAdapter] Creating safe data for version: 0
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.**FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.**FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
ForceGraphAdapter.tsx:142 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:144 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:145 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] Assigning window.**FG = ref.current
ForceGraphAdapter.tsx:148 [FGAdapter] window.**FG assigned successfully
ForceGraphAdapter.tsx:149 [CLAUDE] ready-for-smoke-screen
ForceGraphAdapter.tsx:162 [FGAdapter] Data changed, calling refresh() {nodeCount: 213, linkCount: 276}
ForceGraphAdapter.tsx:171 [FGAdapter] Called ref.current.refresh() successfully
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:289 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:302 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:328 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:331 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:335 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:338 [Debug] window.**FG type: object
CrypticAnimusScene.tsx:339 [Debug] window.**FG has graphData method: false
CrypticAnimusScene.tsx:237 [Violation] 'setTimeout' handler took 241ms
[FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
``
