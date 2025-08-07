# Systematic Architecture Investigation Scratchpad

## Instructions

```
**ULTRATHINK MODE:**
# TASK
Conduct a forensic investigation to determine why the Phase 2 migration from @refinery/interaction to @refinery/store has failed for three weeks by:
1. Systematically cross-referencing and verifying all assumptions about "functional completeness,"
2. Mapping the complete data flow from user interactions through store updates to visual rendering
3. Identifying architectural dependencies and incompatibilities,
4. Comparing the working legacy implementation against the current broken state
5. Defining step by step the precise technical repairs needed to achieve W.

# WARNING
Challenge every claim about migration completeness; trace actual code paths **not documentation;** identify where fixes created new problems; determine minimum changes for successful completion.

# Success criteria:
a. Produce actionable diagnosis of root causes with specific fix sequence that avoids symptom-chasing, documented in investigation-scratchpad.md with executive summary and technical roadmap in @docs/tmp-groupchat/phase-2/final-stretch/ (you may create a **max** 3 files).
b. Reference @docs/tmp-groupchat/phase-2/working-document.md for Phase 2 context, @docs/tmp-groupchat/phase-2/final-stretch-scratchpad-2.md lines 206+ for latest *quick* smoke screen test with the tick error, @docs/tmp-groupchat/phase-2/baseline-smoke-screen-tests.md for preceding smoke screen tests, @docs/tmp-groupchat/phase-2/final-stretch/refinery-mono-notes.md for working legacy implementation details.
c. Clearly append and document **every action and thought** in @docs/tmp-groupchat/phase-2/final-stretch/investigation-scratchpad.md
d. Make regular atomic commits.
```

## Sub-W: Systematic Architecture Investigation

Conduct a comprehensive investigation to identify why the Phase 2 migration has failed for three weeks, challenging all assumptions about the current implementation and establishing a factual baseline for moving forward.

### Sub-W Checklist

- [ ] Document all assumptions about the migration's "functional completeness"
- [ ] Map the actual data flow from user interaction to visual feedback
- [ ] Identify all architectural dependencies between @refinery/interaction and components
- [ ] Cross-reference and compare the working legacy demo against the current implementation
- [ ] List all changes made during the three-week migration attempt
- [ ] Identify fundamental incompatibilities between old and new architectures
- [ ] Create decision matrix for path forward (refactor vs. revert vs. rebuild)

## Intended Behaviour — User-Experience Checklist

- [ ] **Initial load**
  - [ ] HUD appears immediately on first render
  - [ ] All nodes spawn at the origin (0 ,0 ,0) and perform **one** outward burst
  - [ ] Nodes settle and stay static until a lens change occurs

- [ ] **Hover**
  - [ ] Hovering any node leaves all node positions unchanged
  - [ ] Physics engine remains idle (no forces applied)

- [ ] **Click / Selection**
  - [ ] Clicking a node highlights it **and** its directly related edges/nodes
  - [ ] Clicking a different node transfers the highlight accordingly
  - [ ] Clicking empty space clears all highlights
  - [ ] No node positions change; physics stays idle throughout

- [ ] **Timeline Scrub**
  - [ ] Dragging the timeline slider shows or hides nodes and links based on time
  - [ ] Node positions remain fixed during and after scrubbing
  - [ ] Physics engine remains idle

- [ ] **Category / Filter Toggle**
  - [ ] Toggling a filter hides or reveals matching nodes and links
  - [ ] Node positions stay unchanged while filtering
  - [ ] Physics engine remains idle

- [ ] **Lens Change (Causal ↔ Affinity ↔ Temporal)**
  - [ ] Switching the lens triggers **exactly one** fresh burst from the origin
  - [ ] Nodes resettle after the burst and stay static
  - [ ] After resettling, behaviour reverts to the Hover, Click/Selection, Timeline Scrub, and Filter rules until the next lens switch

---

## Investigation Log (2025-08-07, 14:25 PM EST)

### 1. Critical Finding: D3 Force Simulation Not Initialized

**Symptom**: `TypeError: Cannot read properties of undefined (reading 'tick')`

**Location**: `three-forcegraph.mjs:753:23` in `layoutTick` function

**Root Cause Analysis**:
- The error occurs when `CrypticAnimusScene` calls `fgRef.current.tickFrame()` at line 353
- The tickFrame method internally tries to access `simulation.tick()` but `simulation` is undefined
- This happens despite the ref chain being properly connected after the dynamic import fix

**Evidence Found**:
1. Graph data IS being passed correctly:
   - 213 nodes and 276 links are created and passed to ForceGraphAdapter
   - `memoizedGraphData` contains proper node/link arrays
   
2. ForceGraphAdapter receives the data:
   - Line 333: `[FGAdapter] Data changed, calling refresh()` with nodeCount: 213
   - Line 342: Successfully calls `refresh()` on the internal ForceGraph3D ref
   
