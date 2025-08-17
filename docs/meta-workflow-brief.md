# Meta-Workflow Framework Brief (6-24 Hour Sprint)

## Executive Summary

Build a **learning workflow system** in Claude Code that creates and improves information-processing workflows through rapid iteration. Target: Working git archaeology workflow that learns from its predictions within 24 hours.

## Critical Constraint: NO External APIs

**Reality**: We're using Claude Code via Claude Max subscription. No external LLM APIs needed or wanted.
**Implication**: DSPy may not be viable without external API access.
**Solution**: Build DSPy-inspired learning loop in pure Python.

## Core Architecture (Simplified)

```
Claude Code Environment
    ├── Python Workflow Engine
    │   ├── Prediction System
    │   ├── Observation Recording
    │   └── Learning Loop
    ├── Persistent State (.clmem/)
    └── Git Operations
```

## 6-24 Hour Implementation Plan

### Hour 0-2: Stop Planning, Start Doing

**Goal**: Simplest possible prediction system

```python
# git_archaeology.py - VERSION 0
import subprocess
import json
import os
from datetime import datetime

def make_prediction(branch):
    """Make ANY prediction about this branch"""
    return {
        "prediction": "This branch will have 50-100 commits",
        "confidence": 0.5,
        "timestamp": datetime.now().isoformat()
    }

def observe_reality(branch):
    """Get actual data"""
    result = subprocess.run(
        ["git", "rev-list", "--count", branch],
        capture_output=True, text=True
    )
    return int(result.stdout.strip())

def learn(prediction, observation):
    """Compare and save learning"""
    error = abs(prediction["value"] - observation)
    learning = {
        "prediction": prediction,
        "observation": observation,
        "error": error,
        "timestamp": datetime.now().isoformat()
    }

    # Append to learning log
    with open(".clmem/learning.jsonl", "a") as f:
        json.dump(learning, f)
        f.write("\n")

    return error

# RUN IT
branch = "main"
pred = make_prediction(branch)
obs = observe_reality(branch)
error = learn(pred, obs)
print(f"Error: {error}")
```

**Success Criteria**:

- Makes a prediction ✓
- Observes reality ✓
- Records the delta ✓
- WORKING IN 2 HOURS

### Hour 2-6: Add Learning

**Goal**: Second iteration uses first iteration's data

```python
def make_better_prediction(branch):
    """Use past learnings to improve predictions"""

    # Load previous learnings
    learnings = []
    if os.path.exists(".clmem/learning.jsonl"):
        with open(".clmem/learning.jsonl") as f:
            for line in f:
                learnings.append(json.loads(line))

    # Calculate average error direction
    if learnings:
        avg_error = sum(l["error"] for l in learnings) / len(learnings)
        # Adjust prediction based on past errors
        base_prediction = 75  # Previous guess
        adjusted = base_prediction - (avg_error * 0.5)
        confidence = min(0.9, 0.5 + len(learnings) * 0.1)
    else:
        adjusted = 75
        confidence = 0.5

    return {
        "value": adjusted,
        "confidence": confidence,
        "method": "learning_adjusted"
    }
```

**Validate Learning**:

1. Run on 5 branches
2. Record all predictions/observations
3. Calculate accuracy improvement
4. If >20% better → SUCCESS

### Hour 6-12: Multiple Hypotheses

**Goal**: Test multiple prediction strategies in parallel

```python
class PredictionStrategy:
    def predict(self, branch_data):
        raise NotImplementedError

class CommitVelocityStrategy(PredictionStrategy):
    """Hypothesis: Recent velocity predicts future"""
    def predict(self, branch_data):
        # Implementation
        pass

class FileClustersStrategy(PredictionStrategy):
    """Hypothesis: File changes cluster before stalls"""
    def predict(self, branch_data):
        # Implementation
        pass

class SentimentStrategy(PredictionStrategy):
    """Hypothesis: Commit messages reveal mood"""
    def predict(self, branch_data):
        # Implementation
        pass

# Run all strategies
strategies = [
    CommitVelocityStrategy(),
    FileClustersStrategy(),
    SentimentStrategy()
]

results = []
for strategy in strategies:
    pred = strategy.predict(branch_data)
    obs = observe_reality(branch)
    accuracy = calculate_accuracy(pred, obs)
    results.append((strategy.__class__.__name__, accuracy))

# Keep best performer
best_strategy = max(results, key=lambda x: x[1])
print(f"Best strategy: {best_strategy[0]} with {best_strategy[1]}% accuracy")
```

