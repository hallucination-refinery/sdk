# ForceGraph3D Remount Fix Plan - Repro Sandbox

## Executive Summary

This scratch‑pad is **only** for you to execute the very next smoke‑screen cycle.  
Scope:

1. Fix the `ReferenceError: simData is not defined` in `CrypticAnimusScene.tsx`. ✅ **COMPLETE**  
2. Verify that the sandbox page (`/debug/fg-repro`) mounts `<ForceGraphAdapter>` exactly once (two mounts max in React Strict Mode) and produces **no** red console errors.

All other optimisations (prop memoisation, `graphVersion` refactor, etc.) are intentionally out‑of‑scope until this smoke‑screen passes.

## Current State Analysis

### simData ReferenceError

- **Location**: Line 295 in CrypticAnimusScene.tsx
- **Cause**: `simData` declared inside `if (isDebugMode)` block but accessed outside
- **Impact**: Throws ReferenceError when debug mode is disabled

### ForceGraphAdapter Remounts

- **Evidence**: `[FGAdapter] mounted` logs multiple times during interactions
- **Root Cause**: State updates in CrypticAnimusScene trigger full component lifecycle restart
- **Impact**: Physics simulation resets, performance degradation, visual glitches

## Step‑by‑Step Implementation Plan

### Phase 0: Environment & File Verification (≈5 min) ✅ **COMPLETE**

- Confirm you are on branch `feat/repro-fg-remount`.
- Run
  ```bash
  grep -n "simData" apps/legacy-import/cryptic-vault-demo/components/CrypticAnimusScene.tsx
  ```
  to verify the offending code is around line 295.
- Start the dev server (`npm run dev`) and load `http://localhost:3000/debug/fg-repro` with **`NEXT_PUBLIC_DEBUG_GRAPH=false`** to reproduce the crash.

### Phase 1: Fix `simData` ReferenceError (≤10 min) ✅ **COMPLETE**

1. In _CrypticAnimusScene.tsx_ move the **entire** "Phase 0 Instrumentation – AFTER" block (lines ≈294‑305) inside the existing `if (isDebugMode)` guard so that `simData` is scoped correctly.
2. Re‑run the sandbox with `NEXT_PUBLIC_DEBUG_GRAPH=false`; the page should load with **no** ReferenceError.
3. Set `NEXT_PUBLIC_DEBUG_GRAPH=true`; reload and ensure there is still no error.

### Phase 2: Confirm Single‑Mount (≤10 min)

1. Ensure the devtools console shows **exactly one** `[FGAdapter] mounted` message (two in Strict Mode) and **zero** `[FGAdapter] unmounted` lines over 30 seconds idle.
2. Manually hover a few nodes; verify no additional mount/unmount logs or red errors appear.
3. If extra mounts occur, annotate the console output and stop here—the fix did not hold.

## Success Criteria Checklist

- [x] Sandbox loads without `simData` ReferenceError when debug mode is OFF. ✅ **COMPLETE**
- [ ] `[FGAdapter] mounted` logs exactly once (or twice in Strict Mode) and never logs `unmounted`.
- [ ] No red errors in the browser console.

## Applied Fix Documentation

### simData ReferenceError Fix (Phase 1) ✅ **COMPLETE**

**Problem**: `simData` was declared inside the `if (isDebugMode)` block but accessed outside it, causing a ReferenceError when debug mode was disabled.

**Solution Applied**: Moved lines 294-305 (Phase 0 Instrumentation - AFTER block) inside the existing `if (isDebugMode)` block at line 264.

**Implementation Details**:
- The AFTER instrumentation block that references `simData` is now properly scoped within the debug mode conditional
- This ensures `simData` is only accessed when it's defined
- No functional changes to the instrumentation logic itself

**Result**: The sandbox now loads successfully without ReferenceError when `NEXT_PUBLIC_DEBUG_GRAPH=false`

## Risk Assessment

## Alternative Approaches

## Time Estimate

---

## 🔍 ULTRATHINK MODE AUDIT RESULTS

_Audit conducted: 29 Jul 2025_

### Executive Summary

This audit verifies factual assertions and critiques the investigative methodology in the ForceGraph3D Remount Fix Plan. Critical findings reveal the plan references **non-existent files** and lacks proper verification steps.

### Assertion Verification Results

#### HIGH RISK - Blocking Issues

1. **simData ReferenceError** ✅ CONFIRMED
   - **Location**: Line 295 in CrypticAnimusScene.tsx
   - **Cause**: Variable declared inside `if (isDebugMode)` block (line 264) but accessed outside
   - **Evidence**: Direct code inspection shows scope violation
   - **Impact**: Application crashes when `NEXT_PUBLIC_DEBUG_GRAPH=false`

