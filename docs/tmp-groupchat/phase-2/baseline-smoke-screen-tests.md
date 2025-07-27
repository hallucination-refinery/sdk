# Baseline Smoke Screen Tests

Last Updated: 6:30 PM EST, 26/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 1e56e5db
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Changes: commit message -
  "feat: implement v5 plan to prevent ForceGraph3D remounts during timeline scrub

- Remove ALL visibility filtering from transformedData in CrypticVaultScene
- Add graphVersion state tracking in CrypticAnimusScene (useState, not useRef)
- Update ForceGraphAdapter dependencies to include both graphData and dataVersion
- Maintain correct visibility filtering through nodeVisibility prop
- Prevent unnecessary component remounts while preserving UX functionality

This addresses the core issue where timeline scrubbing caused ForceGraph3D to remount
due to dependency changes, while ensuring proper data version tracking for updates."

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

### Test 1: Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 1922ms”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copying the whole console log at that time
6. Clearly document a chronological account

### Test 1: Chronological Account

1. On initial load: the HUD is visible and the empty scene is visible. **Frame rate is around 60-80 FPS throughout the whole test**
2. Less than 1-2 secs later I see a small blue cube appear and disappear. The blue cube appears slightly off-center, a little down and to the left of viewport center. I experienced this as a brief flash.
3. Immidietely after, I see thin black lines (links) springing into the viewport. While it is hard to tell, I suspect they were emmenating outward from where the blue cube was (i.e the origin point)
4. A yellow node (with visible links) labeled "conflicts" hovers/slides gently into the viewport from the top-left.
5. As the yellow node settles/slows down, a green node (with visible links) labelled "reassurance" hovers/slides gently from the top-left. This green node is smaller than the yellow node, it appears to be in the distance to the top left of the yellow node.
6. Both the yellow "conflicts" node and the green "reassurance" node seem to settle in the top-left of the viewport for 1-2 secs.
7. Then, the physics seems to kick again as the yellow "conflicts" node and the green "reassurance" node are abruptly jolted downwards. Concurrently, a number of colored nodes (primarily purple and green) and links jolt/burst down from the top left into the viewport.
8. These nodes seem to slightly jiggle/jolt a few more times before finally settling down. They primarily occupy the left half of the viewport.
9. While it doesn't seem to impact what I see in the viewport. Next.js has thrown the following runtime error: `TypeError: Right-hand side of 'instanceof' is not an object
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:475:74)`
10. I also notice that the Next.js webpack is stale, unsure if this is particularly relevent though.

### Test 1: Full Console Log

```
Navigated to http://localhost:3000/
main-app.js?v=1753569700885:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:41:42.303Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:41:42.305Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:89 [GRAPH VERSION] Raw structure changed - incrementing version. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 0 visibleIds: 213
CrypticAnimusScene.tsx:194 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:226 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:41:42.320Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:41:42.321Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 213
CrypticAnimusScene.tsx:194 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:226 [Window FG] Ref not ready, will retry...
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:194 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:226 [Window FG] Ref not ready, will retry...
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:200 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:232 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:234 [Window FG] window.__FG assigned successfully
CrypticAnimusScene.tsx:251 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:259 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:266 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:282 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:286 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:289 [Debug] window.__FG type: object
CrypticAnimusScene.tsx:290 [Debug] window.__FG has graphData method: false
CrypticAnimusScene.tsx:224 [Violation] 'setTimeout' handler took 241ms
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 100ms ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 500ms ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has __kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has __kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:336 === PHASE 1: window.__FG Deep Inspection ===
CrypticAnimusScene.tsx:337 1. Basic info:
CrypticAnimusScene.tsx:338   Type: object
CrypticAnimusScene.tsx:339   Constructor: Object
CrypticAnimusScene.tsx:341 2. Direct properties:
CrypticAnimusScene.tsx:342   Object.keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:343   Object.getOwnPropertyNames: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:345 3. Prototype chain:
CrypticAnimusScene.tsx:349   Level 0: (12) ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']
CrypticAnimusScene.tsx:354 4. All enumerable properties:
CrypticAnimusScene.tsx:363 (index)keytypevalue(index)keytypevalue0'emitParticle''function''[Function]'1'getGraphBbox''function''[Function]'2'd3ReheatSimulation''function''[Function]'3'd3Force''function''[Function]'4'resetCountdown''function''[Function]'5'tickFrame''function''[Function]'6'refresh''function''[Function]'Array(7)
CrypticAnimusScene.tsx:365 5. Method availability:
CrypticAnimusScene.tsx:368   d3Force: function
CrypticAnimusScene.tsx:368   d3ReheatSimulation: function
CrypticAnimusScene.tsx:368   tickFrame: function
CrypticAnimusScene.tsx:368   emitParticle: function
CrypticAnimusScene.tsx:368   getGraphBbox: function
CrypticAnimusScene.tsx:368   resetCountdown: function
CrypticAnimusScene.tsx:368   refresh: function
CrypticAnimusScene.tsx:371 6. Hidden/private properties:
CrypticAnimusScene.tsx:375   _engine: undefined
CrypticAnimusScene.tsx:375   _state: undefined
CrypticAnimusScene.tsx:375   _simulation: undefined
CrypticAnimusScene.tsx:375   _graphForce: undefined
CrypticAnimusScene.tsx:375   __graphSimulation: undefined
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 1s ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 2s ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:492 === PHASE 2B: Accessing Simulation Data ===
CrypticAnimusScene.tsx:500 1. Testing graphData() method:
CrypticAnimusScene.tsx:503   graphData() returned: undefined
CrypticAnimusScene.tsx:504   Has nodes? false
CrypticAnimusScene.tsx:505   Node count: undefined
CrypticAnimusScene.tsx:521 2. Exploring THREE.js scene:
CrypticAnimusScene.tsx:524   FG is THREE.Object3D? undefined
CrypticAnimusScene.tsx:525   FG type: undefined
CrypticAnimusScene.tsx:526   Children count: undefined
CrypticAnimusScene.tsx:536 3. Testing getGraphBbox:
CrypticAnimusScene.tsx:539   Bounding box: {x: Array(2), y: Array(2), z: Array(2)}
CrypticAnimusScene.tsx:416 === PHASE 3: Force & Simulation Testing ===
CrypticAnimusScene.tsx:423 1. Testing d3Force method:
CrypticAnimusScene.tsx:425   d3Force type: function
CrypticAnimusScene.tsx:426   d3Force toString: function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return _call.apply(void 0, [method].concat(args));
        }
