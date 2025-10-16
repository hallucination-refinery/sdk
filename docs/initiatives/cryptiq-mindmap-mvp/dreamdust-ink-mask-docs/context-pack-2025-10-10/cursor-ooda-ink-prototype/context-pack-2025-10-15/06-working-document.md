title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-16T19:48:20Z
commit: 63719177
branch: docs/ink-falloff-flag-latch-2025-10-12
---

## Objective (1–2 lines)
- Achieve visible particles and ≤2‑frame under‑finger motion with a clean shader gate and fixed camera, per vision gates.

## Current Status (facts only)
- URL under test: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03` (10‑latest‑smoke‑evidence.md).
- Change under test (last run): `uAlphaFloor 0.0 → 0.15` in `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` defaults; now present at defaults and used in fragment alpha path (05/DM‑ALPHA; grep shows `uAlphaFloor: 0.15`).
- Key console lines (observed): `[PC] fluid uniforms prime …`, `[PC] uniforms after‑reveal …`, `[PC] fluid init …`; no shader link/validate errors this iteration (10‑latest‑smoke‑evidence.md).
- Visibility/motion: particles still not clearly visible; under‑finger motion unverified (10‑latest‑smoke‑evidence.md).
- Artifacts: screenshots
  - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-pre.png`
  - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-post-tap.png`
  - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-post-drag.png`
  - `cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-debug.png`
- Console JSON: `cursor-ooda-ink-prototype/console/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190812/console.json`.
- Playwright: spec currently targets `/brain`; mismatch on quiz route; dedicated ink spec is TODO (09‑runbooks.md). Perf p50/p90: TBD.

## Single Hypothesis (1 line)
- Particle footprint is too small (`uPointBaseSize=3.0` default) so even with `uAlphaFloor=0.15` the sprites remain visually sparse/undetectable (02/05 DM‑SIZE path).

## Single Change to Make (surgical, testable)
- Diagnostic bypass first (one run): Force visibility to isolate gating. In `PointCloudStage.tsx`, write uniforms once after reveal bootstrap: `setUniform('uReveal', 1)`, optionally set `uNoiseThreshold` lower (e.g., `0.1`) and temporarily relax depth fade (`uDepthBias` smaller or `uDepthNormScale` smaller) to prevent fragment discard. PASS if particles appear → confirms gating; then revert these writes.
- If geometry is confirmed: File `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`; change default `uPointBaseSize 3.0 → 5.0` (safe 4.0–6.0) to increase footprint without coupling to physics.
- Rollback: remove bypass lines; restore `uPointBaseSize` to `3.0` if overdraw/halo or perf regress.

## Acceptance Gates (binary)
- From 01‑vision: under‑finger visible motion within ≤2 frames; localized response and smooth decay; camera unchanged; shader gate clean; p50 ≤10 ms.
- This run’s PASS/FAIL: under‑finger motion clearly visible within ≤2 frames (particles visibly present is the prerequisite).

## Run Plan (copy‑runnable)
- Node 20 build/start (09‑runbooks.md): `nvm use 20`; remove `apps/cryptiq-mindmap-demo/.next`; `pnpm --filter cryptiq-mindmap-demo run build`; `pnpm --filter cryptiq-mindmap-demo run start`; verify `curl -I 127.0.0.1:3000` → 200.
- MCP smoke (bypass run): navigate to the URL; verify `[PC]` logs; set `uReveal=1` (and optionally `uNoiseThreshold=0.1`, depth knobs) via the planned code writes; assert particles visible; then revert.
- MCP smoke (change run): after reverting bypass, apply `uPointBaseSize 3.0 → 5.0`; re-run and check ≤2‑frame under‑finger visibility; save console JSON and screenshots.
- Playwright: run as in 09; note quiz/scene vs `/brain` mismatch (ink spec TODO); parameterize or accept mismatch this pass.
- Evidence capture: paste `[PC]` lines and PASS/FAIL to `10-latest-smoke-evidence.md`; include artifact paths above.

## Risks & Fallbacks
- Overdraw/halo risk from larger sprites; monitor p50 (01). Rollback to `3.0` if degraded.
- If still invisible: next single change is `resolvedVelToNdc` boost via `fluidBoost` (02/05; `0.028 → 0.045`) while keeping `uInkBlend` ≤1.0.
- Maintain GLSL3/ShaderMaterial and premultiplied alpha discipline (04); no manual `#version`, no blend/depthWrite edits this iteration.
- Keep uniform invariants and RT hygiene intact (04/05); do not create feedback loops.

## Evidence Pointers
- `.../context-pack-2025-10-15/10-latest-smoke-evidence.md`
- Artifacts: the 4 `assets/...png` and `console/.../console.json` paths above.
- Code/flows: `.../02-architecture-overview.md`, `.../03-rendering-pipeline-trace.md`, `.../05-state-and-uniforms-audit.md`, `.../09-runbooks.md`.

## Decision Line (to be filled after run)
- `uPointBaseSize 3.0 → 5.0` → PASS/FAIL because <observed under‑finger visibility within ≤2 frames; cite console lines + screenshot path>.


