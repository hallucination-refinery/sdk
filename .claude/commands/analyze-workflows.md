---
name: analyze-workflows
description: Audit workflow docs and recent runs for browser-gated evidence, gating completeness, and trust
args:
  - --workflow-path <path> # optional; defaults to scanning docs/initiatives/**/workflow-*.md
  - --run-id <id> # optional; analyze a specific run under .clmem/runs/
  - --strict # optional; return non-zero on missing gates/artifacts
---

**ULTRATHINK MODE**

Behavior

- Parse workflow doc(s) to validate session structure and required gates.
  - Each session must declare: Goal • Edits/Targets • Commands • Gates • Artifacts • Commit
  - Section B must declare Playwright preflight and container-safe settings
  - Session 9 must include a visual parity gate using `toHaveScreenshot('brain-baseline.png')` with animations disabled and a diff tolerance (≤10%)
- Cross-check Claude scaffolding for gate wiring:
  - `/.claude/commands/orchestrate.md` requires `--workflow-path`
  - `/.claude/agents/plan-agent.md` fails fast on unreadable workflow and empty plan/batches
  - `/.claude/agents/validate-agent.md` runs lint → test → build → Playwright smoke and hard-halts on failure
  - `/.claude/commands/ensure-playwright.md` and `scripts/ensure-playwright.sh` exist
- If `--run-id` is provided, verify browser-derived artifacts under `.clmem/runs/<run_id>/artifacts/`:
  - Required: `server.log`, `curl-brain.html`, `smoke.png` (latest), `acceptance.json` (no simulated markers)
  - Optional on failure: `trace.zip`
  - Compute Trust Index from artifact presence, server log cleanliness, acceptance metrics, and screenshot existence
- Emit a human report and machine summary:
  - Markdown: `.clmem/workflows/analyze-[timestamp].md` (findings, gaps, recommendations)
  - JSON: `.clmem/workflows/analyze-[timestamp].json` (checks, trustIndex, failures)

Checks (non-exhaustive)

- Workflow sessions include all required subsections and non-empty Gates/Artifacts
- Visual parity gate present (and not marked optional) with ≤10% diff tolerance
- Playwright config container flags: `--no-sandbox`, `--disable-dev-shm-usage`, workers=1, artifacts dir stable
- Ensure-playwright hook referenced in pre-run docs
- Validate-agent includes Playwright smoke step; orchestrate enforces `--workflow-path`
- Run artifacts (if `--run-id`) exist and acceptance is browser-derived (no “Simulated” markers)

Failure conditions (for `--strict`)

- Missing required session subsections or Gates
- Absent visual parity assertion in Session 9
- Missing required artifacts or simulated acceptance
- Trust Index < 80

When to run

- After each `/orchestrate` run (post-run hook) and on demand during audits
- Before merges to ensure workflows are browser-gated and trustworthy

Output

- `.clmem/workflows/analyze-[timestamp].md` — Findings and prioritized recommendations
- `.clmem/workflows/analyze-[timestamp].json` — Machine-readable summary including trustIndex

Usage

```
/analyze-workflows --workflow-path docs/initiatives/cryptiq-mindmap-mvp/workflow-03.md --strict
```
