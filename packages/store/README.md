# @refinery/store

Zustand-based global graph store with Zod validation and optional persistence.

## Features

- **Graph State Management**: Nodes and edges with efficient operations
- **UI State**: Selection, camera, layout, and theme management
- **Async Operations**: Job tracking and error handling
- **Command Queue**: Renderer command batching and synchronization
- **Persistence**: Optional localStorage persistence middleware
- **Type Safety**: Full TypeScript support with Zod validation

## Installation

```bash
pnpm add @refinery/store
```

## Usage

```typescript
import { useRefineryStore, useGraphStore, useUIStore } from '@refinery/store'

// Use the full store
const store = useRefineryStore()

// Or use convenient slice hooks
const { nodes, edges, addNode } = useGraphStore()
const { selectedNodeIds, selectNodes } = useUIStore()
```

## Store Slices

### Graph Slice

Manages nodes and edges state:
- CRUD operations for nodes and edges
- Batch operations for performance
- ID generation utilities

### UI Slice

Handles UI-related state:
- Selection management
- Camera position and zoom
- Layout configuration
- Theme customization
- Highlight system

### Async Slice

Manages asynchronous operations:
- Job tracking with progress
- Loading states
- Error handling

## Persistence

Enable localStorage persistence:

```typescript
import { createPersistenceMiddleware } from '@refinery/store'

// Configure persistence options
const persistence = createPersistenceMiddleware({
  name: 'refinery-store',
  version: 1,
  storage: localStorage // or custom storage
})
```

## Command Queue

The store includes a command queue system for batching renderer commands:

```typescript
const { enqueueCommand, subscribeToCommands } = useRefineryStore()

// Subscribe to commands
const unsubscribe = subscribeToCommands((commands) => {
  // Process batched commands
})

// Enqueue commands
enqueueCommand({ type: 'UPDATE_NODE', payload: { id, data } })
```