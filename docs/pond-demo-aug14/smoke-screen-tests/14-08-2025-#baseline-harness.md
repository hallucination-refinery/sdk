# ARCHIVED Manual Visual Confirmation Smoke

**PLEASE IGNORE NOT ACCURATE AT ALL**
## PROCESS

**Run from integration worktree (do not cd):**
1. 
```bash
NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
```
2.
```bash
NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo
```

**Open (note dynamic port):**

- If 3000 is in use, Next chooses 3001. Use the URL it prints, then visit:
  - http://localhost:3001/harness/latent (or the printed port)

**Verify (stop immediately if any fail):**

- Spheres visible on screen (not just badges).
- No legacy `@refinery/canvas-r3f` errors.
- No React “unknown prop” warnings.

**If white screen persists:**

- Paste first 10 console lines and first 10 server logs from startup.
- Stop; do not proceed to next prompts.

---

# OBSERVATION

1. The browser window loads and I see a white screen in the viewport.
2. There is a UI component in the top left side of the viewport. It says "Debug_Graph" and "Latent_Trace". **NOTHING ELSE IS ON THE SCREEN**
3. The console log fired **endlessly** (see below).

# BROWSER LOG

```
Navigated to http://localhost:3001/harness/latent
page.tsx:29 [HARNESS] HUD Mount Check - Immediate
page.tsx:32 [DEBUG_GRAPH] GraphData: {nodes: Array(3), links: Array(2)}
page.tsx:36 [LATENT_TRACE] Component mounted with ref: {graphData: ƒ, cameraPosition: ƒ, zoomToFit: ƒ, centerAt: ƒ, zoom: ƒ, …}
page.tsx:41 [HARNESS] Triggering one-burst animation
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
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
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
NodeAttributeManager.ts:202 Uncaught TypeError: Cannot set properties of undefined (setting 'offset')
    at NodeAttributeManager.flush (NodeAttributeManager.ts:202:50)
    at CanvasLatentAdapter.LatentScene.useFrame [as current] (CanvasLatentAdapter.tsx:291:11)
    at update (events-f681e724.esm.js:2256:22)
    at loop (events-f681e724.esm.js:2287:17)
flush @ NodeAttributeManager.ts:202
CanvasLatentAdapter.LatentScene.useFrame @ CanvasLatentAdapter.tsx:291
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
```
