# Deterministic Test Protocol - 2025-09-26

## Route

- Launch: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1&simStats=1&inkStats=1`
- Purpose: validate Dreamdust probes instrumentation on `debug/batch0-baseline`, capture the telemetry overlays/logs required by the AK-DD checkpoint, and document the probe-linked-but-still-blank failure state (2025-09-26).

## Preconditions

- Branch checked out: `debug/batch0-baseline` (commit `c962c318`).
- Workspace cleaned: `rm -rf apps/cryptiq-mindmap-demo/.next`.
- Build provenance logged: `CI=1 pnpm --filter cryptiq-mindmap-demo run build` followed by `pnpm --filter cryptiq-mindmap-demo run start`.
- Screenshot destination prepared: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-09-26-probes-smoke.png`.
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

   - Open DevTools console and copy the **first batch** of logs (caps, caps-fanout, ink-tex bind, prebaked, instances, reveal start/end, sim on, frame-percentiles, `[sim] metrics` burst).
   - Capture a screenshot once the canvas settles (`assets/2025-09-26-probes-smoke.png`) with the HUD overlays visible.

7. **Probe gestures**
   - Short click (tap + release) at viewport center; copy emitted `[PC] ink debug` and `[dreamdust] ink-latency` logs.
   - Long stroke (click + drag ~ 1/2 width); note whether additional logs appear (2025-09-26 produced none).
   - Capture HUD + console metrics at T+0s (immediately after the short tap) and again ~T+30s (after the long stroke).

8. **Collect telemetry + logs**
   - At each cadence mark, copy the `[sim] metrics` and `[dreamdust] ink-latency` / `[PC] ink debug` payloads (expand objects so numeric fields are captured). Flag `p50Ms > 16.7`, `p90Ms > 28`, ink latency > 20 ms, or missing probe visuals.
   - Scroll the console to confirm the absence of shader compile errors; note any `requestAnimationFrame` violation spam.
   - Copy the terminal session (install → typecheck → lint → build → start → Ctrl+C).

9. **Shutdown**
   - `Ctrl+C` the `next start` session; ensure prompt returns.

## Expected instrumentation

| Category             | Expected log(s)                                                                                                                                     | Target / Notes                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Renderer caps        | `[dreamdust] caps { vertexInkOk: true, floatOk: true, dprClamp: 1.8, ... }`                                                                         | Emits once per load; confirms GPU capabilities.                                                                                     |
| Capability fan-out   | `[dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }`                                                                 | Should appear once; verifies fan-out wiring.                                                                                        |
| Geometry hydration   | `[PC] prebaked positions ...`, `[PC] prebaked PCA orientation applied`, `[PC] prebaked present ...`                                                 | Confirms prebaked cloud selected; collect object payloads.                                                                          |
| Instances            | `[PC] instances: 89441`, `[PC] attach controls ...`                                                                                                 | Validate point budget and controls attachment.                                                                                      |
| Reveal lifecycle     | `[Dreamdust] reveal start { duration: 2 }`, `[Dreamdust] reveal end { duration: 2 }`                                                                | Must bracket reveal; missing logs indicate lifecycle regression.                                                                    |
| Simulation           | `[engine] sim on { count: 89441, texSize: [300,299] }`, `[engine] sim fit { radius: ..., center: ... }`                                             | Confirms sim driver active with expected texture size and fit radius.                                                               |
| Runtime metrics      | `[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: <value>, p90Ms: <value> }`                                                                | Target ≤16 ms (p50) / ≤28 ms (p90); flag any regression.                                                                            |
| Bloom guard          | `[dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }`                                                                  | Records state of bloom guard for comparison across runs.                                                                            |
| Simulation telemetry | `[sim] metrics { min: ..., max: ..., avg: ..., nanCount: ..., infCount: ..., grid: ... }` (with `simStats=1`)                                       | `nanCount`/`infCount` must stay 0; plateau at ~0 indicates stalled sim, plateau near 1.55 with trailing zeros signals muted motion. |
| Ink telemetry        | `[PC] ink debug { vertexInkOk: true, uViewport: [...], inkIntensity: ... }`, `[dreamdust] ink-latency { ms: ..., frames: ... }` (with `inkStats=1`) | Target `inkIntensity > 0.5` and `ink-latency ≤ 20 ms`; highlight when intensity hits 0 or latency exceeds budget.                   |
| Shader probes        | No GLSL compile errors, `DEBUG_VTF_SANITY` active, teal/red probe overlays visible in viewport.                                                     | Log absence of visuals even if logs appear; treat as regression.                                                                    |

## Observed deviations - 2025-09-26 run

- Shader compile errors are resolved, but the viewport remains near-black with no teal/red probe feedback.
- Short tap logs show `[dreamdust] ink-latency { ms: 38.6, frames: 2.32 }` and `[PC] ink debug { inkIntensity: 0.75 }`; long drag emits no additional ink logs.
- `[sim] metrics` bursts report `min: 0`, `avg ≈1.02`, `max: 1.55`, yet no particles become visible; dozens of `requestAnimationFrame` violation warnings are recorded.
- `[dreamdust] frame-percentiles` reports p50 ≈39 ms / p90 ≈42 ms, breaching the target budget.
- `[dreamdust] cover-fit` remains absent for this probe configuration.

## Artifacts

- Screenshot: `assets/2025-09-26-probes-smoke.png`
- Browser logs (initial burst + telemetry dumps): archived in `2025-09-26-probes-smoke-raw.md` and summarized in the brief.
- Terminal transcript: see raw capture file.

## Next validation pass

- Apply visibility/latency fixes, then rerun this protocol and replace screenshot/log captures. Success criteria: probes compile (no GLSL errors), teal ink expansion visible on short tap, red VTF tint isolates invalid texels, ink latency ≤ 20 ms.
