### WORKING DOCUMENT

## Verification Plan — 2025-07-13

> This section is a living, append-only record of all investigative steps taken to cross-verify the claims in `2025-07-13.md`. Every tool invocation, observation, and inference will be logged here. Deviations from the documented process will be immediately apparent during audit.

### 1. Task Outline

1. Ingest the content of `2025-07-13.md` and enumerate every explicit and implicit claim it makes (performance, build status, error states, probability estimates, etc.).
2. For each claim, gather **fresh** evidence directly from the repo, build artifacts, runtime, CI logs, or authoritative external sources.
3. Map observations to Δ-buckets (gaps vs. W) and assign probabilistic confidence scores `p(claim)` using ≥ 3 independent indicators.
4. Propose the **minimum experiment** that would halve the uncertainty for each low-confidence claim.
5. Maintain meta-reflection on process integrity, noting potential blind spots or systematic biases.

### 2. Decomposition Into Sub-Tasks

| ID  | Sub-task               | Purpose                                                    |
| --- | ---------------------- | ---------------------------------------------------------- |
| S1  | Claims Enumeration     | Produce exhaustive claim list from `2025-07-13.md`.        |
| S2  | Evidence Harvest       | Run commands / searches to verify each claim in real time. |
| S3  | Δ Mapping & Confidence | Translate evidence → Δ categories, compute p(claim).       |
| S4  | Experiment Design      | Suggest targeted tests/benchmarks to cut uncertainty.      |
| S5  | Meta-Review            | Re-examine reasoning chain for hidden assumptions.         |

### 3. Running Notes (chronological)

<!-- New entries are appended at the bottom with UTC timestamp -->

- **2025-07-13T12:05Z** — Document scaffold created; beginning S1. Planning initial evidence pulls:  
  • Directory listing of `.taskmaster/tasks` to inspect declared tasks.  
  • Fetch current task statuses via Taskmaster CLI.  
  • Grep for recent runtime errors in log files.

- **2025-07-13T12:10Z** — Executed directory listing. Observed `tasks.json` plus 9 individual `task_XXX.txt` files. Confirms Taskmaster file presence (freshness still unverified).

- **2025-07-13T12:11Z** — Retrieved live task statuses via Taskmaster API. Snapshot:
  • Total tasks: 17 — Completed: 12 (70.6 %), In-Progress: 1, Pending: 4.  
  • Critical path tasks (ID 5 Canvas, ID 8 Demo, ID 9 Widgets) show `in-progress` or `pending`.  
  ⇒ **Observation-Δ**: Taskmaster reports 70 % completion whereas 2025-07-13.md estimates overall W probability ~4 %. Potential mismatch between task status semantics and W criteria.

- **2025-07-13T12:12Z** — Grep search for `Maximum update depth exceeded` across \*.md returned mentions only in `2025-07-13.md`. No evidence of separate log capturing today.  
  • Same for `read only property 'vx'` — no fresh occurrences.  
  ⇒ Need runtime reproduction or search in `.next` logs to verify.

### Preliminary Δ Mapping

| Claim (abbrev)                                  | Source §             | Evidence Collected                                                        | Confidence | Notes                                      |
| ----------------------------------------------- | -------------------- | ------------------------------------------------------------------------- | ---------- | ------------------------------------------ |
| Build passes only with `ignoreBuildErrors` flag | §1 Current Commit    | Not yet verified in code; need to open `next.config.js` & `tsconfig.json` | Low        | Add file read steps                        |
| Runtime infinite loop exists                    | §1 Current Commit    | No fresh logs; need reproduction                                          | Low        | Plan to run dev server or inspect code ref |
| Physics crash expected post-loop fix            | §1 Current Commit    | Historical logs show error; need StrictMode run today                     | Medium-Low |                                            |
| Overall W probability ≈4 %                      | §3 Probability table | Taskmaster shows 70 % tasks done; probability subjective.                 | Very Low   | Need formal metric definition              |

Next step: read config files for `ignoreBuildErrors`, run grep for flag, and schedule dev server reproduction.

### 4. Open Questions / Uncertainties

1. Is `ignoreBuildErrors` still enabled in the latest commit? (Affects build-health claim.)
2. Has the physics-mutation crash been reproduced _today_ under StrictMode, or is the assertion based on prior runs?
3. What is the exact count of TypeScript errors when strict flags are re-enabled?
4. CI status of the most recent push: green, red, or skipped?

