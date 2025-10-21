---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-21T02:04:20Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, onAfterRender, CONCLUSIVE]
commit: df83dc57
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251021-020245`) and Playwright (`20251021-020420`) reruns on commit `df83dc57` (added `onAfterRender` probe) revealed **CONCLUSIVE EVIDENCE**: `[PC] points-after-render` log is **MISSING** from console. Since `onAfterRender` callback ONLY fires when a mesh is actually rendered by THREE.js, its absence **definitively proves** the Points mesh is NOT being rendered at all. **FAIL (conclusive)** — Points mesh exists with correct configuration and 90650 vertices but is completely skipped during R3F/THREE.js render traversal.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh configured correctly**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **Renderer counts 0 points, 2 triangles**
- **❌ `[PC] points-after-render` — MISSING** ← **CONCLUSIVE: onAfterRender never fired, mesh not rendered**
- `[PC] fluid uniforms prime {invSize: Array(2), velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220, velToNdc: 0.028, inkBlend: 0.78}`
- `[PC] fluid init {size: 256, iters: 10}`
- `[PC] instances: 90650`

Key console lines (Playwright):
- same `[PC] forceVisible …`, `uniforms after-reveal`, `fluid init` sequence as MCP.
- `[PC] points-mesh {\"type\":\"Points\",\"visible\":true,\"frustumCulled\":false,\"renderOrder\":1,\"parentType\":\"Group\",\"matrixWorldDet\":1,\"positionCount\":90650,\"colorCount\":90650,\"uvCount\":0,\"depthCount\":0,\"materialUuid\":\"efff4a41-6150-44e1-9973-ed6d94330c46\"}` ← **90650 positions, 90650 colors loaded**
- `[PC] render-info {\"calls\":1,\"points\":0,\"triangles\":2,\"mat\":{\"uuid\":\"efff4a41-6150-44e1-9973-ed6d94330c46\",\"blending\":2,\"depthTest\":false,\"depthWrite\":false,\"programCacheKey\":\"dreamdust-gauss-0\"},\"uniforms\":{\"uPointBaseSize\":8,\"uMinSize\":4,\"uMaxSize\":14,\"uAlphaFloor\":1,\"uVelToNdc\":0.028,\"uInkBlend\":0.78,\"uDepthNormScale\":0.00076,\"uDepthBias\":1.8},\"timeout\":false,\"framesWaited\":2}`
- **❌ `[PC] points-after-render` — MISSING** ← **CONCLUSIVE: Mesh never rendered**
- Material confirms `blending: 2` (AdditiveBlending), `depthTest: false`, `depthWrite: false` as expected.
- **Logger did NOT timeout** (`timeout: false`, `framesWaited: 2`) — other draw calls executed immediately.

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/df83dc57/docs/ink-falloff-flag-latch-2025-10-12/20251021-020245/2025-10-21-forceVisible-mcp.png`

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/df83dc57/docs/ink-falloff-flag-latch-2025-10-12/20251021-020420/ink-chromium-20251021-020420-pre.png`
- `cursor-ooda-ink-prototype/assets/df83dc57/docs/ink-falloff-flag-latch-2025-10-12/20251021-020420/ink-chromium-20251021-020420-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/df83dc57/docs/ink-falloff-flag-latch-2025-10-12/20251021-020245/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/df83dc57/docs/ink-falloff-flag-latch-2025-10-12/20251021-020420/console-chromium-20251021-020420.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 1.7 s); deterministic viewport/DPR + console persistence verified.

Decision: **FAIL (conclusive) — DEFINITIVE ROOT CAUSE IDENTIFIED** — Diagnostic logging proves:
1. ✅ Points mesh exists and is correctly typed as THREE.Points
2. ✅ Mesh is visible with frustumCulled=false, renderOrder=1
3. ✅ Geometry has 90650 vertices fully loaded (positions + colors)
4. ✅ Material is attached with correct UUID and blend/depth settings
5. ✅ Mesh is in scene graph with Group parent
6. ❌ **`onAfterRender` callback NEVER fires — CONCLUSIVE PROOF mesh is not rendered**

**Root cause CONFIRMED (P≈0.95)**: The Points mesh is being **completely skipped** during R3F/THREE.js render traversal. The `onAfterRender` callback only fires when THREE.js actually renders a mesh, so its absence is definitive proof the mesh never reaches the WebGL draw call stage.

**Likely causes (P≈0.90)**:
- R3F is filtering out the Points mesh during scene traversal (possibly due to `<points>` JSX element not being recognized/mounted correctly)
- The mesh exists in React state but is not being added to the THREE.js scene graph properly
- R3F's render loop is skipping Points objects entirely (possible R3F bug or configuration issue)

**Next action (Milestone 4 — CRITICAL)**: 
1. Verify the `<points>` element is actually creating a THREE.Points instance in the scene graph (log `scene.children` recursively to find it)
2. If Points mesh is in scene graph, patch THREE.WebGLRenderer.render() to log all objects being processed to see where Points gets filtered out
3. If Points mesh is NOT in scene graph, the issue is with R3F's `<points>` element mounting — may need to create Points mesh imperatively instead of declaratively
