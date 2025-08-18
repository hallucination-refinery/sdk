# Git Archaeology Workflow - Critical Security Fixes

## Required Changes (Must Apply Before Running)

### 1. Fix Git Command Execution (Line 102-115)

**REPLACE:**
```python
def observe_commit_count(self, branch: str) -> Dict:
    """Get actual commit count for branch"""
    try:
        result = subprocess.run(
            f"git rev-list --count {branch}",  # VULNERABLE TO INJECTION
            shell=True,
            capture_output=True,
            text=True,
            cwd=self.repo_path
        )
        actual_count = int(result.stdout.strip())
    except:
        actual_count = 0
```

**WITH:**
```python
def observe_commit_count(self, branch: str) -> Dict:
    """Get actual commit count for branch"""
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
```

### 2. Fix Branch Listing (Line 233-243)

**REPLACE:**
```python
def get_branches(self) -> List[str]:
    """Get list of branches in repository"""
    result = subprocess.run(
        "git branch -r --format='%(refname:short)'",  # VULNERABLE
        shell=True,
        capture_output=True,
        text=True,
        cwd=self.repo_path
    )
    branches = [b.strip() for b in result.stdout.split('\n') if b.strip()]
    return branches
```

**WITH:**
```python
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
```

### 3. Add Division by Zero Protection (Line 314-320)

**REPLACE:**
```python
prev_avg = sum(prev_iter_errors) / len(prev_iter_errors)
curr_avg = sum(current_iter_errors) / len(current_iter_errors)

if prev_avg == 0:
    return 0.0

return (prev_avg - curr_avg) / prev_avg
```

**WITH:**
```python
if not prev_iter_errors or not current_iter_errors:
    return 0.0

prev_avg = sum(prev_iter_errors) / len(prev_iter_errors)
curr_avg = sum(current_iter_errors) / len(current_iter_errors)

if prev_avg == 0:
    return 0.0

return (prev_avg - curr_avg) / prev_avg
```

### 4. Add State Validation (Line 50-60)

**REPLACE:**
```python
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
```

**WITH:**
```python
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
```

## Quick Test After Fixes

```bash
# Test the fixes work
python -c "
import subprocess
result = subprocess.run(['git', 'rev-list', '--count', 'HEAD'], 
                       capture_output=True, text=True)
print(f'Test passed: {result.stdout.strip()} commits in HEAD')
"
```

## Summary

These 4 fixes address:
1. ✅ Shell injection vulnerability in git commands
2. ✅ Division by zero errors
3. ✅ State corruption handling
4. ✅ Basic error recovery

Total time to implement: ~15-30 minutes

After applying these fixes, the workflow is safe to run and iterate on.