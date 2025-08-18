# API Reference Documentation

## Overview

The Refinery SDK provides a comprehensive set of APIs for graph visualization, state management, and 3D rendering. The APIs are organized into focused packages with clear separation of concerns and strong TypeScript typing throughout.

## Core Functions

### Graph Generation & Layout

#### forgeGraph
```typescript
forgeGraph(rawMemory: RawMemory, options?: ForgeOptions): ForgeResult
```
Main graph layout generation function that transforms raw memory data into positioned graph structures.
- **Source**: /workspace/packages/graph-forge/src/forge.ts:8
- **Input**: Raw memory concepts and relationships
- **Output**: Positioned nodes and edges with layout metadata

### State Management Hooks

#### useRefineryStore
```typescript
useRefineryStore: UseBoundStore<StoreApi<RefineryStore>>
```
Primary Zustand store hook providing access to complete application state.
- **Source**: /workspace/packages/store/src/store.ts:30
- **Usage**: Central state access for all components

#### useGraphStore
```typescript
useGraphStore(): GraphStoreActions
```
Graph-specific state management with actions for node/edge manipulation.
- **Source**: /workspace/packages/store/src/store.ts:77
- **Actions**: Add/remove nodes, update positions, manage selections

#### useUIStore
```typescript
useUIStore(): UIStoreActions
```
UI state management for themes, layouts, and interaction modes.
- **Source**: /workspace/packages/store/src/store.ts:105
- **Features**: Theme switching, layout preferences, modal states

#### useAsyncStore
```typescript
useAsyncStore(): AsyncStoreActions
```
Async operations management with loading states and error handling.
- **Source**: /workspace/packages/store/src/store.ts:143
- **Capabilities**: Loading indicators, job queues, error boundaries

### State Persistence

#### serializeState
```typescript
serializeState(state: RefineryStore): SerializedState
```
Converts store state to serializable format for persistence.
- **Source**: /workspace/packages/store/src/persistence.ts:53
- **Use case**: Save application state to localStorage or server

#### deserializeState  
```typescript
deserializeState(serialized: SerializedState): RefineryStore
```
Restores store state from serialized format.
- **Source**: /workspace/packages/store/src/persistence.ts:66
- **Use case**: Restore application state on initialization

## Classes & Utilities

### CommandQueue
```typescript
export class CommandQueue
```
Manages renderer command queue and execution for optimized rendering.
- **Source**: /workspace/packages/store/src/command-queue.ts:7
- **Purpose**: Batch and optimize rendering operations

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

## Usage Examples

### Basic Graph Generation
```typescript
import { forgeGraph } from '@refinery/graph-forge';

const rawMemory = {
  concepts: [{ id: '1', label: 'Node A' }],
  relationships: [{ from: '1', to: '2', weight: 1.0 }],
  metadata: { source: 'user_input' }
};

const result = forgeGraph(rawMemory, {
  layoutType: 'force-directed',
  iterations: 100
});
```

### Store Integration
```typescript
import { useRefineryStore, useGraphStore } from '@refinery/store';

function GraphComponent() {
  const store = useRefineryStore();
  const { addNode, selectNode } = useGraphStore();
  
  // Access state and trigger actions
  const nodes = store.graph.nodes;
  addNode({ id: 'new-node', label: 'New Node' });
}
```

## Source References
- Core functions: /workspace/packages/graph-forge/src/forge.ts:8
- Store hooks: /workspace/packages/store/src/store.ts:30-143
- Persistence: /workspace/packages/store/src/persistence.ts:53-66
- Utility classes: /workspace/packages/schema/src/core/graph.ts:99
- Type definitions: /workspace/packages/schema/src/core/vectors.ts:16-29
- Input types: /workspace/packages/schema/src/core/intent.ts:32-66
- Graph schemas: /workspace/packages/graph-forge/src/schemas.ts:38-127

## Open Questions
- [TBD: Error handling patterns across APIs]
- [TBD: Performance characteristics and optimization guidelines]
- [TBD: Async operation cancellation mechanisms]