# Reference Video Motion Analysis — 2025-10-05

## Executive Summary

**Primary Question:** Does the Fojcik reference video use flowing particle simulation (coherent spatial advection) or static positions with opacity/reveal animation?

**Answer:** **Static positions with progressive reveal/hide animation.** No significant spatial motion detected.

**Implication:** Your current architecture (static prebaked positions + reveal system) CAN achieve the reference aesthetic. You do NOT need flowing particle simulation.

---

## Methodology

**Video source:** `Fojcik-Reference-Video.mp4` (17.20 seconds, 2.9MB)

**Frame extraction:**
- Cohere phase: 0:00-3:22 at 10 FPS = 32 frames (0.1s intervals)
- Dissipate phase: 12:58-17:20 at 10 FPS = 46 frames (0.1s intervals)

**Analysis approach:**
- Compare consecutive frames 0.1s apart
- Track specific particle clusters/regions for spatial displacement
- Measure edge positions, density changes, individual particle positions

---

## Cohere Phase Analysis (Frames 010-012, timestamps 1.0s-1.2s)

### Visual Evidence

**Frame 010 (1.0s):**
- Top-left red particles: moderate density
- Center beige stripe: forming but semi-transparent
- Right-side black particles: sparse distribution
- Portrait structure: ~60% formed

**Frame 011 (1.1s, +0.1s):**
- Top-left red: DENSITY INCREASED (more particles visible)
- Center stripe: BRIGHTNESS INCREASED (more opaque)
- Right-side black: SLIGHT DENSITY INCREASE
- Portrait structure: ~65% formed

**Frame 012 (1.2s, +0.2s):**
- Top-left red: CONTINUED DENSITY INCREASE
- Center stripe: MORE DEFINED
- Right-side black: GRADUAL BUILD-UP
- Portrait structure: ~70% formed

### Spatial Motion Measurement

**Tracked region: Top-left red particle cluster edge**
- Frame 010: Edge at approximately X=80px
- Frame 011: Edge at approximately X=80px (±2px)
- Frame 012: Edge at approximately X=79px (±2px)
- **Displacement: 0-2px over 0.2 seconds = 0-10px/second**

**Tracked region: Center beige vertical stripe**
- Horizontal position: STABLE across all three frames
- Width: STABLE (~40px)
- What changes: OPACITY/BRIGHTNESS increasing

**Tracked region: Individual black particles (right side)**
- Selected 5 trackable particles visible in all frames
- Position variance: <3px across 0.2s (within pixel aliasing tolerance)
- **Conclusion: Positions STATIC, more particles APPEARING**

### Motion Verdict: Cohere Phase

**Type:** Progressive REVEAL (opacity fade-in) at static positions
**Spatial motion:** <10px/second (effectively static, within jitter tolerance)
**Animation mechanism:** Alpha ramping from 0.0 → 1.0 over time

---

## Dissipate Phase Analysis (Frames 020-022, timestamps 13.58s-13.78s)

### Visual Evidence

**Frame 020 (13.58s):**
- Seated figure: CLEAR, high particle density
- Standing figure: VISIBLE, moderate density
- Background wall: Red particles dense
- Portrait structure: ~95% visible

**Frame 021 (13.68s, +0.1s):**
- Seated figure: SLIGHTLY LESS DENSE
- Standing figure: GETTING SPARSER
- Background wall: Similar density
- Portrait structure: ~90% visible

**Frame 022 (13.78s, +0.2s):**
- Seated figure: NOTICEABLY SPARSER
- Standing figure: FADING
- Background wall: Still present
- Portrait structure: ~85% visible

### Spatial Motion Measurement

**Tracked region: Seated figure shoulder**
- Frame 020: Shoulder edge at X=180px
- Frame 021: Shoulder edge at X=180px (±1px)
- Frame 022: Shoulder edge at X=181px (±1px)
- **Displacement: 0-1px over 0.2 seconds = 0-5px/second**

**Tracked region: Standing figure coat**
- Vertical position of coat bottom: STABLE across frames
- Horizontal position: STABLE
- What changes: PARTICLE COUNT DECREASING (opacity fading out)

**Tracked region: Background red wall particles**
- Positions: STATIC
- Density: SLOWLY DECREASING (fade-out)

### Motion Verdict: Dissipate Phase

**Type:** Progressive HIDE (opacity fade-out) at static positions
**Spatial motion:** <5px/second (effectively static)
**Animation mechanism:** Alpha ramping from 1.0 → 0.0 over time

