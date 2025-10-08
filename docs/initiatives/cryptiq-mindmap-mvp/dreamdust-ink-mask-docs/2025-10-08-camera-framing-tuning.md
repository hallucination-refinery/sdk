# Camera Framing Tuning — 2025-10-08

## Goal

- **Fill viewport:** Cloud occupies full viewport with minimal/no black space
- **Clear viewing angle:** Slim Aarons scene recognizable, proper perspective

## Scene-03 Specs

- **Image:** 518×350 (1.48:1 aspect ratio)
- **Point cloud extents:** X=937, Y=404, Z=1000 (scaled units)
- **Viewport aspect:** ~1.6:1
- **Challenge:** Wide cloud (2.3:1) vs taller viewport → requires crop or black space

---

## Iteration Log

### Iteration 1 — Baseline Assessment (2025-10-08 1:26 AM)

**Observed:**
- Screenshot: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/Screenshot 2025-10-08 at 1.02.12 AM.png`
- Can see *most* or all of the point cloud in the viewport, though it mostly occupies the top center.
- **Not** occupying the whole viewport
- Camera is maybe 20 to 30 degrees right 
- Tilted 20 to 30 degrees left
- From **I think** a low angle

**Console logs:**
```
[PC] prebaked fit triggered
{
    "count": 181300,
    "radius": 500,
    "center": [
        0.08328014612197876,
        -0.301562175154686,
        1.5202250927686691
    ]
}
[dreamdust] cover-fit 
{
    "mode": "cover",
    "radius": 500,
    "margin": 0.78,
    "distance": 1382.375,
    "fov": 20,
    "aspect": 1.6
}
```

**Current params:**
- FOV: 20°
- Camera distance: 1382.375 units
- Fit radius: 500 units
- Cover margin: 0.78

**Oriented:**

**My analysis:**
- Auto-fit WORKED (radius 500 is correct, not 1.31)
- Camera positioned at ~[0, 0, 1382] looking at target [0.083, -0.302, 1.520]
- This creates oblique viewing angle (camera on Z axis, target offset)
- Distance too far for FOV 20° (vertical FOV ~486 units vs cloud height 404 units)
- Cloud only fills ~60% of viewport height

**Cross-reference with user observations:**
- ✅ User: "occupies top center, not whole viewport" — MATCHES my analysis
- ✅ User: "20-30° right, tilted left, low angle" — MATCHES oblique angle from offset target
- Key insight: User observations confirm the geometric issue

**Root cause:**
Camera positioned relative to origin [0,0,0] instead of relative to cloud center [0.083, -0.302, 1.520]. Should be at [0.083, -0.302, 1.520 + distance] for straight-on view.

**Decided:**
Two fixes needed:
1. Position camera relative to target (straight-on view, not oblique)
2. Reduce distance or increase FOV to fill viewport better

**Action:**
- Modify CameraSync to position camera at [target.x, target.y, target.z + distance] instead of [0, 0, distance]
- May also need to reduce margin (0.78 → 0.9) to bring camera closer

---

### Iteration 2 — [DESCRIPTION] (2025-10-08 1:36 AM)

**Observed:**
- Screenshot: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/Screenshot 2025-10-08 at 1.37.23 AM.png`
- Not much.

**Console logs:**
```
[PC] prebaked fit triggered
{
    "count": 181300,
    "radius": 500,
    "center": [
        0.08328014612197876,
        -0.301562175154686,
        1.5202250927686691
    ]
}
[dreamdust] cover-fit 
{
    "mode": "cover",
    "radius": 500,
    "margin": 0.95,
    "distance": 1683.662,
    "fov": 20,
    "aspect": 1.6
}
```

**Current params:**
- FOV: 20°
- Camera distance: 1683.662 units (was 1382, now FARTHER)
- Fit margin: 0.95 (was 0.78)

**Oriented:**

