#!/usr/bin/env python3
"""Validate that learning is actually happening"""

from git_archaeology import GitArchaeologyWorkflow

def validate_learning():
    """Validate that learning is actually happening"""
    
    print("Validation: Running 3 iterations to verify learning...")
    print("=" * 50)
    
    workflow = GitArchaeologyWorkflow()
    
    # Clear previous state for clean test
    workflow.model = {
        "iteration": 0,
        "predictions": {},
        "errors": [],
        "learning_rate": 0.3
    }
    
    test_branches = ["origin/main", "origin/refactor/context-consolidation-aug17"]
    errors_per_iteration = []
    
    for i in range(3):
        results = workflow.run_iteration(branches=test_branches)
        if results:
            avg_error = sum(abs(r["learning"]["error"]) for r in results) / len(results)
        else:
            avg_error = float('inf')
        errors_per_iteration.append(avg_error)
        print(f"Iteration {i+1}: Average error = {avg_error:.1f}")
    
    # Check if errors decreased
    print("\n" + "=" * 50)
    if len(errors_per_iteration) >= 2 and errors_per_iteration[-1] < errors_per_iteration[0]:
        improvement = (errors_per_iteration[0] - errors_per_iteration[-1]) / errors_per_iteration[0]
        print(f"✅ LEARNING VALIDATED: Error reduced by {improvement:.1%}")
        print(f"   Error progression: {[f'{e:.1f}' for e in errors_per_iteration]}")
        return True
    else:
        print(f"❌ LEARNING FAILED: Errors did not decrease")
        print(f"   Error progression: {[f'{e:.1f}' for e in errors_per_iteration]}")
        return False

if __name__ == "__main__":
    success = validate_learning()
    exit(0 if success else 1)