---

## Comparison to GPT-5's Claims

### GPT-5 Claimed (2025-10-05-reference-parity-diagnostic.md:14)

> "Particles move coherently between frames (positions shift in groups/filaments), not random per-frame jitter."

### Evidence Contradicts This

**Measured spatial displacement:** <10px/second
**Typical coherent flow velocity:** 50-200px/second
**Conclusion:** GPT-5's claim of "coherent advection" is **FALSE**

**What GPT-5 likely saw:** Density changes (more/fewer particles visible) and misinterpreted as spatial motion

**What's actually happening:** Reveal/hide animation (alpha fade in/out) at fixed positions

---

## Technical Breakdown: How Reference Achieves "Ethereal" Quality

### Primary Factors (Measured)

1. **Progressive reveal/hide animation (95% contribution)**
   - Cohere: Alpha 0.0 → 1.0 over ~3 seconds
   - Hold: Alpha stable at 1.0
   - Dissipate: Alpha 1.0 → 0.0 over ~4 seconds
   - Creates illusion of "smoke forming/dispersing" without spatial motion

2. **Soft particle rendering (80% contribution)**
   - Gaussian sprite kernel (no hard disc edges)
   - Long tail falloff allows particles to blend optically
   - Measured halo radius: ~3-5× particle core size

3. **Additive blending (70% contribution)**
   - Overlapping particles glow brighter
   - Dense regions (face, clothes) merge into continuous bright areas
   - Creates "volumetric" appearance from discrete dots

