# Dreamdust GPGPU Pipeline — 2025-09-24 Audit

## Intro

This brief documents how ink strokes travel through the Dreamdust stack and into the
GPGPU particle renderer. It pulls fresh context from the codebase so the 2025-09-24
investigation into stalled displacement and cascade tinting can proceed with shared
terminology.

## Pipeline overview

1. Ink gestures update the runtime uniforms created by
   `useDreamdustUniforms` in
   `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts`,
   which exposes setters for reveal, cascade, ink, and simulation tunables.
2. When the sim engine gate is enabled, `PointCloudStage` instantiates
   `ParticleSim` from
   `apps/cryptiq-mindmap-demo/app/components/dreamdust/sim/ParticleSim.ts`,
   filling position/velocity/color textures and ping-pong framebuffers.
3. `PointCloudStage` bridges the sim output into the stage geometry and updates
   the Dreamdust shader uniforms and attributes before each frame.
4. `makeDreamdustMaterial` in
   `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
   consumes the uniforms, fetching vertex positions from the sim texture when the
   `USE_SIM_POS` define is active and blending ink/cascade contributions in the
   fragment stage.

## Uniform driver evidence

- Defaults: `DEFAULT_UNIFORM_VALUES` seeds time, ink, reveal, and cascade
  parameters (for example `uTime: 0` and `uCascade: 0`) inside
  `useDreamdustUniforms` to guard against undefined GLSL inputs.
- Sim tunables: `createSimUniforms` reads query/env overrides such as
  `simNumParticles`, clamps them via `sanitizeParticleCount`, and freezes unused
  sparkling channels at zero to avoid noise until explicitly enabled.
- Timelines: `tick` advances `uTime`, animates `uBreath`, and eases reveal
  progress with `cubicEaseInOut`. The cascade timeline applies ramp/hold/decay
  logic and writes `uCascade`, `uCascadeSizeBoost`, and `uVaporGain` each frame.
- Logging: `safeLog` emits reveal and cascade start/end markers while
  `logOnce('ink-tex bind', metrics)` records the first ink texture binding with
  extracted width/height/needsUpdate data so latency and asset churn can be
  measured.
- Engine gating: `detectSimEngine` requires `?engine=sim` or `DD_ENGINE=sim`
  before `simEngineActive` is true, ensuring the heavy GPGPU path does not run by
  default. `detectAiryPreset` and `detectInkBump` reuse the gate to pick preset
  breathing/cascade tunables only when simulation is live.

## Simulation buffers

- Construction: `ParticleSim.createSim` allocates two floating-point position
  textures, two velocity textures, one byte color texture, and matching
  framebuffers, then seeds them via the `INIT_SHADER` program before copying into
  the ping-pong targets.
- Geometry extraction: Bounding boxes are computed for spawn data to derive
  `boundsCenter` and `boundsRadius`, and UV coordinates are generated per
  particle for later vertex texture fetches.
- Update loop: `ParticleSim.update` swaps between the framebuffer pair, binds the
  previous position/velocity textures, and writes the next state with curl noise
  and gravity uniforms. A one-time `[engine] sim on` log confirms activation with
  particle count and texture resolution.

## Stage integration

- Instantiation: `PointCloudStage` memoizes the `useDreamdustUniforms` API,
  gates simulation via `const simEnabled = simEngineActive`, and lazily constructs
  `ParticleSim` once the WebGL renderer is ready.
- Sim source: `simSource` slices prebaked point clouds or streamed buffers to the
  requested particle budget and hands them to `ParticleSim.createSim`. The stage
  stores `simState` with the GLSL UVs, depth scalars, and ping-pong texture size
  so later hooks can bind attributes and camera fit heuristics.
- Uniform fan-out: `SimDriver` attaches to the R3F render loop, calling
  `sim.update(delta)` and pushing `uSimPositionTex`/`uSimColorTex` into both the
  stage uniforms and the active material instance. It toggles `USE_SIM_POS` and
  `USE_SIM_COLOR` defines when the sim is active.
- Instrumentation: the `onCreated` handler logs runtime caps (`vertexInkOk`,
  float support, DPR) via `logOnce('caps', …)` and propagates them to the
  Dreamdust context. Ink surfaces echo `[PC] ink tex updated` the first time a
  stroke arrives.
- Cascade trigger: `InkSurface.onEnd` forwards stroke completions to
  `startCascade`, which resets the cascade uniforms before the next `tick` cycle
  expands them.

## Shader consumption

- Vertex stage: When `USE_SIM_POS` is defined, `DreamdustMaterial` fetches
  positions from `uSimPositionTex` using the `aSimUv` attribute and reconstructs
  world space via `dreamdustUnproject`. Depth-only fallbacks reuse `aDepth` when
  the sim is inactive.
- Ink offsets: `USE_VERTEX_INK` allows `dreamdustSampleInk` results to nudge
  `viewPos.xy`, inflate point size, and tint the sprite per vertex when
  `uVertexInkOk > 0.5` and `uInkIntensity` is non-zero.
- Fragment stage: Vapor sprites apply `dreamdustSoftSprite`, reveal noise, and
  rim lighting before premultiplying alpha. If vertex ink is disabled, the
  fragment fallback samples `uInkTex` again to avoid mismatch between vertex and
  fragment paths.

## Uniform and attribute reference

| Name                | Source                                             | Default              |
| ------------------- | -------------------------------------------------- | -------------------- |
| `uTime`             | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `0`                  |
| `uViewport`         | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `[1, 1]`             |
| `uInkTex`           | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `null`               |
| `uInkIntensity`     | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `1`                  |
| `uReveal`           | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `1`                  |
| `uBreath`           | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `0.5`                |
| `uCascade`          | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `0`                  |
| `uCascadeSizeBoost` | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `0`                  |
| `uVaporGain`        | `useDreamdustUniforms` → `DEFAULT_UNIFORM_VALUES`  | `0`                  |
| `uSimPositionTex`   | `makeDreamdustMaterial` → `DEFAULT_UNIFORM_VALUES` | `null`               |
| `uSimColorTex`      | `makeDreamdustMaterial` → `DEFAULT_UNIFORM_VALUES` | `null`               |
| `aSimUv`            | `PointCloudStage` binds `simState.simUvs`          | Derived per particle |

### Simulation tunables

| Name                          | Source                                   | Default             |
| ----------------------------- | ---------------------------------------- | ------------------- |
| `numParticles`                | `useDreamdustUniforms.createSimUniforms` | `0`                 |
| `velocityDamping`             | `useDreamdustUniforms.createSimUniforms` | `0.04`              |
| `gravityY`                    | `useDreamdustUniforms.createSimUniforms` | `-0.05`             |
| `turbulenceStrength`          | `useDreamdustUniforms.createSimUniforms` | `0.4`               |
| `turbulenceTime`              | `useDreamdustUniforms.createSimUniforms` | `1.2`               |
| `turbulencePositionFrequency` | `useDreamdustUniforms.createSimUniforms` | `0.6`               |
| `emitterRadius`               | `useDreamdustUniforms.createSimUniforms` | `0.45`              |
| `emitterVelocityStrength`     | `useDreamdustUniforms.createSimUniforms` | `0.35`              |
| `initialRandomVelocity`       | `useDreamdustUniforms.createSimUniforms` | `0.05`              |
| `sprite.*`                    | `useDreamdustUniforms.createSimUniforms` | `DEFAULT_SIM_CURVE` |
| `rim.*`                       | `useDreamdustUniforms.createSimUniforms` | `DEFAULT_SIM_CURVE` |
| `lifetime.*`                  | `useDreamdustUniforms.createSimUniforms` | `DEFAULT_SIM_CURVE` |

## Guards and gaps

- Present guards:
  - Caps: `PointCloudStage` logs renderer capabilities and clamps device pixel
    ratio during `onCreated` before enabling vertex ink.
  - Ink bind: `useDreamdustUniforms.updateInkTexture` deduplicates texture
    updates and records dimensions for the first bind.
  - Cascade lifecycle: reveal/cascade hooks emit structured `[Dreamdust] …`
    messages so telemetry can correlate uniform state with user interactions.
- Missing coverage:
  - No vertex texture fetch sanity check exists after `SimDriver` swaps in
    `uSimPositionTex`; if the renderer rejects VTF, the stage silently falls
    back to prebaked positions.
  - The `[PC] ink debug` log confirms `vertexInkOk` but there is no analogous
    confirmation that `USE_SIM_POS` ever toggles or that `uSimColorTex` delivers
    gradients.
  - Ink response remains flat even when `uniforms.uVertexInkOk.value` is set to
    `1`, suggesting additional shader-side probes (for example temporary tint
    pulses) are required to prove fragment and vertex ink paths agree.

## Issues observed 2025-09-24

1. **Sim not driving displacement.** Hypothesis: `simEngineActive` defaults to
   false, so `simEnabled` keeps `ParticleSim` bypassed and the geometry continues
   to render prebaked buffers. Verify by forcing `?engine=sim` and inspecting the
   `USE_SIM_POS` define in `PointCloudStage`.
2. **Cascade not affecting sprites.** Hypothesis: `startCascade` zeroes
   `uCascade`/`uVaporGain` on trigger, but the material may never see non-zero
   values if `tick` is not called or if `SimDriver` fails to update uniforms when
   the cascade timeline is inactive. Inspect the `SimDriver` loop alongside the
   `tick` hook to confirm `uCascade` rises above zero during cascade windows.

## Follow-up checkpoints

1. Add a `[Dreamdust] vtf sanity` log inside `SimDriver` after binding
   `uSimPositionTex` so we can track whether the shader receives non-null
   textures on the first frame.
2. Instrument `makeDreamdustMaterial` to emit a warning when `USE_SIM_POS` is set
   but `uSimPositionTex.value` is `null`, catching cases where `ParticleSim`
   failed to initialize.
3. Extend the cascade log to include `uCascade` and `uCascadeSizeBoost` magnitudes
   so QA can correlate cascade fade-outs with fragment tint failures.
