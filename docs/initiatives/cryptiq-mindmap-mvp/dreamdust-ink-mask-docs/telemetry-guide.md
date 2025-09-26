# Dreamdust Telemetry Guide

This reference explains how to enable the Dreamdust telemetry overlays, interpret the HUD colors, and translate the console log bundles into the AK-DD acceptance keys used for sign-off.

## Enabling telemetry

1. Append `?simStats=1&inkStats=1` to any Dreamdust URL that already includes the probe flags (`inkProbe=1&simProbe=1`).
2. Load the page and, once the reveal overlay clears, press `T` if the telemetry HUD badges are not visible.
3. Capture at least two cadence points per run: immediately after the first short-click gesture (T+0s) and 30 seconds after the long stroke (T+30s). Each cadence point must include:
   - HUD screenshot with the Sim Stats and Ink Stats badges visible.
   - Console logs for `[dreamdust] sim-stats {...}` and `[dreamdust] ink-stats {...}`.

## HUD color map

| Badge | Color  | Meaning | Action |
| ----- | ------ | ------- | ------ |
| Sim Stats | Teal | Simulation telemetry streaming; all thresholds currently passing. | Record values; compare against AK-DD coverage/variance.
| Sim Stats | Red  | One or more sim thresholds exceeded (coverage < 0.90, variance > 0.12, settleMs > 500). | Pause run, capture logs, file regression.
| Ink Stats | Amber | Ink uniforms live, requires manual confirmation of aesthetic output. | Ensure screenshot captures texture response.
| Ink Stats | Red   | Ink latency > 6 ms or opacity < 0.60. | Escalate to Dreamdust shader owner; block release.
| Ink Stats | Purple | Drift > 0.05 or HUD reports desync with sim. | Collect gesture reproduction steps and cross-check AK-DD cascade goals.

## Log interpretation

Each telemetry bundle contains the values required for AK-DD checkpoints. Record both the absolute numbers and their trend between cadence points.

### Simulation (`[dreamdust] sim-stats`)

- **coverage** — fraction of active voxels. Target ≥ 0.90 for smoky volume occupancy.
- **variance** — flow turbulence. Target ≤ 0.12 to avoid jitter that breaks vapor ribbons.
- **settleMs** — time for the sim to stabilize after input. Target ≤ 500 ms to keep interactions responsive.
- **frameP90Ms** — 90th percentile frame time. Target ≤ 11 ms (AK-DD latency budget).

### Ink (`[dreamdust] ink-stats`)

- **opacity** — aggregate alpha response of the ink mask. Target ≥ 0.60 to maintain visible ink curls.
- **latencyMs** — input-to-uniform delay. Target ≤ 6 ms to preserve the airy feel.
- **drift** — positional offset vs. sim centroid. Target ≤ 0.05 to keep trails anchored.
- **hudColor** — status broadcast used by the HUD badges; should match the table above.

## Acceptance key alignment

- **AK-DD-SIM-01 (Coverage stability)** — satisfied when coverage ≥ 0.90 at both cadence points and variance remains within 0.02 delta.
- **AK-DD-SIM-02 (Recovery speed)** — satisfied when settleMs ≤ 500 ms and frameP90Ms ≤ 11 ms at every cadence point.
- **AK-DD-INK-01 (Opacity envelope)** — satisfied when opacity ≥ 0.60 and drift ≤ 0.05.
- **AK-DD-INK-02 (Latency)** — satisfied when latencyMs ≤ 6 and hudColor stays amber (never red/purple).

When any acceptance key fails, annotate the brief with the offending metric, attach the cadence logs, and link to this guide section to justify the block.
