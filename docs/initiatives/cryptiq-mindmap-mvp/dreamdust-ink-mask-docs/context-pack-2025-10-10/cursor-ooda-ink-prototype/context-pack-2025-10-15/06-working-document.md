---
title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-16T18:40:55Z
commit: 8944414b
branch: docs/ink-falloff-flag-latch-2025-10-12
---

## Objective (1–2 lines)
- Make particles clearly visible and show under‑finger motion within ≤2 frames while keeping the shader gate clean and camera unchanged.

## Current Status (facts only)
- Prod URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03` (10-latest-smoke-evidence.md).
- Shader gate clean; `[PC] fluid uniforms prime`, `[PC] uniforms after-reveal`, `[PC] fluid init` present (10-latest-smoke-evidence.md).
- Particles not visually apparent in screenshots; motion unverified (10-latest-smoke-evidence.md).
- Playwright spec targets `/brain` overlay and timed out on quiz route; dedicated ink spec is TODO (09-runbooks.md).
- Perf p50/p90: TBD.

## Single Hypothesis (1 line)
- Visibility gates (alpha/size) are too conservative (`uAlphaFloor=0.0`, modest `uPointBaseSize`), hiding otherwise correct fluid‑driven displacement (02/03/05 + latest evidence).

## Single Change to Make (surgical, testable)
- Edit `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` default uniforms: set `uAlphaFloor` from `0.0` → `0.15` (range considered safe 0.10–0.20) in the material uniform seed block (05-state citations around the defaults; fragment uses it in alpha path near sprite/reveal logic).
- No other edits this iteration. Rollback: revert `uAlphaFloor` to `0.0`.

## Acceptance Gates (binary)
- From vision (01):
  - Under‑finger visible motion within ≤2 frames after tap.
  - Motion localized with smooth decay; no global jerk.
  - Camera unchanged; shader gate clean; p50 ≤10 ms.
- This run’s single PASS/FAIL check: under‑finger motion is clearly visible within ≤2 frames (particles visible is prerequisite).

## Run Plan (copy‑runnable)
- Follow 09‑runbooks.md (Node 20):
  - `nvm use 20`; clean: remove `.next` in `apps/cryptiq-mindmap-demo/`.
  - Build: `pnpm --filter cryptiq-mindmap-demo run build`; Start: `pnpm --filter cryptiq-mindmap-demo run start`.
  - Verify: `curl -I 127.0.0.1:3000` → `200 OK`.
- MCP smoke (operator‑driven):
  - Navigate to `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&falloff=1`.
  - Wait for `[PC] uniforms after-reveal`, `[PC] fluid uniforms prime`, `[PC] fluid init`; assert no `THREE.WebGLProgram` errors.
  - Optional: save screenshots; console JSON paths remain placeholders this pass.
- Playwright (CI‑ready): run as in 09‑runbooks.md; note current spec targets `/brain` (ink spec TODO). Parameterize or accept mismatch this pass.
- Record evidence: copy the three `[PC]` console lines and PASS/FAIL note into `10-latest-smoke-evidence.md`; screenshots optional.

## Risks & Fallbacks
- Increased overdraw from higher alpha may impact p50; monitor (01). Rollback: revert `uAlphaFloor` to `0.0`.
- If still invisible: next single change is `uPointBaseSize` (e.g., `3.0` → `5.0`) in `DreamdustMaterial.ts` (04/05).
- If motion remains weak: toggle `fluidBoost` (resolves `uVelToNdc=0.045`, `uInkBlend=1.0`) per `PointCloudStage.tsx` (02/03/05).
- Preserve GLSL3/ShaderMaterial integrations and premultiplied alpha (04); do not add `#version` or alter blending/depthWrite this run.
- RT hygiene and uniform invariants must stay intact (04/05).

## Evidence Pointers (paths only)
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md`
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/05-state-and-uniforms-audit.md`
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/02-architecture-overview.md`
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/03-rendering-pipeline-trace.md`
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/09-runbooks.md`
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`

## Decision Line (to be filled after run)
- `uAlphaFloor 0.0 → 0.15` → PASS/FAIL because <observed under‑finger visibility within ≤2 frames; cite console lines + (optional) screenshot path>.


