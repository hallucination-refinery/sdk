# Orbital Controls Override Plan — 2025-10-08

**STATUS: ✅ APPROVED - Option A (Complete Controls Override)**

## Problem Statement

After GPT-5's fix (setting `cameraFitTarget` to [0,0,0] to match group translation), orbital controls **still don't work**.

User wants to add a `?controls` query parameter (or similar) to completely override the draw system and enable full, unrestricted orbital controls for manual camera positioning.

---

## Current Architecture Investigation

### Component Hierarchy

```
page.tsx (quiz/[slug])
├── <PointCloudStage sceneId={sceneId} />
│   ├── <Canvas> (R3F)
│   │   ├── <InkSurface onStart={} onEnd={} />
│   │   ├── <SceneControls drawing={drawing} target={cameraFitTarget} />
│   │   │   └── <OrbitControls
│   │   │         enableRotate={!drawing}
│   │   │         enableZoom={!drawing}
│   │   │         enablePan={!drawing} />
│   └── (rendering logic)
└── <InkFieldHost />
    ├── <StrokeCaptureCanvas enabled={drawEnabled} />
    └── "Draw: On/Off" button (controls drawEnabled)
```

### Two Separate Drawing States

**1. InkFieldHost: `drawEnabled` (line 106)**
- Initialized to `true`
- Controls pointer event overlay at zIndex 3
- When ON: `pointerEvents: 'auto'`, `inert={undefined}` (line 604-610)
- When OFF: `pointerEvents: 'none'`, `inert={true}`
- Toggled by "Draw: On/Off" button (line 645-658)

**2. PointCloudStage: `drawing` (line 942)**
- Initialized to `false`
- Set by InkSurface callbacks: `onStart={() => setDrawing(true)}`, `onEnd={() => setDrawing(false)}` (lines 2561-2577)
- Passed to SceneControls, which disables OrbitControls when `drawing={true}` (lines 852-854)

### Control Flow Analysis

**The Problem:**
1. InkFieldHost overlay is at **zIndex: 3** (above Canvas)
2. When Draw is ON, overlay captures ALL pointer events
3. When Draw is OFF, overlay sets `pointerEvents: 'none'` to let events through
4. BUT: InkSurface inside Canvas STILL receives events and triggers `drawing` state
5. OrbitControls are disabled when `drawing={true}`

**Why Controls Don't Work (Hypothesis):**
- Even with InkFieldHost overlay OFF, the InkSurface component inside Canvas might be intercepting pointer events
- OR: The `drawing` state gets stuck/confused between the two systems
- OR: There's a timing issue where InkSurface triggers `onStart` before controls can engage

### Current Query Param Parsing

**Location:** `apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx` (lines 55-61)

```typescript
useEffect(() => {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  const pc = url.searchParams.get('pc')
  setSceneId(pc)
}, [])
```

**Pattern:** Query params are read client-side via `window.location.href`

---

## Solution Design

### ✅ APPROVED: Complete Controls Override

