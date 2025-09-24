# Dreamdust Ink — Current Architecture & Data Flow (2025-09-20)

## Scope

- App: `apps/cryptiq-mindmap-demo` — interactive Dreamdust stage and overlays ship inside this Next.js app package.【F:apps/cryptiq-mindmap-demo/package.json†L1-L37】
- Surface(s): the quiz route wraps its stage content in `DreamdustProvider`, mounts `PointCloudStage`, and layers `InkFieldHost` plus HUD controls over the full-viewport `<main>` container.【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L10-L151】【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L219-L227】
- Out of scope: fallback mask stage and other workspace packages remain untouched while `sceneId` toggles the Dreamdust point-cloud path only inside this route.【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L120-L140】【F:pnpm-workspace.yaml†L1-L4】

## High-Level Diagram (describe or paste link)

- `InkFieldHost` UI overlay → pointer capture & stroke stats via `InkSurface` on the WebGL canvas → interaction texture updates stored as a `THREE.DataTexture` → `PointCloudStage` binds Dreamdust uniforms/material → vertex shader applies curl noise, vapor FBM, and ink offsets → fragment shader renders soft sprites with rim/tint blending → optional `BloomPass` post → HUD metrics/log toggles in `InkFieldHost`.
  - Pointer capture & texture updates.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L61-L260】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L160-L307】
  - Stage binding & shader orchestration.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L700-L818】
  - Vertex/fragment behavior.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L208-L400】
  - Post-processing & HUD.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L496-L528】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L602-L678】

## Data Flow (numbered steps)

1. Pointer events on the WebGL canvas are captured, normalized to UVs, and tracked per-pointer while strokes log distance and type.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L188-L333】
2. Each stroke paints onto an off-screen 2D canvas, flushes into a 256×256 `THREE.DataTexture`, and pushes the texture through the Dreamdust context; the host overlay also mirrors the updates into its own canvas buffer for heatmap/debug usage.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L93-L147】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L160-L307】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L438-L520】
3. `PointCloudStage` memoizes Dreamdust uniforms, wires the ink texture via `updateInkTexture`, and applies caps (`uVertexInkOk`, viewport, intensity) whenever runtime capabilities or context change.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L700-L799】
4. The vertex shader unprojects depth samples, mixes mist/reveal, applies curl noise & vapor FBM, and modulates point size/offsets using ink swell and cascade parameters before emitting clip-space positions.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L208-L298】
5. The fragment shader evaluates the Dreamdust soft sprite with rim lighting, samples ink for tint/alpha when vertex ink is unavailable, and blends cascade color/gamma for the final RGBA output.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L315-L400】
6. When Dreamdust compiles successfully the stage enables an `EffectComposer` with `UnrealBloomPass`, rendering the bloom pass each frame to augment the canvas output.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L496-L528】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1395-L1562】
7. Overlay controls and metrics update ink intensity, cascade triggers, and logging, exposing draw toggles plus optional heatmap while emitting latency/frame samples to the console.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L173-L678】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L300-L409】

## Modules & Exact Paths

- Stage & geometry: `app/components/PointCloudStage.tsx` owns the R3F canvas, cap logic, fallback renderer, and bloom composer.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1-L528】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L475-L492】
- Material/uniforms: `app/components/dreamdust/DreamdustMaterial.ts` defines uniforms and shaders, while `app/components/dreamdust/useDreamdustUniforms.ts` drives reveal/cascade timelines and uniform updates.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L1-L470】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts†L45-L520】
- GLSL chunks: `app/components/dreamdust/glsl/chunks.ts` exports shared curl, depth, and sprite helpers consumed by the material.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts†L342-L416】
- Ink capture: `app/components/dreamdust/InkSurface.tsx` handles pointer capture, canvas painting, and texture flushes inside the WebGL stage.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L61-L333】
- Uniform drivers (reveal/time): `app/components/dreamdust/useDreamdustUniforms.ts` maintains viewport sync, tick loop, reveal/cascade lifecycles, and exposes setters for stage integration.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts†L164-L520】
- Metrics/logging: `app/components/dreamdust/metrics.ts` stores tunables, caps, ink latency sampling, and frame percentile logging utilities.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L1-L409】
- Route entry: `app/quiz/[slug]/page.tsx` loads the dynamic stage and overlay inside the Dreamdust provider for the quiz experience.【F:apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx†L10-L227】

## SDK/Monorepo Integration

