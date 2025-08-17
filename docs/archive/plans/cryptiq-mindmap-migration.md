# Cryptiq Mindmap Migration Plan (Assembly Line)

## Overview

Three dedicated worktree branches run in a linear assembly line:

| Phase              | Branch / Worktree | Goal                                                          | Success Checkpoint                       |
| ------------------ | ----------------- | ------------------------------------------------------------- | ---------------------------------------- |
| 1. Build & Config  | `cv-build`        | Monorepo builds clean; Tailwind + Webpack merged; data copied | `pnpm build` 0 errors; `/api/health` 200 |
| 2. SDK Integration | `cv-integrate`    | IdeaCanvas renders 71-node graph via `/api/mindmap`           | Browser FPS ≥60 for 10 s                 |
| 3. Optimise & Test | `cv-optimize`     | 1 k nodes @ 60 FPS, HUD ported, vitest ≥80 %                  | CI green + Vercel preview                |

## Step-by-Step

### 1 Bootstrap cv-build

1. `git worktree add ../cv-build -b cv-build` ↔ origin/feat/cryptic-vault-extraction
2. Merge Tailwind configs; resolve `three` module path in webpack.
3. Copy `concepts_enriched.json`, `graph_bundle.json` into `apps/cryptiq-mindmap/data/`.
4. Add `/api/health` route returning `{ ok: true }`.
5. Run `pnpm build`; commit `fix(build): converge configs (task 14)`.

### 2 Bootstrap cv-integrate

1. `git worktree add ../cv-integrate -b cv-integrate feat/cryptic-vault-extraction`
2. Implement `/api/mindmap/nodes` route (static JSON).
3. Replace page with `<IdeaCanvas>` + `GraphForgeLoader`.
4. Smoke-test FPS; commit `feat(app): initial SDK integration (task 15)`.

### 3 Bootstrap cv-optimize

1. `git worktree add ../cv-optimize -b cv-optimize feat/cryptic-vault-extraction`
2. Generate 1 k-node dataset via graph-forge CLI.
3. Port CategoryHUD / TimeSlider; wire intent bus.
4. Add vitest + coverage gate; configure GitHub Action.
5. Push preview; commit `feat(app): optimise & tests (task 16)`.

## Checkpoints & Δ Handling

At each branch merge:

- Re-run smoke screen tests.
- If any checkpoint fails, log Δ-ID in scratchpad, enlarge scope, and clarify before proceeding.

## Timeline Estimate

- Phase 1: 1 h
- Phase 2: 1.5 h
- Phase 3: 3 h (incl. perf tuning)

Total: ~6 h focused work.
