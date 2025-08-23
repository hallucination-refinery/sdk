---
name: iterate-visual
description: Iteratively achieve aesthetic similarity with reference image through staged refinements
args:
  - target # e.g., brain, mindmap
  - --reference <path> # path to reference image for inspiration
  - --mode <converge|maintain> # converge toward goals or maintain baseline, default converge
  - --max-iterations <n> # default 10 per stage
  - --baseline <path> # existing baseline to maintain (for maintain mode)
---

Behavior

- Bootstrap: Create run_id and `.clmem/visual-parity/<run_id>/`; seed `metrics.json`.
- Converge: execute staged improvements; maintain: single capture & compare.
- Validation: call `scripts/analyze-visual-parity.mjs` and render a summary report.

Outputs

- `.clmem/visual-parity/<run_id>/` with iterations, `metrics.json`, `aesthetic-report.md`.


