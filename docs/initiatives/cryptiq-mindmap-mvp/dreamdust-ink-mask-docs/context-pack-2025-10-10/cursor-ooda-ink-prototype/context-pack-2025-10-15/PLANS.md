# Dreamdust Ink — Dev Instrumentation Verification Plan (Context Pack 2025-10-15)

<!-- DD-PLAN:BEGIN:PURPOSE -->
## Purpose & Desired End State
Deliver the Dreamdust ink experience defined in `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype/context-pack-2025-10-15/01-vision-and-acceptance.md:9`: particles that respond within ≤2 frames, stay localized, decay smoothly, and leave camera/shader gates clean. This plan scopes the **dev-only instrumentation pass** required before the Cursor Panel Agent executes the end-to-end smoke workflow.
<!-- DD-PLAN:END:PURPOSE -->

<!-- DD-PLAN:BEGIN:CURRENT_STATUS -->
## Current Status (Verified Evidence)
- `[PC] material-defines`, `[PC] render-info`, `[PC] render-timeout`, and `[PC] scene-traversal` fire reliably in the latest dev capture (`context-pack-2025-10-15/console/manual-dev-20251024/console-manual-dev.txt:19-58`).
- Rendering pipeline trace for commit `332e9390` confirms hooks exist but render-list probes never emit (`03-rendering-pipeline-trace.md:130-152`).
- Working document marks **Diagnostic Implementation Failure** because `[PC] render-list snapshot`, `[PC] points-before-render`, and render-pass logs are absent (`06-working-document.md:7-35`).
- Production build still segfaults under Node 20 with `NEXT_DISABLE_LIGHTNINGCSS=1`, so prod verification is blocked (`console/manual-prod-20251024/console-manual-prod.txt:1`).
- Latest smoke evidence reiterates zero draw calls and missing render-list diagnostics (`10-latest-smoke-evidence.md:10-49`).
<!-- DD-PLAN:END:CURRENT_STATUS -->

<!-- DD-PLAN:BEGIN:ENTRY_EXIT -->
## Entry/Exit Criteria (Dev Verification Only)
- **Entry**
  - Dev server (Node 20) starts cleanly and `/quiz/archetype-v1?pc=scene-03` loads.
  - Debug toggle available: `NEXT_PUBLIC_DREAMDUST_DEBUG=1` env or `?ddDebug=1` query.
  - Force-visible bypass (`?forceVisible=1`) remains operative.
- **Exit**
  - Within ≤2 frames (≤5 s) the console logs:  
    `[PC] render-info`, `[PC] render-list snapshot` **or** `[PC] render-list empty`, `[PC] points-before-render`, `[PC] points-after-render`, `[PC] render-pass begin`, `[PC] render-pass end`.
  - Evidence stored under `context-pack-2025-10-15/console/dev-verify-*/` includes stream + summary.
  - PLANS.md checklist updated; next probe noted if any tag missing.
<!-- DD-PLAN:END:ENTRY_EXIT -->

<!-- DD-PLAN:BEGIN:PLAN -->
## Plan of Work (Short Horizon)
1. **Lock runbook** — Finalise this PLANS.md with dev-only scope, toggles, evidence destinations. Adjust immediately if repo facts differ.
2. **Record verification inputs** — Document target route, required tags, and instrumentation anchors (PointCloudStage/DreamdustMaterial) inside PLANS.md.
3. **Apply gated diagnostics** — Patch `PointCloudStage.tsx` to add guard-state logging, stage-points probe, runtime inspection surface, all behind `NEXT_PUBLIC_DREAMDUST_DEBUG` / `ddDebug`.
4. **Install verification helper** — Add `scripts/dd-verify-console.js` (Playwright) and manual fallback instructions; ensure helper cleans up the dev server.
5. **Run dev verification** — Execute helper with `NEXT_PUBLIC_DREAMDUST_DEBUG=1`, capture console+summary under `console/dev-verify-*`.
6. **Postmortem & next probe** — Append results + remaining questions to PLANS.md, highlighting the next micro-step if tags are missing.
<!-- DD-PLAN:END:PLAN -->

