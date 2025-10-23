# Dreamdust Aesthetic Smoke Test — Iteration 02 (2025-10-03)

## Changes from Iteration 01
- **Gamma:** 1.15 → 0.85 (darken mid-tones to reveal color saturation)
- **Rim light:** 20% white → 5% white (preserve color purity at edges)

## Current Build
- **Commit:** [will be created after test confirms improvement]
- **Point sizing:** 6/4/14 (base/min/max) - unchanged
- **Noise threshold:** 0.70 - unchanged
- **Gamma:** 0.85
- **Rim light:** 0.05
- **Date/time:** 2:17 PM 2025-10-03
- **Browser/GPU:** M1 Pro MacBook Pro 16GB RAM, Chrome V 140.0.7339.214

## Visual Rubric (Quick Checks)

Based on brief + fojcik aesthetic quality:

- [ ] **Visibility:** Points clearly form recognizable shape (not speck)
- [ ] **Ethereal quality:** Wispy tendrils, feathered edges (not harsh circles)
- [ ] **Luminous dots:** Soft glow, not harsh sprites
- [ ] **Airy/dusty feel:** Like fojcik frames, not solid blobs
- [ ] **Depth variation:** Points vary in size/alpha by distance
- [ ] **Breathing:** Subtle motion, not jitter or freeze
- [ ] **Performance:** Smooth interaction, not laggy
- [ ] **COLOR SATURATION:** Browns, beiges, warm tones visible (not all white/grey) ⭐

## Fojcik Frame Comparison

**Current screenshot:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-03-aesthetic-smoke-test-iteration-02.png`

**Closest fojcik frame:** [01/02/03/04/05]

**What's missing to match:**
-
-

## Quick Notes

**FPS observed:** [ballpark number or "smooth"/"choppy"]

**First impression (one sentence):**

**Biggest blocker to aesthetic goal:**

**Bloom status:** [enabled/disabled - toggle in debug panel to test]

## Recommended Next Step

[I'll fill this in based on your notes above]

---

## Reference Images

- **Fojcik 01:** Noisy, low reveal, sparse
- **Fojcik 02:** Shapes lock in, readable
- **Fojcik 03:** Fully readable, airy dust quality, **saturated colors** ⭐ (aesthetic target)
- **Fojcik 04:** Density drops, vaporous fade
- **Fojcik 05:** Stable hold, breathing

---

## Expected Outcome (from Claude's analysis)

**Should see:**
- ✅ Cat shape still recognizable (unchanged from Iteration 01)
- ✅ **Browns, beiges, warm cat colors visible** (not white/grey)
- ✅ Less "blurry white floater" aesthetic
- ✅ Richer, more saturated color palette
- ✅ Performance stays at ~120 FPS

**If still white:** Try disabling bloom in debug panel
**If too dark:** Gamma may need slight increase (0.85 → 0.95)
