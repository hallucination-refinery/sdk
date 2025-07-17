/**
 * Combined store exports for Cryptic Vault demo
 * Provides unified interface to both @refinery/store and app-specific state
 */

// Re-export everything from @refinery/store
export * from '@refinery/store'

// Export app-specific state
export { 
  useAppStore, 
  useActiveLens, 
  useTimeIndex, 
  useDialState,
  selectTimelineDate,
  type AppState,
  type DialState
} from './app-slice'

// Export graph utilities
export { 
  mapToArrays, 
  arraysToMaps, 
  clearConversionCache 
} from './graph-utils'

// Additional convenience selectors
import { useUIStore } from '@refinery/store'
import { selectSingleSelectedNode } from './selectors'

/**
 * Get single selected node ID from the Set
 * Returns null if no selection or multiple selections
 */
export function useSingleSelectedNode(): string | null {
  return useUIStore(selectSingleSelectedNode)
}

/**
 * Check if a specific node is selected
 */
export function useIsNodeSelected(nodeId: string): boolean {
  return useUIStore(state => state.selectedNodeIds.has(nodeId))
}

/**
 * Get array of selected node IDs (for compatibility)
 */
export function useSelectedNodeIds(): string[] {
  return useUIStore(state => Array.from(state.selectedNodeIds))
}