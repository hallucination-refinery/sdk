import { describe, it, expect, beforeEach } from 'vitest'
import {
  GraphSchema,
  GraphUtils,
  type Graph,
  type IdeaNode,
  type Edge,
} from '../index'

describe('GraphSchema', () => {
  describe('validation', () => {
    it('should validate empty graph', () => {
      const graph = {
        nodes: [],
        edges: [],
      }
      const result = GraphSchema.safeParse(graph)
      expect(result.success).toBe(true)
    })

    it('should validate complete graph', () => {
      const graph: Graph = {
        id: 'graph-1',
        name: 'Test Graph',
        description: 'A test graph',
        nodes: [
          { id: 'n1', label: 'Node 1' },
          { id: 'n2', label: 'Node 2' },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', type: 'relates-to', strength: 1, directed: false, visible: true },
        ],
        metadata: { version: 1 },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
      }
      const result = GraphSchema.safeParse(graph)
      expect(result.success).toBe(true)
    })

    it('should reject invalid graphs', () => {
      expect(GraphSchema.safeParse({}).success).toBe(false) // missing required fields
      expect(GraphSchema.safeParse({ nodes: [] }).success).toBe(false) // missing edges
      expect(GraphSchema.safeParse({ edges: [] }).success).toBe(false) // missing nodes
    })

    it('should validate nested node and edge schemas', () => {
      const graph = {
        nodes: [{ id: 'n1' }], // invalid node (missing label)
        edges: [],
      }
      expect(GraphSchema.safeParse(graph).success).toBe(false)
    })
  })
})

