# GOAL

Establish a meta-workflow framework within Claude Code that systematically accelerates the creation, testing, evaluation, and iteration of information-processing workflows, achieving >3x improvement in workflow development velocity compared to ad-hoc approaches.

# REQUIREMENTS

## SCOPE

The framework will be validated through implementing a git archaeology workflow that extracts actionable architectural insights from repository history, with success measured by: (1) < 30-minute workflow creation time, (2) quantifiable prediction accuracy improvements per iteration, and (3) discovery rate of ≥5 novel insights per execution.

## EXTENSIBILITY

While implementation _exclusively_ uses Claude Code initially, the framework architecture must explicitly support future integration with apps/tools/MCP and alternative agents (OpenAI Codex CLI, Google Gemini CLI) through clearly defined interfaces and minimal coupling to Claude-specific features.

## SUCCESS CRITERIA

[ ] **Velocity:** New workflow prototype in <30 min cumulative agent execution time (sum of all meta-workflow processing periods from initial concept to approved implementation, excluding human review/response intervals)
[ ] **Learning:** > 20 % prediction accuracy gain per iteration (Track prediction vs observation delta)
[ ] **Extensibility:** <2 hour migration to or incorporation of new agents + <1 hour incorporation of new app integration/tools/MCPs, etc. (Document agent-specific and other relevant touchpoints)
[ ] **Robustness:** Zero workflow corruption after 10 iterations (State consistency checks)

## INFORMATION ARCHITECTURE

The meta-workflow must maintain explicit separation between:

1. **Agent-agnostic logic** (workflow definitions, evaluation metrics)
2. **Agent-specific execution** (Claude Code file operations, git commands)
3. **Cross-agent interfaces** (standardized I/O contracts)

# CONTEXT

**Current Date/Time:** 5:15 PM EST, 17-08-2025 (DD-MM-YYYY)
**Current Environment:** The repository is open in a Cursor IDE window within a Docker Container. Claude Code can be initialized in a terminal within this environment.
**Current State:**
The repository (refinery-sdk) contains numerous stray branches from stalled development attempts. We're on the refactor/context-consolidation-aug17 branch (219 commits ahead of main) to establish a meta-workflow framework that accelerates workflow creation and iteration. The git archaeology workflow is the first test case to validate this framework.
**Opportunity:**
Claude Code's persistent filesystem and git integration enable systematic workflows that maintain state between sessions, test hypotheses programmatically, and build an evolving mental model—while architecting for future multi-agent collaboration.

---

## Information Processing: DSPy vs JSON for Workflow Architecture

Current Understanding Update
Clarification Received: DSPy (not Dispy) - Framework for declarative language model programming Context: Comparing DSPy to JSON for workflow state management and LLM orchestration
DSPy Framework Analysis
Observable Characteristics:

# DSPy Example Structure

class GitArchaeologyWorkflow(dspy.Module):
def **init**(self):
self.predict_patterns = dspy.ChainOfThought("repository_state -> predictions")
self.extract_insights = dspy.Predict("git_data -> architectural_insights")
self.update_model = dspy.ChainOfThought("predictions, observations -> updated_mental_model")
Core DSPy Capabilities:
Declarative LM Programming: Define what, not how
Automatic Prompt Optimization: Learns better prompts through examples
Modular Composition: Chain reasoning steps explicitly
Built-in Evaluation: Metrics and optimization loops
State Management: Handles context between LM calls
Comparative Analysis: DSPy vs JSON for Workflow State
DimensionJSON ApproachDSPy ApproachInformation Processing Impact
State Representation Manual serialization of predictions/observations Structured signatures with types DSPy enforces schema consistency
LLM Coordination External orchestration logic Built-in module composition Reduces coordination complexity
Prompt Engineering Manual prompt crafting Automatic optimization from examples Reduces manual iteration cycles
Workflow Evolution Update JSON schemas manually Declarative modules adapt Faster meta-workflow iteration
Debugging Inspect JSON files Trace through reasoning chains Better observability of LLM decisions
Learning Amplification Manual tracking of what works Automatic compilation from demonstrations Systematic improvement built-in
Hypothesis Formation
H1: DSPy would accelerate workflow development by 3-5x
Evidence: Automatic prompt optimization vs manual iteration
Test: Implement parallel versions, measure development time
H2: DSPy better captures meta-learning patterns
Evidence: Built-in compilation from examples
Test: Compare prediction accuracy improvement rates
H3: JSON provides better audit trail for debugging
Evidence: Human-readable state at each step
Test: Trace a failure through both systems
Concrete Mapping to Repository Archaeology Workflow
DSPy Implementation Sketch:
class RepositoryArchaeology(dspy.Module):
def **init**(self): # Declare information processing steps
self.analyze_history = dspy.ChainOfThought(
"git_log, branch_list -> temporal_patterns, architectural_decisions"
)
self.predict_patterns = dspy.Predict(
"temporal_patterns -> stall_points, complexity_thresholds"
)
self.update_understanding = dspy.ChainOfThought(
"predictions, observations -> refined_hypotheses, next_questions"
)

    def forward(self, repository_path):
        # Information processing pipeline
        git_data = self.extract_git_data(repository_path)
        patterns = self.analyze_history(git_data)
        predictions = self.predict_patterns(patterns)
        # ... systematic workflow

JSON Implementation Sketch:
{
"workflow_state": {
"current_phase": "pattern_extraction",
"predictions": {
"stall_points": {"confidence": 0.7, "value": [30, 60, 90]},
"complexity_threshold": {"confidence": 0.5, "value": "unknown"}
},
"observations": {
"actual_stall_points": [35, 72],
"discovered_patterns": ["commit_frequency_decay", "todo_accumulation"]
},
"mental_model_version": 3
}
}
Build vs Buy Analysis Applied
Use Existing (DSPy):
✓ Solved: LLM orchestration patterns
✓ Solved: Prompt optimization
✓ Solved: Evaluation framework
✓ Community: Active development, best practices
Build Custom (JSON):
✗ Reinventing: LLM coordination
✗ Reinventing: State management
✓ Control: Exact data format
✓ Simplicity: No new dependencies
Critical Uncertainties
Learning Curve: How quickly can DSPy patterns be internalized?
Resolution: Implement one simple workflow in DSPy
Success Metric: <2 hours to working prototype
Integration Overhead: How does DSPy interact with Claude Code environment?
Resolution: Test DSPy installation and basic example
Success Metric: Successful execution in devcontainer
Debugging Complexity: Can we trace failures as easily as JSON?
Resolution: Intentionally break a DSPy workflow, measure fix time
Success Metric: <15 minutes to diagnose issues
Information-Driven Decision Framework
Observable Decision Criteria:
Development Velocity: Time to implement new workflow iterations
Learning Amplification: Rate of mental model improvement
Debugging Transparency: Time to understand failures
Future Flexibility: Ability to adapt to new requirements
Proposed Experimental Approach:

## A/B Test Protocol

1. Implement `git_commit_sentiment` workflow in both
2. Measure:
   - Implementation time
   - Lines of code
   - Prediction accuracy after 3 iterations
   - Time to debug intentional error
3. Decision point: If DSPy shows >2x improvement in any metric
   Concrete Next Actions (Tomorrow)
   Immediate (0-15 min):
   Install DSPy in devcontainer: pip install dspy-ai
   Run DSPy hello world example
   Create side-by-side comparison structure
   Short-term (15-45 min):
   Implement minimal git analysis in DSPy
   Implement same logic in JSON approach
   Document subjective experience differences
   Decision Point (45-60 min):
   Compare implementation complexity
   Evaluate learning curve steepness
   Make go/no-go decision on DSPy adoption
   Meta-Process Observation
   Key Insight: This is exactly the type of "build vs buy" decision that benefits from rapid experimentation rather than theoretical analysis. The information gain from 1 hour of hands-on comparison exceeds days of research.
   Information Processing Principle: When comparing frameworks, optimize for:
   Discovery Speed: How fast can we learn what doesn't work?
   Iteration Velocity: How quickly can we incorporate learnings?
   Cognitive Load: What percentage of mental capacity goes to framework vs problem?
   The DSPy vs JSON choice fundamentally affects our ability to maintain the rapid observe-orient-decide-act loop essential for repository archaeology. DSPy appears optimized for exactly our use case: systematic LLM-powered discovery with built-in learning amplification.

---

## Information Processing: DSPy + Claude Code Integration Architecture

