# Autonomous Agent Prompt — Dreamdust Rendering Optimization

## Context & Background

You are implementing rendering optimizations for a WebGL point cloud particle effect. Recent work has:

1. **Fixed critical shader bugs** (commit `cdf7ae92`):
   - Added `customProgramCacheKey()` to force shader recompilation when Gaussian kernel changes
   - Fixed color attribute binding (declarative JSX vs imperative useEffect)
   - Removed hardcoded uniform overrides that stomped preset values

2. **Completed motion analysis** proving reference uses **static positions + reveal animation**, NOT flowing simulation
   - Reference spatial motion: <10px/second (effectively static)
   - "Smoke" effect achieved via rendering quality, not particle motion
   - Invalidates GPT-5 recommendations for flow simulation and density compositing

3. **Documented implementation plan** with 7 phases, time estimates, success criteria

**Current state:** Fixes committed but UNTESTED. User needs autonomous testing + optimization overnight.

---

## Your Mission

Execute Phase 1-5 of rendering optimization plan autonomously:

**Phase 1:** Validate shader cache fix works (CRITICAL - blocks everything)
**Phase 2:** Optimize bloom for soft halos
**Phase 3:** Boost color saturation to match reference
**Phase 4:** Optimize particle size for "mist" quality
**Phase 5:** Combined validation against reference

**Create PR** with screenshots, findings, and final settings IF successful.

---

## Phase 1: Validate Shader Cache Fix (BLOCKING)

### Step 1.1: Start Dev Server

```bash
cd /Users/williambarron/hallucination-refinery/refinery-sdk
lsof -ti:3000 | xargs kill 2>/dev/null || true
rm -rf apps/cryptiq-mindmap-demo/.next
pnpm --filter cryptiq-mindmap-demo dev
```

Wait for "Ready in Xms" - dev server should start on port 3000.

### Step 1.2: Capture Baseline (Preset "Current")

**Action:**
1. Navigate to `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1`
2. Wait 5 seconds for full render
3. Open browser DevTools console
4. Verify colors are visible immediately (browns/beiges) - if white, color bug NOT fixed

**Expected console log:**
```
[preset] {
  preset: 'current',
  blending: 1,
  blendingName: 'NormalBlending',
  hasGaussian: false,
  cacheKey: 'dreamdust-gauss-0'
}
```

**Capture screenshot:**
- Tool: Playwright/Puppeteer headless browser
- Viewport: 1920×1080
- Wait: 5 seconds after page load
- Path: `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/2025-10-06-baseline-current.png`

### Step 1.3: Test Preset D1 (Critical Test)

**Action:**
1. Use Playwright to select dropdown option "D1: Additive + Gaussian (depth)"
2. Wait 3 seconds for material swap
3. Check console for new `[preset]` log

**Expected console log:**
```
[preset] {
  preset: 'D1',
  blending: 2,
  blendingName: 'AdditiveBlending',
  hasGaussian: true,
  cacheKey: 'dreamdust-gauss-1'
}
```

**Critical validations:**
- `blending: 2` (THREE.AdditiveBlending, not 1 = NormalBlending)
- `hasGaussian: true` (Gaussian kernel enabled)
- `cacheKey: 'dreamdust-gauss-1'` (shader will recompile)

**Capture screenshot:**
- Path: `docs/.../assets/2025-10-06-preset-D1-initial.png`

### Step 1.4: Visual Comparison

**Load both screenshots and analyze:**

**Additive blending test:**
- Compare chest area (dense overlapping browns)
- D1 should be MUCH brighter, glowing, almost orange where particles overlap
- If brightness is same → ADDITIVE NOT WORKING

**Gaussian kernel test:**
- Zoom to sparse background particles
- D1 should have soft fuzzy edges
- Current should have hard circular edges
- If both have hard edges → GAUSSIAN NOT WORKING

### Step 1.5: Decision Gate

**If D1 is dramatically different (bright overlaps + soft edges):**
```
PASS: Shader cache fix worked!
→ Proceed to Phase 2 (bloom optimization)
```

