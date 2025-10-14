# Automated Smoke Test Evidence — 2025-10-14

## Cross‑reference (automation vs. ad‑hoc)
- **Automation**: after‑reveal log confirmed `uTempRadius: 0.14`, `uTempFalloffOn: 1`, `forceScale: 220`; draw start/end events fired; `[PC] ink tex updated`; camera fixed; p50/p90 ≈ 8.4/16.7ms.
- **Ad‑hoc**: slight under‑cursor displacement/warping during strokes was visible to the eye.
- **Synthesis**: InkSurface texture updates are active (visual displacement) even while `uTempIntensity` remains `0`. The shader path that consumes the ink texture can produce subtle warps independently of the force/intensity gating; intensity isn’t propagating to the shader despite input.

## Updated understanding
- **Input plumbing works**: pointer down/move/up, UV guard, texture flush, and draw lifecycle fire reliably.
- **Radius/falloff ownership is correct**: one post‑reveal source; after‑reveal uniforms verified.
- **The gap**: `applyTempForce` computes force/intensity, but `uTempIntensity` never rises above `0` at the time the shader reads it. Likely causes:
  - Intensity calculation/clamp/decay zeroing (magnitude or schedule).
  - Uniform set ordering/timing (set → immediately decayed → sampled at 0).
  - Shader uses ink texture for displacement regardless of intensity, while the “particles are ink” force path is gated by `uTempIntensity` and is effectively bypassed.

## Quick code verification (no edits)
- `PointCloudStage.tsx`: single‑source `uTempRadius=0.14` set in reveal‑start effect; after‑reveal diagnostic log present; multiple earlier radius fallbacks removed from hot paths.
- `InkSurface.tsx`: canvas heatmap texture flushed via `getImageData`; pointer pipeline intact; logs match automation (`draw start/end`, `ink tex updated`).
- `applyTempForce` path: calculates clamped force and intensity and writes `uTempForce`, `uTempIntensity`, `uTempCenter`; automation showed draw events but no non‑zero `uTempIntensity` observed.

## Evidence (key logs)
```
[PC] uniforms after-reveal {uTempRadius: 0.14, uTempFalloffOn: 1, forceScale: 220}
[PC] draw start … / [PC] draw end { type: 'tap' }
[PC] draw start … / [PC] draw end { type: 'stroke', durationMs: ~1121, distancePx: ~864 }
[PC] ink tex updated
[dreamdust uniforms] { uTempIntensity: 0, uTempRadius: 0.14, uTempFalloffOn: 1 }
```

## Screenshots
- Pre‑tap: 2025-10-14-smoke-pre-tap.png
- Post‑tap: 2025-10-14-smoke-post-tap.png
- Post‑stroke: 2025-10-14-smoke-post-stroke.png

## Gates (current)
- **≤2 frames motion**: **FAIL** (no measurable intensity; motion too subtle to register)
- **10–20% localized**: **N/A** (no intensity)
- **Fixed camera**: **PASS**
- **Smooth decay**: **N/A** (no intensity)

## Plan — prior to next smoke test (no functional behavior changes yet)
1) **Instrument force path** (temporary diagnostics only): log in `applyTempForce` the `delta`, computed magnitude, clamped `fx/fy`, computed `intensity`, and post‑write `uTempIntensity`.
2) **Schedule check**: log one rAF later (`~16ms`) the current `uTempIntensity` to detect decay‑before‑sample.
3) **Mid‑stroke capture**: add a mid‑stroke screenshot at step 8/15 of the drag and a uniforms dump at the same instant to correlate visuals with uniforms.
4) **Acceptance gates**: keep current gates; add a provisional sub‑gate: `uTempIntensity > 0.05` within ≤2 frames of pointer down.
5) **Decision**: if intensity > 0 and visuals obvious → PASS; if intensity == 0 → try (single change) `TEMP_FORCE_SCALE += 40` and re‑run; if still 0 → relax `TEMP_FORCE_CLAMP` by +4 and re‑run.

## Why this moves us toward the vision
- Ensures under‑finger motion within ≤2 frames is driven by the intended force path, not incidental texture warps — restoring the feel of “particles are ink,” localized and responsive.

