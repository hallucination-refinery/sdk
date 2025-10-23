# Deterministic Test Protocol — 2025-09-20

## Route
- Launch: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`
- Query params: `pc=scene-02` (prebaked cat layout), `debug=1` to surface logs and overlays
- Browser prep: open a fresh incognito window, disable extensions, and perform a hard reload (`Cmd+Shift+R` / `Ctrl+Shift+R`) after first paint

## Steps
1. **Cache reset and dev boot**
   - Clear the Next build cache: `rm -rf apps/cryptiq-mindmap-demo/.next`
   - Start the Dreamdust dev server: `pnpm --filter cryptiq-mindmap-demo run dev`
   - Wait for `ready - started server on http://localhost:3000` before loading the route
2. **Initial load + countdown observation**
   - Navigate to the canonical URL above and let the cinematic countdown complete without interaction
   - Confirm no console errors and note the first burst of Dreamdust one-shot logs
3. **Ink interaction sweep**
   - Perform one short tap (press + release) near canvas center; observe local buoyant curls and heatmap alignment
   - Perform one long stroke covering 40–60% of canvas width; watch the cascade recolor and hold the reveal for at least 5 seconds
4. **Capture + archive**
   - Screenshot at the payoff moment: immediately after the long-stroke cascade settles and the centered label appears
   - Save the DevTools console log (preserve log enabled) and the screenshot into the dated `dreamdust-ink-mask` evidence folder

### Cache clear & dev commands (exact)
```bash
rm -rf apps/cryptiq-mindmap-demo/.next
pnpm --filter cryptiq-mindmap-demo run dev
```

### Log & screenshot capture points
- **Server boot**: record the successful Next dev banner and confirm no compilation warnings
- **First paint**: capture the `[dreamdust] caps …` one-shot payload
- **Post-short tap**: note `[dreamdust] ink-latency { … }` and the absence of fallback logs
- **Post-long stroke**: capture `[Dreamdust] reveal end { duration: ~2 }` and take the payoff screenshot
- **Session end**: export the console log containing all Acceptance Key events and attach the screenshot to the run report

## Expected one-shots mapped to Acceptance Keys
- **AK-DD-01 — Caps Snapshot**: `[dreamdust] caps { vertexInkOk: true, dprClamp: 1.8, … }` emitted exactly once on canvas creation
- **AK-DD-02 — Instance Count**: `[PC] instances: 134162` (±500 tolerance) logged once after geometry upload
- **AK-DD-03 — Reveal Timeline**: `[Dreamdust] reveal start { duration: 2 }` followed by `[Dreamdust] reveal end { duration: 2 }`, each once per session
- **AK-DD-04 — Frame Percentiles**: `[dreamdust] frame-percentiles { sampleCount: ~240, p50Ms: 8–9, p90Ms: 9–10 }` logged once after the long stroke
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
