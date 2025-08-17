import json
from pathlib import Path
from datetime import datetime
import subprocess


class GitArchaeologyWorkflow:
	def __init__(self) -> None:
		self.base_path = Path(".clmem/workflows/git-archaeology")
		self.base_path.mkdir(parents=True, exist_ok=True)
		self.iteration = self._load_iteration()

	def _load_iteration(self) -> int:
		state_file = self.base_path / "state.json"
		if state_file.exists():
			try:
				return int(json.loads(state_file.read_text()).get("iteration", 0))
			except Exception:
				return 0
		return 0

	def extract_git_patterns(self) -> str:
		result = subprocess.run(
			["git", "log", "--oneline", "--graph", "-20"], capture_output=True, text=True
		)
		artifacts_path = self.base_path / "artifacts" / f"git_log_iter_{self.iteration}.txt"
		artifacts_path.parent.mkdir(parents=True, exist_ok=True)
		artifacts_path.write_text(result.stdout)
		return result.stdout

	def make_predictions(self, git_data: str) -> dict:
		predictions = {
			"stall_points": ["TODO: Analyze from git data"],
			"complexity_indicators": ["TODO: Extract from patterns"],
			"timestamp": datetime.now().isoformat(),
			"iteration": self.iteration,
		}
		pred_file = self.base_path / "predictions" / f"iter_{self.iteration}.json"
		pred_file.parent.mkdir(parents=True, exist_ok=True)
		pred_file.write_text(json.dumps(predictions, indent=2))
		return predictions


