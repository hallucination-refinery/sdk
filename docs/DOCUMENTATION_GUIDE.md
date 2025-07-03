# Documentation Style Guide

This guide outlines the documentation standards for the Refinery SDK.

## Documentation Types

### 1. Code Documentation (JSDoc/TSDoc)

All public APIs must be documented with JSDoc comments:

```typescript
/**
 * Performs a breadth-first search on the graph starting from the given node.
 * 
 * @param graph - The graph to search
 * @param startNodeId - The ID of the node to start from
 * @param options - Optional search configuration
 * @returns An array of nodes in BFS order
 * 
 * @example
 * ```typescript
 * const result = bfs(graph, 'node1', { maxDepth: 3 });
 * console.log(result.map(n => n.id)); // ['node1', 'node2', 'node3']
 * ```
 * 
 * @remarks
 * This implementation uses a queue-based approach for optimal performance
 * on large graphs. Time complexity: O(V + E)
 */
export function bfs(
  graph: Graph,
  startNodeId: string,
  options?: BFSOptions
): IdeaNode[] {
  // Implementation
}
```

### 2. Package README Structure

Each package must have a README.md with:

1. **Title and Description**
2. **Installation** instructions
3. **Quick Start** example
4. **API Reference** (link to TypeDoc)
5. **Advanced Usage** examples
6. **Configuration** options (if applicable)
7. **Performance** considerations
8. **Testing** instructions

### 3. Example Documentation

Examples should:
- Be runnable and tested
- Show common use cases
- Include imports
- Have expected output in comments
- Be progressively complex

```typescript
// ✅ Good example
import { Graph, IdeaNode } from '@refinery/schema';
import { bfs } from '@refinery/ops';

const graph: Graph = {
  nodes: [
    { id: '1', label: 'Root' },
    { id: '2', label: 'Child 1' },
    { id: '3', label: 'Child 2' }
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '1', target: '3' }
  ]
};

const visited = bfs(graph, '1');
console.log(visited.map(n => n.label)); 
// Output: ['Root', 'Child 1', 'Child 2']
```

## TypeDoc Configuration

### Categories

Use `@category` to group related items:

```typescript
/**
 * @category Core
 */
export interface Graph { ... }

/**
 * @category Algorithms
 */
export function bfs() { ... }
```

### Internal APIs

Mark internal APIs with `@internal`:

```typescript
/**
 * @internal
 */
export function _internalHelper() { ... }
```

## Writing Style

### Tone
- Professional but approachable
- Use "you" for the reader
- Active voice preferred
- Present tense for descriptions

### Formatting
- Use code blocks for all code
- Use tables for comparing options
- Use bullet points for lists
- Include diagrams where helpful

### Terminology
- **Graph**: A collection of nodes and edges
- **Node**: An idea or concept in the graph
- **Edge**: A connection between nodes
- **Store**: The state management system
- **Canvas**: The 3D rendering component
- **Widget**: A reusable UI component

## Coverage Requirements

All packages must maintain:
- ≥80% line coverage
- ≥80% branch coverage
- ≥80% function coverage
- ≥80% statement coverage

Core packages (schema, ops) are priority for coverage.

## Review Checklist

Before submitting documentation:

- [ ] All public APIs have JSDoc comments
- [ ] Examples are runnable and tested
- [ ] README follows the template
- [ ] TypeDoc builds without warnings
- [ ] Coverage meets thresholds
- [ ] Links are not broken
- [ ] Terminology is consistent
- [ ] Code blocks have syntax highlighting