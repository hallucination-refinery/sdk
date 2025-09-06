# Codex Agent Guide for this Repository

This document defines how agents should work in this repo: what to run, what to avoid, and how to propose changes safely. Keep runs fast and deterministic.

## Golden rules
- Never push directly to `main`. Always open a PR from a short‑lived branch.
- Use the minimal baseline checks before opening a PR: install → typecheck (thin slice) → lint (warn-only) → build (app) → smoke.
- Do not run the docs workflow in CI or try to build the entire workspace unless explicitly asked.

## Baseline commands
Run from repo root:

```bash
# 1) Install (deterministic)
corepack enable
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

## What not to do
- Don’t run ML/inference or download large models in CI.
- Don’t modify branch protection or Git history.
- Don’t enable heavy end‑to‑end browsers unless explicitly requested.

## Definition of done
- PR passes the minimal CI pipeline.
- Diff is limited to the requested scope; no incidental lockfile churn.
- A brief verification note is included in the PR body.
