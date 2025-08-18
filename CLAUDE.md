# CLAUDE.md

## Objective

- Produce accurate, comprehensive documentation of the current codebase as autonomously as possible, with minimal supervision.

## Constraints

- Solo developer; messy repo; unreliable CI. Read-only discovery first; tiny, verifiable edits only. No CI/docs-site work.
- Plan-only for this session: generate a proposal and append it to the brief; no execution.
- Do not rely on prior inventory/branch-map outputs unless explicitly approved.

## Safety & Rules

- Read-only first; non-interactive commands; avoid pagers (append `| cat` when unsure).
- No destructive ops (no `rm -rf`, no publish, no `git push`).
- Keep diffs small and isolated to outputs; use `/clear` between tasks.

## Allowed tools (must match settings)

- `Edit`
- `Bash(ls:*)`, `Bash(cat:*)`, `Bash(rg:*)`, `Bash(grep:*)`, `Bash(find:*)`, `Bash(cloc:*)`, `Bash(git status:*)`, `Bash(git diff:*)`

## Target outputs

- `docs/context-consolidation/final-docs/architecture.md`
- `docs/context-consolidation/final-docs/apis.md`
- `docs/context-consolidation/final-docs/data-models.md`
- `docs/context-consolidation/final-docs/configuration.md`
- `docs/context-consolidation/final-docs/errors-logging.md`
- Meta: `.clmem/workflows/*`, `.clmem/git-archaeology/*`

This session's output: an appended section in `docs/context-consolidation/context-consolidation-brief.md` titled “Proposed Orchestration Plan”.

## Orchestration protocol

- Slash-commands are standardized, repeatable entry points that spin up an orchestrator-led workflow.
- The orchestrator may delegate to predefined sub-agents and invoke scripts/tools to complete the commanded task.
- Before finishing, the orchestrator runs a final audit-and-reflection protocol and recommends the next slash-command.

## Workflow proposal (what to write into the brief)

When appending the “Proposed Orchestration Plan”, include:

- Goals: the minimal outcomes needed to meet the brief.
- Proposed slash-commands: name, purpose, inputs, outputs, and acceptance criteria.
- Sub-agents: roles and handoff points (Discovery vs Synthesis).
- Scripts/tools: any small helper scripts or one-liners and when to use them.
- Safety: allowed tools needed per command; anything beyond the allowlist must be explicitly requested.
- Execution order: a short, numbered sequence; each step completes within a short session.
- Final check protocol: audit, reflect, recommend next command.

## Sub-agents

- A — Discovery (map-sources → extract-facts)
- B — Synthesis (structure-docs → write-docs → normalize-links → spot-check → quality-check)

## Final check protocol (per task)

- Audit: verify outputs against source; list any TBDs with pointers.
- Reflect: log what worked/blocked in `.clmem/workflows/`.
- Recommend: propose the next slash-command and why.

References: Claude Code best practices and sub-agents — https://www.anthropic.com/engineering/claude-code-best-practices, https://docs.anthropic.com/en/docs/claude-code/sub-agents

## Slash-Command Workflows

When the user types these commands, execute the following workflows:

### Command: /map-and-extract

**Purpose:** Single-pass discovery to gather all facts needed for documentation
**Execute this workflow:**

1. **Find entry points:**
   - Run: `find . -type f \( -name "main.*" -o -name "index.*" -o -name "app.*" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | head -20`
2. **Locate configuration:**
   - Run: `find . -type f \( -name "*.env*" -o -name "*config*" -o -name "*.yaml" -o -name "*.yml" \) -not -path "*/node_modules/*" | grep -E "(config|env|settings)" | head -20`
3. **Extract APIs:**
   - Run: `rg "^export (class|function|const|interface|type)" --type ts --type js -g '!node_modules' -g '!dist' --no-heading | head -30`
4. **Find data models:**
   - Run: `rg "(schema|model|entity|interface|type)\s+\w+\s*(=|\{)" --type ts --type js -g '!node_modules' --no-heading | head -20`
5. **Get repo statistics:**
   - Run: `cloc . --exclude-dir=node_modules,dist,build,.git --quiet`
6. **Analyze findings and immediately continue to /write-architecture-apis**

### Command: /write-architecture-apis

**Purpose:** Draft the two critical docs that enable immediate decisions
**Execute this workflow:**

1. **Update architecture.md:**
   - Read `docs/context-consolidation/final-docs/architecture.md`
   - Fill in discovered components, dependencies, entry points
   - Add file:line references for all findings
   - Keep under 100 lines
2. **Update apis.md:**
   - Read `docs/context-consolidation/final-docs/apis.md`
   - Document exported functions/classes found
   - Include signatures and brief examples
   - Add file:line references
3. **Spot-check minimum 3 items per doc against source files**
4. **Create audit log in `.clmem/workflows/` with timestamp**
5. **STOP and inform user that drafts are ready for review**

### Command: /complete-remaining-docs

**Purpose:** Complete remaining documentation (only run after review)
**Execute this workflow:**

1. **Update data-models.md:**
   - Document schemas and models found
   - Include relationships and invariants
   - Add file:line references
2. **Update configuration.md:**
   - List all env vars discovered
   - Document config files and precedence
   - Include defaults where found
3. **Update errors-logging.md:**
   - Categorize error patterns found
   - Document logging conventions
   - Note any monitoring setup
4. **Spot-check minimum 3 items per doc**
5. **Inform user all 5 docs are complete**

## Workflow State Tracking

When executing slash-commands, log progress to `.clmem/workflows/session-[timestamp].log`:

- Command started
- Steps completed
- Files created/modified
- Any blockers encountered
- Next recommended action