**If D1 looks identical or barely different from Current:**
```
FAIL: Shader cache fix didn't work
→ STOP and document failure
→ Create issue report with console logs + screenshots
→ DO NOT proceed to Phase 2+
```

**Create report:** `docs/.../2025-10-06-phase1-results.md`
```markdown
# Phase 1 Results

## Shader Cache Fix Validation

**Status:** [PASS/FAIL]

**Console logs:**
[paste both Current and D1 logs]

**Visual comparison:**
- Additive blending: [working/not working]
- Gaussian kernel: [working/not working]

**Screenshots:**
- Baseline: 2025-10-06-baseline-current.png
- D1 test: 2025-10-06-preset-D1-initial.png

**Decision:** [Proceed to Phase 2 / Stop and debug]
```

---

## Phase 2: Bloom Optimization (ONLY IF PHASE 1 PASSED)

### Step 2.1: Research Bloom Settings

**Action:** Check THREE.js UnrealBloomPass typical values for "aggressive" bloom

**Reference values:**
- Conservative: strength 0.2-0.5, radius 0.4-0.8, threshold 0.7-0.9
- Moderate: strength 0.5-1.0, radius 1.0-1.5, threshold 0.5-0.7
- Aggressive: strength 1.0-2.0, radius 1.5-3.0, threshold 0.3-0.6

**Target:** Match reference's soft halos that overlap and merge in dense regions.

### Step 2.2: Edit Bloom Settings

**File:** `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
**Location:** Line 102-109 (BLOOM_PRESET_SETTINGS)

**Current D1:**
```typescript
D1: { strength: 0.5, radius: 0.5, threshold: 0.6 },
```

**Change to:**
```typescript
D1: { strength: 1.2, radius: 2.0, threshold: 0.5 },
```

**Rationale:**
- Strength 1.2: Double previous, creates visible glow
- Radius 2.0: 4× larger, halos overlap and merge
- Threshold 0.5: Lower to bloom more particles

**Restart dev server** (settings only update on rebuild).

### Step 2.3: Test Bloom Changes

**Capture screenshot:**
- Path: `docs/.../assets/2025-10-06-preset-D1-bloom-1.2-2.0-0.5.png`

**Visual check:**
- Particles should have large soft halos
- Dense regions should have continuous glow
- Compare to reference frame 012 from motion-analysis/cohere/

**If too much bloom (blown out, loss of detail):**
- Reduce to: strength 0.8, radius 1.5, threshold 0.55
- Recapture

**If still not enough:**
- Increase to: strength 1.5, radius 2.5, threshold 0.45
- Recapture

**Document in:** `docs/.../2025-10-06-bloom-tuning-log.md`

---

## Phase 3: Color Saturation Boost

### Step 3.1: Analyze Current Colors

**Reference colors (from frame 012):**
- Reds: ~#CC4444 (vibrant)
- Blacks: ~#1A1A1A (deep)
- Beiges: ~#B8A090 (warm)

**Your current colors (scene-02/colors.u8):**
- Browns: ~#8C6E5A (muted)
- Beiges: ~#B4A08C (muted)

**Gap:** ~30% less saturated

### Step 3.2: Implement Saturation Boost

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
**Location:** Fragment shader, after depth desaturation (~line 596), BEFORE rim light

**Find:**
```glsl
// Depth-based desaturation/darkening
float dn = dreamdustViewDepthNorm(vPosMV, uDepthNormScale);
float dAmt = clamp(dd_saturate(dn * 0.25), 0.0, 1.0);
float luma = dot(color, vec3(0.299, 0.587, 0.114));
vec3 gray = vec3(luma);
color = mix(color, gray, dAmt);
color *= (1.0 - 0.25 * dAmt);

// Apply rim light
```

**Insert BEFORE `// Apply rim light`:**
```glsl
// Boost color saturation to match reference
color = color * 1.6;
```

**Restart dev server.**

### Step 3.3: Test Color Boost

**Capture screenshot:**
- Path: `docs/.../assets/2025-10-06-preset-D1-bloom-color.png`

