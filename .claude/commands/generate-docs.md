# Generate Docs

Generate all 5 documentation files from the discovery catalog.

## Prerequisites

Must run `/discover-catalog` first to create the catalog.json file.

## What it does

1. Loads `.clmem/discovery/catalog.json`
2. Updates all documentation files in parallel:
   - `architecture.md` - Components, dependencies, flows
   - `apis.md` - Exports, signatures, examples
   - `data-models.md` - Schemas, types, relationships
   - `configuration.md` - Environment variables, config files
   - `errors-logging.md` - Error patterns, logging conventions
3. Validates with spot-checks against source files
4. Logs completion to workflow log

## Output

All 5 documentation files in `docs/context-consolidation/final-docs/`

## Next step

Run `/audit-docs` to validate documentation against source code.