# Workflow Explained: Step-by-Step Breakdown

## PART 1: ORIGINAL MANUAL WORKFLOW (How it Currently Works)

### Overview
A human operator manually coordinates 3 separate Claude instances to build a software package in parallel. Think of it like a human conductor directing three musicians who can't hear each other.

### The Players
- **Human Operator**: You, manually copying/pasting between windows
- **Claude Instance 1 (RENDERER)**: Builds core rendering components
- **Claude Instance 2 (ANIMATOR)**: Builds animation system
- **Claude Instance 3 (INTEGRATOR)**: Combines work from 1 & 2

### Step-by-Step Process

#### PHASE 1: SETUP (30 minutes)
1. **Human** opens 3 separate Claude windows/tabs
2. **Human** creates 3 git branches:
   - `canvas-latent-core` (for Instance 1)
   - `canvas-latent-interaction` (for Instance 2)  
   - `canvas-latent-integration` (for Instance 3)
3. **Human** reads `behavioral-contract.md` to understand requirements
4. **Human** reads `parallel-protocol.md` to understand file ownership rules

#### PHASE 2: INITIAL PROMPTING (45 minutes)
1. **Human** copies prompt from `prompts.md` (lines 25-100)
2. **Human** pastes into Claude Instance 3 window
3. **Human** waits for Instance 3 to create type definitions
4. **Human** runs git commands to get SHA: `git rev-parse HEAD`
5. **Human** copies SHA (e.g., "87c238d9") to clipboard
6. **Human** manually writes SHA to `sha-ledger.md`:
   ```
   [LEDGER] KEY=A1-INTEGRATION-TYPES SHA=87c238d9 BRANCH=canvas-latent-integration
   ```
7. **Human** commits and pushes the ledger file

#### PHASE 3: PARALLEL WORK LAUNCH (1 hour)
1. **Human** copies prompt M2-S1-DOC from `prompts.md` (lines 66-104)
2. **Human** pastes into Claude Instance 1
3. **Human** waits for Instance 1 to respond
4. **Human** copies prompt M2-S1-CODE from `prompts.md` (lines 106-138)
5. **Human** tells Instance 1 to read SHA from ledger
6. **Human** copies prompt M2-S1-IMPL from `prompts.md` (lines 140-175)
7. **Human** pastes into Instance 1 to start implementation
8. **Human** REPEATS steps 1-7 for Instance 2 (different prompts)
9. **Human** monitors both windows for completion

#### PHASE 4: SHA TRACKING (30 minutes)
1. **Human** waits for Instance 1 to finish
2. **Human** asks Instance 1 for its commit SHA
3. **Human** copies SHA from Instance 1's response
4. **Human** opens `sha-ledger.md`
5. **Human** manually adds entry:
   ```
   [LEDGER] KEY=S1-RAYCASTHANDLER-A1 SHA=90a1f16e BRANCH=canvas-latent-core
   ```
6. **Human** commits and pushes
7. **Human** REPEATS for Instance 2's SHA
8. **Human** tells Instance 3 these SHAs are ready

#### PHASE 5: INTEGRATION (1 hour)
1. **Human** copies prompt M2-S3-DOC from `prompts.md`
2. **Human** pastes into Instance 3
3. **Human** tells Instance 3 to cherry-pick S1 and S2 SHAs
4. **Human** copies integration prompt M2-S3-IMPL
5. **Human** pastes into Instance 3
6. **Human** waits for integration to complete
7. **Human** records Instance 3's SHA in ledger

#### PHASE 6: VALIDATION (45 minutes)
1. **Human** manually runs `pnpm dev`
2. **Human** opens browser to test
3. **Human** documents results in new file
4. **Human** identifies issues
5. **Human** creates fix prompts for each instance
6. **Human** repeats cycle

### Total Time: 4.5 hours of continuous manual work

### Problems with Manual Workflow
- **Context Switching**: Jumping between 3 windows constantly
- **Copy/Paste Errors**: SHA typos break everything
- **Synchronization**: Human must track what's done
- **No Real Parallelism**: Human can only focus on one instance
- **Documentation Overhead**: More time documenting than coding
- **Mental Fatigue**: 4.5 hours of intense concentration

---

## PART 2: AUTOMATED WORKFLOW (How it Should Work)

### Overview
A single Claude Code instance orchestrates everything automatically using built-in tools. Like a self-playing orchestra.

### Step-by-Step Process

#### PHASE 1: INITIALIZATION (30 seconds)
```python
# Claude Code runs this automatically
orchestrator = WorkflowOrchestrator()
orchestrator.initialize()
```

#### PHASE 2: PARALLEL TASK LAUNCH (1 minute)
```python
# Claude Code spawns 3 agents simultaneously
tasks = [
    Task(subagent_type='synthesis-agent', 
         description='Core Renderer',
         prompt='Implement InstancedNodeMesh...'),
    
    Task(subagent_type='synthesis-agent',
         description='Animation System', 
         prompt='Implement BurstAnimation...'),
    
    Task(subagent_type='synthesis-agent',
         description='Type Definitions',
         prompt='Create type definitions...')
]

# All 3 execute in parallel
results = await orchestrator.run_parallel_tasks(tasks)
```

