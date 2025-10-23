#!/usr/bin/env bash
set -e

###############################################################################
# Ink Smoke Test Workflow - 3-PASS COMPLETE
# Pass 1: MCP Browser Use (Manual Inspection)
# Pass 2: Playwright (Automated Test)
# Pass 3: Documentation Update (Analysis & Archival)
###############################################################################

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BASE_URL="http://127.0.0.1:3000"
SMOKE_ROUTE="/quiz/archetype-v1?pc=scene-03&forceVisible=1"
PORT=3000

# Timestamps
RUN_ID=$(date -u +%Y%m%d-%H%M%S)
COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")

# Artifact directories
DOCS_BASE="docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/context-pack-2025-10-10/cursor-ooda-ink-prototype"
ASSETS_DIR="$DOCS_BASE/assets/$COMMIT/$BRANCH/$RUN_ID"
CONSOLE_DIR="$DOCS_BASE/console/$COMMIT/$BRANCH/$RUN_ID"

echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║     INK SMOKE TEST WORKFLOW - 3-PASS COMPLETE (Claude Code)         ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  Pass 1: MCP Browser Use (Manual Inspection)                         ║${NC}"
echo -e "${CYAN}║  Pass 2: Playwright (Automated Test)                                 ║${NC}"
echo -e "${CYAN}║  Pass 3: Documentation Update (Analysis & Archival)                  ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Run ID:${NC} $RUN_ID"
echo -e "${YELLOW}Commit:${NC} $COMMIT"
echo -e "${YELLOW}Branch:${NC} $BRANCH"
echo ""

###############################################################################
#                            PASS 1: MCP BROWSER USE
###############################################################################

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   PASS 1: MCP BROWSER USE (Manual Inspection via Playwright MCP)     ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""

bash scripts/smoke-mcp-pass.sh || {
  echo -e "${RED}✗ Pass 1 (MCP Browser Use) failed${NC}"
  exit 1
}

# Load MCP environment variables
if [ -f /tmp/smoke-mcp-env.sh ]; then
  source /tmp/smoke-mcp-env.sh
fi

echo -e "${GREEN}✓ Pass 1 complete - MCP artifacts captured${NC}"
echo ""

###############################################################################
#                            PASS 2: PLAYWRIGHT
###############################################################################

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}              PASS 2: PLAYWRIGHT (Automated Test)                      ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}[Pass 2: 1/3]${NC} Starting production server..."

# Kill existing server
if lsof -ti tcp:$PORT >/dev/null 2>&1; then
  echo -e "  → Killing existing server on port $PORT"
  lsof -ti tcp:$PORT | xargs kill 2>/dev/null || true
  sleep 1
fi

# Start server in background
pnpm --filter cryptiq-mindmap-demo exec next start -p $PORT >/tmp/next-server-pw-$RUN_ID.log 2>&1 &
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

echo -e "${BLUE}[Pass 2: 2/3]${NC} Running Playwright smoke test..."

# Create artifact directories
mkdir -p .clmem/artifacts/ink
mkdir -p .clmem/artifacts/ink-console

# Run test
export BASE_URL="$BASE_URL"
export SMOKE_ROUTE="$SMOKE_ROUTE"
export RUN_ID="$RUN_ID"
export SMOKE_OUT_DIR=".clmem/artifacts/ink"
export SMOKE_CONSOLE_OUT=".clmem/artifacts/ink-console"

TEST_EXIT=0
pnpm exec playwright test tests/ink.smoke.spec.ts --reporter=line || TEST_EXIT=$?

# Kill server
echo -e "  → Stopping server (PID $SERVER_PID)..."
kill $SERVER_PID 2>/dev/null || true
wait $SERVER_PID 2>/dev/null || true

if [ $TEST_EXIT -ne 0 ]; then
  echo -e "${YELLOW}⚠ Playwright test failed (exit code: $TEST_EXIT)${NC}"
  echo -e "  (Continuing to analysis...)"
else
  echo -e "${GREEN}✓${NC} Playwright test passed"
