title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-22T15:44:16Z
commit: 58755648
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251022-154259`) and Playwright (`20251022-154408`) smokes on commit `58755648` (scene-candidates diagnostic) **BREAKTHROUGH** — we now have the exact UUID of the render scene! docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical breakthrough findings**: 
  - `[PC] scene-candidates` reveals our traversed scene UUID: `11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba`
  - ALL 6 `[PC] renderer-render-pass` logs show render scene UUID: `cc6f5bd2-b102-4093-b4a6-0f1b834e44ca`
  - **COMPLETELY DIFFERENT UUIDs** — this definitively proves R3F is rendering a different scene than the one we're adding Points to
  - `[PC] scene-traversal {pointsFound: true, nodeCount: 8}` — Points mesh is in our traversed scene
  - ALL render passes: `matchesRenderScene: false, pointsPresent: false, lists EMPTY`
  - `[PC] render-info {calls: 1, points: 0, triangles: 2}` — still rendering wrong scene
  - **❌ `[PC] points-after-render` — STILL MISSING**
- Acceptance gate status: PASS (diagnostic breakthrough) — we now know the exact render scene UUID and can fix the attachment.

**B) Reflection**
- The scene-candidates diagnostic was the key missing piece. We now have definitive proof that R3F is using a completely different scene for rendering than the one we're adding objects to.
- The UUIDs are completely different: `11c1e2ec-92ab-4ffa-973b-a9fa7329b2ba` (our scene) vs `cc6f5bd2-b102-4093-b4a6-0f1b834e44ca` (render scene).
- This explains why all our previous attempts failed — we were adding to the wrong scene entirely.

**C) Hypotheses & unknowns**
- P≈0.90 — We need to find the actual THREE.Scene object with UUID `cc6f5bd2-b102-4093-b4a6-0f1b834e44ca` in the R3F state and attach our Dreamdust group to it instead of `useThree().scene`.
- P≈0.10 — The render scene might be stored in a different R3F state property that we haven't discovered yet (possibly in the renderer's internal state or a different part of the R3F fiber tree).

**D) Golden Path**
- Milestone 10 (P≈0.90): Find the THREE.Scene object with UUID `cc6f5bd2-b102-4093-b4a6-0f1b834e44ca` in the R3F state and update DreamdustSceneBridge to attach the Dreamdust group to that specific scene instead of `useThree().scene`.
- Milestone 11 (P≈0.10): If we can't find the scene by UUID, investigate R3F internals to understand how the render scene is managed and where it's stored.

**E) Single change to run next**
- Update DreamdustSceneBridge to search for and attach to the scene with UUID `cc6f5bd2-b102-4093-b4a6-0f1b834e44ca` instead of using `useThree().scene`. This should make `matchesRenderScene: true` in subsequent render passes.

**F) Run plan**
- Modify DreamdustSceneBridge in PointCloudStage.tsx to find the scene with the specific UUID and attach to it.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture render-pass logs.
- Verify `matchesRenderScene: true` and `pointsPresent: true` in render passes.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with findings; document success or next debugging step.
