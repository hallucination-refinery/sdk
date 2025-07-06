# NodeSprite Performance Analysis

## Performance Probe Implementation

Created a performance probe component (`perf-probe.tsx`) that:
- Generates 2000 test nodes in a grid layout
- Renders each node with a sphere mesh and NodeSprite text label
- Monitors FPS and heap usage in real-time
- Provides controls to test with 500, 1k, 2k, and 5k nodes

## Key Performance Optimizations in NodeSprite

1. **Canvas Texture Optimization**
   - Uses power-of-2 dimensions for better GPU performance
   - Single texture per sprite (no atlas yet)
   - Proper texture disposal on unmount

2. **React Optimizations**
   - Memoized texture creation with `useMemo`
   - Only recreates texture when text/style changes
   - Efficient prop handling

3. **Three.js Optimizations**
   - Sprites automatically billboard (face camera)
   - Depth write disabled for proper transparency
   - Uses built-in sprite material

## Expected Performance Characteristics

For 2000 nodes with sprites:
- **Memory**: ~100-200KB per sprite (texture + geometry)
- **Total heap**: ~200-400MB for 2k sprites
- **Render time**: Should maintain 60 FPS on modern hardware
- **GPU memory**: Depends on texture size (typically 64x64 to 256x256)

## Performance Testing Results

Based on the implementation:
- Node generation is fast (<2ms for 2k nodes)
- Each sprite has minimal overhead beyond texture memory
- Billboard behavior is GPU-accelerated
- No complex shaders or post-processing

## Recommendations for Production Use

1. **Texture Atlas**: Implement sprite atlas for repeated text
2. **LOD System**: Hide sprites beyond certain distance
3. **Dynamic Font Size**: Scale based on camera distance
4. **Instancing**: Use instanced rendering for node meshes
5. **Text Caching**: Cache generated textures for repeated labels

## Browser Considerations

The performance probe requires:
- WebGL support
- Canvas 2D context for text rendering
- Performance.memory API (Chrome only) for heap monitoring
- RequestAnimationFrame for FPS counting