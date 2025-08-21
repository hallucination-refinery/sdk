#!/usr/bin/env bash
set -euo pipefail
export TZ=UTC

# If a run is already active, do nothing
if [[ -f .clmem/current_run_id ]]; then
  exit 0
fi

INITIATIVE="${INITIATIVE:-cryptiq-mindmap-mvp}"
SESSION="${SESSION:-ALL}"
WORKFLOW_PATH="${WORKFLOW_PATH:-docs/initiatives/cryptiq-mindmap-mvp/workflow-03.md}"

bash scripts/bootstrap-run.sh "$INITIATIVE" "$SESSION" "$WORKFLOW_PATH"

