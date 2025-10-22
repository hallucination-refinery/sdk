---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-22T03:44:45Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, render-info, points-mesh, scene-traversal, render-list, renderer-render-pass, imperative-fix-didnt-work]
commit: 43f774d5
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP (`20251022-034153`) and Playwright (`20251022-034445`) reruns on commit `43f774d5` (imperative scene.add fix) **DID NOT CRASH** but **STILL RENDERS WRONG SCENE**. **FAIL (still wrong scene)** — ALL 6 render passes show `matchesRenderScene: false` with `sceneChildCount: 1`. The DreamdustSceneBridge's imperative `scene.add()` call either (a) used the wrong scene reference, (b) executed too late/not at all, or (c) was immediately removed/overridden by R3F. Scene-traversal shows nodeCount increased from 7 to 8, suggesting the group WAS added somewhere, but NOT to the render scene.

Key console lines (MCP):
- `[PC] forceVisible uniforms {uReveal: 1, uAlphaFloor: 1, uPointBaseSize: 8, uMinSize: 4, uMaxSize: 14}`
- `[PC] forceVisible applied {depthTest: false, depthWrite: false, blending: 2, applied: true}`
- `[PC] scene-traversal {pointsFound: true, nodeCount: 8, nodes: Array(8)}` ← **NodeCount increased from 7 to 8 (group added somewhere)**
- `[PC] render-list {pointsPresent: false, opaqueCount: 0, transparentCount: 0}` ← **Lists still empty**
- `[PC] renderer-render-pass {renderIndex: 0, sceneUuid: b24694ce..., sceneChildCount: 1, matchesRenderScene: false, ...}` ← **STILL wrong scene**
- ALL 6 render passes (0-5): **SAME sceneUuid (b24694ce...), sceneChildCount: 1, matchesRenderScene: false, pointsPresent: false, lists EMPTY**
- `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, parentType: Group}` ← **Mesh still correctly configured**
- `[PC] render-info {calls: 1, points: 0, triangles: 2, mat: Object, uniforms: Object}` ← **Still 0 points, 2 triangles**
- **❌ `[PC] points-after-render` — STILL MISSING** ← **Consistent with wrong scene**

Key console lines (Playwright):
- `[PC] scene-traversal {\"pointsFound\":true,\"nodeCount\":8,...}` ← **8 nodes (was 7), Dreamdust group added to traversed scene**
- ALL 6 `[PC] renderer-render-pass` logs show: **sceneUuid: aa4facdc..., sceneChildCount: 1, matchesRenderScene: false, pointsPresent: false, opaqueCount: 0, transparentCount: 0**
- **SAME PATTERN** as before imperative fix — rendered scene still has only 1 child, different UUID, empty render lists

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/43f774d5/docs/ink-falloff-flag-latch-2025-10-12/20251022-034153/2025-10-22-forceVisible-mcp.png` (still blank)

Screenshots (Playwright):
- `cursor-ooda-ink-prototype/assets/43f774d5/docs/ink-falloff-flag-latch-2025-10-12/20251022-034445/ink-chromium-20251022-034445-pre.png`
- `cursor-ooda-ink-prototype/assets/43f774d5/docs/ink-falloff-flag-latch-2025-10-12/20251022-034445/ink-chromium-20251022-034445-post.png`

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/43f774d5/docs/ink-falloff-flag-latch-2025-10-12/20251022-034153/console-mcp.json`
- Playwright: `cursor-ooda-ink-prototype/console/43f774d5/docs/ink-falloff-flag-latch-2025-10-12/20251022-034445/console-chromium-20251022-034445.json`

Playwright result:
- `BASE_URL=http://127.0.0.1:3000`
- `SMOKE_ROUTE=/quiz/archetype-v1?pc=scene-03&forceVisible=1`
- `tests/ink.smoke.spec.ts` → PASSED (1 test, 1.9 s); deterministic viewport/DPR + console persistence verified

Decision: **FAIL (still wrong scene) — Imperative fix didn't work** — Evidence proves:
1. ✅ App no longer crashes (bug fix worked)
2. ✅ Scene-traversal nodeCount increased from 7 to 8 (Dreamdust group WAS added to traversed scene)
3. ❌ **ALL 6 render passes STILL show `matchesRenderScene: false`** — imperative scene.add() failed to attach to render scene
4. ❌ **Rendered scene STILL has only 1 child** (vs traversed scene's expanded structure)
5. ❌ **Render lists STILL EMPTY** across all passes
6. ❌ **NO `[PC] points-after-render`** — onAfterRender never fires

**Critical insight**: The imperative `scene.add()` in DreamdustSceneBridge either:
- Used the WRONG scene reference (added to event scene, not render scene)
- Was called but immediately undone by R3F (R3F might maintain strict control over its internal scene)
- Executed too late (after R3F snapshot its render scene)
- Got the right scene but wasn't called at all (logic bug in useEffect)

**Next action (Milestone 9 — CRITICAL DEBUG)**: 
Add logging INSIDE DreamdustSceneBridge to verify:
1. Whether the useEffect runs at all
2. What scene UUID it's adding the group to
3. Whether scene.add() succeeds or throws
4. Whether the group remains in that scene after add (R3F might remove it)
