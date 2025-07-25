# Baseline Smoke Screen Tests

Last Updated: 3:30 AM EST, 25/07/2025

## Context

- Branch: `replace-interaction-with-store`
- Commit: 83faec32
- Browser: Chrome Incognito 138.0.7204.169 (arm64)
- Key Change: Commit Message - "fix: limit visibility bypass logging to prevent console spam"

## Test 1 - Do Nothing

### Process

1. CD @ workplace root ➜ `rm -rf node_modules/.cache .turbo .next`
2. `pnpm dev --filter cryptic-vault-demo` ➜ wait for “Ready in 5 s”.
3. Incognito tab ➜ load `http://localhost:3000`.
4. Keep cursor out of viewport and do **nothing** for 5 s.
5. Skipping forward and carefully documented each browser debugger **pause** until we reach the runtime errors
6. Copying the whole console log

### Observation (Chronological)

1. On initial load: the viewport contains the HUD UI and the background of the graph/scene
2. The console log seems to be firing regularly until the browser debugger triggers, **pausing on line 147 of CrypticAnimusScene.tsx**
3. I fast forward the debugger and it **pauses on line 61 of CrypticAnimusScene.tsx**
4. I fast forward the debugger and it **pauses on line 117 of CrypticAnimusScene.tsx**
5. I fast forward the debugger and it **pauses on line 147 of CrypticAnimusScene.tsx again**
6. I fast forward the debugger and it:
   6.1 **pauses on line 1228 of react.development.js** AND
   6.2 The viewport contains the same HUD UI but the graph scene is now black
7. I fast forward the debugger and it:
   7.1 **pauses on line 22 of CategoryContext.tsx** AND
   7.2 The viewport is unchanged from observation 6.2
8. I fast forward the debugger and the following runtime errors occured:
   8.1 Error: Cannot access 'nodePassesFilters' before initialization
   8.2 Error: Cannot access 'nodePassesFilters' before initialization

### Console Log

