# GOAL

Produce authoritative and comprehensive documentation about the current state of the codebase.

# CONTEXT

The repository (refinery-sdk) contains numerous stray branches from stalled development attempts. We're on the refactor/context-consolidation-aug17 branch (~219 commits ahead of main).

# PRINCIPLES

- Authoritative: Documentation derives from or is verified against code and CI, minimizing drift.
- Comprehensive: Covers architecture, public APIs, data models, configuration, operations, security, and contribution processes.
- Practical: Optimized for onboarding and day-to-day development; favors runnable examples and copy-pasteable snippets.
- Maintainable: Automated checks and PR gates ensure documentation stays up to date.

# SCOPE

Document the codebase as it exists on `refactor/context-consolidation-aug17`. Historical or future work is out of scope except where needed for context (ADRs). Focus areas:

- Repository structure and module boundaries
- Architecture (runtime, build, deployment if applicable)
- Public API surface and extension points
- Data models and persistence layer
- Configuration, environment variables, and feature flags
- Error handling, logging, and observability
- Security, privacy, and compliance considerations
- Build, test, release, and branching workflows
- Contribution, coding standards, and ownership

# SUCCESS CRITERIA (ACCEPTANCE)

- A browsable documentation site is built from `docs/` with a clear navigation and search.
- Each top-level package/module has a README that explains purpose, boundaries, public API, and ownership.
- Public APIs have generated reference docs linked to source (or verified against code) with usage examples.
- A system overview document and diagrams describe components, data flows, and key decisions.
- Configuration and operational runbooks exist for local development, CI, and release.
- Documentation quality gates are enforced in CI (builds cleanly, no broken links, style checks pass).
- Definition of Done updated so all future changes include doc updates.

# ROLES & OWNERSHIP

- Documentation Lead: owns structure, style guide, and overall quality.
- Package Owners (from CODEOWNERS): write and validate module-level docs and API references.
- Tech Lead(s): own architecture docs and ADRs.
- DevEx/CI Owner: sets up doc toolchain and CI gates.

# TOOLING (RECOMMENDED)

- Site generator: MkDocs with Material theme (`mkdocs-material`) for simplicity and broad language neutrality.
- Auto API docs:
  - Python: `mkdocstrings[python]` (pdoc or Sphinx acceptable alternative)
  - TypeScript/JavaScript: `typedoc` (integrate output into MkDocs via static import)
  - Go: `godoc`/`pkgsite` links; optionally mirror summaries into docs
  - Rust: `rustdoc` links; optionally `mdbook` if needed
- Diagrams: Mermaid (native in MkDocs Material) for architecture/sequence diagrams.
- Quality gates: `markdownlint-cli2`, `cspell`/`codespell`, `vale` (style), `lychee` (link checker).
- Repo analysis: `cloc`, `ripgrep` for inventories and string searches.

# REPO STRUCTURE (DOCS)

Create/normalize the following structure:

```
docs/
  index.md                      # Landing page with system overview
  architecture/
    overview.md
    runtime-architecture.md
    data-flow.md
    deployment.md               # If applicable
    diagrams/                   # Mermaid .md or .mmd files
  reference/
    api/                        # Generated API docs (per language)
    data-models.md
    configuration.md
    errors-and-logging.md
  how-to/
    local-development.md
    running-tests.md
    releasing.md
    common-tasks.md
  concepts/
    glossary.md
    domain-concepts.md
  adr/
    ADR-0001-template.md
  contributing/
    guidelines.md
    code-style.md
    ownership.md
  playbooks/
    oncall-runbook.md
  templates/
    README-PACKAGE-TEMPLATE.md
    HOW-TO-TEMPLATE.md
    ADR-TEMPLATE.md
mkdocs.yml
```

# STEP-BY-STEP PLAN

## Phase 0 — Foundation (Day 0–1)

