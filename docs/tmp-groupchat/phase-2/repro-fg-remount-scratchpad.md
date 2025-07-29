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

---

## 🚀 Ready for Smoke Screen Test

_Status Update: 29 Jul 2025_

### Completed Tasks ✅

1. **Phase 0: Environment & File Verification** ✅ COMPLETE
   - Confirmed branch: `feat/repro-fg-remount`
   - Located simData error at line 295 in CrypticAnimusScene.tsx
   - Verified error reproduction with `NEXT_PUBLIC_DEBUG_GRAPH=false`

2. **Phase 1: Fix simData ReferenceError** ✅ COMPLETE
   - **Commit**: `36840d1c` - "feat: add baseline smoke screen tests for v6 remount fix"
   - **Fix Applied**: Moved lines 294-305 inside the `if (isDebugMode)` block
   - **Result**: Sandbox loads without ReferenceError when debug mode is disabled
   - **Verification**: Code change confirmed in CrypticAnimusScene.tsx

### Pending Verification 🔍

1. **Phase 2: Confirm Single-Mount**
   - Need to verify ForceGraphAdapter mounts only once (or twice in React Strict Mode)
   - Check for any unmount logs during idle or interaction
   - Confirm no red errors in browser console

### Critical Information for Testing

1. **Mount Logging Still Active**
   - `/workspace/packages/canvas-r3f/src/adapters/ForceGraphAdapter.tsx` line 123: `console.log('[FGAdapter] mounted')`
   - This allows us to track if remounts are happening
   - Do NOT remove this logging until verification is complete

2. **Test Environment Setup**

   ```bash
   # Ensure you're on the correct branch
   git checkout feat/repro-fg-remount

   # Set environment for testing (no debug spam)
   export NEXT_PUBLIC_DEBUG_GRAPH=false
   export NEXT_PUBLIC_GRAPH_SPAWN=origin

   # Start dev server
   npm run dev
   ```

3. **Test URL**: `http://localhost:3000/debug/fg-repro`

### Next Steps for Smoke Screen Test

1. **Initial Load Test**
   - Open browser console
   - Navigate to test URL
   - Count `[FGAdapter] mounted` logs
   - Expected: 1 log (or 2 in React Strict Mode)
   - Check for any red errors

2. **Idle Test (30 seconds)**
   - Do nothing for 30 seconds
   - Verify no additional mount/unmount logs
   - Check console remains clean

3. **Interaction Test**
   - Hover over several nodes
   - Click on a few nodes
   - Observe console for any new mount logs
   - Expected: NO new `[FGAdapter] mounted` logs

4. **Document Results**
   - Screenshot console output
   - Note exact mount count
   - Record any errors or warnings
   - Compare with baseline test results

### Success Criteria Checklist

- [ ] Sandbox loads without simData ReferenceError ✅ **ALREADY VERIFIED**
- [ ] `[FGAdapter] mounted` logs exactly once (or twice in Strict Mode)
- [ ] No additional mount logs during 30-second idle
- [ ] No additional mount logs during node interactions
- [ ] Zero red errors in browser console
- [ ] Physics simulation continues without reset

### If Test Fails

If remounts still occur:

1. The v6 fix addressed symptoms but not root cause
2. Need to investigate parent component stability
3. Check for conditional rendering in component tree
4. Use React DevTools Profiler to trace unmount triggers

### If Test Passes

If no remounts occur:

1. Document successful smoke screen test
2. Run full test suite with timeline scrub
3. Prepare PR for merging v6 fix
4. Plan follow-up optimizations

### Notes

- The simData fix is atomic and can be merged regardless of remount fix status
- The remount issue is separate and may require deeper investigation
- Keep ForceGraphAdapter mount logging until fully verified
- v6 implementation is in place but effectiveness unknown until tested

---

# SMOKE SCREEN TEST CONDUCTED

## The smoke-screen confirms that Phase 1 (simData fix) worked but Phase 2 (single-mount) failed:

✔ Crash-free load of simData
The previous ReferenceError: simData is gone.

