# Dreamdust Ink – Probes Smoke Brief (2025-09-26)

## Metadata

- Branch: `debug/batch0-baseline`
- Commit: `9aa50da1`
- Build: `pnpm install --frozen-lockfile` → thin-slice `tsc` → `pnpm --filter cryptiq-mindmap-demo run lint || true` (fails on existing app/page.tsx unused exports) → `CI=1 pnpm --filter cryptiq-mindmap-demo run build` → `pnpm --filter cryptiq-mindmap-demo run start`
- Probes: `?engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1`
- Device/Browser: MacBook Pro (M1 Pro, 16 GB) · Chrome 140 incognito
- Screenshot: `assets/2025-09-26-probes-smoke.png`

## Objective

Validate that the probe shader fix (single `vSimProbe`, bound `aSimUv`) links correctly and capture telemetry/visuals showing teal ink scaling and red VTF diagnostics, while checking if the aesthetic regression (blank canvas) persists.

## Artifacts

- **Terminal transcript:** see raw capture (`2025-09-26-probes-smoke-raw.md`). Lint still reports the long-standing `app/page.tsx` unused exports; treated as known debt per earlier runs.
- **Initial console batch:** `[dreamdust] caps`, `[dreamdust] caps-fanout`, `[PC] prebaked*`, `[engine] sim on`, `[engine] sim fit`, repeated `[sim] metrics` bursts, `[dreamdust] frame-percentiles { p50Ms: 39.2, p90Ms: 42 }`, no shader compile errors or `useProgram` spam observed.
- **Telemetry dump:**
  ```
  [sim] metrics {
    min: 0,
    max: 1.5524,
    avg: 1.0279,
    nanCount: 0,
    infCount: 0,
    samples: [0.8177 … 1.5524, trailing zero plateau],
    texSize: [300, 299],
    grid: 8
  }
  [PC] ink debug { vertexInkOk: true, uViewport: [1370, 1022], inkIntensity: 0.75 }
  [dreamdust] ink-latency { ms: 38.7, frames: 2.32 }
  ```
- **Gestures:** Short tap produced the telemetry above; long drag emitted no additional ink logs or HUD changes and yielded no visible displacement.
- **Visual:** Canvas remains effectively black—no visible mist, teal probe glow, or red VTF highlights despite probes compiling. HUD badges show Sim (teal) and Ink (amber) as expected.
- **Uniform snapshot:** `window.debugDreamdustUniforms` reports `uInkIntensity: 0`, `uReveal: 1`, `uDriftAmp: 8`, `uPointSize: 1`, `uAlphaFloor: 0.06`, indicating reveal completed but ink intensity is clamped to zero while drift amplitude is drastically higher than preset defaults.

## Telemetry Assessment

| Metric        | Observation                               | AK-DD Target                         | Status                                                                   |
| ------------- | ----------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------ |
| Sim magnitude | `min 0`, `avg 1.0279`, `max 1.5524`       | n/a (diagnostic)                     | Data flowing; magnitudes stable but plateau at ~1.55 with zeros trailing |
| Frame latency | `p50Ms 39.2`, `p90Ms 42.0`                | `≤ 16.7 / ≤ 28`                      | **Fail** — render loop stalling, matches rAF violations                  |
| Ink latency   | `38.7 ms (2.32 frames)`                   | `≤ 20 ms`                            | **Fail** — latency regressed sharply vs. prior 5–6 ms captures           |
| Ink probe     | `vertexInkOk: true`, `inkIntensity: 0.75` | expect teal point-size amplification | **Fail** — no on-screen teal growth detected                             |
| Sim probe     | metrics stream emitting                   | expect red tint for invalid texels   | **Fail** — no visible tint despite non-zero magnitudes                   |

## Findings vs Expectations

1. Probe shader now compiles: absence of GLSL error spam confirms the guard fix landed.
2. Visual diagnostics still absent; blank canvas persists even though sim magnitudes read non-zero.
3. Ink latency breached AK-DD budget (38.6 ms) and never returned to steady state; long stroke produced no follow-up logs.
4. Sim metrics show meaningful data (non-zero magnitudes) yet particles remain invisible, implying downstream alpha/size choke or missing draw call despite the shader linking.

## Outstanding Questions

- Why does ink telemetry report `inkIntensity: 0.75` without the teal probe visual—are we failing to modulate `gl_PointSize` or fragment tint despite the `DEBUG_INK_PROBE` define?
- Why is ink latency 6× higher than the previous day? Need to inspect brush updates / worker scheduling.
- Are particles being culled by alpha floor or reveal band given the preset defaults? Need to inspect runtime uniform values.
- Long drag emitted no cascade logs; confirm whether cascade trigger path is bypassed under sim mode.

## Next Actions

1. Inspect rendered buffers (e.g., render doc / WebGL inspector) to confirm points are emitted but fully transparent; focus on `alpha` and size uniforms.
2. Instrument ink latency path to pinpoint the 38 ms delay (texture upload vs. CPU throttling).
3. Capture `[ink] point-stats` log (currently absent) to quantify point-size/alpha distribution; adjust telemetry collector if needed.
4. Iterate dreamdust preset defaults (noise threshold, alpha floor, reveal band) to restore base visibility once telemetry confirms values.
5. Re-run the probe smoke after applying visibility fixes to validate teal/red cues and record updated metrics.

## References

- Raw capture: `2025-09-26-probes-smoke-raw.md`
- Screenshot: `assets/2025-09-26-probes-smoke.png`
- Prior state: `2025-09-25-dreamdust-ink-mask-brief.md`
