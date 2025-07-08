import { z } from 'zod'
import { Vector3 } from './vectors'

/**
 * Base schema for Node metadata
 * Allows for arbitrary key-value pairs while maintaining type safety
 */
export const NodeMetadataSchema = z.record(z.string(), z.unknown())

/**
 * Schema for the core Node type
 * Represents a node in the idea graph with position, content, and metadata
 */
export const NodeSchema = z.object({
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
  metadata: NodeMetadataSchema.optional(),
  
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
export type Node = z.infer<typeof NodeSchema>

/**
 * Schema for partial Node updates
 */
export const PartialNodeSchema = NodeSchema.partial()

/**
 * Type for partial Node updates
 */
export type PartialNode = z.infer<typeof PartialNodeSchema>

/**
 * Type for Node creation (requires only essential fields)
 */
export const CreateNodeSchema = NodeSchema.pick({
  id: true,
  label: true,
}).merge(NodeSchema.omit({ id: true, label: true }).partial())

export type CreateNode = z.infer<typeof CreateNodeSchema>

/**
 * Type guard to check if an object is a Node
 */
export function isNode(obj: unknown): obj is Node {
  return NodeSchema.safeParse(obj).success
}

/**
 * Validate and parse a Node
 */
export function parseNode(obj: unknown): Node {
  return NodeSchema.parse(obj)
}

/**
 * Safely parse a Node, returning undefined on failure
 */
export function safeParseNode(obj: unknown): Node | undefined {
  const result = NodeSchema.safeParse(obj)
  return result.success ? result.data : undefined
}

// Legacy exports for backward compatibility
export const IdeaNodeSchema = NodeSchema
export type IdeaNode = Node
export const PartialIdeaNodeSchema = PartialNodeSchema
export type PartialIdeaNode = PartialNode
export const CreateIdeaNodeSchema = CreateNodeSchema
export type CreateIdeaNode = CreateNode
export const isIdeaNode = isNode
export const parseIdeaNode = parseNode
export const safeParseIdeaNode = safeParseNode