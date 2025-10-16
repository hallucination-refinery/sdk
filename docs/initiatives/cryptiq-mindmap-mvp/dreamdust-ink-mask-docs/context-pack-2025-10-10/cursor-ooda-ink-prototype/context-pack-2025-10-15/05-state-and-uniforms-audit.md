---
title: State & Uniforms Audit – Temp/Velocity Controls
date: 2025-10-16T19:15:43Z
commit: 4aeec57e
branch: docs/ink-falloff-flag-latch-2025-10-12
tags: [state, uniforms, ink, fluid]
---

## Uniforms Overview
The Temp uniform cluster (`uTempForce`, `uTempIntensity`, `uTempCenter`, `uTempRadius`, `uTempFalloffOn`) digests normalized pointer deltas from `InkSurface`, clamps them in `applyTempForce`, and replays them through `TempForceDriver` so DreamdustMaterial only applies a softened, falloff-aware shove when intensity stays above the decay floor.[IS-UV][PS-Event][PS-Decay][DM-TEMP] Post-reveal we pin the falloff flag and radius so every stroke inherits a predictable footprint even if the reveal hook races a user tap.[PS-Reveal][IS-Start]

The Velocity cluster (`uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend`) keeps FluidSim’s ping-pong texture wired to the material: bootstrap binds the texture and inverse size, `FluidDriver` refreshes them each frame, and the vertex shader samples the guarded field only when the mix/scaling gates are active.[PS-FluidInit][PS-FluidFrame][DM-VEL] Force splats and solver loops feed the texture so the mix path described in [03-rendering-pipeline-trace.md](../03-rendering-pipeline-trace.md) sees a divergence-free velocity every frame.[PS-FluidSplat][FS-AddForce][FS-Step][Doc-03]

## Uniforms Matrix
Labels in parentheses (for example `D1`) point to the citation blocks at the end of this document.

