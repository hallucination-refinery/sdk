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

## 📍 Current State Summary  (Commit `4dd3c2b` — 26 Jul 2025)

### What Works ✅

| Component                          | Evidence (console / visual)                          | Confidence |
| ---------------------------------- | ---------------------------------------------------- | ---------- |
| App boots w/out TDZ error          | fixed in `8ae1cfb3`; zero red‑box on load            | 100 %      |
| Nodes render & **move**            | `[TICKS] Executed 20 …` + visible drift              | 100 %      |
| No dense centre‑clump              | sphere init @ r 299; visual confirms dispersed start | 100 %      |
| Timeline filter toggles visibility | `[VISIBILITY]` logs match node counts                | 100 %      |
| Forced‑tick warm‑up (20) executes  | `[REHEAT]` + single 20‑tick batch                    | 100 %      |
| Host FPS ≈ 40‑70 (stable)          | RAF ≤ 16 ms after warm‑up                            | 80 %       |

### What’s Broken ❌ / ⚠️

| Issue                               | Evidence & notes                                         | Impact                      |
| ----------------------------------- | -------------------------------------------------------- | --------------------------- |
| **Sphere spawn, not origin burst**  | `[INIT POSITIONS] … sphere pattern (radius 299)`         | Medium                      |
| **Periodic component remount loop** | repeated `[INIT POSITIONS]` with shrinking node counts   | High — causes GC & FPS hits |
| **Low FPS in Docker (1‑2 FPS)**     | RAF ≫ 100 ms only inside container                       | High                        |
| **Hover / click visuals dead**      | events logged? = false; no highlight                     | High                        |
| **Nodes never fully settle**        | no further auto‑ticks, energy stays >0                   | Medium                      |
| **No data / alpha access**          | `window.__FG` exposes only 7 methods                     | Medium                      |
| **Retry‑spam in console**           | `Ref not ready, will retry…` repeats until ref available | Low                         |

### Key Discoveries 🕵️

1. Physics **is** active; freeze hypothesis disproven (again).
2. Spawn still uses **sphere workaround** – violates burst‑from‑origin UX.
3. **Remount loop** (likely prop‑equality issue) re‑adds sphere positions & hurts FPS.
4. Wrapper API unchanged — no `graphData()` or `alpha()`, masking internal state.
5. Hover logic not wired to material updates → interaction gap remains.

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
- ⚠️ No clumping (but only due to pre-positioning workaround)

---

## 🔬 Root Cause Analysis (updated)

We map each open issue to its cluster code from _local‑taxonomy v0 .3_.

| Cluster | Symptom                           | Immediate cause (evidence)                     | Underlying factor                     |
| ------- | --------------------------------- | ---------------------------------------------- | ------------------------------------- |
| **CFG** | Burst starts on 299‑radius sphere | legacy sphere‑init util                        | workaround never removed              |
| **PHY** | Docker FPS ≈ 1‑2; host OK         | remount loop + console spam                    | repeated `<ForceGraphAdapter>` mounts |
| **INT** | Hover / click show no highlight   | events not dispatched or material not reactive | interaction slice incomplete          |
| **API** | No alpha / graphData access       | r3f wrapper hard‑caps to 7 public methods      | library limitation                    |

### Causal chain

`CFG (sphere init)` → still hides clumping bug but violates UX  
`PHY (remount)` ↔ increases CPU → lowers FPS → can mask INT bugs  
`API` limits introspection, slowing diagnosis of **PHY** & **INT**.

### falsifiable checkpoints

- If we spawn at origin **and** remount loop persists, we should see clump or low‑FPS re‑appear – proving masking relation.
- Guarding against remounts should lift host FPS > 60 and Docker > 20.

---

## 🛠️ Recovery Plan (v2)

| Step                     | Goal                               | Actions                                                                                                             | Owner   |
| ------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------- |
| **1 Stop Remount Loop**  | Remove duplicate mounts, raise FPS | ‑ Memoise `graphArrays` on `graphVersion` only<br>‑ Keep `visibleIds` filtering inside FG render layer, not as prop |  @dev‑A |
| **2 Origin Burst**       | Meet UX spec & expose latent clump | ‑ Delete sphere randomiser<br>‑ Init `x=y=z=0` for all nodes<br>‑ `d3ReheatSimulation()` after first mount          |  @dev‑B |
| **3 Silence Retry Spam** | Clean console, minor perf win      | ‑ Add early‑return if `fgRef.current` truthy before logging                                                         |  @dev‑A |
| **4 Hover Visuals**      | Restore interaction UX             | ‑ `onNodeHover` dispatch selection → state<br>‑ Update material colour via react‑three‑fiber `useFrame`             |  @dev‑C |
| **5 Energy Sampler**     | Alpha proxy for tuning             | ‑ Log Σ‖Δpos‖² every 1 s; expose `window.__ENERGY`                                                                  |  @dev‑D |

_All steps independently testable in smoke screen._

---

## 📋 Immediate Next Steps (24 h sprint)

