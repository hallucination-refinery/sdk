# Draw-to-3D Consolidated Info Brief

# Draw-to-3D External Review Brief

> Purpose: Validate implementation against external docs and the **Draw-to-3D Brief**. Output ≤200 lines. Cite all non-obvious claims. Use confidence ranges.

---

## 0) Summary Verdict

- **Overall status:** PARTIAL
- **Top gaps blocking ship:** instances==0 on reveal; missing min-count+fallback for stroke cloud; WebGL context loss on Clear.
- **Readiness to integrate into Cryptiq Mindmap:** No — visibility and context robustness not guaranteed yet.
- **Confidence:** 75% with 90% CI for key timings: idle 3000–3050 ms, infer 40–60 ms. [S1]
- **Primary evidence:** [C1], [C8], [S1] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext?utm_source=chatgpt.com) [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/api/canvas)

---

## 1) Scope, Inputs, and Method

- **Internal spec:** Draw-to-3D Replication Brief, version/hash: latest text provided.
- **External sources reviewed:** [C1]–[C14].
- **Artifacts:** Latest Smoke Test Results → [S1]; code paths `AppHost.tsx`, `DoodleCanvas.tsx`, `rasterToCloud.ts`, `MorphFormationView.tsx` per logs.
- **Method:** triage questions → reproduce minimal examples → cross-verify with 2nd source/tool → assign confidence and actions.
- **Citation format:** `[C#] Title — Source, Section, Accessed YYYY-MM-DD (URL)`; `[S#] Internal artifact`.

---

## 2) Findings by Topic (answers, evidence, actions)

### 2.1 MDN Canvas 2D API

| Question                                                                 | Finding                                                                                                                                     | Evidence / Example                                                                           | Citations                                                                                                                                                                                                                           | Risk | Action                                                                           | Confidence |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------- | ---------- |
| Acquire 2D context with `{ willReadFrequently: true }` and when it helps | Use when calling `getImageData` repeatedly; may switch to software path that speeds readbacks; set on first `getContext` call.              | Warning seen in logs; fix: `const ctx = canvas.getContext('2d',{willReadFrequently:true})`.  | [C1] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext?utm_source=chatgpt.com)                                                                                                           | Med  | Create context with the flag in preprocess/ROI path.                             | 0.83       |
| DPR-correct sizing without bbox skew                                     | Set backing size and transform: `canvas.width=cssW*dpr; canvas.height=cssH*dpr; ctx.setTransform(dpr,0,0,dpr,0,0)`. Clamp DPR to curb cost. | Validated approach in HiDPI guidance; `setTransform` ensures drawing space stays CSS pixels. | [C2][C2a]                                                                                                                                                                                                                           | Med  | Keep 2D DPR≤1.5 as spec; verify bbox math after transform.                       | 0.78       |
| Alpha/compositing impacts on "ink" threshold                             | Canvas is premultiplied-alpha; thresholding should check `alpha>0` and luminance; be wary of `globalCompositeOperation`.                    | Threshold example: `alpha>0 && (r+g+b)<T`; avoid blend modes that dilute α.                  | [C3][C3a] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing?utm_source=chatgpt.com) [html.spec.whatwg.org](https://html.spec.whatwg.org/multipage/canvas.html?utm_source=chatgpt.com) | Med  | Lock `globalCompositeOperation='source-over'` while drawing; document T≈160–200. | 0.74       |
| Cropped ROI vs full canvas; stride/grid; ImageData reuse                 | Prefer `getImageData(x,y,w,h)` on bbox and reuse buffers to reduce GC.                                                                      | Reuse `ImageData.data` for scans; stride grid e.g., 4 px.                                    | [C4][C5] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/ImageData?utm_source=chatgpt.com)                                                                                                                          | Low  | Implement pooled `Uint8ClampedArray` and single ROI read per commit.             | 0.82       |
| getImageData perf limits on large canvases                               | getImageData is sync and can stall main thread; size and frequency dominate.                                                                | Seen long timer (161 ms) after readback; schedule away from hot paths.                       | [C5] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas?utm_source=chatgpt.com)                                                                                                  | Med  | Move readback to commit idle; ensure one ROI; willReadFrequently=true.           | 0.8        |

### 2.2 Three.js / React Three Fiber

