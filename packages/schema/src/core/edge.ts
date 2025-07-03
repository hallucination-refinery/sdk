import { z } from 'zod'

/**
 * Base schema for Edge metadata
 * Allows for arbitrary key-value pairs while maintaining type safety
 */
export const EdgeMetadataSchema = z.record(z.string(), z.unknown())

/**
 * Schema for edge types/relationships
 */
export const EdgeTypeSchema = z.enum([
  'relates-to',
  'depends-on',
  'contains',
  'references',
  'conflicts-with',
  'supports',
  'opposes',
  'derived-from',
  'implements',
  'extends',
  'custom',
])

/**
 * Schema for edge strength/weight
 */
export const EdgeStrengthSchema = z.number().min(0).max(1).default(1)

/**
 * Schema for the core Edge type
 * Represents a connection between two nodes in the idea graph
 */
export const EdgeSchema = z.object({
  /**
   * Unique identifier for the edge
   */
  id: z.string(),
  
  /**
   * Source node ID
   */
  source: z.string(),
  
  /**
   * Target node ID
   */
  target: z.string(),
  
  /**
   * Type of relationship
   */
  type: EdgeTypeSchema.default('relates-to'),
  
  /**
   * Optional label for the edge
   */
  label: z.string().optional(),
  
  /**
   * Strength/weight of the connection (0-1)
   */
  strength: EdgeStrengthSchema,
  
  /**
   * Whether the edge is directed (has a specific direction)
   */
  directed: z.boolean().default(false),
  
  /**
   * Edge color (hex or CSS color string)
   */
  color: z.string().optional(),
  
  /**
   * Edge line width
   */
  width: z.number().positive().optional(),
  
  /**
   * Whether the edge is currently selected
   */
  selected: z.boolean().optional(),
  
  /**
   * Whether the edge is currently hovered
   */
  hovered: z.boolean().optional(),
  
  /**
   * Whether the edge should be visible
   */
  visible: z.boolean().default(true),
  
  /**
   * Open metadata field for extensibility
   */
  metadata: EdgeMetadataSchema.optional(),
  
  /**
   * Timestamp when the edge was created
   */
  createdAt: z.string().datetime().optional(),
  
  /**
   * Timestamp when the edge was last updated
   */
  updatedAt: z.string().datetime().optional(),
})

/**
 * TypeScript type generated from the Zod schema
 */
export type Edge = z.infer<typeof EdgeSchema>

/**
 * TypeScript type for edge types
 */
export type EdgeType = z.infer<typeof EdgeTypeSchema>

/**
 * Schema for partial Edge updates
 */
export const PartialEdgeSchema = EdgeSchema.partial()

/**
 * Type for partial Edge updates
 */
export type PartialEdge = z.infer<typeof PartialEdgeSchema>

/**
 * Type for Edge creation (requires only essential fields)
 */
export const CreateEdgeSchema = EdgeSchema.pick({
  id: true,
  source: true,
  target: true,
}).merge(EdgeSchema.omit({ id: true, source: true, target: true }).partial())

export type CreateEdge = z.infer<typeof CreateEdgeSchema>

/**
 * Type guard to check if an object is an Edge
 */
export function isEdge(obj: unknown): obj is Edge {
  return EdgeSchema.safeParse(obj).success
}

/**
 * Validate and parse an Edge
 */
export function parseEdge(obj: unknown): Edge {
  return EdgeSchema.parse(obj)
}

/**
 * Safely parse an Edge, returning undefined on failure
 */
export function safeParseEdge(obj: unknown): Edge | undefined {
  const result = EdgeSchema.safeParse(obj)
  return result.success ? result.data : undefined
}

/**
 * Check if an edge connects two specific nodes (in either direction)
 */
export function edgeConnects(edge: Edge, nodeId1: string, nodeId2: string): boolean {
  return (
    (edge.source === nodeId1 && edge.target === nodeId2) ||
    (!edge.directed && edge.source === nodeId2 && edge.target === nodeId1)
  )
}

/**
 * Get the other node ID from an edge given one node ID
 */
export function getOtherNode(edge: Edge, nodeId: string): string | undefined {
  if (edge.source === nodeId) return edge.target
  if (edge.target === nodeId) return edge.source
  return undefined
}