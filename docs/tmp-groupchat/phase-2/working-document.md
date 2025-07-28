# Executive Summary

The Phase‑2 branch compiles, but three acute issues make the demo untestable:

- a leftover breakpoint/`debugger` call at **CrypticAnimusScene.tsx l295** pauses every load,
- an undefined global `simData` in `setupWindowFG` throws on mount,
- and a render‑phase zustand `setState` causes hundreds of **ForceGraph3D** remounts plus the React “setState in render” error.  
  Until a single, uninterrupted mount is guaranteed, physics, UX, and performance work are noise.

Our fastest route is to focus on a **Stable Scene Lifecycle** sub‑goal: make the graph mount exactly once and stay mounted. Removing the breakpoint, fixing `simData`, and deferring the rogue `setState` will unblock profiling, simplify console output, and let us verify the remaining UX criteria in hours instead of days.

# W: Phase 2 Completed

All legacy `@refinery/interaction` code is replaced by `@refinery/store`, the repo is free of unused files, and the demo passes **five consecutive smoke‑screen runs** that satisfy the Intended Behaviour checklist without console errors or ForceGraph remounts.

## Sub‑W: Stable Scene Lifecycle

Deliver a scene that **mounts once per page‑load and never remounts on idle, hover, filter, or timeline changes**. This removes the major blocker to validating every UX requirement.

### Sub‑W Checklist

- [ ] Delete or guard the breakpoint / `debugger` at CrypticAnimusScene.tsx l295
- [ ] Remove or properly initialise the `simData` reference in `setupWindowFG`
- [ ] Refactor hover / click handlers to avoid zustand `setState` during render
- [ ] Confirm exactly **one** `[FGAdapter] mounted` log after 10 s idle
- [ ] Console shows **zero** red errors on load and first hover

## ROADMAP

| Phase | Action                                                                                                            | 90 %‑CI Effort | P(success) | Notes                              |
| ----- | ----------------------------------------------------------------------------------------------------------------- | -------------- | ---------- | ---------------------------------- |
| 0     | **Kill hard pauses** – search & remove `debugger`; fix `simData`                                                  | 0.5‑1 h        | 0.9        | Simple code edits, high payoff     |
| 1     | **Stop render‑phase updates** – move `selectNodes` etc. into event callbacks; wrap in `startTransition` if needed | 2‑4 h          | 0.75       | Expect at most two offending calls |
| 2     | **Verify single mount** – use React Profiler flame‑chart + console guard                                          | 1‑2 h          | 0.7        | Add temp `mountCount` assert       |
| 3     | **Silence dev‑only spam** – implement `isDebugMode`, cap retries, strip logs                                      | 1 h            | 0.95       | Improves future smoke tests        |
| 4     | **Run mini‑UX battery** – load, hover, click, scrub, filter                                                       | 1‑2 h          | 0.6        | Likely reveals minor prop issues   |
| 5     | **Clean Phase‑2 leftovers** – delete `packages/interaction`, dedupe helpers                                       | 2‑3 h          | 0.85       | Straightforward once stable        |
| 6     | **Five automated smoke runs & merge**                                                                             | 1 h            | 0.9        | Use clean cache between runs       |

**Median timeline:** 1 full working day; **90 % bound:** ≤3 days.

# RUNNING NOTES

1. Unknown prop/key still forcing remounts—trace in Profiler after Phase 1.
2. Immer middleware may copy large graphs; watch memory once lifecycle is stable.
3. Need quick headless smoke script to assert “exactly one mount, zero errors” in CI.
4. Risk: library incompatibility with React 19.1; if mounts persist after fixes, isolate in sandbox.

# RETROSPECTIVES

_What went well_

- Detailed smoke‑screen logs surfaced precise failure points.
- Store slice architecture appears sound; physics engine performs ≥60 FPS when not paused.

_What we could improve_

- Shipped v6 “fix” without first reproducing root‑cause in Profiler.
- Breakpoints and verbose logs were committed, blocking tests.

_High‑impact action items_

1. **Profiler‑first rule:** capture a flame‑chart before any future lifecycle fix.
2. **CI lint** for `debugger` / unguarded `console.log` in non‑test code.
3. Add automated mount‑and‑error smoke test to prevent regressions.
