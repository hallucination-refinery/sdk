#!/usr/bin/env bash
set -euo pipefail

# Usage: server-health.sh <base_port> <max_tries> <url_path>
BASE_PORT="${1:-3000}"
MAX_TRIES="${2:-5}"
URL_PATH="${3:-/brain}"

pick_port() {
  local port=$BASE_PORT
  for i in $(seq 0 20); do
    if ! lsof -iTCP -sTCP:LISTEN -P | awk '{print $9}' | grep -q ":$port$"; then
      echo "$port"
      return 0
    fi
    port=$((port+1))
  done
  echo "$BASE_PORT"
  return 0
}

PORT=$(pick_port)
export PORT
echo "PORT=$PORT"

# Try health check with backoff
for i in $(seq 1 "$MAX_TRIES"); do
  if curl -fsS "http://localhost:$PORT$URL_PATH" >/dev/null; then
    echo "HEALTHY"
    exit 0
  fi
  sleep $((i))
done

echo "UNHEALTHY"
exit 1

