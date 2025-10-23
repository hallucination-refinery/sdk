# 2025-10-12 — Ink Interaction Smoke (Falloff Inactive)

Context
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1`
- Steps: wait for `[Dreamdust] reveal end`, start uniform dump interval, draw multiple strokes, stop interval, copy logs.
- Result: Whole cloud jitter persists; no localized plume; `uTempFalloffOn` stays 0 while `uTempIntensity` rises during stroke.

Terminal Logs (verbatim)
```
williambarron@Williams-MacBook-Pro refinery-sdk % rm -rf apps/cryptiq-mindmap-demo/.next
williambarron@Williams-MacBook-Pro refinery-sdk % pnpm --filter cryptiq-mindmap-demo run build

> cryptiq-mindmap-demo@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-sdk/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 8.0s
   Skipping validation of types
   Skipping linting
 ⚠ Using edge runtime on a page currently disables static generation for that page
 ✓ Collecting page data 
 ✓ Generating static pages (7/7)
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                                 Size  First Load JS    
┌ ○ /                                    3.71 kB         106 kB
├ ○ /_not-found                            143 B         102 kB
├ ƒ /api/brain-acceptance                  143 B         102 kB
├ ƒ /api/og                                143 B         102 kB
├ ○ /brain                                 27 kB         357 kB
├ ○ /debug/caps                          5.38 kB         107 kB
├ ○ /draw3d                              7.83 kB         335 kB
├ ƒ /quiz/[slug]                           32 kB         362 kB
└ ƒ /result/[id]                         2.04 kB         104 kB
+ First Load JS shared by all             102 kB
  ├ chunks/226-98d803d27003ca72.js       46.6 kB
  ├ chunks/8d5daf79-879d5759a0deefd7.js  53.2 kB
  └ other shared chunks (total)          2.22 kB


○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

williambarron@Williams-MacBook-Pro refinery-sdk % pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /Users/williambarron/hallucination-refinery/refinery-sdk/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://10.248.56.148:3000

 ✓ Starting...
 ✓ Ready in 421ms
```

Uniform Dumps During Multi-Stroke (verbatim)
```
window._u = setInterval(() => window.dreamdust.dumpUniforms(), 100);
19
161.feef25581852ff2d.js:83 [dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0, uTempCenter: Array(2), uTempRadius: 0.16, uTempFalloffOn: 0}
... (repeats idle frames)
161.feef25581852ff2d.js:83 [PC] ink-uv guard ok { raw: [0.072, 0.482], clamped: [0.072, 0.518], mirror: { lr: true, ud: true } }
161.feef25581852ff2d.js:83 [PC] draw start
161.feef25581852ff2d.js:83 [PC] pointer down 125.1171875 520.6328125
... (uTempIntensity rises and decays)
161.feef25581852ff2d.js:83 [dreamdust uniforms] {uTempForce: Array(2), uTempIntensity: 0.18476698133680555, uTempCenter: Array(2), uTempRadius: 0.16, uTempFalloffOn: 0}
... (more samples)
161.feef25581852ff2d.js:83 [PC] draw end { type: 'stroke', durationMs: 2401.1, distancePx: 1319.1 }
... (subsequent strokes show the same: uTempIntensity > 0, uTempFalloffOn: 0)
clearInterval(window._u);
```

Full Console Logs (verbatim excerpt)
```
Navigated to http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&falloff=1
161.feef25581852ff2d.js:83 [PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}
161.feef25581852ff2d.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 0, stageUvCount: 0, simStageUvCount: 0, simKey: null}
161.feef25581852ff2d.js:83 [PC] prebaked positions {bytes: 2175600, count: 181300, sample: Array(6)}
161.feef25581852ff2d.js:83 [PC] prebaked AABB {min: Array(3), max: Array(3), extent: Array(3), maxExtent: 2.454334169626236, scale: 407.44247966538614, …}
161.feef25581852ff2d.js:83 [PC] prebaked PCA orientation applied
161.feef25581852ff2d.js:83 [PC] Quaternion roll neutralized for level horizon
161.feef25581852ff2d.js:83 [PC] prebaked present; using positions/colors, fallback images not required
161.feef25581852ff2d.js:83 [PC] instances: 90650
161.feef25581852ff2d.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 90650, stageUvCount: 181300, simStageUvCount: 0, simKey: null}
page-a9bba4e94fc6a9d1.js:1 [dreamdust] caps {vertexInkOk: true, floatOk: true, aliasedPointSizeRange: Array(2), dpr: 2, dprClamp: 1.8, …}
page-a9bba4e94fc6a9d1.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
161.feef25581852ff2d.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.feef25581852ff2d.js:83 [PC] Preset applied (initial): {position: Array(3), target: Array(3), actualPosition: Array(3), actualTarget: null}
161.feef25581852ff2d.js:83 [Dreamdust] reveal start {duration: 2}
161.feef25581852ff2d.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'current' }
161.feef25581852ff2d.js:83 [Dreamdust] reveal end {duration: 2}
... (strokes; see uniform dumps above)
```

Interpretation
- `uTempIntensity` responds to strokes, confirming the temp-force driver is active.
- `uTempFalloffOn` remains 0 across stroke samples, so the localized branch in the vertex shader never runs. Displacement becomes uniform across all vertices → whole-cloud jitter.
- Prebaked path is active (“prebaked present”), so there is no `onMaterialValid` callback; the one-shot effect that tries to set the falloff flag likely ran before the material attached and before the `uTemp*` uniforms were ensured.

Next Verification (no code)
- In DevTools, run `window.dreamdust.ensureFalloff()` during a stroke, then `window.dreamdust.dumpUniforms()`. Expect `uTempFalloffOn: 1` and visible localized motion. If successful, the only blocker is when/where we latch the flag in code.

File References
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:392
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:94
- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1379
- apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:32
- apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:291

