#!/usr/bin/env bash
set -euo pipefail

# usage: mesh-verify.sh <run_dir> <obj_path>
RUN_DIR="${1:?usage: $0 <run_dir> <obj_path>}"
OBJ="${2:?usage: $0 <run_dir> <obj_path>}"

if [[ ! -f "$OBJ" ]]; then echo "missing OBJ: $OBJ" >&2; exit 1; fi

# crude vertex count: count of lines starting with 'v '
COUNT=$(grep -E '^v\s' "$OBJ" | wc -l | tr -d ' ')
echo "$COUNT" > "$RUN_DIR/vertex-count.txt"

port=$(jq -r '.port // 0' "$RUN_DIR/state.json")
"$CLAUDE_PROJECT_DIR/scripts/stamp-artifact.sh" "$RUN_DIR" 2 "$port" "$RUN_DIR/vertex-count.txt"

if (( COUNT < 35000 || COUNT > 50000 )); then
  echo "OUT_OF_RANGE" >&2
  exit 2
fi
echo "OK"

