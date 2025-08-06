### Last Updated: 5:50 PM, 06-08-2025

# Executive Summary

We have _stopped_ the remount storm, but we still fail Phase 2 because **no implementation attempt has yet demonstrated that it actually mutates the GPU‑side `SpriteMaterial` or triggers a single‑shot `d3ReheatSimulation` on lens change.**  
The repeated failures share two patterns: (1) each patch was pushed without first _proving_ whether the library’s hooks fire (no persistent probes/tests), and (2) every time an API behaved unexpectedly we switched strategies rather than investigating.  
**Concrete next step:** ship a _diagnostic_ commit that asserts, at runtime, that the material exists and is tinted **after** a helper call; keep those assertions until five smoke‑screens pass. That removes guesswork and gives us a measurable “done”.

# W: Phase 2 Completed

`@refinery/interaction` is fully replaced by `@refinery/store`; `ForceGraphAdapter` mounts ≤ 2; hover/node selection visibly tint sprites; lens switch reheats exactly once; five consecutive smoke tests pass all six UX rules; Phase 2 branch merges into `cryptic‑vault‑baseline`.

## Sub-W: **See‑It‑Change Diagnostics**

Add invariant probes & guards that _fail fast_ if a helper does not reach a `SpriteMaterial`, and verify a visible tint + reheat during smoke tests.

### Sub-W Checklist

- [ ] **Invariant probes** inside `highlightNode`, `selectNode`, `nodeThreeObject`, `lensRef`:  
       `console.assert(node.__threeObj && node.__threeObj.material instanceof THREE.SpriteMaterial, 'Missing material')`
- [ ] `tintSprite(material, hex)` helper — `color.setHex(hex); needsUpdate = true`.
- [ ] Guarded one‑shot `d3ReheatSimulation()` on lens change (`hasBurstRef` latch).
- [ ] Memo‑wrap new callbacks to hold mount count at 2.
- [ ] Five‑run smoke suite green → remove probes (keep unit test).

## ROADMAP

| Seq | Task                                    | 90 % CI   | P(success) | Notes                 |
| --- | --------------------------------------- | --------- | ---------- | --------------------- |
| 1   | Insert probes & fail‑fast asserts       | 0.3‑0.6 h | 0.9        | Stops silent failures |
| 2   | Implement `tintSprite` + hook helpers   | 0.4‑0.8 h | 0.85       | Verify with probes    |
| 3   | Re‑enable guarded reheat on lens switch | 0.2‑0.4 h | 0.8        | Expect one burst      |
| 4   | Memo‑wrap props, run smoke suite ×5     | 0.5‑1.0 h | 0.7        | Accept/hot‑fix        |
| 5   | Clean PR & merge Phase 2                | 0.3 h     | 0.95       | Unblocks rest         |

_Total_: **1.7‑3 h**; 65 % chance Phase 2 closes today. If probe shows sprite texture ignores tint, pivot to `nodeSpriteText` with built‑in colour (add +0.5 h, 0.9 P).

# RUNNING NOTES

1. **Unknowns** – does the current sprite material honour `color.setHex`? Probes will tell.
2. Risk of re‑enabling simulation: prior `undefined.tick` crash; guard on null node list.
3. Keep probes until five green runs; otherwise we regress invisibly again.

# RETROSPECTIVES

_What went well_

- Grep‑and‑stub killed remount bug quickly.
- Strict mount‑count became an objective pass/fail metric.

_What we could improve_

- We removed diagnostic logs before proving fixes, leading to blind patches.
- Swapped approaches instead of inspecting why each failed.

_High‑impact action items_

1. **Always add failing probe/test first**, then code until it passes.
2. Preserve dev‑only assertions until a feature survives five smoke runs.
3. Limit “solution hopping”: two failed attempts → mandatory deep dive with instrumentation.
