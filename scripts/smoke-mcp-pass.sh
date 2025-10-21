#!/usr/bin/env bash
set -e

###############################################################################
# PASS 1: MCP Browser Use (Manual Inspection)
# Uses Playwright MCP server tools through Claude Code headless mode
###############################################################################

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BASE_URL="http://127.0.0.1:3000"
SMOKE_ROUTE="/quiz/archetype-v1?pc=scene-03&forceVisible=1"
PORT=3000
NODE_VERSION=20

# Timestamps
RUN_ID=$(date -u +%Y%m%d-%H%M%S)
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
DATE_TAG=$(date -u +%Y-%m-%d)

# Artifact directories
DOCS_BASE="docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype"
ASSETS_DIR="$DOCS_BASE/assets/$COMMIT/$BRANCH/$RUN_ID"
CONSOLE_DIR="$DOCS_BASE/console/$COMMIT/$BRANCH/$RUN_ID"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           PASS 1: MCP BROWSER USE (Manual Inspection)             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Run ID:${NC} $RUN_ID"
echo -e "${YELLOW}Commit:${NC} $COMMIT"
echo -e "${YELLOW}Branch:${NC} $BRANCH"
echo ""

###############################################################################
# Step 1: Environment Setup
###############################################################################
echo -e "${BLUE}[Pass 1: 1/7]${NC} Setting up environment..."

# Load NVM
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  source "$NVM_DIR/nvm.sh"
  nvm use $NODE_VERSION >/dev/null 2>&1 || {
    echo -e "${YELLOW}Warning: Node $NODE_VERSION not found, using current version${NC}"
  }
fi

# Kill existing server on port
echo -e "  → Checking for existing server on port $PORT..."
if lsof -ti tcp:$PORT >/dev/null 2>&1; then
  echo -e "  → Killing existing server on port $PORT"
  lsof -ti tcp:$PORT | xargs kill 2>/dev/null || true
  sleep 1
fi

echo -e "${GREEN}✓${NC} Environment ready"
echo ""

###############################################################################
# Step 2: Install Dependencies
###############################################################################
echo -e "${BLUE}[Pass 1: 2/7]${NC} Installing dependencies..."
pnpm i --frozen-lockfile >/dev/null 2>&1 || {
  echo -e "${RED}✗ Failed to install dependencies${NC}"
  exit 1
}
echo -e "${GREEN}✓${NC} Dependencies installed"
echo ""

###############################################################################
# Step 3: Build Production App
###############################################################################
echo -e "${BLUE}[Pass 1: 3/7]${NC} Building production app..."
rm -rf apps/cryptiq-mindmap-demo/.next 2>/dev/null || true
pnpm --filter cryptiq-mindmap-demo run build >/dev/null 2>&1 || {
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
}
echo -e "${GREEN}✓${NC} Build complete"
echo ""

###############################################################################
# Step 4: Start Production Server
###############################################################################
echo -e "${BLUE}[Pass 1: 4/7]${NC} Starting production server..."

# Start server in background
pnpm --filter cryptiq-mindmap-demo exec next start -p $PORT >/tmp/next-server-mcp-$RUN_ID.log 2>&1 &
SERVER_PID=$!

echo -e "  → Server PID: $SERVER_PID"

# Wait for server to be ready
echo -e "  → Waiting for server to be ready..."
MAX_WAIT=60
for i in $(seq 1 $MAX_WAIT); do
  if curl -fsS "$BASE_URL" >/dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Server ready after ${i}s"
    break
  fi

  if [ $i -eq $MAX_WAIT ]; then
    echo -e "${RED}✗ Server failed to start within ${MAX_WAIT}s${NC}"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
  fi

  sleep 1
done
echo ""

###############################################################################
# Step 5: Execute MCP Browser Inspection
###############################################################################
echo -e "${BLUE}[Pass 1: 5/7]${NC} Executing MCP browser inspection..."

# Create temp directory for MCP results
mkdir -p /tmp/smoke-mcp-$RUN_ID

