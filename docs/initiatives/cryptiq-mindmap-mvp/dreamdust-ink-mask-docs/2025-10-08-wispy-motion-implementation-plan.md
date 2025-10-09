# Wispy/Smokey Motion Implementation Plan
**Date:** 2025-10-08
**Status:** Planning
**Goal:** Add organic, gentle drift motion quality to Dreamdust point clouds, inspired by the WebGPU flow field reference

---

## Executive Summary

We need to adapt the "wandering" motion from Pavel Mazhuga's WebGPU flow field demo to our vertex shader-based approach. The reference uses 4D curl noise (position + time) with a very slow `wanderingSpeed: 0.003` to create continuous organic drift. Our current implementation uses 3D curl noise with time as a spatial offset, which may be producing motion that's too uniform or too fast.

**Key insight from reference:** The wispy quality comes from **continuous baseline wandering** (curlNoise4d × wanderingSpeed) that's always active, separate from any interaction-driven motion. This creates gentle, organic drift that feels alive.

---

## Current State Analysis

### Architecture: Vertex Shader-Based (Stateless)
- **File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
- **Shader:** Lines 176-470 (vertex shader)
- **Motion implementation:** Lines 363-380

### Current Motion System

**Key code (vertex shader, lines 363-380):**
```glsl
vec3 curlSample = revealPos * uCurlFreq + vec3(uTime * uDriftSpeed);
float cascadeMix = clamp(uCascade, 0.0, 1.0);
float vaporGain = max(uVaporGain, 0.0);
float curlFade = 1.0 - 0.7 * settle;
float curlMix = (uDriftAmp + tapImpulse) * uCurlAmp * curlFade;
float curlBoost = mix(1.0, 4.0, cascadeMix);
float vaporBoost = 1.0 + vaporGain * cascadeMix;
curlMix *= curlBoost * vaporBoost;
vec3 curlOffset = dd_curl3(curlSample) * curlMix;
revealPos += curlOffset;

if (cascadeMix > 1e-5) {
  vec3 vaporSample = curlSample * 0.75
    + vec3(uTime * 0.21 * uEvolution, uTime * 0.13 * uEvolution, uTime * 0.07 * uEvolution);
  vec3 vaporFlow = dd_fbm3Vec(vaporSample) - vec3(0.5);
  float vaporStrength = cascadeMix * (0.35 + vaporGain * 0.85);
  revealPos += vaporFlow * vaporStrength;
}
```

**Curl noise implementation (`chunks.ts`, lines 366-391):**
```glsl
vec3 dd_curl3(vec3 dd_p) {
  const float dd_eps = 0.1;
  // ... finite difference curl of fbm3Field ...
  return dd_curl / dd_len;  // normalized
}
```

**Current uniforms (DreamdustMaterial.ts, lines 51-98):**
- `uTime: 0` - global time
- `uDriftSpeed: 0.05` - time coefficient for motion (potentially too fast)
- `uDriftAmp: 0.28` - base drift amplitude
- `uCurlFreq: 1` - curl noise frequency
- `uCurlAmp: 0.35` - curl amplitude multiplier
- `uEvolution: 0.85` - vapor evolution speed
- `uVaporGain: 0` - vapor effect gain (cascade mode)

### Limitations vs WebGPU Reference

1. **Time integration:** We add time as spatial offset `vec3(uTime * uDriftSpeed)`, WebGPU uses true 4D noise `curlNoise4d(vec4(position, time))`
2. **Speed mismatch:** Our `uDriftSpeed: 0.05` vs reference `wanderingSpeed: 0.003` (16× faster!)
3. **Motion character:** Our curl is modulated by settle/cascade/tap - not always a baseline wander
4. **Normalization:** Our `dd_curl3` normalizes to unit vector, then scales - WebGPU doesn't normalize curl result

---

## WebGPU Reference Analysis

### Motion Architecture (Compute-Based, Stateful)

**Source:** `2025-10-06-flow-field-webgpu-reference-analysis.md`

