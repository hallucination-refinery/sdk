## Objective

Quickly produce accurate, comprehensive documentation that reflects the current codebase so we can make immediate, confident decisions about how to move forward.

## Scope (now)

- In-scope: concise docs for architecture, APIs, data models, configuration, and a brief errors/logging note; repo/branch map acts as the index.
- Out-of-scope: operations, security, contribution processes, and any CI/docs-site infrastructure.

## Constraints

- Solo developer; messy repo; unreliable CI.
- Read-only discovery first; tiny, verifiable edits only to `docs/context/*` and `.clmem/*`.

## Deliverables

- `docs/context-consolidation/final-docs/architecture.md` (components + key flows)
- `docs/context-consolidation/final-docs/apis.md` (public surfaces + minimal examples)
- `docs/context-consolidation/final-docs/data-models.md` (schemas + invariants)
- `docs/context-consolidation/final-docs/configuration.md` (env vars + precedence)
- `docs/context-consolidation/final-docs/errors-logging.md` (taxonomy + conventions)
- Optional index: diagrams, repo, and branch map files

## Success criteria

- Each doc is 1–2 screens, factual, source-aligned, with TBDs only where verification is pending.
- Together, the docs enable a short, actionable 1–2 week plan without further spelunking.

## Claude Workflow Framing

- Slash-commands are standardized, repeatable entry points that spin up an orchestrator-led workflow.
- The orchestrator can delegate to predefined sub-agents and invoke scripts/tools to complete the commanded task.
- Before finishing, the orchestrator runs a final audit-and-reflection protocol and Record brief metrics/deltas in `.clmem/workflows/*`; refine heuristics only when progress plateaus.
- Repeat

## Proposed Orchestration Plan

### Goals

- Map the codebase structure and identify key documentation sources
- Extract factual information from source code and existing docs
- Synthesize findings into the 5 required documentation deliverables
- Ensure all docs are source-aligned with clear TBD markers where needed

### Proposed Slash-Commands

#### `/discover-codebase`

- **Purpose:** Initial reconnaissance to understand repo structure and identify documentation sources
- **Inputs:** None (uses current working directory)
- **Outputs:** `.clmem/discovery/repo-inventory.md`, `.clmem/discovery/branch-map.md`
- **Acceptance:** Complete file tree, key directories identified, existing docs cataloged

#### `/analyze-architecture`

- **Purpose:** Extract component structure and key flows from source
- **Inputs:** `.clmem/discovery/repo-inventory.md`
- **Outputs:** `.clmem/analysis/architecture-facts.md`
- **Acceptance:** Components mapped, dependencies traced, entry points identified

#### `/analyze-apis`

- **Purpose:** Identify public interfaces and extract API signatures
- **Inputs:** `.clmem/discovery/repo-inventory.md`
- **Outputs:** `.clmem/analysis/api-facts.md`
- **Acceptance:** All public endpoints/methods documented with signatures

#### `/analyze-data`

- **Purpose:** Extract schemas, models, and data invariants
- **Inputs:** `.clmem/discovery/repo-inventory.md`
- **Outputs:** `.clmem/analysis/data-model-facts.md`
- **Acceptance:** Schemas captured, relationships mapped, invariants noted

#### `/analyze-config`

- **Purpose:** Map configuration sources and precedence
- **Inputs:** `.clmem/discovery/repo-inventory.md`
- **Outputs:** `.clmem/analysis/config-facts.md`
- **Acceptance:** All env vars documented, config files mapped, precedence clear

#### `/synthesize-docs`

- **Purpose:** Transform analysis outputs into final documentation
- **Inputs:** All `.clmem/analysis/*.md` files
- **Outputs:** All `docs/context-consolidation/final-docs/*.md` files
- **Acceptance:** Each doc 1-2 screens, factual, with source references

### Sub-Agents

**Discovery Agent (A):**

- Role: Read-only exploration and fact extraction
- Tasks: File traversal, pattern matching, dependency tracing
- Handoff: Produces structured facts in `.clmem/analysis/`

**Synthesis Agent (B):**

- Role: Documentation structuring and writing
- Tasks: Organize facts, write markdown, normalize links, quality check
- Handoff: Produces final docs with TBD markers where needed

### Scripts/Tools

```bash
# Quick repo stats
cloc . --exclude-dir=node_modules,dist,build,.git

# Find all config files
find . -type f \( -name "*.env*" -o -name "*config*" -o -name "*.yaml" -o -name "*.yml" \) | grep -v node_modules

# Extract all exported functions/classes
rg "^export (class|function|const|interface)" --type ts --type js -g '!node_modules' -g '!dist'

# Find entry points
rg "(main|index|app)\.(ts|js|tsx|jsx)$" --files

# Map imports for dependency graph
rg "^import .* from" --type ts --type js -g '!node_modules' | cut -d: -f2 | sort | uniq
```

### Safety

**Allowed tools per command:**

- `/discover-codebase`: `Bash(ls:*)`, `Bash(find:*)`, `Bash(cloc:*)`, `Bash(git status:*)`
- `/analyze-*`: `Bash(cat:*)`, `Bash(rg:*)`, `Bash(grep:*)`
- `/synthesize-docs`: `Edit` (for writing to docs/context-consolidation/final-docs/\*)

**Restrictions:**

