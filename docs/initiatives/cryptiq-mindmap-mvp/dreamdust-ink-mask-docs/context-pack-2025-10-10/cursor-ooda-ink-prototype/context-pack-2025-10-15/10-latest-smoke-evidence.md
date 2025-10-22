---
title: Latest Smoke Evidence – Prod URL (scene-03 forceVisible bypass)
date: 2025-10-22T00:01:30Z
tags: [evidence, smoke, prod, forceVisible, diagnostic, CRASH, imperative-fix-bug]
commit: cc22de16
branch: docs/ink-falloff-flag-latch-2025-10-12
url: http://127.0.0.1:3000/quiz/archetype-v1?pc=scene-03&forceVisible=1
---

Summary: MCP smoke on commit `cc22de16` (imperative scene.add fix attempt) **CRASHED** immediately with **"ReferenceError: DreamdustScenePortal is not defined"**. **FAIL (crash — code bug in imperative fix)** — The code references `DreamdustScenePortal` but this component/variable is not defined in the file, causing immediate runtime crash. Page shows "Something went wrong" error boundary. Build succeeded without warnings, but runtime crashed before any Dreamdust initialization could occur.

Runtime error:
```
ReferenceError: DreamdustScenePortal is not defined
  at tC (http://127.0.0.1:3000/_next/static/chunks/290.62dcb7d72735fbbb.js:83:138936)
```

Key findings (MCP):
- **[ERROR] ReferenceError: DreamdustScenePortal is not defined** ← **CRASH before any init**
- NO Dreamdust initialization logs (forceVisible, prebaked, instances, etc.) — crash happened too early
- Page shows "Something went wrong" error boundary
- NO diagnostic logs captured (crash prevented all Dreamdust code from running)

Playwright result:
- Test NOT attempted (MCP crash indicates code bug, no point running Playwright)

Screenshots (MCP):
- `cursor-ooda-ink-prototype/assets/cc22de16/docs/ink-falloff-flag-latch-2025-10-12/20251022-000130/2025-10-22-forceVisible-mcp-CRASH2.png` (shows "Something went wrong" error boundary)

Console logs:
- MCP: `cursor-ooda-ink-prototype/console/cc22de16/docs/ink-falloff-flag-latch-2025-10-12/20251022-000130/console-mcp.json` (single error line)
- Playwright: NOT RUN (code bug)

Decision: **FAIL (crash — code bug in imperative fix)** — Root cause analysis:
1. ❌ **Code bug in commit `cc22de16`** — references `DreamdustScenePortal` which doesn't exist
2. ❌ **Crash occurs immediately** during component render, before any Dreamdust init
3. ❌ **No diagnostic logs** — crash too early in lifecycle
4. ❌ **STATUS UPDATE was incorrect** — claimed Portal was removed and renamed to DreamdustSceneBridge, but code still references the old name

**Critical insight**: The imperative fix at `cc22de16` has an implementation bug. Either:
- The refactor was incomplete (DreamdustScenePortal still referenced somewhere)
- Wrong component name used (should be DreamdustSceneBridge but code says DreamdustScenePortal)
- Component not exported/defined properly

**Next action (Milestone 8 — BUG FIX REQUIRED)**: 
1. Review commit `cc22de16` code changes to find the undefined reference
2. Fix the bug (either define DreamdustScenePortal or update all references to DreamdustSceneBridge)
3. Ensure imperative scene.add() logic is correct
4. Re-run smoke to verify no crash and Points attach to render scene
