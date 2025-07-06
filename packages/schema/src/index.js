/**
 * @refinery/schema - Core domain types and schemas for the Refinery SDK
 *
 * This package provides:
 * - Zod schema definitions for IdeaNode, Edge, and Graph structures
 * - TypeScript types generated from schemas
 * - Utility functions for graph operations
 * - Zero runtime dependencies beyond three.js vector math
 */
export const version = '0.0.0';
// Re-export all core types and schemas
export * from './core';
// Re-export Zod for convenience (consumers can use schema.extend(), etc.)
export { z } from 'zod';
//# sourceMappingURL=index.js.map