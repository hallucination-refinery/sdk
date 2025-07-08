import { z } from 'zod'

/**
 * Raw memory input schema - represents imported memories/ideas
 */
export const RawMemorySchema = z.object({
  /**
   * Unique identifier for the memory
   */
  id: z.string(),
  
  /**
   * Text content of the memory
   */
  content: z.string(),
  
  /**
   * Optional 3D position [x, y, z]
   */
  position: z.array(z.number()).length(3).optional(),
  
  /**
   * Cluster/category name
   */
  cluster: z.string().optional(),
  
  /**
   * Array of IDs this memory connects to
   */
  connections: z.array(z.string()).optional(),
  
  /**
   * Open metadata field
   */
  metadata: z.record(z.unknown()).optional(),
})

export type RawMemory = z.infer<typeof RawMemorySchema>

/**
 * Widget manifest for UI rendering hints
 */
export const WidgetManifestSchema = z.object({
  /**
   * Suggested layout algorithm
   */
  layout: z.enum(['force', 'hierarchical', 'circular', 'grid']).default('force'),
  
  /**
   * Node visualization preferences
   */
  nodeStyle: z.object({
    sizeRange: z.tuple([z.number(), z.number()]).default([0.5, 2.0]),
    colorByCluster: z.boolean().default(true),
    showLabels: z.boolean().default(true),
  }).default({}),
  
  /**
   * Edge visualization preferences
   */
  edgeStyle: z.object({
    curved: z.boolean().default(false),
    directed: z.boolean().default(false),
    opacity: z.number().min(0).max(1).default(0.6),
  }).default({}),
  
  /**
   * Camera/viewport settings
   */
  camera: z.object({
    initialDistance: z.number().default(100),
    fov: z.number().default(75),
  }).default({}),
})

export type WidgetManifest = z.infer<typeof WidgetManifestSchema>

/**
 * Options for the forge operation
 */
export const ForgeOptionsSchema = z.object({
  /**
   * Random seed for deterministic layout
   */
  seed: z.number().int().default(42),
  
  /**
   * Force simulation parameters
   */
  simulation: z.object({
    /**
     * Number of simulation iterations
     */
    iterations: z.number().int().positive().default(30),
    
    /**
     * Alpha decay rate (cooling)
     */
    alphaDecay: z.number().default(0.02),
    
    /**
     * Repulsion strength between nodes
     */
    repulsionStrength: z.number().default(30),
    
    /**
     * Link strength multiplier
     */
    linkStrength: z.number().default(1.0),
    
    /**
     * Center force strength
     */
    centerStrength: z.number().default(0.1),
  }).default({}),
  
  /**
   * Layout bounds
   */
  bounds: z.object({
    x: z.tuple([z.number(), z.number()]).default([-100, 100]),
    y: z.tuple([z.number(), z.number()]).default([-100, 100]),
    z: z.tuple([z.number(), z.number()]).default([-50, 50]),
  }).default({}),
})

export type ForgeOptions = z.infer<typeof ForgeOptionsSchema>