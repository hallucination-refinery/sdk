# Dreamdust Ink Interaction - Root Cause Analysis — 2025-10-09

## Executive Summary

**Status:** CRITICAL FAILURE - Core interaction loop completely non-functional

**Root Issue:** InkSurface pointer events not capturing user input. No `[PC] draw start/end` logs firing despite user taps and strokes.

**Impact:**
- Zero visual response to user interaction
- No tap ripples
- No stroke cascades
- Entire ink-response system disconnected

**Commit:** e5905344 (scene-03 camera preset default)

---

## Test Results Summary

### Test Environment
- **Scene:** scene-03 (Slim Aarons Palm Springs)
- **Route:** `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
- **Build:** Production (Next.js 15.3.5, Node 22.13.1)
- **Date:** 2025-10-09

### What Works ✅
- **Rendering:** Point cloud displays correctly, scene recognizable
- **Camera:** Iteration 6 preset applied (`[-65.737, 103.054, -681.379]`)
- **Performance:** 60 FPS, p50: 8.3ms, p90: 16.3ms
- **WebGL:** All caps nominal (`vertexInkOk: true`)
- **Texture binding:** Ink texture initializes (256×256)

### What's Broken ❌
- **Input capture:** `[PC] draw start/end` logs NEVER fire
- **Visual response:** Zero reaction to taps or strokes
- **Cascade system:** Non-functional
- **Draw state:** No evidence of drawing state changes

---

## Evidence Analysis

### Test 2: Short Tap - FAIL

**User Action:** Single tap on point cloud center

**Expected Logs:**
```
[PC] draw start
[PC] draw end { type: 'tap', durationMs: ~100, distancePx: 0 }
```

**Actual Logs:**
```
[dreamdust] ink-latency {ms: 5.8, frames: 0.35}
[PC] ink debug {vertexInkOk: true, uViewport: [1728, 1080], inkIntensity: 0.75}
```

**Missing:**
- `[PC] draw start` - NOT PRESENT
- `[PC] draw end` - NOT PRESENT

**Significance:** Input event handlers are not firing. User clicks not captured by InkSurface.

### Test 3: Long Stroke - FAIL

**User Action:** Continuous stroke across canvas (3-5 seconds)

**Expected Logs:**
```
[PC] draw start
[PC] draw end { type: 'stroke', durationMs: ~3000, distancePx: ~500 }
```

**Actual Logs:**
```
[dreamdust] ink-latency {ms: 4.2, frames: 0.25}
[PC] ink debug {vertexInkOk: true, uViewport: [1728, 1080], inkIntensity: 0.75}
```

**Missing:**
- `[PC] draw start` - NOT PRESENT
- `[PC] draw end` - NOT PRESENT

**Significance:** Confirms Test 2 findings - input capture completely broken.

### Ambiguous Evidence

**`[dreamdust] ink-latency` logs ARE present:**
- Test 2: `{ms: 5.8, frames: 0.35}`
- Test 3: `{ms: 4.2, frames: 0.25}`

**Question:** What triggers these logs?
- **Hypothesis A:** Timer-based, runs every frame regardless of user input (red herring)
- **Hypothesis B:** Triggered by actual input events captured elsewhere in the stack
- **Action Required:** Trace `ink-latency` log location to determine trigger mechanism

---

## Root Cause Hypothesis

### Primary Hypothesis: InkSurface Not Capturing Events

**Possible causes (priority order):**

#### 1. InkSurface Conditional Rendering Issue (HIGH PROBABILITY)

**Recent Code Change:**
```typescript
// PointCloudStage.tsx line 2772
{(sceneId === 'scene-03' || !controlsOverride) && (
  <InkSurface
    // ...
  />
)}
```

**Evaluation needed:**
- Does this condition evaluate to `true` for scene-03?
- `sceneId === 'scene-03'` → should be TRUE
- `controlsOverride` → should be FALSE (not set via query param)
- **Expected:** `(true || !false)` → `true` → InkSurface SHOULD render

**But we must verify:**
- Is InkSurface actually in the DOM?
- Are event handlers actually bound?

#### 2. Z-Index / Pointer Events CSS Issue (MEDIUM PROBABILITY)

**Scenario:** InkSurface canvas exists but is behind WebGL canvas or has `pointer-events: none`

**Check needed:**
- Browser DevTools → Inspect InkSurface canvas element
- Verify CSS: `z-index`, `pointer-events`, `position`
- Verify canvas dimensions match viewport

#### 3. Event Handler Binding Failure (MEDIUM PROBABILITY)

**Scenario:** InkSurface renders but onStart/onEnd callbacks not wired correctly

**Check needed:**
- Read InkSurface.tsx lines for pointer event setup
- Verify event listeners are attached to canvas
- Check if callbacks are passed correctly from PointCloudStage

#### 4. InkFieldHost Architectural Issue (LOW PROBABILITY)

**Scenario:** Parent wrapper component not rendering or portal broken

**Check needed:**
- Verify InkFieldHost is in DOM
- Check if overlay mechanism is intact

---

## Investigation Plan

### Phase 1: Verify InkSurface Rendering (5 min)

**Action:** Add console.log to InkSurface component mount

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`

