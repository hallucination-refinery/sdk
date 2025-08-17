# DIJKSTRA-AFZ-01 Scratchpad

## ULTRATHINK MODE

### 1. DECOMPOSE - Prompt Verbatim

**Lines 1025-1067 from prompts.md:**

```
### [M3-AFZ-3] AUDIT & FINALIZE — Milestone 3 Finalization & Self-Validation

**ULTRATHINK MODE**
**CURRENT DATE/TIME:** NOW
**NAME:** DIJKSTRA-AFZ (Audit & Finalize)
**BRANCH:** feat-pond-demo-aug14
**TASK:** Verify all M3 keys present and publish a short M3 status note.
**BASELINE:** Carefully read the _quick_ smoke screen test documented @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/14-08-2025-#baseline-harness.md
**GUARD BLOCK:**

- DOC-SYNC docs; require keys:
  - `S1-ATTRIBUTES-A1`, `S2-TIMELINE-FADE-A1`, `S3-HARNESS-SMOKE-A1`, `S3-DEV-REDIRECT-M3`, `S3-SMOKE-PING-M3`.

[Bash script to execute]
```

**Core Task:** Verify M3 keys in sha-ledger.md and publish status note to working-doc.md

### 2. PLAN - Subtasks

1. Read baseline smoke screen test document
2. Switch to feat-pond-demo-aug14 branch
3. Verify required keys in sha-ledger.md
4. Append M3 status note to working-doc.md
5. Commit and push changes

### 3. PROBE - OODA Loops

**OODA 1: Read baseline document**
- Observe: Document exists at specified path
- Orient: Understand smoke test requirements
- Decide: Proceed with verification
- Act: Read file

**OODA 2: Branch operations**
- Observe: Current branch vs target branch
- Orient: Need to switch branches
- Decide: Execute git commands
- Act: Fetch, checkout, pull

**OODA 3: Key verification**
- Observe: Check for 5 required keys
- Orient: All must be present
- Decide: Fail if any missing
- Act: grep each key

**OODA 4: Status publication**
- Observe: Current working-doc state
- Orient: Need to append status
- Decide: Add timestamped note
- Act: Append, commit, push

### 4. SEQUENCE

1. Read baseline harness document (context)
2. Git operations (fetch → checkout → pull)
3. Verify keys (fail-fast if missing)
4. Publish status (append → commit → push)

### 5. VERIFY ×3

- Check 1: Baseline document exists
- Check 2: All 5 keys present in ledger
- Check 3: Status note properly formatted

### 6. CROSS-CHECK

Using bash commands directly from prompt ensures accuracy.

### 7. STRESS-TEST

- What if branch switch fails? (handle git errors)
- What if keys missing? (exit 1 on failure)
- What if push fails? (network issues)

### 8. REFLECT

Task is straightforward: verify M3 completion markers and document status.