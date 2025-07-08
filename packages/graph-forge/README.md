# @refinery/graph-forge

Deterministic graph layout generator for the Refinery SDK. Transforms raw memory data into positioned nodes and edges using force-directed simulation.

## Features

- **Deterministic layouts** - Same input + seed always produces identical output
- **Fast performance** - Layouts 2,000 nodes in under 300ms
- **Force-directed simulation** - Natural, organic graph layouts
- **Cluster-aware** - Automatic color coding by category
- **3D positioning** - Full 3D force simulation with configurable bounds
- **CLI tool** - Command-line interface for batch processing

## Installation

```bash
pnpm add @refinery/graph-forge
```

## Usage

### API

```typescript
import { forgeGraph, type RawMemory } from '@refinery/graph-forge'

const memories: RawMemory[] = [
  {
    id: 'mem_001',
    content: 'First idea',
    cluster: 'work',
    connections: ['mem_002'],
  },
  {
    id: 'mem_002', 
    content: 'Related thought',
    position: [10, 20, 0], // Optional initial position
  },
]

const result = forgeGraph(memories, {
  seed: 42, // For deterministic results
  simulation: {
    iterations: 300,
    repulsionStrength: 30,
  },
})

console.log(result.nodes)      // Positioned IdeaNode[]
console.log(result.edges)      // Edge[] with relationships
console.log(result.widgetSpec) // UI rendering hints
```

### CLI

```bash
# Process a JSON file
graph-forge memories.json

# Save to file
graph-forge memories.json --output graph.json

# Custom seed for different layouts
graph-forge memories.json --seed 123

# Adjust simulation iterations
graph-forge memories.json --iterations 500
```

## Input Format

The input should be a JSON file containing an array of `RawMemory` objects:

```json
[
  {
    "id": "unique-id",
    "content": "The text content of this memory",
    "cluster": "category-name",
    "connections": ["other-id-1", "other-id-2"],
    "position": [x, y, z],
    "metadata": {
      "any": "custom data"
    }
  }
]
```

All fields except `id` and `content` are optional.

## Options

### ForgeOptions

- `seed` (number) - Random seed for deterministic layouts (default: 42)
- `simulation` - Force simulation parameters:
  - `iterations` - Number of simulation steps (default: 300)
  - `alphaDecay` - Cooling rate (default: 0.02)
  - `repulsionStrength` - Node repulsion force (default: 30)
  - `linkStrength` - Edge attraction multiplier (default: 1.0)
  - `centerStrength` - Center gravity force (default: 0.1)
- `bounds` - 3D space constraints:
  - `x` - [min, max] tuple (default: [-100, 100])
  - `y` - [min, max] tuple (default: [-100, 100])
  - `z` - [min, max] tuple (default: [-50, 50])

## Performance

The package is optimized for performance with:
- Pre-allocated arrays
- Efficient force calculations
- Minimal object allocations
- Early termination via alpha decay

Benchmark results:
- 100 nodes: ~5ms
- 500 nodes: ~40ms
- 1,000 nodes: ~100ms
- 2,000 nodes: ~250ms

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run benchmarks
pnpm test:bench

# Build package
pnpm build
```

## License

See LICENSE in repository root.