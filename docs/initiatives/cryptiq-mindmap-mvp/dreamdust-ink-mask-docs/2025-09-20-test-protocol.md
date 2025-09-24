# Deterministic Test Protocol — 2025-09-20

## Route
- Launch: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&noBloom=1`
- Optional perf override: append `&simCap=<points>` when testing lower particle budgets.
- Debug geometry sanity: append `&debugSim=1` to render the plain `PointsMaterial` bypass.
- Browser prep: open a fresh incognito window, disable extensions, and perform a hard reload (`Cmd+Shift+R` / `Ctrl+Shift+R`) after first paint.

## Steps
1. **Cache reset and prod boot**
   - `rm -rf apps/cryptiq-mindmap-demo/.next`
   - `pnpm --filter cryptiq-mindmap-demo run build`
   - `pnpm --filter cryptiq-mindmap-demo run start`
   - Avoid `run dev` when capturing percentiles (development bundlers distort timings).
2. **Initial load + countdown observation**
   - Navigate to the canonical URL; leave DevTools closed for ~10 s so VTFSanity and frame samples settle.
   - Confirm the expected one-shot logs appear once (`caps`, `instances`, `sim fit`, VTFSanity, bloom status).
3. **Ink interaction sweep**
   - Perform one short tap near canvas center; confirm `[dreamdust] ink-latency` and `[PC] draw start/end … type:'tap'` fire once.
   - Perform one long stroke (~40–60 % width); confirm reveal/cascade logs fire and the canvas holds for ≥5 s.
4. **Frame percentile capture**
   - Open DevTools console (Preserve log on) and copy the first `[dreamdust] frame-percentiles { … }` line; ensure `p50 ≤ 16` and `p90 ≤ 28`.
5. **DebugSim geometry sanity**
   - Reload with `&debugSim=1` (same build) to verify `[debugSim] points-material bypass ON` and VTFSanity logs.
6. **Capture + archive**
   - Screenshot the payoff moment and archive raw console output (production + debugSim) in `dreamdust-ink-mask` evidence.

### Cache clear & prod commands (exact)
```bash
rm -rf apps/cryptiq-mindmap-demo/.next
pnpm --filter cryptiq-mindmap-demo run build
pnpm --filter cryptiq-mindmap-demo run start
```

### Log & screenshot capture points
- **Server boot**: record the successful Next dev banner and confirm no compilation warnings
- **First paint**: capture `[dreamdust] caps …`, `[PC] instances: …`, `[engine] sim fit …`, VTFSanity usage, and bloom status.
- **Post-short tap**: note `[dreamdust] ink-latency { … }` and the absence of fallback logs
- **Post-long stroke**: capture `[Dreamdust] reveal end { … }` (and cascade logs when available) and take the payoff screenshot.
- **DebugSim sanity**: with `&debugSim=1`, capture the bypass log plus VTFSanity samples.
- **Session end**: export the console log containing all Acceptance Key events (production + debugSim) and archive with the screenshot.

## Expected one-shots mapped to Acceptance Keys
- **AK-DD-01 — Caps Snapshot**: `[dreamdust] caps { vertexInkOk: true, dprClamp: 1.8, … }` emitted exactly once on canvas creation
- **AK-DD-02 — Instance Count**: `[PC] instances: <count>` logged once; ensure count respects active caps (≤100 k during perf experiments).
- **AK-DD-03 — Reveal Timeline**: `[Dreamdust] reveal start { duration: 2 }` followed by `[Dreamdust] reveal end { duration: 2 }`, each once per session
- **AK-DD-04 — Frame Percentiles**: `[dreamdust] frame-percentiles { sampleCount: ≥240, p50Ms: ≤16, p90Ms: ≤28 }` logged once after idle settle in production mode.
- **AK-DD-05 — Ink Latency**: `[dreamdust] ink-latency { ms: ~16.7, frames: 1 }` logged once immediately after the short tap
- **AK-DD-06 — Fallback Guard**: **Absence** of `[Dreamdust] compile timeout — falling back to PointsMaterial`; any appearance is an automatic fail

## Pass/Fail Rubric
- **Pass** when all Acceptance Key one-shots fire exactly once (or remain absent for AK-DD-06), visuals match the brief (ethereal mist, smooth cascade, stable HUD), and no WebGL/program errors appear in the console
- **Conditional Retry** if visuals match but exactly one Acceptance Key is missing due to suspected logging glitch; rerun once after clearing cache before marking fail
- **Fail** if any Acceptance Key fires multiple times, any required log is missing after a retry, the fallback log appears, caps/instances exceed thresholds, or the visual experience diverges from the brief (jitter, lag, missing payoff label)

## Failure triage (text flowchart)
1. Verify cache reset and dev boot commands were executed; if not, rerun Step 1 then repeat the protocol
2. If Acceptance Key logs are missing, reload with DevTools “Preserve log” enabled and re-run short tap + long stroke
3. If visuals are off but logs look correct, toggle `debug=1` overlays to confirm ink sampling; if overlays fail, restart dev server
4. If fallback or WebGL errors persist after restart, capture logs/screenshots immediately and escalate to Dreamdust owner

## Baseline commands (reference)
```bash
corepack enable
pnpm install --frozen-lockfile
pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit \
  || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit
pnpm --filter cryptiq-mindmap-demo run lint || true
pnpm --filter cryptiq-mindmap-demo run build
pnpm run smoke
```
