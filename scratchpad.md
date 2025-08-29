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