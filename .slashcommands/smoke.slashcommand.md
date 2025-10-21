# /smoke - Complete 3-Pass Smoke Test Workflow

Run the complete 3-pass automated smoke test workflow for the Dreamdust Ink Prototype, achieving **full parity** with Cursor's MCP Browser Use + Playwright approach.

## What it does

This command orchestrates a **3-pass smoke test cycle**:

### **Pass 1: MCP Browser Use (Manual Inspection)**
- Uses **Playwright MCP server** native agent tools
- Real-time browser automation with structured responses
- Agent invokes `browser_navigate`, `browser_console_messages`, `browser_take_screenshot`
- Provides **live browser state visibility** during execution
- Captures console messages as structured JSON
- Takes screenshot with exact filename control
- **Native agent tooling** - not scripts!

### **Pass 2: Playwright (Automated Test)**
- Runs deterministic Playwright test suite
- Captures console logs and screenshots
- Validates forceVisible bypass functionality
- Cross-validates against MCP pass results

### **Pass 3: Documentation Update**
- Analyzes console logs from **both** passes
- Cross-validates MCP and Playwright results
- Detects discrepancies between passes
- Auto-updates evidence and working documents
- Archives all artifacts with structured naming

## Why 3 Passes?

The 3-pass approach provides:

1. **Manual inspection evidence** (MCP) — human-verifiable browser state with agent tooling
2. **Automated test evidence** (Playwright) — deterministic, repeatable validation
3. **Cross-validation** — both should show identical console logs

This achieves **complete parity** with Cursor's workflow.

## Workflow Steps

### Pass 1: MCP Browser Use

1. **Setup** - Load Node 20, kill existing server, install deps
2. **Build** - Clean production build of Next.js app
3. **Start server** - Launch on 127.0.0.1:3000, wait for readiness
4. **MCP Inspection** - Claude Code agent invokes Playwright MCP tools:
   - `browser_navigate` to smoke test URL
   - Wait 5 seconds for page settle
   - `browser_console_messages` to capture console
   - `browser_take_screenshot` to save image
5. **Archive** - Save MCP artifacts:
   - `console-mcp.json`
   - `YYYY-MM-DD-forceVisible-mcp.png`

### Pass 2: Playwright

1. **Start server** - Fresh server instance
2. **Run test** - Execute Playwright smoke test
3. **Archive** - Save Playwright artifacts:
   - `console-chromium-*.json`
   - `ink-*-pre.png`, `ink-*-post.png`

### Pass 3: Documentation

1. **Analyze** - Apply diagnostic rubric to **both** console logs:
   - Check for 6 required `[PC]` markers
   - Determine PASS/FAIL verdict
   - Calculate confidence level
2. **Cross-validate** - Compare MCP vs Playwright results
3. **Update docs**:
   - `10-latest-smoke-evidence.md` - Findings from **both** passes
   - `06-working-document.md` - Latest status and next action

## Diagnostic Markers

Both passes should contain these 6 console markers:

- `[PC] render-info` - Render statistics
- `[PC] points-mesh` - Points mesh metadata
- `[PC] points-after-render` - Post-render verification
- `[PC] scene-traversal` - Scene graph inspection
- `[PC] render-list` - Render list snapshot
- `[PC] renderer-render-call` - Renderer invocation log

## Diagnostic Rubric

- **PASS**: All checks passing (points rendered, no timeout, lists populated)
- **FAIL (wrong scene)**: Scene UUID mismatch between traversal and render
- **FAIL (lists empty)**: Render called but mesh culled (camera/layers/visibility issue)
- **FAIL (render not called)**: R3F not invoking renderer.render()

## Artifacts Structure

```
docs/.../cursor-ooda-ink-prototype/
  assets/<commit>/<branch>/<timestamp>/
    YYYY-MM-DD-forceVisible-mcp.png          ← Pass 1 (MCP)
    ink-chromium-*-pre.png                   ← Pass 2 (Playwright)
    ink-chromium-*-post.png                  ← Pass 2 (Playwright)
  console/<commit>/<branch>/<timestamp>/
    console-mcp.json                         ← Pass 1 (MCP)
    console-chromium-*.json                  ← Pass 2 (Playwright)
```

## Usage

```bash
/smoke
```

The workflow will:
1. Execute all 3 passes automatically
2. Show progress with colored output
3. Display cross-validation results
4. Prompt to commit changes (optional)

## Expected Output