**Key code (demo.ts update compute, lines 80-83):**
```typescript
// Flow field (curl noise) + wandering baseline
const flowField = curlNoise4d(vec4(position, time)).toVar();
const wandering = flowField.mul(this.uniforms.wanderingSpeed);
position.addAssign(wandering.add(flowField.mul(deltaTime).mul(strength)));
```

**Curl 4D implementation (curlNoise4d.ts):**
```typescript
export const curlNoise4d = Fn(([p_immutable]) => {
  const p = vec4(p_immutable).toVar();
  const e = float(0.1);
  // finite differences in 3D space (x,y,z) with 4th component = time
  // ... curl of 3D simplex noise ...
  return normalize(vec3(x, y, z).mul(divisor));
});
```

**Parameters:**
- `wanderingSpeed: 0.003` - **continuous baseline drift** (very slow)
- `turbFriction: 0.01` - velocity damping
- Separate strength-gated push: `flowField * deltaTime * strength`

### Key Differences

| Aspect | Our Implementation | WebGPU Reference |
|--------|-------------------|------------------|
| **Noise dimension** | 3D curl (position only) | 4D curl (position + time) |
| **Time integration** | Spatial offset `+ vec3(t * speed)` | 4th dimension `vec4(pos, time)` |
| **Baseline wander** | Mixed with other effects | Always active, separate term |
| **Speed** | `uDriftSpeed: 0.05` | `wanderingSpeed: 0.003` |
| **Normalization** | Normalized then scaled | Not normalized |
| **Architecture** | Stateless vertex shader | Stateful compute shader |

---

## Implementation Strategy

### Approach: Hybrid Enhancement (Preserve Vertex Shader Architecture)

We **cannot** replicate the exact WebGPU approach (compute shaders, per-particle state) within our vertex shader constraints. However, we can **adapt the core concept** of continuous baseline wandering.

**Philosophy:** Introduce a **separate, always-on wander term** using improved time integration, running at much slower speed.

### Three-Phase Plan

---

## Phase 1: Add 4D-Style Curl Noise (Time as 4th Dimension)

**Goal:** Replace spatial time offset with proper 4D curl noise sampling.

**Current (spatial offset):**
```glsl
vec3 curlSample = revealPos * uCurlFreq + vec3(uTime * uDriftSpeed);
vec3 curlOffset = dd_curl3(curlSample) * curlMix;
```

**Proposed (4D-style):**
```glsl
// New uniform: uWanderSpeed (default: 0.003)
vec3 curlSample = revealPos * uCurlFreq;
float timeDim = uTime * uWanderSpeed;
vec3 curlOffset = dd_curl4(curlSample, timeDim) * curlMix;
```

### Subtasks:

#### 1.1 Implement `dd_curl4()` helper in chunks.ts

**Location:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`

Add new curl4 implementation after DD_CURL3 (after line 391):

```glsl
/**
 * 4D curl noise: curl of 3D FBM field with time as 4th dimension.
 * Adapted from Pavel Mazhuga's curlNoise4d for vertex shader use.
 *
 * @param p vec3 spatial position
 * @param t float time dimension
 * @returns vec3 divergence-free curl vector (not normalized)
 */
vec3 dd_curl4(vec3 dd_p, float dd_t) {
  const float dd_eps = 0.1;
  vec3 dd_dx = vec3(dd_eps, 0.0, 0.0);
  vec3 dd_dy = vec3(0.0, dd_eps, 0.0);
  vec3 dd_dz = vec3(0.0, 0.0, dd_eps);

  // Time offset samples (4th dimension)
  float dd_t_eps = dd_eps;

  // Sample FBM field at p±dx,dy,dz with time influence
  // Time affects noise by offsetting in a consistent direction
  vec3 dd_time_offset = vec3(dd_t * 0.17, dd_t * 0.23, dd_t * 0.31);

  vec3 dd_fx1 = dd_fbm3Field(dd_p + dd_dx + dd_time_offset);
  vec3 dd_fx2 = dd_fbm3Field(dd_p - dd_dx + dd_time_offset);
  vec3 dd_fy1 = dd_fbm3Field(dd_p + dd_dy + dd_time_offset);
  vec3 dd_fy2 = dd_fbm3Field(dd_p - dd_dy + dd_time_offset);
  vec3 dd_fz1 = dd_fbm3Field(dd_p + dd_dz + dd_time_offset);
  vec3 dd_fz2 = dd_fbm3Field(dd_p - dd_dz + dd_time_offset);

  float dd_inv2eps = 0.5 / dd_eps;
  vec3 dd_curl;
  dd_curl.x = (dd_fz1.y - dd_fz2.y) * dd_inv2eps - (dd_fy1.z - dd_fy2.z) * dd_inv2eps;
  dd_curl.y = (dd_fx1.z - dd_fx2.z) * dd_inv2eps - (dd_fz1.x - dd_fz2.x) * dd_inv2eps;
  dd_curl.z = (dd_fy1.x - dd_fy2.x) * dd_inv2eps - (dd_fx1.y - dd_fx2.y) * dd_inv2eps;

  // DO NOT normalize - preserve curl magnitude for organic variation
  return dd_curl;
}