```
Navigated to http://localhost:3000/
main-app.js?v=1753427457297:2314 Download the React DevTools for a better development experience: https://react.dev/link/react-devtools
scheduler.development.js:14 [Violation] 'message' handler took 196ms
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T07:11:14.160Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:115 [INIT POSITIONS] Added initial positions to 213/213 nodes in sphere pattern (radius: 299)
CrypticAnimusScene.tsx:131 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:134 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-25T07:13:55.172Z
CrypticAnimusScene.tsx:137 [Data debug] nodes: 213 links: 276
CrypticAnimusScene.tsx:138 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:141 [FILTERS] visibleIds: Set(213)
CrypticAnimusScene.tsx:142 [FILTERS] activeCategories: Set(6)
CrypticAnimusScene.tsx:143 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:144 [FILTERS] activeTags: undefined
react-reconciler.development.js:3311 Uncaught ReferenceError: Cannot access 'nodePassesFilters' before initialization
    at CrypticAnimusScene (CrypticAnimusScene.tsx:147:45)
    at react-stack-bottom-frame (react-reconciler.development.js:7191:24)
    at renderWithHooks (react-reconciler.development.js:2235:24)
    at updateFunctionComponent (react-reconciler.development.js:3523:21)
    at beginWork (react-reconciler.development.js:4115:24)
    at runWithFiberInDEV (react-reconciler.development.js:399:20)
    at performUnitOfWork (react-reconciler.development.js:6372:87)
    at workLoopSync (react-reconciler.development.js:6265:40)
    at renderRootSync (react-reconciler.development.js:6248:13)
    at performWorkOnRoot (react-reconciler.development.js:6008:56)
    at performWorkOnRootViaSchedulerTask (react-reconciler.development.js:1356:9)
    at MessagePort.performWorkUntilDeadline (scheduler.development.js:44:48)
CrypticAnimusScene @ CrypticAnimusScene.tsx:147
react-stack-bottom-frame @ react-reconciler.development.js:7191
renderWithHooks @ react-reconciler.development.js:2235
updateFunctionComponent @ react-reconciler.development.js:3523
beginWork @ react-reconciler.development.js:4115
runWithFiberInDEV @ react-reconciler.development.js:399
performUnitOfWork @ react-reconciler.development.js:6372
workLoopSync @ react-reconciler.development.js:6265
renderRootSync @ react-reconciler.development.js:6248
performWorkOnRoot @ react-reconciler.development.js:6008
performWorkOnRootViaSchedulerTask @ react-reconciler.development.js:1356
performWorkUntilDeadline @ scheduler.development.js:44
scheduler.development.js:14 [Violation] 'message' handler took 187425ms
error-boundary-callbacks.js:83 Uncaught Error: Cannot access 'nodePassesFilters' before initialization
    at CrypticAnimusScene (CrypticAnimusScene.tsx:147:45)
    at Canvas (react-three-fiber.esm.js:203:82)
    at CrypticVaultSceneContent (CrypticVaultScene.tsx:427:9)
    at CrypticVaultScene (CrypticVaultScene.tsx:492:7)
    at LoadableComponent (loadable.js:63:57)
    at Home (page.tsx:23:7)
    at ClientPageRoot (client-page.js:20:50)
getReactStitchedError @ stitched-error.js:26
onUncaughtError @ error-boundary-callbacks.js:75
onCaughtError @ error-boundary-callbacks.js:41
logCaughtError @ react-dom-client.development.js:8401
runWithFiberInDEV @ react-dom-client.development.js:845
inst.componentDidCatch.update.callback @ react-dom-client.development.js:8448
callCallback @ react-dom-client.development.js:6429
commitCallbacks @ react-dom-client.development.js:6449
runWithFiberInDEV @ react-dom-client.development.js:845
commitClassCallbacks @ react-dom-client.development.js:12140
commitLayoutEffectOnFiber @ react-dom-client.development.js:12764
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12692
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12687
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12867
recursivelyTraverseLayoutEffects @ react-dom-client.development.js:13673
commitLayoutEffectOnFiber @ react-dom-client.development.js:12769
flushLayoutEffects @ react-dom-client.development.js:15687
commitRoot @ react-dom-client.development.js:15528
commitRootWhenReady @ react-dom-client.development.js:14759
performWorkOnRoot @ react-dom-client.development.js:14682
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16350
performWorkUntilDeadline @ scheduler.development.js:45
<CanvasImpl>
exports.jsx @ react-jsx-runtime.development.js:339
Canvas @ react-three-fiber.esm.js:203
react-stack-bottom-frame @ react-dom-client.development.js:22974
renderWithHooksAgain @ react-dom-client.development.js:6767
renderWithHooks @ react-dom-client.development.js:6679
updateFunctionComponent @ react-dom-client.development.js:8931
beginWork @ react-dom-client.development.js:10556
runWithFiberInDEV @ react-dom-client.development.js:845
performUnitOfWork @ react-dom-client.development.js:15258
workLoopSync @ react-dom-client.development.js:15078
renderRootSync @ react-dom-client.development.js:15058
performWorkOnRoot @ react-dom-client.development.js:14526
performSyncWorkOnRoot @ react-dom-client.development.js:16365
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16211
flushPassiveEffects @ react-dom-client.development.js:15881
eval @ react-dom-client.development.js:15505
performWorkUntilDeadline @ scheduler.development.js:45
<Canvas>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
CrypticVaultSceneContent @ CrypticVaultScene.tsx:427
react-stack-bottom-frame @ react-dom-client.development.js:22974
renderWithHooksAgain @ react-dom-client.development.js:6767
renderWithHooks @ react-dom-client.development.js:6679
updateFunctionComponent @ react-dom-client.development.js:8931
beginWork @ react-dom-client.development.js:10556
runWithFiberInDEV @ react-dom-client.development.js:845
performUnitOfWork @ react-dom-client.development.js:15258
workLoopSync @ react-dom-client.development.js:15078
renderRootSync @ react-dom-client.development.js:15058
performWorkOnRoot @ react-dom-client.development.js:14526
performSyncWorkOnRoot @ react-dom-client.development.js:16365
flushSyncWorkAcrossRoots_impl @ react-dom-client.development.js:16211
flushPassiveEffects @ react-dom-client.development.js:15881
eval @ react-dom-client.development.js:15505
performWorkUntilDeadline @ scheduler.development.js:45
<CrypticVaultSceneContent>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
CrypticVaultScene @ CrypticVaultScene.tsx:492
react-stack-bottom-frame @ react-dom-client.development.js:22974
renderWithHooksAgain @ react-dom-client.development.js:6767
renderWithHooks @ react-dom-client.development.js:6679
updateFunctionComponent @ react-dom-client.development.js:8931
beginWork @ react-dom-client.development.js:10505
runWithFiberInDEV @ react-dom-client.development.js:845
performUnitOfWork @ react-dom-client.development.js:15258
workLoopConcurrentByScheduler @ react-dom-client.development.js:15252
renderRootConcurrent @ react-dom-client.development.js:15227
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16350
performWorkUntilDeadline @ scheduler.development.js:45
<...>
exports.jsx @ react-jsx-runtime.development.js:339
LoadableComponent @ loadable.js:63
react-stack-bottom-frame @ react-dom-client.development.js:22974
renderWithHooksAgain @ react-dom-client.development.js:6767
renderWithHooks @ react-dom-client.development.js:6679
updateFunctionComponent @ react-dom-client.development.js:8931
beginWork @ react-dom-client.development.js:10556
runWithFiberInDEV @ react-dom-client.development.js:845
performUnitOfWork @ react-dom-client.development.js:15258
workLoopConcurrentByScheduler @ react-dom-client.development.js:15252
renderRootConcurrent @ react-dom-client.development.js:15227
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16350
performWorkUntilDeadline @ scheduler.development.js:45
<LoadableComponent>
exports.jsxDEV @ react-jsx-dev-runtime.development.js:346
Home @ page.tsx:23
react-stack-bottom-frame @ react-dom-client.development.js:22974
renderWithHooksAgain @ react-dom-client.development.js:6767
renderWithHooks @ react-dom-client.development.js:6679
updateFunctionComponent @ react-dom-client.development.js:8931
beginWork @ react-dom-client.development.js:10556
runWithFiberInDEV @ react-dom-client.development.js:845
performUnitOfWork @ react-dom-client.development.js:15258
workLoopConcurrentByScheduler @ react-dom-client.development.js:15252
renderRootConcurrent @ react-dom-client.development.js:15227
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16350
performWorkUntilDeadline @ scheduler.development.js:45
<Home>
exports.jsx @ react-jsx-runtime.development.js:339
ClientPageRoot @ client-page.js:20
react-stack-bottom-frame @ react-dom-client.development.js:22974
renderWithHooksAgain @ react-dom-client.development.js:6767
renderWithHooks @ react-dom-client.development.js:6679
updateFunctionComponent @ react-dom-client.development.js:8931
beginWork @ react-dom-client.development.js:10505
runWithFiberInDEV @ react-dom-client.development.js:845
performUnitOfWork @ react-dom-client.development.js:15258
workLoopConcurrentByScheduler @ react-dom-client.development.js:15252
renderRootConcurrent @ react-dom-client.development.js:15227
performWorkOnRoot @ react-dom-client.development.js:14525
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:16350
performWorkUntilDeadline @ scheduler.development.js:45
"use client"
eval @ react-server-dom-webpack-client.browser.development.js:2354
initializeModelChunk @ react-server-dom-webpack-client.browser.development.js:1054
resolveModelChunk @ react-server-dom-webpack-client.browser.development.js:1031
resolveModel @ react-server-dom-webpack-client.browser.development.js:1599
processFullStringRow @ react-server-dom-webpack-client.browser.development.js:2288
processFullBinaryRow @ react-server-dom-webpack-client.browser.development.js:2233
progress @ react-server-dom-webpack-client.browser.development.js:2479
"use server"
ResponseInstance @ react-server-dom-webpack-client.browser.development.js:1587
createResponseFromOptions @ react-server-dom-webpack-client.browser.development.js:2396
exports.createFromReadableStream @ react-server-dom-webpack-client.browser.development.js:2717
eval @ app-index.js:132
(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/app-index.js @ main-app.js?v=1753427457297:160
options.factory @ webpack.js?v=1753427457297:712
__webpack_require__ @ webpack.js?v=1753427457297:37
fn @ webpack.js?v=1753427457297:369
eval @ app-next-dev.js:11
eval @ app-bootstrap.js:62
loadScriptsInSequence @ app-bootstrap.js:23
appBootstrap @ app-bootstrap.js:56
eval @ app-next-dev.js:10
(app-pages-browser)/../../../node_modules/.pnpm/next@15.3.2_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/client/app-next-dev.js @ main-app.js?v=1753427457297:182
options.factory @ webpack.js?v=1753427457297:712
__webpack_require__ @ webpack.js?v=1753427457297:37
__webpack_exec__ @ main-app.js?v=1753427457297:2824
(anonymous) @ main-app.js?v=1753427457297:2825
webpackJsonpCallback @ webpack.js?v=1753427457297:1388
(anonymous) @ main-app.js?v=1753427457297:9
scheduler.development.js:14 [Violation] 'message' handler took 308383ms
three.module.js:16056 THREE.WebGLRenderer: Context Lost.
```