| Name | Type/units | Default | Producer(s) | Write timing | Range/clamps | Consumers | Invariants | Failure modes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `uTempForce` | `vec2` impulse in screen pixels mixed to clip (DM-TEMP) | `[0, 0]` (D1) | `TempForceDriver`; `applyTempForce` (PS-Decay, PS-Event) | `init setUniform(0)` (PS-Init); `per-frame decay` (PS-Decay); `pointer delta` (PS-Event) | `±12 clamp before scaling` + `smoothstep falloff` (PS-const, PS-Event, DM-TEMP) | Vertex displacement when intensity >0 (DM-TEMP) | `Finite vector; only applied when uTempIntensity > 1e-4` (PS-Decay, DM-TEMP) | `No shove` → check pointer UV feed and intensity floor (IS-UV, PS-Decay) |
| `uTempIntensity` | `float` [0,1] gate | `0` (D1) | `TempForceDriver`; `applyTempForce` (PS-Decay, PS-Event) | `init zero` (PS-Init); `per-frame exponential decay` (PS-Decay); `pointer events raise` (PS-Event) | `Math.min` clamps to `[0,1]` before the shader’s soft knee/maxGain (PS-Event, DM-TEMP) | Vertex shader strength multiplier (DM-TEMP) | `Must decay smoothly; >1e-4 keeps force alive` (PS-Decay, DM-TEMP) | `Stuck at 0` → delta too small or clamp triggered (IS-UV, PS-Event) |
| `uTempCenter` | `vec2` screen UV | `[0.5, 0.5]` (D1) | `applyTempForce`; reveal latch (PS-Event, PS-Reveal) | `after-reveal centers` (PS-Reveal); `pointer updates` (PS-Event) | `clamp01` from pointer resolve; `smoothstep` distance gate (IS-UV, DM-TEMP) | Falloff center in shader (DM-TEMP) | `Normalized UV; must track latest stroke` (IS-UV, PS-Event) | `Off-center falloff` → reveal latch or pointer UV missing (PS-Reveal, IS-Start) |
| `uTempRadius` | `float` screen radius | `0.16` (D1) | Reveal latch owns target radius (PS-Reveal) | `init default`; `after-reveal sets TARGET_TEMP_RADIUS` (PS-const, PS-Reveal) | `smoothstep` outer radius and px scaling (DM-TEMP) | Shader falloff profile (DM-TEMP) | `>0; kept near 0.14 for scene-03` (PS-const, PS-Reveal) | `Too large` → global shove; `too small` → no motion (PS-Reveal, DM-TEMP) |
| `uTempFalloffOn` | `float` flag (0/1) | `0` (D1) | Reveal latch; fallback guard (PS-Reveal, PS-Init) | `on init when falloff requested`; `after-reveal forced to 1` (PS-Init, PS-Reveal) | `uTempFalloffOn > 0.5` activates screen-space falloff (DM-TEMP) | Enables localized smoothstep (DM-TEMP) | `Should remain 1 post-reveal` (PS-Reveal) | `0 → global jerk` → check reveal log or ensureFalloff helper (PS-Reveal, PS-Init) |
| `uVelocity` | `sampler2D` velocity RT | Dummy 1×1 float texture (D1) | `PointCloudStage` fluid init + `FluidDriver` (PS-FluidInit, PS-FluidFrame) | `init placeholder`; `fluid init bind`; `per-frame swap` (PS-FluidInit, PS-FluidFrame) | `clamped UV sampling with guard` (DM-VEL); texture updated via FluidSim (FS-Step) | Vertex displacement sampler (DM-VEL) | `Must stay non-null; synced with invSize` (PS-FluidFrame, FS-Inv) | `Null/black` → check fluid init log or addForce path (PS-FluidInit, Doc-10) |
| `uVelTexInvSize` | `vec2` texel inverse size | `[1, 1]` (D1) | `FluidSim` via init/driver (PS-FluidInit, PS-FluidFrame) | `fluid init fetch`; `per-frame copy` (PS-FluidInit, PS-FluidFrame) | `Derived from getInvSize()` (FS-Inv); guards sampling clamp (DM-VEL) | Shader guard margin for UV clamp (DM-VEL) | `Matches velocity texture dimensions` (PS-FluidFrame, FS-Inv) | `Zeros` → sampler clamps to border; check driver binding (PS-FluidFrame) |
| `uVelToNdc` | `float` scale (NDC per velocity texel) | `0.0` (D1) | Fluid init + `useEffect` + frame loop (PS-FluidInit, PS-ReactVel, PS-FluidFrame) | `init to base/debug constant`; `updates with fluidBoost`; `per-frame reaffirm` (PS-const, PS-Resolved, PS-FluidFrame) | `if >1e-5` displacement runs; base 0.028, debug 0.045 (DM-VEL, PS-const, PS-Resolved) | Multiplies sampled velocity before mix (DM-VEL) | `Keep positive; track velToNdcRef` (PS-FluidInit, PS-ReactVel) | `0` → no motion; check fluidBoost params and primes (PS-Resolved, Doc-10) |
| `uInkBlend` | `float` mix factor [0,1] | `1.0` (D1) | Fluid init + `useEffect` + frame loop (PS-FluidInit, PS-ReactVel, PS-FluidFrame) | `init to base/debug`; `per-frame refresh` (PS-FluidInit, PS-ReactVel, PS-FluidFrame) | `clamp(0,1)` in vertex shader (DM-VEL) | Mixes displaced vs original clip pos (DM-VEL) | `Stay within [0,1]; couples with vel scaling` (DM-VEL, PS-FluidFrame) | `0` → disables fluid displacement; check primes and tunables (PS-FluidInit, Doc-10) |
| `uAlphaFloor` | `float` min sprite alpha [0,1] | `0.15` (D1 updated) | `DreamdustMaterial` default; runtime tuning via `setUniform` | `init default; adjusted during visibility tuning` | `clamp(0,1)` in fragment (DM‑ALPHA) | Fragment alpha floor in sprite/reveal mix | Higher raises visibility/overdraw; too low hides points | Visibility collapse when near 0 |

## Lifecycle Timelines
### Temp uniform cluster (`uTempForce`, `uTempIntensity`, `uTempCenter`, `uTempRadius`, `uTempFalloffOn`)
1. **Init:** Stage resets force and intensity to zero and honors any falloff request before geometry reveal.[PS-Init]
2. **Reveal gate:** When geometry becomes renderable, stage forces falloff on, seeds center, and clamps radius to `TARGET_TEMP_RADIUS` while logging the checkpoint.[PS-Reveal]
3. **Pointer feed:** `InkSurface` normalizes UVs and emits deltas so `applyTempForce` writes force, intensity, and center with clamps.[IS-UV][PS-Event]
4. **Decay:** `TempForceDriver` reapplies the current force while exponentially decaying intensity toward zero each frame.[PS-Decay]
5. **Shader resolve:** DreamdustMaterial clamps intensity with a soft knee, optionally applies falloff, and scales the force in view-space before adding it to the vertex position.[DM-TEMP]

### Velocity uniform cluster (`uVelocity`, `uVelTexInvSize`, `uVelToNdc`, `uInkBlend`)
1. **Defaults:** DreamdustMaterial seeds a dummy 1×1 RGBA float texture and neutral scalars so shaders link before the sim is ready.[D1]
2. **Fluid init:** Stage constructs `FluidSim`, binds the ping-pong velocity texture, inverse size, and base scaling/blend parameters, and logs the `[PC] fluid uniforms prime` checkpoint.[PS-FluidInit]
3. **Runtime updates:** `FluidDriver` steps the sim every frame, swaps ping-pong targets, copies inverse size into the uniform array, and reasserts the scaling parameters.[PS-FluidFrame]
4. **External forces:** Pointer splats call `FluidSim.addForce`, clamping radius/strength before swapping velocity targets so the next frame sees the updated field.[PS-FluidSplat][FS-AddForce]
5. **Simulation loop:** `FluidSim.step` runs advect → divergence → Jacobi iterations → projection with a clamped `dt`, guaranteeing the velocity texture stays divergence-free.[FS-Step]
6. **Shader mix:** The vertex shader guards the displacement behind `uVelToNdc > 1e-5`, clamps UV sampling to stay inside the fluid atlas, and mixes based on `uInkBlend`.[DM-VEL]

