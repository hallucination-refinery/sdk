## Dev Workflow Plan & Verification Checklist (for a fresh LLM Agent)

Audience: An engineer/LLM with zero prior context. Follow steps in order. Prefer read-only checks first; do not push until verification passes.

### 0) Quick facts you must know

- Repo: pnpm monorepo (workspaces in `pnpm-workspace.yaml`).
- App under test: `apps/cryptiq-mindmap-demo` (Next.js). It consumes `@refinery/*` SDK packages via workspaces.
- Current working branch (expected): `feat/vggt-ingest`. Trunk is `main` (may be stale).

### 1) Environment and tooling

1. Ensure Node 20 LTS is installed.
   - Check: `node -v` should be `v20.x`.
   - If not, use `nvm install 20` then `nvm use 20` (or install Node 20 by your method).
2. Enable corepack and confirm pnpm.
   - Run: `corepack enable && pnpm -v` (expect pnpm ≥ 9).
3. Verify repository toolchain pins.
   - Open `package.json` at repo root: confirm `"packageManager": "pnpm@..."` and `engines.node` is `>=20`.
   - If `.nvmrc` is missing, plan to add one containing `20` (do not add yet; note it in the report).

Verification: Record Node and pnpm versions in your log. Do not proceed if Node < 20.

### 2) Git hygiene and branch

1. Fetch and display branches and divergence.
   - `git fetch --all --prune`
   - `git branch --show-current`
   - `git rev-list --left-right --count origin/main...HEAD` (and `origin/feat/vggt-ingest...HEAD` if needed)
2. Ensure you are on `feat/vggt-ingest` unless instructed otherwise: `git checkout feat/vggt-ingest`.
3. Do not rebase or merge yet. This checklist is non-disruptive.

Verification: Paste output of divergence counts into your report.

### 3) Install and workspace sanity

1. Clean any prior installs (optional): `pnpm store prune` (safe) and delete local `node_modules` if inconsistent.
2. Install dependencies with lockfile: `pnpm install --frozen-lockfile`.
3. Validate workspaces: `pnpm -w list --depth -1` (ensure `apps/` and `packages/` are visible).

Verification: Install must finish without errors. If it fails, capture the exact error and stop.

### 4) Typecheck, lint, and build

1. Typecheck (choose the fastest that exists):
   - Preferred: `pnpm -w run typecheck` (if defined), else `pnpm -w exec tsc -b --noEmit` or `pnpm -w exec tsc -p tsconfig.json --noEmit`.
2. Lint:
   - Preferred: `pnpm -w run lint`, else `pnpm -w exec eslint .`.
3. Build monorepo targets:
   - Preferred: `pnpm -w run build`.
   - Then specifically build the app: `pnpm --filter apps/cryptiq-mindmap-demo run build` or `pnpm --filter cryptiq-mindmap-demo run build`.

Verification: All steps exit 0. If not, capture errors and stop.

### 5) Smoke test (minimal)

Option A: Headless Playwright smoke (if configured to run without secrets)

1. Command: `pnpm playwright test --project=chromium --reporter=list` (set `CI=1` if needed).

Option B: Simple import/build smoke

1. Build the app (already done in step 4).
2. Validate that critical SDK entry points import without runtime errors:
   - Node one-liner: `node -e "require('@refinery/sdk-core'); console.log('sdk-core ok')"` (and other key packages as needed).

Verification: Smoke must pass. If Playwright requires a dev server or secrets, skip and record why.

### 6) Local dev run (manual sanity)

1. Start dev server for the app: `pnpm -C apps/cryptiq-mindmap-demo dev -p 3000`.
2. Open `http://localhost:3000/quiz/archetype-v1?pc=scene-02&debug=1` (or the current test route).
3. Confirm the canvas renders and controls respond. Note any console errors.

Verification: Attach a short note (1–2 lines) on visibility and responsiveness.

### 7) Env configuration safety

1. Look for `.env.example` at repo root. If absent, draft one listing known vars used by the app (NEXT*PUBLIC*\*).
2. Search for a central env validator (e.g., `env.ts` using Zod). If absent, plan a minimal one for the app.

Verification: List any missing pieces (.env.example, env validator). Do not add yet unless asked.

### 8) CI readiness check (pre-implementation)

1. Confirm CI is absent: check `.github/workflows/*.yml|yaml`.
2. If absent, prepare a short CI plan: Node 20, corepack, pnpm cache; run install → typecheck → lint → build → smoke.
3. Ensure ML/inference steps are excluded from CI (note why).

Verification: Produce a proposed `ci.yml` in your report (do not commit unless instructed).

### 9) Ignore rules and large artifacts

1. Open `.gitignore` in repo root (and in `apps/cryptiq-mindmap-demo/` if present).
2. Ensure common ignores exist: `node_modules/`, `.next/`, `coverage/`, `dist/`, `.turbo/`, `playwright-report/`, `test-results/`, local env files (`.env*`), OS files.
3. Ensure heavy artifacts from tools are ignored: `tools/**/__pycache__/`, `**/*.pyc`, `**/*.pt`, `tools/_third_party/vggt/`, and prebaked binaries like `positions.f32`, `colors.u8`.

Verification: List gaps you find. Propose minimal additions. Do not commit unless asked.

### 10) Reporting

Provide a concise report including:

- Node/pnpm versions, current branch, divergence vs origin/main, and whether CI exists.
- Results of install, typecheck, lint, build, and smoke (pass/fail with errors if any).
- Missing safety items (.nvmrc, .env.example, env validator, .gitignore gaps).
- A short recommendation (Path A minimal CI) and exact commands/files you would add if approved.

### 11) Safety/rollback notes

- All proposed changes are additive. CI removal is a single file delete (`.github/workflows/ci.yml`).
- Do not rebase/force-push without instruction. Prefer PRs from feature branches.
