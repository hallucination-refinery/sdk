# D3-Simulation Alpha Access Investigation Scratchpad

Goal: locate and expose the internal d3-simulation handle within the r3f-forcegraph ForceGraph instance to programmatically access alpha values.

## Expected Flow

- `window.__FG` exists and contains ForceGraph3D instance methods
- ForceGraph3D wraps ThreeForceGraph which contains d3-force simulation
- Simulation should have `.alpha()` getter/setter accessible via some property path
- Success: `window.__FG.[discovered_property].alpha()` returns numeric value

## Hypotheses

1. `window.__FG` assignment missing (from window-fg-scratchpad analysis)
2. Alpha accessible via `window.__FG.d3Force().alpha()` (standard d3-force API)
3. Internal simulation stored in private property like `_engine`, `__simulation`, or `_forceSim`
4. structuredClone strips getters/methods from simulation objects
5. Cooldown overrides (Infinity, 0) freeze simulation entirely

## RECOMMENDED PROCESS

1. Add `window.__FG` assignment in CrypticAnimusScene.tsx (fix from window-fg-scratchpad)
2. Search node_modules/r3f-forcegraph source for `.alpha(` and simulation storage patterns
3. Search node_modules/three-forcegraph source for d3-force simulation handle
4. Test `Object.keys(window.__FG)` and `Object.getOwnPropertyNames()` in browser to find hidden properties
5. Grep codebase for alpha-related method calls to understand expected API
6. Create minimal test: mount ForceGraph directly without cloning to verify alpha access

Record results in Findings section.

## Findings

### Task 1: Add window.\_\_FG assignment

- **Action**: Fix missing window.\_\_FG assignment identified in window-fg-scratchpad
- **Expected Change**: CrypticAnimusScene.tsx line ~105, add useEffect to assign fgRef.current to window.\_\_FG
- **Result**: [PENDING]
- **Verification**: After fix, `window.__FG` should exist and contain ForceGraph methods

### Task 2: Search r3f-forcegraph source for alpha patterns

- **Action**: Read node_modules/r3f-forcegraph/dist files, search for `.alpha(`
- **Target**: Find how d3-force simulation is accessed within the wrapper
- **Result**: [PENDING]
- **Expected**: Internal property name or method that exposes simulation

### Task 3: Search three-forcegraph for simulation handle

- **Action**: Read node_modules/three-forcegraph TypeScript definitions and source
- **Target**: Locate where d3.forceSimulation instance is stored
- **Result**: [PENDING]
- **Expected**: Property like `_simulation` or method returning simulation object

### Task 4: Browser introspection of window.\_\_FG

- **Action**: Use browser console to enumerate all properties of ForceGraph instance
- **Commands**:
  - `Object.keys(window.__FG)`
  - `Object.getOwnPropertyNames(window.__FG)`
  - `console.dir(window.__FG, {depth: 3})`
- **Result**: [PENDING]
- **Expected**: Find simulation-related properties not exposed in TypeScript interface

### Task 5: Grep for alpha method usage

- **Action**: Search codebase for patterns like `d3Alpha`, `.alpha(`, `simulation.alpha`
- **Target**: Understand how other code expects to access alpha
- **Result**: [PENDING]
- **Expected**: Usage patterns to guide property discovery

### Task 6: Minimal alpha test

- **Action**: Create isolated test mounting ForceGraph without structuredClone
- **Target**: Verify alpha is accessible when cloning doesn't interfere
- **Result**: [PENDING]
- **Expected**: Successful alpha access confirms structuredClone side-effects hypothesis

## Root Cause Theories

### Theory A: Missing window.\_\_FG assignment (CONFIRMED)

- **Evidence**: window-fg-scratchpad investigation confirmed no assignment code exists
- **Fix**: Add useEffect in CrypticAnimusScene.tsx to assign fgRef.current to window.\_\_FG
- **Confidence**: 99%

### Theory B: Alpha accessible via standard d3Force API

- **Evidence**: ForceGraphAdapter uses d3AlphaTarget, suggesting standard d3-force methods exist
- **Expected path**: `window.__FG.d3Force().alpha()`
- **Confidence**: 80%

### Theory C: Private simulation property

- **Evidence**: Complex wrappers often store simulation in private properties
- **Expected paths**: `window.__FG._engine.alpha()`, `window.__FG.__simulation.alpha()`
- **Confidence**: 60%

### Theory D: structuredClone strips alpha getters

- **Evidence**: Object cloning can remove getters/methods from prototype chain
- **Test**: Compare cloned vs uncloned ForceGraph instance for alpha access
- **Confidence**: 40%

## Next Steps Priority

1. **HIGH**: Implement window.\_\_FG assignment fix (confirmed missing)
2. **HIGH**: Test `window.__FG.d3Force().alpha()` after fix (most likely path)
3. **MEDIUM**: Browser introspection to find hidden properties if standard API fails
4. **MEDIUM**: Source code analysis of wrapper libraries
5. **LOW**: structuredClone side-effects testing (if all other approaches fail)

## Cross-Verification

### Alternative approaches to test:

1. **Direct d3-force import**: Import d3-force and create simulation manually to verify alpha API
2. **Library version check**: Ensure r3f-forcegraph version matches expected API
3. **Console error monitoring**: Check for alpha-related errors during force configuration

### Stress-test assumptions:

- **Assumption**: Alpha exists as getter/setter on simulation object
- **Risk**: Might be read-only property or accessed differently in this version
- **Mitigation**: Test both getter and setter forms

### Final confidence in approach: 85%

The window.\_\_FG fix is definitely needed and most likely to resolve the issue. If standard d3Force API doesn't work, browser introspection will reveal the correct property path.

## ULTRATHINK Verification (TBD)

[This section will be filled after executing the investigation steps above]
