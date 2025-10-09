# Dreamdust Ink Interaction Smoke Test — 2025-10-09

## Purpose
Comprehensive test of ink-response interaction system to determine current state and identify blockers.

**Focus:** Does the core interaction loop work? (Tap → ripple, Stroke → cascade)

---

## Test Environment

- **Date/time:** [FILL]
- **Commit:** [FILL - run `git rev-parse --short HEAD`]
- **Browser/GPU:** [FILL]
- **Test route:** `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1` **not** `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-02&debug=1`
- **Scene:** scene-03 (Slim Aarons Palm Spring Woman By The Pool)

---

## Expected Behavior (from Brief)

### Initial Load
- Misty point cloud eases in over 1-3 seconds
- Holds as calm, "breathy" silhouette
- Ethereal look: wispy tendrils, feathered edges, luminous dots

### Short Tap/Brief Hold
- **Response time:** 1-2 frames
- **Visual:** Gentle, local buoyant curls and ripples
- **Effect:** Light size/tint nudge
- **Settle:** Returns to held shape in ~1-2 seconds
- **Feel:** "Ink in air," immediate, graceful decay

### Long Stroke
- **Response:** Along path, image diffuses into vapor
- **Motion:** Advects like smoke
- **Cascade:** Triggers cascading recolor
- **Result:** Entire canvas saturates in single hue
- **Meaning:** Final hue maps to brain concept/category

### Input Ergonomics
- Canvas fully owns input while drawing (no camera fight)
- Heatmap overlay aligns under pointer
- Controls re-enable on release

---

## Test 1: Initial Load

### Visual Observations
- [~] Point cloud appears and eases in (1-3s) 
- [X] Cloud is recognizable (Slim Aarons scene - woman, pool, mountains visible)
- [~] Look is ethereal (wispy, not harsh)
- [X] No visual noise or jitter
- [X] Calm "breathy" hold after reveal