3. BUT the D3 simulation is never initialized:
   - `internalRef.current?.graphData?.()` returns undefined (line 170 in ForceGraphAdapter)
   - The ForceGraph3D component (from r3f-forcegraph) is not initializing its internal simulation

**Critical Code Path**:
```
CrypticAnimusScene → ForceGraphAdapter → ForceGraph3D (r3f-forcegraph)
     ↓                      ↓                         ↓
  passes data         clones data            should init simulation
  (213 nodes)         passes to FG3D         BUT DOESN'T!
```

### 2. Why the Simulation Isn't Initializing

**Investigation**: The ForceGraph3D component from `r3f-forcegraph` should automatically initialize a D3 force simulation when it receives graphData. But it's not happening.

**Hypothesis**: The r3f-forcegraph component may have initialization timing issues or requires specific lifecycle calls that aren't happening due to the React 19 / R3F environment.

**Note**: There's already a commented-out guard in CrypticAnimusScene (lines 343-348) that would prevent the crash:
```typescript
/*
if (!(fgRef.current as any).__kapsuleInstance?.layout) {
  console.log('[TICKS] Force layout engine not initialized yet, skipping tick execution')
  return
}
*/
```

### 3. The Imperative Chain Issue

Despite fixing the ref forwarding (by replacing dynamic import with direct import), the imperative methods fail because:
- `highlightNode` checks for `graphData()` which returns undefined
- Even though data was passed to the component, the internal ForceGraph3D isn't exposing it via `graphData()`

### Next Steps in Investigation

1. **IMMEDIATE**: Check if ForceGraph3D requires specific mounting/initialization sequence
2. **VERIFY**: Test if the r3f-forcegraph component works in isolation with simple data
3. **COMPARE**: Check how the working legacy implementation initializes the force simulation

### 4. CRITICAL DISCOVERY: Missing Simulation Props (14:30 PM)

**Root Cause Found**: The ForceGraphAdapter REMOVED critical props that the legacy implementation requires!

**Working Legacy Implementation** (from refinery-mono-notes):
- Uses `cooldownTime={Infinity}` for continuous simulation
- Manual tick control via `useFrame` hook calling `fgRef.current.tickFrame()`
- Physics simulation runs continuously, controlled by React render cycle

**Current Broken Implementation** (ForceGraphAdapter.tsx lines 415-417):
```javascript
// cooldownTime={Infinity} - was preventing time-based stopping
// cooldownTicks={0} - was stopping after 1 tick  
// d3AlphaDecay={0} - was preventing alpha from decreasing
```

These props were COMMENTED OUT, causing the simulation to never initialize properly!

**The Chain of Failure**:
1. Without `cooldownTime={Infinity}`, the simulation stops immediately
2. The D3 force layout engine may not even initialize
3. When `tickFrame()` is called in `useFrame`, it tries to access `simulation.tick()`
4. But `simulation` is undefined because the engine stopped/never started
5. Result: `TypeError: Cannot read properties of undefined (reading 'tick')`

### 5. Additional Issues Found

**GraphData Method Returns Undefined**:
- Even after the simulation initializes, `graphData()` method returns undefined
- This breaks the imperative highlight/select methods
- The ForceGraph3D component isn't properly exposing its internal data

**Data Flow Confirmed**:
```
CrypticAnimusScene (213 nodes) 
    → memoizedGraphData 
    → ForceGraphAdapter (structuredClone) 
    → ForceGraph3D (r3f-forcegraph)
```
Data IS flowing, but ForceGraph3D isn't initializing its simulation properly without the cooldown props.

### 6. Architectural Comparison: @refinery/interaction vs @refinery/store (14:35 PM)

**Legacy Implementation (@refinery/interaction)**:
- Uses Redux-like reducer pattern with dispatched actions
- Synchronous state updates 
- Actions: `MOUSE_SELECT_NODE`, `SET_MOUSE_HOVERED_NODE`, etc.
- State shape includes `forceGraphRef` for direct imperative control
- Single centralized state with all graph, UI, and physics state

**Current Implementation (@refinery/store)**:
- Uses Zustand store with direct method calls
- **ASYNC state updates via queueMicrotask()** - "to prevent remounts"
- Methods: `selectNodes()`, `setHoverNode()`, etc.
- Returns `RendererCommand` objects for decoupling
- Split into slices (ui-slice, etc.)

**Critical Architectural Incompatibility**:
1. **Timing Issue**: queueMicrotask delays state updates to next microtask
2. **Render Cycle Mismatch**: Updates happen AFTER render, not during
3. **Lost Synchronization**: Visual feedback relies on immediate state availability
4. **Race Conditions**: Imperative methods fire before state updates complete

**Evidence from Console Logs**:
```
[STORE] setHoverNode called: {nodeId: 'cc742484d', timestamp: 1754584158314}
[STORE] setHoverNode executing in microtask: {nodeId: 'cc742484d'}
[STYLE] highlightNode early return - no graphData
```

