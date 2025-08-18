# Discovery Summary

**Generated:** 2025-08-18T15:41:34-07:00

## Architecture Overview

The codebase is a TypeScript-based monorepo implementing the **Refinery SDK** - a graph visualization and interaction framework. The architecture follows a modular design with 16 core packages and 2 demo applications.

### Key Components

- **@refinery/schema**: Core type definitions and Zod schemas for IdeaNode, Edge, and Graph structures
- **@refinery/store**: Zustand-based state management with graph, UI, and async slices
- **@refinery/graph-forge**: Deterministic graph layout generation with force simulation
- **@refinery/canvas-r3f**: React Three Fiber canvas components for 3D visualization
- **@refinery/canvas-latent**: Graph data types and visualization utilities

### Technology Stack

- **Build System**: Turbo monorepo with PNPM workspaces
- **Language**: TypeScript 5.7.2 (primary), with Node.js 20+
- **State Management**: Zustand 5.0.6 for reactive state
- **Validation**: Zod schemas for runtime type checking
- **3D Graphics**: Three.js 0.176.0 (pinned) with React Three Fiber
- **UI Framework**: React 19.1.0 (pinned)

## APIs Discovered

### Core Functions (7)
- `forgeGraph()`: Main graph layout generation
- `useRefineryStore()`: Primary state management hook
- `useGraphStore()`, `useUIStore()`, `useAsyncStore()`: Specialized store hooks
- `serializeState()`, `deserializeState()`: State persistence

### Classes (3)
- `CommandQueue`: Renderer command management
- `GraphUtils`: Graph operations utilities
- `SelectionUtils`: Node/edge selection utilities

### Key Interfaces (6)
- `RefineryStore`: Main store type combining all slices
- `ForgeResult`: Graph generation result type
- `SerializedState`: Persistence format
- `GraphSlice`: Graph state management interface
- Plus app-specific interfaces for UI components

### Type Definitions (8)
- Vector math types (`Vector2`, `Vector3`)
- Input system types (`Intent`, `GestureInput`, `MultimodalInput`)
- Graph data types (`RawMemory`, `ForgeOptions`, `Lens`)

## Data Models

### Zod Schemas (6)
- Vector schemas for 2D/3D coordinates
- Intent and gesture input schemas
- Graph forge configuration schemas

### Core Entities (5)
- `IdeaNode`: Primary graph node entity
- `Edge`: Connection between nodes
- `GraphData`: Complete graph structure
- Extended visualization types (`NodeData`, `LinkData`)

### State Models (3)
- `GraphState`: Core graph data in store
- `UIState`: User interface interactions
- `AsyncState`: Background operations

## Configuration

### Environment Variables (5)
- API keys for Anthropic, ElevenLabs services
- Graph spawn mode and debug settings
- Node.js environment configuration

### Config Files (5)
- `turbo.json`: Monorepo task orchestration
- TypeScript configurations (base + build)
- PNPM workspace and test configurations

### Version Constraints
- Node.js ≥20.0.0, PNPM ≥9.0.0
- Pinned versions: Three.js 0.176.0, React 19.1.0

## Error Handling & Logging

### Error Categories
- **Logging**: Console-based error reporting
- **Filesystem**: File operation error handling
- **Async**: Promise rejection handling
- **Validation**: Zod schema validation errors

### Logging Patterns
- Standard `console.log/error` throughout codebase
- Development-only logging guards
- React error boundaries for component failures

## Statistics

- **Total Files**: 1,018
- **Packages**: 16 core SDK packages
- **Applications**: 2 demo applications
- **Primary Language**: TypeScript
- **Test Coverage**: Estimated 50+ test files with Vitest

## Key Findings

1. **Well-Structured**: Clean separation between core SDK packages and demo applications
2. **Type-Safe**: Heavy use of TypeScript and Zod for runtime validation
3. **Modern Stack**: Current versions of React, TypeScript, and build tools
4. **Monorepo**: Proper use of Turbo for efficient builds and caching
5. **3D Focus**: Specialized for graph visualization with Three.js integration
6. **State Management**: Zustand provides reactive state with command patterns

## Recommendations for Documentation

1. **Architecture**: Focus on package dependencies and data flow
2. **APIs**: Document the main store hooks and graph forge functions
3. **Data Models**: Emphasize the schema-driven approach with Zod
4. **Configuration**: Cover environment setup and build requirements
5. **Error Handling**: Document debugging patterns and error boundaries
