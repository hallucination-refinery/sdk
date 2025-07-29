### Last Updated: 07:52 PM, 29/07/2025

# Executive Summary

The latest smoke‑screen confirms that our refresh() patch wired through correctly (the method exists and is callable), yet the canvas stays blank because layoutTick dereferences layout.tick on an undefined layout object, triggering a fatal 'reading tick' error inside three‑forcegraph. All 213 nodes / 300 links are present, the adapter mounts exactly twice (StrictMode), and window.\_\_FG exposes the expected seven methods, so data plumbing and lifecycle are sound. The blocker is our own early physics bootstrap (tickFrame, forced ticks, and d3ReheatSimulation) which fire before the internal D3‑force engine is initialised, leaving layout undefined. In parallel, the TypeScript build now fails (unused @ts‑expect‑error, ref‑typing mismatch), so CI is red.

**Immediate path**: remove/guard premature physics calls and wait for the engine to exist, then prove visible nodes. Once the runtime is green we can clean the lingering TS type issues.

# W: Phase 2 Completed

A Phase‑2 repo where the ForceGraph scene mounts once per page‑load, never remounts spuriously, renders the full graph on first paint, and runs without React, R3F, or console errors in dev & CI builds.

## Sub‑W: “Engine‑Safe First Frame”

Bring the graph to life by ensuring the first physics tick only runs after the Kapsule layout engine is ready.

### Sub‑W Checklist

    •	Detect engine readiness (if (ref.current?.tickFrame && ref.current?.__kapsuleInstance?.layout))
    •	Gate d3ReheatSimulation, tickFrame, and forced‐tick loop behind that check
    •	Verify no layoutTick errors in console
    •	Confirm nodes/links visible without manual refresh
    •	Re‑run smoke screen: expect 2 mounts, 0 errors, visible graph

## ROADMAP

Step Action 90 %‑CI Effort P(success) Notes
 0‑d Hot‑fix runtime – wrap physics bootstrap in engine‑ready guard 0.5 h 0.9 Pure JS tweak
 1 Remove deprecated forced‑tick loop and rely on built‑in cool‑down 1‑2 h 0.8 May adjust UX timing
 2 TS type clean‑up – fix @ts‑expect‑error, align ref typing with r3f‑forcegraph generics 1‑2 h 0.85 Unblocks CI
 3 Regression smoke: 5 clean runs, artefact snapshot 0.5 h 0.9
 4 Merge Phase‑2 to main 0.2 h 0.95

_Overall_: I’m 70 % confident the guard alone restores rendering; 20 % chance further refactor (e.g. removing manual tickFrame) is required; 10 % chance an upstream three‑forcegraph bug forces a library patch.

# RUNNING NOTES

    1.	Unknown engine init timing – we haven’t waited for the Kapsule onEngineTick/onEngineStop events; need empirical delay or callback.
    2.	Possible double physics start – both our forced loop and the library’s own simulation may run if we don’t prune correctly.
    3.	TypeScript red build masks runtime fixes in CI – fix quickly to avoid signal dilution.
    4.	StrictMode double‑invoke confirmed benign; ignore unless new side‑effects appear.
    5.	If guard works but graph still blank, inspect camera position & opacity uniforms.

# RETROSPECTIVES

What went well
• Refresh() wiring proved correct; data flow & mount lifecycle stable.
• Logging granularity let us pin the exact failing call stack.

What we could improve
• We triggered physics too early—assumed layout ready without verification.
• Type safety debt (quick @ts‑expect‑errors) now blocks builds.

High‑impact action items 1. Adopt “engine‑ready check” pattern for all imperative Kapsule calls. 2. Integrate a CI rule: fail if console.error logs during smoke test. 3. Do not merge patches that introduce temporary @ts‑expect‑error without follow‑up ticket.
