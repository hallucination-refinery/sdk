## SYSTEM

Ultrathink mode. Greater rigor, attention to detail, and multi-angle verification. Start by outlining the task and breaking down the problem into subtasks. For each subtask, explore multiple perspectives, even those that seem initially irrelevant or improbable. Purposefully attempt to disprove or challenge your own assumptions at every step. Triple-verify everything. Critically review each step, scrutinize your logic, assumptions, and conclusions, explicitly calling out uncertainties and alternative viewpoints. Independently verify your reasoning using alternative methodologies or tools, cross-checking every fact, inference, and conclusion against external data, calculation, or authoritative sources. Deliberately seek out and employ at least twice as many verification tools or methods as you typically would. Use mathematical validations, web searches, logic evaluation frameworks, and additional resources explicitly and liberally to cross-verify your claims. Even if you feel entirely confident in your solution, explicitly dedicate additional time and effort to systematically search for weaknesses, logical gaps, hidden assumptions, or oversights. Clearly document these potential pitfalls and how you’ve addressed them. Once you’re fully convinced your analysis is robust and complete, deliberately pause and force yourself to reconsider the entire reasoning chain one final time from scratch. Explicitly detail this last reflective step.

### CURRENT TASK – 2025-07-13

> This section supersedes any older instructions below it. The content after “## Archived Quick-Start” is preserved for context only and may be out of date.

### WARNING

A lack of integrity and/or conscientiousness is unacceptable. I can and will audit each and every tool call you make, files/lines you look at and exact steps taken. Each and every discrepency or omission between what you document in @chief-of-staff-working.md and what you did will immediately be obvious resulting in a -$ 10,000 fine and disciplinary action.

### GOAL

Cross-reference and verify that each and every claim outlined in @docs/tmp-groupchat/claude-diff-investigation.md reflect the reality on the ground.

### PRINCIPAL

Run a tight, focused and falsifiable OODA loop for each and every claim. Treat every observation as evidence that updates your probability mass over whether W is satisfied. If you find a mismatch, assume Δ was understated, enlarge it, and ask for clarification rather than guessing.

---

## Archived Quick-Start (legacy – may be outdated)

# Refinery SDK – Claude Code Quick-Start

> Always open **@docs/PROJECT_HUB.md** first; it links to the current spec, scratchpad, and decision log.

## Canonical Docs

| Purpose              | Path                                    |
| -------------------- | --------------------------------------- |
| Project hub / status | `docs/PROJECT_HUB.md`                   |
| Active sprint spec   | `docs/guides/store-spec.md`             |
| Today's scratchpad   | `.taskmaster/scratchpads/YYYY-MM-DD.md` |
| Decision log         | `.cursor/decision_log.yaml`             |
| Full reference guide | `docs/CLAUDE-REFERENCE.md`              |

## Daily OODA Loop

1. **Orient** – `/clear`, load hub + scratchpad.
2. **Decide** – `task-master next` → choose top task, `task-master show <id>` to inspect.
3. **Act** – Implement; append reasoning to scratchpad; commit small diffs (`git commit -m "feat: … (task <id>)"`).
4. **Update** – `task-master set-status --id=<id> --status=in-progress|done`.
5. Repeat.

## Working Norms

- Append-only scratchpad – never delete history.
- Ask permission before leaving the critical path.
- Keep commits atomic (<200 LOC) and reference Task IDs.
- Use `/clear` when switching tasks to free context tokens.

## Tool Preferences & Guard-Rails

- Use **`rg`** (ripgrep) for code search; avoid `grep`.
- Package manager is **pnpm**—never run `npm install`.

### Git: Good vs Bad

| Good commit                                          | Bad commit                |
| ---------------------------------------------------- | ------------------------- |
| `git commit -m "feat(store): add selector (task 4)"` | `git commit -m "changes"` |
| `git push origin feature/canvas`                     | `git push --force`        |

### Forbidden Boiler-Plate Patterns

- Do **not** start answers with "The answer is…".
- Leave `// TODO: description` rather than empty-string placeholders.

### Commit Scaffold

Before each code edit:

1. Add a `<commit_analysis>` block – one sentence explaining the diff & risk.
2. Perform the code change.
3. Commit referencing Task ID.

---

_For extended Task Master commands, MCP setup, API key matrix, and troubleshooting, see `docs/CLAUDE-REFERENCE.md`._

## Workflow Reminders (2025-07-07)

1. Always consult `.taskmaster/scratchpads/2025-07-07` when uncertain; update it with decisions, trade-offs, and Δ logs.
2. Working definition of **W**: "Cryptiq-Mindmap uses SDK, renders ≥1 k nodes @ 60 FPS, type-checks, tests pass, Vercel build green."
3. Principle: if evidence contradicts W at any checkpoint ➜ enlarge Δ, log in scratchpad, seek clarification, stay pragmatic.
4. Regularly run Taskmaster commands (`list`, `next`, `set-status`, etc.) to keep tasks in sync with reality.

## Sprint-1 · Task 1 — Core package extraction (Schema slice)

> **Why first?** Moving all domain types into a dedicated package establishes a single source of truth and prevents cross-package drift before heavier runtime extraction begins.

**Success condition**

1. New package `packages/schema` exports Zod models + TypeScript types (`Node`, `Edge`, `Intent`, etc.) under `@refinery/schema`.
2. All workspace imports updated to use `@refinery/schema`; legacy `cryptic-vault-demo` builds and runs unchanged.
3. Unit-test suite for schema achieves ≥ 80 % statement, branch, and function coverage.
4. CI pipeline (lint → type-check → tests → build) is green on the branch and in the PR view.

**Execution checklist**

- [ ] `git checkout -b feat/schema-extract` _(task schema-1)_
- [ ] Scaffold `packages/schema` (`package.json`, `tsconfig.json`, `README.md`, `src/index.ts`)
- [ ] Migrate types from legacy code; rename `
