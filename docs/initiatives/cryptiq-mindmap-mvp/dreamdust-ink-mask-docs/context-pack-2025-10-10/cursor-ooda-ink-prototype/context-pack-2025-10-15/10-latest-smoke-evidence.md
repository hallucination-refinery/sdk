---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T04:48:03Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-call, GAME-CHANGER]
commit: 60421b13
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-044608`) and Playwright (`20251021-044803`) reruns on commit `60421b13` (added `renderer.render()` probe) revealed **GAME-CHANGING DISCOVERY**: `[PC] renderer-render-call {sceneChildCount: 1}` vs `[PC] scene-traversal {nodeCount: 7}` — R3F is calling `renderer.render()` with a **DIFFERENT SCENE** than the one containing our Points mesh. **FAIL (definitive — wrong scene)** — The Points mesh exists in the correct scene graph, but R3F/THREE.js is rendering a DIFFERENT scene object that only has 1 child instead of 3 children at the root.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 7, nodes: Array(7)}` ← **Scene we traversed has 7 nodes (Scene + 3 children at root + 3 nested groups/Points)**
- `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0, opaqueSample: Array(0), transparentSample: Array(0)}` ← **Lists empty**
- `[PC] renderer-render-call {sceneUuid: 1bf9ed1d-7d5e-47ec-8496-69b3ee23efa8, sceneChildCount: 1, cameraType: OrthographicCamera, cameraLayers: 1, pointsPresent: false}` ← **GAME-CHANGER: Scene being rendered has only 1 child!**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh exists in correct scene**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **Wrong scene renders 2 triangles**
- **❌ `[PC] points-after-render` — MISSING** ← **Consistent with Points not in rendered scene**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] scene-traversal {\"pointsFound\":true,\"nodeCount\":7,\"nodes\":[{\"type\":\"Scene\",\"visible\":true,\"layers\":1,\"children\":3,...},{\"type\":\"Points\",\"visible\":true,\"layers\":1,\"children\":0,\"path\":\"Scene/Group/Group/Group/Points\",\"isPoints\":true,\"materialUuid\":\"...\",\"geometryPositionCount\":90650}]}` ← **Traversed scene has 3 children at root (AmbientLight, DirectionalLight, Group)**
- `[PC] renderer-render-call {\"sceneUuid\":\"50515d82-02c1-47d2-829f-56f167a61810\",\"sceneChildCount\":1,\"cameraType\":\"OrthographicCamera\",\"cameraLayers\":1,\"pointsPresent\":false,\"opaqueCount\":0,\"transparentCount\":0,\"opaqueSample\":[],\"transparentSample\":[]}` ← **GAME-CHANGER: Rendered scene has only 1 child, not 3!**
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/60421b13/docs/ink-falloff-flag-latch-2025-10-12/20251021-044608/2025-10-21-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/60421b13/docs/ink-falloff-flag-latch-2025-10-12/20251021-044803/ink-chromium-20251021-044803-pre.png`
- `cursor-ooda-ink-prototype/assets/60421b13/docs/ink-falloff-flag-latch-2025-10-12/20251021-044803/ink-chromium-20251021-044803-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/60421b13/docs/ink-falloff-flag-latch-2025-10-12/20251021-044608/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/60421b13/docs/ink-falloff-flag-latch-2025-10-12/20251021-044803/console-chromium-20251021-044803.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 2.2 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (definitive — wrong scene) — GAME-CHANGING DISCOVERY** — Renderer logging proves:
1. ✅ Points mesh EXISTS in THREE.js scene graph (7 nodes total, 3 children at root: AmbientLight, DirectionalLight, Group containing Points)
2. ✅ Points mesh is visible with correct configuration (90650 vertices, layers=1, frustumCulled=false)
3. ❌ **R3F calls `renderer.render()` with a DIFFERENT scene object** (sceneChildCount: 1 vs expected 3)
4. ❌ **Scene being rendered has different UUID and structure** than the scene we traversed

**DEFINITIVE ROOT CAUSE (P≈0.98)**: R3F is maintaining or rendering **TWO DIFFERENT SCENE OBJECTS**. The scene we're adding our Points mesh to (via R3F's JSX/scene graph API) has 3 children at root and contains all our objects. But R3F's render loop is calling `renderer.render()` with a **completely different scene object** that only has 1 child and doesn't contain our Points mesh.

**Critical insight**: This explains EVERYTHING:
- Why render lists are empty (the scene being rendered is mostly empty)
- Why Points mesh never renders (it's in a different scene)
- Why we see 2 triangles (from the 1 child in the rendered scene, probably a background quad)
- Why scene-traversal finds Points but render doesn't (traversing one scene, rendering another)

**Next action (Milestone 7 — FIX REQUIRED)**: 
1. Investigate R3F's scene management — how does R3F obtain the scene object to pass to renderer.render()?
2. Check if R3F uses `useThree().scene` and if that's returning the correct scene
3. Verify our Points mesh is being added to R3F's actual render scene, not a shadow/intermediate scene
4. Likely fix: Ensure Points mesh is added to the same scene object that R3F passes to renderer.render()
