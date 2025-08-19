### Command: /run-context-consolidation

**Purpose:** Execute the complete context consolidation documentation pipeline autonomously from discovery through audit
**Required tools:** Write, Read, Bash, Task, Glob, Grep, LS
**Execute this workflow:**

1. **Initialize pipeline:**
   - Create master timestamp: `date +%Y%m%d-%H%M%S`
   - Initialize pipeline log: `.clmem/workflows/pipeline-[timestamp].log`
   - Log: "Starting context consolidation pipeline"

2. **Phase 1: Discovery (via discovery-agent):**
   - Create directories: `.clmem/discovery`, `.clmem/workflows`
   - Say: "Use the discovery-agent to comprehensively search the codebase and create a structured JSON catalog with all exported APIs, data models, configuration, error patterns, and architecture. Save to .clmem/discovery/catalog.json"
   - Verify catalog.json created
   - Log discovery completion to pipeline log

3. **Phase 2: Synthesis (via synthesis-agent):**
   - Verify catalog.json exists
   - Say: "Use the synthesis-agent to transform .clmem/discovery/catalog.json into all 5 documentation files in docs/context-consolidation/final-docs/"
   - Verify all 5 docs created (architecture.md, apis.md, data-models.md, configuration.md, errors-logging.md)
   - Log synthesis completion to pipeline log

4. **Phase 3: Audit (via audit-agent):**
   - Create directory: `.clmem/audits`
   - Say: "Use the audit-agent to validate all documentation in docs/context-consolidation/final-docs/ against source code and generate audit report in .clmem/audits/"
   - Read audit report JSON for statistics
   - Log audit results to pipeline log

5. **Phase 4: Meta-Analysis (via meta-workflow-agent):**
   - Say: "Use the meta-workflow-agent to analyze the complete pipeline execution from discovery through audit, identify patterns, and generate optimization recommendations"
   - Log meta-analysis completion

6. **Generate final report:**
   - Read all phase outputs
   - Create `.clmem/workflows/pipeline-[timestamp]-summary.md` with:
     - Total execution time
     - Files created count
     - Documentation accuracy percentage
     - Critical issues found
     - All output file paths
   - Display summary to user

7. **Final output:**
   - Show consolidated results:
     - Discovery: X items cataloged
     - Synthesis: 5 docs generated, Y total lines
     - Audit: Z% accuracy (A passed/B total)
     - Critical issues: List any found
   - State: "Context consolidation complete. All documentation available in docs/context-consolidation/final-docs/"

## Success Criteria
- All 5 documentation files created
- Audit accuracy >75%
- All logs and reports generated
- No blocking errors

## Failure Handling
- Log any errors to pipeline log
- Continue to next phase if possible
- Report partial success with details

## Outputs
- `.clmem/discovery/catalog.json` - Discovery catalog
- `.clmem/discovery/summary.md` - Discovery summary
- `docs/context-consolidation/final-docs/*.md` - 5 documentation files
- `.clmem/audits/audit-*.md` - Audit report
- `.clmem/audits/audit-*.json` - Audit statistics
- `.clmem/workflows/pipeline-*-summary.md` - Final summary
- `.clmem/workflows/pipeline-*.log` - Complete execution log