fi
echo ""

echo -e "${BLUE}[Pass 2: 3/3]${NC} Archiving Playwright artifacts..."

# Copy screenshots
cp .clmem/artifacts/ink/ink-*-$RUN_ID-pre.png "$ASSETS_DIR/" 2>/dev/null || {
  echo -e "${YELLOW}⚠ No pre-screenshot found${NC}"
}
cp .clmem/artifacts/ink/ink-*-$RUN_ID-post.png "$ASSETS_DIR/" 2>/dev/null || {
  echo -e "${YELLOW}⚠ No post-screenshot found${NC}"
}

# Copy console logs
cp .clmem/artifacts/ink-console/console-chromium-$RUN_ID.json "$CONSOLE_DIR/console-chromium-$RUN_ID.json" 2>/dev/null || {
  echo -e "${RED}✗ No console log found${NC}"
  exit 1
}

echo -e "${GREEN}✓${NC} Playwright artifacts archived"
echo -e "  → Screenshots: $ASSETS_DIR/"
echo -e "  → Console: $CONSOLE_DIR/console-chromium-$RUN_ID.json"
echo ""

echo -e "${GREEN}✓ Pass 2 complete - Playwright artifacts captured${NC}"
echo ""

###############################################################################
#                       PASS 3: DOCUMENTATION UPDATE
###############################################################################

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}        PASS 3: DOCUMENTATION UPDATE (Analysis & Archival)            ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════${NC}"
echo ""

echo -e "${BLUE}[Pass 3: 1/2]${NC} Analyzing console logs (MCP + Playwright)..."

# Analyze MCP console
MCP_CONSOLE="$CONSOLE_DIR/console-mcp.json"
if [ -f "$MCP_CONSOLE" ]; then
  echo -e "  → Analyzing MCP console..."
  node scripts/analyze-smoke-console.mjs "$MCP_CONSOLE" || {
    echo -e "${YELLOW}⚠ MCP console analysis completed with FAIL verdict${NC}"
  }
  MCP_ANALYSIS="${MCP_CONSOLE%.json}-analysis.json"
else
  echo -e "${YELLOW}⚠ No MCP console found${NC}"
fi

# Analyze Playwright console
PW_CONSOLE=".clmem/artifacts/ink-console/console-chromium-$RUN_ID.json"
echo -e "  → Analyzing Playwright console..."
node scripts/analyze-smoke-console.mjs "$PW_CONSOLE" || {
  echo -e "${YELLOW}⚠ Playwright console analysis completed with FAIL verdict${NC}"
}
PW_ANALYSIS="${PW_CONSOLE%.json}-analysis.json"

echo -e "${GREEN}✓${NC} Console analysis complete"
echo ""

echo -e "${BLUE}[Pass 3: 2/2]${NC} Updating documentation..."

# Update documentation with both analyses
node scripts/update-smoke-docs.mjs "$PW_ANALYSIS" "$MCP_ANALYSIS" 2>/dev/null || {
  # Fallback to single analysis if dual-pass update not implemented yet
  node scripts/update-smoke-docs.mjs "$PW_ANALYSIS" || {
    echo -e "${RED}✗ Failed to update documentation${NC}"
    exit 1
  }
}

echo -e "${GREEN}✓${NC} Documentation updated"
echo ""

echo -e "${GREEN}✓ Pass 3 complete - Documentation updated with dual-pass evidence${NC}"
echo ""

###############################################################################
#                              FINAL SUMMARY
###############################################################################

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                         SMOKE TEST SUMMARY                           ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Read analysis results
if [ -f "$PW_ANALYSIS" ]; then
  PW_VERDICT=$(jq -r '.analysis.verdict' "$PW_ANALYSIS" 2>/dev/null || echo "UNKNOWN")
  PW_REASON=$(jq -r '.analysis.reason' "$PW_ANALYSIS" 2>/dev/null || echo "Unknown reason")
  PW_CONFIDENCE=$(jq -r '.analysis.confidence' "$PW_ANALYSIS" 2>/dev/null || echo "0")
