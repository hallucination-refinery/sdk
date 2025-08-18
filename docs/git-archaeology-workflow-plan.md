# Git Archaeology Workflow - Implementation Plan

## Overview

Build a **working learning loop** for git archaeology that demonstrates actual learning through prediction improvement. This is our first meta-workflow creation - a workflow that learns to analyze repository patterns.

## Core Concept

```python
# The fundamental learning loop
prediction = model.predict(target)
observation = git.observe(target)
error = observation - prediction
model.learn(error)
# Repeat until good
```

## Success Criteria

1. **Learning Demonstrated**: Prediction accuracy improves >20% over 3 iterations
2. **Insights Generated**: At least 3 actionable insights about repository
3. **State Persists**: Learning survives restarts
4. **Execution Speed**: <5 minutes per iteration

## Implementation Plan

### Hour 0: Setup and First Prediction (30 min)

#### 1. Create Directory Structure
```bash
mkdir -p .clmem/git-archaeology/{state,predictions,observations,insights}
```

#### 2. Create Core Workflow File
```python
# git_archaeology.py
import subprocess
import json
import os
from datetime import datetime
from typing import Dict, List, Any

class GitArchaeologyWorkflow:
    def __init__(self, repo_path="."):
        self.repo_path = repo_path
        self.state_file = ".clmem/git-archaeology/state/model.json"
        self.iteration = 0
        self.model = self.load_model()
        
    def load_model(self) -> Dict:
        """Load or create model state"""
        if os.path.exists(self.state_file):
            with open(self.state_file) as f:
                return json.load(f)
        return {
            "iteration": 0,
            "predictions": {},
            "errors": [],
            "learning_rate": 0.3
        }
    
    def save_model(self):
        """Persist model state"""
        os.makedirs(os.path.dirname(self.state_file), exist_ok=True)
        with open(self.state_file, 'w') as f:
            json.dump(self.model, f, indent=2)
```

#### 3. Implement Basic Prediction
```python
def predict_commit_count(self, branch: str) -> Dict:
    """Make prediction about branch commit count"""
    # Start with naive prediction
    if branch not in self.model["predictions"]:
        prediction = 75  # Initial guess
        confidence = 0.5
    else:
        # Use previous prediction adjusted by error
        last = self.model["predictions"][branch]
        prediction = last["value"]
        confidence = last["confidence"]
    
    pred_record = {
        "branch": branch,
        "target": "commit_count",
        "value": prediction,
        "confidence": confidence,
        "iteration": self.iteration,
        "timestamp": datetime.now().isoformat()
    }
    
    # Save prediction
    pred_file = f".clmem/git-archaeology/predictions/iter_{self.iteration}_{branch}.json"
    os.makedirs(os.path.dirname(pred_file), exist_ok=True)
    with open(pred_file, 'w') as f:
        json.dump(pred_record, f)
    
    return pred_record
```

#### 4. Implement Observation
```python
def observe_commit_count(self, branch: str) -> Dict:
    """Get actual commit count for branch"""
    try:
        result = subprocess.run(
            f"git rev-list --count {branch}",
            shell=True,
            capture_output=True,
            text=True,
            cwd=self.repo_path
        )
        actual_count = int(result.stdout.strip())
    except:
        actual_count = 0
    
    obs_record = {
        "branch": branch,
        "target": "commit_count",
        "observed": actual_count,
        "iteration": self.iteration,
        "timestamp": datetime.now().isoformat()
    }
    
    # Save observation
    obs_file = f".clmem/git-archaeology/observations/iter_{self.iteration}_{branch}.json"
    os.makedirs(os.path.dirname(obs_file), exist_ok=True)
    with open(obs_file, 'w') as f:
        json.dump(obs_record, f)
    
    return obs_record
```

### Hour 1: Add Learning Mechanism (45 min)