**Screenshot:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-09-Test-1-Initial-Load.png`

### Console Logs (Initial Load)
```
Navigated to http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1
161.bff6649e35bffe58.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 0, stageUvCount: 0, simStageUvCount: 0, simKey: null}
161.bff6649e35bffe58.js:83 [PC] prebaked positions {bytes: 2175600, count: 181300, sample: Array(6)}
161.bff6649e35bffe58.js:83 [PC] prebaked AABB {min: Array(3), max: Array(3), extent: Array(3), maxExtent: 2.454334169626236, scale: 407.44247966538614, …}
161.bff6649e35bffe58.js:83 [PC] prebaked PCA orientation applied
161.bff6649e35bffe58.js:83 [PC] Quaternion roll neutralized for level horizon
161.bff6649e35bffe58.js:83 [PC] prebaked present; using positions/colors, fallback images not required
161.bff6649e35bffe58.js:83 [PC] instances: 90650
161.bff6649e35bffe58.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 90650, stageUvCount: 181300, simStageUvCount: 0, simKey: null}
page-9515b7e021abcd09.js:1 [dreamdust] caps {vertexInkOk: true, floatOk: true, aliasedPointSizeRange: Array(2), dpr: 2, dprClamp: 1.8, …}
page-9515b7e021abcd09.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
161.bff6649e35bffe58.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.bff6649e35bffe58.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 1: {expected: {…}, actual: {…}}
overrideMethod @ hook.js:608
(anonymous) @ 161.bff6649e35bffe58.js:83
eU @ 378-5961cd1ca460479a.js:1
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eY @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
r @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
tC @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
tq @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
(anonymous) @ 97c4d9bb-ba25738685b10510.js:1
lk @ 97c4d9bb-ba25738685b10510.js:1
la @ 97c4d9bb-ba25738685b10510.js:1
ll @ 97c4d9bb-ba25738685b10510.js:1
Z @ 97c4d9bb-ba25738685b10510.js:1
_ @ 378-5961cd1ca460479a.js:1
page-9515b7e021abcd09.js:1 [dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
161.bff6649e35bffe58.js:83 [Dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
161.bff6649e35bffe58.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" __spector_context_type=​"webgl2" width=​"3110" height=​"1944" style=​"display:​ block;​ width:​ 1728px;​ height:​ 1080px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
161.bff6649e35bffe58.js:83 [DEBUG] Camera position check:
161.bff6649e35bffe58.js:83   Expected: (3) [-65.737, 103.054, -681.379]
161.bff6649e35bffe58.js:83   Actual: (3) [-65.737, 103.054, -681.379]
161.bff6649e35bffe58.js:83   Match: true
161.bff6649e35bffe58.js:83 [PC] Preset applied (initial): {position: Array(3), target: Array(3), actualPosition: Array(3), actualTarget: null}
161.bff6649e35bffe58.js:83 [Dreamdust] reveal start {duration: 2}
161.bff6649e35bffe58.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'current' }
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 4: {expected: {…}, actual: {…}}
overrideMethod @ hook.js:608
(anonymous) @ 161.bff6649e35bffe58.js:83
eU @ 378-5961cd1ca460479a.js:1
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eY @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
r @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
tC @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
tq @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
(anonymous) @ 97c4d9bb-ba25738685b10510.js:1
lk @ 97c4d9bb-ba25738685b10510.js:1
la @ 97c4d9bb-ba25738685b10510.js:1
ll @ 97c4d9bb-ba25738685b10510.js:1
Z @ 97c4d9bb-ba25738685b10510.js:1
_ @ 378-5961cd1ca460479a.js:1
page-9515b7e021abcd09.js:1 [dreamdust] frame-percentiles {sampleCount: 240, p50Ms: 8.3, p90Ms: 16.3}
161.bff6649e35bffe58.js:83 [Dreamdust] reveal end {duration: 2}
```

#### Objects
**[dreamdust] caps:**
```json
{
    "vertexInkOk": true,
    "floatOk": true,
    "aliasedPointSizeRange": [
        1,
        511
    ],
    "dpr": 2,
    "dprClamp": 1.8,
    "dprLimit": 1.8
}
```

---

**[Dreamdust] reveal start/end:**
```json
{
    "duration": 2
}
{
    "duration": 2
}
```

---

**[dreamdust] frame-percentiles { p50Ms: ?, p90Ms: ? }:**
```json
{
    "sampleCount": 240,
    "p50Ms": 8.3,
    "p90Ms": 16.3
}
```

### Key Metrics Captured
- [X] `[dreamdust] caps { vertexInkOk: true, floatOk: true, aliasedPointSizeRange: [1, 511], dpr: 2, dprClamp: 1.8, dprLimit: 1.8 }`
- [X] `[PC] instances: 90650`
- [X] `[Dreamdust] reveal start/end { duration: 2 }`
- [X] `[dreamdust] frame-percentiles { p50Ms: 8.3, p90Ms: 16.3 }`
- [X] No shader/compile errors

### Initial Load: Pass/Fail
- **Status:** PARTIAL
- **Notes:** 
    - The Point cloud mostly appears and eases in (1-3s) as intended, *but* there's a like a sudden abrupt (don't know how to describe it) clip in or flicker or brightness, particularly of the more distant parts of point cloud.
    - I **don't** want there to be the countdown and countdown overlay anymore. We should get rid of it.
    - Other than that it looks *acceptable*.

---

## Test 2: Short Tap Interaction

### Procedure
1. Clear console (`console.clear()`) + keep prod. server running + empty cache and hard reload in browser
2. Wait for scene to stabilize (3-5 seconds after reveal)
3. Single short tap (~100-200ms) on center of point cloud
4. Observe for 3 seconds

### Expected Visual Response
- Immediate (1-2 frame) local response at tap point
- Gentle ripple/curl effect spreading from tap
- Light size or tint change
- Graceful settle back to baseline in ~1-2 seconds

### Observed Visual Response
- **Did anything happen visibly?** NO
- **Response time:** NOTHING
- **Visual effect:** N/A
- **Settle behavior:** N/A

**Screenshot (immediately after tap):** [There's **no** point it looks *exactly the same as: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-09-Test-1-Initial-Load.png` ]

