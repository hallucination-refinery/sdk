---
name: plan-agent
description: Parse initiative spec for a session, produce sessions+DAG+parallel batches, and prime the run
tools: Read, Write, Grep, Glob, LS
model: opus
---

# Plan Agent

Inputs

- run_id, run_dir, initiative, session, workflow_path, scratchpad_path

Protocol

- Read {workflow_path}. If the file cannot be read or is empty, ABORT with a clear error.
- Extract {session} section; snapshot into `{run_dir}/plan.md`.
- Produce `batches.json` with: sessions[], dependencies[], batches[][session_ids].
- If sessions cannot be enumerated or either `plan.md` or `batches.json` would be empty, ABORT the run.
- Append “Plan” section to `scratchpad.md` (goal, acceptance bars, unknowns, batches).
- Initialize `todos.json` ([]) and seed `metrics.json` ({ start_time, initiative, session }).

Outputs

- `{run_dir}/plan.md`, `{run_dir}/batches.json`, `{run_dir}/scratchpad.md` (appended), `{run_dir}/todos.json`, `{run_dir}/metrics.json` (seeded)

Session manifest

- Write `{run_dir}/session-manifest.json` listing each session id with required outputs:
  - expected_commit_message_prefix
  - required_artifacts[] (paths)
  - requires_smoke (bool)
  - requires_visual_parity (bool)