## Ranges, Clamps, and Guards
- `TEMP_FORCE_CLAMP`, the decay floor in `TempForceDriver`, and DreamdustMaterial’s soft knee keep pointer shoves bounded even when boosts are active.[PS-const][PS-Event][PS-Decay][DM-TEMP]
- Pointer UVs are clamped into `[0,1]`, and the initial tap splat enforces a minimum radius so falloff math never divides by zero.[IS-UV][IS-Start]
- `FluidSim.addForce` limits radius to `[1e-4, 0.5]` and strength to `≥0`, stopping runaway splats.[FS-AddForce]
- `FluidDriver` copies the inverse texel size every frame, and the vertex shader clamps UVs plus checks `inside` so velocity sampling never leaves the atlas.[PS-FluidFrame][FS-Inv][DM-VEL]
- `uVelToNdc` must clear the `>1e-5` guard while `uInkBlend` is clamped into `[0,1]`, giving deterministic displacement envelopes for both baseline and debug boosts.[PS-const][PS-Resolved][PS-ReactVel][DM-VEL]
- Observed ranges (scene-03 latest):

| Uniform | Observed |
| --- | --- |
| `uVelToNdc` | 0.028 baseline (debug 0.045) |
| `uInkBlend` | 0.78 baseline; 1.0 with `fluidBoost=1` |
| `uTempRadius` | 0.14 post-reveal |

## Verification Hooks
- `[PC] uniforms after-reveal …` confirms falloff/center/radius writes and records the force scale; log surfaces immediately after reveal.[PS-Reveal][Doc-10]
- `[PC] fluid uniforms prime …` asserts the sim texture, inverse size, and scaling scalars were bound before the first frame.[PS-FluidInit][Doc-10]
- `[PC] fluid init …` is emitted from the sim loop once the first solve completes, proving the ping-pong targets rendered successfully.[FS-Step][Doc-10]
- [INFO] [PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] fluid uniforms prime {invSize: [..], velToNdc: 0.028, inkBlend: 0.78}

## Tuning Knobs & Interactions
`resolvedVelToNdc` and `resolvedInkBlend` flip between conservative baseline (0.028/0.78) and debug boost (0.045/1.0) based on the `fluidBoost` flag, with `FluidDriver` reasserting those scalars every frame so shader displacement follows the selected profile.[PS-const][PS-Resolved][PS-FluidFrame] The guard-and-clamp pattern from the Resources Guide keeps velocity sampling stable and highlights that visibility knobs (`uInkBlend`, point size, tint) remain independent from the physics strength (uVelToNdc/uTemp*), matching the recommended separation of concerns.[Doc-04] Cross-checks against DreamdustMaterial’s mix line make it clear that lowering `uInkBlend` hides fluid motion even if the velocity texture is changing.[DM-VEL]
Additionally, `uAlphaFloor` default has been raised to `0.15` (from `0.0`) to ensure particle visibility during reveal; monitor overdraw/p50 trade‑offs.

## Failure Mode Playbook
| Symptom | Checks | Likely culprit | Fix path |
| --- | --- | --- | --- |
| No particles visible | Confirm `[PC] uniforms after-reveal` ran, `uTempFalloffOn` ≥ 1, and DreamdustMaterial is not discarding alpha/size via sprite, depth, or blend gates; cross-check premult hints in Resources guide | Falloff never latched or visibility gates collapsed the draw | Trigger `ensureFalloff`, bump size/tint per resources, and revalidate alpha floors while keeping pointer UV clamps in range[PS-Reveal][DM-TEMP][DM-SIZE][DM-ALPHA][IS-UV][Doc-04][Doc-10] |
| Particles static | Watch `onForceSplat` console packets, verify `uTempIntensity` stays >1e-4, ensure fluid prime/init logs fired, and confirm `uVelToNdc`/`uInkBlend` exceed their guards in the frame loop | Fluid sim not ingesting force or displacement gates sitting at zero | Recreate FluidSim, replay splats, and tune `fluidBoost` so frame driver updates velocity, invSize, and scaling factors[PS-Event][PS-Decay][PS-FluidInit][PS-FluidFrame][PS-FluidSplat][FS-AddForce][FS-Step][DM-VEL][Doc-10] |

