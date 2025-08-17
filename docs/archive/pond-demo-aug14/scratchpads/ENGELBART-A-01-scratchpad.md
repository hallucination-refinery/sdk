# ENGELBART-A-01 Scratchpad

## TASK: M3-SMOKE-PING (Lines 866-901)

### PROMPT VERBATIM:
```
### [M3-SMOKE-PING] - Docs - USER PING (Baseline Test Instructions)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 12:00 AM EST, 14-08-2025  
**NAME:** You are ENGELBART-A (Docs)  
**BRANCH:** feat-pond-demo-aug14  
**TASK:** Publish a short, actionable baseline smoke-screen runbook pointing to `/harness/latent`, then ping user.  
**GUARD BLOCK:** Append a new file under `smoke-screen-tests/` with timestamped name; commit and push.  
**CONTEXT:** Use dev flags `NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1`; avoid legacy scene.  
**WARNINGS:** Keep instructions minimal and deterministic.  
**SUCCESS CRITERIA:** New runbook committed and pushed; includes steps and expected outcomes.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/
```

### DECOMPOSE:
- Core task: Create a baseline smoke-screen runbook file
- Location: `/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/14-08-2025-#baseline-harness.md`
- Content: Specific harness test instructions with dev flags
- Actions: Write file, git add, commit, push
- End state: Runbook published and user pinged

### PLAN:
1. Create runbook file with specified content
2. Add to git
3. Commit with message "docs(smoke): baseline harness runbook and user ping"
4. Push to origin feat-pond-demo-aug14
5. Ping user

### SEQUENCE:
Execute the bash commands exactly as provided in lines 881-898

### VERIFICATION:
- File created at correct path
- Git operations successful
- User notified