import { Graph, IdeaNode, Edge, GraphUtils } from '@refinery/schema'

/**
 * Filter criteria for nodes
 */
export interface NodeFilterCriteria {
  /**
   * Filter by node IDs
   */
  ids?: string[]
  
  /**
   * Filter by label (partial match)
   */
  label?: string
  
  /**
   * Filter by content (partial match)
   */
  content?: string
  
  /**
   * Filter by color
   */
  color?: string
  
  /**
   * Filter by selection state
   */
  selected?: boolean
  
  /**
   * Filter by fixed state
   */
  fixed?: boolean
  
  /**
   * Filter by size range
   */
  sizeRange?: {
    min?: number
    max?: number
  }
  
  /**
   * Filter by metadata key-value pairs
   */
  metadata?: Record<string, unknown>
  
  /**
   * Custom filter function
   */
  customFilter?: (node: IdeaNode) => boolean
}

/**
 * Filter criteria for edges
 */
export interface EdgeFilterCriteria {
  /**
   * Filter by edge IDs
   */
  ids?: string[]
  
  /**
   * Filter by source node ID
   */
  source?: string
  
  /**
   * Filter by target node ID
   */
  target?: string
  
  /**
   * Filter by label (partial match)
   */
  label?: string
  
  /**
   * Filter by directed state
   */
  directed?: boolean
  
  /**
   * Filter by strength range
   */
  strengthRange?: {
    min?: number
    max?: number
  }
  
  /**
   * Filter by metadata key-value pairs
   */
  metadata?: Record<string, unknown>
  
  /**
   * Custom filter function
   */
  customFilter?: (edge: Edge) => boolean
}

/**
 * Filter nodes based on criteria
 * 
 * @param graph - The graph to filter
 * @param criteria - Filter criteria
 * @returns Array of filtered nodes
 */
export function filterNodes(
  graph: Graph,
  criteria: NodeFilterCriteria
): IdeaNode[] {
  let nodes = [...graph.nodes]
  
  // Filter by IDs
  if (criteria.ids && criteria.ids.length > 0) {
    const idSet = new Set(criteria.ids)
    nodes = nodes.filter(node => idSet.has(node.id))
  }
  
  // Filter by label
  if (criteria.label !== undefined) {
    const searchTerm = criteria.label.toLowerCase()
    nodes = nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm)
    )
  }
  
  // Filter by content
  if (criteria.content !== undefined) {
    const searchTerm = criteria.content.toLowerCase()
    nodes = nodes.filter(node => 
      node.content?.toLowerCase().includes(searchTerm) ?? false
    )
  }
  
  // Filter by color
  if (criteria.color !== undefined) {
    nodes = nodes.filter(node => node.color === criteria.color)
  }
  
  // Filter by selected state
  if (criteria.selected !== undefined) {
    nodes = nodes.filter(node => node.selected === criteria.selected)
  }
  
  // Filter by fixed state
  if (criteria.fixed !== undefined) {
    nodes = nodes.filter(node => node.fixed === criteria.fixed)
  }
  
  // Filter by size range
  if (criteria.sizeRange) {
    const { min, max } = criteria.sizeRange
    nodes = nodes.filter(node => {
      if (!node.size) return false
      if (min !== undefined && node.size < min) return false
      if (max !== undefined && node.size > max) return false
      return true
    })
  }
  
  // Filter by metadata
  if (criteria.metadata) {
    const metadataEntries = Object.entries(criteria.metadata)
    nodes = nodes.filter(node => {
      if (!node.metadata) return false
      for (const [key, value] of metadataEntries) {
        if (node.metadata[key] !== value) return false
      }
      return true
    })
  }
  
  // Apply custom filter
  if (criteria.customFilter) {
    nodes = nodes.filter(criteria.customFilter)
  }
  
  return nodes
}

/**
 * Filter edges based on criteria
 * 
 * @param graph - The graph to filter
 * @param criteria - Filter criteria
 * @returns Array of filtered edges
 */
