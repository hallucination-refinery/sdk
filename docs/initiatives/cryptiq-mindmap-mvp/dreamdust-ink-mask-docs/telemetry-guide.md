# Dreamdust Telemetry Guide

This reference explains how to enable the Dreamdust telemetry overlays, interpret the HUD colors, and translate the console log bundles into the AK-DD acceptance keys used for sign-off.

## Enabling telemetry

1. Append `?simStats=1&inkStats=1` to any Dreamdust URL that already includes the probe flags (`inkProbe=1&simProbe=1`).
2. Load the page and, once the reveal overlay clears, press `T` if the telemetry HUD badges are not visible.
3. Capture at least two cadence points per run: immediately after the first short-click gesture (T+0s) and 30 seconds after the long stroke (T+30s). Each cadence point must include:
  - HUD screenshot showing the Sim Stats and Ink Stats badges.
  - Console logs for `[sim] metrics {...}`, `[PC] ink debug {...}`, `[dreamdust] ink-latency {...}`, and `[dreamdust] frame-percentiles {...}` (expand the objects so numeric fields are recorded).

## HUD color map

| Badge     | Color | Meaning                                                                               | Action                                                                                            |
| --------- | ----- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Sim Stats | Teal  | Simulation telemetry streaming; console is emitting `[sim] metrics` bursts.           | Record min/avg/max, nan/inf counts, and grid size.                                                |
| Sim Stats | Red   | HUD turns red when the metrics collector detects NaN/Inf or a stalled texture upload. | Pause the run, capture the console payload, escalate.                                             |
| Ink Stats | Amber | Ink uniforms live; intensity/latency need manual review.                              | Confirm screenshot captures the presence or absence of teal probe response; compare against logs. |
| Ink Stats | Red   | HUD indicates ink latency or intensity failure (latency > 20 ms or intensity ≤ 0.5).  | Capture console payload, annotate the brief, and block release until resolved.                    |
| Ink Stats | Gray  | HUD hidden/off.                                                                       | Press `T`; if the badge will not display, note it in the brief.                                   |

## Log interpretation

Each telemetry bundle contains the values required for AK-DD checkpoints. Record both the absolute numbers and their trend between cadence points. Always include the raw `window.debugDreamdustUniforms` snapshot when available so we can correlate uniform values with telemetry.

### Simulation (`[sim] metrics`)

- **min / max / avg** — vector length statistics sampled from the sim position texture. `max` should exceed 0.5 once the sim stabilises; investigate when `avg` stays near zero or `max` collapses, and call out when the distribution plateaus near ~1.55 with trailing zeros (suggesting frozen motion).
- **nanCount / infCount** — NaN or Infinity texels discovered in the sampled grid. Both must remain `0`; any non-zero value is a hard stop.
- **grid** — size of the sampling grid (currently `8`).
- **samples** — flattened array of sampled magnitudes (first handful of texels). Review when plateaus or spikes appear.

### Ink (`[PC] ink debug` + `[dreamdust] ink-latency` + `window.debugDreamdustUniforms`)

- **vertexInkOk / inkIntensity** — confirm that the ink uniforms report readiness and intensity above `0.5`.
- **uViewport** — viewport size used by the ink uniforms; capture for regression comparison.
- **ink-latency.ms** — input-to-uniform delay. Target ≤ `20 ms`; higher values should be called out in the brief with HUD color reference.
- **debugDreamdustUniforms.uInkIntensity** — should stay >0.5 during interaction; a value of `0` indicates ink is fully muted even if telemetry claims intensity 0.75.
- **debugDreamdustUniforms.uDriftAmp / uPointSize / uAlphaFloor** — confirm they match expected preset values; anomalies indicate visibility choke.
- **ink-latency.frames** — frame count corresponding to the latency measurement (helps diagnose stalled render loops).

## Acceptance key alignment

- **AK-DD-SIM-01 (Coverage stability)** — provisional; until coverage variance metrics are exposed, track `min/avg/max` trends and call out regressions.
- **AK-DD-SIM-02 (Recovery speed)** — use `[dreamdust] frame-percentiles` alongside `[sim] metrics` to judge frame health; flag p50 > 16.7 ms or p90 > 28 ms.
- **AK-DD-INK-01 (Opacity envelope)** — treat `inkIntensity` and `debugDreamdustUniforms.uInkIntensity` together; document when either falls below 0.5 (or 0 for the uniform).
- **AK-DD-INK-02 (Latency)** — fail the key when `[dreamdust] ink-latency.ms` exceeds 20 or the HUD badge turns red.

When any acceptance key fails, annotate the brief with the offending metric, attach the cadence logs, and reference this guide to justify the block.
