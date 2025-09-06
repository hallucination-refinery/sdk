#!/usr/bin/env bash
set -euo pipefail

# Codex Cloud maintenance script (runs when container is resumed from cache)

corepack enable
pnpm install --frozen-lockfile

echo "Maintenance complete"
