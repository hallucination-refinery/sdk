# GOAL

Design a 1. parsimonous 2. extensible and 3. robust: infrastructure and workflow to produce authoritative and comprehensive documentation about the current state of the codebase.

# TASK

1. Systematically decompose this goal into its component parts.
2. Rigorously break down the sub-tasks and group them. Make note of any patterns or repeated processes. What types of tasks are there?
3. Then, read and absorb @docs/tmp-workflow-setup/capabilities.md and @docs/git-archaeology-implementation-scratchpad.md
4. Cross-reference and map the capabilities with your earlier notes (steps 1-2 above).
5. Think carefully, synthesize your understanding, and write a detailed implementation plan for the capabilities/scaffolding (i.e, tools, workflows, agents, processes, scripts, flows etc.) that would allow a Claude Code orchestrator to autonomously achieve the goal in the @docs/tmp-workflow-setup directory.

# CONTEXT

The repository (refinery-sdk) contains numerous stray branches from stalled development attempts. We're on the refactor/context-consolidation-aug17 branch (~219 commits ahead of main).

## ULTRA-HIGH LEVEL

Gathering the Raw Context -> Comprehensive Documentation -> Rigorous Synthesis & Analysis -> Cross-referencing with best practices/docs/etc -> Rigorous Synthesis & Analysis -- Repeat

---

# ULTRATHINK MODE EXECUTION

## 1. DECOMPOSE - Recording Prompt Verbatim

**Prompt**: "Design a 1. parsimonious 2. extensible and 3. robust: infrastructure and workflow to produce authoritative and comprehensive documentation about the current state of the codebase."

**Core Premise**: Create a minimal yet powerful documentation system that can autonomously discover, analyze, and document a complex multi-branch codebase.

**Claims**:
- Documentation must be authoritative (accurate, verified)
- Documentation must be comprehensive (complete coverage)
- System must be parsimonious (minimal, efficient)
- System must be extensible (adaptable to new requirements)
- System must be robust (fault-tolerant, consistent)

**Implicit Assumptions**:
- The codebase is complex with multiple stalled branches
- Current documentation is insufficient or scattered
- Automation is necessary for maintainability
- Claude Code can orchestrate this autonomously

## 2. PLAN - Recursive Task Breakdown

### Level 1: Primary Components
1. **Discovery Engine** - Find and catalog all codebase elements
2. **Analysis Engine** - Understand relationships and patterns
3. **Documentation Engine** - Generate human-readable outputs
4. **Validation Engine** - Verify accuracy and completeness

### Level 2: Discovery Engine Subtasks
1.1 **Branch Discovery**
   - List all branches
   - Identify branch relationships
   - Detect stalled/active status
   
1.2 **File System Mapping**
   - Catalog all files/directories
   - Track file changes across branches
   - Identify orphaned or deprecated code

1.3 **Dependency Mapping**
   - Package dependencies
   - Internal module dependencies
   - External API dependencies

### Level 2: Analysis Engine Subtasks
2.1 **Static Analysis**
   - AST parsing for structure
   - Type analysis
   - Dead code detection

2.2 **Dynamic Analysis**
   - Test coverage mapping
   - Runtime behavior patterns
   - Performance characteristics

2.3 **Historical Analysis**
   - Commit pattern analysis
   - Author contribution mapping
   - Evolution trajectory

### Level 2: Documentation Engine Subtasks
3.1 **Content Generation**
   - API documentation
   - Architecture diagrams
   - Usage examples

3.2 **Cross-referencing**
   - Link related components
   - Build dependency graphs
   - Create navigation indices

3.3 **Format Output**
   - Markdown generation
   - Interactive visualizations
   - Searchable indices

### Level 2: Validation Engine Subtasks
4.1 **Accuracy Verification**
   - Code-to-doc consistency
   - Example execution
   - Reference validation

4.2 **Completeness Checking**
   - Coverage metrics
   - Missing documentation detection
   - Orphan detection

4.3 **Quality Assurance**
   - Readability scoring
   - Consistency checking
   - Update freshness