#### 5. Implement Learning Function
```python
def learn(self, prediction: Dict, observation: Dict):
    """Update model based on prediction error"""
    error = observation["observed"] - prediction["value"]
    
    # Store error for analysis
    self.model["errors"].append({
        "branch": prediction["branch"],
        "error": error,
        "iteration": self.iteration
    })
    
    # Update prediction using error correction
    # New prediction = old prediction + learning_rate * error
    branch = prediction["branch"]
    learning_rate = self.model["learning_rate"]
    
    if branch not in self.model["predictions"]:
        self.model["predictions"][branch] = {}
    
    old_value = prediction["value"]
    new_value = old_value + learning_rate * error
    
    # Update confidence based on error magnitude
    # Smaller errors = higher confidence
    new_confidence = min(0.9, 0.5 + 0.1 * (1 - abs(error) / 100))
    
    self.model["predictions"][branch] = {
        "value": new_value,
        "confidence": new_confidence,
        "last_error": error,
        "last_updated": self.iteration
    }
    
    # Save updated model
    self.save_model()
    
    return {
        "branch": branch,
        "old_prediction": old_value,
        "new_prediction": new_value,
        "error": error,
        "learning_applied": learning_rate * error
    }
```

#### 6. Create Main Learning Loop
```python
def run_iteration(self, branches: List[str] = None):
    """Run one complete learning iteration"""
    self.iteration = self.model["iteration"] + 1
    
    # Get branches to analyze
    if branches is None:
        branches = self.get_branches()[:5]  # Start with top 5
    
    results = []
    total_error = 0
    
    print(f"\n=== Iteration {self.iteration} ===")
    
    for branch in branches:
        # Predict
        pred = self.predict_commit_count(branch)
        print(f"Predicted {branch}: {pred['value']:.0f} commits")
        
        # Observe
        obs = self.observe_commit_count(branch)
        print(f"Observed {branch}: {obs['observed']} commits")
        
        # Learn
        learning = self.learn(pred, obs)
        error = abs(learning["error"])
        total_error += error
        print(f"Error: {learning['error']:+.0f}, New prediction: {learning['new_prediction']:.0f}")
        
        results.append({
            "branch": branch,
            "prediction": pred,
            "observation": obs,
            "learning": learning
        })
    
    # Calculate metrics
    avg_error = total_error / len(branches)
    improvement = self.calculate_improvement()
    
    print(f"\nAverage error: {avg_error:.1f}")
    print(f"Improvement from last iteration: {improvement:.1%}")
    
    # Update model iteration
    self.model["iteration"] = self.iteration
    self.save_model()
    
    return results

def get_branches(self) -> List[str]:
    """Get list of branches in repository"""
    result = subprocess.run(
        "git branch -r --format='%(refname:short)'",
        shell=True,
        capture_output=True,
        text=True,
        cwd=self.repo_path
    )
    branches = [b.strip() for b in result.stdout.split('\n') if b.strip()]
    return branches
```

### Hour 2: Add Insight Extraction (45 min)

