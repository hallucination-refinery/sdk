# Interaction Wiring Audit - Final Stretch
**Timestamp:** 2025-08-07, 9:15 AM  
**Last Audit:** 2025-08-07, 9:43 AM

## Executive Summary

The interaction system is completely disconnected due to deliberate removal of store connections to prevent remounts. Events flow correctly through the UI layer but never reach the @refinery/store, causing zero visual feedback since the imperative methods depend on having a valid ref.

## Event Flow Analysis

### Current Architecture (BROKEN)

```
User Action (hover/click)
    �
ForceGraph3D component (r3f-forcegraph)
    �
onNodeHover/onNodeClick props
    �
handleNodeHover/handleNodeClick (CrypticAnimusScene)
    �
fgRef.current.highlightNode/selectNode (imperative)
    � 
 FAILS - ref might not be ready
 Store never updated
```

### Root Cause

1. **Store Deliberately Disconnected** - In `CrypticVaultScene.tsx`:
   - Lines with `uiStore.selectNodes` removed (see comments in code)
   - Lines with `uiStore.setHoverNode` removed  
   - Rationale: "prevent remounts"

2. **Imperative Methods Unreliable** - In `ForceGraphAdapter.tsx`:
   - `highlightNode` (line 166-223) - works IF ref exists and __threeObj exists
   - `selectNode` (line 225-280) - works IF ref exists and __threeObj exists
   - Probes never fire because handlers aren't being called

3. **Event Props Connected But Ineffective**:
   - `CrypticAnimusScene` correctly passes handlers to ForceGraphAdapter
   - Handlers call imperative methods that might fail silently
   - No store updates mean no persistent state

## Disconnected Handlers Identified

### File: `/workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx`

1. **handleNodeClick** (lines ~380-395):
   - Should call: `uiStore.selectNodes([nodeId], 'replace')`
   - Currently: Only calls imperative method

2. **handleNodeHover** (lines ~397-403):
   - Should call: `uiStore.setHoverNode(nodeId)`
   - Currently: Empty function with comment about imperative handling

3. **handleBackgroundClick** (lines ~405-410):
   - Should call: `uiStore.clearSelection()`
   - Currently: Only clears highlight state

### File: `/workspace/packages/store/src/slices/ui-slice.ts`

Store actions exist but unused:
- `selectNodes` (line 68): Takes nodeIds and mode
- `setHoverNode` (line 120): Takes nodeId or null
- `clearSelection` (line 95): No params

## Reconnection Plan

### Option A: Hybrid Approach (RECOMMENDED)
Keep imperative visual feedback for performance, add store updates for state consistency.

**Target Files & Changes:**

1. **`/workspace/apps/legacy-import/cryptic-vault-demo/components/CrypticVaultScene.tsx`**
   
   ```typescript
   // Line ~380 - handleNodeClick
   const handleNodeClick = useCallback((clickedNode: any) => {
     const nodeId = clickedNode.id as string
     
     // Add store update (non-blocking)
     queueMicrotask(() => {
       uiStore.selectNodes([nodeId], 'replace')
     })
     
     // Keep existing traversal logic
     const traversalResult = performTwoHopTraversal(...)
     setHighlightState(traversalResult)
     setHighlightActiveTime(Date.now())
   }, [...deps])
   
   // Line ~397 - handleNodeHover  
   const handleNodeHover = useCallback((node: any) => {
     // Add store update (non-blocking)
     queueMicrotask(() => {
       uiStore.setHoverNode(node ? node.id : null)
     })
   }, [])
   
   // Line ~405 - handleBackgroundClick
   const handleBackgroundClick = useCallback(() => {
     // Add store update
     queueMicrotask(() => {
       uiStore.clearSelection()
     })
     
     setHighlightState(null)
     setHighlightActiveTime(0)
   }, [])
   ```

2. **Import store in CrypticVaultScene** (if not already):
   ```typescript
   import { useRefineryStore } from '@/store'
   // ...
   const uiStore = useRefineryStore()
   ```

### Option B: Pure Store-Driven (More work, cleaner)
Remove imperative methods entirely, drive everything through store state.

**Requires:**
- Modify ForceGraphAdapter to read selection/hover from store
- Update nodeColor prop to be reactive to store state
- Larger refactor with higher risk

## Lens Switch Wiring

The lens switch (activeCategories/activeTags) appears to be working:
- `ForceGraphAdapter` has effect watching these props (lines 341-380)
- Calls `d3ReheatSimulation` when lens changes
- Has proper gating with `hasReheatedRef` to prevent spam

## Verification Strategy

