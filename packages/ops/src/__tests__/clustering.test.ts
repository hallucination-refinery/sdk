import { describe, it, expect } from 'vitest'
import { Graph } from '@refinery/schema'
import { clusterByComponents, clusterByStrength, clusterKMeans } from '../algorithms/clustering'

describe('Clustering Algorithms', () => {
  // Helper to create test graph with multiple components
  function createMultiComponentGraph(): Graph {
    return {
      nodes: [
        // Component 1
        { id: 'A', label: 'Node A' },
        { id: 'B', label: 'Node B' },
        { id: 'C', label: 'Node C' },
        // Component 2
        { id: 'D', label: 'Node D' },
        { id: 'E', label: 'Node E' },
        { id: 'F', label: 'Node F' },
        // Isolated node
        { id: 'G', label: 'Node G' },
      ],
      edges: [
        // Component 1 edges
        { id: 'e1', source: 'A', target: 'B', directed: false },
        { id: 'e2', source: 'B', target: 'C', directed: false },
        { id: 'e3', source: 'C', target: 'A', directed: false },
        // Component 2 edges
        { id: 'e4', source: 'D', target: 'E', directed: false },
        { id: 'e5', source: 'E', target: 'F', directed: false },
      ]
    }
  }

  describe('clusterByComponents', () => {
    it('should identify connected components as clusters', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterByComponents(graph)

      expect(clusters).toHaveLength(2) // Two components with minSize=2
      
      // Check first cluster
      const cluster1 = clusters.find(c => c.nodes.some(n => n.id === 'A'))
      expect(cluster1).toBeDefined()
      expect(cluster1!.nodes).toHaveLength(3)
      expect(cluster1!.metrics.density).toBeGreaterThan(0)
      expect(cluster1!.metrics.cohesion).toBeGreaterThan(0)
      expect(cluster1!.centerId).toBeDefined()

      // Check second cluster
      const cluster2 = clusters.find(c => c.nodes.some(n => n.id === 'D'))
      expect(cluster2).toBeDefined()
      expect(cluster2!.nodes).toHaveLength(3)
    })

    it('should respect minSize option', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterByComponents(graph, { minSize: 1 })

      expect(clusters).toHaveLength(3) // Including isolated node
    })

    it('should respect maxSize option', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterByComponents(graph, { maxSize: 2 })

      expect(clusters).toHaveLength(0) // All components have 3 nodes
    })

    it('should calculate cluster metrics correctly', () => {
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

      const clusters = clusterByComponents(graph)
      expect(clusters).toHaveLength(1)
      
      const cluster = clusters[0]
      expect(cluster.metrics.density).toBe(1) // Fully connected
      expect(cluster.metrics.avgInternalDistance).toBe(1) // All nodes 1 hop apart
      expect(cluster.metrics.cohesion).toBeGreaterThan(0.5)
    })
  })

  describe('clusterByStrength', () => {
    it('should cluster nodes by connection strength', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false },
          { id: 'e2', source: 'B', target: 'C', directed: false },
          { id: 'e3', source: 'A', target: 'C', directed: false }, // Triangle A-B-C
          { id: 'e4', source: 'C', target: 'D', directed: false }, // Weak connection
        ]
      }

      const clusters = clusterByStrength(graph, { minStrength: 0.3 })
      expect(clusters.length).toBeGreaterThan(0)
      
      // A, B, C should likely be in the same cluster due to strong connections
      const mainCluster = clusters.find(c => 
        c.nodes.some(n => n.id === 'A') &&
        c.nodes.some(n => n.id === 'B') &&
        c.nodes.some(n => n.id === 'C')
      )
      expect(mainCluster).toBeDefined()
    })

    it('should respect size constraints', () => {
      const graph: Graph = {
        nodes: Array.from({ length: 6 }, (_, i) => ({
          id: `n${i}`,
          label: `Node ${i}`
        })),
        edges: Array.from({ length: 5 }, (_, i) => ({
          id: `e${i}`,
          source: `n${i}`,
          target: `n${i + 1}`,
          directed: false
        }))
      }

      const clusters = clusterByStrength(graph, { 
        minSize: 2,
        maxSize: 3,
        minStrength: 0.1
      })

      clusters.forEach(cluster => {
        expect(cluster.nodes.length).toBeGreaterThanOrEqual(2)
        expect(cluster.nodes.length).toBeLessThanOrEqual(3)
      })
    })
  })

  describe('clusterKMeans', () => {
    it('should create k clusters', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterKMeans(graph, 2)

      expect(clusters).toHaveLength(2)
      clusters.forEach(cluster => {
        expect(cluster.nodes.length).toBeGreaterThan(0)
        expect(cluster.centerId).toBeDefined()
        expect(cluster.metrics).toBeDefined()
      })
    })

    it('should handle k=1', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterKMeans(graph, 1)

      expect(clusters).toHaveLength(1)
      expect(clusters[0].nodes.length).toBe(graph.nodes.length)
    })

    it('should handle k greater than nodes', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
        ],
        edges: []
      }

      const clusters = clusterKMeans(graph, 5)
      expect(clusters).toHaveLength(0)
    })

    it('should converge within max iterations', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterKMeans(graph, 3, { maxIterations: 10 })

      expect(clusters.length).toBeGreaterThan(0)
      expect(clusters.length).toBeLessThanOrEqual(3)
    })

    it('should respect size constraints', () => {
      const graph = createMultiComponentGraph()
      const clusters = clusterKMeans(graph, 3, { 
        minSize: 2,
        maxSize: 3 
      })

      clusters.forEach(cluster => {
        expect(cluster.nodes.length).toBeGreaterThanOrEqual(2)
        expect(cluster.nodes.length).toBeLessThanOrEqual(3)
      })
    })
  })
})