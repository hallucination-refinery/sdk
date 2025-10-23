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

## Audit Findings — 2025-10-23

### Methodology
- Reviewed this report for explicit claims, then cross-referenced supporting artifacts inside `context-pack-2025-10-15/`.
- Inspected MCP console captures for commit `b675fa50` to verify run-time telemetry (`cursor-ooda-ink-prototype/console/b675fa50/docs/ink-falloff-flag-latch-2025-10-12/20251023-160648/console-mcp.json`).
- Consulted in-pack technical notes and audits (`context-pack-2025-10-15/05-state-and-uniforms-audit.md`, `context-pack-2025-10-15/02-architecture-overview.md`, `context-pack-2025-10-15/10-latest-smoke-evidence.md`) to confirm shader and stage behaviors.
- Searched the context pack for baseline commit evidence (`rg 15ce295c`) to validate reported gaps.

### Findings
- **PASS**: MCP smoke for `b675fa50` logs `[PC] render-info {calls: 0, points: 0}` and `[PC] points-mesh {visible: true...}`, confirming the documented zero-draw failure despite the mesh being mounted (`cursor-ooda-ink-prototype/console/b675fa50/docs/ink-falloff-flag-latch-2025-10-12/20251023-160648/console-mcp.json:174` and `:179`; summarised in `context-pack-2025-10-15/10-latest-smoke-evidence.md:12`).
- **PASS**: The diagnostic guard skipping the fluid driver is evidenced by `[PC] fluid-step skipped {reason: diagnostic-disable}`, matching the narrative that the solver is disabled while uniforms continue to bind (`cursor-ooda-ink-prototype/console/b675fa50/docs/ink-falloff-flag-latch-2025-10-12/20251023-160648/console-mcp.json:159`).
- **PASS**: In-pack audits document the active uniform bridge and vertex sampling of `uVelocity`, supporting the statements about the material relying on velocity textures (`context-pack-2025-10-15/05-state-and-uniforms-audit.md:345`, `:379`, and `context-pack-2025-10-15/03-rendering-pipeline-trace.md:9`).
- **PARTIAL**: The claim that the regression introduces a WebGL2 + vertex-texture dependency is consistent with the architecture overview (`context-pack-2025-10-15/02-architecture-overview.md:19`) and shader audit, but no artifact in this pack links that requirement specifically to commits `15ce295c → 6836ff45` or demonstrates failure on a capability-limited device.
- **PARTIAL**: Code-diff bullets cite repository paths (`apps/cryptiq-mindmap-demo/...`), yet the context pack lacks an embedded diff or snapshot for those files tied to the regression range; only secondary documentation echoes the behaviors.
- **FAIL**: The assertion that 15ce295c is a “known good” visible baseline is unsupported here—no smoke artifacts or field notes for that commit exist inside `context-pack-2025-10-15/` (search returned no matches).

### Gaps / Risks
- Baseline commit 15ce295c lacks archived smoke output, leaving the “known good” assumption unverified.
- Diff-specific evidence for commits `15ce295c → 6836ff45` is absent; the report leans on live source references outside the trusted context pack.
- Root-cause reasoning cites hardware capability limits without correlating telemetry (e.g., max vertex textures) from the failing smoke runs.
- Heavy reliance on repository paths (`apps/cryptiq-mindmap-demo/...`) may drift if the code moves; the context pack has no immutable excerpts for those sections.

### Recommendations
- Capture and archive a fresh smoke run for 15ce295c within this context pack to validate the baseline claim.
- Attach or excerpt the relevant diffs/shader snippets inside the pack (or link to existing audit excerpts) so future readers can trace the regression without leaving the trusted scope.
- Extend smoke logging to include capability probes (`renderer.capabilities.maxVertexTextures`, WebGL version) to substantiate the capability-failure hypothesis using in-pack evidence.
- When referencing source files, mirror the critical snippets in the context pack (as done in `05-state-and-uniforms-audit.md`) to keep the investigation traceable even if the repository evolves.
