import type { UIState } from '@refinery/store'

export const selectSingleSelectedNode = (state: UIState): string | null => {
  if (state.selectedNodeIds.size === 1) {
    const value = state.selectedNodeIds.values().next().value
    return value !== undefined ? value : null
  }
  return null
}

// Sub-W stub – replace with real selector in W
export const useSingleSelectedNode = () => null