**Add to useEffect or component start:**
```typescript
console.log('[InkSurface] Component mounted', {
  canvas: canvasRef.current,
  dimensions: { width, height }
})
```

**Expected Output:** Should see this log on page load if component renders

**Decision Point:**
- If log appears → InkSurface IS rendering, proceed to Phase 2
- If log missing → InkSurface NOT rendering, fix conditional logic

### Phase 2: Add Pointer Event Debug Logging (10 min)

**Action:** Add console.log to pointer event handlers in InkSurface

**File:** `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`

**Find pointerdown/pointerup handlers, add:**
```typescript
const handlePointerDown = (e: PointerEvent) => {
  console.log('[InkSurface] pointerdown', {
    x: e.clientX,
    y: e.clientY,
    target: e.target
  })
  // ... existing logic
}

const handlePointerUp = (e: PointerEvent) => {
  console.log('[InkSurface] pointerup', {
    x: e.clientX,
    y: e.clientY
  })
  // ... existing logic
}
```

**Expected Output:** Should see these logs when user clicks canvas

**Decision Point:**
- If logs appear → Events ARE captured, issue is downstream (Phase 3)
- If logs missing → Events NOT captured, issue is CSS/z-index (Phase 2b)

### Phase 2b: CSS/Z-Index Investigation (5 min)

**Action:** Inspect InkSurface canvas in browser DevTools

**Check:**
1. Is canvas element present in DOM?
2. What is its z-index? (should be higher than WebGL canvas)
3. What is pointer-events value? (should be `auto` not `none`)
4. Does canvas cover viewport? (check width/height)
5. Is it visible? (check opacity, display, visibility)

**If CSS issue found:** Fix styles directly in InkSurface.tsx

### Phase 3: Trace Data Flow (15 min)

**Action:** Follow callback chain from InkSurface → PointCloudStage

**File:** `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`

**Find InkSurface invocation (around line 2773):**
```typescript
<InkSurface
  onStart={() => {
    console.log('[PC] draw start') // Is this here?
    setDrawing(true)
  }}
  onEnd={(info) => {
    console.log('[PC] draw end', info) // Is this here?
    setDrawing(false)
  }}
/>
```

**Verify:**
- Are onStart/onEnd props being passed?
- Do they include console.log statements?
- Are they being called from InkSurface?

### Phase 4: Trace `ink-latency` Log (10 min)

**Action:** Find where `[dreamdust] ink-latency` is logged

**Search:** `Grep` for "ink-latency" across codebase

**Determine:**
- What triggers this log?
- Is it user-input-based or timer-based?
- If timer-based, it's irrelevant to our investigation
- If input-based, it reveals an alternative input capture path

---

## Recommended Fix Approach

### If InkSurface Not Rendering

**Fix conditional logic in PointCloudStage.tsx:**
```typescript
// Ensure InkSurface always renders for scene-03
{sceneId === 'scene-03' && (
  <InkSurface ... />
)}
```

### If CSS/Z-Index Issue

**Update InkSurface styles:**
```typescript
<canvas
  ref={canvasRef}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 100, // Must be higher than WebGL canvas
    pointerEvents: 'auto',
    touchAction: 'none'
  }}
/>
```

### If Event Handlers Not Bound

**Verify and fix event listener attachment in InkSurface.tsx:**
```typescript
useEffect(() => {
  const canvas = canvasRef.current
  if (!canvas) return

  canvas.addEventListener('pointerdown', handlePointerDown)
  canvas.addEventListener('pointerup', handlePointerUp)
  canvas.addEventListener('pointermove', handlePointerMove)

  return () => {
    canvas.removeEventListener('pointerdown', handlePointerDown)
    canvas.removeEventListener('pointerup', handlePointerUp)
    canvas.removeEventListener('pointermove', handlePointerMove)
  }
}, [])
```

---

## Expected Outcomes After Fix

### Immediate Validation

After implementing fix, retest and expect:

**Test 2 (Short Tap):**
```
[PC] draw start
[InkSurface] Drawing at (x, y)
[PC] draw end { type: 'tap', durationMs: ~100, distancePx: 0 }
```

