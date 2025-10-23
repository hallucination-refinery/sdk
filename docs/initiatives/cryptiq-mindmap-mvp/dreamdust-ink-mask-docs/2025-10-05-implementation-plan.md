# Dreamdust Aesthetic Implementation Plan — 2025-10-05

Revision R1 (post-critique corrections):
- Use shader `#define` to switch kernels (no runtime string splicing)
- Add additive blending depthTest A/B (B1/B2 and D1/D2)
- Fix `dd_saturate` usage (use clamp or include chunk)
- Control reveal gating during captures to avoid cellular voids
- Add color-attribute first-paint guard before testing
- Note premultiplied-alpha considerations for additive

## Goal

Implement a 4-preset test matrix (A/B/C/D) to empirically determine the minimal set of changes needed to achieve "ethereal dust" quality matching the Fojcik reference frames. Use objective acceptance criteria and stop conditions to avoid over-engineering.

## Context

Based on `2025-10-05-aesthetic-assessment.md`, the primary hypotheses are:
1. **Kernel shape** - Gaussian tail eliminates pellet edges (PSF argument)
2. **Blending mode** - Additive accumulation creates soft halos in dense regions
3. **Depth desaturation** - Far points fade to gray/black for atmospheric depth
4. **Bloom tuning** - Current settings too conservative (0.8/0.2)

Current state: Iteration 04 params applied, color attribute bug persists on first load.

## Test Matrix

| Preset | Kernel | Blending | Bloom (thresh/strength) | Purpose |
|--------|--------|----------|-------------------------|---------|
| **A** | Disc | Alpha | 0.8 / 0.2 | Baseline (current) |
| **B1** | Disc | Additive (depthTest=true) | 0.6 / 0.5-0.8 | Test additive with occlusion |
| **B2** | Disc | Additive (depthTest=false) | 0.6 / 0.5-0.8 | Test additive without occlusion |
| **C** | Gaussian | Alpha | 0.7 / 0.35-0.6 | Test kernel hypothesis |
| **D1** | Gaussian | Additive (depthTest=true) | 0.6 / 0.5 | Combined with occlusion |
| **D2** | Gaussian | Additive (depthTest=false) | 0.6 / 0.5 | Combined without occlusion |

## Acceptance Criteria (Per Preset)

Evaluate at 100% zoom on:
- **ROI 1:** Cat chest (mid-density foreground)
- **ROI 2:** Background curtain (low-density, depth test)

| Check | Pass Condition |
|-------|----------------|
| Pellet visibility | Individual dot edges NOT discernible in mid-density |
| Haze continuity | Background shows continuous tone, no cellular voids |
| Highlight behavior | Dense regions merge smoothly, no donut rings |
| Depth cue | Distant regions visibly darker/desaturated vs near |

## Stop Conditions

- If any of **B1/B2 (Additive+Disc)** passes all 4 checks → Skip Gaussian kernel, apply that additive variant + depth desat
- If both B1 and B2 fail pellet/donut but **C (Gaussian+Alpha)** passes → Apply Gaussian kernel
- If only one of **D1/D2 (Additive+Gaussian)** passes → Adopt that variant (occluding or non‑occluding)
- If none pass → Reassess assumptions, consult assessment unknowns

---

## Implementation Steps

### Phase 1: Setup Test Infrastructure (Est. 30-45 min)

#### Step 1.0: One‑shot Color Attribute Guard

Add a diagnostic in the stage/component that attaches attributes to ensure color is present and normalized before first render. This prevents false negatives in A/B captures.

**File:** `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` (where geometry is built)

**Add (one‑shot log):**
```ts
const col = geometry.getAttribute('color') as THREE.BufferAttribute | undefined
if (!col || col.count !== positionAttribute.count || col.normalized !== true) {
  console.warn('[dreamdust] color attribute missing or not normalized', {
    present: !!col, count: col?.count, normalized: col?.normalized,
  })
}
```

