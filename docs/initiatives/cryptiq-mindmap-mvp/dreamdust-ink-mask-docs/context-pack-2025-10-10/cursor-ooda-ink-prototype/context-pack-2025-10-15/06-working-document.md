A) Where we are
- Latest smoke captured `[PC] render-info {calls:1, points:0, triangles:2, timeout:false, framesWaited:2}` confirming the renderer is active but submits no point draws; triangles match the fullscreen quad used by the fluid passes. cursor-ooda-ink-prototype/console/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204626/console-chromium-20251020-204626.json, dreamdust/fluid/FluidSim.ts:139
- The logger only fires after `forceVisible` is true and a `THREE.Points` ref exists, so the sample was taken with our stage mesh mounted and uniforms resolved. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:946
- `forceVisible` forces reveal, alpha floor, point sizing, and disables depth so shader gates should not be hiding fragments. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1837
- The vertex shader still derives `gl_PointSize` from `uPointBaseSize` (forced to 8) before applying velocity displacement, so a valid geometry should render visible sprites. apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:432
- Stage wiring instantiates `<points>` with `frustumCulled={false}` and the Dreamdust ShaderMaterial, so the earlier “maybe Mesh vs Points” theory is disproven. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3501
- No `[vertex] geometry attribute summary` log appeared in the smoke artifact even though the effect emits one when attributes bind, leaving the actual vertex count at draw time unverified. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3124, cursor-ooda-ink-prototype/console/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204626/console-chromium-20251020-204626.json

B) Hypotheses and unknowns
- P≈0.55 — Geometry binding is late or empty when the logger fires: the stage effect rebuilds attributes in `useEffect`, but we have no log proving `position.count > 0` when the renderer first records draws. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3124
- P≈0.25 — Points mesh exists but is excluded from traversal (visibility/layers/parent): `frustumCulled={false}` and `renderOrder=1` should keep it eligible, yet we have not inspected `points.visible`, parent linkage, or layer masks at runtime. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3501
- P≈0.20 — Logger stops after the fluid pass increments `calls`, so we may be sampling before the point draw occurs later in the frame; screenshots still blank, but this needs falsification. apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:999

C) Golden Path
- Milestone 1 (P≈0.70): Instrument the points mesh at the moment `render-info` triggers to log type, visibility, parent UUID, and attribute counts; assumption—diagnostic log fires in the same frame as the fluid draw. PASS gives `position.count > 0`; FAIL pinpoints data/binding gap.
- Milestone 2 (conditional P≈0.60): If counts >0 yet `renderer.info.render.points` stays 0, temporarily emit a hard-coded GL_POINTS probe (fixed `gl_PointSize`, solid color) to check submission path; assumption—probe does not violate acceptance gates because it is diagnostic-only. PASS proves traversal; FAIL directs us to scene graph masks.
- Milestone 3 (conditional P≈0.45): Once we confirm point submission, revert probe, tune motion/alpha to hit under-finger ≤2-frame visibility and remove `forceVisible`. Assumptions—fluid displacement and temp-force drivers already behave per current logs.

D) Single change to test next
- Extend `RenderInfoLogger` to emit one `[PC] points-mesh` snapshot when draws are first detected, including `{type, visible, frustumCulled, renderOrder, parentType, matrixWorldDet, positionCount, colorCount, uvCount, depthCount, materialUuid}` so we can conclusively classify the failure as “no geometry” vs “not submitted”.

E) Run plan
- Build/start per runbook: `pnpm --filter cryptiq-mindmap-demo run build` then `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP smoke: navigate to `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1`, capture console to `cursor-ooda-ink-prototype/console/<commit>/<branch>/<ts>/console-mcp.json`, verify new `[PC] points-mesh` log alongside `[PC] render-info`.
- Playwright smoke: `BASE_URL=http://127.0.0.1:3000 SMOKE_ROUTE="/quiz/archetype-v1?pc=scene-03&forceVisible=1" RUN_ID=$(date -u +%Y%m%d-%H%M%S) SMOKE_OUT_DIR=.clmem/artifacts/ink SMOKE_CONSOLE_OUT=.clmem/artifacts/ink-console pnpm exec playwright test tests/ink.smoke.spec.ts --reporter=line`, then archive screenshot/console per runbook.
- Acceptance for this iteration: PASS if `[PC] points-mesh` reports `positionCount > 0` and (ideally) `renderer.info.render.points > 0`; FAIL otherwise, guiding whether we fix binding or traversal next.
