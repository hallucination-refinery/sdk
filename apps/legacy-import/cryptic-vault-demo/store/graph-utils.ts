/**
 * Graph data structure conversion utilities
 * Converts between Map-based store format and Array-based ForceGraph3D format
 */

import type { IdeaNode, Edge } from '@refinery/schema'

// Cache for version-keyed graph arrays
const graphArrayCache = new Map<
  string,
  {
    version: number
    arrays: { nodes: IdeaNode[]; links: any[] }
    timestamp: number
  }
>()

// Cache configuration
const MAX_CACHE_SIZE = 10
const CACHE_TTL_MS = 60000 // 1 minute

/**
 * Convert Map-based graph data to Array format for ForceGraph3D
 * Uses structuredClone to ensure fresh objects on every call
 */
export function mapToArrays(
  nodes: Map<string, IdeaNode>,
  edges: Map<string, Edge>
): { nodes: IdeaNode[]; links: any[] } {
  console.log('[mapToArrays] Called with', nodes.size, 'nodes and', edges.size, 'edges')
  console.trace('[mapToArrays] Call stack')

  return structuredClone({
    nodes: Array.from(nodes.values()),
    links: Array.from(edges.values()).map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      tier: 0,
      strength: e.strength,
    })),
  })
}

/**
 * Version-aware conversion with caching
 * Returns the same array instances for the same version
 */
export function mapToArraysCached(
  nodes: Map<string, IdeaNode>,
  edges: Map<string, Edge>,
  version: number
): { nodes: IdeaNode[]; links: any[] } {
  // Create cache key based on size and version
  const cacheKey = `v${version}-n${nodes.size}-e${edges.size}`

  console.log('[mapToArraysCached] Called with version', version, 'key:', cacheKey)

  // Check cache
  const cached = graphArrayCache.get(cacheKey)
  const now = Date.now()

  if (cached && cached.version === version && now - cached.timestamp < CACHE_TTL_MS) {
    console.log('[mapToArraysCached] Cache hit!')
    return cached.arrays // Return same object reference
  }

  console.log('[mapToArraysCached] Cache miss, creating new arrays')

  // Create new arrays
  const arrays = {
    nodes: Array.from(nodes.values()),
    links: Array.from(edges.values()).map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      tier: 0,
      strength: e.strength,
    })),
  }

  // Update cache
  graphArrayCache.set(cacheKey, {
    version,
    arrays,
    timestamp: now,
  })

  // Implement LRU eviction
  if (graphArrayCache.size > MAX_CACHE_SIZE) {
    const firstKey = graphArrayCache.keys().next().value
    if (firstKey) {
      console.log('[mapToArraysCached] Evicting oldest cache entry:', firstKey)
      graphArrayCache.delete(firstKey)
    }
  }

  // Clean up expired entries
  for (const [key, entry] of graphArrayCache.entries()) {
    if (now - entry.timestamp > CACHE_TTL_MS) {
      console.log('[mapToArraysCached] Removing expired cache entry:', key)
      graphArrayCache.delete(key)
    }
  }

  return arrays
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
  graphArrayCache.clear()
  console.log('[clearConversionCache] Cache cleared')
}
