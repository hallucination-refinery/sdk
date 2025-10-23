# Point‑Cloud Particle Effect — Reference Bundle (Effect‑Only)

Purpose: technical baseline to recreate the *effect* (particle point‑cloud from single‑image depth), not the specific image, camera, or palette.

## Provenance
- Tweet: “Midjourney → Particle magic with @threejs. I generate an image with Midjourney, reconstruct a point cloud with AI from it, then render it with Threejs. TSL handles the math.”
- Depth model cited by author: **VGGT**.
- Source: User provided frames derived from a 10 fps GIF, selecting every 7th frame (~0.7 s interval). 24 frames standardized to PNG.

## Contents
- `frames/` — `01-frame.png` … `24-frame.png`.
- `frames_metrics.csv` — lightweight motion proxy (mean absdiff on 256px downscale).
- `metadata.json` — provenance, sampling, tunable ranges.
- `checksums.md5` — MD5 hashes.

## Effect replication recipe
1. Generate your own image (rich edges, layered depth).
2. Estimate depth with **VGGT** → normalize [0,1], clamp tails, bilateral‑smooth, hole fill.
3. Sample 80k–250k points, edge‑biased; slight per‑point jitter.
4. Unproject to 3D with assumed focal length; scale scene units.
5. Three.js + TSL:
   - Geometry attributes: position, uv, depth, color.
   - Size: `size = clamp(k/(a*depth+b), s_min, s_max) * (1+jitter)`.
   - Alpha: decreasing with depth; far points desaturate/darken.
   - Blending: additive or alpha; tone map ACES/Reinhard; mild bloom + vignette.
6. Motion: minimal eased camera; optional micro‑drift via low‑freq noise.
7. Export: 24–30 fps, 1080–1440 px tall, high bitrate.

## Unknowns
- Prompt/seed, VGGT config, sampling kernel, shader constants, post stack.

## Educated guesses (tune)
- Near size 2–6 px; far 0.4–1.0 px; fog start ~50% depth; exposure 0.8–1.3.
- Depth smoothing radius small; conservative hole fill.
