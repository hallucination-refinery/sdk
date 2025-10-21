---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T01:17:25Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, CRITICAL]
commit: 1d8dccf4
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-011543`) and Playwright (`20251021-011725`) reruns on commit `1d8dccf4` (added `[PC] points-mesh` snapshot logging) revealed **SMOKING GUN**: Points mesh EXISTS with correct type, IS visible, HAS 90650 vertices loaded in geometry, but WebGL renderer reports `calls: 1, points: 0, triangles: 2`. **FAIL (diagnostic)** — mesh is correctly configured but NOT being rendered as points. Root cause: WebGL is counting 2 triangles instead of points, suggesting either (a) the Points mesh is being culled/skipped before submission, or (b) a different mesh (background?) is being counted by renderer stats.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[vertex] geometry attribute summary {geometryUuid: 1ef6b48a-770e-49e9-9562-8604cac1c261, position: 90650, color: 90650, aUv: 90650, uv: 90650}` ← **Geometry fully populated**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **SMOKING GUN: Mesh correctly configured**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **BUT renderer counts 0 points, 2 triangles**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] points-mesh {\"type\":\"Points\",\"visible\":true,\"frustumCulled\":false,\"renderOrder\":1,\"parentType\":\"Group\",\"matrixWorldDet\":1,\"positionCount\":90650,\"colorCount\":90650,\"uvCount\":0,\"depthCount\":0,\"materialUuid\":\"7ec8ecf5-d4c7-42ce-b36f-3d8289957c89\"}` ← **Full detail: 90650 positions, 90650 colors loaded**
- `[PC] render-info {\"calls\":1,\"points\":0,\"triangles\":2,\"mat\":{\"uuid\":\"7ec8ecf5-d4c7-42ce-b36f-3d8289957c89\",\"blending\":2,\"depthTest\":false,\"depthWrite\":false,\"programCacheKey\":\"dreamdust-gauss-0\"},\"uniforms\":{\"uPointBaseSize\":8,\"uMinSize\":4,\"uMaxSize\":14,\"uAlphaFloor\":1,\"uVelToNdc\":0.028,\"uInkBlend\":0.78,\"uDepthNormScale\":0.00076,\"uDepthBias\":1.8},\"timeout\":false,\"framesWaited\":2}`
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.
- **Logger did NOT timeout** (`timeout: false`, `framesWaited: 2`) — draw calls executed immediately.
- **CRITICAL MISMATCH**: Points mesh has `positionCount: 90650, colorCount: 90650` but renderer stats show `points: 0, triangles: 2`.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/1d8dccf4/docs/ink-falloff-flag-latch-2025-10-12/20251021-011543/2025-10-21-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/1d8dccf4/docs/ink-falloff-flag-latch-2025-10-12/20251021-011725/ink-chromium-20251021-011725-pre.png`
- `cursor-ooda-ink-prototype/assets/1d8dccf4/docs/ink-falloff-flag-latch-2025-10-12/20251021-011725/ink-chromium-20251021-011725-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/1d8dccf4/docs/ink-falloff-flag-latch-2025-10-12/20251021-011543/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/1d8dccf4/docs/ink-falloff-flag-latch-2025-10-12/20251021-011725/console-chromium-20251021-011725.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.0 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (diagnostic) — SMOKING GUN FOUND** — Diagnostic logging proves:
1. ✅ Points mesh exists and is correctly typed as THREE.Points
2. ✅ Mesh is visible with frustumCulled=false, renderOrder=1
3. ✅ Geometry has 90650 vertices fully loaded (positions + colors)
4. ✅ Material is attached with correct UUID and blend/depth settings
5. ❌ **WebGL renderer reports 0 points rendered, 2 triangles instead**

**Root cause hypothesis (P≈0.85)**: The Points mesh is being skipped/culled AFTER the geometry check but BEFORE WebGL submission. Likely causes:
- The renderer is counting a different mesh (background plane = 2 triangles) instead of the Points mesh
- The Points mesh exists in the scene graph but is not being traversed/rendered by R3F
- Material or shader compilation fails silently for Points geometry type

**Next action (Milestone 3)**: Trace R3F render loop to confirm Points mesh is in the render list. Add logging in R3F/THREE.js render pipeline to catch where Points mesh gets dropped. Alternatively, create a minimal test with hard-coded Points mesh to isolate if it's a geometry issue vs R3F integration issue.
