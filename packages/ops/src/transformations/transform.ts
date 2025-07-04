import { Graph, IdeaNode, Edge } from '@refinery/schema'
import { filterGraph, NodeFilterCriteria, EdgeFilterCriteria } from '../queries/filter'

/**
 * Options for graph transformations
 */
export interface TransformOptions {
  /**
   * Whether to preserve metadata (default: true)
   */
  preserveMetadata?: boolean
  
  /**
   * Whether to update timestamps (default: true)
   */
  updateTimestamps?: boolean
}

/**
 * Map nodes to new nodes using a transformation function
 * 
 * @param graph - The graph to transform
 * @param transform - Function to transform each node
 * @param options - Transformation options
 * @returns New graph with transformed nodes
 */
export function mapNodes(
  graph: Graph,
  transform: (node: IdeaNode, index: number, array: IdeaNode[]) => IdeaNode,
  options: TransformOptions = {}
): Graph {
  const {
    preserveMetadata = true,
    updateTimestamps = true
  } = options
  
  const transformedNodes = graph.nodes.map((node, index, array) => {
    const transformed = transform(node, index, array)
    
    if (updateTimestamps) {
      return {
        ...transformed,
        updatedAt: new Date().toISOString()
      }
    }
    
    return transformed
  })
  
  return {
    ...graph,
    nodes: transformedNodes,
    metadata: preserveMetadata ? graph.metadata : undefined,
    updatedAt: updateTimestamps ? new Date().toISOString() : graph.updatedAt
  }
}

/**
 * Map edges to new edges using a transformation function
 * 
 * @param graph - The graph to transform
 * @param transform - Function to transform each edge
 * @param options - Transformation options
 * @returns New graph with transformed edges
 */
export function mapEdges(
  graph: Graph,
  transform: (edge: Edge, index: number, array: Edge[]) => Edge,
  options: TransformOptions = {}
): Graph {
  const {
    preserveMetadata = true,
    updateTimestamps = true
  } = options
  
  const transformedEdges = graph.edges.map((edge, index, array) => {
    const transformed = transform(edge, index, array)
    
    if (updateTimestamps) {
      return {
        ...transformed,
        updatedAt: new Date().toISOString()
      }
    }
    
    return transformed
  })
  
  return {
    ...graph,
    edges: transformedEdges,
    metadata: preserveMetadata ? graph.metadata : undefined,
    updatedAt: updateTimestamps ? new Date().toISOString() : graph.updatedAt
  }
}

/**
 * Transform the entire graph using transformation functions
 * 
 * @param graph - The graph to transform
 * @param nodeTransform - Optional function to transform nodes
 * @param edgeTransform - Optional function to transform edges
 * @param options - Transformation options
 * @returns New transformed graph
 */
export function transformGraph(
  graph: Graph,
  nodeTransform?: (node: IdeaNode) => IdeaNode,
  edgeTransform?: (edge: Edge) => Edge,
  options: TransformOptions = {}
): Graph {
  let result = graph
  
  if (nodeTransform) {
    result = mapNodes(result, nodeTransform, options)
  }
  
  if (edgeTransform) {
    result = mapEdges(result, edgeTransform, options)
  }
  
  return result
}

/**
 * Merge multiple graphs into one
 * 
 * @param graphs - Array of graphs to merge
 * @param options - Merge options
 * @returns Merged graph
 */
export function mergeGraphs(
  graphs: Graph[],
  options: TransformOptions & {
    /**
     * How to handle duplicate node IDs
     */
    duplicateNodeStrategy?: 'keep-first' | 'keep-last' | 'rename'
    
    /**
     * How to handle duplicate edge IDs
     */
    duplicateEdgeStrategy?: 'keep-first' | 'keep-last' | 'rename'
  } = {}
): Graph {
  const {
    preserveMetadata = true,
    updateTimestamps = true,
    duplicateNodeStrategy = 'keep-first',
    duplicateEdgeStrategy = 'keep-first'
  } = options
  
  const nodeMap = new Map<string, IdeaNode>()
  const edgeMap = new Map<string, Edge>()
  const metadata: Record<string, unknown> = {}
  
  // Merge nodes
  for (const graph of graphs) {
    for (const node of graph.nodes) {
      if (nodeMap.has(node.id)) {
        switch (duplicateNodeStrategy) {
          case 'keep-first':
            // Skip
            break
          case 'keep-last':
            nodeMap.set(node.id, node)
            break
          case 'rename': {
            let newId = node.id
            let counter = 1
            while (nodeMap.has(newId)) {
              newId = `${node.id}_${counter++}`
            }
            nodeMap.set(newId, { ...node, id: newId })
            break
          }
        }
      } else {
        nodeMap.set(node.id, node)
      }
    }
    
    // Merge metadata
    if (preserveMetadata && graph.metadata) {
      Object.assign(metadata, graph.metadata)
    }
  }
  
  // Merge edges
  for (const graph of graphs) {
    for (const edge of graph.edges) {
      // Check if source and target nodes exist
      if (!nodeMap.has(edge.source) || !nodeMap.has(edge.target)) {
        continue // Skip edges with missing nodes
      }
      
      if (edgeMap.has(edge.id)) {
        switch (duplicateEdgeStrategy) {
          case 'keep-first':
            // Skip
            break
          case 'keep-last':
            edgeMap.set(edge.id, edge)
            break
          case 'rename': {
            let newId = edge.id
            let counter = 1
            while (edgeMap.has(newId)) {
              newId = `${edge.id}_${counter++}`
            }
            edgeMap.set(newId, { ...edge, id: newId })
            break
          }
        }
      } else {
        edgeMap.set(edge.id, edge)
      }
    }
  }
  
  const timestamp = new Date().toISOString()
  
  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values()),
    metadata: preserveMetadata ? metadata : undefined,
    createdAt: timestamp,
    updatedAt: updateTimestamps ? timestamp : undefined
  }
}

