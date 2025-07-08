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

1. Always consult `.taskmaster/scratchpads/2025-07-08` when uncertain; update it with decisions, trade-offs, and Δ logs.
2. Working definition of **W**: "Cryptiq-Mindmap uses SDK, renders ≥1 k nodes @ 60 FPS, type-checks, tests pass, Vercel build green."
3. Principle: if evidence contradicts W at any checkpoint ➜ enlarge Δ, log in scratchpad, seek clarification, stay pragmatic.
4. Regularly run Taskmaster commands (`list`, `next`, `set-status`, etc.) to keep tasks in sync with reality.

## Sprint-1 · Task 1 — Core package extraction (Schema slice)

> **Why first?** Types are contract. Moving them early locks the interface for downstream slices and is low-risk to demo performance.

**Success condition**

1. New workspace package `packages/schema` contains all shared TS types (`Node`, `Edge`, Intents) validated by Zod.
2. All other packages and the demo import from `@refinery/schema` with no remaining legacy paths.
3. `pnpm -r run build`, `lint`, `type-check`, and unit tests are green; demo runs unchanged.
4. Commit history: one atomic commit per bullet below, messages include `(task schema-1)`.

**Execution checklist**

- [ ] `git checkout -b feat/schema-extract` _(task schema-1)_
- [ ] Scaffold `packages/schema` with `package.json`, `tsconfig.json`, `README.md`.
- [ ] Copy/rename legacy types; update names (`IdeaNode` → `Node`).
- [ ] Export barrel in `index.ts` with Zod schemas.
- [ ] Search & replace imports across repo (`rg "IdeaNode"` etc.).
- [ ] Run `pnpm -r run type-check`; fix errors.
- [ ] Add unit tests for schema parsing.
- [ ] Update docs & coverage badge.
- [ ] Push branch; open draft PR referencing Task ID.

**Evidence logging**
After each major command (build, test) capture the log excerpt and paste into `.taskmaster/scratchpads/2025-07-08.md` under a new _Evidence_ sub-heading.

**Guard-rails**

- Never edit demo logic in this slice.
- If FPS drops or build time rises, stop and diagnose before continuing.
- Append-only scratchpad; include Δ expansions if new risks surface.

Use the prompt template below when instructing Claude Code to run this slice.
