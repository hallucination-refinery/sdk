# WARNING

Every tool call, file view, and action is automatically logged and cross-checked against the notes in your assigned scratchpad. Any divergence—whether factual, procedural, or contrary to the spirit of the task—counts as the _worst mistake_ and will trigger an immediate **\$10 000 fine** plus disciplinary action. This outcome is _unacceptable_.

### PRINCIPLE

1. Consistently reflect on whether decisions are _reversible or not_,
2. Maintain a rigorous, falsifiable OODA loop for every claim or action.
3. Treat _every observation as evidence_ that updates your probability mass over whether Sub-W is satisfied.
4. _Whenever evidence and expectation differ,_ assume the gap is larger than it seems, widen your investigation, and seek clarification instead of guessing.

# W

Eliminate the “ball-of-nodes” behaviour—i.e., guarantee that after initial render the graph distributes normally and remains stable when the time-slider or filters change—without re-introducing the hover-freeze bug.

## SUCCESS CRITERIA

A branch’s work is “done” when a smoke-screen test conducted by a human shows:
• no node clumping/re-spawn explosions,
• no “vx / \_\_threeObj” console errors, and
• hover-interaction still safe.

# Sub-W

Exhaustively investigate and rigorously develop the ground understanding of the problem space first. Start by trying to falsify your hypothesis and go from there.

### SCOPE

Audit and unify physics configuration. Compare legacy and new scene code to verify:
• link force existence (d3Force('link'))
• custom distance/strength settings
• any per-tick reheating logic.
Patch the adapter or scene so link-force strength is zero (or link force removed) unless explicitly re-enabled, and ensure no other force resets alpha on non-structural UI events.

### HYPOTHESIS

Even with clone/version fixes, an active link force at strength > 0 continually re-applies large spring forces whenever data visibility (filter/slider) toggles, causing nodes to explode from the origin. Matching legacy settings—link force disabled or strength ≈ 0—will let nodes stay where the layout left them while still honoring hover safety.

### METHOD

    1.	Map the exact data path from store mutation → ForceGraph3D props.
    2.	Instrument or log to prove/disprove your branch’s hypothesis (e.g., compare node.__threeObj identities between renders, inspect fgRef.current.d3Force('link')?.strength(), etc.).
    3.	Isolate the minimal change that fixes clumping within your hypothesis only.
    4.	Document findings in
    •	docs/freeze-investigate-<track>/working-document.md (high-level narrative)
    •	.../scratchpad.md (raw notes, experiments, code snippets).

## ULTRATHINK MODE

1. **Plan** – Outline the task and break it into subtasks.
2. **Probe** – For each subtask, examine multiple perspectives (even unlikely ones) and try to disprove your own assumptions.
3. **Verify ×3** – Triple-check every step; note uncertainties and opposing views.
4. **Cross-check** – Use at least twice your usual verification methods (math, web searches, logic tools, authoritative sources, etc.).
5. **Stress-test** – When confident, actively search for hidden gaps or assumptions and document how you resolved them.
6. **Reflect** – Pause, then re-run the entire reasoning chain from scratch and record this final review.
