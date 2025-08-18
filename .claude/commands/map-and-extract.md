---
description: Single-pass discovery to gather all facts needed for documentation
allowed-tools: ["Bash", "Edit", "Grep", "Glob", "LS", "Read"]
---

# Map and Extract

Execute discovery workflow to gather all facts needed for documentation generation.

## Discovery Steps

### 1. Find entry points
!find . -type f \( -name "main.*" -o -name "index.*" -o -name "app.*" \) -not -path "*/node_modules/*" -not -path "*/dist/*" | head -20

### 2. Locate configuration
!find . -type f \( -name "*.env*" -o -name "*config*" -o -name "*.yaml" -o -name "*.yml" \) -not -path "*/node_modules/*" | grep -E "(config|env|settings)" | head -20

### 3. Extract APIs
!rg "^export (class|function|const|interface|type)" --type ts --type js -g '!node_modules' -g '!dist' --no-heading | head -30

### 4. Find data models
!rg "(schema|model|entity|interface|type)\s+\w+\s*(=|\{)" --type ts --type js -g '!node_modules' --no-heading | head -20

### 5. Get repository structure
!ls -la packages/ | head -20

## Analysis

After gathering facts, analyze findings and proceed to `/write-architecture-apis` to draft documentation.

Log progress to `.clmem/workflows/map-extract-$(date +%Y%m%d-%H%M%S).log`