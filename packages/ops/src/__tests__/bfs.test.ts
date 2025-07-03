import { describe, it, expect } from 'vitest'
import { Graph, GraphUtils } from '@refinery/schema'
import { bfs, shortestPath, findNodesWithinDistance, findConnectedComponents } from '../algorithms/bfs'

describe('BFS Algorithm', () => {
  // Helper to create test graph
  function createTestGraph(): Graph {
    return {
      nodes: [
        { id: 'A', label: 'Node A' },
        { id: 'B', label: 'Node B' },
        { id: 'C', label: 'Node C' },
        { id: 'D', label: 'Node D' },
        { id: 'E', label: 'Node E' },
        { id: 'F', label: 'Node F' },
        { id: 'G', label: 'Node G' }, // Isolated node
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', directed: false },
        { id: 'e2', source: 'A', target: 'C', directed: false },
        { id: 'e3', source: 'B', target: 'D', directed: false },
        { id: 'e4', source: 'C', target: 'E', directed: false },
        { id: 'e5', source: 'D', target: 'F', directed: false },
        { id: 'e6', source: 'E', target: 'F', directed: false },
      ]
    }
  }

  describe('bfs', () => {
    it('should traverse graph in breadth-first order', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'A')

      expect(result.visitOrder.map(n => n.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
      expect(result.visited).toContain('A')
      expect(result.visited).toContain('F')
      expect(result.visited).not.toContain('G') // Isolated node
    })

    it('should calculate correct distances', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'A')

      expect(result.distances.get('A')).toBe(0)
      expect(result.distances.get('B')).toBe(1)
      expect(result.distances.get('C')).toBe(1)
      expect(result.distances.get('D')).toBe(2)
      expect(result.distances.get('E')).toBe(2)
      expect(result.distances.get('F')).toBe(3)
      expect(result.distances.get('G')).toBeUndefined()
    })

    it('should track parent relationships', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'A')

      expect(result.parents.get('A')).toBeNull()
      expect(result.parents.get('B')).toBe('A')
      expect(result.parents.get('C')).toBe('A')
      expect(result.parents.get('D')).toBe('B')
      expect(result.parents.get('E')).toBe('C')
    })

    it('should respect maxDepth option', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'A', { maxDepth: 2 })

      // All nodes should be visited (discovered within depth 2)
      expect(result.visited).toContain('A')
      expect(result.visited).toContain('B')
      expect(result.visited).toContain('C')
      expect(result.visited).toContain('D')
      expect(result.visited).toContain('E')
      expect(result.visited).toContain('F') // F is at distance 3, but discovered from nodes at depth 2
      
      // But visit order should only include nodes processed up to depth 2
      const processedNodes = result.visitOrder.map(n => n.id)
      expect(processedNodes).toContain('A') // depth 0
      expect(processedNodes).toContain('B') // depth 1
      expect(processedNodes).toContain('C') // depth 1
      expect(processedNodes).toContain('D') // depth 2
      expect(processedNodes).toContain('E') // depth 2
    })

    it('should handle directed edges', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'B', target: 'C', directed: true },
          { id: 'e3', source: 'C', target: 'A', directed: true },
        ]
      }

      const result = bfs(graph, 'A', { directed: true })
      expect(result.visitOrder.map(n => n.id)).toEqual(['A', 'B', 'C'])

      const reverseResult = bfs(graph, 'C', { directed: true })
      expect(reverseResult.visitOrder.map(n => n.id)).toEqual(['C', 'A', 'B'])
    })

    it('should apply node filter', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'A', {
        nodeFilter: (node) => !['C', 'E'].includes(node.id)
      })

      // Node filter only affects what goes into visitOrder, not what gets visited
      expect(result.visitOrder.map(n => n.id)).toEqual(['A', 'B', 'D', 'F'])
      // C and E are still visited (needed for traversal) but filtered from results
      expect(result.visited).toContain('C')
      expect(result.visited).toContain('E')
    })

    it('should apply edge filter', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'A', {
        edgeFilter: (edge) => edge.id !== 'e2' // Skip edge A-C
      })

      // Without edge A-C, we can't reach C and E directly from A
      // But we can reach them through other paths
      expect(result.visitOrder.map(n => n.id)).toEqual(['A', 'B', 'D', 'F', 'E', 'C'])
      expect(result.visited.size).toBe(6) // All nodes still reachable through alternative paths
    })

    it('should handle non-existent start node', () => {
      const graph = createTestGraph()
      const result = bfs(graph, 'Z')

      expect(result.visitOrder).toHaveLength(0)
      expect(result.visited.size).toBe(0)
      expect(result.distances.size).toBe(0)
    })

    it('should handle empty graph', () => {
      const graph = GraphUtils.empty()
      const result = bfs(graph, 'A')

      expect(result.visitOrder).toHaveLength(0)
      expect(result.visited.size).toBe(0)
    })
  })

  describe('shortestPath', () => {
    it('should find shortest path between nodes', () => {
      const graph = createTestGraph()
      const path = shortestPath(graph, 'A', 'F')

      expect(path).not.toBeNull()
      expect(path!).toEqual(['A', 'B', 'D', 'F'])
    })

    it('should return null for disconnected nodes', () => {
      const graph = createTestGraph()
      const path = shortestPath(graph, 'A', 'G')

      expect(path).toBeNull()
    })

    it('should handle same start and end node', () => {
      const graph = createTestGraph()
      const path = shortestPath(graph, 'A', 'A')

      expect(path).toEqual(['A'])
    })

    it('should respect directed edges', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'B', target: 'C', directed: true },
        ]
      }

      const forwardPath = shortestPath(graph, 'A', 'C', { directed: true })
      expect(forwardPath).toEqual(['A', 'B', 'C'])

      const backwardPath = shortestPath(graph, 'C', 'A', { directed: true })
      expect(backwardPath).toBeNull()
    })
  })

  describe('findNodesWithinDistance', () => {
    it('should find nodes within specified distance', () => {
      const graph = createTestGraph()
      
      const distance1 = findNodesWithinDistance(graph, 'A', 1)
      expect(distance1.map(n => n.id)).toEqual(['A', 'B', 'C'])

      const distance2 = findNodesWithinDistance(graph, 'A', 2)
      expect(distance2.map(n => n.id)).toEqual(['A', 'B', 'C', 'D', 'E'])

      const distance3 = findNodesWithinDistance(graph, 'A', 3)
      expect(distance3.map(n => n.id)).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
    })

    it('should return only start node for distance 0', () => {
      const graph = createTestGraph()
      const nodes = findNodesWithinDistance(graph, 'A', 0)

      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('A')
    })

    it('should handle isolated nodes', () => {
      const graph = createTestGraph()
      const nodes = findNodesWithinDistance(graph, 'G', 10)

      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('G')
    })
  })

  describe('findConnectedComponents', () => {
    it('should find all connected components', () => {
      const graph = createTestGraph()
      const components = findConnectedComponents(graph)

      expect(components).toHaveLength(2)
      
      const mainComponent = components.find(c => c.some(n => n.id === 'A'))
      expect(mainComponent).toBeDefined()
      expect(mainComponent!.map(n => n.id).sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])

      const isolatedComponent = components.find(c => c.some(n => n.id === 'G'))
      expect(isolatedComponent).toBeDefined()
      expect(isolatedComponent!).toHaveLength(1)
      expect(isolatedComponent![0].id).toBe('G')
    })

    it('should handle fully connected graph', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false },
          { id: 'e2', source: 'B', target: 'C', directed: false },
          { id: 'e3', source: 'C', target: 'A', directed: false },
        ]
      }

      const components = findConnectedComponents(graph)
      expect(components).toHaveLength(1)
      expect(components[0]).toHaveLength(3)
    })

    it('should handle graph with no edges', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: []
      }

      const components = findConnectedComponents(graph)
      expect(components).toHaveLength(3)
      components.forEach(c => expect(c).toHaveLength(1))
    })

    it('should respect edge filters', () => {
      const graph = createTestGraph()
      const components = findConnectedComponents(graph, {
        edgeFilter: (edge) => !['e3', 'e4', 'e5', 'e6'].includes(edge.id)
      })

      // With these edges removed, we should have more components
      expect(components.length).toBeGreaterThan(2)
    })
  })

  describe('Performance', () => {
    it('should handle large graphs efficiently', () => {
      // Create a graph with 1000 nodes
      const nodes = Array.from({ length: 1000 }, (_, i) => ({
        id: `n${i}`,
        label: `Node ${i}`
      }))

      // Create edges in a grid pattern
      const edges = []
      const gridSize = Math.floor(Math.sqrt(1000))
      for (let i = 0; i < 1000; i++) {
        const row = Math.floor(i / gridSize)
        const col = i % gridSize

        // Connect to right neighbor
        if (col < gridSize - 1 && i + 1 < 1000) {
          edges.push({
            id: `e-${i}-right`,
            source: `n${i}`,
            target: `n${i + 1}`,
            directed: false
          })
        }

        // Connect to bottom neighbor
        if (row < gridSize - 1 && i + gridSize < 1000) {
          edges.push({
            id: `e-${i}-bottom`,
            source: `n${i}`,
            target: `n${i + gridSize}`,
            directed: false
          })
        }
      }

      const largeGraph: Graph = { nodes, edges }

      const start = performance.now()
      const result = bfs(largeGraph, 'n0')
      const end = performance.now()

      expect(result.visited.size).toBeGreaterThan(900) // Most nodes should be reachable
      expect(end - start).toBeLessThan(500) // Should complete in under 500ms
    })
  })
})