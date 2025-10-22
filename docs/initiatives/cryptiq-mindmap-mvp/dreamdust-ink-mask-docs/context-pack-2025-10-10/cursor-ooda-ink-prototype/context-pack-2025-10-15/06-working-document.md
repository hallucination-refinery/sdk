title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-22T16:14:32Z
commit: 4699f1ed
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251022-161346`) and Playwright (`20251022-161432`) smokes on commit `4699f1ed` (render-scene-capture fix) **BREAKTHROUGH SUCCESS** — the scene attachment fix worked perfectly! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical breakthrough findings**: 
  - `[PC] render-scene-captured` successfully captured the render scene UUID
  - ALL 6 `[PC] renderer-render-pass` logs show `matchesRenderScene: true` — **SCENE ATTACHMENT SUCCESS!**
  - `[PC] points-after-render {calls: 2, points: 90650, triangles: 2}` appears for the first time — **POINTS MESH IS BEING DRAWN!**
  - `sceneChildCount: 2` (increased from 1) — **Dreamdust group successfully attached to render scene**
  - **Shader compilation error**: `gl_FragColor` undeclared identifier preventing visual output
- Acceptance gate status: PASS (breakthrough success) — scene attachment fixed, now need to fix shader compilation error.

**B) Reflection**
- The render-scene-capture fix worked perfectly! We've successfully moved from the scene mismatch problem to a shader compilation problem, which is a completely different and much more solvable issue.
- The Points mesh is now being drawn (90650 points), but the fragment shader has a compilation error that prevents visual output.
- This is a **HUGE PROGRESS** — we've solved the core architectural issue and are now dealing with a shader compatibility problem.

**C) Hypotheses & unknowns**
- P≈0.90 — The shader compilation error is due to WebGL version compatibility. `gl_FragColor` is the output variable for WebGL 1, but we might be running in WebGL 2 context where it should be a custom output variable.
- P≈0.10 — The shader might have other compatibility issues or the material setup might need adjustment.

**D) Golden Path**
- Milestone 11 (P≈0.90): Fix the fragment shader compilation error by updating the output variable to be compatible with the WebGL version being used (likely change `gl_FragColor` to a custom output variable for WebGL 2).
- Milestone 12 (P≈0.10): If shader fix doesn't work, investigate other material/shader compatibility issues.

**E) Single change to run next**
- Fix the fragment shader compilation error by updating the output variable in the shader code to be compatible with the WebGL version being used.

**F) Run plan**
- Locate and fix the fragment shader compilation error in the shader code.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture render-pass logs.
- Verify `[PC] points-after-render` still appears and shader errors are gone.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with findings; document success or next debugging step.

**G) Success criteria**
- No shader compilation errors in console
- `[PC] points-after-render` continues to appear with `points: 90650`
- Screenshot shows visible ink motion (the ultimate goal!)