#### PHASE 3: AUTOMATIC SHA COORDINATION (instant)
```python
# No human involvement - automatic SHA tracking
for task_id, result in results.items():
    sha = git.get_commit_sha(task_id)
    orchestrator.record_sha(task_id, sha)
```

#### PHASE 4: INTELLIGENT INTEGRATION (2 minutes)
```python
# Orchestrator knows dependencies
integration_task = Task(
    subagent_type='synthesis-agent',
    description='Integration',
    prompt='Wire up adapter...',
    dependencies=['core_renderer', 'animations']
)

# Waits for dependencies automatically
result = await orchestrator.execute_task(integration_task)
```

#### PHASE 5: AUTOMATED VALIDATION (1 minute)
```python
# Validation runs automatically
validation = Task(
    subagent_type='audit-agent',
    description='Validate implementation',
    prompt='Check behavioral contract...'
)

validation_result = await orchestrator.execute_task(validation)

# Auto-fix any issues
if not validation_result.passed:
    fix_task = Task(
        subagent_type='synthesis-agent',
        prompt=f'Fix issues: {validation_result.errors}'
    )
    await orchestrator.execute_task(fix_task)
```

#### PHASE 6: REPORTING (instant)
```python
# Generate report automatically
report = {
    'tasks_completed': len(results),
    'time_taken': '15 minutes',
    'errors_fixed': validation_result.errors_fixed,
    'files_created': results.files_created
}
save_report(report)
```

### Total Time: 15 minutes unattended

---

## PART 3: KEY DIFFERENCES EXPLAINED

### Manual Workflow Flow
```
Human → Copy Prompt → Claude 1 → Wait → Copy SHA → 
Human → Copy Prompt → Claude 2 → Wait → Copy SHA →
Human → Copy Prompt → Claude 3 → Wait → Validate →
Human → Document → Repeat if errors
```

### Automated Workflow Flow
```
Claude Code → Spawn All Agents → Execute Parallel →
            → Track SHAs Automatically →
            → Integrate Automatically →
            → Validate & Fix Automatically →
            → Report Results
```

### Why Automated is 18x Faster

1. **True Parallelism**
   - Manual: Human handles one instance at a time
   - Automated: All agents run simultaneously

2. **Zero Context Switching**
   - Manual: Constant window switching
   - Automated: Single orchestrator manages everything

3. **Instant SHA Coordination**
   - Manual: Copy/paste SHAs between windows
   - Automated: Programmatic SHA tracking in memory

4. **No Human Delays**
   - Manual: Reading, thinking, typing, waiting
   - Automated: Instant decision making

5. **Error Prevention**
   - Manual: Typos in SHAs cause failures
   - Automated: Programmatic = no typos

6. **Continuous Validation**
   - Manual: Test at the end, restart if failed
   - Automated: Test continuously, auto-fix issues

---

## PART 4: REAL EXAMPLE WALKTHROUGH

### Scenario: Implement Canvas-Latent Package

#### Manual Process (What Actually Happened)
```
7:50 PM - Human starts, reads docs
8:00 PM - Human launches Instance 3, waits for types
8:15 PM - Human copies SHA "87c238d9" to ledger
8:20 PM - Human launches Instance 1 with renderer prompt
8:25 PM - Human launches Instance 2 with animation prompt
8:30 PM - Human switches between windows checking progress
9:00 PM - Instance 1 done, human copies SHA "90a1f16e"
9:15 PM - Instance 2 done, human copies SHA "70d41bb"
9:30 PM - Human tells Instance 3 to integrate
10:00 PM - Integration done, human tests manually
10:30 PM - Errors found, human creates fix prompts
11:00 PM - Human re-launches instances with fixes
11:45 PM - Human tests again
12:20 AM - Finally working
```

#### Automated Process (What Should Happen)
```
0:00 - Claude Code starts orchestrator
0:01 - 3 agents launch in parallel
0:05 - Types, renderer, animations complete
0:06 - Integration agent combines work
0:08 - Validation agent tests everything
0:10 - Fix agent resolves issues
0:12 - Second validation passes
0:15 - Complete, report generated
```

---

## PART 5: THE BOTTLENECK VISUALIZATION

### Manual Workflow Bottleneck
```
        Instance 1 ──┐
                     ├──→ HUMAN ──→ Integration
        Instance 2 ──┘      ↑
                           SHA
                         Copying
                      (Error Prone)
```

### Automated Workflow Flow
```
        Agent 1 ──┐
                  ├──→ Orchestrator ──→ Integration
        Agent 2 ──┤         ↓
                  │    Automatic SHA
        Agent 3 ──┘     Coordination
                      (Error Free)
```

---

## Summary

The **manual workflow** treats Claude like 3 separate people who can't talk to each other, requiring a human to relay messages between them. This creates a massive bottleneck.

The **automated workflow** uses Claude Code's native ability to spawn multiple agents that share context through the orchestrator, eliminating the human bottleneck entirely.

**Result**: 4.5 hours → 15 minutes (18x improvement)

The key insight: **Claude Code can coordinate itself** - it doesn't need a human to copy/paste between instances.