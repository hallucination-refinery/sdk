## Milestone Status Report

**Current State:** 6:00 PM EST, 13-08-2025 — Milestone 1 (types/constants/scaffold) is complete but landed late; three worktrees (`canvas-latent-core`, `canvas-latent-interaction`, `canvas-latent-integration`) are active; central docs reside in `feat-pond-demo-aug14`; SHA-ledger will be used to coordinate cherry-picks for Milestone 2.
**Milestone 1 Delay Analysis:** Missing mandatory pre-flight DOC-SYNC meant branches started with stale or absent interfaces. Absent SHA tracking obscured which commits contained necessary types, and work proceeded without dependency verification, causing documentation drift and rework.

## Task Decomposition

### Dependencies

- **S0 (Docs Baseline) → SHA Ledger Init:** Required so S1/S2 can read the A1 types SHA from docs before CODE-SYNC.
- **S1 (Core Renderer) → RaycastHandler & camera helpers:** depends on the integration types/constants baseline (A1 types) being present locally via cherry-pick read from the ledger.
- **S2 (Animation) → BurstAnimation:** depends on the same integration types/constants baseline (A1 types) being present locally via cherry-pick read from the ledger.
- **S3 (Integration) → Adapter wiring:** depends on S1’s RaycastHandler commit and S2’s BurstAnimation commit being published to the SHA-ledger and cherry-picked.

### Sequencing

- **Step 0 (serial, docs only):** S3 runs LEDGER-INIT to ensure `sha-ledger.md` exists and publishes the A1 types baseline SHA. This unblocks S1/S2 DOC-SYNC → CODE-SYNC.
- **Step 1 (serial per stream):** S1 and S2 each perform DOC-SYNC (pull central docs) → CODE-SYNC (read A1 SHA from ledger and cherry-pick) → IMPLEMENTATION → DOC-PUBLISH (append SHA to ledger + push docs).
- **Step 2 (parallel):** S1 and S2 IMPLEMENTATION steps can run in parallel because neither requires the other’s code to complete RaycastHandler or BurstAnimation.
- **Step 3 (serial):** After S1 and S2 publish their SHAs, S3 performs DOC-SYNC → CODE-SYNC (parse ledger and cherry-pick S1 then S2 SHAs) → IMPLEMENTATION → DOC-PUBLISH. This ordering guarantees adapter wiring sees both features.

## Implementation Prompts

