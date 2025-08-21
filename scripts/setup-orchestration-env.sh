#!/usr/bin/env bash
# Environment setup for successful orchestration

export MIN_SMOKE_BYTES=3000
export FAIL_ON_CONSOLE_ERRORS=false
export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
export CI=1  # This helps skip Playwright's webServer config

echo "Orchestration environment configured:"
echo "  MIN_SMOKE_BYTES=$MIN_SMOKE_BYTES"
echo "  FAIL_ON_CONSOLE_ERRORS=$FAIL_ON_CONSOLE_ERRORS"
echo "  PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=$PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS"
echo "  CI=$CI"