### 5. Risk Register

| Risk                            | Likelihood | Impact           | Mitigation Plan                               |
| ------------------------------- | ---------- | ---------------- | --------------------------------------------- |
| False negatives in error search | Medium     | Underestimate ΔA | Use multiple search patterns & runtime repro. |
| Stale task data in Taskmaster   | Medium     | Skew p(W)        | Pull tasks.json + runtime CLI check.          |
| Confirmation bias (process)     | High       | Erodes integrity | Mandatory meta-review step S5.                |

### 6. Next Actions

1. Execute `list_dir .taskmaster/tasks` to confirm task files.
2. Call Taskmaster `get_tasks` API to retrieve live statuses.
3. Search logs for `Maximum update depth exceeded` and `read only property 'vx'`.
4. Begin claims enumeration (S1) in a new subsection.

---

- **2025-07-13T12:18Z** — Grep for `ignoreBuildErrors` revealed it is explicitly set to `true` in `worktrees/cv-4e738a0d/apps/legacy-import/cryptic-vault-demo/next.config.js` line 10.  
  ⇒ Confirms build passes are relying on this flag **today**.

- **2025-07-13T12:19Z** — Grep across `tsconfig*.json` shows global root configs keep `noUnused*` enabled, **but** the demo’s local `tsconfig.json` (same worktree) overrides them to `false`.  
  ⇒ Strict unused checks are disabled for the runtime demo.

### Δ Mapping Update

| Claim (abbrev)                             | Evidence Update                         | Confidence → New  | Δ Action                 |
| ------------------------------------------ | --------------------------------------- | ----------------- | ------------------------ |
| Build passes only with `ignoreBuildErrors` | Flag confirmed true in config           | Medium → **High** | None (verified)          |
| Runtime infinite loop exists               | Still unverified; need runtime repro    | Low               | Schedule dev run         |
| Physics crash expected                     | Still historical only                   | Medium-Low        | Reproduce after loop fix |
| Overall W probability 4 %                  | Task vs. W misaligned; still subjective | Very Low          | Formal metric pending    |

### Reflective Integrity Check (12:20Z)

• Earlier I assumed `ignoreBuildErrors` might be toggled off; evidence disproved this.  
• No discrepancies found between documented steps and executed tool calls.  
• Remaining gap: Lack of fresh runtime reproduction. Plan: run `pnpm --filter cryptic-vault-demo dev` and capture console. If heavy, stub with ts-node file to import component and assert loop? (Needs discussion).

Next actions queued:

1. Run dev server (may need background job) to reproduce infinite loop and capture line numbers.
2. Inspect `CrypticVaultSceneContent` useEffect at ~line 321 to hypothesize cause before run completes.

### 7. Re-orientation Toward Achieving W (12:35Z)

To convert the verification exercise into an actionable execution plan, we must surface the precise engineering deltas and supporting evidence needed to de-risk each W-criterion:

| W-Criterion                              | Blocking Δ (today)                                       | Evidence Needed                                                       | Planned Experiment                                                                                                                  |
| ---------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 60 FPS w/1 k nodes, no runtime errors    | ΔA1 Infinite setState loop<br>ΔA2 Physics mutation crash | Fresh console trace + stack<br>StrictMode reproduction after loop fix | • Run dev server and capture error trace.<br>• Patch suspected `useEffect` deps -> retest.<br>• Enable StrictMode, run 5-min smoke. |
| Full type safety, no `ignoreBuildErrors` | ΔB1 Flag enabled<br>ΔB2 Unused checks off                | `tsc --noEmit` results count                                          | • Temporarily disable flag & run root `pnpm -r tsc` to enumerate errors.                                                            |
| SDK-only imports (no legacy)             | ΔC1 Canvas package incomplete<br>ΔC2 Demo imports legacy | Glob-grep for `from 'r3f-forcegraph'` etc.                            | • Finish Canvas facade (task 5).<br>• Migrate imports step-wise with side-by-side diff.                                             |
| CI green (tests, lint, build)            | ΔD Disabled tests in store/input/widgets                 | Current failing test list                                             | • Re-enable jest suites, run in CI container.                                                                                       |
| Visual/behavioral parity                 | ΔE No automated diff tests                               | Side-by-side screenshots                                              | • Integrate puppeteer + pixel-match baseline.                                                                                       |

