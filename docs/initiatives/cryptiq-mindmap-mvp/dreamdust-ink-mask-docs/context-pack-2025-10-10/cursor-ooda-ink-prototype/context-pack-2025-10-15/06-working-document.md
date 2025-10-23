title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T16:06:48Z
commit: b675fa50
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-160648`) smoke on commit `b675fa50` (enhanced camera diagnostic) **DIAGNOSTIC IMPLEMENTATION FAILURE** — the enhanced camera diagnostic is **still incomplete**! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Enhanced camera diagnostic findings**: 
  - `[PC] camera-diag {enabled: true, cameraPosition: Array(3), target: Array(3), radius: 500, near: 0.1}` appears — **BUT MISSING CRITICAL FIELDS!**
  - **❌ MISSING `intersectsFrustum: true/false` field** — **THE CRITICAL FIELD IS MISSING!**
  - **❌ MISSING numeric vectors** — Still showing `Array(3)` instead of `[x, y, z]`
  - **❌ MISSING distance field** — No `distance: <number>` field
  - All previous fixes remain intact (scene attachment, shader compilation, fluid simulation disabled)
  - **❌ POINT CLOUD STILL NOT VISIBLE** — **Cannot determine frustum intersection status**
  - `[PC] render-info {calls: 0, points: 0, triangles: 0}` — **Still 0 points rendered**
- Acceptance gate status: FAIL (diagnostic implementation) — enhanced camera diagnostic is **still incomplete**.

**B) Reflection**
- The enhanced camera diagnostic is **still incomplete** - it's logging camera parameters but not performing the actual frustum intersection test or logging the result.
- We've successfully ruled out:
  - ✅ Scene attachment issues (fixed)
  - ✅ Shader compilation issues (fixed)
  - ✅ Fluid simulation interference (ruled out)
  - ✅ Shader output issues (ruled out)
- This is **DIAGNOSTIC IMPLEMENTATION FAILURE** — we need to fix the enhanced camera diagnostic implementation before we can proceed.

**C) Hypotheses & unknowns**
- P≈0.60 — The issue could be camera/viewport positioning (points are outside visible area) — **BLOCKED BY DIAGNOSTIC IMPLEMENTATION FAILURE**
- P≈0.40 — The issue could be point size (points are too small to see)
- P≈0.30 — The issue could be blending/depth state (rendering state prevents visibility)
- P≈0.20 — The issue could be color/alpha (points are invisible due to color/alpha values)

**D) Golden Path**
- Milestone 16 (P≈1.00): **Fix enhanced camera diagnostic implementation** — Must complete before proceeding
- Milestone 17 (P≈0.60): Analyze camera frustum intersection status to determine if camera positioning is correct
- Milestone 18 (P≈0.40): Add point size diagnostics to check if points are too small to see
- Milestone 19 (P≈0.30): Add blending/depth state diagnostics to check rendering state
- Milestone 20 (P≈0.20): Add color/alpha diagnostics to check if points are invisible due to color/alpha

**E) Single change to run next**
- **Fix the enhanced camera diagnostic implementation** to properly serialize vectors, compute distance, and perform frustum intersection test.

**F) Run plan**
- Fix the enhanced camera diagnostic to:
  1. **Serialize camera/target vectors properly** — Show `[x, y, z]` instead of `Array(3)`
  2. **Compute and log distance** — Add `distance: <number>` field
  3. **Perform frustum intersection test** — Add `intersectsFrustum: true/false` field
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture enhanced camera diagnostic
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
- 🔍 Enhanced camera diagnostic logs reveal frustum intersection status and next debugging step