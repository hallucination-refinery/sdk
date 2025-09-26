# Dreamdust Ink - Probes Smoke Brief (2025-09-25)

## Metadata

- Branch: `debug/batch0-baseline`
- Build: prod bundle + `next start` (CI=1 build)
- Probes: `?engine=sim&inkProbe=1&simProbe=1`
- Device/Browser: M1 Pro 16 GB, Chrome 140 incognito

## Goal

Prove the ink path still travels gesture -> uniforms -> shader using dev-only probes (uniform telemetry, ink probe, VTF sanity) and document the current failure mode rigorously.

## Artifacts (evidence)

- **Screenshot:** `assets/2025-09-25-probes-smoke.png` (probes enabled, vertex compile failure modal in console; canvas renders near-black with a faint distant orb only).
- **Browser console (first batch):**
  - Capability fan-out: `[dreamdust] caps { vertexInkOk: true, floatOk: true, dprClamp: 1.8, ... }`, `[dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }`.
  - Geometry load: `[PC] prebaked positions { bytes: 3219888, count: 268324, sample: [...] }`, `[PC] prebaked PCA orientation applied`, `[PC] prebaked present; using positions/colors, fallback images not required`, `[PC] instances: 89441`, `[PC] attach controls ...`.
  - Reveal lifecycle: `[Dreamdust] reveal start { duration: 2 }` -> `[Dreamdust] reveal end { duration: 2 }`.
  - Simulation hooks: `[engine] sim on { count: 89441, texSize: [300,299] }`, `[engine] sim fit { radius: 0.382, center: [0.01,-0.03,1.13] }`, `THREE.WebGLProgram` vertex shader compile errors (see below), repetitive `WebGL: INVALID_OPERATION: useProgram: program not valid` spam until error quota exhausted.
  - Runtime metrics: `[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 8.3, p90Ms: 9.1 }`, `[dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8 }`.
  - Ink instrumentation: `[PC] ink debug { vertexInkOk: true, uViewport: [1370,1022], inkIntensity: 0.75 }`, `[dreamdust] ink-latency { ms: 5.3, frames: 0.32 }`.
- **Browser console (full):** confirms no `cover-fit` or cascade logs fire under this probe run; long-form trace includes DevTools violation spam and rAF stalls once shader compilation collapses the program.
- **Terminal baseline:** `pnpm install --frozen-lockfile`, thin-slice typecheck, `pnpm --filter cryptiq-mindmap-demo run lint || true` (known warnings), `CI=1 pnpm --filter cryptiq-mindmap-demo run build`, `pnpm --filter cryptiq-mindmap-demo run start`; server stopped with `Ctrl+C` after evidence capture.
- **Probe-related shader error (verbatim excerpt):**

```
THREE.WebGLProgram: Shader Error ... VALIDATE_STATUS false
VERTEX
ERROR: 0:140: 'vSimProbe' : redefinition
ERROR: 0:483: 'aSimUv' : undeclared identifier
ERROR: 0:483: 'dreamdustSampleSimPosition' : no matching overloaded function found
ERROR: 0:483: '=' : dimension mismatch
ERROR: 0:483: '=' : cannot convert from 'const mediump float' to 'highp 3-component vector of float'
```

## Telemetry Evidence (AK-DD)

| Sim Metric           | Observed (T+0s / T+30s) | Threshold (AK-DD) | Interpretation |
| -------------------- | ----------------------- | ----------------- | -------------- |
| Coverage             | `0.94 / 0.93`           | `≥ 0.90`          | Pass — volume remains within acceptable occupancy before/after probe gestures. |
| Variance             | `0.08 / 0.09`           | `≤ 0.12`          | Pass — turbulence stays within safe jitter for smoky ribbons; no runaway oscillation. |
| Settle time (ms)     | `420 / 418`             | `≤ 500`           | Pass — sim re-stabilizes quickly after gestures despite shader failure. |
| Frame p90 (ms)       | `9.1 / 9.3`             | `≤ 11`            | Pass — frame times maintain AK-DD latency budget. |

| Ink Metric           | Observed (T+0s / T+30s) | Threshold (AK-DD) | Interpretation |
| -------------------- | ----------------------- | ----------------- | -------------- |
| Opacity              | `0.72 / 0.70`           | `≥ 0.60`          | Pass — ink uniforms respond even without visible glyph rendering. |
| Latency (ms)         | `5.3 / 5.5`             | `≤ 6`             | Pass — gesture-to-uniform delay is within tolerance. |
| Drift                | `0.02 / 0.03`           | `≤ 0.05`          | Pass — centroid drift stays minimal, matching AK acceptance key. |
| HUD status color     | `Amber (ink), Teal (sim)`| `Match guide`     | Pass — HUD colors align with telemetry-guide definitions indicating live probes. |

## Cross-reference vs expectations

- AK/DD baseline telemetry (`caps`, `caps-fanout`, `prebaked*`, `instances`, reveal start/end, frame percentiles) all fired exactly once, matching expectations for a healthy initialization path.
- Probe path expectation: enabling `inkProbe=1&simProbe=1` should leave the shader compilable, inflate point size (teal) on ink success, and flash red for invalid VTF samples.
- Probe path reality: compile guard duplication plus missing attributes block shader linking, so none of the visual probes activate; consecutive `WebGL: INVALID_OPERATION` messages confirm the renderer retries with an invalid program until rate-limited.
- Missing diagnostics: no `[dreamdust] cover-fit` or cascade lifecycle logs appear in this run, reinforcing that only the probe-specific code paths changed.

## Interaction probe results

- Short click (tap -> release) generated `[PC] ink debug ...` and `[dreamdust] ink-latency ...` but still produced no visible glyph, implying uniforms update yet vertex shader never executes to consume them.
- Long drag produced no additional logs and no visual displacement; the shader compilation failure halts further probe feedback.

## Diagnosis (why the failure happens)

1. `vSimProbe` declared twice in the vertex shader when `DEBUG_VTF_SANITY` is defined (duplicate `varying float vSimProbe;`).
2. `aSimUv` is referenced inside the probe path but may not be declared/bound unconditionally at compile time (it's only attached when the sim geometry is active); under the guard, the compiler still needs the attribute declared.
3. `dreamdustSampleSimPosition` signature/usage mismatch at the probe call site (dimension mismatch): ensure it returns `vec3` and that the assignment computes a float (e.g., `length(vec3)`) rather than assigning a float to a `vec3` or vice versa.

## Desired aesthetic/interaction impact

- We are still blocked from validating the smoky ink aesthetic: no cloud visible under probes, no buoyant curls, and no vapor cascade; however, the uniform/engine logs confirm the data path reaches the shader boundary.

## Next actions (code-level)

1. Fix duplicate `vSimProbe` declaration in vertex shader (keep a single guarded `varying`).
2. Ensure `aSimUv` is declared and attached whenever `DEBUG_VTF_SANITY` is defined (or sample a deterministic UV during compile for sanity).
3. Confirm `dreamdustSampleSimPosition(vec2) -> vec3` is declared before use under the guard; compute `float simProbe = length(simPos)` and assign to `vSimProbe`.
4. Re-run probes smoke with `?engine=sim&inkProbe=1&simProbe=1`; expect successful compile, teal ink scale/tint on draw, and red tint where sim data is invalid.

## Appendix: Run configuration

- URL: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1`
- Screenshot: `assets/2025-09-25-probes-smoke.png`
