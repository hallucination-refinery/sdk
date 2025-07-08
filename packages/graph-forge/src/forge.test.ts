import { describe, it, expect } from 'vitest'
import { forgeGraph } from './forge'
import type { RawMemory } from './schemas'

describe('forgeGraph detailed tests', () => {
  describe('node creation', () => {
    it('creates IdeaNode with all required fields', () => {
      const memories: RawMemory[] = [{
        id: 'test_001',
        content: 'Test memory content that is longer than 50 characters to test truncation',
        cluster: 'work',
        metadata: { custom: 'value' },
      }]
      
      const result = forgeGraph(memories)
      const node = result.nodes[0]
      
      expect(node.id).toBe('test_001')
      expect(node.label).toBe('Test memory content that is longer than 50 charact...')
      expect(node.content).toBe('Test memory content that is longer than 50 characters to test truncation')
      expect(node.color).toBe('#06b6d4') // Cyan for work cluster
      expect(node.size).toBe(1)
      expect(node.selected).toBe(false)
      expect(node.hovered).toBe(false)
      expect(node.fixed).toBe(false)
      expect(node.metadata?.cluster).toBe('work')
      expect(node.metadata?.custom).toBe('value')
      expect(node.metadata?.raw).toEqual(memories[0])
      expect(node.position).toBeDefined()
      expect(node.velocity).toEqual({ x: 0, y: 0, z: 0 })
    })

    it('assigns correct colors based on cluster', () => {
      const clusters = ['personal', 'work', 'ideas', 'reference', 'project', 'archive', 'unknown']
      const expectedColors = ['#6366f1', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#6b7280', '#94a3b8']
      
      const memories: RawMemory[] = clusters.map((cluster, i) => ({
        id: `mem_${i}`,
        content: `Memory in ${cluster}`,
        cluster,
      }))
      
      const result = forgeGraph(memories)
      
      result.nodes.forEach((node, i) => {
        expect(node.color).toBe(expectedColors[i])
      })
    })
  })

  describe('edge creation', () => {
    it('creates bidirectional edges correctly', () => {
      const memories: RawMemory[] = [
        {
          id: 'A',
          content: 'Node A',
          connections: ['B'],
        },
        {
          id: 'B',
          content: 'Node B',
          connections: ['A'],
        },
      ]
      
      const result = forgeGraph(memories)
      
      // Should create only one edge between A and B
      expect(result.edges).toHaveLength(1)
      
      const edge = result.edges[0]
      expect([edge.source, edge.target].sort()).toEqual(['A', 'B'])
      expect(edge.directed).toBe(false)
      expect(edge.type).toBe('relates-to')
      expect(edge.strength).toBe(0.5)
      expect(edge.color).toBe('#94a3b8')
      expect(edge.width).toBe(1)
      expect(edge.visible).toBe(true)
    })

    it('handles self-connections', () => {
      const memories: RawMemory[] = [
        {
          id: 'self',
          content: 'Self-referential',
          connections: ['self'],
        },
      ]
      
      const result = forgeGraph(memories)
      
      expect(result.edges).toHaveLength(1)
      expect(result.edges[0].source).toBe('self')
      expect(result.edges[0].target).toBe('self')
    })

    it('creates multiple edges from one source', () => {
      const memories: RawMemory[] = [
        {
          id: 'hub',
          content: 'Hub node',
          connections: ['A', 'B', 'C'],
        },
        { id: 'A', content: 'Node A' },
        { id: 'B', content: 'Node B' },
        { id: 'C', content: 'Node C' },
      ]
      
      const result = forgeGraph(memories)
      
      const hubEdges = result.edges.filter(e => 
        e.source === 'hub' || e.target === 'hub'
      )
      expect(hubEdges).toHaveLength(3)
    })
  })

  describe('force simulation', () => {
    it('maintains initial positions with minimal iterations', () => {
      const memories: RawMemory[] = [
        {
          id: 'fixed',
          content: 'Fixed position',
          position: [50, 50, 50],
        },
      ]
      
      const result = forgeGraph(memories, {
        simulation: { iterations: 1 }, // Minimal iterations
      })
      
      const node = result.nodes[0]
      // With only 1 iteration, position should barely change
      expect(Math.abs(node.position!.x - 50)).toBeLessThan(5)
      expect(Math.abs(node.position!.y - 50)).toBeLessThan(5)
      expect(Math.abs(node.position!.z - 50)).toBeLessThan(5)
    })

    it('applies bounds constraints', () => {
      const memories: RawMemory[] = Array.from({ length: 50 }, (_, i) => ({
        id: `node_${i}`,
        content: `Node ${i}`,
      }))
      
      const result = forgeGraph(memories, {
        bounds: {
          x: [-10, 10],
          y: [-10, 10],
          z: [-5, 5],
        },
      })
      
      result.nodes.forEach(node => {
        expect(node.position.x).toBeGreaterThanOrEqual(-10)
        expect(node.position.x).toBeLessThanOrEqual(10)
        expect(node.position.y).toBeGreaterThanOrEqual(-10)
        expect(node.position.y).toBeLessThanOrEqual(10)
        expect(node.position.z).toBeGreaterThanOrEqual(-5)
        expect(node.position.z).toBeLessThanOrEqual(5)
      })
    })
  })

  describe('widget manifest generation', () => {
    it('sets colorByCluster based on cluster diversity', () => {
      // Single cluster
      const singleCluster: RawMemory[] = [
        { id: '1', content: 'A', cluster: 'work' },
        { id: '2', content: 'B', cluster: 'work' },
      ]
      
      let result = forgeGraph(singleCluster)
      expect(result.widgetSpec.nodeStyle.colorByCluster).toBe(false)
      
      // Multiple clusters
      const multiCluster: RawMemory[] = [
        { id: '1', content: 'A', cluster: 'work' },
        { id: '2', content: 'B', cluster: 'personal' },
      ]
      
      result = forgeGraph(multiCluster)
      expect(result.widgetSpec.nodeStyle.colorByCluster).toBe(true)
    })

    it('scales camera distance based on node count', () => {
      const small: RawMemory[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        content: `Node ${i}`,
      }))
      
      const large: RawMemory[] = Array.from({ length: 1000 }, (_, i) => ({
        id: `${i}`,
        content: `Node ${i}`,
      }))
      
      const smallResult = forgeGraph(small)
      const largeResult = forgeGraph(large)
      
      expect(smallResult.widgetSpec.camera.initialDistance).toBe(100)
      expect(largeResult.widgetSpec.camera.initialDistance).toBe(500)
    })
  })

  describe('error handling', () => {
    it('validates raw memory schema', () => {
      const invalid = [
        {
          // Missing required 'id' field
          content: 'Invalid memory',
        },
      ]
      
      expect(() => forgeGraph(invalid as any)).toThrow()
    })

    it('validates options schema', () => {
      const memories: RawMemory[] = [
        { id: '1', content: 'Test' },
      ]
      
      expect(() => forgeGraph(memories, {
        seed: 'not-a-number' as any,
      })).toThrow()
      
      expect(() => forgeGraph(memories, {
        simulation: {
          iterations: -10, // Must be positive
        },
      })).toThrow()
    })
  })
})