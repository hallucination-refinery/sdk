# Deterministic Test Protocol — 2025-09-24

## Route

- Launch: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`
- Purpose: verify rendering on branch `debug/batch0-baseline` (commit 9b371c8f).

## Steps

1. **Production build + start**
   - `rm -rf apps/cryptiq-mindmap-demo/.next`
   - `pnpm --filter cryptiq-mindmap-demo run build`
   - `pnpm --filter cryptiq-mindmap-demo run start`
2. **Initial load**
   - Open the URL above in Chrome incognito (DevTools closed).
   - Wait ~5 seconds; observe the point cloud (post-merge shows a tighter silhouette roughly mid-frame, still distant and shimmering).
3. **Log capture**
   - Open DevTools console, copy entire log snapshot:
     - `[PC] instances: 89441`
     - `[dreamdust] caps { vertexInkOk: true, … }`
     - `[dreamdust] cover-fit { mode: 'cover', margin: 0.78, … }`
     - `[engine] sim on { count: …, texSize: […] }`
     - `[engine] sim fit { radius: …, center: […] }`
     - `[dreamdust] frame-percentiles { … }`
     - `[dreamdust] ink-tex bind …`
     - `[Dreamdust] reveal start …`
     - `[Dreamdust] reveal end …`
4. **Screenshot**
   - Save a screenshot of the sim-enabled smoke test (`assets/2025-09-25-sim-smoke.png`).
5. **Stop server**
   - `Ctrl+C` to terminate `next start`.

## Acceptance Keys (baseline status)

- `[dreamdust] caps` — ✅ once.
- `[PC] instances` — ✅ once (89,441 points).
- `[dreamdust] frame-percentiles` — ✅ once (p90 still high ~58 ms).
- `[dreamdust] ink-latency` — not tested in this run (interaction pending).

## Notes

- This protocol documents the “render present but jittery” state to anchor future fixes.
- Interaction and perf targets remain unmet; do not treat this as a pass condition.
