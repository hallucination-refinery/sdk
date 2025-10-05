# Dreamdust Aesthetic Smoke Test — Iteration 04 (2025-10-04)

## PATH A: Parameter-Only Changes (Creative Technologist Assessment)

**Goal:** Transform from "petri dish pellets" to "ethereal dust" through 8 critical parameter adjustments.

## Changes from Iteration 03

Based on independent Creative Technologist assessment in `2025-10-04-iteration-03-aesthetic-assessment.md`:

### Critical Changes (Attacking Primary Blocker)
1. **`uAlphaFloor`:** 0.06 → 0.00
   - **Why:** Remove forced opacity floor; enable long-tail soft blending; eliminate hard pellet edges
   - **Expected:** Background haze emerges, edges melt together

2. **`uPointBaseSize`:** 6px → 1.8px
   - **Why:** Current size 3x too large; smaller kernels reduce pelletization
   - **Expected:** Finer grain, more "dust" than "confetti"

3. **`uMinSize/uMaxSize`:** 4/14 → 0.35/2.6
   - **Why:** Widen depth attenuation spread; introduce scale variance
   - **Expected:** Parallax and density variation; not uniform pellets

4. **`uNoiseThreshold`:** 0.70 → 0.50
   - **Why:** Reduce binary gating; increase continuous coverage
   - **Expected:** More coherent fog, fewer honeycomb voids

### Major Changes (Depth & Rim Quality)
5. **`uDepthNormScale`:** 0.001 → 0.003
6. **`uDepthBias`:** 0.7 → 1.1
   - **Why:** Strengthen atmospheric falloff with distance
   - **Expected:** Foreground denser, background recedes into mist

7. **`uRimGamma`:** 2.4 → 8.0
   - **Why:** Compress rim contribution to last few edge pixels
   - **Expected:** Subtle rim, not haloed rings

### Minor Changes (Polish)
8. **`uGamma`:** 0.85 → 1.10
   - **Why:** Reduce midtone crush; support softer gradients
   - **Expected:** Less blotchy midtones, smoother tonal falloff

9. **`uDriftAmp`:** 0.55 → 0.28
10. **`uCurlAmp`:** 0.55 → 0.35
    - **Why:** Remove petri-dish jitter at rest
    - **Expected:** Calm "breathy" hold, no twitches

## Current Build
- **Commit:** [will be created if this achieves breakthrough]
- **All changes:** Parameter-only (no shader code edits)
- **Date/time:** 2:05 PM, 2025-10-05
- **Browser/GPU:** M1 Pro MacBook Pro 16GB RAM, Chrome V 140.0.7339.214

## Visual Rubric (Quick Checks)

**Primary Assessment:**
- [~] **"Dust not pellets":** Particles read as continuous mist, not discrete circles
- [ ] **Soft blending:** Overlaps melt together, no hard edges
- [ ] **Ethereal quality:** Wispy, airy, "ink in air" feel
- [ ] **Depth variation:** Foreground dense, background fades to mist
- [ ] **No jitter at rest:** Calm, subtle breathing only

**Brief Alignment:**
- [~] **Visibility:** Points clearly form recognizable cat shape
- [ ] **Wispy tendrils:** Feathered edges, not hard boundaries
- [ ] **Luminous dots:** Soft glow, not harsh sprites or halos
- [ ] **Subtle breathing:** No jitter or visual noise
- [ ] **Performance:** Smooth 60+ FPS

## Fojcik Frame Comparison

**Target:** Frame 03 (fine airy dust quality)

**Current screenshot(s
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-04-aesthetic-smoke-test-iteration-04.png` - Taken right after the countdown/overlay ends
- `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-04-aesthetic-smoke-test-iteration-04-ratio-adjusted.png` - I adjusted the ratio a bit and

**Closest to:** `02/03`

**What's missing to match:**
- *Color*, although, it's strange, because for some reason when I adjust the `keepRatio` slider in the debug panel the color suddenly shows. (it's **not** consistent behavior though, or at least I can acertain exactly what is going on). Basically when I adjust the ratio even to 0.99 the color suddenly shows.
- I *can* make out the shapes, foreground/background etc. but it's just not smokey or airey in the way that I envision.

## Quick Notes

**FPS observed:** It's consistently 120 FPS so this isn't the problem

**First impression (one sentence):** The dots definitely are *smaller* and less petri dish like although they do *still* jitter like their in a petri dish and don't have that smokey plume airey wispy quality. 

**Biggest remaining gap (if any):** Right now, consistent color behavior I guess (I really don't know what's going on there) but, like last time, it's very hard to articulate why. The thing is I know that the Fojcik tweet uses a *different* method (i.e TSL math shaders I believe, don't quote me on that I don't really know much about it either way). It just doesn't feel like smoke idk. Maybe we need to 

**Breakthrough moment? Y/N:** I'm leaning towards *no* because it's definitely not a yes.

## Questions/Ideas/Higher Level Notes
1. I'm really not sure what to do because I think that these iterative steps **are** extremely helpful and we've made a lot of progress but it's *nowhere near good enough* especially considering the fact that we haven't even gotten to the *interactive* aspects yet.
2. I **don't want** to get trapped in analysis paralysis, lord knows I've done enough of that but I'm not willing to comprimise on my vision.
3. So this is a collection of sources/code/samples I compiled *over a month ago now* (I can't believe I've been working on this for so long) but this was more about the interactive elements: `docs/initiatives/cryptiq-mindmap-mvp/point-cloud-guidelines.md` (Line: 17 to 38). Also it seems like that file has the same content duplicated twice.
4. I'm *currently* putting together a better reference bundle so let's also *wait* on that maybe? (i.e a more comprehensive version of this: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/fojcik_tweet_frames`)
5. My only concern with using the exact technique that the fojcik tweet cites is compatibility and performance (it needs to run pretty smoothly on most mobile/laptops).


## Recommended Next Step

[If this doesn't achieve the breakthrough, Path B (Gaussian sprite kernel code change) may be needed]

---

## Reference: Primary Blocker Identified

**Creative Technologist assessment:**
> "The disc sprite + alpha floor + rim combo makes each particle a hard, high-contrast pellet. Until the sprite reads as a soft Gaussian with zero floor and reduced rim, overlaps will never melt into mist. This is the single biggest reason it feels clinical instead of ethereal."

**This iteration attacks exactly that:** Zero alpha floor + much smaller points + reduced rim = potential breakthrough.

---

## Expected Outcome

**Should see MAJOR transformation:**
- ✅ Particles 3x smaller (1.8px vs 6px)
- ✅ No opacity floor forcing hard edges
- ✅ 40% more particles visible (threshold 0.50 vs 0.70)
- ✅ Stronger depth falloff creating atmospheric perspective
- ✅ Subtle rim instead of white halos
- ✅ No jitter at rest

**If successful:** This could be the aesthetic breakthrough - moving from "petri dish" to "ethereal dust"

**If not quite there:** Path B (Gaussian sprite kernel shader change) is the nuclear option
