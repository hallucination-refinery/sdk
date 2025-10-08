# Camera Logging Investigation — 2025-10-08

## Problem

"Log Camera" button returns `{"position":[0,0,0],"target":[0,0,0],"fov":40}` when user clicks it after manually positioning camera with orbital controls.

Expected: Camera position should reflect actual position after user manipulation (e.g., `[123, 456, 789]`)

## Investigation

### Code Flow Analysis

**1. Log Camera Button Implementation** (PointCloudStage.tsx:2793-2832)

```typescript
onClick={() => {
  const state = getR3FStateOrNull()
  const cam = state?.camera as THREE.PerspectiveCamera | undefined
  const controls = state?.controls as { target?: THREE.Vector3 } | undefined
  const posArr = cam
    ? [cam.position.x, cam.position.y, cam.position.z]
    : [0, 0, 0]  // ← Fallback when cam is undefined
  const tgtVec = controls?.target
    ? new THREE.Vector3(controls.target.x, controls.target.y, controls.target.z)
    : (cam?.userData?.target as THREE.Vector3 | undefined) || new THREE.Vector3()
  // ...
}
```

**2. getR3FStateOrNull() Implementation** (anim/r3fSafe.ts:10-20)

```typescript
export function getR3FStateOrNull(): RootState | null {
  try {
    if (typeof document === 'undefined') return null
    const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return null
    const state = getRootState(canvas)  // ← R3F's getRootState
    return state ?? null
  } catch {
    return null
  }
}
```

**3. OrbitControls Setup** (PointCloudStage.tsx:852-869)

```typescript
<OrbitControls
  ref={controlsRef}
  makeDefault  // ← Should register controls to state.controls
  enableRotate={controlsOverride ? true : !drawing}
  enableZoom={controlsOverride ? true : !drawing}
  enablePan={controlsOverride ? true : !drawing}
  // ...
/>
```

**4. Camera Initialization** (PointCloudStage.tsx:2490)

```typescript
<Canvas
  orthographic={false}
  camera={{ position: [0, 0, 1200], fov: ui.fovDeg, near: 0.1, far: 5000 }}
  // ...
/>
```

**5. CameraSync fitRequest Effect** (PointCloudStage.tsx:2980-3009)

Sets `camera.userData.fitTarget` and calls `applyPerspectiveCover`:

```typescript
if (fitTarget) {
  const targetVec = new THREE.Vector3(fitTarget[0], fitTarget[1], fitTarget[2])
  data.target = targetVec.clone()      // ← Sets to [0, 0, 0]
  data.fitTarget = targetVec.clone()   // ← Sets to [0, 0, 0]
}
const distanceResult = applyPerspectiveCover(cam, fitRadius, margin)
```

**6. applyPerspectiveCover** (anim/camera.ts:173-213)

```typescript
export function applyPerspectiveCover(camera, radius, margin = 1.0) {
  const distance = fitPerspectiveCover(camera.fov, radius, camera.aspect, margin)
  // ...
  let target: THREE.Vector3
  if (isVector3(data?.fitTarget)) target = data.fitTarget.clone()  // ← Gets [0,0,0]
  else if (isVector3(data?.target)) target = data.target.clone()
  else target = new THREE.Vector3()

  const direction = new THREE.Vector3().subVectors(camera.position, target).normalize()
  // camera.position = [0, 0, 1200], target = [0, 0, 0]
  // direction = [0, 0, 1]

  const offset = direction.clone().multiplyScalar(distance)
  // offset = [0, 0, 1382.375]

  const newPosition = target.clone().sub(offset)
  // newPosition = [0, 0, 0] - [0, 0, 1382.375] = [0, 0, -1382.375]

  camera.position.copy(newPosition)  // ← Sets camera to [0, 0, -1382.375]
  camera.lookAt(target)
  camera.updateProjectionMatrix()

  return distance
}
```

### Predicted Camera Position After Auto-Fit

Based on console logs:
- `fitRadius` = 500
- `margin` = 0.78
- `distance` = 1382.375
- `target` = [0, 0, 0]

**Camera should be at: [0, 0, -1382.375]**

### But User Reports [0, 0, 0]

**Hypotheses:**

#### A. Camera Object Not Found
- `getR3FStateOrNull()` returns null
- `state?.camera` is undefined
- Falls back to `[0, 0, 0]` in posArr calculation
- **Evidence:** FOV is 40, not fallback value, so camera WAS found

#### B. Wrong Camera Object
- `state.camera` is a different camera than the one being rendered
- R3F has multiple cameras and we're getting the wrong one
- **Test:** Check if `getRootState(canvas)` returns the active camera

