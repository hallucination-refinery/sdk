/**
 * Memoized selectors for common store queries
 */

import type { IdeaNode, Edge } from '@refinery/schema'
import type { RefineryStore } from '../store'

// Simple memoization helper
function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  let lastArgs: Args | undefined
  let lastResult: Result | undefined
  
  return (...args: Args) => {
    if (!lastArgs || !args.every((arg, i) => arg === lastArgs![i])) {
      lastArgs = args
      lastResult = fn(...args)
    }
    return lastResult!
  }
}

// Selector creator for simple memoization
function createSelector<T, R>(
  selector: (state: RefineryStore) => T,
  combiner: (value: T) => R
): (state: RefineryStore) => R {
  return memoize((state: RefineryStore) => combiner(selector(state)))
}

// Multi-selector creator
function createSelector2<T1, T2, R>(
  selector1: (state: RefineryStore) => T1,
  selector2: (state: RefineryStore) => T2,
  combiner: (value1: T1, value2: T2) => R
): (state: RefineryStore) => R {
  return memoize((state: RefineryStore) => 
    combiner(selector1(state), selector2(state))
  )
}

// Basic selectors
export const selectNodes = (state: RefineryStore) => state.nodes
export const selectEdges = (state: RefineryStore) => state.edges
export const selectSelectedNodeIds = (state: RefineryStore) => state.selectedNodeIds
export const selectSelectedEdgeIds = (state: RefineryStore) => state.selectedEdgeIds
export const selectHoveredNodeId = (state: RefineryStore) => state.hoveredNodeId
export const selectHoveredEdgeId = (state: RefineryStore) => state.hoveredEdgeId

// Memoized node selectors
export const selectNodesArray = createSelector(
  selectNodes,
  (nodes) => Array.from(nodes.values())
)

export const selectNodeIds = createSelector(
  selectNodes,
  (nodes) => Array.from(nodes.keys())
)

export const selectNodeCount = createSelector(
  selectNodes,
  (nodes) => nodes.size
)

// Memoized edge selectors
export const selectEdgesArray = createSelector(
  selectEdges,
  (edges) => Array.from(edges.values())
)

export const selectEdgeIds = createSelector(
  selectEdges,
  (edges) => Array.from(edges.keys())
)

export const selectEdgeCount = createSelector(
  selectEdges,
  (edges) => edges.size
)

// Selected nodes/edges with full data
export const selectSelectedNodes = createSelector2(
  selectNodes,
  selectSelectedNodeIds,
  (nodes, selectedIds): IdeaNode[] => {
    return Array.from(selectedIds)
      .map(id => nodes.get(id))
      .filter((node): node is IdeaNode => node !== undefined)
  }
)

export const selectSelectedEdges = createSelector2(
  selectEdges,
  selectSelectedEdgeIds,
  (edges, selectedIds): Edge[] => {
    return Array.from(selectedIds)
      .map(id => edges.get(id))
      .filter((edge): edge is Edge => edge !== undefined)
  }
)

// Hovered node/edge with full data
export const selectHoveredNode = createSelector2(
  selectNodes,
  selectHoveredNodeId,
  (nodes, hoveredId): IdeaNode | null => {
    return hoveredId ? nodes.get(hoveredId) ?? null : null
  }
)

export const selectHoveredEdge = createSelector2(
  selectEdges,
  selectHoveredEdgeId,
  (edges, hoveredId): Edge | null => {
    return hoveredId ? edges.get(hoveredId) ?? null : null
  }
)

// Node connectivity selectors
export const createNodeEdgesSelector = (nodeId: string) =>
  createSelector(
    selectEdges,
    (edges): Edge[] => {
      return Array.from(edges.values()).filter(
        edge => edge.source === nodeId || edge.target === nodeId
      )
    }
  )

