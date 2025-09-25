# Dreamdust Ink — Probes Smoke Brief (2025‑09‑25)

## Metadata

- Branch: `debug/batch0-baseline`
- Probes: `?engine=sim&inkProbe=1&simProbe=1`
- Device/Browser: M1 Pro 16 GB, Chrome 140 incognito

## Goal

Prove the ink path still travels gesture → uniforms → shader using dev-only probes (uniform telemetry, ink probe, VTF sanity) and document the current failure mode rigorously.

## Artifacts (evidence)

- Screenshot: `assets/2025-09-25-probes-smoke.png` (probes enabled; scene fails to render due to shader compile error)
- One-time logs present:
  - `[dreamdust] caps { vertexInkOk: true, floatOk: true, dprClamp: 1.8, … }`
  - `[dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }`
  - `[PC] prebaked positions { bytes: 3219888, count: 268324, sample: […] }`
  - `[PC] instances: 89441`
  - `[Dreamdust] reveal start { duration: 2 }` → `[Dreamdust] reveal end { duration: 2 }`
  - `[engine] sim on { count: 89441, texSize: [300,299] }`
  - `[engine] sim fit { radius: 0.382, center: [0.01,-0.03,1.13] }`
  - `[dreamdust] frame-percentiles { sampleCount: 240, p50Ms: 8.3, p90Ms: 9.1 }`
  - Ink events: `[PC] ink debug { vertexInkOk: true, uViewport: [1370,1022], inkIntensity: 0.75 }`, `[dreamdust] ink-latency { ms: 5.3, frames: 0.32 }`
- Probe-related shader error (verbatim excerpt):

```
THREE.WebGLProgram: Shader Error … VALIDATE_STATUS false
VERTEX
ERROR: 0:140: 'vSimProbe' : redefinition
ERROR: 0:483: 'aSimUv' : undeclared identifier
ERROR: 0:483: 'dreamdustSampleSimPosition' : no matching overloaded function found
ERROR: 0:483: '=' : dimension mismatch
ERROR: 0:483: '=' : cannot convert from 'const mediump float' to 'highp 3-component vector of float'
```

## Cross‑reference vs expectations

- AK/DD logs: caps, instances, reveal start/end, frame‑percentiles all single‑fire as expected.
- Probes behavior (expected): when `inkProbe/simProbe` are on, the shader compiles and tints/expands points (teal for ink; red for sim NaN/Inf/tiny).
- Probes behavior (observed): vertex shader fails to compile, preventing any probe visualization; the canvas remains effectively blank.

## Diagnosis (why the failure happens)

1. `vSimProbe` declared twice in the vertex shader when `DEBUG_VTF_SANITY` is defined (duplicate `varying float vSimProbe;`).
2. `aSimUv` is referenced inside the probe path but may not be declared/bound unconditionally at compile time (it’s only attached when the sim geometry is active); under the guard, the compiler still needs the attribute declared.
3. `dreamdustSampleSimPosition` signature/usage mismatch at the probe call site (dimension mismatch): ensure it returns `vec3` and that the assignment computes a float (e.g., `length(vec3)`) rather than assigning a float to a `vec3` or vice versa.

## Desired aesthetic/interaction impact

- We are still blocked from validating the smoky ink aesthetic: no cloud visible under probes, no buoyant curls, and no vapor cascade; however, the uniform/engine logs confirm the data path reaches the shader boundary.

## Next actions (code‑level)

1. Fix duplicate `vSimProbe` declaration in vertex shader (keep a single guarded `varying`).
2. Ensure `aSimUv` is declared and attached whenever `DEBUG_VTF_SANITY` is defined (or sample a deterministic UV during compile for sanity).
3. Confirm `dreamdustSampleSimPosition(vec2) -> vec3` is declared before use under the guard; compute `float simProbe = length(simPos)` and assign to `vSimProbe`.
4. Re‑run probes smoke with `?engine=sim&inkProbe=1&simProbe=1`; expect successful compile, teal ink scale/tint on draw, and red tint where sim data is invalid.

## Appendix: Run configuration

- URL: `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim&inkProbe=1&simProbe=1`
- Screenshot: `assets/2025-09-25-probes-smoke.png`


