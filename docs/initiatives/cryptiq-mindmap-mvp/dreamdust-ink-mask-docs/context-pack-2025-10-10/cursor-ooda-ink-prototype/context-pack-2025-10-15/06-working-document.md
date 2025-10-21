title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T04:48:03Z
commit: 60421b13
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-044608`) and Playwright (`20251021-044803`) smokes on commit `60421b13` (added `renderer.render()` probe) confirmed **GAME-CHANGING DISCOVERY**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical findings**: 
  - `[PC] scene-traversal {pointsFound: true, nodeCount: 7, nodes:[Scene with 3 children...]}` — **Our scene has 3 children at root**
  - `[PC] renderer-render-call {sceneChildCount: 1, cameraType: OrthographicCamera}` — **R3F renders a scene with only 1 child**
  - **SCENE MISMATCH**: R3F is calling `renderer.render()` with a DIFFERENT scene object than the one we're adding Points to
  - `[PC] render-list {opaqueCount: 0, transparentCount: 0}` — Lists empty (consistent with wrong scene)
  - **❌ `[PC] points-after-render` — MISSING** — Consistent with Points in different scene
- Acceptance gate status: FAIL (definitive — wrong scene) — Milestone 6 complete (renderer.render() call confirmed with wrong scene), proceed to Milestone 7 with R3F scene management fix.

**B) Reflection**
- The `renderer.render()` probe revealed the ultimate blocker: R3F is managing TWO DIFFERENT SCENE OBJECTS. The scene we traverse (via `useThree().scene` in our traversal logger) has our Points mesh with 3 children at root. But the scene R3F passes to `renderer.render()` only has 1 child and doesn't contain our Points mesh.
- This explains why ALL our diagnostics worked perfectly (mesh exists, is visible, has geometry) but nothing renders — we've been adding objects to the wrong scene the entire time.

**C) Hypotheses & unknowns**
- P≈0.70 — R3F maintains multiple scene instances: one for the Canvas render target and one for internal state. Our Points mesh is being added to the internal/state scene, not the render scene.
- P≈0.20 — The scene returned by `useThree().scene` is different from the scene R3F actually renders. We're traversing the correct scene but R3F renders a portal/intermediate scene.
- P≈0.08 — R3F uses portals or layers, and our Points mesh is in a portal that's not connected to the main render scene.
- P≈0.02 — Multiple Canvas instances exist and we're adding Points to one but rendering from another.

**D) Golden Path**
- Milestone 7 (P≈0.85): Add logging to capture BOTH scene UUIDs: (a) the scene from `useThree().scene` where we're adding Points, (b) the scene being passed to renderer.render(). Compare UUIDs and children counts to confirm they're different scenes. Then trace R3F's scene management to find the correct render scene.
- Milestone 8 (P≈0.12): Once we identify why there are two scenes, ensure Points mesh is added to the actual render scene (the one with sceneChildCount: 1) instead of the traversed scene.
- Milestone 9 (P≈0.03): If issue persists, investigate R3F Canvas configuration (frameloop, concurrent, etc.) that might affect scene management.

**E) Single change to run next**
- Add logging in SceneTraversalLogger to capture the scene UUID from `useThree().scene` and compare it with the `sceneUuid` from `renderer-render-call`. This will definitively prove we're working with two different scenes. Also log where our Points mesh is being added (which scene parent) vs which scene is being rendered.

**F) Run plan**
- Extend SceneTraversalLogger to log scene UUID from `useThree().scene` and mark it as "traversed scene".
- Compare traversed scene UUID with rendered scene UUID from `renderer-render-call`.
- If UUIDs differ, investigate R3F's scene graph structure to find why there are multiple scenes.
- Fix: Add Points mesh to the correct render scene (likely need to use a different R3F API or mount point).
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture scene UUID comparison.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with scene UUID findings; document the fix approach based on why there are two scenes.
