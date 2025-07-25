Last Updated: 4:10 PM EST, 25/07/2025

# Force Graph Behavior Alignment - Phase 2 Sprint

<!-- 🗺️ Table of Contents -->

1. [Current State Summary](#-current-state-summary)
2. [Definition of W](#-definition-of-w-phase-2-complete)
3. [Root Cause Analysis](#-root-cause-analysis)
4. [Recovery Plan](#-️-recovery-plan)
5. [Immediate Next Steps](#-immediate-next-steps)
6. [Progress Tracking](#-progress-tracking)
7. [Known Pitfalls](#-known-pitfalls)
8. [Definition of Done](#-definition-of-done)

**Purpose**: Achieve W - Phase 2 completion with working physics, interactions, and no legacy dependencies

---

## 📍 Current State Summary

### What Works

| Component                | Evidence                                        | Confidence |
| ------------------------ | ----------------------------------------------- | ---------- |
| App loads (no TDZ error) | Fixed in commit 8ae1cfb3                        | 100%       |
| Nodes render visibly     | 213 nodes in sphere pattern                     | 100%       |
| Timeline filtering       | Nodes hide/show on scrub                        | 100%       |
| Forces configured        | Console: "link: true charge: true center: true" | 100%       |
| Simulation ticks execute | "Executed 300 ticks successfully"               | 100%       |

#### Console Excerpt (baseline – first 10 lines)

```text
[INIT POSITIONS] Added initial positions to 213/213 nodes ...
[Animus] render ForceGraph3D
[Build marker] CrypticAnimusScene v3 ...
[Data debug] nodes: 213 links: 276
[Physics config] Ref not ready, will retry...
[Window FG] Ref not ready, will retry...
[CrypticAnimusScene] Configuring physics forces!
[Window FG] window.__FG assigned successfully
[REHEAT] Initial d3ReheatSimulation called
[TICKS] Executed 300 ticks successfully (target: 300)
```

### What's Broken

| Issue                      | Evidence                                       | Impact                                |
| -------------------------- | ---------------------------------------------- | ------------------------------------- |
| **~~No physics movement~~** | **FALSE** - Nodes DO move (Test 1 observation) | ~~Critical - core feature broken~~     |
| **Extremely low FPS**      | 1-2 FPS observed in Test 1                     | Critical - unusable performance       |
| **Nodes don't settle**     | Continuous movement, no stabilization          | High - violates intended UX           |
| **No data access**         | No `graphData()` method on window.__FG         | Critical - can't inspect simulation   |
| **No alpha access**        | Only 7 methods exposed, no `__kapsuleInstance` | High - can't debug/control simulation |
| **Interactions dead**      | No hover/click visual feedback                 | High - UX broken                      |
| **No burst animation**     | Nodes pre-positioned in sphere                 | Medium - missing intended behavior    |

### Key Discoveries

1. **Physics IS Working**: Nodes move, contradicting our primary hypothesis
2. **Performance Crisis**: 1-2 FPS makes the app unusable
3. **No Data Access**: The `r3f-forcegraph` wrapper provides NO `graphData()` method
4. **API Limitations**: Only 7 methods exposed: ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
5. **Continuous Movement**: Nodes never settle, suggesting alpha decay issues
6. **Instrumentation Approach Failed**: Cannot inspect simulation internals as assumed

---

## 🎯 Definition of W (Phase 2 Complete)

Per `working-document.md`:

> "Every legacy force-graph dependency is replaced by the new SDK store-driven rendering path, with all items in phase 2 of the @migration-checklist.md file marked DONE and the demo running without clumping, freezes, or build-time aliases."

### Acceptance Criteria

- [ ] Nodes burst from origin and settle naturally
- [ ] Hover shows visual feedback (glow/highlight)
- [ ] Click toggles selection state
- [ ] No webpack aliases (`@refinery/store`)
- [ ] All Phase 2 checklist items complete
- [ ] 60fps on M1 Chrome

### Current Gap Analysis (REVISED)

- ✅ ~~Physics simulation doesn't move nodes~~ → **FALSE**: Nodes DO move
- ❌ **NEW**: Extremely poor performance (1-2 FPS)
- ❌ **NEW**: Nodes never settle/stabilize
- ❌ **NEW**: Cannot inspect simulation state
- ❌ Interactions non-functional
- ❌ No burst animation (pre-positioned in sphere)
- ❌ Webpack alias still present
- ❌ Most checklist items incomplete
- ✅ No freezes/crashes
- ⚠️  No clumping (but only due to pre-positioning workaround)

---

## 🔬 Root Cause Analysis (REVISED)

### ~~Primary Hypothesis: Frozen Node Objects~~ ❌ DISPROVEN

- **Evidence**: Nodes ARE moving (Test 1 observation)
- **Status**: **FALSE** - Physics simulation is running
- **New Problem**: Cannot access node data to verify velocity properties

### New Primary Hypothesis: Performance & Stabilization Issues

1. **Extremely Low FPS (1-2 FPS)**
   - Possible causes: Excessive tick execution, render bottleneck, Docker container overhead
   - Impact: Makes movement appear broken when it's actually running

2. **Nodes Don't Settle**
   - Evidence: Continuous movement without stabilization
   - Possible cause: Alpha never decays to stop threshold
   - Missing: Cannot verify alpha value due to API limitations

3. **No Data Access**
   - `window.__FG` has no `graphData()` method
   - Cannot inspect node positions, velocities, or frozen state
   - Makes debugging nearly impossible

### Secondary Hypotheses (Still Valid)

1. **No burst animation**: Due to sphere pre-positioning
2. **Interactions dead**: Separate issue from physics
3. **Force configuration**: May need tuning for stabilization

---

## 🛠️ Recovery Plan

### Phase 0: Instrumentation (30 min)

**Goal**: Definitively answer why nodes don't move

```javascript
// === Phase 0 Instrumentation – paste below imports, above existing useEffect ===
const beforePos = { x: nodes[0].x, y: nodes[0].y, z: nodes[0].z }
console.log('[FREEZE-TEST before]', {
  node0: nodes[0],
  hasVelocity: 'vx' in nodes[0],
  position: beforePos,
  frozen: Object.isFrozen(nodes[0]),
})

// After tickFrame loop (line ~160)
console.log('[FREEZE-TEST after ]', {
  node0: nodes[0],
  hasVelocity: 'vx' in nodes[0],
  position: { x: nodes[0].x, y: nodes[0].y, z: nodes[0].z },
  positionChanged:
    nodes[0].x !== beforePos.x || nodes[0].y !== beforePos.y || nodes[0].z !== beforePos.z,
})
```

**Success Criteria**:

- If `hasVelocity: false` → Branch A (frozen objects)
- If `positionChanged: false` despite velocity → Branch B (render issue)

### Phase 1A: Unfreeze Objects (1 hr)

**Trigger**: No velocity properties found

1. Remove `structuredClone` from data pipeline
2. Ensure nodes are plain mutable objects
3. Pre-add velocity properties if needed:
   ```javascript
   nodes.forEach((n) => {
     n.vx = n.vx || 0
     n.vy = n.vy || 0
     n.vz = n.vz || 0
   })
   ```

### Phase 1B: Fix Render Pipeline (1 hr)

**Trigger**: Positions change but nodes don't move visually

1. Add `window.__FG.refresh()` after tick batches
2. Verify THREE.js object positions update:
   ```javascript
   const meshes = window.__FG.children[0].children
   console.log(
     'Mesh positions:',
     meshes.map((m) => m.position)
   )
   ```
3. Check if camera follows nodes (causing illusion of no movement)

### Phase 2: Energy Diagnostics (1 hr)

**Goal**: Create alpha proxy without direct access

```javascript
let lastPositions = nodes.map((n) => ({ x: n.x, y: n.y, z: n.z }))

setInterval(() => {
  const kinetic = nodes.reduce((sum, n, i) => {
    const dx = n.x - lastPositions[i].x
    const dy = n.y - lastPositions[i].y
    const dz = n.z - lastPositions[i].z
    return sum + (dx * dx + dy * dy + dz * dz)
  }, 0)

  console.log('[ENERGY]', kinetic.toFixed(4))
  lastPositions = nodes.map((n) => ({ x: n.x, y: n.y, z: n.z }))
}, 1000)
```

### Phase 3: Burst Animation (1 hr)

1. Remove sphere pre-positioning
2. Initialize all nodes at origin
3. Set charge strength to -800
4. Call `d3ReheatSimulation()`

### Phase 4: Restore Interactions (1.5 hr)

1. Add logging to `onNodeHover` and `onNodeClick` props
2. If events don't fire → raycaster/layer issue
3. If events fire but no visual → check material uniforms

### Phase 5: Cleanup & Migration (2 hr)

1. Remove webpack alias from `next.config.ts`
2. Complete migration checklist items
3. Remove temporary workarounds
4. Final smoke test

---

## 📋 Immediate Next Steps

1. **For Contributors**:

   ```bash
   git checkout replace-interaction-with-store
   git pull
   # Apply Phase 0 instrumentation
   pnpm dev --filter cryptic-vault-demo
   # Post [FREEZE-TEST] results in #phase-2
   ```

2. **Decision Tree**:
   - If `hasVelocity: false` → Implement Phase 1A
   - If `hasVelocity: true` but no movement → Implement Phase 1B
   - If movement detected → Skip to Phase 3

3. **Communication**:
   - Post findings with screenshots
   - Tag @assistant with results
   - Update this doc after each phase

---

## 📊 Progress Tracking

| Phase              | Status       | Owner     | Notes                                                                              |
| ------------------ | ------------ | --------- | ---------------------------------------------------------------------------------- |
| 0. Instrumentation | ❌ Failed    | Assistant | Instrumentation failed - no graphData() method. Fundamental approach was flawed    |
| 1. Performance     | 🔄 New       | -         | Address 1-2 FPS issue - critical blocker                                           |
| 2. Stabilization   | 🔄 New       | -         | Fix nodes not settling - requires alpha control                                    |
| 3. Data Access     | 🔄 New       | -         | Find alternative way to inspect simulation state                                   |
| 4. Burst           | ⏸️ Blocked   | -         | Remove sphere positioning after fixing above                                       |
| 5. Interactions    | ⏸️ Blocked   | -         | -                                                                                  |
| 6. Cleanup         | ⏸️ Blocked   | -         | -                                                                                  |

### Phase 0 Execution Log

**Start Time**: 3:45 PM EST, 25/07/2025  
**Executor**: Assistant (ULTRATHINK MODE)

#### OODA Loop - Step 1: Verify Placement Locations

- **Observe**: Need to add instrumentation at lines ~190 and ~209
- **Orient**: These lines are within the `setupWindowFG` function inside the useEffect
- **Decide**: Must verify exact line numbers before editing
- **Act**: Re-examining CrypticAnimusScene.tsx for precise placement

**Result**: Verified exact placement locations:

- Line 190: After `console.log('[Window FG] window.__FG assigned successfully')`
- Line 209: After `console.log(\`[TICKS] Executed ${tickCount} ticks successfully (target: 300)\`)`

#### OODA Loop - Step 2: Add FREEZE-TEST Before Instrumentation

- **Observe**: Line 190 logs successful window.\_\_FG assignment
- **Orient**: Need to capture node state immediately after FG is ready
- **Decide**: Add instrumentation that safely checks for simData existence
- **Act**: Adding FREEZE-TEST before code block

**Result**: Successfully added BEFORE instrumentation after line 190

#### OODA Loop - Step 3: Add FREEZE-TEST After Instrumentation

- **Observe**: Line 221 logs tick execution completion
- **Orient**: Need to capture node state after 300 ticks have been executed
- **Decide**: Add instrumentation that compares with before state
- **Act**: Adding FREEZE-TEST after code block

**Result**: Successfully added AFTER instrumentation after line 221

#### OODA Loop - Step 4: Verify No Syntax Errors

- **Observe**: Need to ensure TypeScript compilation succeeds
- **Orient**: Run type-check to catch any syntax/type errors
- **Decide**: Execute pnpm type-check
- **Act**: Running type check

**Result**: Type check reveals pre-existing errors in ForceGraphAdapter.tsx (unrelated to our changes). No errors in CrypticAnimusScene.tsx - instrumentation is syntactically correct

#### OODA Loop - Step 5: Commit Changes

- **Observe**: All instrumentation added successfully, no syntax errors
- **Orient**: Need to commit changes with clear message
- **Decide**: Create atomic commit with descriptive message
- **Act**: Execute git commit

**Result**: Successfully committed as c4a43682 with message "feat: add Phase 0 FREEZE-TEST instrumentation to diagnose node movement"

### Phase 0 Completion Summary

**End Time**: 3:52 PM EST, 25/07/2025  
**Status**: ✅ COMPLETED  
**Commit**: c4a43682

**Changes Made**:

1. Added BEFORE instrumentation after window.\_\_FG assignment (now line 194-205)
2. Added AFTER instrumentation after tick execution (now line 223-234)

**Next Steps**:

- Run `pnpm dev --filter cryptic-vault-demo`
- Open browser console
- Look for `[FREEZE-TEST before]` and `[FREEZE-TEST after ]` logs
- Based on results:
  - If `hasVelocity: false` → Implement Phase 1A (unfreeze objects)
  - If `positionChanged: false` despite velocity → Implement Phase 1B (fix render pipeline)
  - If movement detected → Skip to Phase 3 (burst animation)

### Phase 0 Test Results - CRITICAL FINDINGS

**Test Time**: 3:50 PM EST, 25/07/2025  
**Test Type**: Test 1 - Do Nothing  
**Status**: ⚠️ INSTRUMENTATION FAILED

#### OODA Loop - Analyze Test Results

**Observe**:
1. **NO FREEZE-TEST logs appeared** in console despite code being present
2. Console shows: `[Debug] window.__FG has graphData method: false`
3. ForceGraphAdapter exposes only 7 methods: ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
4. **Nodes ARE visibly moving** (contradicts "no physics movement" hypothesis)
5. Extremely low framerate (1-2 FPS)
6. Nodes don't settle after movement

**Orient**:
- Our instrumentation failed because `window.__FG.graphData()` doesn't exist
- The assumption that nodes don't move was **FALSE** - they DO move
- The r3f-forcegraph wrapper provides NO access to node data
- The physics simulation IS running but we can't inspect it

**Decide**:
- Phase 0 instrumentation approach was fundamentally flawed
- Need alternative method to access node data
- Must revise root cause analysis based on new evidence

**Act**:
- Document critical findings
- Revise approach for accessing simulation data

### Revised Next Steps

**Immediate Actions Required**:

1. **Find Alternative Data Access Method**
   - Investigate memoizedNodes array in component
   - Check if THREE.js objects store position data
   - Look for other ways to access simulation state

2. **Address Performance Issues**
   - Remove periodic reheat/tick execution (line 596-673)
   - Investigate why FPS is so low
   - Consider cooldownTime setting impact

3. **Fix Stabilization**
   - Adjust force strengths for proper settling
   - Investigate cooldownTime: Infinity setting
   - May need to implement manual alpha decay

**Evidence-Expectation Gap Analysis**:
- Expected: Static nodes due to broken physics
- Actual: Moving nodes with terrible performance
- Gap Size: Fundamental misunderstanding of the issue
- Action: Complete re-evaluation of approach needed

### Critical Reflection (ULTRATHINK)

**What Went Wrong**:
1. Assumed nodes weren't moving based on previous observations
2. Assumed `graphData()` method would exist on window.__FG
3. Didn't verify API surface before designing instrumentation
4. Focused on wrong problem (movement vs. performance/stabilization)

**Lessons Learned**:
1. Always verify API methods exist before using them
2. Visual observations can be misleading with low FPS
3. The gap between evidence and expectation was indeed larger than anticipated
4. Need to challenge fundamental assumptions more rigorously

---

## ⚠️ Known Pitfalls

1. **Don't attempt `__kapsuleInstance` access** - architecturally impossible with r3f-forcegraph
2. **Don't trust `working-document.md` claims** - alpha fix was never implemented
3. **Check for `fx/fy/fz` pins** - would block all movement
4. **Verify no duplicate THREE contexts** - breaks raycasting
5. **Test with clean build** - stale bundles cause confusion

---

## 🏁 Definition of Done

- [ ] `[FREEZE-TEST]` shows velocity properties exist
- [ ] `[ENERGY]` shows decay from >1.0 to <0.01
- [ ] Visual: Nodes burst from origin then settle
- [ ] Visual: Hover highlights nodes
- [ ] Visual: Click selects/deselects
- [ ] Console: No errors or warnings
- [ ] Build: No webpack aliases
- [ ] Checklist: All Phase 2 items ✅

---

_Maintainer note: Keep this doc updated after each finding. When in doubt, add more instrumentation rather than guessing._
