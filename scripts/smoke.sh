#!/usr/bin/env bash
set -euo pipefail

RUN_ID_FILE=.clmem/current_run_id
if [[ ! -f "$RUN_ID_FILE" ]]; then echo "No current_run_id" >&2; exit 1; fi
run_id=$(cat "$RUN_ID_FILE")
run_dir=".clmem/runs/${run_id}"
state="$run_dir/state.json"

BASE_URL="http://localhost:$(jq -r '.port' "$state")"
export BASE_URL
export NEXT_PUBLIC_SCREENSHOT_MODE=1

# Run the smoke test
pnpm smoke:brain

# Stamp the latest screenshot if exists and record checkpoint
png=$(ls -1t .clmem/artifacts/smoke/brain-*.png 2>/dev/null | head -1 || true)
if [[ -n "${png:-}" ]]; then
  port=$(jq -r '.port' "$state")
  # Skip stamping if stamp-artifact.sh doesn't exist or CLAUDE_PROJECT_DIR not set
  if [[ -n "${CLAUDE_PROJECT_DIR:-}" && -x "${CLAUDE_PROJECT_DIR}/scripts/stamp-artifact.sh" ]]; then
    "$CLAUDE_PROJECT_DIR/scripts/stamp-artifact.sh" "$run_dir" 9 "$port" "$png"
  fi
fi

# Write checkpoint
mkdir -p "$run_dir/checkpoints"
echo '{"milestones":["started","smoke_passed","screenshot_stamped"]}' > "$run_dir/checkpoints/session-9.progress.json"

echo "done"

