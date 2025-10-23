# Dreamdust Aesthetic Smoke Test — Iteration 01 (2025-10-03)

## Changes from Baseline
- **Noise threshold:** 0.35 → 0.70 (tighter gating to reveal cat shape)
- **Point sizing:** 12/8/24 → 6/4/14 (smaller for performance + airy feel)

## Current Build
- **Commit:** [will be created after test confirms improvement]
- **Point sizing:** 6/4/14 (base/min/max)
- **Noise threshold:** 0.70
- **Date/time:** 1:56 PM 2025-10-03
- **Browser/GPU:** M1 Pro MacBook Pro 16GB RAM, Chrome V 140.0.7339.214

## Visual Rubric (Quick Checks)

Based on brief + fojcik frames:

- [X] **Visibility:** Points clearly form recognizable shape (not speck)
- [ ] **Ethereal quality:** Wispy tendrils, feathered edges (not harsh circles)
- [ ] **Luminous dots:** Soft glow, not harsh sprites
- [ ] **Airy/dusty feel:** Like fojcik frames, not solid blobs
- [ ] **Depth variation:** Points vary in size/alpha by distance
- [ ] **Breathing:** Subtle motion, not jitter or freeze
- [ ] **Performance:** Smooth interaction, not laggy

## Fojcik Frame Comparison

**Current screenshot:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-03-aesthetic-smoke-test-iteration-01.png` -> taken right after the countdown overlay disappeared.

**Closest fojcik frame:** `02 or 03` --> as in the image/cloud has settled or almost settled.

**What's missing to match:**
- Still **completely** white and the dots look more like, not sure how to describe it, blurry floaters you get in your eyes (while I'm sure *your* familiar with the concept, idk how vivid that is for you lol). Although I assume this has alot to do with the fact that the dots are *all* white.
-

## Quick Notes

**FPS observed:** *Much* better the dev tools panel observed a consistent 120 FPS.

**First impression (one sentence):** I can make out the foreground and background (i.e the general shape of the cat and the background), there's a better sense of depth, the particles jitter in a kind of strange way and quite frankly don't have the smokey ethereal quality I've been chasing but it's *an improvement*. Ultimately I think the biggest issue is that **everything** is white/offwhite/semi-translucent white.

**Biggest blocker to aesthetic goal:** I guess color

## Recommended Next Step

[I'll fill this in based on your notes above]

---

## Reference Images

- **Fojcik 01:** Noisy, low reveal, sparse
- **Fojcik 02:** Shapes lock in, readable
- **Fojcik 03:** Fully readable, airy dust quality ⭐ (target)
- **Fojcik 04:** Density drops, vaporous fade
- **Fojcik 05:** Stable hold, breathing

---

## Expected Outcome (from Claude's analysis)

**Should see:**
- ✅ Cat silhouette recognizable (not random blobs)
- ✅ Colors (browns, beiges) visible
- ✅ Performance 40-50 FPS (improved from 20-25)
- ✅ Closer to fojcik frame 02 aesthetic

**If it disappears completely:** Threshold too high, will try 0.55 next
**If still white blobs:** Need different gating strategy
