/**
 * Zod validation schemas and helpers for store actions
 */

import { z } from 'zod'
import { 
  NodeSchema as IdeaNodeSchema,
  EdgeSchema as EdgeSchemaBase,
  PartialNodeSchema,
  PartialEdgeSchema
} from '@refinery/schema'

// Re-export the actual schemas from @refinery/schema
export const NodeSchema = IdeaNodeSchema
export const EdgeSchema = EdgeSchemaBase

// Action payload schemas
export const AddNodePayloadSchema = NodeSchema

export const UpdateNodePayloadSchema = z.object({
  id: z.string(),
  data: PartialNodeSchema
})

export const RemoveNodePayloadSchema = z.string()

export const BatchAddNodesPayloadSchema = z.array(NodeSchema)

export const BatchUpdateNodesPayloadSchema = z.array(z.object({
  id: z.string(),
  data: PartialNodeSchema
}))

export const BatchRemoveNodesPayloadSchema = z.array(z.string())

export const AddEdgePayloadSchema = EdgeSchema

export const UpdateEdgePayloadSchema = z.object({
  id: z.string(),
  data: PartialEdgeSchema
})

export const RemoveEdgePayloadSchema = z.string()

export const BatchAddEdgesPayloadSchema = z.array(EdgeSchema)

export const BatchUpdateEdgesPayloadSchema = z.array(z.object({
  id: z.string(),
  data: PartialEdgeSchema
}))

export const BatchRemoveEdgesPayloadSchema = z.array(z.string())

// UI action schemas
export const SelectNodesPayloadSchema = z.array(z.string())
export const SelectEdgesPayloadSchema = z.array(z.string())
export const SetHoverNodePayloadSchema = z.string().nullable()
export const SetHoverEdgePayloadSchema = z.string().nullable()

export const SetCameraPositionPayloadSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number()
})

export const SetZoomPayloadSchema = z.number().positive()

export const FitToNodesPayloadSchema = z.object({
  nodeIds: z.array(z.string()).optional(),
  padding: z.number().optional()
})

export const CenterOnNodePayloadSchema = z.object({
  nodeId: z.string(),
  zoom: z.number().optional()
})

export const SetLayoutPayloadSchema = z.object({
  type: z.enum(['force', 'radial', 'hierarchical']),
  options: z.record(z.unknown()).optional()
})

export const SetThemePayloadSchema = z.object({
  mode: z.enum(['light', 'dark', 'custom']),
  customTheme: z.record(z.unknown()).optional()
})

export const UpdateThemePropertyPayloadSchema = z.object({
  path: z.string(),
  value: z.unknown()
})

export const HighlightNodesPayloadSchema = z.object({
  nodeIds: z.array(z.string()),
  color: z.string().optional(),
  duration: z.number().optional()
})

export const HighlightEdgesPayloadSchema = z.object({
  edgeIds: z.array(z.string()),
  color: z.string().optional(),
  duration: z.number().optional()
})

// Async action schemas
export const StartJobPayloadSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  metadata: z.record(z.unknown()).optional()
})

export const UpdateJobProgressPayloadSchema = z.object({
  id: z.string(),
  progress: z.number().min(0).max(100),
  message: z.string().optional()
})

export const CompleteJobPayloadSchema = z.object({
  id: z.string(),
  result: z.unknown().optional()
})

export const FailJobPayloadSchema = z.object({
  id: z.string(),
  error: z.union([z.string(), z.instanceof(Error)])
})

export const CancelJobPayloadSchema = z.string()

export const SetLoadingPayloadSchema = z.boolean()

export const SetErrorPayloadSchema = z.union([
  z.string(),
  z.instanceof(Error),
  z.null()
])

// Validation error type
export class ValidationError extends Error {
  constructor(
    public action: string,
    public errors: z.ZodError
  ) {
    super(`Validation failed for action "${action}": ${errors.message}`)
    this.name = 'ValidationError'
  }
}

// Helper to create validated actions
export function createValidatedAction<T, R>(
  actionName: string,
  schema: z.ZodSchema<T>,
  action: (payload: T) => R
): (payload: T) => R {
  return (payload: T) => {
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      const result = schema.safeParse(payload)
      if (!result.success) {
        throw new ValidationError(actionName, result.error)
      }
    }
    return action(payload)
  }
}

// Type helper for action creators
export type ValidatedAction<T, R> = (payload: T) => R