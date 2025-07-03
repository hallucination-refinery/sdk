/**
 * @refinery/schema - Core domain types and schemas for the Refinery SDK
 *
 * This package provides:
 * - Zod schema definitions for IdeaNode, Edge, and Graph structures
 * - TypeScript types generated from schemas
 * - Utility functions for graph operations
 * - Zero runtime dependencies beyond three.js vector math
 */

export const version = '0.0.0'

// Re-export all core types and schemas
export * from './core'

// Re-export Zod for convenience (consumers can use schema.extend(), etc.)
export { z } from 'zod'

// -----------------------------------------------------------------------------
// TEMPORARY TYPE STUBS (remove once real types are exposed)
// -----------------------------------------------------------------------------

export interface Edge {
  id: string
  source: string
  target: string
  type: string
  strength?: number
  visible?: boolean
  directed?: boolean
  width?: number
  [key: string]: any
}

export interface Graph {
  nodes: IdeaNode[]
  edges: Edge[]
  metadata?: any
  description?: string
  [key: string]: any
}

// Minimal Vector3 replacement until three.js Vector3 is surfaced
export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface IdeaNode {
  id: string
  label: string
  content?: string
  position?: { x: number; y: number; z: number }
  // additional properties can be added later
  [key: string]: any
}
