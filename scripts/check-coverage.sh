#!/bin/bash

# Script to check coverage across all packages

echo "🔍 Checking coverage for all packages..."
echo ""

PACKAGES=("schema" "ops" "store" "canvas-r3f" "input-hub" "widget-aperture" "widget-hud")
FAILED_PACKAGES=()

for package in "${PACKAGES[@]}"; do
    PACKAGE_DIR="/workspace/packages/$package"
    
    if [ -d "$PACKAGE_DIR" ]; then
        echo "📦 Checking @refinery/$package..."
        
        if [ -f "$PACKAGE_DIR/coverage/coverage-summary.json" ]; then
            # Extract coverage percentages
            COVERAGE=$(node -e "
                const fs = require('fs');
                const summary = JSON.parse(fs.readFileSync('$PACKAGE_DIR/coverage/coverage-summary.json', 'utf8'));
                const total = summary.total;
                console.log('  Lines: ' + total.lines.pct + '%');
                console.log('  Statements: ' + total.statements.pct + '%');
                console.log('  Functions: ' + total.functions.pct + '%');
                console.log('  Branches: ' + total.branches.pct + '%');
                
                // Check if meets 80% threshold for core packages
                if ('$package' === 'schema' || '$package' === 'ops') {
                    if (total.lines.pct < 80 || total.statements.pct < 80 || 
                        total.functions.pct < 80 || total.branches.pct < 80) {
                        process.exit(1);
                    }
                }
            " 2>/dev/null)
            
            if [ $? -eq 0 ]; then
                echo "$COVERAGE"
                echo "  ✅ Coverage meets requirements"
            else
                echo "$COVERAGE"
                echo "  ❌ Coverage below 80% threshold"
                FAILED_PACKAGES+=("$package")
            fi
        else
            echo "  ⚠️  No coverage report found"
        fi
        echo ""
    fi
done

if [ ${#FAILED_PACKAGES[@]} -gt 0 ]; then
    echo "❌ The following packages have coverage below 80%:"
    printf '   - %s\n' "${FAILED_PACKAGES[@]}"
    exit 1
else
    echo "✅ All core packages meet coverage requirements!"
fi