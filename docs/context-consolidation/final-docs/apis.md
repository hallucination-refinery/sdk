# API Reference Documentation

## Overview

The Refinery SDK provides a comprehensive set of APIs for graph visualization, state management, and 3D rendering. The APIs are organized into focused packages with clear separation of concerns and strong TypeScript typing throughout.

## Core Functions

### Graph Generation & Layout

#### forgeGraph [Verified]
```typescript
forgeGraph(memories: RawMemory[], options?: ForgeOptions): ForgeResult
```
Deterministic 3D graph layout generator that transforms raw memories into positioned graph structures.
- **Source**: /workspace/packages/graph-forge/src/forge.ts [Verified]
- **Input**: Array of RawMemory objects with id, content, position, cluster, connections, metadata
- **Output**: ForgeResult with positioned nodes and layout metadata
- **Cross-reference**: Uses RawMemorySchema validation → see data-models.md

### State Management Hooks

#### useRefineryStore [Verified]
```typescript
useRefineryStore(): RefineryStore
```
Main Zustand store for Refinery state management combining all slices.
- **Source**: /workspace/packages/store/src/store.ts [High Confidence]
- **Usage**: Primary state hook - create<RefineryStore>()
- **Cross-reference**: Links to GraphSlice, UISlice, AsyncSlice → see data-models.md
- **Example**: `const { addNode, selectNode } = useRefineryStore();`

#### useGraphStore [High Confidence]
```typescript
useGraphStore(): GraphStoreActions
```
Graph-specific state management with actions for node/edge manipulation.
- **Source**: Derived from useRefineryStore in /workspace/packages/store/src/store.ts
- **Actions**: Add/remove nodes, update positions, manage selections
- **Cross-reference**: Works with IntentEnum actions → see data-models.md

#### useUIStore
```typescript
useUIStore(): UIStoreActions
```
UI state management for themes, layouts, and interaction modes.
- **Source**: /workspace/packages/store/src/store.ts
- **Features**: Theme switching, layout preferences, modal states

#### useAsyncStore
```typescript
useAsyncStore(): AsyncStoreActions
```
Async operations management with loading states and error handling.
- **Source**: /workspace/packages/store/src/store.ts
- **Capabilities**: Loading indicators, job queues, error boundaries

### State Persistence

#### serializeState
```typescript
serializeState(state: RefineryStore): SerializedState
```
Converts store state to serializable format for persistence.
- **Source**: /workspace/packages/store/src/persistence.ts
- **Use case**: Save application state to localStorage or server

#### deserializeState  
```typescript
deserializeState(serialized: SerializedState): RefineryStore
```
Restores store state from serialized format.
- **Source**: /workspace/packages/store/src/persistence.ts
- **Use case**: Restore application state on initialization

## Classes & Utilities

### CommandQueue [Verified]
```typescript
new CommandQueue()
```
Queue for managing renderer commands with optimized execution.
- **Source**: /workspace/packages/store/src/command-queue.ts [High Confidence]
- **Purpose**: Batch and optimize rendering operations
- **Usage**: Command pattern for renderer state management

### GraphUtils
```typescript
export class GraphUtils
```
Static utility methods for graph operations and calculations.
- **Source**: /workspace/packages/schema/src/core/graph.ts:99
- **Methods**: Distance calculations, graph traversal, validation

### SelectionUtils
```typescript
export class SelectionUtils
```
Utility methods for selection operations and multi-select handling.
- **Source**: /workspace/packages/schema/src/core/selection.ts:63
- **Features**: Selection algorithms, range selection, batch operations

## Type Definitions

### Core Store Types

#### RefineryStore
```typescript
export type RefineryStore = GraphSlice & UISlice & AsyncSlice
```
Main store interface combining all state slices.
- **Source**: /workspace/packages/store/src/store.ts:19
- **Composition**: Graph data + UI state + async operations

#### GraphSlice
```typescript
export interface GraphSlice extends GraphState
```
Graph state management slice with nodes, edges, and counters.
- **Source**: /workspace/packages/store/src/slices/graph-slice.ts:10
- **Data**: Node/edge collections, ID counters, selection state

### Graph Data Types

#### Vector3
```typescript
export type Vector3 = z.infer<typeof Vector3Schema>
```
3D vector type for node positions and spatial calculations.
- **Source**: /workspace/packages/schema/src/core/vectors.ts:16
- **Properties**: x, y, z coordinates as numbers