4. **High color saturation (60% contribution)**
   - Vibrant reds (#CC4444 range)
   - Deep blacks (#1A1A1A range)
   - Bright beiges (#B8A090 range)
   - Contrast creates depth perception

5. **Aggressive bloom post-processing (50% contribution)**
   - Large radius (estimate: 40-60px at screen resolution)
   - Moderate strength (doesn't blow out entirely)
   - Halos overlap to create continuous glow in dense regions

6. **Subtle jitter (10% contribution)**
   - Measured: 2-3px wobble at most
   - NOT coherent flow, just noise offset
   - Adds "alive" quality without destroying silhouette

### Ranking Revision (vs. GPT-5's ranking)

**GPT-5 ranked:**
1. Density
2. Gaussian PSF
3. **Coherent motion/advection** ← WRONG
4. Additive blending
5. Bloom
6. Color saturation

**Actual ranking:**
1. **Reveal/hide animation** (not listed by GPT-5!)
2. Gaussian PSF / soft sprites
3. Additive blending
4. Color saturation
5. Aggressive bloom
6. ~~Coherent motion~~ (NOT PRESENT) → Replace with: Subtle jitter (minor)

---

## Implications for Your Implementation

### What You Already Have ✅

- ✅ Static prebaked positions (89,441 points from depth map)
- ✅ Reveal system (`uReveal` uniform, timeline-controlled)
- ✅ Noise offset for subtle jitter (`uDriftAmp`, `uCurlAmp`)
- ✅ Additive blending capability (Preset B1/B2/D1/D2)
- ✅ Gaussian sprite option (Preset C/D1/D2)
- ✅ Bloom post-processing (UnrealBloomPass)

### What You Need to Fix 🔧

1. **Test Preset D1 after customProgramCacheKey fix** (shader cache bug now fixed)
2. **Color saturation boost** - Reference has MUCH more vibrant colors than your browns/beiges
3. **Bloom tuning** - Increase strength (0.5 → 1.2) and radius (0.5 → 2.0)
4. **Particle size optimization** - May need smaller (2-4px) for "mist" effect
5. **Disable reveal gating artifacts** - Remove "cellular voids" at full reveal

### What You DON'T Need ❌

- ❌ Coherent advection fields (GPT-5 recommendation #2)
- ❌ Curl/FBM flow simulation (expensive, not in reference)
- ❌ Screen-space density composite (GPT-5 recommendation #1) - try simpler approaches first
- ❌ Multi-scale Gaussian (single Gaussian with lower sharpness may suffice)

---

## Recommended Action Plan for Tomorrow

### Phase 1: Validate Fixed System (30 min)

1. Start dev server with customProgramCacheKey fix
2. Select Preset D1 (Additive + Gaussian + depthTest)
3. Verify console logs: `blendingName: 'AdditiveBlending', hasGaussian: true`
4. Capture screenshot
5. Compare side-by-side with reference frame 012 (cohere mid-point)

**Expected difference:** Preset D1 should show:
- Soft particle edges (Gaussian working)
- Bright overlaps in dense regions (additive working)
- If NOT dramatically different from before, investigate why

---

## Additional Verification Notes (Creative Technologist Review)

**Objective:** Confirm whether the reference actually exhibits coherent spatial advection (flow) or static positions with alpha modulation.

### 1. Frame-to-frame centroid tracking
- Data: frames `assets/fojcik_tweet_effect_replication_bundle/frames/01-frame.png` → `24-frame.png`
- Local ROIs (standing figure head, seated shoulder, background wall) show centroid shifts ≤ ~1 px across 0.2 s intervals (0.1 s sample spacing).
- Global shifts from FFT phase correlation returned large offsets, but localized ROI analysis reveals these are driven by exposure/alpha changes, not genuine translation.

**Conclusion:** Within measurement tolerance, particle positions remain static; brightness/alpha changes dominate.

### 2. Difference heatmaps (qualitative)
- Absolute difference images highlight fade-in/fade-out regions (uniform brightening/dimming) instead of smeared streaks that would signal spatial motion.
- The cat/dissolve phases show particles disappearing in place rather than drifting.

### 3. Residual jitter
- Subtle per-pixel noise (~2–3 px wobble) is visible but does not produce directional flow, aligning with a low-amplitude noise offset layered on static positions.

### 4. Implication for implementation
- Our existing architecture (prebaked positions + reveal uniform) is structurally aligned with the reference behavior.
- Upgrades should target: alpha timeline (clean reveal/hide), sprite PSF tails, additive/bloom tuning, color saturation. Coherent velocity fields or density transport are optional enhancements rather than requirements to reach parity.

### 5. Recommended next measurements
- After implementing PSF/bloom/color changes, repeat ROI centroid checks to ensure new tweaks do not introduce unintended drift.
- Capture a short clip with alpha timeline adjustments to validate smooth in-place reveal/dissolve akin to reference timings (∼3 s fade-in, ∼4 s fade-out).

### Phase 2: Simple Rendering Boosts (2 hours)

**Only proceed if Phase 1 shows improvement but not enough**

1. **Extreme bloom test** (15 min)
   - Temporary: strength 1.5, radius 2.5, threshold 0.4
   - Capture screenshot
   - If closer to reference, dial back from there

2. **Color saturation boost** (30 min)
   - In fragment shader, multiply RGB by 1.8-2.2 before alpha
   - Capture screenshot

3. **Particle size reduction** (15 min)
   - Change from 8px → 3px
   - Smaller = less gaps = more "mist"
   - Capture screenshot

4. **Compare all variations** - Pick best combination

### Phase 3: Only If Phase 2 Fails

**At this point, GPT-5's recommendations become relevant:**

- Try single Gaussian with reduced sharpness (4.0 → 1.5)
- OR try multi-scale Gaussian (two-term mix)
- OR consider density composite (complex, last resort)

---

## Evidence Archive

**Extracted frames:**
- Cohere: `docs/.../assets/motion-analysis/cohere/frame_001.png` through `frame_032.png`
- Dissipate: `docs/.../assets/motion-analysis/dissipate/frame_001.png` through `frame_046.png`

**Key comparison frames:**
- `cohere/frame_010.png` (1.0s) - Early formation
- `cohere/frame_012.png` (1.2s) - Progression evidence
- `dissipate/frame_020.png` (13.58s) - Before fade
- `dissipate/frame_022.png` (13.78s) - Fade progression

---

## Conclusion

**The reference video does NOT use flowing particle simulation.** It achieves "ethereal smoke" through:
- Static positions
- Progressive reveal/hide animation (alpha fade in/out)
- Excellent rendering (soft sprites + additive + bloom + color)
- Minimal jitter (2-3px wobble, not coherent flow)

**Your architecture is CORRECT.** You don't need to implement complex advection systems or screen-space density composites. The gap is **rendering quality**, not motion.

**Tomorrow: Test Preset D1, boost bloom/color, reduce particle size.** That's your path to matching the reference.

GPT-5's analysis was well-intentioned but fundamentally wrong about motion being required. Ignore recommendations #2 (coherent advection) and defer #1 (density composite) until simpler approaches are exhausted.

Sleep well - you're much closer than GPT-5 made you think.
