# 2025-10-12 — Ink Interaction Smoke (Falloff Forced Interval, Same Session)

Context
- Same session/run as prior 2025-10-12 smoke; no reload in between.
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1`
- Procedure:
  1) Waited for `[Dreamdust] reveal end`.
  2) Started interval: `window._ff=setInterval(()=>{window.dreamdust.ensureFalloff();window.dreamdust.dumpUniforms()},100)`.
  3) Drew multiple strokes.
  4) Stopped interval: `clearInterval(window._ff)`.

Observation
- Zero motion: neither local plume nor global jitter. Cloud stayed completely still despite `uTempFalloffOn: 1` and `uTempIntensity` changing.

Terminal (build/start)
```
... next build/start logs omitted here (identical to earlier same-session build/start) ...
```

Uniform/Console Dumps (verbatim excerpts)
```
[Dreamdust] reveal end {duration: 2}
window._ff=setInterval(()=>{window.dreamdust.ensureFalloff();window.dreamdust.dumpUniforms()},100)
19
161.feef25581852ff2d.js:83 [dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0, uTempCenter: Array(2), uTempRadius: 0.16, uTempFalloffOn: 1}
... (repeats idle frames)
161.feef25581852ff2d.js:83 [PC] ink-uv guard ok { raw: [0.149, 0.305], clamped: [0.149, 0.695], mirror: { lr: true, ud: true } }
161.feef25581852ff2d.js:83 [PC] draw start
161.feef25581852ff2d.js:83 [dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.006786856065330996, uTempCenter: Array(2), uTempRadius: 0.16, uTempFalloffOn: 1}
... (during multiple strokes, uTempIntensity fluctuates; uTempFalloffOn remains 1)
161.feef25581852ff2d.js:83 [PC] draw end { type: 'stroke', durationMs: 1422.7, distancePx: 1160.6 }
... (more strokes)
clearInterval(window._ff)
```

Interpretation
- Forcing falloff ON eliminated prior whole-cloud jitter but did not produce local motion. Given `uTempIntensity>0`, the localized offset branch should have applied; its net effect was zero.
- Likely cause (from shader audit): the falloff influence uses `vInkUv` before `vInkUv` is computed in the vertex shader. With `uTempFalloffOn: 1`, influence ≈ 0 → `tempForce` ≈ 0 → no displacement.

File references
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts: within main(), `influence = smoothstep(uTempRadius, 0.0, distance(vInkUv, uTempCenter))` occurs before `vInkUv` is assigned (screen‑space computed after `clipPos`).

Next check (console-only, optional)
- Temporarily compute a local ss-uv just above the influence line (DevTools shader live-edit) or set a test center near (0.5,0.5) with a large radius; if motion appears, confirms influence gating is the culprit.

