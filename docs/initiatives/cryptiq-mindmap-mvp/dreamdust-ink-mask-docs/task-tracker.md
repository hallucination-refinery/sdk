# Dreamdust Diagnostic Task Tracker

| Task                               | Description                                                                 | Branch / PR                                               | Status      | Notes                                                           |
| ---------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- | --------------------------------------------------------------- |
| Alpha hardcode probe               | Force particle alpha to 1.0 or bypass discard to test fragment-stage choke. | codex/investigate-alpha-choke-in-dreamdust (PR #244)      | Completed   | Uses evidence bundle `2025-09-28-evidence.md`                   |
| Vertex position logging            | Log sample `revealPos` / `gl_Position` to confirm geometry collapse.        | codex/instrument-vertex-positions-for-debugging (PR #245) | Blocked     | 2025-09-28 vertex-log run emitted no `[vertex]` samples; debug DEBUG_VERTEX_LOG wiring before retry.【2025-09-28-vertex-log-raw.md:37-127】 |
| Render-loop timing instrumentation | Add lightweight timing of render loop / sim update to identify CPU stalls.  | _TBD_                                                     | Not started | Launch after alpha/vertex probes land                           |
| Post-processing sanity check       | Disable cover-fit / post effects temporarily to rule out compositor issues. | _TBD_                                                     | Not started | Lower priority until earlier probes analysed                    |
| Sim texture snapshot               | Dump sim FBO sample grid for visual inspection.                             | _TBD_                                                     | Not started | Only if previous diagnostics inconclusive                       |

> Update this table whenever a Codex task is launched or completed. Record branch names, PR numbers, and important outcomes (links to evidence, decisions to abandon, etc.).
