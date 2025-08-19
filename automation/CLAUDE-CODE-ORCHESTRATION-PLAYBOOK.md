# Claude Code Orchestration Playbook

**Created:** 2025-08-19  
**Purpose:** Step-by-step instructions for executing ANY multi-session workflow  
**Scope:** 10-hour, 20-hour, 100-hour projects using parallel orchestration

## Quick Start

### For a 10-Hour Project
```
Claude Code, execute this workflow:
1. Read PARALLEL-ORCHESTRATION-PATTERN.md
2. Read EXTENSIBLE-SESSION-TEMPLATES.md  
3. Identify parallelizable work
4. Create 3 batches of parallel sessions
5. Execute using Task agents
```

## Complete Orchestration Process

### Phase 1: Workflow Analysis (5 minutes)

#### Step 1.1: Load Workflow Definition
```yaml
# Look for workflow definition in order:
1. workflow-proposal-*.md
2. project-plan.md
3. requirements.md
4. User-provided task list
```

#### Step 1.2: Extract Sessions
```python
sessions = extract_all_sessions(workflow_doc)
for session in sessions:
    identify:
        - duration (30-45 min)
        - dependencies (what must complete first)
        - type (discovery/implementation/validation)
        - parallelizable (yes/no)
```

#### Step 1.3: Build Dependency Graph
```yaml
dependency_graph:
  session_1: []                    # No dependencies
  session_2: []                    # No dependencies  
  session_3: [session_1]           # Depends on session 1
  session_4: [session_1, session_2] # Depends on both
```

### Phase 2: Batch Creation (5 minutes)

#### Step 2.1: Apply Parallel Orchestration Pattern
```python
batches = []
unassigned = all_sessions

while unassigned:
    batch = []
    for session in unassigned:
        if all_dependencies_met(session):
            batch.append(session)
    
    batches.append(batch)
    unassigned.remove(batch)
```

#### Step 2.2: Optimize Batches
```yaml
optimization_rules:
  - Balance batch sizes (even distribution)
  - Group similar types (all discovery together)
  - Respect resource constraints (max 10 parallel)
  - Consider human review points
```

#### Step 2.3: Create Execution Plan
```yaml
execution_plan:
  batch_1:
    parallel: true
    sessions: [1, 2, 5, 7]  # All independent
    estimated_time: 45 min
    
  batch_2:
    parallel: true
    sessions: [3, 4, 6]     # Depend on batch_1
    estimated_time: 45 min
    
  batch_3:
    parallel: false
    sessions: [8, 9]        # Integration, sequential
    estimated_time: 90 min
```

### Phase 3: Execution (Varies by project size)

#### Step 3.1: Initialize Tracking
```python
# Use TodoWrite to track all sessions
todos = []
for batch in execution_plan:
    for session in batch.sessions:
        todos.append({
            "id": session.id,
            "content": session.description,
            "status": "pending"
        })

TodoWrite(todos)
```

#### Step 3.2: Execute Batch
```python
def execute_batch(batch):
    if batch.parallel:
        # Launch all sessions simultaneously
        agents = []
        for session in batch.sessions:
            agent = Task(
                subagent_type=get_agent_type(session),
                description=f"Session {session.id}: {session.name}",
                prompt=generate_session_prompt(session)
            )
            agents.append(agent)
        
        # Wait for all to complete
        results = await_all(agents)
    else:
        # Execute sequentially
        for session in batch.sessions:
            result = execute_session(session)
            if not result.success:
                handle_failure(session)
```

#### Step 3.3: Validation Gates
```python
def validation_gate(batch_results):
    for result in batch_results:
        # Check against acceptance criteria
        if not meets_criteria(result):
            # Retry or escalate
            retry_or_fail(result)
        
        # Update progress
        TodoWrite.update(result.session_id, "completed")
```

#### Step 3.4: Progress Monitoring
```yaml
monitoring:
  - Check every 15 minutes
  - Update todo list
  - Log performance metrics
  - Identify bottlenecks
  - Adjust parallelization if needed
```

### Phase 4: Integration (Final 10% of time)

#### Step 4.1: Merge Parallel Work
```bash
# If using git branches for parallel work
for branch in parallel_branches:
    git merge --no-ff branch
    resolve_conflicts()
    validate_integration()
```

#### Step 4.2: Final Validation
```python
validation_suite = [
    "acceptance_criteria",
    "performance_benchmarks",
    "integration_tests",
    "documentation_complete"
]

for test in validation_suite:
    result = run_validation(test)
    report_status(result)
```

