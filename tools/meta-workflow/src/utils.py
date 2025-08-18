from __future__ import annotations

import json
import os
import tempfile
from datetime import datetime
from typing import Any, Dict, Iterable


def atomic_write_json(path: str, obj: Any) -> None:
	"""Write JSON atomically: write to tmp, then rename."""
	os.makedirs(os.path.dirname(path), exist_ok=True)
	fd, tmp_path = tempfile.mkstemp(prefix=".tmp_", dir=os.path.dirname(path))
	try:
		with os.fdopen(fd, "w", encoding="utf-8") as f:
			json.dump(obj, f, ensure_ascii=False, indent=2)
			f.write("\n")
		os.replace(tmp_path, path)
	except Exception:
		try:
			os.remove(tmp_path)
		except Exception:
			pass
		raise


def validate_prediction(rec: Dict[str, Any]) -> None:
	"""Minimal schema validator for prediction records."""
	required = ["branch", "target", "value", "confidence", "method", "ts"]
	for key in required:
		if key not in rec:
			raise ValueError(f"prediction missing required key: {key}")
	if not isinstance(rec["confidence"], (int, float)) or not (0 <= rec["confidence"] <= 1):
		raise ValueError("prediction.confidence must be in [0,1]")


def validate_observation(rec: Dict[str, Any]) -> None:
	"""Minimal schema validator for observation records."""
	required = ["branch", "target", "observed", "ts"]
	for key in required:
		if key not in rec:
			raise ValueError(f"observation missing required key: {key}")


def iso_now() -> str:
	return datetime.utcnow().isoformat(timespec="seconds") + "Z"