## Cross-References
- Architecture ownership and bridging summary: `02-architecture-overview.md`.[Doc-02]
- Pipeline stage sequencing for these uniforms: `03-rendering-pipeline-trace.md`.[Doc-03]
- Latest console values for reveal/fluid checkpoints: `context-pack-2025-10-15/10-latest-smoke-evidence.md`.[Doc-10]
- Best-practice tuning guidance (including visibility vs physics separation): `context-pack-2025-10-15/04-resources-guide.md`.[Doc-04]
- Runbook operator steps: 09-runbooks.md#2-mcp-browser-smoke-operator-driven.
- Evidence capture
  - Screenshots:
    - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-pre.png`
    - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-post-tap.png`
    - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-post-drag.png`
    - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-debug.png`
  - Console JSON: `cursor-ooda-ink-prototype/console/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190812/console.json`

## Citation Blocks
[D1]
```ts
94:108:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  uTempForce: [0, 0] as [number, number],
  uTempIntensity: 0,
  uTempCenter: [0.5, 0.5] as [number, number],
  uTempRadius: 0.16,
  uTempFalloffOn: 0,
  uVelocity: (() => {
    // Dummy 1x1 black texture so shader compiles; replaced by FluidSim on init
    const data = new Float32Array([0, 0, 0, 1])
    const tex = new (THREE as any).DataTexture(data, 1, 1, (THREE as any).RGBAFormat, (THREE as any).FloatType)
    tex.needsUpdate = true
    return tex
  })(),
  uVelTexInvSize: [1, 1] as [number, number],
  uVelToNdc: 0.0,
  uInkBlend: 1.0,
```

[DM-TEMP]
```glsl
410:427:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  if (uTempIntensity > 1e-4) {
    // Soft-knee on intensity to avoid "global jerk" at higher boosts
    float knee = 0.6;          // start compressing above this
    float maxGain = 1.5;       // limit effective intensity growth
    float t = clamp(uTempIntensity, 0.0, 1.0);
    float soft = t <= knee ? t : knee + (t - knee) / (1.0 + (t - knee) * maxGain);
    vec2 tempForce = uTempForce * soft;
    if (uTempFalloffOn > 0.5) {
      vec4 tempClip = projectionMatrix * viewPos4;
      vec2 tempNdc = tempClip.xy / max(1e-6, tempClip.w);
      vec2 tempSsUv = tempNdc * 0.5 + 0.5;
      float influence = smoothstep(uTempRadius, 0.0, distance(tempSsUv, uTempCenter));
      tempForce *= influence;
      float pxScale = viewDist / max(uFocal, 1e-3);
      tempForce *= pxScale;
    }
    revealPos.xy += tempForce;
    viewPos4 = viewMatrix * vec4(revealPos, 1.0);
    viewPos = viewPos4.xyz;
    viewDist = max(1e-3, -viewPos.z);
  }
```

[DM-SIZE]
```glsl
432:458:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  float attenuation = clamp(uFocal / viewDist, uMinSize, uMaxSize);
  float breathScale = 1.0 + breathPhase * 0.06;
  float cascadeSize = mix(0.0, max(uCascadeSizeBoost, 0.0), cascadeMix);
  float pointSize = uPointBaseSize * attenuation * breathScale * (1.0 + cascadeSize);

  vec3 inkTint = vec3(0.0);
  float inkMix = 0.0;

#ifdef USE_VERTEX_INK
  if (inkSampleIntensity > 1e-5) {
    float pxScale = viewDist / max(1e-3, uFocal);
    vec2 inkOffset = inkSampleOffset * (inkSampleIntensity * uOffsetGain * uInkOffsetBoost * pxScale);
    viewPos.xy += inkOffset;
    pointSize += inkSampleSwell * inkSampleIntensity * uSizeGain * uInkSizeBoost;
    inkTint = inkSampleTint;
    inkMix = inkSampleIntensity * uTintGain * uInkTintBoost;

  }
#endif

  float pointSizeClamped = max(0.0, pointSize);

#ifdef DEBUG_INK_PROBE
  pointSizeClamped *= mix(1.0, 4.0, inkProbe);
#endif

  gl_PointSize = pointSizeClamped;
```