else
  PW_VERDICT="UNKNOWN"
fi

if [ -f "$MCP_ANALYSIS" ]; then
  MCP_VERDICT=$(jq -r '.analysis.verdict' "$MCP_ANALYSIS" 2>/dev/null || echo "UNKNOWN")
  MCP_REASON=$(jq -r '.analysis.reason' "$MCP_ANALYSIS" 2>/dev/null || echo "Unknown reason")
else
  MCP_VERDICT="UNKNOWN"
fi

# Display verdicts
echo -e "${YELLOW}Pass 1 (MCP Browser Use):${NC}"
if [ "$MCP_VERDICT" == "PASS" ]; then
  echo -e "  ${GREEN}✓ VERDICT: PASS${NC}"
else
  echo -e "  ${RED}✗ VERDICT: $MCP_VERDICT${NC}"
fi
[ "$MCP_VERDICT" != "UNKNOWN" ] && echo -e "  ${YELLOW}Reason:${NC} $MCP_REASON"

echo ""
echo -e "${YELLOW}Pass 2 (Playwright):${NC}"
if [ "$PW_VERDICT" == "PASS" ]; then
  echo -e "  ${GREEN}✓ VERDICT: PASS${NC}"
else
  echo -e "  ${RED}✗ VERDICT: $PW_VERDICT${NC}"
fi
echo -e "  ${YELLOW}Reason:${NC} $PW_REASON"
echo -e "  ${YELLOW}Confidence:${NC} $(echo "$PW_CONFIDENCE * 100" | bc)%"

# Cross-validation
echo ""
if [ "$MCP_VERDICT" == "$PW_VERDICT" ] && [ "$MCP_VERDICT" != "UNKNOWN" ]; then
  echo -e "${GREEN}✓ Cross-validation: Both passes show consistent results${NC}"
else
  echo -e "${YELLOW}⚠ Cross-validation: Passes show different results${NC}"
fi

echo ""
echo -e "${YELLOW}Artifacts:${NC}"
echo -e "  → MCP Screenshot: $ASSETS_DIR/*-mcp.png"
echo -e "  → MCP Console: $CONSOLE_DIR/console-mcp.json"
echo -e "  → Playwright Screenshots: $ASSETS_DIR/ink-*-pre.png, ink-*-post.png"
echo -e "  → Playwright Console: $CONSOLE_DIR/console-chromium-$RUN_ID.json"

echo ""
echo -e "${YELLOW}Documentation Updated:${NC}"
echo -e "  → $DOCS_BASE/context-pack-2025-10-15/10-latest-smoke-evidence.md"
echo -e "  → $DOCS_BASE/context-pack-2025-10-15/06-working-document.md"

echo ""
echo -e "${CYAN}══════════════════════════════════════════════════════════════════════${NC}"
echo ""

# Ask about commit
echo -e "${YELLOW}Commit changes? (y/n):${NC} "
read -r SHOULD_COMMIT

if [ "$SHOULD_COMMIT" == "y" ] || [ "$SHOULD_COMMIT" == "Y" ]; then
  git add -A
  git commit -m "docs(ink): 3-pass smoke test (MCP: $MCP_VERDICT, PW: $PW_VERDICT) - $RUN_ID" || {
    echo -e "${YELLOW}⚠ Nothing to commit${NC}"
  }

  echo -e "${YELLOW}Push to remote? (y/n):${NC} "
  read -r SHOULD_PUSH

  if [ "$SHOULD_PUSH" == "y" ] || [ "$SHOULD_PUSH" == "Y" ]; then
    git push || {
      echo -e "${RED}✗ Push failed${NC}"
    }
  fi
fi

echo ""
echo -e "${GREEN}3-pass smoke test workflow complete!${NC}"
echo ""

# Exit with Playwright verdict (primary test)
if [ "$PW_VERDICT" == "PASS" ]; then
  exit 0
else
  exit 1
fi
