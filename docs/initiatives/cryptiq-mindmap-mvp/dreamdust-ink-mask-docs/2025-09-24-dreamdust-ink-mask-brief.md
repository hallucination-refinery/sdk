# Dreamdust Ink — Mask Round Brief (v1)

## Metadata

- Date: 2025-09-24
- Branch: `debug/batch0-baseline` (commit 9b371c8f)
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

## Current Evidence (2025-09-24 smoke)

```
[PC] prebaked positions …
[PC] instances: 89441
[dreamdust] caps { vertexInkOk: true, … }
[dreamdust] ink-tex bind …
[Dreamdust] reveal start …
[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 17, p90Ms: 58.4 }
[Dreamdust] reveal end …
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
[Dreamdust] ink-tex bind { … }
[PC] attach controls to <canvas …>
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

## Status Summary

- Render path technically initializes, but the sim-enabled run currently produces an almost blank canvas (just a tiny distant orb) rather than the intended cat silhouette.
- Performance guardrails violated (p90 > 28 ms).
- Interaction behaviour still unvalidated; ink strokes show no displacement.