**Analysis:**
- ✅ **SUCCESS:** Camera now straight-on! No oblique angle (fix #1 worked)
- ❌ **REGRESSION:** Cloud is SMALLER/FARTHER, more black space than iteration 1
- Distance increased 1382 → 1683 (I had margin math backwards!)

**Margin math correction:**
- `paddedRadius = radius * margin`
- Higher margin → larger effective radius → FARTHER camera
- Lower margin → smaller effective radius → CLOSER camera
- I did the OPPOSITE of what was needed

**Decided:**
- Keep camera positioning fix (working perfectly)
- REDUCE margin from 0.95 → 0.6 to bring camera much closer and fill viewport

**Action:**
- Change fitMargin from 0.95 → 0.6 in PointCloudStage.tsx line 2586

---

### Iteration 3 — Margin Correction (2025-10-08 1:58 AM)

**Observed:**
- Screenshot: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/Screenshot 2025-10-08 at 1.57.55 AM.png`
- Angle still off
- **Not** filling viewport

**Console logs:**
```
[PC] prebaked fit triggered
{
    "count": 181300,
    "radius": 500,
    "center": [
        0.08328014612197876,
        -0.301562175154686,
        1.5202250927686691
    ]
}
[dreamdust] cover-fit 
{
    "mode": "cover",
    "radius": 500,
    "margin": 0.6,
    "distance": 1063.365,
    "fov": 20,
    "aspect": 1.6
}
```

**Current params:**
- FOV: 20°
- Camera distance: 1063.365 units
- Fit margin: 0.6

**Oriented:**

**Systematic Cross-Reference Analysis:**

**Iteration 1 vs 2 vs 3 Visual Comparison:**
- **Iter 1 (margin 0.78, dist 1382):** Oblique angle (20-30° off), cloud in top-center, ~25-30% viewport fill
- **Iter 2 (margin 0.95, dist 1683):** STRAIGHT-ON (fix worked!), cloud centered, ~20% viewport fill (farther/smaller)
- **Iter 3 (margin 0.6, dist 1063):** Similar to Iter 2 angle, cloud centered, ~30-35% viewport fill (closer/larger)

**Progress Assessment:**
- ✅ Angle fix PARTIALLY working (much better than Iter 1, but not perfect straight-on)
- ✅ Distance decreasing correctly (1683 → 1063)
- ❌ Still not filling viewport (30-35% vs target 80-90%+)

**Root Cause - Angle Still Off:**
Looking at my code - the `distance` prop isn't passed to CameraSync, so my positioning fix in Effect 1 (lines 2899-2910) **never runs**. Only `applyPerspectiveCover` runs, which calculates direction from current camera position, creating a slight offset angle.

**Root Cause - Viewport Fill:**
Current distance 1063 gives 30-35% fill. To achieve 80-90% fill:
- Need cloud ~2.5-3× larger on screen
- Distance should be ~400-450 units
- Required margin: ~0.22-0.25 (current 0.6 is still too high)

**Decided:**
1. Keep reducing margin: 0.6 → 0.25 for viewport fill
2. Fix angle: Modify applyPerspectiveCover to force straight-on direction [0,0,-1] for prebaked clouds

**Action:**
- Change fitMargin: 0.6 → 0.25 (PointCloudStage.tsx:2586)
- Modify applyPerspectiveCover to force direction [0,0,-1] for straight-on view (camera.ts:201-204)

---

### Iteration 4 — Aggressive Fill + Straight-on Fix (2025-10-08 2:31 AM)

**Observed:**
- Screenshot: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/Screenshot 2025-10-08 at 2.32.24 AM.png`
- More zoomed in, **still** with the wrong angle and **not** covering the entire viewport.

**Console logs:**
```
[PC] prebaked fit triggered 
{
    "count": 181300,
    "radius": 500,
    "center": [
        0.08328014612197876,
        -0.301562175154686,
        1.5202250927686691
    ]
}
[dreamdust] cover-fit 
{
    "mode": "cover",
    "radius": 500,
    "margin": 0.25,
    "distance": 443.069,
    "fov": 20,
    "aspect": 1.6
}
[dreamdust] cover-fit 
{
    "mode": "cover",
    "radius": 500,
    "margin": 0.25,
    "distance": 443.069,
    "fov": 20,
    "aspect": 1.6
}
```

**Current params:**
- FOV: 20°
- Camera distance: 443.466 units
- Fit margin: 0.25

**Oriented:**

**CRITICAL BUG FOUND:**

**Visual Analysis:**
- Cloud is MUCH closer (good progress on fill)
- Scene recognizable (ladies left, pool center, mountains right)
- BUT: Significant black space at bottom (~30-40% of viewport)
- Cloud occupies upper 60-70% only

**Systematic Comparison:**
- **Iter 1:** 25-30% fill, oblique angle
- **Iter 2:** 20% fill, straight-on
- **Iter 3:** 30-35% fill, mostly straight-on
- **Iter 4:** 60-70% fill (better!), BUT vertically misaligned (black space at bottom)

**Root Cause Analysis:**

Examined `cameraFitTarget` calculation (PointCloudStage.tsx:2063-2075):
```typescript
const cameraFitTarget = React.useMemo(() => {
  if (simActive && simBounds) {
    // ... complex calculation for sim mode
    return [center.x, center.y, center.z]
  }
  return [0, 0, 0]  // ← BUG: For prebaked mode, returns ORIGIN instead of cloud center!
}, [...])
```

**The Bug:**
- Cloud geometric center: [0.083, -0.302, 1.520] (raw) → [33.8, -123, 619] (scaled)
- cameraFitTarget (prebaked): [0, 0, 0]
- Camera aims at origin BUT cloud is offset 123 units DOWN in Y
- This creates 30-40% black space at bottom

**Why previous iterations didn't show this as badly:**
- At far distances (1382, 1683), the 123-unit Y offset was proportionally smaller
- At close distance (443), the offset is MUCH more visible

**Decided:**
1. Fix cameraFitTarget to return actual prebaked cloud center instead of [0,0,0]
2. Keep margin at 0.25 (distance/fill is now correct)
3. May need minor FOV adjustment after target fix

**Action:**
- Add prebaked path to cameraFitTarget that uses prebakedTransform.center (PointCloudStage.tsx:2082-2094)
- Expected result: Camera aims at cloud center [33.8, -123, 619] instead of origin [0, 0, 0], eliminating black space

---

### Iteration 5 — Target Center Fix (2025-10-08 [TIME])

**Observed:**
- Screenshot: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/Screenshot 2025-10-08 at 2.43.31 AM.png`
- Literally **most** of the fucking viewport is fucking black, why is it still fucking in the top half? What the fuck I feel like just **fixing** the fucking orbital controls and just having me fucking do it would be fucking easier FUCKKKKK
- Why is the fucking cloud just not in the fucking right fucking place
- Sorry I'm deeply fuc

**Console logs:**
```
PointCloudStage.tsx:2184 [PC] prebaked fit triggered {count: 181300, radius: 500, center: Array(3)}center: (3) [0.08328014612197876, -0.301562175154686, 1.5202250927686691]count: 181300radius: 500[[Prototype]]: Object

PointCloudStage.tsx:2949 [dreamdust] cover-fit {mode: 'cover', radius: 500, margin: 0.25, distance: 443.069, fov: 20, …}aspect: 1.6distance: 443.069fov: 20margin: 0.25mode: "cover"radius: 500[[Prototype]]: Object
PointCloudStage.tsx:2949 [dreamdust] cover-fit {mode: 'cover', radius: 500, margin: 0.25, distance: 443.069, fov: 20, …}

```

**Current params:**
- FOV: 20°
- Camera distance: [VALUE]
- Fit margin: 0.25
- Camera target: [VALUE] (should now be ~[34, -123, 619] instead of [0, 0, 0])

**Oriented:**
- [Analysis/diagnosis]

**Decided:**
- [Next step]

**Action:**
- [Changes made]

---

### Iteration 6 — Controls Override Implementation (2025-10-08 11:18 AM ET)

**Context:**
- Implemented `?controls=1` query param to completely disable draw system
- Removes InkFieldHost overlay and InkSurface component
- Forces OrbitControls always-on (ignore `drawing` state)
- Visual indicator: Orange "CONTROLS OVERRIDE ACTIVE" banner in debug panel
- Commits: 3056a79d, 68539577

**Test URLs:**
- Without override: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&forceAlpha=1`
- With override: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&forceAlpha=1&controls=1`

---

#### Part A: Controls Verification

**Visual Check (with `?controls=1`):**
- Screenshot: [PATH]
- [X] Orange "CONTROLS OVERRIDE ACTIVE" banner visible in debug panel
- [X] NO "Draw: On/Off" button visible (InkFieldHost removed)
- [X] Initial camera framing (auto-fit): See the following screenshot `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-08-iteration-06-part-A-initial-camera-framing.png`

**Controls Test (orbit/pan/zoom):**
- [X] **Orbit (left-click drag):** [smooth/jumpy/broken/not responding]
- [X] **Pan (right-click drag):** [smooth/jumpy/broken/not responding]
- [X]] **Zoom (scroll wheel):** [smooth/jumpy/broken/not responding]
- Overall responsiveness: **All** responsive and working, although I'm having difficulty aligning the point cloud horizontally

**Console logs (initial load):**
```
Navigated to http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&forceAlpha=1&controls=1
PointCloudStage.tsx:1178 [PC] ink debug {vertexInkOk: false, uViewport: Array(2), inkIntensity: 1}
PointCloudStage.tsx:2320 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 0, stageUvCount: 0, simStageUvCount: 0, simKey: null}
PointCloudStage.tsx:1311 [PC] prebaked positions {bytes: 2175600, count: 181300, sample: Array(6)}
PointCloudStage.tsx:1347 [PC] prebaked AABB {min: Array(3), max: Array(3), extent: Array(3), maxExtent: 2.454334169626236, scale: 407.44247966538614, …}
PointCloudStage.tsx:1513 [PC] prebaked PCA orientation applied
PointCloudStage.tsx:1543 [PC] prebaked present; using positions/colors, fallback images not required
PointCloudStage.tsx:1760 [PC] instances: 90650
PointCloudStage.tsx:2241 [PC] prebaked fit triggered {count: 181300, radius: 500, center: Array(3)}
PointCloudStage.tsx:2320 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 90650, stageUvCount: 181300, simStageUvCount: 0, simKey: null}
useDreamdustUniforms.ts:311 [dreamdust] vertex-ink-ok {value: 1}
metrics.ts:130 [dreamdust] caps {vertexInkOk: true, floatOk: true, aliasedPointSizeRange: Array(2), dpr: 2, dprClamp: 1.8, …}
metrics.ts:36 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
PointCloudStage.tsx:3021 [dreamdust] cover-fit {mode: 'cover', radius: 500, margin: 0.78, distance: 1382.375, fov: 20, …}
PointCloudStage.tsx:908 [PC] attach controls to <canvas data-engine=​"three.js r176" __spector_context_type=​"webgl2" width=​"3110" height=​"1944" style=​"display:​ block;​ width:​ 1728px;​ height:​ 1080px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
report-hmr-latency.ts:26 [Fast Refresh] done in NaNms
useDreamdustUniforms.ts:311 [Dreamdust] reveal start {duration: 2}
PointCloudStage.tsx:3021 [dreamdust] cover-fit {mode: 'cover', radius: 500, margin: 0.78, distance: 1382.375, fov: 20, …}
PointCloudStage.tsx:1681 [dreamdust] bloom { enabled: true, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'current' }
index.js:120 Uncaught Error: Invalid argument not valid semver ('' received)
    at validateAndParse (index.js:120:15)
    at esm_compareVersions (index.js:10:16)
    at gte (index.js:249:10)
    at L.registerRendererInterface (agent.js:992:24)
    at registerRendererInterface (index.js:31:11)
    at index.js:70:5
    at Map.forEach (<anonymous>)
    at initBackend (index.js:69:27)
    at activateBackend (backendManager.js:1:13128)
    at backendManager.js:1:14182
    at hook.js:268:34
    at Array.map (<anonymous>)
    at Object.emit (hook.js:268:24)
    at backend.js:33:8
    at backend.js:19:1
    at react_devtools_backend_compact.js:1:50895
    at react_devtools_backend_compact.js:1:50899
