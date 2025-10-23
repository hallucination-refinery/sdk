<!-- markdownlint-disable MD013 MD022 MD032 MD041 -->
<!-- cspell:words Dreamdust brushable rasterizing GLSL glsl unproject unprojects prebaked VGGT reprojection venv vggt facebookresearch cryptiq mindmap pointclouds -->
# Dreamdust Ink developer notes

## Uniforms
- Implementation: [useDreamdustUniforms.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts).
- Exposes `DreamdustUniforms` with time, viewport, ink, and noise/depth tuning slots. Defaults establish neutral baselines (e.g. `uInkIntensity=1`, `uNoiseThreshold=0.5`, `uVertexInkOk=0`) and are lazily cloned so callers can mutate in place without reallocation.
- `useDreamdustUniforms` double-sources frame timing: it increments `uTime` via both `requestAnimationFrame` and `useFrame` to tolerate SSR/rAF gaps, and updates `uViewport` from R3F state when available, falling back to window size otherwise for GL safety.
- Setter helpers wrap uniform mutation so arrays update in place (preserving references used by `three`), and `updateInkTexture` simply forwards through `setUniform('uInkTex', texture)`. Depth fade strength (`uDepthNormScale`) is provisioned even before a renderer mounts so `PointCloudStage` can safely inject camera-tuned values later.

## Depth normalization & reveal
- Vertex normalization in [DreamdustMaterial.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts) remaps `aDepth` into `[uDepthMin,uDepthMax]`, applies gamma/invert toggles, then feeds drift/unprojection. Fragment depth fade relies on the same normalized metric so both passes react consistently to tuning defaults.
- `uDepthNormScale` comes from [depthNormScaleFromRadius](../../apps/cryptiq-mindmap-demo/app/components/anim/camera.ts) and is updated by [PointCloudStage.tsx](../../apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx) after fitting scene radius; this keeps `DD_DEPTH_ALPHA` falloff stable as assets change size or when quiz UI scales thickness.
- Reveal noise gates each point in [DreamdustMaterial.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts) using the FBM helpers from [`glsl/chunks.ts`](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts). `uNoiseThreshold` and `uNoiseSpeed` expose defaults for slow fades that authors can override via debug UI, while fragment fallbacks continue to respect ink intensity.
- Timeline driver (target implementation via `startReveal`/`tick` in `useDreamdustUniforms`) follows a four-phase schedule:
  1. **Pre-roll (≈120 ms):** Pin `uNoiseThreshold` at `0.05` to mask missing textures while assets hydrate.
  2. **Reveal ramp (≈0.85 s ease-in-out):** Animate threshold to `0.68` while holding `uDriftAmp=1.0` so silhouettes resolve quickly.
  3. **Breath loop (start ≈1.6 s):** Drive `uDriftAmp` between `0.86`–`1.32` on a 9 s cosine cycle and modulate threshold ±`0.07` with a 6.5 s sine wave.
  4. **Idle taper (after 12 s without ink):** Lerp threshold down to `0.6` and shrink the breath envelope to ±`0.03` over 2.4 s; teardown collapses threshold to `0` in 420 ms before navigation.

## InkField
- Core object: [InkField.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/InkField.ts) returns a brushable 2D intensity canvas sized by `size` × DPR.
- Strokes auto-detect coordinate mode (`0–1`, `−1–1`, or pixel) before rasterizing soft circular stamps with pressure-scaled radii and additive blending; `drawStroke` records last brush time to gate decay.
- `decay(rate)` darkens the field toward black, clamps to avoid over-decay, and tracks a floor so idle canvases skip uploads. `toCanvasTexture(renderer, throttleHz)` reuses a single `CanvasTexture`, throttling GPU updates (default 60 Hz) and honoring anisotropy caps.
- Host overlay: [InkFieldHost.tsx](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx) captures pointer strokes, instantiates the field at `128px` with DPR clamped to ≤1.5, and hands textures to the Dreamdust context while tracking intensity falloff over ~2.4 s.
- Capability checks use [capabilities.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/capabilities.ts) to test `MAX_VERTEX_TEXTURE_IMAGE_UNITS` before enabling vertex ink influence.
- Default decay spec: run `decay(0.965)` at 60 Hz (half-life ≈1.8 s) and clamp to `0.94` on >90 Hz displays to curb persistence. Stop decaying once the intensity floor reaches `≈0.12` so uploads can pause.
- Upload throttles: limit `toCanvasTexture` to 48 Hz while stylus contact is active and 24 Hz when idle; pair this with `requestAnimationFrame` gating so CPU cost stays below 1.2 ms on mid-tier laptops.
- Curl-coupled modulation: forward stroke pressure to the Dreamdust context so the curl driver can lift amplitude up to `0.48` before easing back with the decay timeline (~2.1 s to baseline).

