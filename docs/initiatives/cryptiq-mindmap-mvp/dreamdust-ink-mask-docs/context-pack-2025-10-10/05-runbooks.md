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
  - Optional: capture `uForceVector` or `uTouch` (if adopted) via DevTools to confirm active force/texture.
- Current status (2025-10-11): dragging with Phase A scaffolding pushes the entire cloud; no local falloff yet. Console log (2025-10-11) shows repeated `[PC] draw start/end` entries with long stroke distances and no localized decay. Screenshot or screen recording recommended before modifying uniforms.
- Follow-up (before Phase B): add temporary uniforms for pointer UV + radius, apply smoothstep falloff in vertex shader, then re-run this test to confirm only the stroke neighborhood moves.
- Phase B add-on: repeat after swapping to `uForceVector`/`uTouch`; log the new uniform values and confirm the temporary `uTempForce` path is removed (note commit/tag).
- Note: during Phase A scaffolding, `uTempForce` may be used instead of final uniforms; record that value in console before removing scaffolding.

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
