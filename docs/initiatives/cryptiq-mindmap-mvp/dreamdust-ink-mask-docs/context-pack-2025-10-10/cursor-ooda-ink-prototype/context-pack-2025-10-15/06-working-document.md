title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T01:17:25Z
commit: 1d8dccf4
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-011543`) and Playwright (`20251021-011725`) smokes on commit `1d8dccf4` (added `[PC] points-mesh` snapshot logging) confirmed **SMOKING GUN**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical findings**: 
  - `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, positionCount: 90650, colorCount: 90650}` — mesh correctly configured with 90650 vertices
  - `[PC] render-info {calls: 1, points: 0, triangles: 2, timeout: false, framesWaited: 2}` — WebGL renderer counts 0 points, 2 triangles
  - **MISMATCH**: Mesh exists with correct type and geometry, but renderer doesn't count any points primitives
- Render-info logger sample up to 60 frames; reported `timeout: false, framesWaited: 2` — draws executed immediately.
- Uniforms, blend/depth overrides, fluid init all fire correctly; material reports `blending: 2`, `depthTest: false`, `depthWrite: false` as expected.
- Screenshots remain blank; Playwright spec continues to pass (2.0 s) with deterministic viewport/DPR.
- Acceptance gate status: FAIL (diagnostic) — Milestone 2 complete (mesh confirmed visible with vertices), proceed to Milestone 3 with renderer pipeline trace.

**B) Reflection**
- The `[PC] points-mesh` snapshot eliminated all doubts about mesh configuration: it IS a Points type, it IS visible, it HAS 90650 vertices loaded.
- Zero points rendered combined with 2 triangles suggests the renderer is either (a) skipping the Points mesh during traversal/render, or (b) counting a different mesh (background plane) in the stats while Points mesh never reaches WebGL.

**C) Hypotheses & unknowns**
- P≈0.60 — R3F render loop is skipping the Points mesh during scene traversal (layers, visibility checks, or render list filtering).
- P≈0.25 — Material/shader compilation fails silently for Points geometry, so WebGL never receives the draw call (despite mesh being in scene).
- P≈0.10 — The renderer is counting stats from a different part of the scene graph (background plane = 2 triangles), and Points mesh draws are happening but not being counted.
- P≈0.05 — Points geometry attributes are malformed or empty despite `positionCount: 90650` report (attribute stride/offset issue).

**D) Golden Path**
- Milestone 3 (P≈0.7): Add R3F render loop instrumentation or THREE.js patch to log when Points mesh is (a) added to render list, (b) passed to WebGL, (c) actually drawn. Check if R3F `render()` is even seeing the Points mesh. PASS = mesh reaches WebGL but fails to render (shader issue); FAIL = mesh never reaches render list (scene graph/R3F issue).
- Milestone 4 (P≈0.25): Create minimal test: hard-coded Points mesh with basic material in isolated R3F Canvas to verify Points geometry works at all in this stack.
- Milestone 5 (P≈0.05): If Points mesh reaches WebGL, add shader probe (hard-coded color/size) to bypass uniforms and prove shader execution path.

**E) Single change to run next**
- Option A (preferred, P≈0.7): Patch THREE.WebGLRenderer or R3F to log whenever a Points object enters the render pipeline. Check `scene.traverse()`, `renderList`, and `renderObjects()` to see if Points mesh is being filtered out before WebGL submission. If not feasible, proceed to Option B.
- Option B (fallback, P≈0.25): Create standalone diagnostic: minimal `<points>` element in a separate test route with hard-coded BufferGeometry to isolate whether R3F + THREE.js Points rendering works at all in this codebase.

**F) Run plan**
- Add render pipeline logging in PointCloudStage or patch THREE.js temporarily to trace Points mesh through render loop.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture new pipeline trace logs.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with pipeline trace; PASS if Points mesh reaches WebGL (proceed to shader debug); FAIL if mesh filtered out (debug R3F/scene-graph integration).
