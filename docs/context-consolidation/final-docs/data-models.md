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

#### IntentEnum
```typescript
z.enum(['navigate', 'select', 'create', 'edit', 'delete', 'search'])
```
Enumeration defining all possible user intent classifications.
- **Source**: /workspace/packages/schema/src/core/intent.ts:6
- **Values**: navigate, select, create, edit, delete, search
- **Purpose**: Classify user actions for appropriate handling

#### GestureInputSchema
```typescript
z.object({
  type: z.string(),
  position: Vector2Schema,
  timestamp: z.number(),
  confidence: z.number().min(0).max(1)
})
```
Schema for gesture-based input events with confidence scoring.
- **Source**: /workspace/packages/schema/src/core/intent.ts:35
- **Properties**: Type identifier, 2D position, timestamp, confidence level
- **Validation**: Confidence must be between 0 and 1
- **Usage**: Hand tracking, gesture recognition, input classification

### Graph Data Models

#### RawMemorySchema
```typescript
z.object({
  concepts: z.array(ConceptSchema),
  relationships: z.array(RelationshipSchema),
  metadata: z.object()
})
```
Input schema for unprocessed graph data before layout generation.
- **Source**: /workspace/packages/graph-forge/src/schemas.ts:7
- **Properties**: Concepts array, relationships array, metadata object
- **Purpose**: Standardized input format for graph forge operations
- **Flow**: User input → RawMemory → ForgeProcess → PositionedGraph

#### ForgeOptionsSchema
```typescript
z.object({
  layoutType: z.string(),
  forceStrength: z.number(),
  iterations: z.number(),
  nodeSpacing: z.number()
})
```
Configuration schema for graph layout algorithms.
- **Source**: /workspace/packages/graph-forge/src/schemas.ts:80
- **Properties**: Layout type, force strength, iteration count, node spacing
- **Validation**: Numeric constraints on force and spacing parameters
- **Usage**: Fine-tune graph layout appearance and performance

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

### Schema Dependencies
- **GestureInputSchema → Vector2Schema**: Gesture input includes position vector
- **RawMemorySchema → ConceptSchema + RelationshipSchema**: Raw memory composed of concepts and relationships
- **ForgeResult → (IdeaNode + Edge)**: Forge output produces positioned graph entities

## Data Flow Patterns

### Input Processing Flow
1. **Raw Input** → RawMemorySchema validation
2. **RawMemory** → forgeGraph() processing
3. **ForgeResult** → GraphState integration
4. **GraphState** → NodeData/LinkData transformation
5. **Visualization Data** → 3D rendering

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

## Source References
- Vector schemas: /workspace/packages/schema/src/core/vectors.ts:7-20
- Intent schemas: /workspace/packages/schema/src/core/intent.ts:6-35
- Graph entities: /workspace/packages/schema/src/core/node.ts:1, /workspace/packages/schema/src/core/edge.ts:1
- Forge schemas: /workspace/packages/graph-forge/src/schemas.ts:7-80
- Visualization types: /workspace/packages/canvas-latent/types/index.ts:21-100
- State models: /workspace/packages/store/src/types/state.ts:1

## Open Questions
- [TBD: Schema evolution and migration strategy]
- [TBD: Performance impact of Map vs Array for large graphs]
- [TBD: Validation error handling and recovery patterns]