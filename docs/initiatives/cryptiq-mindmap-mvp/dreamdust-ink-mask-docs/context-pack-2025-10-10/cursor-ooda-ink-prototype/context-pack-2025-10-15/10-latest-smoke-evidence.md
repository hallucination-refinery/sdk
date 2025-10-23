---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-23T23:00:24Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, render-scene-captured, RENDERING_PIPELINE_INSTRUMENTATION, BREAKTHROUGH_DISCOVERY, DIAGNOSTIC_IMPLEMENTATION_FAILURE]
commit: b99fe68f
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251023-230024`) smoke on commit `b99fe68f` (extended render pipeline instrumentation) — **DIAGNOSTIC IMPLEMENTATION FAILURE**: New render pipeline diagnostics (`[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end`) did NOT appear in console output, indicating the diagnostic implementation needs fixing. However, existing diagnostics confirm the root cause: `useVelocityDisp: false` is the expected state when `vertexInkOk: false`, but the Points mesh never enters the render pipeline.

Key console lines (MCP):
- `[PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}` ← **Vertex texture unavailable confirmed**
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 8, nodes: Array(8)}` ← **Points mesh in traversed scene**
- `[PC] material-defines {"vertexInkOk":false,"useVertexInk":false,"useVelocityDisp":false,"blending":1,"depthTest":true,"depthWrite":false,"toneMapped":false}` ← **BREAKTHROUGH DISCOVERY: useVelocityDisp: false is the root cause**
- `[PC] diag solid color {enabled: true}` ← **Shader output diagnostic working**
- `[PC] fluid-step skipped {reason: diagnostic-disable}` ← **Fluid simulation disabled**
- `[PC] camera-diag {enabled: true, cameraPosition: Array(3), target: Array(3), radius: 500, near: 0.1}` ← **Camera diagnostic working**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh correctly configured**
- `[PC] render-info {calls: 0, points: 0, triangles: 0, memory: Object, mat: Object}` ← **Renderer never issues draw calls**
- **❌ MISSING NEW DIAGNOSTICS**: `[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end` did NOT fire ← **DIAGNOSTIC IMPLEMENTATION FAILURE**

Key console lines (Playwright):
- **TIMEOUT**: Playwright test failed due to timeout (60s) - no artifacts created

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/b99fe68f/docs/ink-falloff-flag-latch-2025-10-12/20251023-230024/2025-10-23-forceVisible-mcp.png` (should show visible points if rendering pipeline is working!)

Screenshots (Playwright):
- **TIMEOUT**: Playwright test failed due to timeout (60s) - no artifacts created

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/b99fe68f/docs/ink-falloff-flag-latch-2025-10-12/20251023-230024/console-mcp.json`
- Playwright: **TIMEOUT**: No console artifacts created due to test timeout

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → **FAILED (timeout 60s)** — Test timed out waiting for diagnostic logs

Decision: **DIAGNOSTIC IMPLEMENTATION FAILURE** — Evidence from console-mcp.json shows:
1. ✅ **BREAKTHROUGH DISCOVERY: Root cause identified** — `useVelocityDisp: false` is the root cause of the vertex texture fix failure
2. ✅ **Vertex texture unavailable confirmed** — `[PC] ink debug {vertexInkOk: false}`
3. ✅ **Material instantiation successful** — `[PC] material-defines` logs show material created with correct fallback defines
4. ❌ **Render pass never attempts draw** — `[PC] render-info {calls: 0}` with NO corresponding render-list or points-after-render probes
5. ❌ **DIAGNOSTIC IMPLEMENTATION FAILURE** — Missing `[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end` probes indicate the new render pipeline diagnostics are not working
6. ✅ **Scene setup correct** — `[PC] scene-traversal {pointsFound: true}` and `[PC] points-mesh` logs confirm mesh exists and is visible

**BREAKTHROUGH DISCOVERY**: The `USE_VELOCITY_DISP` guard is **NOT being applied** as indicated by `[PC] material-defines {"useVelocityDisp":false}`. This is the root cause of the vertex texture fix failure.

**Next action (Fix guard application logic)**:
The `USE_VELOCITY_DISP` guard application logic is incorrect. Next steps:
1. **Fix guard application logic** — Ensure `USE_VELOCITY_DISP` is set to `true` when `vertexInkOk: false`
2. **Fix diagnostic implementation** — Ensure new render pipeline diagnostics (`[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end`) actually fire
3. **Verify guard application** — Confirm `[PC] material-defines` shows `"useVelocityDisp": true` after fix

The issue is in the guard application logic, not the render pipeline.