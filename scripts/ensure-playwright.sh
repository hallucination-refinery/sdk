#!/usr/bin/env bash
set -euo pipefail

export PLAYWRIGHT_BROWSERS_PATH=/workspace/.playwright-browsers
pnpm exec playwright install chromium

mkdir -p /home/node/.cache
rm -rf /home/node/.cache/ms-playwright || true
ln -s /workspace/.playwright-browsers /home/node/.cache/ms-playwright || true

export PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1
echo "Node: $(node -v) | pnpm: $(pnpm -v) | Playwright: $(pnpm exec playwright --version)"