#### 7. Implement Pattern Detection
```python
def extract_insights(self) -> List[Dict]:
    """Analyze patterns and generate insights"""
    insights = []
    
    # Insight 1: Branches with most prediction error
    if len(self.model["errors"]) > 0:
        branch_errors = {}
        for e in self.model["errors"]:
            branch = e["branch"]
            if branch not in branch_errors:
                branch_errors[branch] = []
            branch_errors[branch].append(abs(e["error"]))
        
        # Find highest error branch
        worst_branch = max(branch_errors.items(), key=lambda x: sum(x[1])/len(x[1]))
        insights.append({
            "type": "high_error_branch",
            "insight": f"Branch '{worst_branch[0]}' is hardest to predict (avg error: {sum(worst_branch[1])/len(worst_branch[1]):.1f})",
            "actionable": "This branch may have irregular development patterns worth investigating",
            "evidence": {"branch": worst_branch[0], "avg_error": sum(worst_branch[1])/len(worst_branch[1])}
        })
    
    # Insight 2: Learning rate effectiveness
    if len(self.model["errors"]) > 3:
        recent_errors = [abs(e["error"]) for e in self.model["errors"][-10:]]
        older_errors = [abs(e["error"]) for e in self.model["errors"][:-10]]
        if older_errors:
            improvement = (sum(older_errors)/len(older_errors) - sum(recent_errors)/len(recent_errors))
            insights.append({
                "type": "learning_effectiveness",
                "insight": f"Model is {'improving' if improvement > 0 else 'degrading'} (error reduced by {improvement:.1f})",
                "actionable": f"{'Continue current approach' if improvement > 0 else 'Adjust learning rate or strategy'}",
                "evidence": {"improvement": improvement}
            })
    
    # Insight 3: Stall detection
    for branch, pred in self.model["predictions"].items():
        if "last_updated" in pred and pred.get("last_error", 100) < 10:
            insights.append({
                "type": "stall_candidate",
                "insight": f"Branch '{branch}' has {pred['value']:.0f} commits and low prediction error",
                "actionable": f"Check if this branch has stalled (last updated: iteration {pred['last_updated']})",
                "evidence": {"branch": branch, "commits": pred['value'], "error": pred.get("last_error", 0)}
            })
    
    # Save insights
    insights_file = f".clmem/git-archaeology/insights/iter_{self.iteration}.json"
    os.makedirs(os.path.dirname(insights_file), exist_ok=True)
    with open(insights_file, 'w') as f:
        json.dump(insights, f, indent=2)
    
    return insights

def calculate_improvement(self) -> float:
    """Calculate improvement from previous iteration"""
    if len(self.model["errors"]) < 2:
        return 0.0
    
    # Get errors from last two iterations
    current_iter_errors = [abs(e["error"]) for e in self.model["errors"] if e["iteration"] == self.iteration]
    prev_iter_errors = [abs(e["error"]) for e in self.model["errors"] if e["iteration"] == self.iteration - 1]
    
    if not prev_iter_errors or not current_iter_errors:
        return 0.0
    
    prev_avg = sum(prev_iter_errors) / len(prev_iter_errors)
    curr_avg = sum(current_iter_errors) / len(current_iter_errors)
    
    if prev_avg == 0:
        return 0.0
    
    return (prev_avg - curr_avg) / prev_avg
```

### Hour 3: Integration and Testing (45 min)

#### 8. Create Main Execution Script
```python
# run_git_archaeology.py
def main():
    """Main execution function"""
    print("Git Archaeology Workflow - Learning Loop")
    print("=" * 50)
    
    # Initialize workflow
    workflow = GitArchaeologyWorkflow()
    
    # Run 3 iterations to demonstrate learning
    for i in range(3):
        # Run iteration
        results = workflow.run_iteration()
        
        # Extract insights
        insights = workflow.extract_insights()
        
        print(f"\n📊 Insights from iteration {workflow.iteration}:")
        for insight in insights[:3]:  # Show top 3
            print(f"  • {insight['insight']}")
            print(f"    → {insight['actionable']}")
        
        print("\n" + "-" * 50)
        
        # Save summary report
        report = {
            "iteration": workflow.iteration,
            "results": results,
            "insights": insights,
            "metrics": {
                "avg_error": sum(abs(r["learning"]["error"]) for r in results) / len(results),
                "improvement": workflow.calculate_improvement()
            }
        }
        
        report_file = f".clmem/git-archaeology/reports/iter_{workflow.iteration}.json"
        os.makedirs(os.path.dirname(report_file), exist_ok=True)
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
    
    print("\n✅ Learning loop complete!")
    print(f"Final model state saved to: {workflow.state_file}")
    
    # Show learning summary
    print("\n📈 Learning Summary:")
    errors_by_iter = {}
    for e in workflow.model["errors"]:
        iter_num = e["iteration"]
        if iter_num not in errors_by_iter:
            errors_by_iter[iter_num] = []
        errors_by_iter[iter_num].append(abs(e["error"]))
    
    for iter_num, errors in sorted(errors_by_iter.items()):
        avg_error = sum(errors) / len(errors)
        print(f"  Iteration {iter_num}: Avg error = {avg_error:.1f}")

if __name__ == "__main__":
    main()
```

