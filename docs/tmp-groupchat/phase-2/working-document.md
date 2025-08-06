### Last Updated: 12:19 PM, 06-08-2025

# Executive Summary

Hover no longer tears down **ForceGraphAdapter**—Claude’s blanket stubbing removed the last render‑phase state writes on that path—so the StrictMode double‑mount (2 logs) is now the _steady‑state_ when the user merely moves the cursor. Unfortunately, a **node click** still explodes into dozens of `[FGAdapter] mounted` messages, proving at least one setter/prop churn remains on the click path.  
The fastest route to green is to **isolate the click trigger**: (1) temporarily noop every click handler to confirm the remount disappears, then (2) re‑enable handlers one at a time while grepping for hidden `selectNodes`/`set(...)` calls or unstable inline props. Once mounts stay ≤ 2 across all pointer events we can wire the new imperative highlight/select API and close Phase 2.

# W: Phase 2 Completed

The graph mounts once (StrictMode × 2), **never remounts** on hover, click, scrub, filter or lens‑switch; hover/click feedback is driven via `ForceGraphAdapter`’s imperative ref, all six UX behaviours pass five consecutive smoke‑screen runs, and the `replace‑interaction‑with‑store` branch merges cleanly into `cryptic‑vault‑baseline`.

## Sub-W: Zero‑Remount Click Path

Eliminate whatever state write or prop churn still fires during `onNodeClick`, so clicking a node leaves **ForceGraphAdapter** mounted and produces no React errors—unlocking the shift to imperative selection visuals.

### Sub-W Checklist

- [ ] Temporarily replace **all** `onNodeClick` handlers with no‑ops; re‑run 30 s smoke test (expect ≤ 2 mounts).
- [ ] If stable, restore handlers one at a time while grepping for `uiStore.` / `set(` calls and comment them out.
- [ ] Memo‑wrap any inline props passed to `ForceGraphAdapter` (`linkVisibility`, `nodeFilter`, etc.).
- [ ] Verify click now yields ≤ 2 mounts and zero console errors.
- [ ] Document diff & commit (`fix: stabilize click path`).

## ROADMAP

| Step | Action                                                                                       | Effort (90 % CI) | P(success) | Notes                                        |
| ---- | -------------------------------------------------------------------------------------------- | ---------------- | ---------- | -------------------------------------------- |
| 1    | No‑op all click handlers; run smoke test                                                     | 0.25 – 0.5 h     | 0.9        | Confirms click path is culprit               |
| 2    | Grep for residual setters (`selectNodes`, custom `set*`) in click/key/background paths; stub | 0.5 – 1 h        | 0.75       | Expect 1‑3 hits (background click, keyboard) |
| 3    | Memoize remaining prop callbacks/objects passed to FG                                        | 0.3 – 0.6 h      | 0.7        | Guard against prop churn                     |
| 4    | Smoke test full pointer suite (hover, click, scrub, filter, lens)                            | 0.3 h            | 0.85       | Success = ≤ 2 mounts, clean console          |
| 5    | Implement `highlightNode` & `selectNode` imperative helpers; re‑enable visuals               | 0.7 – 1.2 h      | 0.65       | Depends on r3f-forcegraph API quirks         |
| 6    | CI run + five green manual smoke screens; delete dead Zustand keys                           | 0.4 h            | 0.9        | Merge gate for Phase 2                       |

**Overall:** 2 – 3 engineering hours; 60 % chance of finishing Phase 2 today, 80 % within 24 h.

# RUNNING NOTES

1. **Residual click setter** is the top risk; hover stability suggests we’re close.
2. Prop churn may hide in memo‑less props (`linkVisibility`, `nodeColor`); easy to wrap in `useCallback`/`useMemo`.
3. TypeScript ref error in local `canvas-r3f` package is harmless until we touch adapter code but must be fixed before merge.
4. Violation logs from **OrbitControls** are noise—ignore for Phase 2 metrics.

# RETROSPECTIVES

- **What went well:** Broad grep‑and‑stub pass rapidly isolated hover issues and validated the state‑write hypothesis.
- **What we could improve:** We skipped a click‑path sanity check first, costing an extra smoke‑screen cycle.

**Action items (high impact):**

1. Add “noop‑all‑handlers” diagnostic step to the standard remount playbook.
2. Extend smoke test script to assert mount‑count ≤ 2 and fail CI on over‑mounts.
3. Document R3F rule‑of‑thumb: _transient visuals = imperative refs; never React state_.