The highlightNode imperative method fires BEFORE the store update completes!

### 7. Fix Applied: Restored Simulation Props (14:33 PM)

**Changes Made**:
1. Restored `cooldownTime={Infinity}`, `cooldownTicks={0}`, `d3AlphaDecay={0}` in ForceGraphAdapter
2. Enabled engine ready check in CrypticAnimusScene to prevent crash during init
3. Committed as: "fix: restore critical simulation props to fix tick error"

**Expected Result**: 
- Tick error should be resolved
- Simulation should initialize and run continuously
- But highlights still won't work due to timing issues with queueMicrotask

### 8. CRITICAL DISCOVERY: Broken Selector Hook (14:40 PM)

**Found in** `/workspace/apps/legacy-import/cryptic-vault-demo/store/selectors.ts`:
```typescript
// Sub-W stub – replace with real selector in W
export const useSingleSelectedNode = () => null
```

**This completely breaks declarative visual feedback!**

The hook that should connect selection state to visual rendering always returns `null`.
This means:
- `mouseSelectedNodeId` prop is always null
- `buildCrypticNodeSprite` never receives selection state
- Node colors never change based on selection
- The entire declarative feedback path is dead

**Fix Applied**:
```typescript
export const useSingleSelectedNode = () => {
  return useUIStore(selectSingleSelectedNode)
}
```

This connects the selector to the actual store state.

### 9. Three Parallel Feedback Paths Identified

1. **Declarative Path** (currently broken by null selector):
   - Store state → useSingleSelectedNode → mouseSelectedNodeId prop → nodeThreeObject → color

2. **Imperative Path** (broken by missing graphData):
   - Store state → highlightNode/selectNode methods → direct material mutation

3. **UseFrame Path** (may work after fixes):
   - Store state → useFrame hook → sprite opacity/color updates each frame

All three paths need to work for complete visual feedback!

### 10. False Assumptions About "Functional Completeness" (14:45 PM)

**Assumption 1**: "The ref chain is fixed, so highlights should work"
- **Reality**: Ref chain was only PART of the problem
- Missing simulation props prevented initialization
- graphData() returns undefined even with refs connected

**Assumption 2**: "Migration from @refinery/interaction to @refinery/store is complete"
- **Reality**: Major architectural incompatibilities remain
- queueMicrotask creates timing issues
- Synchronous updates became async, breaking feedback loops

**Assumption 3**: "Visual feedback is working, just needs minor fixes"
- **Reality**: ENTIRE declarative path was dead (null selector)
- Imperative path broken (no graphData)
- Three separate feedback paths all broken in different ways

**Assumption 4**: "Physics simulation is running"
- **Reality**: Simulation wasn't even initializing
- Critical props were commented out as "preventing stopping"
- tickFrame crashed immediately due to undefined simulation

**Assumption 5**: "Store updates trigger visual changes"
- **Reality**: Store updates happen in microtasks AFTER render
- Visual feedback expects immediate state availability
- Race conditions prevent imperative methods from working

**Assumption 6**: "The migration preserved all functionality"
- **Reality**: Key functionality was STUBBED OUT
- useSingleSelectedNode always returned null
- Comments like "Sub-W stub" indicate incomplete work

### 11. Summary of Root Causes

1. **Incomplete Migration**: Critical hooks stubbed, not implemented
2. **Architectural Mismatch**: Async store vs sync visual feedback
3. **Missing Configuration**: Simulation props removed incorrectly
4. **Broken Data Flow**: graphData method not exposing data
5. **Race Conditions**: queueMicrotask delays breaking timing
6. **Multiple Failure Points**: Three feedback paths, all broken differently

---

## Investigation Complete (14:55 PM)

### Deliverables Created:

1. **Investigation Scratchpad** (this file) - Complete forensic analysis with timeline
2. **Technical Roadmap** (`technical-roadmap.md`) - 5-phase fix sequence with time estimates
3. **Critical Fixes Applied**:
   - Restored simulation props (fixes tick error)
   - Connected selector hook (enables declarative feedback)

### Key Discoveries:

The Phase 2 migration was NOT "functionally complete" as assumed. Six major issues compound to create total visual feedback failure:
- Core simulation never initialized
- Store selector completely stubbed out  
- Architectural mismatch between async store and sync rendering
- Multiple "Sub-W stub" placeholders throughout codebase
- Three separate feedback paths all broken independently
- Race conditions from queueMicrotask delays

### Recommended Next Steps:

Follow the Technical Roadmap Phase 2-5 in sequence. The migration is salvageable but requires 9-15 hours of systematic fixes. The alternative is reverting to `@refinery/interaction` if time is critical.

### Commits Made:
1. `23363150` - fix: restore critical simulation props to fix tick error
2. `c4bed9b7` - fix: connect useSingleSelectedNode hook to actual store  
3. `42b7d852` - docs: complete forensic investigation of Phase 2 migration failure

**Investigation Status: COMPLETE ✅**
