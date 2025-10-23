title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T23:00:24Z
commit: b99fe68f
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-230024`) smoke on commit `b99fe68f` (extended render pipeline instrumentation) — **DIAGNOSTIC IMPLEMENTATION FAILURE**: New render pipeline diagnostics did NOT appear, but existing diagnostics confirm the root cause. See: 10-latest-smoke-evidence.md
- **Key findings from console-mcp.json**:
  - `[PC] material-defines {"useVelocityDisp":false}` — **BREAKTHROUGH DISCOVERY: Root cause identified**
  - `[PC] ink debug {vertexInkOk: false}` — Vertex texture unavailable confirmed
  - `[PC] render-info {calls: 0, points: 0, triangles: 0}` — Renderer never issues draw calls
  - **❌ MISSING NEW DIAGNOSTICS**: `[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end` did NOT fire
  - Points mesh exists (`[PC] scene-traversal {pointsFound: true}`) but never enters render pipeline
- Acceptance gate status: **DIAGNOSTIC IMPLEMENTATION FAILURE** — New render pipeline diagnostics not working

**B) Reflection**
- **BREAKTHROUGH DISCOVERY**: The `USE_VELOCITY_DISP` guard is **NOT being applied** as indicated by `[PC] material-defines {"useVelocityDisp":false}`. This is the root cause of the vertex texture fix failure.
- We've successfully ruled out:
  - ✅ Scene attachment issues (mesh exists in scene graph)
  - ✅ Shader compilation issues (material instantiates with correct defines)
  - ✅ Fluid simulation interference (disabled via diagnostic flag)
  - ✅ Shader output issues (solid color diagnostic working)
  - ✅ Camera positioning issues (camera diagnostic working)
- **New finding**: The `USE_VELOCITY_DISP` guard application logic is incorrect

**C) Hypotheses & unknowns**
- P≈0.95 — **BREAKTHROUGH DISCOVERY**: `USE_VELOCITY_DISP` guard application logic is incorrect
- P≈0.80 — Diagnostic implementation failure prevents new render pipeline diagnostics from firing
- P≈0.60 — Guard application logic needs to be fixed to ensure `USE_VELOCITY_DISP` is set to `true` when `vertexInkOk: false`

**D) Golden Path**
- Milestone 18: **Fix guard application logic** — Ensure `USE_VELOCITY_DISP` is set to `true` when `vertexInkOk: false`
- Milestone 19: **Fix diagnostic implementation** — Ensure new render pipeline diagnostics (`[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end`) actually fire
- Milestone 20: **Verify guard application** — Confirm `[PC] material-defines` shows `"useVelocityDisp": true` after fix
- Milestone 21: **Test visible particles** — Confirm screenshot shows visible points/particles after guard fix

**E) Single change to run next**
- Fix the `USE_VELOCITY_DISP` guard application logic to ensure it's set to `true` when `vertexInkOk: false`

**F) Run plan**
- Fix the `USE_VELOCITY_DISP` guard application logic:
  1. Ensure `USE_VELOCITY_DISP` is set to `true` when `vertexInkOk: false`
  2. Fix diagnostic implementation to ensure new render pipeline diagnostics fire
  3. Verify guard application in material defines
- Rebuild & serve: `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`
- MCP smoke: same URL with `forceVisible=1`, capture new diagnostics
- Look for `[PC] material-defines` showing `"useVelocityDisp": true`
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`
- Update `03-rendering-pipeline-trace.md` with guard application fix

**G) Success criteria**
- ✅ `[PC] material-defines` shows `"useVelocityDisp": true` (guard application working)
- ✅ `[PC] render-list snapshot` probe fires (indicates Points enters render list)
- ✅ `[PC] points-before-render` probe fires (indicates Points mesh hook execution)
- ✅ `[PC] render-info` shows `calls > 0, points > 0` (nonzero render stats)
- ✅ Screenshot shows visible particles (ultimate validation)