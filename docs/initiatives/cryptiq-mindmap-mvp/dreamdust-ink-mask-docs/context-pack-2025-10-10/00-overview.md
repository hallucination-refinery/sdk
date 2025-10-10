# Overview — Right Direction

Right Direction
- Particles are the ink. Touch must cause immediate, undeniable particle motion under the finger (tap ripple + drag advection), not a 2D paint mask.
- Palette‑mapped cascade: sample hue at gesture start → snap to curated palette → roll through every particle to a saturated end state.
- Keep camera/framing intact; no orbit fight while drawing; zero overlays in the main experience.

Acceptance Criteria
- Tap: visible response in ≤2 frames exactly under the pointer; decays gracefully.
- Stroke: advects points along the path with a “vapor” feel; no input lag; no camera interference.
- Cascade: final hue chosen from a curated palette and applied across all particles in a timed roll; scene looks “congealed.”

Cascade Triggers (Intent Thresholds)
- Tiny tap → local ripple or mini‑cascade only; no full commit.
- Brief stroke → localized wash; still reversible; builds intent but does not lock the scene.
- Committed stroke (sufficient time + travel) → trigger full cascade across the cloud.
- Multi‑stroke drawings accumulate intent within a short window; escalate from mini → partial → full cascade when the gesture feels decided.
- Palette is sampled at the first meaningful stroke start; subsequent strokes may bias slightly before the full cascade locks in.
