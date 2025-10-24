title: Working Plan — Ink Prototype (Current Iteration)
date: 2025-10-23T23:00:24Z
commit: b99fe68f
branch: docs/ink-falloff-flag-latch-2025-10-12
---

**A) Where we are**
- MCP (`20251023-230024`) smoke on commit `b99fe68f` (extended render pipeline instrumentation) — **DIAGNOSTIC IMPLEMENTATION FAILURE**: New render pipeline diagnostics did not appear. Existing probes still show `useVelocityDisp: false` (fallback mode) and zero draw calls. See: `10-latest-smoke-evidence.md`.
- Manual verification (`20251024-0314`) on commit `456899a0` (Node 20 dev server) — **Instrument hooks attached successfully**, emitting `[PC] instrumentation render-list override active`, `[PC] instrumentation points-hook attached`, and `[PC] render-timeout`, but **no `[PC] render-list snapshot` or `[PC] points-before-render`**. Points mesh still fails to reach render list. Evidence: `console/456899a0/local-manual-20251024/console-manual-dev.txt`.
- Acceptance gate status: diagnostics partially working (hooks live) yet render queue still empty → continue render pipeline investigation.

**B) Reflection**
- Shader guard behaves as designed for fallback devices (`useVelocityDisp: false` when `vertexInkOk: false`); the issue lies further down the render pipeline.
- Instrumentation now confirms the hooks install (`render-list override active`, `points-hook attached`), yet the render list snapshot never fires—indicating the list is either empty or never generated for the points.
- Remaining suspect: render-list population/visibility logic (culling, render pass selection, renderer info). The diagnostic focus shifts from guard logic to render-stage introspection.

**C) Hypotheses & unknowns**
- P≈0.80 — Render list remains empty because the points mesh is filtered out before list generation (culling/state issue).
- P≈0.65 — Render list is generated but references a different internal cache; need to tap the active list after `gl.render`.
- P≈0.50 — Additional renderer state (layers, visibility, render order) suppresses the points even after hooks attach.

**D) Golden Path**
- Milestone 18: **Capture render list contents post-render** — Augment instrumentation to inspect `gl.renderLists?.get(scene, camera)` immediately after `gl.render` (log when list is missing vs. empty).
- Milestone 19: **Confirm render pass cadence** — Ensure `[PC] render-pass begin/end` logs appear for each frame and correlate with renderer info counters.
- Milestone 20: **Analyze render timeout cause** — Determine why frames elapse without draw calls even when hooks are active.
- Milestone 21: **Restore visible particles** — Once render queue behavior is understood, apply the necessary visibility fix and verify via smoke + screenshot.

**E) Single change to run next**
- Extend render-list instrumentation (per updated plan) so we can observe why `[PC] render-list snapshot` never fires—log list retrieval attempts and contents directly after `gl.render`.

**F) Run plan**
- Implement the render-list follow-up instrumentation as documented (no production run until logs appear locally).
- Rebuild & serve with Node 20; run manual Playwright capture to confirm new `[PC] render-list snapshot` / `[PC] render-pass begin/end` logs.
- Once logs appear, archive evidence and proceed to full MCP smoke.
- Update context-pack docs after each evidence capture.

**G) Success criteria**
- ✅ `[PC] render-list snapshot` and `[PC] points-before-render` logs appear with the updated instrumentation.
- ✅ `[PC] render-pass begin/end` pair for each frame (limited by log cap) with `calls` remaining zero—proving render function executes but draws nothing.
- ✅ Ability to inspect render list contents immediately after render to diagnose why points are absent.
- ✅ Once draw calls reappear, screenshot must show visible particles (final gate).
