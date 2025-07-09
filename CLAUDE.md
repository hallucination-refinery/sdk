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
- [ ] Migrate types from legacy code; rename `IdeaNode` → `Node`
- [ ] Add Zod schemas + validation helpers
- [ ] Replace imports across workspace (`rg` assist)
- [ ] Add vitest unit tests + coverage threshold config
- [ ] Update demo and CI filters; run `pnpm -r exec vitest run --coverage`
- [ ] Open draft PR `(task schema-1)`

**Evidence logging**

Update `.taskmaster/scratchpads/2025-07-08.md` after every significant action:

- commands and their output (lint / test / build)
- coverage reports
- git diff snapshots
- screenshots or perf numbers (if relevant)

**Guard-rails**

- No breaking API changes to downstream packages
- Avoid circular dependencies (`workspace:*` banned in published pkgs)
- Keep `@refinery/schema` runtime-light (<1 KiB gzipped)
- Commit messages follow Conventional Commits (`feat(schema): … (task schema-1)`)

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

## Sprint-1 · Task 4 — Canvas-R3F cleanup (canvas slice)

> **Why fourth?** After sdk-core extraction, the legacy `canvas-r3f` package must be slimmed to low-level R3F adapters so sdk-core’s public canvas remains small and tree-shakeable.

**Success condition**

1. `packages/canvas-r3f` exports only low-level R3F adapters and helpers; no business logic or provider code remains.
2. Bundle is tree-shakeable; running `size-limit` reports ≤ 25 KB gzipped for the package.
3. Unit-test suite hits ≥ 80 % coverage and passes CI.
4. Legacy demo still builds and runs at ≥ 60 FPS using sdk-core + slimmed canvas-r3f.
5. No circular deps; peer deps list is correct (`react`, `react-three/fiber`, `three`).

**Execution checklist**

- [ ] `git checkout -b feat/canvas-r3f-cleanup` _(task canvas-4)_
- [ ] Remove HUD, provider, business logic now in sdk-core
- [ ] Ensure only adapter utilities/components remain
- [ ] Update `peerDependencies` and `exports` map
- [ ] Add/adjust unit tests & coverage threshold
- [ ] Run `pnpm size-limit` and record output
- [ ] Run full workspace CI (`pnpm -r run lint type-check test build`)
- [ ] Open draft PR `(task canvas-4)`

**Evidence logging**

Append build logs, size-limit output, coverage reports, and demo FPS screenshots to `.taskmaster/scratchpads/2025-07-08.md` under _Evidence_.

**Guard-rails**

- Do **NOT** break sdk-core public API
- Tree-shakeable build is mandatory (no side-effectful barrel)
- Keep bundle ≤ 25 KB gzipped
- Commit messages follow Conventional Commits (`refactor(canvas): slim to adapters (task canvas-4)`)
