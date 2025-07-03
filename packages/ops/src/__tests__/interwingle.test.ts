import { describe, it, expect } from 'vitest'
import { Graph } from '@refinery/schema'
import { interwingle, suggestConnections } from '../algorithms/interwingle'

describe('Interwingle Algorithm', () => {
  // Helper to create test graph with interesting connections
  function createTestGraph(): Graph {
    return {
      nodes: [
        { id: 'A', label: 'Machine Learning' },
        { id: 'B', label: 'Neural Networks' },
        { id: 'C', label: 'Deep Learning' },
        { id: 'D', label: 'Computer Vision' },
        { id: 'E', label: 'Natural Language Processing' },
        { id: 'F', label: 'Data Science' },
        { id: 'G', label: 'Statistics' },
        { id: 'H', label: 'Mathematics' },
        { id: 'I', label: 'Linear Algebra' },
        { id: 'J', label: 'Calculus' },
      ],
      edges: [
        // ML core connections
        { id: 'e1', source: 'A', target: 'B', directed: false },
        { id: 'e2', source: 'B', target: 'C', directed: false },
        { id: 'e3', source: 'A', target: 'F', directed: false },
        
        // Deep Learning applications
        { id: 'e4', source: 'C', target: 'D', directed: false },
        { id: 'e5', source: 'C', target: 'E', directed: false },
        
        // Data Science foundations
        { id: 'e6', source: 'F', target: 'G', directed: false },
        { id: 'e7', source: 'G', target: 'H', directed: false },
        
        // Math foundations
        { id: 'e8', source: 'H', target: 'I', directed: false },
        { id: 'e9', source: 'H', target: 'J', directed: false },
        
        // Cross connections
        { id: 'e10', source: 'B', target: 'I', directed: false }, // Neural nets need linear algebra
      ]
    }
  }

  describe('interwingle', () => {
    it('should analyze node connections', () => {
      const graph = createTestGraph()
      const analysis = interwingle(graph, 'A')

      expect(analysis.nodeId).toBe('A')
      expect(analysis.connections.size).toBeGreaterThan(0)
      expect(analysis.rankedConnections).toBeDefined()
      expect(analysis.clusteringCoefficient).toBeGreaterThanOrEqual(0)
      expect(analysis.clusteringCoefficient).toBeLessThanOrEqual(1)
      expect(analysis.betweennessCentrality).toBeGreaterThanOrEqual(0)
    })

    it('should identify direct connections with high strength', () => {
      const graph = createTestGraph()
      const analysis = interwingle(graph, 'A')

      // Direct neighbors should have high connection strength
      const bConnection = analysis.connections.get('B')
      const fConnection = analysis.connections.get('F')

      expect(bConnection).toBeDefined()
      expect(bConnection!.direct).toBe(1)
      expect(bConnection!.combined).toBeGreaterThan(0.5)

      expect(fConnection).toBeDefined()
      expect(fConnection!.direct).toBe(1)
      expect(fConnection!.combined).toBeGreaterThan(0.5)
    })

    it('should identify indirect connections through shared neighbors', () => {
      const graph = createTestGraph()
      const analysis = interwingle(graph, 'A')

      // C is connected through B (shared neighbor)
      const cConnection = analysis.connections.get('C')
      expect(cConnection).toBeDefined()
      expect(cConnection!.direct).toBe(0)
      expect(cConnection!.indirect).toBeGreaterThan(0)
      expect(cConnection!.sharedNeighbors).toContain('B')
    })

    it('should rank connections by strength', () => {
      const graph = createTestGraph()
      const analysis = interwingle(graph, 'A')

      expect(analysis.rankedConnections.length).toBeGreaterThan(0)
      
      // Verify ranking is in descending order
      for (let i = 1; i < analysis.rankedConnections.length; i++) {
        expect(analysis.rankedConnections[i - 1].strength)
          .toBeGreaterThanOrEqual(analysis.rankedConnections[i].strength)
      }

      // Direct connections should typically rank higher
      const topConnections = analysis.rankedConnections.slice(0, 3).map(c => c.nodeId)
      expect(topConnections).toContain('B')
      expect(topConnections).toContain('F')
    })

    it('should calculate clustering coefficient correctly', () => {
      const graph = createTestGraph()
      
      // Node B has neighbors A, C, and I
      // Edges between neighbors: A-F (no), C-I (no), so coefficient should be 0
      const analysisB = interwingle(graph, 'B')
      expect(analysisB.clusteringCoefficient).toBe(0)

      // Node H has neighbors G, I, J
      // No edges between G-I, G-J, or I-J, so coefficient should be 0
      const analysisH = interwingle(graph, 'H')
      expect(analysisH.clusteringCoefficient).toBe(0)
    })

    it('should respect maxDepth option', () => {
      const graph = createTestGraph()
      
      const analysis1 = interwingle(graph, 'A', { maxDepth: 1 })
      const analysis2 = interwingle(graph, 'A', { maxDepth: 3 })

      // Deeper search should find more connections
      expect(analysis2.connections.size).toBeGreaterThanOrEqual(analysis1.connections.size)
    })

    it('should respect minStrength threshold', () => {
      const graph = createTestGraph()
      
      const analysisLow = interwingle(graph, 'A', { minStrength: 0.1 })
      const analysisHigh = interwingle(graph, 'A', { minStrength: 0.5 })

      // Higher threshold should filter out more connections
      expect(analysisHigh.connections.size).toBeLessThanOrEqual(analysisLow.connections.size)
    })

    it('should handle directed graphs', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'B', target: 'C', directed: true },
          { id: 'e3', source: 'C', target: 'D', directed: true },
          { id: 'e4', source: 'D', target: 'A', directed: true },
        ]
      }

      const analysis = interwingle(graph, 'A', { directed: true })
      
      // In directed graph, only B should be directly connected from A
      const bConnection = analysis.connections.get('B')
      expect(bConnection).toBeDefined()
      expect(bConnection!.direct).toBe(1)

      // D points to A, not from A
      const dConnection = analysis.connections.get('D')
      expect(dConnection).toBeDefined()
      expect(dConnection!.direct).toBe(0)
    })

    it('should handle isolated nodes', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' }, // Isolated
        ],
        edges: []
      }

      const analysis = interwingle(graph, 'A')
      expect(analysis.connections.size).toBe(0)
      expect(analysis.clusteringCoefficient).toBe(0)
      expect(analysis.betweennessCentrality).toBe(0)
    })
  })

  describe('suggestConnections', () => {
    it('should suggest potential connections', () => {
      const graph = createTestGraph()
      const suggestions = suggestConnections(graph, 'D', 5)

      expect(suggestions.length).toBeGreaterThan(0)
      expect(suggestions.length).toBeLessThanOrEqual(5)

      // Each suggestion should have required fields
      suggestions.forEach(suggestion => {
        expect(suggestion.nodeId).toBeDefined()
        expect(suggestion.strength).toBeGreaterThan(0)
        expect(suggestion.strength).toBeLessThanOrEqual(1)
        expect(suggestion.reason).toBeDefined()
      })
    })

    it('should not suggest already connected nodes', () => {
      const graph = createTestGraph()
      const suggestions = suggestConnections(graph, 'A')

      // Should not suggest B or F (already connected)
      const suggestedIds = suggestions.map(s => s.nodeId)
      expect(suggestedIds).not.toContain('B')
      expect(suggestedIds).not.toContain('F')
    })

    it('should provide meaningful reasons', () => {
      const graph = createTestGraph()
      const suggestions = suggestConnections(graph, 'A')

      suggestions.forEach(suggestion => {
        expect(suggestion.reason).toBeTruthy()
        expect(
          suggestion.reason.includes('Shares') || 
          suggestion.reason.includes('Connected through')
        ).toBe(true)
      })
    })

    it('should respect limit parameter', () => {
      const graph = createTestGraph()
      
      const suggestions1 = suggestConnections(graph, 'A', 1)
      expect(suggestions1.length).toBeLessThanOrEqual(1)

      const suggestions5 = suggestConnections(graph, 'A', 5)
      expect(suggestions5.length).toBeLessThanOrEqual(5)

      const suggestionsAll = suggestConnections(graph, 'A', 100)
      expect(suggestionsAll.length).toBeLessThanOrEqual(graph.nodes.length - 1)
    })

    it('should rank suggestions by strength', () => {
      const graph = createTestGraph()
      const suggestions = suggestConnections(graph, 'A', 10)

      // Verify suggestions are sorted by strength
      for (let i = 1; i < suggestions.length; i++) {
        expect(suggestions[i - 1].strength)
          .toBeGreaterThanOrEqual(suggestions[i].strength)
      }
    })

    it('should handle nodes with no suggestions', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false }
        ]
      }

      // A is already connected to all other nodes
      const suggestions = suggestConnections(graph, 'A')
      expect(suggestions).toHaveLength(0)
    })
  })

  describe('Performance', () => {
    it('should handle large graphs efficiently', () => {
      // Create a graph with 100 nodes in a small-world topology
      const nodes = Array.from({ length: 100 }, (_, i) => ({
        id: `n${i}`,
        label: `Node ${i}`
      }))

      const edges = []
      // Create ring topology
      for (let i = 0; i < 100; i++) {
        edges.push({
          id: `e-ring-${i}`,
          source: `n${i}`,
          target: `n${(i + 1) % 100}`,
          directed: false
        })
      }

      // Add some random shortcuts for small-world property
      for (let i = 0; i < 20; i++) {
        const source = Math.floor(Math.random() * 100)
        const target = Math.floor(Math.random() * 100)
        if (source !== target) {
          edges.push({
            id: `e-shortcut-${i}`,
            source: `n${source}`,
            target: `n${target}`,
            directed: false
          })
        }
      }

      const largeGraph: Graph = { nodes, edges }

      const start = performance.now()
      const analysis = interwingle(largeGraph, 'n0', { maxDepth: 3 })
      const end = performance.now()

      expect(analysis.connections.size).toBeGreaterThan(0)
      expect(end - start).toBeLessThan(5000) // Should complete in under 5s
    })
  })
})