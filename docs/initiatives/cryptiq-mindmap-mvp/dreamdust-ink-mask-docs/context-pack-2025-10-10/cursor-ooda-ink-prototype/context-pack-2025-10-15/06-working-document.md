title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T03:22:31Z
commit: 5aacf359
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-032039`) and Playwright (`20251021-032231`) smokes on commit `5aacf359` (added `SceneTraversalLogger`) confirmed **CRITICAL BREAKTHROUGH**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical findings**: 
  - `[PC] scene-traversal {pointsFound: true, path: "Scene/Group/Group/Group/Points", geometryPositionCount: 90650}` — **Points mesh IS in THREE.js scene graph**
  - `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, layers: 1, positionCount: 90650}` — mesh correctly configured
  - `[PC] render-info {calls: 1, points: 0, triangles: 2, timeout: false, framesWaited: 2}` — WebGL renderer counts 0 points, 2 triangles
  - **❌ `[PC] points-after-render` — STILL MISSING** — `onAfterRender` never fires despite mesh in scene
- Scene graph shows 7 nodes total; Points mesh is nested at depth 3 in Groups, path `Scene/Group/Group/Group/Points`.
- Uniforms, blend/depth overrides, fluid init all fire correctly; material reports `blending: 2`, `depthTest: false`, `depthWrite: false` as expected.
- Screenshots remain blank; Playwright spec continues to pass (2.1 s) with deterministic viewport/DPR.
- Acceptance gate status: FAIL (diagnostic — render loop filtering) — Milestone 4 complete (Points confirmed in scene graph), proceed to Milestone 5 with render-loop instrumentation.

**B) Reflection**
- The `SceneTraversalLogger` eliminated the mounting hypothesis: the Points mesh IS correctly added to the THREE.js scene graph at the expected path with all correct properties.
- The combination of (a) Points mesh in scene, (b) visible=true with layers=1, (c) zero points rendered, and (d) `onAfterRender` never firing proves the mesh is being **filtered out during THREE.WebGLRenderer's render traversal** — somewhere between scene.traverse() and the actual WebGL draw call.

**C) Hypotheses & unknowns**
- P≈0.50 — THREE.WebGLRenderer is skipping the Points object during `renderLists` or `renderObjects` phase (possibly due to shader compilation failure, layer filtering, or Points-specific culling).
- P≈0.30 — R3F's render loop is not traversing nested Groups correctly, so Points mesh at depth 3 never gets added to the render list.
- P≈0.15 — The Points material shader fails to compile silently (check `material.program` and GL errors), causing THREE.js to skip rendering without firing `onAfterRender`.
- P≈0.05 — Points objects with specific material configurations (ShaderMaterial with custom uniforms) are filtered out by THREE.js render pipeline.

**D) Golden Path**
- Milestone 5 (P≈0.7): Patch THREE.WebGLRenderer or add logging to trace render list creation. Log when Points objects are processed in `projectObject()`, `renderObjects()`, or similar. Check if Points mesh is being added to render lists. PASS = Points mesh in render list but skipped at draw stage (shader issue); FAIL = Points mesh never added to render list (traversal/culling issue).
- Milestone 6 (P≈0.25): Move Points mesh to Scene root (not nested in Groups) to test if nesting depth affects render list creation. If it renders at root, the issue is with R3F's Group traversal.
- Milestone 7 (P≈0.05): Check material.program after first render to verify shader compiled; add GL error logging to catch silent shader failures.

**E) Single change to run next**
- Option A (preferred, P≈0.6): Move `<points>` element to be a direct child of Scene (not nested in Groups) to test if depth/nesting is the issue. If it renders at root, we know R3F has a traversal bug with nested Points.
- Option B (fallback, P≈0.35): Add temporary patch to THREE.WebGLRenderer.projectObject() to log when it encounters Points objects and whether they get added to renderLists. This requires modifying node_modules or using runtime patching.

**F) Run plan**
- Implement Option A first (simpler, faster): refactor PointCloudStage to mount Points mesh at Scene root instead of nested in Groups.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, check if `[PC] points-after-render` appears and if points render.
- If Option A fails (still no render), proceed to Option B (renderer patching).
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with findings; PASS if points render at root (fix nesting); FAIL if still no render (proceed to renderer instrumentation).