**Test 3 (Long Stroke):**
```
[PC] draw start
[InkSurface] Drawing path...
[PC] draw end { type: 'stroke', durationMs: ~3000, distancePx: ~500 }
```

### Visual Validation

- Tap on cloud → should see local ripple effect
- Draw stroke → should see vapor trail and cascade begin

---

## Secondary Issues (Deferred Until Interaction Works)

### P1: Reveal Animation Flicker
- User reports "abrupt clip/flicker/brightness" during reveal
- Investigate reveal animation timing in useDreamdustUniforms.ts
- May be related to bloom or depth normalization

### P2: Remove Countdown Overlay
- User wants countdown removed
- Find countdown component (likely in quiz/[slug]/page.tsx or InkFieldHost)
- Remove or conditionally hide for scene-03

---

## Timeline Estimate

**Phase 1-2:** 15-20 minutes (diagnosis)
**Fix Implementation:** 5-30 minutes (depending on root cause)
**Testing:** 10 minutes (smoke test rerun)
**Total:** 30-60 minutes to functional interaction

---

## Success Criteria

✅ `[PC] draw start/end` logs fire on user input
✅ Visual response to taps (ripple effect)
✅ Visual response to strokes (vapor trail)
✅ Cascade triggers on long stroke
✅ Interaction feels immediate (1-2 frame latency)

---

## Files Requiring Investigation

1. **`apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx`**
   - Pointer event capture
   - Canvas rendering
   - Event handler binding

2. **`apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`**
   - InkSurface conditional rendering (line 2772)
   - onStart/onEnd callback wiring (lines 2773-2784)

3. **`apps/cryptiq-mindmap-demo/app/components/InkFieldHost.tsx`**
   - Wrapper component verification
   - Overlay mechanism

4. **Search for `ink-latency` across codebase**
   - Determine what triggers this log
   - Clarify if it's user-input or timer-based

---

## Context: Desired End State

From `2025-09-20-dreamdust-ink-mask-brief.md` (lines 7-21):

### Short Tap/Brief Hold
> **Response time:** 1-2 frames
> **Visual:** Gentle, local buoyant curls and ripples
> **Effect:** Light size/tint nudge
> **Settle:** Returns to held shape in ~1-2 seconds
> **Feel:** "Ink in air," immediate, graceful decay

### Long Stroke
> **Response:** Along path, image diffuses into vapor
> **Motion:** Advects like smoke
> **Cascade:** Triggers cascading recolor
> **Result:** Entire canvas saturates in single hue
> **Meaning:** Final hue maps to brain concept/category

### Input Ergonomics
> Canvas fully owns input while drawing (no camera fight)
> Heatmap overlay aligns under your pointer
> Controls re-enable on release

**Current Reality:** NONE of this works. Zero input capture. Zero visual response.

---

## Commit Strategy

### Investigation Commits (Keep Separate)

```bash
# Add debug logging
git add apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx
git commit -m "debug: add InkSurface mount and pointer event logging"

# Document findings
git add docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-09-ink-interaction-analysis.md
git commit -m "docs: ink interaction root cause analysis"
```

### Fix Commits (After Diagnosis)

```bash
# Example fix commit
git add apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx
git commit -m "fix(ink): ensure InkSurface renders for scene-03

InkSurface conditional logic was preventing render for scene-03.
Simplified condition to always render for scene-03 regardless of
controlsOverride state.

Fixes: Input events not captured, no draw start/end logs
"
```

### Test Results Commit

```bash
git add docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-09-ink-interaction-smoke-test.md
git commit -m "test: smoke test results - ink interaction broken"
```

---

**Status:** Awaiting user approval to proceed with Phase 1 investigation

**Next Action:** Add debug logging to InkSurface.tsx to verify component mounting and event capture

---

# GPT-5 Audit — 2025-10-09

## Independent Analysis (Before Reading Claude's Conclusions)

### Primary Hypothesis
StrokeCaptureCanvas inside `InkFieldHost` sits above the WebGL canvas and consumes all pointer input, so `InkSurface` never receives pointerdown/up events and its heatmap texture stays unchanged.

