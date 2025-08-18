# Architecture Documentation

## Overview

This is a TypeScript monorepo implementing a graph-based visualization and interaction system called "Refinery SDK" with demo applications for mindmap and vault visualization. The architecture follows a modular package-based design with centralized state management and 3D rendering capabilities.

## Monorepo Structure

### Core Components
- **packages/** - 16 SDK packages providing core functionality (/workspace/packages:1)
- **apps/** - Demo applications showcasing the SDK (/workspace/apps:1)
- **docs/** - Documentation and archived content (/workspace/docs:1)
- **scripts/** - Build and maintenance utilities (/workspace/scripts:1)
- **tools/** - Meta-workflow and development tools (/workspace/tools:1)

### Entry Points

#### Primary SDK Packages
- **@refinery/store** - Zustand-based state management (/workspace/packages/store/src/index.ts:1)
- **@refinery/schema** - Core domain types and Zod validation (/workspace/packages/schema/src/index.ts:1)
- **@refinery/graph-forge** - Deterministic graph layout generation (/workspace/packages/graph-forge/src/index.ts:1)

#### Demo Applications
- **cryptiq-mindmap-demo** - Next.js mindmap visualization demo (/workspace/apps/cryptiq-mindmap-demo/app/page.tsx:1)
- **cryptic-vault-demo** - Legacy graph visualization demo (/workspace/apps/legacy-import/cryptic-vault-demo/app/page.tsx:1)

## Technology Stack

### Build & Orchestration
- **Turbo** (^2.3.3) - Monorepo task orchestration (/workspace/package.json:1)
- **TypeScript** (^5.7.2) - Primary language with strict typing (/workspace/package.json:1)
- **PNPM** (>=9.0.0) - Package manager with workspace support (/workspace/package.json:9)

### Core Runtime Dependencies
- **React** (19.1.0) - UI framework, pinned version (/workspace/package.json:48)
- **Three.js** (0.176.0) - 3D graphics engine, pinned version (/workspace/package.json:47)
- **Zustand** (^5.0.6) - State management library (/workspace/packages/store/src/store.ts:30)
- **Zod** - Schema validation via @refinery/schema (/workspace/packages/schema/src/index.ts:1)

## Data Flow & System Boundaries

### State Management Architecture
1. **Centralized Store**: Single Zustand store combining multiple slices (/workspace/packages/store/src/store.ts:19)
2. **Slice-Based Organization**: Graph, UI, and Async state separated into focused slices
3. **Persistence Layer**: Serialization/deserialization for state persistence (/workspace/packages/store/src/persistence.ts:53)

### Graph Processing Pipeline
1. **Raw Memory Input**: Unstructured data via RawMemorySchema (/workspace/packages/graph-forge/src/schemas.ts:7)
2. **Graph Forge**: Deterministic layout generation with configurable options (/workspace/packages/graph-forge/src/forge.ts:8)
3. **Visualization**: 3D rendering through Three.js integration
4. **Interaction**: Multi-modal input handling (gesture, voice, traditional)

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