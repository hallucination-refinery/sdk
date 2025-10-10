# Dreamdust Ink — Context Pack + Implementation Plan Audit
**Date:** 2025-10-10

## Findings & Recommendations

1. **Direction Alignment Strong** - 00-overview's "Right Direction" correctly emphasizes particles as ink with immediate force-field motion, palette cascade, and camera stability - this matches M1/M2 outcomes well.

2. **M1 Implementation Gap** - Current plan lacks concrete shader/material changes; no specification of uniforms (uForceVector, uForceDecay), position offset application, or decay cadence.

3. **M2 Cascade Missing** - No palette source definition, nearest-color logic, cascade timing parameters, or single commit toggle location specified.

4. **Runbooks Too Abstract** - Testing procedures lack specific URLs, gesture coordinates, expected visual outcomes, and console evidence capture.

5. **Risk Assessment Needed** - No identification of OrbitControls lock requirements, mirror flag propagation, or material recompilation triggers.

6. **Evidence Plan Incomplete** - Missing screenshot specifications and raw console block requirements for each milestone.

7. **M3/M4 Under-specified** - Gain defaults and baseline commands need explicit file paths and expected outputs.

## Issues (Ranked)

### BLOCKER: M1 Force-Field Implementation Details Missing
**Severity:** Blocker
**Files:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`, `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
**Why:** Without specific uniforms, transforms, and decay mechanics, M1 cannot deliver "undeniable motion" within 1-2 frames.
**Fix:** Add to 03-implementation-plan.md: "Add uForceVector (vec2), uForceDecay (float), uForceIntensity uniforms. Apply force to aOffset or aPosition in vertex shader with exponential decay. Update cadence: 60fps, decay rate 0.95 per frame."

### MAJOR: M2 Palette Cascade Logic Undefined
**Severity:** Major
**Files:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts`
**Why:** No palette source, nearest-color algorithm, or cascade timing prevents "hue rolls across all particles smoothly."
**Fix:** Add to 03-implementation-plan.md: "Define curated palette array [vec3[]]. Implement nearest-hue selection from gesture start color. Add uCascadeProgress (0-1), uCascadeColor uniforms with 2-3s lerp timing. Single commit flag: uCascadeCommit boolean."

### MINOR: Runbook Evidence Capture Insufficient
**Severity:** Minor
**Files:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/05-runbooks.md`
**Why:** Abstract procedures cannot verify "undeniable motion" or cascade without specific coordinates and expected visuals.
**Fix:** Update 05-runbooks.md with: "M1: Draw circle at viewport center (x: 512, y: 384). Expect particle displacement ≥5px within 2 frames. Screenshot before/after + `[PC] draw start/end` logs."

