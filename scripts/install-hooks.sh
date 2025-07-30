#!/bin/bash

# Install Git hooks for the project
# This script creates a pre-push hook that runs TypeScript and test checks

set -e

HOOKS_DIR=".git/hooks"
PRE_PUSH_HOOK="$HOOKS_DIR/pre-push"

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Create the pre-push hook
cat > "$PRE_PUSH_HOOK" << 'EOF'
#!/bin/bash

# Pre-push hook to ensure code quality before pushing
# Runs TypeScript compilation and Jest smoke tests

echo "Running pre-push checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Check TypeScript compilation
echo -e "${YELLOW}Running TypeScript check...${NC}"
pnpm exec tsc --noEmit
TS_EXIT_CODE=$?
print_status $TS_EXIT_CODE "TypeScript compilation"

if [ $TS_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}TypeScript errors found. Please fix them before pushing.${NC}"
    exit 1
fi

# Run ForceGraphAdapter smoke test
echo -e "${YELLOW}Running ForceGraphAdapter smoke test...${NC}"
cd packages/canvas-r3f && pnpm test ForceGraphAdapter.smoke
TEST_EXIT_CODE=$?
cd ../..
print_status $TEST_EXIT_CODE "ForceGraphAdapter smoke test"

if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}Smoke test failed. Please fix the test before pushing.${NC}"
    exit 1
fi

echo -e "${GREEN}All pre-push checks passed!${NC}"
exit 0
EOF

# Make the hook executable
chmod +x "$PRE_PUSH_HOOK"

echo "Git hooks installed successfully!"
echo "The pre-push hook will now run TypeScript and smoke tests before each push."
echo ""
echo "To bypass the hook in emergencies, use: git push --no-verify"