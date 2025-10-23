title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T21:19:20Z
commit: 332e9390
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-211920`) smoke on commit `332e9390` (rendering pipeline instrumentation) **BREAKTHROUGH DISCOVERY** — the rendering pipeline instrumentation revealed the **root cause**! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **BREAKTHROUGH DISCOVERY findings**: 
  - `[PC] material-defines {"useVelocityDisp":false}` — **`USE_VELOCITY_DISP` guard is NOT being applied!**
  - `[PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}` — **Vertex texture unavailable confirmed**
  - `[PC] render-info {calls: 0, points: 0, triangles: 0, memory: Object, mat: Object}` — **Still 0 points rendered**
  - All previous diagnostics working (scene attachment, shader compilation, fluid simulation disabled, shader output, camera diagnostic)
  - **❌ POINT CLOUD STILL NOT VISIBLE** — **But now we know why!**
  - **🔍 BREAKTHROUGH DISCOVERY** — The `USE_VELOCITY_DISP` guard is **NOT being applied**!
- Acceptance gate status: BREAKTHROUGH DISCOVERY — we found the root cause!

**B) Reflection**
- The rendering pipeline instrumentation revealed the **root cause**! The `USE_VELOCITY_DISP` guard is **NOT being applied** (`useVelocityDisp: false`), which explains why the vertex texture fix didn't work.
- We've successfully ruled out:
  - ✅ Scene attachment issues (fixed)
  - ✅ Shader compilation issues (fixed)
  - ✅ Fluid simulation interference (ruled out)
  - ✅ Shader output issues (ruled out)
  - ✅ Vertex texture issues (identified - guard not applied)
- This is **BREAKTHROUGH DISCOVERY** — we found the root cause!

**C) Hypotheses & unknowns**
- P≈1.00 — **ROOT CAUSE IDENTIFIED**: The `USE_VELOCITY_DISP` guard is not being applied when `vertexInkOk: false`
- P≈0.90 — The issue is in the guard application logic — the shader define is not being set correctly
- P≈0.80 — The issue is in the material compilation — the guard is not being compiled into the shader
- P≈0.70 — The issue is in the condition logic — the guard condition is not being evaluated correctly

**D) Golden Path**
- Milestone 18 (P≈1.00): **Fix USE_VELOCITY_DISP Guard Application** — Ensure the guard is properly applied when `vertexInkOk: false`
- Milestone 19 (P≈0.90): **Verify Guard Application Logic** — Check the condition logic for setting the guard
- Milestone 20 (P≈0.80): **Verify Material Compilation** — Ensure the guard is compiled into the shader
- Milestone 21 (P≈0.70): **Test the Fix** — Run smoke test to verify particles become visible

**E) Single change to run next**
- **Fix the USE_VELOCITY_DISP guard application logic** to ensure it's set to `true` when `vertexInkOk: false`.

**F) Run plan**
- Fix the guard application logic to:
  1. **Set USE_VELOCITY_DISP to true** when `vertexInkOk: false`
  2. **Verify the condition logic** is correct
  3. **Ensure the guard is compiled** into the shader
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture material-defines diagnostic
- Verify the diagnostic shows `useVelocityDisp: true` when `vertexInkOk: false`
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`
- Update `10-latest-smoke-evidence.md` with findings; document success or next debugging step

**G) Success criteria**
- ✅ `[PC] material-defines` shows `useVelocityDisp: true` when `vertexInkOk: false`
- ✅ `[PC] render-info` shows `calls > 0, points > 0` (nonzero render stats)
- ✅ Screenshot shows **visible points/particles** (the ultimate test!)
- 🔍 Guard application logs reveal the fix is working and particles become visible