### Full Console Logs (Test 2)
```
161.bff6649e35bffe58.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 0, stageUvCount: 0, simStageUvCount: 0, simKey: null}
161.bff6649e35bffe58.js:83 [PC] prebaked positions {bytes: 2175600, count: 181300, sample: Array(6)}
161.bff6649e35bffe58.js:83 [PC] prebaked AABB {min: Array(3), max: Array(3), extent: Array(3), maxExtent: 2.454334169626236, scale: 407.44247966538614, …}
161.bff6649e35bffe58.js:83 [PC] prebaked PCA orientation applied
161.bff6649e35bffe58.js:83 [PC] Quaternion roll neutralized for level horizon
161.bff6649e35bffe58.js:83 [PC] prebaked present; using positions/colors, fallback images not required
161.bff6649e35bffe58.js:83 [PC] instances: 90650
161.bff6649e35bffe58.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 90650, stageUvCount: 181300, simStageUvCount: 0, simKey: null}
page-9515b7e021abcd09.js:1 [dreamdust] caps {vertexInkOk: true, floatOk: true, aliasedPointSizeRange: Array(2), dpr: 2, dprClamp: 1.8, …}
page-9515b7e021abcd09.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
161.bff6649e35bffe58.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.bff6649e35bffe58.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 1: {expected: {…}, actual: {…}}
overrideMethod @ hook.js:608
(anonymous) @ 161.bff6649e35bffe58.js:83
eU @ 378-5961cd1ca460479a.js:1
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eY @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
r @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
tC @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
tq @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
(anonymous) @ 97c4d9bb-ba25738685b10510.js:1
lk @ 97c4d9bb-ba25738685b10510.js:1
la @ 97c4d9bb-ba25738685b10510.js:1
ll @ 97c4d9bb-ba25738685b10510.js:1
Z @ 97c4d9bb-ba25738685b10510.js:1
_ @ 378-5961cd1ca460479a.js:1
page-9515b7e021abcd09.js:1 [dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
161.bff6649e35bffe58.js:83 [Dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
161.bff6649e35bffe58.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" __spector_context_type=​"webgl2" width=​"3110" height=​"1944" style=​"display:​ block;​ width:​ 1728px;​ height:​ 1080px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
161.bff6649e35bffe58.js:83 [DEBUG] Camera position check:
161.bff6649e35bffe58.js:83   Expected: (3) [-65.737, 103.054, -681.379]
161.bff6649e35bffe58.js:83   Actual: (3) [-65.737, 103.054, -681.379]
161.bff6649e35bffe58.js:83   Match: true
161.bff6649e35bffe58.js:83 [PC] Preset applied (initial): {position: Array(3), target: Array(3), actualPosition: Array(3), actualTarget: null}
161.bff6649e35bffe58.js:83 [Dreamdust] reveal start {duration: 2}
161.bff6649e35bffe58.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'current' }
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 4: {expected: {…}, actual: {…}}
overrideMethod @ hook.js:608
(anonymous) @ 161.bff6649e35bffe58.js:83
eU @ 378-5961cd1ca460479a.js:1
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eY @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
r @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
tC @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
tq @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
(anonymous) @ 97c4d9bb-ba25738685b10510.js:1
lk @ 97c4d9bb-ba25738685b10510.js:1
la @ 97c4d9bb-ba25738685b10510.js:1
ll @ 97c4d9bb-ba25738685b10510.js:1
Z @ 97c4d9bb-ba25738685b10510.js:1
_ @ 378-5961cd1ca460479a.js:1
page-9515b7e021abcd09.js:1 [dreamdust] frame-percentiles {sampleCount: 240, p50Ms: 8.1, p90Ms: 13.8}
161.bff6649e35bffe58.js:83 [Dreamdust] reveal end {duration: 2}
161.bff6649e35bffe58.js:83 [PC] ink debug {vertexInkOk: true, uViewport: Array(2), inkIntensity: 0.75}
page-9515b7e021abcd09.js:1 [dreamdust] ink-latency {ms: 5.8, frames: 0.35}
```

