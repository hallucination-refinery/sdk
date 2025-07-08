import { describe, it, expect } from 'vitest'
import { forgeGraph, RawMemorySchema, type RawMemory } from './index'

describe('@refinery/graph-forge', () => {
  it('exports forgeGraph function', () => {
    expect(forgeGraph).toBeDefined()
    expect(typeof forgeGraph).toBe('function')
  })

  it('exports schemas', () => {
    expect(RawMemorySchema).toBeDefined()
  })

  describe('forgeGraph', () => {
    const testMemories: RawMemory[] = [
      {
        id: 'mem_001',
        content: 'First memory',
        cluster: 'test',
      },
      {
        id: 'mem_002', 
        content: 'Second memory',
        connections: ['mem_001'],
      },
      {
        id: 'mem_003',
        content: 'Third memory',
        position: [10, 20, 30],
        connections: ['mem_001', 'mem_002'],
      },
    ]

    it('creates nodes from raw memories', () => {
      const result = forgeGraph(testMemories)
      
      expect(result.nodes).toHaveLength(3)
      expect(result.nodes[0].id).toBe('mem_001')
      expect(result.nodes[0].content).toBe('First memory')
      expect(result.nodes[0].metadata?.cluster).toBe('test')
    })

    it('creates edges from connections', () => {
      const result = forgeGraph(testMemories)
      
      // Should have 3 edges total
      expect(result.edges).toHaveLength(3)
      
      // Check edge creation
      const edgeSources = result.edges.map(e => e.source)
      const edgeTargets = result.edges.map(e => e.target)
      
      expect(edgeSources).toContain('mem_002')
      expect(edgeTargets).toContain('mem_001')
    })

    it('uses provided positions when available', () => {
      const result = forgeGraph(testMemories)
      
      const node3 = result.nodes.find(n => n.id === 'mem_003')
      expect(node3).toBeDefined()
      
      // Position should be close to initial after simulation
      expect(Math.abs(node3!.position.x - 10)).toBeLessThan(50)
      expect(Math.abs(node3!.position.y - 20)).toBeLessThan(50)
      expect(Math.abs(node3!.position.z - 30)).toBeLessThan(50)
    })

    it('generates widget spec', () => {
      const result = forgeGraph(testMemories)
      
      expect(result.widgetSpec).toBeDefined()
      expect(result.widgetSpec.layout).toBe('force')
      // Should be false because only one memory has a cluster
      expect(result.widgetSpec.nodeStyle.colorByCluster).toBe(false)
    })

    it('produces deterministic results with same seed', () => {
      const result1 = forgeGraph(testMemories, { seed: 123 })
      const result2 = forgeGraph(testMemories, { seed: 123 })
      
      // Positions should be identical
      result1.nodes.forEach((node, i) => {
        expect(node.position.x).toBe(result2.nodes[i].position.x)
        expect(node.position.y).toBe(result2.nodes[i].position.y)
        expect(node.position.z).toBe(result2.nodes[i].position.z)
      })
    })

    it('produces different results with different seeds', () => {
      const memories: RawMemory[] = Array.from({ length: 10 }, (_, i) => ({
        id: `mem_${i}`,
        content: `Memory ${i}`,
      }))
      
      const result1 = forgeGraph(memories, { seed: 123 })
      const result2 = forgeGraph(memories, { seed: 456 })
      
      // At least some positions should differ
      let differences = 0
      result1.nodes.forEach((node, i) => {
        if (node.position.x !== result2.nodes[i].position.x) differences++
      })
      
      expect(differences).toBeGreaterThan(0)
    })

    it('handles empty input', () => {
      const result = forgeGraph([])
      
      expect(result.nodes).toHaveLength(0)
      expect(result.edges).toHaveLength(0)
      expect(result.widgetSpec).toBeDefined()
    })

    it('ignores connections to non-existent nodes', () => {
      const memories: RawMemory[] = [
        {
          id: 'mem_001',
          content: 'Memory with invalid connection',
          connections: ['mem_999'], // Non-existent
        },
      ]
      
      const result = forgeGraph(memories)
      
      expect(result.nodes).toHaveLength(1)
      expect(result.edges).toHaveLength(0) // No edges created
    })

    it('respects custom simulation options', () => {
      const result = forgeGraph(testMemories, {
        simulation: {
          iterations: 1, // Minimal iterations
        },
      })
      
      expect(result.nodes).toHaveLength(3)
      // With only 1 iteration, nodes shouldn't move much
      const node1 = result.nodes.find(n => n.id === 'mem_001')
      expect(Math.abs(node1!.position.x)).toBeLessThan(100)
    })
  })
})