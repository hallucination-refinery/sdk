title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-22T00:01:30Z
commit: cc22de16
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP smoke on commit `cc22de16` (imperative scene.add fix attempt) **CRASHED** immediately with **"ReferenceError: DreamdustScenePortal is not defined"**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical finding**: Code bug in `cc22de16` — references `DreamdustScenePortal` which doesn't exist, causing immediate crash before any Dreamdust initialization.
- Previous non-crash smoke runs (commit `a550adc6`) definitively proved R3F renders a different scene than the one we're adding Points to (ALL 6 render passes use wrong scene with `matchesRenderScene: false`).
- Acceptance gate status: FAIL (crash — code bug) — Imperative fix approach is correct, but implementation has undefined reference bug.

**B) Reflection**
- The imperative scene.add() approach is conceptually sound (directly attach Points to render scene), but commit `cc22de16` has an implementation bug.
- The STATUS UPDATE claimed Portal was removed and replaced with DreamdustSceneBridge, but runtime error shows code still references `DreamdustScenePortal` (undefined).
- This is a simple naming/reference bug that needs to be fixed before we can validate if the imperative approach works.

**C) Hypotheses & unknowns**
- P≈0.90 — Code has leftover reference to `DreamdustScenePortal` that should be `DreamdustSceneBridge` (or vice versa).
- P≈0.08 — Component was renamed but not exported properly.
- P≈0.02 — Multiple components with similar names causing confusion.

**D) Golden Path**
- Milestone 8 (P≈0.95, BUG FIX): Fix the undefined reference bug in PointCloudStage.tsx. Search for all occurrences of `DreamdustScenePortal` and ensure they match the actual component definition (`DreamdustSceneBridge` per STATUS UPDATE). Verify component is defined and used consistently.
- Milestone 9 (P≈0.85): After bug fix, re-run smoke to verify imperative scene.add() works. Expect at least one render-pass with `matchesRenderScene: true` AND `pointsPresent: true`.
- Milestone 10 (P≈0.70): If scene.add() works and Points render, remove diagnostic logging and verify acceptance gate (under-finger motion visible within 2 frames).

**E) Single change to run next**
- Fix the code bug in PointCloudStage.tsx: find where `DreamdustScenePortal` is referenced and either (a) rename references to `DreamdustSceneBridge`, or (b) rename the component definition to `DreamdustScenePortal` for consistency. Ensure the component is defined before it's used.

**F) Run plan**
- Review PointCloudStage.tsx to identify the undefined reference bug.
- Fix all references to use the correct component name.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, verify NO CRASH and at least one render-pass shows `matchesRenderScene: true`.
- If successful, expect `[PC] points-after-render` with `points > 0` and visible particles in screenshot.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with results; PASS if points render; document next fix if still blocked.
