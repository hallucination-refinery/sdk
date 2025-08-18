# Discover Catalog

Comprehensive discovery using Task agent to create reusable data catalog for documentation generation.

## What it does

1. Runs a general-purpose agent to search the entire codebase
2. Catalogs all exported APIs, data models, configuration, error patterns, and architecture
3. Saves findings to `.clmem/discovery/catalog.json` for reuse
4. Creates a summary in `.clmem/discovery/summary.md`

## Output

- `.clmem/discovery/catalog.json` - Structured JSON with all discoveries
- `.clmem/discovery/summary.md` - Human-readable summary
- `.clmem/workflows/session-[timestamp].log` - Execution log

## Next step

Run `/generate-docs` to create documentation from the catalog.