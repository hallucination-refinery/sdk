import { Graph, GraphUtils } from '@refinery/schema'
import { bfs } from './bfs'

/**
 * Interwingle connection strength between two nodes
 */
export interface ConnectionStrength {
  /**
   * The two nodes being compared
   */
  sourceId: string
  targetId: string
  
  /**
   * Direct connection strength (0-1)
   */
  direct: number
  
  /**
   * Indirect connection strength through shared neighbors (0-1)
   */
  indirect: number
  
  /**
   * Combined connection strength (0-1)
   */
  combined: number
  
  /**
   * Number of shortest paths between nodes
   */
  pathCount: number
  
  /**
   * Length of shortest path
   */
  shortestPathLength: number
  
  /**
   * Shared neighbor node IDs
   */
  sharedNeighbors: string[]
}

/**
 * Interwingle analysis result for a node
 */
export interface InterwingleAnalysis {
  /**
   * The node being analyzed
   */
  nodeId: string
  
  /**
   * Map of connection strengths to other nodes
   */
  connections: Map<string, ConnectionStrength>
  
  /**
   * Nodes ranked by connection strength
   */
  rankedConnections: Array<{
    nodeId: string
    strength: number
  }>
  
  /**
   * Clustering coefficient for this node
   */
  clusteringCoefficient: number
  
  /**
   * Betweenness centrality
   */
  betweennessCentrality: number
}

/**
 * Options for Interwingle algorithm
 */
export interface InterwingleOptions {
  /**
   * Maximum depth to search for connections (default: 3)
   */
  maxDepth?: number
  
  /**
   * Weight for direct connections (default: 1.0)
   */
  directWeight?: number
  
  /**
   * Weight for indirect connections (default: 0.5)
   */
  indirectWeight?: number
  
  /**
   * Minimum connection strength to include (default: 0.1)
   */
  minStrength?: number
  
  /**
   * Whether to respect edge direction (default: false)
   */
  directed?: boolean
}

/**
 * Calculate Interwingle connections for a specific node
 * 
 * The Interwingle algorithm finds and ranks connections between ideas
 * based on direct links, shared neighbors, and path analysis.
 * 
 * @param graph - The graph to analyze
 * @param nodeId - ID of the node to analyze
 * @param options - Optional configuration
 * @returns Interwingle analysis result
 */
export function interwingle(
  graph: Graph,
  nodeId: string,
  options: InterwingleOptions = {}
): InterwingleAnalysis {
  const {
    maxDepth = 3,
    directWeight = 1.0,
    indirectWeight = 0.5,
    minStrength = 0.1,
    directed = false
  } = options
  
  const connections = new Map<string, ConnectionStrength>()
  
  // Get neighbors and build adjacency list
  const adjacency = buildAdjacencyList(graph, directed)
  const directNeighbors = adjacency.get(nodeId) || []
  
  // Analyze each node in the graph
  for (const targetNode of graph.nodes) {
    if (targetNode.id === nodeId) {
      continue // Skip self
    }
    
    // Calculate connection strength
    const strength = calculateConnectionStrength(
      graph,
      nodeId,
      targetNode.id,
      directNeighbors,
      adjacency,
      maxDepth,
      directWeight,
      indirectWeight
    )
    
    if (strength.combined >= minStrength) {
      connections.set(targetNode.id, strength)
    }
  }
  
  // Rank connections by strength
  const rankedConnections = Array.from(connections.entries())
    .map(([id, strength]) => ({
      nodeId: id,
      strength: strength.combined
    }))
    .sort((a, b) => b.strength - a.strength)
  
  // Calculate clustering coefficient
  const clusteringCoefficient = calculateClusteringCoefficient(
    directNeighbors,
    adjacency
  )
  
  // Calculate betweenness centrality
  const betweennessCentrality = calculateBetweennessCentrality(
    graph,
    nodeId,
    directed
  )
  
  return {
    nodeId,
    connections,
    rankedConnections,
    clusteringCoefficient,
    betweennessCentrality
  }
}

/**
 * Find potential connections for a node using Interwingle
 * 
 * @param graph - The graph to analyze
 * @param nodeId - ID of the node to find connections for
 * @param limit - Maximum number of suggestions (default: 10)
 * @param options - Optional configuration
 * @returns Array of suggested node IDs with connection strengths
 */
export function suggestConnections(
  graph: Graph,
  nodeId: string,
  limit: number = 10,
  options: InterwingleOptions = {}
): Array<{ nodeId: string; strength: number; reason: string }> {
  const analysis = interwingle(graph, nodeId, options)
  const currentNeighbors = new Set(
    GraphUtils.getNodeEdges(graph, nodeId).map(edge => 
      edge.source === nodeId ? edge.target : edge.source
    )
  )
  
  // Filter out already connected nodes and rank by potential
  const suggestions = analysis.rankedConnections
    .filter(conn => !currentNeighbors.has(conn.nodeId))
    .slice(0, limit)
    .map(conn => {
      const strength = analysis.connections.get(conn.nodeId)!
      let reason = ''
      
      if (strength.sharedNeighbors.length > 0) {
        reason = `Shares ${strength.sharedNeighbors.length} connections`
      } else if (strength.pathCount > 0) {
        reason = `Connected through ${strength.shortestPathLength} degrees`
      }
      
      return {
        nodeId: conn.nodeId,
        strength: conn.strength,
        reason
      }
    })
  
  return suggestions
}