✘ Still remounting
[FGAdapter] mounted appears four times (twice for graphVersion 0, twice again after it increments to 1), so the scene is still being torn down and rebuilt.

✘ New runtime error
TypeError: Cannot read properties of undefined (reading 'tick') originates inside three-forcegraph → layoutTick during setupWindowFG. That exception fires right after the first forced-tick loop, which likely nulls an internal Kapsule instance and triggers the remount cascade.

Implication for W:
We are unblocked from simData but still lack a stable, single-mount scene, so Phase 2 (and therefore Phase 2-complete “W”) is not satisfied. We must: 1. Diagnose the undefined tick path inside layoutTick (check if the graph ref loses its Kapsule instance or if we’re calling tickFrame before the layout is initialized). 2. Stop graphVersion from re-incrementing until the ForceGraph adapter is stable—otherwise every render will continue to remount.

Only after these are fixed can we re-run the smoke-screen to prove a single mount and move on to the remaining UX checks required for W.

## Key take-aways from repro-sandbox-profile-2.json

    1.	Only two React roots are present – the normal application root (displayName: "Root") and the wrapper added by React Strict Mode ("Provider"). Each appears exactly once in the profile and neither shows an unmount entry, so the ForceGraph tree is not being torn down and recreated — it is only being re-rendered.
    2.	Nine commits were recorded for the main root, with durations ranging 3 ms → 17 ms (avg ≈ 8 ms). That pattern (an initial mount followed by ~8 updates) matches what you’d expect from the start-up “forced ticks” plus two graphVersion bumps you saw in the console. Nothing here indicates a full remount cycle.
    3.	No commit contains an “unmount” change description, corroborating the console logs: [FGAdapter] mounted fires twice (Strict Mode) for each root mount, but we never log [FGAdapter] unmounted. The profiler therefore confirms that the TypeError in three-forcegraph is thrown during the first render pass, not after a remount.
    4.	The fatal error path (layoutTick → tickFrame → useEffect.setupWindowFG) occurs during the very first effect-flush; subsequent commits are simply React retrying work after error boundaries recover. This is why you still get multiple [FGAdapter] mounted messages even though the underlying React root never unmounts.

⸻

Why the profile matters for W

W’s next milestone (“Stable Scene Lifecycle”) requires proving that component mounting is no longer the source of instability.
This profile does exactly that: it shows React never unmounts the scene; instead the crash is caused by an undefined force-layout object handed to tickFrame. That shifts our focus away from lifecycle guards and towards initialisation order / null-checking inside setupWindowFG.

⸻

Recommended next steps (no new profiler run needed yet) 1. Guard graph.tickFrame() calls in setupWindowFG until graphRef.current.\_\_kapsuleInstance is available. A quick null-check prevents the layoutTick TypeError and lets the scene run long enough to observe real remount behaviour (if any). 2. Re-run the same smoke-screen test.
• If the console stays clean and mounts remain stable, then run a new React-Profiler capture to measure actual render costs and verify that no hidden unmounts appear over time.
• If another error surfaces, fix that before taking another profile — otherwise the export will again be dominated by recovery commits.

That single guard should get us past the current blocker and let us confirm or refute any remaining remount problems.

### STEPS

In a chrome incognito browser window navigated to "http://localhost:3000/debug/fg-repro" with the debug tools open. Copied console log after load and nodes settle. **After I copied the log** I reloaded the page and ran a profile (@docs/tmp-groupchat/phase-2/repro-sandbox-profile-2.json)

### TERMINAL LOG

node  /workspace   feat/repro-fg-remount ● ? ↑1  NEXT_PUBLIC_DEBUG_GRAPH=false
node  /workspace   feat/repro-fg-remount ● ? ↑1  rm -rf node_modules/.cache .turbo .next
node  /workspace   feat/repro-fg-remount ● ? ↑1  NEXT_PUBLIC_DEBUG_GRAPH=false pnpm dev --filter cryptic-vault-demo

> @refinery/monorepo@0.0.0 dev /workspace
> turbo run dev "--filter" "cryptic-vault-demo"

