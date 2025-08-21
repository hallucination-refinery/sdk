Block status updates that claim PASS unless all sessions have commits and required artifacts.

Hook (concept):

```
#!/usr/bin/env bash
set -euo pipefail
RUN_DIR="${1:?usage: $0 <run_dir>}"
manifest="$RUN_DIR/session-manifest.json"
if [[ ! -f "$manifest" ]]; then
  echo "No session-manifest.json; refusing to claim PASS" >&2
  exit 2
fi

# Ensure all required artifacts exist and are fresh compared to run start
start_ms=$(jq -r '.start_time_ms // 0' "$RUN_DIR/metrics.json" 2>/dev/null || echo 0)
"$CLAUDE_PROJECT_DIR/scripts/validate-artifacts.sh" "$RUN_DIR" "$start_ms"
```

Configure via settings hooks `PreCommit` to run this script.