#define DD_CURL4(p, t) dd_curl4(p, t)
```

**Export:** Add `DD_CURL4` to chunks.ts exports and glslChunks registry.

**Rationale:**
- Uses time as continuous offset in noise space (simulates 4th dimension)
- Preserves curl magnitude (unlike dd_curl3 which normalizes)
- Prime number coefficients (0.17, 0.23, 0.31) for non-repeating temporal evolution

#### 1.2 Add `uWanderSpeed` uniform

**File:** `DreamdustMaterial.ts`

**Location:** Line 61 (after uDriftSpeed)

```typescript
uWanderSpeed: 0.003,  // Very slow baseline wander (matching WebGPU reference)
```

**Also update:**
- VERTEX_SHADER uniform declarations (line 193)
- Type definitions if needed

#### 1.3 Update vertex shader to use dd_curl4

**File:** `DreamdustMaterial.ts`
**Location:** Lines 363-372

**Before:**
```glsl
vec3 curlSample = revealPos * uCurlFreq + vec3(uTime * uDriftSpeed);
// ...
vec3 curlOffset = dd_curl3(curlSample) * curlMix;
```

**After:**
```glsl
vec3 curlSample = revealPos * uCurlFreq;
vec3 curlOffset = dd_curl4(curlSample, uTime * uWanderSpeed) * curlMix;
```

**Import:** Add DD_CURL4 to chunk imports (line 264):
```glsl
${DD_CURL4}
```

---

## Phase 2: Separate Baseline Wander from Modulated Motion

**Goal:** Split curl motion into two terms - continuous baseline wander (always on) and modulated drift (interaction/cascade).

**Current (single curl term):**
```glsl
float curlMix = (uDriftAmp + tapImpulse) * uCurlAmp * curlFade;
vec3 curlOffset = dd_curl4(curlSample, uTime * uWanderSpeed) * curlMix;
revealPos += curlOffset;
```

**Proposed (two-term):**
```glsl
// Baseline wander - always active, very slow
vec3 wanderSample = revealPos * uWanderFreq;
vec3 wanderOffset = dd_curl4(wanderSample, uTime) * uWanderAmp;

// Modulated drift - affected by settle, tap, cascade
float curlMix = (uDriftAmp + tapImpulse) * uCurlAmp * curlFade;
vec3 driftSample = revealPos * uCurlFreq;
vec3 driftOffset = dd_curl4(driftSample, uTime * uDriftSpeed) * curlMix;