[DM-ALPHA]
```glsl
596:624:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  // Softer disc sprite for vapor look
  float sprite = dreamdustSoftSprite(gl_PointCoord);
#ifdef USE_GAUSSIAN
  sprite = dreamdustGaussianSprite(gl_PointCoord, max(0.1, uSpriteSharpness));
#endif
  float spriteAlpha = pow(max(sprite, 0.0), 0.85);
  float alphaFloor = clamp(uAlphaFloor, 0.0, 1.0);
  float spriteMix = mix(alphaFloor, 1.0, spriteAlpha);

  float threshold = clamp(uNoiseThreshold, 0.0, 1.0);
  float revealNoise = dd_noise2(vRevealCoord);
  float revealStrength = clamp(vRevealMix, 0.0, 1.0);
  if (uReveal >= 0.999) {
    revealStrength = 1.0;
  }
  float w = 0.08;
  if (uReveal >= 0.999) {
    w = 0.14;
  }
  float baseReveal = smoothstep(threshold - w, threshold + w, revealNoise);
  if (uReveal >= 0.999) {
    baseReveal = 1.0;
  }
  float revealAlpha = max(baseReveal, revealStrength * 0.40);

  float alpha = spriteMix * revealAlpha * revealStrength;
  float depthNorm = dreamdustViewDepthNorm(vPosMV, uDepthNormScale);
  alpha *= dreamdustDepthAlpha(depthNorm, uDepthBias);
  if (alpha <= 0.001) discard;
```

[DM-VEL]
```glsl
518:527:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
  if (uVelToNdc > 1e-5) {
    vec2 clip = gl_Position.xy / max(gl_Position.w, 1e-5);
    vec2 uv = clip * 0.5 + 0.5;
    vec2 guard = uVelTexInvSize * 0.5;
    vec2 sampleUv = clamp(uv, guard, vec2(1.0) - guard);
    bool inside = uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0;
    vec2 vel = inside ? texture(uVelocity, sampleUv).xy : vec2(0.0);
    vec2 disp = vel * uVelToNdc;
    gl_Position.xy = mix(gl_Position.xy, gl_Position.xy + disp, clamp(uInkBlend, 0.0, 1.0));
  }
```

[PS-const]
```ts
49:60:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
const TEMP_FORCE_DECAY = 0.92
const TEMP_FORCE_SCALE = 220
const TEMP_FORCE_CLAMP = 12
const _CANVAS_DEBUG_READBACK = process.env.NEXT_PUBLIC_DEBUG_CANVAS === '1'
const TARGET_TEMP_RADIUS = 0.14
const AFTER_REVEAL_LOG_TAG = '[PC] uniforms after-reveal'
const FLUID_GRID_SIZE = 256
const FLUID_JACOBI_ITERS = 10
const FLUID_BASE_VEL_TO_NDC = 0.028
const FLUID_BASE_INK_BLEND = 0.78
const FLUID_DEBUG_VEL_TO_NDC = 0.045
const FLUID_DEBUG_INK_BLEND = 1.0
```

[PS-Init]
```ts
1513:1531:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  const applyFalloffFlagIfRequested = React.useCallback(() => {
    if (!falloffRequestedRef.current) return
      try {
      const uniformsAny = uniforms as any
      const flag = uniformsAny?.uTempFalloffOn?.value ?? 0
      if (flag < 0.5) {
        setUniform('uTempFalloffOn', 1)
      }
      setUniform('uTempCenter', uniformsAny?.uTempCenter?.value ?? [0.5, 0.5])
    } catch {
      /* noop */
    }
  }, [setUniform, uniforms])

  React.useEffect(() => {
    setUniform('uTempForce', tempForceRef.current)
    setUniform('uTempIntensity', 0)
    applyFalloffFlagIfRequested()
  }, [setUniform, applyFalloffFlagIfRequested])
```

[PS-Decay]
```ts
104:124:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
function TempForceDriver({ tempForceRef, tempIntensityRef, setUniform }: TempForceDriverProps) {
  useFrame((_, delta) => {
    const current = tempIntensityRef.current
    if (current <= 1e-4) {
      if (current !== 0) {
        tempIntensityRef.current = 0
        setUniform('uTempIntensity', 0)
      }
      return
    }
    const frameDecay = Math.pow(TEMP_FORCE_DECAY, delta * 60)
    const next = current * frameDecay
    if (next <= 1e-4) {
      tempIntensityRef.current = 0
      setUniform('uTempIntensity', 0)
      return
    }
    tempIntensityRef.current = next
    setUniform('uTempForce', tempForceRef.current)
    setUniform('uTempIntensity', next)
  })

  return null
}
```

[PS-Event]
```ts
1569:1625:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  const applyTempForce = React.useCallback(
    (sample: { delta: [number, number]; uv: [number, number] }) => {
      const { delta, uv } = sample
      const [u, v] = uv
      const [dx, dy] = delta
      if (!Number.isFinite(dx) || !Number.isFinite(dy)) {
        return
      }
      const clampForce = (value: number) =>
        Math.max(-TEMP_FORCE_CLAMP, Math.min(TEMP_FORCE_CLAMP, value))
      const scale = TEMP_FORCE_SCALE * (inkBoostRef.current || 1)
      const fx = clampForce(dx * scale)
      const fy = clampForce(-dy * scale)
      const magnitude = Math.hypot(fx, fy)
      if (magnitude <= 1e-6) {
        return
      }
      tempForceRef.current = [fx, fy]
      const intensity = Math.min(1, magnitude / TEMP_FORCE_CLAMP)
      tempIntensityRef.current = Math.max(intensity, tempIntensityRef.current * 0.5)
      setUniform('uTempForce', tempForceRef.current)
      setUniform('uTempIntensity', tempIntensityRef.current)
      setUniform('uTempCenter', [u, v] as unknown as any)
    },
    [setUniform],
  )
```

