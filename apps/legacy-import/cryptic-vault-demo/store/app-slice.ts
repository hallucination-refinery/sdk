/**
 * App-specific state slice for Cryptic Vault demo
 * Manages lens selection, timeline navigation, and other demo-specific state
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Types
export interface DialState {
  interwingleMode: number
  searchDepth: number
}

export interface AppState {
  // Lens selection
  activeLens: 'causal' | 'affinity' | 'temporal'

  // Timeline navigation
  timeIndex: number
  timelineDate: string | null // Derived from timeIndex

  // Dial/filter settings
  dialState: DialState

  // Search and interaction
  searchResultNodeIds: string[]
  currentInteractionMode: string
  gesturedNodeId: string | null

  // Actions
  setActiveLens: (lens: 'causal' | 'affinity' | 'temporal') => void
  setTimeIndex: (index: number) => void
  setTimelineDate: (date: string | null) => void
  setDialState: (dialState: DialState) => void
  setSearchResultNodeIds: (ids: string[]) => void
  setCurrentInteractionMode: (mode: string) => void
  setGesturedNodeId: (id: string | null) => void

  // Utility
  reset: () => void
}

// Initial state
const getInitialState = () => ({
  activeLens: 'causal' as const,
  timeIndex: 0,
  timelineDate: null,
  dialState: {
    interwingleMode: 0,
    searchDepth: 3,
  },
  searchResultNodeIds: [],
  currentInteractionMode: 'mouse',
  gesturedNodeId: null,
})

// Create store
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      ...getInitialState(),

      // Actions
      setActiveLens: (lens) => set({ activeLens: lens }),

      setTimeIndex: (index) => set({ timeIndex: index }),

      setTimelineDate: (date) => set({ timelineDate: date }),

      setDialState: (dialState) => set({ dialState }),

      setSearchResultNodeIds: (ids) => set({ searchResultNodeIds: ids }),

      setCurrentInteractionMode: (mode) => set({ currentInteractionMode: mode }),

      setGesturedNodeId: (id) => set({ gesturedNodeId: id }),

      reset: () => set(getInitialState()),
    }),
    {
      name: 'cryptic-vault-app-store',
    }
  )
)

// Selectors
export const selectTimelineDate = (dates: string[]) => (state: AppState) =>
  dates[state.timeIndex] || null

// Convenience hooks
export const useActiveLens = () => useAppStore((state) => state.activeLens)
export const useTimeIndex = () => useAppStore((state) => state.timeIndex)
export const useDialState = () => useAppStore((state) => state.dialState)
