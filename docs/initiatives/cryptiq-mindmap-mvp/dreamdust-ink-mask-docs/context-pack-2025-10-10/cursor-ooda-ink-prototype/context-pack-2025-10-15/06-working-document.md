title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T03:43:23Z
commit: 10b04eef
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-034323`) smoke on commit `10b04eef` (shader output diagnostic) **PROGRESS** — the shader output diagnostic is working! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Shader output diagnostic findings**: 
  - `[PC] diag solid color {enabled: true}` appears — **SHADER OUTPUT DIAGNOSTIC WORKING!**
  - All previous fixes remain intact (scene attachment, shader compilation)
  - **❌ POINT CLOUD STILL NOT VISIBLE** — **Shader output was not the culprit**
  - `[PC] render-info {calls: 0, points: 0, triangles: 0}` — **Still 0 points rendered**
- Acceptance gate status: PASS (progress) — shader output diagnostic worked, but point cloud still not visible. Need to investigate other causes.

**B) Reflection**
- The shader output diagnostic worked perfectly, but the point cloud is still not visible. This proves the shader output was not causing the visibility issue.
- We've successfully ruled out:
  - ✅ Scene attachment issues (fixed)
  - ✅ Shader compilation issues (fixed)
  - ✅ Fluid simulation interference (ruled out)
  - ✅ Shader output issues (ruled out)
- This is **PROGRESS** — we've eliminated another potential cause, but the debugging journey continues!

**C) Hypotheses & unknowns**
- P≈0.60 — The issue could be camera/viewport positioning (points are outside visible area)
- P≈0.40 — The issue could be point size (points are too small to see)
- P≈0.30 — The issue could be blending/depth state (rendering state prevents visibility)
- P≈0.20 — The issue could be color/alpha (points are invisible due to color/alpha values)

**D) Golden Path**
- Milestone 14 (P≈0.60): Add camera/viewport positioning diagnostics to check if points are in visible area
- Milestone 15 (P≈0.40): Add point size diagnostics to check if points are too small to see
- Milestone 16 (P≈0.30): Add blending/depth state diagnostics to check rendering state
- Milestone 17 (P≈0.20): Add color/alpha diagnostics to check if points are invisible due to color/alpha

**E) Single change to run next**
- Add camera/viewport positioning diagnostics to check if points are in the visible area.

**F) Run plan**
- Add diagnostic logging to check camera/viewport positioning and point visibility
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture camera/viewport diagnostics
- Verify if points are in the visible area or if there's a positioning issue
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`
- Update `10-latest-smoke-evidence.md` with findings; document success or next debugging step

**G) Success criteria**
- ✅ `[PC] diag solid color` appears to confirm shader diagnostic is working
- ✅ No shader compilation errors in console
- ❌ Point cloud still not visible (expected)
- 🔍 New diagnostic logs reveal the actual cause of visibility issue