╭──────────────────────────────────────────────────────────────────────────╮
│ │
│ Update available v2.5.4 ≫ v2.5.5 │
│ Changelog: https://github.com/vercel/turborepo/releases/tag/v2.5.5 │
│ Run "pnpm dlx @turbo/codemod@latest update" to update │
│ │
│ Follow @turborepo for updates: https://x.com/turborepo │
╰──────────────────────────────────────────────────────────────────────────╯
turbo 2.5.4

• Packages in scope: cryptic-vault-demo
• Running dev in 1 packages
• Remote caching disabled
cryptic-vault-demo:dev: cache bypass, force executing 8bce4457f507500b
cryptic-vault-demo:dev:
cryptic-vault-demo:dev: > cryptic-vault-demo@0.1.0 dev /workspace/apps/legacy-import/cryptic-vault-demo
cryptic-vault-demo:dev: > next dev
cryptic-vault-demo:dev:
cryptic-vault-demo:dev: ▲ Next.js 15.3.2
cryptic-vault-demo:dev: - Local: http://localhost:3000
cryptic-vault-demo:dev: - Network: http://172.17.0.2:3000
cryptic-vault-demo:dev:
cryptic-vault-demo:dev: ✓ Starting...
cryptic-vault-demo:dev: ✓ Ready in 3.5s
cryptic-vault-demo:dev: ○ Compiling /debug/fg-repro ...
cryptic-vault-demo:dev: ✓ Compiled /debug/fg-repro in 12.3s (2496 modules)
cryptic-vault-demo:dev: GET /debug/fg-repro 200 in 12972ms
cryptic-vault-demo:dev: ○ Compiling /\_not-found ...
cryptic-vault-demo:dev: ✓ Compiled /\_not-found in 3s (2486 modules)
cryptic-vault-demo:dev: GET /.well-known/appspecific/com.chrome.devtools.json 404 in 3138ms

### BROWSER LOG

