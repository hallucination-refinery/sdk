---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-23T19:53:35Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, render-scene-captured, VERTEX_TEXTURE_FIX_FAILED, STILL_STUCK]
commit: ed09b59e
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251023-195335`) smoke on commit `ed09b59e` (vertex texture fix - USE_VELOCITY_DISP guard) **VERTEX TEXTURE FIX FAILED** — the `USE_VELOCITY_DISP` guard fix did **not restore particle visibility**! **FAIL (STILL STUCK)** — `[PC] ink debug {vertexInkOk: false}` confirms vertex texture unavailable, but `[PC] render-info {calls: 0, points: 0, triangles: 0}` still shows **zero render stats**. The vertex texture fix did not work.

Key console lines (MCP):
- `[PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}` ← **Vertex texture unavailable confirmed**
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 8, nodes: Array(8)}` ← **Points mesh in traversed scene**
- `[PC] diag solid color {enabled: true}` ← **Shader output diagnostic working**
- `[PC] fluid-step skipped {reason: diagnostic-disable}` ← **Fluid simulation disabled**
- `[PC] camera-diag {enabled: true, cameraPosition: Array(3), target: Array(3), radius: 500, near: 0.1}` ← **Camera diagnostic working**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh correctly configured**
- **❌ VERTEX TEXTURE FIX FAILED**: `[PC] render-info {calls: 0, points: 0, triangles: 0, mat: Object, uniforms: Object}` ← **Still 0 points rendered**
- **❌ POINT CLOUD STILL NOT VISIBLE** ← **Vertex texture fix did not work**

Key console lines (Playwright):
- **TIMEOUT**: Playwright test failed due to timeout (60s) - no artifacts created

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/ed09b59e/docs/ink-falloff-flag-latch-2025-10-12/20251023-195335/2025-10-23-forceVisible-mcp-vertex-texture-fix.png` (should show visible points if vertex texture fix worked!)

Screenshots (Playwright):
- **TIMEOUT**: Playwright test failed due to timeout (60s) - no artifacts created

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/ed09b59e/docs/ink-falloff-flag-latch-2025-10-12/20251023-195335/console-mcp.json`
- Playwright: **TIMEOUT**: No console artifacts created due to test timeout

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → **FAILED (timeout 60s)** — Test timed out waiting for diagnostic logs

Decision: **FAIL (STILL STUCK)** — Evidence proves:
1. ❌ **Vertex texture fix failed** — `USE_VELOCITY_DISP` guard did not restore particle visibility
2. ✅ **Vertex texture unavailable confirmed** — `[PC] ink debug {vertexInkOk: false}` confirms the issue
3. ✅ **All previous diagnostics working** — Scene attachment, shader compilation, fluid simulation disabled, shader output, camera diagnostic all working
4. ❌ **Still 0 points rendered** — `[PC] render-info {calls: 0, points: 0, triangles: 0}` shows zero render stats
5. ❌ **Point cloud still not visible** — Vertex texture fix did not work
6. ✅ **Mesh configuration correct** — `[PC] points-mesh` shows proper configuration
7. ✅ **Scene traversal working** — `[PC] scene-traversal {pointsFound: true}` confirms mesh in scene

**VERTEX TEXTURE FIX FAILED**: The `USE_VELOCITY_DISP` guard fix did **not restore particle visibility**. Despite confirming vertex texture unavailability and applying the guard, we still get zero render calls and no visible points.

**Next action (Milestone 17 — Investigate Alternative Root Causes)**: 
The vertex texture issue was not the root cause. We need to investigate alternative hypotheses:
1. **Point size issues** — Points may be too small to see
2. **Depth/blend issues** — Points may be rendered but not visible due to depth or blending
3. **Material issues** — Shader material may have other problems beyond vertex textures
4. **Camera positioning** — Points may be outside the camera frustum (camera diagnostic incomplete)
5. **WebGL context issues** — Other WebGL limitations may be blocking rendering

The debugging journey continues! 🔍