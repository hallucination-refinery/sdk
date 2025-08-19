### Command: /fix-context-consolidation

**Purpose:** Comprehensively fix and improve all documentation using audit insights and deep re-validation
**Required tools:** Read, Write, Edit, MultiEdit, Bash, Grep, Glob, Task
**Execute this workflow:**

1. **Initialize comprehensive fix:**
   - Create timestamp: `date +%Y%m%d-%H%M%S`
   - Initialize log: `.clmem/workflows/fix-[timestamp].log`
   - Read previous audit results from `.clmem/audits/audit-*.json`
   - Read optimization patterns from `.clmem/patterns/effective-discovery.json`

2. **Deep re-discovery with corrections:**
   - Say: "Use the discovery-agent to perform a comprehensive re-discovery of the codebase with these specific requirements:
     1. For ALL enums, parse the actual z.enum([...]) or enum values, not descriptions
     2. For ALL Zod schemas, extract the exact object structure with correct field names
     3. Count actual directories in packages/ for accurate package count
     4. Verify every export claim against actual file exports
     5. Use AST parsing where possible instead of regex
     Save corrected catalog to .clmem/discovery/catalog-fixed.json"

3. **Comprehensive validation pass:**
   - For EVERY item in catalog-fixed.json:
     - Verify file exists
     - Verify export/definition exists
     - Check actual vs documented structure
   - Create `.clmem/discovery/validation-report.json` with discrepancies
   - Fix any found discrepancies in the catalog

4. **Regenerate ALL documentation with improvements:**
   - Say: "Use the synthesis-agent to regenerate all 5 documentation files from catalog-fixed.json with these requirements:
     1. Use file references without line numbers
     2. Include confidence markers for any uncertain items
     3. Add [Verified] tags for items confirmed against source
     4. Generate cross-references between related items
     5. Include usage examples from actual code where found"

5. **Deep audit with expanded checks:**
   - Say: "Use the audit-agent to perform comprehensive validation including:
     1. All original audit checks
     2. Verify every single export claim
     3. Check for missing exports not documented
     4. Validate all type definitions
     5. Confirm all package references
     6. Test code examples for validity"

6. **Fix remaining issues found:**
   - Read the new audit report
   - For each issue found:
     - Locate the actual source truth
     - Update the documentation directly
     - Mark as [Verified] after fixing
   - Re-run quick validation on fixed items

7. **Coverage analysis:**
   - Search for undocumented exports: `rg "^export" --type ts -g '!node_modules' -g '!*.test.ts'`
   - Compare against documented items
   - Add any missing items to documentation
   - Log coverage percentage

8. **Final quality check:**
   - Accuracy score from audit
   - Coverage score from analysis  
   - Completeness check (all sections populated)
   - Cross-reference validation
   - Generate final score

9. **Generate comprehensive report:**
   - Create `.clmem/workflows/fix-[timestamp]-report.md` with:
     - Original accuracy: 81%
     - New accuracy: X%
     - Coverage: Y%
     - Fixed issues: detailed list
     - New issues found and fixed: list
     - Remaining gaps: list with recommendations

10. **Display results:**
    - Show improvement metrics
    - List all documentation files updated
    - Highlight any remaining issues that need manual review
    - Provide confidence score for the documentation

## Success Criteria
- Accuracy >95%
- Coverage >90%  
- All known issues fixed
- New issues discovered and addressed

## Outputs
- `.clmem/discovery/catalog-fixed.json` - Corrected catalog
- Updated all 5 docs in `docs/context-consolidation/final-docs/`
- `.clmem/workflows/fix-[timestamp]-report.md` - Comprehensive fix report
- `.clmem/audits/comprehensive-audit-[timestamp].json` - Full validation results