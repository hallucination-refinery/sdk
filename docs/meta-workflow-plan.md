### How this updates my understanding (step-by-step)

1. Claude Code ≠ an LLM API. You can’t set `dspy.Claude()` as a backend; DSPy needs a real LLM API or a local server.
2. “No external APIs” is a hard constraint. Therefore, DSPy’s optimizer loop is not viable here. We need a DSPy-inspired, pure-Python learning loop (rule-based predictions + measured iteration).
3. The container’s network/pip friction is irrelevant to the core plan because the learning loop must not depend on external installs.
4. The limiting step shifts: from “LLM accuracy” to “designing, measuring, and improving simple, local predictors” (learning via data we log ourselves).
5. `.clmem/` is our durable store. JSON/JSONL files are the contract; we’ll validate and evolve schemas.
6. Goodhart’s risks apply. We’ll use multiple metrics, avoid optimizing to extremes, and log a compact uncertainty register.
7. The near-term goal: a working, measurable, local-only git archaeology loop that improves across iterations without any API calls.

### Agent to-dos (Cursor Planning)

- Immediate setup (0–30 min)
  - [ ] Verify git access works locally (no deps)
    - [ ] Script: run `git log --oneline -5` and write to `.clmem/git-archaeology/artifacts/last_log.txt`
  - [ ] Establish minimal state files
    - [ ] `.clmem/git-archaeology/{predictions,observations}` directories if missing
    - [ ] `.clmem/learning.jsonl` (append-only) and `.clmem/state.json` with `{ iteration, last_run }`
  - [ ] Define simple JSON contracts
    - [ ] Prediction record: `{ branch, value, confidence, method, ts }`
    - [ ] Observation record: `{ branch, observed_value, ts }`
    - [ ] Learning record: `{ prediction, observation, error, ts }`
  - [ ] Add tiny helper for atomic writes (write tmp + rename)

- Version 0 loop (Hour 0–2)
  - [ ] Implement V0 `make_prediction(branch)` returning a numeric guess (e.g., “commit count 50–100” as a mid-point number) with confidence=0.5
  - [ ] Implement `observe_reality(branch)` using only `git rev-list --count`
  - [ ] Implement `learn(pred, obs)`:
    - [ ] Compute absolute error, append record to `.clmem/learning.jsonl`
    - [ ] Increment `iteration` and checkpoint `state.json`
  - [ ] CLI runner: `python tools/meta-workflow/src/run_local_loop.py --branches main` to run one iteration, print error

- Version 1 learning (Hour 2–6)
  - [ ] `make_better_prediction(branch)` uses prior errors:
    - [ ] Load past errors per-branch, adjust next numeric guess toward observed mean error
    - [ ] Increase confidence slowly with more data (cap at 0.9)
  - [ ] Add basic metrics:
    - [ ] Absolute error, MAE across branches
    - [ ] Brier-like score for numeric buckets (simple calibrated score)
  - [ ] Write `.clmem/git-archaeology/reports/iter_<N>.md` with:
    - [ ] Per-branch predictions vs observations
    - [ ] Delta vs previous iteration
    - [ ] Current best method and rationale

- Multi-strategy A/B (Hour 6–12)
  - [ ] Add Strategy classes (commit-velocity heuristic, file-change heuristic, sentiment keyword heuristic)
  - [ ] Run all strategies per branch; compute metric(s)
  - [ ] Select and persist best-performing strategy per branch
  - [ ] Log a compact uncertainty register in `.clmem/state.json` (e.g., chosen strategy reasons, open questions)

- Hardening (Hour 12–18)
  - [ ] Schema validation step (pure-Python) before writes
  - [ ] Dedup checks on learning log (guard against double-writes)
  - [ ] Introduce Goodhart mitigations:
    - [ ] Track at least 2 metrics and report both
    - [ ] Avoid extreme optimization (clip step sizes)
    - [ ] Rotate or combine proxies if one saturates

- Automation (Hour 18–24)
  - [ ] `MetaWorkflow` class: run N iterations until target accuracy or max iterations
  - [ ] Persist “best model” (best strategy per branch + adjustments) in `.clmem/git-archaeology/mental_model.json`
  - [ ] Final report with:
    - [ ] Iteration curve (MAE per iteration)
    - [ ] Strategy mix over time
    - [ ] Improvements summary and next hypotheses

- Documentation and ops
  - [ ] `README` in `tools/meta-workflow/` describing how to run locally with no dependencies
  - [ ] Document “No external APIs” constraint in code comments and the brief
  - [ ] Add a “Container networking” note with actionable commands to verify HTTPS and next steps (to revisit later)

- De-scope DSPy (for now)
  - [ ] Remove DSPy calls from tests and code paths
  - [ ] Keep a small note where DSPy would slot back in if API access becomes available (external or local LLM)

- Success checks (each iteration)
  - [ ] Files created under `.clmem/` without errors
  - [ ] Predictions/observations appended with timestamps
  - [ ] Report shows equal-or-better metric vs previous (or explains regressions)

- Optional next (when networking/API available)
  - [ ] Add a mock LM “backend” for offline testing (deterministic template fills)
  - [ ] Later: enable DSPy with a real LLM endpoint; compare accuracy gains vs local-only loop

- Known constraints to revisit
  - [ ] Container HTTPS egress (timeouts observed)
  - [ ] No pip/venv via sudo; avoid new dependencies in core loop

Summary

- Pivoted away from DSPy-as-LLM and external APIs to a pure-Python, file-backed learning loop.
- Centered the plan on local git data, measurable iteration, and JSON state under `.clmem/`.
- To-dos now drive a working, improving system within current constraints, with clear hooks to reintroduce DSPy later if API access becomes available.
