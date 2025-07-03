import { Graph, IdeaNode, Edge } from '@refinery/schema'

/**
 * Result of a BFS traversal
 */
export interface BFSResult {
  /**
   * Nodes in the order they were visited
   */
  visitOrder: IdeaNode[]
  
  /**
   * Map from node ID to its distance from the start node
   */
  distances: Map<string, number>
  
  /**
   * Map from node ID to its parent in the BFS tree
   */
  parents: Map<string, string | null>
  
  /**
   * Set of visited node IDs
   */
  visited: Set<string>
}

/**
 * Options for BFS traversal
 */
export interface BFSOptions {
  /**
   * Maximum depth to traverse (default: Infinity)
   */
  maxDepth?: number
  
  /**
   * Filter function to determine if a node should be visited
   */
  nodeFilter?: (node: IdeaNode) => boolean
  
  /**
   * Filter function to determine if an edge should be traversed
   */
  edgeFilter?: (edge: Edge) => boolean
  
  /**
   * Whether to respect edge direction (default: false)
   */
  directed?: boolean
}

/**
 * Perform Breadth-First Search traversal on a graph
 * 
 * @param graph - The graph to traverse
 * @param startNodeId - ID of the node to start from
 * @param options - Optional configuration for the traversal
 * @returns BFS traversal result
 */
export function bfs(
  graph: Graph,
  startNodeId: string,
  options: BFSOptions = {}
): BFSResult {
  const {
    maxDepth = Infinity,
    nodeFilter = () => true,
    edgeFilter = () => true,
    directed = false
  } = options

  const visitOrder: IdeaNode[] = []
  const distances = new Map<string, number>()
  const parents = new Map<string, string | null>()
  const visited = new Set<string>()
  
  // Build adjacency list
  const adjacency = buildAdjacencyList(graph, directed, edgeFilter)
  
  // Find start node
  const startNode = graph.nodes.find(n => n.id === startNodeId)
  if (!startNode) {
    return { visitOrder, distances, parents, visited }
  }
  
  // Initialize BFS
  const queue: string[] = [startNodeId]
  visited.add(startNodeId)
  distances.set(startNodeId, 0)
  parents.set(startNodeId, null)
  
  // Process queue
  while (queue.length > 0) {
    const currentId = queue.shift()!
    const currentNode = graph.nodes.find(n => n.id === currentId)
    
    if (!currentNode) {
      continue
    }
    
    const currentDistance = distances.get(currentId)!
    
    // Skip if we've reached max depth
    if (currentDistance > maxDepth) {
      continue
    }
    
    // Apply node filter
    if (nodeFilter(currentNode)) {
      visitOrder.push(currentNode)
    }
    
    // Process neighbors
    const neighbors = adjacency.get(currentId) || []
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        visited.add(neighborId)
        queue.push(neighborId)
        distances.set(neighborId, currentDistance + 1)
        parents.set(neighborId, currentId)
      }
    }
  }
  
  return { visitOrder, distances, parents, visited }
}

/**
 * Find the shortest path between two nodes using BFS
 * 
 * @param graph - The graph to search
 * @param startNodeId - ID of the start node
 * @param endNodeId - ID of the end node
 * @param options - Optional BFS configuration
 * @returns Array of node IDs representing the path, or null if no path exists
 */
export function shortestPath(
  graph: Graph,
  startNodeId: string,
  endNodeId: string,
  options: BFSOptions = {}
): string[] | null {
  const result = bfs(graph, startNodeId, options)
  
  // Check if end node was reached
  if (!result.visited.has(endNodeId)) {
    return null
  }
  
  // Reconstruct path
  const path: string[] = []
  let currentId: string | null = endNodeId
  
  while (currentId !== null) {
    path.unshift(currentId)
    currentId = result.parents.get(currentId) || null
  }
  
  return path
}

/**
 * Find all nodes within a certain distance from a start node
 * 
 * @param graph - The graph to search
 * @param startNodeId - ID of the start node
 * @param maxDistance - Maximum distance to search
 * @param options - Optional BFS configuration
 * @returns Array of nodes within the specified distance
 */
export function findNodesWithinDistance(
  graph: Graph,
  startNodeId: string,
  maxDistance: number,
  options: BFSOptions = {}
): IdeaNode[] {
  const result = bfs(graph, startNodeId, { ...options, maxDepth: maxDistance })
  return result.visitOrder
}

/**
 * Find all connected components in a graph using BFS
 * 
 * @param graph - The graph to analyze
 * @param options - Optional BFS configuration
 * @returns Array of connected components, each represented as an array of nodes
 */
export function findConnectedComponents(
  graph: Graph,
  options: BFSOptions = {}
): IdeaNode[][] {
  const allVisited = new Set<string>()
  const components: IdeaNode[][] = []
  
  for (const node of graph.nodes) {
    if (!allVisited.has(node.id)) {
      const result = bfs(graph, node.id, options)
      
      if (result.visitOrder.length > 0) {
        components.push(result.visitOrder)
        result.visited.forEach(id => allVisited.add(id))
      }
    }
  }
  
  return components
}

/**
 * Build an adjacency list representation of the graph
 */
function buildAdjacencyList(
  graph: Graph,
  directed: boolean,
  edgeFilter: (edge: Edge) => boolean
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>()
  
  // Initialize with all nodes
  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }
  
  // Add edges
  for (const edge of graph.edges) {
    if (!edgeFilter(edge)) {
      continue
    }
    
    const sourceNeighbors = adjacency.get(edge.source) || []
    const targetNeighbors = adjacency.get(edge.target) || []
    
    if (directed && edge.directed) {
      // Directed edge: only add target to source's neighbors
      sourceNeighbors.push(edge.target)
      adjacency.set(edge.source, sourceNeighbors)
    } else {
      // Undirected edge: add both directions
      sourceNeighbors.push(edge.target)
      targetNeighbors.push(edge.source)
      adjacency.set(edge.source, sourceNeighbors)
      adjacency.set(edge.target, targetNeighbors)
    }
  }
  
  return adjacency
}