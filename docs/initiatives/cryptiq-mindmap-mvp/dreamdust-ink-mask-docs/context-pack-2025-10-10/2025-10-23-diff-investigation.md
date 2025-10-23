---
title: Dreamdust Visibility Regression – Diff Review (15ce295c → 6836ff45)
date: 2025-10-23T17:35:00Z
branch: docs/ink-falloff-flag-latch-2025-10-12
baseline: 15ce295c
regression: 6836ff45
trusted-evidence-root: cursor-ooda-ink-prototype/context-pack-2025-10-15
---

## Summary
- **Known good (15ce295c)** – Last pre-fluid checkpoint with Dreamdust verified as visible in earlier field notes, but no artifact for this commit exists inside the 2025-10-15 pack. Treat visibility as **assumed/needs reconfirmation** before rollback.
- **Regression (6836ff45)** – Integrates the fluid driver, rewrites Dreamdust vertex displacement to sample a velocity texture, and routes InkSurface splats into the solver. All downstream smokes (e.g., b675fa50) still render **0 draw calls**, leaving the canvas blank despite force-visible overrides.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md†L1-L48】
- **Impact** – Dreamdust now depends on vertex texture fetch + WebGL2 surfaces before it can render. On targets that lack those capabilities the shader fails to execute, so the points never draw, explaining the persistent 0-call telemetry.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L101-L110】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L518-L529】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts†L82-L149】

## Code Diff Highlights
- **Fluid infrastructure added** – `FluidSim` spins up a 256² WebGL2 ping-pong stack (advect/divergence/Jacobi/project) and demands half/float render targets, raising the floor on GPU feature support.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts†L61-L278】
- **Stage wiring** – `PointCloudStage` now instantiates the solver, pushes its textures into Dreamdust uniforms, and introduces `<FluidDriver>` to step the sim each frame (with optional disable flag).【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L55-L65】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L904-L974】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1630-L1675】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1920-L1976】
- **Vertex displacement overhaul** – Dreamdust’s vertex shader now clamps clip-space UVs and samples `uVelocity`, blending the offset via `uInkBlend`; defaults seed a dummy float texture until FluidSim primes real data.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L90-L110】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L518-L529】
- **Input propagation** – InkSurface emits `onForceSplat` packets for every stroke/tap so pointer energy reaches the fluid solver; `PointCloudStage` relays those splats into `FluidSim.addForce`.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx†L267-L392】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L3056-L3216】

## Smoke Evidence
| Commit | Result | Key evidence |
| --- | --- | --- |
| b675fa50 (descendant of 6836ff45) | **FAIL – particles invisible** | MCP smoke logs capture `render-info {calls: 0, points: 0}` and blank screenshots despite force-visible overrides.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md†L12-L48】 |
| 15ce295c | **GAP – no archived run** | No console/screenshot evidence under the 2025-10-15 pack. Re-run smoke to confirm stated “visible” baseline before bisecting further. |

## Root Cause Analysis
1. **New GPU capability requirement** – The regression range introduces vertex-texture sampling for Dreamdust displacements and enforces a WebGL2 context for `FluidSim`. Targets without WebGL2 or `GL_MAX_VERTEX_TEXTURE_IMAGE_UNITS > 0` cannot satisfy those requirements; shader compilation fails silently, leaving the points mesh mounted but never rendered (0 draw calls).【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L101-L110】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L518-L529】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts†L82-L149】
2. **Uniform bridge confirmed active** – Stage logs show `fluid uniforms prime` and `points-mesh {visible: true}`, so the mesh remains attached; the failure happens post-binding when the shader attempts to execute with unsupported vertex fetch.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L1630-L1675】【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md†L13-L21】
3. **Fluid driver currently disabled** – `FLUID_DRIVER_DISABLED_FOR_DIAGNOSTIC = true` stops runtime stepping, yet the shader still samples velocity every frame. This guard prevents the solver from running but does not mitigate the vertex-texture requirement, so visibility remains broken even with the driver off.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L55-L65】【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L904-L974】

## Recommendations
1. **Restore fallback path** – Gate the Dreamdust vertex shader so it skips `texture2D(uVelocity, …)` when vertex textures are unsupported, reverting to the pre-fluid code path. Add a runtime capability probe before enabling the fluid displacement.【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts†L518-L529】
2. **Capability telemetry** – Extend the existing render-info logger to report `renderer.capabilities.maxVertexTextures` and WebGL version so future smokes capture whether the environment can sustain the fluid path.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L904-L974】【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md†L12-L48】
3. **Baseline verification** – Run the smoke harness on 15ce295c (archiving console + screenshot under the trusted pack) to confirm visibility before implementing fixes; this anchors the rollback decision.
4. **If fluid must remain optional** – Defer solver initialization when the disable flag is active to avoid WebGL2-only code paths in fallback scenarios.【F:apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx†L55-L65】【F:apps/cryptiq-mindmap-demo/app/components/dreamdust/fluid/FluidSim.ts†L82-L149】