validateAndParse @ index.js:120
esm_compareVersions @ index.js:10
gte @ index.js:249
registerRendererInterface @ agent.js:992
registerRendererInterface @ index.js:31
(anonymous) @ index.js:70
initBackend @ index.js:69
activateBackend @ backendManager.js:1
(anonymous) @ backendManager.js:1
(anonymous) @ hook.js:268
emit @ hook.js:268
(anonymous) @ backend.js:33
(anonymous) @ backend.js:19
(anonymous) @ react_devtools_backend_compact.js:1
(anonymous) @ react_devtools_backend_compact.js:1
metrics.ts:130 [dreamdust] frame-percentiles {sampleCount: 240, p50Ms: 8.3, p90Ms: 9.2}
useDreamdustUniforms.ts:311 [Dreamdust] reveal end {duration: 2}
```

**[PC] prebaked fit triggered (initial load):**

```
[PC] prebaked fit triggered
{
    "count": 181300,
    "radius": 500,
    "center": [
        0.08328014612197876,
        -0.301562175154686,
        1.5202250927686691
    ]
}
```

**[dreamdust] cover-fit (initial load):**

```
[dreamdust] cover-fit
{
    "mode": "cover",
    "radius": 500,
    "margin": 0.78,
    "distance": 1382.375,
    "fov": 20,
    "aspect": 1.6
}
```

**Current params (from console logs):**
- FOV: 20°
- Camera distance: 1382.375 units
- Fit margin: 0.78 (restored to original)
- Camera target: [0, 0, 0] (matches group translation)
- Aspect ratio: 1.6
- Mode: cover

---

#### Part B: Manual Camera Positioning

**Goal:** Frame scene-03 so cloud fills viewport with clear view of ladies/pool/mountains

**Positioning workflow:**
1. Started with auto-fit framing: Yes *started* with this framing (`docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-08-iteration-06-part-A-initial-camera-framing.png`)
2. Adjusted camera using controls: Yes, and debug panel; increased FOV to 60 and turned MirrorLR ON.
3. Final framing achieved: **Not** the final frame, but maybe 1-3 iterations away primary issue is *horizontal alignment*. Once we deal with the *horizontal alignment* issue, we can focus on finding the exact zoom to fill the viewport.
4. Screenshot of final framing: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-08-iteration-06.png`

