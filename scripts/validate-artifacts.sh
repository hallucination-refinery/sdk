#!/usr/bin/env bash
set -euo pipefail

RUN_DIR="${1:?usage: $0 <run_dir> <session_start_epoch_ms>}"
SESSION_START_EPOCH_MS="${2:?usage: $0 <run_dir> <session_start_epoch_ms>}"

manifest="$RUN_DIR/session-manifest.json"
if [[ ! -f "$manifest" ]]; then
  echo "session-manifest.json not found in $RUN_DIR" >&2
  exit 1
fi

fail=0
while read -r path; do
  # strip quotes
  file="${path%\"}"
  file="${file#\"}"
  if [[ ! -f "$file" ]]; then
    echo "Missing artifact: $file" >&2
    fail=1
    continue
  fi
  mtime_ms=$(($(stat -c %Y "$file") * 1000))
  if (( mtime_ms < SESSION_START_EPOCH_MS )); then
    echo "Stale artifact (mtime<$SESSION_START_EPOCH_MS): $file" >&2
    fail=1
  fi
done < <(jq -r '[.sessions[]?.required_artifacts[]?] | unique[]' "$manifest" 2>/dev/null || echo "")

exit $fail