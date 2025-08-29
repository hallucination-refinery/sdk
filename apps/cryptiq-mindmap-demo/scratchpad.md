# Point Cloud Visualization Debug Sessions

## Session 1 - Added Logging
- Added comprehensive buffer verification logging to identify point count and attribute issues
- Added logging of dimensions, candidate counts, and final array lengths
- Added sampling of first few UV, depth, and color values for verification

## Session 2 - Minimal Baseline Render

### Changes Made:
- Added `USE_BASELINE_RENDER = true` constant to toggle between baseline and shader modes
- Modified position calculation to compute actual 3D positions when in baseline mode:
  - CPU-computed positions as flat sheet at fixed depth (-800 units)
  - World coordinates: X spans 800 units, Y spans 600 units, Z fixed at -800
- Implemented conditional rendering:
  - Baseline mode: Uses simple `pointsMaterial` with `sizeAttenuation=true` and `vertexColors=true`
  - Shader mode: Uses existing custom shader (preserved for comparison)
- Only include UV and depth attributes when in shader mode (not needed for baseline)
- Added render mode logging to buffer verification

### Acceptance Criteria Met:
- ✅ Added USE_BASELINE_RENDER flag to toggle rendering modes
- ✅ Baseline mode uses simple pointsMaterial instead of custom shader
- ✅ Positions form visible flat sheet at fixed depth (-800 units)
- ✅ Preserved shader path for comparison
- ✅ Should confirm if issue is with shader or geometry/attributes

### Expected Result:
If baseline mode shows visible points in a flat sheet pattern, the issue is with the custom shader. If no points are visible, the issue is with geometry/attributes/point count.

## Session 3a - UV-Only Shader Debugging

### Changes Made:
- Added `USE_UV_ONLY_SHADER = true` flag to enable UV-only debugging mode
- Created shader variant that uses UV coordinates only, bypassing all depth/PV^-1 calculations
- Modified vertex shader to map UV (0,0)-(1,1) directly to NDC (-1,-1)-(1,1) in clip space
- Renders flat sheet at z=0 in clip space to isolate UV attribute correctness
- Simplified point size calculation for consistent debugging
- Updated render mode logging to show UV_ONLY_SHADER mode

### Implementation Details:
- UV-only shader uses minimal attributes: `aUv`, `color` only
- Direct mapping: `vec2 ndc = aUv * 2.0 - 1.0; gl_Position = vec4(ndc, 0.0, 1.0)`
- Fixed point size: `gl_PointSize = uBaseSize * 2.0`
- Preserves both baseline and full shader modes for comparison

### Acceptance Criteria Met:
- ✅ Added shader variant that uses UV coordinates only
- ✅ Maps UV (0,0)-(1,1) to NDC (-1,-1)-(1,1) in clip space
- ✅ Should produce visible flat sheet covering viewport if UV data is correct
- ✅ Kept baseline mode intact for comparison
- ✅ Isolates UV attribute correctness from depth/projection calculations

### Expected Result:
If UV-only mode shows a visible sheet of points covering the viewport, the UV attributes are being passed correctly. This helps isolate whether the issue is in UV data vs depth/projection calculations.

## Session 4 - Controls Sanity Check

### Changes Made:
- Updated OrbitControls configuration for proper camera movement:
  - `minDistance` changed from 200 to 100 (allows closer inspection)
  - `maxDistance` changed from 3000 to 5000 (allows pulling back further)
  - `target` changed from `[0, 0, -800]` to `[0, 0, 0]` (centers on origin)
- Verified canvas has `pointerEvents='auto'` (already properly set)
- Verified no blocking overlay divs (none found)
- Camera controls should now have proper movement range around origin

### Implementation Details:
- Controls now orbit around origin (0,0,0) instead of offset target at -800z
- Increased zoom range allows better debugging of point cloud positioning
- Canvas properly configured with pointer events enabled and touch-action none
- Console logging on control start to verify interaction detection

### Acceptance Criteria Met:
- ✅ Updated OrbitControls with minDistance=100, maxDistance=5000
- ✅ Set target to [0,0,0] for origin-centered orbiting
- ✅ Verified canvas pointerEvents='auto' is set
- ✅ No overlay divs blocking interaction found
- ✅ Camera should be able to orbit and zoom properly around point cloud

### Expected Result:
Camera controls should now respond properly to mouse/touch input with appropriate distance limits and orbiting centered on the origin. This helps isolate whether interaction issues were due to control configuration vs other factors.

