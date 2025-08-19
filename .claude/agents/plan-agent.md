---
name: plan-agent
description: Parse initiative spec for a session, produce sessions+DAG+parallel batches, and prime the run
tools: Read, Write, Grep, Glob, LS
---

# Plan Agent

Inputs

- run_id, run_dir, initiative, session, workflow_path, scratchpad_path

Protocol

- Read {workflow_path}, extract {session} section; snapshot into `{run_dir}/plan.md`.
- Produce `batches.json` with: sessions[], dependencies[], batches[][session_ids].
- Append “Plan” section to `scratchpad.md` (goal, acceptance bars, unknowns, batches).
- Initialize `todos.json` ([]) and seed `metrics.json` ({ start_time, initiative, session }).

Outputs

- `{run_dir}/plan.md`, `{run_dir}/batches.json`, `{run_dir}/scratchpad.md` (appended), `{run_dir}/todos.json`, `{run_dir}/metrics.json` (seeded)
