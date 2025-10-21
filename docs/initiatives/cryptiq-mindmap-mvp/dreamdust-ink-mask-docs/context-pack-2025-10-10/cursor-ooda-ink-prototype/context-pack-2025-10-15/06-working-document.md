title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T16:46:34Z
commit: a550adc6
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-164436`) and Playwright (`20251021-164634`) smokes on commit `a550adc6` (enhanced multi-pass renderer probe) confirmed **ABSOLUTE ROOT CAUSE**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical findings**: 
  - `[PC] scene-traversal {pointsFound: true, nodeCount: 7, nodes:[..., Scene with 3 children...]}` — **Our Points mesh is in a scene with 3 children at root**
  - ALL 6 `[PC] renderer-render-pass` logs show: **SAME sceneUuid (389e362e.../20ec4906...), sceneChildCount: 1, matchesTraversedScene: false, pointsPresent: false, opaqueCount: 0, transparentCount: 0**
  - **ABSOLUTE**: R3F renders 6 times per frame, and EVERY SINGLE CALL uses a completely different scene than the one containing our Points mesh
  - **NOT A SINGLE render call** uses our scene — 100% of renders go to the wrong scene
- Acceptance gate status: FAIL (absolute — different scenes confirmed) — Milestone 7 complete (all render passes use wrong scene), proceed to Milestone 8 with scene attachment fix.

**B) Reflection**
- The multi-pass renderer probe provided absolute proof: R3F maintains TWO SEPARATE SCENE OBJECTS. One scene (from `useThree().scene`, where R3F's JSX adds our Points mesh) has 7 nodes and 3 children at root. The other scene (passed to `renderer.render()`) has only 1 child and is what actually gets rendered 6 times per frame.
- This is not a timing issue, not a culling issue, not a shader issue — it's a fundamental scene management problem. We've been adding objects to the wrong scene the entire time.

**C) Hypotheses & unknowns**
- P≈0.75 — R3F uses portals or event-only rendering, creating a shadow scene for events while rendering a different scene for visuals. Our Points mesh is in the event scene, not the render scene.
- P≈0.15 — The Canvas configuration has `events` or `eventSource` set incorrectly, causing R3F to create an intermediate scene.
- P≈0.08 — We're using `useThree().scene` incorrectly — there's a different API to access the actual render scene.
- P≈0.02 — Multiple Canvas instances exist and we're querying the wrong one's scene.

**D) Golden Path**
- Milestone 8 (P≈0.85): Investigate PointCloudStage's Canvas setup and scene usage. Check for: (a) portal usage, (b) eventSource/events configuration, (c) scene ref vs useThree().scene discrepancy. Find how to access or add objects to the actual render scene (sceneUuid: 389e362e.../20ec4906...).
- Milestone 9 (P≈0.12): Once we identify the correct render scene, add Points mesh to it (either change parent, use imperative scene.add(), or fix R3F scene binding).
- Milestone 10 (P≈0.03): If fix works and points render, remove all diagnostic logging and verify acceptance gate (under-finger motion visible within 2 frames).

**E) Single change to run next**
- Audit PointCloudStage.tsx for how the Points mesh is being added to the scene. Look for JSX parent structure, portal usage, and Canvas configuration. The fix will likely be one of: (a) move Points to correct parent/scene, (b) use imperative `gl.scene.add(stagePointsRef.current)` instead of JSX mounting, or (c) fix Canvas eventSource configuration to prevent scene splitting.

**F) Run plan**
- Review PointCloudStage.tsx code to identify why R3F creates two scenes and how to add Points to the render scene.
- Implement fix to add Points mesh to the correct scene object (sceneUuid: 389e362e.../20ec4906...).
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, verify `matchesTraversedScene: true` in at least one render-pass and `pointsPresent: true`.
- If successful, expect `[PC] points-after-render` to appear and `points > 0` in render-info.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with FIX results; PASS if points render; document remaining issues if any.