## Material & ink paths
- Shader factory: [DreamdustMaterial.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts) wraps GLSL chunks from [`glsl/chunks.ts`](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts) and exposes an `unproject` toggle.
- Vertex shader unprojects capture-space UVs via `uPVInvCapture` when prebaked data is absent, layers procedural drift (`uNoise*`, `uDriftAmp`), and applies ink-driven size/offset/tint boosts gated by `uInkIntensity` and `uVertexInkOk`.
- Fragment shader reuses ink sampling when vertex textures are unavailable, blending tint and alpha based on reveal/discard rules plus depth fade (`uDepthBias`). Vertex and fragment ink paths share `DreamdustInkSample` helpers so swapping between them keeps brush feel identical.

## Curl & flow parameters
- Uniforms (planned in `DreamdustMaterial` + timeline helpers): `uCurlAmp=0.32`, `uCurlScale=0.85`, `uCurlSpeed=0.17`. Pressure maps `[0,1] → [0.32,0.48]` on the vertex path; fragment fallback caps at `0.28` to avoid warping silhouettes without vertex textures.
- Curl sampling should piggyback on the FBM noise block, offsetting by breath phase so low-frequency drift and high-frequency swirl do not alias. Use tangent-space derivatives to keep curl continuous across stitched point batches.
- When the idle taper kicks in, lerp curl amp toward `0.24` and sync the sine phase with drift so the cloud relaxes smoothly.

## Stage wiring
- Stage container: [PointCloudStage.tsx](../../apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx) derives scene asset URLs, loads color/depth images, inflates depth RG data to 16-bit when needed, and memoizes Dreamdust uniforms. It adds derived slots (`uBaseSize`, `uHasCapture`) plus tuning defaults (`uGamma=0.82`, `uFocal=1600`, `uNoiseScale=0.0025`, etc.) before render.
- Point budgets clamp work via [`pointCap`](../../apps/cryptiq-mindmap-demo/app/components/pointcloud/budget.ts), while [`applyDprClamp`](../../apps/cryptiq-mindmap-demo/app/components/pointcloud/budget.ts) keeps renderers under the requested DPR during `onCreated` — together they provide predictable GPU cost on mobile and desktop.
- Two materials are created per stage: prebaked (`unproject:false`) for VGGT exports and fallback (`unproject:true`) for depth-unproject pipelines. When `positions.f32` exists the prebaked path wins; otherwise the stage uses depth reprojection, with both materials disposed on unmount.
- Stage listens to [`DreamdustProvider`](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/context.tsx) for ink textures/intensity and writes them into uniforms. Vertex texture capability updates flow from `InkFieldHost` via context (`setVertexInkOk`).
- UI integration: the quiz page wraps the stage and overlay hosts in `DreamdustProvider` and mounts [`InkFieldHost`](../../apps/cryptiq-mindmap-demo/app/quiz/%5Bslug%5D/page.tsx) above the canvas so pointer capture stays in sync with R3F.

