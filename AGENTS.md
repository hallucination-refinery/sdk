# Codex Agent Guide for this Repository

This document defines how agents should work in this repo: what to run, what to avoid, and how to propose changes safely. Keep runs fast and deterministic.

## Golden rules

- Use the minimal baseline checks before opening a PR: install → typecheck (thin slice) → lint (warn-only) → build (app) → smoke.
- Do not run the docs workflow in CI or try to build the entire workspace unless explicitly asked.

## Baseline commands

Run from repo root:

```bash
# 1) Install (deterministic)
pnpm install --frozen-lockfile

# 2) Typecheck (thin slice; prefer schema, fallback to app-only)
pnpm --filter @refinery/schema exec tsc -p tsconfig.json --noEmit \
  || pnpm --filter cryptiq-mindmap-demo exec tsc -p apps/cryptiq-mindmap-demo/tsconfig.typecheck.json --noEmit

# 3) Lint (app), warn-only OK
pnpm --filter cryptiq-mindmap-demo run lint || true

# 4) Build (app)
pnpm --filter cryptiq-mindmap-demo run build

# 5) Smoke (plumbing only)
pnpm run smoke
```

Record the stdout/stderr from each step so the final PR body can cite the exact command outputs.

## Branch and PR etiquette

- Branch name: `ci/<task>` or `feat/<task>` or `chore/<task>`.
- Commit style: concise, present tense, scoped (e.g., `ci(docs): disable docs workflow`).
- Open a PR with a short verification section listing the outputs of the baseline commands.

## Environment variables

The app tolerates missing env via defaults, but set these when needed:

```ini
NODE_ENV=development
NEXT_PUBLIC_GRAPH_SPAWN=sphere
NEXT_PUBLIC_DEBUG_GRAPH=false
NEXT_PUBLIC_PIXELATE=0
NEXT_PUBLIC_SCREENSHOT_MODE=0
NEXT_PUBLIC_ENABLE_CONTROLS=0
```

- Debug override: set `NEXT_PUBLIC_DREAMDUST_DEBUG=1` to enable the Dreamdust velocity-displacement fallback used during instrumentation verification (requires Node ≥18.18/20).

## What not to do

- Don’t run ML/inference or download large models in CI.
- Don’t modify branch protection or Git history.
- Don’t enable heavy end‑to‑end browsers unless explicitly requested.

## Definition of done

- PR passes the minimal CI pipeline.
- Diff is limited to the requested scope; no incidental lockfile churn.
- A brief verification note is included in the PR body.
- When documentation or diagnostics are updated, paste verbatim evidence (console objects, telemetry tables, screenshot paths) so reviewers can trace every claim.

## Documentation workflow (Dreamdust initiative)

- Canonical files live under `docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/`:
  - Dated briefs (`2025-09-24-*.md`, `2025-09-25-*.md`, `2025-09-28-smoke-raw.md`, etc.).
  - Raw dumps (`*-smoke-raw.md`) — keep console objects fully expanded; never summarize without the raw block.
  - Pipeline notes (`2025-09-25-gpgpu-pipeline.md`) — append new findings; do not delete history.
  - Screenshots in `assets/` using the `YYYY-MM-DD-...png` naming convention.
- Preserve existing headings, dates, and chronology; add new sections instead of rewriting prior runs.
- Cite paths when referencing evidence (e.g., `assets/2025-09-28-probes-smoke.png`).

## Codex Cloud Policy (Generic)

- One‑PR‑per‑task: Each Codex task must produce exactly one PR; do not coordinate multiple PRs within a single task.
- Branch names: ; target base branch as specified in the task.
- Scope: Modify only files explicitly listed in the task prompt and those allowed by this policy; avoid lockfile churn and cross‑package edits unless the prompt explicitly requires them.
- Evidence: Every claim must cite exact file paths or paste verbatim logs/snippets. No speculative assertions.
- Required baseline (paste outputs in PR body):
  Internal Error: EACCES: permission denied, symlink '../lib/node_modules/corepack/dist/pnpm.js' -> '/usr/local/bin/pnpm'
  at async Object.symlink (node:internal/fs/promises:1004:10)
  at async EnableCommand.generatePosixLink (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:23156:5)
  at async Promise.all (index 0)
  at async EnableCommand.execute (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:23143:5)
  at async EnableCommand.validateAndExecute (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:20258:22)
  at async \_Cli.run (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:21195:18)
  at async Object.runMain (/usr/local/lib/node_modules/corepack/dist/lib/corepack.cjs:23642:19)
  Scope: all 19 workspace projects
  Lockfile is up to date, resolution step is skipped
  Already up to date

  ╭───────────────────────────────────────────────────────────────────╮
  │ │
  │ Update available! 9.15.1 → 10.17.0. │
  │ Changelog: https://github.com/pnpm/pnpm/releases/tag/v10.17.0 │
  │ Run "pnpm add -g pnpm" to update. │
  │ │
  ╰───────────────────────────────────────────────────────────────────╯

. prepare$ husky install
. prepare: husky - install command is DEPRECATED
. prepare: Done
Done in 4s

> cryptiq-mindmap-demo@0.1.0 lint /workspace/apps/cryptiq-mindmap-demo
> next lint

/workspace/apps/cryptiq-mindmap-demo:
 ERR_PNPM_RECURSIVE_RUN_FIRST_FAIL  cryptiq-mindmap-demo@0.1.0 lint: `next lint`
Exit status 1

> cryptiq-mindmap-demo@0.1.0 build /workspace/apps/cryptiq-mindmap-demo
> next build

▲ Next.js 15.3.5

- Environments: .env.local

Creating an optimized production build ...
✓ Compiled successfully in 17.0s
Skipping validation of types
Skipping linting
Collecting page data ...
Generating static pages (0/7) ...
Generating static pages (1/7)
Generating static pages (3/7)
Generating static pages (5/7)
✓ Generating static pages (7/7)
Finalizing page optimization ...
Collecting build traces ...

Route (app) Size First Load JS
┌ ○ / 3.71 kB 106 kB
├ ○ /\_not-found 143 B 102 kB
├ ƒ /api/brain-acceptance 143 B 102 kB
├ ƒ /api/og 143 B 102 kB
├ ○ /brain 27 kB 357 kB
├ ○ /debug/caps 5 kB 107 kB
├ ○ /draw3d 7.83 kB 335 kB
├ ƒ /quiz/[slug] 31.5 kB 362 kB
└ ƒ /result/[id] 2.04 kB 104 kB

- First Load JS shared by all 102 kB
  ├ chunks/226-98d803d27003ca72.js 46.6 kB
  ├ chunks/8d5daf79-879d5759a0deefd7.js 53.2 kB
  └ other shared chunks (total) 2.22 kB

○ (Static) prerendered as static content
ƒ (Dynamic) server-rendered on demand

> @refinery/monorepo@0.0.0 smoke /workspace
> node -e "console.log('smoke ok')"

smoke ok

- File discipline: Prefer one new/edited artifact per PR when possible; keep diffs minimal and reversible; templates are read‑only unless the prompt says otherwise.
