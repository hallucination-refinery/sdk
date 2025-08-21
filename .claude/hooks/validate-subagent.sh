#!/usr/bin/env bash
set -euo pipefail

# Read run directory from env or current_run_id
run_id_file=".clmem/current_run_id"
if [[ ! -f "$run_id_file" ]]; then
  exit 0
fi
run_id=$(cat "$run_id_file")
run_dir=".clmem/runs/${run_id}"

manifest="$run_dir/session-manifest.json"
if [[ ! -f "$manifest" ]]; then
  exit 0
fi

# Validate that required artifacts exist, are named with run_id, and have fresh mtimes
start_ms=$(jq -r '.start_epoch_ms // 0' "$run_dir/state.json" 2>/dev/null || echo 0)
fail=0
while read -r f; do
  f="${f%"}"
  f="${f#"}"
  if [[ ! -f "$f" ]]; then echo "Missing: $f" >&2; fail=1; continue; fi
  if [[ "$f" != *"$run_id"* ]]; then echo "Wrong run_id in name: $f" >&2; fail=1; fi
  mtime_ms=$(($(stat -c %Y "$f") * 1000))
  if (( mtime_ms < start_ms )); then echo "Stale: $f" >&2; fail=1; fi
done < <(jq -r '[.sessions[]?.required_artifacts[]?] | unique[]' "$manifest" 2>/dev/null || echo "")

exit $fail

