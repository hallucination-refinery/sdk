# @refinery/schema

Core domain types and schemas for the Refinery SDK. This package provides Zod-based schema definitions with TypeScript type generation for IdeaNode, Edge, and Graph structures.

## Features

- 🔍 **Type-safe schemas** - Zod schemas with full TypeScript type inference
- 🎯 **Domain-driven design** - Core types for idea graph manipulation
- 📦 **Zero runtime dependencies** - Only depends on Zod and three.js vector types
- 🧪 **Thoroughly tested** - >99% test coverage
- 🚀 **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install @refinery/schema
```

## Usage

### Basic Types

```typescript
import { IdeaNode, Edge, Graph } from '@refinery/schema'

// Create a node
const node: IdeaNode = {
  id: 'node-1',
  label: 'My Idea',
  content: 'A detailed description of my idea',
  position: { x: 100, y: 200, z: 0 },
  metadata: {
    tags: ['important', 'review'],
    author: 'John Doe'
  }
}

// Create an edge
const edge: Edge = {
  id: 'edge-1',
  source: 'node-1',
  target: 'node-2',
  type: 'depends-on',
  strength: 0.8
}

// Create a graph
const graph: Graph = {
  nodes: [node],
  edges: [edge]
}
```

### Schema Validation

```typescript
import { IdeaNodeSchema, EdgeSchema, GraphSchema } from '@refinery/schema'

// Validate data
const validNode = IdeaNodeSchema.parse(unknownData)

// Safe parsing with error handling
const result = IdeaNodeSchema.safeParse(unknownData)
if (result.success) {
  console.log('Valid node:', result.data)
} else {
  console.error('Validation errors:', result.error)
}

// Type guards
import { isIdeaNode, isEdge } from '@refinery/schema'

if (isIdeaNode(data)) {
  // TypeScript knows data is IdeaNode
  console.log(data.label)
}
```

### Graph Operations

```typescript
import { GraphUtils } from '@refinery/schema'

// Create empty graph
const graph = GraphUtils.empty()

// Add nodes and edges
const updatedGraph = GraphUtils.addNode(graph, node)
const withEdge = GraphUtils.addEdge(updatedGraph, edge)

// Query graph
const myNode = GraphUtils.getNode(graph, 'node-1')
const edges = GraphUtils.getNodeEdges(graph, 'node-1')
const neighbors = GraphUtils.getNodeNeighbors(graph, 'node-1')

// Get statistics
const stats = GraphUtils.getStats(graph)
console.log(`Nodes: ${stats.nodeCount}, Edges: ${stats.edgeCount}`)

// Find orphaned nodes
const orphans = GraphUtils.getOrphanedNodes(graph)
```

### Selection Management

```typescript
import { SelectionUtils } from '@refinery/schema'

// Create selection
let selection = SelectionUtils.selectNodes(['node-1', 'node-2'])

// Add to selection
selection = SelectionUtils.addNodes(selection, ['node-3'])

// Toggle selection
selection = SelectionUtils.toggleNodes(selection, ['node-1', 'node-4'])

// Check selection state
if (SelectionUtils.isNodeSelected(selection, 'node-1')) {
  console.log('Node 1 is selected')
}

// Clear selection
selection = SelectionUtils.clear()
```

### Layout Configuration

```typescript
import { DefaultLayouts, type LayoutConfig } from '@refinery/schema'

// Use predefined layouts
const forceLayout = DefaultLayouts.forceDirected()
const hierarchicalLayout = DefaultLayouts.hierarchical('left-right')
const circularLayout = DefaultLayouts.circular()

// Custom layout configuration
const customLayout: LayoutConfig = {
  type: 'force-directed',
  params: {
    chargeStrength: -500,
    linkDistance: 150,
    centerStrength: 0.2
  }
}
```

### Extending Schemas

```typescript
import { IdeaNodeSchema, z } from '@refinery/schema'

// Extend IdeaNode with custom fields
const CustomNodeSchema = IdeaNodeSchema.extend({
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().datetime().optional()
})

type CustomNode = z.infer<typeof CustomNodeSchema>
```

## API Reference

### Core Types

- `IdeaNode` - Node in the idea graph
- `Edge` - Connection between nodes
- `Graph` - Complete graph structure
- `Selection` - Selection state
- `LayoutConfig` - Layout configuration

### Schemas

- `IdeaNodeSchema` - Zod schema for IdeaNode
- `EdgeSchema` - Zod schema for Edge
- `GraphSchema` - Zod schema for Graph
- `SelectionSchema` - Zod schema for Selection
- `LayoutConfigSchema` - Zod schema for LayoutConfig

### Utilities

- `GraphUtils` - Graph manipulation utilities
- `SelectionUtils` - Selection management utilities
- `VectorUtils` - 3D vector operations
- `DefaultLayouts` - Predefined layout configurations

### Type Guards

- `isIdeaNode(value)` - Check if value is an IdeaNode
- `isEdge(value)` - Check if value is an Edge

## License

MIT