- No interactive commands (append `| cat` when needed)
- No destructive operations
- Read-only for source files
- Edits only to `docs/context-consolidation/` and `.clmem/`

### Execution Order

1. `/discover-codebase` - Map repo structure (15 min)
2. `/analyze-architecture` - Extract component info (20 min)
3. `/analyze-apis` - Document interfaces (20 min)
4. `/analyze-data` - Map data models (15 min)
5. `/analyze-config` - Document configuration (10 min)
6. `/synthesize-docs` - Write final documentation (30 min)

Each step completes independently; outputs accumulate in `.clmem/` for traceability.

### Final Check Protocol

**Per-task completion:**

**Audit:**

- Verify outputs exist and contain expected sections
- Cross-reference facts against source files
- List TBDs with file:line pointers for unverified items

**Reflect:**

- Log completion status to `.clmem/workflows/[command]-[timestamp].log`
- Note any blockers or deviations from plan
- Record useful patterns discovered

**Recommend:**

- Identify next logical slash-command
- Explain why it's the appropriate next step
- Note any prerequisites or dependencies

**Example audit entry:**

```markdown
# /discover-codebase completion

- Status: Complete
- Files created: 2
- Coverage: 100% of repo mapped
- TBDs: None
- Next: /analyze-architecture (needs repo-inventory.md)
```

## Focused Critique of Proposed Orchestration Plan

- Alignment and scope
  - The plan is sound but over-segmented for a solo dev; six commands introduce context switches and overhead.
  - Dependencies on discovery artifacts (repo/branch maps) should be optional and explicitly approved, per constraints.

- Streamlining recommendations (to move faster)
  - Combine discovery and analysis into a single pass that gathers architecture, APIs, data models, and configuration facts at once.
  - Write drafts directly to `docs/context-consolidation/final-docs/` with clear TBD markers; avoid excessive `.clmem/*` intermediates unless needed.
  - Prioritize “Architecture” and “APIs” first; pause to decide next actions before completing the remaining docs.

- Gating and safety
  - Treat repo/branch maps and any non-listed tools as gated; require explicit approval before use.
  - Maintain read-only for source; edits only to `docs/context-consolidation/` and `.clmem/`; no git operations beyond diff/status.

- Acceptance and stop rules
  - Each doc ≤ ~2 screens, factual, source-aligned; TBDs limited and pointed to exact file:line for verification.
  - Spot-check at least 3 items per doc back to source before considering it “draft-complete”.
  - Stop after “Architecture” + “APIs” drafts; request review/decision before proceeding.

- Minimal alternative workflow (if accepted)
  - `/map-and-extract` (single pass; read-only; outputs structured facts for all 4 areas)
  - `/write-architecture-apis` (produce the two highest-impact docs; concise, with TBDs)
  - `/quality-check` (spot-check, tighten, list open questions)
  - Pause and recommend next step based on findings

## Final Plan

### Command Set (3 total)

#### `/map-and-extract`
**Purpose:** Single-pass discovery to gather all facts needed for documentation
**Method:** 
- Use `find`, `ls`, `rg` to identify key files (configs, entry points, schemas)
- Extract patterns directly without intermediate repo-inventory
- Focus on actionable facts, not exhaustive mapping
**Outputs:** Optional `.clmem/extraction-notes.md` (only if patterns are complex)
**Time:** 30 min

#### `/write-architecture-apis`
**Purpose:** Draft the two critical docs that enable immediate decisions
**Method:**
- Write directly to `docs/context-consolidation/final-docs/architecture.md`
- Write directly to `docs/context-consolidation/final-docs/apis.md`
- Include TBDs with specific file:line references where verification needed
- Each doc stays under 2 screens
**Outputs:** Two draft documents with clear source alignment
**Time:** 30 min

#### `/complete-remaining-docs`
**Purpose:** Finish data-models, configuration, and errors-logging docs (if approved)
**Method:** Same direct-write approach with TBD markers
**Outputs:** Three additional docs completing the set
**Time:** 20 min
**Note:** Only execute after review of first two docs

### Execution Protocol

**Start:**
1. Run `/map-and-extract` using allowed read-only tools
2. Immediately transition to `/write-architecture-apis` (no pause)
3. Spot-check 3+ facts per doc against source
4. **STOP** - Request review

**Decision point:**
- If docs sufficient → Done
- If refinement needed → Address specific feedback
- If remaining docs wanted → Run `/complete-remaining-docs`

### Quality Gates

**Per document:**
- Length: ≤ 2 screens (~100 lines)
- Facts: Every claim traces to source file:line
- TBDs: Limited, specific, with exact verification path
- Spot-checks: Minimum 3 items verified before marking draft-complete

**Allowed operations:**
- Read: `ls`, `cat`, `rg`, `grep`, `find`, `cloc`, `git status`, `git diff`
- Write: Only to `docs/context-consolidation/` and `.clmem/`
- No: Interactive commands, git push, rm, CI operations

### Success Metrics

- Architecture doc captures: components, dependencies, key flows
- API doc captures: public interfaces, contracts, examples
- Combined docs enable: 1-2 week planning without further code diving
- TBDs are actionable: each points to specific verification need

### Anti-patterns to Avoid

- Creating unnecessary intermediate files
- Over-analyzing before writing
- Perfect coverage over pragmatic sufficiency
- Context switches between similar tasks

This streamlined approach delivers the same outcomes with less overhead, respecting the solo dev context and constraints.
