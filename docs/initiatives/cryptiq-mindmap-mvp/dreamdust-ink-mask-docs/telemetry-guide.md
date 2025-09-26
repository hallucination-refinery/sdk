# Dreamdust Telemetry Guide

This reference explains how to enable the Dreamdust telemetry overlays, interpret the HUD colors, and translate the console log bundles into the AK-DD acceptance keys used for sign-off.

## Enabling telemetry

1. Append `?simStats=1&inkStats=1` to any Dreamdust URL that already includes the probe flags (`inkProbe=1&simProbe=1`).
2. Load the page and, once the reveal overlay clears, press `T` if the telemetry HUD badges are not visible.
3. Capture at least two cadence points per run: immediately after the first short-click gesture (T+0s) and 30 seconds after the long stroke (T+30s). Each cadence point must include:
   - HUD screenshot showing the Sim Stats and Ink Stats badges.
   - Console logs for `[sim] metrics {...}`, `[PC] ink debug {...}`, and `[dreamdust] ink-latency {...}` (expand the objects so numeric fields are recorded).

## HUD color map

| Badge | Color  | Meaning | Action |
| ----- | ------ | ------- | ------ |
| Sim Stats | Teal | Simulation telemetry streaming; console is emitting `[sim] metrics` bursts. | Record min/avg/max, nan/inf counts, and grid size. |
| Sim Stats | Red  | HUD turns red when the metrics collector detects NaN/Inf or a stalled texture upload. | Pause the run, capture the console payload, escalate. |
| Ink Stats | Amber | Ink uniforms live; no automatic pass/fail thresholds applied yet. | Confirm screenshot captures the lack or presence of teal probe response. |
| Ink Stats | Red   | HUD indicates ink latency or intensity failure (latency > 20 ms or intensity ≤ 0.5). | Capture console payload and block release until resolved. |
| Ink Stats | Gray  | HUD hidden/off. | Press `T`; if the badge will not display, note it in the brief. |

## Log interpretation

Each telemetry bundle contains the values required for AK-DD checkpoints. Record both the absolute numbers and their trend between cadence points.

### Simulation (`[sim] metrics`)

- **min / max / avg** — vector length statistics sampled from the sim position texture. `max` should exceed 0.5 once the sim stabilises; investigate when `avg` stays near zero or `max` collapses.
- **nanCount / infCount** — NaN or Infinity texels discovered in the sampled grid. Both must remain `0`; any non-zero value is a hard stop.
- **grid** — size of the sampling grid (currently `8`).
- **samples** — flattened array of sampled magnitudes (first handful of texels). Review when plateaus or spikes appear.

### Ink (`[PC] ink debug` + `[dreamdust] ink-latency`)

- **vertexInkOk / inkIntensity** — confirm that the ink uniforms report readiness and intensity above `0.5`.
- **uViewport** — viewport size used by the ink uniforms; capture for regression comparison.
- **ink-latency.ms** — input-to-uniform delay. Target ≤ `20 ms`; higher values should be called out in the brief.
- **ink-latency.frames** — frame count corresponding to the latency measurement (helps diagnose stalled render loops).

## Acceptance key alignment

- **AK-DD-SIM-01 (Coverage stability)** — provisional; until coverage variance metrics are exposed, track `min/avg/max` trends and call out regressions.
- **AK-DD-SIM-02 (Recovery speed)** — provisional; use `[dreamdust] frame-percentiles` alongside `[sim] metrics` to judge frame health.
- **AK-DD-INK-01 (Opacity envelope)** — treat `inkIntensity` as the current proxy; document when it drops below 0.5.
- **AK-DD-INK-02 (Latency)** — fail the key when `[dreamdust] ink-latency.ms` exceeds 20 or the HUD badge turns red.

When any acceptance key fails, annotate the brief with the offending metric, attach the cadence logs, and reference this guide to justify the block.
