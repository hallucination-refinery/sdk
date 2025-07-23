/**
 * Tests for graph-utils conversion functions
 * Verifies Map↔Array conversions and caching behavior
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { mapToArrays, arraysToMaps, clearConversionCache } from '../graph-utils'
import type { IdeaNode, Edge } from '@refinery/schema'

describe('Graph Utils - Map↔Array Conversions', () => {
  beforeEach(() => {
    // Clear cache before each test
    clearConversionCache()
  })

  describe('mapToArrays', () => {
    it('should convert empty Maps to empty arrays', () => {
      const emptyNodes = new Map<string, IdeaNode>()
      const emptyEdges = new Map<string, Edge>()

      const result = mapToArrays(emptyNodes, emptyEdges)

      expect(result.nodes).toEqual([])
      expect(result.links).toEqual([])
    })

    it('should convert Maps to arrays with correct format', () => {
      const nodes = new Map<string, IdeaNode>([
        [
          'n1',
          {
            id: 'n1',
            label: 'Node 1',
            metadata: { customType: 'idea', source: 'test', created: 1000 },
          },
        ],
        [
          'n2',
          {
            id: 'n2',
            label: 'Node 2',
            selected: true,
            metadata: { customType: 'concept', source: 'test', created: 2000 },
          },
        ],
      ])

      const edges = new Map<string, Edge>([
        [
          'e1',
          {
            id: 'e1',
            source: 'n1',
            target: 'n2',
            strength: 0.95,
            type: 'relates-to',
            directed: false,
            visible: true,
          },
        ],
        [
          'e2',
          {
            id: 'e2',
            source: 'n2',
            target: 'n1',
            strength: 0.75,
            type: 'relates-to',
            directed: false,
            visible: true,
          },
        ],
      ])

      const result = mapToArrays(nodes, edges)

      expect(result.nodes).toHaveLength(2)
      expect(result.links).toHaveLength(2)

      // Check node conversion
      expect(result.nodes[0]).toMatchObject({
        id: 'n1',
        label: 'Node 1',
      })

      // Check edge conversion to ForceGraph3D format
      expect(result.links[0]).toMatchObject({
        id: 'e1',
        source: 'n1',
        target: 'n2',
        tier: 0, // Legacy compatibility
      })
    })

    it('should return different object references on each call (shallow clones)', () => {
      const nodes = new Map<string, IdeaNode>([
        [
          'n1',
          {
            id: 'n1',
            label: 'Node 1',
            metadata: { source: 'test', created: 1000 },
          },
        ],
      ])

      const edges = new Map<string, Edge>([
        [
          'e1',
          {
            id: 'e1',
            source: 'n1',
            target: 'n2',
            strength: 0.9,
            type: 'relates-to',
            directed: false,
            visible: true,
          },
        ],
      ])

      // First call
      const result1 = mapToArrays(nodes, edges)
      // Second call with same Maps
      const result2 = mapToArrays(nodes, edges)

      // Arrays should be different references
      expect(result1.nodes).not.toBe(result2.nodes)
      expect(result1.links).not.toBe(result2.links)
      
      // Individual objects should be different references
      expect(result1.nodes[0]).not.toBe(result2.nodes[0])
      expect(result1.links[0]).not.toBe(result2.links[0])
      
      // But content should be equal
      expect(result1.nodes).toEqual(result2.nodes)
      expect(result1.links).toEqual(result2.links)

      // Modify the Map (new Map reference)
      const newNodes = new Map(nodes)
      newNodes.set('n2', {
        id: 'n2',
        label: 'Node 2',
        metadata: { source: 'test', created: 2000 },
      })

      // Third call with modified Map
      const result3 = mapToArrays(newNodes, edges)

      // Should return new node array AND new edge array (due to shallow cloning)
      expect(result3.nodes).not.toBe(result1.nodes)
      expect(result3.links).not.toBe(result1.links) // always returns clones
      expect(result3.nodes).toHaveLength(2)
      // But edge content should be the same
      expect(result3.links).toEqual(result1.links)
    })

    it('should invalidate cache when Map size changes', () => {
      const nodes = new Map<string, IdeaNode>([
        ['n1', { id: 'n1', label: 'Node 1', metadata: { source: 'test', created: 1000 } }],
      ])
      const edges = new Map<string, Edge>()

      const result1 = mapToArrays(nodes, edges)
      
      // Add a node without changing Map reference
      nodes.set('n2', {
        id: 'n2',
        label: 'Node 2',
        metadata: { source: 'test', created: 2000 },
      })

      const result2 = mapToArrays(nodes, edges)

      // Should have 2 nodes now
      expect(result2.nodes).toHaveLength(2)
      expect(result2.nodes.map(n => n.id)).toContain('n2')
      
      // Remove a node
      nodes.delete('n1')
      const result3 = mapToArrays(nodes, edges)
      
      // Should have only 1 node now
      expect(result3.nodes).toHaveLength(1)
      expect(result3.nodes[0].id).toBe('n2')
    })

    it('should create shallow clones that can be safely mutated', () => {
      const nodes = new Map<string, IdeaNode>([
        ['n1', {
          id: 'n1',
          label: 'Original',
          metadata: { source: 'test', created: 1000 }
        }],
      ])
      const edges = new Map<string, Edge>()

      const result1 = mapToArrays(nodes, edges)
      
      // Mutate the returned object
      result1.nodes[0].label = 'Mutated'
      
      // Get fresh data
      const result2 = mapToArrays(nodes, edges)
      
      // Original should be unchanged
      expect(nodes.get('n1')?.label).toBe('Original')
      // New result should have original value
      expect(result2.nodes[0].label).toBe('Original')
      
      // First result should still have mutated value
      expect(result1.nodes[0].label).toBe('Mutated')
    })
  })

  describe('arraysToMaps', () => {
    it('should convert empty arrays to empty Maps', () => {
      const result = arraysToMaps([], [])

      expect(result.nodes.size).toBe(0)
      expect(result.edges.size).toBe(0)
    })

    it('should convert arrays to Maps with proper typing', () => {
      const nodes: Partial<IdeaNode>[] = [
        {
          id: 'n1',
          label: 'Node 1',
          metadata: { customType: 'memory', secret: true, topics: ['topic1'] },
        },
        {
          id: 'n2',
          label: 'Node 2',
        },
      ]

      const edges: Partial<Edge>[] = [
        { source: 'n1', target: 'n2', strength: 0.8 },
        { id: 'e2', source: 'n2', target: 'n3', strength: 0.6 },
      ]

      const result = arraysToMaps(nodes as IdeaNode[], edges as Edge[])

      expect(result.nodes.size).toBe(2)
      expect(result.edges.size).toBe(2)

      // Check node conversion with defaults
      const n1 = result.nodes.get('n1')
      expect(n1).toBeDefined()
      expect(n1?.label).toBe('Node 1')
      expect(n1?.metadata?.customType).toBe('memory')
      expect(n1?.metadata?.secret).toBe(true)

      const n2 = result.nodes.get('n2')
      expect(n2).toBeDefined()
      expect(n2?.label).toBe('Node 2')

      // Check edge conversion
      const e1 = result.edges.get('n1-n2')
      expect(e1).toBeDefined()
      expect(e1?.id).toBe('n1-n2') // generated ID
      expect(e1?.strength).toBe(0.8)

      const e2 = result.edges.get('e2')
      expect(e2).toBeDefined()
      expect(e2?.strength).toBe(0.6)
    })

    it('should handle edge cases and missing data', () => {
      const nodes: Partial<IdeaNode>[] = [
        { id: 'n1' }, // Minimal node
        {
          id: 'n2',
          label: '',
          selected: true,
          metadata: { created: null },
        },
      ]

      const edges: Partial<Edge>[] = [
        { source: 'n1', target: 'n2' }, // Minimal edge
        {
          id: '', // Empty ID
          source: 'n3',
          target: 'n4',
          strength: undefined,
        },
      ]

      const result = arraysToMaps(nodes as IdeaNode[], edges as Edge[])

      // Should handle minimal node
      const n1 = result.nodes.get('n1')
      expect(n1?.label).toBe('') // empty default

      // Should preserve partial state
      const n2 = result.nodes.get('n2')
      expect(n2?.selected).toBe(true)

      // Should handle edge with generated ID
      const e1 = result.edges.get('n1-n2')
      expect(e1?.strength).toBe(1) // default strength

      // Should handle edge with empty ID
      const e2 = result.edges.get('n3-n4')
      expect(e2).toBeDefined()
      expect(e2?.strength).toBe(1) // undefined converted to default
    })
  })

  describe('clearConversionCache', () => {
    it('should clear the cache and return new arrays', () => {
      const nodes = new Map<string, IdeaNode>([
        [
          'n1',
          {
            id: 'n1',
            label: 'Node 1',
            metadata: { customType: 'idea', source: 'test', created: 1000 },
          },
        ],
      ])

      const edges = new Map<string, Edge>()

      // First call - populates cache
      const result1 = mapToArrays(nodes, edges)

      // Clear cache
      clearConversionCache()

      // Second call - should create new arrays
      const result2 = mapToArrays(nodes, edges)

      // Arrays should be different references but same content
      expect(result1.nodes).not.toBe(result2.nodes)
      expect(result1.nodes).toEqual(result2.nodes)
    })
  })

  describe('Round-trip conversion', () => {
    it('should maintain data integrity through round-trip conversion', () => {
      const originalNodes: IdeaNode[] = [
        {
          id: 'n1',
          label: 'Original Node',
          metadata: {
            customType: 'concept',
            source: 'import',
            created: 123456,
            custom: 'data',
            secret: true,
            links: ['n2', 'n3'],
          },
        },
      ]

      const originalEdges: Edge[] = [
        {
          id: 'e1',
          source: 'n1',
          target: 'n2',
          strength: 0.85,
          type: 'relates-to',
          directed: false,
          visible: true,
        },
      ]

      // Convert to Maps
      const { nodes: nodeMap, edges: edgeMap } = arraysToMaps(originalNodes, originalEdges)

      // Convert back to arrays
      const { nodes: resultNodes, links: resultLinks } = mapToArrays(nodeMap, edgeMap)

      // Check node preservation
      expect(resultNodes).toHaveLength(1)
      expect(resultNodes[0].id).toBe('n1')
      expect(resultNodes[0].label).toBe('Original Node')
      expect(resultNodes[0].metadata?.customType).toBe('concept')
      expect(resultNodes[0].metadata?.links).toEqual(['n2', 'n3'])
      expect(resultNodes[0].metadata?.secret).toBe(true)
      expect(resultNodes[0].metadata?.custom).toBe('data')

      // Check edge preservation
      expect(resultLinks).toHaveLength(1)
      expect(resultLinks[0].id).toBe('e1')
      expect(resultLinks[0].source).toBe('n1')
      expect(resultLinks[0].target).toBe('n2')
      expect((resultLinks[0] as any).strength).toBe(0.85) // The conversion util doesn't preserve strength yet
    })
  })
})
