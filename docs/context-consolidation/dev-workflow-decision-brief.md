## Dev Workflow Decision Brief (80/20)

### Context (where we are)

- Monorepo is WIP with uneven tooling/CI, stray branches, and unclear docs/tests.
- Active work: `feat/vggt-ingest` (created from `cryptiq-mindmap-baseline`), ~477 commits ahead of `main`.
- Cryptiq Mindmap is a standalone app that consumes Refinery SDK; both evolve together.
- Priority: reduce friction and breakages while keeping you shipping quickly.

### Goal (what we need)

- Minimal baseline that increases reliability, repeatability, and signal on every PR, without slowing you down.
- Keep scope small: fast, reversible, and not coupled to ML/inference steps.

### Non‑Goals (not doing now)

- Heavy repo reorg (Nx/Turborepo), deep test suites, Storybook, or CI publish pipelines.
- Running ML/inference in CI.

---

## Options (summarized)

| Path                              | Scope                                                                                                                                                                          | Time                     | Risk   | Impact                           |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------ | -------------------------------- |
| A. Minimal Baseline (recommended) | GitHub Actions; lock Node 20 LTS + pnpm; CI runs install → typecheck (tsc) → lint (eslint) → build → 1 smoke test; env validation + .env.example; husky/lint-staged pre-commit | ~1–2 days                | Low    | High signal, low friction        |
| B. PR Train to Main               | Split `feat/vggt-ingest` into 5–10 focused PRs; protect `main` with checks                                                                                                     | ~2–4 days (plus reviews) | Medium | Safe merges, cleaner history     |
| C. Dual‑Track Release             | Stabilization branch from `feat/vggt-ingest` for near-term ship; start A on `main`                                                                                             | ~2–3 days now + later    | Medium | Fast release + gradual hardening |
| D. Heavy Restructure              | Monorepo framework, deep tests, broader tooling                                                                                                                                | 1–2 weeks                | High   | Long-term leverage; too slow now |

Recommendation: Start with Path A now; optionally follow with B when immediate pressure eases.

---

## Why Path A (short rationale)

- Highest ROI per day: catches type/lint/build regressions immediately, standardizes toolchain, adds a smoke check that the app boots.
- Low blast radius: purely additive; delete the workflow to roll back.
- Keeps CI time small (~3–7 minutes) and avoids ML in CI.

---

## Success criteria (clear, verifiable)

- CI passes typecheck, lint, build, and a single smoke test on every PR to `main` and `feat/vggt-ingest`.
- Node/pnpm versions locked; local “works on my machine” reduced.
- New contributors can clone, `pnpm i`, and build with the same results as CI.
- Average CI run ≤ 7 minutes; failures are actionable (message points to the fix).

---

## Implementation plan (Path A)

1. Toolchain lock
   - Add `.nvmrc` (Node 20 LTS) and enable `corepack` to pin pnpm (e.g., via `packageManager` in `package.json`).
   - Ensure `pnpm-lock.yaml` is committed.

2. CI workflow (GitHub Actions)
   - Create `.github/workflows/ci.yml` with Node 20, corepack, pnpm caching.
   - Jobs: `install`, `typecheck`, `lint`, `build`, `smoke` (can be one job with steps). Target only changed packages or the app+SDK to keep it fast.

3. Env safety
   - Add `.env.example` and a tiny Zod-based `env.ts` that validates required vars at startup (dev + CI). Fail fast with helpful messages.

4. Pre-commit guardrails
   - Add `husky` + `lint-staged` to run `eslint --fix` and `tsc -p` on changed files for quick feedback.

5. Minimal smoke test
   - Add a script that builds the app (no server) and asserts key outputs exist, or runs a tiny Node test that imports critical SDK entry points without runtime errors.

6. Docs & visibility
   - Add a short README section: how CI works, how to run the same checks locally.

Rollback: Remove `.github/workflows/ci.yml` to disable; optional removal of husky/lint-staged.

---

## Example CI workflow (skeleton)

```yaml
name: CI
on:
  pull_request:
    branches: [main, feat/vggt-ingest]
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node (20 LTS) with corepack
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: corepack enable
      - run: pnpm --version
      - run: pnpm install --frozen-lockfile
      - name: Typecheck
        run: pnpm -w run typecheck || pnpm -w exec tsc -p tsconfig.json --noEmit
      - name: Lint
        run: pnpm -w run lint || pnpm -w exec eslint .
      - name: Build (key packages)
        run: pnpm -w run build
      - name: Smoke (app builds)
        run: pnpm --filter apps/cryptiq-mindmap-demo run build || pnpm --filter cryptiq-mindmap-demo run build
```

Note: If a single workspace script isn’t defined yet, the commands fall back to direct `tsc/eslint` or package-local builds.

---

## Assumptions & open questions

- CI provider: GitHub Actions available and allowed to run on PRs.
- No secrets required to install/build/test; if secrets are needed, we will stub/mask and optionally skip the smoke step.
- ML/inference steps remain local; CI only verifies builds and basic imports.
- Acceptable CI time budget: ≤ 7 minutes.

Open questions to refine next:

- Do we need to gate merges to `main` with “all checks must pass” now, or after a trial period?
- Which packages must always build in CI (app + SDK entry points)?
- Preferred Node version policy: exact 20.x vs “LTS” alias.
- Minimal smoke test definition you trust (e.g., “app builds + imports SDK without runtime errors”).

---

## Risks and mitigations

- CI noise or false positives: keep rules minimal; adjust eslint/tsconfig to reduce churn.
- Longer PR time: keep steps fast and cached; parallelize where useful.
- Hidden env coupling breaks CI: fail fast with clear env validation and `.env.example`.

---

## Quick decision (1 minute)

- Adopt Path A now (low risk, high signal). Use GitHub Actions + Node 20 LTS + pnpm cache.
- Run: install → typecheck → lint → build → single smoke test on PRs to `main` and `feat/vggt-ingest`.
- No ML in CI; no publish changes.
- Reassess in a week; if stable, begin Path B (PR train) to merge `feat/vggt-ingest` into `main` in slices.
