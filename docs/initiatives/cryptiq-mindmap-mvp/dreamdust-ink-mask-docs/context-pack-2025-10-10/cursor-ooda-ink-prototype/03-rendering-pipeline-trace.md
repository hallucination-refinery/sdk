---
title: Rendering Pipeline Trace – Ink Prototype
date: 2025-10-16T14:01:49Z
commit: 1f06bd27
branch: docs/ink-falloff-flag-latch-2025-10-12
tags: [pipeline, uniforms, fluid, shader]
---

## Stage Graph
- **Pointer capture → splats**: `InkSurface` resolves pointer UVs, clamps within `[0,1]`, and emits heatmap samples plus `onForceSplat` packets with normalized radius/strength for every stroke update (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:273-337`). `PointCloudStage` wires that callback straight into the fluid sim and logs each splat for traceability (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3210-3221`).
- **Fluid velocity integration**: `FluidSim.addForce` writes each splat into `velocity.write` and immediately swaps the ping-pong targets; `step()` then runs advect → divergence → Jacobi (×iterations) → project across fullscreen passes (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:55-245`).
- **Uniform bridge**: On sim bootstrap we seed `uVelocity`, `uVelTexInvSize`, `uVelToNdc`, and `uInkBlend`, then `FluidDriver` refreshes them every frame from the active render targets and tuning refs (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1427`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`).
- **Material vertex displacement**: The Dreamdust vertex shader converts clip → NDC → screen UV, clamps sampling borders, fetches velocity, scales by `uVelToNdc`, and mixes displacement gated by `uInkBlend` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-528`).
- **Point-sprite shading**: `<points>` geometry renders sprites whose fragment shader handles reveal noise, depth fade, and ink tint before writing premultiplied RGBA (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3319-3341`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:596-691`).

## Per-Stage I/O

### Pointer Sampling → Splats
| Inputs | Outputs | Frequency (per event/per frame) | Data Types/Targets | Key Functions/Files |
| --- | --- | --- | --- | --- |
| Pointer events with canvas bounds and normalized UV resolution (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:273-313`) | `onForceSample` deltas and `onForceSplat` packets `{ uv, radius, strength }` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:315-325`) | Per pointerdown/move/up while drawing (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:346-452`) | UV in `[0,1]²`, radius = `BRUSH_RADIUS_PX / TEXTURE_SIZE`, strength clamped ≤1 (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:324`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:46-49`) | `drawAtClient`, `handlePointerMove`, `onForceSplat` wiring to the stage (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:296-337`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3210-3226`) |

### Fluid Simulation → Velocity Field
| Inputs | Outputs | Frequency (per event/per frame) | Data Types/Targets | Key Functions/Files |
| --- | --- | --- | --- | --- |
| Splat UV/radius/strength routed into `FluidSim.addForce`; frame delta delivered via `FluidDriver` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:191-206`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`) | Ping-pong velocity textures containing XY flow, divergence cache, and pressure field (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:206-245`) | `addForce` per splat; `step` once per rendered frame (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:191-245`) | WebGL2 `WebGLRenderTarget` sized `FLUID_GRID_SIZE²`, `RGBAFormat`, `LinearFilter`, `HalfFloatType` when available (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:40-107`) | Fullscreen passes controlled by `addForce`, `step`, `swap`, and `renderPass` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:55-175`) |

### Uniform Binding → Dreamdust Material
| Inputs | Outputs | Frequency (per event/per frame) | Data Types/Targets | Key Functions/Files |
| --- | --- | --- | --- | --- |
| Fluid velocity texture + inverse grid size, `velToNdc`/`inkBlend` refs, temp force accumulators (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1196-1240`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1528-1605`) | Updated uniforms on the material and stage wrapper (`uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend`, `uTemp*`) (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1427`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1528-1605`) | Frame loop (sim driver) with additional writes on pointer activity and reveal start (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2361-2374`) | GPU sampler2D (`uVelocity`), vec2 inverse size, scalar gains, temp vectors (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:94-111`) | `FluidDriver`, `TempForceDriver`, reveal bootstrapper (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-927`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:104-124`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2356-2374`) |

