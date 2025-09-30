# Dreamdust Ink — Mask Round Brief (v1)

## Quick Index

- [Metadata](#metadata)
- [End Experience (aesthetic-only)](#end-experience-aesthetic-only)
- [Test Route (canonical)](#test-route-canonical)
- [Guardrails (baseline status)](#guardrails-baseline-status)
- [Cross-Date Metrics](#cross-date-metrics)
- [Current Evidence (2025-09-24 smoke)](#current-evidence-2025-09-24-smoke)
- [2025-09-24 Post-Merge Smoke](#2025-09-24-post-merge-smoke)
- [2025-09-25 Cover-Fit Dev Snapshot](#2025-09-25-cover-fit-dev-snapshot)
- [2025-09-25 Sim Smoke](#2025-09-25-sim-smoke)
- [2025-09-25 Probes Smoke (inkProbe=1, simProbe=1)](#2025-09-25-probes-smoke-inkprobe1-simprobe1)
- [2025-09-26 Probes Smoke (post-probe fix)](#2025-09-26-probes-smoke-post-probe-fix)
- [2025-09-27 Clamp + Preset Update](#2025-09-27-clamp--preset-update)
- [Status Summary](#status-summary)

Raw reference: [2025-09-28 smoke capture](2025-09-28-smoke-raw.md#4-console-objects-paste-the-expanded-payload-for-each).

## Metadata

- Date: 2025-09-24
- Branch: `debug/batch0-baseline` (commit 857886bb)
- Scope: Baseline render verification only; no new features merged.

## End Experience (aesthetic-only)

- Baseline build renders a bright white particle swarm with heavy jitter; silhouette does not resemble the target image.
- Interaction reactions (tap curls, vapor cascade) not yet revalidated on this branch.
- Purpose of this brief: capture baseline evidence as a reference point before reintroducing performance fixes.

## Test Route (canonical)

- URL: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`

## Guardrails (baseline status)

- DPR clamp logged as 1.8 (desktop); point budget 89,441 instances.
- Frame percentiles: single log `{ p50 ≈ 16.7 ms, p90 ≈ 58.4 ms }` with persistent rAF violations.
- Ink worker disabled; fallback path active.

## Cross-Date Metrics

| Date / Run | Visual outcome snapshot | Sim avg / max | Frame p90 (ms) | Ink latency (ms) |
| ---------- | ---------------------- | ------------- | -------------- | ---------------- |
| 2025-09-24 baseline smoke | Bright white jittered swarm; silhouette lost. | — | 58.4 | — |
| 2025-09-24 post-merge prod | Tighter cat silhouette with bloom, sits deep in frame. | — | 9.1 | 7.9 |
| 2025-09-25 cover-fit dev | Cat fills viewport with crisp stipple, bloom on. | — | ≈9 | — |
| 2025-09-25 sim smoke | Canvas nearly black; distant lone orb only. | — | 37.1 | — |
| 2025-09-25 probes smoke | Probes linked but canvas blank with faint orb. | 1.02 / 1.55 | 41.8 | 40.1 |
| 2025-09-28 probes smoke raw | HUD-only scene; faint orb, heavy rAF violations. | 1.02 / 1.55 | 60 | 2.3 |

## Current Evidence (2025-09-24 smoke)

```
[PC] prebaked positions …
[PC] instances: 89441
[dreamdust] caps { vertexInkOk: true, … }
[dreamdust] ink-tex bind …
[Dreamdust] reveal start …
[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 17, p90Ms: 58.4 }
[Dreamdust] reveal end …   ← no follow-up "reveal clamp" log (removed for prod parity)
```

Screenshot: see `assets/2025-09-24-baseline-jitter.png` (white jittering cloud).

### 2025-09-24 Post-Merge Smoke

- Branch: `debug/batch0-baseline` after merging Batch 1–3 fixes; production build.
- Visual: cloud now holds a tighter silhouette with bloom on but sits deep in frame; the luminous region covers only ~17% of the canvas width and ~20% height (bounding box ≈493×409 px within a 2912×2030 frame), so the subject reads small and distant; shimmer remains and smokey density still missing.
- Interaction: drawing gestures produced no perceptible ink response (`vertexInkOk: true` but no displacement observed).
- Performance: frame percentiles improved (p50 ≈ 8.3 ms, p90 ≈ 9.1 ms); bloom guard activated by default.

```
[PC] prebaked positions { bytes: 3219888, count: 268324, … }
[PC] prebaked PCA orientation applied
[PC] prebaked present; using positions/colors, fallback images not required
[PC] instances: 89441
[dreamdust] caps { vertexInkOk: true, floatOk: true, dprClamp: 1.8 }
[dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
[dreamdust] ink-tex bind { … }
[Dreamdust] reveal start { duration: 2 }
[dreamdust] bloom { enabled: true, strength: 0.2, radius: 0.4, threshold: 0.8 }
[Dreamdust] reveal end { duration: 2 }
[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 8.3, p90Ms: 9.1 }
[PC] ink debug { vertexInkOk: true, uViewport: [1598, 1022], inkIntensity: 0.75 }
[dreamdust] ink-latency { ms: 7.9, frames: 0.47 }
```

Screenshot: `assets/2025-09-24-post-merge.png` (post-merge cloud with bloom, small/distant mid-frame cluster on black background).

### 2025-09-25 Cover-Fit Dev Snapshot

- Branch: `debug/batch0-baseline` (local dev) after tightening camera cover fit defaults.
- Visual: cloud now spans essentially the full viewport (detected bounding box ≈2866×1838 within 2868×2034 frame → ~99% width, ~90% height). Image reads crisp and legible; bloom gives gentle sheen but particles remain discrete stipple rather than airy smoke.
- Interaction: brush strokes still fail to perturb the cloud (no curl/swirl, no cascade growth) despite `vertexInkOk: true` and healthy ink-latency log; reactive pipeline remains broken.
- Diagnostics: new `[dreamdust] cover-fit { mode: 'cover', margin: 0.78, distance ≈ XXX }` log prints once per fit, confirming the tighter margin. Frame percentile snapshot remains ~8 ms / 9 ms in dev.

Screenshot: `assets/2025-09-25-cover-fit.png` (cover-fit framing, full-viewport cat render).

### 2025-09-25 Sim Smoke

- Branch: `debug/batch0-baseline` (production build) with `?engine=sim` flag.
- Visual: canvas remains nearly black—even with the sim enabled there is no visible point cloud after reveal. After panning, a single distant white orb becomes visible (same artifact seen in earlier sim regressions); the primary cat silhouette never appears.
- Interaction: short click and long stroke yielded no displacement, no tint, and no cascade growth; only `[PC] ink debug` / `[dreamdust] ink-latency` logs appeared.
- Diagnostics: `[engine] sim on { count: 89441, texSize: [300,299] }` and `[engine] sim fit { radius: 0.382, center: [0.01,-0.03,1.13] }` confirm ParticleSim initializes, but frame percentiles regressed (p50 ≈ 32.9 ms, p90 ≈ 37.1 ms) and `[dreamdust] bloom` disabled due to perf guard.
- Regression vs 2025-09-25 cover-fit dev snapshot: previously the cat-filled viewport rendered sharply with bloom on (p50 ≈ 8 ms, p90 ≈ 9 ms). Enabling the sim replaces that image with a near-blank scene and drops perf by ~4×, implying the sim output overwrites geometry with invalid data.
- Status: displacement still absent despite VTF sim reporting active; next step is to instrument `USE_SIM_POS` / ink fetch in shaders and validate sim texture contents.

Screenshot: `assets/2025-09-25-sim-smoke.png` (sim-enabled smoke test, scene dark/minimal).

### 2025-09-25 Probes Smoke (inkProbe=1, simProbe=1)

- Branch: `debug/batch0-baseline` (prod build) with `?engine=sim&inkProbe=1&simProbe=1`.
- Visual: probe shader links after the guard fix, but the viewport remains almost entirely black with a single faint orb; teal ink expansion and red VTF tint still do not appear.
- Logs present: `[dreamdust] caps`, `caps-fanout`, `ink-tex bind` (twice), `[PC] instances: 89441`, `[Dreamdust] reveal start/end`, `[engine] sim on { count: 89441, texSize: [300,299] }`, `[engine] sim fit { radius: 0.382, center: [...] }`, `[dreamdust] bloom { enabled: false, ... }`, frame-percentiles `{ p50: 39.3, p90: 41.8 }`, and ink metrics (`[PC] ink debug { vertexInkOk: true, inkIntensity: 0.75 }`, `[dreamdust] ink-latency { ms: 40.1, frames: 2.41 }`).
- Missing/blocked: teal/red overlays and any displacement response—the sim appears to feed near-zero positions, and long-stroke cascade logs remain absent.
- Action: instrument sim magnitude/NaN stats and ink offsets so we can trace whether the pipeline dies inside the GPGPU update or in the shader consumption path.

Screenshot: `assets/Screenshot 2025-09-25 at 6.26.43 PM.png` (probes enabled, near-black canvas with a single distant orb).

### 2025-09-26 Probes Smoke (post-probe fix)

- Branch: `debug/batch0-baseline` (prod build) with `?engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1` after GLSL guard fix.
- Visual: shader now links (no compile errors), but canvas remains blank—no teal ink scale, no red VTF tint, and underlying cat silhouette still missing.
- Logs: `[dreamdust] caps`, `caps-fanout`, `[PC] prebaked*`, `[engine] sim on`, `[engine] sim fit`, repeated `[sim] metrics { min: 0, max: 1.5524, avg: 1.0279, nanCount: 0, infCount: 0, samples: [...] }`, `[dreamdust] frame-percentiles { p50Ms: 39.2, p90Ms: 42 }`, `[PC] ink debug { vertexInkOk: true, uViewport: [1370,1022], inkIntensity: 0.75 }`, `[dreamdust] ink-latency { ms: 38.7, frames: 2.32 }`, numerous `requestAnimationFrame` violation warnings; no shader error spam.
- Uniforms: `window.debugDreamdustUniforms` shows `uInkIntensity: 0`, `uDriftAmp: 8`, `uPointSize: 1`, `uAlphaFloor: 0.06`, suggesting ink is fully muted while drift is overstated.
- Interaction: short tap triggers telemetry but no visible response; long drag emits no additional ink logs or cascade events.
- Notes: Visual regression persists despite probes linking; investigate alpha/size choke, zero ink intensity, and elevated frame/ink latency before next smoke.
- Screenshot: `assets/2025-09-26-probes-smoke.png` (blank scene with HUD badges).

### 2025-09-30 Telemetry

- Branch: `codex/instrument-vertex-positions-for-debugging` (prod build) with `?engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1&forceAlpha=1&vertexLog=1`, executed through `scripts/smoke-test.js` against `http://127.0.0.1:3000`.
- Visual: automatic screenshot `assets/2025-09-30-telemetry-capture.png` still shows a nearly black canvas with only HUD overlays—no cat silhouette, teal ink probe, or red VTF overlay.
- Diagnostics: harness emitted `assets/2025-09-30-telemetry-console.jsonl` and `2025-09-30-vertex.log`; all gates remained `false` and the run reported `vertexTelemetry.capture not available`, confirming vertex capture never fires (no `[vertex] samples …`, buffer counts stay zero).
- Status: automation path now works end-to-end, but visibility/reactivity regressions persist; next step is to restore the capture hook so shader tracing can move forward without manual runs.

### 2025-09-30 Telemetry Iteration 2 (Blocked)

- Branch: `codex/instrument-vertex-positions-for-debugging`, attempted automated telemetry run.
- **Blocker**: Production build fails on ARM64 (aarch64) Linux environment with `Cannot find module '../lightningcss.linux-arm64-gnu.node'` error from `lightningcss@1.30.1` package used by Tailwind CSS v4.
- Dev server starts but returns HTTP 500 errors on all routes, including `/debug/caps`, indicating the same underlying native module issue affects both build and runtime.
- Environment: Node v20.19.3, pnpm 9.x, ARM64 architecture (Linux aarch64).
- Impact: Cannot proceed with telemetry capture until native dependencies are compatible with ARM64 or environment is switched to x86_64.
- Attempted remediation: Tried both production build (`pnpm build`) and dev mode (`pnpm dev --turbopack`); both fail due to missing ARM64 native binaries for `lightningcss`.
- Recommendation: Either (1) run telemetry workflow on x86_64 host, (2) downgrade/replace Tailwind CSS v4 with compatible alternative, or (3) wait for `lightningcss` ARM64 support in upstream package.

## 2025-09-27 Clamp + Preset Update

- Baseline preset now launches with `uNoiseThreshold = 0.6`, `uAlphaFloor = 0.15`, and point sizing `[base: 3, min: 2, max: 9]` to present a soft mist out of the box.
- Preset sanitisation keeps values finite but **no longer raises** airy/cascade point sizes (`uMinSize = 1`, `uPointBaseSize = 1`, `uOffsetGain = 0`) or their higher reveal thresholds (`uNoiseThreshold = 0.92`).
- Reveal clamp holds `uReveal = 1` silently; there is no `[Dreamdust] reveal clamp` console spam in prod builds.

## Status Summary

- Render path technically initializes, but the sim-enabled run currently produces an almost blank canvas (just a tiny distant orb) rather than the intended cat silhouette.
- Performance guardrails violated (p90 > 28 ms).
- Interaction behaviour still unvalidated; ink strokes show no displacement.
- QA expectations updated above: confirm mist defaults and absence of reveal clamp logs before proceeding to smoke.
