# Scratchpad - Run 20250820_190503_cryptiq-mindmap-mvp-brain-extraction

## Initiative
cryptiq-mindmap-mvp

## Session
brain-extraction-workflow

## Start Time
2025-08-20 19:05:03 UTC

## Session Goals
Run vendor/3dbrain demo in isolation and verify HTTP 200 response without workspace coupling.

## Acceptance Bars
- Isolated install completes, dev server boots successfully, HTTP 200 at localhost:8080, no edits outside vendor/3dbrain/.

## Assumptions/Unknowns
- Assumes vendor/3dbrain already cloned; port 8080 available; may need three.js compatibility shim.

---

## Plan

### Goal
Execute the brain-extraction-workflow session to run the vendor/3dbrain demo in complete isolation, proving it can serve successfully without any workspace integration or edits outside the vendor directory.

### Acceptance Bars
1. **Isolation Verification**: No workspace coupling (verified .npmrc config, no pnpm-workspace.yaml additions)
2. **Successful Install**: Dependencies install cleanly in vendor-only scope
3. **Server Boot**: Dev server starts and reports "Compiled successfully" 
4. **Health Check**: HTTP 200 response at localhost:8080
5. **Boundary Respect**: Zero modifications outside vendor/3dbrain/

### Key Unknowns & Risks
1. **Port Conflict Risk**: Port 8080 may be occupied (mitigation: check/change PORT if needed)
2. **Missing Vendor Repo**: vendor/3dbrain may not exist or be incomplete (blocker if missing)
3. **Three.js Compatibility**: Known setAttribute/addAttribute issue between three r91 and three-bas (shim ready)
4. **Legacy Dependencies**: Old package versions may fail to install on current Node.js
5. **Dev Server Stability**: Webpack/build chain may have breaking changes since original commit

### Execution Batches
- **Single Batch**: One linear workflow with 5 sequential steps (no parallelization possible due to step dependencies)
- **Step Dependencies**: Each step strictly depends on previous step success
- **Error Handling**: Step 3 (compatibility shim) is conditional - only execute if particles crash detected

### Required Validations
- Pre-flight: Verify vendor/3dbrain directory exists and contains package.json
- Mid-flight: Confirm .npmrc isolation config applied correctly
- Post-flight: Validate HTTP 200 AND verify no git changes outside vendor/3dbrain/
- Continuous: Monitor for three.js compatibility errors during dev server boot

### Success Metrics
- Time to HTTP 200 response (target: <5 minutes total execution)
- Zero workspace pollution (measurable via git status)
- Clean dev server boot (no fatal errors in console output)

---

## Session brain-extraction - Execution Results

### Steps Completed
1. ✅ **Guard isolation and record provenance**
   - Created vendor/3dbrain/.npmrc with isolation flags
   - Recorded commit hash in vendor/3dbrain/COMMIT.txt: ab26234f5e7553b59aeb766da6d3c46653b11dca
   - Verified vendor/3dbrain NOT in pnpm-workspace.yaml

2. ✅ **Install legacy dependencies (isolated)**
   - Executed: `pnpm --dir /workspace/vendor/3dbrain install --ignore-workspace`
   - Result: "Already up to date" (dependencies were pre-installed)
   - Install completed in 1.4s

3. ⚠️ **Compatibility shim (conditional)**
   - SKIPPED: No particles crash detected during build
   - Build completed successfully without three.js compatibility issues
   - Note: Code does use three-bas and addAttribute extensively, but build succeeded

4. ✅ **Run dev server (background mode)**
   - Command: `pnpm --dir /workspace/vendor/3dbrain dev`
   - Status: Compiled successfully in 5708ms
   - Server running at: http://localhost:8080
   - No fatal errors in console output

5. ✅ **Health check**
   - HTTP Status: 200 OK
   - Content-Type: text/html; charset=UTF-8
   - Response time: 0.001217s
   - Content verified: "Amelia Brain 2.0" HTML page served correctly

### Critical Issue Discovered
- **Workspace Isolation Violation**: Despite using --ignore-workspace flag, some dependencies leaked into root workspace
- Files contaminated: package.json (added babel-runtime, core-js), .npmrc, pnpm-lock.yaml  
- **Remediation**: Workspace contamination was reverted via git checkout and file removal
- **Root Cause**: pnpm isolation flags may not fully prevent workspace coupling in this project structure

### Final Status
- **Demo Functionality**: ✅ PASS - vendor/3dbrain demo runs and serves HTTP 200
- **Isolation Requirement**: ❌ PARTIAL - successful demo but workspace contamination occurred
- **Acceptance Bars**: 4/5 met (isolation boundary violated but later cleaned up)
