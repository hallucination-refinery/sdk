# Documentation Generation Workflow Proposal

## Goal
Generate accurate, comprehensive documentation of the current codebase with minimal supervision by discovering and documenting:
- Architecture (components, dependencies, flows)
- APIs (exports, signatures, usage)
- Data Models (schemas, types, interfaces)
- Configuration (env vars, settings)
- Errors & Logging (patterns, conventions)

## Current Problem
Sequential discovery → lost context → manual transcription → incomplete docs

## Proposed Solution

### Phase 1: Parallel Discovery
Use Task tool with general-purpose agent to search comprehensively:
```
Task: "Find and catalog ALL: exported APIs, data models, config patterns, error handling, and architectural components in the codebase. Output as structured JSON."
```

Save immediately to `.clmem/discovery/catalog.json`

### Phase 2: Parallel Documentation
Read catalog.json once, then update all 5 docs simultaneously:
- architecture.md
- apis.md  
- data-models.md
- configuration.md
- errors-logging.md

### Phase 3: Parallel Validation
Spot-check all docs against source files in one batch operation.

## Implementation

### Slash Commands
```
/discover-catalog
  - Runs Task agent for deep discovery
  - Writes catalog.json
  - Returns summary

/generate-docs  
  - Reads catalog.json
  - Updates all 5 docs in parallel
  - Validates with spot-checks

/audit-docs
  - Compares docs to source
  - Generates report
```

## Benefits
- Single source of truth (catalog.json)
- Reusable discovery data
- Parallel execution = faster
- Auditable process
- Incremental improvement possible

## Next Step
Run `/discover-catalog` to create the foundational data catalog.

---

# Workflow Implementation Review

## What Was Planned vs What Was Built

### ✅ Successfully Implemented
1. **Slash Commands Created**
   - `/discover-catalog` in `.claude/commands/discover-catalog.md`
   - `/generate-docs` in `.claude/commands/generate-docs.md`
   - `/audit-docs` in `.claude/commands/audit-docs.md`

2. **Directory Structure Created**
   - `.clmem/discovery/` for catalog.json
   - `.clmem/workflows/` for session logs
   - `.clmem/audits/` for audit reports

3. **CLAUDE.md Updated**
   - Added new slash commands with detailed workflows
   - Expanded allowed tools list
   - Kept existing commands intact

4. **Agents Defined**
   - `discovery-agent.md` - for comprehensive search
   - `synthesis-agent.md` - for doc generation
   - `audit-agent.md` - for validation
   - `meta-workflow-agent.md` - for optimization (bonus)

### ⚠️ Discrepancies Found

1. **Agent Invocation Mismatch**
   - CLAUDE.md says: "Use Task tool with general-purpose agent"
   - Agent files created: Specific agents (discovery-agent, etc.)
   - **Issue**: Task tool expects agent type like "general-purpose" but we created custom agent definitions
   - **Reality**: Our agents can't be called by name through Task tool

2. **Tool Availability Gap**
   - Agents define tools they need (Glob, Grep, Read, etc.)
   - CLAUDE.md allows these tools globally
   - **Issue**: Agent definitions suggest they have restricted tools, but Claude Code agents inherit all allowed tools
   - **Confusion**: Tool restrictions in agent files are documentation, not enforcement

3. **Workflow State Mismatch**
   - CLAUDE.md mentions: "log progress to .clmem/workflows/session-[timestamp].log"
   - Commands don't specify HOW to generate timestamp
   - **Issue**: No bash command shown for getting timestamp format

4. **Discovery Method Confusion**
   - Original workflow (map-and-extract): Used specific bash commands
   - New workflow (discover-catalog): Says "Use Task tool"
   - **Issue**: Task tool with custom agents won't work as intended

### 🔴 Critical Issues

1. **Custom Agents Not Callable**
   - Created: `.claude/agents/discovery-agent.md`
   - Problem: Task tool can't invoke custom agents by name
   - Fix needed: Either use "general-purpose" or update workflow

2. **JSON Output Format**
   - Agents specify detailed JSON schemas
   - Problem: Task tool agent won't know these schemas
   - Fix needed: Include schema in Task prompt

3. **Missing Meta-Workflow Integration**
   - Created meta-workflow-agent but no slash command for it
   - No trigger mechanism defined in CLAUDE.md

## Recommended Fixes

### Option 1: Use Task with general-purpose (Simpler)
- Update CLAUDE.md to embed agent logic in Task prompts
- Remove custom agent files OR keep as documentation only
- Include JSON schemas directly in Task prompts

### Option 2: Create Proper Sub-Agent Integration
- Update CLAUDE.md to show how to properly invoke agents
- Add error handling for agent invocation
- Test that custom agents actually work

### Option 3: Hybrid Approach
- Use Task tool with detailed prompts for discovery
- Keep agent files as "specification documents"
- Manually implement agent logic in slash commands

## Current State Assessment
- **Setup**: 70% complete
- **Usable**: No - Agents missing required frontmatter
- **Next Step**: Add frontmatter to agents and update workflows

## Updated Understanding After Documentation Review

### ✅ What I Got Right
- Agent files go in `.claude/agents/`
- Agents need specific format and structure
- Task tool has limited built-in agent types

### ❌ What I Got Wrong
1. **Custom agents CAN be invoked** - just not through Task tool
2. **Agents need YAML frontmatter** - ours are missing this
3. **Invocation is via direct mention** - "Use the discovery-agent to..."

### How Custom Agents Actually Work
```yaml
---
name: discovery-agent
description: When you need to comprehensively search and catalog the codebase
tools: Glob, Grep, Read, LS, Bash
---

[Agent instructions here]
```

Then invoked by user saying: "Use the discovery-agent to catalog the codebase"

### Corrected Workflow Design

#### Option 1: Direct Implementation (Recommended)
- Slash commands contain full logic
- No dependency on Task tool or custom agents
- Most reliable and predictable

#### Option 2: User-Invoked Agents
- Fix agent files with frontmatter
- Commands instruct user to invoke agents
- Example: "Now say: 'Use the discovery-agent to catalog the codebase'"

#### Option 3: Hybrid
- Simple tasks in slash commands
- Complex tasks delegate to user-invoked agents
- Best of both worlds

### Immediate Actions Needed
1. Add YAML frontmatter to all 4 agent files
2. Update CLAUDE.md to remove Task tool references
3. Decide on implementation approach
4. Test the corrected workflow