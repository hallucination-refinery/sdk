/**
 * @refinery/store - Zustand-based state management for Refinery SDK
 */

// Version
export const version = '0.0.0'

// Main store and hooks
export {
  useRefineryStore,
  useGraphStore,
  useUIStore,
  useAsyncStore,
  withCommand,
  type RefineryStore
} from './store'

// Command queue
export { CommandQueue } from './command-queue'

// Types
export type {
  // Renderer commands
  RendererCommand,
  NodeCommand,
  EdgeCommand,
  CameraCommand,
  SelectionCommand,
  LayoutCommand,
  ThemeCommand,
  HighlightCommand
} from './types/renderer-commands'

export type {
  // State types
  GraphState,
  UIState,
  AsyncState,
  AsyncJob,
  StoreState
} from './types/state'

// Slice types
export type { GraphSlice } from './slices/graph-slice'
export type { UISlice } from './slices/ui-slice'
export type { AsyncSlice } from './slices/async-slice'

// Selectors
export * from './selectors'

// Persistence
export {
  // Serialization
  serializeState,
  serializeToJSON,
  deserializeState,
  deserializeFromJSON,
  
  // Graph format converters
  toGraphFormat,
  fromGraphFormat,
  
  // LocalStorage helpers
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  
  // File helpers
  exportToFile,
  importFromFile,
  
  // Validation
  validateSerializedState,
  
  // Types
  type SerializedState
} from './persistence'

// Validation
export {
  ValidationError,
  createValidatedAction,
  type ValidatedAction
} from './validation'