[PS-Reveal]
```ts
2361:2374:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
      setUniform('uTempFalloffOn', 1)
      setUniform('uTempCenter', u?.uTempCenter?.value ?? [0.5, 0.5])
      setUniform('uTempRadius', TARGET_TEMP_RADIUS as unknown as any)
      try {
        const rs = (u?.uTempRadius?.value ?? TARGET_TEMP_RADIUS) as number
        const fs = TEMP_FORCE_SCALE
        console.info(`${AFTER_REVEAL_LOG_TAG}`, {
          uTempRadius: rs,
          uTempFalloffOn: 1,
          forceScale: fs,
          velToNdc: Number(velToNdcRef.current.toFixed(4)),
          inkBlend: Number(resolvedInkBlend.toFixed(4)),
          fluidSize: FLUID_GRID_SIZE,
          fluidIters: FLUID_JACOBI_ITERS,
        })
      } catch {
        /* noop */
      }
```

[PS-FluidInit]
```ts
1384:1406:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  React.useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) {
      return undefined
    }
    try {
      const sim = new FluidSim(renderer, {
        size: FLUID_GRID_SIZE,
        iterations: FLUID_JACOBI_ITERS,
      })
      fluidRef.current = sim
      velToNdcRef.current = resolvedVelToNdc
      const inv = sim.getInvSize()
      setUniform('uVelocity', sim.getTexture() as any)
      setUniform('uVelTexInvSize', inv as unknown as [number, number])
      setUniform('uVelToNdc', resolvedVelToNdc as unknown as number)
      setUniform('uInkBlend', resolvedInkBlend as unknown as number)
      try {
        console.info('[PC] fluid uniforms prime', {
          invSize: inv,
          velToNdc: resolvedVelToNdc,
          inkBlend: resolvedInkBlend,
        })
      } catch {
        /* noop */
      }
```

[PS-FluidFrame]
```ts
883:924:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
function FluidDriver({
  fluidRef,
  uniforms,
  velToNdc,
  inkBlend,
}: {
  fluidRef: React.MutableRefObject<FluidSim | null>
  uniforms: DreamdustStageUniforms
  velToNdc: number
  inkBlend: number
}) {
  const frameloop = useThree((state) => state.frameloop)
  React.useEffect(() => {
    if (frameloop === 'demand') {
      invalidate()
    }
  }, [frameloop])
  useFrame(
    (state, delta) => {
      const sim = fluidRef.current
      if (!sim) return
      sim.step(delta)
      const texture = sim.getTexture()
      if (uniforms?.uVelocity && uniforms.uVelocity.value !== texture) {
        uniforms.uVelocity.value = texture
      }
      const inv = sim.getInvSize()
      if (uniforms?.uVelTexInvSize && Array.isArray(uniforms.uVelTexInvSize.value)) {
        const target = uniforms.uVelTexInvSize.value as [number, number]
        target[0] = inv[0]
        target[1] = inv[1]
      }
      if (uniforms?.uVelToNdc) {
        uniforms.uVelToNdc.value = velToNdc
      }
      if (uniforms?.uInkBlend) {
        uniforms.uInkBlend.value = inkBlend
      }
      if (frameloop === 'demand') {
        invalidate()
      }
    },
    1,
  )
  return null
}
```

[PS-FluidSplat]
```tsx
3211:3219:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
        {(sceneId === 'scene-03' || !controlsOverride) && (
          <InkSurface
            mirrorLR={!!ui.mirrorLR}
            mirrorUD={!!ui.mirrorUD}
            onForceSample={applyTempForce}
            onForceSplat={(uv, radius, strength) => {
              console.log('[PC] fluid splat', { uv, radius, strength })
              try {
                fluidRef.current?.addForce(uv, radius, strength)
              } catch (error) {
                console.error('[PC] fluid splat failed', error)
              }
            }}
```

[PS-Resolved]
```ts
1222:1235:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  const [fluidBoost, setFluidBoost] = React.useState(process.env.NEXT_PUBLIC_FLUID_DEBUG === '1')
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    const params = new URLSearchParams(window.location.search)
    if (params.get('fluidBoost') === '1') {
      setFluidBoost(true)
    } else if (params.get('fluidBoost') === '0') {
      setFluidBoost(false)
    }
  }, [])
  const resolvedVelToNdc = fluidBoost ? FLUID_DEBUG_VEL_TO_NDC : FLUID_BASE_VEL_TO_NDC
  const resolvedInkBlend = fluidBoost ? FLUID_DEBUG_INK_BLEND : FLUID_BASE_INK_BLEND
```