// Apply both
revealPos += wanderOffset + driftOffset;
```

### Subtasks:

#### 2.1 Add wander-specific uniforms

**File:** `DreamdustMaterial.ts`
**Lines:** ~61-70

New uniforms:
```typescript
uWanderFreq: 0.5,    // Lower frequency for larger, slower swirls
uWanderAmp: 0.015,   // Very small amplitude for subtle continuous motion
```

Keep existing:
- `uWanderSpeed: 0.003` (from Phase 1)
- `uCurlFreq: 1` (for modulated drift)
- `uCurlAmp: 0.35` (for modulated drift)

#### 2.2 Split curl application in vertex shader

**File:** `DreamdustMaterial.ts`
**Lines:** 363-380

Replace entire curl section with two-term approach (see code above).

**Rationale:**
- Baseline wander uses lower frequency (0.5) for larger, more organic swirls
- Wander amplitude is tiny (0.015) for subtle continuous motion
- Modulated drift keeps existing logic (tap impulse, cascade, settle fade)
- Both terms use dd_curl4 for consistent temporal coherence

---

## Phase 3: Tuning & Refinement

**Goal:** Empirically tune parameters to match reference aesthetic quality.

### 3.1 Parameter Ranges to Test

**Wander system (baseline):**
- `uWanderSpeed`: 0.001 - 0.005 (reference: 0.003)
- `uWanderFreq`: 0.3 - 0.8 (lower = larger swirls)
- `uWanderAmp`: 0.005 - 0.03 (higher = more visible drift)

**Drift system (modulated):**
- `uDriftSpeed`: 0.02 - 0.1 (may need to reduce from current 0.05)
- `uCurlFreq`: 0.5 - 1.5 (current: 1)
- `uCurlAmp`: 0.2 - 0.5 (current: 0.35)

### 3.2 Testing Protocol

**Route:** `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&controls=1&cinematic=1`

**Observation criteria:**
1. **Subtle baseline motion:** Points should drift gently even when idle (no interaction)
2. **Organic swirls:** Motion should follow coherent flow patterns, not random jitter
3. **Speed check:** Drift should be **slow** - reference speed ~5-15 px/s at 720p
4. **No strobing:** Temporal coherence should prevent flickering/popping
5. **Wispy trails:** If bloom is enabled, should see gentle ethereal halos following motion

**Debug controls to add:**
- Expose wander uniforms in debug panel (uWanderSpeed, uWanderFreq, uWanderAmp)
- Add toggle to disable wander (for A/B comparison)
- Add toggle to disable drift (to isolate baseline wander)

### 3.3 Visual Reference Targets

**From WebGPU demo observations:**
- Particles drift in coherent swirls (not chaotic)
- Motion is **continuous** (always moving, even without cursor)
- Speed is **glacial** at baseline, faster near cursor
- Bloom halos trail behind motion, creating wispy tendrils

**Match these qualities:**
1. Continuous gentle drift (always visible if you watch a few particles)
2. Coherent flow patterns (neighboring particles move similarly)
3. Slow enough that individual particles are trackable
4. Fast enough to feel alive (not static)

---

## Technical Considerations

### Vertex Shader Constraints

**We cannot replicate:**
- Per-particle velocity accumulation (stateless)
- Life-based resets (no persistent state)
- Distance-based decay (no base position memory)

**We can achieve:**
- Continuous coherent drift via time-varying curl
- Separation of baseline vs modulated motion
- Speed/frequency/amplitude tuning

### Performance Impact

**Phase 1 (dd_curl4):**
- Adds ~6 FBM samples per vertex (time offset variations)
- Similar cost to existing dd_curl3 (just different sampling pattern)
- **Estimated impact:** Negligible (<1% frame time)

**Phase 2 (two-term curl):**
- Doubles curl evaluations (wander + drift)
- Adds ~12 FBM samples total per vertex
- **Estimated impact:** +1-2% frame time (acceptable for 100k-500k point clouds)

**Optimization if needed:**
- Use lower octave FBM for wander (2 instead of 4)
- Reduce dd_eps from 0.1 to 0.15 for coarser finite differences
- Skip wander during reveal (settle < threshold)

### Debugging Strategy

1. **Phase 1 validation:**
   - Log curlOffset magnitude before/after dd_curl4 switch
   - Verify time dimension is advancing (console.log uTime value)
   - Check for NaN/Inf in curl results (use debug shader output)

2. **Phase 2 validation:**
   - Add color-coded visualization: wander = blue tint, drift = red tint
   - Render wander-only and drift-only modes for isolation
   - Measure motion speed (pixels/second) by tracking specific particles

3. **Phase 3 validation:**
   - Side-by-side comparison with WebGPU reference video/demo
   - User feedback on "feels wispy" vs "feels jittery"
   - Performance profiling (GPU frame time)

---

## Success Criteria

### Minimum Viable

- [ ] Baseline wander is **always visible** (continuous gentle drift)
- [ ] Motion is **slow** (~3-10 px/s without interaction)
- [ ] No visual regressions (reveal, cascade, tap still work)
- [ ] Performance stays within 1-2ms of current (60fps at 100k points)

### Ideal

- [ ] Motion character matches WebGPU reference (organic swirls, not random)
- [ ] Wander + drift combine smoothly (no visual discontinuity)
- [ ] Debug controls allow runtime tuning (no shader recompile needed)
- [ ] Works well with bloom (creates wispy trails)

### Stretch

- [ ] Expose wander params to aesthetic presets (different moods)
- [ ] Add secondary turbulence layer (micro-jitter for shimmer)
- [ ] Document parameter relationships in tuning guide

---

## Implementation Checklist

### Phase 1: 4D Curl Noise
- [ ] 1.1.a: Implement dd_curl4() in chunks.ts
- [ ] 1.1.b: Export DD_CURL4 and add to glslChunks registry
- [ ] 1.2.a: Add uWanderSpeed uniform (default: 0.003)
- [ ] 1.2.b: Add uWanderSpeed to vertex shader uniform declarations
- [ ] 1.3.a: Import DD_CURL4 chunk in vertex shader
- [ ] 1.3.b: Replace dd_curl3 with dd_curl4 in curl application
- [ ] 1.3.c: Test and verify motion still works

### Phase 2: Separate Baseline Wander
- [ ] 2.1.a: Add uWanderFreq uniform (default: 0.5)
- [ ] 2.1.b: Add uWanderAmp uniform (default: 0.015)
- [ ] 2.1.c: Add uniforms to vertex shader declarations
- [ ] 2.2.a: Implement two-term curl (wander + drift)
- [ ] 2.2.b: Test wander-only mode (disable drift)
- [ ] 2.2.c: Test drift-only mode (disable wander)
- [ ] 2.2.d: Verify both terms combine correctly

### Phase 3: Tuning & Refinement
- [ ] 3.1.a: Add wander controls to debug panel
- [ ] 3.1.b: Add wander/drift toggle switches
- [ ] 3.2.a: Test wander speed range (0.001-0.005)
- [ ] 3.2.b: Test wander frequency range (0.3-0.8)
- [ ] 3.2.c: Test wander amplitude range (0.005-0.03)
- [ ] 3.3.a: Compare visually with WebGPU reference
- [ ] 3.3.b: Measure motion speed (px/s)
- [ ] 3.3.c: Get user feedback on wispy quality
- [ ] 3.3.d: Document final parameter values

---

## Rollback Plan

If implementation causes issues:

**Phase 1 rollback:**
- Revert dd_curl4 to dd_curl3
- Remove uWanderSpeed uniform
- Keep spatial time offset: `vec3(uTime * uDriftSpeed)`

**Phase 2 rollback:**
- Keep single curl term (no wander/drift split)
- Remove uWanderFreq, uWanderAmp uniforms
- Preserve dd_curl4 if it works well

**Phase 3 rollback:**
- Disable debug controls (keep defaults)
- Document "known good" parameter values

---

## Future Enhancements (Post-MVP)

1. **Per-preset motion profiles:**
   - Current: subtle organic drift
   - A: minimal/frozen (low wander)
   - B1/B2: energetic/turbulent (high wander)
   - D1/D2: ethereal/floating (slow wander, high amplitude)

2. **Interaction-driven flow:**
   - Pointer attraction (like WebGPU reference)
   - Touch/draw creates local turbulence
   - Strength field gates extra motion

3. **Secondary layers:**
   - High-frequency shimmer (micro-scale noise)
   - Low-frequency swell (breath-like pulsing)
   - Depth-based speed variation (near points drift slower)

4. **Compute shader migration:**
   - If we eventually adopt WebGPU/TSL
   - Full particle system with velocity/life state
   - More complex motion models (flocking, vortices)

---

## References

- **WebGPU flow field analysis:** `2025-10-06-flow-field-webgpu-reference-analysis.md`
- **Demo URL:** https://pavelmazhuga.com/lab/flow-field/webgpu
- **Source code:** https://github.com/pavel-mazhuga/portfolio/tree/main/src/app/lab/flow-field/webgpu
- **Current shader:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
- **GLSL chunks:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`