## Performance
- `InkField` skips uploads while idle (decay floor ≤ ε) and throttles `texture.needsUpdate` to the requested Hz. `InkFieldHost` also throttles renderer acquisition via `requestAnimationFrame` and only recalculates ink intensity when the exponential falloff changes by >0.01.
- Point count and DPR controls ([`pointCap`](../../apps/cryptiq-mindmap-demo/app/components/pointcloud/budget.ts), [`applyDprClamp`](../../apps/cryptiq-mindmap-demo/app/components/pointcloud/budget.ts)) live alongside the stage so capacity can be tuned via env vars without code changes, keeping budgets predictable on SSR replays or low-power devices.
- Vertex texture paths are optional: if `MAX_VERTEX_TEXTURE_IMAGE_UNITS` is zero the material falls back to fragment-only tint/alpha, avoiding GPU errors on low-end hardware.
- Uniform hooks avoid crashes during SSR/hydration by guarding `useThree`/`useFrame` calls and checking for `window` before reading viewport sizes. `getR3FStateOrNull` similarly bails until a canvas is registered.
- Target budgets:
  - CPU main thread ≤4.5 ms/frame @60 Hz (ink raster + decay ≤1.8 ms, uniforms ≤0.6 ms, remaining drift math ≤2.1 ms).
  - GPU draw ≤5.0 ms @150k points on desktop; ≤7.5 ms @60k on mobile. Reduce curl amp by 20% when telemetry exceeds these limits for >2 s.
  - Memory: keep ink texture ≤1.2 MB/frame with DPR clamp (≤1.5); total stage VRAM footprint <350 MB to preserve headroom for UI overlays.
  - Network: prebaked asset packs should stay below 5 MB zipped; delay reveal ramp until `meta.json` + `colors.u8` arrive (<400 ms on 50 Mbps Wi-Fi).

## Assets (.venv-vggt + depth_cli)
- VGGT export (host side): follow [tools/vggt-cli/README.md](../../tools/vggt-cli/README.md) to create `.venv-vggt`, install the vendored `facebookresearch/vggt` checkout, and run `python tools/vggt-cli/run_vggt.py --image … --out … --write_colors` to generate `positions.f32`, `colors.u8`, and `meta.json` for a scene.
- Depth/normal maps: use [tools/depth-cli/depth_cli.py](../../tools/depth-cli/depth_cli.py) to batch MiDaS inference. `python tools/depth-cli/depth_cli.py --input <image_or_dir> --output <scene_dir> --vis` writes `<stem>_depth16.png` plus RG-packed depth for the web viewer and optional magma previews.
- Asset placement: drop exports into `apps/cryptiq-mindmap-demo/public/assets/pointclouds/<scene>` so the stage can auto-discover `color.png`, depth variants, and VGGT outputs.

## Debugging
- Enable quiz debug UI via `?debug=1` to adjust stride, bloom, FOV, and ink parameters stored in `localStorage: pcDebug` (see [PointCloudStage.tsx](../../apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx)).
- Unit coverage: [useDreamdustUniforms.spec.tsx](../../apps/cryptiq-mindmap-demo/tests/dreamdust/useDreamdustUniforms.spec.tsx) exercises mount/unmount behavior for uniforms.
- For GL issues inspect console logs from `PointCloudStage` (prebaked fetch status) and `InkFieldHost` (vertex texture support). Toggling `?pc=<scene>` swaps asset sets without rebuilding.

## QA checklist
- **Reveal sanity:** Load `/quiz/archetype-v1?pc=scene-02&debug=1` and verify the reveal ramp reaches `noiseThreshold≈0.68` within ~0.85 s, then settles into the breath loop (`driftAmp≈0.86–1.32`).
- **Idle taper:** Leave the scene untouched for 15 s; confirm threshold eases toward `0.6` and drift oscillation shrinks to ±`0.03`.
- **Ink reaction:** Draw medium-pressure loops; ensure curl amp climbs toward `0.48`, point size gain peaks near `1.38×`, and decay clears strokes within ≈2 s even at 120 Hz.
- **Budget guardrails:** Monitor debug frame metrics; GPU draw should stay under 5.0 ms (desktop) / 7.5 ms (mobile). When forcing fragment-only ink, confirm curl amp caps at `0.28` and no shader warnings appear.
- **Teardown:** Navigate away from the quiz route; verify threshold drops to `0` within 0.5 s and the ink texture is disposed (no lingering WebGL resources in devtools).
