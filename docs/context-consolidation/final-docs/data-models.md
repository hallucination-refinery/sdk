# Data Models Documentation

## Overview

The Refinery SDK employs a comprehensive data modeling strategy using Zod schemas for runtime validation and TypeScript types for compile-time safety. The architecture centers around graph entities (nodes and edges) with supporting models for geometry, user interaction, and application state.

## Core Schemas

### Geometric Primitives

#### Vector3Schema
```typescript
z.object({
  x: z.number(),
  y: z.number(), 
  z: z.number()
})
```
Fundamental 3D vector schema for spatial calculations and node positioning.
- **Source**: /workspace/packages/schema/src/core/vectors.ts:7
- **Properties**: x, y, z coordinates as floating-point numbers
- **Validation**: All coordinates must be valid numbers
- **Usage**: Node positions, camera coordinates, force vectors

#### Vector2Schema
```typescript
z.object({
  x: z.number(),
  y: z.number()
})
```
2D vector schema for screen coordinates and UI interactions.
- **Source**: /workspace/packages/schema/src/core/vectors.ts:20
- **Properties**: x, y coordinates as floating-point numbers
- **Usage**: Mouse positions, screen bounds, 2D projections

### User Interaction Models

#### IntentEnum [Verified]
```typescript
z.enum([
  'CREATE_NODE', 'DELETE_NODE', 'SELECT_NODE', 'MOVE_NODE',
  'CREATE_EDGE', 'DELETE_EDGE',
  'PAN_CAMERA', 'ZOOM_IN', 'ZOOM_OUT', 'FIT_VIEW',
  'SELECT_ALL', 'CLEAR_SELECTION',
  'TOGGLE_LAYOUT', 'RESET_LAYOUT'
])
```
Enumeration defining supported intent types for graph manipulation.
- **Source**: /workspace/packages/schema/src/core/intent.ts [High Confidence]
- **Values**: CREATE_NODE, DELETE_NODE, SELECT_NODE, MOVE_NODE, CREATE_EDGE, DELETE_EDGE, PAN_CAMERA, ZOOM_IN, ZOOM_OUT, FIT_VIEW, SELECT_ALL, CLEAR_SELECTION, TOGGLE_LAYOUT, RESET_LAYOUT
- **Purpose**: Classify user actions for graph operations
- **Cross-reference**: Used by forgeGraph function → see apis.md

#### GestureInputSchema [Verified]
```typescript
z.object({
  type: z.literal('gesture'),
  gesture: z.string(),
  confidence: z.number(),
  landmarks: z.array(z.object({x, y, z})).optional()
})
```
Gesture input data schema for Mediapipe integration.
- **Source**: /workspace/packages/schema/src/core/intent.ts [High Confidence]
- **Properties**: type ('gesture'), gesture (string), confidence (number), landmarks (3D points optional)
- **Purpose**: Handle gesture-based input from hand tracking
- **Cross-reference**: Part of MultimodalInput system

### Graph Data Models

#### RawMemorySchema [Verified]
```typescript
z.object({
  id: z.string(),
  content: z.string(),
  position: z.array(z.number()).length(3).optional(),
  cluster: z.string().optional(),
  connections: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional()
})
```
Schema for raw memory input before processing by forgeGraph function.
- **Source**: /workspace/packages/graph-forge/src/schemas.ts [High Confidence]
- **Properties**: id (string), content (string), position (Vector3 optional), cluster (string optional), connections (string array optional), metadata (record optional)
- **Purpose**: Standardized input format for graph forge operations
- **Flow**: RawMemory[] → forgeGraph() → ForgeResult
- **Cross-reference**: Consumed by forgeGraph function → see apis.md

#### ForgeOptionsSchema [Verified]
```typescript
z.object({
  seed: z.number().int().default(42),
  simulation: z.object({...}),
  bounds: z.object({...})
})
```
Configuration options for graph forge operation with deterministic seeding.
- **Source**: /workspace/packages/graph-forge/src/schemas.ts [High Confidence]
- **Properties**: seed (integer, default 42), simulation (object config), bounds (object config)
- **Purpose**: Control graph layout generation behavior
- **Cross-reference**: Used with forgeGraph function → see apis.md

## Core Entities

### Graph Entities

#### IdeaNode
```typescript
interface IdeaNode {
  id: string;
  label: string;
  position: Vector3;
  metadata: object;
  type: string;
}
```
Core node entity representing concepts in the graph.
- **Source**: /workspace/packages/schema/src/core/node.ts:1
- **Properties**: Unique ID, display label, 3D position, extensible metadata, type classification
- **Constraints**: ID must be unique within graph, position required for rendering
- **Usage**: Primary graph elements, visualization targets

#### Edge
```typescript
interface Edge {
  id: string;
  source: string;
  target: string;
  weight: number;
  type: string;
}
```
Core edge entity connecting nodes with weighted relationships.
- **Source**: /workspace/packages/schema/src/core/edge.ts:1
- **Properties**: Unique ID, source node ID, target node ID, relationship weight, type classification
- **Constraints**: Source and target must reference existing nodes
- **Usage**: Define relationships, influence layout forces, enable traversal

### Extended Visualization Models

#### NodeData
```typescript
interface NodeData {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  cluster: string;
}
```
Extended node data with rendering properties for visualization.
- **Source**: /workspace/packages/canvas-latent/types/index.ts:21
- **Properties**: Position coordinates, visual styling, cluster membership
- **Inheritance**: Extends IdeaNode with rendering-specific attributes
- **Usage**: 3D rendering, visual clustering, style application

