title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-16T19:48:20Z
commit: 63719177
branch: docs/ink-falloff-flag-latch-2025-10-12
---

A) Where we are
- Latest prod smoke still returns blank screenshots plus reveal logs despite size override (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md:7-35).
- Fluid pipeline primes velocity uniforms, logs after reveal, and `FluidSim` emits its init banner, so the sim is ticking (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1418-1422, apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2396-2404, apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:191-254).
- Dreamdust defaults keep `uPointBaseSize=3.0` and `uAlphaFloor=0.15`; `PointCloudStage` reads `simParamPointBaseSize`, yet we lack instrumentation that proves the post-preset value (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:64-112, apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts:166-233, apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2246-2259).
- Material dispatch still depth-tests and applies an exponential depth fade, compounding alpha losses beyond the configured floor (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:432-528, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:596-692, apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:114-134).
- Acceptance gates expect visible under-finger motion within ≤2 frames; the current evidence is a hard FAIL on visibility (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/01-vision-and-acceptance.md:9-21, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md:10-35).

B) Hypotheses & unknowns
- P≈0.6 — Depth-test + depth fade are zeroing the sprite before color: `depthTest: true` plus `exp(-depthNorm * uDepthBias)` can crush alpha once the cloud sits behind the scanned mesh; disabling depth test and slamming alpha should immediately reveal whether occlusion is the culprit (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:596-692, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:748-759, apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:114-134).
- P≈0.3 — Effective footprint is still too small: even with `uPointBaseSize` override the attenuation clamp (`uMinSize=1.2`, `uMaxSize=9.0`) and depth fade leave a <6 px sprite that disappears under tone mapping; forcing a larger clamp exposes whether footprint, not occlusion, is the limiter (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:432-458, apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts:166-233).
- P≈0.1 — URL override is being overwritten post-preset swap, so we are still running at the preset’s 3.0 base size; we need a log of the final uniform values to rule this out (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2246-2259, apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts:863-935).

C) Golden path
- Milestone 1 (P≈0.7): Introduce a `?forceVisible=1` bypass that disables depth testing, sets `uAlphaFloor=1`, and logs the resolved point-size cluster to confirm the renderer can actually draw the cloud (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2246-2259, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:748-759). Assumption: instrumentation lands without touching baseline presets.
- Milestone 2 (P≈0.6): Once the cloud is visible, restore depth test but keep `uAlphaFloor≥0.3` and widen the clamp to keep a ~10% footprint while monitoring overdraw (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:432-692). Assumption: widening size does not blow perf beyond p50 10 ms.
- Milestone 3 (P≈0.5): Nudge `uVelToNdc`/`uInkBlend` only after visibility is proven to achieve ≤2-frame motion without destabilizing reveal logs (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1250-1399, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-528). Assumption: fluid displacement remains linear in this regime.

D) Single change to test next
- Add a guarded `forceVisible` path in `PointCloudStage` that, when the query param is present, sets `uAlphaFloor=1`, pushes the point-size clamp to 12 px, flips the Dreamdust material’s depthTest off, and logs the final uniform bundle after preset application; PASS if the MCP screenshot shows a saturated particle sheet within two frames, FAIL if the screen remains blank (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2246-2259, apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3308-3317, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:748-759).

E) Run complete (2025-10-17T18:02:57Z)
- forceVisible=1 → FAIL (visibility) because bypass correctly applied (depthTest=false, blending=2/additive, applied=true logged) but screenshots remain black; geometry present (90650 instances); shader gate clean; no THREE.WebGLProgram errors. Issue is NOT gating.
- Next: investigate material instance binding to stagePointsRef, add gl_PointSize vertex probe, check renderer.info.render.calls for draw submission, or verify preset swap doesn't revert blend/depth post-override.