#### Step 1.1: Add Preset Selector to Debug Panel

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/debug/useDebugControls.ts`

**Changes:**
1. Add to debug state interface:
   ```typescript
   aestheticPreset: 'current' | 'A' | 'B' | 'C' | 'D'
   ```

2. Add to initial state:
   ```typescript
   aestheticPreset: 'current'
   ```

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/ui/DebugHud.tsx`

**Changes:**
1. Add preset selector dropdown before existing controls:
   ```tsx
   <div>
     <label>Test Preset:</label>
     <select
       value={ui.aestheticPreset}
       onChange={(e) => setUi(s => ({ ...s, aestheticPreset: e.target.value }))}
     >
       <option value="current">Current (Iteration 04)</option>
       <option value="A">A: Alpha+Disc (baseline)</option>
       <option value="B">B: Additive+Disc</option>
       <option value="C">C: Alpha+Gaussian</option>
       <option value="D">D: Additive+Gaussian</option>
     </select>
   </div>
   ```

**Validation:** Dropdown appears, selection updates state, no errors

---

#### Step 1.2: Plumb Preset to Material

**File:** `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`

**Changes:**
1. Pass `aestheticPreset` from debug UI to material creation:
   ```typescript
   // Around line 1130 where prebakedMaterial is created
   const prebakedMaterial = React.useMemo(() => {
     if (!runtimeCaps) return null
     const material = createDreamdustMaterial(uniforms, {
       unproject: false,
       vertexInkOk: runtimeCaps.vertexInkOk ?? false,
       debugInkProbe,
       debugSimProbe,
       debugForceAlpha,
       debugVertexLog,
       aestheticPreset: ui.aestheticPreset, // ADD THIS
     })
     // ... rest
   }, [/* add ui.aestheticPreset to deps */])
   ```

2. Update dependency array to include `ui.aestheticPreset`

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`

**Changes:**
1. Add to `DreamdustMaterialOptions` interface (~line 600):
   ```typescript
   aestheticPreset?: 'current' | 'A' | 'B' | 'C' | 'D'
   ```

2. Extract preset in `createDreamdustMaterial` function (~line 650):
   ```typescript
   const preset = options.aestheticPreset ?? 'current'
   ```

**Validation:** Material recreates when preset changes, no console errors

---

### Phase 2: Implement Kernel Options (Est. 45-60 min)

#### Step 2.1: Add Gaussian Kernel Chunk (static)

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`

**Changes:**
1. Add new Gaussian sprite function after existing `DREAMDUST_SOFT_SPRITE_CHUNK` (~line 150):
   ```glsl
   // Gaussian kernel with long tail (for "ethereal dust" quality)
   float dreamdustGaussianSprite(vec2 uv, float sharpness) {
     vec2 c = uv * 2.0 - 1.0;
     float r2 = dot(c, c);
     return exp(-r2 * sharpness);
   }
   ```

2. Export as constant:
   ```typescript
   export const DREAMDUST_GAUSSIAN_SPRITE_CHUNK = /* glsl */ `
   float dreamdustGaussianSprite(vec2 uv, float sharpness) {
     vec2 c = uv * 2.0 - 1.0;
     float r2 = dot(c, c);
     return exp(-r2 * sharpness);
   }
   `
   ```

**Validation:** No syntax errors, chunk exports correctly

---

#### Step 2.2: Add Sprite Sharpness Uniform

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`

**Changes:**
1. Add to `DEFAULT_UNIFORM_VALUES` (~line 90):
   ```typescript
   uSpriteSharpness: 4.0, // Gaussian tail control (higher = sharper)
   ```

2. Add to fragment shader uniforms string (~line 450):
   ```glsl
   uniform float uSpriteSharpness;
   ```

**Validation:** Uniform appears in material, no compile errors

---

#### Step 2.3: Conditional Kernel Selection via `#define`

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`

**Changes:**
1. Import Gaussian chunk at top:
   ```typescript
   import {
     // ... existing imports
     DREAMDUST_GAUSSIAN_SPRITE_CHUNK,
   } from './glsl/chunks'
   ```

2. Keep both sprite functions compiled and switch with a define:
   - In fragment shader (sprite calc site):
   ```glsl
   float sprite = dreamdustSoftSprite(gl_PointCoord);
   #ifdef USE_GAUSSIAN
     sprite = dreamdustGaussianSprite(gl_PointCoord, uSpriteSharpness);
   #endif
   ```

3. Toggle define in material based on preset:
   ```ts
   const useGaussian = preset === 'C' || preset === 'D1' || preset === 'D2'
   if (useGaussian) material.defines.USE_GAUSSIAN = 1; else delete material.defines.USE_GAUSSIAN
   material.needsUpdate = true
   ```

**Validation:**
- Preset A/B1/B2: Disc sprite (existing behavior)
- Preset C/D1/D2: Gaussian sprite (softer particles)
- No shader compile errors; no dynamic string splicing

---

### Phase 3: Implement Blending Mode Toggle (Est. 15–20 min)

#### Step 3.1: Apply Blending Based on Preset

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`

