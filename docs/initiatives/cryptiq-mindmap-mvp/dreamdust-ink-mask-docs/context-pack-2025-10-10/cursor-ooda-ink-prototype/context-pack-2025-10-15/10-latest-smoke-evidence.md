---
title: Latest Smoke Evidence – Prod URL (scene-03)
date: 2025-10-16T22:58:24Z
tags: [evidence, smoke, prod]
commit: 3a84ff69
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&simParamPointBaseSize=5
---

Summary: Prod server verified (200 OK); shader gate clean; fluid initialized; `simParamPointBaseSize=5` honored; particles still not discernible in screenshots; under‑finger motion not yet visible. Changes under test: `uAlphaFloor 0.0 → 0.15` and point size override via URL.

Pipeline caveat: Console JSON was empty due to missing persistence in Playwright; spec fixed in commit 2ea36466 to write `console-<browser>-<runId>.json`.

Key console lines (MCP run):
- [INFO] [PC] fluid uniforms prime {invSize: [..], velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] fluid init {size: 256, iters: 10}
- No THREE.WebGLProgram validation errors observed.

Screenshots (MCP):
- pre: cursor-ooda-ink-prototype/assets/3a84ff69/docs/ink-falloff-flag-latch-2025-10-12/20251016-225824/2025-10-16-pre.png
- post-tap: cursor-ooda-ink-prototype/assets/3a84ff69/docs/ink-falloff-flag-latch-2025-10-12/20251016-225824/2025-10-16-post-tap.png
- post-drag: cursor-ooda-ink-prototype/assets/3a84ff69/docs/ink-falloff-flag-latch-2025-10-12/20251016-225824/2025-10-16-post-drag.png

Console log (MCP):
- cursor-ooda-ink-prototype/console/3a84ff69/docs/ink-falloff-flag-latch-2025-10-12/20251016-225824/console.json

Playwright result:
- BASE_URL=http://127.0.0.1:3000; SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&simParamPointBaseSize=5
- Spec: tests/ink.smoke.spec.ts → FAILED (waitForFunction timeout on reveal logs buffer); Artifacts:
  - .clmem/artifacts/playwright/ink.smoke-ink-smoke-quiz-route--chromium/test-failed-1.png
  - .clmem/artifacts/playwright/ink.smoke-ink-smoke-quiz-route--chromium/trace.zip
  - retry artifacts under ...-retry1/

Decision: FAIL (visibility) – despite size override and clean shader logs, screenshots show no visible points; console confirms fluid init and after‑reveal. Next: increase size further (e.g., simParamPointBaseSize=8) or temporarily pin a debug preset that forces `uPointBaseSize` and `uAlphaFloor` in code to isolate any UI/preset overwrite, then re‑run smoke.


