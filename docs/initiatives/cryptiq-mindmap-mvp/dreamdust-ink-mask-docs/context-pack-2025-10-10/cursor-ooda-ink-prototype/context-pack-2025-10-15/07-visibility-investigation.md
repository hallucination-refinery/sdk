---
title: Visibility Investigation – Render Stats Diagnostic
date: 2025-10-18T14:05:00Z
commit: c1ea70ff
branch: docs/ink-falloff-flag-latch-2025-10-12
---

## Evidence intake
- MCP `20251017-185946` and Playwright `20251017-190424` runs remain blank even though all `[PC]` readiness logs fire (`forceVisible uniforms`, `uniforms after-reveal`, `fluid init`, `instances`). Screenshots: `cursor-ooda-ink-prototype/assets/c2f62ddf/docs/ink-falloff-flag-latch-2025-10-12/20251017-185946/2025-10-17-forceVisible-mcp.png` and `.../20251017-190424/ink-chromium-20251017-190424-{pre,post}.png`.
- Console captures contain no WebGL errors, but the expected `[PC] render-info …` entry is absent from both `console-mcp.json` and `console-chromium-20251017-190424.json`; draw-call execution is still unconfirmed.
- `PointCloudStage.tsx` now mounts a dedicated `<RenderInfoLogger>` inside the Canvas that waits for `forceVisible`, the WebGL renderer, and the stage points before emitting a single `[PC] render-info …` line (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx).

## Investigation notes
- The logger now runs inside the R3F context via `useFrame`, so it cannot trip the “hooks outside Canvas” guard seen during the last attempt.
- The log includes renderer stats (`calls/points/triangles`), the material’s UUID/blend/depth flags, and a uniform snapshot to prove the draw gate state.

## Risks & follow-ups
- Continuing shader/physics tuning without draw-call proof risks chasing non-existent visibility issues.
- If the log still fails to appear, investigate stage binding (ensure `<points ref={stagePointsRef}>` mounts) and renderer availability inside Canvas.

## Next actions
- Run MCP + Playwright with `?forceVisible=1`, capture the new `[PC] render-info …` line, and record the reported `calls/points/triangles`. PASS if `calls > 0`; FAIL if the log is missing or reports zero draws, in which case debug material binding next.