### Supporting Evidence
- Smoke test logs confirm `[PC] draw start` and `[PC] draw end` never fire during tap or stroke attempts, proving the `InkSurface` handlers are silent.【docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-10-09-ink-interaction-smoke-test.md:342】
- `InkSurface` would emit `[PC] draw start` immediately inside its pointerdown handler; the absence of that log means the handler is not reached.【apps/cryptiq-mindmap-demo/app/components/dreamdust/InkSurface.tsx:295】
- The overlay wrapper renders an absolutely positioned layer with `pointerEvents: 'auto'` and houses `StrokeCaptureCanvas`, which calls `event.preventDefault()`, captures the pointer, and handles all pointerdown/move/up events itself, preventing the underlying WebGL canvas from seeing them.【apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx:602】【apps/cryptiq-mindmap-demo/app/components/dreamdust/StrokeCaptureCanvas.tsx:217】
- The lingering `[dreamdust] ink-latency` telemetry is explained by `InkFieldHost` calling `markInkPenDown()` on stroke start even though the stage never receives the gesture, matching the observed console output.【apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx:177】

### Alternative Hypotheses
1. `InkSurface` fails to mount because `PointCloudStage` skips it under some runtime flag despite expectations for scene-03 (low probability).【apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2758】
2. `InkFieldHost` updates context state, but `updateInkTexture` disregards the supplied texture, leaving the shader sampling an empty surface even if events fired (medium probability, worth confirming after restoring input).【apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:1284】
3. Shader uniforms downstream of the ink texture suppress the effect (e.g., intensity clamps) so even valid textures appear inert (low probability while input is still broken).

### Recommended Investigation Steps
1. Temporarily disable input capture on `InkFieldHost` (e.g., set its wrapper and `StrokeCaptureCanvas` to `pointer-events: none`) and re-run the smoke test to confirm `[PC] draw start/end` logs return, proving the interception theory.
2. If confirmed, decide whether to forward the overlay’s stroke data into the R3F pipeline or to let `InkSurface` own input again; instrument `updateInkTexture` to verify the selected path actually updates uniforms.
3. Re-enable the overlay with an explicit delegation strategy (forwarded events or unified stroke handler) and validate that both the metrics (`ink-latency`, `ink debug`) and visuals respond to taps and strokes.

### Expected Fix Approach
Either remove the competing pointer capture by letting `InkSurface` own input or have `StrokeCaptureCanvas` feed the same heatmap pipeline (calling `updateInkTexture` directly) while keeping the overlay visible; in both cases ensure only one component grabs pointer events and that the resulting texture is wired into the shader uniforms.

---

## Critique of Claude's Analysis

### Points of Agreement
- We both conclude the core failure is the missing `[PC] draw start/end` events, meaning the interaction loop never begins.
- The ambiguity around `[dreamdust] ink-latency` warrants tracing because it signals some other path is acknowledging input.
- Their suggested instrumentation would make the root cause visible once the competing input layer is suspected.

### Points of Disagreement
- Claude focuses on conditional rendering and canvas CSS as primary suspects, but the code shows the overlay layer actively intercepts events; tweaking the conditional or z-index alone will not restore input.
- They treat `InkSurface` as the only input path, overlooking the newer `InkFieldHost` overlay that already captures strokes and is responsible for the observed telemetry.

### Gaps in Claude's Analysis
- No mention of `StrokeCaptureCanvas` or the overlay wrapper that sets `pointerEvents: 'auto'`, missing the key architectural change blocking input.
- They do not connect the `[dreamdust] ink-latency` log to `markInkPenDown()` in `InkFieldHost`, so the log’s presence is left unexplained.
- The plan skips validating that only one component should own pointer capture, risking redundant fixes.

### Assessment of Investigation Plan
- Instrumenting `InkSurface` is useful but should come after checking the overlay; otherwise the plan spends time validating symptoms without isolating the interceptor.
- The plan lacks a DOM layering inspection or mention of the overlay’s pointer policy, so it may miss the actual conflict even after additional logging.

### Assessment of Recommended Fix
- Forcing the conditional to render `InkSurface` or bumping its z-index would not resolve the pointer conflict; the overlay would still swallow events.
- Their CSS adjustments risk masking the deeper architectural duplication between `InkSurface` and `InkFieldHost`, potentially leading to future regressions.

---

## Final Recommendations

### Recommended Next Action
Disable `InkFieldHost` input capture long enough to confirm `InkSurface` logs reappear, then refactor so only one component owns pointer events while still updating the ink texture.

### Confidence Level
Medium-High – the code shows the overlay intercepting input and the telemetry aligns with that interception, but we still need a quick runtime confirmation.

### Estimated Time to Resolution
60–90 minutes once input ownership is clarified (includes verifying the fix with tap and stroke smoke tests).

### Alternative Path (If Recommended Fix Fails)
If logs remain absent after disabling the overlay, inspect the `PointCloudStage` conditional and `updateInkTexture` wiring to rule out a mounting or uniform propagation failure.

### Additional Notes
When consolidating input handling, ensure the metrics pipeline still fires `markInkPenDown`/`markInkFrameCandidate` so telemetry remains consistent with prior reports.
