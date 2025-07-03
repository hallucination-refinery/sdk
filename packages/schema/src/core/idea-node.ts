import { z } from 'zod'
import { Vector3 } from './vectors'

/**
 * Base schema for IdeaNode metadata
 * Allows for arbitrary key-value pairs while maintaining type safety
 */
export const IdeaNodeMetadataSchema = z.record(z.string(), z.unknown())

/**
 * Schema for the core IdeaNode type
 * Represents a node in the idea graph with position, content, and metadata
 */
export const IdeaNodeSchema = z.object({
  /**
   * Unique identifier for the node
   */
  id: z.string(),
  
  /**
   * Display label for the node
   */
  label: z.string(),
  
  /**
   * Full content/description of the idea
   */
  content: z.string().optional(),
  
  /**
   * 3D position in space
   */
  position: Vector3.optional(),
  
  /**
   * Velocity vector for physics simulation
   */
  velocity: Vector3.optional(),
  
  /**
   * Node color (hex or CSS color string)
   */
  color: z.string().optional(),
  
  /**
   * Node size/radius
   */
  size: z.number().positive().optional(),
  
  /**
   * Whether the node is currently selected
   */
  selected: z.boolean().optional(),
  
  /**
   * Whether the node is currently hovered
   */
  hovered: z.boolean().optional(),
  
  /**
   * Whether the node position is fixed (not affected by physics)
   */
  fixed: z.boolean().optional(),
  
  /**
   * Open metadata field for extensibility
   * Allows any additional properties without breaking the schema
   */
  metadata: IdeaNodeMetadataSchema.optional(),
  
  /**
   * Timestamp when the node was created
   */
  createdAt: z.string().datetime().optional(),
  
  /**
   * Timestamp when the node was last updated
   */
  updatedAt: z.string().datetime().optional(),
})

/**
 * TypeScript type generated from the Zod schema
 */
export type IdeaNode = z.infer<typeof IdeaNodeSchema>

/**
 * Schema for partial IdeaNode updates
 */
export const PartialIdeaNodeSchema = IdeaNodeSchema.partial()

/**
 * Type for partial IdeaNode updates
 */
export type PartialIdeaNode = z.infer<typeof PartialIdeaNodeSchema>

/**
 * Type for IdeaNode creation (requires only essential fields)
 */
export const CreateIdeaNodeSchema = IdeaNodeSchema.pick({
  id: true,
  label: true,
}).merge(IdeaNodeSchema.omit({ id: true, label: true }).partial())

export type CreateIdeaNode = z.infer<typeof CreateIdeaNodeSchema>

/**
 * Type guard to check if an object is an IdeaNode
 */
export function isIdeaNode(obj: unknown): obj is IdeaNode {
  return IdeaNodeSchema.safeParse(obj).success
}

/**
 * Validate and parse an IdeaNode
 */
export function parseIdeaNode(obj: unknown): IdeaNode {
  return IdeaNodeSchema.parse(obj)
}

/**
 * Safely parse an IdeaNode, returning undefined on failure
 */
export function safeParseIdeaNode(obj: unknown): IdeaNode | undefined {
  const result = IdeaNodeSchema.safeParse(obj)
  return result.success ? result.data : undefined
}