export const createNodeNeighborsSelector = (nodeId: string) =>
  createSelector2(
    selectEdges,
    selectNodes,
    (edges, nodes): IdeaNode[] => {
      const neighborIds = new Set<string>()
      
      edges.forEach(edge => {
        if (edge.source === nodeId) {
          neighborIds.add(edge.target)
        } else if (edge.target === nodeId) {
          neighborIds.add(edge.source)
        }
      })
      
      return Array.from(neighborIds)
        .map(id => nodes.get(id))
        .filter((node): node is IdeaNode => node !== undefined)
    }
  )

export const createNodeDegreeSelector = (nodeId: string) =>
  createSelector(
    selectEdges,
    (edges): number => {
      let degree = 0
      edges.forEach(edge => {
        if (edge.source === nodeId || edge.target === nodeId) {
          degree++
        }
      })
      return degree
    }
  )

// Graph statistics selectors
export const selectGraphStats = createSelector2(
  selectNodes,
  selectEdges,
  (nodes, edges) => ({
    nodeCount: nodes.size,
    edgeCount: edges.size,
    avgDegree: edges.size > 0 ? (edges.size * 2) / nodes.size : 0,
    density: nodes.size > 1 ? (2 * edges.size) / (nodes.size * (nodes.size - 1)) : 0
  })
)

// Filter selectors
export const createNodesWithMetadataSelector = (key: string, value: unknown) =>
  createSelector(
    selectNodes,
    (nodes): IdeaNode[] => {
      return Array.from(nodes.values()).filter(
        node => node.metadata && node.metadata[key] === value
      )
    }
  )

export const createNodesWithLabelSelector = (labelPattern: string | RegExp) =>
  createSelector(
    selectNodes,
    (nodes): IdeaNode[] => {
      const regex = typeof labelPattern === 'string' 
        ? new RegExp(labelPattern, 'i')
        : labelPattern
        
      return Array.from(nodes.values()).filter(
        node => regex.test(node.label)
      )
    }
  )

// Layout-specific selectors
export const selectLayoutType = (state: RefineryStore) => state.layout.type
export const selectIsLayoutPaused = (state: RefineryStore) => state.layout.isPaused

// Theme selectors
export const selectThemeMode = (state: RefineryStore) => state.theme.mode
export const selectCustomTheme = (state: RefineryStore) => state.theme.customTheme

// Highlights selectors
export const selectHighlightedNodes = createSelector2(
  selectNodes,
  (state: RefineryStore) => state.highlights.nodes,
  (nodes, highlights) => {
    return Array.from(highlights.entries())
      .map(([nodeId, highlight]) => ({
        node: nodes.get(nodeId),
        ...highlight
      }))
      .filter((item): item is { node: IdeaNode; color: string; intensity: number } => 
        item.node !== undefined
      )
  }
)

export const selectHighlightedEdges = createSelector2(
  selectEdges,
  (state: RefineryStore) => state.highlights.edges,
  (edges, highlights) => {
    return Array.from(highlights.entries())
      .map(([edgeId, highlight]) => ({
        edge: edges.get(edgeId),
        ...highlight
      }))
      .filter((item): item is { edge: Edge; color: string; intensity: number } => 
        item.edge !== undefined
      )
  }
)

// Async job selectors
export const selectActiveJobs = (state: RefineryStore) => state.getActiveJobs()
export const selectIsLoading = (state: RefineryStore) => state.isLoading
export const selectError = (state: RefineryStore) => state.error

// Combined UI state selector - using direct access for simplicity
export const selectUIState = (state: RefineryStore) => {
  const selectedNodes = selectSelectedNodes(state)
  const selectedEdges = selectSelectedEdges(state)
  const hoveredNode = selectHoveredNode(state)
  const hoveredEdge = selectHoveredEdge(state)
  
  return {
    selection: {
      nodes: selectedNodes,
      edges: selectedEdges,
      nodeCount: selectedNodes.length,
      edgeCount: selectedEdges.length
    },
    hover: {
      node: hoveredNode,
      edge: hoveredEdge
    },
    camera: state.camera,
    layout: {
      type: state.layout.type,
      isPaused: state.layout.isPaused
    },
    theme: state.theme.mode
  }
}