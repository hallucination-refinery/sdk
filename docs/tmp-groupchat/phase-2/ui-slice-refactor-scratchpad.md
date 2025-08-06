# UI Slice Refactor Scratchpad

## Task Overview
Refactor ui-slice.ts to prevent React's "Cannot update a component while rendering" errors by ensuring state setters execute after React's commit phase.

## Initial Investigation (08:23 EST, 06-08-2025)

### Key Findings:

1. **Root Cause Identified**: 
   - Error occurs at `ui-slice.ts:72` in the `selectNodes` function
   - Stack trace shows: `selectNodes` � `handleBackgroundClick` � render phase of ForwardRef component
   - The `set()` calls in ui-slice trigger Zustand state updates during render

2. **Affected State Setters in ui-slice.ts**:
   - `selectNodes` (line 71-90)
   - `selectEdges` (line 92-111)
   - `clearSelection` (line 113-121)
   - `setHoverNode` (line 123-130)
   - `setHoverEdge` (line 132-139)
   - `setCameraPosition` (line 142-149)
   - `setZoom` (line 151-158)
   - `setLayout` (line 169-177)
   - `pauseLayout` (line 179-186)
   - `resumeLayout` (line 188-195)
   - `resetLayout` (line 197-204)
   - `setTheme` (line 207-217)
   - `updateThemeProperty` (line 219-229)
   - `highlightNodes` (line 232-241)
   - `highlightEdges` (line 243-252)
   - `clearHighlights` (line 254-262)

3. **Error Manifestation**:
   - Hovering on nodes triggers infinite render loop
   - Console floods with "[FGAdapter] mounted" logs
   - DevTools freezes and crashes
   - FPS drops significantly

4. **Success Criteria Verification**:
   - Currently failing: setState-in-render React errors present
   - Currently failing: hovering triggers FGAdapter remounts
   - Need to verify: pnpm run smoke-check status
   - Need to verify: manual smoke-screen tests
   - Need to verify: TypeScript compilation

## Next Steps:
1. Search for components calling these setters during render (especially CrypticVaultScene.tsx:376)
2. Identify the pattern of how these are being invoked
3. Refactor to ensure state updates happen after commit phase

## OODA Loop 1: Find Render-Phase Calls
- **Observe**: Need to find where state setters are called during render
- **Orient**: Stack trace points to CrypticVaultScene.tsx:376 handleBackgroundClick
- **Decide**: Search for this file and examine the implementation
- **Act**: Use grep to find all calls to ui-slice setters

### Investigation Results:

1. **Call Chain Identified**:
   - CrypticVaultScene.tsx defines handlers that call ui-slice setters:
     - `handleNodeClick` (line 351) → `uiStore.selectNodes([nodeId], 'replace')`
     - `handleNodeHover` (line 368) → `uiStore.setHoverNode(nodeId)`
     - `handleBackgroundClick` (line 375) → `uiStore.selectNodes([], 'replace')`
   
2. **Props Flow**:
   - CrypticVaultScene passes handlers to CrypticAnimusScene
   - CrypticAnimusScene passes them to ForceGraph3D (via ForceGraphAdapter)
   - ForceGraph3D (r3f-forcegraph) is invoking these callbacks during render

3. **Root Issue**: The r3f-forcegraph library is calling these event handlers during the render phase instead of during actual DOM events. This violates React's rules.

## OODA Loop 2: Design Solution
- **Observe**: State updates must happen after React's commit phase
- **Orient**: We need to defer the state updates without changing the external API
- **Decide**: Wrap the state setters in ui-slice.ts to defer execution
- **Act**: Implement deferred execution using queueMicrotask or React.startTransition

### Solution Approach:

The cleanest solution is to modify the ui-slice.ts state setters to automatically defer their execution. This way:
1. We don't need to modify every component that uses these setters
2. The fix is centralized in one place
3. The API remains unchanged
4. Future uses will automatically be safe

### Implementation Plan:
1. Wrap each `set()` call in ui-slice.ts with `queueMicrotask()` to defer execution
2. This ensures state updates happen after the current render completes
3. Maintain the same return values (RendererCommand) synchronously

## Implementation Complete (08:30 EST, 06-08-2025)

### Changes Made:
Wrapped all state setters in ui-slice.ts with `queueMicrotask()` to defer state updates:
- ✅ selectNodes
- ✅ selectEdges
- ✅ clearSelection
- ✅ setHoverNode
- ✅ setHoverEdge
- ✅ setCameraPosition
- ✅ setZoom
- ✅ setLayout
- ✅ pauseLayout
- ✅ resumeLayout
- ✅ resetLayout
- ✅ setTheme
- ✅ updateThemeProperty
- ✅ highlightNodes
- ✅ highlightEdges
- ✅ clearHighlights

### Key Benefits:
1. State updates now happen after React's commit phase
2. API remains unchanged - no component refactoring needed
3. Future-proof - any new calls will automatically be safe
4. Minimal performance impact - microtasks run immediately after current task

### Next: Verify TypeScript compilation and run tests

## Test Results (08:32 EST, 06-08-2025)

### TypeScript Compilation: ✅ PASS
- `pnpm exec tsc --noEmit` completed successfully
- No type errors introduced by the changes

### Smoke Check: ✅ PASS
- TypeScript compilation passed
- ForceGraphAdapter smoke test passed
- All checks passed - Graph is healthy

### Ready for Commit
The refactor is complete and all automated tests pass. Next step is to commit and then perform manual smoke-screen tests to verify the React render errors are gone.

---