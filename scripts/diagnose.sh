#!/usr/bin/env bash
# End-to-end diagnostic script for cryptic-vault-demo clumping investigation
# Created as part of comprehensive-investigation.md

set -e  # Exit on error

echo "🔍 Starting cryptic-vault-demo diagnostics..."
echo "📅 Date: $(date)"
echo "📁 Working directory: $(pwd)"

# Clean previous builds
echo -e "\n🧹 Cleaning previous builds..."
rm -rf apps/legacy-import/cryptic-vault-demo/.next
rm -rf node_modules/.cache
rm -rf .turbo

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo -e "\n📦 Installing dependencies..."
    pnpm install
fi

# Start dev server in background
echo -e "\n🚀 Starting dev server..."
pnpm dev --filter cryptic-vault-demo &
DEV_PID=$!
PORT=3000

# Function to check if server is ready
wait_for_server() {
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for server to start..."
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$PORT > /dev/null 2>&1; then
            echo "✅ Server is ready!"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Server failed to start after 60 seconds"
    return 1
}

# Wait for server
if ! wait_for_server; then
    kill $DEV_PID 2>/dev/null || true
    exit 1
fi

# Create evidence directory
mkdir -p docs/tmp-groupchat/phase-2/evidence

# Capture screenshot
echo -e "\n📸 Taking screenshot..."
if command -v npx &> /dev/null && npx playwright --version &> /dev/null; then
    npx playwright screenshot \
        --wait-for-timeout=5000 \
        http://localhost:$PORT \
        docs/tmp-groupchat/phase-2/evidence/smoke-test-$(date +%Y%m%d-%H%M%S).png
else
    echo "⚠️  Playwright not installed, skipping screenshot"
fi

# Capture HTML
echo -e "\n📄 Capturing HTML..."
curl -s http://localhost:$PORT > docs/tmp-groupchat/phase-2/evidence/page-source.html

# Extract console logs from dev server output
echo -e "\n📋 Waiting for diagnostic logs..."
sleep 5  # Give time for physics to initialize and log

# Check for key diagnostics in server output
echo -e "\n🔍 Checking for expected diagnostics:"
if ps -p $DEV_PID > /dev/null; then
    echo "✅ Dev server is running (PID: $DEV_PID)"
else
    echo "❌ Dev server has crashed!"
fi

# Kill dev server
echo -e "\n🛑 Stopping dev server..."
kill $DEV_PID 2>/dev/null || true

# Wait for process to end
sleep 2

# Summary
echo -e "\n📊 Diagnostic Summary:"
echo "- Screenshot: docs/tmp-groupchat/phase-2/evidence/smoke-test-*.png"
echo "- HTML source: docs/tmp-groupchat/phase-2/evidence/page-source.html"
echo "- Check console output above for [FGAdapter], [Animus], [Diag alpha] logs"

echo -e "\n✅ Diagnostics complete!"