#### Vector2
```typescript
export type Vector2 = z.infer<typeof Vector2Schema>
```
2D vector type for screen coordinates and UI positioning.
- **Source**: /workspace/packages/schema/src/core/vectors.ts:29
- **Properties**: x, y coordinates as numbers

#### RawMemory
```typescript
export type RawMemory = z.infer<typeof RawMemorySchema>
```
Input format for graph generation containing concepts and relationships.
- **Source**: /workspace/packages/graph-forge/src/schemas.ts:38
- **Structure**: Concepts array, relationships array, metadata object

#### ForgeOptions
```typescript
export type ForgeOptions = z.infer<typeof ForgeOptionsSchema>
```
Configuration options for graph layout generation.
- **Source**: /workspace/packages/graph-forge/src/schemas.ts:127
- **Options**: Layout type, force strength, iterations, node spacing

### Input & Interaction Types

#### Intent
```typescript
export type Intent = z.infer<typeof IntentEnum>
```
User intent enumeration for interaction classification.
- **Source**: /workspace/packages/schema/src/core/intent.ts:32
- **Values**: navigate, select, create, edit, delete, search

#### GestureInput
```typescript
export type GestureInput = z.infer<typeof GestureInputSchema>
```
Gesture-based input event data structure.
- **Source**: /workspace/packages/schema/src/core/intent.ts:48
- **Data**: Type, position, timestamp, confidence level

#### MultimodalInput
```typescript
export type MultimodalInput = z.infer<typeof MultimodalInputSchema>
```
Union type encompassing all input modalities.
- **Source**: /workspace/packages/schema/src/core/intent.ts:66
- **Includes**: Gesture, voice, keyboard, mouse inputs

## Result Types

### ForgeResult
```typescript
export interface ForgeResult
```
Result structure returned by graph forge operations.
- **Source**: /workspace/packages/graph-forge/src/forge.ts:14
- **Contents**: Positioned nodes, edges, layout metadata, performance stats

### SerializedState
```typescript
export interface SerializedState
```
Serializable representation of complete store state.
- **Source**: /workspace/packages/store/src/persistence.ts:10
- **Format**: JSON-compatible structure with version info

## Usage Examples [Verified]

### Basic Graph Generation
```typescript
import { forgeGraph, RawMemorySchema } from '@refinery/graph-forge';

// Validated input structure
const memories = [{
  id: '1',
  content: 'First concept',
  position: [0, 0, 0], // optional Vector3
  cluster: 'main', // optional
  connections: ['2'], // optional
  metadata: { source: 'user_input' } // optional
}];

// Generate graph with forge options
const result = forgeGraph(memories, {
  seed: 42,
  simulation: { /* simulation config */ },
  bounds: { /* boundary config */ }
});
```

### Store Integration with Intent Actions
```typescript
import { useRefineryStore } from '@refinery/store';
import { IntentEnum } from '@refinery/schema';

function GraphComponent() {
  const store = useRefineryStore();
  
  // Access state and trigger intent-based actions
  const nodes = store.graph.nodes;
  
  // Handle user intents
  const handleNodeAction = (intent: IntentEnum) => {
    switch(intent) {
      case 'CREATE_NODE':
        store.addNode({ id: 'new-node', content: 'New Node' });
        break;
      case 'SELECT_NODE':
        store.selectNode('node-id');
        break;
    }
  };
}
```

## Source References [Verified]
- Core functions: /workspace/packages/graph-forge/src/forge.ts [Verified]
- Store hooks: /workspace/packages/store/src/store.ts [High Confidence]
- Persistence: /workspace/packages/store/src/persistence.ts [High Confidence]
- Command queue: /workspace/packages/store/src/command-queue.ts [High Confidence]
- Graph schemas: /workspace/packages/graph-forge/src/schemas.ts [High Confidence]
- Intent definitions: /workspace/packages/schema/src/core/intent.ts [High Confidence]
- Vector types: /workspace/packages/schema/src/core/vectors.ts [High Confidence]
- Edge schema: /workspace/packages/schema/src/core/edge.ts [High Confidence]

## Open Questions
- [TBD: Error handling patterns across APIs]
- [TBD: Performance characteristics and optimization guidelines]
- [TBD: Async operation cancellation mechanisms]