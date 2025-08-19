# CLAUDE-04-scratchpad.md — Unified SPEC-04 Synthesis

## CRITICAL AUDIT (Post-Error Discovery)

### ERROR FOUND
I created a SEPARATE implementation plan file (`implementation-plans/CLAUDE-04.md`) when CLAUDE.md line 65 clearly states: "End with a detailed step by step **implementation plan & checklist**" - meaning it should be INSIDE SPEC-04.md, not a separate file.

### Files Created (Status):
1. ✓ `scratchpads/CLAUDE-04-scratchpad.md` - CORRECT
2. ⚠️ `spec-proposals/SPEC-04.md` - INCOMPLETE (missing implementation plan section)
3. ✗ `implementation-plans/CLAUDE-04.md` - WRONG (should not exist)

### Requirements Verification (CLAUDE.md):
- Line 3: "Produce a concise, decision-ready **SPEC-[##].md**" - DONE
- Line 11: "Create **a** new scratchpad" - DONE (only one)
- Line 42: "Create `docs/cryptiq-mindmap/spec-proposals/SPEC-[##].md` (3-5 pages)" - DONE
- Line 65: "End with a detailed step by step implementation plan & checklist" - FAILED (created separate file)

## Context from User's Synthesized Analysis

### Must Implement:
1. **Nodes = derived concepts** with `createdFrom: MemoryID[]` provenance
2. **Attribute-only lenses** (NO position changes on lens switch)
3. **Edges default OFF** (show on selection)
4. **Connected (strict)** mode only
5. **Unified acceptance bars**

### Technical Decisions:
- QuadraticBezier curves (not TubeGeometry)
- Consecutive temporal edges
- Heuristic causal detection
- Edge visibility cap ≤100
- Deterministic vertex mapping

## Fixes Completed:
1. ✓ Deleted `implementation-plans/` directory
2. ✓ Read current SPEC-04.md
3. ✓ Appended implementation plan to SPEC-04.md as section 10
4. ✓ Verified all 10 sections present (9 required + implementation plan)
5. ✓ Ensured concept-centric model throughout

## Final Status:
- **SPEC-04.md**: Complete with 425 lines, all sections present
- **Concept-centric**: Nodes are concepts with `createdFrom: MemoryID[]`
- **Attribute-only lenses**: No position changes on lens switch
- **Edges default OFF**: Show on selection only
- **Connected (strict)**: Same-origin only, no offline mode
- **Performance bars**: All unified acceptance criteria included