CrypticAnimusScene.tsx:428 2. Testing force retrieval:
CrypticAnimusScene.tsx:433   Force "link": ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:434     Type: function
CrypticAnimusScene.tsx:435     Has strength?: true
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:433   Force "charge": ƒ force(_) {
    var i,
        n = nodes.length,
        tree =
            (nDim === 1 ? (0,d3_binarytree__WEBPACK_IMPORTED_MODULE_1__["default"])(nodes, _simulation_js__WEBPACK_IMPORTED_MODULE_2__.x…
CrypticAnimusScene.tsx:434     Type: function
CrypticAnimusScene.tsx:435     Has strength?: true
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:433   Force "center": ƒ force() {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0,
        sz = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x || 0, sy += node.y || 0…
CrypticAnimusScene.tsx:434     Type: function
CrypticAnimusScene.tsx:435     Has strength?: true
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:433   Force "x": undefined
CrypticAnimusScene.tsx:434     Type: undefined
CrypticAnimusScene.tsx:435     Has strength?: false
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:433   Force "y": undefined
CrypticAnimusScene.tsx:434     Type: undefined
CrypticAnimusScene.tsx:435     Has strength?: false
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:433   Force "z": undefined
CrypticAnimusScene.tsx:434     Type: undefined
CrypticAnimusScene.tsx:435     Has strength?: false
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:433   Force "collide": undefined
CrypticAnimusScene.tsx:434     Type: undefined
CrypticAnimusScene.tsx:435     Has strength?: false
CrypticAnimusScene.tsx:436     Has alpha?: false
CrypticAnimusScene.tsx:442 3. Testing simulation control methods:
CrypticAnimusScene.tsx:444   d3ReheatSimulation result: ForceGraph {isObject3D: true, uuid: '652296a8-5df0-4947-af9a-6b9730e1d348', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:445   tickFrame result: ForceGraph {isObject3D: true, uuid: '652296a8-5df0-4947-af9a-6b9730e1d348', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:446   resetCountdown result: ForceGraph {isObject3D: true, uuid: '652296a8-5df0-4947-af9a-6b9730e1d348', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:451 4. Looking for simulation via d3Force:
CrypticAnimusScene.tsx:455   d3Force() no args: undefined
CrypticAnimusScene.tsx:456   Has .alpha()?: false
CrypticAnimusScene.tsx:457   Has .nodes()?: false
CrypticAnimusScene.tsx:463 5. Alternative access attempts:
CrypticAnimusScene.tsx:466 Uncaught TypeError: Right-hand side of 'instanceof' is not an object
    at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:466:62)
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:466
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:415
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:228
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:228
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:228
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:672
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
CrypticAnimusScene.tsx:572 === PHASE 4: Force Simulation Activation ===
CrypticAnimusScene.tsx:580 1. Adding positional forces to spread nodes:
CrypticAnimusScene.tsx:585   Cleared x,y forces
CrypticAnimusScene.tsx:588   Testing collision force...
CrypticAnimusScene.tsx:590   Current collide force: false
CrypticAnimusScene.tsx:596   Increased charge force strength to -800
CrypticAnimusScene.tsx:600 [REHEAT] After force modifications
CrypticAnimusScene.tsx:608   Forced 20 additional ticks
CrypticAnimusScene.tsx:614 2. Testing manual node spreading:
CrypticAnimusScene.tsx:658 3. Testing refresh method:
CrypticAnimusScene.tsx:661   Called refresh()
CrypticAnimusScene.tsx:571 [Violation] 'setTimeout' handler took 227ms
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 5s ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
```

## Test 2 - Hover on node & click + Scrub Timeline Scrubber + Toggle Categories + Toggle Lens Switcher

### Test 2: Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 2.7s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Click on browser window and move cursor into viewport
6. Hover over a single node & click (try to hover on only **one** node)
7. Mover cursor to timeline scrubber and slide (click + drag) to the earliest date (try not to hover over any nodes in the process)
8. Copying the whole console log
9. Clearly document a chronological account

### Test 2: Chronological Account

1. On initial load: the HUD is visible and the empty scene is visible. **Frame rate is around 60-80 FPS throughout the whole test** 2. Less than 1-2 secs later I see a small blue cube appear and disappear. The blue cube appears slightly off-center, a little down and to the left of viewport center. I experienced this as a brief flash. 3. Immidietely after, I see thin black lines (links) springing into the viewport. While it is hard to tell, I suspect they were emmenating outward from where the blue cube was (i.e the origin point) 4. A yellow node (with visible links) labeled "conflicts" hovers/slides gently into the viewport from the top-left. 5. As the yellow node settles/slows down, a green node (with visible links) labelled "reassurance" hovers/slides gently from the top-left. This green node is smaller than the yellow node, it appears to be in the distance to the top left of the yellow node. 6. Both the yellow "conflicts" node and the green "reassurance" node seem to settle in the top-left of the viewport for 1-2 secs. 7. Then, the physics seems to kick again as the yellow "conflicts" node and the green "reassurance" node are abruptly jolted downwards. Concurrently, a number of colored nodes (primarily purple and green) and links jolt/burst down from the top left into the viewport. 8. These nodes seem to slightly jiggle/jolt a few more times before finally settling down. They primarily occupy the left half of the viewport. 9. I click on the top of the browser window and then carefully move my cursor and hover over to a green node labeled "sense of correctness". I am **confident** I did not hover over any other nodes. As soon as I hover over that node the following logs fired:

`[Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:48:30.861Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:48:30.862Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object`

10. There was **no visible change** in the node I hovered over and **no movement** in any of the nodes.
11. Then, while **still hovering over the exact same green node**, I clicked it. The following logs fired:

`CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:50:41.030Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:50:41.031Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
`

12. Once again, there was **no visible change** in the node I hovered over and **no movement** in any of the nodes.
13. I then proceeded to move my cursor off the green node down to the Timeline Scrubber Slider. I am **confident** I did not hover over any nodes while doing this.
14. I clicked and dragged the slider to the earlies date. The log very clearly fired on each increment of the Timeline Scrubber:
    `[Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.262Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(206)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 206 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.263Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(206)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 206 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 206
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.293Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(202)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 202 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.294Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(202)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 202 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 202
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: c5c5cb290 type: value
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cfbf127ae type: outcome
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cf2bbf5ec type: catalyst
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cdf8bdcca type: catalyst
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cdd55b905 type: goal
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.335Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(195)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 195 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.336Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(195)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 195 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 195
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.362Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(179)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 179 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.363Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(179)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 179 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 179
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.389Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(151)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 151 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.390Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(151)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 151 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 151
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.423Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(116)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 116 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.424Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(116)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 116 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 116
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.448Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(113)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 113 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.449Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(113)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 113 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 113
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.524Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(104)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 104 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.524Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(104)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 104 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 104
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.553Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(87)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 87 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.553Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(87)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 87 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 87
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.576Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(54)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 54 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.576Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(54)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 54 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 54
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.593Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(42)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 42 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.594Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(42)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 42 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 42
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.614Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(19)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 19 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.615Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(19)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 19 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 19
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.646Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T22:51:26.647Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 4`

15. The **visibility seems to be toggling as intended**. I could see as nodes gradually disappeared as I incremented the slider. The physics also seems to **not have been triggered**, this is as intended.
16. I zoomed out and dragged/panned around and saw **3 visible nodes**, I was expecting 4 but may be mistaken. Overall the **timeline scrubber seems to be working as intended**.
17. I tried toggling a few categories and **category tags also seem to be toggling visibility and working as intended**. This is good.
18. I tried switching the lens switcher and it **does not seem to be working as intended**, the nodes do not move and the links don't seem to update.

### Test 2 Entire Console Log

``
Navigated to http://localhost:3000/
main-app.js?v=1753570908810:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticVaultScene.tsx:168 [SceneContent] Transforming full graph - NO filtering. Nodes: 213
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:01:50.230Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:01:50.231Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:89 [GRAPH VERSION] Raw structure changed - incrementing version. Nodes: 213 Links: 276
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 0 visibleIds: 213
CrypticAnimusScene.tsx:194 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:226 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:105 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:158 [INIT POSITIONS] Added initial positions to 213/213 nodes at origin (0,0,0) [spawn mode: origin]
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:01:50.266Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:01:50.266Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 213
CrypticAnimusScene.tsx:194 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:226 [Window FG] Ref not ready, will retry...
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:194 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:226 [Window FG] Ref not ready, will retry...
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:200 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:232 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:234 [Window FG] window.**FG assigned successfully
CrypticAnimusScene.tsx:251 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:259 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:266 [TICKS] Executed 20 ticks successfully (target: 20)
CrypticAnimusScene.tsx:282 [SIMULATION] Testing if forces are applied...
CrypticAnimusScene.tsx:286 [FORCES] link: true charge: true center: true
CrypticAnimusScene.tsx:289 [Debug] window.**FG type: object
CrypticAnimusScene.tsx:290 [Debug] window.**FG has graphData method: false
CrypticAnimusScene.tsx:224 [Violation] 'setTimeout' handler took 234ms
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 100ms ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
for (var k = 0, n = links.length; k < iterations; ++k) {
for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 500ms ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
for (var k = 0, n = links.length; k < iterations; ++k) {
for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has **kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has **kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:336 === PHASE 1: window.**FG Deep Inspection ===
CrypticAnimusScene.tsx:337 1. Basic info:
CrypticAnimusScene.tsx:338 Type: object
CrypticAnimusScene.tsx:339 Constructor: Object
CrypticAnimusScene.tsx:341 2. Direct properties:
CrypticAnimusScene.tsx:342 Object.keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:343 Object.getOwnPropertyNames: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:345 3. Prototype chain:
CrypticAnimusScene.tsx:349 Level 0: (12) ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']
CrypticAnimusScene.tsx:354 4. All enumerable properties:
CrypticAnimusScene.tsx:363 (index)keytypevalue(index)keytypevalue0'emitParticle''function''[Function]'1'getGraphBbox''function''[Function]'2'd3ReheatSimulation''function''[Function]'3'd3Force''function''[Function]'4'resetCountdown''function''[Function]'5'tickFrame''function''[Function]'6'refresh''function''[Function]'Array(7)
CrypticAnimusScene.tsx:365 5. Method availability:
CrypticAnimusScene.tsx:368 d3Force: function
CrypticAnimusScene.tsx:368 d3ReheatSimulation: function
CrypticAnimusScene.tsx:368 tickFrame: function
CrypticAnimusScene.tsx:368 emitParticle: function
CrypticAnimusScene.tsx:368 getGraphBbox: function
CrypticAnimusScene.tsx:368 resetCountdown: function
CrypticAnimusScene.tsx:368 refresh: function
CrypticAnimusScene.tsx:371 6. Hidden/private properties:
CrypticAnimusScene.tsx:375 _engine: undefined
CrypticAnimusScene.tsx:375 \_state: undefined
CrypticAnimusScene.tsx:375 \_simulation: undefined
CrypticAnimusScene.tsx:375 \_graphForce: undefined
CrypticAnimusScene.tsx:375 \_\_graphSimulation: undefined
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 1s ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
for (var k = 0, n = links.length; k < iterations; ++k) {
for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 2s ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
for (var k = 0, n = links.length; k < iterations; ++k) {
for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:492 === PHASE 2B: Accessing Simulation Data ===
CrypticAnimusScene.tsx:500 1. Testing graphData() method:
CrypticAnimusScene.tsx:503 graphData() returned: undefined
CrypticAnimusScene.tsx:504 Has nodes? false
CrypticAnimusScene.tsx:505 Node count: undefined
CrypticAnimusScene.tsx:521 2. Exploring THREE.js scene:
CrypticAnimusScene.tsx:524 FG is THREE.Object3D? undefined
CrypticAnimusScene.tsx:525 FG type: undefined
CrypticAnimusScene.tsx:526 Children count: undefined
CrypticAnimusScene.tsx:536 3. Testing getGraphBbox:
CrypticAnimusScene.tsx:539 Bounding box: {x: Array(2), y: Array(2), z: Array(2)}
CrypticAnimusScene.tsx:416 === PHASE 3: Force & Simulation Testing ===
CrypticAnimusScene.tsx:423 1. Testing d3Force method:
CrypticAnimusScene.tsx:425 d3Force type: function
CrypticAnimusScene.tsx:426 d3Force toString: function () {
for (var \_len2 = arguments.length, args = new Array(\_len2), \_key2 = 0; \_key2 < \_len2; \_key2++) {
args[_key2] = arguments[_key2];
}
return \_call.apply(void 0, [method].concat(args));
}
CrypticAnimusScene.tsx:428 2. Testing force retrieval:
CrypticAnimusScene.tsx:433 Force "link": ƒ force(alpha) {
for (var k = 0, n = links.length; k < iterations; ++k) {
for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
link = links[i], source = link…
CrypticAnimusScene.tsx:434 Type: function
CrypticAnimusScene.tsx:435 Has strength?: true
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:433 Force "charge": ƒ force(_) {
var i,
n = nodes.length,
tree =
(nDim === 1 ? (0,d3_binarytree**WEBPACK_IMPORTED_MODULE_1**["default"])(nodes, \_simulation_js**WEBPACK_IMPORTED_MODULE_2**.x…
CrypticAnimusScene.tsx:434 Type: function
CrypticAnimusScene.tsx:435 Has strength?: true
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:433 Force "center": ƒ force() {
var i,
n = nodes.length,
node,
sx = 0,
sy = 0,
sz = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x || 0, sy += node.y || 0…

CrypticAnimusScene.tsx:434 Type: function
CrypticAnimusScene.tsx:435 Has strength?: true
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:433 Force "x": undefined
CrypticAnimusScene.tsx:434 Type: undefined
CrypticAnimusScene.tsx:435 Has strength?: false
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:433 Force "y": undefined
CrypticAnimusScene.tsx:434 Type: undefined
CrypticAnimusScene.tsx:435 Has strength?: false
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:433 Force "z": undefined
CrypticAnimusScene.tsx:434 Type: undefined
CrypticAnimusScene.tsx:435 Has strength?: false
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:433 Force "collide": undefined
CrypticAnimusScene.tsx:434 Type: undefined
CrypticAnimusScene.tsx:435 Has strength?: false
CrypticAnimusScene.tsx:436 Has alpha?: false
CrypticAnimusScene.tsx:442 3. Testing simulation control methods:
CrypticAnimusScene.tsx:444 d3ReheatSimulation result: ForceGraph {isObject3D: true, uuid: '2101002f-ab43-4561-a652-e33d79542a61', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:445 tickFrame result: ForceGraph {isObject3D: true, uuid: '2101002f-ab43-4561-a652-e33d79542a61', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:446 resetCountdown result: ForceGraph {isObject3D: true, uuid: '2101002f-ab43-4561-a652-e33d79542a61', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:451 4. Looking for simulation via d3Force:
CrypticAnimusScene.tsx:455 d3Force() no args: undefined
CrypticAnimusScene.tsx:456 Has .alpha()?: false
CrypticAnimusScene.tsx:457 Has .nodes()?: false
CrypticAnimusScene.tsx:463 5. Alternative access attempts:
CrypticAnimusScene.tsx:466 Uncaught TypeError: Right-hand side of 'instanceof' is not an object
at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:466:62)
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:466
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:415
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:228
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:228
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:228
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:672
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
CrypticAnimusScene.tsx:572 === PHASE 4: Force Simulation Activation ===
CrypticAnimusScene.tsx:580 1. Adding positional forces to spread nodes:
CrypticAnimusScene.tsx:585 Cleared x,y forces
CrypticAnimusScene.tsx:588 Testing collision force...
CrypticAnimusScene.tsx:590 Current collide force: false
CrypticAnimusScene.tsx:596 Increased charge force strength to -800
CrypticAnimusScene.tsx:600 [REHEAT] After force modifications
CrypticAnimusScene.tsx:608 Forced 20 additional ticks
CrypticAnimusScene.tsx:614 2. Testing manual node spreading:
CrypticAnimusScene.tsx:658 3. Testing refresh method:
CrypticAnimusScene.tsx:661 Called refresh()
CrypticAnimusScene.tsx:571 [Violation] 'setTimeout' handler took 216ms
CrypticAnimusScene.tsx:390 === PHASE 2: Ref Evolution at 5s ===
CrypticAnimusScene.tsx:391 Direct keys count: 7
CrypticAnimusScene.tsx:392 Proto keys count: 0
CrypticAnimusScene.tsx:396 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:401 d3Force("link") returns: ƒ force(alpha) {
for (var k = 0, n = links.length; k < iterations; ++k) {
for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
link = links[i], source = link…
CrypticAnimusScene.tsx:402 Has .alpha() method? false
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:05.157Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:05.158Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:07.436Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:07.436Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.366Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(211)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 211 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.366Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(211)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 211 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 211
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.399Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(195)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 195 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.399Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(195)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 195 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 195
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: c5c5cb290 type: value
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cfbf127ae type: outcome
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cf2bbf5ec type: catalyst
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cdf8bdcca type: catalyst
CrypticAnimusScene.tsx:932 [VISIBILITY] Node blocked by filters: cdd55b905 type: goal
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.426Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(179)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 179 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.426Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(179)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 179 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 179
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.472Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(151)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 151 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.473Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(151)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 151 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 151
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.495Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(142)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 142 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.496Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(142)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 142 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 142
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.514Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(138)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 138 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.514Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(138)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 138 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 138
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.532Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(132)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 132 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.533Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(132)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 132 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 132
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.549Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(127)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 127 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.549Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(127)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 127 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 127
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.571Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(116)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 116 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.571Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(116)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 116 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 116
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.587Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(113)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 113 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.588Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(113)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 113 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 113
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.612Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(104)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 104 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.613Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(104)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 104 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 104
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.633Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(96)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 96 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.633Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(96)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 96 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 96
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.661Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(73)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 73 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.661Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(73)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 73 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 73
[Animus] render ForceGraph3D
[Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.684Z
[Data debug] nodes: 213 links: 276
[Data debug] ForceGraph3D component loaded: true
[FILTERS] visibleIds: Set(62)
[FILTERS] activeCategories: Set(6)
[FILTERS] showSecrets: true
[FILTERS] activeTags: undefined
[FILTERS] Nodes passing filters: 62 / 213
[Animus] render ForceGraph3D
[Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.685Z
[Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(62)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 62 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 62
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.709Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(54)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 54 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.710Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(54)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 54 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 54
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.724Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(51)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 51 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.724Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(51)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 51 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 51
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.743Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(42)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 42 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.744Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(42)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 42 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 42
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.762Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(38)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 38 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.762Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(38)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 38 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 38
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.783Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(30)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 30 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.784Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(30)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 30 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 30
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.805Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(23)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 23 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.806Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(23)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 23 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 23
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.822Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(19)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 19 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.823Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(19)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 19 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 19
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.847Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(7)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 7 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.848Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(7)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 7 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 7
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.861Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:13.862Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:97 [REMOUNT CHECK] graphVersion: 1 visibleIds: 4
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:31.339Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(5)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 3 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:31.340Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(5)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 3 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:32.348Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(4)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 2 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:32.349Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(4)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 2 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:35.498Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(5)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 3 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:35.498Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(5)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 3 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:37.256Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:37.257Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:41.456Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:41.457Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:46.081Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:46.082Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:48.181Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
CrypticAnimusScene.tsx:175 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:178 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-26T23:02:48.182Z
CrypticAnimusScene.tsx:181 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:182 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:185 [FILTERS] visibleIds: Set(4)
CrypticAnimusScene.tsx:186 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:187 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:188 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:903 [FILTERS] Nodes passing filters: 4 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
``
