#!/bin/bash
# Artifact Collection Script for Orchestration Run
# Collects all session artifacts into the run directory

set -euo pipefail

RUN_ID="${1:-20250822152645-cryptiq-mindmap-mvp-ALL}"
RUN_DIR="/workspace/.clmem/runs/${RUN_ID}"
ARTIFACTS_DIR="${RUN_DIR}/artifacts"

echo "=== Artifact Collection for Run ${RUN_ID} ==="
echo "Target directory: ${ARTIFACTS_DIR}"

# Create artifacts directory structure
mkdir -p "${ARTIFACTS_DIR}/w03"
mkdir -p "${ARTIFACTS_DIR}/smoke"
mkdir -p "${ARTIFACTS_DIR}/acceptance"

# Copy w03 artifacts
echo "Collecting w03 artifacts..."
if [ -d "/workspace/.clmem/artifacts/w03" ]; then
    cp -r /workspace/.clmem/artifacts/w03/* "${ARTIFACTS_DIR}/w03/" 2>/dev/null || true
    echo "  ✓ W03 artifacts collected"
else
    echo "  ⚠ W03 artifacts directory not found"
fi

# Copy smoke test images
echo "Collecting smoke test images..."
if [ -d "/workspace/tests/brain.smoke.spec.ts-snapshots" ]; then
    cp /workspace/tests/brain.smoke.spec.ts-snapshots/*.png "${ARTIFACTS_DIR}/smoke/" 2>/dev/null || true
    echo "  ✓ Smoke test images collected"
else
    echo "  ⚠ Smoke test snapshots not found"
fi

# Copy acceptance artifacts (already in w03 but ensure in acceptance folder too)
echo "Collecting acceptance artifacts..."
if [ -f "/workspace/.clmem/artifacts/w03/acceptance/brain-acceptance.json" ]; then
    cp -r /workspace/.clmem/artifacts/w03/acceptance/* "${ARTIFACTS_DIR}/acceptance/" 2>/dev/null || true
    echo "  ✓ Acceptance artifacts collected"
fi

# List collected artifacts with sizes
echo ""
echo "=== Collected Artifacts Summary ==="
echo "W03 artifacts:"
find "${ARTIFACTS_DIR}/w03" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  "$9": "$5}' | sort

echo ""
echo "Smoke artifacts:"
find "${ARTIFACTS_DIR}/smoke" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  "$9": "$5}' | sort

echo ""
echo "Acceptance artifacts:"
find "${ARTIFACTS_DIR}/acceptance" -type f -exec ls -lh {} \; 2>/dev/null | awk '{print "  "$9": "$5}' | sort

# Count total artifacts
TOTAL_COUNT=$(find "${ARTIFACTS_DIR}" -type f | wc -l)
echo ""
echo "Total artifacts collected: ${TOTAL_COUNT}"

# Calculate total size
TOTAL_SIZE=$(du -sh "${ARTIFACTS_DIR}" 2>/dev/null | cut -f1)
echo "Total artifacts size: ${TOTAL_SIZE}"

echo ""
echo "=== Collection Complete ==="