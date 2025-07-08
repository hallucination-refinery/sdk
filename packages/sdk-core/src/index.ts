// Scene component for rendering 3D graph content
export { Scene } from './Scene'
export type { SceneProps } from './Scene'

// IdeaCanvas component for the main canvas interface
export { IdeaCanvas } from './IdeaCanvas'
export type { IdeaCanvasProps } from './IdeaCanvas'

// Intent bus for command processing and state management
export { 
  createInitialCanvasState,
  processCanvasCommand
} from './IntentBus'
export type { CanvasState } from './IntentBus'

// Re-export types from dependencies for convenience
export type { IdeaNode, Edge } from '@refinery/schema'
export type { RendererCommand } from '@refinery/store'