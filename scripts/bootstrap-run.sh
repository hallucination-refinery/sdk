#!/usr/bin/env bash
set -euo pipefail

# usage: bootstrap-run.sh <initiative> <session> <workflow_path>
INITIATIVE="${1:?usage: $0 <initiative> <session> <workflow_path>}"
SESSION="${2:?usage: $0 <initiative> <session> <workflow_path>}"
WORKFLOW_PATH="${3:?usage: $0 <initiative> <session> <workflow_path>}"

mkdir -p .clmem/runs

ts_utc=$(date -u +%Y%m%d_%H%M%S)
run_id="${ts_utc}_${INITIATIVE}-${SESSION}"
run_dir=".clmem/runs/${run_id}"
mkdir -p "$run_dir"

echo -n "$run_id" > .clmem/current_run_id

start_iso=$(date -u +%FT%TZ)
start_epoch_ms=$(( $(date -u +%s) * 1000 ))

cat >"$run_dir/state.json" <<JSON
{
  "run_id": "${run_id}",
  "started_at": "${start_iso}",
  "start_epoch_ms": ${start_epoch_ms},
  "workflow_path": "${WORKFLOW_PATH}",
  "port": null,
  "pid": null,
  "screenshots": [],
  "acceptance": {},
  "artifacts": {}
}
JSON

echo "$run_dir"

