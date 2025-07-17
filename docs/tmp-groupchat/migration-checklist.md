# Cryptiq Mindmap Migration Checklist

_Concrete, file‑level tasks derived from the legacy‑demo investigation (d15e1fc6 → 9a3c8181).  
Update the “Status” column (`TODO`, `IN‑PROGRESS`, `DONE`) via PRs._

| Legacy Element                                                                                                        | Files / Components                                                        | Action                                                                                | Rationale                                                            | Status |
| --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------ |
| **`r3f‑forcegraph` imports**                                                                                          | `CrypticAnimusScene.tsx` (only file using ForceGraph3D)                  | **STUB** with `CanvasAdapter` wrapper, then **REPLACE** with latent‑projection plugin | Unblocks compile; isolates canvas contract before new renderer lands | DONE   |
| **`@refinery/interaction` Context**                                                                                   | `packages/interaction/*`, consumer hooks in `CrypticVaultScene.tsx`       | **REPLACE** with `@refinery/store` slices (`batchAddNodes/Edges`)                     | Aligns state with SDK pattern, enables CRDT history                  | TODO   |
| Dead code ‑ `convertConceptsToIdeaNodes`, `conceptsJson`                                                              | `CrypticVaultScene.tsx`                                                   | **DELETE**                                                                            | Removes misleading, unused paths                                     | TODO   |
| Unused components (`MemoryNodes`, `ParticleCloud`, `EnergyRippleOverlay`)                                             | `/components/*`                                                           | **DELETE or ARCHIVE**                                                                 | Shrinks surface, speeds build                                        | TODO   |
| Write‑only / unset state (`timelineDate`, `mouseHoveredNodeId`, `dialState`, `searchResultNodeIds`, `gesturedNodeId`) | Reducer & props                                                           | **REMOVE or Wire Up** per feature decision                                            | Prevents ghost props & bundle bloat                                  | TODO   |
| Props mismatch (`showSecrets`, `activeTags`)                                                                          | `CrypticAnimusScene` interface                                            | **Align** interface with actual usage                                                 | Fixes type drift                                                     | TODO   |
| “Cache” refs (`nodeCache`, `linkCache`)                                                                               | `CrypticVaultScene.tsx`                                                   | **Refactor** or **Remove**                                                            | Clarify performance expectations                                     | TODO   |
| Hard‑coded viewMode (`nodes` only)                                                                                    | `CrypticVaultScene.tsx`                                                   | **Parameterise** via future lens API                                                  | Preps for multiple layouts                                           | TODO   |
| Force physics cooldown (`cooldownTime = Infinity`)                                                                    | `CrypticAnimusScene.tsx`                                                  | **REMOVE** when force‑graph stub is retired                                           | Eliminates dead physics code once new renderer is adopted            | TODO   |
| Duplicate newline‑named files                                                                                         | `/assets`, `/components`                                                  | **Delete / rename**                                                                   | FS hygiene before refactor                                           | TODO   |
| **`graph-forge` pipeline**                                                                                            | `/scripts/graph-forge.ts`, `docs/graph-forge.md`                          | **KEEP as private CLI**, revisit post‑launch                                          | Enables data‑to‑graph flow now; defers public API hardening          | TODO   |

---

### Item Explanations (working notes)

#### `r3f‑forcegraph` imports → STUB, then REPLACE

- **What it means** – We located three files (`CrypticAnimusScene.tsx`, `ClusterVisualization.tsx`, `BrainMeshView.tsx`) that import `r3f‑forcegraph` directly. The plan is to create a _CanvasAdapter_ wrapper that mimics the minimal `ForceGraph3D` API so the code compiles, then later swap this adapter for a new latent‑projection renderer.
- **Why it matters** – Stubbing first keeps the baseline build green while we design the new renderer; isolating the dependency behind one adapter ensures we can drop force‑graph or keep it as an optional plugin without touching other components.
- **Intent alignment** – This respects the goal of freezing the legacy demo for reference, removing hard dependency on force‑graph in the new demo, and keeping force‑graph available as an optional SDK lens.

#### `@refinery/interaction` Context → REPLACE with `@refinery/store` slices

- **What it means** – Legacy components still pull global state from an old context (`@refinery/interaction`). We will swap those imports for the newer `@refinery/store` hooks (`batchAddNodes`, `batchAddEdges`, selectors, etc.) so every part of the app reads and writes the same CRDT‑ready store.
- **Why it matters** – Using a single, typed store avoids duplicated state logic, prevents merge conflicts in future multi‑user edits, and aligns the demo with the SDK architecture other developers will consume.
- **Intent alignment** – This step supports your goal of malleability and safe AI/human co‑editing by consolidating all graph data into one canonical source, without yet changing any visual behaviour.

#### Dead code – `convertConceptsToIdeaNodes`, `conceptsJson` → DELETE

- **What it means** – These helpers and blobs were used in early experiments but are no longer imported by any live component; keeping them serves no purpose.
- **Why it matters** – Dead code bloats the bundle, confuses future contributors, and can mask outdated logic; removing it keeps the migration diff focused on active behaviour and reduces maintenance overhead.
- **Intent alignment** – Deleting unused artifacts supports your goal of a lean, clear codebase powered solely by SDK‑aligned logic, making later refactors and performance audits easier to reason about.

#### Unused components (`MemoryNodes`, `ParticleCloud`, `EnergyRippleOverlay`) → DELETE or ARCHIVE

