---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T03:22:31Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, CRITICAL-BREAKTHROUGH]
commit: 5aacf359
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-032039`) and Playwright (`20251021-032231`) reruns on commit `5aacf359` (added `SceneTraversalLogger`) revealed **CRITICAL BREAKTHROUGH**: `[PC] scene-traversal {pointsFound: true, path: "Scene/Group/Group/Group/Points", geometryPositionCount: 90650}` — the Points mesh IS in the THREE.js scene graph with correct configuration, BUT `[PC] points-after-render` is **STILL MISSING**. **FAIL (diagnostic — render loop filtering)** — Points mesh exists in scene graph but is being filtered/skipped during R3F/THREE.js render traversal BEFORE `onAfterRender` fires.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 7, nodes: Array(7)}` ← **BREAKTHROUGH: Points mesh IS in scene graph**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh correctly configured**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **Renderer counts 0 points, 2 triangles**
- **❌ `[PC] points-after-render` — STILL MISSING** ← **onAfterRender never fires despite mesh in scene**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] scene-traversal {\"pointsFound\":true,\"nodeCount\":7,\"nodes\":[...,{\"type\":\"Points\",\"visible\":true,\"layers\":1,\"children\":0,\"path\":\"Scene/Group/Group/Group/Points\",\"isPoints\":true,\"materialUuid\":\"4e193198-df9d-47df-8a5a-f5428a5c2cd8\",\"geometryPositionCount\":90650}]}` ← **Full scene graph: Points at "Scene/Group/Group/Group/Points" with 90650 vertices**
- `[PC] points-mesh {\"type\":\"Points\",\"visible\":true,\"frustumCulled\":false,\"renderOrder\":1,\"parentType\":\"Group\",\"matrixWorldDet\":1,\"positionCount\":90650,\"colorCount\":90650,\"uvCount\":0,\"depthCount\":0,\"materialUuid\":\"4e193198-df9d-47df-8a5a-f5428a5c2cd8\"}` ← **90650 positions, 90650 colors loaded**
- `[PC] render-info {\"calls\":1,\"points\":0,\"triangles\":2,\"mat\":{\"uuid\":\"4e193198-df9d-47df-8a5a-f5428a5c2cd8\",\"blending\":2,\"depthTest\":false,\"depthWrite\":false,\"programCacheKey\":\"dreamdust-gauss-0\"},\"uniforms\":{\"uPointBaseSize\":8,\"uMinSize\":4,\"uMaxSize\":14,\"uAlphaFloor\":1,\"uVelToNdc\":0.028,\"uInkBlend\":0.78,\"uDepthNormScale\":0.00076,\"uDepthBias\":1.8},\"timeout\":false,\"framesWaited\":2}`
- **❌ `[PC] points-after-render` — STILL MISSING**
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.
- **Logger did NOT timeout** (`timeout: false`, `framesWaited: 2`) — other draw calls executed immediately.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/5aacf359/docs/ink-falloff-flag-latch-2025-10-12/20251021-032039/2025-10-21-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/5aacf359/docs/ink-falloff-flag-latch-2025-10-12/20251021-032231/ink-chromium-20251021-032231-pre.png`
- `cursor-ooda-ink-prototype/assets/5aacf359/docs/ink-falloff-flag-latch-2025-10-12/20251021-032231/ink-chromium-20251021-032231-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/5aacf359/docs/ink-falloff-flag-latch-2025-10-12/20251021-032039/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/5aacf359/docs/ink-falloff-flag-latch-2025-10-12/20251021-032231/console-chromium-20251021-032231.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.1 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (diagnostic — render loop filtering) BUT CRITICAL BREAKTHROUGH** — Scene traversal logging proves:
1. ✅ Points mesh EXISTS in THREE.js scene graph at path `Scene/Group/Group/Group/Points`
2. ✅ Points mesh is visible with layers=1 (default layer, should be rendered)
3. ✅ Geometry has 90650 vertices fully loaded
4. ✅ Material attached with correct UUID
5. ❌ **`onAfterRender` callback STILL never fires** — mesh in scene but not rendered

**Root cause NARROWED (P≈0.90)**: The Points mesh is correctly added to the scene graph but R3F or THREE.js is **filtering it out during render list creation or traversal**. Since the mesh is in the scene with visible=true and layers=1, the issue must be in how THREE.WebGLRenderer processes Points objects or how R3F builds the render list.

**Likely causes (P≈0.80)**:
- R3F's render loop might not be calling `scene.traverse()` correctly, or is filtering Points objects during traversal
- THREE.WebGLRenderer might be skipping Points objects with certain material configurations
- The material's shader program might be failing to compile silently, causing THREE.js to skip the mesh
- R3F might have a bug where Points objects nested 3 levels deep in Groups don't get added to the render list

**Next action (Milestone 5 — CRITICAL)**: 
1. Patch THREE.WebGLRenderer.render() to log when it processes Points objects during renderLists/renderObjects phase
2. Add logging to verify the Points material shader compiles successfully (check `material.program` after first render)
3. Try moving Points mesh to Scene root (not nested in Groups) to test if nesting depth affects R3F render list