<!-- DD-PLAN:BEGIN:INPUTS -->
## Verification Inputs (Dev)
- **Route & toggles**: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1&ddDebug=1` (mirrored by `NEXT_PUBLIC_DREAMDUST_DEBUG=1` env).
- **Required console tags**  
  `[PC] render-info` · `[PC] render-list snapshot` · `[PC] render-list empty` · `[PC] render-list guard-state` · `[PC] points-before-render` · `[PC] points-after-render` · `[PC] stage-points-missing` · `[PC] render-pass begin` · `[PC] render-pass end` · `[PC] renderer-render-pass` · `[PC] render-timeout`
- **Code anchors**  
  - `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`: render-list override (`logRenderListDetails`), `renderLists.get` patch, points `onBefore/AfterRender`, `RenderInfoLogger`.
  - `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:793-818`: `[PC] material-defines` payload.
<!-- DD-PLAN:END:INPUTS -->

<!-- DD-PLAN:BEGIN:PROBES -->
## Diagnostic Probes (Dev Execution)
- **Render-list guard health** — Expect `[PC] render-list guard-state` once per session; must precede `[PC] render-list snapshot` or `[PC] render-list empty`.
- **Points hooks** — `[PC] points-before-render` & `[PC] points-after-render` should appear exactly once; if absent watch for `[PC] stage-points-missing`.
- **Render-pass wrapper** — `[PC] render-pass begin`/`end` plus `[PC] renderer-render-pass` prove `gl.render` override fired.
- **Timeout fallback** — `[PC] render-timeout` should only fire if calls remain zero after MAX_FRAMES; log frame count in summary.
<!-- DD-PLAN:END:PROBES -->

<!-- DD-PLAN:BEGIN:EVIDENCE -->
## Evidence Capture & Filing (Dev)
- Run IDs: `dev-verify-YYYYMMDD-HHMMSS` (UTC).
- Console stream: `context-pack-2025-10-15/console/dev-verify-*/console.txt`.
- Verification summary (`ok` flag + tag counts): `context-pack-2025-10-15/console/dev-verify-*/summary.json`.
- Manual fallback notes (if Playwright unavailable): `context-pack-2025-10-15/console/dev-verify-*/manual-notes.md`.
<!-- DD-PLAN:END:EVIDENCE -->

<!-- DD-PLAN:BEGIN:RISKS -->
## Risks/Unknowns & Quick Probes
| Risk | Quick Probe |
| --- | --- |
| Render-list getter never called | With `ddDebug=1`, confirm `[PC] render-list guard-state` emits; if not, temporarily hard-set `forceVisibleRef.current = true` (dev-only). |
| `stagePointsRef` remains null | Look for `[PC] stage-points-missing`; if triggered inspect ref assignment at `PointCloudStage.tsx:4304-4342`. |
| Playwright unavailable | Use manual flow: `pnpm --filter cryptiq-mindmap-demo run dev 2>&1 | tee /tmp/dreamdust-dev.log` then `rg` for tag strings. |
| Dev server lingering | Helper must close child process; otherwise terminate with `Ctrl+C`. |
<!-- DD-PLAN:END:RISKS -->

<!-- DD-PLAN:BEGIN:CHECKLIST -->
## Progress Checklist
- [x] PLANS.md updated with dev-only verification runbook
- [x] Route, tag strings, instrumentation anchors recorded (see Verification Inputs)
- [ ] Debug-gated instrumentation edits landed
- [ ] Verification helper & manual fallback committed
- [ ] Dev verification artifacts captured under `console/dev-verify-*`
- [ ] Postmortem + next probe documented
<!-- DD-PLAN:END:CHECKLIST -->

<!-- DD-PLAN:BEGIN:CHANGE_LOG -->
## Change Log
- 2025-10-24 — Authored dev-only instrumentation verification plan (runbook, toggles, evidence flow).
<!-- DD-PLAN:END:CHANGE_LOG -->
