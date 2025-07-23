/**
 * Graph data structure conversion utilities with memoization
 * Converts between Map-based store format and Array-based ForceGraph3D format
 */

import type { IdeaNode, Edge } from '@refinery/schema'

// Cache entry types to track Map size
type NodeCacheEntry = {
  size: number
  data: IdeaNode[]
}

type EdgeCacheEntry = {
  size: number
  data: any[]
}

// WeakMap cache for referential stability
// Prevents recreating arrays on every render
let nodeArrayCache = new WeakMap<Map<string, IdeaNode>, NodeCacheEntry>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let edgeArrayCache = new WeakMap<Map<string, Edge>, EdgeCacheEntry>()

// Shallow clone helpers to prevent mutation of cached data
function shallowCloneNode(node: IdeaNode): IdeaNode {
  return { ...node }
}

function shallowCloneLink(link: any): any {
  return { ...link }
}

/**
 * Convert Map-based graph data to Array format for ForceGraph3D
 * Uses WeakMap cache to maintain referential stability across renders
 */
export function mapToArrays(
  nodes: Map<string, IdeaNode>,
  edges: Map<string, Edge>
): { nodes: IdeaNode[]; links: any[] } {
  // Check cache for nodes with size validation
  let nodeCache = nodeArrayCache.get(nodes)
  let nodesArray: IdeaNode[]

  if (!nodeCache || nodeCache.size !== nodes.size) {
    // Create array from Map values (store original references in cache)
    const originalArray = Array.from(nodes.values())
    nodeArrayCache.set(nodes, {
      size: nodes.size,
      data: originalArray,
    })
    // Return shallow clones
    nodesArray = originalArray.map(shallowCloneNode)
  } else {
    // Return fresh clones from cache
    nodesArray = nodeCache.data.map(shallowCloneNode)
  }

  // Check cache for edges with size validation
  let edgeCache = edgeArrayCache.get(edges)
  let linksArray: any[]

  if (!edgeCache || edgeCache.size !== edges.size) {
    // Create the array and cache it (store original format in cache)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const originalLinks = Array.from(edges.values()).map((edge): any => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      tier: 0, // Legacy compatibility for ForceGraph3D
      strength: edge.strength,
    }))
    edgeArrayCache.set(edges, {
      size: edges.size,
      data: originalLinks,
    })
    // Return shallow clones
    linksArray = originalLinks.map(shallowCloneLink)
  } else {
    // Return fresh clones from cache
    linksArray = edgeCache.data.map(shallowCloneLink)
  }

  return { nodes: nodesArray, links: linksArray }
}

/**
 * Converts arrays of nodes and edges into Maps for use in the store.
 * This is a "dumb" converter, it expects partials and applies schema defaults.
 */
export function arraysToMaps(
  nodes: Partial<IdeaNode>[],

  edges: Partial<Edge>[]
): { nodes: Map<string, IdeaNode>; edges: Map<string, Edge> } {
  const nodesMap = new Map<string, IdeaNode>()
  const edgesMap = new Map<string, Edge>()

  // Convert nodes
  nodes.forEach((node) => {
    if (node && node.id) {
      // Create a schema-compliant node, applying defaults only where necessary.
      const ideaNode: IdeaNode = {
        id: node.id,
        label: node.label || '',
        ...node, // Spread the rest of the partial data
      }
      nodesMap.set(node.id, ideaNode)
    }
  })

  // Convert edges
  edges.forEach((edge) => {
    if (edge && edge.source && edge.target) {
      const edgeId = edge.id || `${edge.source}-${edge.target}`
      const refineryEdge: Edge = {
        id: edgeId,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'relates-to',
        directed: edge.directed || false,
        visible: edge.visible ?? true,
        ...edge, // Spread the rest of the partial data
        // Apply defaults after spread to ensure they're not overwritten
        strength: edge.strength ?? 1.0,
      }
      edgesMap.set(edgeId, refineryEdge)
    }
  })

  return { nodes: nodesMap, edges: edgesMap }
}

/**
 * Clear the cache by re-initializing the WeakMaps.
 * (Useful for testing or when graph data is replaced entirely)
 */
export function clearConversionCache(): void {
  nodeArrayCache = new WeakMap<Map<string, IdeaNode>, NodeCacheEntry>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edgeArrayCache = new WeakMap<Map<string, Edge>, EdgeCacheEntry>()
}
