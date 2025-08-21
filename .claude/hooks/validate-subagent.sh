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
  # require sidecar and hash consistency when available
  sidecar="${f%.*}.json"
  if [[ -f "$sidecar" ]]; then
    sc_sha=$(jq -r '.sha256 // empty' "$sidecar" 2>/dev/null || true)
    if [[ -n "$sc_sha" ]]; then
      real_sha=$(sha256sum "$f" | awk '{print $1}')
      if [[ "$real_sha" != "$sc_sha" ]]; then echo "Hash mismatch: $f" >&2; fail=1; fi
    fi
    created=$(jq -r '.utc_created // empty' "$sidecar" 2>/dev/null || true)
    if [[ -n "$created" ]]; then
      c_ms=$(date -u -d "$created" +%s000)
      now_ms=$(date -u +%s000)
      low=$((start_ms - 30000)); high=$((now_ms + 30000))
      if (( c_ms < low || c_ms > high )); then echo "Sidecar time sanity failed: $sidecar" >&2; fail=1; fi
    fi
  fi
done < <(jq -r '[.sessions[]?.required_artifacts[]?] | unique[]' "$manifest" 2>/dev/null || echo "")

if (( fail != 0 )); then exit 2; fi
exit 0

