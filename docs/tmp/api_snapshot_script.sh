#!/bin/bash

API_SNAPSHOT_DIR="tmp/api-snapshots"
LOG_FILE="tmp/logs/api_snapshots.log"
PACKAGE_LIST_FILE="tmp/package_list.txt"

mkdir -p "$API_SNAPSHOT_DIR"
echo "# 3. Public API surfaces" > "$LOG_FILE"
echo "--------------------------" >> "$LOG_FILE"

while read -r pkg_path; do
  echo "Processing $pkg_path..." | tee -a "$LOG_FILE"
  PKG_JSON_PATH="$pkg_path/package.json"
  NAME=$(grep '"name":' "$PKG_JSON_PATH" | head -n 1 | awk -F'"' '{print $4}')
  # Pkg name for dir needs to be simple
  PKG_NAME_SIMPLE=$(basename $pkg_path)
  PKG_SNAPSHOT_DIR="$API_SNAPSHOT_DIR/$PKG_NAME_SIMPLE"

  if [ -f "$pkg_path/tsconfig.json" ]; then
    # Attempt to generate declaration files
    # The output from tsc will go to the log file
    # We must call the tsc executable directly, not via pnpm script
    ./node_modules/.bin/tsc -p "$pkg_path/tsconfig.json" --emitDeclarationOnly --declarationDir "$PKG_SNAPSHOT_DIR" --pretty false >> "$LOG_FILE" 2>&1
    if [ $? -eq 0 ]; then
      echo "✅ Snapshot generated for $NAME" | tee -a "$LOG_FILE"
    else
      echo "❌ Snapshot failed for $NAME" | tee -a "$LOG_FILE"
    fi
  else
    echo "ℹ️ No tsconfig.json found for $NAME" | tee -a "$LOG_FILE"
  fi
  echo "" | tee -a "$LOG_FILE"
done < "$PACKAGE_LIST_FILE"

echo "API snapshot generation complete. See logs in $LOG_FILE" 