1. Decide the documentation site generator and plugins (MkDocs + Material + mkdocstrings recommended).
2. Initialize `mkdocs.yml` with navigation reflecting the structure above; enable search and Mermaid.
3. Add quality tools and pre-commit hooks:
   - `markdownlint-cli2`, `cspell` (or `codespell`), `vale`, and `lychee`.
   - Configure CI to run: `mkdocs build --strict`, link check, linting, and spelling.
4. Create `docs/templates/` with templates listed in Repo Structure.
5. Add a PR checklist that includes “documents affected components” and “docs site builds cleanly”.

Deliverables:

- `mkdocs.yml`, `docs/` skeleton, CI job(s), PR template updates, style guide draft.
  Acceptance:
- CI passes on an empty/skeleton site; local `mkdocs serve` works.

## Phase 1 — Codebase Inventory and Map (Day 1–2)

1. Produce an inventory of languages, packages/modules, binaries, and entry points.
   - Use `cloc` for languages; use `ripgrep` to find `package.json`, `setup.py`/`pyproject.toml`, `go.mod`, `Cargo.toml`, etc.
2. Identify public API surface for each module (exports, public classes/functions/types).
3. Generate a repository map:
   - A top-level `docs/index.md` with a high-level description and links to modules.
   - A table mapping modules → purpose → owners → status.
4. Create or update `CODEOWNERS` mapping to module directories.

Deliverables:

- Inventory report (checked into `docs/reference/inventory.md`).
- Ownership page in `docs/contributing/ownership.md`.
  Acceptance:
- Every top-level module is accounted for with purpose and owner(s).

## Phase 2 — Architecture Documentation (Day 2–4)

1. Draft `docs/architecture/overview.md` describing system goals, key components, and interactions.
2. Author diagrams:
   - Context diagram (system boundaries and external dependencies)
   - Container/component diagram (major modules and communications)
   - Sequence diagrams for critical flows (e.g., request lifecycle)
3. Document runtime concerns: configuration, error handling, logging, metrics/tracing.
4. Document build/test/release architecture at a high level.
5. Create initial ADRs for major decisions that define current state (even if retroactive).

Deliverables:

- Overview + 2–4 diagrams + runtime/deployment pages.
  Acceptance:
- A new engineer can explain how the system works at a whiteboard using these docs.

## Phase 3 — Public API Reference (Day 3–6 in parallel with Phase 2)

1. For each language:
   - Python: add or improve docstrings; wire `mkdocstrings[python]` into `mkdocs.yml` to auto-generate.
   - TypeScript/JavaScript: configure `typedoc` to emit JSON/HTML; link or import into MkDocs `reference/api/ts/`.
   - Go: link to `pkg.go.dev` for modules; optionally generate summaries in `reference/api/go/`.
   - Rust: link to `docs.rs`; optionally summarize in `reference/api/rust/`.
2. Establish docstring standards (parameter/return types, examples, errors, thread safety, performance notes).
3. Mark internal/experimental APIs clearly; document stability and versioning.
4. Add usage examples for top 20% most-used APIs.

Deliverables:

- `docs/reference/api/*` populated per language with navigation.
  Acceptance:
- For every exported API, users can find signature, description, and a minimal example.

## Phase 4 — How-To Guides and Examples (Day 5–7)

1. Identify top developer tasks (create client, configure auth, run job, extend plugin, etc.).
2. Write task-oriented how-to guides using the template. Each guide includes prerequisites, steps, and verification.
3. Add runnable examples and test them in CI (smoke tests or doctests where possible).
4. Create a Quickstart on `docs/index.md` linking to the most common tasks.

Deliverables:

- `docs/how-to/*` with 6–10 task guides and example code.
  Acceptance:
- Following the guides, a new developer can perform common tasks end-to-end locally.

## Phase 5 — Concepts, Data Models, and Configuration (Day 6–8)

