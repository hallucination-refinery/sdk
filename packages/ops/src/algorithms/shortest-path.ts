import { Graph, IdeaNode, Edge } from '@refinery/schema'
import { bfs } from './bfs'

/**
 * Path information between two nodes
 */
export interface PathInfo {
  /**
   * Whether a path exists
   */
  exists: boolean
  
  /**
   * The path as an array of node IDs
   */
  path: string[]
  
  /**
   * Length of the path (number of edges)
   */
  length: number
  
  /**
   * The edges traversed in order
   */
  edges: Edge[]
  
  /**
   * The nodes traversed in order
   */
  nodes: IdeaNode[]
}

/**
 * All paths information between two nodes
 */
export interface AllPathsInfo {
  /**
   * All paths found
   */
  paths: PathInfo[]
  
  /**
   * Shortest path length
   */
  shortestLength: number
  
  /**
   * Number of shortest paths
   */
  shortestPathCount: number
}

/**
 * Options for path finding algorithms
 */
export interface PathOptions {
  /**
   * Whether to respect edge direction (default: false)
   */
  directed?: boolean
  
  /**
   * Maximum depth to search (default: Infinity)
   */
  maxDepth?: number
  
  /**
   * Edge filter function
   */
  edgeFilter?: (edge: Edge) => boolean
  
  /**
   * Node filter function
   */
  nodeFilter?: (node: IdeaNode) => boolean
}

/**
 * Find the shortest path between two nodes
 * 
 * @param graph - The graph to search
 * @param startId - ID of the start node
 * @param endId - ID of the end node
 * @param options - Optional configuration
 * @returns Path information or null if no path exists
 */
export function findShortestPath(
  graph: Graph,
  startId: string,
  endId: string,
  options: PathOptions = {}
): PathInfo | null {
  const result = bfs(graph, startId, options)
  
  if (!result.visited.has(endId)) {
    return null
  }
  
  // Reconstruct path
  const path: string[] = []
  let currentId: string | null = endId
  
  while (currentId !== null) {
    path.unshift(currentId)
    currentId = result.parents.get(currentId) || null
  }
  
  // Get edges and nodes
  const edges: Edge[] = []
  const nodes: IdeaNode[] = []
  
  for (let i = 0; i < path.length; i++) {
    const node = graph.nodes.find(n => n.id === path[i])
    if (node) {
      nodes.push(node)
    }
    
    if (i < path.length - 1) {
      const edge = findEdgeBetween(graph, path[i], path[i + 1], options.directed)
      if (edge) {
        edges.push(edge)
      }
    }
  }
  
  return {
    exists: true,
    path,
    length: path.length - 1,
    edges,
    nodes
  }
}

/**
 * Find all shortest paths between two nodes
 * 
 * @param graph - The graph to search
 * @param startId - ID of the start node
 * @param endId - ID of the end node
 * @param options - Optional configuration
 * @returns All shortest paths information
 */
export function findAllShortestPaths(
  graph: Graph,
  startId: string,
  endId: string,
  options: PathOptions = {}
): AllPathsInfo {
  const shortestPath = findShortestPath(graph, startId, endId, options)
  
  if (!shortestPath) {
    return {
      paths: [],
      shortestLength: Infinity,
      shortestPathCount: 0
    }
  }
  
  const shortestLength = shortestPath.length
  const paths: PathInfo[] = []
  
  // Use modified BFS to find all shortest paths
  const queue: Array<{ nodeId: string; path: string[]; depth: number }> = [
    { nodeId: startId, path: [startId], depth: 0 }
  ]
  
  const adjacency = buildAdjacencyList(graph, options.directed || false, options.edgeFilter)
  
  while (queue.length > 0) {
    const { nodeId, path, depth } = queue.shift()!
    
    if (depth > shortestLength) {
      continue // Skip paths longer than shortest
    }
    
    if (nodeId === endId && depth === shortestLength) {
      // Found a shortest path
      const edges: Edge[] = []
      const nodes: IdeaNode[] = []
      
      for (let i = 0; i < path.length; i++) {
        const node = graph.nodes.find(n => n.id === path[i])
        if (node) {
          nodes.push(node)
        }
        
        if (i < path.length - 1) {
          const edge = findEdgeBetween(graph, path[i], path[i + 1], options.directed)
          if (edge) {
            edges.push(edge)
          }
        }
      }
      
      paths.push({
        exists: true,
        path,
        length: path.length - 1,
        edges,
        nodes
      })
      continue
    }
    
    // Explore neighbors
    const neighbors = adjacency.get(nodeId) || []
    for (const neighborId of neighbors) {
      if (!path.includes(neighborId)) { // Avoid cycles
        queue.push({
          nodeId: neighborId,
          path: [...path, neighborId],
          depth: depth + 1
        })
      }
    }
  }
  
  return {
    paths,
    shortestLength,
    shortestPathCount: paths.length
  }
}

/**
 * Find k shortest paths between two nodes (Yen's algorithm)
 * 
 * @param graph - The graph to search
 * @param startId - ID of the start node
 * @param endId - ID of the end node
 * @param k - Number of paths to find
 * @param options - Optional configuration
 * @returns Array of k shortest paths
 */