**Changes:**
1. After material creation (~line 660):
   ```typescript
   const material = new THREE.ShaderMaterial({
     // ... existing params
   })

   // Apply preset-specific blending
   const useAdditive = preset === 'B1' || preset === 'B2' || preset === 'D1' || preset === 'D2'
   if (useAdditive) {
     material.blending = THREE.AdditiveBlending
     // Keep premultipliedAlpha=true; additive ignores dest alpha but it’s fine
     // A/B occlusion policy via depthTest
     const occluding = preset === 'B1' || preset === 'D1'
     material.depthTest = occluding
   } else {
     material.blending = THREE.NormalBlending
     material.transparent = true
     material.depthWrite = false
   }
   ```

2. Note on premultiplied alpha: our fragment outputs premultiplied alpha; keep `premultipliedAlpha: true` consistent across presets.

**Validation:**
- Preset A/C: Alpha blending (current behavior)
- Preset B/D: Additive blending (brighter overlaps, no depth sorting)

---

### Phase 4: Implement Bloom Tuning (Est. 10–15 min)

**File:** `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`

**Changes:**
1. Update bloom settings based on preset (~line 90, `BLOOM_SETTINGS`):
   ```typescript
   const bloomSettings = React.useMemo(() => {
     switch (ui.aestheticPreset) {
       case 'A':
         return { strength: 0.2, radius: 0.4, threshold: 0.8 } // Current baseline
       case 'B1':
         return { strength: 0.65, radius: 0.4, threshold: 0.6 } // Aggressive for additive
       case 'B2':
         return { strength: 0.65, radius: 0.4, threshold: 0.6 }
       case 'C':
         return { strength: 0.45, radius: 0.5, threshold: 0.7 } // Slightly larger radius for Gaussian tails
       case 'D1':
         return { strength: 0.5, radius: 0.5, threshold: 0.6 }
       case 'D2':
         return { strength: 0.5, radius: 0.5, threshold: 0.6 }
       default:
         return { strength: 0.2, radius: 0.4, threshold: 0.8 } // Current iteration 04
     }
   }, [ui.aestheticPreset])
   ```

2. Apply to UnrealBloomPass creation (~line 2700):
   ```typescript
   const bloomPass = new UnrealBloomPass(
     new THREE.Vector2(width, height),
     bloomSettings.strength,
     bloomSettings.radius,
     bloomSettings.threshold
   )
   ```

3. Update dependencies to recreate bloom when preset changes

**Validation:** Switching presets visibly changes bloom intensity

---

### Phase 5: Additional Improvements (Optional, Est. 30 min)

#### Step 5.1: Depth Desaturation (Recommended for all presets)

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`

**Changes:**
1. In fragment shader, before rim application (~line 570):
   ```glsl
   // Depth-based desaturation/darkening
   float dn = dreamdustViewDepthNorm(vPosMV, uDepthNormScale);
   float dAmt = clamp(dn * 0.25, 0.0, 1.0); // use clamp; or include DD_SAT chunk explicitly
   float luma = dot(color, vec3(0.299, 0.587, 0.114));
   vec3 gray = vec3(luma);
   color = mix(color, gray, dAmt);
   color *= (1.0 - 0.25 * dAmt);
   ```

**Validation:** Distant particles visibly darker/grayer than near

---

#### Step 5.2: Rim Reduction (Recommended, prevents outlined pellets)

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/glsl/chunks.ts`

