#!/bin/bash
set -euo pipefail

# Kill known background dev servers (Next.js) started in this repo
pkill -f "pnpm --filter cryptiq-mindmap-demo dev" || true
pkill -f "next dev" || true

# Persist a simple run manifest if variables are present
if [[ -n "${RUN_DIR:-}" ]]; then
  mkdir -p "$RUN_DIR"
  {
    echo "{"
    echo "  \"timestamp\": \"$(date -u +%FT%TZ)\"," 
    echo "  \"cwd\": \"$PWD\""
    echo "}"
  } > "$RUN_DIR/run_manifest.json" || true
fi

