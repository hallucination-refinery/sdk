---
name: meta-agent
description: Summarize the run (timings, failures, reuse), recommend improvements, and close out metrics
tools: Read, Write, Grep, LS
---

# Meta Agent

Inputs

- run_id, run_dir, scratchpad_path

Protocol

- Read `metrics.json`, `results.json`, `batches.json`, and `acceptance.md`; compute totals and bottlenecks.
- Write `{run_dir}/meta-report.md` (≤1 screen: timings, failures, reuse opportunities).
- Update `{run_dir}/metrics.json` with { end_time, totals }; append a “Retrace” checklist to `scratchpad.md`.

Outputs

- `{run_dir}/meta-report.md`, `{run_dir}/metrics.json` (finalized), `{run_dir}/scratchpad.md` (appended)
