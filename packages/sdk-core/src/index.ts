// Main canvas component (Animus)
export { Animus } from './Animus'
export type { AnimusProps } from './Animus'

// Canvas component for custom content
export { Canvas } from './Canvas'
export type { CanvasProps } from './Canvas'

// Canvas provider and hooks
export { CanvasProvider, useCanvas } from './CanvasProvider'

// Intent bus for command processing and state management
export { 
  createInitialCanvasState,
  processCanvasCommand
} from './IntentBus'
export type { CanvasState } from './IntentBus'

// Re-export types from dependencies for convenience
export type { Node, Edge } from '@refinery/schema'
export type { RendererCommand } from '@refinery/store'