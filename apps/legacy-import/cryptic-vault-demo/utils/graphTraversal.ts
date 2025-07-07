export interface TraversalResult {
  clickedNodeId: string;
  nodeIds: Set<string>;
  upstreamNodes: Set<string>;
  downstreamNodes: Set<string>;
  affectedLinks: Set<string>;
}

export function performTwoHopTraversal(
  nodeId: string,
  nodes: any[],
  links: any[],
): TraversalResult {
  const result: TraversalResult = {
    clickedNodeId: nodeId,
    nodeIds: new Set<string>(),
    upstreamNodes: new Set<string>(),
    downstreamNodes: new Set<string>(),
    affectedLinks: new Set<string>(),
  };

  // Add the selected node
  result.nodeIds.add(nodeId);

  // Create adjacency maps for efficient traversal
  const outgoingMap = new Map<string, Set<string>>();
  const incomingMap = new Map<string, Set<string>>();

  links.forEach((link) => {
    const source =
      typeof link.source === 'object' ? link.source.id : link.source;
    const target =
      typeof link.target === 'object' ? link.target.id : link.target;

    if (!outgoingMap.has(source)) {
      outgoingMap.set(source, new Set());
    }
    outgoingMap.get(source)!.add(target);

    if (!incomingMap.has(target)) {
      incomingMap.set(target, new Set());
    }
    incomingMap.get(target)!.add(source);
  });

  // First hop - direct connections
  const directUpstream = incomingMap.get(nodeId) || new Set<string>();
  const directDownstream = outgoingMap.get(nodeId) || new Set<string>();

  directUpstream.forEach((id) => {
    result.nodeIds.add(id);
    result.upstreamNodes.add(id);
    // Add the link to affected links
    result.affectedLinks.add(`${id}-${nodeId}`);
  });

  directDownstream.forEach((id) => {
    result.nodeIds.add(id);
    result.downstreamNodes.add(id);
    // Add the link to affected links
    result.affectedLinks.add(`${nodeId}-${id}`);
  });

  // Second hop - connections of connections
  directUpstream.forEach((upstreamId) => {
    const secondHopUpstream = incomingMap.get(upstreamId) || new Set<string>();
    secondHopUpstream.forEach((id) => {
      if (id !== nodeId) {
        result.nodeIds.add(id);
        result.upstreamNodes.add(id);
        // Add the link to affected links
        result.affectedLinks.add(`${id}-${upstreamId}`);
      }
    });
  });

  directDownstream.forEach((downstreamId) => {
    const secondHopDownstream =
      outgoingMap.get(downstreamId) || new Set<string>();
    secondHopDownstream.forEach((id) => {
      if (id !== nodeId) {
        result.nodeIds.add(id);
        result.downstreamNodes.add(id);
        // Add the link to affected links
        result.affectedLinks.add(`${downstreamId}-${id}`);
      }
    });
  });

  return result;
}
