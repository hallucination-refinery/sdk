"""
Test DSPy learning amplification in Claude Code environment.
This validates our core architectural assumption.
"""
import json
import time
from pathlib import Path
from datetime import datetime
from typing import Dict

import dspy


# Configure DSPy for Claude
dspy.settings.configure(lm=dspy.Claude(), temperature=0.3)


class StallPointPredictor(dspy.Module):
	"""Predict development stall points from git commit patterns"""

	def __init__(self):
		super().__init__()
		self.predict = dspy.ChainOfThought(
			"git_commits -> stall_indicators, confidence_score, evidence"
		)

	def forward(self, commits: str):
		return self.predict(git_commits=commits)


class ArchitecturalRiskAnalyzer(dspy.Module):
	"""Analyze architectural risks from code patterns"""

	def __init__(self):
		super().__init__()
		self.analyze = dspy.Predict(
			"file_changes, commit_messages -> risk_assessment, risk_score"
		)

	def forward(self, file_changes: str, messages: str):
		return self.analyze(file_changes=file_changes, commit_messages=messages)


def measure_prediction_quality(prediction: dspy.Prediction) -> Dict[str, float]:
	"""Quantify prediction quality metrics"""
	# Extract confidence if present
	confidence = 0.5  # default
	if hasattr(prediction, 'confidence_score'):
		try:
			confidence = float(str(prediction.confidence_score).strip('%').strip())
			if confidence > 1:
				confidence = confidence / 100
		except Exception:
			pass

	# Measure evidence quality (simple heuristic)
	evidence_score = 0.0
	if hasattr(prediction, 'evidence'):
		evidence = str(prediction.evidence)
		# Score based on specificity
		if 'commit' in evidence.lower():
			evidence_score += 0.3
		if any(marker in evidence.lower() for marker in ['wip', 'temp', 'hack', 'fixme']):
			evidence_score += 0.4
		if len(evidence) > 50:  # Non-trivial explanation
			evidence_score += 0.3

	return {
		'confidence': confidence,
		'evidence_score': min(evidence_score, 1.0),
		'has_prediction': hasattr(prediction, 'stall_indicators'),
		'prediction_length': len(str(getattr(prediction, 'stall_indicators', '')))
	}


