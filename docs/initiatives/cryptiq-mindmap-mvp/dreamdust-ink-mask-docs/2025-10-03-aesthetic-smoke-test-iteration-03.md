# Dreamdust Aesthetic Smoke Test — Iteration 03 (2025-10-03)

## ROOT CAUSE FIX: Color Attribute Missing

**The real problem:** The vertex `color` attribute was NEVER being bound to the geometry! The shader expected it but THREE.js defaulted it to white (1,1,1).

## Changes from Iteration 02
- **Added color attribute binding** - Fixed missing `setAttribute('color', stageColorArray, 3, true)`
- **Added stageColorArray memo** - Derives colors from simState → renderBuffers → prebaked
- **normalized=true** - Converts Uint8 colors (0-255) → float (0.0-1.0) properly
- **No shader changes needed** - Gamma/rim changes from Iteration 02 stay in place

## Current Build
- **Commit:** [will be created after test confirms improvement]
- **Point sizing:** 6/4/14 (base/min/max) - from Iteration 01
- **Noise threshold:** 0.70 - from Iteration 01
- **Gamma:** 0.85 - from Iteration 02
- **Rim light:** 0.05 - from Iteration 02
- **Color attribute:** NOW BOUND (was missing!)
- **Date/time:** 3:32 PM, 2025-10-03
- **Browser/GPU:** M1 Pro MacBook Pro 16GB RAM, Chrome V 140.0.7339.214

## Visual Rubric (Quick Checks)

Based on brief + fojcik aesthetic quality:

- [~] **Visibility:** Points clearly form recognizable shape (not speck)
- [ ] **Ethereal quality:** Wispy tendrils, feathered edges (not harsh circles)
- [ ] **Luminous dots:** Soft glow, not harsh sprites
- [ ] **Airy/dusty feel:** Like fojcik frames, not solid blobs
- [ ] **Depth variation:** Points vary in size/alpha by distance
- [ ] **Breathing:** Subtle motion, not jitter or freeze
- [X] **Performance:** Smooth interaction, not laggy
- [X] **COLOR SATURATION:** Browns, beiges, warm cat tones CLEARLY VISIBLE ⭐⭐⭐

## Fojcik Frame Comparison

**Current screenshot:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-03-aesthetic-smoke-test-iteration-03.png` -> taken right after the countdown overlay disappears

**Closest fojcik frame:** `02 / 03` --> I don't really know what creates the effect but the image is *all* it's oddly out of focus

**What's missing to match:**
- It's starting to get hard to articulate but a few things, for some reason I think it looks like maybe *petri dish art* if that makes any sense (view screenshot) which is **not** what I was going for. The manner in which the particles move/jitter is also very petri dish like.
- Maybe the particles are just too big? Maybe the depth map is simply not detailed enough, I'm honestly not sure but it's definitely wrong.

## Quick Notes

**FPS observed:** ~120 FPS

**First impression (one sentence):** I can see the image it's in color now which I'm happy about, it's quite blurry/out of focus though and kind of looks like *petri dish art* and jitters/moves like it's in a petri dish.

**Biggest blocker to aesthetic goal:** I truly don't know, but I know it's **still** very far from there, I know this isn't helpful so we should maybe *think* and *talk* through it before the next iteration? **Obviously** we haven't addressed the interactivity element but let's not focus on that for now.

**Bloom status:** [enabled]

## Recommended Next Step

[I'll fill this in based on your notes above]

---

## Reference Images

- **Fojcik 01:** Noisy, low reveal, sparse
- **Fojcik 02:** Shapes lock in, readable
- **Fojcik 03:** Fully readable, airy dust quality, **rich saturated colors** ⭐ (aesthetic target)
- **Fojcik 04:** Density drops, vaporous fade
- **Fojcik 05:** Stable hold, breathing

---

## Expected Outcome (CRITICAL FIX)

**Should see:**
- ✅ **Browns, beiges, and warm cat colors CLEARLY VISIBLE** (not white/grey!)
- ✅ Cat shape still recognizable (unchanged from Iteration 01)
- ✅ Performance stays at ~120 FPS
- ✅ Color data from scene-02/colors.u8 properly displayed:
  - Dark brown RGB(52, 24, 14)
  - Medium brown RGB(139, 101, 82)
  - Tan/beige RGB(168, 131, 91)

**This is the breakthrough fix!** The prebaked colors were always there in the data file, but they were never being sent to the shader.
