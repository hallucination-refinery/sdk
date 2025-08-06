### Last Updated: 11:35 AM, 06-08-2025

# Executive Summary

Commenting-out the two `uiStore` calls removed the **largest** render-phase writes, but the console still shows `[FGAdapter] mounted` spam, meaning **some other state update (or prop change)** is still invalidating `ForceGraphAdapter`. Until every transient pointer-event update is handled imperatively, React will keep tearing down the component on hover.

**Immediate next move:** locate the _remaining_ render-triggering writes, stub them out, and verify mount stability before wiring the new imperative API.

# W: Phase 2 Completed

Store-based graph renders **once**, remains mounted, and all six user-experience behaviours work for five consecutive smoke-screen runs; legacy `@refinery/interaction` code is deleted and branch merges to `cryptic-vault-baseline`.

## Sub-W: Zero-Remount Hover & Click

Guarantee that pointer events never touch React state: hover/selection feedback is driven **only** through `ForceGraphAdapter`’s imperative ref.

### Sub-W Checklist

- [ ] **Code-grep** for any remaining `uiStore.` or `set(` calls inside pointer-event paths (`CrypticAnimusScene`, timeline, filters).
- [ ] Temporarily **no-op** each call (wrap in `/*TEST*/` comments).
- [ ] Run 30-second rapid hover/click test → expect **≤ 2** `[FGAdapter] mounted` logs (StrictMode).
- [ ] If clean, implement/refine `highlightNode` & `selectNode` methods on `ForceGraphAdapter`.
- [ ] Re-enable visual feedback through those methods; keep global store reads _read-only_.

## ROADMAP

| Step           | Action                                                                             | Effort (90 % CI) | P(success) |
| -------------- | ---------------------------------------------------------------------------------- | ---------------- | ---------- |
| 1              | `grep -R "uiStore\." apps/legacy-import/cryptic-vault-demo                         | 0.1 h            | 0.95       |
| 2              | Comment-out/queueMicrotask-wrap any hits **outside** non-pointer code; retest      | 0.3 h            | 0.8        |
| 3              | If mounts stable, expose `highlightNode / selectNode` on FG ref and patch handlers | 1 h              | 0.75       |
| 4              | Re-run full smoke battery (hover, click, scrub, filter, lens)                      | 0.4 h            | 0.85       |
| 5              | Delete dead Zustand hover/selection keys, update tests & docs                      | 0.3 h            | 0.9        |
| **Merge gate** | Five green CI + manual runs                                                        | 0.3 h            | 0.85       |

Total agent-time ≈ 2 – 3 h; 60 % chance no further library surprises.

# RUNNING NOTES

1. **Module-not-found (`@refinery/canvas-r3f`)** was transient after cache purge; ignore unless it reappears.
2. One TS error (`ref` type) hints the local `canvas-r3f` package isn’t correctly referenced; fix after remount issue.
3. Profiling dump (10-12-16) still un-analysed; low priority until mounts stabilise.

# RETROSPECTIVES

- **What went well:** Quick test proved that merely deferring Zustand updates wasn’t enough, narrowing focus to _any_ React-state writes during pointer events.
- **What to improve:** Run a project-wide grep **first** to avoid whack-a-mole edits; add CI rule that fails on unexpected mount count.
- **High-impact actions:** (1) Grep & freeze all pointer-event setters; (2) finish imperative API; (3) extend smoke tests to assert mount count & FPS.
