# Deterministic Test Protocol - 2025-09-25

## Route

- Launch: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1`
- Purpose: validate Dreamdust probes instrumentation on `debug/batch0-baseline`, capture the telemetry overlays/logs required by the AK-DD checkpoint, and document the shader failure blocking probe visuals.

## Preconditions

- Branch checked out: `debug/batch0-baseline` (local ahead by telemetry commits).
- Workspace cleaned: `rm -rf apps/cryptiq-mindmap-demo/.next`.
- Build provenance logged: `CI=1 pnpm --filter cryptiq-mindmap-demo run build` followed by `pnpm --filter cryptiq-mindmap-demo run start`.
- Screenshot destination prepared: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-09-25-probes-smoke.png`.
- Telemetry reference: keep `telemetry-guide.md` open to verify HUD colors, metric thresholds, and AK-DD mapping while collecting evidence.

## Procedure

1. **Reset + install**
   - `git status -sb` -> confirm no unstaged work for this run.
   - `pnpm install --frozen-lockfile` (deterministic; husky warning acceptable).
2. **Typecheck thin slice**
   - `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit`
   - If schema slice unavailable, fallback `pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit`.
3. **Lint (warn-only)**
   - `pnpm --filter cryptiq-mindmap-demo run lint || true`
   - Record the known warnings (Unexpected any, unused vars in `app/page.tsx`).
4. **Build**
   - `CI=1 pnpm --filter cryptiq-mindmap-demo run build`
   - Capture Next.js route table and build metadata.
5. **Start server**
   - `pnpm --filter cryptiq-mindmap-demo run start` (keep running in separate terminal).
6. **Interactive smoke**
   - Chrome 140 incognito, DevTools closed for first 5 s.
   - Navigate to the URL above; wait for reveal overlay to clear.
   - Verify HUD badges for **Sim Stats** (teal) and **Ink Stats** (amber) appear; if hidden, tap `T` to toggle overlays per `telemetry-guide.md`.
   - Open DevTools console and copy the **first batch** of logs (caps, caps-fanout, ink-tex bind, prebaked, instances, reveal start, sim on, shader error block).
   - Capture screenshot with probes active once the canvas settles (`assets/2025-09-25-probes-smoke.png`) and HUD overlays visible.
7. **Probe gestures**
   - Short click (tap + release) at viewport center; copy emitted `[PC] ink debug` + `[dreamdust] ink-latency` logs.
   - Long stroke (click + drag ~ 1/2 width); note absence/presence of additional logs.
   - Record the HUD snapshot + console metrics at T+0s (post-short click) and T+30s (post-long stroke) to satisfy AK-DD cadence.
8. **Collect telemetry + logs**
   - At each cadence mark, copy the `[dreamdust] sim-stats` and `[dreamdust] ink-stats` log bundles. Flag any metrics breaching thresholds defined in the guide (e.g., sim variance > 0.12, ink latency > 6 ms).
   - Scroll console to capture the full error spam (duplicate `vSimProbe`, `aSimUv` undeclared, `WebGL: INVALID_OPERATION` flood, bloom disabled).
   - Copy terminal session (install -> typecheck -> lint -> build -> start -> Ctrl+C).
9. **Shutdown**
   - `Ctrl+C` the `next start` session; ensure prompt returns.

## Expected instrumentation

| Category            | Expected log(s)                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Renderer caps       | `[dreamdust] caps { vertexInkOk: true, floatOk: true, dprClamp: 1.8, ... }`                         |
| Capability fan-out  | `[dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }`               |
| Geometry hydration  | `[PC] prebaked positions ...`, `[PC] prebaked PCA orientation applied`, `[PC] prebaked present ...`   |
| Instances           | `[PC] instances: 89441`, `[PC] attach controls ...`                                                 |
| Reveal lifecycle    | `[Dreamdust] reveal start { duration: 2 }`, `[Dreamdust] reveal end { duration: 2 }`               |
| Simulation          | `[engine] sim on { count: 89441, texSize: [300,299] }`, `[engine] sim fit { radius: ..., center: ... }` |
| Runtime metrics     | `[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 8.3, p90Ms: 9.1 }`                       |
| Bloom guard         | `[dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }`                |
| Ink instrumentation | `[PC] ink debug { vertexInkOk: true, uViewport: [1370,1022], inkIntensity: 0.75 }`                |
| Ink latency         | `[dreamdust] ink-latency { ms: 5.3, frames: 0.32 }`                                               |
| Sim stats (AK-DD)   | `[dreamdust] sim-stats { coverage: 0.94, variance: 0.08, settleMs: 420 }` (flag if coverage < 0.9 or variance > 0.12) |
| Ink stats (AK-DD)   | `[dreamdust] ink-stats { opacity: 0.72, latencyMs: 5.3, drift: 0.02 }` (flag if opacity < 0.6 or latencyMs > 6) |
| Shader probes       | No compile errors, `vSimProbe` defined once, probe tint visible (desired outcome).                 |

## Observed deviations - 2025-09-25 run

- Vertex shader compile fails under `DEBUG_VTF_SANITY`: duplicate `varying float vSimProbe;`, missing `aSimUv`, mismatched `dreamdustSampleSimPosition` overload (see error block in brief).
- Visual stays near-black with only a single distant orb; expected teal/red probe tint never appears.
- Long stroke produces no telemetry beyond the initial ink debug/latency pair; cascade logs absent.
- DevTools floods `WebGL: INVALID_OPERATION: useProgram: program not valid` until throttled.
- `cover-fit` log absent for this probe run (margin stays at previous defaults).

## Artifacts

- Screenshot: `assets/2025-09-25-probes-smoke.png`
- Browser logs (first batch + full spam): archived in the brief for quick reference.
- Terminal transcript: see Status Update block in `2025-09-25-dreamdust-ink-mask-brief.md`.

## Next validation pass

- After fixing the probe shader issues, rerun this protocol verbatim and replace the screenshot/log captures. Success criteria: probes compile, teal ink expansion visible on short stroke, red VTF tint isolates invalid texels, no `useProgram` spam.
