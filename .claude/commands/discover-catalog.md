# Discover Catalog

Plan and execute a structured, read-only discovery to build a reusable data catalog for documentation generation.

## Allowed tools (must match settings)

- `Bash(ls:*)`, `Bash(find:*)`, `Bash(rg:*)`, `Bash(grep:*)`, `Bash(cloc:*)`, `Bash(cat:*)`
- `Read`, `Edit` (for writing outputs only)

## Pre-flight

- Load discovery patterns: `.clmem/patterns/effective-discovery.json`.
- Apply exclusions: `always_exclude` + `context_specific` globs from the pattern file to all scans.
- Guardrails: non-interactive; append `| cat` when paging is possible; keep commands bounded with `head`.

## Scanning flow (read-only)

1. Packages and entry points (stable anchors)
   - Stable refs: run pattern `stable_file_refs` (find index.ts, configs, package.json).
   - Package count: run pattern `package_counting` and list `packages/` (if present).

2. Exported APIs (handle re-exports/defaults)
   - Primary: run pattern `package_exports`:
     - `rg "^export (const|class|function|interface|type)" --type ts --type js -g '!node_modules' -g '!dist' --no-heading | head -200`
   - Also scan for re-exports: `rg "^export \* from|^export \{.*\} from" --type ts --type js -g '!node_modules' -g '!dist' --no-heading | head -100`

3. Data models and schemas
   - Zod schemas: run pattern `zod_schemas` to extract field names; note nested/conditional cases as `needs_review`.

4. Enums (actual values)
   - Zod enums: run pattern `zod_enums` to capture enum member values (not comments).

5. Configuration
   - Stable config files from `stable_file_refs`; additionally, search env usage:
     - `rg "process\.env\.[A-Z0-9_]+" --type ts --type js -g '!node_modules' -g '!dist' --no-heading | head -200`

6. Errors and logging
   - Grep common patterns: `rg "(throw new|console\.error|logger\.|log\(|error\()" --type ts --type js -g '!node_modules' -g '!dist' --no-heading | head -200`

## Output shaping

- Write `.clmem/discovery/catalog.json` with schema (high-level):
  - `architecture`: packages, entryPoints (file, type)
  - `apis`: name, kind, signature (best-effort), file, anchor (symbol), confidence
  - `dataModels`: name, kind (schema/interface/type), properties (best-effort), file, confidence
  - `configuration`: name, kind (env/file/const), default (best-effort), file
  - `errors`: pattern, category, examples (file anchors), confidence
- Prefer stable anchors (file path + exported symbol) over brittle line numbers.
- Deduplicate entries; add `needs_review` where ambiguity exists.

## Validation (post-scan)

- Execute `validation_checks.post_discovery` from the pattern file where applicable:
  - Verify enum values by parsing actual `z.enum([...])` content.
  - Count claimed vs actual packages.
  - Verify schema field existence.
- Record pass/fail summary and any fixes applied from `learned_fixes`.

## Summary & logging

- Write `.clmem/discovery/summary.md` (≤ 1 screen): counts by section, notable findings, and next recommended step.
- Append `.clmem/workflows/session-$(date +%Y%m%d-%H%M%S).log` with command timings, exclusions applied, and validation results.

## Acceptance

- `catalog.json` contains all top-level sections (or explicitly empty arrays) and honors exclusions; `summary.md` present with a clear recommendation (e.g., run `/write-architecture-apis`).
