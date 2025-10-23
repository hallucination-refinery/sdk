title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T19:53:35Z
commit: ed09b59e
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-195335`) smoke on commit `ed09b59e` (vertex texture fix - USE_VELOCITY_DISP guard) **VERTEX TEXTURE FIX FAILED** — the `USE_VELOCITY_DISP` guard fix did **not restore particle visibility**! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Vertex texture fix findings**: 
  - `[PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}` — **Vertex texture unavailable confirmed**
  - `[PC] render-info {calls: 0, points: 0, triangles: 0, mat: Object, uniforms: Object}` — **Still 0 points rendered**
  - All previous diagnostics working (scene attachment, shader compilation, fluid simulation disabled, shader output, camera diagnostic)
  - **❌ POINT CLOUD STILL NOT VISIBLE** — **Vertex texture fix did not work**
  - **❌ VERTEX TEXTURE FIX FAILED** — `USE_VELOCITY_DISP` guard did not restore particle visibility
- Acceptance gate status: FAIL (still stuck) — vertex texture fix did not work.

**B) Reflection**
- The vertex texture fix did **not work** - despite confirming vertex texture unavailability and applying the `USE_VELOCITY_DISP` guard, we still get zero render calls and no visible points.
- We've successfully ruled out:
  - ✅ Scene attachment issues (fixed)
  - ✅ Shader compilation issues (fixed)
  - ✅ Fluid simulation interference (ruled out)
  - ✅ Shader output issues (ruled out)
  - ✅ Vertex texture issues (ruled out - fix did not work)
- This is **VERTEX TEXTURE FIX FAILED** — we need to investigate alternative root causes.

**C) Hypotheses & unknowns**
- P≈0.60 — The issue could be camera/viewport positioning (points are outside visible area) — **CAMERA DIAGNOSTIC INCOMPLETE**
- P≈0.50 — The issue could be point size (points are too small to see)
- P≈0.40 — The issue could be blending/depth state (rendering state prevents visibility)
- P≈0.30 — The issue could be material issues (shader material has other problems beyond vertex textures)
- P≈0.20 — The issue could be WebGL context issues (other WebGL limitations blocking rendering)

**D) Golden Path**
- Milestone 17 (P≈0.60): **Fix camera diagnostic implementation** — Complete the camera diagnostic to determine frustum intersection
- Milestone 18 (P≈0.50): **Add point size diagnostics** — Check if points are too small to see
- Milestone 19 (P≈0.40): **Add blending/depth state diagnostics** — Check rendering state
- Milestone 20 (P≈0.30): **Add material diagnostics** — Check for other shader material problems
- Milestone 21 (P≈0.20): **Add WebGL context diagnostics** — Check for other WebGL limitations

**E) Single change to run next**
- **Fix the camera diagnostic implementation** to properly serialize vectors, compute distance, and perform frustum intersection test.

**F) Run plan**
- Fix the camera diagnostic to:
  1. **Serialize camera/target vectors properly** — Show `[x, y, z]` instead of `Array(3)`
  2. **Compute and log distance** — Add `distance: <number>` field
  3. **Perform frustum intersection test** — Add `intersectsFrustum: true/false` field
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture camera diagnostic
- Verify the diagnostic shows all required fields
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`
- Update `10-latest-smoke-evidence.md` with findings; document success or next debugging step

**G) Success criteria**
- ✅ Enhanced `[PC] camera-diag` appears with:
  - `cameraPosition: [x, y, z]` (numeric vectors, not Array(3))
  - `target: [x, y, z]` (numeric vectors, not Array(3))
  - `distance: <number>` (computed distance)
  - **`intersectsFrustum: true/false`** ← **THE CRITICAL FIELD!**
- ✅ No shader compilation errors in console
- ❌ Point cloud still not visible (expected)
- 🔍 Camera diagnostic logs reveal frustum intersection status and next debugging step