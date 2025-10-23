title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T15:36:28Z
commit: 33775b92
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-153628`) smoke on commit `33775b92` (camera diagnostic) **PROGRESS** — the camera diagnostic is working! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Camera diagnostic findings**: 
  - `[PC] camera-diag {enabled: true, cameraPosition: Array(3), target: Array(3), radius: 500, near: 0.1}` appears — **CAMERA DIAGNOSTIC WORKING!**
  - All previous fixes remain intact (scene attachment, shader compilation, fluid simulation disabled)
  - **❌ POINT CLOUD STILL NOT VISIBLE** — **Need to check frustum intersection status**
  - `[PC] render-info {calls: 0, points: 0, triangles: 0}` — **Still 0 points rendered**
- Acceptance gate status: PASS (progress) — camera diagnostic worked, but we need to check frustum intersection to determine if camera positioning is the issue.

**B) Reflection**
- The camera diagnostic worked perfectly, but we need to check the frustum intersection status to determine if camera positioning is the issue.
- We've successfully ruled out:
  - ✅ Scene attachment issues (fixed)
  - ✅ Shader compilation issues (fixed)
  - ✅ Fluid simulation interference (ruled out)
  - ✅ Shader output issues (ruled out)
- This is **PROGRESS** — we've eliminated another potential cause, but the debugging journey continues!

**C) Hypotheses & unknowns**
- P≈0.60 — The issue could be camera/viewport positioning (points are outside visible area) — **CURRENT FOCUS**
- P≈0.40 — The issue could be point size (points are too small to see)
- P≈0.30 — The issue could be blending/depth state (rendering state prevents visibility)
- P≈0.20 — The issue could be color/alpha (points are invisible due to color/alpha values)

**D) Golden Path**
- Milestone 15 (P≈0.60): Analyze camera frustum intersection status to determine if camera positioning is correct
- Milestone 16 (P≈0.40): Add point size diagnostics to check if points are too small to see
- Milestone 17 (P≈0.30): Add blending/depth state diagnostics to check rendering state
- Milestone 18 (P≈0.20): Add color/alpha diagnostics to check if points are invisible due to color/alpha

**E) Single change to run next**
- Analyze the camera frustum intersection status from the diagnostic logs to determine if camera positioning is the issue.

**F) Run plan**
- Review the camera diagnostic logs to check frustum intersection status
- If `intersectsFrustum: true` → camera positioning is correct, investigate point size or depth/blend
- If `intersectsFrustum: false` → camera positioning is the issue, need to adjust camera
- Check the screenshot to see if points are visible when frustum intersection is true
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`
- Update `10-latest-smoke-evidence.md` with findings; document success or next debugging step

**G) Success criteria**
- ✅ `[PC] camera-diag` appears to confirm camera diagnostic is working
- ✅ No shader compilation errors in console
- ❌ Point cloud still not visible (expected)
- 🔍 Camera diagnostic logs reveal frustum intersection status and next debugging step