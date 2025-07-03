import { describe, it, expect } from 'vitest'
import * as ops from './index'

describe('@refinery/ops', () => {
  it('should export version', () => {
    expect(ops.version).toBe('0.0.0')
  })

  it('should export all algorithm functions', () => {
    // BFS exports
    expect(ops.bfs).toBeDefined()
    expect(ops.shortestPath).toBeDefined()
    expect(ops.findNodesWithinDistance).toBeDefined()
    expect(ops.findConnectedComponents).toBeDefined()
    
    // DFS exports
    expect(ops.dfs).toBeDefined()
    expect(ops.dfsComplete).toBeDefined()
    expect(ops.detectCycles).toBeDefined()
    expect(ops.topologicalSort).toBeDefined()
    
    // Interwingle exports
    expect(ops.interwingle).toBeDefined()
    expect(ops.suggestConnections).toBeDefined()
    
    // Clustering exports
    expect(ops.clusterByComponents).toBeDefined()
    expect(ops.clusterByStrength).toBeDefined()
    expect(ops.clusterKMeans).toBeDefined()
    
    // Shortest path exports
    expect(ops.findShortestPath).toBeDefined()
    expect(ops.findAllShortestPaths).toBeDefined()
    expect(ops.findKShortestPaths).toBeDefined()
    expect(ops.hasPath).toBeDefined()
    expect(ops.distance).toBeDefined()
  })

  it('should export query functions', () => {
    // Filter exports
    expect(ops.filterNodes).toBeDefined()
    expect(ops.filterEdges).toBeDefined()
    expect(ops.filterGraph).toBeDefined()
    expect(ops.findNodesByDegree).toBeDefined()
    expect(ops.findIsolatedNodes).toBeDefined()
    expect(ops.findHubNodes).toBeDefined()
    
    // Search exports
    expect(ops.searchNodes).toBeDefined()
    expect(ops.searchEdges).toBeDefined()
    expect(ops.fuzzySearchNodes).toBeDefined()
  })

  it('should export transformation functions', () => {
    expect(ops.mapNodes).toBeDefined()
    expect(ops.mapEdges).toBeDefined()
    expect(ops.transformGraph).toBeDefined()
    expect(ops.mergeGraphs).toBeDefined()
    expect(ops.subgraph).toBeDefined()
    expect(ops.reverseEdges).toBeDefined()
    expect(ops.removeDuplicateEdges).toBeDefined()
    expect(ops.contractNodes).toBeDefined()
  })
})