# Dreamdust GPGPU Pipeline - 2025-09-25 Probe Audit

## Purpose

Extend the 2025-09-24 pipeline audit with the new probe-focused instrumentation (uniform telemetry, ink probe, VTF sanity probe) and capture why the probe run currently collapses the renderer on `debug/batch0-baseline`.

## Fresh instrumentation snapshot

- **Uniform telemetry fan-out.** `PointCloudStage` now logs `[dreamdust] caps` and `[dreamdust] caps-fanout` once the renderer boots, confirming vertex ink capability, float texture support, DPR clamp, and per-subsystem readiness.
- **Probe toggles exposed.** `makeDreamdustMaterial` enables `DEBUG_INK_PROBE` and `DEBUG_VTF_SANITY` when `opts.debugInkProbe` / `opts.debugSimProbe` are true, wiring them into both the initial shader defines and the `onBeforeCompile` hook so R3F rebuilds inherit the flags (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:560`).
- **Ink probe goal.** With `?inkProbe=1` the vertex shader should inflate point size, apply teal tint, and confirm `uVertexInkOk` propagation - observed via `[PC] ink debug ...` and `[dreamdust] ink-latency ...` logs.
- **VTF sanity probe goal.** With `?simProbe=1` we expect `dreamdustSampleSimPosition` to feed `vSimProbe`, rendering red highlights wherever the sim texture returns NaN/Inf/zero-length vectors, validating the VTF path end-to-end.

## Console evidence (2025-09-25)

- Caps pass: `[dreamdust] caps { vertexInkOk: true, floatOk: true, ... }`, `[dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }` fire immediately, proving the telemetry plumbing works.
- Geometry loads successfully: `[PC] prebaked positions ...`, `PCA orientation applied`, `prebaked present; using positions/colors`, `[PC] instances: 89441`, `[PC] attach controls ...`.
- Simulation initializes: `[engine] sim on { count: 89441, texSize: [300,299] }`, `[engine] sim fit { radius: 0.382, center: [0.01,-0.03,1.13] }`.
- Runtime metrics remain healthy (p50 ~ 8.3 ms, p90 ~ 9.1 ms) until the shader fails; bloom guard toggles off due to probes (`[dreamdust] bloom { enabled: false, ... }`).
- Interaction telemetry still fires (`[PC] ink debug ...`, `[dreamdust] ink-latency ...`) even though the canvas never shows probe visuals.

## Failure focus - shader instrumentation

1. **Duplicate varying.** Within `DreamdustMaterial.ts` the vertex shader defines `varying float vSimProbe;` twice when `DEBUG_VTF_SANITY` is active (`apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:227` and `:230`), leading to `ERROR: ... 'vSimProbe' : redefinition`.
2. **Missing attribute guard.** The debug block references `aSimUv` without ensuring the attribute exists in all compile paths; when the renderer recompiles with probes active it throws `ERROR: ... 'aSimUv' : undeclared identifier` before linking completes.
3. **Type mismatch.** The probe assigns directly to `vSimProbe` using `dreamdustSampleSimPosition` but the helper returns a `vec3`; assigning the vector to the float varying triggers the chain of `no matching overloaded function` and `dimension mismatch` errors recorded in the browser log.
4. **Knock-on effects.** Because the vertex shader never compiles, the renderer spams `WebGL: INVALID_OPERATION: useProgram: program not valid` until the error budget is exhausted, leaving only a single faint orb rendered from residual buffer state.

## Impact on pipeline validation

- VTF sanity cannot run, so we still do not know whether the sim texture contains valid positions; the probe fails before sampling occurs.
- Ink probe cannot visualize point inflation, but the `[PC] ink debug` log proves uniforms propagate up to the shader boundary.
- Without probe visuals, we remain blind to whether the sim output or shader consumption causes the near-black render observed in the plain `?engine=sim` smoke (`assets/2025-09-25-sim-smoke.png`).

## Corrective actions

1. Collapse the duplicate `varying` into a single definition guarded by `#ifdef DEBUG_VTF_SANITY`.
2. Ensure the vertex shader path conditionally declares/binds `aSimUv` (or injects a safe fallback UV) whenever `DEBUG_VTF_SANITY` is defined.
3. Adjust the probe to compute `float simProbe = length(dreamdustSampleSimPosition(simUv));` (or similar) before assigning to `vSimProbe`.
4. Retest with `?engine=sim&inkProbe=1&simProbe=1`; expect teal ink scaling, red VTF highlights, and complete removal of the `useProgram` spam.
5. Once probes compile, compare probe output against `assets/2025-09-25-probes-smoke.png` to confirm we have replaced the failure-state screenshot.

## Related references

- Runtime setup: `apps/cryptiq-mindmap-demo/app/components/dreamdust/PointCloudStage.tsx` (caps logging, probe toggles, sim driver wiring).
- Shader defines: `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` (probe guards, uniform aliasing).
- Probe run evidence: `2025-09-25-dreamdust-ink-mask-brief.md` and `2025-09-25-test-protocol.md`.

## 2025-09-28 Findings

- **Healthy instrumentation.** Uniform telemetry still reports `vertexInkOk: true`, `floatOk: true`, and full fan-out coverage during the latest probe smoke, confirming uniforms reach the shader boundary.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L266-L286】 Sim metrics remain finite (max ≈1.55, no NaN/Inf) both immediately after taps and deep into the run, so the simulation texture continues to stream valid data.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L360-L405】
- **Suspect stages.** The engine logs that prebaked positions load and 89 441 instances bind, yet the scene collapses to a single speck after countdown, keeping the vertex position stage under suspicion.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L423-L439】 Gestures still emit ink debug payloads without any on-canvas tint, pointing to fragment alpha/tint writes as the other failing stage.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L338-L348】【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L427-L429】
- **Observed symptoms.** The renderer effectively stays blank (latest run ends with a lone speck; prior smoke documented a fully blank canvas and missing probe visuals), frame `p90` now hovers around 60 ms, and no teal/red probe tint appears despite ink telemetry firing.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L330-L335】【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-smoke-raw.md†L423-L429】【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-26-probes-smoke-raw.md†L573-L577】
- **Vertex telemetry still silent.** The dedicated `vertexLog=1` capture returned an empty sample array, so the shader instrumentation path is still not harvesting `gl_Position`—the collector stays idle even though `[PC]` and `[sim]` metrics mirror the collapse signature.【F:docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-28-vertex-log-raw.md†L37-L127】 A Chrome perf trace taken immediately afterward (`perf-traces/2025-09-26-2330-vertex-log-baseline.json`) shows sustained rAF overruns during settle-only playback, implying the logger or render loop is choking before gestures can fire.
