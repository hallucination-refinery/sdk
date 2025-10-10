# Runbooks — One‑Screen Tests

M1 — Force‑Field Prototype
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03`
- Gestures: one short tap; one 2–3s stroke.
- Expect: points visibly move under the finger within ≤2 frames; decay after input.
- Evidence: paste `[PC] draw start/end`, frame stats, and 1 screenshot.

M2 — Palette Cascade
- Same URL.
- Action: perform a 2–3s stroke; release.
- Expect: sampled hue → nearest palette → hue rolls across all particles to a saturated end state.
- Evidence: console log with chosen palette color; 2 screenshots (before/after).

M3 — Polish
- Same URL.
- Gestures: tap + stroke.
- Expect: “ink in air” feel (gentle ripple/curl), no orbit interference, minimal console noise.

M4 — Baseline
- Commands: install → typecheck (schema/app) → lint (warn-only) → build → smoke; paste stdout verbatim in PR body.