### Dreamdust Material — Vertex & Fragment
| Inputs | Outputs | Frequency (per event/per frame) | Data Types/Targets | Key Functions/Files |
| --- | --- | --- | --- | --- |
| Stage uniforms (`uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend`, `uTemp*`, ink textures) plus point attributes (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:220-279`) | Displaced `gl_Position`, varyings for reveal/tint, premultiplied `gl_FragColor` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-691`) | Per vertex and fragment of each point sprite (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:314-529`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:596-691`) | `sampler2D` velocity lookups, vec2 displacement, float mix gates, premultiplied color output (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-528`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:596-691`) | Dreamdust vertex/fragment programs emitted by `createDreamdustMaterial` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:695-780`) |

### Render Submit → Point Sprites
| Inputs | Outputs | Frequency (per event/per frame) | Data Types/Targets | Key Functions/Files |
| --- | --- | --- | --- | --- |
| `<points>` geometry populated with stage UVs/colors and Dreamdust material instance (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3319-3341`) | Rasterized sprite field obeying fluid-driven displacement and ink shading (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-691`) | Per frame while stage is mounted (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3208-3341`) | GPU draw call with premultiplied blending and depth test toggles (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:770-779`) | `<points>` node attached to Dreamdust shader (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3319-3341`) |

## FluidSim Pass Ordering & Targets
1. **addForce** – splats into `velocity.write` then swaps ping-pong so the new field becomes `read` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:191-204`).
2. **Advect** – `velocity.read` → `velocity.write`, followed by a swap to promote advected data (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:212-219`).
3. **Divergence** – samples the fresh velocity without swapping targets, storing in the dedicated divergence render target (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:220-224`).
4. **Jacobi × iterations** – clears both pressure buffers, then repeatedly writes into `pressure.write` and swaps with each loop (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:225-236`).
5. **Project** – writes the divergence-free velocity into `velocity.write`, consumes the pressure field, and swaps once more to expose the solved velocity (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:238-245`).
6. **swap helper** – shared ping-pong swapper used after every write to maintain the read/write contract (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:55-59`).

## Uniform Lifetimes & Ranges
| Uniform | Default | Range / Invariant | Writers | Notes |
| --- | --- | --- | --- | --- |
| `uTempForce` | `[0,0]` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:94-95`) | Clamped per-axis into ±`TEMP_FORCE_CLAMP` (12) with scaled pointer deltas (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1576-1584`) | Seeded at mount, updated on pointer splats and decayed by driver (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1528-1531`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1568-1605`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:104-124`) | Mirrors pointer velocity; guard logs surface anomalies (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:203-222`) |
| `uTempIntensity` | `0` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:95`) | `[0,1]`, soft-kneed before reaching 1 (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1600-1618`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:410-416`) | Initialized to 0, boosted per splat, exponentially decayed each frame (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1528-1531`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1568-1605`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:104-124`) | Drives transient screen-space push during active strokes |
| `uTempCenter` | `[0.5,0.5]` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:96`) | Always clamped to `[0,1]²` via pointer UVs (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1605-1625`) | Set on init, pointer updates, and reveal bootstrap (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1520-1524`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1568-1605`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2361-2364`) | Aligns falloff center with fingertip |
| `uTempRadius` | `0.16` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:97`) | Clamped >0; reveal sets `TARGET_TEMP_RADIUS` 0.14 (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:53-54`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2361-2364`) | Applied when reveal starts and when falloff debug helpers run (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2356-2374`) | Tightens force focus during reveal cascade |
| `uTempFalloffOn` | `0` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:98`) | Set to 1 when falloff requested or reveal begins (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1513-1524`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2356-2374`) | Toggle persists after activation; helpers ensure state remains latched (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1551-1564`) | Enables radial tapering inside shader (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:417-425`) |
| `uVelocity` | 1×1 Float placeholder texture (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:99-105`) | Always points at `FluidSim.velocity.read.texture` (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1400`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-907`) | Initialized after sim creation and refreshed each frame (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1407`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-907`) | GPU sampler; swap-aware so `read` side stays current (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:55-59`) |
| `uVelTexInvSize` | `[1,1]` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:106`) | `[1/size, 1/size]` for grid size; updates whenever sim reports new inverse (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1397-1399`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:909-913`) | Seeded at sim init then refreshed per frame (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1400`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-913`) | Used to clamp screen-space samples (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:522-523`) |
| `uVelToNdc` | `0.0` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:107`) | Positive scalar; toggles between base 0.028 and debug 0.045 depending on URL flag (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:55-60`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1234-1235`) | Written at sim init, whenever debug mode toggles, and each frame in the driver (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1400`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-917`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1423-1427`) | Controls screen-space displacement amplitude (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-527`) |
| `uInkBlend` | `1.0` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:108`) | Blend factor ∈[0,1]; base 0.78 or debug 1.0 (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:57-60`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1234-1235`) | Same lifecycle as `uVelToNdc`, including per-frame enforcement in `FluidDriver` (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1406`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1423-1427`) | Interpolates between raw clip position and displaced position (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:527-528`) |

## Screen-Space Displacement Details (Vertex)
1. Multiply clip position to get NDC and screen UV (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:520-522`).
2. Clamp sampling UV inside a guard band derived from `uVelTexInvSize` to avoid bleeding across ping-pong borders (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:522-524`).
3. Verify UV lies inside `[0,1]²` before sampling the velocity texture (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:524-525`).
4. Scale the sampled velocity by `uVelToNdc` to convert fluid space → NDC displacement (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:526`) and mix against the original clip position with `uInkBlend` (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:527-528`).

