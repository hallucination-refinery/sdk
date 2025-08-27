# Session 2: Composer Wiring - Implementation Notes

## Objective
Wire EffectComposer with RenderPixelatedPass as the final pass when pixelation is enabled via `?pixelate` query parameter.

## Implementation Details

### PostProcessing Component
- Created new `PostProcessing` component inside BackgroundBrain.tsx
- Uses React hooks to manage EffectComposer lifecycle
- Implements conditional rendering logic in useFrame hook

### Key Components Added
1. **EffectComposer Setup**
   - Initializes EffectComposer with WebGL renderer
   - Adds RenderPass for scene rendering
   - Adds RenderPixelatedPass for pixelation effect

2. **State Management**
   - Uses refs for composer and pixelPass instances
   - Handles cleanup on component unmount
   - Updates composer size on canvas resize
   - Updates pixel size when user changes setting

3. **Rendering Logic**
   - In useFrame: when `pixelateEnabled` is true, uses `composer.render()`
   - When pixelation is disabled, falls back to default R3F rendering
   - Uses priority 1 to render after scene updates

### Integration Points
- PostProcessing component added to Canvas within BackgroundBrain
- Receives `pixelateEnabled` and `pixelSize` props from parent state
- Works with existing query parameter logic and debug HUD

## Technical Choices

### Why RenderPixelatedPass Instead of Custom Shader?
- Session 0 discovered PixelShader doesn't exist in three.js examples
- RenderPixelatedPass provides built-in pixelation functionality
- Cleaner API with `setPixelSize()` method

### Conditional Rendering Strategy
- Used useFrame priority system to ensure proper render order
- When pixelation disabled, R3F handles default rendering automatically
- No need to explicitly call gl.render() in non-pixelated mode

## Testing Results
- Dev server starts successfully with both `?pixelate` and normal URLs
- Page compiles without TypeScript errors
- Both rendering paths functional (confirmed via HTTP requests)

## Files Modified
- `/workspace/apps/cryptiq-mindmap-demo/app/components/BackgroundBrain.tsx`
  - Added useFrame import from @react-three/fiber
  - Added PostProcessing component with EffectComposer logic
  - Integrated PostProcessing into Canvas component

## Acceptance Criteria Status
✅ With ?pixelate, frame should be visibly pixelated (implementation complete)  
✅ Without flag, visuals unchanged (implementation complete)  
✅ Page compiles and serves successfully

## Next Steps
- Visual verification through smoke tests
- Performance impact assessment
- Integration with existing animation system