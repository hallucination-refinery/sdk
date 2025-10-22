title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-22T03:44:45Z
commit: 43f774d5
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251022-034153`) and Playwright (`20251022-034445`) smokes on commit `43f774d5` (imperative scene.add fix) **NO CRASH** but **STILL WRONG SCENE**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical findings**: 
  - App didn't crash (DreamdustScenePortal bug fixed)
  - `[PC] scene-traversal {pointsFound: true, nodeCount: 8}` — **NodeCount increased from 7 to 8** (group WAS added to traversed scene)
  - ALL 6 `[PC] renderer-render-pass` logs: **matchesRenderScene: false, sceneChildCount: 1, pointsPresent: false, lists EMPTY**
  - **DreamdustSceneBridge's imperative scene.add() FAILED** to attach group to render scene
  - `[PC] render-info {calls: 1, points: 0, triangles: 2}` — still rendering wrong scene
  - **❌ `[PC] points-after-render` — STILL MISSING**
- Acceptance gate status: FAIL (still wrong scene) — Milestone 8 partially complete (no crash, but scene.add didn't work), need to debug why imperative attachment failed.

**B) Reflection**
- The nodeCount increase from 7 to 8 proves the Dreamdust group IS being added to SOME scene (likely the event scene we traverse), but it's still not in the render scene.
- The imperative `scene.add()` in DreamdustSceneBridge either used the wrong scene reference, wasn't called, or was immediately undone by R3F's scene management.

**C) Hypotheses & unknowns**
- P≈0.50 — DreamdustSceneBridge is using `useThree().gl.scene` or `useThree().scene`, but that's the EVENT scene, not the RENDER scene. R3F might store the actual render scene elsewhere (internal state, different property).
- P≈0.30 — The useEffect in DreamdustSceneBridge runs, but R3F immediately removes the group (R3F might enforce that only JSX-declared children stay in its internal scenes).
- P≈0.15 — useEffect timing issue — scene.add() is called before the render scene exists or after R3F has already captured its render scene snapshot.
- P≈0.05 — The group was added to render scene but something else prevents it from being traversed (layer mismatch, visibility, or rendering order).

**D) Golden Path**
- Milestone 9 (P≈0.75): Add logging INSIDE DreamdustSceneBridge useEffect to emit: (a) whether useEffect runs, (b) the scene UUID it's adding to, (c) success/failure of scene.add(), (d) the group's parent UUID after add. Compare logged scene UUID with render-pass sceneUuid to confirm if we're adding to the right scene.
- Milestone 10 (P≈0.20): If we're adding to wrong scene, investigate R3F internals to find the actual render scene reference (might be in R3F's internal fiber state, not exposed via useThree API).
- Milestone 11 (P≈0.05): If we're adding to correct scene but it's being removed, investigate why R3F removes manually-added objects and how to prevent it.

**E) Single change to run next**
- Add comprehensive logging inside DreamdustSceneBridge's useEffect to emit `[PC] scene-bridge { useEffectRan: true, targetSceneUuid, addSucceeded, groupParentUuid, groupInScene }` immediately after calling scene.add(). This will reveal whether the bridge is executing and if it's using the correct scene.

**F) Run plan**
- Add logging to DreamdustSceneBridge useEffect in PointCloudStage.tsx.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture `[PC] scene-bridge` log.
- Compare scene-bridge targetSceneUuid with renderer-render-pass sceneUuid to confirm if they match.
- If UUIDs don't match: find the correct R3F render scene reference.
- If UUIDs match: investigate why group isn't staying in render scene or isn't being traversed.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with findings; document next fix approach.
