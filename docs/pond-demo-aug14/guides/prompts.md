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
