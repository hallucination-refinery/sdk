# Architecture Documentation

## Overview

This is a TypeScript monorepo implementing a graph-based visualization and interaction system called "Refinery SDK" with demo applications for mindmap and vault visualization. The architecture follows a modular package-based design with centralized state management and 3D rendering capabilities.

## Monorepo Structure

### Core Components
- **packages/** - 16 SDK packages providing core functionality [Verified] (/workspace/packages/)
  - canvas-latent, canvas-r3f, gesture-hands, graph-forge, input-hub, interaction
  - ops, schema, sdk-core, shared, store, thinkable, widget-aperture, widget-hud [High Confidence]
- **apps/** - Demo applications showcasing the SDK (/workspace/apps:1)
- **docs/** - Documentation and archived content (/workspace/docs:1)
- **scripts/** - Build and maintenance utilities (/workspace/scripts:1)
- **tools/** - Meta-workflow and development tools (/workspace/tools:1)

### Entry Points [Verified]

#### Primary SDK Packages
- **@refinery/store** - State management with useRefineryStore, useGraphStore, useUIStore, useAsyncStore
  - Exported in /workspace/packages/store/src/index.ts [High Confidence]
- **@refinery/schema** - Core domain types and Zod validation (exports z, version)
  - Exported in /workspace/packages/schema/src/index.ts [High Confidence]
- **@refinery/graph-forge** - Deterministic graph layout with forgeGraph, RawMemorySchema, ForgeOptionsSchema
  - Exported in /workspace/packages/graph-forge/src/index.ts [High Confidence]
- **@refinery/canvas-r3f** - React Three Fiber components (Canvas, CanvasProvider, NodeSprite)
  - Exported in /workspace/packages/canvas-r3f/src/index.ts [High Confidence]

#### Demo Applications
- **cryptiq-mindmap-demo** - Next.js mindmap visualization demo (/workspace/apps/cryptiq-mindmap-demo/app/page.tsx:1)
- **cryptic-vault-demo** - Legacy graph visualization demo (/workspace/apps/legacy-import/cryptic-vault-demo/app/page.tsx:1)

## Technology Stack

### Build & Orchestration
- **Turbo** (^2.3.3) - Monorepo task orchestration (/workspace/package.json:1)
- **TypeScript** (^5.7.2) - Primary language with strict typing (/workspace/package.json:1)
- **PNPM** (>=9.0.0) - Package manager with workspace support (/workspace/package.json:9)

### Core Runtime Dependencies [Verified]
- **React** (19.1.0) - UI framework, pinned version (/workspace/package.json)
- **Three.js** (0.176.0) - 3D graphics engine, pinned version (/workspace/package.json)
- **Zustand** - State management library powering useRefineryStore hook [High Confidence]
- **Zod** - Schema validation for RawMemorySchema, ForgeOptionsSchema, IntentEnum, etc.
  - Core library exported in /workspace/packages/schema/src/index.ts [Verified]

## Data Flow & System Boundaries

### State Management Architecture
1. **Centralized Store**: Single Zustand store combining multiple slices (/workspace/packages/store/src/store.ts:19)
2. **Slice-Based Organization**: Graph, UI, and Async state separated into focused slices
3. **Persistence Layer**: Serialization/deserialization for state persistence (/workspace/packages/store/src/persistence.ts:53)

### Graph Processing Pipeline [Verified]
1. **Raw Memory Input**: Data with id, content, position, cluster, connections, metadata fields
   - Schema in /workspace/packages/graph-forge/src/schemas.ts [High Confidence]
2. **Graph Forge**: forgeGraph(memories: RawMemory[], options?: ForgeOptions): ForgeResult
   - Implementation in /workspace/packages/graph-forge/src/forge.js [Verified]
3. **Visualization**: 3D rendering through Canvas component and NodeSprite
   - Components in /workspace/packages/canvas-r3f/src/Canvas.tsx [High Confidence]
4. **Interaction**: Multi-modal input with IntentEnum (CREATE_NODE, DELETE_NODE, SELECT_NODE, MOVE_NODE, etc.)
   - Intent types in /workspace/packages/schema/src/core/intent.ts [Verified]

### Component Boundaries
- **Schema Layer**: Type definitions and validation (/workspace/packages/schema/src/index.ts:1)
- **Store Layer**: State management and persistence (/workspace/packages/store/src/index.ts:1)  
- **Forge Layer**: Graph layout computation (/workspace/packages/graph-forge/src/index.ts:1)
- **Application Layer**: UI components and user interactions

## Key Architectural Decisions

### Type Safety & Validation
- Runtime schema validation using Zod for all data models
- Strict TypeScript configuration across all packages
- Type inference from schemas to maintain single source of truth

### State Management Strategy
- Single store pattern with slice composition for scalability
- Command queue for renderer operations (/workspace/packages/store/src/command-queue.ts:7)
- Async operations isolated in dedicated slice

### Rendering Architecture
- 3D-first approach using Three.js for all visualizations
- Pinned versions for React and Three.js to ensure compatibility
- Performance-oriented command queue for rendering operations

### Modular Package Design
- Each package has focused responsibility
- Clear separation between data models, business logic, and UI
- Shared types and utilities through @refinery/schema

## Source References
- Monorepo root: /workspace/package.json:1
- Store package: /workspace/packages/store/src/index.ts:1
- Schema package: /workspace/packages/schema/src/index.ts:1
- Graph forge: /workspace/packages/graph-forge/src/index.ts:1
- Main demo app: /workspace/apps/cryptiq-mindmap-demo/app/page.tsx:1
- Build config: /workspace/turbo.json:1
- Workspace config: /workspace/pnpm-workspace.yaml:1

## Open Questions
- [TBD: Package interdependencies - need detailed analysis]
- [TBD: Performance characteristics of graph forge algorithm]
- [TBD: Deployment and distribution strategy for SDK packages]