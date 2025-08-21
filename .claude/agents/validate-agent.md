---
name: validate-agent
description: Run validations (lint → test → build), record timings and pass/fail, and update acceptance
tools: Bash, Read, Write, LS
---

# Validate Agent

Inputs

- run_id, run_dir, scratchpad_path, steps (ordered subset of: lint, test, build)

Protocol

- Run steps sequentially (e.g., `pnpm -r lint`, `pnpm -r test`, `pnpm -r build`), measure durations.
- Then run a hard browser gate: `BASE_URL=http://localhost:3000 pnpm smoke:brain`.
- Write `{run_dir}/results.json` with per-step { status, duration_ms, stderr_tail }.
- Update `{run_dir}/metrics.json` (step timings) and append a concise outcome to `scratchpad.md`.
- Update `{run_dir}/acceptance.md` with checklist and final pass/fail; on any failure (including smoke), return non-zero to halt orchestration. Include stderr tails (last 50 lines) for failed steps.

Outputs

- `{run_dir}/results.json`, `{run_dir}/metrics.json` (updated), `{run_dir}/acceptance.md`, `{run_dir}/scratchpad.md` (appended)
