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
        default_model = {
            "iteration": 0,
            "predictions": {},
            "errors": [],
            "learning_rate": 0.3
        }
        
        if os.path.exists(self.state_file):
            try:
                with open(self.state_file) as f:
                    model = json.load(f)
                    # Validate required fields
                    for key in default_model:
                        if key not in model:
                            model[key] = default_model[key]
                    return model
            except (json.JSONDecodeError, IOError) as e:
                print(f"Warning: Could not load state, using defaults: {e}")
        
        return default_model
    
    def save_model(self):
        """Persist model state"""
        os.makedirs(os.path.dirname(self.state_file), exist_ok=True)
        with open(self.state_file, 'w') as f:
            json.dump(self.model, f, indent=2)
    
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
        pred_file = f".clmem/git-archaeology/predictions/iter_{self.iteration}_{branch.replace('/', '_')}.json"
        os.makedirs(os.path.dirname(pred_file), exist_ok=True)
        with open(pred_file, 'w') as f:
            json.dump(pred_record, f)
        
        return pred_record
    
    def observe_commit_count(self, branch: str) -> Dict:
        """Safely get actual commit count for branch"""
        try:
            # Use list format to prevent shell injection
            result = subprocess.run(
                ["git", "rev-list", "--count", branch],
                capture_output=True,
                text=True,
                cwd=self.repo_path,
                timeout=30
            )
            if result.returncode != 0:
                print(f"Git command failed for {branch}: {result.stderr}")
                actual_count = 0
            else:
                actual_count = int(result.stdout.strip())
        except (subprocess.TimeoutExpired, ValueError) as e:
            print(f"Error observing {branch}: {e}")
            actual_count = 0
        
        obs_record = {
            "branch": branch,
            "target": "commit_count",
            "observed": actual_count,
            "iteration": self.iteration,
            "timestamp": datetime.now().isoformat()
        }
        
        # Save observation
        obs_file = f".clmem/git-archaeology/observations/iter_{self.iteration}_{branch.replace('/', '_')}.json"
        os.makedirs(os.path.dirname(obs_file), exist_ok=True)
        with open(obs_file, 'w') as f:
            json.dump(obs_record, f)
        
        return obs_record
    
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
        if abs(error) > 0:
            new_confidence = min(0.9, 0.5 + 0.1 * (1 - min(abs(error) / 100, 1)))
        else:
            new_confidence = 0.9
        
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
        if len(branches) > 0:
            avg_error = total_error / len(branches)
        else:
            avg_error = 0
        improvement = self.calculate_improvement()
        
        print(f"\nAverage error: {avg_error:.1f}")
        print(f"Improvement from last iteration: {improvement:.1%}")
        
        # Update model iteration
        self.model["iteration"] = self.iteration
        self.save_model()
        
        return results
    
    def get_branches(self) -> List[str]:
        """Get list of branches in repository"""
        try:
            result = subprocess.run(
                ["git", "branch", "-r", "--format=%(refname:short)"],
                capture_output=True,
                text=True,
                cwd=self.repo_path,
                timeout=10
            )
            if result.returncode != 0:
                print(f"Failed to list branches: {result.stderr}")
                return []
            branches = [b.strip() for b in result.stdout.split('\n') if b.strip()]
            return branches
        except (subprocess.TimeoutExpired, OSError) as e:
            print(f"Error getting branches: {e}")
            return []
    
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
            if branch_errors:
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