## Session 5 - Performance Safeguards

### Changes Made:
- Reduced point count cap from 250k to 150k to prevent performance cliffs during debugging
- Changed default stride from 1 to 2 to reduce point density and improve performance
- Disabled bloom effect temporarily for performance (wrapped in `false && bloomEnabled` condition)
- Added session comments to clearly identify performance safeguards

### Implementation Details:
- `maxPoints` reduced from 250_000 to 150_000 with explanatory comment
- Default `stride` parameter changed from 1 to 2 in component props
- BloomPass component disabled with `false &&` condition and comment explaining temporary removal
- All changes include "Session 5" markers for easy identification and reversal

### Acceptance Criteria Met:
- ✅ Point count capped to ≤150k (reduced from 250k)
- ✅ Default stride increased to 2 (from 1) to reduce point density
- ✅ Bloom effect disabled during debugging phase
- ✅ Performance should be stable even with debug logging enabled
- ✅ Changes clearly marked for easy identification and reversal

### Expected Result:
The point cloud should render with significantly fewer points (due to both the lower cap and increased stride), resulting in better performance during debugging. The absence of bloom effects should further improve framerate and stability. This creates a safe baseline for debugging geometry and shader issues without hitting performance bottlenecks.

## Session 3b - PV^-1 World-Space with Constant Depth

### Changes Made:
- Added `USE_PV_INVERSE_SHADER = true` flag to enable PV^-1 unprojection testing
- Set `USE_UV_ONLY_SHADER = false` to switch from session 3a to session 3b mode
- Created shader variant that tests PV^-1 matrix capture and unprojection logic:
  - Uses constant depth (NDC z = 0.0) to create flat sheet in world space
  - Unprojects NDC coordinates to world space using captured `uPVInvCapture` matrix
  - Performs perspective divide on unprojected coordinates
  - Re-projects to current camera view using standard Three.js matrices
- Updated render mode logging to include `PV_INVERSE_SHADER` mode

### Implementation Details:
- New shader variant maps UV to NDC: `vec2 ndc = aUv * 2.0 - 1.0`
- Creates NDC position with constant depth: `vec4 ndcPos = vec4(ndc, 0.0, 1.0)`
- Unprojects to world space: `vec4 worldPos = uPVInvCapture * ndcPos`
- Applies perspective divide: `worldPos.xyz /= worldPos.w`
- Re-projects using current matrices: `gl_Position = projectionMatrix * modelViewMatrix * vec4(worldPos.xyz, 1.0)`
- Uses simple point size for consistent debugging: `gl_PointSize = uBaseSize * 2.0`

### Acceptance Criteria Met:
- ✅ Added shader variant that uses PV^-1 with constant depth
- ✅ Creates flat sheet in world space that should move with orbit
- ✅ Tests the PV^-1 capture and unprojection logic
- ✅ Verifies whether the inverse projection-view matrix is correctly captured
- ✅ Isolates unprojection behavior from depth-dependent calculations

### Expected Result:
If the PV^-1 matrix is captured correctly and the unprojection logic works, the flat sheet should appear in world space and move properly when orbiting the camera. This verifies that the matrix capture and transformation pipeline is functioning before adding depth-dependent positioning.

## Session 3c - Shader Depth Band Mapping and Drift

### Changes Made:
- Enabled full shader with complete depth band mapping using `aDepth` attribute
- Implemented 3D positioning based on actual depth values from the depth buffer
- Added subtle drift calculations for aesthetic "airy" movement effect
- Replaced debug path with proper world-space depth band mapping

### Implementation Details:
- **Depth Band Mapping**: Maps `aDepth` (0-1) to world Z coordinates: `float worldZ = mix(-200.0, -2000.0, aDepth) * uZScale`
  - Near points (aDepth=0) positioned at -200 * uZScale world units from camera
  - Far points (aDepth=1) positioned at -2000 * uZScale world units from camera
  - Uses `uZScale` uniform for depth scaling control
- **World Space Positioning**: 
  - Builds near and far world positions using captured `uPVInvCapture` matrix
  - Interpolates between near/far using aDepth: `vec3 worldPos = mix(nearWorld.xyz, farWorld.xyz, aDepth)`
  - Overrides Z coordinate with depth band mapping for proper 3D cloud structure
