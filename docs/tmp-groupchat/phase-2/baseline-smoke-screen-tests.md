# Baseline Smoke Screen Tests

Last Updated: 11:00 AM EST, 25/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 8ae1cfb3
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Commit Message - "fix: move nodePassesFilters usage after declaration to fix TDZ error"

## Clarification on Intended Behavior (User Experience Perspective)

I have decided to clearly and concisely describe the intended behavior **from a user experience perspective.** Please carefully update your mental model before you continue to Test 1 and Test 2:

1. On initial load: The HUD UI appears and all nodes start ​co-located at the scene origin, then “burst” outward as the physics engine warms up. They drift until the layout stabilises; after this first settle the graph should not spontaneously explode again unless the user performs an action that explicitly re-heats the simulation (see #6).
2. On Hover: As the cursor passes over a node its visual state changes (e.g. glow, opacity, tooltip) to indicate focus; neighbouring links may be subtly emphasised. No new physics burst is triggered. Positions remain stable; only visual styles update. When the cursor leaves, styles revert.
3. Node Click / Selection: Clicking a node toggles it into a “selected” state:
   3.1 The node and all directly-connected edges highlight.
   3.2 A two-hop outline or context halo may appear to show related nodes.
   3.3 Clicking a different node transfers the highlight; clicking empty space clears it.
   3.4 Physics stays calm—the graph should not re-explode or significantly re-shuffle as a result of selection.
4. Timeline Scrubbing: Moving the time-slider hides or reveals nodes/links according to their timestamp.
   4.1 Visible items fade in/out smoothly; existing node positions are preserved where possible.
   4.2 No central burst or full simulation restart occurs during normal scrubbing.
5. Category / Filter Toggles: Toggling category check-boxes (or tag filters) shows/hides subsets of nodes.
   5.1 The remaining nodes maintain their current positions; hidden nodes are simply removed from rendering.
   5.2 Again, no physics reset or burst from centre is expected.
6. Lens Change (Causal ▸ Affinity ▸ Temporal): Switching the active “lens” swaps in an entirely different edge set and possibly node subset.
   6.1 A fresh physics run is intentional here: nodes collapse to the centre and burst outward to re-settle under the new force configuration.
   6.2 After this single, deliberate re-explosion the graph behaves as in cases #2-#5 until the user switches lenses again.

## Test 1 - Do Nothing

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 13.6 s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copying the whole console log at that time
6. Clearly document observations

### Observation (Chronological)

1. On initial load: the HUD is visible and the screen shows evenly spaced, colored nodes connected by faint gray links—**no dense central clump.**
2. However, the force-graph physics never seems to “kicks in”: the nodes appear already positioned and remain static instead of briefly scattering outward before settling.
3. The console log seems to be firing regularly from the initial load and never stops.

### Console Log

```
Navigated to http://localhost:3000/
main-app.js?v=1753455433990:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T14:57:15.858Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T14:57:15.872Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 83ms
CrypticAnimusScene.tsx:156 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:188 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:190 [Window FG] window.__FG assigned successfully
CrypticAnimusScene.tsx:195 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:202 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:209 [TICKS] Executed 300 ticks successfully (target: 300)
CrypticAnimusScene.tsx:212 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:216 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:219 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:220 [Debug] window.__FG has graphData method: false
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 100ms ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 500ms ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:266 === PHASE 1: window.__FG Deep Inspection ===
CrypticAnimusScene.tsx:267 1. Basic info:
CrypticAnimusScene.tsx:268   Type: object
CrypticAnimusScene.tsx:269   Constructor: Object
CrypticAnimusScene.tsx:271 2. Direct properties:
CrypticAnimusScene.tsx:272   Object.keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:273   Object.getOwnPropertyNames: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:275 3. Prototype chain:
CrypticAnimusScene.tsx:279   Level 0: (12) ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']
CrypticAnimusScene.tsx:284 4. All enumerable properties:
CrypticAnimusScene.tsx:293 (index)keytypevalue(index)keytypevalue0'emitParticle''function''[Function]'1'getGraphBbox''function''[Function]'2'd3ReheatSimulation''function''[Function]'3'd3Force''function''[Function]'4'resetCountdown''function''[Function]'5'tickFrame''function''[Function]'6'refresh''function''[Function]'Array(7)
CrypticAnimusScene.tsx:295 5. Method availability:
CrypticAnimusScene.tsx:298   d3Force: function
CrypticAnimusScene.tsx:298   d3ReheatSimulation: function
CrypticAnimusScene.tsx:298   tickFrame: function
CrypticAnimusScene.tsx:298   emitParticle: function
CrypticAnimusScene.tsx:298   getGraphBbox: function
CrypticAnimusScene.tsx:298   resetCountdown: function
CrypticAnimusScene.tsx:298   refresh: function
CrypticAnimusScene.tsx:301 6. Hidden/private properties:
CrypticAnimusScene.tsx:305   _engine: undefined
CrypticAnimusScene.tsx:305   _state: undefined
CrypticAnimusScene.tsx:305   _simulation: undefined
CrypticAnimusScene.tsx:305   _graphForce: undefined
CrypticAnimusScene.tsx:305   __graphSimulation: undefined
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 1s ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 2s ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:422 === PHASE 2B: Accessing Simulation Data ===
CrypticAnimusScene.tsx:430 1. Testing graphData() method:
CrypticAnimusScene.tsx:433   graphData() returned: undefined
CrypticAnimusScene.tsx:434   Has nodes? false
CrypticAnimusScene.tsx:435   Node count: undefined
CrypticAnimusScene.tsx:451 2. Exploring THREE.js scene:
CrypticAnimusScene.tsx:454   FG is THREE.Object3D? undefined
CrypticAnimusScene.tsx:455   FG type: undefined
CrypticAnimusScene.tsx:456   Children count: undefined
CrypticAnimusScene.tsx:466 3. Testing getGraphBbox:
CrypticAnimusScene.tsx:469   Bounding box: {x: Array(2), y: Array(2), z: Array(2)}
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:346 === PHASE 3: Force & Simulation Testing ===
CrypticAnimusScene.tsx:353 1. Testing d3Force method:
CrypticAnimusScene.tsx:355   d3Force type: function
CrypticAnimusScene.tsx:356   d3Force toString: function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return _call.apply(void 0, [method].concat(args));
        }
CrypticAnimusScene.tsx:358 2. Testing force retrieval:
CrypticAnimusScene.tsx:363   Force "link": ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:364     Type: function
CrypticAnimusScene.tsx:365     Has strength?: true
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "charge": ƒ force(_) {
    var i,
        n = nodes.length,
        tree =
            (nDim === 1 ? (0,d3_binarytree__WEBPACK_IMPORTED_MODULE_1__["default"])(nodes, _simulation_js__WEBPACK_IMPORTED_MODULE_2__.x…
CrypticAnimusScene.tsx:364     Type: function
CrypticAnimusScene.tsx:365     Has strength?: true
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "center": ƒ force() {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0,
        sz = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x || 0, sy += node.y || 0…
CrypticAnimusScene.tsx:364     Type: function
CrypticAnimusScene.tsx:365     Has strength?: true
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "x": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "y": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "z": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "collide": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:372 3. Testing simulation control methods:
CrypticAnimusScene.tsx:374   d3ReheatSimulation result: ForceGraph {isObject3D: true, uuid: '5034c792-0db5-47e1-a6ca-5a00100e08e9', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:375   tickFrame result: ForceGraph {isObject3D: true, uuid: '5034c792-0db5-47e1-a6ca-5a00100e08e9', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:376   resetCountdown result: ForceGraph {isObject3D: true, uuid: '5034c792-0db5-47e1-a6ca-5a00100e08e9', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:381 4. Looking for simulation via d3Force:
CrypticAnimusScene.tsx:385   d3Force() no args: undefined
CrypticAnimusScene.tsx:386   Has .alpha()?: false
CrypticAnimusScene.tsx:387   Has .nodes()?: false
CrypticAnimusScene.tsx:393 5. Alternative access attempts:
CrypticAnimusScene.tsx:396 Uncaught TypeError: Right-hand side of 'instanceof' is not an object
    at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:396:62)
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:396
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:345
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:676
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
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:502 === PHASE 4: Force Simulation Activation ===
CrypticAnimusScene.tsx:510 1. Adding positional forces to spread nodes:
CrypticAnimusScene.tsx:515   Cleared x,y forces
CrypticAnimusScene.tsx:518   Testing collision force...
CrypticAnimusScene.tsx:520   Current collide force: false
CrypticAnimusScene.tsx:526   Increased charge force strength to -800
CrypticAnimusScene.tsx:530 [REHEAT] After force modifications
CrypticAnimusScene.tsx:537   Forced 200 additional ticks
CrypticAnimusScene.tsx:543 2. Testing manual node spreading:
CrypticAnimusScene.tsx:586 3. Testing refresh method:
CrypticAnimusScene.tsx:589   Called refresh()
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 5s ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:596 [Violation] 'setInterval' handler took 73ms
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:596 [Violation] 'setInterval' handler took 55ms
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
```

## Test 2 - Hover & Click on Node + Scrub Timeline

### Process

1. Kill the Test 1 dev server ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 2.7 s”.
3. Incognito tab ➜ empty cache and hard reload `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Click on browser window and move cursor into viewport, hovering over a node & clicking it once
6. Move cursor to timeline scrubber and slide it to the earliest data
7. Copying the whole console log at that time
8. Clearly document observations

### Observation (Chronological)

1. On initial load: the HUD is visible and the screen shows evenly spaced, colored nodes connected by faint gray links—**no dense central clump.**
2. However, the force-graph physics never seems to “kicks in”: the nodes appear already positioned and remain static instead of briefly scattering outward before settling.
3. The console log seems to be firing regularly from the initial load and doesn't stops.
4. I did my best to move my cursor into the viewport, hover and click **only on a yellow node labeled "uncertainty"**. It was difficult to cross-reference these actions with the console log. I am also unsure if I accidentally hovered over any other nodes.
5. The nodes remained in **exactly the same evenly spaced position** as before. When I clicked on the node, the expected behavior-where the selected node turns orange with the relevant links (edges) and nodes highlighting **did not happen**
6. I proceeded to move my cursor down to the timeline scrubber in the bottom of the viewport, I am uncertain if I hovered over any other nodes on the way there.
7. I then clicked on the timeline scrubber and scrubbed it to the earliest date. The visibility filtering of the nodes seemed to work as intended.

### Console Log

```
Navigated to http://localhost:3000/
main-app.js?v=1753456436605:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:13:58.302Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:13:58.304Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:150 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:182 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:156 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:188 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:190 [Window FG] window.__FG assigned successfully
CrypticAnimusScene.tsx:195 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:202 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:209 [TICKS] Executed 300 ticks successfully (target: 300)
CrypticAnimusScene.tsx:212 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:216 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:219 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:220 [Debug] window.__FG has graphData method: false
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 85ms
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 100ms ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 500ms ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:266 === PHASE 1: window.__FG Deep Inspection ===
CrypticAnimusScene.tsx:267 1. Basic info:
CrypticAnimusScene.tsx:268   Type: object
CrypticAnimusScene.tsx:269   Constructor: Object
CrypticAnimusScene.tsx:271 2. Direct properties:
CrypticAnimusScene.tsx:272   Object.keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:273   Object.getOwnPropertyNames: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:275 3. Prototype chain:
CrypticAnimusScene.tsx:279   Level 0: (12) ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']
CrypticAnimusScene.tsx:284 4. All enumerable properties:
CrypticAnimusScene.tsx:293 (index)keytypevalue(index)keytypevalue0'emitParticle''function''[Function]'1'getGraphBbox''function''[Function]'2'd3ReheatSimulation''function''[Function]'3'd3Force''function''[Function]'4'resetCountdown''function''[Function]'5'tickFrame''function''[Function]'6'refresh''function''[Function]'Array(7)
CrypticAnimusScene.tsx:295 5. Method availability:
CrypticAnimusScene.tsx:298   d3Force: function
CrypticAnimusScene.tsx:298   d3ReheatSimulation: function
CrypticAnimusScene.tsx:298   tickFrame: function
CrypticAnimusScene.tsx:298   emitParticle: function
CrypticAnimusScene.tsx:298   getGraphBbox: function
CrypticAnimusScene.tsx:298   resetCountdown: function
CrypticAnimusScene.tsx:298   refresh: function
CrypticAnimusScene.tsx:301 6. Hidden/private properties:
CrypticAnimusScene.tsx:305   _engine: undefined
CrypticAnimusScene.tsx:305   _state: undefined
CrypticAnimusScene.tsx:305   _simulation: undefined
CrypticAnimusScene.tsx:305   _graphForce: undefined
CrypticAnimusScene.tsx:305   __graphSimulation: undefined
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 1s ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 2s ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:422 === PHASE 2B: Accessing Simulation Data ===
CrypticAnimusScene.tsx:430 1. Testing graphData() method:
CrypticAnimusScene.tsx:433   graphData() returned: undefined
CrypticAnimusScene.tsx:434   Has nodes? false
CrypticAnimusScene.tsx:435   Node count: undefined
CrypticAnimusScene.tsx:451 2. Exploring THREE.js scene:
CrypticAnimusScene.tsx:454   FG is THREE.Object3D? undefined
CrypticAnimusScene.tsx:455   FG type: undefined
CrypticAnimusScene.tsx:456   Children count: undefined
CrypticAnimusScene.tsx:466 3. Testing getGraphBbox:
CrypticAnimusScene.tsx:469   Bounding box: {x: Array(2), y: Array(2), z: Array(2)}
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:346 === PHASE 3: Force & Simulation Testing ===
CrypticAnimusScene.tsx:353 1. Testing d3Force method:
CrypticAnimusScene.tsx:355   d3Force type: function
CrypticAnimusScene.tsx:356   d3Force toString: function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return _call.apply(void 0, [method].concat(args));
        }
