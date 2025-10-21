title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T21:45:42Z
commit: 7667d2bc
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-214542`) smoke on commit `7667d2bc` (Portal fix attempt) **CRASHED** — React error #130 and WebGL Context Lost. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- Playwright test **FAILED** with 60s timeout waiting for logs that never came.
- **Critical finding**: Build warning reveals **Portal is NOT exported from @react-three/fiber** in this version, causing undefined import and runtime crash.
- Previous smoke runs (commit `a550adc6`) definitively proved R3F renders a different scene than the one we're adding Points to (sceneChildCount: 1 vs 3, different UUIDs).
- Acceptance gate status: FAIL (crash) — Portal approach not viable; must use imperative scene attachment instead.

**B) Reflection**
- The Portal fix was conceptually correct (mount objects into render scene) but technically impossible because Portal doesn't exist in this R3F version.
- We now know with 100% certainty the problem: R3F renders scene B (with 1 child), but our Points mesh is in scene A (with 3 children). We need to move Points from A to B.
- Portal was the declarative R3F way to do this, but since it's not available, we must use imperative Three.js scene management.

**C) Hypotheses & unknowns**
- P≈0.80 — We need to imperatively add Points to the render scene using `gl.scene.add(stagePointsRef.current)` in useEffect/useLayoutEffect.
- P≈0.15 — The "render scene" might be accessible via R3F state (`state.scene` in useFrame) vs `useThree().scene`.
- P≈0.04 — We could modify how R3F obtains the render scene so it uses our scene (advanced R3F internal patching).
- P≈0.01 — Update R3F version to one that exports Portal (risky, might break other things).

**D) Golden Path**
- Milestone 8 (P≈0.85, REVISED): Revert Portal fix and implement imperative scene attachment. In a useEffect, get the actual render scene (try `useThree((state) => state.gl.scene)` or patch to find it) and call `renderScene.add(stagePointsRef.current)`. Ensure proper cleanup on unmount.
- Milestone 9 (P≈0.12): If imperative approach works and Points render, remove all diagnostic logging and verify acceptance gate (under-finger motion visible within 2 frames).
- Milestone 10 (P≈0.03): If imperative approach fails, investigate R3F's internal scene management to understand why two scenes exist and how to unify them.

**E) Single change to run next**
- REVERT Portal fix (remove Portal import and DreamdustScenePortal wrapper).
- Add imperative scene attachment in useEffect: access the render scene and call `scene.add(stagePointsRef.current)` to manually attach Points to the correct scene that R3F renders.
- Keep all diagnostic logging to verify the fix works.

**F) Run plan**
- Revert commit `7667d2bc` (Portal fix that crashed).
- Implement imperative scene attachment using useEffect + scene.add().
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, verify at least one render-pass shows `matchesRenderScene: true` AND `pointsPresent: true`.
- If successful, expect `[PC] points-after-render` to appear with `points > 0`.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with results; PASS if points render; document next fix if still blocked.
