#!/bin/bash

INVENTORY_FILE="tmp/package_inventory.md"
PACKAGE_LIST_FILE="tmp/package_list.txt"

# Start with a clean file and a header
echo "# 2. Package & app inventory" > "$INVENTORY_FILE"
echo "--------------------------" >> "$INVENTORY_FILE"

# Loop through each package path from the list
while read -r pkg_path; do
  echo "Processing $pkg_path..."
  PKG_JSON_PATH="$pkg_path/package.json"
  
  # --- 1. package.json info ---
  NAME=$(grep '"name":' "$PKG_JSON_PATH" | head -n 1 | awk -F'"' '{print $4}')
  VERSION=$(grep '"version":' "$PKG_JSON_PATH" | head -n 1 | awk -F'"' '{print $4}')
  PRIVATE=$(grep '"private":' "$PKG_JSON_PATH" | head -n 1 | awk -F': ' '{print $2}' | sed 's/,//')
  DESCRIPTION=$(grep '"description":' "$PKG_JSON_PATH" | head -n 1 | awk -F'"' '{print $4}')
  
  {
    echo "## \`$pkg_path\`"
    echo "**Name**: \`$NAME\`"
    echo "**Version**: $VERSION"
    echo "**Private**: $PRIVATE"
    echo "**Purpose**: ${DESCRIPTION:-*No description provided.*}"
    echo ""
    echo "### Build Status"
  } >> "$INVENTORY_FILE"

  # --- 2. Build status ---
  if grep -q '"build":' "$PKG_JSON_PATH"; then
    # Use 'pnpm --filter' which is safe and targets the package directly.
    BUILD_OUTPUT=$(pnpm --filter "$NAME" build 2>&1)
    # The exit code of pnpm is captured by $?
    if [ $? -eq 0 ]; then
      echo "**Status**: ✅ Success" >> "$INVENTORY_FILE"
    else
      {
        echo "**Status**: ❌ Failed"
        echo "\`\`\`"
        echo "$BUILD_OUTPUT"
        echo "\`\`\`"
      } >> "$INVENTORY_FILE"
    fi
  else
    echo "**Status**: ℹ️ No build script." >> "$INVENTORY_FILE"
  fi
  
  {
    echo ""
    echo "### Test Status"
  } >> "$INVENTORY_FILE"
  
  # --- 3. Test status ---
  if grep -q '"test":' "$PKG_JSON_PATH"; then
    TEST_OUTPUT=$(pnpm --filter "$NAME" test 2>&1)
    
    if echo "$TEST_OUTPUT" | grep -iE "pass|ok" >/dev/null; then
        TEST_STATUS="✅ Passed"
    elif echo "$TEST_OUTPUT" | grep -iE "fail|error" >/dev/null; then
        TEST_STATUS="❌ Failed"
    else
        TEST_STATUS="⚪️ Unknown (No clear pass/fail)"
    fi
    
    COVERAGE=$(echo "$TEST_OUTPUT" | grep -oE '[0-9\.]+%' | tail -n 1) # Simplified coverage grep
    
    {
      echo "**Status**: $TEST_STATUS"
      echo "**Coverage**: ${COVERAGE:-*Not reported.*}"
      echo "\`\`\`"
      echo "$TEST_OUTPUT"
      echo "\`\`\`"
    } >> "$INVENTORY_FILE"
  else
    echo "**Status**: ℹ️ No test script." >> "$INVENTORY_FILE"
  fi
  
  {
    echo ""
    echo "---"
    echo ""
  } >> "$INVENTORY_FILE"

done < "$PACKAGE_LIST_FILE"

echo "Package inventory complete." 