#### C. Timing Issue
- Camera position is reset after user moves it
- OrbitControls updates position, but it gets overwritten
- **Test:** Add console.log in onClick to check cam.position.x/y/z values

#### D. Camera Position Actually IS [0, 0, 0]
- applyPerspectiveCover is setting it to [0, 0, -1382.375]
- But something else is resetting it to [0, 0, 0]
- **Test:** Check for other effects that modify camera.position

#### E. OrbitControls Not Updating Camera Position
- OrbitControls is enabled and responsive
- User can see the view changing
- But camera.position isn't actually changing
- OrbitControls might be using a different transform
- **Test:** Check if OrbitControls modifies camera.matrix instead of camera.position

### FOV Discrepancy

**Console logs show:**
- `ui.fovDeg` should be 20 (from console: `"fov": 20`)
- But camera preset shows: `"fov": 40`

**Possible causes:**
1. User adjusted FOV slider in debug panel (line 2849-2863)
2. Camera object has different FOV than ui.fovDeg
3. `cam?.fov ?? ui.fovDeg` is resolving to cam.fov (40), not ui.fovDeg

**Implication:** If FOV is 40, camera WAS found by `getR3FStateOrNull()`. So hypothesis A is wrong.

### Debug Panel Location

The "Log Camera" button is rendered OUTSIDE the Canvas (in debug panel at top-right).
This means it's accessing R3F state from outside the Canvas context using `getRootState(canvas)`.

This SHOULD work, but might have synchronization issues if:
- Canvas is re-rendering
- Multiple canvases exist
- Camera is being swapped

## Recommended Next Steps

### 1. Add Debug Logging to Button

Modify onClick handler to log intermediate values:

```typescript
onClick={() => {
  try {
    console.log('[DEBUG] Button clicked')
    const state = getR3FStateOrNull()
    console.log('[DEBUG] state:', state)
    console.log('[DEBUG] state?.camera:', state?.camera)
    console.log('[DEBUG] state?.controls:', state?.controls)

    const cam = state?.camera as THREE.PerspectiveCamera | undefined
    console.log('[DEBUG] cam:', cam)
    console.log('[DEBUG] cam?.position:', cam?.position)
    console.log('[DEBUG] cam?.position.toArray():', cam?.position?.toArray())

    const controls = state?.controls as { target?: THREE.Vector3 } | undefined
    console.log('[DEBUG] controls:', controls)
    console.log('[DEBUG] controls?.target:', controls?.target)

    // ... rest of existing code
  } catch (err) {
    console.error('[DEBUG] Error:', err)
  }
}
```

### 2. Alternative: Use useThree Hook Inside Canvas

Instead of accessing state from outside, add a child component inside Canvas that uses `useThree()`:

```typescript
function CameraLogger({ onLog }: { onLog: (preset: any) => void }) {
  const { camera, controls } = useThree()

  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'l' && e.metaKey) {  // Cmd+L
        const cam = camera as THREE.PerspectiveCamera
        const preset = {
          position: cam.position.toArray(),
          target: (controls as any)?.target?.toArray() || [0, 0, 0],
          fov: cam.fov,
        }
        console.log('[CameraLogger] Preset:', preset)
        onLog(preset)
      }
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [camera, controls, onLog])

  return null
}
```

Then render inside Canvas: `<CameraLogger onLog={handleCameraLog} />`

### 3. Check OrbitControls Implementation

Verify OrbitControls is actually modifying camera.position:

- Add console.log to OrbitControls onStart/onChange handlers
- Check if camera.position changes when dragging
- Check if camera.matrix is being used instead

### 4. Verify No Position Overrides

Search for all places that set camera.position:
- CameraSync effects (line 2962-2970, 2980-3009)
- applyPerspectiveFit/Cover functions
- Any other effects or animation loops

Check if any of these run AFTER user repositions camera.

## Hypothesis Ranking

**Most Likely → Least Likely:**

1. ⭐⭐⭐ **Camera state synchronization issue** - getRootState(canvas) returns stale or wrong camera
2. ⭐⭐⭐ **OrbitControls updates not reflected** - Controls update view but not camera.position
3. ⭐⭐ **Position reset by effect** - Some effect resets position after user moves it
4. ⭐ **Multiple cameras** - Wrong camera object being accessed
5. ❌ **Camera not found** - Disproven by FOV=40

## Solution

Likely need to either:
- Use `useThree()` hook from inside Canvas instead of `getRootState()`
- Add ref to OrbitControls and access camera/target directly from controls ref
- Add event listener to OrbitControls 'change' event to capture position in real-time
