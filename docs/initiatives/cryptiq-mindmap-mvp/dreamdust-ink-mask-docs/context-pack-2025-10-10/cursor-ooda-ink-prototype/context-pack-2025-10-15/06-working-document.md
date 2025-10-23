title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T21:19:20Z
commit: 332e9390
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-211920`) smoke on commit `332e9390` (rendering pipeline instrumentation) — Instrumentation reveals shader fallback is correctly configured but render pass never executes. See: 10-latest-smoke-evidence.md
- **Key findings from console-mcp.json**:
  - `[PC] material-defines {"useVelocityDisp":false}` (line 64) — Shader fallback CORRECTLY configured for non-vertex-texture hardware
  - `[PC] ink debug {vertexInkOk: false}` (line 4) — Vertex texture unavailable confirmed
  - `[PC] render-info {calls: 0, points: 0, triangles: 0}` (line 189) — Renderer never issues draw calls
  - **MISSING**: `[PC] render-list snapshot` and `[PC] points-after-render` probes did NOT fire
  - Points mesh exists (`[PC] scene-traversal {pointsFound: true}`) but never enters render pipeline
- Acceptance gate status: Diagnostic gap identified — render list population failure

**B) Reflection**
- The rendering pipeline instrumentation corrected a misunderstanding: `useVelocityDisp: false` is CORRECT for fallback hardware (when `vertexInkOk: false`)
- We've successfully ruled out:
  - ✅ Scene attachment issues (mesh exists in scene graph)
  - ✅ Shader compilation issues (material instantiates with correct defines)
  - ✅ Fluid simulation interference (disabled via diagnostic flag)
  - ✅ Shader guard logic (fallback configuration is correct)
- New finding: Points mesh never enters Three.js render lists despite being visible and in scene

**C) Hypotheses & unknowns**
- P≈0.85 — Render list population blocked by material/geometry incompatibility in fallback mode
- P≈0.70 — Three.js culls Points mesh due to bounding box or layer mask issues
- P≈0.60 — onBeforeRender hook prevents mesh from entering render pipeline
- P≈0.40 — WebGL context state prevents Points primitive rendering

**D) Golden Path**
- Milestone 18: **Debug render list population** — Add instrumentation to track why Points mesh doesn't enter render lists
- Milestone 19: **Investigate culling logic** — Check if Points are culled before render despite visible=true
- Milestone 20: **Verify geometry/material compatibility** — Ensure fallback material works with Points geometry
- Milestone 21: **Test alternative render paths** — Try forcing Points into render list manually

**E) Single change to run next**
- Add instrumentation to track when/why Points mesh is excluded from `gl.renderLists`

**F) Run plan**
- Add diagnostic logging to:
  1. Track render list population in detail
  2. Log when Points mesh is evaluated for rendering
  3. Capture any culling or filtering decisions
- Rebuild & serve: `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`
- MCP smoke: same URL with `forceVisible=1`, capture new diagnostics
- Look for render-list and points-after-render probe firing
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`
- Update `03-rendering-pipeline-trace.md` with detailed render pipeline flow

**G) Success criteria**
- ✅ `[PC] render-list snapshot` probe fires (indicates Points enters render list)
- ✅ `[PC] points-after-render` probe fires (indicates onAfterRender lifecycle triggered)
- ✅ `[PC] render-info` shows `calls > 0, points > 0` (nonzero render stats)
- ✅ Screenshot shows visible particles (ultimate validation)