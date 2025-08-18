---
description: Complete remaining documentation after review approval
allowed-tools: ["Read", "Edit", "MultiEdit", "Bash", "Grep"]
---

# Complete Remaining Documentation

Complete data-models.md, configuration.md, and errors-logging.md documentation.

## Update Data Models Documentation

Document schemas and models found:
- Core schemas and their fields
- Relationships between models
- Data invariants and constraints
- Add file:line references

Target: `docs/context-consolidation/final-docs/data-models.md`

## Update Configuration Documentation

List all configuration elements:
- Environment variables discovered
- Config files and their precedence
- Defaults where found
- File:line references

Target: `docs/context-consolidation/final-docs/configuration.md`

## Update Errors & Logging Documentation

Categorize error handling and logging:
- Error patterns found in codebase
- Logging conventions used
- Monitoring setup if present
- File:line references

Target: `docs/context-consolidation/final-docs/errors-logging.md`

## Quality Check

Spot-check minimum 3 items per doc against source.

## Completion

Inform user that all 5 documentation files are complete.

Create final audit log: `.clmem/workflows/complete-docs-$(date +%Y%m%d-%H%M%S).log`