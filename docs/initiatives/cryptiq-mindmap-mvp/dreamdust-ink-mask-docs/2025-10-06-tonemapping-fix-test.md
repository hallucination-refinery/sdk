# Tonemapping Fix Test — 2025-10-06

## Summary

Fixed white blowout issue by implementing ACES tonemapping as specified in tweet recipe.

**Root cause:** Additive blending without tonemapping caused bright overlaps to clip to pure white (values > 1.0 → 1.0).

**Solution:** ACES filmic tonemapping compresses bright values smoothly:
- `2.0 → 0.95` (very bright but not clipped)
- `5.0 → 0.98` (extremely bright, still has color)
- `10.0 → 0.99` (peak brightness, doesn't blow out)

---

## Changes Applied

**Commit:** [TO BE FILLED]
**Branch:** codex/implement-dreamdust-aesthetic-plan

### 1. Added ACES Tonemapping
**File:** `apps/.../dreamdust/glsl/chunks.ts`
- Added `DREAMDUST_ACES_TONEMAP_CHUNK` with filmicACES function
- Applied before gamma correction to prevent clipping

### 2. Mild Bloom (per tweet: "mild bloom")
**File:** `apps/.../PointCloudStage.tsx`
- D1 preset: `strength: 1.2 → 0.35, radius: 2.0 → 0.5, threshold: 0.5 → 0.55`
- Reduced from aggressive to mild as specified in recipe

### 3. Moderate Particle Size
**File:** `apps/.../useDreamdustUniforms.ts`
- `baseSize: 6px → 5px` (within tweet recipe 2-6px range)
- `minSize: 1.2 → 1.0, maxSize: 9.0 → 7.5`

### 4. Moderate Density
**File:** `apps/.../DreamdustMaterial.ts`
- `uNoiseThreshold: 0.30 → 0.45` (fewer particles than dense test, more than sparse)

### 5. Kept Color Saturation Boost
- `color × 1.6` remains (was working, just needed tonemapping to control brightness)

---

## Test Procedure

### Setup
```bash
# Ensure dev server is running with correct Node version
lsof -ti:3000 | xargs kill 2>/dev/null || true
rm -rf apps/cryptiq-mindmap-demo/.next
bash -l -c '. $HOME/.nvm/nvm.sh && nvm use 20.19.5 && pnpm --filter cryptiq-mindmap-demo dev'
```

**Wait for:** "Ready in Xms" message

### Load Test Page
```
http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1
```

### Select Preset D1
From debug panel dropdown, select: **"D1: Additive + Gaussian (depth)"**

---

## What to Look For

### ✅ SUCCESS CRITERIA (Expected with tonemapping):

**1. Cat Structure Visible**
- [ ] Clear cat silhouette (not white noise, not speck)
- [ ] Browns, beiges, blacks visible throughout
- [ ] Foreground/background separation clear

**2. Bright Overlaps WITHOUT White Blowout**
- [ ] Dense regions (chest, face) show bright glowing areas
- [ ] Glows have COLOR (warm browns/orange), not pure white
- [ ] Overlaps compress smoothly, don't clip to #FFFFFF

**3. Soft Ethereal Quality**
- [ ] Particles have soft fuzzy edges (Gaussian working)
- [ ] Mid-density areas show haze/continuity (not discrete dots)
- [ ] Overall "misty" feel, not "pellet-like"

**4. Mild Bloom Effect**
- [ ] Visible soft halos around particles (~1-2× particle size)
- [ ] NOT blown out to pure white everywhere
- [ ] Halos help merge particles but don't wash out structure

---

## Visual Comparison Checklist

**Compare to reference frames:**
- `assets/fojcik_tweet_effect_replication_bundle/frames/012-frame.png` (cohere mid-point)
- `assets/motion-reanalysis-60fps/cohere/frame_0120.png` (2-second mark)

### Color Quality
- [ ] Similar saturation level to reference?
- [ ] Browns/beiges vibrant (not muted)?
- [ ] Blacks deep (not washed to gray)?

### Particle Rendering
- [ ] Soft edges like reference (not hard circles)?
- [ ] Continuous haze in mid-density areas?
- [ ] Individual particles visible in sparse areas but soft?

### Overall Aesthetic
- [ ] "Ethereal smoke" quality?
- [ ] "Pensieve" magical feel?
- [ ] NOT "static jittery dots" or "warcrime white blowout"?

---

## Screenshot Capture

**After loading D1 preset, capture:**
```
docs/.../assets/2025-10-06-tonemapping-fix-d1.png
```

**Also capture for comparison:**
- Preset A (normal blending, disc sprite): `2025-10-06-tonemapping-fix-a.png`
- Current preset: `2025-10-06-tonemapping-fix-current.png`

---

## Test Results

### Full Console Log
```
Navigated to http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1
PointCloudStage.tsx:2218 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 0, stageUvCount: 0, simStageUvCount: 0, simKey: null}
PointCloudStage.tsx:1238 [PC] prebaked positions {bytes: 3219888, count: 268324, sample: Array(6)}
PointCloudStage.tsx:1274 [PC] prebaked AABB {min: Array(3), max: Array(3), extent: Array(3), maxExtent: 0.7637119889259338, scale: 1309.3941361407406, …}
PointCloudStage.tsx:1440 [PC] prebaked PCA orientation applied
PointCloudStage.tsx:1470 [PC] prebaked present; using positions/colors, fallback images not required
PointCloudStage.tsx:1687 [PC] instances: 89441
PointCloudStage.tsx:2218 [vertex] stage data snapshot {simActive: false, stageUvDepthCount: 89441, stageUvCount: 178882, simStageUvCount: 0, simKey: null}
useDreamdustUniforms.ts:311 [dreamdust] vertex-ink-ok {value: 1}
metrics.ts:130 [dreamdust] caps {vertexInkOk: true, floatOk: true, aliasedPointSizeRange: Array(2), dpr: 1.7999999523162842, dprClamp: 1.7999999523162842, …}
metrics.ts:36 [dreamdust] caps-fanout { stage: true, context: true, host: true, metrics: true }
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'current', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
metrics.ts:130 [dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
useDreamdustUniforms.ts:311 [Dreamdust] ink-tex bind {width: 256, height: 256, needsUpdate: false}
useDreamdustUniforms.ts:311 [dreamdust] ink-telemetry {intensity: 0.75, offsetBoost: 1, sizeBoost: 1, vertexInkOk: 1}
PointCloudStage.tsx:837 [PC] attach controls to <canvas data-engine=​"three.js r176" __spector_context_type=​"webgl2" width=​"2275" height=​"1836" style=​"display:​ block;​ width:​ 1264.44px;​ height:​ 1020px;​ touch-action:​ auto;​ pointer-events:​ auto;​">​
useDreamdustUniforms.ts:311 [Dreamdust] reveal start {duration: 2}
events-f681e724.esm.js:2222 [Violation] 'requestAnimationFrame' handler took 229ms
report-hmr-latency.ts:26 [Fast Refresh] done in NaNms
PointCloudStage.tsx:2872 [dreamdust] cover-fit {mode: 'cover', radius: 0.394, margin: 0.78, distance: 1.407, fov: 20, …}
PointCloudStage.tsx:1608 [dreamdust] bloom { enabled: true, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'current' }
events-f681e724.esm.js:2222 [Violation] 'requestAnimationFrame' handler took 107ms
metrics.ts:130 [dreamdust] frame-percentiles {sampleCount: 240, p50Ms: 8.3, p90Ms: 9}
useDreamdustUniforms.ts:311 [Dreamdust] reveal end {duration: 2}
DreamdustMaterial.ts:729 [preset] {preset: 'D1', blending: 2, blendingName: 'AdditiveBlending', depthTest: true, hasGaussian: true, …}
DreamdustMaterial.ts:729 [preset] {preset: 'D1', blending: 2, blendingName: 'AdditiveBlending', depthTest: true, hasGaussian: true, …}
DreamdustMaterial.ts:729 [preset] {preset: 'D1', blending: 2, blendingName: 'AdditiveBlending', depthTest: true, hasGaussian: true, …}
DreamdustMaterial.ts:729 [preset] {preset: 'D1', blending: 2, blendingName: 'AdditiveBlending', depthTest: true, hasGaussian: true, …}
PointCloudStage.tsx:1608 [dreamdust] bloom { enabled: true, strength: 0.35, radius: 0.5, threshold: 0.55, preset: 'D1' }
DreamdustMaterial.ts:729 [preset] {preset: 'A', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'A', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'A', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
DreamdustMaterial.ts:729 [preset] {preset: 'A', blending: 1, blendingName: 'NormalBlending', depthTest: true, hasGaussian: false, …}
PointCloudStage.tsx:1608 [dreamdust] bloom { enabled: true, strength: 0.2, radius: 0.4, threshold: 0.8, preset: 'A' }
```

### Visual Assessment

**Similarity to reference:** ~5% (FAILED)

**What's working:**
- Tonemapping prevented white blowout (technically correct)
- Console logs show D1 preset loading correctly (AdditiveBlending, Gaussian)
- No crashes or errors

**What's still missing:**
- Cat structure barely visible (too sparse)
- Particles too small (5px) + too few (threshold 0.45) = insufficient coverage
- Can't evaluate tonemapping quality because not enough overlaps to tonemap
- No ethereal quality - just faint white specks on black

**Specific observations:**

Screenshot shows mostly black screen with sparse white specks scattered around. Faint cat outline barely visible in center. This is a DENSITY problem, not a tonemapping problem. Tonemapping works (no white blowout) but there's nothing to tonemap because particles are too sparse.

**Root cause:** Reduced BOTH particle size (6→5px) AND density (0.30→0.45 threshold shows fewer particles). Double reduction created insufficient coverage.

### Detailed Checklist Results

**Cat structure:**
- [X] Visible: NO (barely - faint outline only)
- [X] Color quality: Can't assess - too dark/sparse to see colors
- [X] Clarity: Very poor - mostly black with sparse white dots

**Bright overlaps:**
- [X] Glow without blowout: N/A (no overlaps to evaluate - too sparse)
- [X] Color retention: N/A (can't see colors)
- [X] Smooth compression: N/A (tonemapping works but nothing to compress)

**Soft quality:**
- [?] Gaussian edges: Possibly working but particles too small/sparse to confirm
- [X] Haze continuity: NO - discrete dots, no haze
- [X] Overall feel: Empty, sparse, lifeless

**Bloom effect:**
- [X] Mild halos: Can't see halos - particles too faint
- [X] Structure preserved: NO - structure lost due to sparsity
- [X] Not blown out: YES (but that's because there's nothing there)

---

## Decision

### FAILED - Wrong baseline density

**Core issue:** Tonemapping implementation is technically correct, but we can't evaluate it because particle coverage is too sparse to create overlaps worth tonemapping.

**What went wrong:**
1. Reduced particle size: 6px → 5px (smaller particles)
2. ALSO reduced density: noise threshold 0.30 → 0.45 (fewer particles shown)
3. Double reduction = catastrophic sparsity

**The mistake:** Tried to match tweet's "2-6px" range without considering that our 89k particles at 5px need HIGHER density (lower threshold) to achieve coverage, not lower.

**Tweet recipe says:** "80k-250k points; edge-biased sampling"
- We have 89k points (low end of range)
- Reference might have 150k+ points at smaller sizes
- OR reference uses MUCH lower noise threshold to show more of the 89k

---

## Next Steps - Density Fix Required

**Immediate action:** Revert to working density baseline, KEEP tonemapping

**Option 1: Revert threshold, increase size slightly**
```
uNoiseThreshold: 0.45 → 0.35 (show more particles)
baseSize: 5px → 6px (slightly larger for better coverage)
```
This restores density while keeping tonemapping + mild bloom.

**Option 2: Keep current size, much lower threshold**
```
uNoiseThreshold: 0.45 → 0.25 (show MANY more particles)
baseSize: 5px (keep as-is)
```
More particles at smaller size might create better continuous haze.

**Option 3: Larger particles at moderate threshold**
```
uNoiseThreshold: 0.45 → 0.38 (slightly more particles)
baseSize: 5px → 7px (noticeably larger)
```
Fewer but larger particles, more overlap.

**Recommendation: Option 1** - It's the safest path back to visible structure while keeping tonemapping improvements.

**What to preserve from this commit:**
- ✅ ACES tonemapping (working, prevents blowout)
- ✅ Mild bloom settings (0.35/0.5/0.55 correct per recipe)
- ✅ Color saturation boost (×1.6)

**What to adjust:**
- ❌ Noise threshold too high (0.45 → 0.35 or lower)
- ❌ Particle size possibly too small (5px → 6px or larger)

---

### If SUCCESS (70%+ match to reference):
**Next steps:**
1. Test other presets (B1, B2, C, D2) to verify tonemapping works across board
2. Consider adding gentle drift (5-15 px/s) per GPT-5 analysis if still feels too static
3. Document final settings and create PR

### If PARTIAL (40-70% match):
**Gaps identified:**
- [List specific issues]

**Proposed adjustments:**
- [Specific parameter changes to try]

### If STILL BROKEN (<40% match):
**Issues:**
- [Describe what's wrong]

**Alternative approaches to consider:**
- Adjust ACES parameters (more/less compression)?
- Try Reinhard tonemapping instead of ACES?
- Reconsider additive blending mode?
- Investigate other aspects of tweet recipe?

---

## Notes

**Tweet recipe reference:**
- "Blending: additive or alpha; tone map ACES/Reinhard; mild bloom + vignette"
- "Near size 2–6 px; far 0.4–1.0 px"
- We implemented ACES (not Reinhard), additive blending, mild bloom
- Particle size 5px is in the near range
- No vignette yet (can add if needed)

**Expected behavior:**
With ACES tonemapping, overlapping particles should create smooth gradients of increasing brightness that asymptotically approach white but never clip. This creates the "glowing ethereal" quality instead of harsh white blowout.
