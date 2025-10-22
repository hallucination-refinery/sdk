---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-22T15:44:16Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, scene-candidates, BREAKTHROUGH]
commit: 58755648
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251022-154259`) and Playwright (`20251022-154408`) smokes on commit `58755648` (scene-candidates diagnostic) **BREAKTHROUGH** — we now have the exact UUID of the render scene! **PASS (diagnostic breakthrough)** — `[PC] scene-candidates` reveals our traversed scene UUID (`11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba`) is completely different from the render scene UUID (`cc6f5bd2-b102-4093-b4a6-0f1b834e44ca`). This definitively proves R3F is rendering a different scene than the one we're adding Points to.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 8, nodes: Array(8)}` ← **Points mesh in traversed scene**
- `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0}` ← **Lists still empty**
- **BREAKTHROUGH**: `[PC] scene-candidates {candidates: {useThreeScene: "11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba", internalScene: null, internalActiveScene: null, rendererScene: null}, renderCallCount: 6}`
- **ALL 6 render passes**: `sceneUuid: "cc6f5bd2-b102-4093-b4a6-0f1b834e44ca", matchesRenderScene: false` ← **DIFFERENT UUID!**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh correctly configured**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, timeout: false, framesWaited: 2}` ← **Still 0 points, 2 triangles**
- **❌ `[PC] points-after-render` — STILL MISSING** ← **Consistent with wrong scene**

Key console lines (Playwright):
- **BREAKTHROUGH**: `[PC] scene-candidates {"candidates":{"useThreeScene":"11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba","internalScene":null,"internalActiveScene":null,"rendererScene":null},"renderCallCount":6}`
- **ALL 6 `[PC] renderer-render-pass` logs**: `sceneUuid: "cc6f5bd2-b102-4093-b4a6-0f1b834e44ca", sceneChildCount: 1, matchesRenderScene: false, pointsPresent: false, opaqueCount: 0, transparentCount: 0`
- **SAME PATTERN** as MCP — rendered scene UUID is completely different from our traversed scene UUID

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/58755648/docs/ink-falloff-flag-latch-2025-10-12/20251022-154259/2025-10-22-forceVisible-mcp.png` (still blank)

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/58755648/docs/ink-falloff-flag-latch-2025-10-12/20251022-154408/ink-chromium-20251022-154408-pre.png`
- `cursor-ooda-ink-prototype/assets/58755648/docs/ink-falloff-flag-latch-2025-10-12/20251022-154408/ink-chromium-20251022-154408-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/58755648/docs/ink-falloff-flag-latch-2025-10-12/20251022-154259/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/58755648/docs/ink-falloff-flag-latch-2025-10-12/20251022-154408/console-chromium-20251022-154408.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 1.8 s); deterministic viewport/DPR + console persistence verified

Decision: **PASS (diagnostic breakthrough)** — Evidence proves:
1. ✅ App runs without crashes
2. ✅ Scene-candidates diagnostic successfully captured all scene references
3. ✅ **BREAKTHROUGH**: We now know the exact render scene UUID: `cc6f5bd2-b102-4093-b4a6-0f1b834e44ca`
4. ✅ **BREAKTHROUGH**: Our traversed scene UUID: `11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba` (completely different!)
5. ✅ **BREAKTHROUGH**: ALL 6 render passes confirm `matchesRenderScene: false` with the different UUID
6. ❌ **Still no `[PC] points-after-render`** — onAfterRender never fires because we're in wrong scene

**Critical insight**: The scene-candidates diagnostic reveals that:
- `useThree().scene` returns our traversed scene (`11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba`)
- `state.internal.scene`, `state.internal.active.scene`, and `renderer.scene` are all `null`
- But the renderer is actually using a completely different scene (`cc6f5bd2-b102-4093-b4a6-0f1b834e44ca`)

**Next action (Milestone 10 — CRITICAL FIX)**: 
Now that we know the exact render scene UUID (`cc6f5bd2-b102-4093-b4a6-0f1b834e44ca`), we need to:
1. Find the actual THREE.Scene object with that UUID in the R3F state
2. Update DreamdustSceneBridge to attach the Dreamdust group to that specific scene
3. Verify the attachment by checking if `matchesRenderScene: true` in subsequent render passes

This is the final piece of the puzzle — we now know exactly which scene to attach to!