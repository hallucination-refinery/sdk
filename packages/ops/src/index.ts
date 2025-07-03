/**
 * @refinery/ops - Graph algorithms and functional operations for Refinery SDK
 * 
 * This package provides:
 * - Graph traversal algorithms (BFS, DFS)
 * - Shortest path algorithms
 * - Interwingle algorithm for idea connections
 * - Clustering algorithms
 * - Query and filter utilities
 * - Graph transformation functions
 * - 100% immutable operations
 * 
 * All functions operate on @refinery/schema types and return immutable results.
 */

export const version = '0.0.0'

// Re-export all algorithms
export * from './algorithms'

// Re-export all queries
export * from './queries'

// Re-export all transformations
export * from './transformations'

// Re-export schema types for convenience
export type { Graph, IdeaNode, Edge } from '@refinery/schema'