- Package dependencies: the app pulls in `next@15.3.5`, `react`, `three@0.176.0`, and `@react-three/fiber`/`@react-three/drei` for stage rendering and controls.【F:apps/cryptiq-mindmap-demo/package.json†L16-L31】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1-L18】
- Shared utilities consumed: Dreamdust components reuse local helpers such as camera fitters, ink field factories, and stroke capture canvases from `app/components/anim` and `app/components/dreamdust` modules.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L19-L31】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L5-L31】
- Build/runtime: Next.js (Turbopack dev), R3F, and Three.js underpin the runtime; Dreamdust material composes repo GLSL chunks to render point clouds with interactive ink.【F:apps/cryptiq-mindmap-demo/package.json†L6-L31】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L1-L344】

## Caps & Budgets

- DPR clamp: the stage enforces `clampDPR(gl, 2)` (overrideable via env) when the canvas boots, recording the applied ratio alongside detected caps.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1429】【F:apps/cryptiq-mindmap-demo/app/components/pointcloud/budget.ts†L70-L91】
- Point budget: `pointCap()` defaults to 60 k points on mobile and 150 k on desktop, with env overrides, before feeding geometry decimation and HUD stats.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L699-L738】【F:apps/cryptiq-mindmap-demo/app/components/pointcloud/budget.ts†L43-L88】
- Fallback behavior: if the Dreamdust shader fails to compile within 180 frames or vertex textures are unsupported, the stage swaps to a `PointsMaterial` fallback and drops vertex-ink defines, retaining fragment ink for resilience.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L420-L492】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/capabilities.ts†L30-L107】
- Diagnostics: VTFSanity logs sample SIM UVs and confirm `USE_SIM_POS` whenever `debug=1`; `?debugSim=1` renders a plain `PointsMaterial` with color attributes for geometry sanity.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L974-L2475】

## Tunables & Presets (current)

- Reveal duration: tunables default to `revealMs: 2000` (clamped 300–8000 ms) and the uniform driver stretches reveal timelines to match the stored value or preset.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L145-L198】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts†L174-L341】
- Curl factor & evolution: Dreamdust seeds `uNoiseScale` and `uDriftAmp` from `curlFreq`/`curlAmp`, updating uniforms whenever tunables change to shape curl FBM strength.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L729-L751】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L260-L275】
- Rim gamma & breath amplitude: default uniforms set `uRimGamma: 2` and `uBreath: 0.5`, while the vertex shader modulates mist/point scale with a breathing sine wave per frame.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L26-L64】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L226-L304】
- Presets: three presets (`calm`, `breathy`, `vaporizeFast`) supply curated tunables and cascade size boosts persisted alongside the adjustable cascade slider.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/presets.ts†L3-L158】

## Observability

- One-shot logs: `logOnce` gates debug logs, emitting caps snapshots, ink latency, and frame percentiles only once per key in debug mode.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L54-L409】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1415-L1429】
- Reveal/cascade telemetry: the uniform driver logs reveal start/end and cascade start/end timings via `safeLog` when those timelines trigger.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts†L280-L340】
- Pointer metrics: ink latency uses pen-down/frame markers to log milliseconds and frame counts, while the overlay captures stroke velocity, travel, and exposes heatmap toggles for visual inspection.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/metrics.ts†L300-L379】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L177-L520】

## Risks / Constraints

- Vertex-texture dependence: Dreamdust’s vertex ink requires `MAX_VERTEX_TEXTURE_IMAGE_UNITS > 0`; lacking support triggers fallback materials and omits vertex ink effects.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/capabilities.ts†L30-L107】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L797-L817】
- Shader readiness timing: the stage polls for program compilation up to 180 frames before abandoning Dreamdust, which may mask slower devices and degrade visuals to the fallback renderer.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L420-L434】
- Renderer acquisition: `InkFieldHost` repeatedly polls for the R3F renderer before attaching ink textures, so delayed canvas mounts could postpone interaction and vertex-ink readiness.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L412-L459】

## Open Questions

- Should the 256² ink canvas used by `InkSurface` be aligned with the 128² field size in `InkFieldHost` to avoid mismatched sampling between stage and overlay heatmap outputs?【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L32-L114】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L22-L39】
- Can we consolidate the dual pointer pipelines (`InkSurface` inside the stage and `StrokeCaptureCanvas` in `InkFieldHost`) into a single source of truth to reduce duplicate logging and capture logic?【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1449-L1476】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx†L602-L678】
- Should bloom parameters (strength 0.12, radius 0.1, threshold 0.7) become tunables or preset-linked values rather than hard-coded constants in the stage?【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L496-L528】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1541-L1562】
