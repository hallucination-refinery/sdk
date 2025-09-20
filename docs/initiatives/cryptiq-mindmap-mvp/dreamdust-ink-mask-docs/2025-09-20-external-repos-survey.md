# External Repos Survey — Adaptation Plan (2025-09-20)

## Candidates (one section per repo)

### PavelDoGreat/WebGL-Fluid-Simulation

- Link: https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
- What it demonstrates: Pointer-driven fluid splats rendered via ping-pong framebuffers with bloom-enhanced dye visualization.
- Relevant techniques to adapt:
  - Pointer state tracking (`pointerPrototype`) that converts drag delta into texture-coordinate splats suitable for an interaction mask.
  - High-resolution dye buffers updated through advection, pressure solve, and vorticity confinement controlled by `config.CURL`.
  - Multi-pass bloom composed from prefilter, blur, and composite programs (`bloomPrefilterProgram`, `bloomBlurProgram`, `bloomFinalProgram`).
- Files of interest: `script.js` (pointer capture, FBO lifecycle in `createFBO`, render loop `update`, bloom pipeline in `applyBloom`), `index.html` (shader script tags).
- License/attribution: MIT License (Pavel Dobryakov).
- Adaptation plan: Port the pointer/FBO capture path into `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx` so that splat writes hydrate `uInkTex`, and mine the bloom pass structure to inform our post stack in `PointCloudStage.tsx` without wholesale copy.
- Risks/unknowns: Heavy WebGL 2 requirements (multiple color attachments, linear filtering) and the monolithic script style may need refactoring before integrating with React; performance could dip on mobile if high dye resolution is retained.

### patriciogonzalezvivo/lygia

- Link: https://github.com/patriciogonzalezvivo/lygia
- What it demonstrates: Modular GLSL snippets for generative noise, curl fields, and FBM layers designed for reuse across shading languages.
- Relevant techniques to adapt:
  - `generative/curl.glsl` exposing `curl(pos)` to derive divergence-free flow fields from simplex noise seeds.
  - `generative/fbm.glsl` layering octave-weighted noise with macro-controlled octave counts for tunable turbulence.
  - Shared includes such as `snoise.glsl` and `gnoise.glsl` that guard precision and normalization of the noise basis.
- Files of interest: `generative/curl.glsl`, `generative/fbm.glsl`, `generative/snoise.glsl`, accompanying `README_GLSL.md` usage notes.
- License/attribution: Prosperity Public License 3.0.0 (noncommercial use; commercial use limited to 30-day trials without a paid license).
- Adaptation plan: Re-implement equivalent curl/FBM routines inside `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`, crediting the approach but avoiding direct copy-paste to keep licensing clean while matching function signatures our shader chunks expect.
- Risks/unknowns: Prosperity license is incompatible with sustained commercial deployment unless we procure a license or re-author the math; macros and include paths rely on a preprocessing step we do not have in our toolchain.

### pmndrs/postprocessing

- Link: https://github.com/pmndrs/postprocessing
- What it demonstrates: A modular EffectComposer with configurable passes including high-quality bloom and luminance filters.
- Relevant techniques to adapt:
  - `BloomEffect` chaining of prefilter, multiple blur levels, and composite weights to control radius, threshold, and intensity.
  - `SelectiveBloomEffect` masking workflow that blends bloom only over tagged objects—useful for isolating dreamdust sprites.
  - Typed pass scheduling within `EffectComposer` for deterministic render order and multisample handling.
- Files of interest: `src/effects/BloomEffect.ts`, `src/effects/SelectiveBloomEffect.ts`, `src/postprocessing/EffectComposer.ts`, `src/materials/LuminanceMaterial.ts`.
- License/attribution: zlib/libpng-style license (Raoul van Rüschen).
- Adaptation plan: Reference the parameter defaults and pass ordering when expanding `BloomPass` inside `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`, and optionally reuse the selective mask concept to gate bloom over the reveal cascade.
- Risks/unknowns: Package depends on WebGL 2 features (Multiple Render Targets) and adds bundle weight; ESM build expects tree-shaking and might clash with our existing three.js version unless synchronized.

### mrdoob/three.js — Morph Targets Example

- Link: https://github.com/mrdoob/three.js/tree/dev/examples#readme (notably `examples/webgl_morphtargets_sphere.html`).
- What it demonstrates: Morph-target-driven transitions that modulate point clouds via weighted influence arrays shared between meshes and points.
- Relevant techniques to adapt:
  - Live manipulation of `mesh.morphTargetInfluences` to stagger reveal timing and oscillate between targets.
  - Copying morph influence arrays onto a `Points` instance (`points.morphTargetInfluences = mesh.morphTargetInfluences`) to synchronize cascades across render paths.
  - Keyframe-style ramping that clamps influences between 0–1 to avoid overshoot during cascaded transitions.
- Files of interest: `examples/webgl_morphtargets_sphere.html` (setup and influence updates), `examples/jsm/controls/OrbitControls.js` (camera controls referenced by the example), `src/core/BufferGeometry.js` (morph attribute storage used by the demo).
- License/attribution: MIT License (three.js authors).
- Adaptation plan: Mirror the influence ramping strategy within `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts`, translating morph weights to our `uCascade` and reveal timeline uniforms, while mapping the geometry-specific logic into shader-friendly cascades in `DreamdustMaterial.ts`.
- Risks/unknowns: Example is CPU-updated per frame and assumes dedicated morph target attributes; we instead drive reveal through shader uniforms, so we must ensure uniform updates remain synchronized and avoid per-point CPU copies.

## Mapping to Our Codebase

- Interaction texture: Recreate the pointer FBO splat routine from PavelDoGreat/WebGL-Fluid-Simulation inside `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`, piping the resulting `RenderTarget` into `useDreamdustUniforms` so `uInkTex` stays current.
- Curl/FBM: Translate the curl and FBM formulations inspired by patriciogonzalezvivo/lygia into reusable snippets within `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts` for vertex drift and reveal noise.
- Bloom/post: Align our `BloomPass` in `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` with the pass ordering and thresholds showcased in pmndrs/postprocessing’s `BloomEffect` implementation.
- Morph/reveal bias: Apply the morph-weight ramping patterns from the three.js morph targets example to the reveal timeline and cascade controls in `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts` and the corresponding `uCascade` handling inside `DreamdustMaterial.ts`.

## Next Steps

- Pick 1–2 high-impact techniques; open tiny PR plan with collision matrix and checks.