1. Write conceptual docs explaining domain concepts and mental models.
2. Create `docs/reference/data-models.md` including schemas, invariants, and lifecycle.
3. Create `docs/reference/configuration.md` listing env vars, config files, and precedence rules.
4. Document error taxonomy and logging conventions in `errors-and-logging.md`.

Deliverables:

- Concept pages + data models + configuration + error/logging reference.
  Acceptance:
- Concepts clarify the “why”, and reference pages provide authoritative details.

## Phase 6 — Operations, Contribution, and Governance (Day 8–9)

1. Document local development environment setup and common troubleshooting.
2. Document CI workflows, release process, versioning policy, and branch strategy.
3. Create `contributing/guidelines.md` (PR process, code review, testing bar).
4. Add `ownership.md` and escalation paths; link to on-call or maintainer rotation.
5. Add security considerations (secrets handling, dependency policies, third-party usage).

Deliverables:

- Contributing guide, ownership, release, and security pages.
  Acceptance:
- Contributors can reliably set up, test, and release following documented processes.

## Phase 7 — Quality Gates and Maintenance (Day 9–10)

1. Enforce doc build in CI with `--strict` and fail on warnings.
2. Add link-check and spell/style checks to CI and pre-commit.
3. Update PR template and Definition of Done to require docs for user-visible or API changes.
4. Create a Documentation Debt Register in the repo (issues labeled `docs-debt`).
5. Schedule monthly documentation reviews; assign owners to sections.

Deliverables:

- CI gates, PR process updates, docs maintenance calendar.
  Acceptance:
- Merges that break docs or add undocumented APIs are blocked by CI or review.

# RISK LOG & MITIGATIONS

- Risk: Language heterogeneity complicates automated API docs.
  - Mitigation: Use language-specific generators and link into MkDocs; prioritize highest-impact languages.
- Risk: Drift between code and docs.
  - Mitigation: CI gates + PR checklist + owners + periodic audits.
- Risk: Time constraints.
  - Mitigation: Parallelize by module; use templates; focus first on public surface area.

# TEMPLATES (INLINE)

## Package README template (`docs/templates/README-PACKAGE-TEMPLATE.md`)

```
# <Package/Module Name>

Purpose
— What it does, responsibilities, and boundaries.

Public API
— Key entry points with links to reference docs.

Usage
— Minimal example; prerequisites.

Ownership
— Team and contact; links to CODEOWNERS.

Status
— Stability level, deprecation policy.
```

## How-To template (`docs/templates/HOW-TO-TEMPLATE.md`)

```
# How to <task>

Prerequisites
— Required tools, permissions, environment.

Steps
1. ...
2. ...
3. Verify ...

Troubleshooting
— Common errors and fixes.
```

## ADR template (`docs/templates/ADR-TEMPLATE.md`)

```
# ADR-<number>: <Title>

Date: <YYYY-MM-DD>
Status: Proposed | Accepted | Rejected | Superseded by ADR-XXX

Context
— The situation and forces at play.

Decision
— What we decided and why.

Consequences
— Positive, negative, and neutral results.
```

# EXECUTION CHECKLIST (AT-A-GLANCE)

- [ ] MkDocs + Material initialized; `mkdocs build --strict` passes
- [ ] Linting, spell-check, link-check wired in CI and pre-commit
- [ ] `docs/index.md` with system overview and Quickstart
- [ ] Architecture overview + diagrams
- [ ] Module inventory + ownership mapped
- [ ] Generated API docs per language and linked in nav
- [ ] How-to guides for top workflows with runnable examples
- [ ] Concepts, data models, configuration, logging/errors documented
- [ ] Contribution, release, and governance docs
- [ ] Definition of Done and PR template require docs

# MAINTENANCE PLAN

- Quarterly docs audit across owners; track deltas, remove stale content.
- CI prevents broken docs; renovate-style bot updates dependencies of docs toolchain.
- New features require:
  - Updated API docs or references
  - At least one how-to or example if user-facing
  - ADR for significant architectural decisions
