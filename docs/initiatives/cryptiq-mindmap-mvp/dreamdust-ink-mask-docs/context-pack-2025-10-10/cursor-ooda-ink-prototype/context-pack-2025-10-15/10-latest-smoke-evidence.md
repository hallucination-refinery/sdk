---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-20T20:21:00Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info]
commit: b6cf2605
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251020-201848`) and Playwright (`20251020-202100`) reruns on commit `b6cf2605` (includes `c1ea70ff` fix with `<RenderInfoLogger>`) confirmed the logger now emits `[PC] render-info` successfully, but reports **calls: 0, points: 0, triangles: 0**. Uniforms, blend/depth overrides, and fluid init all logged; screenshots remain blank. **FAIL (diagnostic)** — the draw call never executes. Milestone 1 complete (logger works); proceed to Milestone 2: debug stage binding (verify `stagePointsRef` attachment and material assignment).

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] render-info {calls: 0, points: 0, triangles: 0, mat: Object, uniforms: Object}` ← **Logger present, draw calls = 0**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] render-info {\"calls\":0,\"points\":0,\"triangles\":0,\"mat\":{\"uuid\":\"13b85bfd-08f0-47b0-bf00-aa7275c2a7f9\",\"blending\":2,\"depthTest\":false,\"depthWrite\":false,\"programCacheKey\":\"dreamdust-gauss-0\"},\"uniforms\":{\"uPointBaseSize\":8,\"uMinSize\":4,\"uMaxSize\":14,\"uAlphaFloor\":1,\"uVelToNdc\":0.028,\"uInkBlend\":0.78,\"uDepthNormScale\":0.00076,\"uDepthBias\":1.8}}`
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.
- Draw call counters prove **no geometry submitted to renderer**.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/b6cf2605/docs/ink-falloff-flag-latch-2025-10-12/20251020-201848/2025-10-20-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/b6cf2605/docs/ink-falloff-flag-latch-2025-10-12/20251020-202100/ink-chromium-20251020-202100-pre.png`
- `cursor-ooda-ink-prototype/assets/b6cf2605/docs/ink-falloff-flag-latch-2025-10-12/20251020-202100/ink-chromium-20251020-202100-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/b6cf2605/docs/ink-falloff-flag-latch-2025-10-12/20251020-201848/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/b6cf2605/docs/ink-falloff-flag-latch-2025-10-12/20251020-202100/console-chromium-20251020-202100.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.0 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (diagnostic)** — `<RenderInfoLogger>` successfully mounted and logging, but renderer stats prove zero draw calls. The issue is **not** shader gates or uniforms; the stage points are never submitted to WebGL. Next action: trace `stagePointsRef` binding in `PointCloudStage.tsx` to confirm the mesh exists and its material is attached to the scene graph.
