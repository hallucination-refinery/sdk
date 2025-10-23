---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-23T21:19:20Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, render-scene-captured, RENDERING_PIPELINE_INSTRUMENTATION, BREAKTHROUGH_DISCOVERY]
commit: 332e9390
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251023-211920`) smoke on commit `332e9390` (rendering pipeline instrumentation) — New instrumentation reveals the shader fallback is correctly configured (`vertexInkOk: false`, `useVelocityDisp: false` as expected for fallback hardware), but render calls remain at zero. The actual failure point: render-list and points-after-render probes did NOT fire, indicating the render pass never attempts to draw the points mesh.

Key console lines (MCP):
- `[PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}` ← **Vertex texture unavailable confirmed**
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 8, nodes: Array(8)}` ← **Points mesh in traversed scene**
- `[PC] material-defines {"vertexInkOk":false,"useVertexInk":false,"useVelocityDisp":false,"blending":1,"depthTest":true,"depthWrite":false,"toneMapped":false}` (line 64, console-mcp.json) ← **Shader fallback configured correctly for non-vertex-texture hardware**
- `[PC] diag solid color {enabled: true}` ← **Shader output diagnostic working**
- `[PC] fluid-step skipped {reason: diagnostic-disable}` ← **Fluid simulation disabled**
- `[PC] camera-diag {enabled: true, cameraPosition: Array(3), target: Array(3), radius: 500, near: 0.1}` ← **Camera diagnostic working**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh correctly configured**
- `[PC] render-info {calls: 0, points: 0, triangles: 0, memory: Object, mat: Object}` (line 189, console-mcp.json) ← **Renderer never issues draw calls**
- **⚠️ MISSING PROBES**: `[PC] render-list snapshot` and `[PC] points-after-render` did NOT fire ← **Indicates render pass never attempts to draw Points mesh**

Key console lines (Playwright):
- **TIMEOUT**: Playwright test failed due to timeout (60s) - no artifacts created

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/332e9390/docs/ink-falloff-flag-latch-2025-10-12/20251023-211920/2025-10-23-forceVisible-mcp-rendering-pipeline-instrumentation.png` (should show visible points if rendering pipeline is working!)

Screenshots (Playwright):
- **TIMEOUT**: Playwright test failed due to timeout (60s) - no artifacts created

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/332e9390/docs/ink-falloff-flag-latch-2025-10-12/20251023-211920/console-mcp.json`
- Playwright: **TIMEOUT**: No console artifacts created due to test timeout

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → **FAILED (timeout 60s)** — Test timed out waiting for diagnostic logs

Decision: **Instrumentation reveals new diagnostic gap** — Evidence from console-mcp.json shows:
1. ✅ **Material shader fallback working correctly** — `useVelocityDisp: false` is the EXPECTED state when `vertexInkOk: false` (fallback hardware scenario)
2. ✅ **Vertex texture unavailable confirmed** — `[PC] ink debug {vertexInkOk: false}` (line 4)
3. ✅ **Material instantiation successful** — Two `[PC] material-defines` logs (lines 64, 79) show material created with correct fallback defines
4. ❌ **Render pass never attempts draw** — `[PC] render-info {calls: 0}` (line 189) with NO corresponding render-list or points-after-render probes
5. ⚠️ **Critical diagnostic gap** — Missing `[PC] render-list snapshot` and `[PC] points-after-render` probes indicate Points mesh never enters render pipeline
6. ✅ **Scene setup correct** — `[PC] scene-traversal {pointsFound: true}` and `[PC] points-mesh` logs confirm mesh exists and is visible

**Corrected understanding**: The shader guard logic is CORRECT. When vertex textures are unavailable (`vertexInkOk: false`), the shader should NOT use velocity displacement (`useVelocityDisp: false`). The actual problem is that the Points mesh never enters the WebGL render pass.

**Next action (Investigate render pipeline blockage)**:
The missing probes indicate the render list is never populated with the Points mesh. Next steps:
1. **Debug render list population** — Why doesn't `gl.renderLists.get` include the Points mesh?
2. **Check Points.onAfterRender** — Why doesn't this lifecycle hook fire?
3. **Verify frustum culling** — Despite `frustumCulled: false`, is the mesh being culled elsewhere?
4. **Add additional instrumentation** — Track when/why the Points mesh is excluded from rendering

The issue is deeper in the Three.js render pipeline, not in shader compilation.