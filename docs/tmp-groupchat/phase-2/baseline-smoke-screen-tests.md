# Baseline Smoke Screen Tests

Last Updated: 11:50 PM EST, 24/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 7ede76af
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Added execution instructions

## Test 1 - Do Nothing

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 5 s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Copy Console Log below.
6. Write down observations.

### Observation (Chronological)

1. On initial load: A dense cluster of large, differently-coloured circles fills the entire viewport, touching and heavily overlapping but **not** sharing a single exact centre point.
2. Bold node labels stack over one another in various positions within the cluster, creating an unreadable mosaic of black text.
3. A mesh of grey link lines criss-crosses the overlapped discs, leaving no clear gaps between individual nodes.
4. The console log seems to firing regularly. The dense cluster of nodes remain unchanged.

### Console Log Snippet

```text
Navigated to http://localhost:3000/
main-app.js?v=1753415534325:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
scheduler.development.js:14 [Violation] 'message' handler took 195ms
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:101 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T03:52:46.052Z
CrypticAnimusScene.tsx:104 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:105 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:98 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:101 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T03:52:46.053Z
CrypticAnimusScene.tsx:104 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:105 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:111 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:143 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:111 [Physics config] Ref not ready, will retry...
CrypticAnimusScene.tsx:143 [Window FG] Ref not ready, will retry...
CrypticAnimusScene.tsx:117 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:149 FG ref {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
CrypticAnimusScene.tsx:151 [Window FG] window.__FG assigned successfully
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 100ms
CrypticAnimusScene.tsx:212 === PHASE 2: Ref Evolution at 100ms ===
CrypticAnimusScene.tsx:213 Has __kapsuleInstance: false
CrypticAnimusScene.tsx:214 Direct keys count: 7
CrypticAnimusScene.tsx:215 Proto keys count: 0
CrypticAnimusScene.tsx:219 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:224 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:225 Has .alpha() method? false
CrypticAnimusScene.tsx:212 === PHASE 2: Ref Evolution at 500ms ===
CrypticAnimusScene.tsx:213 Has __kapsuleInstance: false
CrypticAnimusScene.tsx:214 Direct keys count: 7
CrypticAnimusScene.tsx:215 Proto keys count: 0
CrypticAnimusScene.tsx:219 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:224 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:225 Has .alpha() method? false
CrypticAnimusScene.tsx:158 === PHASE 1: window.__FG Deep Inspection ===
CrypticAnimusScene.tsx:159 1. Basic info:
CrypticAnimusScene.tsx:160   Type: object
CrypticAnimusScene.tsx:161   Constructor: Object
CrypticAnimusScene.tsx:163 2. Direct properties:
CrypticAnimusScene.tsx:164   Object.keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:165   Object.getOwnPropertyNames: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:167 3. Prototype chain:
CrypticAnimusScene.tsx:171   Level 0: (12) ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']
CrypticAnimusScene.tsx:176 4. All enumerable properties:
CrypticAnimusScene.tsx:185 (index)keytypevalue(index)keytypevalue0'emitParticle''function''[Function]'1'getGraphBbox''function''[Function]'2'd3ReheatSimulation''function''[Function]'3'd3Force''function''[Function]'4'resetCountdown''function''[Function]'5'tickFrame''function''[Function]'6'refresh''function''[Function]'Array(7)
CrypticAnimusScene.tsx:187 5. Method availability:
CrypticAnimusScene.tsx:190   d3Force: function
CrypticAnimusScene.tsx:190   d3ReheatSimulation: function
CrypticAnimusScene.tsx:190   tickFrame: function
CrypticAnimusScene.tsx:190   emitParticle: function
CrypticAnimusScene.tsx:190   getGraphBbox: function
CrypticAnimusScene.tsx:190   resetCountdown: function
CrypticAnimusScene.tsx:190   refresh: function
CrypticAnimusScene.tsx:193 6. Hidden/private properties:
CrypticAnimusScene.tsx:196   _engine: undefined
CrypticAnimusScene.tsx:196   _state: undefined
CrypticAnimusScene.tsx:196   _simulation: undefined
CrypticAnimusScene.tsx:196   __kapsuleInstance: undefined
CrypticAnimusScene.tsx:196   _graphForce: undefined
CrypticAnimusScene.tsx:196   __graphSimulation: undefined
CrypticAnimusScene.tsx:212 === PHASE 2: Ref Evolution at 1s ===
CrypticAnimusScene.tsx:213 Has __kapsuleInstance: false
CrypticAnimusScene.tsx:214 Direct keys count: 7
CrypticAnimusScene.tsx:215 Proto keys count: 0
CrypticAnimusScene.tsx:219 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:224 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:225 Has .alpha() method? false
CrypticAnimusScene.tsx:325 [Diag alpha] n/a kapsule: false
CrypticAnimusScene.tsx:212 === PHASE 2: Ref Evolution at 2s ===
CrypticAnimusScene.tsx:213 Has __kapsuleInstance: false
CrypticAnimusScene.tsx:214 Direct keys count: 7
CrypticAnimusScene.tsx:215 Proto keys count: 0
CrypticAnimusScene.tsx:219 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:224 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:225 Has .alpha() method? false
CrypticAnimusScene.tsx:325 [Diag alpha] n/a kapsule: false
CrypticAnimusScene.tsx:239 === PHASE 3: Force & Simulation Testing ===
CrypticAnimusScene.tsx:246 1. Testing d3Force method:
CrypticAnimusScene.tsx:248   d3Force type: function
CrypticAnimusScene.tsx:249   d3Force toString: function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          return _call.apply(void 0, [method].concat(args));
        }
CrypticAnimusScene.tsx:251 2. Testing force retrieval:
CrypticAnimusScene.tsx:256   Force "link": ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:257     Type: function
CrypticAnimusScene.tsx:258     Has strength?: true
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:256   Force "charge": ƒ force(_) {
    var i,
        n = nodes.length,
        tree =
            (nDim === 1 ? (0,d3_binarytree__WEBPACK_IMPORTED_MODULE_1__["default"])(nodes, _simulation_js__WEBPACK_IMPORTED_MODULE_2__.x…
CrypticAnimusScene.tsx:257     Type: function
CrypticAnimusScene.tsx:258     Has strength?: true
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:256   Force "center": ƒ force() {
    var i,
        n = nodes.length,
        node,
        sx = 0,
        sy = 0,
        sz = 0;

    for (i = 0; i < n; ++i) {
      node = nodes[i], sx += node.x || 0, sy += node.y || 0…
CrypticAnimusScene.tsx:257     Type: function
CrypticAnimusScene.tsx:258     Has strength?: true
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:256   Force "x": undefined
CrypticAnimusScene.tsx:257     Type: undefined
CrypticAnimusScene.tsx:258     Has strength?: false
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:256   Force "y": undefined
CrypticAnimusScene.tsx:257     Type: undefined
CrypticAnimusScene.tsx:258     Has strength?: false
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:256   Force "z": undefined
CrypticAnimusScene.tsx:257     Type: undefined
CrypticAnimusScene.tsx:258     Has strength?: false
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:256   Force "collide": undefined
CrypticAnimusScene.tsx:257     Type: undefined
CrypticAnimusScene.tsx:258     Has strength?: false
CrypticAnimusScene.tsx:259     Has alpha?: false
CrypticAnimusScene.tsx:265 3. Testing simulation control methods:
CrypticAnimusScene.tsx:267   d3ReheatSimulation result: ForceGraph {isObject3D: true, uuid: 'a33bf568-2fd0-43ef-8528-aea533d8f353', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:268   tickFrame result: ForceGraph {isObject3D: true, uuid: 'a33bf568-2fd0-43ef-8528-aea533d8f353', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:269   resetCountdown result: ForceGraph {isObject3D: true, uuid: 'a33bf568-2fd0-43ef-8528-aea533d8f353', name: '', type: 'Group', parent: Scene, …}
CrypticAnimusScene.tsx:274 4. Looking for simulation via d3Force:
CrypticAnimusScene.tsx:278   d3Force() no args: undefined
CrypticAnimusScene.tsx:279   Has .alpha()?: false
CrypticAnimusScene.tsx:280   Has .nodes()?: false
CrypticAnimusScene.tsx:286 5. Alternative access attempts:
CrypticAnimusScene.tsx:289 Uncaught TypeError: Right-hand side of 'instanceof' is not an object
    at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:289:62)
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:289
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:238
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:145
setTimeout
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:145
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:329
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
CrypticAnimusScene.tsx:325 [Diag alpha] n/a kapsule: false
CrypticAnimusScene.tsx:325 [Diag alpha] n/a kapsule: false
CrypticAnimusScene.tsx:212 === PHASE 2: Ref Evolution at 5s ===
CrypticAnimusScene.tsx:213 Has __kapsuleInstance: false
CrypticAnimusScene.tsx:214 Direct keys count: 7
CrypticAnimusScene.tsx:215 Proto keys count: 0
CrypticAnimusScene.tsx:219 All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:224 d3Force("link") returns: ƒ force(alpha) {
    for (var k = 0, n = links.length; k < iterations; ++k) {
      for (var i = 0, link, source, target, x = 0, y = 0, z = 0, l, b; i < n; ++i) {
        link = links[i], source = link…
CrypticAnimusScene.tsx:225 Has .alpha() method? false
CrypticAnimusScene.tsx:325 [Diag alpha] n/a kapsule: false
```