[PS-ReactVel]
```ts
1423:1426:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  React.useEffect(() => {
    velToNdcRef.current = resolvedVelToNdc
    setUniform('uVelToNdc', resolvedVelToNdc as unknown as number)
    setUniform('uInkBlend', resolvedInkBlend as unknown as number)
  }, [resolvedVelToNdc, resolvedInkBlend, setUniform])
```

[IS-UV]
```ts
288:324:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
      const rawU = width > 0 ? offsetX / width : Number.NaN
      const rawV = height > 0 ? offsetY / height : Number.NaN
      const u = clamp01(rawU)
      const vRaw = clamp01(rawV)
      const mirror = mirrorRef.current
      const v = mirror.ud ? 1 - vRaw : vRaw
      logInkGuard(rawU, rawV, u, v)
      return { uv: [u, v], width, height }
    }

    const drawAtClient = (client: Vec2, infoOverride?: PointerInfo | null) => {
      const context = ctxRef.current
      if (!context) {
        return
      }
      const info = infoOverride ?? resolvePointer(client)
      if (!info) {
        return
      }
      const {
        uv: [u, v],
        width,
        height,
      } = info
      const canvasX = u * TEXTURE_SIZE
      const canvasY = v * TEXTURE_SIZE
      const lastClient = lastClientRef.current
      if (lastClient) {
        distanceRef.current += Math.hypot(client.x - lastClient.x, client.y - lastClient.y) || 0
        const cb = onForceSampleRef.current
        if (typeof cb === 'function' && width > 0 && height > 0) {
          const dxNorm = (client.x - lastClient.x) / width
          const dyNorm = (client.y - lastClient.y) / height
          cb({ delta: [dxNorm, dyNorm], uv: [u, v] })
        }
        if (typeof onForceSplat === 'function') {
          const movePx = Math.hypot(client.x - lastClient.x, client.y - lastClient.y)
          const strength = Math.min(1, movePx / 24)
          onForceSplat([u, v], BRUSH_RADIUS_PX / TEXTURE_SIZE, strength)
        }
      }
      lastClientRef.current = { x: client.x, y: client.y }
      const lastCanvas = lastCanvasRef.current
      const currentPoint = { x: canvasX, y: canvasY }
      if (lastCanvas) {
        drawBetween(lastCanvas, currentPoint)
      } else {
        paintDisc(currentPoint)
      }
      lastCanvasRef.current = currentPoint
      scheduleFlush()
    }
```

[IS-Start]
```ts
362:392:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
    const handlePointerDown = (event: PointerEvent) => {
      if (!event.isPrimary || drawingRef.current) {
        return
      }
      const domElement = gl?.domElement
      if (!domElement) {
        return
      }
      if (!ctxRef.current) {
        return
      }
      try {
        domElement.setPointerCapture(event.pointerId)
      } catch {
        // Ignore pointer-capture failures (e.g., unsupported elements)
      }
      const pointerInfo = resolvePointer({ x: event.clientX, y: event.clientY })
      pointerStateRef.current = {
        pointerId: event.pointerId,
        startTime: typeof performance !== 'undefined' ? performance.now() : event.timeStamp,
        startClient: { x: event.clientX, y: event.clientY },
      }
      drawingRef.current = true
      lastClientRef.current = null
      lastCanvasRef.current = null
      distanceRef.current = 0
      ctxRef.current.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE) // single-stroke heatmap
      startGuardWatchdog()
      drawAtClient({ x: event.clientX, y: event.clientY }, pointerInfo)
      scheduleFlush()
      try {
        console.log('[PC] draw start')
      } catch {
        // noop
      }
      const cb = onStartRef.current
      if (typeof cb === 'function') {
        try {
          cb()
        } catch {
          // Ignore downstream handler failures
        }
      }
      if (pointerInfo && typeof onForceSplat === 'function') {
        const radius = Math.max(0.06, BRUSH_RADIUS_PX / TEXTURE_SIZE)
        onForceSplat(pointerInfo.uv, radius, 0.6)
      }
    }
```

[FS-AddForce]
```ts
191:203:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  addForce(point: [number, number], radius: number, strength: number) {
    const [px, py] = point
    if (!Number.isFinite(px) || !Number.isFinite(py)) {
      return
    }
    const safeRadius = Math.max(1e-4, Math.min(0.5, radius))
    const safeStrength = Math.max(0, strength)
    this.addForceMaterial.uniforms.uVelocity.value = this.velocity.read.texture
    ;(this.addForceMaterial.uniforms.uPoint.value as THREE.Vector2).set(px, py)
    this.addForceMaterial.uniforms.uRadius.value = safeRadius
    this.addForceMaterial.uniforms.uStrength.value = safeStrength
    this.renderPass(this.velocity.write, this.addForceMaterial)
    swap(this.velocity)
  }
```

