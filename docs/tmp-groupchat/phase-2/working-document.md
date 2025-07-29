# Executive Summary

The Phase-2 branch compiles and the **50-line repro-sandbox (`/app/debug/fg-repro`) now loads without R3F errors**, giving us a deterministic target for profiling.  
Fresh evidence from the React Profiler and console logs shows **two separate issues**:

1. **Remount loop** – triggered by an internal state change inside `CrypticAnimusScene.tsx`, _not_ by zustand logic.
2. **`setState`-in-render** – caused by zustand updates in hover / click handlers in the main app.

There is **no live `debugger;` statement** at line 295—the earlier pause came from a manual breakpoint in Chrome DevTools. Our fastest path is therefore:

- patch the trivial `simData` `ReferenceError`,
- stabilise the sandbox so `ForceGraphAdapter` mounts exactly once (proving the lifecycle fix),
- then refactor the zustand handlers in the full app.

# W: Phase 2 Completed

All legacy `@refinery/interaction` code is replaced by `@refinery/store`; the repo is cleaned of unused files; the demo passes **five consecutive smoke-screen runs** that satisfy the Intended Behaviour checklist without console errors or ForceGraph remounts.

## Sub-W: Stable Scene Lifecycle

Deliver a scene that **mounts once per page-load and never remounts on idle, hover, filter, or timeline changes**, both in the sandbox and the full demo.

### Sub-W Checklist

- [ ] **Fix `simData`**: properly initialise or remove the global in `setupWindowFG`.
- [ ] Analyse `repro-sandbox-profile.json` flame chart; identify why `graphVersion` state change discards `ForceGraphAdapter`.
- [ ] Implement lifecycle fix (stable `key`, memoisation, or lifted state) so `[FGAdapter] mounted` logs once (twice in React StrictMode).
- [ ] Sandbox console shows **zero** red errors.
- [ ] Refactor hover / click handlers to avoid zustand `setState` during render.
- [ ] Confirm single mount and clean console in the full demo.

## ROADMAP

| Phase | Action                                                                                         | 90 %-CI Effort | P(success) | Notes                                                |
| ----- | ---------------------------------------------------------------------------------------------- | -------------- | ---------- | ---------------------------------------------------- |
| 0-c   | **Trivial fixes** – patch `simData`; ensure DevTools breakpoints cleared                       | 0.5 h          | 0.95       | No debugger in code; just clear DevTools breakpoints |
| 1     | **Sandbox remount fix** – use profiler data to stabilise lifecycle                             | 1-3 h          | 0.85       | Flame chart already captured                         |
| 2     | **Zustand render-phase fix** – move updates out of render, wrap in `startTransition` if needed | 2-4 h          | 0.75       | Separate from remount bug                            |
| 3     | **Mini-UX battery** – hover, click, scrub, filter in full demo                                 | 1-2 h          | 0.7        | Expect minor prop issues                             |
| 4     | **Repo clean-up** – delete `packages/interaction`, dedupe helpers                              | 2-3 h          | 0.9        | Standard hygiene                                     |
| 5     | **Automated smoke runs & merge**                                                               | 1 h            | 0.9        | Five clean runs with fresh cache                     |

**Median timeline:** 1.5 working days; **90 % bound:** ≤3 days.

# RUNNING NOTES

1. Profiler shows `graphVersion` state bump forces unmount; fix should target that diff.
2. Immer copies of large graphs may hit perf; revisit after lifecycle stabilises.
3. Need headless CI smoke test to assert “one mount, zero errors”.
4. Canvas wrapper fix removed R3F context error; current blockers are `simData` throw and remount loop.
5. Manual Chrome breakpoints (not code) caused earlier pauses—ensure DevTools “Pause on exceptions” is off during tests.

# RETROSPECTIVES

_What went well_

- Repro-sandbox isolated lifecycle bug, eliminating noise from zustand and UI.
- Profiler capture (`repro-sandbox-profile.json`) gives concrete evidence for fix.

_What we could improve_

- Earlier “v6 fix” shipped without profiler confirmation.
- Manual breakpoints slipped into commits; slow to notice.

_High-impact action items_

1. **Profiler-first rule**: capture a flame chart before any lifecycle/perf fix.
2. **CI lint**: reject commits with raw `console.log` or `debugger`.
3. **Automated mount test**: fail CI if remount count > 1 or console has errors.
