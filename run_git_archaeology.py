#!/usr/bin/env python3
"""Main execution script for Git Archaeology Workflow"""

import json
import os
from git_archaeology import GitArchaeologyWorkflow

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
                "avg_error": sum(abs(r["learning"]["error"]) for r in results) / len(results) if results else 0,
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