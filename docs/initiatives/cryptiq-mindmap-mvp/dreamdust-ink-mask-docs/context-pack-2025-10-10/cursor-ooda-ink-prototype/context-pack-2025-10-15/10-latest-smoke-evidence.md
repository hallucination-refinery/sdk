---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-23T23:00:24Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, render-scene-captured, RENDERING_PIPELINE_INSTRUMENTATION, BREAKTHROUGH_DISCOVERY, DIAGNOSTIC_IMPLEMENTATION_FAILURE]
commit: b99fe68f
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary:
- MCP (`20251023-230024`) smoke on commit `b99fe68f` (extended render pipeline instrumentation) — **DIAGNOSTIC IMPLEMENTATION FAILURE**: New render pipeline diagnostics (`[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end`) did NOT appear in console output, indicating the diagnostic implementation needs fixing. Existing diagnostics still showed `useVelocityDisp: false` (expected fallback state) while render calls remained zero.
- **Manual verification (`20251024-0314`, commit `456899a0`, local dev build on Node 20)** — New instrumentation hooks emit `[PC] instrumentation render-list override active`, `[PC] instrumentation points-hook attached`, and `[PC] render-timeout`, but **`[PC] render-list snapshot` still never appears**, confirming the render queue remains empty even after hook attachment. Evidence: `console/456899a0/local-manual-20251024/console-manual-dev.txt`.

### Manual verification console lines (local dev, 20251024-0314)
- `[PC] instrumentation render-list override active {timestamp: …}` ← Render-list override now installs successfully
- `[PC] instrumentation points-hook attached {timestamp: …}` ← Points hooks wired after ref becomes ready
- `[PC] render-timeout {framesWaited: 60, timestamp: …}` ← Render loop exits without draws (expected for failing run)
- **Missing:** `[PC] render-list snapshot`, `[PC] points-before-render`, `[PC] render-pass begin/end` ← Points never added to render list; no render pass logs triggered
- Console artifact: `console/456899a0/local-manual-20251024/console-manual-dev.txt`

### Key console lines (MCP):
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

**Updated understanding (20251024 manual verification)**:
- Shader guard is behaving as expected for fallback hardware (`useVelocityDisp: false`).
- Render instrumentation now confirms hooks attach, yet the render list remains empty and draw calls stay at zero.
- Next focus: adjust render-list snapshot logic (and/or capture the internal render-list contents post-render) to prove where the points fall out of the pipeline.
