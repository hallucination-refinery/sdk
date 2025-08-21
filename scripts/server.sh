#!/usr/bin/env bash
set -euo pipefail

CMD="${1:-}"
RUN_ID_FILE=.clmem/current_run_id

require_state() {
  if [[ ! -f "$RUN_ID_FILE" ]]; then echo "No current_run_id" >&2; exit 1; fi
  run_id=$(cat "$RUN_ID_FILE")
  run_dir=".clmem/runs/${run_id}"
  if [[ ! -f "$run_dir/state.json" ]]; then echo "No state.json for $run_id" >&2; exit 1; fi
}

pick_port() {
  local base=3000
  for p in $(seq $base $((base+20))); do
    if ! lsof -iTCP -sTCP:LISTEN -P | awk '{print $9}' | grep -q ":$p$"; then
      echo $p; return 0
    fi
  done
  echo $base
}

case "$CMD" in
  start)
    require_state
    PORT=$(pick_port)
    (PORT=$PORT pnpm --filter cryptiq-mindmap-demo dev > "$run_dir/server.log" 2>&1 & echo $! > "$run_dir/pid")
    PID=$(cat "$run_dir/pid")
    jq --argjson port $PORT --argjson pid $PID '.port=$port | .pid=$pid' "$run_dir/state.json" > "$run_dir/state.tmp" && mv "$run_dir/state.tmp" "$run_dir/state.json"
    echo "PORT=$PORT PID=$PID"
    ;;
  stop)
    require_state
    if [[ -f "$run_dir/pid" ]]; then
      PID=$(cat "$run_dir/pid")
      kill "$PID" 2>/dev/null || true
      rm -f "$run_dir/pid"
      jq '.pid=null' "$run_dir/state.json" > "$run_dir/state.tmp" && mv "$run_dir/state.tmp" "$run_dir/state.json"
      echo "stopped"
    else
      echo "no pid"
    fi
    ;;
  status)
    require_state
    jq -C . "$run_dir/state.json" | cat
    ;;
  *)
    echo "usage: $0 start|stop|status" >&2
    exit 1
    ;;
esac


