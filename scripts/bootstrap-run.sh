#!/usr/bin/env bash
set -euo pipefail

# usage: bootstrap-run.sh <initiative> <session> <workflow_path>
INITIATIVE="${1:?usage: $0 <initiative> <session> <workflow_path>}"
SESSION="${2:?usage: $0 <initiative> <session> <workflow_path>}"
WORKFLOW_PATH="${3:?usage: $0 <initiative> <session> <workflow_path>}"

mkdir -p .clmem/runs .clmem/locks

ts_utc=$(date -u +%Y%m%d_%H%M%S)
run_id="${ts_utc}_${INITIATIVE}-${SESSION}"
run_dir=".clmem/runs/${run_id}"
mkdir -p "$run_dir"

echo -n "$run_id" > .clmem/current_run_id

start_iso=$(date -u +%FT%TZ)
start_epoch_ms=$(( $(date -u +%s) * 1000 ))

# Write SoT with flock to avoid races
(
  flock -w 5 9 || { echo "lock timeout" >&2; exit 1; }
  cat >"$run_dir/state.json" <<JSON
{
  "schema_version": "1.0",
  "run_id": "${run_id}",
  "started_at": "${start_iso}",
  "start_epoch_ms": ${start_epoch_ms},
  "workflow_path": "${WORKFLOW_PATH}",
  "port": null,
  "pid": null,
  "completed_sessions": [],
  "checkpoints": {},
  "artifacts": {}
}
JSON
  ) 9>.clmem/locks/state.lock

echo "$run_dir"

