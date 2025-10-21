title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T04:18:11Z
commit: 1c78306f
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-041617`) and Playwright (`20251021-041811`) smokes on commit `1c78306f` (added `renderLists.get` probe) confirmed **DEFINITIVE ROOT CAUSE**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical findings**: 
  - `[PC] scene-traversal {pointsFound: true, path: "Scene/Group/Group/Group/Points", geometryPositionCount: 90650}` — **Points mesh IS in THREE.js scene graph**
  - `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0}` — **Render lists are COMPLETELY EMPTY**
  - `[PC] points-mesh {type: Points, visible: true, layers: 1, positionCount: 90650}` — mesh correctly configured
  - `[PC] render-info {calls: 1, points: 0, triangles: 2, timeout: false}` — only 2 triangles from elsewhere
  - **❌ `[PC] points-after-render` — MISSING** — consistent with empty render lists
- **DEFINITIVE**: The ENTIRE scene is being skipped during render list creation (`opaqueCount: 0, transparentCount: 0`), not just the Points mesh.
- Acceptance gate status: FAIL (definitive — render list filtering) — Milestone 5 complete (render lists proven empty), proceed to Milestone 6 with R3F render() investigation.

**B) Reflection**
- The `renderLists.get` probe revealed the ultimate blocker: THREE.WebGLRenderer's render lists are COMPLETELY EMPTY. This means the issue is NOT specific to Points — the entire scene graph is being filtered out before any objects can be added to render queues.
- Since `opaqueCount: 0` and `transparentCount: 0`, whatever is rendering those 2 triangles must be from a separate render pass or a different scene entirely.

**C) Hypotheses & unknowns**
- P≈0.60 — R3F is NOT calling `renderer.render(scene, camera)` at all, or is calling it with the wrong scene object (possibly rendering a different scene that doesn't contain our Points mesh).
- P≈0.30 — R3F IS calling `renderer.render()` but the entire scene is being culled (camera frustum doesn't intersect scene bounds, or scene.visible=false, or layers mismatch between camera and scene).
- P≈0.08 — R3F has patched/wrapped `THREE.WebGLRenderer.render()` in a way that breaks render list creation (unlikely but possible).
- P≈0.02 — The scene object we're traversing is different from the scene being rendered (R3F might maintain multiple scenes).

**D) Golden Path**
- Milestone 6 (P≈0.8): Patch `THREE.WebGLRenderer.render()` to log its arguments (scene, camera) and verify: (a) render() is being called, (b) the scene object matches what we traversed, (c) camera frustum is valid. PASS = render() called with correct scene (proceed to culling/filtering debug); FAIL = render() not called or wrong scene (R3F integration issue).
- Milestone 7 (P≈0.15): If render() is being called correctly, log camera.layers vs scene children layers to check for layer filtering. Also check scene.visible and scene.matrixWorld.
- Milestone 8 (P≈0.05): If all above pass, the issue is in THREE.js's projectObject() filtering logic — may need to patch projectObject() to log why objects are being skipped.

**E) Single change to run next**
- Patch `THREE.WebGLRenderer.render()` to emit a one-shot `[PC] renderer-render-call` log with: scene UUID, scene.children.length (top-level), camera type, camera.layers.mask, and a flag indicating if this is the expected scene. This will confirm if R3F is calling render() and with what arguments.

**F) Run plan**
- Add WebGLRenderer.render() patch in PointCloudStage (similar pattern to renderLists.get hook).
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture `[PC] renderer-render-call` log.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with render() call details; PASS if render() called with correct scene (proceed to culling debug); FAIL if not called or wrong scene (fix R3F integration).
