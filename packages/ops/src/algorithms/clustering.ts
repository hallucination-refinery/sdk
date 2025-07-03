import { Graph, IdeaNode } from '@refinery/schema'
import { bfs, findConnectedComponents } from './bfs'
import { interwingle } from './interwingle'

/**
 * Cluster of nodes
 */
export interface Cluster {
  /**
   * Unique identifier for the cluster
   */
  id: string
  
  /**
   * Nodes in the cluster
   */
  nodes: IdeaNode[]
  
  /**
   * Center node of the cluster (if applicable)
   */
  centerId?: string
  
  /**
   * Cluster metrics
   */
  metrics: {
    /**
     * Average intra-cluster distance
     */
    avgInternalDistance: number
    
    /**
     * Cluster density (edges / possible edges)
     */
    density: number
    
    /**
     * Cluster cohesion score (0-1)
     */
    cohesion: number
  }
}

/**
 * Options for clustering algorithms
 */
export interface ClusteringOptions {
  /**
   * Minimum cluster size (default: 2)
   */
  minSize?: number
  
  /**
   * Maximum cluster size (default: Infinity)
   */
  maxSize?: number
  
  /**
   * Whether to respect edge direction (default: false)
   */
  directed?: boolean
}

/**
 * Find connected component clusters
 * Each connected component becomes a cluster
 * 
 * @param graph - The graph to cluster
 * @param options - Optional configuration
 * @returns Array of clusters
 */
export function clusterByComponents(
  graph: Graph,
  options: ClusteringOptions = {}
): Cluster[] {
  const { minSize = 2, maxSize = Infinity } = options
  
  const components = findConnectedComponents(graph, options)
  
  return components
    .filter(nodes => nodes.length >= minSize && nodes.length <= maxSize)
    .map((nodes, index) => {
      const cluster: Cluster = {
        id: `component-${index}`,
        nodes,
        metrics: calculateClusterMetrics(graph, nodes, options.directed || false)
      }
      
      // Find most central node as center
      const centralities = nodes.map(node => ({
        nodeId: node.id,
        centrality: calculateNodeCentrality(graph, node.id, nodes)
      }))
      
      const center = centralities.sort((a, b) => b.centrality - a.centrality)[0]
      if (center) {
        cluster.centerId = center.nodeId
      }
      
      return cluster
    })
}

/**
 * Hierarchical clustering based on connection strength
 * Groups nodes with strong Interwingle connections
 * 
 * @param graph - The graph to cluster
 * @param options - Optional configuration
 * @returns Array of clusters
 */
export function clusterByStrength(
  graph: Graph,
  options: ClusteringOptions & {
    /**
     * Minimum connection strength to merge clusters (default: 0.5)
     */
    minStrength?: number
  } = {}
): Cluster[] {
  const {
    minSize = 2,
    maxSize = Infinity,
    minStrength = 0.5,
    directed = false
  } = options
  
  // Initialize each node as its own cluster
  const clusters = new Map<string, Set<string>>()
  for (const node of graph.nodes) {
    clusters.set(node.id, new Set([node.id]))
  }
  
  // Calculate all pairwise connection strengths
  const strengths: Array<{
    node1: string
    node2: string
    strength: number
  }> = []
  
  for (let i = 0; i < graph.nodes.length; i++) {
    for (let j = i + 1; j < graph.nodes.length; j++) {
      const node1 = graph.nodes[i]
      const node2 = graph.nodes[j]
      
      const analysis = interwingle(graph, node1.id, { directed })
      const connection = analysis.connections.get(node2.id)
      
      if (connection && connection.combined >= minStrength) {
        strengths.push({
          node1: node1.id,
          node2: node2.id,
          strength: connection.combined
        })
      }
    }
  }
  
  // Sort by strength (descending)
  strengths.sort((a, b) => b.strength - a.strength)
  
  // Merge clusters based on strength
  for (const { node1, node2 } of strengths) {
    const cluster1 = findCluster(clusters, node1)
    const cluster2 = findCluster(clusters, node2)
    
    if (cluster1 && cluster2 && cluster1 !== cluster2) {
      const size1 = clusters.get(cluster1)!.size
      const size2 = clusters.get(cluster2)!.size
      
      // Check size constraints
      if (size1 + size2 <= maxSize) {
        // Merge smaller into larger
        const [larger, smaller] = size1 >= size2 
          ? [cluster1, cluster2] 
          : [cluster2, cluster1]
        
        const largerSet = clusters.get(larger)!
        const smallerSet = clusters.get(smaller)!
        
        smallerSet.forEach(nodeId => largerSet.add(nodeId))
        clusters.delete(smaller)
      }
    }
  }
  
  // Convert to Cluster objects
  const result: Cluster[] = []
  let clusterId = 0
  
  for (const [leaderId, nodeIds] of clusters) {
    if (nodeIds.size >= minSize) {
      const nodes = Array.from(nodeIds)
        .map(id => graph.nodes.find(n => n.id === id)!)
        .filter(Boolean)
      
      result.push({
        id: `strength-${clusterId++}`,
        nodes,
        centerId: leaderId,
        metrics: calculateClusterMetrics(graph, nodes, directed)
      })
    }
  }
  
  return result
}