| Question                                                          | Finding                                                                                                            | Evidence / Example                                                          | Citations                                                                                                                             | Risk | Action                                                                          | Confidence |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------- | ---------- |
| InstancedMesh semantics (count, setMatrixAt, needsUpdate, colors) | Update `mesh.count=n; mesh.setMatrixAt(i,m); mesh.instanceMatrix.needsUpdate=true;` use `instanceColor` if needed. | Standard InstancedMesh API.                                                 | [C6] [Three.js](https://threejs.org/docs/api/en/objects/InstancedMesh.html?utm_source=chatgpt.com)                                    | Low  | Keep one InstancedMesh; update buffers only.                                    | 0.89       |
| Change counts without remounting                                  | You can change `.count` and update matrices; no remount required.                                                  | Persistent mesh with updated instanceMatrix.                                | [C6] [Three.js](https://threejs.org/docs/api/en/objects/InstancedMesh.html?utm_source=chatgpt.com)                                    | Low  | Ensure no component unmounts on Clear/Undo.                                     | 0.86       |
| WebGL context loss handling                                       | Listen to `webglcontextlost/restored`; call `event.preventDefault()` to avoid default teardown; reinit on restore. | Add handlers at renderer DOM element.                                       | [C7] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event?utm_source=chatgpt.com) | High | Add loss handlers; keep Canvas persistent; avoid re-creating renderer on Clear. | 0.84       |
| R3F Canvas lifecycle, DPR, frame loop, gl options                 | `<Canvas dpr={[1,2]} gl={{powerPreference:'high-performance'}}/>`; frameloop `always &#124; demand &#124; never`.  | Defaults include `powerPreference:'high-performance'`; DPR range supported. | [C8] [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/api/canvas)                                                                          | Low  | Keep DPR≤2; frameloop `always` unless measuring.                                | 0.9        |
| Resource management, dispose, GC avoidance                        | Dispose geometries/materials on teardown; avoid per-frame allocations; reuse arrays.                               | `.geometry.dispose()`, `.material.dispose()`.                               | [C9] [Three.js](https://threejs.org/docs/?utm_source=chatgpt.com)                                                                     | Med  | Pool typed arrays; never recreate geometry/materials per frame.                 | 0.82       |
| Safe instance caps mobile/desktop and wiring                      | Perf varies; desktop handles 10k+ instanced spheres; mobile much lower. Cap via env (200 mobile default) as spec.  | three.js instancing performance example demonstrates large counts.          | [C10] [Three.js](https://threejs.org/examples/webgl_instancing_performance.html?utm_source=chatgpt.com)                               | Med  | Keep caps (200/20000). Measure HUD FPS.                                         | 0.7        |

### 2.3 TensorFlow.js / ml5.js DoodleNet

| Question                                  | Finding                                                                                                                           | Evidence / Example                                   | Citations                                                                                                                    | Risk | Action                                                     | Confidence |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---- | ---------------------------------------------------------- | ---------- |
| Accepted inputs and preprocessing         | `ml5.imageClassifier('DoodleNet')` accepts image/video/canvas; 28×28 grayscale typical for QuickDraw; library internally resizes. | Example uses canvas input.                           | [C11] [ml5js.github.io](https://ml5js.github.io/ml5-examples/p5js/ImageClassification/ImageClassification_DoodleNet_Canvas/) | Low  | Keep `make28x28Canvas` grayscale; pass offscreen canvas.   | 0.75       |
| Top-k predictions and interpretation      | `classify(input, k)` returns array of `{label, confidence}`; default top‑N documented.                                            | Getting Started shows results array sorted high→low. | [C12] [docs.ml5js.org](https://docs.ml5js.org/?utm_source=chatgpt.com)                                                       | Low  | Use `k=5`; log top‑k for diagnostics.                      | 0.8        |
| Known TFJS warnings and meaning           | "backend was already registered…", "Platform … already set" benign if multiple bundles register; ensure single TFJS load.         | Community + TFJS threads.                            | [C13] [Google Groups](https://groups.google.com/a/tensorflow.org/g/tfjs/c/Xl93cRvk-KE?utm_source=chatgpt.com)                | Low  | Load ml5 once; suppress duplicate backend registration.    | 0.72       |
| Backend selection/logging; cache; timings | `tf.getBackend()` to log active backend; first-load model fetch dominates; warm runs faster.                                      | Platform/backends guide.                             | [C14] [TensorFlow](https://www.tensorflow.org/js/guide/platform_environment?utm_source=chatgpt.com)                          | Low  | Log backend; cache model via ml5; record load/infer times. | 0.82       |
| Offscreen 28×28 canvas constraints        | Offscreen canvas compatible with ImageData and classify per examples; no blockers.                                                | Canvas example with DoodleNet.                       | [C11] [ml5js.github.io](https://ml5js.github.io/ml5-examples/p5js/ImageClassification/ImageClassification_DoodleNet_Canvas/) | Low  | Keep offscreen path; assert dimensions.                    | 0.7        |

### 2.4 Performance Guidance (R3F/Three/MDN)

| Topic                             | Finding                                                               | Evidence / Example                                                             | Citations                                                                                                                                                           | Action                                          |
| --------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| DPR clamping trade-offs           | Use ≤1.5 for 2D IO, ≤2 for R3F to balance sharpness and cost.         | R3F `dpr={[1,2]}`; HiDPI guidance.                                             | [C8][C2] [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/api/canvas)                                                                                                    | Keep current clamps.                            |
| Event loop and late timers        | Long tasks can delay `setTimeout`; avoid sync readbacks near commits. | "Violation: setTimeout handler took 161 ms" seen post-`getImageData`.          | [C5][S1] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas?utm_source=chatgpt.com)                              | Do single ROI read, after paint, not mid-frame. |
| Memory reuse for instance buffers | Reuse typed arrays for matrices/colors; avoid GC.                     | Dispose docs + pooling patterns.                                               | [C9] [Three.js](https://threejs.org/docs/?utm_source=chatgpt.com)                                                                                                   | Add small array pool util.                      |
| Readback frequency, ROI batching  | One ROI per commit; stride sampling; reuse ImageData.                 | MDN optimization + ImageData.                                                  | [C5][C4] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas?utm_source=chatgpt.com)                              | Implement pooled ROI-scanner.                   |
| Frame budget @200–320 instances   | Expect ≥30 FPS on iPhone‑class device if DPR≤2 and basic materials.   | Instancing perf example suggests ample headroom on desktop; mobile needs caps. | [C10][C8] [Three.js](https://threejs.org/examples/webgl_instancing_performance.html?utm_source=chatgpt.com) [r3f.docs.pmnd.rs](https://r3f.docs.pmnd.rs/api/canvas) | Keep caps; verify HUD FPS.                      |

---

## 3) Spec Conformance Matrix (Draw-to-3D Brief)

| Spec Item                                                     | Expected                                                      | Observed                                             | Status  | Evidence                                                                    | Action                                                                                                                                                                          |
| ------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------- | ------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto-only idle commit after 3000ms                            | One commit                                                    | One commit fired after idle                          | PASS    | [S1] lines showing `[timerScheduled 3000ms] → [timerFired] → [commitFired]` | None                                                                                                                                                                            |
| Transition timings (300ms fade, 200ms hold, ~500ms morph)     | Fade→hold→morph                                               | Fade occurred; morph displayed 0 instances           | PARTIAL | [S1] HUD instances 0                                                        | Fix cloud min-count and fallback                                                                                                                                                |
| Recognition policy (k=5, curated-first; unknown→stroke-cloud) | As spec                                                       | Classify ran; label not logged; unknown path unclear | PARTIAL | [S1] classify timings only                                                  | Log top‑k and normalized label                                                                                                                                                  |
| Instances ≥200 and bbox-fit                                   | ≥200, center‑out                                              | 0 instances shown                                    | FAIL    | [S1] `instances: 0`                                                         | Enforce minCount≥200 and fallback                                                                                                                                               |
| Caps/DPR clamps respected                                     | 2D≤1.5; R3F≤2                                                 | Not verified                                         | PARTIAL | HUD shows FPS only                                                          | Log DPRs; enforce via props                                                                                                                                                     |
| Instrumentation logs present                                  | strokeEnd→timerScheduled→timerFired→commitFired; gateRejected | Present except `gateRejected` and counts             | PARTIAL | [S1]                                                                        | Add cloud/target counts + gates                                                                                                                                                 |
| Context-loss prevention on Clear/Undo                         | No loss                                                       | Context lost on Clear                                | FAIL    | [S1] "THREE.WebGLRenderer: Context Lost."                                   | Add loss handlers; keep canvas persistent [C7] [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost_event?utm_source=chatgpt.com) |

---

## 4) Smoke Test Reconciliation

- **What matched expectations:** Auto-only flow and lazy-load behavior; timings `pre 159–160 ms / load 844–1090 ms / infer 44–46 ms`. [S1]
- **What diverged and why hypothesis:** Instances 0 after morph. Root causes: A) threshold too strict + no min-count (60%); B) ROI too small or mis-scaled with DPR (25%); C) instance buffer not updated or `.needsUpdate` missing (15%).
- **Immediate mitigations:** Lower threshold to ~160–180; stride scan 4px; minCount≥200 with resample/upsample; set `instanceMatrix.needsUpdate=true`.
- **Last-ditch fallback:** ensure ≥200 points via synthetic ring/box when `cloudCount==0`.

---

## 5) Integration Seam and Result Payload

```ts
// Result payload (emit on commit)
type Draw3DResult = {
  label: string // normalized
  confidence: number // 0..1
  topK: Array<{ label: string; confidence: number }>
  strokeSignature: string // deterministic hash
  formation: Float32Array // xyz triplets, normalized −1..1
  fitScale: number // to drawn bbox
  counts: { cloud: number; target: number }
  timings: { pre: number; load: number; infer: number }
}
```

- **Emit when:** after successful classify+formation selection or fallback synthesis.

---

## 6) Risks and Mitigations

| Risk                           | Trigger               | Mitigation                                                                             | Residual Risk |
| ------------------------------ | --------------------- | -------------------------------------------------------------------------------------- | ------------- |
| WebGL context loss on Clear    | rapid lifecycle churn | keep Canvas persistent; handle webglcontextlost with preventDefault; reinit on restore | Med           |
| Sparse cloud from thresholding | light ink             | lower T, stride sampling, minCount≥200, upsample                                       | Low           |
| Mobile perf at high DPR        | hi‑DPR devices        | clamp DPR; cap instances via env                                                       | Low           |

---

## 7) Action Plan

| Action                               | Owner | Due  | Success Metric                  |
| ------------------------------------ | ----- | ---- | ------------------------------- |
| Implement ROI read + buffer reuse    |       | ASAP | getImageData per commit < 20 ms |
| Persistent InstancedMesh update path |       | ASAP | no unmount; no context loss     |
| Log counts (cloud/target) + top‑k    |       | ASAP | logs present in next [S1]       |

---

## 8) Self-Validation Checklist

- Every External Review Request item answered with a citation.
- At least one concrete code example per tricky claim.
- Measured timings reported with 90% CI.
- All PASS/PARTIAL/FAIL statuses map to evidence lines.
- Re‑read brief; attempted to falsify key claims; recorded uncertainties.
- Final re‑run: confirm no context loss; instances ≥200.

---

## 9) Uncertainties and Open Questions

- **Unknowns:** Mobile instance headroom across devices (50–500?) 65% wide; whether ml5 auto-resizes 28×28 internally on all code paths 20–40%; DPR interactions with bbox math 10–20%.
- **Data needed to resolve:** On-device FPS matrix vs instances and DPR; log ml5 input tensor shape; unit test for bbox fit with DPR clamp.

---

## 10) Citations and Artifacts

- [C1] MDN: HTMLCanvasElement.getContext() — willReadFrequently, accessed 2025-09-10 (https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext)
- [C2] web.dev: High DPI Canvas — accessed 2025-09-10 (https://web.dev/articles/canvas-hidpi)
- [C2a] MDN: CanvasRenderingContext2D.setTransform() — accessed 2025-09-10 (https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/setTransform)
- [C3] MDN Tutorial: Compositing and clipping — accessed 2025-09-10 (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Compositing)
- [C3a] HTML Standard: Canvas premultiplied alpha — accessed 2025-09-10 (https://html.spec.whatwg.org/multipage/canvas.html)
- [C4] MDN: ImageData — accessed 2025-09-10 (https://developer.mozilla.org/en-US/docs/Web/API/ImageData)
- [C5] MDN: Optimizing canvas — accessed 2025-09-10 (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
- [C6] three.js docs: InstancedMesh — accessed 2025-09-10 (https://threejs.org/docs/api/en/objects/InstancedMesh.html)
- [C7] MDN: webglcontextlost/webglcontextrestored — accessed 2025-09-10 (https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/webglcontextlost)
- [C8] React Three Fiber docs: Canvas (DPR, gl, frameloop) — accessed 2025-09-10 (https://r3f.docs.pmnd.rs/api/canvas)
- [C9] three.js docs: BufferGeometry.dispose() — accessed 2025-09-10 (https://threejs.org/docs/) (BufferGeometry#dispose)
- [C10] three.js example: webgl_instancing_performance — accessed 2025-09-10 (https://threejs.org/examples/webgl_instancing_performance.html)
- [C11] ml5 examples: DoodleNet Canvas classification — accessed 2025-09-10 (https://ml5js.github.io/ml5-examples/p5js/ImageClassification/ImageClassification_DoodleNet_Canvas/)
- [C12] ml5 docs: Getting Started (results array, top‑N) — accessed 2025-09-10 (https://docs.ml5js.org/)
- [C13] TFJS forum: "backend was already registered" warnings — accessed 2025-09-10 (https://groups.google.com/a/tensorflow.org/g/tfjs/c/Xl93cRvk-KE)
- [C14] TensorFlow.js: Platform and backends (tf.getBackend(), tf.setBackend()) — accessed 2025-09-10 (https://www.tensorflow.org/js/guide/platform_environment)
- [S1] Latest Smoke Test Results (this doc's logs and observations)
