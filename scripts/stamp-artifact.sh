#!/usr/bin/env bash
set -euo pipefail

# usage: stamp-artifact.sh <run_dir> <session> <port> <file>
RUN_DIR="${1:?usage: $0 <run_dir> <session> <port> <file>}"
SESSION="${2:?usage: $0 <run_dir> <session> <port> <file>}"
PORT="${3:?usage: $0 <run_dir> <session> <port> <file>}"
FILE="${4:?usage: $0 <run_dir> <session> <port> <file>}"

if [[ ! -f "$FILE" ]]; then
  echo "artifact file not found: $FILE" >&2
  exit 1
fi

run_id=$(jq -r .run_id "$RUN_DIR/state.json")
run_start_ms=$(jq -r .start_epoch_ms "$RUN_DIR/state.json")
utc_created=$(date -u +%FT%TZ)
now_ms=$(date -u +%s000)
sha256=$(sha256sum "$FILE" | awk '{print $1}')

dir=$(dirname "$FILE")
base=$(basename "$FILE")
name="S${SESSION}-${run_id}-p${PORT}.${base##*.}"
target="$dir/$name"

mv -f "$FILE" "$target"
sidecar="${target%.${base##*.}}.json"

cat >"$sidecar" <<JSON
{
  "schema_version": "1.0",
  "run_id": "${run_id}",
  "session": ${SESSION},
  "port": ${PORT},
  "sha256": "${sha256}",
  "utc_created": "${utc_created}",
  "checks": {}
}
JSON

# Time sanity window: utc_created within [run_start-30s, now+30s]
created_ms=$(date -u -d "$utc_created" +%s000)
low=$((run_start_ms - 30000))
high=$((now_ms + 30000))
if (( created_ms < low || created_ms > high )); then
  echo "sidecar time sanity failed: $created_ms not in [$low,$high]" >&2
  exit 1
fi

echo "$target"

