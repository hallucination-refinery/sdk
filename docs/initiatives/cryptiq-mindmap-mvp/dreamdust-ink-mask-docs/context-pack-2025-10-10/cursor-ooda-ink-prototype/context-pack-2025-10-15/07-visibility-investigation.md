---
title: Visibility Investigation – ForceVisible Diagnostic
date: 2025-10-17T18:26:00Z
commit: e68bd701
branch: docs/ink-falloff-flag-latch-2025-10-12
---

## Evidence intake
- Latest smoke entry confirms the `forceVisible=1` run, blank MCP/Playwright captures, and additive/depthTest overrides applied (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md:7-42, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/assets/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/2025-10-17-forceVisible-mcp.png).
- Console artifacts record uniform and material overrides, instance counts, and fluid init (`[PC] forceVisible uniforms`, `[PC] forceVisible applied`, `[PC] instances: 90650`) (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/console-mcp.json).
- Automation logs show Playwright PASS despite black frames, proving app instrumentation—not Playwright—drives the FAIL (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180257/console-chromium-20251017-180257.json).

## Code audit highlights
- **Material override path** – `forceVisible` effect sets uniforms and flips depth/blend on both Dreamdust materials (1751:1793:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx). `createDreamdustMaterial` logs preset variants and defaults depthTest=true unless we override (720:795:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts).
- **Geometry/attribute binding** – Prebaked buffers and color attributes flow through `stagePointsRef`, with warnings if color missing (2931:3063 & 2994:3093:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx).
- **Shader behaviour** – Vertex shader clamps `gl_PointSize` via `uPointBaseSize`, `uMinSize`, `uMaxSize`, and fragment shader only discards for `alpha <= 0.001` after reveal mix/depth fade (432:458 & 596:692:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts; 114:134:apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts).
- **Uniform lifecycle** – `useDreamdustUniforms` seeds defaults from presets and can resubscribe after preset drift (863:935 & 1121:1167:apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts); `PointCloudStage` still enforces preset-scale point size (`setUniform('uPointBaseSize', DEFAULT_POINT_SIZING.baseSize * pointSizeScale)`) alongside overrides (2246:2259:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx).
- **Fluid & input** – Fluid sim continues to prime/step normally (1406:1447:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, 206:254:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts); `InkSurface` still emits splats/heatmap per pointer path (296:337:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx).

## Findings
- The bypass executed as designed—uniforms are pinned, materials flipped to additive, and prebaked geometry counts remain high—yet no pixels land, eliminating alpha/depth gating as the blocker (1751:1793 & 3388:3434:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/console-mcp.json).
- Renderer statistics are absent; we cannot tell if Dreamdust ever issues draw calls or if R3F is falling back to an uncoloured material, keeping the root cause ambiguous.
- The preset watcher still logs drift (`[PC] Preset drifted …`), so subsequent runs could revert overrides without notice unless we probe the post-frame material state (1000:1059 & 1751:1793:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx).

## Risks & follow-ups
- Without renderer counters we risk chasing shader issues when the draw call count might actually be zero—high priority to log `renderer.info.render` during diagnostics.
- Preset reapplication may silently reset uniforms even under `forceVisible`; capture the post-frame uniform snapshot before assuming shader maths is wrong.
- If draws occur, investigate color/tint paths (attribute presence, `uInkTex`) before altering physics or camera transforms.
