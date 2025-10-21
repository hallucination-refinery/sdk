title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-21T02:04:20Z
commit: df83dc57
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251021-020245`) and Playwright (`20251021-020420`) smokes on commit `df83dc57` (added `onAfterRender` probe) confirmed **CONCLUSIVE ROOT CAUSE**. docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/10-latest-smoke-evidence.md
- **Critical finding**: 
  - `[PC] points-mesh {type: Points, visible: true, frustumCulled: false, renderOrder: 1, positionCount: 90650, colorCount: 90650}` — mesh correctly configured with 90650 vertices
  - `[PC] render-info {calls: 1, points: 0, triangles: 2, timeout: false, framesWaited: 2}` — WebGL renderer counts 0 points, 2 triangles
  - **❌ `[PC] points-after-render` — MISSING** — `onAfterRender` callback NEVER fired
  - **CONCLUSIVE**: `onAfterRender` only fires when THREE.js actually renders a mesh, so its absence definitively proves the Points mesh is NOT being rendered at all
- Render-info logger samples up to 60 frames; reported `timeout: false, framesWaited: 2` — other draws executed immediately.
- Uniforms, blend/depth overrides, fluid init all fire correctly; material reports `blending: 2`, `depthTest: false`, `depthWrite: false` as expected.
- Screenshots remain blank; Playwright spec continues to pass (1.7 s) with deterministic viewport/DPR.
- Acceptance gate status: FAIL (conclusive) — Milestone 3 complete (onAfterRender probe proves mesh not rendered), proceed to Milestone 4 with scene graph investigation.

**B) Reflection**
- The `onAfterRender` probe provided conclusive evidence: the callback never fires, which means THREE.js never renders the Points mesh. This is not a shader issue, not a uniform issue, not a visibility issue — the mesh is being completely skipped during render traversal.
- The Points mesh exists in React/R3F state (we can read its properties), but either (a) it's not in the THREE.js scene graph, or (b) it's in the scene graph but R3F/THREE.js is filtering it out before rendering.

**C) Hypotheses & unknowns**
- P≈0.65 — R3F's `<points>` JSX element is not creating/mounting the Points mesh in the THREE.js scene graph correctly (React state exists, but THREE.js scene graph is empty or has wrong object).
- P≈0.25 — Points mesh IS in scene graph but R3F's render loop is skipping it due to incorrect mounting (e.g., not added as child of scene/group properly, or R3F doesn't recognize Points objects).
- P≈0.08 — THREE.js render loop is filtering out Points objects before `onAfterRender` (unlikely, as Points is a standard THREE.js class).
- P≈0.02 — `onAfterRender` callback wasn't attached correctly (unlikely, code looks correct).

**D) Golden Path**
- Milestone 4 (P≈0.8): Log the entire scene graph recursively to verify if the Points mesh is actually in `scene.children` (or nested groups). Add logging in useFrame to traverse `scene.children` and find any Points-type objects. PASS = Points mesh found in scene graph (proceed to R3F render investigation); FAIL = Points mesh NOT in scene graph (R3F mounting issue, need imperative creation).
- Milestone 5 (P≈0.15): If Points mesh is in scene graph, add logging to R3F's render loop or THREE.WebGLRenderer to trace where Points objects get filtered out during traversal.
- Milestone 6 (P≈0.05): Create Points mesh imperatively (not via JSX) to bypass R3F's `<points>` element and verify if imperative mounting works.

**E) Single change to run next**
- Add scene graph traversal logging in useFrame to recursively walk `scene.children` and log all objects, highlighting any Points-type objects. Check if the Points mesh with `positionCount: 90650` exists anywhere in the scene graph. Log path from root to Points if found, or report "Points mesh not found in scene graph" if missing.

**F) Run plan**
- Add scene graph traversal logging in PointCloudStage (in useFrame or new diagnostic component).
- Rebuild & serve (Node 20): `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`.
- MCP + Playwright smoke: same URL with `forceVisible=1`, capture scene graph log.
- Archive to `cursor-ooda-ink-prototype/{assets,console}/<commit>/<branch>/<ts>/`.
- Update `10-latest-smoke-evidence.md` with scene graph findings; PASS if Points mesh found in scene (proceed to R3F render debug); FAIL if not in scene (fix R3F mounting, try imperative creation).