[FS-Step]
```ts
206:245:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  step(dt: number) {
    if (!(dt > 0)) {
      dt = 1 / 60
    }
    const clampedDt = Math.min(dt, this.dtClamp)
    const advectSrc = this.velocity.read
    const advectDst = this.velocity.write
    this.advectMaterial.uniforms.uVelocity.value = advectSrc.texture
    this.advectMaterial.uniforms.uDt.value = clampedDt
    this.renderPass(advectDst, this.advectMaterial)
    swap(this.velocity)
    const divergenceSrc = this.velocity.read
    this.divergenceMaterial.uniforms.uVelocity.value = divergenceSrc.texture
    this.renderPass(this.divergence, this.divergenceMaterial)
    this.clearTarget(this.pressure.read)
    this.clearTarget(this.pressure.write)
    for (let i = 0; i < this.iterations; i += 1) {
      const pressureSrc = this.pressure.read
      const pressureDst = this.pressure.write
      this.jacobiMaterial.uniforms.uPressure.value = pressureSrc.texture
      this.jacobiMaterial.uniforms.uDivergence.value = this.divergence.texture
      this.renderPass(pressureDst, this.jacobiMaterial)
      swap(this.pressure)
    }
    const projectVelocitySrc = this.velocity.read
    const projectVelocityDst = this.velocity.write
    const pressureField = this.pressure.read
    this.projectMaterial.uniforms.uVelocity.value = projectVelocitySrc.texture
    this.projectMaterial.uniforms.uPressure.value = pressureField.texture
    this.renderPass(projectVelocityDst, this.projectMaterial)
    swap(this.velocity)
    if (this.pendingInitLog) {
      try {
        console.info('[PC] fluid init', { size: this.size, iters: this.iterations })
      } catch {
        /* noop */
      }
      this.pendingInitLog = false
    }
  }
```

[FS-Inv]
```ts
257:263:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts
  getTexture() {
    return this.velocity.read.texture
  }

  getInvSize(): [number, number] {
    return [this.invSizeVec.x, this.invSizeVec.y]
  }
```

[Doc-02]
```md
9:13:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/02-architecture-overview.md
- Input capture: `InkSurface` normalizes pointer UVs, respects mirror flags, emits `onForceSample` deltas and `onForceSplat` packets with clamped radius/strength for each stroke update while resetting the stroke heatmap on pointer down.
- Fluid integration: `FluidSim` injects splats via `addForce`, then advances advect → divergence → Jacobi (×iterations) → projection every frame over RGBA float/half-float ping-pong targets.
- Uniform bridge: `PointCloudStage` seeds and rebinds `uVelocity`, `uVelTexInvSize`, `uVelToNdc`, and `uInkBlend`, forwarding InkSurface splats and maintaining fluid state inside the frame loop.
```

[Doc-03]
```md
9:14:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/03-rendering-pipeline-trace.md
- **Pointer capture → splats**: `InkSurface` clamps pointer UVs into `[0,1]`, accumulates normalized deltas for `onForceSample`, and emits `onForceSplat` packets with radius `BRUSH_RADIUS_PX / TEXTURE_SIZE` and strength capped at one.
- **Splats → fluid state**: `PointCloudStage` forwards every splat to `FluidSim.addForce`, logging the packet before the shader writes into the velocity ping-pong target.
- **Fluid integration**: The stage instantiates a 256² grid with 10 Jacobi iterations, primes uniform bindings, then `FluidDriver` advances the sim each frame via `step()`.
- **Uniform bridge**: Bootstrap binds `uVelocity`, `uVelTexInvSize`, `uVelToNdc`, and `uInkBlend`, while the frame loop refreshes texture handles, inverse texel size, and tuning scalars.
- **Material vertex displacement**: The Dreamdust vertex shader converts clip → NDC → guarded UV, samples velocity, scales by `uVelToNdc`, then mixes displacement via `uInkBlend`.
```

[Doc-04]
```md
69:81:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/04-resources-guide.md
- **R3F integration**: Update uniforms in `useFrame`, invalidate on demand frameloop, and keep sim targets out of default pipeline.
  - Why this matters here: velocity texture and invSize are updated inside the frame loop.
  ```900:920:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
  useFrame((state, delta) => {
    sim.step(delta)
    const texture = sim.getTexture()
    if (uniforms?.uVelocity && uniforms.uVelocity.value !== texture) {
      uniforms.uVelocity.value = texture
    }
    const inv = sim.getInvSize()
    ...
  })
  ```
```

[Doc-10]
```md
9:14:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
Summary: shader gate clean; fluid initialized; particles not visible in screenshot.
Key console lines:
- "[PC] fluid uniforms prime {invSize: [...], velToNdc: 0.028, inkBlend: 0.78}"
- "[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}"
- "[PC] fluid init {size: 256, iters: 10}"
```