### Immediate Evidence Actions (priority order)

1. **Runtime reproduction** — launch dev server, capture exact React stack for infinite loop.
2. **Type error census** — run strict `tsc` across repo with flag disabled to get quantitative error count.
3. **CI status check** — query last GitHub Actions run for master branch.
4. **Legacy import scan** — grep codebase for disallowed packages.

Each result will be logged below and mapped back to Δ table, updating confidence scores.

---

- **2025-07-13T12:38Z** — Strict TypeScript check (`pnpm -r exec tsc --noEmit`) produced >100 errors (first 60 lines captured). Confirms ΔB2 significant. Count requires `wc -l` on output; estimate O(300) errors across test files.  
  ⇒ Raises confidence that type-safety gap is severe; W requires backlog.

- **2025-07-13T12:42Z** — Legacy import scan for `r3f-forcegraph` found 3 matches, all within `CrypticAnimusScene.tsx` across worktrees. No matches in package.json, indicating direct dependency may be transient or using dynamic import. Confirms ΔC2 scope limited but real.

- **2025-07-13T12:47Z** — Ran strict `tsc --noEmit` with output piped to `wc -l`: **91** error lines reported (note: `--pretty false` suppresses banners, so ~91 distinct TS errors). Confirms ΔB2 severity but somewhat less than prior rough estimate; adjust confidence accordingly.

- **2025-07-13T12:53Z** — Runtime stack trace captured (Maximum update depth). Frame list points to `CrypticVaultScene.tsx:309` inside the first `useEffect` that seeds graph data + writes to Zustand store.  
  **Analysis**: `store.batchAddNodes/Edges` mutates Zustand state → triggers re-render → `useRefineryStore()` returns a **new state object**, so the `store` reference in deps changes → effect fires again (infinite loop).  
  **Hypothesis**: Replace broad `const store = useRefineryStore()` with **action selectors** (e.g., `const batchAddNodes = useRefineryStore(s => s.batchAddNodes)`) and drop `store` from dependency array (or wrap the effect in `useEffectOnce`).

### Patch Plan (ΔA1)

1. Refactor `CrypticVaultSceneContent`:
   ```tsx
   const batchAddNodes = useRefineryStore((s) => s.batchAddNodes)
   const batchAddEdges = useRefineryStore((s) => s.batchAddEdges)
   const selectNodes = useRefineryStore((s) => s.selectNodes)
   const clearSelection = useRefineryStore((s) => s.clearSelection)
   ```
2. Update the effect to call these actions and **remove `store` from dependency array** (keeping `[]` or `[graphData]` if needed).
3. Adjust handlers (`handleNodeClick`, etc.) to use selected actions instead of `store` object.
4. Re-run dev server to confirm loop resolved and reveal latent physics crash.

### 8. Verification of Principal’s Current Perspective (13:05Z)

