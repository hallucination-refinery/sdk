import { describe, it, expect } from 'vitest'
import { Graph } from '@refinery/schema'
import { dfs, dfsComplete, detectCycles, topologicalSort } from '../algorithms/dfs'

describe('DFS Algorithm', () => {
  // Helper to create test graph
  function createTestGraph(): Graph {
    return {
      nodes: [
        { id: 'A', label: 'Node A' },
        { id: 'B', label: 'Node B' },
        { id: 'C', label: 'Node C' },
        { id: 'D', label: 'Node D' },
        { id: 'E', label: 'Node E' },
        { id: 'F', label: 'Node F' },
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', directed: false },
        { id: 'e2', source: 'A', target: 'C', directed: false },
        { id: 'e3', source: 'B', target: 'D', directed: false },
        { id: 'e4', source: 'C', target: 'E', directed: false },
        { id: 'e5', source: 'D', target: 'F', directed: false },
      ]
    }
  }

  describe('dfs', () => {
    it('should traverse graph in depth-first order', () => {
      const graph = createTestGraph()
      const result = dfs(graph, 'A')

      expect(result.visitOrder).toHaveLength(6)
      expect(result.postOrder).toHaveLength(6)
      expect(result.visited.size).toBe(6)
      
      // First node should be A
      expect(result.visitOrder[0].id).toBe('A')
      
      // Should have discovery and finish times
      expect(result.discoveryTime.get('A')).toBe(1)
      expect(result.finishTime.get('A')).toBeGreaterThan(1)
    })

    it('should track parent relationships', () => {
      const graph = createTestGraph()
      const result = dfs(graph, 'A')

      expect(result.parents.get('A')).toBeNull()
      expect(result.parents.has('B')).toBe(true)
      expect(result.parents.has('C')).toBe(true)
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
        ]
      }

      const result = dfs(graph, 'A', { directed: true })
      expect(result.visitOrder.map(n => n.id)).toEqual(['A', 'B', 'C', 'D'])
    })

    it('should respect maxDepth option', () => {
      const graph = createTestGraph()
      const result = dfs(graph, 'A', { maxDepth: 2 })

      // Should not visit nodes deeper than depth 2
      const visitedIds = result.visitOrder.map(n => n.id)
      expect(visitedIds).toContain('A') // depth 0
      expect(visitedIds).toContain('B') // depth 1
      expect(visitedIds).toContain('C') // depth 1
      expect(visitedIds).toContain('D') // depth 2
      expect(visitedIds).toContain('E') // depth 2
      expect(visitedIds).not.toContain('F') // depth 3
    })

    it('should call discovery and finish callbacks', () => {
      const graph = createTestGraph()
      const discovered: string[] = []
      const finished: string[] = []

      dfs(graph, 'A', {
        onDiscover: (node) => discovered.push(node.id),
        onFinish: (node) => finished.push(node.id)
      })

      expect(discovered).toHaveLength(6)
      expect(finished).toHaveLength(6)
      expect(discovered[0]).toBe('A')
      expect(finished[finished.length - 1]).toBe('A') // Root finishes last
    })
  })

  describe('dfsComplete', () => {
    it('should visit all nodes including disconnected components', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' }, // Isolated
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: false },
          { id: 'e2', source: 'B', target: 'C', directed: false },
        ]
      }

      const result = dfsComplete(graph)
      expect(result.visitOrder).toHaveLength(4)
      expect(result.visited.size).toBe(4)
      expect(result.visited.has('D')).toBe(true)
    })
  })

  describe('detectCycles', () => {
    it('should detect cycles in undirected graph', () => {
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

      const cycles = detectCycles(graph, false)
      expect(cycles.length).toBeGreaterThan(0)
    })

    it('should detect cycles in directed graph', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'B', target: 'C', directed: true },
          { id: 'e3', source: 'C', target: 'A', directed: true },
        ]
      }

      const cycles = detectCycles(graph, true)
      expect(cycles.length).toBeGreaterThan(0)
      expect(cycles[0]).toContain('A')
      expect(cycles[0]).toContain('B')
      expect(cycles[0]).toContain('C')
    })

    it('should return empty array for acyclic graph', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'B', target: 'C', directed: true },
        ]
      }

      const cycles = detectCycles(graph, true)
      expect(cycles).toHaveLength(0)
    })
  })

  describe('topologicalSort', () => {
    it('should sort DAG topologically', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
          { id: 'D', label: 'D' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'A', target: 'C', directed: true },
          { id: 'e3', source: 'B', target: 'D', directed: true },
          { id: 'e4', source: 'C', target: 'D', directed: true },
        ]
      }

      const sorted = topologicalSort(graph)
      expect(sorted).not.toBeNull()
      expect(sorted!).toHaveLength(4)
      
      // A should come before B and C
      const aIndex = sorted!.indexOf('A')
      const bIndex = sorted!.indexOf('B')
      const cIndex = sorted!.indexOf('C')
      const dIndex = sorted!.indexOf('D')
      
      expect(aIndex).toBeLessThan(bIndex)
      expect(aIndex).toBeLessThan(cIndex)
      expect(bIndex).toBeLessThan(dIndex)
      expect(cIndex).toBeLessThan(dIndex)
    })

    it('should return null for cyclic graph', () => {
      const graph: Graph = {
        nodes: [
          { id: 'A', label: 'A' },
          { id: 'B', label: 'B' },
          { id: 'C', label: 'C' },
        ],
        edges: [
          { id: 'e1', source: 'A', target: 'B', directed: true },
          { id: 'e2', source: 'B', target: 'C', directed: true },
          { id: 'e3', source: 'C', target: 'A', directed: true },
        ]
      }

      const sorted = topologicalSort(graph)
      expect(sorted).toBeNull()
    })
  })
})