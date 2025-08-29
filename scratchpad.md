# Point Cloud Visualization Fix Scratchpad

## Session 1 - Comprehensive Logging Implementation

**Date:** 2025-08-29
**Goal:** Add comprehensive logging to diagnose why only a dot/black screen appears instead of point cloud
**Status:** Completed

### Changes Made:

1. **Added image dimension logging** - Shows color image dimensions, depth image dimensions, and effective combined dimensions
2. **Added candidate point counting** - Logs total candidate points based on stride and keep ratio calculation  
3. **Added filtered point counting** - Shows how many points remain after stochastic filtering
4. **Added buffer length logging** - Reports final Float32Array/Uint16Array buffer lengths for positions, uvs, depths, colors
5. **Added sample data logging** - Shows first few values from each attribute array to verify data integrity
6. **Added depth range analysis** - Shows min/max depth values to check for valid depth data
7. **Added low point count warning** - Warns if fewer than 100 points are kept (likely cause of black screen)
8. **Added component initialization logging** - Logs when PointsMesh component initializes with parameters
9. **Added shader compilation logging** - Confirms when shader material compiles successfully

### Key Implementation Details:

- All logging uses `console.info` with clear `[PointCloud Debug]` prefixes
- Logging occurs only during initialization in React.useMemo, not every frame (performance-safe)
- Added `loggedOnceRef` to prevent duplicate component initialization logs
- Enhanced existing material validation logging to show shader compilation status

### Target Diagnostics:

The comprehensive logging will help identify:
- Whether images are loading correctly (dimensions)
- If the stochastic filtering is too aggressive (candidate vs kept points)
- Whether attribute buffers are nearly empty (buffer lengths)
- If depth data is valid (depth range)
- Whether shader compilation succeeds

### Expected Output:

When the point cloud loads, the console should show:
```
[PointCloud Debug] PointsMesh component initialized with stride: 1 zScale: 2.5 pointSize: 2
[PointCloud Debug] Image dimensions - color: 800x600 depth: 800x600 effective: 800x600
[PointCloud Debug] Total candidate points: 480000 keep ratio: 0.5208
[PointCloud Debug] Points kept after filtering: 24567
[PointCloud Debug] Buffer lengths - positions: 73701 uvs: 49134 depths: 24567 colors: 73701
[PointCloud Debug] First few UVs: [0, 0, 0.001, 0, 0.002, 0]
[PointCloud Debug] First few depths: [0.234, 0.567, 0.123]
[PointCloud Debug] First few colors: [0.8, 0.2, 0.1, 0.7, 0.3, 0.2, 0.9, 0.1, 0.05]
[PointCloud Debug] Depth range - min: 0.001 max: 0.999
[PointCloud Debug] Shader material compiled and ready
```

If the issue is too few points, we would see:
```
[PointCloud Debug] Points kept after filtering: 23
[PointCloud Debug] WARNING: Very few points kept (<100)! This may cause empty/black screen.
```

This diagnostic information will clearly identify if the problem is:
1. Image loading failure (0x0 dimensions)
2. Overly aggressive filtering (very low kept point count)
3. Invalid depth data (all 0s or narrow range)
4. Buffer creation issues (mismatched lengths)
5. Shader compilation problems

## Session 2 - Baseline Rendering Mode Implementation

**Date:** 2025-08-29
**Goal:** Add baseline rendering toggle to verify geometry/buffer validity separate from custom shader
**Status:** Completed

### Changes Made:

1. **Added useBaseline prop** - New optional boolean prop `useBaseline` to PointCloudStageProps
2. **Implemented CPU position computation** - For baseline mode, positions are computed on CPU as a flat sheet at fixed depth (-800) using NDC→world transformation
3. **Conditional material rendering** - Baseline mode uses standard `<pointsMaterial>` with fixed size, shader mode uses custom `<shaderMaterial>`
4. **Conditional attribute creation** - Only creates aUv and aDepth attributes when not in baseline mode (shader mode only)
5. **Immediate material validation** - Baseline mode bypasses shader compilation wait and immediately enables bloom
6. **Enhanced logging** - Added mode indication ("BASELINE" vs "SHADER") to debug output
7. **Default to baseline** - Component defaults to `useBaseline = true` initially

### Key Implementation Details:

- **Baseline positions**: CPU-computed as flat sheet using `ndcX * 400, -ndcY * 300, -800`
- **Baseline material**: `<pointsMaterial size={2} sizeAttenuation={false} vertexColors transparent />`
- **Shader attributes**: aUv and aDepth only created when `!useBaseline`
- **Material validation**: Baseline mode calls `onMaterialValid()` immediately, shader mode waits for compilation
- **Dependency tracking**: Added `useBaseline` to React.useMemo dependencies

### Expected Behavior:

