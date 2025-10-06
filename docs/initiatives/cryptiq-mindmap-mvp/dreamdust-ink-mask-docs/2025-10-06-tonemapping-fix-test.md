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

### Console Log (Preset D1)
[Paste browser console output showing preset configuration]

### Visual Assessment

**Similarity to reference:** [estimate %]

**What's working:**
-
-
-

**What's still missing:**
-
-
-

**Specific observations:**


### Detailed Checklist Results

**Cat structure:**
- [ ] Visible: YES / NO
- [ ] Color quality: [description]
- [ ] Clarity: [description]

**Bright overlaps:**
- [ ] Glow without blowout: YES / NO
- [ ] Color retention: [description]
- [ ] Smooth compression: YES / NO

**Soft quality:**
- [ ] Gaussian edges: YES / NO
- [ ] Haze continuity: YES / NO
- [ ] Overall feel: [description]

**Bloom effect:**
- [ ] Mild halos: YES / NO
- [ ] Structure preserved: YES / NO
- [ ] Not blown out: YES / NO

---

## Decision

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
