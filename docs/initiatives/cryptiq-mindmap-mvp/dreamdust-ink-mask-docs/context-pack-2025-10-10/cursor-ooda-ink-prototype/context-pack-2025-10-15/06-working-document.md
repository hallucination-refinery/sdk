title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-20T21:10:00Z
commit: fc45deab
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251020-201848`) and Playwright (`20251020-202100`) smokes on commit `b6cf2605` (includes `c1ea70ff` fix) confirmed `<RenderInfoLogger>` now emits `[PC] render-info` successfully. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical finding**: `calls: 0, points: 0, triangles: 0` — the draw call NEVER executes. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
- Render-info logger has been hardened to sample up to 60 frames, emitting `timeout` and `framesWaited` so diagnostics either capture the first draw or explicitly report "no draws observed within 60 frames".
- Uniforms, blend/depth overrides, fluid init all fire correctly; material reports `blending: 2`, `depthTest: false`, `depthWrite: false` as expected.
- Screenshots remain blank; Playwright spec continues to pass (2.0 s) with deterministic viewport/DPR.
- Acceptance gate status: FAIL (diagnostic) → Milestone 1 complete (logger works), proceed to Milestone 2 (debug stage binding).

**B) Reflection**
- The `<RenderInfoLogger>` eliminated the "hooks outside Canvas" error and now successfully logs renderer stats, confirming the instrumentation is correct.
- Zero draw calls proves the issue is **upstream of shaders** — the stage points mesh is either not mounted, not attached to the scene graph, or its geometry is empty.

**C) Hypotheses & unknowns**
- P≈0.70 — `stagePointsRef.current` never references a valid `<points>` mesh (binding issue, conditional mount guard, or ref assignment timing).
- P≈0.20 — Stage points mesh exists but geometry buffer is empty (vertex count = 0, positions attribute not set).
- P≈0.08 — Mesh exists with geometry but is culled by R3F layer or visibility flags before renderer submission.
- P≈0.02 — Material is swapped after logger runs (unlikely, log shows correct UUID and flags).

**D) Golden Path**
- Milestone 2 (P≈0.7): Add logging inside `PointCloudStage.tsx` to trace `stagePointsRef.current` at mount and in `useFrame`; log `geometry.attributes.position.count`, `visible`, `parent`, and `material.uuid`. PASS = mesh exists with vertices; FAIL = ref is null or geometry empty → investigate mount conditions.
- Milestone 3 (P≈0.25): If mesh exists with geometry but still no draws, log `scene.children` to confirm mesh is in scene graph; check `layers` and R3F `renderOrder`.
- Milestone 4 (P≈0.05): If all above pass, add hard-coded colour/size probe in vertex shader to rule out uniform/attribute issues.

**E) Single change to run next**
- Instrument `stagePointsRef.current` inside `useFrame` (or in a new diagnostic component) to log: `mesh ? { hasGeometry: !!mesh.geometry, vertexCount: mesh.geometry?.attributes.position?.count ?? 0, visible: mesh.visible, materialUUID: mesh.material?.uuid, parent: !!mesh.parent } : null`. Archive logs in next smoke run to confirm ref binding and geometry presence.

**F) Run plan**
- Add diagnostic log in `PointCloudStage.tsx` or extend `<RenderInfoLogger>` to include `stagePointsRef.current` details.
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture new diagnostic log + `[PC] render-info …` line.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with mesh/geometry details; PASS if vertexCount > 0, FAIL if ref is null or count = 0 → investigate mount/binding.
