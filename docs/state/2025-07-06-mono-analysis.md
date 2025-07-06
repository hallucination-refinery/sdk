# `refinery-mono` Analysis (2025-07-06)

This document synthesizes findings from the `refinery-mono` artifact bundle to inform the integration and refactoring of `refinery-sdk`.

---

## 1. Environment & Metadata

- **Versions**: The mono uses Node v22, pnpm v9.6, TypeScript v5.5.4, and Three.js v0.168.0. These are close enough to our stack to avoid major friction.
- **Branching**: The repo has a high number of stale-looking `codex/` and `feature/` branches, with `main` serving as the integration point.
- **Commit HEAD**: `6372b63f`

---

## 2. Package Inventory & Build Status

- **Systemic Failures**: The entire monorepo is in a **red build state**. The primary cause is a misconfigured TypeScript project reference setup (`"rootDir"` and path aliasing issues), leading to `TS6059` errors across most packages. All three demo apps also fail to build due to a cascade of linting errors and type issues.
- **Test Coverage**: Effectively zero. Most packages either have no test script or a failing one (e.g., Jest ESM transform errors).
- **Conclusion**: The repo is not in a stable state. We cannot rely on its build or test configurations and must treat its packages as code sources to be integrated into our known-good CI setup.

### Key Package Overlaps & Actions

| `refinery-mono` Package                                         | Our Equivalent                      | Status & Key Differences                                                                                                                                                                                       | Action Plan                                                                                                                                                         |
| --------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@refinery/ideanode`                                            | `@refinery/schema`                  | **High Conflict**. `ideanode` is a mix of schema, placeholder data, and utility functions. Its `IdeaNode` type is significantly different, including `state`, `meta`, and more fields than our current schema. | **Adopt & Merge**. The `ideanode` schema is richer. We will migrate our schema to match its structure, bringing in the extra fields.                                |
| `@refinery/graph-store`                                         | `@refinery/store`                   | Builds successfully but has no tests. Likely a basic Zustand store.                                                                                                                                            | **Integrate**. Review its structure and merge any useful slices/actions into our existing store.                                                                    |
| `@refinery/interaction`                                         | `@refinery/store`                   | Build fails. Contains reducer logic that should live in our Zustand store.                                                                                                                                     | **Extract Logic**. Port the reducer logic and any relevant types into `@refinery/store`.                                                                            |
| `@refinery/view-three`                                          | `@refinery/canvas-r3f` + `sdk-core` | Build passes but tests fail. Contains components that overlap with our `sdk-core` extraction plan.                                                                                                             | **Harvest Components**. Extract reusable components like `NodeSprite` and `ParticleSystem` (identified in `demo_app_specifics.md`) into our packages.               |
| `@refinery/input`, `@refinery/gesture-hands`, `@refinery/voice` | `@refinery/input-hub`               | All fail to build. Represent modality-specific logic.                                                                                                                                                          | **Consolidate**. Treat as a source for future modality packs. The core logic will be integrated into `@refinery/input-hub` first, then potentially split out later. |
| `@refinery/ai-ranker`, `@refinery/thinkable`                    | `graph-forge`                       | Build fails. Contains graph processing, traversal, and enrichment logic.                                                                                                                                       | **Merge into `graph-forge`**. The core algorithms (e.g., `jsonToNodesLinks`, `performTwoHopTraversal`) are direct inputs for the `forgeGraph` implementation.       |

---

## 3. Data & API Schema

- **`IdeaNode` Schema**: The `refinery-mono` `@refinery/ideanode` schema is the source of truth. It is far more detailed than our current schema, including `meta`, `state`, `tier`, and `kind` fields. Our `@refinery/schema` must be updated to match this structure.
- **Raw vs. Processed Data**:
  - **Input**: `raw_memory_export.json` shows the input format is an object with a `memories` array. Each memory has `id`, `content`, `position`, `cluster`, `connections`, and `metadata`.
  - **Output**: `processed_graph_bundle.json` shows the target output for `graph-forge`. The structure is `{ nodes: IdeaNode[], edges: IdeaEdge[] }`. The nodes in this file align with the `ideanode` schema.
- **Loaders**: `demo_app_specifics.md` confirms that loaders are scattered. `cryptic-vault-demo` uses a `parse-cryptic-data.js` script, while `animus-demo` has an API-based flow using `jsonToNodesLinks` from `@refinery/ai-ranker`. The logic from both must be consolidated within our `graph-forge` package.

---

## 4. Architecture & Technical Debt

- **Architecture Doc**: `REFINERY_SDK_ARCHITECTURE.md` provides a clear vision for package structure and API design principles (composable components, intent-based actions) that aligns well with our current trajectory. We should adopt its proposed package structure as a long-term goal.
- **Technical Debt**:
  - The `tech-debt.md` file confirms the build/test pipeline is broken (Jest ESM configs, disabled tests).
  - It highlights the need to consolidate ESLint configuration and deduplicate dependencies, which we have already done in our setup.
  - A key piece of debt is the manual, duplicated logic for node rendering (`CrypticNodeSprite.tsx`) and visual effects (`ParticleSystem.tsx`), which validates our plan to extract these into reusable `view-three` (our `canvas-r3f`) components.

---

## 5. Synthesis & Immediate Action Plan

1.  **Update `@refinery/schema`**: Immediately replace our `IdeaNode` and `IdeaEdge` types with the more detailed definitions from `docs/tmp/api-snapshots/ideanode/index.d.ts`. This is a blocking change for all other work.
2.  **Implement `graph-forge` Loaders**: Using the sample data, implement the full data transformation pipeline inside `forgeGraph`.
    - Input: `raw_memory_export.json` format.
    - Processing: Use logic from `parse-cryptic-data.js` and `jsonToNodesLinks` to connect nodes and enrich data.
    - Output: A graph bundle matching `processed_graph_bundle.json` and the updated `IdeaNode` schema.
3.  **Extract Components**: Begin moving `CrypticNodeSprite` and `ParticleSystem` from the demos into our `@refinery/canvas-r3f` package, creating generic versions.
4.  **Update Taskmaster**: Create new tasks for the schema migration and component extraction. Mark the `graph-forge` task (T1/T5) as unblocked.

The `refinery-mono` artifacts are a valuable but messy source. The code is useful, but the configuration and architecture are broken. Our primary task is to harvest the logic and data schemas while discarding the broken scaffolding.
