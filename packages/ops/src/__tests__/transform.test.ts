import { describe, it, expect } from 'vitest'
import { Graph, GraphUtils } from '@refinery/schema'
import { 
  mapNodes, 
  mapEdges, 
  transformGraph,
  mergeGraphs,
  subgraph,
  reverseEdges,
  removeDuplicateEdges,
  contractNodes
} from '../transformations/transform'

describe('Transform Utilities', () => {
  // Helper to create test graph
  function createTestGraph(): Graph {
    return {
      nodes: [
        { id: 'A', label: 'Node A', size: 10 },
        { id: 'B', label: 'Node B', size: 20 },
        { id: 'C', label: 'Node C', size: 30 },
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', directed: true },
        { id: 'e2', source: 'B', target: 'C', directed: false },
      ]
    }
  }

  describe('mapNodes', () => {
    it('should transform all nodes', () => {
      const graph = createTestGraph()
      const result = mapNodes(graph, node => ({
        ...node,
        size: (node.size || 0) * 2
      }))

      expect(result.nodes).toHaveLength(3)
      expect(result.nodes[0].size).toBe(20)
      expect(result.nodes[1].size).toBe(40)
      expect(result.nodes[2].size).toBe(60)
    })

    it('should preserve graph structure', () => {
      const graph = createTestGraph()
      const result = mapNodes(graph, node => ({ ...node, label: node.label.toUpperCase() }))

      expect(result.edges).toEqual(graph.edges)
      expect(result.nodes[0].label).toBe('NODE A')
    })
  })

  describe('mapEdges', () => {
    it('should transform all edges', () => {
      const graph = createTestGraph()
      const result = mapEdges(graph, edge => ({
        ...edge,
        weight: 1.5
      }))

      expect(result.edges).toHaveLength(2)
      expect(result.edges[0].weight).toBe(1.5)
      expect(result.edges[1].weight).toBe(1.5)
    })
  })

  describe('transformGraph', () => {
    it('should transform both nodes and edges', () => {
      const graph = createTestGraph()
      const result = transformGraph(
        graph,
        node => ({ ...node, color: 'blue' }),
        edge => ({ ...edge, weight: 2 })
      )

      expect(result.nodes.every(n => n.color === 'blue')).toBe(true)
      expect(result.edges.every(e => e.weight === 2)).toBe(true)
    })
  })

  describe('mergeGraphs', () => {
    it('should merge multiple graphs', () => {
      const graph1: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false }
        ]
      }

      const graph2: Graph = {
        nodes: [
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
        ],
        edges: [
          { id: 'e2', source: 'C', target: 'D', directed: false }
        ]
      }

      const merged = mergeGraphs([graph1, graph2])
      expect(merged.nodes).toHaveLength(4)
      expect(merged.edges).toHaveLength(2)
    })

    it('should handle duplicate nodes with keep-first strategy', () => {
      const graph1 = GraphUtils.empty()
      const graph2 = GraphUtils.empty()
      
      graph1.nodes = [{ id: 'A', label: 'First A' }]
      graph2.nodes = [{ id: 'A', label: 'Second A' }]

      const merged = mergeGraphs([graph1, graph2], { 
        duplicateNodeStrategy: 'keep-first' 
      })
      
      expect(merged.nodes).toHaveLength(1)
      expect(merged.nodes[0].label).toBe('First A')
    })
  })

  describe('subgraph', () => {
    it('should extract subgraph with specified nodes', () => {
      const graph = createTestGraph()
      const sub = subgraph(graph, ['A', 'B'])

      expect(sub.nodes).toHaveLength(2)
      expect(sub.edges).toHaveLength(1) // Only e1 (A->B)
    })

    it('should exclude edges when requested', () => {
      const graph = createTestGraph()
      // includeEdges = false means no edges in the subgraph
      const sub = subgraph(graph, ['A', 'B'], false)

      expect(sub.nodes).toHaveLength(2)
      expect(sub.edges).toHaveLength(0)
    })
  })

  describe('reverseEdges', () => {
    it('should reverse all edges', () => {
      const graph = createTestGraph()
      const reversed = reverseEdges(graph)

      expect(reversed.edges[0].source).toBe('B')
      expect(reversed.edges[0].target).toBe('A')
      expect(reversed.edges[1].source).toBe('C')
      expect(reversed.edges[1].target).toBe('B')
    })
  })

  describe('removeDuplicateEdges', () => {
    it('should remove duplicate edges', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false },
          { id: 'e2', source: 'A', target: 'B', directed: false },
          { id: 'e3', source: 'B', target: 'A', directed: false }, // Same undirected edge
        ]
      }

      const cleaned = removeDuplicateEdges(graph)
      expect(cleaned.edges).toHaveLength(1)
    })
  })

  describe('contractNodes', () => {
    it('should merge nodes into one', () => {
      const graph = createTestGraph()
      const contracted = contractNodes(graph, ['A', 'B'])

      expect(contracted.nodes).toHaveLength(2) // A (merged with B) and C
      expect(contracted.nodes.find(n => n.id === 'A')).toBeDefined()
      expect(contracted.nodes.find(n => n.id === 'B')).toBeUndefined()
    })

    it('should update edges after contraction', () => {
      const graph = createTestGraph()
      const contracted = contractNodes(graph, ['B', 'C'])

      expect(contracted.edges).toHaveLength(1)
      expect(contracted.edges[0].source).toBe('A')
      expect(contracted.edges[0].target).toBe('B') // C merged into B
    })

    it('should use custom merge strategy', () => {
      const graph = createTestGraph()
      const contracted = contractNodes(graph, ['A', 'B'], 'A', (nodes) => ({
        label: 'Merged',
        size: nodes.reduce((sum, n) => sum + (n.size || 0), 0)
      }))

      const merged = contracted.nodes.find(n => n.id === 'A')
      expect(merged?.label).toBe('Merged')
      expect(merged?.size).toBe(30) // 10 + 20
    })
  })
})