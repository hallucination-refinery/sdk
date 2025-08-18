# Audit Docs

Validate all documentation against source code to ensure accuracy.

## Prerequisites

Must run `/generate-docs` first to have documentation to audit.

## What it does

1. Reads all 5 documentation files
2. Extracts all file:line references
3. Verifies each reference exists and matches source
4. Generates comprehensive audit report
5. Flags any discrepancies found

## Output

- `.clmem/audits/audit-[timestamp].md` - Full audit report with:
  - Verified items ✓
  - Discrepancies found ✗
  - Recommendations for fixes

## Next step

If discrepancies found, manually review and update docs or re-run `/generate-docs` with updated catalog.