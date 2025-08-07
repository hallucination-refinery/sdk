# Technical Roadmap: Phase 2 Migration Completion

**Created**: 2025-08-07, 14:50 PM EST  
**Updated**: 2025-08-07, 15:10 PM EST (Post-Audit Revision)
**Purpose**: Precise fix sequence to complete the stalled Phase 2 migration

## Executive Summary

The Phase 2 migration from `@refinery/interaction` to `@refinery/store` has been stalled for three weeks due to multiple compounding issues. The migration was assumed to be "functionally complete" but investigation reveals six major root causes that must be addressed in a specific sequence to avoid further regression.

## Critical Issues Identified (Verified)

1. ✅ **Simulation not initializing** - Missing props prevented D3 force layout from starting (FIXED)
2. ✅ **Selector hook stubbed** - Declarative visual feedback completely broken (FIXED)
3. ⚠️ **Async store updates** - Race conditions with synchronous visual feedback (CONFIRMED, NOT FIXED)
4. ⚠️ **GraphData undefined** - Imperative methods cannot access node data (NEEDS RUNTIME VERIFICATION)
5. ⚠️ **Multiple broken paths** - Three separate visual feedback mechanisms all failing (PARTIALLY FIXED)
6. ✓ **Incomplete migration** - Only 2 "Sub-W" stubs found, not systemic issue

## Fix Sequence (Order Matters!)

### Phase 1: Stabilize Core Functionality ✅ COMPLETED

**Goal**: Get the application running without crashes

1. ✅ **Restore simulation props** (DONE)
   - Add back `cooldownTime={Infinity}`, `cooldownTicks={0}`, `d3AlphaDecay={0}`
   - Enable engine ready check to prevent tick crashes
   - **File**: `/workspace/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx`

2. ✅ **Fix selector hook** (DONE)
   - Connect `useSingleSelectedNode` to actual store
   - **File**: `/workspace/apps/legacy-import/cryptic-vault-demo/store/selectors.ts`

### Phase 2: Fix Timing Issues (CRITICAL PATH)

**Goal**: Resolve race conditions between store and visual feedback

3. **Remove queueMicrotask delays** ⚠️ HIGH RISK
   - Currently ALL store methods use queueMicrotask (lines 73, 100, 124, 146, 160+ in ui-slice.ts)
   - This causes imperative methods to fire BEFORE state updates complete
   - **Approach**: Selectively remove for visual feedback methods only
   - **Files**: 
     - `/workspace/packages/store/src/slices/ui-slice.ts` (setHoverNode, selectNodes, clearSelection)
   - **Risk**: May cause remounts - test thoroughly

4. **Fix graphData exposure** ⚠️ COMPLEX
   - ForceGraph3D component must expose internal data via graphData() method
   - Currently returns undefined even after data is passed
   - **Investigation needed**: 
     - Check r3f-forcegraph library source
     - May need to access __kapsuleInstance directly
     - Consider using ref.current._graphData fallback
   - **File**: `/workspace/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx`

### Phase 3: Restore Visual Feedback

**Goal**: Get all three feedback paths working

5. **Declarative Path**
   - Verify `mouseSelectedNodeId` prop flows correctly
   - Ensure `nodeThreeObject` reads selection state
   - Check `buildCrypticNodeSprite` applies correct colors
   - **Test**: Click node → color changes

6. **Imperative Path**
   - Fix `highlightNode` to wait for graphData availability
   - Ensure material mutations persist across renders
   - **Test**: Hover node → yellow highlight appears

7. **UseFrame Path**
   - Verify opacity/color updates in animation loop
   - Ensure store state is read synchronously
   - **Test**: Smooth transitions during interactions

### Phase 4: Complete Migration

**Goal**: Replace all "Sub-W" stubs with real implementations

8. **Audit for stubs**
   - Search for "Sub-W", "stub", "TODO", "FIXME"
   - Implement all placeholder functionality
   - Document any intentional simplifications

9. **Verify against requirements**
   - Test all items in "Intended Behaviour" checklist
   - Ensure physics behaves correctly (burst on lens change only)
   - Validate HUD interactions work as expected

### Phase 5: Performance & Stability

10. **Optimize render cycles**
    - Profile for unnecessary re-renders
    - Ensure memoization is effective
    - Remove development console.logs

11. **Add error boundaries**
    - Wrap ForceGraph3D in error boundary
    - Add fallback UI for initialization failures
    - Log errors for debugging

## Testing Protocol

After each phase, run smoke tests:

```bash
npm run dev
# Open http://localhost:3000
```

### Test Checklist:
- [ ] No console errors on load
- [ ] Nodes appear and animate from origin
- [ ] Hover shows yellow highlight
- [ ] Click shows orange selection
- [ ] Click background clears selection
- [ ] Lens change triggers single burst
- [ ] Timeline scrub maintains positions
- [ ] Category filters work without physics

## Risk Mitigation

**If fixes cause new issues:**
1. Revert to last working commit
2. Apply fixes one at a time
3. Test after each change
4. Document any unexpected behavior

**Fallback option:**
- If Phase 2-5 prove too complex, consider reverting to `@refinery/interaction`
- The architectural mismatch may be too fundamental to resolve quickly

## Success Criteria

The migration is complete when:
1. All console errors eliminated
2. Visual feedback works on hover/click
3. Physics simulation runs continuously
4. Store state syncs with visual state
5. No race conditions or timing issues
6. All "Sub-W" stubs replaced
7. Performance comparable to legacy implementation

## Time Estimate

- Phase 1: ✅ Complete
- Phase 2: 2-4 hours
- Phase 3: 4-6 hours  
- Phase 4: 2-3 hours
- Phase 5: 1-2 hours

**Total: 9-15 hours of focused work**

## Next Immediate Action

Start with Phase 2, Step 3: Remove queueMicrotask delays in store updates.
This is the most critical issue blocking visual feedback.

---

## Audit Notes (Added 15:10 PM)

### Verified Fixes
- Simulation props restored and working
- Selector hook connected properly
- Dynamic import replaced with direct import

### Remaining Critical Issues
1. **queueMicrotask race conditions** - Confirmed in all store methods
2. **graphData() undefined** - Pattern verified, runtime behavior unknown
3. **Three feedback paths** - Only declarative path partially fixed

### Risk Assessment
- **HIGH**: Removing queueMicrotask may cause React remount issues
- **MEDIUM**: graphData() fix may require library modification
- **LOW**: Remaining stubs are minimal (only 2 found)

### Recommended Approach
1. Test current state thoroughly before proceeding
2. Create branch for queueMicrotask removal
3. Implement changes incrementally with testing between each
4. Consider fallback to @refinery/interaction if Phase 2 proves too risky