After reconnection:
1. Add console.log to store actions to verify they're called
2. Check Redux DevTools (if configured) for action dispatch
3. Run smoke screen tests to verify visual feedback
4. Verify probes in highlightNode/selectNode fire

## Risk Assessment

- **Low Risk:** Hybrid approach uses queueMicrotask to avoid sync issues
- **Medium Risk:** Store updates might trigger unwanted re-renders elsewhere
- **Mitigation:** Use queueMicrotask for all store updates to break sync chain

## Next Steps

1. Implement Option A (hybrid approach) 
2. Test with single node interaction
3. Verify store state updates in devtools
4. Run full smoke screen test suite
5. Document any side effects

---

## AUDIT RESULTS (2025-08-07, 9:43 AM)

### Claims Verification Status

#### ✅ VERIFIED - Store Deliberately Disconnected

**CrypticVaultScene.tsx** (lines verified):
- `handleNodeClick` (lines 354-370): Store calls removed with explicit NOTE comment
- `handleNodeHover` (lines 372-378): Empty function with NOTE about removal  
- `handleBackgroundClick` (lines 380-385): Only local state cleared, store removed
- Escape key handler (lines 388-400): Store call removed with NOTE

**Evidence:** Comments explicitly state "NOTE: uiStore.selectNodes removed to prevent remounts"

#### ✅ VERIFIED - Imperative Methods Structure

**ForceGraphAdapter.tsx** (`/workspace/packages/canvas-r3f/src/adapters/`):
- `highlightNode` (lines 166-223): Confirmed with probes, depends on `__threeObj`
- `selectNode` (lines 225-280): Confirmed with probes, depends on `__threeObj`
- Both methods exposed via `useImperativeHandle` (lines 283-290)
- Methods include DEV-ONLY probes that log when called

#### ✅ VERIFIED - Store Actions Exist

**ui-slice.ts** (`/workspace/packages/store/src/slices/`):
- `selectNodes` (line 71): Takes `(nodeIds, mode)`, uses queueMicrotask
- `setHoverNode` (line 129): Takes `(nodeId)`, uses queueMicrotask
- `clearSelection` (line 117): No params, uses queueMicrotask
- All actions properly wrapped in `produce` for immutability

#### ✅ VERIFIED - Event Flow Architecture

**Actual flow discovered:**
```
User Action (hover/click)
    ↓
ForceGraph3D component (ForceGraphAdapter)
    ↓
onNodeHover/onNodeClick props
    ↓
CrypticAnimusScene handlers (lines 817-842)
    ├─→ fgRef.current.highlightNode/selectNode (imperative)
    └─→ onNodeClick/onNodeHoverProp (passed from CrypticVaultScene)
            ↓
        CrypticVaultScene handlers (DISCONNECTED FROM STORE)
```

**Critical insight:** CrypticAnimusScene acts as middleware, calling BOTH imperative methods AND prop handlers. The imperative path works (if ref exists), but the store path is severed.

#### ✅ VERIFIED - Lens Switch Wiring

**ForceGraphAdapter.tsx** (lines 341-380):
- Effect watches `activeCategories` and `activeTags`
- Calls `d3ReheatSimulation` on change
- Has proper gating with `hasReheatedRef` (2-second cooldown)
- Includes DEV-ONLY probe for lens changes

**CrypticAnimusScene.tsx** (lines 1042-1043):
- Correctly passes `activeCategories` and `activeTags` props to ForceGraph3D

### Additional Findings

1. **Import Missing:** CrypticVaultScene.tsx doesn't import `useRefineryStore` - reconnection will require adding this import

2. **Probe Coverage Gap:** The probes in `highlightNode`/`selectNode` only fire IF the methods are called. Since handlers are disconnected, probes never fire - explaining silent failure

3. **Ref Dependency Risk:** Imperative methods check `if (!graphData || !graphData.nodes) return` but might fail silently if ref not ready during early interactions

4. **Double-Call Architecture:** CrypticAnimusScene calls both imperative AND prop handlers, allowing hybrid approach without modifying middleware layer

### Reconnection Plan Validation

**Option A (Hybrid) is OPTIMAL** because:
1. CrypticAnimusScene already calls both paths
2. Only requires reconnecting store in CrypticVaultScene handlers
3. Maintains imperative performance while adding state persistence
4. Uses queueMicrotask to avoid sync remount issues

**Implementation checklist:**
1. Add `import { useRefineryStore } from '@refinery/store'` to CrypticVaultScene
2. Add `const uiStore = useRefineryStore()` in component
3. Restore store calls in handlers with queueMicrotask wrapper
4. Verify with console.log in store actions
5. Check probes fire in imperative methods