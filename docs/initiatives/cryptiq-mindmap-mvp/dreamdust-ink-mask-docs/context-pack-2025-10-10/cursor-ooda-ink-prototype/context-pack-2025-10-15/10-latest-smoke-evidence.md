---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-17T18:02:57Z
tags: [evidence, smoke, prod, forceVisible, diagnostic]
commit: e68bd701
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: Prod server verified (200 OK); shader gate clean; forceVisible bypass APPLIED (`depthTest=false`, `blending=2/additive`, `applied=true`); uniforms slammed (`uReveal=1`, `uAlphaFloor=1`, `uPointBaseSize=8`, `uMinSize=4`, `uMaxSize=14`); fluid initialized; geometry present (90650 instances); particles STILL NOT VISIBLE. FAIL (visibility) — bypass confirms issue is NOT reveal/depth/alpha gating; escalate to material binding, gl_PointSize computation, or renderer draw calls.

Key console lines (MCP + Playwright):
- [INFO] [PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}
- [INFO] [PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}
- [INFO] [PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}
- [INFO] [PC] fluid init {size: 256, iters: 10}
- [LOG] [PC] instances: 90650
- [INFO] [preset] {preset: current, blending: 1, blendingName: NormalBlending, depthTest: true, hasGaussian: false} (before forceVisible override)
- [INFO] [PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true} (after override)
- No THREE.WebGLProgram validation errors observed.

Screenshots (MCP):
- cursor-ooda-ink-prototype/assets/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/2025-10-17-forceVisible-mcp.png

Screenshots (Playwright):
- cursor-ooda-ink-prototype/assets/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180257/ink-chromium-20251017-180257-pre.png
- cursor-ooda-ink-prototype/assets/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180257/ink-chromium-20251017-180257-post.png

Console logs:
- MCP: cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180014/console-mcp.json
- Playwright: cursor-ooda-ink-prototype/console/e68bd701/docs/ink-falloff-flag-latch-2025-10-12/20251017-180257/console-chromium-20251017-180257.json

Playwright result:
- BASE_URL=http://127.0.0.1:3000; SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1
- Spec: tests/ink.smoke.spec.ts → PASSED (1 test, 2.0s); all gates satisfied; console JSON persisted; deterministic viewport/DPR enforced.

Decision: FAIL (visibility) — forceVisible bypass correctly applied (uniforms set, depthTest disabled, additive blending active, applied=true confirmed in second log) but screenshots remain black; geometry present (90650 instances logged, prebaked positions loaded); issue is NOT alpha/depth/reveal gating. Next: investigate whether material instance bound to stagePointsRef receives the forceVisible uniform writes, verify gl_PointSize is computed >0 (check vertex shader or add probe), inspect renderer.info.render.calls to confirm draw submission, or check if preset swap post-override reverts the blend/depth flags.