**Changes:**
1. Reduce rim light mix (~line 169):
   ```glsl
   vec3 dreamdustApplyRimLight(vec3 color, float rimStrength) {
     return mix(color, vec3(1.0), rimStrength * 0.01); // Was 0.05
   }
   ```

2. Increase rim gamma to compress to edges:
   ```typescript
   // In DreamdustMaterial.ts DEFAULT_UNIFORM_VALUES
   uRimGamma: 10.0, // Was 8.0
   ```

**Validation:** White outlines on particles barely visible or gone

---

### Phase 6: Testing Protocol (Est. 60–75 min)

#### Step 6.1: Prepare Test Environment

1. **Kill existing dev server:**
   ```bash
   lsof -ti:3000 | xargs kill
   ```

2. **Clean build cache:**
   ```bash
   rm -rf apps/cryptiq-mindmap-demo/.next
   ```

3. **Start production build:**
   ```bash
   pnpm --filter cryptiq-mindmap-demo run build
   pnpm --filter cryptiq-mindmap-demo run start
   ```

4. **Navigate to test URL:**
   ```
   http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-02&debug=1&engine=sim
   ```

5. **Camera setup:**
   - Frame cat silhouette centered
   - Zoom to show full figure + background
   - Note camera position/rotation from debug panel for consistency

---

#### Step 6.2: Capture Screenshots for Each Preset

**For each preset (A, B1, B2, C, D1, D2):**

1. Select preset from dropdown
2. Wait 3 seconds for render to stabilize
3. Hide debug panel (if blocking view)
4. Capture full window screenshot:
   - **Filename:** `2025-10-05-preset-{A|B|C|D}-full.png`
   - **Path:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/assets/`

5. Zoom to 200% on ROI 1 (cat chest, mid-density)
   - Capture: `2025-10-05-preset-{A|B|C|D}-roi1-chest.png`

6. Zoom to 200% on ROI 2 (background curtain, depth)
   - Capture: `2025-10-05-preset-{A|B|C|D}-roi2-background.png`

7. Reset zoom, next preset

Optional quantitative check: For ROI crops, derive a radial intensity profile (64×64 crop) to visualize edge monotonicity (pellet vs Gaussian tail).

**Total artifacts:** 18 screenshots (6 presets × 3 views each)

---

#### Step 6.3: Evaluate Against Acceptance Criteria

**Create evaluation doc:** `2025-10-05-preset-evaluation.md`

**Template per preset:**

```markdown
## Preset {A|B|C|D}: {Kernel}+{Blending}

### Pellet Visibility (ROI 1: Cat Chest)
- [ ] PASS: Individual dot edges NOT discernible at 100% zoom
- [ ] FAIL: Visible circular boundaries, pellet structure

**Evidence:** See `2025-10-05-preset-{X}-roi1-chest.png`

### Haze Continuity (ROI 2: Background)
- [ ] PASS: Continuous tone, no cellular voids
- [ ] FAIL: Honeycomb pattern, discrete gaps

**Evidence:** See `2025-10-05-preset-{X}-roi2-background.png`

### Highlight Behavior (ROI 1: Dense regions)
- [ ] PASS: Smooth merged light, no donut rings
- [ ] FAIL: Visible ring artifacts around bright spots

**Evidence:** See `2025-10-05-preset-{X}-roi1-chest.png`

### Depth Cue (ROI 2: Background vs Foreground)
- [ ] PASS: Background visibly darker/desaturated
- [ ] FAIL: Uniform color across depth

**Evidence:** Compare full screenshots

### Overall Assessment
- **Pass all 4?** YES / NO
- **Notes:** [Subjective observations]
```

---

#### Step 6.4: Apply Stop Conditions

**Decision tree:**

```
IF Preset B passes all 4 checks:
  → DONE: Apply additive blending + bloom tuning + depth desat
  → Skip Gaussian kernel
  → Document in iteration doc