export function filterEdges(
  graph: Graph,
  criteria: EdgeFilterCriteria
): Edge[] {
  let edges = [...graph.edges]
  
  // Filter by IDs
  if (criteria.ids && criteria.ids.length > 0) {
    const idSet = new Set(criteria.ids)
    edges = edges.filter(edge => idSet.has(edge.id))
  }
  
  // Filter by source
  if (criteria.source !== undefined) {
    edges = edges.filter(edge => edge.source === criteria.source)
  }
  
  // Filter by target
  if (criteria.target !== undefined) {
    edges = edges.filter(edge => edge.target === criteria.target)
  }
  
  // Filter by label
  if (criteria.label !== undefined) {
    const searchTerm = criteria.label.toLowerCase()
    edges = edges.filter(edge => 
      edge.label?.toLowerCase().includes(searchTerm) ?? false
    )
  }
  
  // Filter by directed state
  if (criteria.directed !== undefined) {
    edges = edges.filter(edge => edge.directed === criteria.directed)
  }
  
  // Filter by strength range
  if (criteria.strengthRange) {
    const { min, max } = criteria.strengthRange
    edges = edges.filter(edge => {
      const strength = edge.strength ?? 1
      if (min !== undefined && strength < min) return false
      if (max !== undefined && strength > max) return false
      return true
    })
  }
  
  // Filter by metadata
  if (criteria.metadata) {
    const metadataEntries = Object.entries(criteria.metadata)
    edges = edges.filter(edge => {
      if (!edge.metadata) return false
      for (const [key, value] of metadataEntries) {
        if (edge.metadata[key] !== value) return false
      }
      return true
    })
  }
  
  // Apply custom filter
  if (criteria.customFilter) {
    edges = edges.filter(criteria.customFilter)
  }
  
  return edges
}

/**
 * Filter graph to create a subgraph
 * 
 * @param graph - The graph to filter
 * @param nodeCriteria - Node filter criteria
 * @param edgeCriteria - Edge filter criteria
 * @param includeOrphanEdges - Whether to include edges whose nodes are filtered out
 * @returns Filtered subgraph
 */
export function filterGraph(
  graph: Graph,
  nodeCriteria?: NodeFilterCriteria,
  edgeCriteria?: EdgeFilterCriteria,
  includeOrphanEdges: boolean = false
): Graph {
  // Filter nodes
  const filteredNodes = nodeCriteria 
    ? filterNodes(graph, nodeCriteria)
    : [...graph.nodes]
  
  // Create set of filtered node IDs for edge filtering
  const nodeIds = new Set(filteredNodes.map(n => n.id))
  
  // Filter edges
  let filteredEdges = edgeCriteria
    ? filterEdges(graph, edgeCriteria)
    : [...graph.edges]
  
  // Remove orphan edges if requested
  if (!includeOrphanEdges) {
    filteredEdges = filteredEdges.filter(edge =>
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    )
  }
  
  return {
    ...graph,
    nodes: filteredNodes,
    edges: filteredEdges,
    metadata: {
      ...graph.metadata,
      filtered: true,
      originalNodeCount: graph.nodes.length,
      originalEdgeCount: graph.edges.length
    }
  }
}

/**
 * Find nodes by degree (number of connections)
 * 
 * @param graph - The graph to search
 * @param minDegree - Minimum degree (inclusive)
 * @param maxDegree - Maximum degree (inclusive)
 * @param directed - Whether to consider edge direction
 * @returns Array of nodes with specified degree
 */
export function findNodesByDegree(
  graph: Graph,
  minDegree: number = 0,
  maxDegree: number = Infinity,
  directed: boolean = false
): IdeaNode[] {
  const degrees = new Map<string, number>()
  
  // Calculate degrees
  for (const node of graph.nodes) {
    degrees.set(node.id, 0)
  }
  
  for (const edge of graph.edges) {
    if (directed && edge.directed) {
      // Out-degree only
      degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1)
    } else {
      // Undirected: increment both
      degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1)
      degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1)
    }
  }
  
  // Filter by degree range
  return graph.nodes.filter(node => {
    const degree = degrees.get(node.id) || 0
    return degree >= minDegree && degree <= maxDegree
  })
}

/**
 * Find isolated nodes (nodes with no connections)
 * 
 * @param graph - The graph to search
 * @returns Array of isolated nodes
 */
export function findIsolatedNodes(graph: Graph): IdeaNode[] {
  return GraphUtils.getOrphanedNodes(graph)
}

/**
 * Find hub nodes (nodes with high degree)
 * 
 * @param graph - The graph to search
 * @param threshold - Minimum degree to be considered a hub
 * @param directed - Whether to consider edge direction
 * @returns Array of hub nodes
 */
export function findHubNodes(
  graph: Graph,
  threshold: number = 5,
  directed: boolean = false
): IdeaNode[] {
  return findNodesByDegree(graph, threshold, Infinity, directed)
}