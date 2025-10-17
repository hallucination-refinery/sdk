title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-17T18:26:00Z
commit: e68bd701
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- Diagnostic smoke at `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1` still produces blank MCP/Playwright screenshots despite the bypass slamming uniforms and material state (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md:7-42, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/assets/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/2025-10-17-forceVisible-mcp.png).
- `PointCloudStage` logs confirm the override set `uReveal=1`, `uAlphaFloor=1`, `uPointBaseSize=8`, widened clamps, and flipped depth/blend on both materials (1751:1793:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/console-mcp.json).
- Prebaked geometry loads and reports 90 650 instances with UV/depth buffers populated (2631:2634 & 2980:2983:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/console-mcp.json).
- Fluid sim still primes and steps normally; uniforms bridge stays alive (1406:1447:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, 206:254:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts).
- Acceptance gates remain blocked exclusively on visibility; shader gate and automation both pass (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/01-vision-and-acceptance.md:9-21, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md:33-42).

**B1) Reflection**
- Last plan assumed depth/alpha gating; the forceVisible run disproved that—depthTest and alpha floor were bypassed yet the frame stayed blank (1751:1793:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/assets/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180257/ink-chromium-20251017-180257-post.png). We spent a cycle implementing the bypass, which was necessary, but we should have simultaneously captured renderer stats to learn whether any draw calls fired. Future probes must log draw counts alongside visual checks to avoid repeating blind runs.

**B2) Hypotheses & unknowns**
- P≈0.45 — Renderer is not issuing draw calls for the Dreamdust material (e.g. stage points still bound to a fallback or material swap races before render); no `renderer.info.render` telemetry exists so this remains unproven (595:732 & 3388:3434:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx). PASS if render counts >0.
- P≈0.35 — Draws occur but fragment output collapses to black (e.g. missing/zeroed color attribute or tint mix driving final RGB to zero despite alpha=1) (3050:3063:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, 463:692:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts).
- P≈0.15 — Geometry sits behind/around the camera after PCA transform, so additive output never intersects the camera frustum (1938:2134 & 3390:3433:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx). Needs camera-space probe.
- P≈0.05 — Uniform overrides are later reverted by preset sync (`useDreamdustUniforms`) before the first render; logs show correct values immediately after the override but we lack a post-frame sample (863:935:apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts).

**C) Golden Path**
- Milestone 1 (P≈0.6): Capture frame-level renderer stats (draw/points counts plus active material) under `forceVisible` to separate “no draw” from “draw but black”; assumption: logging instrumentation does not perturb render timing.
- Milestone 2 (P≈0.5): If draws are zero, trace material binding (stagePointsRef, useFallback watchdog) and ensure Dreamdust material survives preset churn (595:748 & 1649:1707 & 3339:3434:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx).
- Milestone 3 (P≈0.4): If draws are non-zero, probe shader output by temporarily forcing a solid debug color or bypassing tint sampling; assumption: renderer stats confirm fragment stage is running beforehand.

**D) Single change to run next**
- Instrument `PointCloudStage` so that when `forceVisible` is active we log, once per run, the active material on `stagePointsRef`, the renderer’s `info.render` counters, and the resolved uniform values after a `requestAnimationFrame`; PASS if logs show `render.points > 0` and material === `prebakedMaterial`, FAIL otherwise (1209:1213, 1751:1793, 3388:3434:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx).

**E) Run plan**
- Build & serve: `nvm use 20 && pnpm --filter cryptiq-mindmap-demo run build && pnpm --filter cryptiq-mindmap-demo run start` (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/09-runbooks.md:5-14).
- MCP smoke: `browser_navigate` to `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1`, capture console to `cursor-ooda-ink-prototype/console/{commit}/{branch}/{ts}/console-mcp.json`, save screenshot alongside it.
- Playwright smoke: `BASE_URL=http://127.0.0.1:3000 SMOKE_ROUTE="/quiz/archetype-v1?pc=scene-03&forceVisible=1" RUN_ID=$(date -u +%Y%m%d-%H%M%S) SMOKE_OUT_DIR=.clmem/artifacts/ink SMOKE_CONSOLE_OUT=.clmem/artifacts/ink-console pnpm exec playwright test tests/ink.smoke.spec.ts --reporter=line`, then copy artifacts to the context-pack folders.
- Evidence: archive the new console JSON, renderer-stat log line, and screenshots; update `10-latest-smoke-evidence.md` with PASS/FAIL and artifact paths.