2. **ForceGraphAdapter Remounts** ✅ CONFIRMED
   - **Evidence**: Baseline test logs show multiple `[FGAdapter] mounted` entries
   - **Pattern**: Component remounts on hover, click, and timeline scrub
   - **Test 1**: 4+ mount logs during "do nothing" test
   - **Test 2**: Mount logs every ~20 lines during interaction
   - **Impact**: Severe performance degradation, physics simulation resets

#### MEDIUM RISK - Plan Validity Issues

3. **Referenced Files Don't Exist** ❌ CONTRADICTED
   - **RepForceGraphAdapter.tsx**: No file found
   - **RepForceGraphWrapper.tsx**: No file found
   - **FGRepro.tsx**: No file found
   - **Actual repro**: `/app/debug/fg-repro/page.tsx` uses different structure
   - **Impact**: Phases 2-5 of plan cannot be implemented as written

4. **Phase 1 Fix Location** ✅ VERIFIED
   - **Lines 294-305**: Correct location for AFTER instrumentation
   - **Fix approach**: Wrapping in debug check is correct solution
   - **Risk**: Low - simple scope fix

5. **Timeline State Management Issue** ✅ PARTIALLY CONFIRMED
   - **Evidence**: `setState`-in-render error in baseline test logs
   - **Root cause**: Zustand state updates during render (line 369)
   - **Not addressed**: Plan doesn't fix this separate issue

### Investigation Methodology Critique

#### Strengths

- Clear phase-by-phase breakdown
- Specific line number references
- Success criteria checklist
- Risk assessment per phase
- Rollback plan included

#### Critical Weaknesses

1. **No File Existence Verification**
   - Plan assumes files exist without checking
   - All repro-specific fixes target phantom files
   - No `ls` or `find` commands in process

2. **Missing Context Verification**
   - No git status/branch check
   - No version/commit hash reference
   - No verification of which ForceGraph library is used

3. **Incomplete Root Cause Analysis**
   - Focuses on symptoms not underlying architecture
   - Doesn't investigate parent component stability
   - Missing React DevTools profiler usage

4. **No Baseline Metrics**
   - No current performance measurements
   - No quantified remount frequency
   - Success criteria are binary not graduated

### Risk-Impact Priority Grouping

#### 🔴 CRITICAL (Must Fix First)

1. **simData ReferenceError** - Application unusable without debug mode
2. **Invalid file references** - Plan cannot proceed without correct files

#### 🟡 HIGH (Fix Before Testing)

3. **ForceGraphAdapter remounts** - Core performance issue
4. **setState-in-render errors** - React violations causing instability

#### 🟢 MEDIUM (Optimize Later)

5. **Memoization improvements** - Performance optimizations
6. **Lifecycle guards** - Defensive programming

### Concrete Improvement Actions

#### For the Plan

1. **Add file discovery phase** before Phase 1:

   ```bash
   find . -name "*FG*" -o -name "*ForceGraph*" | grep -E "(tsx|jsx)$"
   ls -la app/debug/
   ```

2. **Verify actual component structure**:
   - Check if repro uses same ForceGraphAdapter as main app
   - Map component hierarchy with React DevTools
   - Identify actual file names and imports

3. **Add quantitative baseline**:
   - Count remounts per interaction type
   - Measure FPS during timeline scrub
   - Profile memory usage over time

4. **Fix Phase 2 to use actual files**:
   - Replace RepForceGraphAdapter → ForceGraphAdapter
   - Update paths to match codebase structure
   - Verify imports before editing

5. **Add setState-in-render fix**:
   - New phase to wrap zustand updates in startTransition
   - Move state updates out of render path
   - Test with React concurrent features

#### For the Investigative Workflow

1. **Always verify file existence first**:

   ```bash
   # Before any edit plan
   ls -la <target-directory>
   grep -r "ComponentName" .
   ```

2. **Document environment context**:

   ```bash
   git status
   git log -1 --oneline
   node --version
   cat package.json | grep "react"
   ```

3. **Use React DevTools Profiler**:
   - Record baseline performance
   - Identify component unmount triggers
   - Track render frequencies

4. **Create minimal reproducible example**:
   - Strip down to only ForceGraph
   - Remove all state management
   - Test core remount issue in isolation

5. **Add progressive verification**:
   - Test after each phase
   - Keep console logs until verified
   - Use feature flags for rollback

6. **Cross-reference with existing tests**:
   - Check baseline-smoke-screen-tests.md results
   - Verify plan addresses actual logged errors
   - Update plan based on test evidence

### Summary

## The plan correctly identifies real issues (simData error, remounts) but fails basic verification by referencing non-existent files. The investigative method lacks crucial discovery steps and assumes too much about code structure. With the improvements above, the plan could be salvaged and made actionable.

_Next editing pass is forbidden until the above Success Criteria are met and a fresh smoke‑screen run passes._