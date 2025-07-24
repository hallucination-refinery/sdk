/**
 * State type definitions for Zustand slices
 */

import type { IdeaNode, Edge } from '@refinery/schema'

// Graph slice state
export interface GraphState {
  nodes: Map<string, IdeaNode>
  edges: Map<string, Edge>
  nodeIdCounter: number
  edgeIdCounter: number
  graphVersion: number // Incremented on structural mutations only
}

// UI slice state
export interface UIState {
  selectedNodeIds: Set<string>
  selectedEdgeIds: Set<string>
  hoveredNodeId: string | null
  hoveredEdgeId: string | null
  camera: {
    position: { x: number; y: number; z: number }
    zoom: number
  }
  layout: {
    type: 'force' | 'radial' | 'hierarchical'
    isPaused: boolean
  }
  theme: {
    mode: 'light' | 'dark' | 'custom'
    customTheme?: Record<string, unknown>
  }
  highlights: {
    nodes: Map<string, { color: string; intensity: number }>
    edges: Map<string, { color: string; intensity: number }>
  }
}

// Async slice state
export interface AsyncState {
  jobs: Map<string, AsyncJob>
  isLoading: boolean
  error: string | null
}

export interface AsyncJob {
  id: string
  type: 'import' | 'export' | 'layout' | 'analysis'
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  result?: any
  error?: string
  startedAt: number
  completedAt?: number
}

// Combined store state
export interface StoreState {
  graph: GraphState
  ui: UIState
  async: AsyncState
}
