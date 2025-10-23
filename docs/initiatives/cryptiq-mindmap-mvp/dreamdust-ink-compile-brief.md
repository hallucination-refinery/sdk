# Dreamdust Ink Compile Brief

## Executive Summary
- Route `/quiz/[slug]?pc=scene-02&debug=1` currently drives the “Dreamdust Ink” effect inside the `cryptiq-mindmap-demo` surface. The flow clamps device pixel ratio, holds ≤150k points on desktop, preserves a persistent Canvas, and falls back to fragment-only tinting when `vertexInkOk=false`.
- WebGL program compilation fails on the Dreamdust vertex shader, preventing reveal visuals from appearing even though runtime caps report `vertexInkOk: true`, `dprClamp: 1.8`, and instancing reaches `instances: 134162`.
- No code changes in this PR; this document consolidates the compile failure analysis and next actions for a solo developer to implement on a follow-up branch.

## Current State
- Environment (documented, not executed):
  ```ini
  NODE_ENV=development
  NEXT_PUBLIC_GRAPH_SPAWN=sphere
  NEXT_PUBLIC_DEBUG_GRAPH=false
  NEXT_PUBLIC_PIXELATE=0
  NEXT_PUBLIC_SCREENSHOT_MODE=0
  NEXT_PUBLIC_ENABLE_CONTROLS=0
  ```
- Runtime debug captures report `[dreamdust] caps` payloads with `{ vertexInkOk: true, dprClamp: 1.8, instances: 134162 }`, indicating the guardrails engage yet the shader fails to link before reveal logs such as `[Dreamdust] reveal start` can complete the cycle.
- The vertex shader emitted by `DreamdustMaterial.ts` still declares raw `attribute` bindings and calls `dd_fbm3Vec`, a helper missing from the shared GLSL chunks.

## Expected vs Actual
- **Expected:** Dreamdust Ink vertex shader compiles, reveal noise animates, cascade/vapor flow renders at ≥60 FPS on desktop, and caps logs appear once alongside reveal start/end logs.
- **Actual:** WebGL compile aborts with `ERROR: 'position' : redefinition` and `ERROR: 'dd_fbm3Vec' : no matching overloaded function found`, so the reveal never reaches visible stages.

## Primary Blocker
- Vertex shader compilation halts because `dd_fbm3Vec` is undefined and because explicit `attribute` declarations in the assembled shader collide with Three.js’ injected `position`/`uv` bindings, leading to attribute redefinition.

## Root Cause (GLSL function mismatch and attribute redefinition)
- `DreamdustMaterial.ts` injects vertex shader lines `attribute vec3 position;`, `attribute vec2 aUv;`, `attribute float aDepth;`, and `attribute vec3 color;`, then invokes `vec3 vaporFlow = dd_fbm3Vec(vaporSample) - vec3(0.5);`, even though the shared chunks only expose `dd_fbm3(vec3)` and `dd_curl3(vec3)` helpers.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L177-L275】
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts` defines `dd_fbm3` and `dd_curl3` around `dd_fbm3Field` but contains no `dd_fbm3Vec` overload and no vertex attribute declarations, confirming the mismatch stems from the assembled material rather than the shared chunks.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts†L267-L347】

## Action Plan
1) Scope to demo app on feat/dreamdust-compile-fix; use filtered baseline checks.
2) Unblock compile: align fbm naming/signature (implement dd_fbm3Vec(vec3) or call existing dd_fbm3(vec3)); remove attribute/varying qualifiers from chunks to avoid position redefinition.
3) Add compile guard: log first ~20 lines of vertex/fragment on error; optional minimal PointsMaterial fallback.
4) Clean test cycle: stop dev server, rm -rf apps/cryptiq-mindmap-demo/.next, relaunch, reload route.
5) Defer repo-wide hygiene; track follow-ups as issues.

## Acceptance Criteria
- Dreamdust shader compiles without errors on desktop browsers.
- Reveal remains visible (reveal start/end logs fire and the point cloud animates).
- ≥60 FPS sustained on desktop under the ≤150k point guardrail.
- A single `[dreamdust] caps` payload and one `[PC] instances` log appear per session.
- Fragment-only path remains available and rendering when `vertexInkOk=false`.

## Performance Guardrails
- Maintain DPR clamp at ≤1.8 for desktop, mirroring current caps output.
- Keep Dreamdust point budgets ≤150k instances while preserving cascade reveal quality.
- Ensure fragment-only tint fallback activates when vertex textures are unavailable (`vertexInkOk=false`).
- Preserve the persistent Canvas between route transitions to avoid reinitialization cost spikes.

## Baseline Commands (document only)
```bash
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit \
  || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit
pnpm --filter cryptiq-mindmap-demo run lint || true
pnpm --filter cryptiq-mindmap-demo run build
pnpm run smoke
```

## Risks / Assumptions
- Assumes the compile fix remains localized to `cryptiq-mindmap-demo` without needing workspace-wide shader infrastructure updates.
- Relies on Three.js injecting standard attributes; removing explicit qualifiers must not break legacy GL contexts.
- Assumes logging the first ~20 shader lines is sufficient to triage any residual compile failures.
- Presumes the recorded caps (`vertexInkOk: true, dprClamp: 1.8`) persist after the fix; deviations could mask other driver limits.

## Appendix — Key Logs and Code Evidence
### Observed Logs (debug route)
```text
[dreamdust] caps { vertexInkOk: true, dprClamp: 1.8, instances: 134162 }
[PC] instances: 134162
[Dreamdust] reveal start { duration: 6.000 }
[Dreamdust] reveal end { duration: 6.000 }
THREE.WebGLProgram: shader error 0 35715 35714
ERROR: 'position' : redefinition
ERROR: 'dd_fbm3Vec' : no matching overloaded function found
```

### Shader Source References
- `DreamdustMaterial.ts` vertex shader excerpt (attributes and curl/FBM usage):
  ```glsl
  attribute vec3 position;
  attribute vec2 aUv;
  attribute float aDepth;
  attribute vec3 color;
  ...
  vec3 curlOffset = dd_curl3(curlSample) * curlMix;
  vec3 vaporFlow = dd_fbm3Vec(vaporSample) - vec3(0.5);
  ```
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts` FBM helpers:
  ```glsl
  float dd_fbm3(vec3 dd_p) { ... }
  vec3 dd_curl3(vec3 dd_p) { ... }
  ```
  (No `dd_fbm3Vec` overload and no vertex attribute declarations in chunks.)