## 3. PROBE - Multiple Perspectives as Falsifiable OODA Loops

### OODA Loop 1: Discovery Completeness
**Observe**: Run discovery on known branches
**Orient**: Compare discovered vs expected elements
**Decide**: Are we missing hidden branches/files?
**Act**: Expand discovery patterns if gaps found
**Falsifiable**: Discovery finds 100% of git-tracked files

### OODA Loop 2: Analysis Accuracy
**Observe**: Parse sample modules with known structure
**Orient**: Compare analysis output to manual inspection
**Decide**: Is our understanding correct?
**Act**: Refine analysis algorithms if discrepancies
**Falsifiable**: Analysis correctly identifies all imports/exports

### OODA Loop 3: Documentation Usefulness
**Observe**: Generate docs for test module
**Orient**: Have developer attempt task using only generated docs
**Decide**: Can task be completed without source access?
**Act**: Enhance documentation if gaps identified
**Falsifiable**: New developer can onboard using only generated docs

### OODA Loop 4: System Resilience
**Observe**: Introduce deliberate failures (missing files, bad commits)
**Orient**: Monitor system response and recovery
**Decide**: Does system degrade gracefully?
**Act**: Add error handling for failure modes
**Falsifiable**: System continues operating with 50% resource failure

## 4. SEQUENCE - Working Backwards from End State

### Desired End State
Complete, accurate, navigable documentation of entire refinery-sdk codebase accessible via:
- Markdown files in /docs
- Interactive dependency graphs
- Branch comparison matrices
- API reference with examples

### Reverse Sequence
**Step 8**: Final validation and publication
**Step 7**: Cross-reference linking and indexing
**Step 6**: Documentation generation from analyzed data
**Step 5**: Relationship and pattern analysis
**Step 4**: Raw data collection from all branches
**Step 3**: Tool and workflow setup
**Step 2**: Environment preparation
**Step 1**: Requirements gathering and planning

