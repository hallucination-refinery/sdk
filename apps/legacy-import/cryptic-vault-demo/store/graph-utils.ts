/**
 * Graph data structure conversion utilities with memoization
 * Converts between Map-based store format and Array-based ForceGraph3D format
 */

import type { IdeaNode, Edge } from '@refinery/schema'

// WeakMap cache for referential stability
// Prevents recreating arrays on every render
const nodeArrayCache = new WeakMap<Map<string, IdeaNode>, IdeaNode[]>()
const edgeArrayCache = new WeakMap<Map<string, Edge>, any[]>()

/**
 * Convert Map-based graph data to Array format for ForceGraph3D
 * Uses WeakMap cache to maintain referential stability across renders
 */
export function mapToArrays(
  nodes: Map<string, IdeaNode>,
  edges: Map<string, Edge>
): { nodes: IdeaNode[]; links: any[] } {
  // Check cache for nodes
  let nodesArray = nodeArrayCache.get(nodes)
  if (!nodesArray) {
    nodesArray = Array.from(nodes.values())
    nodeArrayCache.set(nodes, nodesArray)
  }

  // Check cache for edges
  let linksArray = edgeArrayCache.get(edges)
  if (!linksArray) {
    // ForceGraph3D expects 'links' with source/target/tier
    linksArray = Array.from(edges.values()).map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      tier: 0, // Legacy compatibility
      confidence: edge.confidence
    }))
    edgeArrayCache.set(edges, linksArray)
  }

  return { nodes: nodesArray, links: linksArray }
}

/**
 * Convert Array-based graph data to Map format for store
 * Used when loading initial data from JSON files
 */
export function arraysToMaps(
  nodes: any[],
  edges: any[]
): { nodes: Map<string, IdeaNode>; edges: Map<string, Edge> } {
  const nodesMap = new Map<string, IdeaNode>()
  const edgesMap = new Map<string, Edge>()

  // Convert nodes
  nodes.forEach(node => {
    // Ensure node has required IdeaNode properties
    const ideaNode: IdeaNode = {
      id: node.id,
      type: node.type || 'idea',
      label: node.label || node.title || '',
      links: node.links || [],
      meta: {
        source: node.meta?.source || 'system',
        created: node.meta?.created || Date.now(),
        relevanceScore: node.meta?.relevanceScore || 0.8,
        ...node.meta
      },
      state: {
        isSelected: false,
        currentLOD: 'Mid',
        isCollapsed: false,
        isHidden: false,
        isLinkingStart: false,
        ...node.state
      },
      secret: node.secret || false,
      ...node
    }
    nodesMap.set(node.id, ideaNode)
  })

  // Convert edges
  edges.forEach(edge => {
    const edgeId = edge.id || `${edge.source}-${edge.target}`
    const refineryEdge: Edge = {
      id: edgeId,
      source: edge.source,
      target: edge.target,
      confidence: edge.confidence || edge.weight || 0.8
    }
    edgesMap.set(edgeId, refineryEdge)
  })

  return { nodes: nodesMap, edges: edgesMap }
}

/**
 * Clear the cache (useful for testing or when graph data is replaced entirely)
 */
export function clearConversionCache(): void {
  nodeArrayCache.clear()
  edgeArrayCache.clear()
}