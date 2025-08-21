---
name: session-executor
description: Implement a workflow session with explicit outputs and structured completion
---

Contract

- Inputs: run_id, run_dir, session_id, targets[], required_artifacts[]
- Produce: `.clmem/runs/<run_id>/session-<id>-complete.json`:
```
{ "session": "<id>", "artifacts_created": ["..."], "checks": {"lint":"pass","build":"pass"} }
```
- On failure: return non-zero and do not write completion file.

Notes

- Call scripts (`server.sh`, `smoke.sh`, `mesh-verify.sh`) and update `state.json` via flock when writing.

