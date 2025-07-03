import type { IdeaNode, Edge } from '@refinery/schema'

// Extended types for aperture-specific properties
export interface ApertureNode extends IdeaNode {
  // Aperture-specific UI state
  isHighlighted?: boolean
  isFocused?: boolean
  animationState?: 'entering' | 'idle' | 'exiting'
}

export interface ApertureEdge extends Edge {
  // Aperture-specific UI state
  isHighlighted?: boolean
  animationState?: 'idle' | 'pulsing'
}

export interface ApertureViewport {
  center: { x: number; y: number }
  zoom: number
  rotation: number
}

export interface ApertureInteractionState {
  selectedNodes: Set<string>
  hoveredNode: string | null
  focusedNode: string | null
  isDragging: boolean
  isPanning: boolean
}