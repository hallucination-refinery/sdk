/**
 * Memoized selectors for performance-critical state derivations
 * Avoids unnecessary array allocations and re-renders
 */

import type { UIState } from '@refinery/store'

/**
 * Efficiently get single selected node ID without array allocation
 * Uses Set iterator instead of Array.from() for better performance
 */
export const selectSingleSelectedNode = (state: UIState): string | null => {
  if (state.selectedNodeIds.size === 1) {
    // Use iterator to get first value without creating array
    return state.selectedNodeIds.values().next().value
  }
  return null
}

/**
 * Get array of selected node IDs (only when array is actually needed)
 * This creates a new array, so use sparingly
 */
export const selectSelectedNodeArray = (state: UIState): string[] => {
  return Array.from(state.selectedNodeIds)
}

/**
 * Check if a specific node is selected
 */
export const selectIsNodeSelected = (nodeId: string) => (state: UIState): boolean => {
  return state.selectedNodeIds.has(nodeId)
}

/**
 * Get count of selected nodes
 */
export const selectSelectedNodeCount = (state: UIState): number => {
  return state.selectedNodeIds.size
}