/**
 * Create a subgraph containing only specified nodes and their edges
 * 
 * @param graph - The source graph
 * @param nodeIds - IDs of nodes to include
 * @param includeEdges - Whether to include edges between selected nodes
 * @returns Subgraph
 */
export function subgraph(
  graph: Graph,
  nodeIds: string[],
  includeEdges: boolean = true
): Graph {
  const nodeIdSet = new Set(nodeIds)
  
  const nodeCriteria: NodeFilterCriteria = {
    customFilter: (node) => nodeIdSet.has(node.id)
  }
  
  const edgeCriteria: EdgeFilterCriteria | undefined = includeEdges
    ? {
        customFilter: (edge) => 
          nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target)
      }
    : {
        customFilter: () => false // Exclude all edges
      }
  
  return filterGraph(graph, nodeCriteria, edgeCriteria)
}

/**
 * Reverse all edges in the graph
 * 
 * @param graph - The graph to transform
 * @param options - Transformation options
 * @returns Graph with reversed edges
 */
export function reverseEdges(
  graph: Graph,
  options: TransformOptions = {}
): Graph {
  return mapEdges(graph, edge => ({
    ...edge,
    source: edge.target,
    target: edge.source
  }), options)
}

/**
 * Remove duplicate edges between nodes
 * 
 * @param graph - The graph to clean
 * @param keepFirst - Whether to keep first or last duplicate (default: true)
 * @returns Graph without duplicate edges
 */
export function removeDuplicateEdges(
  graph: Graph,
  keepFirst: boolean = true
): Graph {
  const seen = new Set<string>()
  const uniqueEdges: Edge[] = []
  
  const edges = keepFirst ? graph.edges : [...graph.edges].reverse()
  
  for (const edge of edges) {
    // Create a key that represents the connection
    const key = edge.directed
      ? `${edge.source}->${edge.target}`
      : [edge.source, edge.target].sort().join('<->')
    
    if (!seen.has(key)) {
      seen.add(key)
      uniqueEdges.push(edge)
    }
  }
  
  return {
    ...graph,
    edges: keepFirst ? uniqueEdges : uniqueEdges.reverse()
  }
}

/**
 * Contract nodes - merge multiple nodes into one
 * 
 * @param graph - The graph to transform
 * @param nodeIds - IDs of nodes to merge
 * @param targetId - ID of the target node (or first node if not specified)
 * @param mergeStrategy - How to merge node properties
 * @returns Graph with contracted nodes
 */
export function contractNodes(
  graph: Graph,
  nodeIds: string[],
  targetId?: string,
  mergeStrategy?: (nodes: IdeaNode[]) => Partial<IdeaNode>
): Graph {
  if (nodeIds.length < 2) {
    return graph
  }
  
  const nodeIdSet = new Set(nodeIds)
  const target = targetId || nodeIds[0]
  
  if (!nodeIdSet.has(target)) {
    throw new Error('Target node must be in the list of nodes to contract')
  }
  
  // Find nodes to merge
  const nodesToMerge = graph.nodes.filter(n => nodeIdSet.has(n.id))
  const targetNode = nodesToMerge.find(n => n.id === target)
  
  if (!targetNode) {
    return graph
  }
  
  // Apply merge strategy if provided
  const mergedProperties = mergeStrategy
    ? mergeStrategy(nodesToMerge)
    : {
        label: nodesToMerge.map(n => n.label).join(' + '),
        content: nodesToMerge.map(n => n.content || '').filter(Boolean).join('\n\n')
      }
  
  // Create new node list
  const newNodes = graph.nodes
    .filter(n => !nodeIdSet.has(n.id) || n.id === target)
    .map(n => n.id === target
      ? { ...targetNode, ...mergedProperties, id: target }
      : n
    )
  
  // Update edges
  const newEdges = graph.edges.map(edge => {
    const newSource = nodeIdSet.has(edge.source) ? target : edge.source
    const newTarget = nodeIdSet.has(edge.target) ? target : edge.target
    
    // Skip self-loops created by contraction
    if (newSource === newTarget) {
      return null
    }
    
    return {
      ...edge,
      source: newSource,
      target: newTarget
    }
  }).filter((edge): edge is Edge => edge !== null)
  
  return {
    ...graph,
    nodes: newNodes,
    edges: removeDuplicateEdges({ ...graph, edges: newEdges }).edges
  }
}