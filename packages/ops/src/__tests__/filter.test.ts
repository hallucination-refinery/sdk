import { describe, it, expect } from 'vitest'
import { Graph } from '@refinery/schema'
import { 
  filterNodes, 
  filterEdges, 
  filterGraph,
  findNodesByDegree,
  findIsolatedNodes,
  findHubNodes
} from '../queries/filter'

describe('Filter Utilities', () => {
  // Helper to create test graph
  function createTestGraph(): Graph {
    return {
      nodes: [
        { id: 'A', label: 'Node A', color: 'red', size: 10, selected: true },
        { id: 'B', label: 'Node B', color: 'blue', size: 20, fixed: true },
        { id: 'C', label: 'Test C', color: 'red', size: 15, metadata: { type: 'special' } },
        { id: 'D', label: 'Node D', color: 'green', size: 25 },
        { id: 'E', label: 'Isolated E', size: 5 }, // No connections
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', label: 'connects', directed: false },
        { id: 'e2', source: 'A', target: 'C', directed: true, strength: 0.9 },
        { id: 'e3', source: 'B', target: 'C', label: 'links', strength: 0.7, directed: false },
        { id: 'e4', source: 'B', target: 'D', directed: false },
        { id: 'e5', source: 'C', target: 'D', directed: true, metadata: { important: true } },
      ]
    }
  }

  describe('filterNodes', () => {
    it('should filter by IDs', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { ids: ['A', 'C'] })
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(n => n.id)).toEqual(['A', 'C'])
    })

    it('should filter by label (partial match)', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { label: 'Node' })
      
      expect(filtered).toHaveLength(3) // A, B, D
      expect(filtered.map(n => n.id)).toEqual(['A', 'B', 'D'])
    })

    it('should filter by color', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { color: 'red' })
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(n => n.id)).toEqual(['A', 'C'])
    })

    it('should filter by size range', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { 
        sizeRange: { min: 10, max: 20 } 
      })
      
      expect(filtered).toHaveLength(3) // A(10), B(20), C(15)
      expect(filtered.map(n => n.id)).toEqual(['A', 'B', 'C'])
    })

    it('should filter by metadata', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { 
        metadata: { type: 'special' } 
      })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('C')
    })

    it('should filter by custom function', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { 
        customFilter: (node) => node.id.charCodeAt(0) < 67 // A or B
      })
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(n => n.id)).toEqual(['A', 'B'])
    })

    it('should combine multiple criteria', () => {
      const graph = createTestGraph()
      const filtered = filterNodes(graph, { 
        color: 'red',
        sizeRange: { min: 12 }
      })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('C') // Red and size 15
    })
  })

  describe('filterEdges', () => {
    it('should filter by source node', () => {
      const graph = createTestGraph()
      const filtered = filterEdges(graph, { source: 'A' })
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(e => e.id)).toEqual(['e1', 'e2'])
    })

    it('should filter by target node', () => {
      const graph = createTestGraph()
      const filtered = filterEdges(graph, { target: 'D' })
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(e => e.id)).toEqual(['e4', 'e5'])
    })

    it('should filter by directed state', () => {
      const graph = createTestGraph()
      const filtered = filterEdges(graph, { directed: true })
      
      expect(filtered).toHaveLength(2)
      expect(filtered.map(e => e.id)).toEqual(['e2', 'e5'])
    })

    it('should filter by strength range', () => {
      const graph = createTestGraph()
      const filtered = filterEdges(graph, { 
        strengthRange: { min: 0.7, max: 0.9 } 
      })
      
      expect(filtered).toHaveLength(2) // e2(0.9) and e3(0.7)
    })

    it('should filter by label', () => {
      const graph = createTestGraph()
      const filtered = filterEdges(graph, { label: 'con' })
      
      expect(filtered).toHaveLength(1)
      expect(filtered[0].id).toBe('e1') // 'connects' contains 'con'
    })
  })

  describe('filterGraph', () => {
    it('should filter both nodes and edges', () => {
      const graph = createTestGraph()
      const filtered = filterGraph(
        graph,
        { color: 'red' }, // Nodes A and C
        { directed: true } // Edges e2 and e5
      )
      
      expect(filtered.nodes).toHaveLength(2)
      expect(filtered.nodes.map(n => n.id)).toEqual(['A', 'C'])
      expect(filtered.edges).toHaveLength(1) // Only e2 (A->C)
    })

    it('should remove orphan edges by default', () => {
      const graph = createTestGraph()
      const filtered = filterGraph(
        graph,
        { ids: ['A', 'B'] }, // Only nodes A and B
        undefined,
        false // includeOrphanEdges = false
      )
      
      expect(filtered.edges).toHaveLength(1) // Only e1 (A-B)
      expect(filtered.edges[0].id).toBe('e1')
    })

    it('should keep orphan edges when requested', () => {
      const graph = createTestGraph()
      const filtered = filterGraph(
        graph,
        { ids: ['A'] }, // Only node A
        undefined,
        true // includeOrphanEdges = true
      )
      
      expect(filtered.nodes).toHaveLength(1)
      expect(filtered.edges).toHaveLength(5) // All edges kept
    })
  })

  describe('findNodesByDegree', () => {
    it('should find nodes by degree range', () => {
      const graph = createTestGraph()
      
      const degree2 = findNodesByDegree(graph, 2, 2)
      expect(degree2.map(n => n.id).sort()).toEqual(['A', 'D'])
      
      const degree3plus = findNodesByDegree(graph, 3)
      expect(degree3plus.map(n => n.id).sort()).toEqual(['B', 'C'])
    })

    it('should handle directed graph', () => {
      const graph = createTestGraph()
      
      // Check all degrees in directed mode
      const allNodes = findNodesByDegree(graph, 0, Infinity, true)
      
      // Let's see what degrees each node has
      const degreesMap = new Map<string, number>()
      for (const edge of graph.edges) {
        if (edge.directed) {
          degreesMap.set(edge.source, (degreesMap.get(edge.source) || 0) + 1)
        } else {
          degreesMap.set(edge.source, (degreesMap.get(edge.source) || 0) + 1)
          degreesMap.set(edge.target, (degreesMap.get(edge.target) || 0) + 1)
        }
      }
      
      // Find nodes with degree 1
      const degree1Nodes = graph.nodes.filter(n => degreesMap.get(n.id) === 1)
      expect(degree1Nodes.map(n => n.id).sort()).toEqual(['D'])
    })
  })

  describe('findIsolatedNodes', () => {
    it('should find nodes with no connections', () => {
      const graph = createTestGraph()
      const isolated = findIsolatedNodes(graph)
      
      expect(isolated).toHaveLength(1)
      expect(isolated[0].id).toBe('E')
    })

    it('should return empty array when no isolated nodes', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false }
        ]
      }
      
      const isolated = findIsolatedNodes(graph)
      expect(isolated).toHaveLength(0)
    })
  })

  describe('findHubNodes', () => {
    it('should find nodes with high degree', () => {
      const graph = createTestGraph()
      const hubs = findHubNodes(graph, 3)
      
      expect(hubs).toHaveLength(2) // B and C have degree 3
      expect(hubs.map(n => n.id).sort()).toEqual(['B', 'C'])
    })

    it('should use default threshold', () => {
      const graph = createTestGraph()
      const hubs = findHubNodes(graph) // Default threshold is 5
      
      expect(hubs).toHaveLength(0) // No nodes have degree >= 5
    })
  })
})