### Objects
**[dreamdust] ink-latency:**
```json
{
    "ms": 5.8,
    "frames": 0.35
}
```
**[dreamdust] ink-tex bind:**
```json
{
    "width": 256,
    "height": 256,
    "needsUpdate": false
}
{
    "width": 256,
    "height": 256,
    "needsUpdate": false
}
```
**[dreamdust] caps:**
```json
{
    "vertexInkOk": true,
    "floatOk": true,
    "aliasedPointSizeRange": [
        1,
        511
    ],
    "dpr": 2,
    "dprClamp": 1.8,
    "dprLimit": 1.8
}
```
**[PC] ink debug:**
```
{
    "vertexInkOk": true,
    "uViewport": [
        1728,
        1080
    ],
    "inkIntensity": 0.75
}
```

----


### Expected Console Logs
- [ ] `[PC] draw start` (once, on pen down) - **NOT PRESENT**
- [ ] Orbit disabled - **NOT PRESENT**
- [ ] `[PC] draw end { type: ?, durationMs: ?, distancePx: ? }` - **NOT PRESENT**
- [ ] Orbit re-enabled - **NOT PRESENT**
- [X] `[dreamdust] ink-latency { ms: 5.8, frames: 0.35 }` - **PRESENT** (but unclear what triggered it)

### Ink Texture Binding
- [X] `[dreamdust] ink-tex bind { width: 256, height: 256, needsUpdate: false }` - **PRESENT**
- [X] `[PC] ink debug { vertexInkOk: true, uViewport: [1728, 1080], inkIntensity: 0.75 }` - **PRESENT**
- [?] Texture bound correctly but NO evidence of user input captured

### Short Tap: Pass/Fail
- **Status:** FAIL
- **Notes:** No visual response. Critical: `[PC] draw start/end` logs completely missing - indicates input events not firing.

---

## Test 3: Long Stroke Interaction

### Procedure
1. Clear console (`console.clear()`) + keep prod. server running + empty cache and hard reload in browser
2. Draw a continuous stroke across the canvas (3-5 seconds duration)
3. Observe cascade effect
4. Wait for cascade to complete

### Expected Visual Response
- Along stroke path: diffusion into vapor
- Smoke-like advection
- Cascading recolor spreading from stroke
- Final state: entire canvas saturated in single hue
- Immediate 1-2 frame response as stroke begins

### Observed Visual Response
- **Did anything happen visibly?** NO
- **Vapor diffusion along path?** NO
- **Cascade/recolor spreading?** NO
- **Final saturation achieved?** NO
- **What color was final hue?** NOTHING FUCKING CHANGES IT LOOKS **EXACTLY** THE FUCKING SAME.