Information Processing: DSPy + Claude Code Integration Architecture
Current Understanding of the Stack
Observable Tool Relationships:
┌─────────────────────────────────────┐
│ Claude Code │ ← Execution Environment
│ ┌─────────────────────────────┐ │
│ │ DSPy Framework │ │ ← Orchestration Layer
│ │ ┌─────────────────────┐ │ │
│ │ │ Git Archaeology │ │ │ ← Workflow Implementation
│ │ │ Workflows │ │ │
│ │ └─────────────────────┘ │ │
│ └─────────────────────────────┘ │
│ File System │ Git │ Python │ Bash │ ← Claude Code Capabilities
└─────────────────────────────────────┘
Concrete Integration Points

1. DSPy Running Inside Claude Code:

# In Claude Code environment

# /workspace/.claude/workflows/git_archaeology.py

import dspy
import subprocess
import json

class GitArchaeologyWorkflow(dspy.Module):
def **init**(self): # DSPy components that orchestrate Claude's reasoning
self.analyze_commits = dspy.ChainOfThought(
"git_log -> architectural_decisions, stall_patterns"
)
self.predict_next = dspy.Predict(
"current_patterns -> likely_problem_areas"
)

    def forward(self, branch_name):
        # Claude Code executes git commands
        git_log = subprocess.run(
            ["git", "log", "--oneline", branch_name],
            capture_output=True, text=True
        ).stdout

        # DSPy orchestrates Claude's analysis
        analysis = self.analyze_commits(git_log=git_log)
        predictions = self.predict_next(current_patterns=analysis.patterns)

        # Claude Code writes results to filesystem
        with open(f".clmem/{branch_name}_analysis.json", "w") as f:
            json.dump({"analysis": analysis, "predictions": predictions}, f)

        return analysis, predictions

Observable Information Flow:
Claude Code provides execution environment (file access, git commands)
DSPy orchestrates how Claude reasons about the data
Claude's LM performs the actual analysis/prediction
Results persist in Claude Code's filesystem
Critical Integration Mechanisms 2. Sub-Agent Coordination via DSPy:

# main_workflow.py in Claude Code

import dspy
from dspy.teleprompt import BootstrapFewShot

class RepositoryAnalysisOrchestrator(dspy.Module):
def **init**(self): # Each sub-agent is a DSPy module
self.branch_analyst = BranchAnalysisAgent()
self.pattern_detector = PatternDetectionAgent()  
 self.synthesis_agent = SynthesisAgent()

    def forward(self, repo_path):
        # Claude Code spawns sub-agents
        # DSPy coordinates their reasoning
        branch_reports = []
        for branch in self.get_branches(repo_path):
            # This could spawn actual Claude Code sub-agents
            report = self.branch_analyst(branch)
            branch_reports.append(report)

        patterns = self.pattern_detector(branch_reports)
        synthesis = self.synthesis_agent(patterns)

        return synthesis

Information Processing Advantages:
DSPy handles prompt optimization between agents
Claude Code handles parallel execution
Together: Systematic multi-agent archaeology
Observable Workflow Execution Pattern 3. Memory and State Management Synergy:

# DSPy + Claude Code memory integration

class PersistentGitArchaeology(dspy.Module):
def **init**(self): # Load previous state from Claude Code's .clmem
self.load_mental_model()

        self.predictor = dspy.ChainOfThought(
            "previous_predictions, current_observations -> updated_model"
        )

    def load_mental_model(self):
        # Claude Code file access
        if os.path.exists(".clmem/mental_model.json"):
            with open(".clmem/mental_model.json", "r") as f:
                self.mental_model = json.load(f)
        else:
            self.mental_model = {"hypotheses": {}, "confidence": {}}

    def save_mental_model(self):
        # Persist to Claude Code filesystem
        with open(".clmem/mental_model.json", "w") as f:
            json.dump(self.mental_model, f)

Critical Uncertainties & Information Gaps

1. Performance Inside Claude Code Container:
   Unknown: DSPy overhead in containerized environment
   Test: Benchmark simple DSPy workflow execution time
   Success Metric: <500ms overhead per LM call
2. Sub-Agent Spawning Integration:
   Unknown: Can DSPy modules map to Claude Code sub-agents?
   Test: Create DSPy module that spawns subprocess
   Success Metric: Successful parallel execution
3. Debugging Transparency:
   Unknown: How to trace DSPy execution in Claude Code
   Test: Implement logging/inspection hooks
   Success Metric: Full execution trace available
   Concrete Implementation Plan
   Phase 1: Basic Integration Test (15 min)

# In Claude Code

pip install dspy-ai
python -c "import dspy; print('DSPy available')"

# Create test workflow

cat > test_dspy_integration.py << 'EOF'
import dspy
import subprocess

# Configure DSPy to use Claude

dspy.settings.configure(lm=dspy.Claude())

class GitLogAnalyzer(dspy.Module):
def **init**(self):
self.analyze = dspy.Predict("git_log -> summary")

    def forward(self):
        # Claude Code executes git
        log = subprocess.run(["git", "log", "--oneline", "-10"],
                           capture_output=True, text=True).stdout
        # DSPy orchestrates Claude's analysis
        return self.analyze(git_log=log)

analyzer = GitLogAnalyzer()
result = analyzer()
print(result.summary)
EOF

python test_dspy_integration.py
Phase 2: Workflow Migration (30 min)

# Migrate existing git archaeology workflow to DSPy

# Compare execution patterns and outputs

Information Processing Benefits Matrix
CapabilityClaude Code AloneClaude Code + DSPyInformation Gain
File Operations ✓ Native ✓ Native No change
Git Commands ✓ subprocess ✓ subprocess No change
LM Reasoning Manual prompts Optimized prompts 2-3x accuracy
Multi-Step Logic Custom code Declarative modules 5x faster iteration
State Management JSON files JSON + DSPy state Better continuity
Sub-Agent Coordination Manual DSPy orchestration 10x easier
Learning from Examples Manual tracking Automatic compilation Systematic improvement
Meta-Process Observation
Key Insight: DSPy doesn't replace Claude Code—it amplifies Claude Code's capabilities for complex reasoning workflows. The integration creates a system where:
Claude Code handles all execution and environment interaction
DSPy handles all LM orchestration and reasoning optimization
Together they enable systematic, learning-amplified repository archaeology
Information Processing Principle: The combination addresses our core challenge—maintaining rapid OODA loops while building increasingly sophisticated mental models of the codebase. DSPy's automatic prompt optimization means each workflow execution teaches the system to be more effective.
Immediate Next Actions

1. Validate Integration (NOW):
   Install DSPy in Claude Code environment
   Run minimal integration test
   Document any compatibility issues
2. Prototype Migration (10 min):
   Take simplest git workflow component
   Implement in DSPy within Claude Code
   Compare to JSON-based approach
3. Decision Point (20 min):
   If integration successful → Full workflow migration
   If integration problematic → Document specific issues
   Either way → Clear path forward
   Observable Success Criteria:
   DSPy executes within Claude Code without errors
   Can access Claude Code's file system and git
   Provides tangible improvement in workflow clarity or capability

---

## Git History Archaeology Workflow: Implementation Brief

Executive Summary
Current State: Repository contains 5 preserved branches representing a parallel development attempt with unknown architectural decisions, stalled progress patterns, and unclear technical debt accumulation.
Core Objective: Extract actionable intelligence from git history to inform architectural decisions without repeating past failures.
Success Criteria:
Quantifiable understanding of development velocity decay patterns
Identification of architectural decision points with success/failure indicators
Discovery rate >5 novel insights per workflow execution
Prediction accuracy improvement >20% per iteration
Information Architecture
Observable Information Categories:
Temporal Patterns: Commit frequency, time-to-stall metrics, activity cycles
Structural Evolution: File creation/deletion rates, refactoring patterns, architectural pivots
Human Factors: Contributor patterns, handoff points, knowledge silos
Technical Debt Signals: TODO accumulation, fix/feature ratios, regression patterns
Hypothesis Framework:
H1: Stall points correlate with specific architectural complexity thresholds
H2: Commit message sentiment degrades before major pivots
H3: File change clustering reveals hidden dependencies
H4: Branch divergence patterns predict integration difficulty
Detailed Implementation Plan
Phase 1: Environment Setup & Baseline (15 min)
Step 1.1: Create Workflow Infrastructure

# Observable Actions:

mkdir -p .clmem/git-archaeology/{predictions,observations,scripts}
touch .clmem/git-archaeology/workflow-state.json
Information Captured:
Workflow execution history
Prediction/observation deltas
Model evolution tracking
Step 1.2: Establish Measurement Framework
{
"workflow_version": "1.0",
"execution_count": 0,
"current_hypotheses": {
"H1": {"confidence": 0.5, "evidence_count": 0},
"H2": {"confidence": 0.5, "evidence_count": 0},
"H3": {"confidence": 0.5, "evidence_count": 0},
"H4": {"confidence": 0.5, "evidence_count": 0}
},
"uncertainty_register": []
}
Step 1.3: Generate Initial Predictions

