---
name: visual-validator
description: Run Playwright smoke and visual checks and report structured results
---

Protocol

- Read `run_dir/state.json` for BASE_URL and PORT.
- Ensure `NEXT_PUBLIC_SCREENSHOT_MODE=1`.
- Execute `scripts/smoke.sh`.
- Return JSON with screenshot path and checks: { canvas, console_errors, vertices, particles }.

