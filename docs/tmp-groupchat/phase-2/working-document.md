### Last Updated: 1:22 PM, 06-08-2025

# Executive Summary

Smoke‑screen #2 shows _zero_ unexpected remounts: `[FGAdapter] mounted` appears exactly twice (StrictMode double‑mount) even after rapid hover‑and‑click, proving the last render‑phase state write is gone. Core pointer events (hover, click, filter, scrub) now work without tearing down the graph, so the _remount bug_ portion of Phase 2 is closed. Remaining gaps before Phase 2 can be declared “Done” are: (1) wire the **imperative selection/hover visuals** we temporarily disabled, and (2) make **lens‑switch** trigger its single “burst‑and‑settle” animation. Those two fixes unblock the five‑run acceptance loop and the merge into `cryptic‑vault‑baseline`.

Concrete next step: implement `highlightNode`/`selectNode` via the `ForceGraphAdapter` ref and call them from the restored click/hover handlers; then add a one‑shot `d3ReheatSimulation()` on lens change. Smoke‑test again—if remount count stays ≤ 2 and behaviour matches the six UX rules, Phase 2 is finished.

# W: Phase 2 Completed

All legacy `@refinery/interaction` state has been replaced by `@refinery/store` slices; `ForceGraphAdapter` mounts once (StrictMode × 2) and **never remounts** during hover, click, scrub, filter or lens‑switch. Hover and selection visuals are driven imperatively through the adapter ref; all six Intended‑Behaviour checklist items pass five consecutive smoke‑screen runs; branch `replace‑interaction‑with‑store` merges cleanly into `cryptic‑vault‑baseline`.

## Sub-W: Imperative Visual & Lens Burst

Finish wiring transient visuals and lens‑switch physics so Phase 2 can be signed off.

### Sub-W Checklist

- [ ] Restore `onNodeHover` to call `adapter.highlightNode(id)`
- [ ] Restore `onNodeClick` to toggle `adapter.selectNode(id)` without state writes
- [ ] Memo‑wrap any new callbacks/objects fed to the adapter
- [ ] On lens change, call `adapter.d3ReheatSimulation()` once
- [ ] Smoke‑screen pointer‑suite ⇒ remounts ≤ 2, no React errors
- [ ] Tag PR `fix: imperative visuals & lens burst`, squash‑merge

## ROADMAP

| Seq | Task                                                      | Effort (90 % CI) | P(success) | Notes                                 |
| --- | --------------------------------------------------------- | ---------------- | ---------- | ------------------------------------- |
| 1   | Implement `highlightNode`/`selectNode` helpers on adapter | 0.4 – 0.8 h      | 0.85       | API already exposed by r3f‑forcegraph |
| 2   | Re‑enable hover/click handlers to use helpers             | 0.2 – 0.5 h      | 0.9        | No global state writes                |
| 3   | Add one‑shot `d3ReheatSimulation()` on lens change        | 0.3 – 0.6 h      | 0.8        | Guard with `useRef` to prevent loops  |
| 4   | Memo‑wrap remaining inline props to adapter               | 0.2 – 0.4 h      | 0.8        | Stops future prop‑churn remounts      |
| 5   | Run full smoke‑suite ×5; fix emergent issues              | 0.5 – 1.0 h      | 0.75       | Accept if all green                   |
| 6   | Clean PR, delete dead Zustand keys, merge Phase 2         | 0.3 h            | 0.95       | Unblocks later checklist rows         |

**Total expected:** 2 – 3 engineering hours; 75 % chance Phase 2 closes today, 90 % within 24 h.

# RUNNING NOTES

1. Lens burst missing—likely just the disabled `d3ReheatSimulation()` call; low risk.
2. Selection/hover visuals must stay fully imperative to avoid re‑introducing remounts.
3. Remaining rows in the 11‑item migration depend only on this merge; parallel work can start once Phase 2 lands.
4. Need a visually striking clip by tomorrow: Met‑style latent morph can be shot after the lens‑burst fix—even if later checklist rows are still open.

# RETROSPECTIVES

**What went well**

- Grep‑and‑stub strategy eliminated remounts with minimal churn.
- StrictMode mount‑count proved a reliable acceptance metric.

**What we could improve**

- Skipped click‑path noop test on first pass, costing an extra cycle.
- Console‑log noise masked true state writes; should silence early.

**Top action items**

1. Add “noop all handlers” as first diagnostic step to remount playbook.
2. Extend CI smoke test to assert mount‑count ≤ 2 automatically.
3. Document R3F rule: transient visuals stay outside React state.