**Camera preset capture:**
- Clicked "Log Camera" button
- Console output:
```json
{"position":[-90.614,137.449,-888.601],"target":[-64.814,145.642,-657.435],"fov":60}
```

**Manual Capture/Notes:**
- Dreamdust preset: `Current (Iteration 04)`
- MirrorLR: `Enabled`
- MirrorUD: `Enabled`

**Preset values to hardcode:**
```typescript
position: [-90.614, 137.449, -888.601]
target: [-64.814, 145.642, -657.435]
fov: 60
```

**Additional settings:**
- MirrorLR: ON
- MirrorUD: ON
- Preset: Current (Iteration 04)

---

#### Part C: Comparison Test (without `?controls=1`) - NOT DONE

**Verify default behavior unchanged:**
- URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&forceAlpha=1`
- [ ] "Draw: On/Off" button present
- [ ] NO "CONTROLS OVERRIDE ACTIVE" banner
- [ ] Draw mode works (can draw on canvas)
- [ ] Controls disabled when Draw is ON
- Screenshot: [PATH]

---

**Oriented:**
- ✅ **Controls work perfectly** - All orbit/pan/zoom responsive and smooth
- ✅ **Camera logging works** - Successfully captured actual position (not [0,0,0])
- ✅ **GPT-5's target fix effective** - OrbitControls orbiting around correct point
- ⚠️ **Horizontal alignment issue** - Point cloud appears tilted/rotated, horizon not level
- ⚠️ **Framing close but needs refinement** - Scene recognizable, 1-3 iterations away

**Decided:**
- Hardcode current camera preset for quick access
- Fix horizontal alignment (likely camera roll/up vector issue)
- Fine-tune zoom after alignment is corrected

**Action:**
- ✅ Added hardcoded camera preset (Iteration 6) activated when `?controls=1`
- ✅ Implemented CameraUpEnforcer component to prevent camera roll
- ✅ Camera position/target/FOV/mirrors now auto-load from preset
- ⏳ Ready for testing - should eliminate horizontal tilt issue

**Implementation Details:**

1. **Hardcoded Preset (when `?controls=1`):**
   - Camera position: `[-90.614, 137.449, -888.601]`
   - OrbitControls target: `[-64.814, 145.642, -657.435]`
   - FOV: `60°` (increased from default 20°)
   - MirrorLR: `ON` (enabled for correct orientation)
   - MirrorUD: `ON` (default, maintained)

2. **Horizontal Alignment Fix:**
   - Created `CameraUpEnforcer` component
   - Runs every frame via `useFrame()` hook
   - Forces camera.up to `[0, 1, 0]` (world Y-axis)
   - Prevents camera roll, keeps horizon level
   - Eliminates tilt visible in Part B screenshot

3. **Commits:**
   - `69fddff2` - feat(camera): hardcode iteration 6 preset and fix horizontal alignment
   - `81d4f9fb` - fix(camera): disable auto-fit when controls override active

**Issue Found & Fixed:**
User spot check revealed auto-fit was overwriting hardcoded camera position:
- Expected position: `[-90.614, 137.449, -888.601]`
- Actual position after load: `[-42.332, 64.211, -415.123]`
- Target was correct: `[-64.814, 145.642, -657.435]` ✅

Root cause: Prebaked auto-fit effect ran after Canvas initialization and recalculated camera position via `applyPerspectiveCover`, ignoring the hardcoded preset.

Fix: Added early return `if (controlsOverride) return` to skip auto-fit when preset is active.

---

## Success Criteria

- [ ] Cloud fills viewport (minimal black space)
- [ ] Scene clearly recognizable
- [ ] Ladies, pool, mountains all visible
- [ ] No excessive crop or distortion
- [ ] Framing consistent across reloads

---

## Notes

- Point cloud center: [0.083, -0.302, 1.520]
- OrbitControls target set to cloud center (fixed 2025-10-07)
- Auto-fit triggers on prebaked load (added 2025-10-07)