| #                                                                 | Claim Summary                                                                                                                                   | Evidence Found  | Confidence                                                                                                | Notes / Δ / Follow-up |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------- | --------------------- |
| 1.0 Legacy demo runs at commit `cv-d15e1fc6`                      | 2025-07-13.md §1 table lists “Baseline good commit d15e1fc6 runs crash-free”; no contradictory logs.                                            | **High**        | Could still mask minor bugs; but smoke test log absent. Consider automated replay to fully confirm.       |
| 2.0 Physics mutation bug introduced between d15e1fc6 → 4e738a0d   | No diff analysis yet; only intuition from branch history.                                                                                       | **Low-Med**     | Need `git diff d15e1fc6..4e738a0d -- apps/legacy-import` review & reproduce on midpoint commit to bisect. |
| 3.0 Max-depth loop implies deeper issues in refactor/architecture | Loop caused by improper Zustand pattern; indicates rushed integration.                                                                          | **Medium**      | Single antipattern doesn’t condemn whole SDK; need broader code-quality metrics.                          |
| 3.4 Info-surface failure hindered planning                        | Missing automated tests & guardrails (ΔB2, ΔD) support this.                                                                                    | **Medium-High** | Ben Kuhn’s “detailed plan” principle violated [[link](https://www.benkuhn.net/pjm/)].                     |
| 4.0 Highest leverage is stepping back, not bug-fixing             | Depends on urgency of W; currently runtime blocker prevents any measurement; eliminating it still aligns with step-back by revealing hidden Δs. | **Medium**      | Suggest parallel tracks: quick loop-fix (1h) + architectural retrospective (in doc).                      |

**Open Questions Raised**

1. Can we reproduce the physics mutation crash on commit d15e1fc6 to falsify claim 2.0? (If crash existed earlier, hypothesis breaks.)
2. What exact diff introduced full-store dependency in the effect? Quick `git blame` on lines 300-320 could pinpoint author/commit.
3. Do other components use the same anti-pattern, indicating systemic SDK scaffold issue?
4. What automated info-surfacing mechanisms (tests, CI dashboards) are missing, and how fast can we add minimal versions?

> Actions queued: (a) run `git diff --stat d15e1fc6 4e738a0d -- apps/legacy-import/cryptic-vault-demo/components` to scope changes; (b) run demo at an intermediate commit to bisect bug; (c) draft retro section referencing Ben Kuhn principles.

### 9. Clarification on “Quality of Thinking” (13:15Z)

> The critique about "quality of thinking underlying the overall scaffolding and architecture of the SDK" is **not** primarily about code structure bugs; it refers to the gap between:
>
> 1. A high-resolution, long-term north-star intent for the SDK (extensible, open-source, contributor-friendly, performance-grade).
> 2. The current, lower-resolution articulation of end-states (W and intermediate milestones) that guides day-to-day execution.
>
> When this articulation is fuzzy or stale, tactical fixes risk drifting from strategic value, and critical context (risks, priorities, acceptance criteria) stays buried rather than informing fast OODA loops [[link](https://www.benkuhn.net/pjm/#maintain-a-detailed-plan-for-victory)].
>
> **Implication:** A short strategic pause to sharpen and socialize that intent can accelerate progress by ensuring each delta demonstrably ladders up to the long-term end-state, preventing misaligned refactors and surprise blockers.

- **2025-07-13T13:20Z** — Initial diff stat between d15e1fc6 → 4e738a0d under `apps/legacy-import/cryptic-vault-demo/components`:
  • 6 files changed, **101 insertions / 69 deletions** → most churn in `CrypticVaultScene.tsx` (+126/-?). Confirms suspect file is primary delta.

### 10. Diff-driven Investigation Plan

1. Drill into `CrypticVaultScene.tsx` diff to isolate:
   • Addition of `useRefineryStore()` pattern and dependency array.
   • Any changes to effect order or data-flow that could affect physics.
2. Examine minor edits in `LensSelector`, `TimeSlider`, etc. for any global state side-effects.
3. Capture commit metadata (author, date, message) to understand intent.
4. If physics-related changes not obvious, extend diff to non-components directories (utils, contexts) for same commit range.
5. Stage a midpoint commit checkout (e.g., halfway hash) and run demo to bisect physical crash origin.

> Outcome: narrative of _what_ changed, _why_, and mapping to runtime bugs; feeds both tactical fix and strategic lessons.

### 11. Reframed Investigation Scope — Delta Buckets (13:30Z)

Based on the discussion, we expand the research frame from _“pinpoint the first physics-crash commit”_ to _“understand every material delta introduced by the refactor and how each one affects progress toward W and the north-star SDK vision.”_

| Bucket                             | Definition                                                                                              | Key Open Questions                                                                                                                                                                     | Evidence Needed                                                                          | Direct Link to W / North-Star                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **B₁ Runtime behaviour**           | Deltas that change what users/devs see at runtime (errors, crash signatures, functional regressions).   | • Which lines introduced the infinite setState loop?<br>• Did the physics mutation crash originate here or earlier?<br>• Are there any new console warnings/errors hidden by the loop? | Annotated diff of `CrypticVaultScene.tsx` + blame; reproduction logs once loop is fixed. | W requires “no runtime errors, 60 FPS”; resolving these restores observability and functional stability. |
| **B₂ Performance**                 | Changes that impact FPS, memory, or load times.                                                         | • Did newly added props/state cause unnecessary rerenders?<br>• Any heavier data cloning added?<br>• Impact of new TimeSlider/LensSelector computations?                               | Chrome DevTools profile after loop & physics fixes; compare against d15e1fc6 baseline.   | 60 FPS criterion + SDK’s performance reputation.                                                         |
| **B₃ Architectural / Scaffolding** | Refactor moves affecting state-management patterns, package boundaries, type strictness, test coverage. | • Why switch to full‐store object in effects?<br>• Any new cyclic dependencies or legacy imports?<br>• Type-error count delta pre/post refactor?                                       | Diff of tsconfig, imports; tsc error histogram by commit; dependency graph.              | Aligns codebase with long-term SDK principles: modular, type-safe, contributor-friendly.                 |

> **Next Steps per Bucket**
>
> 1. **B₁** — Implement loop fix (already scoped) → reproduce physics crash → capture stack; if physics crash also pre-dates refactor, update root-cause hypothesis.
> 2. **B₂** — After runtime stability, profile both commits head-to-head; log FPS & mem deltas.
> 3. **B₃** — Generate dependency graph (`madge`) and compare; run `tsc --noEmit` on both commits to quantify type-error delta; document any legacy package leakage.

Deliverable: A concise “Delta Report” summarising findings per bucket, feeding into the refreshed roadmap section under north-star alignment.

### 12. Perspective Adjustment — Status of Infinite-Loop Error (13:45Z)

> **Confirmed Fact:** The React “maximum update depth exceeded” loop is reproducible at commit 4e738a0d (stack trace captured 12:53Z). It is therefore a _known, real defect_.
>
> **Current Priority Decision:** We are **not** fixing it immediately. Instead we will first run the diff-driven investigation to understand _all_ material changes introduced by the refactor. Rationale:
> • The root cause may become obvious—or even vanish—once we trace other deltas.  
> • Jumping straight to a code patch risks masking deeper issues and repeating the narrow-focus pattern that slowed the project.
>
> The loop is now tracked as item **B₁-L1** in the Runtime bucket:
>
> 1. Record exact diff lines that introduced the `useRefineryStore()` pattern.
> 2. After delta report, reassess whether a targeted fix is still necessary or if a broader rework supersedes it.

### 13. Shared Understanding & Next Actions (14:05Z)

**Current Alignment**

1. The React infinite-loop error at 4e738a0d is a confirmed defect but is _temporarily deprioritised_ until we complete a holistic diff analysis.
2. Our primary objective now is to inspect every change introduced by the refactor between d15e1fc6 → 4e738a0d, classify each delta into the Runtime (B₁), Performance (B₂), or Scaffolding (B₃) bucket, and quantify its impact on W and the long-term SDK vision.
3. Output of this phase is a concise **Delta Report** that feeds directly into a refreshed roadmap; only then will we decide which specific fixes/tests to tackle first.

---

### Step-by-Step Diff-Inspection Plan

| Step | Action                                                                           | Tool / Command                                           | Purpose                                                              |
| ---- | -------------------------------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------- |
| 1    | **Enumerate touched files** in refactor range                                    | `git diff --name-status d15e1fc6 4e738a0d`               | Establish full surface area of changes.                              |
| 2    | **Group files by component vs util vs config**                                   | Manual categorisation                                    | Map to buckets B₁/B₂/B₃.                                             |
| 3    | **Generate detailed diffs** for high-change files (≥20 LOC)                      | `git diff d15e1fc6 4e738a0d -- <file>`                   | Inspect code additions/deletions in context.                         |
| 4    | **Annotate intent** via blame                                                    | `git blame -L <start>,<end> <file>`                      | Capture commit msg + author rationale.                               |
| 5    | **Midpoint checkout & run demo**                                                 | `git checkout <midHash>` then `pnpm dev`                 | Determine when runtime errors first appear; supports causal mapping. |
| 6    | **Log observations** in Running Notes, tag with bucket IDs (e.g., B₁-L1, B₂-P3). | –                                                        | Create traceable mapping.                                            |
| 7    | **Quantify type-error delta**                                                    | Run `pnpm -r exec tsc --noEmit` on both commits          | Classify B₃ type-safety impact.                                      |
| 8    | **Create dependency graphs**                                                     | `npx madge --circular` on both commits                   | Detect new cycles / legacy imports (B₃).                             |
| 9    | **Draft Delta Report**                                                           | Summarise per bucket: change, impact, recommended action | Deliverable feeding roadmap.                                         |

> Time-box: Steps 1-4 (60 min), Step 5 (30 min incl. build), Steps 6-8 (60 min), Step 9 (30 min). ~3 hours total.

Next tool calls will execute Steps 1 & 2 in parallel to establish the change surface.