**Add `?controls=1` query param that:**
1. Disables InkFieldHost entirely (don't render at all)
2. Disables InkSurface in PointCloudStage
3. Forces OrbitControls to always be enabled (ignore `drawing` state)
4. Shows a persistent UI indicator that controls are overridden

**Implementation Steps:**

1. **Parse `?controls` param in page.tsx**
   - Location: `apps/cryptiq-mindmap-demo/app/quiz/[slug]/page.tsx`
   - Add state: `const [controlsOverride, setControlsOverride] = useState(false)`
   - Parse in useEffect alongside `pc` param (lines 55-61)
   - Pass to PointCloudStage: `<PointCloudStage controlsOverride={controlsOverride} />`

2. **Conditionally render InkFieldHost in page.tsx**
   - Location: line 149
   - Change: `{!controlsOverride && <InkFieldHost />}`

3. **Update PointCloudStage to accept `controlsOverride` prop**
   - Location: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
   - Add to props interface (around line 682-740)
   - Pass to SceneControls: `<SceneControls controlsOverride={controlsOverride} />`

4. **Conditionally render InkSurface**
   - Location: lines 2558-2586
   - Wrap InkSurface in: `{!controlsOverride && <InkSurface ... />}`

5. **Update SceneControls to override drawing**
   - Location: lines 834-869
   - Accept `controlsOverride` prop
   - Change OrbitControls enables:
     ```typescript
     enableRotate={controlsOverride ? true : !drawing}
     enableZoom={controlsOverride ? true : !drawing}
     enablePan={controlsOverride ? true : !drawing}
     ```

6. **Add visual indicator**
   - Location: Debug panel in PointCloudStage (around lines 2700-2809)
   - Add text: "CONTROLS OVERRIDE ACTIVE" when `controlsOverride={true}`

### ❌ REJECTED: Option B (Minimal Override)

Option B would have left both draw systems active while forcing OrbitControls on, risking pointer event conflicts. User approved the cleaner approach (Option A) that completely disables the draw system when `?controls=1` is present.

---

## Testing Protocol

After implementation:

1. **Test without param:**
   - URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1`
   - Verify: Draw system works normally
   - Verify: Controls disabled when drawing

2. **Test with controls override:**
   - URL: `http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&debug=1&controls=1`
   - Verify: No "Draw" button visible
   - Verify: OrbitControls fully responsive (orbit/pan/zoom)
   - Verify: Visual indicator shows "CONTROLS OVERRIDE ACTIVE"
   - Manually position camera
   - Click "Log Camera" button
   - Copy preset values

3. **Test edge cases:**
   - Both `?controls=1` and `?forceAlpha=1` together
   - Reload page with controls override active
   - Switch between presets (A/B1/B2/C/D1/D2)

---

## File Change Summary

| File | Lines | Change Type |
|------|-------|-------------|
| `app/quiz/[slug]/page.tsx` | ~55-61, ~149 | Parse param, conditionally render InkFieldHost |
| `app/components/PointCloudStage.tsx` | ~682-740, ~2558-2586, ~2678-2681 | Accept prop, conditionally render InkSurface, pass to SceneControls |
| `app/components/PointCloudStage.tsx` | ~834-869 | Update SceneControls to override enables |
| `app/components/PointCloudStage.tsx` | ~2700-2809 | Add visual indicator in debug panel |

---

## Success Criteria

- [ ] `?controls=1` completely disables draw system
- [ ] OrbitControls are fully functional (smooth orbit/pan/zoom)
- [ ] No pointer event conflicts or stuttering
- [ ] "Log Camera" button captures correct values
- [ ] Visual indicator shows override is active
- [ ] Default behavior (without param) unchanged

---

## Alternative Query Param Names

If `?controls=1` conflicts with existing usage:
- `?orbitOverride=1`
- `?manualCamera=1`
- `?devControls=1`
- `?freeCamera=1`

---

## Implementation Workflow

**APPROVED PATH: Complete Controls Override**

1. ✅ User approved Option A (2025-10-08)
2. ✅ Implement 6-step plan (committed 3056a79d, 68539577)
3. ⏳ Test in browser with both URLs
4. ⏳ Manually position camera using working controls
5. ⏳ Log camera preset and hardcode values
6. ⏳ Update iteration 6 in `2025-10-08-camera-framing-tuning.md`

### Commits

- `3056a79d` - feat(controls): add ?controls=1 query param parsing and conditionally render InkFieldHost
- `68539577` - feat(controls): implement controlsOverride prop to disable draw system and enable full orbital controls

---

## Design Decisions

1. ✅ **Remove vs Disable:** Completely remove InkFieldHost from render tree when `?controls=1` (cleaner, no conflicts)
2. ⏳ **Visual indicator:** Add text in debug panel (styling TBD during implementation)
3. ⏳ **Auto-logging:** Not included in this phase (can add later if needed)
4. ✅ **Param name:** `?controls=1` confirmed (no existing conflicts found)