/**
 * Calculate connection strength between two nodes
 */
function calculateConnectionStrength(
  graph: Graph,
  sourceId: string,
  targetId: string,
  sourceNeighbors: string[],
  adjacency: Map<string, string[]>,
  maxDepth: number,
  directWeight: number,
  indirectWeight: number
): ConnectionStrength {
  const targetNeighbors = adjacency.get(targetId) || []
  
  // Direct connection
  const isDirect = sourceNeighbors.includes(targetId)
  const direct = isDirect ? directWeight : 0
  
  // Shared neighbors (indirect connection)
  const sharedNeighbors = sourceNeighbors.filter(n => 
    targetNeighbors.includes(n)
  )
  const maxPossibleShared = Math.min(sourceNeighbors.length, targetNeighbors.length)
  const indirect = maxPossibleShared > 0
    ? (sharedNeighbors.length / maxPossibleShared) * indirectWeight
    : 0
  
  // Path analysis
  const bfsResult = bfs(graph, sourceId, { maxDepth })
  const distance = bfsResult.distances.get(targetId)
  const shortestPathLength = distance ?? Infinity
  
  // Count paths (simplified - counts only shortest paths)
  const pathCount = distance !== undefined ? 1 : 0
  
  // Combined strength (weighted by distance)
  const distanceFactor = shortestPathLength < Infinity
    ? 1 / (1 + shortestPathLength)
    : 0
  const combined = Math.min(1, direct + indirect + distanceFactor * 0.3)
  
  return {
    sourceId,
    targetId,
    direct: direct / directWeight, // Normalize to 0-1
    indirect: indirect / indirectWeight, // Normalize to 0-1
    combined,
    pathCount,
    shortestPathLength,
    sharedNeighbors
  }
}

/**
 * Calculate clustering coefficient for a node
 * Measures how connected a node's neighbors are to each other
 */
function calculateClusteringCoefficient(
  neighbors: string[],
  adjacency: Map<string, string[]>
): number {
  if (neighbors.length < 2) {
    return 0 // Need at least 2 neighbors
  }
  
  // Count edges between neighbors
  let edgeCount = 0
  for (let i = 0; i < neighbors.length; i++) {
    for (let j = i + 1; j < neighbors.length; j++) {
      const neighbor1Adj = adjacency.get(neighbors[i]) || []
      if (neighbor1Adj.includes(neighbors[j])) {
        edgeCount++
      }
    }
  }
  
  // Maximum possible edges between neighbors
  const maxEdges = (neighbors.length * (neighbors.length - 1)) / 2
  
  return maxEdges > 0 ? edgeCount / maxEdges : 0
}

/**
 * Calculate betweenness centrality for a node
 * Measures how often a node appears on shortest paths between other nodes
 */
function calculateBetweennessCentrality(
  graph: Graph,
  nodeId: string,
  directed: boolean
): number {
  let centrality = 0
  const n = graph.nodes.length
  
  // For each pair of nodes, check if nodeId is on the shortest path
  for (const source of graph.nodes) {
    if (source.id === nodeId) continue
    
    for (const target of graph.nodes) {
      if (target.id === nodeId || target.id === source.id) continue
      
      // Find shortest path from source to target
      const directPath = bfs(graph, source.id, { directed })
      const directDistance = directPath.distances.get(target.id)
      
      if (directDistance === undefined) continue
      
      // Find path through nodeId
      const toNode = bfs(graph, source.id, { directed })
      const fromNode = bfs(graph, nodeId, { directed })
      
      const distToNode = toNode.distances.get(nodeId)
      const distFromNode = fromNode.distances.get(target.id)
      
      if (distToNode !== undefined && distFromNode !== undefined) {
        const throughNodeDistance = distToNode + distFromNode
        
        // If path through nodeId is a shortest path, increment centrality
        if (throughNodeDistance === directDistance) {
          centrality++
        }
      }
    }
  }
  
  // Normalize by number of possible paths
  const normalizationFactor = (n - 1) * (n - 2)
  return normalizationFactor > 0 ? centrality / normalizationFactor : 0
}

/**
 * Build adjacency list for the graph
 */
function buildAdjacencyList(
  graph: Graph,
  directed: boolean
): Map<string, string[]> {
  const adjacency = new Map<string, string[]>()
  
  // Initialize
  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }
  
  // Add edges
  for (const edge of graph.edges) {
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