### MINOR: M3 Gain Tuning Not Actionable
**Severity:** Minor
**Files:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts`
**Why:** "Tune uTintGain/uOffsetGain/uCurlAmp defaults" lacks current values and target ranges.
**Fix:** Add to 03-implementation-plan.md: "Current defaults: uTintGain=0.3, uOffsetGain=0.1, uCurlAmp=0.05. Target: increase uOffsetGain to 0.3-0.5 for visible motion, reduce uTintGain to 0.1-0.2 to emphasize displacement over tint."

### MINOR: M4 Baseline Commands Incomplete
**Severity:** Minor
**Files:** `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/03-implementation-plan.md`
**Why:** "install → typecheck → lint → build → smoke" doesn't specify exact commands or expected outputs per repo conventions.
**Fix:** Update M4 steps: "Run: `pnpm install --frozen-lockfile`, `pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit`, `pnpm --filter cryptiq-mindmap-demo run lint`, `pnpm --filter cryptiq-mindmap-demo run build`, `pnpm run smoke`. Paste verbatim stdout."

## Redlined 03-implementation-plan.md

### Original M1 Steps (lines 5-8):
```
- Add a small per‑point displacement/velocity field in the stage/material (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx, DreamdustMaterial.ts).
- Feed a screen‑space force vector (from the existing input field) into the shader/uniforms; apply to positions (or offsets) with decay.
- Guardrails: maintain current mirror rules; ensure controls lock while drawing.
```

**Proposed Edits:**
```
- Add uniforms: `uForceVector` (vec2, screen-space direction), `uForceIntensity` (float, 0-1), `uForceDecay` (float, 0.9-0.99 per frame decay rate) in DreamdustMaterial.ts.
- Implement force application in vertex shader: `displacement += uForceVector * uForceIntensity * (1.0 - decay)`. Apply to `aOffset` or derived position.
- Update mechanism: set uForceVector from InkSurface pointer delta each frame; exponential decay when input stops.
- Guardrails: maintain current mirror rules; ensure controls lock while drawing; trigger material.needsUpdate on uniform changes.
```

### Original M2 Steps (lines 16-18):
```
- Add palette and nearest‑color selection util; expose palette editing in code.
- Implement timed cascade uniform(s): cascade mix, color, size/alpha boost; apply across all particles.
```

**Proposed Edits:**
```
- Define curated palette: `const CASCADE_PALETTE = [[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[0.5,0,0.5],[1,0.5,0]]` in DreamdustMaterial.ts.
- Add nearest-color util: find closest palette entry by RGB distance from gesture start color.
- Add uniforms: `uCascadeProgress` (0-1), `uCascadeColor` (vec3), `uCascadeSizeBoost` (float), `uCascadeCommit` (bool).
- Cascade timing: 2-3s lerp from current → target color; trigger on stroke end when `uCascadeCommit` set.
- Single commit location: InkSurface.tsx `onEnd` callback sets `uCascadeCommit = true` for strokes >2s duration.
```

### Original M3 Steps (lines 25-27):
```
- Tune uTintGain/uOffsetGain/uCurlAmp defaults; add soft ripple on tap.
- Rate‑limit or gate recurring logs; keep essential telemetry only.
```

**Proposed Edits:**
```
- Tune force-field gains: increase `uOffsetGain` from 0.1 to 0.3-0.5; reduce `uTintGain` from 0.3 to 0.1-0.2; set `uCurlAmp` to 0.05-0.1 for gentle ripple.
- Add tap ripple: on tap, apply radial force burst with 0.2s decay; scale radius by tap duration.
- Console cleanup: gate `[PC]` logs to 30fps max; remove HMR warnings; keep only `[PC] draw start/end` and frame stats.
- Devtools pitfall: run production build to verify no console noise masks visual issues.
```

## M1 Implementation Blueprint

### Files to Touch
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/DreamdustMaterial.ts` (uniforms, shader logic)
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/useDreamdustUniforms.ts` (uniform updates)
- `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx` (force vector input)
- `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` (controls lock, mirror propagation)

### Data Flow
```
Pointer Event → InkSurface.tsx (deltaX, deltaY) → uForceVector uniform (screen-space) → Vertex Shader (displacement += uForceVector * intensity) → Position offset with decay → Visible particle motion
```

### Minimal Shader/Material Changes
**New Uniforms (add to DreamdustMaterial.ts lines 80-85):**
```typescript
uForceVector: [0, 0] as [number, number],      // Screen-space force direction
uForceIntensity: 1.0,                          // Force strength multiplier
uForceDecay: 0.95,                             // Per-frame decay rate
```

**Vertex Shader Logic (add after line 339 in DreamdustMaterial.ts):**
```glsl
#ifdef USE_VERTEX_INK
  // Force-field displacement (after ink sampling)
  vec2 forceDisplacement = uForceVector * uForceIntensity * uInkIntensity;
  displacement += forceDisplacement;

  // Exponential decay when no input
  if (uForceIntensity < 0.01) {
    displacement *= uForceDecay;
  }