```
╔══════════════════════════════════════════════════════════════════════╗
║     INK SMOKE TEST WORKFLOW - 3-PASS COMPLETE (Claude Code)         ║
╠══════════════════════════════════════════════════════════════════════╣
║  Pass 1: MCP Browser Use (Manual Inspection)                         ║
║  Pass 2: Playwright (Automated Test)                                 ║
║  Pass 3: Documentation Update (Analysis & Archival)                  ║
╚══════════════════════════════════════════════════════════════════════╝

Run ID: 20251021-123456
Commit: 60421b13
Branch: docs/ink-falloff-flag-latch-2025-10-12

═══════════════════════════════════════════════════════════════════════
   PASS 1: MCP BROWSER USE (Manual Inspection via Playwright MCP)
═══════════════════════════════════════════════════════════════════════

[Pass 1: 1/7] Setting up environment...
✓ Environment ready

[Pass 1: 2/7] Installing dependencies...
✓ Dependencies installed

[Pass 1: 3/7] Building production app...
✓ Build complete

[Pass 1: 4/7] Starting production server...
✓ Server ready after 3s

[Pass 1: 5/7] Executing MCP browser inspection...
  → Running Claude Code headless with Playwright MCP tools...
✓ MCP browser inspection complete

[Pass 1: 6/7] Stopping server...

[Pass 1: 7/7] Archiving MCP artifacts...
✓ MCP artifacts archived
  → Console: docs/.../console-mcp.json
  → Screenshot: docs/.../2025-10-21-forceVisible-mcp.png

✓ Pass 1 complete - MCP artifacts captured

═══════════════════════════════════════════════════════════════════════
              PASS 2: PLAYWRIGHT (Automated Test)
═══════════════════════════════════════════════════════════════════════

[Pass 2: 1/3] Starting production server...
✓ Server ready after 2s

[Pass 2: 2/3] Running Playwright smoke test...
✓ Playwright test passed

[Pass 2: 3/3] Archiving Playwright artifacts...
✓ Playwright artifacts archived

✓ Pass 2 complete - Playwright artifacts captured

═══════════════════════════════════════════════════════════════════════
        PASS 3: DOCUMENTATION UPDATE (Analysis & Archival)
═══════════════════════════════════════════════════════════════════════

[Pass 3: 1/2] Analyzing console logs (MCP + Playwright)...
  → Analyzing MCP console...
  → Analyzing Playwright console...
✓ Console analysis complete

[Pass 3: 2/2] Updating documentation...
✓ Documentation updated

✓ Pass 3 complete - Documentation updated with dual-pass evidence

╔══════════════════════════════════════════════════════════════════════╗
║                         SMOKE TEST SUMMARY                           ║
╚══════════════════════════════════════════════════════════════════════╝

Pass 1 (MCP Browser Use):
  ✗ VERDICT: FAIL
  Reason: wrong scene - R3F rendering different scene (...)

Pass 2 (Playwright):
  ✗ VERDICT: FAIL
  Reason: wrong scene - R3F rendering different scene (...)
  Confidence: 98%

✓ Cross-validation: Both passes show consistent results

Artifacts:
  → MCP Screenshot: docs/.../2025-10-21-forceVisible-mcp.png
  → MCP Console: docs/.../console-mcp.json
  → Playwright Screenshots: docs/.../ink-*-pre.png, ink-*-post.png
  → Playwright Console: docs/.../console-chromium-*.json

Documentation Updated:
  → 10-latest-smoke-evidence.md
  → 06-working-document.md

Commit changes? (y/n):
```

## MCP Integration

This workflow uses the **Playwright MCP server** installed via:

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

**Available MCP Tools:**
- `browser_navigate` - Navigate to URL
- `browser_console_messages` - Get console messages (structured array)
- `browser_take_screenshot` - Capture screenshot with filename
- `browser_snapshot` - Get accessibility tree
- `browser_navigate_back`, `browser_navigate_forward` - Navigation

**Why MCP (not Puppeteer scripts)?**
- ✅ **Native agent tooling** - Real-time tool invocation during agent execution
- ✅ **Structured responses** - Immediate JSON results the agent can reason about
- ✅ **Dynamic adaptation** - Agent can retry/adjust based on browser state
- ✅ **Live visibility** - Agent sees browser state during execution, not after
- ✅ **Error handling** - Tool failures return structured errors for agent recovery

## Notes

- **Requires**: Node 20 (managed via nvm), Playwright MCP server installed
- **Server**: Runs on 127.0.0.1:3000 to avoid macOS localhost socket reuse issues
- **Build**: Uses production build (not dev server) for accurate smoke test
- **Duration**: Full 3-pass run takes ~3-5 minutes
- **Parity**: Achieves 100% functional parity with Cursor's MCP Browser Use workflow

## Troubleshooting

**MCP tools not available:**
```bash
claude mcp list  # Check if playwright is connected
claude mcp add playwright npx @playwright/mcp@latest  # Reinstall if needed
```

**Server fails to start:**
- Check port 3000 is not in use: `lsof -ti tcp:3000 | xargs kill`
- Verify Next.js build succeeded

**Console markers missing:**
- Check diagnostic logs in console JSON files
- Verify forceVisible bypass is working
- Ensure production build includes all instrumentation

## See Also

- [CLAUDE.md](/CLAUDE.md) - Dreamdust Ink Debugging Guide
- [Test Protocol](docs/initiatives/cryptiq-mindmap-mvp/dreamdust-ink-mask-docs/2025-09-24-test-protocol.md)
- [Playwright MCP Server](https://github.com/microsoft/playwright-mcp)

---

```bash
bash scripts/smoke-workflow.sh
```