describe('GraphUtils', () => {
  let sampleGraph: Graph
  let nodes: IdeaNode[]
  let edges: Edge[]

  beforeEach(() => {
    nodes = [
      { id: 'n1', label: 'Node 1' },
      { id: 'n2', label: 'Node 2' },
      { id: 'n3', label: 'Node 3' },
      { id: 'n4', label: 'Node 4' }, // orphaned node
    ]

    edges = [
      { id: 'e1', source: 'n1', target: 'n2', type: 'relates-to', strength: 1, directed: false, visible: true },
      { id: 'e2', source: 'n2', target: 'n3', type: 'depends-on', strength: 0.8, directed: true, visible: true },
      { id: 'e3', source: 'n1', target: 'n3', type: 'relates-to', strength: 0.5, directed: false, visible: true },
    ]

    sampleGraph = { nodes, edges }
  })

  describe('empty graph', () => {
    it('should create empty graph', () => {
      const empty = GraphUtils.empty()
      expect(empty.nodes).toEqual([])
      expect(empty.edges).toEqual([])
    })
  })

  describe('node operations', () => {
    it('should get node by ID', () => {
      const node = GraphUtils.getNode(sampleGraph, 'n2')
      expect(node).toBeDefined()
      expect(node?.label).toBe('Node 2')
    })

    it('should return undefined for non-existent node', () => {
      expect(GraphUtils.getNode(sampleGraph, 'n99')).toBeUndefined()
    })

    it('should get node edges', () => {
      const edges = GraphUtils.getNodeEdges(sampleGraph, 'n1')
      expect(edges).toHaveLength(2)
      expect(edges.map(e => e.id).sort()).toEqual(['e1', 'e3'])
    })

    it('should get node neighbors', () => {
      const neighbors = GraphUtils.getNodeNeighbors(sampleGraph, 'n2')
      expect(neighbors.nodeId).toBe('n2')
      expect(neighbors.incoming).toEqual([]) // no directed edges pointing to n2
      expect(neighbors.outgoing).toEqual(['n3']) // n2 -> n3 via directed edge e2
      expect(neighbors.undirected).toEqual(['n1']) // connected via undirected edge e1
    })

    it('should add node', () => {
      const newNode: IdeaNode = { id: 'n5', label: 'Node 5' }
      const updated = GraphUtils.addNode(sampleGraph, newNode)
      
      expect(updated.nodes).toHaveLength(5)
      expect(updated.nodes[4]).toEqual(newNode)
      expect(updated.updatedAt).toBeDefined()
    })

    it('should remove node and connected edges', () => {
      const updated = GraphUtils.removeNode(sampleGraph, 'n2')
      
      expect(updated.nodes).toHaveLength(3)
      expect(updated.nodes.find(n => n.id === 'n2')).toBeUndefined()
      
      // Should remove edges e1 and e2 which connect to n2
      expect(updated.edges).toHaveLength(1)
      expect(updated.edges[0].id).toBe('e3')
    })

    it('should update node', () => {
      const updated = GraphUtils.updateNode(sampleGraph, 'n1', { label: 'Updated Node 1', color: '#ff0000' })
      
      const node = updated.nodes.find(n => n.id === 'n1')
      expect(node?.label).toBe('Updated Node 1')
      expect(node?.color).toBe('#ff0000')
      expect(node?.updatedAt).toBeDefined()
    })
  })

  describe('edge operations', () => {
    it('should get edge by ID', () => {
      const edge = GraphUtils.getEdge(sampleGraph, 'e2')
      expect(edge).toBeDefined()
      expect(edge?.type).toBe('depends-on')
    })

    it('should add edge', () => {
      const newEdge: Edge = {
        id: 'e4',
        source: 'n3',
        target: 'n4',
        type: 'relates-to',
        strength: 1,
        directed: false,
        visible: true,
      }
      const updated = GraphUtils.addEdge(sampleGraph, newEdge)
      
      expect(updated.edges).toHaveLength(4)
      expect(updated.edges[3]).toEqual(newEdge)
    })

    it('should remove edge', () => {
      const updated = GraphUtils.removeEdge(sampleGraph, 'e2')
      
      expect(updated.edges).toHaveLength(2)
      expect(updated.edges.find(e => e.id === 'e2')).toBeUndefined()
    })

    it('should update edge', () => {
      const updated = GraphUtils.updateEdge(sampleGraph, 'e1', { strength: 0.3, color: '#00ff00' })
      
      const edge = updated.edges.find(e => e.id === 'e1')
      expect(edge?.strength).toBe(0.3)
      expect(edge?.color).toBe('#00ff00')
    })
  })

  describe('graph statistics', () => {
    it('should calculate basic stats', () => {
      const stats = GraphUtils.getStats(sampleGraph)
      
      expect(stats.nodeCount).toBe(4)
      expect(stats.edgeCount).toBe(3)
      expect(stats.density).toBeCloseTo(0.5) // 3 edges / 6 possible
      expect(stats.averageDegree).toBe(1.5) // 6 total degrees / 4 nodes
      expect(stats.connectedComponents).toBe(1) // placeholder
    })

    it('should handle empty graph stats', () => {
      const stats = GraphUtils.getStats(GraphUtils.empty())
      
      expect(stats.nodeCount).toBe(0)
      expect(stats.edgeCount).toBe(0)
      expect(stats.density).toBe(0)
      expect(stats.averageDegree).toBe(0)
      expect(stats.connectedComponents).toBe(0)
    })
  })

  describe('validation', () => {
    it('should validate reference integrity', () => {
      expect(GraphUtils.validateReferences(sampleGraph)).toBe(true)
      
      // Add edge with invalid reference
      const invalidGraph: Graph = {
        nodes: sampleGraph.nodes,
        edges: [
          ...sampleGraph.edges,
          { id: 'e99', source: 'n1', target: 'n99', type: 'relates-to', strength: 1, directed: false, visible: true },
        ],
      }
      
      expect(GraphUtils.validateReferences(invalidGraph)).toBe(false)
    })
  })

  describe('orphaned nodes', () => {
    it('should find orphaned nodes', () => {
      const orphans = GraphUtils.getOrphanedNodes(sampleGraph)
      
      expect(orphans).toHaveLength(1)
      expect(orphans[0].id).toBe('n4')
    })

    it('should handle graph with no orphans', () => {
      const connected: Graph = {
        nodes: nodes.slice(0, 3), // exclude n4
        edges,
      }
      
      expect(GraphUtils.getOrphanedNodes(connected)).toHaveLength(0)
    })
  })
})