## Pre-Execution Predictions [Timestamp: X]

### Quantitative Predictions:

- Total commits across 5 branches: 500-800
- Major refactoring events: 3-5
- Stall point indicators: 2-3 per branch
- Active contributor count: 2-4
- TODO/FIXME accumulation rate: +20% over time

### Qualitative Predictions:

- Primary stall cause: Canvas-latent architectural complexity
- Commit message sentiment: Negative trend after 60% timeline
- Integration attempt evidence: 1-2 failed merges
  Phase 2: Data Extraction Pipeline (30 min)
  Step 2.1: Repository Landscape Analysis
  #!/bin/bash

# git_landscape_extraction.sh

echo "=== Execution Start: $(date -u +%Y-%m-%dT%H:%M:%SZ) ==="

# Observable: Branch topology

git log --graph --pretty=format:'%h -%d %s (%cr) <%an>' \
 --abbrev-commit --all --since="2024-06-01" > topology.txt

# Observable: Commit velocity per branch

for branch in feat/pond-demo-aug14 feat-pond-demo-aug14 \
 canvas-latent-core canvas-latent-integration canvas-latent-interaction; do
echo "Branch: $branch"
    git rev-list --count --since="2024-06-01" $branch
    git log --pretty=format:"%ad" --date=short $branch | \
        sort | uniq -c | awk '{print $2 "," $1}' > velocity_${branch//\//\_}.csv
done

# Observable: File change frequency heatmap

git log --pretty=format: --name-only --since="2024-06-01" | \
 sort | uniq -c | sort -rn | head -50 > file_change_frequency.txt
Information Yield Expectations:
Topology visualization for pattern recognition
Velocity curves revealing stall points
File hotspots indicating architectural stress
Step 2.2: Architectural Decision Mining

# Observable: Refactoring commits

git log --grep="refactor\|restructure\|migrate\|pivot" \
 --pretty=format:"%h|%ad|%s|%an" --date=short > refactoring_events.txt

# Observable: Architecture-related files

find . -name "_.md" -o -name "ARCHITECTURE_" -o -name "DESIGN\*" | \
 xargs -I {} sh -c 'echo "=== {} ==="; \
 git log --follow --oneline {} | head -10' > design_doc_evolution.txt

# Observable: Merge conflict patterns

git log --merges --pretty=format:"%h|%ad|%s" --date=short > merge_events.txt
Step 2.3: Technical Debt Archaeology

# Observable: TODO/FIXME evolution

git log -S"TODO\|FIXME\|XXX" --pretty=format:"%h|%ad|%s" \
 --date=short > tech_debt_timeline.txt

# Observable: Bug fix ratio

git log --grep="fix\|bug\|issue" --pretty=format:"%h|%ad|%s" \
 --date=short > bug_fix_timeline.txt

# Observable: Test coverage indicators

find . -name "_test_" -o -name "_spec_" | \
 xargs -I {} git log --follow --oneline {} | \
 wc -l > test_file_commit_count.txt
Phase 3: Pattern Analysis & Hypothesis Testing (20 min)
Step 3.1: Temporal Pattern Extraction

# analyze_velocity.py

import pandas as pd
import json

# Load velocity data

velocity*data = {}
for branch in ['feat_pond-demo-aug14', 'canvas-latent-core', ...]:
df = pd.read_csv(f'velocity*{branch}.csv', names=['date', 'commits'])
velocity_data[branch] = {
'peak_date': df.loc[df['commits'].idxmax()]['date'],
'stall_date': df[df['commits'] < 2].iloc[0]['date'] if len(df[df['commits'] < 2]) > 0 else None,
'total_active_days': len(df[df['commits'] > 0])
}

# Test H1: Stall correlation with complexity

stall_patterns = {
'avg_days_to_stall': None,
'stall_indicators': [],
'complexity_metrics': {}
}
Observable Outputs:
Velocity decay curves per branch
Stall point identification with preceding indicators
Complexity growth measurements
Step 3.2: Sentiment Analysis Pipeline

# Extract commit messages with temporal data

git log --pretty=format:"%ad|%s" --date=short > commit_messages_timeline.txt

# Categorize by sentiment indicators

grep -E "(struggling|stuck|broken|revert|hack|temp)" commit_messages_timeline.txt > negative_sentiment.txt
grep -E "(working|fixed|complete|success|implement)" commit_messages_timeline.txt > positive_sentiment.txt
Information Processing:
Calculate sentiment ratio over time
Identify sentiment inflection points
Correlate with architectural decisions
Phase 4: Synthesis & Model Update (15 min)
Step 4.1: Generate Observation Report

## Post-Execution Observations [Timestamp: Y]

### Quantitative Results:

- Actual total commits: \_\_\_
- Identified refactoring events: \_\_\_
- Stall indicators discovered: \_\_\_
- Active contributors: \_\_\_
- TODO/FIXME growth rate: \_\_\_%

### Pattern Discoveries:

1. [Specific pattern with evidence]
2. [Specific pattern with evidence]
3. [Specific pattern with evidence]

### Hypothesis Updates:

- H1 Confidence: 0.5 → **_ (Evidence: _**)
- H2 Confidence: 0.5 → **_ (Evidence: _**)
- H3 Confidence: 0.5 → **_ (Evidence: _**)
- H4 Confidence: 0.5 → **_ (Evidence: _**)
  Step 4.2: Update Mental Model
  {
  "execution_2_insights": {
  "novel_discoveries": [],
  "challenged_assumptions": [],
  "new_uncertainties": [],
  "next_investigation_targets": []
  }
  }
  Step 4.3: Generate Next Iteration Plan

## Iteration 2 Focus Areas

Based on Iteration 1 discoveries:

1. Deep dive into [specific commit range]
2. Investigate [specific file cluster]
3. Analyze [specific contributor's] decision patterns
4. Correlate [specific metrics]

Updated Predictions:

- [More specific prediction based on learning]
- [More specific prediction based on learning]
  Uncertainty Management Protocol
  Current Critical Uncertainties:
  Commit Classification Accuracy: How reliably can we identify architectural decisions from commit messages?
  Resolution: Manual sampling of 20 commits across categories
  Success Metric: >80% classification agreement
  Stall Point Definition: What constitutes a "stall" vs normal development pause?
  Resolution: Statistical analysis of commit frequency distributions
  Success Metric: Clear statistical threshold (e.g., 2 std dev below mean)
  Branch Interdependency Measurement: How to quantify coupling between parallel branches?
  Resolution: File overlap analysis + merge conflict frequency
  Success Metric: Correlation coefficient >0.7
  Meta-Process Documentation
  Workflow Efficiency Metrics:
  Information extraction rate: **_ insights/minute
  Prediction accuracy delta: _**% improvement
  Uncertainty resolution rate: **_ questions answered per iteration
  Tool optimization opportunities: _**
  Learning Amplification Strategy:
  Each iteration reduces search space by ≥30%
  Prediction confidence must increase monotonically
  Novel discovery rate target: ≥3 per iteration
  Uncertainty count should decrease by ≥2 per iteration
  Concrete Next Actions (Prioritized)
  Immediate (0-5 min):
  Execute Phase 1 setup scripts
  Record initial predictions with confidence levels
  Start Phase 2.1 landscape extraction
  Short-term (5-30 min):
  Complete full data extraction pipeline
  Run initial pattern analysis
  Document first 5 discoveries
  Iteration 2 Prep (30-45 min):
  Analyze prediction accuracy
  Identify top 3 investigation targets
  Refine extraction scripts based on learnings
  Update hypothesis confidence levels
  Meta-Observation: This workflow treats git history as an archaeological site where each commit is an artifact revealing decision-making patterns. The goal isn't just to catalog what happened, but to build a predictive model of why development stalled and where similar patterns might emerge.

---

## How I've Run Major Projects

My few most productive individual weeks at Anthropic have all been “crisis project management:” coordinating major, time-sensitive implementation or debugging efforts. In a company like Anthropic, excellent project management is an extremely high-leverage skill, and not just during crises: our work has tons of moving parts with complex, non-obvious interdependencies and hard schedule constraints, which means organizing them is a huge job, and can save weeks of delays if done right. Although a lot of the examples here come from crisis projects, most of the principles here are also the way I try to run any project, just more-so. I think excellent project management is also rarer than it needs to be. During the crisis projects I didn’t feel like I was doing anything particularly impressive; mostly it felt like I was putting in a lot of work but doing things that felt relatively straightforward. On the other hand, I often see other people miss chances to do those things, maybe for lack of having seen a good playbook. So here’s an attempt to describe my playbook for when I’m being intense about project management. (I’ve described what I did as “coordinating” above, but that’s underselling it a bit; it mattered a lot for this playbook that I had enough technical context, and organizational trust, to autonomously make most prioritization decisions about the project. Sometimes we instead try to have the trusted decisionmakers not be highly involved in managing execution, and instead farm that out to a lower-context or less-trusted project manager to save the trusted decisionmaker time, but IMO this is usually a false economy for projects where it’s critical that they be executed well.) Focus For each of the crisis management projects I completely cleared my schedule to focus on them, and ended up spending 6+ hours a day organizing them. This is a bit unintuitive because I’m used to thinking of information processing as basically a free action. After all, you’re “just” moving info from place to place, not doing real work like coding, right? But if you add it all up—running meetings, pinging for updates, digesting Slack threads, pinging for updates again, thinking about what’s next, pinging for updates a third time, etc.—it’s surprisingly time-intensive. Even more importantly than freeing up time, clearing my schedule made sure the project was the top idea in my mind. If I don’t do that, it’s easy for me to let projects “go on autopilot,” where I keep them running but don’t proactively make time to think through things like whether we should change goals, add or drop priorities, or do other “non-obvious” things. For non-crisis projects, it’s often not tenable (or the right prioritization) to spend 6+ hours a day project-managing; but it’s still the case that you can improve execution a lot if you focus and make them a top priority, e.g. by carving out dedicated time every day to check statuses, contemplate priorities, broadcast updates, and so on. Maintain a detailed plan for victory A specific tool that I’ve found critical for staying oriented and updating quickly is a detailed plan for victory, i.e., a list of steps, as concrete as possible, that end with the goal being achieved. The plan is important because whether or not we’re achieving the plan is the best way to figure out how well or badly things are going. Knowing how well or badly things are going is important because it tells me when to start asking for more support, cutting scope, escalating problems, and otherwise sounding more alarms. One of the most common megaproject failure modes is to not freak out soon enough, and having a concrete plan is the best antidote. As a both positive and negative example of this, during a recent sprint to release a new implementation of a model, we took a detailed accounting of all the work we thought we had to do to launch. On the plus side, this made it clear three months before launch that things were going to be very tight, and this enabled us to ask for help from another team, who loaned us someone who sped up the project a fair amount. On the minus side, we also massively underestimated a few components of the project, and because of this, we still ended up very crunched at the end. As the above example shows, having a plan can’t completely save you if you underestimate how long all the steps in the plan will take. But it certainly helps! My sense is that the main things that would have helped even more in the above case were: We were inexperienced at estimating tasks, especially tasks related to new model implementations (which most people on the team were too new to have done before), and we were too cowardly to add the requisite amount of “slop” to our plan. We didn’t check in frequently enough against the plan once we made it, or sound the alarm early enough when we went off-plan. Run a fast OODA loop OODA stands for “observe, orient, decide, act”—in other words, the process by which you update your plans and behavior based on new information. Most of the large projects I’ve worked on have been characterized by incomplete information: Our cluster’s networking is bad, but we don’t understand why. We have a correctness bug but we don’t know where it is. We need to rewrite the system but we’re not totally sure what the rewrite should look like. In fact, I’d make a stronger claim: usually getting complete information was the hard part of the project, and took up a substantial fraction of the overall critical-path timeline. For example, let’s take a recent project to kick off a training run. The critical path probably looked something like: Chips for the training run are delivered We run some tests We discover one aspect of performance is unexpectedly poor We escalate the problem with our compute partner Compute partner staffs a large debugging effort We realize we had given our compute partner an outdated benchmark that is causing them to target the wrong improvements Compute partner switches benchmark and prioritizes different improvements We share our benchmarks with compute partner so they can run the exact same code as us Compute partner rolls out improvements We test the improvements Performance is still poor and we tell them that Repeat steps 8-10 until eventually it’s good enough Practically all of these steps are about information-processing, not writing code! Even the step where the compute partner debugged the problems on their side was itself constrained by information processing speed, since there were tens of people working on the debugging effort and coordinating / sharing info between them was difficult. Overall, the project timeline was strongly constrained by how quickly information could round-trip from our compute partner’s large-scale debugging effort, through their tech lead, me, and Anthropic’s large-scale debugging effort. This pattern generalizes to most projects I’ve been a part of, and as a result, one of my most productive project management habits is to try to run the fastest OODA loop that I can. A few specific things that I’ve found help: Spend time on it: running OODA loops takes time, and is one of the primary reasons that, as mentioned above, I usually spend 6+ hours a day on running a megaproject if it’s in crisis mode. Communicate uncomfortably much: For the training run debugging, to reduce the round-trip time between orgs as much as possible, I had multiple daily calls with my counterpart at our compute partner (9am and 6pm). For the model implementation effort, I was basically constantly bouncing between different groups of debuggers, asking for updates and processing them. Track and prioritize the biggest open questions: For most big projects I’ve maintained a living doc with a ranked list of all my biggest open questions about the project. Resolving or de-risking these uncertainties basically turns into the project’s priority list. Ideally, there are enough people working on the project that we can work on resolving multiple of the uncertainties in parallel, since that’s one of the best ways to speed things up. (And for a project in “crisis mode,” if we have more top priorities than we can parallel-path with the current set of people working on the problem, that’s also a good test for whether it’s time to pull in more folks.) Step back and reorient frequently: Other than asking for updates, the main thing I spend time on was reorienting—looking at our list of priorities, asking myself whether they should still be the top priorities, then looking at what people were working on, and making sure those things were attacking the top priorities. I probably reviewed the project’s priorities multiple times a day as well, although I often didn’t make changes as a result. (Note that it is possible to change what people are working on too often, since switching tasks is costly. Parallelizing work on the top few priorities, as mentioned above, helps with this, since if you decide that priority #3 is now #1, but there are 2 people working on each, then nobody has to switch tasks. The thing that kills you is when no one is working on the new priority #1.) Overcommunicate It’s not just enough for me personally to be running a fast OODA loop—in a large group, everyone needs to be autonomously making frequent, high-quality, local prioritization decisions, without needing a round-trip through me. To get there, they need to be ambiently aware of: what else is going on around them, so they can coordinate and update on new info quickly (“oh, we’re planning to kick off the next derisking run in three days, so I have to have my new RL environment ready and tested by then”) how their goal fits into the overall project, so they can make correct decisions about the details of their approach (“we’re trying to scale up as much as possible right now, so this direction isn’t valuable to pursue since it could never provide the scale of data we need”) I’ve usually found that to create the right level of ambient awareness, I have to repeat the same things way more often than I intuitively expect. This is roughly the same “communicate uncomfortably much” principle above, but applied to broadcasts and not just 1:1 conversations with people. For example, although the first team I managed at Anthropic started with a daily asynchronous standup, we found that synchronous meetings were much more effective for creating common knowledge and reorienting, so we moved to a twice-weekly synchronous standup, which probably qualified as “uncomfortably much” synchronous communication for Anthropic at the time. Break off subprojects Once a project gets over maybe 10 people, I can’t track everything myself in enough detail to project-manage the entire thing myself. At this point, it becomes critical to delegate. Here I mean delegating the project management, not just the execution (that’s what I’d be delegating to the first 10 people). This is the point where I need other people to help split up the work, monitor and communicate progress, escalate blockers, etc. A few things I try to keep in mind when delegating project management: The ideal unit of delegation is a crisp, simple, high-level goal, with limited overlap with other workstreams. (This is as opposed to, e.g., a list of tasks like “see if X helps.“) Good examples: “get X training technique working over Y networking protocol at Z throughput,” “get identical evals between model implementations A and B.” Bad examples: “follow this 10-step checklist that we hope results in training working,” “try these 3 techniques for debugging the loss eval.” The best project-managers are often not the strongest technical ICs. Instead the most important traits are that they’re highly organized and great at staying laser focused on end goals, perhaps to the point of being annoying about it. IC depth helps and I’ll never say no to it, but it’s not what I’d optimize for. People running subprojects are probably also doing a lot of the same stuff I do, in particular e.g. spending a lot of time on it. That means they’ll take a substantial hit to their IC productivity. This is expected, and is often worth it. “Direction is more important than magnitude”—it’s usually better to have a lower-velocity project that works on the right things, than a higher-velocity one that’s pointed at the wrong goal. One of my favorite things to make delegation easier is to keep goals simple—if they can fit in a Slack message while still crisply describing a path to the desired end state, then the people working on the goal will be much more able to prioritize autonomously, and point their work at the real end goal rather than doing something that turns out to be useless for some reason they didn’t think about. “Keep goals simple” doesn’t have to mean “do less”—the best way to keep goals simple is to find the latent structure that enables a clean recursive decomposition into subgoals. This often requires a deceptive amount of work—both cognitive and hands-on-keyboard—to identify the right intermediate goals, but I’ve found that it pays off immensely by clarifying what’s important to work on. Have fun Some of my favorite memories of Anthropic are of helping out with these big projects. While they can be intense, it’s also really inspiring to see how our team comes together, and the feeling of being part of a big team of truly excellent people cooking something ambitious together can be really magical! So I try to enjoy the chaos :) Appendix: my project DRI starter kit Here’s the internal doc I share with folks on my team who are getting into being responsible for large projects. So you’re the DRI of a project (or part of one). Concretely, what do you do to “be DRI”? This doc is my suggested “starter kit” answer to that question. The habits and rituals described here aren’t perfect for every situation, but they’re lightweight and broadly helpful. I suggest you use them as a starting point for iteration: try them out, then adjust as necessary. This is an SL init; the RL is your job :) Goals of this playbook The goal is to help you do your job as DRI— Make your project go quickly: Participants deeply understand the root goal and can autonomously choose the most important next things to work on People have “situational awareness” of what other people are working on, learn about relevant updates quickly, and coordinate quickly when needed People get quick feedback on their work If things aren’t going fast enough, you (the DRI) can notice and course-correct quickly “Play well with others:” Observers can figure out where to go to follow along Adjacent or intersecting people/projects don’t miss important updates or get caught by surprise People notice quickly if the project is behind or off-track, and can identify opportunities to help —without adding too much overhead: <1 hour of setup to make a working doc, schedule a weekly meeting, etc. 30 min/week of meetings 15-30 min/week to write an update (Note: being DRI will still unavoidably add some overhead—e.g. you’ll have to track what other people are doing, delegate work, unblock people, set and communicate goals, etc. The goal is specifically for the process/paperwork to be minimal.) Weekly meeting You should schedule at least one 30-minute weekly meeting with everyone working on the project. The goal of this meeting is to (1) be a backstop for any coordination that needs to happen and didn’t happen asynchronously; (2) be an efficient way to create common knowledgeof goals, updates, etc.; (3) help you track whether things are going well. Starter-kit agenda: [5m] DRI reviews major updates from last week and sets goals for next week [10m] Silent write and comment on discussion topics [10m] Synchronous discussion of most important things not addressed during silent write Signs that more meetings might help (e.g. a second weekly standup): you have a very tight deadline and can’t afford to lose time people aren’t working on the most important thing people need feedback frequently people step on each others’ toes or miss opportunities to help each other out if you just like hanging out with each other :) Landing page / working doc It’s really helpful for discoverability and wayfinding to have a single “master doc” with all the most important info about a project. As you loop more people in, they can read the doc to get up to speed. And anyone who thinks “I wonder how X is going” can stop by there to find out. Create a doc for your workstream with: A go/ link in the name (if a subproject, maybe use go/project/subproject) → This makes it easier to find quickly (search is kinda rough) A clear description of a concrete top level goal and how it fits into broader goals → This is critical info for participants, so they can autonomously prioritize the most important things; and for observers, so that they know what outcome to expect. Staffing: A list of people working on the project, your name as the DRI, and a link to the slack channel that’s being used for discussion Links: A short list of relevant links at the top (work trackers, the project’s Slack channel, major design docs, etc.). If needed, a longer “docs / see also” section later links to relevant docs. → It’s really easy to lose track of relevant docs otherwise! A roadmap section with intermediate goals and target dates → See the section on plans; these will help people understand what the overall shape of the project is expected to be. A section for “running notes” containing meeting notes from your weekly meetings (and any other ad-hoc meetings) and broadcast updates → This really helps observers and new-joiners get up to speed! I like maintaining a list of important open questions / uncertainties/ risks and updating it over time. This helps me stay focused on removing risk from the project as quickly as possible. If it’s part of a larger project, your doc should be nested within the larger project’s working doc. If this ends up being too much for one doc, you can fork these out into sub-docs (esp. running notes and updates). Plan / roadmap / milestones In your working doc, include a section with some intermediate goals and dates by which you hope to accomplish them. → This is helpful mostly for noticing you’re off track or behind without getting frog-boiled. → Or noticing when you need to make a direction change because the intermediate goals don’t seem good anymore. You might feel some pressure to add false certainty or precision, but avoid this and be honest about your uncertainty instead. For a lot of research projects it’s hard to plan more than a couple weeks ahead. You can make the milestones fuzzier / more aspirational beyond that, or just drop them. I often find it helpful to phrase milestones in probabilitis and distributions (e.g. “my 90% confidence interval for this date is X-Y” or “I think there’s a 75% chance this technique works”) Who’s working on what You should have something somewhere that describes what people are working on. The minimum viable version of this is a list of what people are working on in your working doc. If you end up with a large set of tasks and a big backlog, maybe use a checklist and/or move to a subdoc. Stack rank your work list. It’s really important for people to understand priorities! If there’s more different people/TODOs, I suggest using some app to make a kanban board with “backlog” / “up next” / “in progress” / “done” columns. This is probably most helpful for more deterministic/plannable projects where there’s a clear backlog + set of future tasks, and a lot of things you need to remember to do. If you have an external task tracker, link it in the wiki section of the working doc. Slack norms Have conversations about the project in a Slack channel (not DMs). Reference the channel in your working doc. Link the working doc in the Slack channel bookmarks. Cross-post notebook posts and experiment write-ups into the channel so observers don’t have to follow tons of notebook channels. Do not use DMs. These make it hard to make info discoverable or share it further. If people send you important stuff in a DM, ask them to put it in the project channel. If you need confidentiality, make a private channel. Avoid centithreads. Most ≥10-message Slack threads would be better as a ~5-minute Tuple. (This is hard to do with people who are in tons and tons of meetings like execs. But you should try to do it for others.) If you end up with a centithread, assume nobody will read it; post a summary back to the channel afterwards. Bias towards fewer, larger, noisier channels. The right time to create a channel is when discussion is either not happening, or getting lost. → Too many slack channels makes it harder to manage membership, decide where to put things, or find where discussion is happening. Channel organization and membership matters. Invest in routing conversations to the right place and curating the channel “architecture.” Weekly broadcast updates Once a week, probably either just before or just after your weekly meeting, write up a brief update for a broader audience with: The overall vibe What’s changed since last update What’s coming up next When writing these updates, optimize for signal to noise ratio. Err towards concision No “we worked on X”—tell me “we accomplished Y” or “we learned Z” Remember your audience (= people not familiar with the project) State things crisply and concretely (“X improves eval Y by Z points,” not “we got X working”) Leave out anything that’s not actionable—you don’t need to be exhaustive Post the update in your project Slack channel, and cross-post it to other relevant channels (e.g. a larger “megaproject” channel) if necessary. If your project is part of a larger megaproject, these updates might feed into something broader like a weekly meeting of DRIs or an aggregated status update. Retrospectives Every so often, step back and ask “how could the last X weeks have gone better?” Frequency depends on how much there is going on—every 2 weeks is good if there’s a lot, maybe every 4-8 weeks for smaller projects Suggested meeting format Friday afternoon [13 min] Async brainstorm 2 lists of items: “what went well” / “what we could improve” [2 min] Dedupe topics and emoji vote by putting :heavy_plus_sign: next to ones you agree with Sort “what we could improve” by highest votes [10 min] Synchronous discussion of top points (either highest voted or flagged by DRI); figure out action items Thanks to Kelley Rivoire for many thoughtful comments on a draft!

---

## Hierarchical Agency

The most ambitious direction I've worked on in the past few years is a theory of hierarchical agency (as mentioned in the ACS announcement). Recently, I've become worried that the inferential distance between "the median of current AI safety discourse" and "what I and my colleagues at ACS work on" has become too large. After multiple attempts to write a good introduction to hierarchical agency ended up in perpetual draft form, I decided to try something else: explain it to Claude. This is a lightly edited transcript of the first part of our conversation. Claude Shall we begin? Could you start by explaining what you mean by "hierarchical agency" and why you think it's important for AI safety? Jan Broadly, there is a pattern in the world where you can often see agents composed of other agents. Like, corporations and their departments, states and citiziens, and so on. Claude So you're looking at nested or layered structures of agency - where agents can contain or be made up of other agents. Let me test my understanding with some examples and their properties: A corporation as an agent that can make decisions and take actions, but it's composed of departments (also agents) which are in turn composed of individual human agents? States acting as agents while being composed of various bureaucracies and ultimately individual human officials and citizens? Would biological examples also fit this pattern? Like how a human body could be seen as an agent composed of organs (which have their own regulatory systems) and cells (which make their own decisions about things like protein production)? I'm curious about what makes this perspective particularly relevant for AI safety Jan I hope to get to AI safety relevance later. Yes, biological examples fit well - particularly multicellular organisms, which demonstrate emergent agency at multiple scales. To better define the boundaries of hierarchical agency, it might help to examine some edge cases and non-examples. Claude Let me probe the boundaries systematically by analyzing different types of systems: A crowd of people in a mall - they're a collection of agents, but are they a cohesive higher-level agent? My guess is no, because there's no real coordination or unified decision-making? A computer network - it's a connected system of parts, but do the individual computers act as agents in a meaningful way? And does the network itself have agency? An ecosystem - while it's a system of living agents (animals, plants), would you consider the ecosystem itself an agent? A social insect colony - this might be closer to your multicellular example, but I'd be curious where you see it fitting or not fitting? Am I on the right track with these examples? What makes some collections of agents form a meaningful higher-level agent while others don't? Jan The question of what makes something a real superagent versus just a bunch of agents hanging out together is super interesting. I don't have a satisfactory answer yet, but empirically, you can ask it makes sense to model the collective as an agent. I usually operationalize this using Dennett's three stances perspective - do you know these? Claude Yes! If I recall correctly, Dennett proposed three levels or stances for understanding/predicting behavior: Physical stance - predicting based on physical laws Design stance - predicting based on how something is designed/supposed to function Intentional stance - predicting by attributing beliefs, desires, rationality (treating as an agent) So, if I'm understanding you correctly, you're suggesting that what makes something a "higher-level agent" is whether taking the intentional stance towards the collective is actually useful/predictive? Let me test this understanding: An ant colony: Treating it as an agent with goals (survive, grow, protect queen) might be more useful than trying to predict its behavior just from individual ant interactions A random crowd: Probably better predicted by understanding individual human behavior and physical crowd dynamics A corporation: Often very useful to model as an agent with goals, strategies, beliefs about the market, etc. Is this the kind of distinction you mean? Jan You get it. In thinking about hierarchical agency, I'm interested in systems where there are at least two layers where it is useful to think about both layers as agentic, let's say a superagent composed of subagents. Now, having this concept, I want to make a bold claim: I think a critical missing piece for AI safety and AI alignment is we lack a good mathematical formalism for describing these systems - at least as far as I know. You would probably ask what I mean by 'good', so I'll spell it outright. My desiderata are objects at different levels of the hierarchy are of the same type; for a negative example, formalism where on lower layer you have agents, they vote, and the result of aggregation is 'contract', which is different type than agent, is not good enough. In other words, the theory is scale-free. I want something expressive enough to describe real-world situations; The objects are type 'agent', i.e. somehow represent intentionality Claude Let me break this down to make sure I understand your criteria: Type consistency across levels: Could you confirm if this example captures what you mean: Good: A formalism where both OpenAI (superagent) and employees (subagents) are represented by the same type of mathematical object Not good: A formalism where individual workers are "agents" but their collective becomes a different mathematical type like "contract" When you say "expressive enough to describe real-world situations" - could you give an example of the kind of real-world complexity this formalism should be able to capture? I'm imagining things like partial alignment between levels or conflicts between levels For representing intentionality - does this mean the mathematical objects should somehow capture things like goals, beliefs, and decision-making? Similar to how we might model an agent in decision theory or game theory? Also, I'm curious - have you seen formalisms that satisfy some but not all of these criteria? Jan Yes Yes: I want to be able to describe situations like conflicts between layers, or interactions where the superagent gains agency at the expense of subagents. Yes. For example, Scott Garrabrant has a nice stab roughly at this direction, called Cartesian Frames, but the mathematical objects involved are more suitable for representing actions than beliefs, goals or intentionality. Actually, you have better overview of all mathematical formalisms invented: you read it all, so maybe you can try to come up with some of them and check if they fulfill the criteria? Claude Let me think about mathematical formalisms I'm aware of that might be relevant: Game Theory: Captures intentionality (preferences, strategies) Can represent nested games But: Usually different types at different levels (players vs coalitions vs games themselves) Category Theory: Good at compositionality and type consistency Objects compose into objects of same type But: Abstract away too much of the intentional content? Real world relevance? Classical Multi-agent Systems: Good at representing intentionality Can model interactions But: Usually flat structure, not hierarchical? Markov Decision Processes: Can capture decision-making Can be nested (hierarchical MDPs) But: More focused on actions/policies than beliefs/goals? Economic Mechanism Design: Models incentives and preferences Can handle multiple layers of interaction But: Different mathematical objects at different levels (agents vs mechanisms) Am I missing any obvious formalisms? Would combining aspects of these get closer to what you're looking for? Jan Clearly related field is public choice. Less obvious, active inference Claude Let's explore these: Public Choice Theory: Deals with collective decision-making Models how individual preferences aggregate into institutional decisions Might offer insights about inter-level dynamics But: Does it typically treat the collective level as the same type of agent as individuals? Active Inference: Models agents as minimizing free energy/surprise Can handle hierarchical structures (hierarchical predictive coding) Has a unified mathematical framework across levels This seems potentially promising! Let me try to understand why active inference might be relevant here: It models both perception and action in terms of belief updates Could potentially represent both subagents and superagents as systems trying to minimize surprise Might capture interactions between levels as bidirectional prediction/control flows Am I getting warm? Could you explain what aspects of these frameworks you find relevant to hierarchical agency? Also, this makes me wonder: are you looking for a formalism that could capture how different levels of agency might have different models/beliefs about the world and each other? Like how a corporation might have a different "view" of reality than its individual employees? Jan Yes. You are actually pretty good at this. What I like about active inference in this context is it tries to express everything as the same type - roughly "beliefs". Also, in its more neuro-inspired versions, assumes bidirectional control/prediction flows is what happens in human brain. Yes: I want something which is expressive enough to allow different beliefs on different levels. Also I want something allowing to have "goal-oriented beliefs" or "goals" concerning other layers. For example, corporation having an instrumental goal of their employees being more loyal. Given you get this, I think we can move to your previous question "how is this related to AI safety" - or we should clarify more? Claude Yes, I think I understand enough of the core concept to explore its relevance to AI safety. Let me venture a guess about some potential connections to AI safety: If we're creating powerful AI systems, they might become part of hierarchical agency structures (either as subagents or superagents). Without a good formal understanding of hierarchical agency, we might miss critical dynamics. Maybe current alignment approaches are too focused on single-agent scenarios, when in reality AI will exist within complex hierarchical structures? The ability to have "goal-oriented beliefs" about other layers seems particularly relevant - like how an AI system might develop instrumental goals about its human users/creators. Am I on the right track? Jan Broadly correct direction in case of 1. and 2., but actually I want to describe more ambitious vision. How I think about it is using a metaphor of "game theory". Think about how humans understood cooperation and conflict before the mathematical formalization by von Neumann, Schelling, and others. There was lots of informal understanding scattered across diverse domains - military strategy books, gambling theory, board games, even ethical treatises. I suspect most people at the time didn't see this as an area where mathematics could be useful - sure, math worked great for physics, but concepts like cooperation or defection seemed like fuzzy human things. Yet I imagine a mathematically-minded person looking across these domains might have noticed something interesting: similar patterns of incomplete understanding showing up in contexts as different as warfare and board games, suggesting a deeper mathematical structure waiting to be discovered. Claude Let me see if I understand the parallel you're drawing: Before game theory, understanding of strategic interaction was: Scattered across diverse domains (military, games, ethics) Largely informal/intuitive Not obviously "mathematizable" Had similar patterns that weren't formally unified You see hierarchical agency in a similar position now: We see it everywhere (corporations, states, biological systems) We have informal understanding in different contexts The patterns are similar but not formally unified Most people might not see it as something that could/should be mathematized And you're suggesting that just as game theory provided a unified mathematical framework that: Revealed deep connections between seemingly different phenomena Allowed for more rigorous analysis Led to new insights and predictions Became crucial for understanding modern systems (economics, nuclear deterrence) You're aiming for a similar mathematical unification of hierarchical agency? Is this capturing your vision correctly? And if so, what do you see as the "similarly shaped holes" across different domains that your formalism would help fill? Jan Yes, you got this right. The "similarly shaped holes" are a bit of a rabbit hole we can spend a lot of time on. I'd like to connect this to AI safety in a way that hopefully makes the relevance clear. One of the safety relevant holes is "how AI deals with different objectives". You can imagine in the training AI learns about different goals, and the result is you can think about the AI being composed of various "smaller AIs", tracking different things. For example, let's say part of the AI "cares" or "predicts" or whatever you prefer ... answers oriented toward helpfulness to the human user. Another about "harmlessness". And so on. Further, you can think about the AI undergoing some process where these parts interact, and the "whole" evolves. For example, you can imagine yourself having these various drives, and preparing data for your further training. Claude Let me try to unpack this through a few lenses to make sure I understand: Internal structure of AI systems: Rather than a single monolithic objective/agent Multiple "subagents" tracking different objectives These might interact/negotiate like parts of ourselves do The whole system emerges from these interactions So for example: Part of me wants to be helpful to others Part wants to protect myself Part focuses on truth-telling Part manages social reputation And these interact to produce behavior? Training dynamics: If I understand correctly, you're suggesting that: During training, different "parts" might develop to track different objectives These parts then interact/evolve The AI might even participate in shaping its own further training Let me test my understanding with a concrete example: When I (Claude) respond to a user, there might be different "subagents" considering: Helpfulness to the user Truthfulness/accuracy Safety considerations Social appropriateness And my responses emerge from some interaction between these? Is this the kind of dynamic you're trying to formalize? And would your formalism help us understand: How these subagents might develop during training How they interact to produce behavior How the system as a whole might evolve Potential conflicts or alignment issues between levels Am I getting closer to what you mean by this particular "hole" that needs filling? Jan Yes, a bit more the points 2,3 and 4. I hope the formalism may help with problems like ... what Richard Ngo calls "Value systematization" or the problem me I described in "Self-unalignment problem", where the AI faces the problem how to align with self-unaligned human. Do you vaguely remember these? Claude I will try to recall and connect these ideas: From what I remember, "Value systematization" refers to the challenge of how an AI system could/should resolve conflicts or contradictions in human values - not just implementing fixed values, but engaging in some kind of philosophical reasoning about values. The "Self-unalignment problem" deals with how an AI should handle the fact that humans themselves often have conflicting values, aren't fully aligned with their own stated goals, and change over time. So if I'm connecting this to hierarchical agency: These problems involve multiple levels of agency and belief/value structures They involve complex interactions between levels (AI trying to understand/systematize human values, humans trying to understand their own values) There's a question of how different "parts" or "levels" should interact and resolve conflicts Would your formalism help by providing a way to: Model how different levels of values/beliefs interact Understand how systematization of values could emerge from these interactions Analyze what "alignment" even means in such hierarchical systems Perhaps suggest principles for how an AI should approach these challenges? Jan Yes:  my guess is a good formalism would help with all of these. In essence, I'm seeking a game theory-esque breakthrough for hierarchical agency — a simple yet powerful formalism that captures the essence of multi-layered intentional interactions. Claude So, you believe a good formalism for hierarchical agency could: Give us precise ways to talk about nested intentionality and belief structures Provide core concepts/principles about how different levels of agency interact Help analyze everything from internal AI value conflicts to human-AI alignment Make previously fuzzy ideas (like "value systematization") more tractable Would it be fair to say you're looking for the hierarchical agency equivalent of concepts like Nash equilibrium - simple but profound ideas that emerge once you have the right mathematical framework? I'm curious - do you see any candidate concepts that might play this role? Things that seem like they might be fundamental to understanding hierarchical agency, but we lack the formal tools to properly analyze them yet? Jan Yes. I hope to return to the formal concepts later. Less formally, I think something like Holy grail here is to have formalization which is suitable for expressing concepts like 'kindness'. I often think it makes sense to think about individual human mind using the hierarchical agency frame. And, in this case, empirically, I would say people have different internal architectures. As a human, you (the superagent) can do different things with your internal conflicts. For example, we sometimes try to supress or even delete some of our parts. Some people seem to have something like "internal dictatorship", where a lot of their motivations or parts are suppressed. Personally, I strive for cooperative, win-win relationships, where my different desires "trust the whole". Ideally, I would like something where we express thing like the superagent being kind to the subagents, or a dynamic of value evolution we would consider fair. Claude I'll try to unpack several layers here: Internal Architecture Patterns: "Internal dictatorship" - suppressing/controlling subagents "Internal democracy/cooperation" - seeking win-win solutions "Internal understanding" - cultivating trust between levels Am I right that you see these as different ways the superagent-subagent relationship can be structured? Values at Meta-Level: If I understand correctly, you're suggesting we need formalism that can express not just object-level values, but meta-level values about how different levels of agency should interact. Like: Kindness Fairness in value evolution Trust between parts and whole This makes me think about therapeutic approaches to internal conflict. For example: Internal Family Systems therapy sees internal parts as subagents and emphasizes compassionate leadership from the "Self" Some meditation practices aim to cultivate a kind awareness of all mental states Psychological integration vs suppression of traits/desires Would your formalism aim to capture what makes some of these approaches "healthier" or "more ethical" than others? And could this then inform how we think about AI systems managing their internal conflicts or interacting with humans? Is this getting at what you mean by expressing values like "kindness" in the context of hierarchical agency? Jan Yes. To be continued. I'm interested in feedback about the format: is it useful? Would be better if the conversation was more or less condensed? If Claude was simulating someone more or less informed? This has various downsides, like difficulty in coordinating with other people, incomprehensibility to funders, etc.

---

## Goodhart Taxonomy

Goodhart’s Law states that "any observed statistical regularity will tend to collapse once pressure is placed upon it for control purposes." However, this is not a single phenomenon. I propose that there are (at least) four different mechanisms through which proxy measures break when you optimize for them. The four types are Regressional, Causal, Extremal, and Adversarial. In this post, I will go into detail about these four different Goodhart effects using mathematical abstractions as well as examples involving humans and/or AI. I will also talk about how you can mitigate each effect. Throughout the post, I will use V to refer to the true goal and use U to refer to a proxy for that goal which was observed to correlate with V and which is being optimized in some way. Quick Reference Regressional Goodhart - When selecting for a proxy measure, you select not only for the true goal, but also for the difference between the proxy and the goal. Model: When U is equal to V+X, where X is some noise, a point with a large Uvalue will likely have a large V value, but also a large X value. Thus, when U is large, you can expect V to be predictably smaller than U. Example: height is correlated with basketball ability, and does actually directly help, but the best player is only 6'3", and a random 7' person in their 20s would probably not be as good Causal Goodhart - When there is a non-causal correlation between the proxy and the goal, intervening on the proxy may fail to intervene on the goal. Model: If V causes U (or if V and U are both caused by some third thing), then a correlation between V and U may be observed. However, when you intervene to increase U through some mechanism that does not involve V, you will fail to also increase V. Example: someone who wishes to be taller might observe that height is correlated with basketball skill and decide to start practicing basketball. Extremal Goodhart - Worlds in which the proxy takes an extreme value may be very different from the ordinary worlds in which the correlation between the proxy and the goal was observed. Model: Patterns tend to break at simple joints. One simple subset of worlds is those worlds in which U is very large. Thus, a strong correlation between U and V observed for naturally occuring U values may not transfer to worlds in which U is very large. Further, since there may be relatively few naturally occuring worlds in which U is very large, extremely large U may coincide with small Vvalues without breaking the statistical correlation. Example: the tallest person on record, Robert Wadlow, was 8'11" (2.72m). He grew to that height because of a pituitary disorder, he would have struggled to play basketball because he "required leg braces to walk and had little feeling in his legs and feet." Adversarial Goodhart - When you optimize for a proxy, you provide an incentive for adversaries to correlate their goal with your proxy, thus destroying the correlation with your goal. Model: Consider an agent A with some different goal W. Since they depend on common resources, W and V are naturally opposed. If you optimize U as a proxy for V, and A knows this, A is incentivized to make large U values coincide with large W values, thus stopping them from coinciding with large Vvalues. Example: aspiring NBA players might just lie about their height. Regressional Goodhart When selecting for a proxy measure, you select not only for the true goal, but also for the difference between the proxy and the goal. Abstract Model When U is equal to V+X, where X is some noise, a point with a large U value will likely have a large V value, but also a large X value. Thus, when U is large, you can expect V to be predictably smaller than U. The above description is when U is meant to be an estimate of V. A similar effect can be seen when U is only meant to be correlated with V by looking at percentiles. When a sample is chosen which is a typical member of the top p percent of all U values, it will have a lower V value than a typical member of the top p percent of all V values. As a special case, when you select the highest U value, you will often not select the highest Vvalue. Examples Examples of Regressional Goodhart are everywhere. Every time someone does something that is anything other than the thing that maximizes their goal, you could view it as them optimizing some kind of proxy (and the action to maximize the proxy is not the same as the action to maximize the goal). Regression to the Mean, Winner’s Curse, and Optimizer’s Curse are all examples of Regressional Goodhart, as is the Tails Come Apart phenomenon. Relationship with Other Goodhart Phenomena Regressional Goodhart is by far the most benign of the four Goodhart effects. It is also the hardest to avoid, as it shows up every time the proxy and the goal are not exactly the same. Mitigation When facing only Regressional Goodhart, you still want to choose the option with the largest proxy value. While the proxy will be an overestimate it will still be better in expectation than options with a smaller proxy value. If you have control over what proxies to use, you can mitigate Regressional Goodhart by choosing proxies that are more tightly correlated with your goal. If you are not just trying to pick the best option, but also trying to have an accurate picture of what the true value will be, Regressional Goodhart may cause you to overestimate the value. If you know the exact relationship between the proxy and the goal, you can account for this by just calculating the expected goal value for a given proxy value. If you have access to a second proxy with an error independent from the error in the first proxy, you can use the first proxy to optimize, and the second proxy to get an accurate expectation of the true value. (This is what happens when you set aside some training data to use for testing.) Causal Goodhart When there is a non-causal correlation between the proxy and the goal, intervening on the proxy may fail to intervene on the goal. Abstract Model If V causes U (or if V and U are both caused by some third thing), then a correlation between V and U may be observed. However, when you intervene to increase U through some mechanism that does not involve V, you will fail to also increase V. Examples Humans often avoid naive Causal Goodhart errors, and most examples I can think of sound obnoxious (like eating caviar to become rich). One possible example is a human who avoids doctor visits because not being told about health is a proxy for being healthy. (I do not know enough about humans to know if Causal Goodhart is actually what is going on here.) I also cannot think of a good AI example. Most AI is not in acting in the kind of environment where Causal Goodhart would be a problem, and when it is acting in that kind of environment Causal Goodhart errors are easily avoided. Most of the time the phrase "Correlation does not imply causation" is used it is pointing out that a proposed policy might be subject to Causal Goodhart. Relationship with Other Goodhart Phenomena You can tell the difference between Causal Goodhart and the other three types because Causal Goodhart goes away when just sample a world with large proxy value, rather than intervene to cause the proxy to happen. Mitigation One way to avoid Causal Goodhart is to only sample from or choose between worlds according to their proxy values, rather than causing the proxy. This clearly cannot be done in all situations, but it is useful to note that there is a class of problems for which Causal Goodhart cannot cause problems. For example, consider choosing between algorithms based on how well they do on some test inputs, and your goal is to choose an algorithm that performs well on random inputs. The fact that you choose an algorithm does not effect its performance, and you don't have to worry about Causal Goodhart. In cases where you actually change the proxy value, you can try to infer the causal structure of the variables using statistical methods, and check that the proxy actually causes the goal before you intervene on the proxy. Extremal Goodhart Worlds in which the proxy takes an extreme value may be very different from the ordinary worlds in which the correlation between the proxy and the goal was observed. Abstract Model Patterns tend to break at simple joints. One simple subset of worlds is those worlds in which U is very large. Thus, a strong correlation between U and V observed for naturally occuring U values may not transfer to worlds in which U is very large. Further, since there may be relatively few naturally occuring worlds in which U is very large, extremely large U may coincide with small V values without breaking the statistical correlation. Examples Humans evolve to like sugars, because sugars were correlated in the ancestral environment (which has fewer sugars) with nutrition and survival. Humans then optimize for sugars, have way too much, and become less healthy. As an abstract mathematical example, let U and V be two correlated dimensions in a multivariate normal distribution, but we cut off the normal distribution to only include the ball of points in which U2+V2<n for some large n. This example represents a correlation between U and V in naturally occurring points, but also a boundary around what types of points are feasible that need not respect this correlation. Imagine you were to sample kpoints and take the one with the largest U value. As you increase k, at first, this optimization pressure lets you find better and better points for both U and V, but as you increase k to infinity, eventually you sample so many points that you will find a point near U=n,V=0. When enough optimization pressure was applied, the correlation between U and V stopped mattering, and instead the boundary of what kinds of points were possible at all decided what kind of point was selected. Many examples of machine learning algorithms doing bad because of overfitting are a special case of Extremal Goodhart. Relationship with Other Goodhart Phenomena Extremal Goodhart differs from Regressional Goodhart in that Extremal Goodhart goes away in simple examples like correlated dimensions in a multivariate normal distribution, but Regressional Goodhart does not. Mitigation Quantilization and Regularization are both useful for mitigating Extremal Goodhart effects. In general, Extremal Goodhart can be mitigated by choosing an option with a high proxy value, but not so high as to take you to a domain drastically different from the one in which the proxy was learned. Adversarial Goodhart When you optimize for a proxy, you provide an incentive for adversaries to correlate their goal with your proxy, thus destroying the correlation with your goal. Abstract Model Consider an agent A with some different goal W. Since they depend on common resources, W and V are naturally opposed. If you optimize U as a proxy for V, and Aknows this, A is incentivized to make large U values coincide with large W values, thus stopping them from coinciding with large V values. Examples When you use a metric to choose between people, but then those people learn what metric you use and game that metric, this is an example of Adversarial Goodhart. Adversarial Goodhart is the mechanism behind a superintelligent AI making a Treacherous Turn. Here, V is doing what the humans want forever. U is doing what the humans want in the training cases where the AI does not have enough power to take over, and W is whatever the AI wants to do with the universe. Adversarial Goodhart is also behind the malignancy of the universal prior, where you want to predict well forever (V), so hypotheses might predict well for a while (U), so that they can manipulate the world with their future predictions (W). Relationship with Other Goodhart Phenomena Adversarial Goodhart is the primary mechanism behind the original Goodhart's Law. Extremal Goodhart can happen even without any adversaries in the environment. However, Adversarial Goodhart may take advantage of Extremal Goodhart, as an adversary can more easily manipulate a small number of worlds with extreme proxy values, than it can manipulate all of the worlds. Mitigation Succesfully avoiding Adversarial Goodhart problems is very difficult in theory, and we understand very little about how to do this. In the case of non-superintelligent adversaries, you may be able to avoid Adversarial Goodhart by keeping your proxies secret (for example, not telling your employees what metrics you are using to evaluate them). However, this is unlikely to scale to dealing with superintelligent adversaries. One technique that might help in mitigating Adversarial Goodhart is to choose a proxy that is so simple and optimize so hard that adversaries have no or minimal control over the world which maximizes that proxy. (I want to ephasize that this is not a good plan for avoiding Adversarial Goodhart; it is just all I have.) For example, say you have a complicated goal that includes wanting to go to Mars. If you use a complicated search process to find a plan that is likely to get you to Mars, adversaries in your search process may suggest a plan that involves building a superintelligence that gets you to Mars, but also kills you. On the other hand, if you use the proxy of getting to Mars as fast as possible and optimize very hard, then (maybe) adversaries can't add baggage to a proposed plan without being out selected by a plan without that baggage. Buliding a superintelligence maybe takes more time than just having the plan tell you how to build a rocket quickly. (Note that the plan will likely include things like acceleration that humans can't handle and nanobots that don't turn off, so Extremal Goodhart will still kill you.)

## LIMITING STEP

My girlfriend is a fantastic cook. When she cooks, the kitchen seems outright chaotic — five different things going at the same time. Yet, every time, everything magically finishes at the same time. That's because good cooks understand limiting steps.
Imagine you're a cook in a diner. You get an order for eggs, toast, and coffee. What determines how you should structure your production? The limiting step is the task that shapes the entire production flow — it might be the longest task or the most important. Since the coffee is already in a pot and toast takes a minute, making eggs is the limiting step.
To make sure everything comes out on time, you need to work backward. First, you need some time to put everything on the plate. Then you need to get the egg from the boiling water, the coffee from the pot, and the toast from the toaster.

Making eggs is the limiting step (From High Output Management)
To create good processes, we need to understand the limiting step. For example, in data analysis, the limiting step might be cleaning the data. No analysis can come before a data scientist cleans the data. For software engineering, the limiting step may be the compilation of the program. In developer experience, we call this the inner loop. Making code changes and verifying them locally on your laptop may be done quickly, but the software deployment pipeline (if any) to put them into production might take significantly longer.
Limiting steps are the best place to innovate. Changing parts of the process that aren't limiting doesn't have an impact on throughput. There are two ways to innovate with limiting steps. First, you can tackle the limiting step head-on. Find a quicker way of making eggs. Or, you can change the whole production equation. Hard boil the eggs ahead of time. Serve overnight oats instead of eggs.
Andy Grove wrote about limiting steps in his High Output Management, a must-read for any manager (it's not your average fluff piece, Andy had a unique way of looking at the world). He talked about how managers should identify the limiting steps in their schedules.

```

```