- **What it means** – These React components exist in `/components/*` but are never imported by the running app; two were early visual experiments, one is a legacy particle effect mock.
- **Why it matters** – Orphaned components bloat the bundle, slow linting/type‑checks, and can mislead future contributors into reviving obsolete code; deleting or moving them to an `/archive` folder keeps the active surface area small and moves unused ideas out of the main path.
- **Intent alignment** – You want a lean codebase focused on SDK‑aligned visuals; removing or archiving these components supports clarity and faster builds while preserving their history in git if you ever need to reference them.

#### Write‑only / unset state (`timelineDate`, `mouseHoveredNodeId`, `dialState`, `searchResultNodeIds`, `gesturedNodeId`) → REMOVE or WIRE UP

- **What it means** – These state variables are declared and sometimes updated but never read, or they rely on UI paths that no longer fire; they currently have no effect on behaviour.
- **Why it matters** – Unused state inflates bundle size, clutters React DevTools, and risks stale references if re‑introduced later; removing them clarifies the true data surface, while wiring them up (if needed) forces proof of utility.
- **Intent alignment** – Aligns with your goal of a clean, deterministic codebase: only state that drives visible behaviour stays; everything else is either properly implemented or deleted to reduce cognitive load.

#### Props mismatch (`showSecrets`, `activeTags`) → ALIGN interface with actual usage

- **What it means** – The `CrypticAnimusScene` TypeScript interface declares `showSecrets` and `activeTags`, but the component never receives them or references differently named props internally; types and runtime behaviour are out of sync.
- **Why it matters** – Mismatched props generate type drift, mislead contributors, and risk runtime bugs if someone later passes the declared props; aligning the interface and call‑sites tightens type safety and clarifies the component’s real external API.
- **Intent alignment** – Supports the aim of a deterministic, SDK‑ready codebase by ensuring every prop in a public interface is genuinely consumed, making future refactors safer and documentation accurate.

#### “Cache” refs (`nodeCache`, `linkCache`) → REFACTOR or REMOVE

- **What it means** – `CrypticVaultScene.tsx` maintains two `useRef` objects that store previous `nodes` and `links`, but these caches are no longer referenced by any diffing logic, effectively serving no purpose or hiding stale data.
- **Why it matters** – Stale or inert caches can cause inconsistent renders, mislead performance profiling, and increase cognitive load for future contributors; deciding either to wire them into a proper memo/diff algorithm or delete them ensures a single, reliable data flow from the store to the renderer.
- **Intent alignment** – Aligns with your goal of a deterministic, SDK-driven render path: either implement a clear, documented caching strategy or remove unused optimisations to keep the performance story transparent.

#### Hard‑coded `viewMode` (`nodes` only) → PARAMETERISE via future lens API

- **What it means** – In `CrypticVaultScene.tsx`, the variable `viewMode` is fixed to `'nodes'`, preventing any other layout (timeline, latent cloud, etc.); the plan is to refactor it into a prop or store value controlled by the forthcoming Lens selector.
- **Why it matters** – A hard‑coded mode blocks runtime layout swaps, undermining malleability, and forces duplicate code for new views; parameterising it creates a single switch‑point for future lenses and keeps the component DRY.
- **Intent alignment** – Fulfils your goal of fluidly re‑composable layouts by exposing `viewMode` through a formal Lens mechanism, enabling type‑safe additions of new projections without touching the scene’s internal logic.

#### Force physics cooldown (`cooldownTime = Infinity`) → REMOVE when force‑graph stub is retired

- **What it means** – `CrypticAnimusScene.tsx` sets `cooldownTime = Infinity`, causing the force‑graph’s physics engine to run forever. Because the new Cryptiq Mindmap will drop the force‑graph entirely, we will remove this prop (and the physics engine) once the force‑graph adapter is deleted.
- **Why it matters** – Keeping an infinite physics loop after the new renderer lands would waste CPU and confuse future contributors; deleting it cleans the codebase and ensures deterministic node positions.
- **Intent alignment** – Matches your decision to exclude force‑graph from the final demo and to keep the SDK lean: physics code lives only in an optional plug‑in, not in the core scene.

#### Duplicate newline‑named files → DELETE / RENAME

- **What it means** – Some files in `/assets` and `/components` share the same base name but differ only by stray newline or whitespace characters, likely from copy‑pastes or IDE glitches; they contain duplicate or outdated content.
- **Why it matters** – Duplicate filenames can break case‑sensitive file systems, confuse import paths, and clutter version control with redundant assets; deleting or renaming them to a single canonical file prevents build issues and future merge conflicts.
- **Intent alignment** – Maintaining repository hygiene supports a deterministic build process and lowers cognitive overhead for future contributors, aligning with your goal of a lean, clean codebase before deeper SDK refactors proceed.

#### `graph-forge` pipeline → KEEP as private CLI, revisit post‑launch

- **What it means** – `graph-forge` is a CLI script plus notes that converts raw Cryptiq memory JSON into `{nodes, edges}`. We will keep it inside the repo for internal demo use only, without promoting it to a public SDK module yet.
- **Why it matters** – The CLI unblocks rapid iteration on data-to-graph enrichment for Cryptiq Mindmap without forcing premature API design; polishing it now would split focus and add maintenance overhead before the SDK core is stable.
- **Intent alignment** – Matches the decision to ship fast by minimising public surface area: we gather real‑world usage data first, then decide whether to evolve `graph-forge` into the first Playground module after launch.