#### Step 4.3: Generate Report
```markdown
# Workflow Execution Report

## Summary
- Total Sessions: X
- Parallel Batches: Y
- Serial Time Saved: Z hours
- Success Rate: N%

## Metrics
- Planned: X hours
- Actual: Y hours
- Speedup: Z factor

## Learnings
- What worked well
- What can improve
- Patterns to reuse
```

## Orchestration for Different Project Sizes

### 10-Hour Project (Cryptiq Mindmap M0.5)
```yaml
pattern: FOCUSED_SPRINT
batches: 3-4
parallel_factor: 3x
sessions: 12-15

execution:
  hour_1-2: Discovery batch (parallel)
  hour_3-5: Implementation batch (parallel)
  hour_6-7: Integration batch (sequential)
  hour_8-9: Validation batch (parallel)
  hour_10: Polish and documentation
```

### 20-Hour Project (Full Feature)
```yaml
pattern: FEATURE_DEVELOPMENT
batches: 6-8
parallel_factor: 4x
sessions: 25-30

execution:
  day_1:
    morning: Discovery and planning
    afternoon: Core implementation
  day_2:
    morning: Extended implementation
    afternoon: Integration and testing
  day_3:
    morning: Polish and optimization
```

### 100-Hour Project (Major System)
```yaml
pattern: SYSTEM_BUILD
batches: 20-30
parallel_factor: 5x
sessions: 100+

execution:
  week_1: Discovery and architecture
  week_2: Parallel component development
  week_3: Integration and testing
  week_4: Optimization and deployment
```

## How Claude Code Should Use This Playbook

### Initial Prompt Pattern
```
User: "Execute the Cryptiq Mindmap workflow"

Claude Code:
1. I'll read the workflow-proposal-01.md
2. I'll apply the PARALLEL-ORCHESTRATION-PATTERN
3. I'll create 4 batches of parallel work
4. I'll use Task agents to execute each batch
5. I'll track progress with TodoWrite
```

### During Execution
```python
# Claude Code internal process
while batches_remain():
    batch = next_batch()
    
    # Update user
    print(f"Starting Batch {batch.id}: {len(batch.sessions)} parallel sessions")
    
    # Execute
    results = execute_batch(batch)
    
    # Validate
    validation_gate(results)
    
    # Report
    print(f"Batch {batch.id} complete: {success_rate}% success")
```

### Error Handling
```yaml
on_error:
  minor:
    - Log and continue
    - Mark for follow-up
    - Add to technical debt
  
  major:
    - Pause execution
    - Request user input
    - Adjust workflow
  
  critical:
    - Stop all agents
    - Rollback changes
    - Generate error report
```

## Key Commands for Claude Code

### Start Workflow
```
"Execute [workflow-name] using parallel orchestration from the playbook"
```

### Check Progress
```
"Show current batch status and todo list"
```

### Adjust Parallelization
```
"Reduce parallel agents to 5 due to resource constraints"
```

### Skip Session
```
"Skip session X and continue with next batch"
```

### Generate Report
```
"Create workflow execution report with metrics"
```

## Meta-Patterns for Claude Code

### Pattern Recognition
Claude Code should recognize these patterns and auto-apply:
- **All Discovery → Parallel**: Discovery tasks never conflict
- **Different Files → Parallel**: File-level isolation enables parallelism
- **Same Package → Sequential**: Avoid merge conflicts
- **Tests → Parallel**: Tests are independent by design

### Optimization Learning
After each workflow:
1. Record actual vs estimated times
2. Identify bottleneck sessions
3. Adjust parallelization factors
4. Update templates with learnings

### Reusability
Every workflow execution should:
1. Generate a reusable template
2. Extract patterns for future use
3. Update .clmem/ with insights
4. Improve the playbook

## Success Metrics

### Efficiency Metrics
- **Speedup Factor:** Serial Time / Parallel Time (target: >3x)
- **Agent Utilization:** Active Time / Total Time (target: >80%)
- **Batch Efficiency:** Sessions per Batch (target: 3-5)

### Quality Metrics
- **First-Pass Success:** Sessions completing without retry (target: >90%)
- **Validation Pass Rate:** Acceptance criteria met (target: 100%)
- **Integration Success:** Merges without conflicts (target: >95%)

## Continuous Improvement

This playbook evolves with each use:
1. **Track:** Record all metrics
2. **Analyze:** Identify patterns
3. **Improve:** Update templates and patterns
4. **Share:** Add learnings to .clmem/

**Remember:** The goal is not just to complete THIS workflow, but to make ALL future workflows more efficient.