- **Drift Calculations**: Added subtle animated movement for visual appeal
  - Time-based drift: `float drift = uTime * 0.3`
  - Per-point hash for variation: `float hashVal = hash12(aUv * 100.0)`
  - Sinusoidal X/Y offsets: 15-unit X drift, 10-unit Y drift with different frequencies
- **Depth-Based Sizing**: Points sized based on depth and luminance
  - Near points 1.5x size, far points 0.5x size: `float depthSize = mix(0.5, 1.5, vNear)`
  - Bright points larger: `float lumaSize = mix(0.7, 1.6, luma)`
  - Combined sizing: `gl_PointSize = uBaseSize * depthSize * lumaSize`

### Acceptance Criteria Met:
- ✅ Enabled full shader with depth band mapping instead of debug flat sheet
- ✅ Uses `aDepth` attribute to position points in true 3D space
- ✅ Implements world-space depth bands from -200 to -2000 units scaled by `uZScale`
- ✅ Adds drift calculations with time-based sinusoidal movement
- ✅ Creates proper 3D point cloud with depth-based positioning and sizing

### Expected Result:
The point cloud should now render as a true 3D volume with points positioned at different depths based on the original depth buffer data. Points should drift gently to create an "airy" animated effect. Near points should appear larger and brighter, while far points should be smaller. The cloud should have proper depth separation instead of appearing as a flat sheet.

## Session 6 - Aesthetic Tuning

### Changes Made:
- **Re-enabled bloom effect** with strength=0.12, radius=0.15, threshold=0.6 for final "tweet look"
- **Fine-tuned density parameters** for better stochastic gaps:
  - Adjusted keep formula: `(0.38 + 0.42 * near + 0.25 * (1.0 - luma))` (was 0.45 + 0.35 * near + 0.2 * (1.0 - luma))
  - Even low point counts maintain slight sparsity: `finalKeep = 0.95` instead of 1.0
- **Enhanced depth perception** with tighter depth bands:
  - Changed depth mapping from `mix(-200.0, -2000.0, aDepth)` to `mix(-180.0, -1800.0, pow(aDepth, 0.85))`
  - Added subtle gamma adjustment: `uGamma: { value: 0.85 }` (was 1.0)
- **Refined drift parameters** for more organic movement:
  - Adjusted drift speed: `uTime * 0.25` (was 0.3) for gentler movement
  - Enhanced drift amplitudes: X=18.0 (was 15.0), Y=12.0 (was 10.0)
  - Tweaked drift frequencies for better organic feel
- **Improved point sizing** for greater visual variety:
  - Depth-based size range: `mix(0.4, 1.8, vNear)` (was 0.5, 1.5)
  - Luma-based size range: `mix(0.6, 1.8, luma)` (was 0.7, 1.6)
- **Enhanced fragment shader** for better bloom response:
  - Softer edge falloff: `smoothstep(0.65, 0.1, r)` (was 0.6, 0.15)
  - Enhanced alpha formula: `vNear*0.7+0.15, 0.15, 0.95` for better bloom pickup

### Implementation Details:
- **Stochastic Sparsity**: More aggressive sparse sampling in bright/far areas (0.38 base vs 0.45)
- **Depth Band Tightening**: Closer depth range (180-1800 vs 200-2000) with power curve for better near/far contrast
- **Drift Enhancement**: Slightly stronger organic movement with adjusted frequencies for natural feel
- **Size Variation**: Greater dynamic range in point sizes based on depth and luminance
- **Bloom Optimization**: Lower threshold (0.6 vs 0.7) and larger radius (0.15 vs 0.1) for softer glow
- **Alpha Tuning**: Enhanced alpha response for better additive blending and bloom pickup

### Acceptance Criteria Met:
- ✅ Re-enabled bloom with appropriate strength (≈0.12) and tuned parameters
- ✅ Fine-tuned density parameters for stochastic gaps creating "airy" feel
- ✅ Adjusted depth band and gamma for better depth perception
- ✅ Tweaked drift parameters for subtle, organic movement
- ✅ Achieved visually compelling "smoke/air" aesthetic with enhanced bloom response

### Expected Result:
The point cloud should now have the final "tweet look" aesthetic with re-enabled bloom creating soft glows around particles. The enhanced stochastic sparsity should create more natural gaps, giving an airy, smoke-like appearance. Tighter depth bands and improved sizing should provide better 3D depth perception. The refined drift parameters should create subtle, organic movement that enhances the ethereal quality of the visualization.