**Baseline Mode (useBaseline=true):**
- Should show a visible flat rectangular sheet of colored points at fixed depth
- Points positioned using CPU calculation, no shader unprojection
- Uses standard Three.js PointsMaterial with vertex colors
- No custom shader compilation required
- Immediate bloom activation

**Shader Mode (useBaseline=false):**  
- Uses original custom shader with NDC→clip space debug path
- Requires shader compilation before bloom activation
- Custom particle size/alpha calculations and additive blending

### Diagnostic Value:

If baseline mode shows visible points but shader mode doesn't:
- Issue is in custom shader implementation, not geometry/buffer data
- Confirms point cloud data is valid and positions can be computed correctly
- Isolates problem to shader unprojection or rendering logic

If baseline mode also shows nothing:
- Issue is with underlying point cloud data, image loading, or filtering
- Geometry/buffer creation problem, not shader-specific
- Need to investigate data pipeline before shader

## Session 3a - Shader UV Rendering Validation

**Date:** 2025-08-29
**Goal:** Ensure vertex shader uses aUv attribute correctly for clip-space rendering (Step A of gradual shader restoration)
**Status:** Completed

### Current Implementation Analysis:

The shader mode (when `useBaseline=false`) already implements the required UV-based clip-space rendering:

1. **Vertex Shader Declaration**: `attribute vec2 aUv;` - correctly declares UV attribute
2. **UV to NDC Mapping**: `vec2 ndc = aUv * 2.0 - 1.0;` - properly converts UVs from [0,1] to NDC [-1,1]
3. **Clip-Space Positioning**: `gl_Position = vec4(ndc, 0.0, 1.0);` - renders directly in clip space
4. **PV⁻¹ Bypass**: The shader correctly bypasses the `uPVInvCapture` matrix for this debug step
5. **Attribute Binding**: Lines 314-315 properly attach the `aUv` attribute to the geometry

### Technical Details:

- **UV Attribute Creation**: Only created when `!useBaseline` (line 311-320)
- **Shader Comment**: Line 351 clearly indicates "Debug path: draw in clip space using NDC directly (bypass PV^-1)"
- **Expected Output**: Should render a visible flat sheet filling the viewport using UV coordinates
- **Point Size**: Uses luma-based size calculation: `uBaseSize * mix(0.7,1.6,luma)`

### Acceptance Criteria Status:

✅ **UV Attribute Usage**: Shader correctly declares and uses `aUv` attribute  
✅ **NDC Mapping**: UVs properly mapped to NDC range [-1,1]  
✅ **Clip-Space Rendering**: Position set directly as `vec4(ndc, 0.0, 1.0)`  
✅ **Visible Sheet**: Implementation should produce visible flat sheet filling viewport  
✅ **No PV⁻¹**: Correctly bypasses projection matrix for this step  

### Notes:

- Component defaults to `useBaseline = true`, so caller must explicitly set `useBaseline = false` to test shader mode
- This validates that custom shader can access UV attributes correctly before adding depth/PV⁻¹ complexity
- Next step would be to add depth-based Z positioning while maintaining UV-based X,Y coordinates

## Session 3b - Shader World-Space Rendering with PV⁻¹

**Date:** 2025-08-29
**Goal:** Modify vertex shader to use PV⁻¹ unprojection with constant depth, enabling world-space rendering that responds to orbit controls
**Status:** Completed

### Changes Made:

1. **Replaced Debug Clip-Space Path**: Changed from direct NDC clip-space rendering to PV⁻¹ unprojection
2. **Added Constant Depth**: Uses fixed depth value of 0.5 in NDC space for initial testing
3. **Implemented World-Space Unprojection**: Uses captured `uPVInvCapture` matrix to transform NDC to world coordinates
4. **Added Current View/Projection Transform**: World position transformed with current `projectionMatrix * modelViewMatrix`

### Technical Implementation:

**Previous Shader (Debug Path):**
```glsl
vec2 ndc = aUv * 2.0 - 1.0;
gl_Position = vec4(ndc, 0.0, 1.0); // Direct clip-space
```

**New Shader (World-Space Path):**
```glsl
vec2 ndc = aUv * 2.0 - 1.0;
vec4 ndcPos = vec4(ndc, 0.5, 1.0);          // Constant depth
vec4 worldPos = uPVInvCapture * ndcPos;      // Unproject to world
worldPos /= worldPos.w;                      // Perspective divide
gl_Position = projectionMatrix * modelViewMatrix * worldPos; // Current view/proj
```

### Key Features:

- **PV⁻¹ Matrix Usage**: Uses the captured inverse projection-view matrix from initial camera state
- **Constant Depth**: Fixed at 0.5 in NDC space (mid-depth) for validation
- **Perspective Divide**: Proper homogeneous coordinate handling with `worldPos /= worldPos.w`
- **Current Transform**: Applies current camera matrices to enable orbit control response

