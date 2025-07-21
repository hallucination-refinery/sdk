/**
 * This file contains graph traversal utilities for the Cryptic Vault demo.
 */

export interface TraversalResult {
  clickedNodeId: string
  nodeIds: Set<string>
  upstreamNodes: Set<string>
  downstreamNodes: Set<string>
  affectedLinks: Set<string>
}

/**
 * Performs a two-hop traversal from a starting node.
 * @param startNodeId The ID of the node to start the traversal from.
 * @param edges The list of all visible edges in the graph.
 * @returns A TraversalResult object.
 */
export function performTwoHopTraversal(startNodeId: string, edges: any[]): TraversalResult {
  const result: TraversalResult = {
    clickedNodeId: startNodeId,
    nodeIds: new Set<string>(),
    upstreamNodes: new Set<string>(),
    downstreamNodes: new Set<string>(),
    affectedLinks: new Set<string>(),
  }

  // Add the selected node
  result.nodeIds.add(startNodeId)

  // Create adjacency maps for efficient traversal
  const outgoingMap = new Map<string, Set<string>>()
  const incomingMap = new Map<string, Set<string>>()

  edges.forEach((link) => {
    const source = typeof link.source === 'object' ? link.source.id : link.source
    const target = typeof link.target === 'object' ? link.target.id : link.target

    if (!outgoingMap.has(source)) {
      outgoingMap.set(source, new Set())
    }
    outgoingMap.get(source)!.add(target)

    if (!incomingMap.has(target)) {
      incomingMap.set(target, new Set())
    }
    incomingMap.get(target)!.add(source)
  })

  // First hop - direct connections
  const directUpstream = incomingMap.get(startNodeId) || new Set<string>()
  const directDownstream = outgoingMap.get(startNodeId) || new Set<string>()

  directUpstream.forEach((id) => {
    result.nodeIds.add(id)
    result.upstreamNodes.add(id)
    // Add the link to affected links
    result.affectedLinks.add(`${id}-${startNodeId}`)
  })

  directDownstream.forEach((id) => {
    result.nodeIds.add(id)
    result.downstreamNodes.add(id)
    // Add the link to affected links
    result.affectedLinks.add(`${startNodeId}-${id}`)
  })

  // Second hop - connections of connections
  directUpstream.forEach((upstreamId) => {
    const secondHopUpstream = incomingMap.get(upstreamId) || new Set<string>()
    secondHopUpstream.forEach((id) => {
      if (id !== startNodeId) {
        result.nodeIds.add(id)
        result.upstreamNodes.add(id)
        // Add the link to affected links
        result.affectedLinks.add(`${id}-${upstreamId}`)
      }
    })
  })

  directDownstream.forEach((downstreamId) => {
    const secondHopDownstream = outgoingMap.get(downstreamId) || new Set<string>()
    secondHopDownstream.forEach((id) => {
      if (id !== startNodeId) {
        result.nodeIds.add(id)
        result.downstreamNodes.add(id)
        // Add the link to affected links
        result.affectedLinks.add(`${downstreamId}-${id}`)
      }
    })
  })

  return result
}
