#!/usr/bin/env bash
set -euo pipefail

# Usage: validate-scoped.sh <step> [scope...]
# step: lint|test|build
# scope: optional package names (if omitted, runs monorepo-wide)

STEP="${1:?usage: $0 <step> [scope...]}"
shift

if [[ $# -eq 0 ]]; then
  # No scope provided - run monorepo-wide
  echo "Running monorepo-wide: pnpm -r $STEP"
  pnpm -r "$STEP"
else
  # Run for each specified package
  fail=0
  for package in "$@"; do
    echo "Running scoped: pnpm --filter $package $STEP"
    if ! pnpm --filter "$package" "$STEP"; then
      fail=1
    fi
  done
  exit $fail
fi