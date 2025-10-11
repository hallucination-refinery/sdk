Phase A restored (2025-10-11)
- Quick smoke passed: global motion visible again on stroke; camera fixed; controls locked.
- Dev flag for localized trial: append `&falloff=1` to enable temporary falloff (`uTempFalloffOn=1`, `uTempCenter`, `uTempRadius`). Use `window.dreamdust.dumpUniforms()` to log values.
- Expectation: with `falloff=1`, only a neighborhood (≈10–20%) should move; without it, global displacement remains for baseline comparisons.

Falloff trial result (2025-10-11)
- URL used: `...?pc=scene-03&debug=1&falloff=1`. Observed: whole cloud still jitters; `dumpUniforms()` shows `uTempFalloffOn: 0` while `uTempIntensity` rises during the stroke.
- Interpretation: the falloff flag is not applying in this prod session (timing of uniform set vs material readiness, or URL parse not taking). This explains global motion despite the flag.
- Verify (console, one-shot while drawing):
  ```js
  (m => { m.uniforms.uTempFalloffOn.value = 1; m.uniforms.uTempRadius.value = 0.12; })((window.__vertexCaptureArgs||{}).material || (window.dreamdust||{}).material)
  ```
  If local plume appears, the shader path is correct and only the flag application timing needs fixing.
- Next run checklist (no code yet):
  - Confirm reveal ended, then log `dumpUniforms()` while starting a stroke; capture 3 lines (start/mid/end).
  - If `uTempFalloffOn` is still 0 with `&falloff=1`, set it via console as above to confirm behavior.
# Runbooks — One‑Screen Tests

M1 — Force‑Field Prototype
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
- Gestures:
  1. Tap at viewport center (~x: 512, y: 384).
  2. Draw a 2 s horizontal stroke from (x: 256, y: 384) to (x: 768, y: 384).
- Expected visuals: ripple/advected particles ≥5 px under pointer within 1–2 frames; motion decays when input stops; camera static.
- Evidence to capture:
  - Console: `[PC] draw start/end`, `[PC] ink tex updated`, frame percentile log after interaction.
  - Screenshots: before tap, during stroke (mid-motion), after decay.
- Optional: capture `uTempCenter` / `uTempRadius` via DevTools to confirm the falloff footprint. If `uTouch` is adopted later, capture that texture instead.
- Current status (2025-10-11): dragging with Phase A scaffolding pushes the entire cloud; no local falloff yet. Console log (2025-10-11) shows repeated `[PC] draw start/end` entries with long stroke distances and no localized decay. Screenshot or screen recording recommended before modifying uniforms.
- Follow-up (before Phase B): add temporary uniforms for pointer UV (`uTempCenter`) + radius (`uTempRadius`), apply smoothstep falloff in the vertex shader, then re-run this test to confirm only the stroke neighborhood (≈10–20% of the cloud) moves.
- Phase B add-on: repeat after swapping to `uForceVector`/`uTouch`; log the new uniform values and confirm the temporary `uTempForce` path is removed (note commit/tag).
- Note: during Phase A scaffolding, `uTempForce` may be used instead of final uniforms; record that value in console before removing scaffolding.

Regression triage (2025-10-11)
- Observation: After clean install/build/start and visiting `?pc=scene-03&debug=1` in an incognito tab, multiple strokes produced no visible motion (cloud unreactive). Console shows: caps fanout OK, prebaked present, repeated `[PC] draw start/end`, `[PC] ink tex updated`, and `ink-uv guard ok` per stroke.
- Quick checks (no code edits; for console-only triage):
  - Verify uniform values during a drag: read `material.uniforms.uTempIntensity.value`, `uTempForce.value`, `uTempCenter.value`, `uTempRadius.value` while pointer moves. Expect `uTempIntensity>0` and force/center changing.
  - Confirm shader path executes: temporarily set `uTempRadius=0.5` and `uTempIntensity=0.25` in DevTools and see if any displacement appears. If still none, the displacement likely needs view-space scaling.
  - Pixel scaling sanity: compare with the ink offset path which applies `pxScale = viewDist / uFocal` before adding to `viewPos.xy`. If `uTemp*` displacement is added in world space, the apparent screen motion can vanish.
  - Environment: verify URL is exactly `.../quiz/archetype-v1?pc=scene-03&debug=1` and the scene has finished reveal (look for `[Dreamdust] reveal end`).
  - Evidence: paste one short console block showing the four uniform values while dragging.

Iteration result (2025-10-11, same server session)
- Action: cleared console, emptied cache + hard reloaded, dragged a long stroke, then ran the uniform snapshot snippet.
- Snippet:
  ```js
  const m = window.__vertexCaptureArgs?.material;
  ({ force: m?.uniforms?.uTempForce?.value,
    intensity: m?.uniforms?.uTempIntensity?.value,
    center: m?.uniforms?.uTempCenter?.value,
    radius: m?.uniforms?.uTempRadius?.value })
  ```
- Output: `{}` (uniform snapshot undefined) — indicates the capture handle is not available in this build/session; treat as “no material probe” rather than proof of zero values.
- Next: proceed with “Revert recommendation” below unless you prefer to instrument via a tooling capture (e.g., Spector.js) first.

Revert recommendation (Phase A, minimal prototype priority)
- Goal is visible motion now; if the probe is unavailable and motion remains absent, revert to the last iteration with visible (global) displacement to satisfy M1 pass/fail, then re‑apply falloff with pixel scaling in a follow‑up.
- Record the revert commit hash and tag in `04-evidence-index.md` when executed.

M2 — Palette Cascade
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
- Gestures:
  1. Draw 2–3 s stroke across a red-dominant region; release.
  2. Repeat in a blue-dominant region within 10 s (tests multi-stroke escalation).
- Expected visuals: palette sample logged (`[PC] cascade commit: <color>`); hue rolls across all particles to nearest palette color within 2–3 s; full saturation when `uCascadeProgress` reaches 1.
- Evidence: console log of palette selection and commit, screenshots (before stroke, mid-cascade, post-cascade).
- Optional: if using `uTouch`, capture a snapshot of the trail canvas for debugging.

M3 — Polish
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03`
- Gestures: tap + stroke with tuned gains.
- Expected: gentle curl/ripple overlays on top of force response; controls remain disabled during draw; console limited to key telemetry.
- Evidence: note gain values set (DevTools), capture console showing minimal logs, screenshot of finished stroke.

M4 — Baseline
- Commands (repo root):
  1. `pnpm install --frozen-lockfile`
  2. `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit`
  3. `pnpm --filter cryptiq-mindmap-demo run lint || true`
  4. `pnpm --filter cryptiq-mindmap-demo run build`
  5. `pnpm run smoke`
- Expected: all commands succeed (lint may warn); capture stdout verbatim and attach to docs/PR; tag final commit for rollback.