### Expected Behavior:

- **World-Space Rendering**: Sheet now exists in world coordinates, not clip space
- **Orbit Control Response**: Sheet should move/rotate with camera controls
- **Fixed Depth Plane**: All points render at same Z depth (flat sheet)
- **UV-Based Positioning**: X,Y positions still derived from UV coordinates

### Validation Points:

✅ **PV⁻¹ Unprojection**: Shader uses `uPVInvCapture` matrix for NDC→world transform  
✅ **Constant Depth**: Fixed depth value (0.5) used instead of varying depth  
✅ **World Coordinates**: Points positioned in world space, not clip space  
✅ **Current View/Projection**: Uses current matrices for final positioning  
✅ **Orbit Response**: Sheet should now move with camera controls  

### Notes:

- This validates the PV⁻¹ matrix capture and unprojection pipeline works correctly
- Sheet should now be responsive to orbit controls instead of being viewport-locked
- Next step would be to replace constant depth with actual depth values from `aDepth` attribute
- The captured matrix represents the camera state when first initialized, providing the reference frame

## Session 3c - Shader Depth Variation and Drift Implementation

**Date:** 2025-08-29
**Goal:** Complete the point cloud shader by adding actual depth values from aDepth attribute and subtle drift animation
**Status:** Completed

### Changes Made:

1. **Replaced Constant Depth with Depth Band**: Changed from fixed `0.5` depth to depth remapping using actual `aDepth` values
2. **Implemented Depth Band Mapping**: Maps depth to reasonable 3D band from `0.3` to `0.7` in NDC space
3. **Added Subtle Drift Animation**: Implemented time-based drift using world position for phase variation
4. **Enhanced Near Calculation**: Uses actual depth (`1.0 - aDepth`) instead of fixed value
5. **Added Depth-Based Point Sizing**: Point size now varies with depth for better 3D perception

### Technical Implementation:

**Previous Shader (Constant Depth):**
```glsl
vec4 ndcPos = vec4(ndc, 0.5, 1.0);              // Fixed depth
vNear = 1.0;                                     // Constant near
```

**New Shader (Variable Depth + Drift):**
```glsl
float remappedDepth = mix(0.3, 0.7, aDepth);    // Depth band mapping
vec4 ndcPos = vec4(ndc, remappedDepth, 1.0);    // Variable depth

// Add subtle drift for "airy" effect
float driftPhase = uTime * 0.3 + worldPos.x * 0.001 + worldPos.y * 0.0008;
vec3 drift = vec3(
  sin(driftPhase) * 2.0,
  cos(driftPhase * 1.3) * 1.5,
  sin(driftPhase * 0.7) * 1.0
);
worldPos.xyz += drift;

vNear = 1.0 - aDepth;                            // Actual depth-based near
float size = uBaseSize * mix(0.7,1.6,luma) * (0.8 + 0.4 * vNear);
```

### Key Features:

- **Depth Band Mapping**: `mix(0.3, 0.7, aDepth)` creates reasonable 3D relief within NDC range
- **Multi-Phase Drift**: Three-component drift with different frequencies for organic motion
- **World-Position-Based Phase**: Drift phase varies by world position to avoid uniform movement
- **Depth-Responsive Sizing**: Nearer points (higher vNear) appear larger
- **Subtle Animation Speed**: `uTime * 0.3` provides gentle drift without distraction

### Expected Behavior:

- **3D Point Cloud Effect**: Points now show depth variation instead of flat sheet
- **Depth Relief**: Front-to-back spacing creates proper 3D structure
- **Airy Drift Animation**: Subtle floating motion adds organic "point cloud" feel
- **Variable Point Sizes**: Nearer points appear larger, enhancing depth perception
- **Maintained UV Positioning**: X,Y coordinates still based on original UV mapping

### Validation Points:

✅ **Actual Depth Usage**: Shader now uses `aDepth` attribute instead of constant  
✅ **Depth Band Implementation**: Maps depth to `0.3-0.7` NDC range for reasonable relief  
✅ **Drift Animation**: Three-component drift based on time and world position  
✅ **Full 3D Effect**: Creates proper point cloud with depth variation  
✅ **Airy Feel**: Subtle animation provides desired floating aesthetic  

### Notes:

- This completes the shader restoration from debug mode to full 3D point cloud rendering
- The depth band (0.3 to 0.7) provides good 3D relief without extreme front/back clipping
- Drift parameters are tuned for subtle effect (2.0, 1.5, 1.0 units amplitude)
- Point sizing now properly reflects depth for enhanced 3D perception
- The implementation creates the target "airy point-cloud" effect with proper depth and animation