ELSE IF Preset B fails pellet/donut BUT Preset C passes all 4:
  → DONE: Apply Gaussian kernel + existing alpha blend + depth desat
  → Skip additive blending
  → Document kernel as critical change

ELSE IF only Preset D passes all 4:
  → DONE: Apply full stack (Gaussian + additive + bloom + depth desat)
  → Document both kernel and blending required

ELSE IF none pass:
  → REASSESS: Review assessment unknowns
  → Check color attribute bug impact
  → Consider reference bundle may target different aesthetic
  → Consult with user before next iteration
```

---

### Phase 7: Implementation of Winning Preset (Est. 15 min)

Once evaluation determines winning preset:

1. **Update default values** in `DreamdustMaterial.ts` to match winning preset
2. **Remove preset selector** from debug UI (or keep as "advanced" toggle)
3. **Update bloom constants** in `PointCloudStage.tsx`
4. **Add depth desaturation** if not already applied
5. **Remove rim outline** if not already reduced
6. **Git commit** with message referencing evaluation doc
7. **Capture final screenshot** for documentation

---

## File Manifest (Expected Changes)

| File | Changes |
|------|---------|
| `useDebugControls.ts` | Add `aestheticPreset` state |
| `DebugHud.tsx` | Add preset selector dropdown |
| `PointCloudStage.tsx` | Pass preset to material, dynamic bloom settings |
| `DreamdustMaterial.ts` | Gaussian kernel option, blending toggle, depth desat, preset plumbing |
| `glsl/chunks.ts` | Add `dreamdustGaussianSprite`, reduce rim light |

## Time Estimate

- Phase 1 (Setup): 30-45 min
- Phase 2 (Kernel): 45-60 min
- Phase 3 (Blending): 15 min
- Phase 4 (Bloom): 10 min
- Phase 5 (Improvements): 30 min (optional, can do after evaluation)
- Phase 6 (Testing): 60 min
- Phase 7 (Finalize): 15 min

**Total: 3-4 hours** (can be split across multiple sessions)

## Success Criteria

- All 4 presets render without errors
- Screenshots captured for objective comparison
- At least one preset passes all 4 acceptance checks
- Winning preset applied and documented
- Visual quality measurably closer to Fojcik reference frames

## Rollback Plan

If all presets fail or introduce regressions:

1. Revert to Iteration 04 parameters (current git state)
2. Document findings in failure analysis doc
3. Reassess underlying assumptions about disc sprite limitation
4. Consider alternative approaches (different particle density, post-processing only, etc.)

---

## Notes

- **Color bug:** If colors still don't render on first load during testing, add explicit `geometry.attributes.color.needsUpdate = true` assertion before captures
- **Performance:** Monitor FPS during additive blending tests; if drops below 60fps on real hardware, note in evaluation
- **Reference comparison:** Keep Fojcik frames open during evaluation for side-by-side visual comparison
- **Subjectivity guard:** Use the 4 objective checks first; only add subjective notes after pass/fail determination

---

## Next Steps After Completion

1. Create `2025-10-05-preset-evaluation.md` with findings
2. Update aesthetic iteration documentation with winning approach
3. If aesthetics achieved: Move to interactive implementation (tap/stroke)
4. If aesthetics not achieved: Reassess with user, consider alternative techniques
6. **Freeze reveal and gating for captures:**
   - Force `uReveal=1.0` during captures.
   - Either widen reveal transition `w` from 0.08 → 0.14 or bypass noise gating when `uReveal>=0.999` to avoid imprinted cellular voids.

## R1 Implementation Status — 2025-10-05

- Shader toggles for Gaussian sprites, additive blending, and depth desaturation are implemented (`DreamdustMaterial.ts`, `glsl/chunks.ts`).
- Debug preset selector and bloom preset plumbing land in `PointCloudStage.tsx`, `useDebugControls.ts`, and `DebugHud.tsx`.
- Evaluation template (`2025-10-05-preset-evaluation.md`) created; screenshot capture pending due to non-interactive environment.
