# Decision Log

## 2025-07-04 – Build & CI Architecture Overhaul

### 1. Single Source of Truth for Build

- **Decision**: Use TypeScript project references with `tsc -b tsconfig.build.json` to build/type-check the monorepo.
- **Context**: Mixed tools (`tsup`, per-package scripts, Turbo) created race conditions and TS6305 errors.
- **Consequences**: Deleted per-package build/type-check scripts and `tsup` configs; CI and local builds invoke only the root build.

---

### 2. Lock-file Discipline

- **Decision**: CI runs `pnpm install --frozen-lockfile`; lockfile must be updated with any dependency change.
- **Context**: Stale lockfile caused frozen-install failures.
- **Consequences**: Added rule to PR checklist; `.tsbuildinfo` files git-ignored to force clean rebuilds.

---

### 3. Workflow Separation

- **Decision**: Keep two workflows.
  - `ci.yml` → quality gate (install → type-check → lint → build → tests + coverage upload).
  - `docs.yml` → build + generate TypeDoc (no tests).
- **Context**: Duplicate testing in docs job slowed pipeline; Pages deploy not yet required.
- **Consequences**: Docs workflow slimmed; tests run only once per commit.

---

### 4. Coverage Policy

- **Decision**: Disable global coverage thresholds; retain 80 % thresholds for `schema` & `ops` only.
- **Context**: UI packages have low coverage; global 80 % gate blocked CI.
- **Consequences**: Coverage still reported; thresholds can be raised gradually as tests are added.

---

### 5. Documentation Publishing

- **Decision**: Defer GitHub Pages deployment until activated in repo settings.
- **Context**: Pages API calls failed when Pages disabled.
- **Consequences**: Removed configure-pages/deploy steps; docs artefact uploaded for manual download.

---

### 6. TypeDoc Configuration for Monorepo

- **Decision**: Use `--entryPointStrategy Packages --entryPoints packages/* --skipErrorChecking`.
- **Context**: Older TypeDoc (0.25.x) didn't support `--disableOutputCheck`; monorepo needed package entry points.
- **Consequences**: Docs generation succeeds in CI without interactive behaviour.

---

### 7. Lint Policy

- **Decision**: ESLint errors fail CI; warnings (e.g. `no-explicit-any`) do not.
- **Context**: Large number of `any` warnings in UI packages; blocking on them would hinder velocity.
- **Consequences**: Warnings tracked; teams will gradually address them.
