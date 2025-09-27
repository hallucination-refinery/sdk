# Deterministic Test Protocol — 2025-09-24

## Route

- Launch: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`
- Purpose: verify rendering on branch `debug/batch0-baseline` (commit 857886bb).

## Steps

1. **Production build + start**
   - `rm -rf apps/cryptiq-mindmap-demo/.next`
   - `pnpm --filter cryptiq-mindmap-demo run build`
   - `pnpm --filter cryptiq-mindmap-demo run start`
2. **Initial load**
   - Open the URL above in Chrome incognito (DevTools closed).
   - Wait ~5 seconds; observe the point cloud (post-merge shows a tighter silhouette roughly mid-frame, still distant and shimmering).
3. **Log capture**
   - Open DevTools console, copy entire log snapshot (with probes enabled):
     - `[PC] instances: 89441`
     - `[dreamdust] caps { vertexInkOk: true, … }`
     - `[dreamdust] cover-fit { mode: 'cover', margin: 0.78, … }`
     - `[engine] sim on { count: …, texSize: […] }`
     - `[engine] sim fit { radius: …, center: […] }`
     - `[dreamdust] frame-percentiles { … }` (note any regression vs 2025-09-25 cover-fit baseline; current sim smoke still shows p50 ≈ 32.9 ms, p90 ≈ 37.1 ms)
     - `[dreamdust] ink-tex bind …`
     - `[Dreamdust] reveal start …`
     - `[Dreamdust] reveal end …` ← expect **no** trailing `[Dreamdust] reveal clamp` message (log removed in prod).
     - If probes cause a compile failure, capture the shader error block (`vSimProbe redefinition`, `aSimUv undeclared`, etc.).
4. **Screenshot**
   - Save a screenshot of the probes run (`assets/2025-09-25-probes-smoke.png`).
5. **Stop server**
   - `Ctrl+C` to terminate `next start`.

## Acceptance Keys (baseline status)

- `[dreamdust] caps` — ✅ once.
- `[PC] instances` — ✅ once (89,441 points).
- `[dreamdust] frame-percentiles` — ✅ once (monitor; sim path still logs p90 ≈ 37 ms).
- `[dreamdust] ink-latency` — not tested in this run (interaction pending).

## Notes

- This protocol documents the “render present but jittery” state to anchor future fixes.
- Interaction and perf targets remain unmet; do not treat this as a pass condition.
- Mist defaults now expect `uNoiseThreshold = 0.6`, `uAlphaFloor = 0.15`, point sizing `[base:3, min:2, max:9]` for baseline. Airy/Cascade presets should retain their original (smaller) sizing/threshold values—flag any deviation.