CrypticAnimusScene.tsx:358 2. Testing force retrieval:
CrypticAnimusScene.tsx:363   Force "link": ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:364     Type: function
CrypticAnimusScene.tsx:365     Has strength?: true
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "charge": ƒ force(_) {
    var i,
        n = nodes.length,
        tree =
            (nDim === 1 ? (0,d3_binarytree__WEBPACK_IMPORTED_MODULE_1__["default"])(nodes, _simulation_js__WEBPACK_IMPORTED_MODULE_2__.x…
CrypticAnimusScene.tsx:364     Type: function
CrypticAnimusScene.tsx:365     Has strength?: true
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "center": ƒ force() {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0,
        sz = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x || 0, sy += node.y || 0…
CrypticAnimusScene.tsx:364     Type: function
CrypticAnimusScene.tsx:365     Has strength?: true
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "x": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "y": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "z": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:363   Force "collide": undefined
CrypticAnimusScene.tsx:364     Type: undefined
CrypticAnimusScene.tsx:365     Has strength?: false
CrypticAnimusScene.tsx:366     Has alpha?: false
CrypticAnimusScene.tsx:372 3. Testing simulation control methods:
CrypticAnimusScene.tsx:374   d3ReheatSimulation result: ForceGraph {isObject3D: true, uuid: '44ab5c40-5874-4716-91a5-19bf6c143e9f', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:375   tickFrame result: ForceGraph {isObject3D: true, uuid: '44ab5c40-5874-4716-91a5-19bf6c143e9f', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:376   resetCountdown result: ForceGraph {isObject3D: true, uuid: '44ab5c40-5874-4716-91a5-19bf6c143e9f', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:381 4. Looking for simulation via d3Force:
CrypticAnimusScene.tsx:385   d3Force() no args: undefined
CrypticAnimusScene.tsx:386   Has .alpha()?: false
CrypticAnimusScene.tsx:387   Has .nodes()?: false
CrypticAnimusScene.tsx:393 5. Alternative access attempts:
CrypticAnimusScene.tsx:396 Uncaught TypeError: Right-hand side of 'instanceof' is not an object
    at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:396:62)
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:396
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:345
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:184
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:676
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
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:04.298Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:04.299Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:502 === PHASE 4: Force Simulation Activation ===
CrypticAnimusScene.tsx:510 1. Adding positional forces to spread nodes:
CrypticAnimusScene.tsx:515   Cleared x,y forces
CrypticAnimusScene.tsx:518   Testing collision force...
CrypticAnimusScene.tsx:520   Current collide force: false
CrypticAnimusScene.tsx:526   Increased charge force strength to -800
CrypticAnimusScene.tsx:530 [REHEAT] After force modifications
CrypticAnimusScene.tsx:537   Forced 200 additional ticks
CrypticAnimusScene.tsx:543 2. Testing manual node spreading:
CrypticAnimusScene.tsx:586 3. Testing refresh method:
CrypticAnimusScene.tsx:589   Called refresh()
CrypticAnimusScene.tsx:320 === PHASE 2: Ref Evolution at 5s ===
CrypticAnimusScene.tsx:321 Direct keys count: 7
CrypticAnimusScene.tsx:322 Proto keys count: 0
CrypticAnimusScene.tsx:326 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:331 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:332 Has .alpha() method? false
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:05.857Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:05.857Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:08.687Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:08.688Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 211/211 nodes in sphere pattern (radius: 298)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 211/211 nodes in sphere pattern (radius: 298)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.555Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 211 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(211)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 211 / 211
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.555Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 211 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(211)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 211 / 211
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 202/202 nodes in sphere pattern (radius: 293)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 202/202 nodes in sphere pattern (radius: 293)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.572Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 202 links: 260
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(202)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 202 / 202
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.572Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 202 links: 260
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(202)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 202 / 202
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 179/179 nodes in sphere pattern (radius: 282)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 179/179 nodes in sphere pattern (radius: 282)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.622Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 179 links: 216
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(179)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 179 / 179
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.622Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 179 links: 216
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(179)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 179 / 179
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 176/176 nodes in sphere pattern (radius: 280)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 176/176 nodes in sphere pattern (radius: 280)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.652Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 176 links: 210
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(176)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 176 / 176
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.653Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 176 links: 210
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(176)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 176 / 176
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 171/171 nodes in sphere pattern (radius: 278)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 171/171 nodes in sphere pattern (radius: 278)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.725Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 171 links: 202
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(171)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 171 / 171
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.726Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 171 links: 202
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(171)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 171 / 171
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 164/164 nodes in sphere pattern (radius: 274)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 164/164 nodes in sphere pattern (radius: 274)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.736Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 164 links: 193
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(164)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 164 / 164
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.737Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 164 links: 193
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(164)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 164 / 164
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 151/151 nodes in sphere pattern (radius: 266)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 151/151 nodes in sphere pattern (radius: 266)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.771Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 151 links: 174
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(151)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 151 / 151
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.772Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 151 links: 174
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(151)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 151 / 151
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 142/142 nodes in sphere pattern (radius: 261)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 142/142 nodes in sphere pattern (radius: 261)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.796Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 142 links: 164
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(142)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 142 / 142
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.796Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 142 links: 164
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(142)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 142 / 142
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 132/132 nodes in sphere pattern (radius: 255)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 132/132 nodes in sphere pattern (radius: 255)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.811Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 132 links: 140
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(132)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 132 / 132
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.812Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 132 links: 140
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(132)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 132 / 132
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 127/127 nodes in sphere pattern (radius: 251)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 127/127 nodes in sphere pattern (radius: 251)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.837Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 127 links: 137
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(127)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 127 / 127
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:13.838Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 127 links: 137
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(127)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 127 / 127
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 119/119 nodes in sphere pattern (radius: 246)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 119/119 nodes in sphere pattern (radius: 246)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.011Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 119 links: 130
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(119)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 119 / 119
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.012Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 119 links: 130
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(119)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 119 / 119
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 116/116 nodes in sphere pattern (radius: 244)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 116/116 nodes in sphere pattern (radius: 244)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.092Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 116 links: 127
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(116)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 116 / 116
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.093Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 116 links: 127
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(116)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 116 / 116
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 108/108 nodes in sphere pattern (radius: 238)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 108/108 nodes in sphere pattern (radius: 238)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.121Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 108 links: 113
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(108)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 108 / 108
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.121Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 108 links: 113
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(108)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 108 / 108
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 101/101 nodes in sphere pattern (radius: 233)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 101/101 nodes in sphere pattern (radius: 233)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.145Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 101 links: 99
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(101)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 101 / 101
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.146Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 101 links: 99
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(101)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 101 / 101
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 96/96 nodes in sphere pattern (radius: 229)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 96/96 nodes in sphere pattern (radius: 229)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.169Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 96 links: 90
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(96)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 96 / 96
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.170Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 96 links: 90
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(96)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 96 / 96
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 92/92 nodes in sphere pattern (radius: 226)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 92/92 nodes in sphere pattern (radius: 226)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.210Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 92 links: 88
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(92)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 92 / 92
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.211Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 92 links: 88
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(92)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 92 / 92
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 87/87 nodes in sphere pattern (radius: 222)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 87/87 nodes in sphere pattern (radius: 222)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.359Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 87 links: 85
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(87)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 87 / 87
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.360Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 87 links: 85
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(87)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 87 / 87
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 81/81 nodes in sphere pattern (radius: 216)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 81/81 nodes in sphere pattern (radius: 216)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.385Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 81 links: 75
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(81)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 81 / 81
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.385Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 81 links: 75
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(81)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 81 / 81
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 73/73 nodes in sphere pattern (radius: 209)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 73/73 nodes in sphere pattern (radius: 209)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.406Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 73 links: 57
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(73)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 73 / 73
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.406Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 73 links: 57
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(73)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 73 / 73
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 70/70 nodes in sphere pattern (radius: 206)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 70/70 nodes in sphere pattern (radius: 206)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.424Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 70 links: 54
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(70)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 70 / 70
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.425Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 70 links: 54
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(70)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 70 / 70
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 66/66 nodes in sphere pattern (radius: 202)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 66/66 nodes in sphere pattern (radius: 202)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.475Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 66 links: 53
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(66)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 66 / 66
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.475Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 66 links: 53
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(66)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 66 / 66
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 62/62 nodes in sphere pattern (radius: 198)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 62/62 nodes in sphere pattern (radius: 198)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.568Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 62 links: 52
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(62)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 62 / 62
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.568Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 62 links: 52
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(62)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 62 / 62
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 58/58 nodes in sphere pattern (radius: 194)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 58/58 nodes in sphere pattern (radius: 194)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.587Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 58 links: 47
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(58)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 58 / 58
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.587Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 58 links: 47
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(58)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 58 / 58
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 54/54 nodes in sphere pattern (radius: 189)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 54/54 nodes in sphere pattern (radius: 189)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.603Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 54 links: 38
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(54)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 54 / 54
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.604Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 54 links: 38
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(54)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 54 / 54
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 51/51 nodes in sphere pattern (radius: 185)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 51/51 nodes in sphere pattern (radius: 185)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.618Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 51 links: 37
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(51)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 51 / 51
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.618Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 51 links: 37
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(51)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 51 / 51
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 47/47 nodes in sphere pattern (radius: 180)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 47/47 nodes in sphere pattern (radius: 180)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.635Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 47 links: 31
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(47)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 47 / 47
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.635Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 47 links: 31
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(47)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 47 / 47
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 42/42 nodes in sphere pattern (radius: 174)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 42/42 nodes in sphere pattern (radius: 174)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.667Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 42 links: 25
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(42)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 42 / 42
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.668Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 42 links: 25
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(42)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 42 / 42
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 38/38 nodes in sphere pattern (radius: 168)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 38/38 nodes in sphere pattern (radius: 168)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.793Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 38 links: 23
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(38)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 38 / 38
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.793Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 38 links: 23
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(38)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 38 / 38
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 33/33 nodes in sphere pattern (radius: 160)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 33/33 nodes in sphere pattern (radius: 160)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.816Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 33 links: 16
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(33)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 33 / 33
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.817Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 33 links: 16
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(33)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 33 / 33
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 30/30 nodes in sphere pattern (radius: 155)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 30/30 nodes in sphere pattern (radius: 155)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.841Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 30 links: 14
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(30)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 30 / 30
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.842Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 30 links: 14
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(30)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 30 / 30
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 27/27 nodes in sphere pattern (radius: 150)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 27/27 nodes in sphere pattern (radius: 150)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.867Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 27 links: 13
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(27)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 27 / 27
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.868Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 27 links: 13
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(27)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 27 / 27
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 23/23 nodes in sphere pattern (radius: 142)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 23/23 nodes in sphere pattern (radius: 142)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.984Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 23 links: 12
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(23)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 23 / 23
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:14.984Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 23 links: 12
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(23)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 23 / 23
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 19/19 nodes in sphere pattern (radius: 133)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 19/19 nodes in sphere pattern (radius: 133)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.016Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 19 links: 8
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(19)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 19 / 19
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.017Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 19 links: 8
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(19)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 19 / 19
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 15/15 nodes in sphere pattern (radius: 123)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 15/15 nodes in sphere pattern (radius: 123)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.041Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 15 links: 5
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(15)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 15 / 15
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.042Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 15 links: 5
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(15)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 15 / 15
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 12/12 nodes in sphere pattern (radius: 114)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 12/12 nodes in sphere pattern (radius: 114)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.058Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 12 links: 4
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(12)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 12 / 12
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.059Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 12 links: 4
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(12)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 12 / 12
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 7/7 nodes in sphere pattern (radius: 96)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 7/7 nodes in sphere pattern (radius: 96)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.100Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 7 links: 2
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(7)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 7 / 7
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.101Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 7 links: 2
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(7)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 7 / 7
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 4/4 nodes in sphere pattern (radius: 79)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 4/4 nodes in sphere pattern (radius: 79)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.192Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 4 links: 0
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 4 / 4
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:15.193Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 4 links: 0
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 4 / 4
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:21.209Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 4 links: 0
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 4 / 4
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T15:14:21.210Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 4 links: 0
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:906 [FILTERS] Nodes passing filters: 4 / 4
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
CrypticAnimusScene.tsx:603 [REHEAT] Periodic d3ReheatSimulation
CrypticAnimusScene.tsx:612 [TICKS] Periodic: 100 ticks (target: 100)
CrypticAnimusScene.tsx:616 [Diag] Periodic reheat completed
```