## Verification Hooks
- `[PC] fluid uniforms prime` confirms sim bootstrap, reports inverse size and coupling parameters (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1390-1407`).
- `[PC] fluid init` fires once from `FluidSim.step`, echoing grid resolution and iteration count (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:247-254`).
- `uniforms after-reveal` snapshot logs falloff radius, force scale, and fluid settings after geometry reveal (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2356-2374`).
- Optional `window.dreamdust.dumpUniforms()` helper can be triggered mid-run to inspect temp-force uniforms when `[PC] mid-stroke uniforms dump (request)` appears (`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:337-343`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1533-1564`).

### Smoke Evidence (STUB)
- [STUB: smoke_evidence_summary]
- [STUB: perf_metrics_from_last_run]
- [STUB: screenshots_links]

## Tuning Knobs Catalog
- **Fluid**
  - `FLUID_GRID_SIZE` (default 256) – increases resolution of the velocity field at higher GPU cost (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:55`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:96-101`).
  - `FLUID_JACOBI_ITERS` (default 10) – trades per-frame Jacobi iterations for more stable projection (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:56`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:87-90`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:228-236`).
  - `FLUID_FORCE_GAIN` (planned) – currently realized by `TEMP_FORCE_SCALE` (220) when scaling pointer deltas before clamping to `TEMP_FORCE_CLAMP`; consider hoisting into a dedicated constant so force tuning aligns with other fluid knobs (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:49-58`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1568-1593`).
- **Display Coupling**
  - `uVelToNdc` toggles displacement amplitude between baseline and debug boosts (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1234-1235`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-917`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:519-527`).
  - `uInkBlend` blends raw clip vs displaced clip; debugging sets it to 1 to visualize full velocity influence (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1234-1235`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:527-528`).
- **Visibility Gates**
  - `uAlphaFloor` ensures sprites never vanish fully; lower values risk hidden particles (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:547-624`).
  - `uPointBaseSize` controls core sprite diameter; set via uniform defaults and staging logic (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:64`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1360-1372`).
  - Material blending/depth toggles switch between additive vs normal pipelines when presets change (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:770-779`).

## Performance Notes
- Target frame budgets for acceptance: `[dreamdust] frame-percentiles` expects `p50` ≈ 8–9 ms and `p90` ≈ 9–10 ms after the long stroke, so fluid passes plus Dreamdust draw must stay within that envelope (`docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-test-protocol.md:36-41`).
- Fluid GPU cost scales with additional fullscreen passes per frame (advect/divergence/Jacobi/project) – monitor when tweaking grid size or iterations (`apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:206-245`).
- Material cost rises with vertex ink, cascade effects, and sprite tinting; toggling vertex ink fallback increases fragment sampling work (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:361-528`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:596-691`).
- [STUB: perf_budget_link]

## Failure Modes Matrix
| Symptom | Likely Stage | File / Check | Quick Diagnostic |
| --- | --- | --- | --- |
| Particles invisible despite logs | Visibility gating | `uAlphaFloor`, `uPointBaseSize`, blending (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:547-779`) | Verify `uniforms after-reveal` shows sensible radius/force scale and alpha floor >0 (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2356-2374`) |
| No motion after splats | Uniform bridge / FluidSim | Ensure `fluid splat` logs fire and `FluidDriver` updates `uVelocity` (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:3210-3221`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-920`) | Call `window.dreamdust.dumpUniforms()` to confirm `uTempIntensity` and `uVelocity` update, and re-check `[PC] fluid init` for sim health (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1533-1564`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts:247-254`) |
| Black screen or GL errors | Material compilation | Shader factory and GLSL chunks (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:695-780`) | Look for compile errors in DevTools; fallback log `[Dreamdust] compile timeout — falling back to PointsMaterial` indicates shader failure (`docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-20-test-protocol.md:40-46`) |
| Velocity sampling seams | Screen-space displacement | Clamp guard and `uVelTexInvSize` handling (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:522-528`) | Confirm grid size matches velocity texture and no debug mode forced wrong inverse size (`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1397-1400`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:904-913`) |

## Cross-Links
- See also `context-pack-2025-10-10/02-architecture-overview.md` for the canvas-wide orchestration.
- Pending `context-pack-2025-10-10/04-state-and-uniforms-audit.md` – align uniform notes here once that audit is published.
- Reference `context-pack-2025-10-10/10-latest-smoke-evidence.md` for the most recent capture set.
- [STUB: runbook_link]

