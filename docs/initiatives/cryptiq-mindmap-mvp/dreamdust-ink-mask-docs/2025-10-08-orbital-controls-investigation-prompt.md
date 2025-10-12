# Orbital Controls Investigation Prompt

## Context

We're working on a Next.js 15 Three.js point cloud visualization app. The camera framing is wrong and we've been trying to fix it by calculating the correct camera position programmatically for hours. The original plan was to:

1. Fix the orbital controls so they work properly
2. User manually positions camera using controls
3. Log the camera position/target
4. Hardcode those values

But we got sidetracked into calculation hell. Now we need to get back to the original plan.

## Current Problem

When "Draw" mode is OFF, the orbital controls (OrbitControls from @react-three/drei) feel "inconsistent" and "out of whack". Specifically:
- Sometimes the camera suddenly changes angle in response to click or drag
- Changes are very slight
- Hard to tell if there's any rhyme or reason
- Zoom works, but orbit/pan feel broken

## Repository Structure

- Monorepo with pnpm
- App: `apps/cryptiq-mindmap-demo` (Next.js 15)
- Main component: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
- Camera utilities: `apps/cryptiq-mindmap-demo/app/components/anim/camera.ts`
- Draw overlay: `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx`

## Key Files & Relevant Code

### OrbitControls Setup
File: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`

The `SceneControls` component (around line 833-869) renders OrbitControls with:
- `enableRotate={!drawing}`
- `enableZoom={!drawing}`
- `enablePan={!drawing}`
- `target={target}` (passed as prop)
- `makeDefault`
- `enableDamping` with `dampingFactor={0.1}`
- `rotateSpeed={0.8}`
- `zoomSpeed={0.6}`

SceneControls is instantiated around line 2672-2676 with:
- `radius={prebakedTransform ? prebakedTransform.radius : undefined}`
- `drawing={drawing}`
- `target={cameraFitTarget}` ← **THIS IS CRITICAL**

### The Target Bug
File: `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx` (lines 2063-2098)

`cameraFitTarget` is calculated via React.useMemo:
- For sim mode: Complex calculation using simBounds
- For prebaked mode (our case): **Returns [0, 0, 0]** (origin) instead of actual cloud center

The cloud's actual center is at:
- Raw: `[0.083, -0.302, 1.520]`
- Scaled: `[33.9, -122.8, 619.6]`

**So OrbitControls is trying to orbit around [0, 0, 0] but the cloud is offset significantly**, especially in Y (-123 units down) and Z (620 units forward).

### Draw Mode Toggle
File: `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx`

The "Draw" toggle controls:
- `drawEnabled` state (line 106)
- When ON: InkFieldHost overlay has `pointerEvents: 'auto'` (line 610) and `inert={undefined}` (line 604)
- When OFF: `pointerEvents: 'none'` and `inert={true}`

The InkFieldHost overlay is at `zIndex: 3` (line 608) and positioned absolutely over the canvas.

### Point Cloud Transform
The point cloud uses:
- `mirrorUD={true}` by default (flips vertically)
- Optional `mirrorLR`, rotation, quaternion transforms
- Scaling via `prebakedTransform.scale` (407.44 for scene-03)

## Scene-03 Specifics

- Image: 518×350 (3:2 aspect ratio)
- Point cloud: 181,300 points
- Scaled extents: X=937, Y=404, Z=1000 units
- Current camera setup: FOV 20°, distance 443 units, margin 0.25
- Current issue: Cloud in top 60-70% of viewport, 30-40% black space at bottom

## Investigation Tasks

### 1. Trace the Target Issue
**Question:** Why are the orbital controls behaving inconsistently?

**Hypothesis:** OrbitControls.target is set to [0, 0, 0] but the cloud center is at [33.9, -123, 619]. When you try to orbit, you're rotating around empty space ~620 units behind the cloud.

**Verify:**
- Check what value `cameraFitTarget` actually returns for prebaked mode
- Confirm this is passed to OrbitControls as the `target` prop
- Determine if the inconsistent behavior matches "orbiting around wrong point"

### 2. Identify Additional Blockers
**Questions:**
- Is InkFieldHost overlay fully non-interactive when Draw is OFF?
- Are there other pointer event handlers interfering?
- Is damping causing the "slight changes" feeling?
- Is the camera distance/FOV making small movements imperceptible?

### 3. Determine the Fix
**What changes are needed to make orbital controls work reliably?**

Options:
A. Fix `cameraFitTarget` calculation for prebaked mode (use actual cloud center)
B. Adjust damping/speed parameters
C. Ensure no event capture conflicts
D. Something else

### 4. Add Camera Logging
**How to add a reliable way to log camera position after manual positioning?**

Requirements:
- Button in debug panel (already exists at line 2761-2795)
- Should log:
  - `camera.position` (current position)
  - `OrbitControls.target` (what camera is looking at)
  - `camera.fov`
- Format should be easy to copy/paste into code

## Expected Output

### Part 1: Root Cause Analysis
- Exact reason orbital controls feel broken
- Code locations and values causing the issue
- How the target bug manifests in user behavior

### Part 2: Step-by-Step Fix Plan
- Precise code changes needed (file, line numbers, old/new values)
- Order of operations
- How to verify each step worked

### Part 3: Camera Logging Implementation
- Exact code to add for logging button
- What values to log and in what format
- How to use it (workflow steps)

## Files to Examine

1. `apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx`
   - SceneControls component (line ~833)
   - cameraFitTarget calculation (line ~2063)
   - SceneControls instantiation (line ~2672)
   - Debug panel logging button (line ~2761)

2. `apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx`
   - Draw toggle logic (line ~106, 604, 610)
   - Overlay z-index and pointer events (line ~608)

3. `apps/cryptiq-mindmap-demo/app/components/anim/camera.ts`
   - Camera positioning functions (if relevant)

## Success Criteria

After your investigation and proposed fixes:
1. Clear explanation of why controls are broken
2. Minimal code changes to fix controls
3. Working camera logging mechanism
4. User can manually position camera, log values, we hardcode them
5. Whole process takes < 10 minutes

## Critical: Do Not Repeat Past Mistakes

- Do NOT try to calculate the "correct" camera position mathematically
- Do NOT iterate on margin/FOV/distance calculations
- Do NOT make assumptions about coordinate transforms
- FOCUS on: Fix controls → Manual positioning → Log → Hardcode

This is the SIMPLE path we should have taken 5 hours ago.

## Outcome: Evidence-Based Changes and Rationale

- Root cause: orbit pivot mismatch in prebaked mode.
  - Geometry is translated so the cloud’s world-center sits at origin: `position={[-center.x*scale, -center.y*scale, -center.z*scale]}` at apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2643.
  - OrbitControls was fed a target derived from the prebaked center (scaled) rather than the world origin, causing orbits around empty space and subtle, jumpy responses.

- Fix: make orbit pivot the world origin in prebaked mode.
  - Target computation: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2000.
    - Old behavior: returned scaled `prebakedTransform.center` for prebaked target.
    - New behavior: returns `[0,0,0]` when `prebakedTransform` is present, matching the group translation so the orbit pivot aligns with the visible cloud.
  - OrbitControls uses this target via `SceneControls`: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2796 (`target={cameraFitTarget}`).

- Logging: add a reliable copy/paste camera logger.
  - Button handler updated to emit `{ position, target, fov }` and an inline JSON preset; attempts clipboard copy.
  - File: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2761.
  - Helper import to access R3F state: apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:9 (`getR3FStateOrNull`).
  - Data flow:
    - Reads camera via R3F store; reads OrbitControls target if present, otherwise falls back to `camera.userData.target` (maintained by CameraSync).
    - Rounds values to 3 decimals and prints both object and inline JSON for direct reuse.

- Draw overlay is not interfering when OFF.
  - apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx:520 sets `pointerEvents: 'none'` and `inert={true}` when “Draw: Off” (zIndex 3 at 520), ensuring controls receive pointer input.

### File Diffs and Line References

- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2000
  - Prebaked `cameraFitTarget` now returns `[0,0,0]` instead of scaled center.
- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2643
  - Confirms geometry group translation by `-center * scale` (why the world origin is the correct orbit target).
- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2796
  - `SceneControls` receives `target={cameraFitTarget}` (wires fix into OrbitControls).
- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2761
  - “Log Camera” button logs `{ position, target, fov }` and inline JSON; tries clipboard copy.
- apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:9
  - Adds `getR3FStateOrNull` import to fetch camera/controls safely.
- apps/cryptiq-mindmap-demo/app/components/dreamdust/InkFieldHost.tsx:520
  - Draw overlay pointer behavior evidence (non-interactive when OFF).

### State/Data Flow Snapshot

- `prebakedTransform` computed upstream → group translated by `-center*scale` → cloud center lands at world origin.
- `cameraFitTarget` (prebaked): returns `[0,0,0]` → `SceneControls.target` → OrbitControls orbits around world origin (correct pivot).
- `CameraSync` updates `camera.userData.target` with `fitTarget` (apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2941), used as fallback for logging when OrbitControls target isn’t directly available.
- Logger reads R3F `state.camera` and `state.controls.target`, prints and copies the preset for hardcoding.

### Verification Steps

- With Draw Off, orbit/pan feel consistent; no jumpy behavior.
- Press “Fit” to reframe; then orbit again to confirm pivot is centered.
- Click “Log Camera” to capture and copy the preset; paste values into a constant or initial camera config as needed.

### Next Step (Optional)

- Define a `CAMERA_PRESET` and use it for initial `Canvas camera` and `SceneControls target` for fully deterministic loads. This can be added adjacent to apps/cryptiq-mindmap-demo/app/components/PointCloudStage.tsx:2494.
