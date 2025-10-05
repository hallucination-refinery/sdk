## Visual Quality Gaps

**Critical:**
- Pelletized circles with bright rims; zero haze between points
  - Technical cause: `uAlphaFloor` > 0 keeps every sprite visibly opaque and `dreamdustApplyRimLight` adds a 5% white edge with `uRimGamma=2.4`, reinforcing hard circular boundaries. Sprite profile (`dreamdustSoftSprite`) is a compact disc with limited tail, so overlap reads as “cells,” not mist.
- Size distribution too narrow and too large overall
  - Technical cause: `uPointBaseSize` is set high (≈6px) and attenuation is clamped by `uMinSize/uMaxSize` near 1.0, so most points land in a similar size band. No per‑particle jitter; depth attenuation is weak, yielding uniform pellets.
- Patchy reveal pattern instead of continuous airy density
  - Technical cause: High `uNoiseThreshold=0.70` with tight `smoothstep` band (w=0.08 in shader) produces binary-ish gating at sprite scale, making islands of dots and honeycomb gaps instead of soft, continuous fog.

**Major:**
- Flat depth and insufficient atmospheric falloff
  - Technical cause: `uDepthNormScale=0.001` with `uDepthBias=0.7` only mildly attenuates by view distance; points at different depths read similarly, removing parallax layering that makes dust feel volumetric.
- Edge halos break “luminous dot” intent
  - Technical cause: Rim light always mixes ~5% white along edges; with big sprites this reads as a hard ring, not a soft glow.
- Color reads as stippled paint, not optical blending
  - Technical cause: Disc kernel is compact; alpha floor prevents long-tail blending. Premultiplied alpha is fine, but the sprite kernel must be more Gaussian to let colors “melt.”

**Minor:**
- Slight center darkening in clusters
  - Technical cause: Sprite gamma (`pow(sprite, 0.85)`) + high rim exaggerates edge brightness vs center, amplifying the pellet look.
- Micro-jitter visible at rest (petri-dish vibe)
  - Technical cause: Curl/drift fields (`uDriftAmp/uCurlAmp`) modulate even when reveal settled; breathing and drift may need smaller amplitude at rest.

## Primary Blocker

The disc sprite + alpha floor + rim combo makes each particle a hard, high-contrast pellet. Until the sprite reads as a soft Gaussian with zero floor and reduced rim, overlaps will never melt into mist. This is the single biggest reason it feels clinical instead of ethereal.

## Recommended Iteration 04

**Parameter changes:**
1. `uAlphaFloor`: 0.06 → 0.00
   - Rationale: Remove forced opacity so sparse regions actually disappear; enables long-tail blending and eliminates pellet persistence.
   - Expected outcome: Background haze emerges; edges stop “sticking.”

2. `uRimGamma`: 2.4 → 8.0
   - Rationale: Compress rim contribution to the last few edge pixels; keeps the white mix from ringing every dot.
   - Expected outcome: Rim is subtle; dots read as luminous, not haloed.

3. `uPointBaseSize`: ~6px → ~1.6–2.0px (start 1.8px)
   - Rationale: Current base size is 3× too large; smaller kernels reduce pelletization and increase optical blending.
   - Expected outcome: Finer grain, more “dust” than “confetti.”

4. `uMinSize/uMaxSize`: 0.35 → 2.6 (range), centered around 1.0
   - Rationale: Widen depth/attenuation spread so nearby points can grow and far points shrink; introduce scale variance without new attributes.
   - Expected outcome: Parallax and density variation; clusters stop looking uniform.

5. `uNoiseThreshold`: 0.70 → 0.50
   - Rationale: Reduce binary gating to increase continuous coverage; fewer honeycomb voids.
   - Expected outcome: More coherent fog; reveal noise becomes texture, not holes.

6. `uDepthNormScale`: 0.001 → 0.003 and `uDepthBias`: 0.7 → 1.1
   - Rationale: Strengthen atmospheric attenuation with distance.
   - Expected outcome: Foreground reads denser; background recedes into mist.

7. `uGamma`: 0.85 → 1.10
   - Rationale: Reduce midtone crush on sampled color and depth mapping; supports softer gradients.
   - Expected outcome: Less blotchy midtones; smoother tonal falloff.

8. Rest amplitude clamp at settle: keep, but halve drift
   - Change: `uDriftAmp` 0.55 → 0.28; `uCurlAmp` 0.55 → 0.35
   - Rationale: Remove petri‑dish jitter at rest while preserving subtle breathing.
   - Expected outcome: Calm, “breathy” hold with no twitches.

**Alternative approaches to consider:**
- Swap sprite kernel to Gaussian tail (code change): in `DREAMDUST_SOFT_SPRITE_CHUNK`, replace the current smoothstep disc with `exp(-r*r * k)` (try k≈3.0), and remove the floor in shader. This alone can deliver the airy melt.
- Add tiny per‑vertex size jitter (code change): derive `sizeJitter = 0.85 + 0.3 * hash(aUv, aDepth)` and multiply `pointSize` by it; avoids uniform pellet bands without attribute churn.
- Test additive blend A/B (material param): toggle to `AdditiveBlending` for a pass; with smaller sprites and zero floor this can amplify glow, but be careful with highlights.

## Fojcik Frame Assessment

Current closest to: Frame 02
Recommended next milestone: Frame 03
Why: The scene is readable like 02 but lacks the airy, continuous, mist‑like density and fine grain of 03. The changes above target pelletization and depth flatness—the two gaps preventing the 03 “ink in air” feel.

