---
description: Draft the two critical docs that enable immediate decisions
allowed-tools: ["Read", "Edit", "MultiEdit", "Bash", "Grep"]
---

# Write Architecture and APIs Documentation

Generate architecture.md and apis.md based on discovered facts.

## Update Architecture Documentation

Read the current architecture template and fill in discovered components:
- Core components from packages/ directory
- Dependencies and relationships
- Key flows through the system
- Entry points with file:line references

Keep under 100 lines, factual, with TBDs only where verification pending.

Target: `docs/context-consolidation/final-docs/architecture.md`

## Update APIs Documentation

Document the public API surface:
- Exported functions/classes found
- Signatures and brief examples
- File:line references for all findings

Target: `docs/context-consolidation/final-docs/apis.md`

## Quality Check

Spot-check minimum 3 items per doc against source files.

## Audit Log

Create workflow log: `.clmem/workflows/write-docs-$(date +%Y%m%d-%H%M%S).log`

Record:
- Files updated
- Items documented
- TBDs with pointers
- Next recommended action

## Completion

After updating both docs, STOP and inform user that drafts are ready for review before proceeding to remaining documentation.