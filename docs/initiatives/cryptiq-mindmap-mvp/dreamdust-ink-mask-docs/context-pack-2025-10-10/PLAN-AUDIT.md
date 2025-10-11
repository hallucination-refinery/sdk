# Dreamdust Ink — Context Pack + Implementation Plan Audit
**Date:** 2025-10-10

## Findings & Recommendations

1. **Direction aligned with goals** — `00-overview.md` prioritizes “particles are the ink,” immediate force-field motion, palette cascade, fixed camera, no overlays. `03-implementation-plan.md` M1/M2 reflect this and keep orbit controls out of the way.
2. **Minimal prototype first is preserved** — M1 Phase A is dev‑only scaffolding to see undeniable motion in minutes, then Phase B hardens it. This matches “ship minimal prototype first.”
3. **Make M1 uniforms explicit** — Name temporary vs final uniforms and the decay/update cadence to avoid ambiguity; call out `material.needsUpdate` when toggling active state.
4. **Codify mirror/controls guardrails** — Plan references mirror and controls lock; add explicit callouts for propagation and when to lock/unlock during draw.
5. **Palette cascade details** — Specify curated palette location, nearest‑color helper signature, and single source to toggle commit; define progress/easing and duration.
6. **Evidence-first runbooks** — Provide precise URLs, gesture coordinates, expected visuals, and raw console keys per milestone (Phase A vs Phase B differentiated).
7. **Baseline commands verbatim** — Include exact repo commands and require pasting stdout for CI parity; avoid docs‑build runs per repo policy.
8. **Scaffolding teardown** — Require tagging commit before removing Phase A and list files to touch/remove to keep diffs minimal and reversible.

## Issues (Ranked)

### BLOCKER: M1 force-field specifics could be missed by contributors
**Severity:** Blocker
**Files:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`, `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`
**Why:** Without explicit uniform names, update cadence, and decay semantics, Phase A may stall or ship tint‑only visuals.
**Fix:** In `03-implementation-plan.md` name `uTempForce` (Phase A) and the Phase B set: `uForceVector`, `uForceIntensity`, `uForceDecay`, `uForceActive`. State update at 60 fps from `InkSurface` pointer delta; decay multiply each frame when idle; set `material.needsUpdate = true` when toggling active.

### MAJOR: Palette cascade lacks single source of truth
**Severity:** Major
**Files:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` (or shared util)
**Why:** No curated palette constant, nearest‑color helper, or commit switch leads to inconsistent hue selection.
**Fix:** Add `CASCADE_PALETTE` constant and `findNearestPaletteColor(rgb)` helper; add `uCascadeProgress`, `uCascadeColor`, `uCascadeSizeBoost`, `uCascadeCommit`, `uCascadeDuration` uniforms and one toggle site in `InkSurface.tsx` on stroke end.

### MAJOR: Evidence capture not gated by Phase A vs Phase B
**Severity:** Major
**Files:** `05-runbooks.md`
**Why:** Testers need to know whether temporary `uTempForce` or final uniforms/`uTouch` are in play to record correct evidence.
**Fix:** Add callouts to log and screenshot the active path (Phase A temp uniform vs Phase B final/`uTouch`) and include sample console strings.

