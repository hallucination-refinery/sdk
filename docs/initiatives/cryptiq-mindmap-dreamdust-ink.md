<!-- cspell:words Dreamdust brushable rasterizing GLSL glsl unproject unprojects prebaked VGGT reprojection venv vggt facebookresearch cryptiq mindmap pointclouds -->
# Dreamdust Ink developer notes

## Uniforms
- Implementation: [useDreamdustUniforms.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts).
- Exposes `DreamdustUniforms` with time, viewport, ink, and noise/depth tuning slots. Defaults establish neutral baselines (e.g. `uInkIntensity=1`, `uNoiseThreshold=0.5`, `uVertexInkOk=0`) and are lazily cloned so callers can mutate in place without reallocation.
- `useDreamdustUniforms` double-sources frame timing: it increments `uTime` via both `requestAnimationFrame` and `useFrame` to tolerate SSR/rAF gaps, and updates `uViewport` from R3F state when available, falling back to window size otherwise for GL safety.
- Setter helpers wrap uniform mutation so arrays update in place (preserving references used by `three`), and `updateInkTexture` simply forwards through `setUniform('uInkTex', texture)`.

## InkField
- Core object: [InkField.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/InkField.ts) returns a brushable 2D intensity canvas sized by `size` × DPR.
- Strokes auto-detect coordinate mode (`0–1`, `−1–1`, or pixel) before rasterizing soft circular stamps with pressure-scaled radii and additive blending; `drawStroke` records last brush time to gate decay.
- `decay(rate)` darkens the field toward black, clamps to avoid over-decay, and tracks a floor so idle canvases skip uploads. `toCanvasTexture(renderer, throttleHz)` reuses a single `CanvasTexture`, throttling GPU updates (default 60 Hz) and honoring anisotropy caps.
- Host overlay: [InkFieldHost.tsx](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx) captures pointer strokes, instantiates the field at `128px` with DPR clamped to ≤1.5, and hands textures to the Dreamdust context while tracking intensity falloff over ~2.4 s.
- Capability checks use [capabilities.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/capabilities.ts) to test `MAX_VERTEX_TEXTURE_IMAGE_UNITS` before enabling vertex ink influence.

## Material
- Shader factory: [DreamdustMaterial.ts](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts) wraps GLSL chunks from [`glsl/chunks.ts`](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts) and exposes an `unproject` toggle.
- Vertex shader unprojects capture-space UVs via `uPVInvCapture` when prebaked data is absent, layers procedural drift (`uNoise*`, `uDriftAmp`), and applies ink-driven size/offset/tint boosts gated by `uInkIntensity` and `uVertexInkOk`.
- Fragment shader reuses ink sampling when vertex textures are unavailable, blending tint and alpha based on `uNoiseThreshold` reveal and depth fade (`uDepthBias`). Material instances share uniform objects to keep GPU bindings hot.

## Stage wiring
- Stage container: [PointCloudStage.tsx](../../apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx) derives scene asset URLs, loads color/depth images, and inflates depth RG data to 16-bit when needed. It memoizes Dreamdust uniforms, adds derived uniforms (e.g. `uBaseSize`, `uHasCapture`), and writes tuning defaults (`uGamma=0.82`, `uFocal=1600`, `uNoiseScale=0.0025`, etc.).
- Two materials are created per stage: prebaked (`unproject:false`) for VGGT exports and fallback (`unproject:true`) for depth-unproject pipelines. When `positions.f32` exists the prebaked path wins; otherwise the stage uses depth reprojection, with both materials disposed on unmount.
- Stage listens to [`DreamdustProvider`](../../apps/cryptiq-mindmap-demo/app/components/dreamdust/context.tsx) for ink textures/intensity and writes them into uniforms. Vertex texture capability updates flow from `InkFieldHost` via context (`setVertexInkOk`).
- UI integration: the quiz page wraps the stage and overlay hosts in `DreamdustProvider` and mounts [`InkFieldHost`](../../apps/cryptiq-mindmap-demo/app/quiz/%5Bslug%5D/page.tsx) above the canvas so pointer capture stays in sync with R3F.

## Performance
- `InkField` skips uploads while idle (decay floor ≤ ε) and throttles `texture.needsUpdate` to the requested Hz. `InkFieldHost` also throttles renderer acquisition via `requestAnimationFrame` and only recalculates ink intensity when the exponential falloff changes by >0.01.
- Vertex texture paths are optional: if `MAX_VERTEX_TEXTURE_IMAGE_UNITS` is zero the material falls back to fragment-only tint/alpha, avoiding GPU errors on low-end hardware.
- Uniform hooks avoid crashes during SSR/hydration by guarding `useThree`/`useFrame` calls and checking for `window` before reading viewport sizes. `getR3FStateOrNull` similarly bails until a canvas is registered.

## Assets (.venv-vggt + depth_cli)
- VGGT export (host side): follow [tools/vggt-cli/README.md](../../tools/vggt-cli/README.md) to create `.venv-vggt`, install the vendored `facebookresearch/vggt` checkout, and run `python tools/vggt-cli/run_vggt.py --image … --out … --write_colors` to generate `positions.f32`, `colors.u8`, and `meta.json` for a scene.
- Depth/normal maps: use [tools/depth-cli/depth_cli.py](../../tools/depth-cli/depth_cli.py) to batch MiDaS inference. `python tools/depth-cli/depth_cli.py --input <image_or_dir> --output <scene_dir> --vis` writes `<stem>_depth16.png` plus RG-packed depth for the web viewer and optional magma previews.
- Asset placement: drop exports into `apps/cryptiq-mindmap-demo/public/assets/pointclouds/<scene>` so the stage can auto-discover `color.png`, depth variants, and VGGT outputs.

## Debugging
- Enable quiz debug UI via `?debug=1` to adjust stride, bloom, FOV, and ink parameters stored in `localStorage: pcDebug` (see [PointCloudStage.tsx](../../apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx)).
- Unit coverage: [useDreamdustUniforms.spec.tsx](../../apps/cryptiq-mindmap-demo/tests/dreamdust/useDreamdustUniforms.spec.tsx) exercises mount/unmount behavior for uniforms.
- For GL issues inspect console logs from `PointCloudStage` (prebaked fetch status) and `InkFieldHost` (vertex texture support). Toggling `?pc=<scene>` swaps asset sets without rebuilding.
