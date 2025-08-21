# Exact Steps for Successful Orchestration

## Pre-flight Cleanup (if needed)
```bash
# Kill any lingering processes
pkill -f "next" 2>/dev/null
pkill -f "pnpm" 2>/dev/null

# Clean up any failed runs
rm -f .clmem/current_run_id
rm -rf .clmem/runs/*cryptiq-mindmap-mvp-ALL*
```

## Fresh Claude Code Session

1. Start new Claude Code instance:
```bash
claude
```

2. Run ensure-playwright command:
```
/ensure-playwright
```

3. Set environment variables (in Claude Code session):
```bash
source scripts/setup-orchestration-env.sh
```

4. Start orchestration:
```
/orchestrate cryptiq-mindmap-mvp ALL --workflow-path docs/initiatives/cryptiq-mindmap-mvp/workflow-03.md
```

## Important Notes

- Do NOT run any commands between `/ensure-playwright` and setting environment variables
- The `CI=1` environment variable ensures Playwright skips its webServer config
- The orchestrator will manage its own server lifecycle on a free port
- Session-start.sh hook has been disabled to prevent auto-orchestration
- Expected runtime: 1.5-2.5 hours for all 16 sessions