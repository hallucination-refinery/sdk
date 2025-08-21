---
name: orchestrate
description: Orchestrate a single session for an initiative end‑to‑end using sub‑agents, with validation and git hygiene
args:
  - initiative # e.g., cryptiq-mindmap-mvp
  - session # e.g., 03 or ALL (to run all sessions sequentially)
---

**ULTRATHINK MODE**

Behavior

- Run bootstrap
  - Create run_id = UTC timestamp + `{initiative}-{session}` (use `ALL` if running every session); make `.clmem/runs/<run_id>/` and initialize: `scratchpad.md`, `plan.md` (empty), `todos.json` (empty array), `metrics.json` with `{ start_time, initiative, session, sessions: [] }`, `acceptance.md` (header only), and an empty `session.log`.

- Context capture
  - Read `docs/initiatives/{initiative}/workflow.md`. If `session != ALL`, extract that session section verbatim into `plan.md`. If `session == ALL`, snapshot Section E (all sessions) into `plan.md`. In `scratchpad.md`, restate the session goal(s), acceptance bars, and explicit unknowns/assumptions (1–2 lines each).

- Planning (plan-agent)
  - Use Task to invoke `plan-agent` with `{ run_id, run_dir, initiative, session, workflow_path, scratchpad_path }` asking for: session list, dependencies (DAG), parallelizable batches, risks, and required validations per session. If `session == ALL`, the agent must enumerate all sessions from Section E and produce batches across them. The agent must append a “Plan” section to `scratchpad.md` and write `batches.json` into the run dir.

- Execution (Task sub‑agents)
  - For each batch in order: for each planned session (in parallel up to orchestrator limits), call the mapped sub‑agent with `{ run_id, run_dir, scratchpad_path, session_id, goals, acceptance, target_paths }`. Each sub‑agent must append a “Session <n>” entry to `scratchpad.md`, update `todos.json` if it creates tasks, and return a minimal changeset summary. Stay on the current working branch for the entire run.

- Commits and gates
  - After each session completes, make one atomic commit with message `workflow(session-<n>): <desc> [ok|needs-fix]`, then run validations (lint → test → build) via `validate-agent`; record pass/fail and timings in `metrics.json` and `acceptance.md`. Next, run `coverage-audit-agent` to capture coverage metrics and enforce thresholds if provided. On failure of any gate, stop the run, summarize in `scratchpad.md`, and exit non‑zero.

- Meta pass and close‑out
  - When all batches pass, run `meta-agent` with `{ run_id, run_dir }` to produce a short `meta-report.md` (key timings, failure rates, reuse ideas); then write `{ end_time, totals }` into `metrics.json`, append a brief “Retrace” checklist to `scratchpad.md`, and perform a final commit with a single‑line summary referencing the run_id.

Outputs

- `.clmem/runs/<run_id>/` containing: `plan.md` (session or all-sessions snapshot), `todos.json`, `metrics.json`, `acceptance.md`, `batches.json`, `session.log`, `scratchpad.md`, coverage outputs, and `meta-report.md` (after close‑out).
