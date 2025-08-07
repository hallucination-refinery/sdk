### Last Updated: 4:50 PM, 07-08-2025

# Executive Summary

Phase 1 (core stabilization) is complete; the demo now loads without crashing after restoring critical force‑simulation props and reconnecting the `useSingleSelectedNode` selector. All three visual‑feedback paths remain broken because of (1) race conditions introduced by `queueMicrotask` in the @refinery/store UI slice and (2) `graphData()` returning `undefined`, blocking imperative highlights. The immediate objective is to eliminate these timing defects, expose the graph data reliably, and re‑enable hover/click feedback before progressing to full UX validation.

Concrete next steps:

1. **Remove** `queueMicrotask` from `setHoverNode`, `selectNodes`, and `clearSelection`, running unit tests after each edit.
2. **Patch `ForceGraphAdapter`** to expose the internal `__kapsuleInstance.graphData()` (or fallback to `ref.current._graphData`) and verify that `highlightNode` functions end‑to‑end.
3. **Run five consecutive smoke‑screen tests** and tick off items in the Intended Behaviour checklist; only after these pass should we delete legacy @refinery/interaction assets and merge to `cryptic‑vault‑baseline`.

## W - Phase 2 Completed Success Criteria

[ ] Migration from @refinery/interaction to @refinery/store complete (See "Phase 2 Migration Checklist" below)  
[ ] Five consecutive passing smoke‑screen runs with the demo exhibiting the **Intended Behavior** (See "Intended Behaviour — User-Experience Checklist" below)

## Phase 2 Migration Checklist

Phase 2 — Replace the legacy @refinery/interaction context with the new @refinery/store state slices:  
[ ] Convert every provider in `packages/interaction/*` to store slices (e.g., `batchAddNodes`, `batchAddEdges`, selectors)  
[ ] Swap all consumer hooks in `CrypticVaultScene.tsx` (and any other scene) from the old context to the new store API  
[ ] Remove or archive the now‑unused @refinery/interaction files after successful replacement  
[ ] Consolidate duplicated state logic into the store and delete any redundant helpers left over from the context  
[ ] Verify that graph edits (adding/removing nodes & edges) flow through the store and CRDT history without regressions

## Intended Behaviour — User-Experience Checklist

- [ ] **Initial load**
  - [ ] HUD appears immediately on first render
  - [ ] All nodes spawn at (0, 0, 0) and perform **one** outward burst
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
- [ ] **Lens Change (Causal ↔ Affinity ↔ Temporal)**
  - [ ] Switching the lens triggers **exactly one** fresh burst from the origin
  - [ ] Nodes resettle after the burst and stay static
  - [ ] After resettling, behaviour reverts to the Hover, Click/Selection, Timeline Scrub, and Filter rules until the next lens switch

---

## Sub-W: Timing & Data Exposure Fix

Re‑establish synchronous UI feedback by removing micro‑task‑deferred store updates and ensuring the force‑graph exposes `graphData()`, so hover and selection work reliably. This unblocks all three visual‑feedback paths and is a prerequisite for verifying the Intended Behaviour checklist.

### Sub-W Checklist

- [ ] Remove `queueMicrotask` from `ui-slice.ts` visual‑feedback methods
- [ ] Expose `graphData()` (or safe fallback) from `ForceGraphAdapter`
- [ ] Confirm `highlightNode` and `selectNode` operate end‑to‑end in runtime tests
- [ ] Pass smoke‑screen test covering hover and click highlights

---

## ROADMAP

1. **Phase 2.A — Timing & Data Exposure (70 % chance to fix feedback issues, 3‑5 h)**
   - Remove micro‑task deferrals and verify no React remount regressions (CI & manual tests).
   - Patch adapter to expose graph data; validate highlights on hover/click.

2. **Phase 2.B — Visual‑Feedback Path Audit (60 %, 2‑3 h)**
   - Trace declarative, imperative, and `useFrame` paths; reconcile color/opacity logic.
   - Add Jest tests that simulate hover/click and assert material state.

3. **Phase 2.C — UX Behaviour Validation (50 %, 2‑4 h)**
   - Run checklist items under varied graph sizes; profile for jank.
   - Fix any physics or state sync anomalies.

4. **Phase 2.D — Dead‑Code & Legacy Purge (90 %, 1 h)**
   - Delete @refinery/interaction, stubs, and TODOs; ensure clean TS build.

5. **Phase 3 — Performance Hardening (40 %, 2‑3 h)**
   - Memoize expensive selectors; throttle expensive refs; add error boundaries.

6. **Phase 4 — Final Smoke Suite & Merge (80 %, 1 h)**
   - Achieve five consecutive passing runs; tag `v0.2.0` and merge to `cryptic‑vault‑baseline`.

_Confidence intervals reflect unknowns around ForceGraph3D internals and React 19 quirks; schedule buffers 50 % slack for surprises._

---

# RUNNING NOTES

1. **graphData exposure risk** – may require deep dive into `r3f‑forcegraph`; fallback to private field could break on lib upgrade.
2. **Micro‑task removal risk** – could re‑introduce render thrash; monitor React DevTools for remounts.
3. **Legacy file deletion** – ensure Git history tagged before purge to keep rollback path.
4. **Physics determinism** – single‑burst requirement depends on alpha‑decay tuning; may need empirical calibration.
5. **Solo‑founder bandwidth** – allocate Pomodoro slots and commit after each green test to avoid losing state.

---

# RETROSPECTIVES

**What went well**

- Rapid isolation of the tick‑crash root cause (commented simulation props)
- Swift reconnection of the selection selector, restoring declarative path skeleton

**What we could improve**

- Accepted “functionally complete” at face value; should have audited code earlier
- Fix‑then‑break cycle indicates insufficient unit tests and unchecked architectural drift

**High‑impact actions**

1. Institute smoke‑screen test gate before merging any “fix” branch.
2. Adopt “assumption log” practice: every claim about completeness must reference code evidence.
3. Add hover/click highlight test to catch regressions immediately.