1. **Branch** `fix/remount-loop` – implement Step 1, push PR.
2. **Smoke test** host & Docker – expect: no `[INIT POSITIONS]` repeats, FPS host ≥ 60.
3. **If green**, checkout `fix/origin-burst` – implement Step 2, smoke: nodes explode then settle; watch for re‑emergent clump.
4. Post results (console + gif) in #phase‑2; update progress table below.

---

## 📊 Progress Tracking

| Phase / Step        | Status         | Owner | Notes           |
| ------------------- | -------------- | ----- | --------------- |
| 1. Remount loop fix | 🔄 In progress | dev‑A | PR open         |
| 2. Origin burst     | ⏸️ Blocked     | dev‑B | wait for step 1 |
| 3. Retry‑spam clean | ⏸️ Blocked     | dev‑A | after step 1    |
| 4. Hover visuals    | ⏸️ Blocked     | dev‑C | after step 2    |
| 5. Energy sampler   | ⏸️ Blocked     | dev‑D | parallel OK     |

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

---

## 🔵 Sphere-Gate Patch Plan (v1)

### Context & Rationale

Currently, CrypticAnimusScene.tsx pre-positions nodes in a sphere pattern (radius ~299) to avoid the clumping issue. This is a workaround that violates the UX requirement for nodes to burst from origin. We need to gate this behavior behind an environment flag to allow testing both approaches without breaking existing functionality.

### Implementation Analysis

**Current State (lines 86-116):**
- Nodes are distributed in a sphere using golden ratio for even distribution
- Radius calculated as `Math.cbrt(nodeCount) * 50`
- Small random perturbation added to avoid perfect symmetry
- Console log: `[INIT POSITIONS] Added initial positions to ${positionsAdded}/${nodeCount} nodes in sphere pattern (radius: ${radius.toFixed(0)})`

**Environment Variable Design:**
- Name: `NEXT_PUBLIC_GRAPH_SPAWN`
- Values:
  - `"sphere"` - Use current sphere pre-positioning logic
  - `undefined` or any other value - Default to origin spawn (0,0,0)
- Must use `NEXT_PUBLIC_` prefix for Next.js client-side access

### Technical Considerations

1. **TypeScript:** File already has `// @ts-nocheck` so no type errors expected
2. **Linting:** Code follows existing patterns, no new linting issues anticipated
3. **Runtime:** Environment check is a simple string comparison, negligible performance impact
4. **Backwards Compatibility:** Default behavior changes to origin spawn (as per UX spec)

### Step-by-Step Implementation Plan

1. **Update .env.example (lines to add after line 13):**
   ```
   # Graph Visualization Configuration
   NEXT_PUBLIC_GRAPH_SPAWN="origin"                      # Optional: "sphere" for pre-positioned nodes, "origin" (default) for burst animation
   ```

2. **Modify CrypticAnimusScene.tsx (replace lines 86-116):**
   - Add environment check at start of node positioning block
   - If `process.env.NEXT_PUBLIC_GRAPH_SPAWN === "sphere"`, use existing logic
   - Otherwise, set all nodes to `x: 0, y: 0, z: 0`
   - Update console log to indicate which spawn mode is active

3. **Specific code changes:**
   - Line 88: Add `const spawnMode = process.env.NEXT_PUBLIC_GRAPH_SPAWN`
   - Line 89: Add conditional `if (spawnMode === "sphere") { /* existing logic */ } else { /* origin logic */ }`
   - Ensure console log reflects the spawn mode used

### Verification Steps

1. Run `npm run typecheck` - should pass (file has @ts-nocheck)
2. Run `npm run lint` - should have no new errors
3. Test with no env var set - nodes should spawn at origin
4. Test with `NEXT_PUBLIC_GRAPH_SPAWN=sphere` - nodes should use sphere pattern
5. Check console for appropriate `[INIT POSITIONS]` log message

### Risk Assessment

- **Low Risk:** Simple conditional logic with clear fallback
- **No Breaking Changes:** Existing deployments without the env var will get new default behavior
- **Reversible:** Can easily switch back to sphere mode via env var

### Final Implementation Checklist

- [x] Update .env.example with new NEXT_PUBLIC_GRAPH_SPAWN variable
- [x] Modify CrypticAnimusScene.tsx node positioning logic
- [x] Ensure console logs reflect spawn mode
- [x] Verify no TypeScript errors
- [x] Verify no new linting errors
- [ ] Test both spawn modes work correctly
- [ ] Commit with descriptive message mentioning env flag

### Implementation Progress

**Completed Steps:**
1. ✅ Added `NEXT_PUBLIC_GRAPH_SPAWN` to .env.example (line 16)
2. ✅ Modified CrypticAnimusScene.tsx (lines 86-135) with conditional spawn logic
3. ✅ Console logs now indicate spawn mode: `[spawn mode: sphere]` or `[spawn mode: origin]`
4. ✅ No new TypeScript errors (existing errors in ForceGraphAdapter are unrelated)
5. ✅ No new linting errors in cryptic-vault-demo

**Changes Made:**
- Environment variable defaults to origin spawn when undefined
- Sphere mode explicitly requires `NEXT_PUBLIC_GRAPH_SPAWN="sphere"`
- All position initialization logic preserved, just wrapped in conditional
