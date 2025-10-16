---
title: Latest Smoke Evidence – Prod URL (scene-03)
date: 2025-10-16T19:08:30Z
tags: [evidence, smoke, prod]
commit: a1c72c41
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03
---

Summary: Prod server verified (200 OK); shader gate clean; fluid initialized; particles still not visually apparent in screenshots. Change under test: `uAlphaFloor 0.0 → 0.15`.

Key console lines (MCP run):
- [INFO] [PC] fluid uniforms prime {invSize: [..], velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] fluid init {size: 256, iters: 10}
- No THREE.WebGLProgram validation errors observed.

Screenshots (MCP):
- pre: cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-pre.png
- post-tap: cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-post-tap.png
- post-drag: cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-post-drag.png
- debug: cursor-ooda-ink-prototype/assets/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190758/2025-10-16-debug.png

Console log (MCP):
- cursor-ooda-ink-prototype/console/a1c72c41/docs/ink-falloff-flag-latch-2025-10-12/20251016-190812/console.json

Playwright result:
- BASE_URL=http://127.0.0.1:3000; SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03
- Spec: tests/brain.smoke.spec.ts (expected to target /brain overlay) → FAILED (timeout waiting for Brain Vertices overlay). Artifacts:
  - .clmem/artifacts/playwright/brain.smoke-brain-smoke-chromium/test-failed-1.png
  - .clmem/artifacts/playwright/brain.smoke-brain-smoke-chromium/trace.zip
  - retry artifacts under ...-retry1/

Decision: FAIL (visibility) – particles not discernible; next step is to raise visibility gates (`uAlphaFloor`, `uPointBaseSize`) and re‑run. Playwright spec must be adjusted to a quiz/scene route or a dedicated ink smoke to avoid relying on `/brain` overlay.