# Run Claude Code in headless mode with MCP browser tools
echo -e "  → Running Claude Code headless with Playwright MCP tools..."

claude --prompt prompts/smoke-mcp-inspection.md \
  --output /tmp/smoke-mcp-$RUN_ID/result.json \
  --headless 2>/tmp/smoke-mcp-$RUN_ID/stderr.log || {
  echo -e "${RED}✗ MCP browser inspection failed${NC}"
  echo -e "  Check logs at: /tmp/smoke-mcp-$RUN_ID/stderr.log"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
}

echo -e "${GREEN}✓${NC} MCP browser inspection complete"
echo ""

###############################################################################
# Step 6: Stop Server
###############################################################################
echo -e "  → Stopping server (PID $SERVER_PID)..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true
echo ""

###############################################################################
# Step 7: Archive MCP Artifacts
###############################################################################
echo -e "${BLUE}[Pass 1: 6/7]${NC} Archiving MCP artifacts..."

mkdir -p "$ASSETS_DIR"
mkdir -p "$CONSOLE_DIR"

# Parse MCP result
if [ ! -f /tmp/smoke-mcp-$RUN_ID/result.json ]; then
  echo -e "${RED}✗ No MCP result file found${NC}"
  exit 1
fi

# Extract console messages and save as console-mcp.json
jq '.consoleMessages' /tmp/smoke-mcp-$RUN_ID/result.json > "$CONSOLE_DIR/console-mcp.json" || {
  echo -e "${RED}✗ Failed to extract console messages${NC}"
  exit 1
}

# Move screenshot if it exists
if [ -f smoke-mcp-screenshot.png ]; then
  mv smoke-mcp-screenshot.png "$ASSETS_DIR/$DATE_TAG-forceVisible-mcp.png" || {
    echo -e "${YELLOW}⚠ Failed to move MCP screenshot${NC}"
  }
else
  echo -e "${YELLOW}⚠ No MCP screenshot found${NC}"
fi

echo -e "${GREEN}✓${NC} MCP artifacts archived"
echo -e "  → Console: $CONSOLE_DIR/console-mcp.json"
echo -e "  → Screenshot: $ASSETS_DIR/$DATE_TAG-forceVisible-mcp.png"
echo ""

###############################################################################
# Step 8: Summary
###############################################################################
echo -e "${BLUE}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    PASS 1 COMPLETE (MCP Browser)                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check diagnostic markers
MARKERS_FOUND=$(jq -r '.diagnosticMarkers | to_entries | map(select(.value == true)) | length' /tmp/smoke-mcp-$RUN_ID/result.json || echo "0")
echo -e "${YELLOW}Diagnostic markers found:${NC} $MARKERS_FOUND / 6"

# Check for critical markers
RENDER_INFO=$(jq -r '.diagnosticMarkers.renderInfo' /tmp/smoke-mcp-$RUN_ID/result.json || echo "false")
SCENE_TRAVERSAL=$(jq -r '.diagnosticMarkers.sceneTraversal' /tmp/smoke-mcp-$RUN_ID/result.json || echo "false")
RENDERER_CALL=$(jq -r '.diagnosticMarkers.rendererRenderCall' /tmp/smoke-mcp-$RUN_ID/result.json || echo "false")

if [ "$RENDER_INFO" == "true" ] && [ "$SCENE_TRAVERSAL" == "true" ] && [ "$RENDERER_CALL" == "true" ]; then
  echo -e "${GREEN}✓ Critical markers present${NC}"
else
  echo -e "${YELLOW}⚠ Some critical markers missing${NC}"
fi

echo ""
echo -e "${GREEN}Pass 1 artifacts saved. Proceeding to Pass 2 (Playwright)...${NC}"
echo ""

# Export variables for next pass
echo "export MCP_RUN_ID=$RUN_ID" > /tmp/smoke-mcp-env.sh
echo "export MCP_CONSOLE_DIR=$CONSOLE_DIR" >> /tmp/smoke-mcp-env.sh
echo "export MCP_ASSETS_DIR=$ASSETS_DIR" >> /tmp/smoke-mcp-env.sh

exit 0
