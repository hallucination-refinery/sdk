title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-20T20:46:26Z
commit: 16c73c7e
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251020-204451`) and Playwright (`20251020-204626`) smokes on commit `16c73c7e` (hardened logger with 60-frame sampling) confirmed **MAJOR BREAKTHROUGH**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical finding**: `[PC] render-info {calls: 1, points: 0, triangles: 2, timeout: false, framesWaited: 2}` — the renderer IS executing draw calls, but rendering **triangles** instead of **points**. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
- Render-info logger hardened to sample up to 60 frames; reported `timeout: false, framesWaited: 2` — draw calls executed immediately, no wait required.
- Uniforms, blend/depth overrides, fluid init all fire correctly; material reports `blending: 2`, `depthTest: false`, `depthWrite: false` as expected.
- Screenshots remain blank; Playwright spec continues to pass (2.1 s) with deterministic viewport/DPR.
- Acceptance gate status: FAIL (diagnostic) BUT MAJOR PROGRESS → Milestone 1 complete (logger works and captured draw calls), proceed to Milestone 2 with new hypothesis.

**B) Reflection**
- The hardened `<RenderInfoLogger>` successfully eliminated false negatives and proved the renderer is submitting geometry (`calls: 1`).
- Zero point primitives (`points: 0`) combined with 2 triangles suggests either: (a) stage points mesh not mounted/visible, (b) a different mesh (background plane?) counted instead, or (c) geometry type mismatch (THREE.Mesh vs THREE.Points).

**C) Hypotheses & unknowns**
- P≈0.50 — Stage points mesh is mounted but `visible: false` or culled by layers/frustum before submission.
- P≈0.30 — `stagePointsRef.current` points to a different mesh (background/helper) or the ref binding failed and another object is in the scene.
- P≈0.15 — Geometry type is wrong: using `THREE.Mesh` with indexed geometry instead of `THREE.Points` with BufferGeometry.
- P≈0.05 — Material is attached to the wrong mesh, or the points mesh exists but its geometry buffer is empty/not updated.

**D) Golden Path**
- Milestone 2 (P≈0.7): Add logging inside `PointCloudStage.tsx` to trace `stagePointsRef.current` at mount and in `useFrame`; log `mesh.type` (should be "Points"), `mesh.visible`, `mesh.geometry.type`, `mesh.geometry.attributes.position?.count`, and `mesh.parent`. Also log `scene.children` to confirm the points mesh is in the scene graph. PASS = mesh exists, type is "Points", visible, with vertices > 0; FAIL = ref is null, type is not "Points", visible is false, or not in scene → investigate mount/binding/geometry type.
- Milestone 3 (P≈0.25): If mesh exists and is visible but still no points rendered, add hard-coded shader probes (e.g., `gl_PointSize = 20.0; gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);`) to bypass uniforms and prove shader execution.
- Milestone 4 (P≈0.05): If shader probe works, revert to original shader and trace uniform/attribute bindings step-by-step.

**E) Single change to run next**
- Extend `<RenderInfoLogger>` or add new diagnostic component to log `stagePointsRef.current` details: `mesh ? { type: mesh.type, visible: mesh.visible, geometryType: mesh.geometry?.type, vertexCount: mesh.geometry?.attributes.position?.count ?? 0, hasParent: !!mesh.parent, materialUUID: mesh.material?.uuid } : null`. Also log `scene.children.length` and filter for "Points" type. Archive logs in next smoke run to confirm mesh type, visibility, and scene attachment.

**F) Run plan**
- Add diagnostic log in `PointCloudStage.tsx` (extend `<RenderInfoLogger>` at line ~1000 to include `stagePointsRef.current` inspection).
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture new diagnostic log + `[PC] render-info …` line.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with mesh type/visibility/geometry details; PASS if type is "Points", visible, vertexCount > 0; FAIL otherwise → investigate geometry type or mount conditions.