#### LinkData
```typescript
interface LinkData {
  source: string;
  target: string;
  weight: number;
  color: string;
  opacity: number;
}
```
Extended link data with visual properties for edge rendering.
- **Source**: /workspace/packages/canvas-latent/types/index.ts:77
- **Properties**: Node references, relationship weight, visual styling
- **Inheritance**: Extends Edge with rendering-specific attributes
- **Usage**: Edge visualization, opacity effects, color coding

#### GraphData
```typescript
interface GraphData {
  nodes: NodeData[];
  links: LinkData[];
  metadata: object;
}
```
Complete graph data structure for visualization systems.
- **Source**: /workspace/packages/canvas-latent/types/index.ts:100
- **Properties**: Node collection, link collection, graph metadata
- **Purpose**: Unified data transfer format between systems
- **Usage**: Rendering pipeline input, state persistence, data exchange

## State Management Models

### Core State Slices

#### GraphState
```typescript
interface GraphState {
  nodes: Map<string, IdeaNode>;
  edges: Map<string, Edge>;
  nodeIdCounter: number;
  edgeIdCounter: number;
}
```
State model for graph data in the centralized store.
- **Source**: /workspace/packages/store/src/types/state.ts:1
- **Properties**: Node/edge collections as Maps, ID counters for uniqueness
- **Design**: Maps provide O(1) lookup performance
- **Usage**: Central graph data storage, efficient node/edge access

#### UIState
```typescript
interface UIState {
  selectedNodeIds: Set<string>;
  hoveredNodeId: string | null;
  layout: string;
  theme: string;
}
```
State model for user interface interactions and preferences.
- **Source**: /workspace/packages/store/src/types/state.ts:1
- **Properties**: Selection state, hover state, layout mode, theme preference
- **Design**: Set for efficient selection operations
- **Usage**: UI state management, interaction tracking, preference persistence

#### AsyncState
```typescript
interface AsyncState {
  isLoading: boolean;
  error: string | null;
  activeJobs: Map<string, JobInfo>;
}
```
State model for asynchronous operations and loading states.
- **Source**: /workspace/packages/store/src/types/state.ts:1
- **Properties**: Loading flag, error messages, active job tracking
- **Design**: Map enables job-specific tracking and cancellation
- **Usage**: Loading indicators, error handling, job management

## Data Relationships

### Entity Relationships
- **IdeaNode ↔ Edge**: Nodes connected via edges (source/target references)
- **NodeData → IdeaNode**: Visualization data extends core node structure
- **LinkData → Edge**: Visualization data extends core edge structure
- **GraphData → (NodeData + LinkData)**: Complete graph composed of extended entities

### State Relationships
- **RefineryStore = GraphSlice & UISlice & AsyncSlice**: Composed store combining all slices
- **GraphSlice.selectedNodeIds ↔ GraphSlice.nodes**: Selection references node IDs
- **UIState.hoveredNodeId → GraphState.nodes**: Hover state references graph nodes

### Schema Dependencies [Verified]
- **RawMemorySchema → Vector3Schema**: Position field uses 3D coordinates
- **GestureInputSchema → 3D landmarks**: Gesture input includes spatial data
- **ForgeOptionsSchema → RawMemorySchema**: Options configure processing of raw memories
- **IntentEnum → Graph operations**: Intent values drive graph manipulation actions
- **EdgeSchema → Node references**: Edges connect nodes via ID references

## Data Flow Patterns

### Input Processing Flow [Verified]
1. **Raw Input** → RawMemorySchema validation (id, content, position, cluster, connections, metadata)
2. **RawMemory[]** → forgeGraph(memories, options) processing
3. **ForgeResult** → GraphState integration via useRefineryStore
4. **GraphState** → 3D rendering via Canvas component
5. **User Actions** → IntentEnum classification → Store actions
- **Cross-reference**: forgeGraph function → see apis.md

### State Update Flow
1. **User Action** → Intent classification
2. **Intent** → Store action dispatch
3. **Store Action** → Slice state update
4. **State Change** → Component re-render
5. **Component** → Visual update

### Persistence Flow
1. **Store State** → serializeState() transformation
2. **SerializedState** → Storage persistence
3. **Storage Load** → deserializeState() restoration
4. **Restored State** → Store rehydration

## Validation Rules

### Schema Constraints
- **Vector coordinates**: Must be valid numbers, no NaN or Infinity
- **Gesture confidence**: Range 0.0 to 1.0 inclusive
- **Node/Edge IDs**: Non-empty strings, unique within graph
- **Relationship weights**: Positive numbers for force calculations

### State Invariants
- **Node IDs**: Must be unique across entire graph
- **Edge references**: Source and target must reference existing nodes
- **Selection state**: Selected node IDs must reference existing nodes
- **ID counters**: Must always increase, never reuse IDs

### Business Rules
- **Graph connectivity**: Edges create connected components
- **Position consistency**: All positioned nodes must have valid Vector3 coordinates
- **Metadata integrity**: Extensible metadata must be serializable objects

## Source References [Verified]
- Vector schemas: /workspace/packages/schema/src/core/vectors.ts [High Confidence]
- Intent schemas: /workspace/packages/schema/src/core/intent.ts [High Confidence]
- Edge schema: /workspace/packages/schema/src/core/edge.ts [High Confidence]
- Forge schemas: /workspace/packages/graph-forge/src/schemas.ts [High Confidence]
- Additional schemas: WidgetManifestSchema, VoiceInputSchema, IntentContextSchema [Medium Confidence]
- Total schema count: 25+ schemas across core packages [High Confidence]

## Open Questions
- [TBD: Schema evolution and migration strategy]
- [TBD: Performance impact of Map vs Array for large graphs]
- [TBD: Validation error handling and recovery patterns]