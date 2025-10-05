# Dreamdust Aesthetic Smoke Test — 2025-10-03

## Current Build
- **Commit:** 0d039268 (fix: restore point cloud visibility)
- **Point sizing:** 12/8/24 (base/min/max)
- **Noise threshold:** 0.35
- **Date/time:** 1:45 PM 2025-10-03
- **Browser/GPU:** M1 Pro MacBook Pro 16GB RAM, Chrome V 140.0.7339.214 (Official Build) (arm64) + Cursor IDE + Claude Mac App + ChatGPT + Safari (10-20 Tabs) + Docker Open in the background

## Visual Rubric (Quick Checks)

Based on brief + fojcik frames:

- [~] **Visibility:** Points clearly form recognizable shape (not speck)
- [ ] **Ethereal quality:** Wispy tendrils, feathered edges (not harsh circles)
- [ ] **Luminous dots:** Soft glow, not harsh sprites
- [ ] **Airy/dusty feel:** Like fojcik frames, not solid blobs
- [ ] **Depth variation:** Points vary in size/alpha by distance
- [ ] **Breathing:** Subtle motion, not jitter or freeze
- [ ] **Performance:** Smooth interaction, not laggy

## Fojcik Frame Comparison

**Current screenshot:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-03-aesthetic-smoke-test.md` --> taken *right* after the countdown overlay

**Closest fojcik frame:** `02 or 01` --> when the image is clearly visible but *just* cohering.

**What's missing to match:**
- Color or a recognizable image *at all*
- Beyond that it's hard to tell because it's just like this oddly bright cloud; perhaps the particle size or smokiness

## Quick Notes

**FPS observed:** extremely choppy, I opened the devtools FPS meter and it lands around 20-25 FPS

**First impression (one sentence):** It's definitely visible and it is cloud-like, which is an improvement, but the performance and the fact that I can't make out an image at all (i.e it's *all* white) is disappointing

**Biggest blocker to aesthetic goal:** Probably the fact that I can't make out an image at all

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

## Smoke Test Procedure (for reference)

**Total time: 3-5 minutes**

### Step 1: Start server (30 seconds)
```bash
cd /Users/williambarron/hallucination-refinery/refinery-sdk
nvm exec 20.19.5 bash -c 'PORT=3000 npx -y pnpm --filter cryptiq-mindmap-demo run start'
```

### Step 2: Open test URL
`http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`

### Step 3: Observe (2-3 minutes)
1. Wait for reveal animation (1-3 seconds)
2. Check boxes in rubric
3. Take screenshot if helpful
4. Write quick gut reactions
5. Note FPS from debug panel

### Step 4: Save & share
Save this file with your notes, and Claude will propose next iteration.
