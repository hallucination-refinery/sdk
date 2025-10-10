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
  - Optional: capture `uForceVector` uniform via DevTools to confirm active force.
- Note: during Phase A scaffolding, `uTempForce` may be used instead of final uniforms; record that value in console before removing scaffolding.

M2 — Palette Cascade
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
- Gestures:
  1. Draw 2–3 s stroke across a red-dominant region; release.
  2. Repeat in a blue-dominant region within 10 s (tests multi-stroke escalation).
- Expected visuals: palette sample logged (`[PC] cascade commit: <color>`); hue rolls across all particles to nearest palette color within 2–3 s; full saturation when `uCascadeProgress` reaches 1.
- Evidence: console log of palette selection and commit, screenshots (before stroke, mid-cascade, post-cascade).

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
