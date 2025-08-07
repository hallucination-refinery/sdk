import type { UIState } from '@refinery/store'
import { useUIStore } from '@refinery/store'

export const selectSingleSelectedNode = (state: UIState): string | null => {
  if (state.selectedNodeIds.size === 1) {
    const value = state.selectedNodeIds.values().next().value
    return value !== undefined ? value : null
  }
  return null
}

// CRITICAL FIX: Connect the selector to the actual store
export const useSingleSelectedNode = () => {
  return useUIStore(selectSingleSelectedNode)
}