#### 9. Test Persistence
```python
# test_persistence.py
def test_persistence():
    """Verify learning persists across sessions"""
    
    # Run first iteration
    workflow1 = GitArchaeologyWorkflow()
    workflow1.run_iteration(branches=["main"])
    initial_pred = workflow1.model["predictions"].get("main", {}).get("value", 75)
    
    # Create new instance (simulates restart)
    workflow2 = GitArchaeologyWorkflow()
    loaded_pred = workflow2.model["predictions"].get("main", {}).get("value", 75)
    
    assert loaded_pred == initial_pred, "State didn't persist!"
    print(f"✅ Persistence test passed: {loaded_pred} == {initial_pred}")
    
    # Run another iteration
    workflow2.run_iteration(branches=["main"])
    new_pred = workflow2.model["predictions"].get("main", {}).get("value", 75)
    
    print(f"📊 Prediction evolution: {75} → {initial_pred:.0f} → {new_pred:.0f}")
    
    if abs(new_pred - initial_pred) > 0.01:
        print("✅ Learning confirmed: Predictions are updating")
    else:
        print("⚠️ No learning detected: Predictions unchanged")
```

### Hour 4: Validation and Documentation (30 min)

#### 10. Create Validation Script
```python
# validate_learning.py
def validate_learning():
    """Validate that learning is actually happening"""
    
    workflow = GitArchaeologyWorkflow()
    
    # Clear previous state for clean test
    workflow.model = {
        "iteration": 0,
        "predictions": {},
        "errors": [],
        "learning_rate": 0.3
    }
    
    test_branches = ["main", "origin/main"]
    errors_per_iteration = []
    
    print("Validation: Running 3 iterations to verify learning...")
    
    for i in range(3):
        results = workflow.run_iteration(branches=test_branches)
        avg_error = sum(abs(r["learning"]["error"]) for r in results) / len(results)
        errors_per_iteration.append(avg_error)
        print(f"Iteration {i+1}: Average error = {avg_error:.1f}")
    
    # Check if errors decreased
    if errors_per_iteration[2] < errors_per_iteration[0]:
        improvement = (errors_per_iteration[0] - errors_per_iteration[2]) / errors_per_iteration[0]
        print(f"\n✅ LEARNING VALIDATED: Error reduced by {improvement:.1%}")
        return True
    else:
        print(f"\n❌ LEARNING FAILED: Errors did not decrease")
        print(f"   Error progression: {errors_per_iteration}")
        return False
```

## File Structure

```
.clmem/git-archaeology/
├── state/
│   └── model.json          # Current model state
├── predictions/
│   └── iter_N_branch.json  # Predictions per iteration/branch
├── observations/
│   └── iter_N_branch.json  # Observations per iteration/branch
├── insights/
│   └── iter_N.json         # Insights per iteration
└── reports/
    └── iter_N.json         # Summary reports

/workspace/
├── git_archaeology.py      # Main workflow class
├── run_git_archaeology.py  # Execution script
├── test_persistence.py     # Persistence testing
└── validate_learning.py    # Learning validation
```

## Execution Instructions

### Step 1: Initial Setup
```bash
cd /workspace
python -c "from git_archaeology import GitArchaeologyWorkflow; w = GitArchaeologyWorkflow(); print('Setup complete')"
```

### Step 2: Run First Learning Loop
```bash
python run_git_archaeology.py
```

### Step 3: Verify Persistence
```bash
python test_persistence.py
```

### Step 4: Validate Learning
```bash
python validate_learning.py
```

## Success Metrics

### Iteration 1 (Baseline)
- Predictions made for all branches
- Observations collected
- Errors calculated
- State saved

### Iteration 2 (Learning)
- Predictions different from iteration 1
- Average error reduced by >10%
- At least 1 insight generated
- Model state updated

### Iteration 3 (Validation)
- Average error reduced by >20% from baseline
- 3+ actionable insights generated
- Learning curve visible in metrics
- Model converging toward reality

## Next Steps (After Success)

1. **Add More Targets**: Stall points, file clusters, merge conflicts
2. **Parallelize**: Run branches simultaneously
3. **Strategy Competition**: Test multiple learning strategies
4. **Meta-Learning**: Learn which learning rates work best
5. **Generalization**: Extract workflow template for other domains

## Key Principle

**Start simple, verify learning, then complexify.**

The goal is not perfect predictions but demonstrated improvement. Even a 1% accuracy gain proves the learning loop works.

---
*Plan created: 2025-08-17*
*Focus: Working learning loop for git archaeology*
*Method: Bottom-up from core loop to full workflow*