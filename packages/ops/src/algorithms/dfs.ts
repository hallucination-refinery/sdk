import { Graph, IdeaNode, Edge } from '@refinery/schema'

/**
 * Result of a DFS traversal
 */
export interface DFSResult {
  /**
   * Nodes in the order they were visited (pre-order)
   */
  visitOrder: IdeaNode[]
  
  /**
   * Nodes in post-order (after visiting all descendants)
   */
  postOrder: IdeaNode[]
  
  /**
   * Map from node ID to its discovery time
   */
  discoveryTime: Map<string, number>
  
  /**
   * Map from node ID to its finish time
   */
  finishTime: Map<string, number>
  
  /**
   * Map from node ID to its parent in the DFS tree
   */
  parents: Map<string, string | null>
  
  /**
   * Set of visited node IDs
   */
  visited: Set<string>
}

/**
 * Options for DFS traversal
 */
export interface DFSOptions {
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
  
  /**
   * Callback function called when a node is first discovered
   */
  onDiscover?: (node: IdeaNode, time: number) => void
  
  /**
   * Callback function called when a node is finished (all descendants visited)
   */
  onFinish?: (node: IdeaNode, time: number) => void
}

/**
 * Perform Depth-First Search traversal on a graph
 * 
 * @param graph - The graph to traverse
 * @param startNodeId - ID of the node to start from
 * @param options - Optional configuration for the traversal
 * @returns DFS traversal result
 */
export function dfs(
  graph: Graph,
  startNodeId: string,
  options: DFSOptions = {}
): DFSResult {
  const {
    maxDepth = Infinity,
    nodeFilter = () => true,
    edgeFilter = () => true,
    directed = false,
    onDiscover,
    onFinish
  } = options

  const visitOrder: IdeaNode[] = []
  const postOrder: IdeaNode[] = []
  const discoveryTime = new Map<string, number>()
  const finishTime = new Map<string, number>()
  const parents = new Map<string, string | null>()
  const visited = new Set<string>()
  
  // Build adjacency list
  const adjacency = buildAdjacencyList(graph, directed, edgeFilter)
  
  // Time counter for discovery/finish times
  let time = 0
  
  // Recursive DFS helper
  function dfsVisit(nodeId: string, depth: number, parentId: string | null): void {
    if (visited.has(nodeId) || depth > maxDepth) {
      return
    }
    
    const node = graph.nodes.find(n => n.id === nodeId)
    if (!node || !nodeFilter(node)) {
      return
    }
    
    // Mark as visited
    visited.add(nodeId)
    parents.set(nodeId, parentId)
    
    // Discovery
    time++
    discoveryTime.set(nodeId, time)
    visitOrder.push(node)
    onDiscover?.(node, time)
    
    // Visit neighbors
    const neighbors = adjacency.get(nodeId) || []
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        dfsVisit(neighborId, depth + 1, nodeId)
      }
    }
    
    // Finish
    time++
    finishTime.set(nodeId, time)
    postOrder.push(node)
    onFinish?.(node, time)
  }
  
  // Start DFS from the given node
  dfsVisit(startNodeId, 0, null)
  
  return {
    visitOrder,
    postOrder,
    discoveryTime,
    finishTime,
    parents,
    visited
  }
}

/**
 * Perform a complete DFS traversal of all nodes in the graph
 * 
 * @param graph - The graph to traverse
 * @param options - Optional configuration for the traversal
 * @returns DFS traversal result covering all connected components
 */
export function dfsComplete(
  graph: Graph,
  options: DFSOptions = {}
): DFSResult {
  const {
    maxDepth = Infinity,
    nodeFilter = () => true,
    edgeFilter = () => true,
    directed = false,
    onDiscover,
    onFinish
  } = options

  const visitOrder: IdeaNode[] = []
  const postOrder: IdeaNode[] = []
  const discoveryTime = new Map<string, number>()
  const finishTime = new Map<string, number>()
  const parents = new Map<string, string | null>()
  const visited = new Set<string>()
  
  // Build adjacency list
  const adjacency = buildAdjacencyList(graph, directed, edgeFilter)
  
  // Time counter for discovery/finish times
  let time = 0
  
  // Recursive DFS helper
  function dfsVisit(nodeId: string, depth: number, parentId: string | null): void {
    if (visited.has(nodeId) || depth > maxDepth) {
      return
    }
    
    const node = graph.nodes.find(n => n.id === nodeId)
    if (!node || !nodeFilter(node)) {
      return
    }
    
    // Mark as visited
    visited.add(nodeId)
    parents.set(nodeId, parentId)
    
    // Discovery
    time++
    discoveryTime.set(nodeId, time)
    visitOrder.push(node)
    onDiscover?.(node, time)
    
    // Visit neighbors
    const neighbors = adjacency.get(nodeId) || []
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        dfsVisit(neighborId, depth + 1, nodeId)
      }
    }
    
    // Finish
    time++
    finishTime.set(nodeId, time)
    postOrder.push(node)
    onFinish?.(node, time)
  }
  
  // Visit all nodes
  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfsVisit(node.id, 0, null)
    }
  }
  
  return {
    visitOrder,
    postOrder,
    discoveryTime,
    finishTime,
    parents,
    visited
  }
}

/**
 * Detect cycles in a graph using DFS
 * 
 * @param graph - The graph to analyze
 * @param directed - Whether to treat edges as directed
 * @returns Array of cycles, each represented as an array of node IDs
 */
export function detectCycles(
  graph: Graph,
  directed: boolean = false
): string[][] {
  const cycles: string[][] = []
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const adjacency = buildAdjacencyList(graph, directed, () => true)
  
  function dfsForCycles(nodeId: string, path: string[]): void {
    visited.add(nodeId)
    recursionStack.add(nodeId)
    path.push(nodeId)
    
    const neighbors = adjacency.get(nodeId) || []
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        dfsForCycles(neighborId, [...path])
      } else if (recursionStack.has(neighborId)) {
        // Found a cycle
        const cycleStart = path.indexOf(neighborId)
        if (cycleStart !== -1) {
          cycles.push([...path.slice(cycleStart), neighborId])
        }
      }
    }
    
    recursionStack.delete(nodeId)
  }
  
  // Check all nodes
  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfsForCycles(node.id, [])
    }
  }
  
  return cycles
}

/**
 * Perform topological sort on a directed acyclic graph (DAG)
 * 
 * @param graph - The graph to sort
 * @returns Array of node IDs in topological order, or null if the graph has cycles
 */
export function topologicalSort(graph: Graph): string[] | null {
  // Check for cycles in directed graph
  const cycles = detectCycles(graph, true)
  if (cycles.length > 0) {
    return null // Graph has cycles, cannot perform topological sort
  }
  
  // Use DFS to get finish times
  const result = dfsComplete(graph, { directed: true })
  
  // Sort by finish time in descending order
  return result.postOrder.reverse().map(node => node.id)
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