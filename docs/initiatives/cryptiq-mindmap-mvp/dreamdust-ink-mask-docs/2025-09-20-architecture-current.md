# Dreamdust Ink — Current Architecture & Data Flow (Template)

## Scope

- App: `apps/cryptiq-mindmap-demo`
- Surface(s): {pages/components}
- Out of scope: {packages/apps not touched}

## High-Level Diagram (describe or paste link)

- {UI} → {Pointer capture} → {Interaction texture (off-screen)} → {R3F Stage} → {ShaderMaterial (vertex/fragment)} → {Post (bloom)} → {HUD/Meta}

## Data Flow (numbered steps)

1. Pointer events captured on `gl.domElement` → normalized UVs
2. UVs written to off-screen canvas → `THREE.DataTexture` (or FBO)
3. Stage binds `uInkTex`, caps snapshot, reveal clock to `ShaderMaterial`
4. Vertex: positions + curl/FBM → offset; Fragment: soft-sprite + rim/tint
5. Post-processing (if any) blends final frame to Canvas; one-shot logs emit

## Modules & Exact Paths

- Stage & geometry: `app/components/PointCloudStage.tsx`
- Material/uniforms: `app/components/dreamdust/DreamdustMaterial.ts`
- GLSL chunks: `app/components/dreamdust/glsl/chunks.ts`
- Ink capture: `app/components/dreamdust/InkSurface.tsx`
- Uniform drivers (reveal/time): `app/components/dreamdust/useDreamdustUniforms.ts`
- Metrics/logging: `app/components/dreamdust/metrics.ts`
- Route entry: `app/quiz/[slug]/page.tsx`

## SDK/Monorepo Integration

- Package dependencies used by the app: {list package names and roles}
- Shared utilities consumed: {paths}
- Build/runtime: Next.js 15 (Turbopack), R3F, Three.js

## Caps & Budgets

- DPR clamp: {value}
- Point budget: {value}
- Fallback behavior: {fragment-only/PointsMaterial}

## Tunables & Presets (current)

- revealDuration: {num}
- curlFactor/evolution: {values}
- rimGamma/breathAmp: {values}
- presets: {names with values}

## Observability

- One-shot logs: {caps, instances, reveal, percentiles, ink-latency}
- Where emitted: {files}

## Risks / Constraints

- {driver support, VTF, perf heads-up}

## Open Questions

- {fill}
