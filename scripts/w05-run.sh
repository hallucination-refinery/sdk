#!/usr/bin/env bash
set -euo pipefail

RUN_ID="${1:-$(date +%Y%m%d-%H%M%S)_W05}"
OUT_DIR=".clmem/runs/${RUN_ID}"
mkdir -p "${OUT_DIR}"

BASE_URL="${BASE_URL:-http://localhost:3000}"
SCREEN_PATH="${OUT_DIR}/iteration-1.png"

echo "[W05] Capturing ${BASE_URL}/brain → ${SCREEN_PATH}"
node scripts/capture-brain.mjs "${SCREEN_PATH}" || {
  echo "Capture failed"; exit 1; 
}

echo "[W05] Analyzing screenshot"
node scripts/analyze-visual-parity.mjs "${SCREEN_PATH}" docs/initiatives/cryptiq-mindmap-mvp/misc/reference-image.jpeg \
  | tee "${OUT_DIR}/metrics.json"

echo "[W05] Generating report"
node scripts/generate-visual-report.mjs "${OUT_DIR}"

echo "[W05] Done → ${OUT_DIR}"


