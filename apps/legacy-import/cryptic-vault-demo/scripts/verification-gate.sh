#!/bin/bash
# Verification gate script for cryptic-vault-demo

set -e

echo "🔍 Running verification gate..."

# 1. Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Must run from cryptic-vault-demo directory"
  exit 1
fi

# 2. Run TypeScript check using chunk runner
echo "🔷 Running TypeScript check..."
node scripts/verify.ts

# 3. Verify no @refinery/interaction imports remain
echo "🔎 Verifying @refinery/interaction removal..."
if grep -r "@refinery/interaction" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist; then
  echo "❌ Found remaining @refinery/interaction imports"
  exit 1
else
  echo "✅ No @refinery/interaction imports found"
fi

# 4. Check for @refinery/ideanode imports
echo "🔎 Verifying @refinery/ideanode removal..."
if grep -r "@refinery/ideanode" . --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=dist; then
  echo "❌ Found remaining @refinery/ideanode imports"
  exit 1
else
  echo "✅ No @refinery/ideanode imports found"
fi

# 5. Check for meta property usage (should be metadata)
echo "🔎 Checking for 'meta' property usage (should be 'metadata')..."
if grep -r "\.meta\?" components/ --include="*.tsx" --include="*.ts" | grep -v "metadata"; then
  echo "⚠️  Found possible 'meta' property usage - please verify these are correct"
fi

echo "✅ Verification gate checks completed!"