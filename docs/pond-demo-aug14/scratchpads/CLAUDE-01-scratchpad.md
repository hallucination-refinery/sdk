# CLAUDE-01 Scratchpad

## Task Record
**Prompt Verbatim:** "Navigate to @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/prompts.md. Read ONLY lines 24–65 (inclusive) of this file."

**Guard Block:** Do not read any other lines. If the file or these exact lines are unavailable, STOP and report precisely what is missing.

## Task Decomposition
**Core Premise:** Read specific lines (24-65) from a specific file
**Claims:** The file exists at the specified path and contains at least 65 lines
**Implicit Assumptions:** The content within these lines is important/relevant

## Plan (Subtasks)
1. Verify file exists at path: docs/pond-demo-aug14/guides/prompts.md
2. Read lines 24-65 inclusive (42 lines total)
3. Report if file/lines unavailable

## Sequence
1. Use Read tool with offset=23 (0-indexed), limit=42
2. Verify we're reading exactly lines 24-65

## Execution Log
- Creating scratchpad: COMPLETE
- Next: Read specific lines from prompts.md