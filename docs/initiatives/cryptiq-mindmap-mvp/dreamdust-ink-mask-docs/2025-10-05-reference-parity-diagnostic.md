# Dreamdust — Reference Parity Diagnostic (2025-10-05)

## 1) Motion Determination (Reference)

Evidence files:
- Cohere (camera static): frames/01-frame.png, 03-frame.png, 05-frame.png
- Dissipate (camera static): frames/19-frame.png, 22-frame.png, 24-frame.png
  - Path: docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/fojcik_tweet_effect_replication_bundle/frames/NN-frame.png
  - Timestamps (10 FPS GIF, every 7th frame → Δt≈0.7s):
    - 01→05: 0.0s, 1.4s, 2.8s
    - 19→24: 12.6s, 14.7s, 16.1s

Findings:
- Particles move coherently between frames (positions shift in groups/filaments), not random per‑frame jitter.
- No explicit motion blur trails; the “softness” reads as optical integration of many overlapping, slightly advected particles.
- Flow is low‑frequency and field‑coherent (neighbors move together), especially obvious in the dissipate phase (19–24).

Conclusion: Reference uses coherent advection (curl/FBM‑type field) with temporal stability. Not static dots; not per‑frame hash jitter.

## 2) Aesthetic Formula (ranked: 1 = most important)

1. Effective particle density (overlap/accumulation) — via true high count and/or a density accumulation stage
2. Gaussian/multi‑scale sprite PSF (long tail) — replaces hard disc edge with monotone falloff for optical blending
3. Coherent motion/advection (no jitter) — wispy tendrils and breathing
4. Additive blending in dense areas — bright merges without banding
5. Bloom post (moderate radius/strength) — amplifies highlights; not the core softness
6. Color saturation/contrast — supportive; depth desaturation helps layering

Short version: density + PSF + coherent flow do the heavy lifting; additive/bloom polish the glow; color supports depth.

## 3) Gap Analysis vs Preset D1 (Additive + Gaussian)

Observed output (report): discrete near‑static dots, subtle preset differences even at 8px.

Likely causes:
- Insufficient effective density: 89,441 points at screen scale still leave gaps; no screen‑space density pass to integrate coverage into a continuous field.
- PSF not long‑tailed enough: single Gaussian (sharpness≈4.0) still reads as pellets at 8px; multi‑scale tail is needed for mid‑density haze.
- Motion incoherence: per‑frame noise offsets/jitter instead of stable advection; neighbors don’t move together.
- Reveal gating residue: even widened, gating imprints cellular voids unless fully disabled after settle.
- Bloom doing too much/too little: without a pre‑composited density field, bloom either halos pellets or is tuned down to avoid donuts; neither yields “volume.”
- Depth semantics only partial: darken/desaturate helps, but no depth‑aware smoothing/occlusion in the haze composite.

Not the main issue:
- Additive blending is likely working; it just can’t overcome pellet edges and low effective density.

## 4) Top 3 Changes To Try Tomorrow (highest impact first)

1) Add a half‑res screen‑space density composite (first pass)
- Render current points into an offscreen FP16 target at 0.5× resolution using additive blending and a long‑tail Gaussian (separate from the color pass).
- Apply a separable tent/Kawase blur (2–3 taps per axis). Optional bilateral weight vs scene depth to protect silhouettes.
- Composite the blurred density over the color pass before UnrealBloom (e.g., color += density * gain; or screen‑like mix with gain≈0.6–0.8).
- Expected: pellets melt into continuous vapor; highlights merge without donut rims. This is the single biggest leap to “smoky.”

2) Replace jitter with coherent advection (stable in world space)
- Sample curl(FBM) at a stable world anchor and low‑pass over time (offset = lerp(offset, offset + v*dt, 0.15)); scale drift/curl → 0 at settle.
- Keep subtle breathing (`uBreathAmp≈0.04–0.06`) but no per‑frame hash jitter.
- Expected: wispy, flowing tendrils; calm hold; no “petri dish” motion.

3) Multi‑scale Gaussian sprite (drop rim)
- Use two Gaussians: `sprite = 0.7 * exp(-r2 * 6.5) + 0.3 * exp(-r2 * 1.4)`; set `spriteAlpha = pow(max(sprite,0.0), 1.0)`.
- Remove rim (mix ≤ 0.01) to avoid outlining; alpha floor stays 0.
- Expected: mid‑density regions read as soft haze; fewer visible dots at the same count.

Quick supportive tweaks (do alongside):
- Disable reveal gating entirely once `uReveal >= 0.999` (make `revealAlpha = 1.0`).
- Bloom: strength 0.45–0.6, threshold 0.6–0.65, radius 0.8–1.2 after density composite.

## 5) Architecture Verdict

Can current “static positions + rendering tweaks” match reference? Not fully. Two minimal extensions make it viable:
- A) Screen‑space density composite (half‑res FP16 + blur) — achieves continuous haze without exploding point count.
- B) Coherent advection field — replaces jitter with fluid, wispy motion.

With A+B, the existing point setup + presets can reach the desired “voluminous smoke” aesthetic. Full particle simulation is optional; deterministic flow is sufficient.

---

## Implementation Pointers (surgical changes)

- Disable reveal gating after settle (remove cellular voids)
  - File: apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:544–557
  - Change: if `uReveal >= 0.999`, set `revealAlpha = 1.0` and skip smoothstep gate entirely for final alpha.

- Multi‑scale Gaussian PSF
  - File: apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:535–543
  - Replace single Gaussian with two‑term mix (weights 0.7/0.3; sharpness ~6.5/1.4); set `spriteAlpha` gamma ≈ 1.0; keep `uAlphaFloor=0`.

- Density composite (new, minimal)
  - Add a half‑res render target (FP16) and a blur pass (Kawase/tent); draw points into density RT with additive blending and long‑tail Gaussian; composite before UnrealBloom.
  - Plumb preset toggle to A/B; log parameters.

- Coherent advection (no jitter)
  - In VERTEX: replace per‑frame noise offsets with curl(FBM) sampled in world space; low‑pass integrate offset; scale drift/curl to 0 when settled.

- Bloom retune after density
  - Reduce strength slightly; increase radius; lower threshold to ~0.6–0.65.

---

## Evidence Appendix
- Cohere frames (static camera): assets/fojcik_tweet_effect_replication_bundle/frames/01-frame.png, 03-frame.png, 05-frame.png
- Dissipate frames (static camera): assets/fojcik_tweet_effect_replication_bundle/frames/19-frame.png, 22-frame.png, 24-frame.png
- Preset code sites referenced:
  - FRAGMENT PSF/gating: apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:535, 544–557
  - Bloom presets wiring: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:102–110, 1532–1615

---

## Tomorrow’s Test Plan (fast)
- Implement multi‑scale Gaussian + gating‑off (30–45 min); capture A/B stills at 100% zoom (mid‑density chest, background curtain).
- Add density composite (90–120 min); retune bloom; capture A/B again.
- Swap jitter for advection (60–90 min); record short clip; verify coherent flow and no micro‑jitter.

If any single change must be prioritized: implement the density composite first — it’s the biggest step toward “smoky volume.”

