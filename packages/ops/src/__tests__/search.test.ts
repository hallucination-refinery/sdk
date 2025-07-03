import { describe, it, expect } from 'vitest'
import { Graph } from '@refinery/schema'
import { searchNodes, searchEdges, fuzzySearchNodes } from '../queries/search'

describe('Search Utilities', () => {
  // Helper to create test graph
  function createTestGraph(): Graph {
    return {
      nodes: [
        { id: 'A', label: 'Machine Learning', content: 'AI and neural networks' },
        { id: 'B', label: 'Deep Learning', content: 'Advanced neural networks' },
        { id: 'C', label: 'Computer Vision', content: 'Image processing with ML' },
        { id: 'D', label: 'Natural Language', content: 'Text analysis' },
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', label: 'extends' },
        { id: 'e2', source: 'B', target: 'C', label: 'applies to' },
        { id: 'e3', source: 'B', target: 'D', label: 'applies to' },
      ]
    }
  }

  describe('searchNodes', () => {
    it('should search in labels', () => {
      const graph = createTestGraph()
      const results = searchNodes(graph, 'Learning')

      expect(results).toHaveLength(2)
      // Both A and B have "Learning" in their labels
      const ids = results.map(r => r.item.id)
      expect(ids).toContain('A')
      expect(ids).toContain('B')
      expect(results[0].matches[0].field).toBe('label')
    })

    it('should search in content', () => {
      const graph = createTestGraph()
      const results = searchNodes(graph, 'neural')

      expect(results).toHaveLength(2)
      const ids = results.map(r => r.item.id).sort()
      expect(ids).toEqual(['A', 'B'])
    })

    it('should rank by relevance', () => {
      const graph = createTestGraph()
      const results = searchNodes(graph, 'Learning')

      // Both have "Learning" in label, should have similar scores
      expect(results[0].score).toBeGreaterThan(0)
      expect(results[0].score).toBeLessThanOrEqual(1)
    })

    it('should respect limit', () => {
      const graph = createTestGraph()
      const results = searchNodes(graph, 'e', { limit: 2 })

      expect(results).toHaveLength(2)
    })
  })

  describe('searchEdges', () => {
    it('should search edge labels', () => {
      const graph = createTestGraph()
      const results = searchEdges(graph, 'applies')

      expect(results).toHaveLength(2)
      expect(results[0].item.id).toBe('e2')
      expect(results[1].item.id).toBe('e3')
    })
  })

  describe('fuzzySearchNodes', () => {
    it('should find approximate matches', () => {
      const graph = createTestGraph()
      // Add a node that's easier to fuzzy match
      graph.nodes.push({ id: 'E', label: 'Learn', content: 'Simple learn' })
      
      // Test with a similar word
      const results = fuzzySearchNodes(graph, 'Lern', 0.7) // Missing 'a' from "Learn"

      expect(results.length).toBeGreaterThan(0)
      // Should find the "Learn" node
      expect(results[0].item.id).toBe('E')
    })

    it('should respect threshold', () => {
      const graph = createTestGraph()
      const results = fuzzySearchNodes(graph, 'xyz', 0.9)

      expect(results).toHaveLength(0)
    })
  })
})