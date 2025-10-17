---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-17T19:04:24Z
tags: [evidence, smoke, prod, forceVisible, diagnostic]
commit: c2f62ddf
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP and Playwright reruns on commit `c2f62ddf` confirmed the server delivers scene-03 with `forceVisible=1`; uniforms, blend/depth overrides, and fluid init all logged, yet screenshots remain blank. The newly added render-stat instrumentation failed to emit a `[PC] render-info …` entry, so we still cannot prove a point-cloud draw call. FAIL (visibility) — focus shifts to verifying stage material binding and emitter draw submission.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`
- _Expected_ `[PC] render-info …` log **not present** in `console-mcp.json`; instrumentation needs follow-up.

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] render-info …` **absent** in all chromium console captures; draw path remains unverified.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-185946/2025-10-17-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-190424/ink-chromium-20251017-190424-pre.png`
- `cursor-ooda-ink-prototype/assets/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-190424/ink-chromium-20251017-190424-post.png`
- Historical captures from the same run preserved under `20251017-185640/` (still blank).

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-185946/console-mcp.json`
- Playwright (final attempt): `cursor-ooda-ink-prototype/console/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-190424/console-chromium-20251017-190424.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 1.8 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (visibility)** — even after reiterating `forceVisible`, all diagnostics show uniforms/geometry present but no rendered points. Absence of the new `[PC] render-info …` log suggests the draw pipeline is still uninstrumented or not firing, so the next iteration must confirm renderer submission before tweaking shader gates.