#endif
```

**Material Update Cadence:**
- Update `uForceVector` from InkSurface pointer delta each frame (60fps target)
- Set `uForceIntensity` based on input pressure/speed
- Trigger `material.needsUpdate = true` on uniform changes

### Guardrails
- **Controls Lock:** Disable OrbitControls during drawing (`setEnabled(false)`)
- **Mirror Correctness:** Ensure `uForceVector` respects current mirror flags
- **NeedsUpdate:** Set `material.needsUpdate = true` after uniform changes
- **Performance:** Limit force application to active ink regions only

### Pass/Fail Acceptance
**Pass Criteria:**
- One tap at viewport center (x: 512, y: 384) causes visible particle displacement ≥5px within 2 frames
- One 2-3s stroke along horizontal line shows continuous advection with "vapor" feel
- Effect decays gracefully when input stops
- Camera/framing unchanged during interaction

**Fail Criteria:**
- No visible motion within 2 frames
- Motion offset from pointer position
- Camera drift or orbit interference
- Performance degradation below 50fps

## M2 Cascade Blueprint

### Palette Source
**Curated Palette (add to DreamdustMaterial.ts):**
```typescript
const CASCADE_PALETTE: [number, number, number][] = [
  [1.0, 0.0, 0.0],    // Red
  [0.0, 1.0, 0.0],    // Green
  [0.0, 0.0, 1.0],    // Blue
  [1.0, 1.0, 0.0],    // Yellow
  [1.0, 0.0, 1.0],    // Magenta
  [0.0, 1.0, 1.0],    // Cyan
  [0.5, 0.0, 0.5],    // Purple
  [1.0, 0.5, 0.0],    // Orange
];
```

### Nearest-Hue Logic
**Implementation (add utility function):**
```typescript
function findNearestPaletteColor(targetRgb: [number, number, number]): [number, number, number] {
  let nearest = CASCADE_PALETTE[0];
  let minDistance = Infinity;

  for (const paletteColor of CASCADE_PALETTE) {
    const distance = rgbDistance(targetRgb, paletteColor);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = paletteColor;
    }
  }

  return nearest;
}

function rgbDistance(a: [number, number, number], b: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  );
}
```

### Cascade Timing Parameters
**Uniforms (add to DreamdustMaterial.ts):**
```typescript
uCascadeProgress: 0.0,           // 0-1 lerp progress
uCascadeColor: [1, 1, 1],       // Target palette color
uCascadeSizeBoost: 0.0,          // Size/alpha boost during cascade
uCascadeCommit: false,           // Trigger flag
```

**Timing Logic:**
- Cascade duration: 2-3 seconds (configurable via `uCascadeDuration`)
- Easing: smoothstep(0, 1, progress) for natural feel
- Trigger: `uCascadeCommit = true` on stroke end for strokes >2s

### Single Place to Toggle "Full Commit"
**Location:** `InkSurface.tsx` onEnd callback (lines ~200-220)
```typescript
onEnd={(info) => {
  if (info.type === 'stroke' && info.durationMs > 2000) {
    // Set cascade commit for full palette lock
    material.uniforms.uCascadeCommit.value = true;
    material.needsUpdate = true;
  }
}}
```

### Test Procedure
1. **Setup:** `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
2. **Gesture:** Draw 2-3s stroke from left to right across viewport center
3. **Expected:** 
   - Console: `"[PC] cascade commit: true"` + chosen palette color
   - Visual: Hue smoothly transitions across all particles to single saturated color
   - Duration: 2-3s complete transition
4. **Screenshots:** Before stroke (neutral), during cascade (mid-transition), after (saturated)

## 60–90 Minute Runbook

### M1 Force-Field (20 minutes)
- **URL:** `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&inkProbe=1`
- **Test 1:** Tap center (x: 512, y: 384) → expect particle ripple ≥5px within 2 frames
- **Test 2:** 2s horizontal stroke → expect continuous advection along path
- **Evidence:** Screenshot + `[PC] draw start/end` + frame timing logs

### M2 Palette Cascade (30 minutes)
- **URL:** Same as M1
- **Test 1:** Red-dominant stroke → expect cascade to nearest red palette color
- **Test 2:** Blue-dominant stroke → expect cascade to nearest blue palette color  
- **Test 3:** Toggle `uCascadeCommit` via console → verify single-color lock
- **Evidence:** 3 screenshots (before/during/after) + console cascade logs

### M3 Polish (20 minutes)
- **URL:** Same as M1
- **Test 1:** Tap + stroke with tuned gains → verify "ink in air" feel
- **Test 2:** Production build → confirm no console noise during interaction
- **Evidence:** Performance logs + production smoke test

### M4 Verification (20 minutes)
- **Commands:** `pnpm install --frozen-lockfile && pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit && pnpm --filter cryptiq-mindmap-demo run lint && pnpm --filter cryptiq-mindmap-demo run build && pnpm run smoke`
- **Evidence:** Verbatim stdout from each command + git tag for rollback

**Total:** 90 minutes for complete M1→M2 verification with evidence capture.