**Visual check:**
- Browns should look richer, warmer
- Compare RGB values to reference via color picker

**If too saturated (neon/unnatural):**
- Reduce to: `color = color * 1.3;`

**If still too muted:**
- Increase to: `color = color * 1.8;`

---

## Phase 4: Particle Size Optimization

### Step 4.1: Size Tests

**Current:** 8.0/1.5/11.5 (boosted for evaluation)

**Test 3 sizes:**

**Size A: 4px**
```typescript
// useDreamdustUniforms.ts:107
baseSize: 4.0,
minSize: 0.8,
maxSize: 6.0,
```
Capture: `2025-10-06-D1-size-4px.png`

**Size B: 2.5px**
```typescript
baseSize: 2.5,
minSize: 0.5,
maxSize: 4.0,
```
Capture: `2025-10-06-D1-size-2.5px.png`

**Size C: 1.5px**
```typescript
baseSize: 1.5,
minSize: 0.3,
maxSize: 2.5,
```
Capture: `2025-10-06-D1-size-1.5px.png`

### Step 4.2: Choose Best Size

**Criteria:**
- Mid-density (chest): Continuous haze or visible dots?
- Sparse (background): Particles still visible?
- Overall: More like reference frame 012?

**Typical winner:** 2.5-4px range

---

## Phase 5: Final Validation

### Step 5.1: Combined Settings

**Apply winning combination:**
- Bloom: [chosen strength/radius/threshold]
- Color: [chosen multiplier]
- Size: [chosen base/min/max]

### Step 5.2: Final Screenshots

**Capture:**
1. Full view: `2025-10-06-D1-final-full.png`
2. Zoom 200% chest: `2025-10-06-D1-final-chest-zoom.png`
3. Zoom 200% background: `2025-10-06-D1-final-background-zoom.png`

### Step 5.3: Reference Comparison

**Load side-by-side:**
- Your final: `2025-10-06-D1-final-full.png`
- Reference: `motion-analysis/cohere/frame_012.png`

**Checklist:**
- [ ] Soft particle edges (not hard circles)
- [ ] Bright glowing overlaps in dense regions
- [ ] Continuous haze in mid-density areas
- [ ] Vibrant colors (not muted)
- [ ] Large soft halos from bloom
- [ ] Overall "ethereal" quality

### Step 5.4: Create Results Document

**File:** `docs/.../2025-10-06-final-results.md`

```markdown
# Final Rendering Optimization Results

## Winning Configuration

**Bloom:**
- Strength: [VALUE]
- Radius: [VALUE]
- Threshold: [VALUE]

**Color saturation:** ×[VALUE]

**Particle size:**
- Base: [VALUE]px
- Min: [VALUE]px
- Max: [VALUE]px

## Visual Quality Assessment

[For each checklist item, mark PASS/FAIL with explanation]

## Screenshots

- Baseline (Current): 2025-10-06-baseline-current.png
- D1 initial: 2025-10-06-preset-D1-initial.png
- D1 final: 2025-10-06-D1-final-full.png
- Reference: motion-analysis/cohere/frame_012.png

## Recommendation

[READY FOR PR / NEEDS MORE WORK]
```

---

## Phase 6: Create PR (ONLY IF PHASE 5 PASSED)

### Step 6.1: Commit Changes

```bash
git add apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
git add apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts
git add apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts
git add docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/

git commit -m "$(cat <<'EOF'
feat(dreamdust): rendering optimization - ethereal aesthetic achieved

Optimized bloom, color saturation, and particle sizing to match reference.

**Changes:**
- Bloom: D1 preset → strength [VALUE], radius [VALUE], threshold [VALUE]
- Color: Saturation boost ×[VALUE] in fragment shader
- Particle size: [VALUE]px (optimized from 8px evaluation size)

**Results:**
- Soft particle edges (Gaussian sprite working)
- Bright glowing overlaps (additive blending working)
- Vibrant colors matching reference
- Continuous haze in mid-density regions

**Visual evidence:** docs/.../2025-10-06-final-results.md

**Performance:** [FPS MEASURED] on test hardware

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Step 6.2: Push and Create PR

```bash
git push origin codex/implement-dreamdust-aesthetic-plan

