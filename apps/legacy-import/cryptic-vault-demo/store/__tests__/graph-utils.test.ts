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
        ['n1', {
          id: 'n1',
          label: 'Node 1',
          type: 'idea',
          links: ['n2'],
          meta: { source: 'test', created: 1000 },
          state: { isSelected: false, currentLOD: 'Mid', isCollapsed: false, isHidden: false, isLinkingStart: false }
        }],
        ['n2', {
          id: 'n2',
          label: 'Node 2',
          type: 'concept',
          links: [],
          meta: { source: 'test', created: 2000 },
          state: { isSelected: true, currentLOD: 'High', isCollapsed: false, isHidden: false, isLinkingStart: false }
        }]
      ])
      
      const edges = new Map<string, Edge>([
        ['e1', { id: 'e1', source: 'n1', target: 'n2', confidence: 0.95 }],
        ['e2', { id: 'e2', source: 'n2', target: 'n1', confidence: 0.75 }]
      ])
      
      const result = mapToArrays(nodes, edges)
      
      expect(result.nodes).toHaveLength(2)
      expect(result.links).toHaveLength(2)
      
      // Check node conversion
      expect(result.nodes[0]).toMatchObject({
        id: 'n1',
        label: 'Node 1',
        type: 'idea'
      })
      
      // Check edge conversion to ForceGraph3D format
      expect(result.links[0]).toMatchObject({
        id: 'e1',
        source: 'n1',
        target: 'n2',
        tier: 0, // Legacy compatibility
        confidence: 0.95
      })
    })
    
    it('should cache converted arrays for referential stability', () => {
      const nodes = new Map<string, IdeaNode>([
        ['n1', {
          id: 'n1',
          label: 'Node 1',
          type: 'idea',
          links: [],
          meta: { source: 'test', created: 1000 },
          state: { isSelected: false, currentLOD: 'Mid', isCollapsed: false, isHidden: false, isLinkingStart: false }
        }]
      ])
      
      const edges = new Map<string, Edge>([
        ['e1', { id: 'e1', source: 'n1', target: 'n2', confidence: 0.9 }]
      ])
      
      // First call
      const result1 = mapToArrays(nodes, edges)
      // Second call with same Maps
      const result2 = mapToArrays(nodes, edges)
      
      // Should return same array references
      expect(result1.nodes).toBe(result2.nodes)
      expect(result1.links).toBe(result2.links)
      
      // Modify the Map (new Map reference)
      const newNodes = new Map(nodes)
      newNodes.set('n2', {
        id: 'n2',
        label: 'Node 2',
        type: 'idea',
        links: [],
        meta: { source: 'test', created: 2000 },
        state: { isSelected: false, currentLOD: 'Mid', isCollapsed: false, isHidden: false, isLinkingStart: false }
      })
      
      // Third call with modified Map
      const result3 = mapToArrays(newNodes, edges)
      
      // Should return new node array but same edge array
      expect(result3.nodes).not.toBe(result1.nodes)
      expect(result3.links).toBe(result1.links) // edges unchanged
      expect(result3.nodes).toHaveLength(2)
    })
  })
  
  describe('arraysToMaps', () => {
    it('should convert empty arrays to empty Maps', () => {
      const result = arraysToMaps([], [])
      
      expect(result.nodes.size).toBe(0)
      expect(result.edges.size).toBe(0)
    })
    
    it('should convert arrays to Maps with proper typing', () => {
      const nodes = [
        {
          id: 'n1',
          title: 'Node 1', // Using title instead of label
          type: 'memory',
          secret: true,
          meta: { topics: ['topic1'] }
        },
        {
          id: 'n2',
          label: 'Node 2',
          // Missing type and other properties
        }
      ]
      
      const edges = [
        { source: 'n1', target: 'n2', weight: 0.8 }, // Using weight instead of confidence
        { id: 'e2', source: 'n2', target: 'n3', confidence: 0.6 }
      ]
      
      const result = arraysToMaps(nodes, edges)
      
      expect(result.nodes.size).toBe(2)
      expect(result.edges.size).toBe(2)
      
      // Check node conversion with defaults
      const n1 = result.nodes.get('n1')
      expect(n1).toBeDefined()
      expect(n1?.label).toBe('Node 1') // title converted to label
      expect(n1?.type).toBe('memory')
      expect(n1?.secret).toBe(true)
      expect(n1?.meta.source).toBe('system') // default added
      expect(n1?.state.isSelected).toBe(false) // default state
      
      const n2 = result.nodes.get('n2')
      expect(n2).toBeDefined()
      expect(n2?.type).toBe('idea') // default type
      expect(n2?.label).toBe('Node 2')
      
      // Check edge conversion
      const e1 = result.edges.get('n1-n2')
      expect(e1).toBeDefined()
      expect(e1?.id).toBe('n1-n2') // generated ID
      expect(e1?.confidence).toBe(0.8) // weight converted to confidence
      
      const e2 = result.edges.get('e2')
      expect(e2).toBeDefined()
      expect(e2?.confidence).toBe(0.6)
    })
    
    it('should handle edge cases and missing data', () => {
      const nodes = [
        { id: 'n1' }, // Minimal node
        { 
          id: 'n2',
          label: '',
          meta: { created: null },
          state: { isSelected: true }
        }
      ]
      
      const edges = [
        { source: 'n1', target: 'n2' }, // Minimal edge
        { 
          id: '', // Empty ID
          source: 'n3',
          target: 'n4',
          confidence: null
        }
      ]
      
      const result = arraysToMaps(nodes, edges)
      
      // Should handle minimal node
      const n1 = result.nodes.get('n1')
      expect(n1?.label).toBe('') // empty default
      expect(n1?.links).toEqual([]) // empty array default
      expect(n1?.meta.created).toBeGreaterThan(0) // timestamp generated
      
      // Should preserve partial state
      const n2 = result.nodes.get('n2')
      expect(n2?.state.isSelected).toBe(true)
      expect(n2?.state.isCollapsed).toBe(false) // default added
      
      // Should handle edge with generated ID
      const e1 = result.edges.get('n1-n2')
      expect(e1?.confidence).toBe(0.8) // default confidence
      
      // Should handle edge with empty ID
      const e2 = result.edges.get('n3-n4')
      expect(e2).toBeDefined()
      expect(e2?.confidence).toBe(0.8) // null converted to default
    })
  })
  
  describe('clearConversionCache', () => {
    it('should clear the cache and return new arrays', () => {
      const nodes = new Map<string, IdeaNode>([
        ['n1', {
          id: 'n1',
          label: 'Node 1',
          type: 'idea',
          links: [],
          meta: { source: 'test', created: 1000 },
          state: { isSelected: false, currentLOD: 'Mid', isCollapsed: false, isHidden: false, isLinkingStart: false }
        }]
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
      const originalNodes = [
        {
          id: 'n1',
          label: 'Original Node',
          type: 'concept',
          links: ['n2', 'n3'],
          meta: { 
            source: 'import',
            created: 123456,
            custom: 'data'
          },
          secret: true
        }
      ]
      
      const originalEdges = [
        {
          id: 'e1',
          source: 'n1',
          target: 'n2',
          confidence: 0.85
        }
      ]
      
      // Convert to Maps
      const { nodes: nodeMap, edges: edgeMap } = arraysToMaps(originalNodes, originalEdges)
      
      // Convert back to arrays
      const { nodes: resultNodes, links: resultLinks } = mapToArrays(nodeMap, edgeMap)
      
      // Check node preservation
      expect(resultNodes).toHaveLength(1)
      expect(resultNodes[0].id).toBe('n1')
      expect(resultNodes[0].label).toBe('Original Node')
      expect(resultNodes[0].type).toBe('concept')
      expect(resultNodes[0].links).toEqual(['n2', 'n3'])
      expect(resultNodes[0].secret).toBe(true)
      expect(resultNodes[0].meta.custom).toBe('data')
      
      // Check edge preservation
      expect(resultLinks).toHaveLength(1)
      expect(resultLinks[0].id).toBe('e1')
      expect(resultLinks[0].source).toBe('n1')
      expect(resultLinks[0].target).toBe('n2')
      expect(resultLinks[0].confidence).toBe(0.85)
    })
  })
})