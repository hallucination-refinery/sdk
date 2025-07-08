/**
 * @refinery/graph-forge
 * 
 * Deterministic graph layout generator for the Refinery SDK
 */

// Main forge function
export { forgeGraph, type ForgeResult } from './forge.js'

// Schemas and types
export {
  RawMemorySchema,
  ForgeOptionsSchema,
  WidgetManifestSchema,
  type RawMemory,
  type ForgeOptions,
  type WidgetManifest,
} from './schemas.js'

// Re-export types from schema package for convenience
export type { IdeaNode, Edge } from '@refinery/schema'