gh pr create \
  --base main \
  --title "feat(dreamdust): rendering optimization for ethereal aesthetic" \
  --body "$(cat <<'EOF'
## Summary

Achieved reference aesthetic through rendering optimizations after motion analysis confirmed static positions are correct approach.

**Before:** Discrete particles, muted colors, minimal bloom
**After:** Ethereal mist quality, vibrant colors, soft halos

## Key Changes

1. **Bloom tuning** - Increased strength/radius for overlapping halos
2. **Color saturation** - Boosted ×[VALUE] to match vibrant reference
3. **Particle sizing** - Optimized to [VALUE]px for continuous haze

## Shader Cache Fixes (Previous Commit)

- customProgramCacheKey enables Gaussian/additive switching
- Declarative color attribute binding (no white particles)
- Removed hardcoded uniform overrides

## Visual Evidence

See `docs/.../2025-10-06-final-results.md` for:
- Side-by-side reference comparison
- Before/after screenshots
- Settings documentation

## Motion Analysis Conclusion

Frame-by-frame analysis proved reference uses static positions + reveal animation, NOT flowing simulation. This validates our architecture and focuses optimization on rendering quality.

## Test Plan

- [x] Preset D1 shows dramatic difference from baseline
- [x] Additive blending creates bright overlaps
- [x] Gaussian sprites create soft edges
- [x] Colors visible immediately on load
- [x] Visual match to reference frame 012
- [ ] User validates on production hardware
- [ ] Performance acceptable (target: 60+ FPS)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Rollback Plan (IF FAILURES)

### If Phase 1 Fails (Shader Cache)

**Document failure:**
```markdown
# Phase 1 Failure Report

**Issue:** Shader cache fix did not enable Gaussian/additive rendering

**Evidence:**
- Console logs show [DETAILS]
- Screenshots show no visual difference
- Blending value: [ACTUAL] (expected: 2)
- Gaussian state: [ACTUAL] (expected: true)

**Next steps:**
- Debug customProgramCacheKey implementation
- Check material.needsUpdate timing
- Verify R3F primitive key prop working
```

**Do NOT proceed to Phase 2+**

### If Optimizations Make It Worse

**Revert changes:**
```bash
git checkout HEAD -- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx  # Revert bloom
git checkout HEAD -- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts  # Revert color
```

**Document what didn't work and why.**

---

## Success Criteria

**Minimum acceptable:**
- Phase 1 passes (shader cache fix works)
- D1 renders differently from Current

**Ideal:**
- All 5 phases complete
- Visual match to reference
- PR created with documentation

**Stretch:**
- User wakes up to working PR
- Single review/approve needed
- Ready to merge

---

## Notes for Agent

- **Be autonomous** - Make decisions based on visual comparison
- **Document everything** - Screenshots, logs, reasoning
- **Stop if blocked** - Don't proceed past failed phases
- **Focus on results** - User values working aesthetic over perfect process

**Primary goal:** Validate shader cache fix works and achieve reference aesthetic quality through rendering optimization.

**Remember:** Motion analysis proved static positions correct. Don't implement flow/simulation. Focus on bloom/color/size only.

---

## File Locations Quick Reference

**Code:**
- Bloom settings: `PointCloudStage.tsx:102-109`
- Color boost: `DreamdustMaterial.ts:~600` (after depth desat, before rim)
- Particle size: `useDreamdustUniforms.ts:107`

**Documentation:**
- Implementation plan: `2025-10-06-rendering-optimization-plan.md`
- Motion analysis: `2025-10-05-motion-analysis.md`
- Status/recovery: `2025-10-06-STATUS.md`

**Reference frames:**
- Cohere: `assets/motion-analysis/cohere/frame_001-032.png`
- Target: `frame_012.png` (1.2s, mid-formation)

**Assets output:**
- Screenshots: `assets/2025-10-06-*.png`
- Reports: `docs/.../2025-10-06-*.md`

Good luck! The user is counting on you.
