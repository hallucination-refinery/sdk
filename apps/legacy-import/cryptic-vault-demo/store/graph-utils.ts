/**
 * Graph data structure conversion utilities
 * Converts between Map-based store format and Array-based ForceGraph3D format
 */

import type { IdeaNode, Edge } from '@refinery/schema'

/**
 * Convert Map-based graph data to Array format for ForceGraph3D
 * Uses structuredClone to ensure fresh objects on every call
 */
export function mapToArrays(
  nodes: Map<string, IdeaNode>,
  edges: Map<string, Edge>
): { nodes: IdeaNode[]; links: any[] } {
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
  // This function is no longer needed as WeakMap cache is removed.
  // Keeping it for now, but it will be removed in a subsequent edit.
}
