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

## Sprint-1 · Task 2 — Graph-Forge loader (graph-forge slice)

> **Why second?** The demo and future apps need a deterministic, headless layout generator before we extract the canvas.

**Success condition**

1. New package `packages/graph-forge` exports `forgeGraph(raw, opts)` + CLI `graph-forge` producing `{ nodes, edges, widgetSpec }`.
2. Benchmark: `pnpm --filter @refinery/graph-forge exec vitest bench` shows 2 k-node layout ≤ 300 ms on CI hardware.
3. Zod validation rejects invalid input and produces descriptive error.
4. Unit tests & bench reach ≥ 80 % coverage; package builds green.
5. Legacy demo temporarily _skips_ using loader (integration handled in later slice) to keep CI green.

**Execution checklist**

- [ ] `git checkout -b feat/graph-forge-loader` _(task forge-2)_
- [ ] Scaffold package with `package.json`, `tsconfig.json`, README.
- [ ] Implement Zod schemas for RawMemory input.
- [ ] Implement `forgeGraph` with seeded RNG + force-simulation.
- [ ] Add Vitest unit tests + benchmark.
- [ ] Add CLI wrapper (`bin` entry) + docs.
- [ ] Wire build & test scripts; ensure coverage passes.
- [ ] Push branch; open draft PR `(task forge-2)`.

**Evidence logging**
Append bench runs, test output, and coverage summary to `.taskmaster/scratchpads/2025-07-08.md` under _Evidence_.

**Guard-rails**

- Keep all heavy dependencies optional/peer.
- No changes to demo imports in this slice.
- If benchmark fails the 300 ms budget, stop and optimise before pushing.
