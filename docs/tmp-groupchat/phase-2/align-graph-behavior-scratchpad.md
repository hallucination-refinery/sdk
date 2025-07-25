Last Updated: 3:00 PM EST, 25/07/2025

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

| Issue                   | Evidence                                       | Impact                                |
| ----------------------- | ---------------------------------------------- | ------------------------------------- |
| **No physics movement** | Nodes static after 300+ ticks                  | Critical - core feature broken        |
| **No alpha access**     | Only 7 methods exposed, no `__kapsuleInstance` | High - can't debug/control simulation |
| **Interactions dead**   | No hover/click visual feedback                 | High - UX broken                      |
| **No burst animation**  | Nodes pre-positioned in sphere                 | Medium - missing intended behavior    |

### Key Discovery

The `r3f-forcegraph` wrapper intentionally limits API to 7 methods. Direct simulation access via `__kapsuleInstance` is architecturally impossible. Claims in `working-document.md` about alpha access being "fixed" are false.

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

### Current Gap Analysis

- ❌ Physics simulation doesn't move nodes
- ❌ Interactions non-functional
- ❌ Webpack alias still present
- ❌ Most checklist items incomplete
- ✅ No freezes/crashes
- ✅ No clumping (but only due to pre-positioning workaround)

---

## 🔬 Root Cause Analysis

### Primary Hypothesis: Frozen Node Objects

- **Evidence Gap**: We've never logged `vx/vy/vz` properties
- **Why Critical**: D3-force requires mutable velocity properties to calculate movement
- **Status**: **UNTESTED – awaiting Phase 0 data**
- **Test**: Log `nodes[0]` before/after ticks to check for velocity fields

### Secondary Hypotheses

1. **Fixed positions (`fx/fy/fz`)**: Nodes might be pinned
2. **Render disconnect**: Positions update but THREE.js objects don't
3. **Force strength zero**: Despite configuration logs
4. **structuredClone damage**: Strips getters/setters needed by simulation

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

| Phase              | Status        | Owner     | Notes                                                    |
| ------------------ | ------------- | --------- | -------------------------------------------------------- |
| 0. Instrumentation | 🚀 In Progress | Assistant | Started 3:45 PM EST 25/07/2025 - Adding FREEZE-TEST logs |
| 1. Unfreeze        | ⏸️ Blocked    | -         | Depends on Phase 0                                       |
| 2. Energy          | ⏸️ Blocked    | -         | -                                                        |
| 3. Burst           | ⏸️ Blocked    | -         | -                                                        |
| 4. Interactions    | ⏸️ Blocked    | -         | -                                                        |
| 5. Cleanup         | ⏸️ Blocked    | -         | -                                                        |

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
- **Observe**: Line 190 logs successful window.__FG assignment
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
