#!/usr/bin/env python3
import json
import sys
from typing import Dict, Any

try:
	import dspy  # type: ignore
	_HAS_DSPY = True
except Exception:
	_HAS_DSPY = False


def _maybe_configure_dspy() -> None:
	if not _HAS_DSPY:
		return
	class StdoutLM:  # minimal shim; avoids typing against dspy interfaces
		def __call__(self, prompt, **kwargs):
			request = {"type": "llm_complete", "prompt": prompt, **kwargs}
			print(json.dumps(request), flush=True)
			line = sys.stdin.readline()
			if not line:
				return ""
			response = json.loads(line)
			return response.get("completion", "")
	try:
		dspy.settings.configure(lm=StdoutLM())  # type: ignore[attr-defined]
	except Exception:
		pass


class MetaWorkflowRunner:
	def __init__(self) -> None:
		_maybe_configure_dspy()

	def process_command(self, cmd: Dict[str, Any]) -> Dict[str, Any]:
		cmd_type = cmd.get("type")
		if cmd_type == "complete":
			return {"status": "ready", "dspy": _HAS_DSPY}
		if cmd_type == "git_extract":
			return {"status": "extracted", "artifacts": [], "dspy": _HAS_DSPY}
		return {"status": "error", "message": f"unknown command: {cmd_type}"}


if __name__ == "__main__":
	runner = MetaWorkflowRunner()
	for line in sys.stdin:
		line = line.strip()
		if not line:
			continue
		try:
			cmd = json.loads(line)
		except Exception as ex:
			print(json.dumps({"status": "error", "message": f"invalid json: {ex}"}))
			continue
		result = runner.process_command(cmd)
		print(json.dumps(result), flush=True)
