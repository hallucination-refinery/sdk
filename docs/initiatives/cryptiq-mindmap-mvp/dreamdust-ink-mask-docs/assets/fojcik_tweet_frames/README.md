# Dominik Fojcik tweet — frame-by-frame read + effect analysis

**Tweet text:** “Midjourney → Particle magic with @threejs. I generate an image with Midjourney, reconstruct a point cloud with AI from it, then render it with Threejs. TSL handles the math.”

## What you see, step by step

1. **Frame 1 (`01-frame.png`)** — A noisy particle field begins to coalesce. Large areas are sparse, colors are mottled. Edges are ghosted. *Read:* low reveal threshold; particles drift with weak curl noise; depth bias small.
2. **Frame 2 (`02-frame.png`)** — Major shapes lock in. A seated figure forms on the left; a doorway and standing figure emerge on the right. *Read:* reveal threshold rising; size/alpha increase with view‑depth; sprite softening visible.
3. **Frame 3 (`03-frame.png`)** — Scene becomes fully readable. Particles look like airy dust, not dots. *Read:* depth‑driven size/alpha and soft sprites dominate; bloom adds a gentle glow on bright clusters.
4. **Frame 4 (`04-frame.png`)** — Density temporarily drops and swirls. Background dissolves to mist again. *Read:* reveal ramps back down or noise band widens, producing a vaporous fade.
5. **Frame 5 (`05-frame.png`)** — Stable hold. Both figures are clear; light haze still breathes. *Read:* drift continues at low amplitude; threshold near its max; tonemapping+bloom keep highlights soft.

## Likely pipeline (reasoned)
- **Asset:** 2D image from Midjourney.
- **Depth → point cloud:** Monocular depth (e.g., MiDaS/Zoe/DPT) or multi‑view reconstruction → normalized 3D points + color per point.
- **Renderer:** Three.js points or instanced quads. **TSL** used to build node shaders that compile to GLSL/WGSL.
- **Sprite model:** soft radial alpha discs, premultiplied alpha, depthWrite off. Size and alpha biased by view‑space depth; subtle view‑normal thickness jitter to avoid a paper slab.
- **Reveal:** animated noise threshold in screen‑space (Perlin/Curl FBM). Start low (“mist”), ramp to high (“condense”), optionally reverse to “dissolve.”
- **Motion:** world‑anchored curl noise drift with slow evolution, no per‑frame reseed; small amplitude so the image stays legible.
- **Post:** ACES/filmic tonemapping; mild UnrealBloom after PMA sprites to read as luminous dust rather than sparkle.
- **Camera:** perspective with mid FOV; orbit disabled in the capture; composition framed to fill.

## Copy‑able recipe (WebGL)
- **Spaces:** compute *screen‑space UV* in vertex for reveal/ink; compute *view‑space depth* and drive both size and alpha.
- **Soft sprites:** `disk = smoothstep(1.0,0.0,length(gl_PointCoord*2.0-1.0));` output PMA `vec4(col*alpha, alpha)` with `premultipliedAlpha=true`, `depthWrite=false`.
- **Depth shaping:** `bias = clamp(uFocal/max(uFocal, vDepthView), 0.0, 1.0); size = mix(min,max,pow(bias,0.9)); alpha *= mix(0.25,1.0,bias);`
- **Drift:** `pos += curlNoise(position*freq + vec3(0,0,uTime*speed))*amp;` with `freq≈0.9`, `speed≈0.3`, `amp≈1.0 wu`.
- **Reveal band:** `mist = smoothstep(thr-w, thr+w, noise2D(vUvScreen))` with `w≈0.07`; animate `thr: 0→1` in ~1 s ease in/out.
- **Post:** tiny bloom only after sprites look right: threshold 0.78–0.82, strength 0.15–0.25, radius 0.35–0.5.

## Why it reads “smokey”
- Soft sprites + PMA eliminate hard edges.
- Depth‑biased size/alpha and micro‑thickness create volume.
- Screen‑space reveal condenses the picture from mist, instead of a uniform fade.
- Drift is coherent and slow, so it feels like buoyant air rather than jitter.
- Bloom/tonemap are restrained, so clusters glow without sparkling.