`Navigated to http://localhost:3000/debug/fg-repro
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-29T13:10:15.735Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 300
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: undefined
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: undefined
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:940 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-29T13:10:15.738Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 300
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: undefined
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: undefined
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:940 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:159 [INIT POSITIONS] Spawned 213 nodes - mode: origin
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 0
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-29T13:10:15.837Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 300
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: undefined
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: undefined
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:940 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-29T13:10:15.837Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 300
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: undefined
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: undefined
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:940 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: null}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:98 [GRAPH VERSION] Raw structure changed - incrementing version. Nodes: 213 Links: 300
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphVersion: 0 visibleIds: undefined
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:289 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:297 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:317 [Window FG] Error during initial setup: TypeError: Cannot read properties of undefined (reading 'tick')
at layoutTick (three-forcegraph.mjs:753:23)
at comp.tickFrame (three-forcegraph.mjs:740:9)
at comp.<computed> [as tickFrame] (kapsule.mjs:169:65)
at ForceGraph.<computed> [as tickFrame] (three-forcegraph.mjs:1528:75)
at eval (r3f-forcegraph.mjs:160:70)
at Object.eval [as tickFrame] (r3f-forcegraph.mjs:185:24)
at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:300:42)
at CrypticAnimusScene.useEffect (CrypticAnimusScene.tsx:701:5)
at react-stack-bottom-frame (react-reconciler.development.js:7241:22)
at runWithFiberInDEV (react-reconciler.development.js:399:20)
at commitHookEffectListMount (react-reconciler.development.js:4782:628)
at commitHookPassiveMountEffects (react-reconciler.development.js:4817:60)
at reconnectPassiveEffects (react-reconciler.development.js:5670:17)
at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
at reconnectPassiveEffects (react-reconciler.development.js:5669:17)
at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
at commitPassiveMountOnFiber (react-reconciler.development.js:5648:451)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5622:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5648:306)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (react-reconciler.development.js:5614:106) Error Component Stack
at CrypticAnimusScene (CrypticAnimusScene.tsx:62:3)
at BailoutToCSR (dynamic-bailout-to-csr.js:13:11)
at Suspense (<anonymous>)
at LoadableComponent (<anonymous>)
at Suspense (<anonymous>)
at ErrorBoundary (events-f681e724.esm.js:129:5)
at m (index.js:51:1)
at eval (events-f681e724.esm.js:105:5)
at Provider (events-f681e724.esm.js:2045:3)
overrideMethod @ hook.js:608
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:317
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:701
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5669
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
commitPassiveMountOnFiber @ react-reconciler.development.js:5648
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5648
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5627
flushPassiveEffects @ react-reconciler.development.js:6567
eval @ react-reconciler.development.js:6507
performWorkUntilDeadline @ scheduler.development.js:44
CrypticAnimusScene.tsx:318 [Window FG] Stack trace: TypeError: Cannot read properties of undefined (reading 'tick')
at layoutTick (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:753:23)
at comp.tickFrame (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:740:9)
at comp.<computed> [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/kapsule@1.16.3/node_modules/kapsule/dist/kapsule.mjs:169:65)
at ForceGraph.<computed> [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:1528:75)
at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:160:70)
at Object.eval [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:185:24)
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:281:62)
at CrypticAnimusScene.useEffect (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:712:13)
at react-stack-bottom-frame (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:7241:22)
at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:399:20)
at commitHookEffectListMount (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:4782:628)
at commitHookPassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:4817:60)
at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5670:17)
at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5669:17)
at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
at commitPassiveMountOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5648:451)
at recursivelyTraversePassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5656:17)
at recursivelyTraversePassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5622:17)
at recursivelyTraversePassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5614:106)
at commitPassiveMountOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5648:306)
at recursivelyTraversePassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5614:106)
at c
overrideMethod @ hook.js:608
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:318
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:701
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5669
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
commitPassiveMountOnFiber @ react-reconciler.development.js:5648
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5648
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5656
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5622
recursivelyTraversePassiveMountEffects @ react-reconciler.development.js:5614
commitPassiveMountOnFiber @ react-reconciler.development.js:5627
flushPassiveEffects @ react-reconciler.development.js:6567
eval @ react-reconciler.development.js:6507
performWorkUntilDeadline @ scheduler.development.js:44
ForceGraphAdapter.tsx:139 [FGAdapter] ref after mount: {current: {…}}
ForceGraphAdapter.tsx:141 [FGAdapter] ref.current: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:142 [FGAdapter] ref.current keys: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphVersion: 0 visibleIds: undefined
CrypticAnimusScene.tsx:210 [Physics config] Initialized successfully
CrypticAnimusScene.tsx:213 [CrypticAnimusScene] Configuring physics forces!
CrypticAnimusScene.tsx:289 [REHEAT] Initial d3ReheatSimulation called
CrypticAnimusScene.tsx:297 [TICKS] Starting forced tick execution...
CrypticAnimusScene.tsx:317 [Window FG] Error during initial setup: TypeError: Cannot read properties of undefined (reading 'tick')
at layoutTick (three-forcegraph.mjs:753:23)
at comp.tickFrame (three-forcegraph.mjs:740:9)
at comp.<computed> [as tickFrame] (kapsule.mjs:169:65)
at ForceGraph.<computed> [as tickFrame] (three-forcegraph.mjs:1528:75)
at eval (r3f-forcegraph.mjs:160:70)
at Object.eval [as tickFrame] (r3f-forcegraph.mjs:185:24)
at CrypticAnimusScene.useEffect.setupWindowFG (CrypticAnimusScene.tsx:300:42)
at CrypticAnimusScene.useEffect (CrypticAnimusScene.tsx:701:5)
at react-stack-bottom-frame (react-reconciler.development.js:7241:22)
at runWithFiberInDEV (react-reconciler.development.js:399:20)
at commitHookEffectListMount (react-reconciler.development.js:4782:628)
at commitHookPassiveMountEffects (react-reconciler.development.js:4817:60)
at reconnectPassiveEffects (react-reconciler.development.js:5670:17)
at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
at reconnectPassiveEffects (react-reconciler.development.js:5669:17)
at recursivelyTraverseReconnectPassiveEffects (react-reconciler.development.js:5661:68)
at reconnectPassiveEffects (react-reconciler.development.js:5676:325)
at doubleInvokeEffectsOnFiber (react-reconciler.development.js:6681:205)
at runWithFiberInDEV (react-reconciler.development.js:399:20)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:332)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at runWithFiberInDEV (react-reconciler.development.js:399:20)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:433)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (react-reconciler.development.js:6673:176) Error Component Stack
at CrypticAnimusScene (CrypticAnimusScene.tsx:62:3)
at BailoutToCSR (dynamic-bailout-to-csr.js:13:11)
at Suspense (<anonymous>)
at LoadableComponent (<anonymous>)
at Suspense (<anonymous>)
at ErrorBoundary (events-f681e724.esm.js:129:5)
at m (index.js:51:1)
at eval (events-f681e724.esm.js:105:5)
at Provider (events-f681e724.esm.js:2045:3)
overrideMethod @ hook.js:600
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:317
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:701
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5669
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5676
doubleInvokeEffectsOnFiber @ react-reconciler.development.js:6681
runWithFiberInDEV @ react-reconciler.development.js:399
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
runWithFiberInDEV @ react-reconciler.development.js:399
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
commitDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6689
flushPassiveEffects @ react-reconciler.development.js:6569
eval @ react-reconciler.development.js:6507
performWorkUntilDeadline @ scheduler.development.js:44
CrypticAnimusScene.tsx:318 [Window FG] Stack trace: TypeError: Cannot read properties of undefined (reading 'tick')
at layoutTick (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:753:23)
at comp.tickFrame (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:740:9)
at comp.<computed> [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/kapsule@1.16.3/node_modules/kapsule/dist/kapsule.mjs:169:65)
at ForceGraph.<computed> [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/three-forcegraph@1.43.0_three@0.176.0/node_modules/three-forcegraph/dist/three-forcegraph.mjs:1528:75)
at eval (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:160:70)
at Object.eval [as tickFrame] (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/r3f-forcegraph@1.1.1_react@19.1.0_three@0.176.0/node_modules/r3f-forcegraph/dist/r3f-forcegraph.mjs:185:24)
at CrypticAnimusScene.useEffect.setupWindowFG (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:281:62)
at CrypticAnimusScene.useEffect (webpack-internal:///(app-pages-browser)/./components/CrypticAnimusScene.tsx:712:13)
at react-stack-bottom-frame (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:7241:22)
at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:399:20)
at commitHookEffectListMount (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:4782:628)
at commitHookPassiveMountEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:4817:60)
at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5670:17)
at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5669:17)
at recursivelyTraverseReconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5661:68)
at reconnectPassiveEffects (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:5676:325)
at doubleInvokeEffectsOnFiber (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:6681:205)
at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:399:20)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:6673:332)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:6673:176)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:6673:176)
at runWithFiberInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:399:20)
at recursivelyTraverseAndDoubleInvokeEffectsInDEV (webpack-internal:///(app-pages-browser)/../../../node_modules/.pnpm/react-reconciler@0.31.0_react@19.1.0/node_modules/react-reconciler/cjs/react-reconciler.development.js:6673:
overrideMethod @ hook.js:600
error @ intercept-console-error.js:50
CrypticAnimusScene.useEffect.setupWindowFG @ CrypticAnimusScene.tsx:318
CrypticAnimusScene.useEffect @ CrypticAnimusScene.tsx:701
react-stack-bottom-frame @ react-reconciler.development.js:7241
runWithFiberInDEV @ react-reconciler.development.js:399
commitHookEffectListMount @ react-reconciler.development.js:4782
commitHookPassiveMountEffects @ react-reconciler.development.js:4817
reconnectPassiveEffects @ react-reconciler.development.js:5670
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5669
recursivelyTraverseReconnectPassiveEffects @ react-reconciler.development.js:5661
reconnectPassiveEffects @ react-reconciler.development.js:5676
doubleInvokeEffectsOnFiber @ react-reconciler.development.js:6681
runWithFiberInDEV @ react-reconciler.development.js:399
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
runWithFiberInDEV @ react-reconciler.development.js:399
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
recursivelyTraverseAndDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6673
commitDoubleInvokeEffectsInDEV @ react-reconciler.development.js:6689
flushPassiveEffects @ react-reconciler.development.js:6569
eval @ react-reconciler.development.js:6507
performWorkUntilDeadline @ scheduler.development.js:44
three-forcegraph.mjs:753 Uncaught TypeError: Cannot read properties of undefined (reading 'tick')
at layoutTick (three-forcegraph.mjs:753:23)
at comp.tickFrame (three-forcegraph.mjs:740:9)
at comp.<computed> [as tickFrame] (kapsule.mjs:169:65)
at ForceGraph.<computed> [as tickFrame] (three-forcegraph.mjs:1528:75)
at eval (r3f-forcegraph.mjs:160:70)
at Object.eval [as tickFrame] (r3f-forcegraph.mjs:185:24)
at CrypticAnimusScene.useFrame [as current] (CrypticAnimusScene.tsx:826:21)
at update (events-f681e724.esm.js:2256:22)
at loop (events-f681e724.esm.js:2287:17)
layoutTick @ three-forcegraph.mjs:753
tickFrame @ three-forcegraph.mjs:740
comp.<computed> @ kapsule.mjs:169
ForceGraph.<computed> @ three-forcegraph.mjs:1528
eval @ r3f-forcegraph.mjs:160
eval @ r3f-forcegraph.mjs:185
CrypticAnimusScene.useFrame @ CrypticAnimusScene.tsx:826
update @ events-f681e724.esm.js:2256
loop @ events-f681e724.esm.js:2287
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
requestAnimationFrame
loop @ events-f681e724.esm.js:2272
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:114 [CrypticAnimusScene] Memoizing graph data for version: 1
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-29T13:10:15.884Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 300
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: undefined
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: undefined
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:940 [FILTERS] Nodes passing filters: 213 / 213
CrypticAnimusScene.tsx:178 [Animus] render ForceGraph3D
CrypticAnimusScene.tsx:181 [Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at: 2025-07-29T13:10:15.884Z
CrypticAnimusScene.tsx:184 [Data debug] nodes: 213 links: 300
CrypticAnimusScene.tsx:185 [Data debug] ForceGraph3D component loaded: true
CrypticAnimusScene.tsx:188 [FILTERS] visibleIds: undefined
CrypticAnimusScene.tsx:189 [FILTERS] activeCategories: undefined
CrypticAnimusScene.tsx:190 [FILTERS] showSecrets: true
CrypticAnimusScene.tsx:191 [FILTERS] activeTags: undefined
CrypticAnimusScene.tsx:940 [FILTERS] Nodes passing filters: 213 / 213
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
ForceGraphAdapter.tsx:123 [FGAdapter] mounted
ForceGraphAdapter.tsx:124 [FGAdapter] ref type: {current: {…}}
ForceGraphAdapter.tsx:125 [FGAdapter] typeof ref: object
CrypticAnimusScene.tsx:106 [REMOUNT CHECK] graphVersion: 1 visibleIds: undefined
events-f681e724.esm.js:2271 [Violation] 'requestAnimationFrame' handler took 89ms
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has **kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']
ForceGraphAdapter.tsx:146 [FGAdapter] ref.current after 1s: {emitParticle: ƒ, getGraphBbox: ƒ, d3ReheatSimulation: ƒ, d3Force: ƒ, resetCountdown: ƒ, …}
ForceGraphAdapter.tsx:148 [FGAdapter] Has **kapsuleInstance? false
ForceGraphAdapter.tsx:149 [FGAdapter] Constructor: Object
ForceGraphAdapter.tsx:150 [FGAdapter] All properties: (7) ['emitParticle', 'getGraphBbox', 'd3ReheatSimulation', 'd3Force', 'resetCountdown', 'tickFrame', 'refresh']`
