from __future__ import annotations

import argparse
import json
import os
import subprocess
import time
from statistics import mean
from typing import Dict, List

try:
    # When executed as a package module
    from .utils import atomic_write_json, iso_now
except Exception:
    # Fallback when run as a plain script
    import os as _os, sys as _sys
    _sys.path.insert(0, _os.path.dirname(__file__))
    from utils import atomic_write_json, iso_now  # type: ignore


BASE = ".clmem/workflows/git-archaeology"


def append_jsonl(path: str, obj: dict) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "a", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False)
        f.write("\n")


def git_commit_count(branch: str) -> int:
    result = subprocess.run(
        ["git", "rev-list", "--count", branch], capture_output=True, text=True
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"git rev-list failed for {branch}")
    return int(result.stdout.strip())


def predict_commit_count(branch: str) -> Dict:
    return {
        "branch": branch,
        "target": "commit_count",
        "value": 75,
        "confidence": 0.5,
        "method": "v0_baseline",
        "ts": iso_now(),
    }


def accuracy_numeric(pred: float, obs: float, scale: float = 100.0) -> float:
    return max(0.0, 1.0 - min(abs(pred - obs) / scale, 1.0))


def compute_state(iteration: int, rows: List[Dict]) -> Dict:
    per_item_acc = [r["item_accuracy"] for r in rows]
    state = {
        "iteration": iteration,
        "accuracy": round(mean(per_item_acc), 4) if per_item_acc else 0.0,
        "uncertainty": round(mean(abs(r["prediction"]["confidence"] - r["item_accuracy"]) for r in rows), 4)
        if rows
        else 1.0,
        "insights": 0,
        "timestamp": iso_now(),
        "cost": {
            "wall_seconds": None,  # filled by caller
        },
    }
    return state


def compute_delta(prev_state: Dict, cur_state: Dict) -> Dict:
    dt_s = None
    try:
        # Best-effort wall time delta if previous stored it
        dt_s = max(0.0, float(cur_state["cost"].get("wall_seconds", 0.0)))
    except Exception:
        dt_s = None
    acc_impr = cur_state["accuracy"] - prev_state.get("accuracy", 0.0)
    delta = {
        "from": prev_state.get("iteration"),
        "to": cur_state.get("iteration"),
        "accuracy_improvement": round(acc_impr, 4),
        "uncertainty_reduction": round(prev_state.get("uncertainty", 1.0) - cur_state.get("uncertainty", 1.0), 4),
        "insights_added": int(cur_state.get("insights", 0) - prev_state.get("insights", 0)),
        "time_to_learn_s": dt_s,
        "iterations_required": 1,
        "velocity": round(acc_impr / dt_s, 6) if dt_s and dt_s > 0 else None,
        "efficiency": None,
    }
    return delta


def write_report(iteration: int, rows: List[Dict], state: Dict) -> None:
    lines = [
        f"# Git Archaeology – Iteration {iteration}",
        "",
        f"Accuracy: {state['accuracy']:.4f}  |  Uncertainty: {state['uncertainty']:.4f}",
        "",
        "| branch | pred | obs | item_acc | method |",
        "|--------|------|-----|----------|--------|",
    ]
    for r in rows:
        lines.append(
            f"| {r['branch']} | {r['prediction']['value']} | {r['observation']['observed']} | {r['item_accuracy']:.3f} | {r['prediction']['method']} |"
        )
    out_path = os.path.join(BASE, "reports", f"iter_{iteration}.md")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Run V0 local loop (commit_count)")
    parser.add_argument("--branches", type=str, default="main", help="Comma-separated list of branches")
    parser.add_argument("--iteration", type=int, default=0, help="Iteration number to write")
    args = parser.parse_args()

    branches = [b.strip() for b in args.branches.split(",") if b.strip()]
    iteration = args.iteration

    os.makedirs(BASE, exist_ok=True)

    t0 = time.perf_counter()
    rows: List[Dict] = []

    # Open files for this iteration
    pred_path = os.path.join(BASE, "predictions", f"iter_{iteration}.jsonl")
    obs_path = os.path.join(BASE, "observations", f"iter_{iteration}.jsonl")

    for br in branches:
        pred = predict_commit_count(br)
        append_jsonl(pred_path, pred)

        obs_val = git_commit_count(br)
        obs = {"branch": br, "target": "commit_count", "observed": obs_val, "ts": iso_now()}
        append_jsonl(obs_path, obs)

        rows.append(
            {
                "branch": br,
                "prediction": pred,
                "observation": obs,
                "item_accuracy": accuracy_numeric(pred["value"], obs_val, scale=100.0),
            }
        )

    # Compute and persist state
    state = compute_state(iteration, rows)
    state["cost"]["wall_seconds"] = round(time.perf_counter() - t0, 3)
    state_path = os.path.join(BASE, "states", f"iter_{iteration}.json")
    atomic_write_json(state_path, state)

    # Compute delta if previous state exists
    prev_path = os.path.join(BASE, "states", f"iter_{iteration-1}.json")
    if iteration > 0 and os.path.exists(prev_path):
        with open(prev_path, "r", encoding="utf-8") as f:
            prev_state = json.load(f)
        delta = compute_delta(prev_state, state)
        delta_path = os.path.join(BASE, "deltas", f"iter_{iteration-1}_to_{iteration}.json")
        atomic_write_json(delta_path, delta)

    # Write report
    write_report(iteration, rows, state)

    # Print minimal summary for operator
    print(json.dumps({"iteration": iteration, "accuracy": state["accuracy"], "wall_seconds": state["cost"]["wall_seconds"]}))


if __name__ == "__main__":
    main()