### Critical Dependencies
- Step 6 depends on Step 5 (can't document what isn't analyzed)
- Step 5 depends on Step 4 (can't analyze missing data)
- Steps 4-6 can parallelize per branch
- Step 7 requires all Step 6 outputs

### Grouped Task Clusters
**Cluster A: Infrastructure** (Steps 1-3)
- git_archaeology.py enhancements
- Sub-agent templates
- Memory persistence setup

**Cluster B: Discovery** (Step 4)
- Branch enumeration
- File cataloging
- Dependency extraction

**Cluster C: Analysis** (Step 5)
- Static code analysis
- Historical pattern detection
- Architecture reconstruction

**Cluster D: Generation** (Steps 6-7)
- Documentation writing
- Diagram creation
- Index building

**Cluster E: Validation** (Step 8)
- Accuracy checking
- Completeness verification
- User testing

## 5. PARALLELIZE BY DEFAULT - Sub-Agent Architecture

### Main Orchestrator Tasks
- Overall workflow coordination
- Cross-branch synthesis
- Quality gates

### Sub-Agent 1: Branch Explorer
**Mission**: Deep-dive each branch independently
**Outputs**: Branch-specific discoveries in .clmem files
**Parallelization**: One instance per branch

### Sub-Agent 2: Code Analyzer
**Mission**: Parse and understand code structure
**Outputs**: AST representations, dependency graphs
**Parallelization**: One instance per package

### Sub-Agent 3: Documentation Writer
**Mission**: Generate human-readable documentation
**Outputs**: Markdown files, diagrams
**Parallelization**: One instance per module

### Sub-Agent 4: Cross-Reference Builder
**Mission**: Link related elements across branches
**Outputs**: Navigation indices, relationship maps
**Parallelization**: After all branch analysis complete

## 6. VERIFY ×3 - Triple Verification Strategy

### Verification Layer 1: Automated Testing
- Unit tests for each discovery function
- Integration tests for workflow chains
- Regression tests for documentation accuracy

### Verification Layer 2: Cross-Validation
- Compare branch analysis across multiple runs
- Validate dependencies using multiple tools
- Check documentation against source truth

### Verification Layer 3: Human Spot-Checks
- Random sampling of generated docs
- Developer review of architecture diagrams
- New user onboarding test

### Uncertainty Areas
- Branch merge conflict resolution strategies
- Handling of binary/large files
- Documentation for generated code

## 7. CROSS-CHECK - Multiple Verification Methods

### Method 1: Git Native Tools
```bash
git branch -a | wc -l  # Compare with our branch count
git ls-files | wc -l   # Compare with our file count
git log --oneline | wc -l  # Compare with commit analysis
```

### Method 2: Language-Specific Tools
- npm ls for JavaScript dependencies
- Python AST module for Python analysis
- TypeScript compiler API for type checking

### Method 3: External Validators
- markdownlint for documentation quality
- mermaid-cli for diagram validation
- broken-link-checker for reference integrity

### Method 4: Statistical Validation
- Benford's law for commit frequencies
- Zipf distribution for file sizes
- Power law for dependency relationships

## 8. STRESS-TEST - Hidden Gap Analysis

### Identified Gaps
1. **Memory Limits**: Claude has context window limits
   - Solution: Chunking strategies with overlap
   
2. **Branch Conflicts**: Some branches may not merge cleanly
   - Solution: Document conflicts as architectural decisions
   
3. **Stale Dependencies**: Old branches may reference deprecated packages
   - Solution: Flag and document technical debt
   
4. **Performance at Scale**: Large repos may timeout
   - Solution: Incremental processing with checkpoints
   
5. **Documentation Drift**: Docs become outdated quickly
   - Solution: Automated update triggers on commits

### Assumption Challenges
- Assumption: All code is in Git
  - Reality: May have untracked local files
  - Mitigation: Scan working directory too

- Assumption: Code follows conventions
  - Reality: Legacy code may be non-standard
  - Mitigation: Flexible parsing strategies

- Assumption: Tests indicate usage
  - Reality: Tests may be incomplete
  - Mitigation: Multiple usage detection methods

## 9. REFLECT - Complete Reasoning Chain Review

### Re-running from First Principles
Starting fresh: The goal is comprehensive codebase documentation. Breaking this down:
1. We need to understand what exists (Discovery)
2. We need to understand how it works (Analysis)
3. We need to explain it clearly (Documentation)
4. We need to ensure accuracy (Validation)

### Pattern Recognition
The recurring pattern is: **Discover → Analyze → Document → Validate**
This pattern applies at every level:
- Repository level (all branches)
- Branch level (all files)
- File level (all functions)
- Function level (all logic)

### Key Insights from Reflection
1. **Parallelization is critical** - Sequential processing would take too long
2. **Memory persistence is essential** - Can't re-discover everything each session
3. **Incremental updates are required** - Full regeneration doesn't scale
4. **Validation must be continuous** - Not just at the end

### Confidence Assessment
- High confidence: Discovery and basic documentation
- Medium confidence: Cross-branch analysis and synthesis
- Low confidence: Handling extremely large codebases
- Unknown: Optimal chunking strategies for context limits

---

# DETAILED IMPLEMENTATION PLAN

## Phase 1: Infrastructure Setup (Day 1)

### 1.1 Enhanced Git Archaeology Tool
```python
# Extend existing git_archaeology.py with:
- Branch comparison matrix generation
- Parallel branch processing
- Incremental update detection
- Memory-efficient chunking
```

### 1.2 Sub-Agent Templates
Create template prompts in `/workspace/docs/tmp-workflow-setup/agent-templates/`:
- `branch-explorer.md` - Deep branch analysis
- `code-analyzer.md` - Static analysis and AST parsing
- `doc-writer.md` - Documentation generation
- `cross-referencer.md` - Relationship mapping

### 1.3 Memory Persistence Structure
```
.clmem/
├── branches/
│   ├── main.json
│   ├── feature-x.json
│   └── refactor-y.json
├── analysis/
│   ├── dependencies.json
│   ├── architecture.json
│   └── patterns.json
└── state/
    ├── last-run.json
    └── checkpoints.json
```

## Phase 2: Discovery Implementation (Day 2)

### 2.1 Branch Discovery Script
```python
# branch_discovery.py
class BranchDiscovery:
    def enumerate_branches()
    def analyze_branch_relationships()
    def detect_stalled_branches()
    def generate_branch_matrix()
```

### 2.2 File Cataloging System
```python
# file_catalog.py
class FileCatalog:
    def scan_branch_files()
    def track_file_evolution()
    def identify_orphans()
    def build_file_index()
```

### 2.3 Dependency Extraction
```python
# dependency_extractor.py
class DependencyExtractor:
    def extract_package_deps()
    def map_internal_imports()
    def identify_external_apis()
    def generate_dep_graph()
```

## Phase 3: Analysis Engine (Day 3)

### 3.1 Multi-Language Parser
```python
# code_parser.py
class CodeParser:
    def parse_javascript()
    def parse_typescript()
    def parse_python()
    def generate_ast()
```

### 3.2 Pattern Detector
```python
# pattern_detector.py
class PatternDetector:
    def find_design_patterns()
    def detect_anti_patterns()
    def identify_code_smells()
    def suggest_refactors()
```

### 3.3 Architecture Reconstructor
```python
# architecture_reconstructor.py
class ArchitectureReconstructor:
    def identify_layers()
    def map_component_boundaries()
    def detect_architectural_styles()
    def generate_arch_diagram()
```

## Phase 4: Documentation Generation (Day 4)

### 4.1 Markdown Generator
```python
# doc_generator.py
class DocGenerator:
    def generate_api_docs()
    def create_guides()
    def write_examples()
    def build_indices()
```

### 4.2 Diagram Creator
```python
# diagram_creator.py
class DiagramCreator:
    def create_mermaid_diagrams()
    def generate_dependency_graphs()
    def draw_architecture_diagrams()
    def render_sequence_diagrams()
```

### 4.3 Cross-Reference Builder
```python
# cross_reference.py
class CrossReferenceBuilder:
    def link_related_docs()
    def build_search_index()
    def create_navigation()
    def generate_sitemap()
```

## Phase 5: Validation & Publishing (Day 5)

### 5.1 Validation Suite
```python
# validator.py
class Validator:
    def verify_accuracy()
    def check_completeness()
    def test_examples()
    def validate_links()
```

### 5.2 Publishing Pipeline
```python
# publisher.py
class Publisher:
    def prepare_output()
    def generate_static_site()
    def deploy_docs()
    def notify_stakeholders()
```

## Execution Workflow

### Step 1: Initialize
```bash
# Create structure
mkdir -p docs/tmp-workflow-setup/{scripts,templates,output}
cd docs/tmp-workflow-setup

# Install dependencies
pip install gitpython ast pyparsing matplotlib
npm install -g mermaid-cli markdownlint
```

### Step 2: Discovery Phase
```python
# Run discovery in parallel
python scripts/orchestrator.py discover \
  --parallel \
  --branches all \
  --output .clmem/discovery
```

### Step 3: Analysis Phase
```python
# Analyze discovered data
python scripts/orchestrator.py analyze \
  --input .clmem/discovery \
  --parallel \
  --output .clmem/analysis
```

### Step 4: Documentation Phase
```python
# Generate documentation
python scripts/orchestrator.py document \
  --input .clmem/analysis \
  --format markdown \
  --output docs/generated
```

### Step 5: Validation Phase
```python
# Validate and publish
python scripts/orchestrator.py validate \
  --input docs/generated \
  --fix-errors \
  --publish
```

## Success Metrics

### Quantitative Metrics
- 100% branch coverage
- 100% file discovery
- >90% dependency accuracy
- <5% documentation gaps
- <1% broken links

### Qualitative Metrics
- New developer can onboard in <1 day
- Architecture is immediately understandable
- Documentation stays current with code
- System runs autonomously

## Risk Mitigation

### Technical Risks
- **Risk**: Memory limits hit
  - **Mitigation**: Implement streaming processors
  
- **Risk**: Processing timeouts
  - **Mitigation**: Checkpoint and resume capability

- **Risk**: Inconsistent code styles
  - **Mitigation**: Multiple parser strategies

### Process Risks
- **Risk**: Documentation drift
  - **Mitigation**: Git hooks for auto-update
  
- **Risk**: User adoption
  - **Mitigation**: Progressive enhancement

## Next Actions

1. Create orchestrator.py main script
2. Implement branch discovery module
3. Set up parallel processing framework
4. Create first sub-agent template
5. Test on small branch subset

---

# CAPABILITY MAPPING

## Claude Code Capabilities → Implementation Mapping

### 1. Autonomous Code Execution → Orchestrator Script
- Maps to: `orchestrator.py` main controller
- Utilizes: Bash tool for git operations
- Enables: Fully automated workflow

### 2. Multi-File Context → Parallel Analysis
- Maps to: Sub-agent per branch/module
- Utilizes: Read tool with chunking
- Enables: Comprehensive understanding

### 3. Iterative Development → OODA Loops
- Maps to: Validation and refinement phases
- Utilizes: Edit tool for updates
- Enables: Continuous improvement

### 4. Sub-Agent Architecture → Task Parallelization
- Maps to: Branch/module specialists
- Utilizes: Task tool spawning
- Enables: Scalable processing

### 5. Memory Persistence → .clmem Structure
- Maps to: Cross-session state
- Utilizes: Write tool for persistence
- Enables: Incremental updates

### 6. Hook System → Auto-Documentation
- Maps to: Git commit triggers
- Utilizes: Settings configuration
- Enables: Real-time updates

## Implementation Priority Matrix

| Task | Impact | Effort | Priority |
|------|--------|--------|----------|
| Orchestrator Script | High | Medium | P0 |
| Branch Discovery | High | Low | P0 |
| Memory Structure | High | Low | P0 |
| Sub-Agent Templates | High | Medium | P1 |
| Parallel Framework | Medium | High | P1 |
| Validation Suite | Medium | Medium | P2 |
| Publishing Pipeline | Low | Low | P3 |

## Final Recommendation

Begin with Phase 1 infrastructure, focusing on:
1. Extending git_archaeology.py for branch analysis
2. Creating the orchestrator.py framework
3. Setting up .clmem persistence structure

This foundation enables all subsequent phases and can begin producing value immediately through branch discovery and basic documentation generation.

---

# CRITICAL REVIEW: SIMPLIFICATION

## The Over-Engineering Problem

Upon critical review, the above plan violates the **parsimonious** principle catastrophically. We're building:
- 15+ Python classes
- Complex AST parsers
- Multiple analysis engines
- Elaborate persistence structures

**This is absurd.** We're essentially rebuilding capabilities that Claude Code already has natively.

## The Core Realization

**Claude Code itself IS the analysis engine.** We don't need to build tools for Claude to use - Claude can directly:
- Read and understand code in any language
- Identify patterns and relationships
- Generate documentation
- Validate accuracy

## The ACTUAL Minimal Solution

### What We Really Need (Total: 3 Files)

1. **orchestrator.py** - Coordinates sub-agents
2. **agent-prompts/document-branch.md** - Template for branch documentation
3. **update-hook.sh** - Git hook for incremental updates

### The Entire Workflow (Simplified)

```python
# orchestrator.py (< 100 lines)
import subprocess
import json

def get_branches():
    """Get all git branches"""
    result = subprocess.run(['git', 'branch', '-a'], capture_output=True, text=True)
    return [b.strip() for b in result.stdout.splitlines()]

def spawn_documenter(branch):
    """Spawn a Claude sub-agent to document a branch"""
    prompt = f"""
    You are documenting the {branch} branch.
    1. Check out the branch
    2. List all files
    3. Read key files to understand structure
    4. Generate comprehensive documentation in /docs/branches/{branch}.md
    Include: purpose, architecture, dependencies, key files, how to use
    """
    # Use Task tool to spawn sub-agent
    return prompt

def main():
    branches = get_branches()
    for branch in branches[:5]:  # Start with 5 branches
        spawn_documenter(branch)
    
    # After all branches documented, create index
    create_index()
```

### Why This Works

1. **Discovery** = `git ls-tree` and `find` commands
2. **Analysis** = Claude reads the files directly
3. **Documentation** = Claude writes markdown directly
4. **Validation** = Claude can check its own work

### The Real Implementation (1 Day, Not 5)

#### Hour 1: Setup
```bash
mkdir -p docs/branches
echo "# Repository Documentation" > docs/index.md
```

#### Hour 2: Write orchestrator.py
- 20 lines to get branches
- 20 lines to spawn sub-agents
- 20 lines to consolidate results

#### Hour 3-4: Run on 5 test branches
- Spawn sub-agents
- Let them document
- Review output

#### Hour 5-6: Iterate and improve
- Refine prompts based on output
- Add specific sections needed
- Test validation

#### Hour 7-8: Scale to all branches
- Run on remaining branches
- Generate cross-references
- Create final index

## The Parsimonious Architecture

```
docs/
├── branches/           # One file per branch
│   ├── main.md
│   ├── feature-x.md
│   └── refactor-y.md
├── architecture.md     # Overall architecture
├── dependencies.md     # Dependency map
└── index.md           # Navigation
```

## What We DON'T Need

❌ Complex Python classes for parsing
❌ AST analysis (Claude understands code natively)
❌ Elaborate .clmem structures (just use files)
❌ Multiple validation layers (one is enough)
❌ 5-day implementation (can be done in hours)
❌ Diagram generation libraries (use Mermaid text)
❌ Pattern detection algorithms (Claude identifies patterns)
❌ Architecture reconstruction (Claude infers architecture)

## The Actual Tools Needed

✅ Git (already installed)
✅ Claude Code (we're using it)
✅ Basic Python (subprocess, os, json)
✅ Markdown files (simple text)

## Revised Success Metrics

Instead of complex metrics, just one question:
**"Can a new developer understand the codebase from the docs?"**

If yes → Success
If no → Have Claude improve the specific unclear parts

## The Real Next Steps

1. Write a 50-line orchestrator.py
2. Create one agent prompt template
3. Test on 3 branches
4. Scale to all branches
5. Done

## Why This is Better

- **Parsimonious**: 50 lines of code vs 1000s
- **Extensible**: Just modify the prompt to add new sections
- **Robust**: Leverages Claude's native abilities, less to break
- **Maintainable**: Anyone can understand a 50-line script
- **Fast**: Hours not days

## The Embarrassing Truth

I was designing a system to help Claude do what Claude already does naturally. It's like building a calculator for a mathematician. The existing git_archaeology.py already proved that simple scripts work. We just need to:

1. Point Claude at code
2. Ask for documentation  
3. Save the output

That's it. Everything else was unnecessary complexity.

---

# THE ULTRA-MINIMAL APPROACH

## Forget Everything Above. Here's What We Actually Do:

### Step 1: Create One Documentation Script (20 lines)

```python
# document_codebase.py
import subprocess
import os

# Get current branch state
branch = subprocess.check_output(['git', 'branch', '--show-current'], text=True).strip()
files = subprocess.check_output(['git', 'ls-files'], text=True).splitlines()

# Group files by directory
structure = {}
for f in files:
    parts = f.split('/')
    if len(parts) > 1:
        pkg = parts[0]
        if pkg not in structure:
            structure[pkg] = []
        structure[pkg].append(f)

print(f"Branch: {branch}")
print(f"Packages: {list(structure.keys())}")
print(f"Total files: {len(files)}")
```

### Step 2: Create One Agent Prompt

```markdown
# document_this.md

Analyze the current codebase and create comprehensive documentation.

For each major package/directory you find:
1. Read the key files
2. Understand its purpose
3. Document its architecture
4. List its dependencies
5. Provide usage examples

Output everything to `/workspace/docs/tmp-workflow-setup/CODEBASE_ANALYSIS.md`

Be thorough but concise. Focus on what a new developer needs to know.
```

### Step 3: Just Run It

```bash
# For current branch
python document_codebase.py
# Then use the prompt to have Claude document it

# For other branches
git checkout <branch>
python document_codebase.py
# Repeat documentation
```

## That's It. Seriously.

- No complex orchestration
- No sub-agents needed (unless we have 50+ branches)
- No elaborate persistence (just markdown files)
- No validation frameworks (read the output and see if it's good)

## The Even More Minimal Version

Actually, we don't even need the Python script:

```bash
# Just run these commands and document what you find
git branch -a > branches.txt
git ls-files > files.txt
find . -name "package.json" -o -name "*.py" -o -name "*.ts" | head -20
```

Then ask Claude: "Document this codebase based on what you can discover."

## The Philosophical Insight

We fell into the classic trap of **automation for automation's sake**. The goal was documentation, not building a documentation system. 

The existing git_archaeology.py works because it's simple. It doesn't try to be clever. It just:
1. Runs git commands
2. Processes the output
3. Saves results

We should do the same for documentation:
1. Run discovery commands
2. Read the code
3. Write documentation

## The Actual Implementation (30 minutes)

1. Create `/workspace/docs/tmp-workflow-setup/orchestrator.py`:

```python
#!/usr/bin/env python3
import subprocess
import json
from pathlib import Path

def document_current_branch():
    """Document the current branch"""
    branch = subprocess.check_output(['git', 'branch', '--show-current'], text=True).strip()
    
    print(f"Documenting branch: {branch}")
    
    # Get file list
    files = subprocess.check_output(['git', 'ls-files'], text=True).splitlines()
    
    # Get recent commits
    commits = subprocess.check_output(['git', 'log', '--oneline', '-10'], text=True)
    
    # Save discovery
    output = {
        'branch': branch,
        'file_count': len(files),
        'recent_commits': commits,
        'packages': list(set(f.split('/')[0] for f in files if '/' in f))
    }
    
    Path(f'docs/branches/{branch}.json').write_text(json.dumps(output, indent=2))
    
    return output

if __name__ == '__main__':
    result = document_current_branch()
    print(json.dumps(result, indent=2))
    print("\nNow analyze these packages and write documentation:")
    for pkg in result['packages'][:5]:
        print(f"  - {pkg}/")
```

2. Run it:
```bash
python orchestrator.py
```

3. Use the output to guide documentation:
```
"Now document each package based on what you discover by reading the files."
```

## The Meta-Lesson

**Parsimonious doesn't mean "small" - it means "exactly what's needed and no more".**

What's needed:
- A way to discover what exists → `git ls-files`
- A way to understand it → Claude reads files
- A way to document it → Claude writes markdown

What's NOT needed:
- Complex orchestration systems
- Abstract syntax tree parsing  
- Multiple validation layers
- Elaborate state management

## Final Implementation Recommendation

1. Use the existing `git_archaeology.py` as a template
2. Modify it to generate documentation instead of analysis
3. Run it on each branch
4. Consolidate results
5. Done

Time required: 2-4 hours, not 5 days.

---

# THE ABSOLUTE MINIMUM: START HERE

## Just Three Commands to Start

```bash
# 1. See what we have
git ls-files | wc -l
git branch -a | wc -l

# 2. Create simple orchestrator
cat > orchestrator.py << 'EOF'
import subprocess
result = subprocess.run(['git', 'ls-files'], capture_output=True, text=True)
files = result.stdout.splitlines()
packages = set(f.split('/')[0] for f in files if '/' in f)
print(f"Files: {len(files)}")
print(f"Packages: {sorted(packages)}")
EOF

# 3. Run it
python orchestrator.py
```

Then literally just ask Claude to document what it finds by reading the files.

No frameworks. No architecture. No complex systems.

Just:
1. Discovery (git commands)
2. Reading (Claude reads files)  
3. Writing (Claude writes markdown)

**Start with this. Add complexity only when proven necessary.**
