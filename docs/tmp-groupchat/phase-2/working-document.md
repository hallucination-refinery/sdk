Last Updated: 4:00 AM EST, 25/07/2025

# W - Phase 2 Completed

Definition: Every legacy force-graph dependency is replaced by the new SDK store-driven rendering path, with all items in phase 2 of the @migration-checklist.md file is marked DONE and the demo running without clumping, freezes, or build-time aliases.

Success Metric:

1. Demo runs 5X smoothly with the intended behavior
2. All Phase 2 migration checklist items DONE

# Open Questions (Ranked)

1. ~~**Ref exposed.** `FG ref …` log confirms `fgRef.current` and assignment run.~~ **RESOLVED**
2. ~~Ref methods list shows no `graphData` function and no `d3Alpha`; need alternative way to access simulation or ensure adapter passes full API.~~ **RESOLVED**: Access via `__kapsuleInstance.d3ForceLayout`
3. Browser is loading stale pre-built `@refinery/store` because webpack alias was lost during reset—new code isn't reaching client.

# Immediate Next Actions

**UPDATE (2025-07-25)**: Alpha access path discovered and fixed! Diagnostic now correctly logs numeric alpha values.

~~Alias restored (`f56470f4`) but smoke-screen shows **no change**: nodes still clumped. Diagnostic alpha logs print only after hover and stay `n/a` → `d3Force()` returns undefined alpha.~~

**COMPLETED Actions**:

1. ✅ Located internal d3-simulation handle at `__kapsuleInstance.d3ForceLayout`
2. ✅ Fixed diagnostic code to use correct path: `window.__FG.__kapsuleInstance.d3ForceLayout.alpha()`
3. ✅ Verified programmatic control: `window.__FG.__kapsuleInstance.d3ForceLayout.alpha(0.8).restart()`

**New Immediate Actions**:

1. Verify nodes actually spread apart when alpha is high (visual confirmation needed)
2. Test if removing cooldown overrides (Infinity, 0) allows natural simulation settling
3. Investigate why nodes remain clumped despite active simulation (alpha > 0)

## ULTRA-DEEP ANALYSIS (2025-07-24 18:10)

Objective: locate why simulation alpha remains inaccessible (d3Alpha undefined) despite ref exposure and force configuration.

Sub-tasks & verification strategy

1. Locate internal d3-simulation handle
   a. Read r3f-forcegraph source (`threeForceGraph.js`) → search for `.alpha(`.
   b. Cross-verify with TypeScript defs to confirm method names.
   c. Hypothesis: property `_engine` or `__forceSim` exists; test via `Object.keys(window.__FG)` in browser.
   d. Falsification: if no such property, wrapper strips alpha API. Counter-check by importing ThreeForceGraph directly in a test file.

2. Confirm forces actually running
   a. Insert `console.log(node.x)` for first node every tick (use `tickFrame()` in interval).
   b. Independent check: in CLI test, diff node positions JSON before/after 2s → expect Δ > 0.

3. Re-evaluate cooldown overrides
   a. With alpha still n/a, cooldown suppression may freeze simulation; remove `cooldownTime`, `cooldownTicks`, `d3AlphaDecay` overrides and retest.
   b. Verify via browser network diff that new bundle lacks those props (grep in .next static chunk).

4. Double-clone side-effects
   a. StructuredClone may strip getters (alpha). Test by logging a cloned graph object and checking for `alpha` field.
   b. Create synthetic nodes without clone in sandbox; mount ForceGraph directly to confirm alpha accessible.

Triple-verification tools

- Grep / rg search across node_modules
- Node REPL to require r3f-forcegraph and inspect prototype
- Playwright script to capture node positions and compare
- Git diff of .next bundle for cooldown props
- `console.dir` with depth to list hidden fields

Known uncertainties / pitfalls

- Different r3f-forcegraph version in view-three may shadow correct one → check import graph via `npm ls | grep r3f-forcegraph`.
- Our Object.freeze monkey-patch could inadvertently remove simulation getters; test with patch removed.

Final reflective pass
After executing steps above, reassess: did any assumption about alpha API prove false? Did force config or clone overshadow simulation energy? Document contradictions and adjust probability of each cause accordingly.

## Detailed Plan for Victory

_Concrete, obstacle-free path from now → "W". Update whenever assumptions change._

1. 🔍 **Simulation Alpha Access** — expose internal d3-simulation handle and verify alpha mutability.
2. 🪄 **Force Kick Works** — programmatically `alpha(0.8).restart()` spreads nodes in local test.
3. ⚙️ **Remove Freeze Guards Iteratively** — re-enable natural cooling parameters and confirm no regressions.
4. 🧹 **Prune Redundant structuredClone** — eliminate double-clone to cut 30 ms overhead.
5. 🛠 **Smoke-screen Test Passes** — baseline script shows nodes separate within 3 s, alpha → < 0.005 after 15 s.
6. 🗂 **Merge `replace-interaction-with-store` → `main`** — after user confirmation & checklist green.

## Roadmap & Milestones (living)

| ETA   | Milestone                         | 90 % CI | Owner          | Status         |
| ----- | --------------------------------- | ------- | -------------- | -------------- |
| 07-25 | Alpha handle located & logged     | ±0.5 d  | Assistant      | ✅ completed   |
| 07-26 | Nodes de-clump in dev build       | ±1 d    | Assistant      | 🔄 in-progress |
| 07-27 | Full smoke-screen green           | ±1 d    | User           | pending        |
| 07-28 | Branch merged after manual verify | ±2 d    | Assistant/User | pending        |

> 📏 _Update confidence bands aggressively; “missing milestone” = escalate._

## Roles & Ownership (DRI table)

| Area                            | Directly Responsible Individual | Notes                             |
| ------------------------------- | ------------------------------- | --------------------------------- |
| Force-graph internals & physics | Assistant                       | Investigation / code patches      |
| Manual smoke-screen validation  | User                            | Final “yes”/“no” gate             |
| Branch hygiene / CI green       | Assistant                       | Ensure no regressions             |
| Architectural sign-off          | User                            | Approves removal of freeze guards |

## Fast OODA Loop Ritual

Daily (or more frequent while blocked):

1. **Observe** — Run diagnose script, capture alpha & node positions.
2. **Orient** — Update _Open Questions_ & this doc.
3. **Decide** — Pick highest-impact next action (top of Immediate Next Actions).
4. **Act** — Implement; push patch; post update in project channel.

⏰ _Target < 4 h turnaround between observing a new fact and updating plan._

## Weekly Broadcast Update (template)

```
**Phase-2 status – YYYY-MM-DD**
Vibe: 🔥 / 🙂 / 😐 / 😰
Changes:
• …
Coming up:
• …
Blocking:
• …
```

_Post in #phase-2 channel & link to latest working doc._