---

**Plan created:** 2025-10-08
**Next session:** Implement Phase 1 (dd_curl4 + uWanderSpeed)
**Estimated time:** Phase 1: 30min, Phase 2: 45min, Phase 3: 1-2hr tuning

---

## 2025-10-08 Plan Audit — Dreamdust Wispy Motion
**Validation Status**
- ⚠️ PROCEED WITH CAUTION: The current dd_curl4 proposal mirrors today’s 3D curl flow, drops normalization, and omits several wiring steps, so shipping it as-is risks regressions without guaranteeing the targeted wispy drift.
**File Structure Verification**
- apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:366 still defines DD_CURL3 immediately before the helper block; dd_curl4 can land here and be registered beside curl3 at apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:426.
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:51 retains the default uniform block cited in the plan, with uDriftSpeed already reduced to 0.05 by commit eaeb102d.
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:183 opens the VERTEX_SHADER uniforms; insert uWanderSpeed/uWanderFreq/uWanderAmp next to uDriftSpeed at apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:193 to keep grouping intact.
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:264 currently embeds ${DD_CURL3}; this slot can import ${DD_CURL4} once exported.
- apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:363 and apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:375 still house the curl and vapor sections the plan targets, so replacements can stay localized.
**Risk Assessment**
- Critical – Switching to an unnormalized dd_curl4 will multiply offsets by raw gradient length while curlMix at apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:367 is tuned for unit vectors, risking runaway displacements across cascade modes.
- Critical – The drafted dd_curl4 simply adds a time offset to spatial samples (apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:366), identical to today’s vec3(uTime * uDriftSpeed) feed (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:363), so Phase 1 would not deliver the promised 4D curl behavior.
- Medium – Phase 2’s wander snippet (docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-08-wispy-motion-implementation-plan.md:256) passes raw uTime, bypassing the proposed uWanderSpeed and likely running ~16× hotter than the 0.003 target.
- Medium – Evaluating dd_curl4 twice doubles dd_fbm3Field work per vertex (apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:346), so GPU profiling is required to ensure 60 fps at 100k–500k particles.
- Medium – Replacing curlSample with driftSample must update the downstream vaporSample usage at apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:375; skipping this breaks compilation.
- Low – The draft keeps unused helpers (dd_t_eps at docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-08-wispy-motion-implementation-plan.md:171) and needs glslChunks wiring; leaving either behind will surface GLSL warnings and tooling gaps.
**Recommended Modifications to Plan**
- Replace dd_curl4 with an implementation that genuinely samples a time dimension (vec4 noise and finite-difference t) or keep curl3’s normalization semantics so drift tuning stays predictable (apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:366).
- Retain dd_curl3 for the cascade/tap-driven drift path while routing the gentle wander through any new helper, then migrate once tuning proves stable (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:363).
- Revise Phase 2 to call dd_curl4 with uTime * uWanderSpeed, and add the new uniforms beside the existing drift controls in both DEFAULT_UNIFORM_VALUES and VERTEX_SHADER (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:51, apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:193; docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-08-wispy-motion-implementation-plan.md:256).
- Keep curlSample (or alias driftSample) alive for vapor flow so the cascade boost at apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:375 continues to function.
- Extend glslChunks with a curl4 key while preserving curl3 (apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts:426) and plan for debug toggles that let wander/drift be isolated during tuning.
**Pre-Implementation Checklist**
- Capture current curlOffset magnitudes and motion references before edits to anchor tuning baselines (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:367).
- Land Phase 1 in isolation, run the project’s smoke/build commands, and confirm shader compilation before layering Phase 2 to simplify blame.
- Add temporary uniforms or debug toggles so wander and drift can be switched independently for A/B and quick rollback (apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts:364).
- Profile GPU cost (Spector, Chrome tracing) after adding the second curl evaluation to ensure frame time budgets survive at 100k–500k points.
- Keep a guarded dd_curl3 code path or flag so reverting to today’s behavior is a one-line switch if the wispy motion fails validation.
