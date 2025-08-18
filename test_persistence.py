#!/usr/bin/env python3
"""Test persistence of Git Archaeology Workflow state"""

from git_archaeology import GitArchaeologyWorkflow

def test_persistence():
    """Verify learning persists across sessions"""
    
    print("Testing state persistence...")
    print("-" * 40)
    
    # Run first iteration
    print("Phase 1: Initial run")
    workflow1 = GitArchaeologyWorkflow()
    results1 = workflow1.run_iteration(branches=["origin/main"])
    initial_pred = workflow1.model["predictions"].get("origin/main", {}).get("value", 75)
    initial_iteration = workflow1.model["iteration"]
    print(f"Initial prediction for origin/main: {initial_pred:.0f}")
    print(f"Iteration count: {initial_iteration}")
    
    # Create new instance (simulates restart)
    print("\nPhase 2: Loading saved state")
    workflow2 = GitArchaeologyWorkflow()
    loaded_pred = workflow2.model["predictions"].get("origin/main", {}).get("value", 75)
    loaded_iteration = workflow2.model["iteration"]
    
    if loaded_pred == initial_pred and loaded_iteration == initial_iteration:
        print(f"✅ Persistence test passed: {loaded_pred:.0f} == {initial_pred:.0f}")
        print(f"✅ Iteration preserved: {loaded_iteration} == {initial_iteration}")
    else:
        print(f"❌ Persistence test failed!")
        print(f"   Expected: {initial_pred:.0f}, Got: {loaded_pred:.0f}")
        print(f"   Expected iteration: {initial_iteration}, Got: {loaded_iteration}")
        return False
    
    # Run another iteration
    print("\nPhase 3: Running another iteration")
    results2 = workflow2.run_iteration(branches=["origin/main"])
    new_pred = workflow2.model["predictions"].get("origin/main", {}).get("value", 75)
    
    print(f"\n📊 Prediction evolution: 75 → {initial_pred:.0f} → {new_pred:.0f}")
    
    if abs(new_pred - initial_pred) > 0.01:
        print("✅ Learning confirmed: Predictions are updating")
        return True
    else:
        print("⚠️ No learning detected: Predictions unchanged")
        return False

if __name__ == "__main__":
    success = test_persistence()
    exit(0 if success else 1)