### MINOR: Gain targets not actionable for M3
**Severity:** Minor
**Files:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts`
**Why:** “Tune gains” lacks numeric targets to quickly converge on the “ink in air” feel.
**Fix:** Document target ranges for `uOffsetGain` (0.3–0.5), `uTintGain` (0.1–0.2), `uCurlAmp` (0.05–0.1); tie ripple impulse to tap.

### MINOR: Baseline command list should be explicit
**Severity:** Minor
**Files:** `03-implementation-plan.md`, `05-runbooks.md`
**Why:** Contributors may run non‑deterministic flows.
**Fix:** Include the repo’s baseline sequence exactly and require verbatim stdout pasted into docs.

## Redlined 03-implementation-plan.md

> M1 — Phase A (scaffolding; dev‑only)

Replace
"In `PointCloudStage.tsx`, inject a temporary uniform and add a quick vertex offset; update it directly from `InkSurface`."

With
"Add `uTempForce` (vec2) and `uTempIntensity` (float) with per‑frame decay (multiply by 0.9–0.98 when idle). Set from `InkSurface` pointer delta at ~60 fps; apply screen‑space offset in the vertex path. Keep camera unchanged; disable OrbitControls while drawing; flip vector for mirror flags."

> M1 — Phase B (harden)

Replace
"Replace the temporary uniform with structured ones; optionally adopt `uTouch`."

With
"Introduce `uForceVector` (vec2), `uForceIntensity` (float), `uForceDecay` (float), `uForceActive` (bool). If adopting `uTouch`, render a trail canvas (Codrops style) and sample in vertex. Move displacement math into a helper; set `material.needsUpdate = true` when toggling `uForceActive`. Tag commit, then remove Phase A scaffolding."

> M2 — Palette cascade

Replace
"Add palette and nearest‑color util; implement cascade uniforms."

With
"Define `CASCADE_PALETTE` in `DreamdustMaterial.ts` (or shared); implement `findNearestPaletteColor(rgb)`. Add uniforms `uCascadeProgress`, `uCascadeColor`, `uCascadeSizeBoost`, `uCascadeCommit`, `uCascadeDuration`. Trigger commit in `InkSurface.tsx` on stroke end (duration/length threshold). Use smoothstep over 2–3s."

> M3 — Polish

Replace
"Tune gains; rate‑limit logs."

With
"Set `uOffsetGain` target 0.3–0.5, `uTintGain` 0.1–0.2, `uCurlAmp` 0.05–0.1. Add a short‑tau tap ripple. Gate `[PC]` logs to ≤30 fps; keep `[PC] draw start/end`, cascade commit, frame stats only."

> M4 — Verification

Append
"Run baseline commands from repo root and paste stdout verbatim."

## M1 Implementation Blueprint

### Phase A — Scaffolding (dev‑only)
- Uniforms: `uTempForce` (vec2), `uTempIntensity` (float), implicit decay 0.9–0.98/frame
- Touchpoints: `PointCloudStage.tsx` (inject temp uniforms; lock controls), `InkSurface.tsx` (pointer→delta→uniform), `DreamdustMaterial.ts` (apply simple vertex offset)
- Update cadence: set uniforms on pointer events/frame loop; decay when idle
- Guardrails: mirror propagation; `material.needsUpdate` if shader define toggles; camera/framing intact
- Observed issue (2025-10-11): Dragging with Phase A scaffolding displaces the entire particle cloud uniformly. Need to add local falloff (per-particle influence) before hardening.
- Next action: add temporary uniforms for pointer UV + radius, gate force with smoothstep falloff in vertex shader, then repeat M1 runbook to confirm only the stroke neighborhood moves.
- Pass/Fail: visible motion in ≤2 frames; ≥5px displacement; decay resumes on end

### Phase B — Hardened
- Final uniforms: `uForceVector`, `uForceIntensity`, `uForceDecay`, `uForceActive`
- Optional `uTouch`: off‑screen trail canvas sampled in vertex for parallel displacement
- Shader: helper function for force application; mirror‑aware; respect pixel scale
- Teardown: tag commit; remove Phase A code (list files/lines in PR description)

## M2 Cascade Blueprint

### Palette Source & Helper
- Add `CASCADE_PALETTE` constant in `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` (or shared util)
- Helper signature: `findNearestPaletteColor(rgb: [number,number,number]): [number,number,number]`

### Uniforms & Timing
- Uniforms: `uCascadeProgress` (0–1), `uCascadeColor` (vec3), `uCascadeSizeBoost` (float), `uCascadeCommit` (bool), `uCascadeDuration` (float)
- Timing: 2–3s smoothstep from current→target; progress advanced in render loop once `uCascadeCommit` is set
- Single commit site: `InkSurface.tsx` `onEnd` for strokes above duration/length threshold; log `[PC] cascade commit: <color>`

### Test Procedure
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
- Gestures: 2–3s stroke across center; repeat in different hue regions
- Expected: hue rolls across particles to nearest palette color within duration; size boost visible; camera unchanged
- Evidence: screenshots (before/mid/after), console logs, optional `uTouch` snapshot

## 60–90 Minute Runbook

### Phase A (M1) — 20–30 min
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
- Steps: tap center (512,384); 2s stroke (256→768 @ y=384)
- Expect: ≥5px displacement within ≤2 frames; smooth decay on end; camera static
- Evidence: `[PC] draw start/end`, `[PC] ink tex updated`, frame percentile log; screenshots x3

### Phase B (M1) — 20–30 min
- Switch uniforms to final set or `uTouch`; verify `material.needsUpdate` on toggle
- Expect: same visuals; improved persistence if `uTouch` enabled
- Evidence: log active path (Phase B vs `uTouch`); screenshot of canvas/texture if applicable

### M2 Cascade — 20–30 min
- Trigger commit on stroke end; log chosen palette color; verify 2–3s roll
- Evidence: console `[PC] cascade commit: <color>`, screenshots x3, duration noted

### M4 Baseline — 10–15 min
- Commands (repo root):
  1. `pnpm install --frozen-lockfile`
  2. `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit` || app typecheck fallback
  3. `pnpm --filter cryptiq-mindmap-demo run lint || true`
  4. `pnpm --filter cryptiq-mindmap-demo run build`
  5. `pnpm run smoke`
- Paste stdout verbatim into docs; attach screenshots; create rollback tag

—

References
- `00-overview.md`, `01-current-state.md`, `02-decisions.md`, `06-reference-notes.md`
- Mirror audit: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-10-ink-mirroring-pipeline-audit.md`
- Key files: `InkSurface.tsx`, `DreamdustMaterial.ts`, `PointCloudStage.tsx`