/**
 * K-means style clustering based on graph distance
 * Groups nodes into k clusters based on shortest path distances
 * 
 * @param graph - The graph to cluster
 * @param k - Number of clusters
 * @param options - Optional configuration
 * @returns Array of k clusters
 */
export function clusterKMeans(
  graph: Graph,
  k: number,
  options: ClusteringOptions & {
    /**
     * Maximum iterations (default: 100)
     */
    maxIterations?: number
  } = {}
): Cluster[] {
  const {
    minSize = 1,
    maxSize = Infinity,
    maxIterations = 100,
    directed = false
  } = options
  
  if (k <= 0 || k > graph.nodes.length) {
    return []
  }
  
  // Initialize centers randomly
  const centers = selectInitialCenters(graph, k)
  const assignments = new Map<string, string>() // node -> center
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const oldAssignments = new Map(assignments)
    
    // Assign each node to nearest center
    for (const node of graph.nodes) {
      let nearestCenter = centers[0]
      let minDistance = Infinity
      
      for (const center of centers) {
        const result = bfs(graph, center, { directed })
        const distance = result.distances.get(node.id) ?? Infinity
        
        if (distance < minDistance) {
          minDistance = distance
          nearestCenter = center
        }
      }
      
      assignments.set(node.id, nearestCenter)
    }
    
    // Check for convergence
    let changed = false
    for (const [nodeId, centerId] of assignments) {
      if (oldAssignments.get(nodeId) !== centerId) {
        changed = true
        break
      }
    }
    
    if (!changed) {
      break // Converged
    }
    
    // Update centers
    for (let i = 0; i < k; i++) {
      const clusterNodes = graph.nodes.filter(n => 
        assignments.get(n.id) === centers[i]
      )
      
      if (clusterNodes.length > 0) {
        // Find most central node in cluster
        let bestNode = clusterNodes[0]
        let minTotalDistance = Infinity
        
        for (const candidate of clusterNodes) {
          let totalDistance = 0
          
          for (const other of clusterNodes) {
            if (candidate.id !== other.id) {
              const result = bfs(graph, candidate.id, { directed })
              totalDistance += result.distances.get(other.id) ?? Infinity
            }
          }
          
          if (totalDistance < minTotalDistance) {
            minTotalDistance = totalDistance
            bestNode = candidate
          }
        }
        
        centers[i] = bestNode.id
      }
    }
  }
  
  // Build clusters from assignments
  const clusterMap = new Map<string, IdeaNode[]>()
  
  for (const [nodeId, centerId] of assignments) {
    const node = graph.nodes.find(n => n.id === nodeId)!
    if (!clusterMap.has(centerId)) {
      clusterMap.set(centerId, [])
    }
    clusterMap.get(centerId)!.push(node)
  }
  
  // Convert to Cluster objects
  const clusters: Cluster[] = []
  let clusterId = 0
  
  for (const [centerId, nodes] of clusterMap) {
    if (nodes.length >= minSize && nodes.length <= maxSize) {
      clusters.push({
        id: `kmeans-${clusterId++}`,
        nodes,
        centerId,
        metrics: calculateClusterMetrics(graph, nodes, directed)
      })
    }
  }
  
  return clusters
}