### [M2-S3-LEDGER-INIT] - Stream 3 (Integration) - DOC-PUBLISH (Baseline)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 6:10 PM EST, 13-08-2025  
**NAME:** You are VON-NEUMANN-INIT (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Initialize/append the central SHA-ledger with the A1 integration types baseline so S1/S2 can CODE-SYNC from docs.  
**GUARD BLOCK:**

- Pull latest docs to avoid drift.
- Ensure ledger file exists; create if missing.
- Verify the baseline key is not already present; if present, skip append (idempotent).
  **CONTEXT:** A1 integration types commit was published at `87c238d9` (documented in working-doc). This must be written to the ledger before S1/S2 start.  
  **WARNINGS:** Append exactly one well-formed `[LEDGER]` line; push immediately.  
  **SUCCESS CRITERIA:** Ledger exists with a new line `KEY=A1-INTEGRATION-TYPES` containing SHA `87c238d9` on `feat-pond-demo-aug14`.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md, @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/working-doc.md

```bash
# Pull central docs and prepare ledger
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14

LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"

# Append baseline A1 types SHA if not present
grep -q "KEY=A1-INTEGRATION-TYPES" "$LEDGER" || {
  DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  printf "[LEDGER] KEY=A1-INTEGRATION-TYPES SHA=87c238d9 BRANCH=canvas-latent-integration DATE=%s MSG=\"A1 types/constants baseline\"\n" "$DATE_STR" >> "$LEDGER"
  git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
  git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): init A1-INTEGRATION-TYPES 87c238d9"
  git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
}
```

**Prevents:** Unblocks S1/S2 by making the A1 SHA discoverable from docs before any code begins, eliminating the M1 unsourced-SHA problem.

---

### [M2-S1-DOC] - Stream 1 (Core) - DOC-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are TURING-A (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** DOC-SYNC central documentation prior to any code work; verify SHA-ledger presence and baseline A1 entry.  
**GUARD BLOCK:**

- Verify docs worktree exists: `/workspace/worktrees/feat-pond-demo-aug14`.
- Verify core worktree exists: `/workspace/worktrees/canvas-latent-core` (create via git worktree if missing).
- Ensure no local uncommitted changes in docs worktree before pulling.
- Do not modify docs during DOC-SYNC.
  **CONTEXT:** Central docs live on branch `feat-pond-demo-aug14`. SHA-ledger controls which commits to cherry-pick.  
  **WARNINGS:** If `sha-ledger.md` or the A1 baseline key is missing after pull, STOP and request S3 LEDGER-INIT.  
  **SUCCESS CRITERIA:** Docs branch fast-forwarded; `sha-ledger.md` present; `KEY=A1-INTEGRATION-TYPES` present; no local doc diffs.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md, @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/working-doc.md

```bash
# Ensure docs worktree present and current
git -C /workspace/worktrees/feat-pond-demo-aug14 rev-parse --abbrev-ref HEAD | cat
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 status --porcelain | cat
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14

# Ensure core worktree exists (create if missing)
[ -d "/workspace/worktrees/canvas-latent-core/.git" ] || git -C /workspace worktree add /workspace/worktrees/canvas-latent-core canvas-latent-core

# Verify SHA-ledger and baseline A1 key
[ -f "/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md" ] || { echo "FATAL: sha-ledger.md missing; request S3 LEDGER-INIT"; exit 1; }
grep -q "KEY=A1-INTEGRATION-TYPES" /workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md || { echo "FATAL: A1 baseline missing; request S3 LEDGER-INIT"; exit 1; }
```

**Prevents:** Starts work with fresh docs and a discoverable baseline SHA; prevents the doc drift that caused M1 delays.

---

### [M2-S1-CODE] - Stream 1 (Core) - CODE-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are TURING-B (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** CODE-SYNC by reading the A1 types SHA from the ledger and cherry-picking it before core implementation.  
**GUARD BLOCK:**

- Confirm DOC-SYNC completed.
- Confirm current branch is `canvas-latent-core` in the core worktree.
- Skip cherry-pick if commit already present (idempotent).
  **CONTEXT:** A1 integration types SHA is stored under `KEY=A1-INTEGRATION-TYPES` in the ledger.  
  **WARNINGS:** Resolve conflicts immediately or STOP; no partial commits.  
  **SUCCESS CRITERIA:** The A1 SHA is an ancestor of HEAD on `canvas-latent-core`.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
A1_SHA=$(grep "KEY=A1-INTEGRATION-TYPES" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')

# Ensure we are on the correct branch and up to date
git -C /workspace/worktrees/canvas-latent-core rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-core$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-core fetch origin

# Cherry-pick A1 types baseline if not already included
git -C /workspace/worktrees/canvas-latent-core merge-base --is-ancestor "$A1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-core cherry-pick -x "$A1_SHA"
```

**Prevents:** Guarantees all core code compiles against the same types/exports that other streams use, eliminating the M1 type drift.

---

### [M2-S1-IMPL] - Stream 1 (Core) - IMPLEMENTATION

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are TURING-C (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Implement `RaycastHandler` (instanceId→nodeId), `cameraPosition`/`zoomToFit` helpers, and seed `PositionCalculator`.  
**GUARD BLOCK:**

- Confirm CODE-SYNC complete; repository clean.
- Confirm files exist or create stubs as needed under `packages/canvas-latent/src`.
- Do not touch files outside Stream 1 territory.
  **CONTEXT:** Single `InstancedMesh` node layer; map instance index↔nodeId via `NodeAttributeManager`. Use Three.js `Raycaster` against instanced mesh only. Camera helpers compute bounding sphere from visible node positions. Seeds produce deterministic positions when `posByLens` is absent.  
  **WARNINGS:** No per-frame allocations; no material or geometry duplication; keep draw calls to 1.  
  **SUCCESS CRITERIA:**
- `RaycastHandler` returns `{ nodeId, point }` in ≤0.6ms typical.
- `cameraPosition`, `zoomToFit` work with padding and optional filter.
- `PositionCalculator` deterministically maps id+ lens→position.
- All new code compiles with existing types.
  **RESOURCES:** @packages/canvas-latent/src/core/RaycastHandler.ts, @packages/canvas-latent/src/core/InstancedNodeMesh.ts, @packages/canvas-latent/src/core/NodeAttributeManager.ts, @packages/canvas-latent/src/utils/PositionCalculator.ts, @packages/canvas-latent/src/types/index.ts

```bash
# Implement and commit core features (no pushes of docs here)
git -C /workspace/worktrees/canvas-latent-core status --porcelain | cat
# (Make edits in the owned files, then commit)
git -C /workspace/worktrees/canvas-latent-core add packages/canvas-latent/src/core/RaycastHandler.ts packages/canvas-latent/src/core/InstancedNodeMesh.ts packages/canvas-latent/src/core/NodeAttributeManager.ts packages/canvas-latent/src/utils/PositionCalculator.ts
git -C /workspace/worktrees/canvas-latent-core commit -m "core(raycaster,camera,layout): RaycastHandler; cameraPosition/zoomToFit helpers; seeded PositionCalculator (deterministic)"
# Push code branch
git -C /workspace/worktrees/canvas-latent-core push origin canvas-latent-core
```

**Prevents:** Ensures the core surface needed by other streams is in place with deterministic behavior, avoiding guesswork and rework.

---

### [M2-S1-DOCPUB] - Stream 1 (Core) - DOC-PUBLISH

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are TURING-D (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Append latest core commit SHA to the central SHA-ledger and push docs.  
**GUARD BLOCK:**

- Ensure latest core commit SHA is captured.
- Ensure docs worktree has no local diffs before edit.
- Append a single well-formed ledger line.
  **CONTEXT:** Downstream (S3) will cherry-pick this exact SHA before adapter wiring.  
  **WARNINGS:** Do not overwrite the file; always append; push immediately.  
  **SUCCESS CRITERIA:** One new `[LEDGER]` line with KEY=S1-RAYCASTHANDLER-A1 and correct SHA; docs pushed to `feat-pond-demo-aug14`.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
CORE_SHA=$(git -C /workspace/worktrees/canvas-latent-core rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

# Ensure docs are current, then append
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S1-RAYCASTHANDLER-A1 SHA=%s BRANCH=canvas-latent-core DATE=%s MSG=\"RaycastHandler+camera+seeds\"\n" "$CORE_SHA" "$DATE_STR" >> "$LEDGER"

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S1-RAYCASTHANDLER-A1 $CORE_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Provides a single canonical SHA source for S3; eliminates ambiguity from M1.

---

### [M2-S2-DOC] - Stream 2 (Animation) - DOC-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are LOVELACE-A (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** DOC-SYNC central documentation prior to any animation work; verify SHA-ledger presence and baseline A1 entry.  
**GUARD BLOCK:**

- Verify docs and interaction worktrees exist; create worktree if missing.
- Ensure no local doc diffs before pull.
  **CONTEXT:** Central docs on `feat-pond-demo-aug14`; SHA-ledger is authoritative.  
  **WARNINGS:** If ledger or A1 baseline missing after pull, STOP — request S3 LEDGER-INIT.  
  **SUCCESS CRITERIA:** Docs updated; ledger present; A1 baseline present; no uncommitted doc changes.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 status --porcelain | cat
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -d "/workspace/worktrees/canvas-latent-interaction/.git" ] || git -C /workspace worktree add /workspace/worktrees/canvas-latent-interaction canvas-latent-interaction
[ -f "/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md" ] || { echo "FATAL: sha-ledger.md missing"; exit 1; }
grep -q "KEY=A1-INTEGRATION-TYPES" /workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md || { echo "FATAL: A1 baseline missing"; exit 1; }
```

**Prevents:** Starts animation work with synchronized documentation and known baseline dependency.

---

### [M2-S2-CODE] - Stream 2 (Animation) - CODE-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are LOVELACE-B (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** CODE-SYNC by reading A1 types SHA from the ledger and cherry-picking it before BurstAnimation.  
**GUARD BLOCK:** Confirm on `canvas-latent-interaction`; ensure clean working tree.  
**CONTEXT:** A1 integration types SHA stored under `KEY=A1-INTEGRATION-TYPES`.  
**WARNINGS:** Abort on conflicts; do not proceed with partial state.  
**SUCCESS CRITERIA:** A1 SHA is ancestor of HEAD.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
A1_SHA=$(grep "KEY=A1-INTEGRATION-TYPES" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')

git -C /workspace/worktrees/canvas-latent-interaction rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-interaction$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-interaction fetch origin
git -C /workspace/worktrees/canvas-latent-interaction merge-base --is-ancestor "$A1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-interaction cherry-pick -x "$A1_SHA"
```

**Prevents:** Ensures animation code compiles against the same contract used by other streams.

---

### [M2-S2-IMPL] - Stream 2 (Animation) - IMPLEMENTATION

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are LOVELACE-C (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** Implement `BurstAnimation` (origin→layout tween), temporarily block interactions during burst, fire completion callback.  
**GUARD BLOCK:**

- Confirm CODE-SYNC complete; working tree clean.
- Use `NodeAttributeManager` only; no material/geometry duplication.
- Ensure durations from `constants.ts` (300–600ms) are respected.
  **CONTEXT:** CPU lerp per frame; write translation only; batch flush once per frame.  
  **WARNINGS:** No position changes on hover/selection; burst happens exactly once.  
  **SUCCESS CRITERIA:**
- Burst executes exactly once after initial load.
- Interactions blocked only during burst window.
- Nodes static after settling; no drift.
  **RESOURCES:** @packages/canvas-latent/src/animations/BurstAnimation.ts, @packages/canvas-latent/src/utils/Interpolation.ts, @packages/canvas-latent/src/types/index.ts, @packages/canvas-latent/src/constants.ts

```bash
# Implement and commit BurstAnimation
git -C /workspace/worktrees/canvas-latent-interaction status --porcelain | cat
# (Make edits in owned files, then commit)
git -C /workspace/worktrees/canvas-latent-interaction add packages/canvas-latent/src/animations/BurstAnimation.ts packages/canvas-latent/src/utils/Interpolation.ts packages/canvas-latent/src/constants.ts
git -C /workspace/worktrees/canvas-latent-interaction commit -m "anim(burst): initial burst tween (origin→layout), interaction gating, completion callback"
git -C /workspace/worktrees/canvas-latent-interaction push origin canvas-latent-interaction
```

**Prevents:** Locks one-time burst semantics and gating so interactions cannot corrupt animation state.

---

### [M2-S2-DOCPUB] - Stream 2 (Animation) - DOC-PUBLISH

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are LOVELACE-D (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** Append latest animation commit SHA to central SHA-ledger and push docs.  
**GUARD BLOCK:** Capture HEAD SHA; ensure docs pulled; append only.  
**CONTEXT:** S3 will depend on this SHA for adapter wiring validation.  
**WARNINGS:** Append one line; push immediately; no doc drift.  
**SUCCESS CRITERIA:** New `[LEDGER]` line with KEY=S2-BURSTANIMATION-A1 and correct SHA; docs pushed.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
ANIM_SHA=$(git -C /workspace/worktrees/canvas-latent-interaction rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S2-BURSTANIMATION-A1 SHA=%s BRANCH=canvas-latent-interaction DATE=%s MSG=\"BurstAnimation (origin→layout)\"\n" "$ANIM_SHA" "$DATE_STR" >> "$LEDGER"

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S2-BURSTANIMATION-A1 $ANIM_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Gives S3 a stable reference to animation behavior before wiring.

---

### [M2-S3-DOC] - Stream 3 (Integration) - DOC-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are VON-NEUMANN-A (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** DOC-SYNC central docs; validate presence of S1/S2 ledger entries.  
**GUARD BLOCK:**

- Ensure docs worktree pulls cleanly.
- Verify ledger contains keys `S1-RAYCASTHANDLER-A1` and `S2-BURSTANIMATION-A1` (wait if absent).
  **CONTEXT:** Adapter wiring depends on both S1 and S2 SHAs.  
  **WARNINGS:** Do not proceed without both keys present to avoid wiring against stale surfaces.  
  **SUCCESS CRITERIA:** Fresh docs; both keys found with valid SHAs.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S1-RAYCASTHANDLER-A1" "$LEDGER" || { echo "WAIT: S1 ledger missing"; exit 1; }
grep -q "KEY=S2-BURSTANIMATION-A1" "$LEDGER" || { echo "WAIT: S2 ledger missing"; exit 1; }
```

**Prevents:** Eliminates the M1 class of errors where integration wired to missing or incompatible features.

---

### [M2-S3-CODE] - Stream 3 (Integration) - CODE-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 5:50 PM EST, 13-08-2025  
**NAME:** You are VON-NEUMANN-B (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Cherry-pick S1 and S2 SHAs from ledger onto `canvas-latent-integration` in order, then proceed.  
**GUARD BLOCK:** Clean working tree; correct branch; abort on conflicts.  
**CONTEXT:** Keep order stable: S1 (core) before S2 (animation).  
**WARNINGS:** If cherry-pick conflicts, resolve completely or STOP.  
**SUCCESS CRITERIA:** Both SHAs are ancestors of HEAD.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
S1_SHA=$(grep "KEY=S1-RAYCASTHANDLER-A1" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
S2_SHA=$(grep "KEY=S2-BURSTANIMATION-A1" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')

git -C /workspace/worktrees/canvas-latent-integration rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-integration$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration fetch origin

# Apply in deterministic order
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S1_SHA"
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S2_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S2_SHA"
```

**Prevents:** Ensures integration is built on the exact S1/S2 artifacts, avoiding branch skew.

---

### [M2-S3-IMPL] - Stream 3 (Integration) - IMPLEMENTATION

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 10:40 PM EST, 13-08-2025  
**NAME:** You are **VON-NEUMANN-C** (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Wire adapter events to store callbacks; implement ref API stubs (no-ops for d3Force\*); expose `window.__FG`.  
**GUARD BLOCK:**

- Confirm CODE-SYNC complete; working tree clean.
- Do not modify Stream 1 or 2 files; adapter lives under adapters/; update types only if necessary and coordinate via ledger if changed.
  **CONTEXT:** Adapter must match `ForceGraphAdapter` props/ref surface; unknown props pass-through; background clicks, hover, select routed via Raycaster results from S1.  
  **WARNINGS:** Keep parity: accept but ignore nodeThreeObject/link-rendering props; do not regress performance.  
  **SUCCESS CRITERIA:**
- Props parity compiles; ref methods implemented/stubbed as specified.
- Store callbacks (`onNodeClick`, `onNodeHover`, `onBackgroundClick`) fire with node object from `graphData`.
- `window.__FG` exposes ref methods and internals for debugging.
  **RESOURCES:** @packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx, @packages/canvas-latent/src/types/index.ts

```bash
# Implement adapter wiring and commit
git -C /workspace/worktrees/canvas-latent-integration status --porcelain | cat
# (Make edits in adapter file, then commit)
git -C /workspace/worktrees/canvas-latent-integration add packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx packages/canvas-latent/src/types/index.ts
git -C /workspace/worktrees/canvas-latent-integration commit -m "adapter(wiring): store callbacks, ref API stubs (d3Force* no-ops), window.__FG debug exposure"
git -C /workspace/worktrees/canvas-latent-integration push origin canvas-latent-integration
```

**Prevents:** Guarantees adapter/API parity and store wiring on top of the exact S1/S2 baselines.

---

### [M2-S3-DOCPUB] - Stream 3 (Integration) - DOC-PUBLISH

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 10:45 PM EST, 13-08-2025  
**NAME:** You are VON-NEUMANN-D (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Append latest integration commit SHA to central SHA-ledger and push docs.  
**GUARD BLOCK:** Capture HEAD SHA; ensure docs up to date; append a single line.  
**CONTEXT:** Final wiring commit becomes the integration anchor for Milestone 2 verification.  
**WARNINGS:** Append only; no reordering; immediate push.  
**SUCCESS CRITERIA:** New `[LEDGER]` line with KEY=S3-ADAPTER-WIRING-A1 and correct SHA; docs pushed.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
INTEG_SHA=$(git -C /workspace/worktrees/canvas-latent-integration rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S3-ADAPTER-WIRING-A1 SHA=%s BRANCH=canvas-latent-integration DATE=%s MSG=\"Adapter wiring + ref stubs + window.__FG\"\n" "$INTEG_SHA" "$DATE_STR" >> "$LEDGER"

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S3-ADAPTER-WIRING-A1 $INTEG_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Locks a single integration anchor for demo validation and future cherry-picks.

---

## Self-Validation Checklist

- [ ] Every implementation has DOC-SYNC then CODE-SYNC prompts before it
- [ ] Every sync prompt has exact git commands
- [ ] SHA writes trigger immediate doc pushes
- [ ] No work starts without both syncs

- For S0: LEDGER-INIT (M2-S3-LEDGER-INIT) — establishes A1 baseline in docs prior to any code.
- For S1: DOC-SYNC (M2-S1-DOC) → CODE-SYNC (M2-S1-CODE) → IMPLEMENTATION (M2-S1-IMPL) → DOC-PUBLISH (M2-S1-DOCPUB)
- For S2: DOC-SYNC (M2-S2-DOC) → CODE-SYNC (M2-S2-CODE) → IMPLEMENTATION (M2-S2-IMPL) → DOC-PUBLISH (M2-S2-DOCPUB)
- For S3: DOC-SYNC (M2-S3-DOC) → CODE-SYNC (M2-S3-CODE) → IMPLEMENTATION (M2-S3-IMPL) → DOC-PUBLISH (M2-S3-DOCPUB)

---

## Milestone Status Report

**Current State:** 11:45 PM EST, 13-08-2025 — Milestone 2 complete and ledger updated (A1, S1, S2, S3). Integration boots, but the legacy scene errors on missing `@refinery/canvas-r3f`. We will unblock baseline testing by adding a dedicated harness that imports `@refinery/canvas-latent` directly and by advancing Milestone 3.
**Milestone 1 Delay Analysis:** Branches started without mandatory DOC-SYNC and lacked SHA tracking, causing cross-branch drift and rework. Missing guard blocks allowed work to proceed with unmet prerequisites. Prompts below enforce DOC-SYNC/CODE-SYNC gates and append-only ledger updates to maintain a single source of truth.

## Task Decomposition

### Dependencies

- **S1 (Core Renderer)** M3 work depends on A1 types baseline being present (idempotent if already cherry-picked).
- **S2 (Animation)** M3 work depends on A1 types baseline and S1’s published interface contracts (already present via types; idempotent CODE-SYNC).
- **S3 (Integration)** harness depends on S1/S2 published M3 SHAs to cherry-pick; harness avoids `@refinery/canvas-r3f` by importing `@refinery/canvas-latent` directly.

### Sequencing

- **Step 1 (parallel):** S1 and S2 each run DOC-SYNC → CODE-SYNC, then implement their M3 tasks and DOCPUB. They are independent and can run in parallel.
- **Step 2 (serial):** S3 runs DOC-SYNC → CODE-SYNC (waiting for S1/S2 M3 SHAs if not present), then implements the harness/dev toggles, DOCPUB, and finally publishes a smoke-screen “PING” in docs to trigger the baseline test.

## Implementation Prompts

### [M3-S1-DOC] - Stream 1 (Core) - DOC-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:45 PM EST, 13-08-2025  
**NAME:** You are KERNIGHAN-A (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** DOC-SYNC central docs; verify A1 baseline present in ledger.  
**GUARD BLOCK:**

- Pull latest docs; ensure clean FF-only update.
- Verify ledger exists and contains `KEY=A1-INTEGRATION-TYPES`.  
  **CONTEXT:** S1 M3 compiles against A1 types; idempotent if already present.  
  **WARNINGS:** Do not modify docs during DOC-SYNC.  
  **SUCCESS CRITERIA:** Docs current; A1 key found.  
  **RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md" ] || { echo "FATAL: ledger missing"; exit 1; }
grep -q "KEY=A1-INTEGRATION-TYPES" /workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md || { echo "FATAL: A1 baseline missing"; exit 1; }
```

**Prevents:** Starts from fresh docs with verified baseline, eliminating stale-type drift.

---

### [M3-S1-CODE] - Stream 1 (Core) - CODE-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:46 PM EST, 13-08-2025  
**NAME:** You are KERNIGHAN-B (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Cherry-pick A1 types baseline if not already ancestor, then proceed.  
**GUARD BLOCK:** Clean working tree; correct branch.  
**CONTEXT:** Idempotent merge-base guard; skip if already integrated.  
**WARNINGS:** Abort on conflicts.  
**SUCCESS CRITERIA:** A1 SHA is ancestor of HEAD.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
A1_SHA=$(grep "KEY=A1-INTEGRATION-TYPES" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
git -C /workspace/worktrees/canvas-latent-core rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-core$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-core status --porcelain | grep . && { echo "Dirty working tree"; exit 1; }
git -C /workspace/worktrees/canvas-latent-core fetch origin
git -C /workspace/worktrees/canvas-latent-core merge-base --is-ancestor "$A1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-core cherry-pick -x "$A1_SHA"
```

**Prevents:** Ensures S1 compiles against the shared contract that other streams use.

---

### [M3-S1-IMPL] - Stream 1 (Core) - IMPLEMENTATION

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:47 PM EST, 13-08-2025  
**NAME:** You are KERNIGHAN-C (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Complete attribute write paths in `NodeAttributeManager` (setPosition/Color/Opacity/Selected), coalesce dirty ranges in `flush()`, and implement base color policy (by category/tags).  
**GUARD BLOCK:**

- Work only under `packages/canvas-latent/src/core` and `utils`.
- No per-frame allocations; single draw call preserved.  
  **CONTEXT:** InstancedMesh uses instanceMatrix, instanceColor, aOpacity attributes; maintain baseColor cache for restores.  
  **WARNINGS:** Do not expand shader surface; keep onBeforeCompile patch minimal.  
  **SUCCESS CRITERIA:**
- All setters write into typed arrays and mark min/max dirty ranges; `flush()` updates ranges once/frame.
- Base color resolves from category/tags with priority table; selection/hover overwrite and restore correctly.
- Builds pass; one draw call maintained.  
  **RESOURCES:** @packages/canvas-latent/src/core/NodeAttributeManager.ts, @packages/canvas-latent/src/core/InstancedNodeMesh.ts, @packages/canvas-latent/src/utils/PositionCalculator.ts

```bash
git -C /workspace/worktrees/canvas-latent-core status --porcelain | cat
# (Make edits in owned files)
git -C /workspace/worktrees/canvas-latent-core add packages/canvas-latent/src/core/NodeAttributeManager.ts packages/canvas-latent/src/core/InstancedNodeMesh.ts packages/canvas-latent/src/utils/PositionCalculator.ts
git -C /workspace/worktrees/canvas-latent-core commit -m "core(attributes): implement setPosition/Color/Opacity/Selected; coalesced flush(); base color policy by category/tags"
git -C /workspace/worktrees/canvas-latent-core push origin canvas-latent-core
```

**Prevents:** Avoids partial updates and color drift that previously caused inconsistent visuals.

---

### [M3-S1-DOCPUB] - Stream 1 (Core) - DOC-PUBLISH

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:49 PM EST, 13-08-2025  
**NAME:** You are KERNIGHAN-D (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Append latest S1 commit SHA to ledger (KEY=S1-ATTRIBUTES-A1).  
**GUARD BLOCK:** Pull docs first; append one line; immediate push.  
**CONTEXT:** S3 will cherry-pick this onto integration.  
**WARNINGS:** Append-only; no edits to prior lines.  
**SUCCESS CRITERIA:** New `[LEDGER]` with KEY=S1-ATTRIBUTES-A1.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
S1_SHA=$(git -C /workspace/worktrees/canvas-latent-core rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S1-ATTRIBUTES-A1 SHA=%s BRANCH=canvas-latent-core DATE=%s MSG=\"NodeAttributeManager setters + flush + base colors\"\n" "$S1_SHA" "$DATE_STR" >> "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S1-ATTRIBUTES-A1 $S1_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Provides a deterministic S1 anchor for integration to consume.

---

### [M3-S2-DOC] - Stream 2 (Animation) - DOC-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:50 PM EST, 13-08-2025  
**NAME:** You are RITCHIE-A (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** DOC-SYNC central docs; verify A1 baseline present.  
**GUARD BLOCK:** Pull docs; ensure ledger+A1.  
**CONTEXT:** S2 compiles against A1; idempotent.  
**WARNINGS:** No doc edits here.  
**SUCCESS CRITERIA:** Docs current; A1 found.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md" ] || { echo "FATAL: ledger missing"; exit 1; }
grep -q "KEY=A1-INTEGRATION-TYPES" /workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md || { echo "FATAL: A1 baseline missing"; exit 1; }
```

**Prevents:** Starts S2 with verified baseline to avoid contract mismatches.

---

### [M3-S2-CODE] - Stream 2 (Animation) - CODE-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:51 PM EST, 13-08-2025  
**NAME:** You are RITCHIE-B (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** Cherry-pick A1 baseline if not ancestor.  
**GUARD BLOCK:** Clean working tree; correct branch.  
**CONTEXT:** Idempotent; skip if present.  
**WARNINGS:** Abort on conflicts.  
**SUCCESS CRITERIA:** A1 is ancestor of HEAD.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
A1_SHA=$(grep "KEY=A1-INTEGRATION-TYPES" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
git -C /workspace/worktrees/canvas-latent-interaction rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-interaction$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-interaction status --porcelain | grep . && { echo "Dirty working tree"; exit 1; }
git -C /workspace/worktrees/canvas-latent-interaction fetch origin
git -C /workspace/worktrees/canvas-latent-interaction merge-base --is-ancestor "$A1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-interaction cherry-pick -x "$A1_SHA"
```

**Prevents:** Keeps S2 on the same type contract as other streams.

---

### [M3-S2-IMPL] - Stream 2 (Animation) - IMPLEMENTATION

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:52 PM EST, 13-08-2025  
**NAME:** You are RITCHIE-C (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** Implement Timeline fade: when `visibleIds` or `nodeVisibility` changes, tween `aOpacity` per node (120–200ms), throttle updates to ≥1 frame.  
**GUARD BLOCK:**

- Use `NodeAttributeManager.setOpacity()` and `flush()` once per frame.
- No position writes; interactions unaffected.  
  **CONTEXT:** Follow behavioral contract: fade only; no flicker.  
  **WARNINGS:** Avoid per-node allocations; batch writes.  
  **SUCCESS CRITERIA:**
- Fades are smooth and bounded; no stutter; zero position drift.
- Rapid scrub toggles don’t glitch; throttled to frame cadence.  
  **RESOURCES:** @packages/canvas-latent/src/animations/TimelineAnimation.ts, @packages/canvas-latent/src/utils/Interpolation.ts, @packages/canvas-latent/src/types/index.ts, @packages/canvas-latent/src/constants.ts

```bash
git -C /workspace/worktrees/canvas-latent-interaction status --porcelain | cat
# (Create/modify files)
git -C /workspace/worktrees/canvas-latent-interaction add packages/canvas-latent/src/animations/TimelineAnimation.ts packages/canvas-latent/src/utils/Interpolation.ts packages/canvas-latent/src/constants.ts
git -C /workspace/worktrees/canvas-latent-interaction commit -m "anim(timeline): opacity tween on visibleIds/nodeVisibility changes; frame-throttled; no position writes"
git -C /workspace/worktrees/canvas-latent-interaction push origin canvas-latent-interaction
```

**Prevents:** Stops binary show/hide flicker and guarantees stability during scrubs.

---

### [M3-S2-DOCPUB] - Stream 2 (Animation) - DOC-PUBLISH

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:54 PM EST, 13-08-2025  
**NAME:** You are RITCHIE-D (Stream 2)  
**BRANCH:** canvas-latent-interaction  
**TASK:** Append S2 Timeline fade commit SHA to ledger (KEY=S2-TIMELINE-FADE-A1).  
**GUARD BLOCK:** Pull docs; append one line; push.  
**CONTEXT:** Integration will consume this SHA.  
**WARNINGS:** Append-only.  
**SUCCESS CRITERIA:** New KEY=S2-TIMELINE-FADE-A1.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
S2_SHA=$(git -C /workspace/worktrees/canvas-latent-interaction rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S2-TIMELINE-FADE-A1 SHA=%s BRANCH=canvas-latent-interaction DATE=%s MSG=\"Timeline opacity fade + throttle\"\n" "$S2_SHA" "$DATE_STR" >> "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S2-TIMELINE-FADE-A1 $S2_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Publishes the exact S2 artifact for integration to cherry-pick deterministically.

---

### [M3-S3-DOC] - Stream 3 (Integration) - DOC-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 12:36 AM EST, 14-08-2025  
**NAME:** You are THOMPSON-A (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** DOC-SYNC central docs; validate presence of S1-ATTRIBUTES-A1 and S2-TIMELINE-FADE-A1.  
**GUARD BLOCK:** Pull docs; require both keys; STOP if missing.  
**CONTEXT:** Harness will import `@refinery/canvas-latent`, bypassing `@refinery/canvas-r3f` errors.  
**WARNINGS:** Don’t proceed without both keys.  
**SUCCESS CRITERIA:** Both keys present.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S1-ATTRIBUTES-A1" "$LEDGER" || { echo "WAIT: S1-ATTRIBUTES-A1 missing"; exit 1; }
grep -q "KEY=S2-TIMELINE-FADE-A1" "$LEDGER" || { echo "WAIT: S2-TIMELINE-FADE-A1 missing"; exit 1; }
```

**Prevents:** Blocks integration work until upstream artifacts are published.

---

### [M3-S3-CODE] - Stream 3 (Integration) - CODE-SYNC

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:56 PM EST, 13-08-2025  
**NAME:** You are THOMPSON-B (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Cherry-pick S1-ATTRIBUTES-A1 then S2-TIMELINE-FADE-A1 onto integration.  
**GUARD BLOCK:** Clean working tree; correct branch.  
**CONTEXT:** Deterministic order S1 → S2.  
**WARNINGS:** Abort on unexpected conflicts.  
**SUCCESS CRITERIA:** Both SHAs are ancestors of HEAD.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
S1_SHA=$(grep "KEY=S1-ATTRIBUTES-A1" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
S2_SHA=$(grep "KEY=S2-TIMELINE-FADE-A1" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
git -C /workspace/worktrees/canvas-latent-integration rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-integration$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration status --porcelain | grep . && { echo "Dirty working tree"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration fetch origin
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S1_SHA"
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S2_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S2_SHA"
```

**Prevents:** Ensures integration includes the exact upstream artifacts before implementing harness.

---

### [M3-S3-IMPL] - Stream 3 (Integration) - IMPLEMENTATION (Harness + Dev Toggles)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 12:50 AM EST, 14-08-2025  
**NAME:** You are THOMPSON-C (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Build a sample harness page that imports `@refinery/canvas-latent` directly with dev toggles; avoid `@refinery/canvas-r3f`.  
**GUARD BLOCK:**

- Restrict edits to the app’s harness route and minimal wiring; no changes to legacy scene.  
  **CONTEXT:** Next.js 15 with app directory; create `app/harness/latent/page.tsx` rendering `CanvasLatentAdapter` with minimal `graphData` stub and HUD mount check. Dev toggles via `NEXT_PUBLIC_DEBUG_GRAPH=1` and `NEXT_PUBLIC_LATENT_TRACE=1`.  
  **WARNINGS:** Do not touch `CrypticAnimusScene`; harness is isolated.  
  **SUCCESS CRITERIA:**
- `pnpm -w dev --filter cryptic-vault-demo` serves `/harness/latent` without module errors; one-burst on load; HUD immediate.  
  **RESOURCES:** @apps/legacy-import/cryptic-vault-demo/app/harness/latent/page.tsx, @packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx

```bash
# (Create the harness page and commit)
git -C /workspace/worktrees/canvas-latent-integration add apps/legacy-import/cryptic-vault-demo/app/harness/latent/page.tsx
git -C /workspace/worktrees/canvas-latent-integration commit -m "integration(harness): add /harness/latent using @refinery/canvas-latent with dev toggles"
git -C /workspace/worktrees/canvas-latent-integration push origin canvas-latent-integration
```

**Prevents:** Bypasses missing `@refinery/canvas-r3f` by running against the new package directly, unblocking baseline testing.

---

### [M3-S3-DOCPUB] - Stream 3 (Integration) - DOC-PUBLISH (Harness)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 12:55 AM EST, 14-08-2025  
**NAME:** You are THOMPSON-D (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Append harness commit SHA to ledger (KEY=S3-HARNESS-SMOKE-A1).  
**GUARD BLOCK:** Pull docs; append one line; push.  
**CONTEXT:** Docs become the launch instructions source for baseline testing.  
**WARNINGS:** Append-only.  
**SUCCESS CRITERIA:** New KEY=S3-HARNESS-SMOKE-A1 line present.  
**RESOURCES:** @worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

```bash
S3_SHA=$(git -C /workspace/worktrees/canvas-latent-integration rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S3-HARNESS-SMOKE-A1 SHA=%s BRANCH=canvas-latent-integration DATE=%s MSG=\"Harness page + dev toggles for baseline\"\n" "$S3_SHA" "$DATE_STR" >> "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S3-HARNESS-SMOKE-A1 $S3_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Publishes a deterministic integration anchor for the harness.

---

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

```bash
RUNBOOK=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/14-08-2025-#baseline-harness.md
cat > "$RUNBOOK" << 'EOF'
# Baseline Smoke (Harness)

## Steps
1) From /workspace/worktrees/feat-pond-demo-aug14: `NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -w dev --filter cryptic-vault-demo`
2) Open http://localhost:3000/harness/latent
3) Verify: HUD immediate; nodes spawn at (0,0,0); exactly one burst (300–600ms); no drift.

## Notes
- Harness imports @refinery/canvas-latent directly to avoid @refinery/canvas-r3f errors.
- If anything fails, STOP and log expected vs observed in a new scratchpad.
EOF

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$RUNBOOK"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(smoke): baseline harness runbook and user ping"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

**Prevents:** Eliminates ambiguity by providing a single, minimal test path and instructions.

--

### [M3-AF-1] AUDIT & FIX — Dev Redirect + Local Package Wiring (Integration)

**ULTRATHINK MODE**
**CURRENT DATE/TIME:** 2:18 AM EST, 14-08-2025
**NAME:** THOMPSON-AF (Audit & Fix)
**BRANCH:** canvas-latent-integration
**TASK:** In dev, redirect “/” → “/harness/latent”, ensure the app depends on the local `@pond/canvas-latent`, and export adapter symbols. Commit, push, then write SHA to ledger as S3-DEV-REDIRECT-M3.

**GUARD BLOCK:**

- DOC-SYNC docs and require both keys before any changes:
  - `KEY=S1-ATTRIBUTES-A1`, `KEY=S2-TIMELINE-FADE-A1`
- CODE-SYNC integration (idempotent): cherry-pick S1 then S2 if not ancestors.
- Scope: only `canvas-latent-integration` and central docs worktree.

```bash
# DOC-SYNC (docs)
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S1-ATTRIBUTES-A1" "$LEDGER" || { echo "WAIT: S1-ATTRIBUTES-A1 missing"; exit 1; }
grep -q "KEY=S2-TIMELINE-FADE-A1" "$LEDGER" || { echo "WAIT: S2-TIMELINE-FADE-A1 missing"; exit 1; }

# CODE-SYNC (integration)
S1_SHA=$(grep "KEY=S1-ATTRIBUTES-A1" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
S2_SHA=$(grep "KEY=S2-TIMELINE-FADE-A1" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')
git -C /workspace/worktrees/canvas-latent-integration rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-integration$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration status --porcelain | grep . && { echo "Dirty working tree"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration fetch origin
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S1_SHA"
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S2_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S2_SHA"

# Dev-only redirect for root → harness
CFG=/workspace/worktrees/canvas-latent-integration/apps/legacy-import/cryptic-vault-demo/next.config.ts
grep -q "redirects()" "$CFG" || cat >> "$CFG" << 'EOF'

export default {
  async redirects() {
    return process.env.NODE_ENV === 'development'
      ? [{ source: '/', destination: '/harness/latent', permanent: false }]
      : [];
  },
};
EOF

# Ensure app depends on local @pond/canvas-latent
APP_PKG=/workspace/worktrees/canvas-latent-integration/apps/legacy-import/cryptic-vault-demo/package.json
node -e "const fs=require('fs');const p=process.argv[1];const j=JSON.parse(fs.readFileSync(p,'utf8'));j.dependencies=j.dependencies||{};if(!j.dependencies['@pond/canvas-latent']){j.dependencies['@pond/canvas-latent']='workspace:*';fs.writeFileSync(p, JSON.stringify(j,null,2));console.log('added');}else{console.log('exists');}" "$APP_PKG"

# Ensure adapter exports in package index
PKG_INDEX=/workspace/worktrees/canvas-latent-integration/packages/canvas-latent/src/index.ts
grep -q "CanvasLatentAdapter" "$PKG_INDEX" || echo "export { CanvasLatentAdapter } from './adapters/CanvasLatentAdapter'" >> "$PKG_INDEX"
grep -q "CanvasLatentRef" "$PKG_INDEX" || echo "export type { CanvasLatentRef } from './adapters/CanvasLatentAdapter'" >> "$PKG_INDEX"

# Commit + push integration changes
git -C /workspace/worktrees/canvas-latent-integration add .
git -C /workspace/worktrees/canvas-latent-integration commit -m "integration(dev): dev redirect '/'→'/harness/latent'; add @pond/canvas-latent dep; ensure adapter exports"
git -C /workspace/worktrees/canvas-latent-integration push origin canvas-latent-integration

# DOCPUB: record SHA in ledger as S3-DEV-REDIRECT-M3
INTEG_SHA=$(git -C /workspace/worktrees/canvas-latent-integration rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf "[LEDGER] KEY=S3-DEV-REDIRECT-M3 SHA=%s BRANCH=canvas-latent-integration DATE=%s MSG=\"Dev redirect + local package wiring + exports\"\n" "$INTEG_SHA" "$DATE_STR" >> "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S3-DEV-REDIRECT-M3 $INTEG_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

---

### [M3-VIS-2] Audit & Investigate: Latest Manual Visual Confirmation Smoke

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** NOW  
**NAME:** ENGELBART-VIS (Docs Auditor)  
**BRANCH:** feat-pond-demo-aug14  
**TASK:** Read the latest manual smoke screen test results (user-documented), compare against the predictions below, classify outcome, extract error signatures, and publish a concise "Audit Findings" section with prioritized next steps. Record a docs-only ledger entry.

**GUARD BLOCK:**

- DOC-SYNC central docs fast-forward only; require `KEY=S3-DEV-REDIRECT-M3` to ensure harness baseline is valid.
- Inputs are docs-only; do not modify any code or non-doc files.
- Require the runbook file to exist; STOP with a clear message if missing.
- Idempotent writes: append a new audit section each run, do not rewrite prior content.

**INPUTS:**

- RUNBOOK: @filepath (replace with the actual smoke log path the user just updated)
- LEDGER: `/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md`

**PREDICTIONS (to score hit/miss):**

- P1 (80%): With `NEXT_PUBLIC_LATENT_TRACE=1`, spheres render immediately (opaque), proving draw path.
- P2 (70%): Disabling the flag next will show one-time burst (~450ms) then `zoomToFit`.
- P3 (65%): No React unknown-prop warnings (adapter DOM spread removed).
- P4 (60%): ≥60 FPS at ~300 nodes (single draw call) during idle.
- P5 (55%): If any issue persists, it will be camera framing timing (needs follow-up `zoomToFit`).

**EVIDENCE CLASSIFIERS:**

- Visible pass: any screenshot/note stating "spheres visible" or mesh counts in console.
- Attribute flush error: lines matching `NodeAttributeManager` + `updateRange`/`offset`.
- Camera issue: nodes render but off-screen until zoom invoked; multiple `zoomToFit` calls.
- Build/route issues: legacy `@refinery/canvas-r3f` errors or 404 on `/harness/latent`.

**PROCEDURE:**

1. DOC-SYNC docs and verify ledger key.
2. Read RUNBOOK tail section (latest entry) and extract: server logs (first 10), browser console (first 10), observations, screenshots/notes.
3. Score P1–P5 as Hit/Miss/Unknown with one-sentence justification each; cite exact log lines when possible.
4. Classify state: {Visible-OK, Visible-Camera-Issue, Not-Visible-Attributes, Not-Visible-Other}. Produce a 3-item prioritized Next Actions list aligned to class.
5. Append `## Audit Findings (ISO-8601 timestamp)` to RUNBOOK containing: Observations, Prediction Scores, Root-Cause Hypothesis, Next Actions, Go/No-Go for proceeding to selection wiring today.
6. Append a docs-only ledger entry `KEY=S3-SMOKE-AUDIT-M3 SHA=docs-only` and push immediately.

**SUCCESS CRITERIA:**

- New "Audit Findings" section appended to RUNBOOK with scored predictions and prioritized actions.
- Ledger updated with `S3-SMOKE-AUDIT-M3` and pushed.
- A crisp Go/No-Go with the single highest-impact next step called out.

```bash
# DOC-SYNC (docs)
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14

# Inputs
RUNBOOK=@filepath
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

# Guard checks
[ -f "$RUNBOOK" ] || { echo "FATAL: RUNBOOK missing at $RUNBOOK"; exit 1; }
grep -q "KEY=S3-DEV-REDIRECT-M3" "$LEDGER" || { echo "WAIT: S3-DEV-REDIRECT-M3 missing"; exit 1; }

# (The agent will now read $RUNBOOK, perform the audit, and append an 'Audit Findings' section.)

# DOCPUB — record docs-only ledger entry for this audit
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf "[LEDGER] KEY=S3-SMOKE-AUDIT-M3 SHA=docs-only BRANCH=feat-pond-demo-aug14 DATE=%s MSG=\"Manual smoke visual audit appended\"\n" "$DATE_STR" >> "$LEDGER"

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$RUNBOOK" "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(smoke-audit): append M3 visual audit; ledger S3-SMOKE-AUDIT-M3"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

- How this addresses your request:
  - Echoes back the exact actions: read your smoke log, compare to predictions, classify outcome, publish findings, and ledger a docs-only entry.
  - Constrains scope to docs-only with guard blocks, aligning with your manual test workflow and preventing code churn near deadline.
  - Provides a complete, copy-pastable prompt with explicit inputs, classifiers, and success criteria.
  - Forces a crisp Go/No-Go and calls out the single highest-impact next step, keeping focus on delivering by 5 PM.

---

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

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
for KEY in S1-ATTRIBUTES-A1 S2-TIMELINE-FADE-A1 S3-HARNESS-SMOKE-A1 S3-DEV-REDIRECT-M3 S3-SMOKE-PING-M3; do
  grep -q "KEY=$KEY" "$LEDGER" || { echo "WAIT: $KEY missing"; exit 1; }
done

NOTE=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/working-doc.md
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
cat >> "$NOTE" << EOF

### M3 Status (${DATE_STR})
- Dev redirect active; harness route verified
- Core attributes + Interaction timeline fade present (S1/S2)
- Harness smoke runbook published; user ping recorded
EOF

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$NOTE"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(status): Milestone 3 ready — redirect + harness verified; user ping recorded"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

--

### [M3-VIS-1] Force-Visibility Triage — Adapter (Integration)

**ULTRATHINK MODE**
**CURRENT DATE/TIME:** 10:56 AM
**NAME:** THOMPSON-VIS
**BRANCH:** canvas-latent-integration
**TASK:** _Systematically_ audit, verify and, (if needed) correct your work. Force InstancedMesh visibility and frame the camera to prove the draw path. Temporarily bypass burst/alpha. Commit with clear message.
**REQUIREMENT:**

1. _EVERY_ claim in your scratchpad is false until explicitly verified.
2. Maintain a rigorous, falsifiable OODA loops for **each** subtask/claim.
3. Treat **every observation** as evidence that updates your probability mass over whether the end-state is satisfied.
4. When evidence and expectation differ, **always assume the gap is larger than it seems**, widen your investigation, and start a new falsifiable OODA loop.

**GUARD BLOCK:**

- DOC-SYNC docs; require `S3-DEV-REDIRECT-M3` present in ledger.
- Modify ONLY `packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx`.
- Keep changes minimal and reversible (guard with a local “FORCE_VISIBLE” flag).

```bash
# 1) DOC-SYNC
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S3-DEV-REDIRECT-M3" "$LEDGER" || { echo "WAIT: S3-DEV-REDIRECT-M3 missing"; exit 1; }

# 2) Apply minimal adapter edits (force visibility flag + forced positions + zoomToFit)
ADAPTER=/workspace/worktrees/canvas-latent-integration/packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx
node - <<'EOF'
const fs=require('fs');const p=process.argv[1];let s=fs.readFileSync(p,'utf8');
if(!s.includes('const FORCE_VISIBLE')){
  s=s.replace(
    "import { PositionCalculator } from '../utils/PositionCalculator';",
    "import { PositionCalculator } from '../utils/PositionCalculator';\nconst FORCE_VISIBLE = process.env.NEXT_PUBLIC_LATENT_TRACE === '1';"
  );
  s=s.replace(
    /const { mesh } = InstancedNodeMesh.build\(count\);[\s\S]*?meshRef\.current = mesh;/,
    (m)=>m+"\n      if (FORCE_VISIBLE) {\n        const positions=[];\n        for (let i=0;i<count;i++) {\n          const n=graphData.nodes[i];\n          const tx=(n.x ?? n.position?.x) ?? 0;\n          const ty=(n.y ?? n.position?.y) ?? 0;\n          const tz=(n.z ?? n.position?.z) ?? 0;\n          mgr.setPosition(n.id ?? String(i), new (require('three')).Vector3(tx,ty,tz));\n          mgr.setOpacity(n.id ?? String(i), 1);\n          positions.push(new (require('three')).Vector3(tx,ty,tz));\n        }\n        mgr.flush();\n        try { require('../core/InstancedNodeMesh').InstancedNodeMesh.zoomToFit(positions, three.camera, null, 1.2); } catch {}\n        try { mesh.material.transparent=false; } catch {}\n        burstDoneRef.current=true;\n      }\n"
  );
  fs.writeFileSync(p,s);
  console.log('patched');
} else { console.log('exists'); }
EOF
# 3) Commit and push
git -C /workspace/worktrees/canvas-latent-integration add /workspace/worktrees/canvas-latent-integration/packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx
git -C /workspace/worktrees/canvas-latent-integration commit -m "vis(debug): force visibility & zoomToFit when NEXT_PUBLIC_LATENT_TRACE=1; bypass alpha/burst for proof"
git -C /workspace/worktrees/canvas-latent-integration push origin canvas-latent-integration
```

--

### [M3-VIS-2] Audit & Investigate: Latest Manual Visual Confirmation Smoke

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 11:50 AM EST, 14-08-2025
**NAME:** ENGELBART-VIS (Code + Docs Auditor)  
**BRANCH:** feat-pond-demo-aug14  
**TASK:** Read the latest manual smoke screen test results (user-documented), compare against the predictions below, cross-reference with codebase, investigate classify outcome, extract error signatures, and publish a concise "Audit Findings" section with prioritized next steps. Record a docs-only ledger entry.

**GUARD BLOCK:**

- DOC-SYNC central docs fast-forward only; require `KEY=S3-DEV-REDIRECT-M3` to ensure harness baseline is valid.
- Inputs are docs + READ-ONLY codebase cross-reference; strictly no code edits, staging, or commits (only append to RUNBOOK/LEDGER).
- Require the runbook file to exist; STOP with a clear message if missing.
- Idempotent writes: append a new audit section each run, do not rewrite prior content.

**INPUTS:**

- RUNBOOK: `@worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/14-08-2025-#visual-confirmation-baseline.md`
- LEDGER: `@/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md`
- THOMPSON-VIS SCRATCHPAD: `worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/scratchpads/THOMPSON-VIS-01-scratchpad.md`
- SCREENSHOT: `@worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/browser-screenshot-14-08-2025-#visual-confirmation-baseline.png`

**PREDICTIONS (to score hit/miss):**

- P1 (80%): With `NEXT_PUBLIC_LATENT_TRACE=1`, spheres render immediately (opaque), proving draw path.
- P2 (70%): Disabling the flag next will show one-time burst (~450ms) then `zoomToFit`.
- P3 (65%): No React unknown-prop warnings (adapter DOM spread removed).
- P4 (60%): ≥60 FPS at ~300 nodes (single draw call) during idle.
- P5 (55%): If any issue persists, it will be camera framing timing (needs follow-up `zoomToFit`).

**EVIDENCE CLASSIFIERS:**

- Source evidence: cite relevant filepath:line-range excerpts that support the classification.
- Visible pass: any screenshot/note stating "spheres visible" or mesh counts in console.
- Attribute flush error: lines matching `NodeAttributeManager` + `updateRange`/`offset`.
- Camera issue: nodes render but off-screen until zoom invoked; multiple `zoomToFit` calls.
- Build/route issues: legacy `@refinery/canvas-r3f` errors or 404 on `/harness/latent`.

**PROCEDURE:**

1. DOC-SYNC docs and verify ledger key.

2) Read RUNBOOK tail (latest entry) and extract: server logs (first 10), browser console (first 10), observations, screenshots/notes; THEN cross-reference code (READ-ONLY) in:
   - packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx
   - packages/canvas-latent/src/core/NodeAttributeManager.ts
   - packages/canvas-latent/src/core/InstancedNodeMesh.ts
     Look for: 'aOpacity' attribute creation/usage, 'instanceColor', 'updateRange' and 'flush(', and any guards around mesh/geometry attributes. Quote small code excerpts with filepath:line ranges in findings.

3. Score P1–P5 as Hit/Miss/Unknown with one-sentence justification each; cite exact log lines when possible.
4. Classify state: {Visible-OK, Visible-Camera-Issue, Not-Visible-Attributes, Not-Visible-Other}. Produce a 3-item prioritized Next Actions list aligned to class.
5. Append `## Audit Findings (ISO-8601 timestamp)` to RUNBOOK containing: Observations, Prediction Scores, Root-Cause Hypothesis, Next Actions, Go/No-Go for proceeding to selection wiring today.
6. Append a docs-only ledger entry `KEY=S3-SMOKE-AUDIT-M3 SHA=docs-only` and push immediately.

**SUCCESS CRITERIA:**

- New "Audit Findings" section appended to RUNBOOK with scored predictions and prioritized actions.
- Ledger updated with `S3-SMOKE-AUDIT-M3` and pushed.
- A crisp Go/No-Go with the single highest-impact next step called out.

```bash
# DOC-SYNC (docs)
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14

# Inputs
RUNBOOK=@filepath
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

# Guard checks
[ -f "$RUNBOOK" ] || { echo "FATAL: RUNBOOK missing at $RUNBOOK"; exit 1; }
grep -q "KEY=S3-DEV-REDIRECT-M3" "$LEDGER" || { echo "WAIT: S3-DEV-REDIRECT-M3 missing"; exit 1; }

# (The agent will now read $RUNBOOK, perform the audit, and append an 'Audit Findings' section.)

# DOCPUB — record docs-only ledger entry for this audit
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
printf "[LEDGER] KEY=S3-SMOKE-AUDIT-M3 SHA=docs-only BRANCH=feat-pond-demo-aug14 DATE=%s MSG=\"Manual smoke visual audit appended\"\n" "$DATE_STR" >> "$LEDGER"

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$RUNBOOK" "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(smoke-audit): append M3 visual audit; ledger S3-SMOKE-AUDIT-M3"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

--

## Self-Validation Checklist

- [ ] Every implementation has DOC-SYNC then CODE-SYNC prompts before it
- [ ] Every sync prompt has exact git commands
- [ ] SHA writes trigger immediate doc pushes
- [ ] No work starts without both syncs

- S1 (Core): M3-S1-DOC → M3-S1-CODE → M3-S1-IMPL → M3-S1-DOCPUB
- S2 (Animation): M3-S2-DOC → M3-S2-CODE → M3-S2-IMPL → M3-S2-DOCPUB
- S3 (Integration): M3-S3-DOC → M3-S3-CODE → M3-S3-IMPL → M3-S3-DOCPUB → M3-SMOKE-PING

```

```

---

### [M3-S1-COLOR-DOC] - Stream 1 (Core) - DOC-SYNC (Color Pipeline)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** NOW  
**NAME:** KERNIGHAN-COLOR-DOC (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** DOC-SYNC central docs before fixing the `instanceColor` shader pipeline so node colors are visible on first paint.

**GUARD BLOCK:**

- Pull docs fast-forward only; no local doc diffs permitted.
- Require `KEY=A1-INTEGRATION-TYPES` in ledger (baseline types).
- Do not modify code during DOC-SYNC.

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
[ -f "$LEDGER" ] || { echo "FATAL: ledger missing"; exit 1; }
grep -q "KEY=A1-INTEGRATION-TYPES" "$LEDGER" || { echo "FATAL: A1 baseline missing"; exit 1; }
```

---

### [M3-S1-COLOR-CODE] - Stream 1 (Core) - CODE-SYNC (Color Pipeline)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 1:28 PM EST, 16-08-2025  
**NAME:** KERNIGHAN-COLORCODE (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Read A1 baseline SHA from ledger and cherry-pick if not ancestor. Prepare to implement color pipeline fix.

**GUARD BLOCK:**

- Correct branch; clean working tree.
- Idempotent: skip if already ancestor.

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
A1_SHA=$(grep "KEY=A1-INTEGRATION-TYPES" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')

git -C /workspace/worktrees/canvas-latent-core rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-core$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-core status --porcelain | grep . && { echo "Dirty working tree"; exit 1; }
git -C /workspace/worktrees/canvas-latent-core fetch origin
git -C /workspace/worktrees/canvas-latent-core merge-base --is-ancestor "$A1_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-core cherry-pick -x "$A1_SHA"
```

---

### [M3-S1-COLOR-IMPL] - Stream 1 (Core) - IMPLEMENTATION (Color Pipeline)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** NOW  
**NAME:** KERNIGHAN-COLORIMPL (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Ensure per-instance colors render on first paint. Wire `instanceColor` buffer, enable vertex colors, eliminate base tinting, and guarantee an initial flush path.

**CONTEXT:** InstancedMesh should display colors written via `NodeAttributeManager.setColor()`. Material must read instance colors; geometry must expose `instanceColor` attribute; `flush()` must mark `instanceColor.needsUpdate=true` at least once before first frame.

**GUARD BLOCK:**

- Edit only Stream 1 files:  
  `packages/canvas-latent/src/core/InstancedNodeMesh.ts`,  
  `packages/canvas-latent/src/core/NodeAttributeManager.ts`.
- Preserve single draw call; no per-frame allocations.
- Keep `aOpacity` hook intact.

**CHANGES TO MAKE:**

- In `InstancedNodeMesh.build(count)`:
  - Create `instanceColor` buffer: `geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(new Float32Array(count*3), 3))` (if not already present).
  - Ensure `material.vertexColors = true` and `material.color.set(0xffffff)` (no base tint).
  - Keep `transparent=false` for visibility until fade is enabled.
  - Ensure `geometry.computeBoundingSphere()` is called once.
- In `NodeAttributeManager.setMesh(mesh)`:
  - If `mesh.instanceColor` or `geometry.getAttribute('instanceColor')` missing, create the attribute and attach; set `usage=DynamicDrawUsage` and initialize `updateRange={offset:0,count:-1}`.
  - On first registration pass, perform a one-time `needsUpdate=true` fallback for `instanceMatrix`, `instanceColor`, and `aOpacity` to guarantee first paint.
- In `flush()`:
  - If any target attribute lacks `updateRange`, set `needsUpdate=true` (full update) and continue (no throws).

**SUCCESS CRITERIA:**

- Fresh boot shows nodes with non-black colors on first paint.
- No console errors; single draw call confirmed.
- Subsequent color changes via manager appear within one frame.

```bash
git -C /workspace/worktrees/canvas-latent-core status --porcelain | cat
git -C /workspace/worktrees/canvas-latent-core add packages/canvas-latent/src/core/InstancedNodeMesh.ts packages/canvas-latent/src/core/NodeAttributeManager.ts
git -C /workspace/worktrees/canvas-latent-core commit -m "core(color): ensure instanceColor buffer + vertexColors; eliminate base tint; first-paint needsUpdate fallback; boundingSphere once"
git -C /workspace/worktrees/canvas-latent-core push origin canvas-latent-core
```

---

### [M3-S1-COLOR-DOCPUB] - Stream 1 (Core) - DOC-PUBLISH (Color Pipeline)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 1:40 PM EST, 16-08-2025
**NAME:** KERNIGHAN-COLOR-DOCPUB (Stream 1)  
**BRANCH:** canvas-latent-core  
**TASK:** Append latest color-pipeline commit to ledger as `KEY=S1-COLOR-PIPE-M3` and push docs.

**GUARD BLOCK:** Pull docs; append one well-formed line; push immediately.

```bash
CORE_SHA=$(git -C /workspace/worktrees/canvas-latent-core rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S1-COLOR-PIPE-M3 SHA=%s BRANCH=canvas-latent-core DATE=%s MSG=\"InstanceColor pipeline visible on first paint\"\n" "$CORE_SHA" "$DATE_STR" >> "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S1-COLOR-PIPE-M3 $CORE_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

---

### [M3-S3-SEL-DOC] - Stream 3 (Integration) - DOC-SYNC (Selection)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 1:45 PM EST, 16-08-2025
**NAME:** THOMPSON-SEL-DOC (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** DOC-SYNC central docs and require `S1-COLOR-PIPE-M3` before integrating selection.

**GUARD BLOCK:** Pull docs; require color-pipeline key present.

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 fetch origin
git -C /workspace/worktrees/feat-pond-demo-aug14 checkout feat-pond-demo-aug14
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S1-COLOR-PIPE-M3" "$LEDGER" || { echo "WAIT: S1-COLOR-PIPE-M3 missing"; exit 1; }
```

---

### [M3-S3-SEL-CODE] - Stream 3 (Integration) - CODE-SYNC (Selection)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 1:52 PM EST, 16-08-2025
**NAME:** THOMPSON-SEL-CODE (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Cherry-pick `S1-COLOR-PIPE-M3` commit from core onto integration.

**GUARD BLOCK:** Correct branch; clean working tree; idempotent merge-base guard.

```bash
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
S1C_SHA=$(grep "KEY=S1-COLOR-PIPE-M3" "$LEDGER" | tail -n1 | sed -E 's/.*SHA=([a-f0-9]{7,40}).*/\1/')

git -C /workspace/worktrees/canvas-latent-integration rev-parse --abbrev-ref HEAD | grep -E '^canvas-latent-integration$' || { echo "Wrong branch"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration status --porcelain | grep . && { echo "Dirty working tree"; exit 1; }
git -C /workspace/worktrees/canvas-latent-integration fetch origin
git -C /workspace/worktrees/canvas-latent-integration merge-base --is-ancestor "$S1C_SHA" HEAD || git -C /workspace/worktrees/canvas-latent-integration cherry-pick -x "$S1C_SHA"
```

---

### [M3-S3-SEL-IMPL] - Stream 3 (Integration) - IMPLEMENTATION (Selection)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** NOW  
**NAME:** THOMPSON-SEL (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Implement click-to-select (color-only) on InstancedMesh with background-clear. Hit-test reliability: `mesh.updateMatrixWorld(true)` before raycast; ensure `computeBoundingSphere()` is called on build.

**FILES:** `packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx`

**GUARD BLOCK:**

- Keep changes surgical; no edits to Stream 1/2 files.
- Use `NodeAttributeManager.setColor()` + single `mgr.flush()` per frame.
- Selection color: orange `0xffa500`; base color from nodeColor() or default.

**SUCCESS CRITERIA:**

- Click highlights instantly (≤1 frame); background click restores base color.
- Camera stable; no console errors.

```bash
git -C /workspace/worktrees/canvas-latent-integration status --porcelain | cat
git -C /workspace/worktrees/canvas-latent-integration add packages/canvas-latent/src/adapters/CanvasLatentAdapter.tsx
git -C /workspace/worktrees/canvas-latent-integration commit -m "interact(select): reliable instanced raycast + orange highlight; background clear; frame-coalesced flush"
git -C /workspace/worktrees/canvas-latent-integration push origin canvas-latent-integration
```

---

### [M3-S3-SEL-DOCPUB] - Stream 3 (Integration) - DOC-PUBLISH (Selection)

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 2:01 PM EST, 16-08-2025
**NAME:** THOMPSON-SEL-DOCPUB (Stream 3)  
**BRANCH:** canvas-latent-integration  
**TASK:** Append latest selection commit to ledger as `KEY=S3-SELECTION-M3` and push docs.

```bash
INTEG_SHA=$(git -C /workspace/worktrees/canvas-latent-integration rev-parse HEAD)
DATE_STR=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md

git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
[ -f "$LEDGER" ] || printf "# SHA Ledger\n\n" > "$LEDGER"
printf "[LEDGER] KEY=S3-SELECTION-M3 SHA=%s BRANCH=canvas-latent-integration DATE=%s MSG=\"Click-to-select (orange) + background-clear\"\n" "$INTEG_SHA" "$DATE_STR" >> "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 add "$LEDGER"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(sha-ledger): record S3-SELECTION-M3 $INTEG_SHA"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

---

### [M3-SMOKE-COLOR] - Docs - Smoke: Color Visible on First Paint

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** 2:05 PM EST, 16-08-2025
**NAME:** ENGELBART-COLOR (Docs)  
**BRANCH:** feat-pond-demo-aug14  
**TASK:** Publish and run a quick smoke to confirm colors render immediately.

**GUARD BLOCK:** Require `KEY=S1-COLOR-PIPE-M3` present.

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S1-COLOR-PIPE-M3" "$LEDGER" || { echo "WAIT: S1-COLOR-PIPE-M3 missing"; exit 1; }

RUNBOOK=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/16-08-2025-#color-first-paint.md
cat > "$RUNBOOK" << 'EOF'
# Smoke: Color Visible on First Paint

## Steps
1) From integration worktree, start dev: `NEXT_PUBLIC_DEBUG_GRAPH=1 NEXT_PUBLIC_LATENT_TRACE=1 pnpm -C /workspace/worktrees/canvas-latent-integration -w dlx turbo run dev --filter=cryptic-vault-demo`
2) Open the printed URL → /harness/latent
3) Verify: nodes are colored (not black), no console errors.

## Observations
- Paste first 10 console lines; note color state.
EOF

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$RUNBOOK"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(smoke): Color visible on first paint (M3)"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```

---

### [M3-SMOKE-SELECT] - Docs - Smoke: Click-to-Select

**Prompt:**

**ULTRATHINK MODE**  
**CURRENT DATE/TIME:** NOW  
**NAME:** ENGELBART-SELECT (Docs)  
**BRANCH:** feat-pond-demo-aug14  
**TASK:** Publish and run a smoke for click-to-select highlighting.

**GUARD BLOCK:** Require `KEY=S3-SELECTION-M3` present.

```bash
git -C /workspace/worktrees/feat-pond-demo-aug14 pull --ff-only origin feat-pond-demo-aug14
LEDGER=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/guides/sha-ledger.md
grep -q "KEY=S3-SELECTION-M3" "$LEDGER" || { echo "WAIT: S3-SELECTION-M3 missing"; exit 1; }

RUNBOOK=/workspace/worktrees/feat-pond-demo-aug14/docs/pond-demo-aug14/smoke-screen-tests/16-08-2025-#select-click-highlight.md
cat > "$RUNBOOK" << 'EOF'
# Smoke: Click-to-Select (Highlight)

## Steps
1) With server running at /harness/latent, click any node → expect orange highlight within one frame.
2) Click background → selection clears; node restores base color.
3) Confirm camera stable; no new console errors.

## Observations
- Paste first 10 console lines; note selection behavior.
EOF

git -C /workspace/worktrees/feat-pond-demo-aug14 add "$RUNBOOK"
git -C /workspace/worktrees/feat-pond-demo-aug14 commit -m "docs(smoke): Click-to-select highlight (M3)"
git -C /workspace/worktrees/feat-pond-demo-aug14 push origin feat-pond-demo-aug14
```