export function findKShortestPaths(
  graph: Graph,
  startId: string,
  endId: string,
  k: number,
  options: PathOptions = {}
): PathInfo[] {
  if (k <= 0) {
    return []
  }
  
  const paths: PathInfo[] = []
  const candidates: PathInfo[] = []
  
  // Find the shortest path
  const shortestPath = findShortestPath(graph, startId, endId, options)
  if (!shortestPath) {
    return []
  }
  
  paths.push(shortestPath)
  
  // Find k-1 more paths
  for (let i = 1; i < k; i++) {
    const lastPath = paths[paths.length - 1]
    
    // For each node in the last path (except the last one)
    for (let j = 0; j < lastPath.path.length - 1; j++) {
      const spurNode = lastPath.path[j]
      const rootPath = lastPath.path.slice(0, j + 1)
      
      // Create a modified graph without certain edges
      const removedEdges: Edge[] = []
      
      // Remove edges that are part of previous paths with the same root
      for (const prevPath of paths) {
        if (arraysEqual(prevPath.path.slice(0, j + 1), rootPath)) {
          if (j + 1 < prevPath.path.length) {
            const edge = findEdgeBetween(
              graph,
              prevPath.path[j],
              prevPath.path[j + 1],
              options.directed
            )
            if (edge) {
              removedEdges.push(edge)
            }
          }
        }
      }
      
      // Find shortest path from spur node to end in modified graph
      const modifiedGraph: Graph = {
        ...graph,
        edges: graph.edges.filter(e => !removedEdges.includes(e))
      }
      
      const spurPath = findShortestPath(
        modifiedGraph,
        spurNode,
        endId,
        options
      )
      
      if (spurPath && spurPath.path.length > 1) {
        // Combine root path and spur path
        const totalPath = [...rootPath.slice(0, -1), ...spurPath.path]
        const candidate = reconstructPath(graph, totalPath, options.directed)
        
        if (candidate && !pathExists(candidates, candidate) && !pathExists(paths, candidate)) {
          candidates.push(candidate)
        }
      }
    }
    
    if (candidates.length === 0) {
      break // No more paths found
    }
    
    // Sort candidates by length and select the shortest
    candidates.sort((a, b) => a.length - b.length)
    paths.push(candidates.shift()!)
  }
  
  return paths
}

/**
 * Check if there's any path between two nodes
 * 
 * @param graph - The graph to search
 * @param startId - ID of the start node
 * @param endId - ID of the end node
 * @param options - Optional configuration
 * @returns True if a path exists
 */
export function hasPath(
  graph: Graph,
  startId: string,
  endId: string,
  options: PathOptions = {}
): boolean {
  const result = bfs(graph, startId, options)
  return result.visited.has(endId)
}

/**
 * Calculate distance (shortest path length) between two nodes
 * 
 * @param graph - The graph to search
 * @param startId - ID of the start node
 * @param endId - ID of the end node
 * @param options - Optional configuration
 * @returns Distance or Infinity if no path exists
 */
export function distance(
  graph: Graph,
  startId: string,
  endId: string,
  options: PathOptions = {}
): number {
  const result = bfs(graph, startId, options)
  return result.distances.get(endId) ?? Infinity
}

/**
 * Find an edge between two nodes
 */
function findEdgeBetween(
  graph: Graph,
  sourceId: string,
  targetId: string,
  directed?: boolean
): Edge | undefined {
  return graph.edges.find(edge => {
    if (directed && edge.directed) {
      return edge.source === sourceId && edge.target === targetId
    } else {
      return (
        (edge.source === sourceId && edge.target === targetId) ||
        (edge.source === targetId && edge.target === sourceId)
      )
    }
  })
}

/**
 * Build adjacency list for the graph
 */
function buildAdjacencyList(
  graph: Graph,
  directed: boolean,
  edgeFilter?: (edge: Edge) => boolean
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>()
  
  // Initialize
  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }
  
  // Add edges
  for (const edge of graph.edges) {
    if (edgeFilter && !edgeFilter(edge)) {
      continue
    }
    
    const sourceNeighbors = adjacency.get(edge.source) || []
    const targetNeighbors = adjacency.get(edge.target) || []
    
    if (directed && edge.directed) {
      sourceNeighbors.push(edge.target)
      adjacency.set(edge.source, sourceNeighbors)
    } else {
      sourceNeighbors.push(edge.target)
      targetNeighbors.push(edge.source)
      adjacency.set(edge.source, sourceNeighbors)
      adjacency.set(edge.target, targetNeighbors)
    }
  }
  
  return adjacency
}

/**
 * Check if two arrays are equal
 */
function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 * Check if a path already exists in a list
 */
function pathExists(paths: PathInfo[], candidate: PathInfo): boolean {
  return paths.some(p => arraysEqual(p.path, candidate.path))
}

/**
 * Reconstruct path information from a list of node IDs
 */
function reconstructPath(
  graph: Graph,
  path: string[],
  directed?: boolean
): PathInfo | null {
  const edges: Edge[] = []
  const nodes: IdeaNode[] = []
  
  for (let i = 0; i < path.length; i++) {
    const node = graph.nodes.find(n => n.id === path[i])
    if (!node) return null
    nodes.push(node)
    
    if (i < path.length - 1) {
      const edge = findEdgeBetween(graph, path[i], path[i + 1], directed)
      if (!edge) return null
      edges.push(edge)
    }
  }
  
  return {
    exists: true,
    path,
    length: path.length - 1,
    edges,
    nodes
  }
}