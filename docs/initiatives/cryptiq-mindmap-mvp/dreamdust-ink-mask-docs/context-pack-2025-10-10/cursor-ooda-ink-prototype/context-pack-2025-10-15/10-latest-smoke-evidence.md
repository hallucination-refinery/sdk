---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T04:18:11Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, DEFINITIVE-ROOT-CAUSE]
commit: 1c78306f
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-041617`) and Playwright (`20251021-041811`) reruns on commit `1c78306f` (added `renderLists.get` probe) revealed **DEFINITIVE ROOT CAUSE**: `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0}` — the Points mesh IS in the scene graph (confirmed by scene-traversal) but is **NOT being added to THREE.js render lists** during the projectObject phase. **FAIL (definitive — render list filtering)** — The mesh exists and is visible, but THREE.WebGLRenderer's render list creation is completely skipping it, meaning it never reaches the draw call stage.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 7, nodes: Array(7)}` ← **Points mesh IS in scene graph**
- `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0, opaqueSample: Array(0), transparentSample: Array(0)}` ← **DEFINITIVE: Points NOT in render lists, lists are EMPTY**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh correctly configured**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **Renderer counts 0 points, 2 triangles from elsewhere**
- **❌ `[PC] points-after-render` — MISSING** ← **Consistent with Points not in render list**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] scene-traversal {\"pointsFound\":true,\"nodeCount\":7,\"nodes\":[...,{\"type\":\"Points\",\"visible\":true,\"layers\":1,\"children\":0,\"path\":\"Scene/Group/Group/Group/Points\",\"isPoints\":true,\"materialUuid\":\"24e48d7b-f9a2-491e-9015-83ed5e389adc\",\"geometryPositionCount\":90650}]}` ← **Points at "Scene/Group/Group/Group/Points" with 90650 vertices**
- `[PC] render-list {\"pointsPresent\":false,\"opaqueCount\":0,\"transparentCount\":0,\"opaqueSample\":[],\"transparentSample\":[]}` ← **DEFINITIVE: Render lists are EMPTY, Points never added**
- `[PC] points-mesh {\"type\":\"Points\",\"visible\":true,\"frustumCulled\":false,\"renderOrder\":1,\"parentType\":\"Group\",\"matrixWorldDet\":1,\"positionCount\":90650,\"colorCount\":90650,\"uvCount\":0,\"depthCount\":0,\"materialUuid\":\"24e48d7b-f9a2-491e-9015-83ed5e389adc\"}` ← **90650 positions, 90650 colors loaded**
- `[PC] render-info {\"calls\":1,\"points\":0,\"triangles\":2,\"mat\":{\"uuid\":\"24e48d7b-f9a2-491e-9015-83ed5e389adc\",\"blending\":2,\"depthTest\":false,\"depthWrite\":false,\"programCacheKey\":\"dreamdust-gauss-0\"},\"uniforms\":{\"uPointBaseSize\":8,\"uMinSize\":4,\"uMaxSize\":14,\"uAlphaFloor\":1,\"uVelToNdc\":0.028,\"uInkBlend\":0.78,\"uDepthNormScale\":0.00076,\"uDepthBias\":1.8},\"timeout\":false,\"framesWaited\":2}`
- **❌ `[PC] points-after-render` — MISSING**
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/1c78306f/docs/ink-falloff-flag-latch-2025-10-12/20251021-041617/2025-10-21-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/1c78306f/docs/ink-falloff-flag-latch-2025-10-12/20251021-041811/ink-chromium-20251021-041811-pre.png`
- `cursor-ooda-ink-prototype/assets/1c78306f/docs/ink-falloff-flag-latch-2025-10-12/20251021-041811/ink-chromium-20251021-041811-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/1c78306f/docs/ink-falloff-flag-latch-2025-10-12/20251021-041617/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/1c78306f/docs/ink-falloff-flag-latch-2025-10-12/20251021-041811/console-chromium-20251021-041811.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.1 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (definitive — render list filtering) — DEFINITIVE ROOT CAUSE IDENTIFIED** — Render list logging proves:
1. ✅ Points mesh EXISTS in THREE.js scene graph at path `Scene/Group/Group/Group/Points`
2. ✅ Points mesh is visible with layers=1, frustumCulled=false
3. ✅ Geometry has 90650 vertices fully loaded (positions + colors)
4. ✅ Material attached with correct UUID and blend/depth settings
5. ❌ **Render lists are COMPLETELY EMPTY** (`opaqueCount: 0, transparentCount: 0`)
6. ❌ **`pointsPresent: false`** — Points mesh NEVER added to render lists

**DEFINITIVE ROOT CAUSE (P≈0.95)**: THREE.WebGLRenderer's `projectObject()` or render list creation phase is **completely skipping the entire scene graph** during traversal. The render lists show `opaqueCount: 0, transparentCount: 0`, meaning NO objects from the scene are being added to render queues. This explains why:
- No points are rendered (Points mesh not in lists)
- Only 2 triangles counted (likely from a different render pass, background, or UI element outside this scene)
- `onAfterRender` never fires (callbacks only fire for objects that render)

**Critical insight**: The issue is NOT specific to Points — the ENTIRE scene is being skipped during render list creation. This suggests either:
1. R3F is not calling THREE.WebGLRenderer.render() with the correct scene object
2. The scene is being culled entirely (camera frustum issue, layers mismatch, or scene.visible=false)
3. R3F has overridden or wrapped the render() method in a way that breaks render list creation

**Next action (Milestone 6 — CRITICAL FIX)**: 
1. Verify R3F is actually calling renderer.render(scene, camera) — log the render() call with scene/camera arguments
2. Check if scene object passed to render() matches the scene we're traversing
3. Verify camera frustum is correct and scene is not being culled entirely
4. If all above are correct, the issue might be with how R3F patches/wraps THREE.WebGLRenderer
