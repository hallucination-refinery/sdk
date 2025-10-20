---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-20T20:46:26Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, breakthrough]
commit: 16c73c7e
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251020-204451`) and Playwright (`20251020-204626`) reruns on commit `16c73c7e` (hardened `<RenderInfoLogger>` with 60-frame sampling) revealed **CRITICAL BREAKTHROUGH**: `calls: 1, points: 0, triangles: 2, timeout: false, framesWaited: 2`. The renderer IS executing draw calls, but rendering **triangles** instead of **points**. **FAIL (diagnostic)** — stage points geometry not submitting; investigate geometry type mismatch or mesh visibility/attachment.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **BREAKTHROUGH: calls=1 but points=0, triangles=2**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] render-info {\"calls\":1,\"points\":0,\"triangles\":2,\"mat\":{\"uuid\":\"eaa80575-0d5a-4324-bc7b-8aaf5d6f7225\",\"blending\":2,\"depthTest\":false,\"depthWrite\":false,\"programCacheKey\":\"dreamdust-gauss-0\"},\"uniforms\":{\"uPointBaseSize\":8,\"uMinSize\":4,\"uMaxSize\":14,\"uAlphaFloor\":1,\"uVelToNdc\":0.028,\"uInkBlend\":0.78,\"uDepthNormScale\":0.00076,\"uDepthBias\":1.8},\"timeout\":false,\"framesWaited\":2}`
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.
- **Logger did NOT timeout** (`timeout: false`, `framesWaited: 2`) — draw calls executed immediately.
- **Critical finding**: `calls: 1` proves renderer is submitting geometry, but `points: 0` and `triangles: 2` indicate the wrong geometry type or the stage points mesh is not visible/attached.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204451/2025-10-20-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204626/ink-chromium-20251020-204626-pre.png`
- `cursor-ooda-ink-prototype/assets/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204626/ink-chromium-20251020-204626-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204451/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/16c73c7e/docs/ink-falloff-flag-latch-2025-10-12/20251020-204626/console-chromium-20251020-204626.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.1 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (diagnostic) BUT MAJOR PROGRESS** — `<RenderInfoLogger>` with 60-frame sampling successfully logged renderer stats without timeout. **Critical finding**: `calls: 1` proves the draw pipeline executes, but `points: 0` and `triangles: 2` reveal the stage points are NOT being rendered. Hypothesis: either (a) the `<points>` mesh is not mounted/visible, (b) a different mesh (background plane?) is being counted instead, or (c) the stage points geometry type is incorrect (mesh vs points). Next action (Milestone 2): trace `stagePointsRef.current` to verify mesh existence, visibility, and geometry type; log scene graph children to confirm attachment.