### Hour 12-18: Workflow Automation

**Goal**: Claude Code orchestrates the entire loop

```python
class MetaWorkflow:
    def __init__(self):
        self.iterations = 0
        self.learnings = []
        self.best_accuracy = 0

    def run_iteration(self):
        """One complete learning cycle"""
        # 1. Load previous state
        self.load_state()

        # 2. Generate predictions for all branches
        predictions = {}
        for branch in self.get_branches():
            predictions[branch] = self.predict(branch)

        # 3. Gather observations
        observations = {}
        for branch in self.get_branches():
            observations[branch] = self.observe(branch)

        # 4. Calculate accuracy
        accuracy = self.calculate_accuracy(predictions, observations)

        # 5. Update model if better
        if accuracy > self.best_accuracy:
            self.best_accuracy = accuracy
            self.save_model()

        # 6. Save state
        self.save_state()

        print(f"Iteration {self.iterations}: {accuracy}% accurate")
        self.iterations += 1

        return accuracy

    def learn_until_good(self, target_accuracy=80):
        """Keep learning until we hit target"""
        while self.best_accuracy < target_accuracy:
            self.run_iteration()
            if self.iterations > 10:
                print("Giving up after 10 iterations")
                break
```

### Hour 18-24: Meta-Learning Extraction

**Goal**: What patterns work for any workflow?

```python
# meta_patterns.py
class WorkflowTemplate:
    """Reusable pattern for any learning workflow"""

    def __init__(self, domain):
        self.domain = domain  # "git", "code_quality", etc
        self.predictor = None
        self.observer = None
        self.learnings = []

    def set_predictor(self, predict_func):
        """Domain-specific prediction logic"""
        self.predictor = predict_func

    def set_observer(self, observe_func):
        """Domain-specific observation logic"""
        self.observer = observe_func

    def iterate(self):
        """Generic learning loop"""
        # Same pattern for any domain
        predictions = self.predictor()
        observations = self.observer()
        self.learn(predictions, observations)
        return self.calculate_improvement()

# Test generalization
git_workflow = WorkflowTemplate("git")
git_workflow.set_predictor(git_specific_predictions)
git_workflow.set_observer(git_specific_observations)

# Should work for different domain
code_workflow = WorkflowTemplate("code_quality")
code_workflow.set_predictor(quality_predictions)
code_workflow.set_observer(quality_observations)
```

## Critical Success Factors

### What We're Optimizing For

1. **Learning Loop Speed**: How fast can we iterate?
2. **Prediction Improvement**: Does accuracy increase?
3. **Generalization**: Can patterns transfer?

### What We're NOT Doing

- Building complex frameworks
- Waiting for external APIs
- Over-engineering solutions
- Planning beyond 24 hours

## Immediate Next Action (NOW)

```bash
# In Claude Code terminal - DO THIS IMMEDIATELY
mkdir -p .clmem/git-archaeology
cat > test.py << 'EOF'
import subprocess
result = subprocess.run(["git", "log", "--oneline", "-5"], capture_output=True, text=True)
print("Git works:", bool(result.stdout))
print("First 5 commits:", result.stdout)
EOF
python test.py
```

If this works, immediately start coding the Hour 0-2 version.

## Decision Points

### Hour 2: Continue or Pivot?

- If basic prediction→observation→learning works → Continue
- If blocked by environment → Switch to pure analysis

### Hour 6: Learning Validated?

- If accuracy improves >20% → Continue with current approach
- If no improvement → Try different hypotheses

### Hour 12: Automation Working?

- If Claude Code can run iterations → Scale up
- If manual only → Focus on single best strategy

### Hour 18: Patterns Emerging?

- If reusable patterns found → Document and test transfer
- If too domain-specific → Extract what we can

## Final Note

**STOP PLANNING. START EXPERIMENTING.**

The meta-workflow framework isn't about perfect architecture. It's about learning loops that improve through iteration. Every hour spent planning is an hour not learning.

---

_Brief Updated: 2025-08-17_
_Timeframe: 6-24 hours total_
_No external APIs required_
