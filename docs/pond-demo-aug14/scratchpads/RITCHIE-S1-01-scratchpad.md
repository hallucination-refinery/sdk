# RITCHIE-S1-01 Scratchpad

## Task (Verbatim)
[SYNC-CORE / EXEC / 15–25 min] Import A1/A2 types from canvas-latent-integration before any Core work. Steps: (1) ensure clean tree; (2) git fetch --all --prune; (3) read A1/A2 SHAs from <@docs/pond-demo-aug14/working-doc.md>; (4) try git merge --ff-only origin/canvas-latent-integration (if branch has no commits); else git cherry-pick <A1_SHA> (and optionally <A2_SHA> if it edited code); fallback: git checkout origin/canvas-latent-integration -- packages/canvas-latent then commit; (5) verify files exist and tsc -p packages/canvas-latent compiles. Document every action and thought in your scratchpad; make atomic commits.

## Context
- A1 created packages/canvas-latent/{package.json,tsconfig.json,src/types/index.ts,src/constants.ts,src/index.ts} on canvas-latent-integration
- Core needs these to compile
- Currently on branch: canvas-latent-core

## Success Criteria
- [ ] Working tree clean pre/post
- [ ] packages/canvas-latent/src/types/index.ts present on this branch
- [ ] pnpm -w -s tsc -p packages/canvas-latent exits 0
- [ ] Commit: chore(sync): import shared types from integration@<A1_SHA>
- [ ] Log "SYNC-CORE done @ <SHA>" in working-doc.md

## Execution Log

### Step 1: Check Working Tree Status
Starting at 1:00 PM EST

**Issue**: Currently on feat/pond-demo-aug14, need to be on canvas-latent-core
Working tree has untracked scratchpad file