def test_learning_loop() -> Dict[str, object]:
	"""Validate that DSPy can improve predictions through examples"""

	results = {
		'start_time': datetime.now().isoformat(),
		'environment': 'claude_code',
		'tests': {}
	}

	# Test Case 1: Stall Point Detection
	print("=== Test 1: Stall Point Detection ===")

	test_commits = """
	a1b2c3d - feat: initial canvas implementation
	e4f5g6h - fix: resolve rendering issues  
	i7j8k9l - refactor: extract latent module (WIP)
	m1n2o3p - wip: debugging canvas integration
	q4r5s6t - temp: comment out failing tests
	u7v8w9x - hack: bypass validation for demo
	"""

	# Initial prediction (no examples)
	predictor = StallPointPredictor()

	start_time = time.time()
	initial_pred = predictor(test_commits)
	initial_time = time.time() - start_time

	print(f"Initial prediction: {getattr(initial_pred, 'stall_indicators', '')}")
	print(f"Time taken: {initial_time:.2f}s")

	initial_metrics = measure_prediction_quality(initial_pred)
	print(f"Initial metrics: {json.dumps(initial_metrics, indent=2)}")

	# Create training examples with clear patterns
	trainset = [
		dspy.Example(
			git_commits="feat: add authentication\nfix: resolve login bug\nwip: still debugging session management\nwip: trying different approaches",
			stall_indicators="Multiple WIP commits indicate stall at session management implementation",
			confidence_score="0.85",
			evidence="Two consecutive WIP commits suggest developer struggling with implementation"
		).with_inputs("git_commits"),

		dspy.Example(
			git_commits="refactor: clean up user model\ntest: add user tests\ntemp: disable feature flag\nhack: skip validation",
			stall_indicators="TEMP and HACK commits show development stall with workarounds",
			confidence_score="0.90",
			evidence="Temporary disabling and validation bypass indicate blocked progress"
		).with_inputs("git_commits"),

		dspy.Example(
			git_commits="feat: implement search\ntest: search unit tests\nfix: search performance\ndocs: update search API",
			stall_indicators="No stall indicators detected - normal development flow",
			confidence_score="0.95",
			evidence="Consistent progress through feature, test, fix, and documentation"
		).with_inputs("git_commits"),
	]

	# Optimize with BootstrapFewShot
	from dspy.teleprompt import BootstrapFewShot

	print("\nOptimizing predictor with examples...")

	def validate_prediction(example, pred, trace=None):
		"""Metric for optimization - rewards specific, confident predictions"""
		metrics = measure_prediction_quality(pred)
		return metrics['confidence'] * metrics['evidence_score']

	config = dict(max_bootstrapped_demos=4, max_labeled_demos=3)
	optimizer = BootstrapFewShot(metric=validate_prediction, **config)

	start_time = time.time()
	optimized_predictor = optimizer.compile(predictor, trainset=trainset)
	optimization_time = time.time() - start_time

	print(f"Optimization completed in {optimization_time:.2f}s")

	# Test optimized prediction
	start_time = time.time()
	optimized_pred = optimized_predictor(test_commits)
	optimized_time = time.time() - start_time

	print(f"\nOptimized prediction: {getattr(optimized_pred, 'stall_indicators', '')}")
	print(f"Time taken: {optimized_time:.2f}s")

	optimized_metrics = measure_prediction_quality(optimized_pred)
	print(f"Optimized metrics: {json.dumps(optimized_metrics, indent=2)}")

	# Calculate improvement
	improvement = {
		'confidence_delta': optimized_metrics['confidence'] - initial_metrics['confidence'],
		'evidence_delta': optimized_metrics['evidence_score'] - initial_metrics['evidence_score'],
		'time_delta': optimized_time - initial_time,
		'quality_improvement': (optimized_metrics['confidence'] * optimized_metrics['evidence_score']) -
								  (initial_metrics['confidence'] * initial_metrics['evidence_score'])
	}

	results['tests']['stall_detection'] = {
		'initial': {
			'prediction': str(getattr(initial_pred, 'stall_indicators', '')),
			'metrics': initial_metrics,
			'time': initial_time,
		},
		'optimized': {
			'prediction': str(getattr(optimized_pred, 'stall_indicators', '')),
			'metrics': optimized_metrics,
			'time': optimized_time,
		},
		'improvement': improvement,
		'optimization_time': optimization_time,
	}

	# Test Case 2: State Persistence
	print("\n=== Test 2: State Persistence ===")

	state_dir = Path(".clmem/test_dspy")
	state_dir.mkdir(parents=True, exist_ok=True)

	# Save optimized predictor
	save_path = state_dir / "optimized_predictor.json"
	optimized_predictor.save(str(save_path))
	file_size = save_path.stat().st_size
	print(f"Saved optimized predictor to {save_path} ({file_size} bytes)")

	# Test reload
	loaded_predictor = StallPointPredictor()
	loaded_predictor.load(str(save_path))

	# Verify loaded predictor maintains optimization
	loaded_pred = loaded_predictor(test_commits)
	loaded_metrics = measure_prediction_quality(loaded_pred)

	persistence_valid = (
		loaded_metrics['confidence'] >= optimized_metrics['confidence'] - 0.1 and
		str(getattr(loaded_pred, 'stall_indicators', '')) == str(getattr(optimized_pred, 'stall_indicators', ''))
	)

	results['tests']['persistence'] = {
		'save_successful': save_path.exists(),
		'file_size': file_size,
		'reload_successful': persistence_valid,
		'loaded_metrics': loaded_metrics,
	}

	# Test Case 3: Cross-Module Learning
	print("\n=== Test 3: Cross-Module Learning ===")

	risk_analyzer = ArchitecturalRiskAnalyzer()

	test_changes = """
	Files changed: core/auth.py, core/session.py, lib/validation.py
	Added: 45 lines, Removed: 120 lines, Modified: 200 lines
	"""

	test_messages = """
	- refactor: extract authentication logic
	- wip: attempting to fix session handling  
	- temp: disable validation for testing
	"""

	risk_pred = risk_analyzer(test_changes, test_messages)
	print(f"Risk assessment: {getattr(risk_pred, 'risk_assessment', '')}")

	results['tests']['cross_module'] = {
		'module': 'ArchitecturalRiskAnalyzer',
		'executed': True,
		'has_assessment': hasattr(risk_pred, 'risk_assessment'),
		'has_score': hasattr(risk_pred, 'risk_score'),
	}

	# Summary
	results['summary'] = {
		'all_tests_completed': True,
		'learning_demonstrated': improvement['quality_improvement'] > 0,
		'persistence_working': results['tests']['persistence']['reload_successful'],
		'improvement_percentage': improvement['quality_improvement'] * 100,
		'total_execution_time': sum(t['time'] for t in [
			results['tests']['stall_detection']['initial'],
			results['tests']['stall_detection']['optimized'],
		]),
	}

	# Save complete results
	results_path = state_dir / f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
	results_path.write_text(json.dumps(results, indent=2))
	print(f"\nComplete results saved to: {results_path}")

	return results


if __name__ == "__main__":
	print("Testing DSPy Learning Loop in Claude Code Environment")
	print("=" * 50)

	try:
		results = test_learning_loop()

		print("\n" + "=" * 50)
		print("SUMMARY:")
		print(f"Learning Demonstrated: {results['summary']['learning_demonstrated']}")
		print(f"Improvement: {results['summary']['improvement_percentage']:.1f}%")
		print(f"Persistence Working: {results['summary']['persistence_working']}")
		print(f"Total Execution Time: {results['summary']['total_execution_time']:.2f}s")

		# Determine success
		success = (
			results['summary']['learning_demonstrated'] and
			results['summary']['persistence_working'] and
			results['summary']['improvement_percentage'] > 0
		)

		if success:
			print("\n✅ VALIDATION SUCCESSFUL: DSPy learning works in Claude Code!")
		else:
			print("\n❌ VALIDATION FAILED: See results for details")

	except Exception as e:
		print(f"\n❌ ERROR during validation: {type(e).__name__}: {e}")
		import traceback
		traceback.print_exc()


