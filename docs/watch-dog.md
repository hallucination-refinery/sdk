# Watch-Dog Smoke-screen Runner

The watch-dog script provides continuous monitoring of the ForceGraph component health during development.

## Overview

The watch-dog script:
- Monitors source files for changes
- Runs TypeScript compilation checks
- Executes ForceGraphAdapter smoke tests
- Reports pass/fail status in real-time
- Can integrate with guard hooks for CI validation

## Usage

### Watch Mode (Development)
```bash
pnpm run watch-smoke
```

This starts the watch-dog in continuous mode, monitoring files and running checks on changes.

### Single Run Mode (CI/Hooks)
```bash
pnpm run smoke-check
```

This runs the checks once and exits with appropriate status code (0 for success, 1 for failure).

## What Gets Monitored

### File Paths
- `packages/canvas-r3f/src` - Canvas R3F source files
- `apps/legacy-import/cryptic-vault-demo/components` - Demo components
- `apps/legacy-import/cryptic-vault-demo/app/debug` - Debug pages

### Checks Performed
1. **TypeScript Compilation** - Ensures no type errors
2. **Smoke Test** - Verifies ForceGraphAdapter functionality

## Integration with Guard Hooks

The watch-dog can be integrated into the pre-push hook by updating `scripts/install-hooks.sh`:

```bash
# Run watch-dog smoke check
echo -e "${YELLOW}Running watch-dog smoke check...${NC}"
pnpm run smoke-check
WATCHDOG_EXIT_CODE=$?
print_status $WATCHDOG_EXIT_CODE "Watch-dog smoke check"

if [ $WATCHDOG_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}Watch-dog detected issues. Please fix before pushing.${NC}"
    exit 1
fi
```

## Future Enhancements

### Browser Automation (Playwright)
The script includes commented code for full browser automation. To enable:

1. Install Playwright:
```bash
pnpm add -D @playwright/test
```

2. Uncomment the browser automation section in the script

3. The enhanced version will:
   - Open a real browser
   - Navigate to `/debug/fg-repro`
   - Monitor console errors
   - Verify `window.__FG` availability
   - Take screenshots on failure

## Configuration

Edit `scripts/watch-smoke.js` to modify:
- `WATCH_PATHS` - Directories to monitor
- `DEBOUNCE_MS` - Delay before running checks (default: 1000ms)
- `TEST_COMMAND` - Test runner command (default: pnpm)
- `TEST_ARGS` - Test arguments

## Troubleshooting

### Watch-dog not detecting changes
- Ensure watched paths exist
- Check file system permissions
- Try increasing DEBOUNCE_MS

### Tests passing locally but failing in watch-dog
- Ensure you're in the project root
- Check that all dependencies are installed
- Verify TEST_CWD path is correct

### High CPU usage
- Reduce number of watched paths
- Increase debounce delay
- Consider using more specific file patterns