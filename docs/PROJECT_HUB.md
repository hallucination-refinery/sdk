# Refinery SDK – Project Hub

_Last updated: 2025-07-04_

## 1 · What is this?

Refinery SDK is a modular, six-layer toolkit that brings a spatial, multimodal **idea-graph workspace** to any React app. Sprint-1 goal: ship the foundational **Store** package and prove a 1 k-node graph demo at ≥60 FPS, with schema & ops already green.

## 2 · Getting Started (2 min)

1. `git clone https://github.com/hallucination-refinery/sdk && cd sdk`
2. `pnpm install`
3. `pnpm -r run build && pnpm -r exec vitest run` – should pass.

## 3 · Live Roadmap

The backlog lives in **Taskmaster**. View with:

```bash
task-master list     # dashboard
```

Primary milestone tags: `mvp`, `tech-debt`, `v1.0`.

| 📚 Canonical Docs | Path                                                                                    | Note                 |
| ----------------- | --------------------------------------------------------------------------------------- | -------------------- |
| Backlog / roadmap | @.taskmaster/tasks/tasks.json                                                           | source-of-truth      |
| Active spec       | @docs/guides/store-spec.md                                                              | changes each sprint  |
| Daily scratchpad  | @.taskmaster/scratchpads/2025-07-04.md                                                  | rolling notes        |
| Decision log      | @.cursor/decision_log.yaml                                                              | irreversible choices |
| CI status         | ![CI](https://github.com/hallucination-refinery/sdk/actions/workflows/ci.yml/badge.svg) | build + tests        |

## 4 · Working Norms

- Use **Taskmaster** commands (`list / next / update / set-status`) to track all work.
- Commit style: small, purposeful; reference task IDs in message.
- Scratchpad: append thoughts, never delete past entries.
- Decision log: add entry for every architectural or test-coverage deviation (see template in rules).
- Daily async stand-up: post blockers & progress before 09:00 local.

## 5 · Contact

- Principal: William Barron (@wbarron)
- Chief-of-Staff: AI agent (Planner/Architect/Evaluator/Orchestrator)

---

_If you are new, start by reading this file and the active spec, then run `task-master next`._
