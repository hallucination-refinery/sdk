# Aesthetic Gap Analysis — 2025-10-06

## Current State vs Reference

### What's Working ✅

1. **ACES Tonemapping** — No white blowout even at high particle density
2. **Bloom Rendering** — Confirmed working via ON/OFF comparison
3. **Cat Structure** — Visible at manual slider 2.5-3.0
4. **Technical Pipeline** — No crashes, shader compiling, uniforms updating

### What's Not Working ❌

1. **Static vs Flowing** — Particles frozen in place, reference has gentle drift
2. **Grainy vs Ethereal** — "TV static" appearance, not "soft smoke"
3. **Default Size Values** — `DEFAULT_POINT_SIZING.baseSize: 6.0` didn't apply (likely disconnect from `uPointBaseSize` uniform)
4. **Bloom Insufficient** — Current params (0.35/0.55/0.5) create mild glow but not continuous haze

---

## Test Results Summary

### Manual Slider Tests (D1 preset, threshold 0.35)

| Size | Appearance | Screenshot |
|------|------------|------------|
| 2.5 | Grainy, cat visible, pointillist | `Screenshot...2.18.19 PM.png` |
| 3.0 | Similar, slightly larger dots | `Screenshot...2.32.08 PM.png` |
| 3.0 (bloom OFF) | Sharp discrete dots, high contrast | `Screenshot...2.47.58 PM.png` |

**Bloom contribution:** Adds soft halos and slight haze, but doesn't transform discrete particles into flowing smoke.

---

## Root Cause Analysis

### 1. Motion Missing (Critical)

**WebGPU reference has:**
- Curl noise 4D flow field with time
- Gentle baseline drift: `wanderingSpeed: 0.003`
- Life-based particle cycling
- Measured drift: 5-15 px/s

**We have:**
- Static particles (no drift at all)
- Creates "frozen static" appearance even with bloom

**Impact:** Without motion, particles look like frozen pointillist painting rather than flowing ethereal smoke.

### 2. Bloom Parameters

**WebGPU reference:**
```javascript
bloom(scenePassColor, 0.12, 0.05, 0.25)
// strength: 0.12, threshold: 0.05, radius: 0.25
```

**Our D1 preset:**
```javascript
{ strength: 0.35, threshold: 0.55, radius: 0.5 }
```

**Key difference:**
- Reference: MUCH lower threshold (0.05 vs 0.55) = blooms more particles
- Reference: Lower strength but broader coverage = gentler bloom across more of field
- We: Higher threshold = only brightest particles bloom, creates isolated halos

### 3. Particle Rendering

**Evidence from bloom OFF comparison:**
- Our particles appear as sharp discrete dots even with Gaussian kernel
- Halos from bloom are relatively small vs particle core
- Reference shows halo:core ratio of ~2-3×

**Possible causes:**
- Gaussian sharpness too high (tight falloff)
- Particle size too small relative to bloom radius
- Additive blending intensity needs balancing with bloom

### 4. Default Values Disconnect

**Issue:** Changed `DEFAULT_POINT_SIZING.baseSize: 5.0 → 6.0` but:
- Debug panel slider shows 0.4 on load (not 6.0)
- Slider range becomes 0.8-3.0 after adjustment
- Manual slider changes DO work

**Hypothesis:**
- `DEFAULT_POINT_SIZING` (useDreamdustUniforms.ts) doesn't connect to `uPointBaseSize` uniform
- Debug panel reads `uPointBaseSize: 2.2` from `DEFAULT_UNIFORM_VALUES` (DreamdustMaterial.ts)
- Need to change `uPointBaseSize` directly, not `DEFAULT_POINT_SIZING.baseSize`

---

## Critical Path Forward

### Immediate (addresses visibility)

1. **Fix default particle size**
   - Change `uPointBaseSize: 2.2 → 3.0` in `DEFAULT_UNIFORM_VALUES` (DreamdustMaterial.ts)
   - This should make slider show 3.0 on load instead of requiring manual adjustment

### Short-term (addresses aesthetic)

2. **Adjust bloom to match reference**
   - D1 preset: `strength: 0.35 → 0.12, threshold: 0.55 → 0.05, radius: 0.5 → 0.25`
   - Lower threshold = bloom more of particle field
   - Creates broader haze vs isolated bright halos

3. **Test Gaussian sharpness**
   - Consider reducing sharpness to create larger halos
   - Want halo:core ratio ~2-3× like reference

### Medium-term (addresses motion)

4. **Implement gentle drift**
   - Add simple uniform time-based offset to vertex positions
   - Start with 5-10 px/s drift in shader
   - Can use existing noise function for variation
   - No need for full curl-noise compute (that's WebGPU-specific)

5. **Consider curl-noise flow field (WebGL 2 compatible)**
   - Use vertex shader or simple compute approach
   - Reference uses curl of simplex noise with time
   - Could implement simplified version in existing pipeline

---

## Reference Insights (WebGPU Flow Field)

**Applicable to our WebGL 2 pipeline:**
- ✅ Gentle drift speed (~0.003 wandering, 5-15 px/s measured)
- ✅ Bloom params (0.12/0.05/0.25)
- ✅ ACES tonemapping (already have)
- ✅ Additive blending (already have)

**Not directly portable (WebGPU-specific):**
- ❌ Compute shaders (can approximate with vertex shader or simplified approach)
- ❌ Storage buffers (can use vertex attributes + update pattern)
- ❌ TSL node system (we write GLSL directly)

**Key takeaway:** The AESTHETIC is achievable in WebGL 2, but implementation differs.

---

## Success Metrics

**To achieve reference parity:**

1. [ ] Cat structure clearly visible at default load (no manual slider needed)
2. [ ] Soft ethereal smoke quality (not grainy/static)
3. [ ] Gentle flowing motion visible (5-15 px/s drift)
4. [ ] Bloom creates continuous haze (not isolated halos)
5. [ ] Particles blend into each other in mid-density areas
6. [ ] No white blowout (already achieved ✅)
7. [ ] Colors vibrant (browns/beiges/blacks) (already achieved ✅)

**Current score:** 2/7 (tonemapping + colors working; motion, bloom balance, continuity, default size all missing)

---

## Next Steps

**Recommended order:**

1. **Fix `uPointBaseSize` default** (quick win, makes cat visible on load)
2. **Adjust bloom to reference params** (quick test, likely big visual improvement)
3. **Add simple drift motion** (shader change, proof of concept)
4. **Iterate on bloom + motion balance** (parameter tuning)
5. **Consider curl-noise flow if needed** (more complex, may not be necessary)

**Time estimate:**
- Steps 1-2: 15 minutes (parameter changes)
- Step 3: 30-60 minutes (shader implementation)
- Step 4: User testing and iteration

**Risk:** Motion implementation might require more architectural changes than expected. Start with simplest approach (uniform time offset) and iterate.
