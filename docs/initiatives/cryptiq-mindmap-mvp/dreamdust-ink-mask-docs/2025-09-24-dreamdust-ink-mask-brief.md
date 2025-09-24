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

## Status Summary

- Render path functional (no blank canvas), but visuals far from desired airy aesthetic.
- Performance guardrails violated (p90 > 28 ms).
- Interaction behaviour pending revalidation.