/**
 * Select initial centers for k-means clustering
 */
function selectInitialCenters(graph: Graph, k: number): string[] {
  const centers: string[] = []
  const used = new Set<string>()
  
  // K-means++ initialization
  // First center is random
  const first = graph.nodes[Math.floor(Math.random() * graph.nodes.length)]
  centers.push(first.id)
  used.add(first.id)
  
  // Remaining centers are chosen based on distance from existing centers
  while (centers.length < k) {
    const distances = new Map<string, number>()
    
    for (const node of graph.nodes) {
      if (!used.has(node.id)) {
        let minDistance = Infinity
        
        for (const center of centers) {
          const result = bfs(graph, center)
          const distance = result.distances.get(node.id) ?? Infinity
          minDistance = Math.min(minDistance, distance)
        }
        
        distances.set(node.id, minDistance)
      }
    }
    
    // Choose node with probability proportional to distance²
    const candidates = Array.from(distances.entries())
    const weights = candidates.map(([_, d]) => d * d)
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    
    if (totalWeight === 0) {
      // All remaining nodes are disconnected, pick random
      const remaining = graph.nodes.filter(n => !used.has(n.id))
      if (remaining.length > 0) {
        const node = remaining[Math.floor(Math.random() * remaining.length)]
        centers.push(node.id)
        used.add(node.id)
      } else {
        break
      }
    } else {
      // Weighted random selection
      let random = Math.random() * totalWeight
      for (let i = 0; i < candidates.length; i++) {
        random -= weights[i]
        if (random <= 0) {
          centers.push(candidates[i][0])
          used.add(candidates[i][0])
          break
        }
      }
    }
  }
  
  return centers
}

/**
 * Find which cluster a node belongs to
 */
function findCluster(
  clusters: Map<string, Set<string>>,
  nodeId: string
): string | null {
  for (const [leaderId, nodeIds] of clusters) {
    if (nodeIds.has(nodeId)) {
      return leaderId
    }
  }
  return null
}

/**
 * Calculate metrics for a cluster
 */
function calculateClusterMetrics(
  graph: Graph,
  nodes: IdeaNode[],
  directed: boolean
): Cluster['metrics'] {
  const nodeIds = new Set(nodes.map(n => n.id))
  
  // Calculate average internal distance
  let totalDistance = 0
  let distanceCount = 0
  
  for (const node1 of nodes) {
    const result = bfs(graph, node1.id, { directed })
    
    for (const node2 of nodes) {
      if (node1.id !== node2.id) {
        const distance = result.distances.get(node2.id)
        if (distance !== undefined) {
          totalDistance += distance
          distanceCount++
        }
      }
    }
  }
  
  const avgInternalDistance = distanceCount > 0 
    ? totalDistance / distanceCount 
    : 0
  
  // Calculate density
  let internalEdges = 0
  for (const edge of graph.edges) {
    if (nodeIds.has(edge.source) && nodeIds.has(edge.target)) {
      internalEdges++
    }
  }
  
  const possibleEdges = directed
    ? nodes.length * (nodes.length - 1)
    : nodes.length * (nodes.length - 1) / 2
  
  const density = possibleEdges > 0 ? internalEdges / possibleEdges : 0
  
  // Calculate cohesion (combination of density and connectivity)
  const cohesion = (density + (1 / (1 + avgInternalDistance))) / 2
  
  return {
    avgInternalDistance,
    density,
    cohesion
  }
}

/**
 * Calculate centrality of a node within a subset of nodes
 */
function calculateNodeCentrality(
  graph: Graph,
  nodeId: string,
  nodes: IdeaNode[]
): number {
  const result = bfs(graph, nodeId)
  
  let totalDistance = 0
  let count = 0
  
  for (const node of nodes) {
    if (node.id !== nodeId) {
      const distance = result.distances.get(node.id)
      if (distance !== undefined) {
        totalDistance += distance
        count++
      }
    }
  }
  
  // Return inverse of average distance (higher = more central)
  return count > 0 ? count / totalDistance : 0
}