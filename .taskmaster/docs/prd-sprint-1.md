# Refinery SDK v0.1 — Product Requirements Document

> Status: **Draft**  |  Target release: **Six-week sprint ending YYYY-MM-DD**  
> Owner: Hallucination Refinery Corp — *William Barron*  
> Sources: `architecture.md`, `refinery-mono` audits, dev-container workspace overview

---

## Overview
The *Refinery SDK* is a modular, six-layer toolkit that adds a spatial, multimodal **idea-graph workspace** to any React web app.  
Version 0.1 will be extracted from the proven `refinery-mono` code-base, refactored for clean package boundaries, compiled under pnpm workspaces, and published to npm under the `@refinery/*` scope.

**Success criteria**  
• First green build  
• CI passing  
• ≥80 % unit coverage on *Schema* & *Ops*  
• One end-to-end demo (`apps/hello-sdk`) rendering a **1 k-node graph at ≥60 FPS**

---

## Core Features
| # | Feature | What it does | Why it matters | How it works |
|---|---------|--------------|----------------|--------------|
| 1 | **Schema** | Typed data model for `IdeaNode` and edges. | Provides a single source-of-truth for every layer. | Typescript package generated from Zod schema definitions. |
| 2 | **Ops** | Graph algorithms: BFS, Interwingle, etc. | Enables graph queries independent of UI. | Functional utilities operating on Schema objects. |
| 3 | **Store** | Global state via Zustand slice. | Replaces monolithic reducer & removes `forceGraphRef` coupling. | Typed actions emit `RendererCommand`s consumed by UI. |
| 4 | **Canvas** | React-Three renderer façade. | Abstracts away r3f-forcegraph so we can swap GPU engines later. | Publishes `enqueue(cmd)` API; internally adapts to r3f. |
| 5 | **Input Hub** | Unified gesture & voice intent bus. | Demonstrates multimodal control path. | Mediapipe Hands + Eleven Labs; events mapped to intent enum. |
| 6 | **CI Pipeline** | GitHub Actions workflow. | Guarantees repeatable builds & tests. | `pnpm install –-frozen-lockfile`, build, test jobs on ubuntu-latest. |

---

## User Experience
**Personas**  
1. *Internal Developer* — contributes to SDK packages.  
2. *External Integrator* — installs via npm and embeds Canvas component.

**Key user flows**  
1. `pnpm add @refinery/schema @refinery/canvas-r3f` → import → render graph.  
2. Clone repo → `pnpm -r run dev` → hot-reload individual packages.  
3. Run demo app `apps/hello-sdk` to see 1 k-node graph.

**UI/UX considerations**  
* Typed API surface — zero any-casts.  
* Demo app doubles as live documentation.  
* Accessibility: keyboard & screen-reader labels on Canvas overlay controls (WCAG 2.2 AA).

---

## Technical Architecture
### System Components
* Six NPM packages (**Schema, Ops, Store, Canvas, Input, Widgets**) managed under **pnpm workspaces**.
* Dev-container: Node 20, pnpm 9, Oh-My-Zsh, Claude CLI.
* GitHub Actions CI pipeline.

### Data Models
`IdeaNode` interface with open `metadata: Record<string, unknown>` field.

### APIs and Integrations
* Public TS APIs exported by each package (see *Core Features* table).
* Third-party: `three`, `@react-three/fiber`, Mediapipe Vision, Eleven Labs.

### Infrastructure Requirements
* Local: ≈2 GB RAM dev-container; GPU optional for Canvas tests.  
* CI: `ubuntu-latest`, Node 20.

---

## Development Roadmap (Scope-only, no timelines)
1. **Workspace Bootstrap** — scaffold pnpm workspace, dev-tools, CI stub.  
2. **Package Extraction** — import *Schema* & *Ops* from mono-repo and make them build/test green.  
3. **Store Refactor** — migrate reducer to Zustand slice.  
4. **Canvas Façade** — introduce API & decouple from r3f-forcegraph.  
5. **Input Hub Spike** — gesture & voice intent stubs.  
6. **Demo App** — `apps/hello-sdk` showcasing 1 k-node graph.  
7. **Docs & Coverage Hardening** — TypeDoc generation, >80 % coverage.

---

## Logical Dependency Chain
1. *Schema* → 2. *Ops* → 3. *Store* → 4. *Canvas* → 5. *Input Hub* → 6. *Widgets/Demo App*

This ordering ensures each higher layer only depends on completed, stable foundations.

---

## Risks and Mitigations
| Risk | Description | Mitigation |
|------|-------------|------------|
| Coupling Hot-Spots | `forceGraphRef`, global `eventMux`, monolithic reducer. | Refactor during extraction; enforce package boundaries via ESLint rules. |
| Build Blockers | TS6059 rootDir error in *Store*; Jest ESM crash in *Canvas*. | Solve rootDir via `references`; switch Canvas tests to Vitest + `uvu` transform. |
| Performance | 60 FPS target could fail on low-end hardware. | Profile early; allow degrading to 30 FPS in demo under feature flag. |
| Resource Constraints | Solo dev band-width. | De-scope Widgets layer; automate repetitive tasks via Taskmaster. |

---

## Appendix
* **Environment & Tooling**  
  * Node 20, pnpm 9, Typescript 5, Vitest, Turbo.  
  * pnpm overrides: `three@0.176.0`, `react@19.1.0`, `@react-three/fiber@^9.1.2`.
* **CI Workflow Snippet**
  ```yaml
  - run: pnpm -r run build
  - run: pnpm -r exec vitest run
  ```
* **Environment Variables** (stub)
  ```dotenv
  OPENAI_API_KEY=
  ELEVEN_LABS_API_KEY=
  ```
* **Public Assets**
  * `public/mediapipe/hand_landmarker.task` + `.wasm`
  * `test-assets/data/23-nodes.json`

---
*Last updated: YYYY-MM-DD*

--------------------------------------------------------------------