**Screenshot (at cascade completion):** [There's **no** point it looks *exactly the same as: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-09-Test-1-Initial-Load.png` ]

### Full Console Logs (Test 3)
```
161.bff6649e35bffe58.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 0, stageUvCount: 0, simStageUvCount: 0, simKey: null}
161.bff6649e35bffe58.js:83 [PC] prebaked positions {bytes: 2175600, count: 181300, sample: Array(6)}
161.bff6649e35bffe58.js:83 [PC] prebaked AABB {min: Array(3), max: Array(3), extent: Array(3), maxExtent: 2.454334169626236, scale: 407.44247966538614, …}
161.bff6649e35bffe58.js:83 [PC] prebaked PCA orientation applied
161.bff6649e35bffe58.js:83 [PC] Quaternion roll neutralized for level horizon
161.bff6649e35bffe58.js:83 [PC] prebaked present; using positions/colors, fallback images not required
161.bff6649e35bffe58.js:83 [PC] instances: 90650
161.bff6649e35bffe58.js:83 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 90650, stageUvCount: 181300, simStageUvCount: 0, simKey: null}
page-9515b7e021abcd09.js:1 [dreamdust] caps {vertexInkOk: true, floatOk: true, aliasedPointSizeRange: Array(2), dpr: 2, dprClamp: 1.8, …}
page-9515b7e021abcd09.js:1 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
161.bff6649e35bffe58.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.bff6649e35bffe58.js:83 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 1: {expected: {…}, actual: {…}}
overrideMethod @ hook.js:608
(anonymous) @ 161.bff6649e35bffe58.js:83
eU @ 378-5961cd1ca460479a.js:1
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eY @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
r @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
tC @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
tq @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
(anonymous) @ 97c4d9bb-ba25738685b10510.js:1
lk @ 97c4d9bb-ba25738685b10510.js:1
la @ 97c4d9bb-ba25738685b10510.js:1
ll @ 97c4d9bb-ba25738685b10510.js:1
Z @ 97c4d9bb-ba25738685b10510.js:1
_ @ 378-5961cd1ca460479a.js:1
page-9515b7e021abcd09.js:1 [dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
161.bff6649e35bffe58.js:83 [Dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
161.bff6649e35bffe58.js:83 [PC] attach controls to <canvas data-engine=​"three.js r176" __spector_context_type=​"webgl2" width=​"3110" height=​"1944" style=​"display:​ block;​ width:​ 1728px;​ height:​ 1080px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
161.bff6649e35bffe58.js:83 [DEBUG] Camera position check:
161.bff6649e35bffe58.js:83   Expected: (3) [-65.737, 103.054, -681.379]
161.bff6649e35bffe58.js:83   Actual: (3) [-65.737, 103.054, -681.379]
161.bff6649e35bffe58.js:83   Match: true
161.bff6649e35bffe58.js:83 [PC] Preset applied (initial): {position: Array(3), target: Array(3), actualPosition: Array(3), actualTarget: null}
161.bff6649e35bffe58.js:83 [Dreamdust] reveal start {duration: 2}
161.bff6649e35bffe58.js:83 [dreamdust] bloom { enabled: false, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'current' }
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 4: {expected: {…}, actual: {…}}
overrideMethod @ hook.js:608
(anonymous) @ 161.bff6649e35bffe58.js:83
eU @ 378-5961cd1ca460479a.js:1
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eV @ 378-5961cd1ca460479a.js:1
requestAnimationFrame
eY @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
r @ 378-5961cd1ca460479a.js:1
(anonymous) @ 378-5961cd1ca460479a.js:1
tC @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
tq @ 97c4d9bb-ba25738685b10510.js:1
tj @ 97c4d9bb-ba25738685b10510.js:1
(anonymous) @ 97c4d9bb-ba25738685b10510.js:1
lk @ 97c4d9bb-ba25738685b10510.js:1
la @ 97c4d9bb-ba25738685b10510.js:1
ll @ 97c4d9bb-ba25738685b10510.js:1
Z @ 97c4d9bb-ba25738685b10510.js:1
_ @ 378-5961cd1ca460479a.js:1
page-9515b7e021abcd09.js:1 [dreamdust] frame-percentiles {sampleCount: 240, p50Ms: 8.3, p90Ms: 13.8}
161.bff6649e35bffe58.js:83 [Dreamdust] reveal end {duration: 2}
161.bff6649e35bffe58.js:83 [PC] ink debug {vertexInkOk: true, uViewport: Array(2), inkIntensity: 0.75}
page-9515b7e021abcd09.js:1 [dreamdust] ink-latency {ms: 4.2, frames: 0.25}
```

### Objects
**I'm not** fucking going through and copying every fucking object again, look at the console log above and if you can't see the object cause it's not expanded **explicitly** acknowledge that, take it into account and do your best.

### Expected Console Logs
- [ ] `[PC] draw start` (once) - **NOT PRESENT**
- [ ] Multiple draw events during stroke - **NOT PRESENT**
- [ ] `[PC] draw end { type: 'stroke', durationMs: ?, distancePx: ? }` - **NOT PRESENT**
- [ ] Cascade-related logs - **NOT PRESENT**
- [ ] Color change logs - **NOT PRESENT**
- [X] `[dreamdust] ink-latency { ms: 4.2, frames: 0.25 }` - **PRESENT** (but unclear what triggered it)

### Long Stroke: Pass/Fail
- **Status:** FAIL
- **Notes:** Same as Test 2 - no draw start/end events, no visual response, no cascade. Input capture completely broken.

---

## Test 4: Performance & Stability

### Frame Rate
- **Initial load FPS:** ~45-70 
- **Idle (no interaction) FPS:** 55-100
- **During tap/stroke FPS:** 55-100 (though nothing fucking happens so who gives a shit)
- **Target:** Smooth 60 FPS throughout

#### PRESET DRIFTED WARNING IDK WHAT THIS MEANS
```
161.bff6649e35bffe58.js:83 [PC] Preset drifted at frame 4: 
{expected: {…}, actual: {…}}
actual
: 
{position: Array(3), target: Array(3)}
expected
: 
{position: Array(3), target: Array(3)}
[[Prototype]]
: 
Object


```

### Stability
- [X] No WebGL errors
- [X] No shader compilation failures
- [X] No duplicate caps/percentiles logs
- [X] No console spam (aside from preset drift warnings which are cosmetic)

### Performance: Pass/Fail
- **Status:** PASS
- **Notes:** Frame rate acceptable (p50: 8.3ms, p90: 16.3ms). "Preset drifted" warnings are cosmetic - camera enforcement component logging when it re-applies preset values.

---

## Overall Assessment

### What's Working
- Point cloud rendering (scene-03 recognizable, correct framing)
- Camera preset enforcement (Iteration 6 position applied correctly)
- Performance (60 FPS, p50: 8.3ms, p90: 16.3ms)
- Ink texture initialization (256×256 texture binds successfully)
- WebGL caps detection (vertexInkOk: true, all systems nominal)

### What's Broken
- **Input capture completely non-functional** - `[PC] draw start/end` logs never fire
- No visual response to taps or strokes
- No cascade behavior on long strokes
- User interaction system appears to be completely disconnected

### Critical Blockers
- **P0: InkSurface pointer events not captured** - No `[PC] draw start/end` logs means input system isn't receiving user taps/strokes. This is the root blocker preventing all interaction.

### Non-Critical Issues
- Reveal animation has abrupt flicker/brightness clip
- Countdown overlay still present (user wants it removed)
- `[dreamdust] ink-latency` logs firing but unclear what triggers them (may be timer-based, not user-input-based)

---

## Next Steps (Recommendations)

**CRITICAL: Must investigate why `[PC] draw start/end` logs are not firing.**

1. **Investigate InkSurface pointer event capture** - Read InkSurface.tsx to understand how pointer events should be captured. Check if component is rendering, if event handlers are bound, if z-index/pointer-events CSS is correct.

2. **Check InkSurface conditional rendering** - My recent change: `{(sceneId === 'scene-03' || !controlsOverride) && <InkSurface ...>}` - verify this evaluates to true for scene-03.

3. **Find where `[dreamdust] ink-latency` is logged** - Trace this log statement to understand what actually triggers it. If it's timer-based (not user-input), it's a red herring. If it IS user-input, then input is being captured somewhere other than expected.

4. **(Secondary) Remove countdown overlay and fix reveal flicker** - Once interaction works, address polish issues.

---

## Raw Notes / Observations

I WANT TO KILL MYSELF

---

## FULL TERMINAL LOG

```
williambarron@Williams-MacBook-Pro refinery-sdk % cd /Users/williambarron/hallucination-refinery/refinery-sdk
williambarron@Williams-MacBook-Pro refinery-sdk % nvm use 22
Now using node v22.13.1 (npm v10.9.2)
williambarron@Williams-MacBook-Pro refinery-sdk % node --version
v22.13.1
williambarron@Williams-MacBook-Pro refinery-sdk % lsof -ti:3000 | xargs kill
williambarron@Williams-MacBook-Pro refinery-sdk % rm -rf apps/cryptiq-mindmap-demo/.next
williambarron@Williams-MacBook-Pro refinery-sdk %  rm -rf .turbo
williambarron@Williams-MacBook-Pro refinery-sdk % rm -rf node_modules
williambarron@Williams-MacBook-Pro refinery-sdk % rm -rf apps/*/node_modules
williambarron@Williams-MacBook-Pro refinery-sdk % rm -rf packages/*/node_modules
williambarron@Williams-MacBook-Pro refinery-sdk % pnpm store prune
Removed all cached metadata files
Removed 41583 files
Removed 848 packages
williambarron@Williams-MacBook-Pro refinery-sdk % pnpm install --frozen-lockfile
Scope: all 19 workspace projects
Lockfile is up to date, resolution step is skipped
Packages: +858
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
Downloading three@0.176.0: 7.60 MB/7.60 MB, done
Downloading hls.js@1.6.6: 5.73 MB/5.73 MB, done
Downloading @img/sharp-libvips-darwin-arm64@1.1.0: 7.49 MB/7.49 MB, done
Downloading @mediapipe/tasks-vision@0.10.17: 6.13 MB/6.13 MB, done
Downloading turbo-darwin-arm64@2.5.4: 12.67 MB/12.67 MB, done
Downloading @img/sharp-libvips-darwin-arm64@1.2.0: 7.53 MB/7.53 MB, done
Downloading @next/swc-darwin-arm64@15.3.2: 42.90 MB/42.90 MB, done
Downloading next@15.3.2: 27.78 MB/27.78 MB, done
Downloading next@15.3.5: 27.79 MB/27.79 MB, done
Downloading @next/swc-darwin-arm64@15.3.5: 42.91 MB/42.91 MB, done
Progress: resolved 858, reused 0, downloaded 848, added 858, done
node_modules/.pnpm/@tailwindcss+oxide@4.1.11/node_modules/@tailwindcss/oxide: Running postinstall script, done in 344ms
node_modules/.pnpm/esbuild@0.21.5/node_modules/esbuild: Running postinstall script, done in 939ms
node_modules/.pnpm/esbuild@0.25.6/node_modules/esbuild: Running postinstall script, done in 1.1s
node_modules/.pnpm/sharp@0.34.3/node_modules/sharp: Running install script, done in 1.7s
node_modules/.pnpm/puppeteer@24.22.3_typescript@5.8.3/node_modules/puppeteer: Running postinstall script, done in 531ms
node_modules/.pnpm/unrs-resolver@1.11.0/node_modules/unrs-resolver: Running postinstall script, done in 434ms
node_modules/.pnpm/sharp@0.34.2/node_modules/sharp: Running install script, done in 1.1s

dependencies:
+ @react-three/drei 10.4.4
+ @react-three/fiber 9.1.4
+ three 0.176.0
+ zustand 5.0.6

devDependencies:
+ @playwright/test 1.55.0
+ @testing-library/jest-dom 6.6.3
+ @testing-library/react 16.3.0
+ @types/node 20.19.4
+ @typescript-eslint/eslint-plugin 8.35.1
+ @typescript-eslint/parser 8.35.1
+ @vitest/coverage-v8 2.1.9
+ @vitest/ui 2.1.9
+ clsx 2.1.1
+ eslint 9.30.1
+ husky 9.1.7
+ immer 10.1.1
+ lint-staged 15.5.2
+ playwright 1.55.0
+ prettier 3.6.2
+ puppeteer 24.22.3
+ sharp 0.34.3
+ tailwind-merge 3.3.1
+ tsx 4.20.3
+ turbo 2.5.4
+ typedoc 0.25.13
+ typedoc-plugin-markdown 3.17.1
+ typescript 5.8.3
+ typescript-eslint 8.35.1
+ vitest 2.1.9

. prepare$ husky install
│ husky - install command is DEPRECATED
└─ Done in 304ms
Done in 59.5s
williambarron@Williams-MacBook-Pro refinery-sdk % pnpm --filter cryptiq-mindmap-demo run build

> cryptiq-mindmap-demo@0.1.0 build /Users/williambarron/hallucination-refinery/refinery-sdk/apps/cryptiq-mindmap-demo
> next build

   ▲ Next.js 15.3.5
   - Environments: .env.local

   Creating an optimized production build ...
 ✓ Compiled successfully in 9.0s
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
   - Network:      http://10.248.60.15:3000

 ✓ Starting...
 ✓ Ready in 317ms
^C%                                                                                                                                                                            
williambarron@Williams-MacBook-Pro refinery-sdk % pnpm --filter cryptiq-mindmap-demo run start

> cryptiq-mindmap-demo@0.1.0 start /Users/williambarron/hallucination-refinery/refinery-sdk/apps/cryptiq-mindmap-demo
> next start

   ▲ Next.js 15.3.5
   - Local:        http://localhost:3000
   - Network:      http://10.248.60.15:3000

 ✓ Starting...
 ✓ Ready in 358ms

```

---

