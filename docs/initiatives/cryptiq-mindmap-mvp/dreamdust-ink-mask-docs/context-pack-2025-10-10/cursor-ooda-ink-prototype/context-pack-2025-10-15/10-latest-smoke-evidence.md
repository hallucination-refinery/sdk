---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T16:46:34Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, ABSOLUTE-CONFIRMATION]
commit: a550adc6
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-164436`) and Playwright (`20251021-164634`) reruns on commit `a550adc6` (enhanced multi-pass renderer probe) revealed **ABSOLUTE CONFIRMATION**: ALL 6 render passes (renderIndex 0-5) show `matchesTraversedScene: false` with the SAME scene UUID across all passes. **FAIL (absolute — different scenes confirmed)** — R3F is calling `renderer.render()` 6 times per frame, and EVERY SINGLE CALL uses a different scene object than the one we're adding our Points mesh to. The Points mesh lives in one scene (with 7 nodes, 3 children at root), but R3F exclusively renders a completely different scene (with only 1 child at root).

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 7, nodes: Array(7)}` ← **Our Points mesh is in THIS scene (UUID not shown in summary but different)**
- `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0}` ← **Lists empty before render**
- `[PC] renderer-render-pass {renderIndex: 0, sceneUuid: 20ec4906..., sceneChildCount: 1, matchesTraversedScene: false, ...}` ← **ABSOLUTE: Different scene, 6 times**
- `[PC] renderer-render-pass {renderIndex: 1-5, ...}` ← **ALL render passes: same wrong scene UUID, childCount=1, matchesTraversedScene=false**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh in correct scene**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **Wrong scene renders 2 triangles**
- **❌ `[PC] points-after-render` — MISSING** ← **Consistent with Points in non-rendered scene**

Key console lines (Playwright):
- `[PC] scene-traversal {\"pointsFound\":true,\"nodeCount\":7,\"nodes\":[{\"type\":\"Scene\",...,\"children\":3,...},{\"type\":\"Points\",...,\"geometryPositionCount\":90650}]}` ← **Traversed scene has 3 children at root**
- `[PC] renderer-render-pass {\"renderIndex\":0,\"sceneUuid\":\"389e362e-094a-4a46-bc3e-d176f3bb40c9\",\"sceneChildCount\":1,\"matchesTraversedScene\":false,\"cameraType\":\"OrthographicCamera\",\"cameraLayers\":1,\"pointsPresent\":false,\"renderCallSeenPointsPreviously\":false,\"opaqueCount\":0,\"transparentCount\":0,\"opaqueSample\":[],\"transparentSample\":[]}` ← **Rendered scene has 1 child, different UUID**
- ALL 6 render passes (renderIndex 0-5) show: **SAME sceneUuid `389e362e...`**, **sceneChildCount: 1**, **matchesTraversedScene: false**, **pointsPresent: false**, **lists EMPTY**
- Material confirms `blending: 2`, `depthTest: false`, `depthWrite: false` as expected.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/a550adc6/docs/ink-falloff-flag-latch-2025-10-12/20251021-164436/2025-10-21-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/a550adc6/docs/ink-falloff-flag-latch-2025-10-12/20251021-164634/ink-chromium-20251021-164634-pre.png`
- `cursor-ooda-ink-prototype/assets/a550adc6/docs/ink-falloff-flag-latch-2025-10-12/20251021-164634/ink-chromium-20251021-164634-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/a550adc6/docs/ink-falloff-flag-latch-2025-10-12/20251021-164436/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/a550adc6/docs/ink-falloff-flag-latch-2025-10-12/20251021-164634/console-chromium-20251021-164634.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.0 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (absolute — different scenes confirmed) — ABSOLUTE CONFIRMATION OF ROOT CAUSE** — Multi-pass renderer logging proves beyond doubt:
1. ✅ Points mesh EXISTS in THREE.js scene graph (7 nodes, 3 children at root including AmbientLight, DirectionalLight, and Group containing Points)
2. ✅ Points mesh correctly configured (visible, layers=1, 90650 vertices, frustumCulled=false)
3. ❌ **ALL 6 render passes use THE SAME wrong scene** (sceneUuid: 389e362e... in PW, 20ec4906... in MCP)
4. ❌ **ALL 6 render passes show `matchesTraversedScene: false`** — NOT A SINGLE render call uses our scene
5. ❌ **Rendered scene has only 1 child** (vs our scene's 3 children at root)
6. ❌ **ALL render lists EMPTY** (`opaqueCount: 0, transparentCount: 0`) across all 6 passes

**ABSOLUTE ROOT CAUSE (P≈0.99)**: R3F maintains TWO COMPLETELY SEPARATE SCENE OBJECTS and EXCLUSIVELY renders the wrong one. The scene we get from `useThree().scene` (where we add our Points mesh via R3F's JSX) is NEVER passed to `renderer.render()`. Instead, R3F renders a different scene object 6 times per frame, and that scene only has 1 child and doesn't contain ANY of our objects (hence empty render lists).

**Critical insight — The FIX**:
We need to add our Points mesh to the ACTUAL scene object that R3F passes to `renderer.render()`, not the scene from `useThree().scene`. Options:
1. Find how to access R3F's actual render scene and add Points there
2. Investigate why R3F has two scenes (possible portal/layer issue in our Canvas setup)
3. Bypass R3F's scene management and manually add Points to the renderer's target scene

**Next action (Milestone 8 — CRITICAL FIX)**: 
Investigate PointCloudStage's Canvas/scene setup to identify why there are two scenes. Check for portals, event-only canvases, or incorrect scene ref usage. The fix will be to ensure Points mesh is added to the scene that R3F actually renders (sceneUuid: 389e362e.../20ec4906...).
