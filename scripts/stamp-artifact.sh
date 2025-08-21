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
utc_created=$(date -u +%FT%TZ)
sha256=$(sha256sum "$FILE" | awk '{print $1}')

dir=$(dirname "$FILE")
base=$(basename "$FILE")
name="S${SESSION}-${run_id}-p${PORT}.${base##*.}"
target="$dir/$name"

mv -f "$FILE" "$target"
sidecar="${target%.${base##*.}}.json"

cat >"$sidecar" <<JSON
{
  "run_id": "${run_id}",
  "session": "${SESSION}",
  "port": ${PORT},
  "sha256": "${sha256}",
  "utc_created": "${utc_created}",
  "checks": {}
}
JSON

echo "$target"

