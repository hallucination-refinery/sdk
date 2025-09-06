#!/usr/bin/env bash
set -euo pipefail

# Codex Cloud setup script (full internet allowed here)

# Toolchain
corepack enable

# Install dependencies deterministically
pnpm install --frozen-lockfile

# Optional: install browsers for playwright smoke (kept off by default)
# pnpm playwright install --with-deps || true

# Print versions for debugging
node -v
pnpm -v

echo "Setup complete"
