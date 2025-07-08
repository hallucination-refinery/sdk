import { z } from 'zod'

/**
 * Supported intent types for graph manipulation
 */
export const IntentEnum = z.enum([
  // Node operations
  'CREATE_NODE',
  'DELETE_NODE',
  'SELECT_NODE',
  'MOVE_NODE',
  
  // Edge operations
  'CREATE_EDGE',
  'DELETE_EDGE',
  
  // Navigation
  'PAN_CAMERA',
  'ZOOM_IN',
  'ZOOM_OUT',
  'FIT_VIEW',
  
  // Selection
  'SELECT_ALL',
  'CLEAR_SELECTION',
  
  // Layout
  'TOGGLE_LAYOUT',
  'RESET_LAYOUT'
])

export type Intent = z.infer<typeof IntentEnum>

/**
 * Gesture input data from Mediapipe
 */
export const GestureInputSchema = z.object({
  type: z.literal('gesture'),
  gesture: z.string(),
  confidence: z.number(),
  landmarks: z.array(z.object({
    x: z.number(),
    y: z.number(),
    z: z.number()
  })).optional()
})

export type GestureInput = z.infer<typeof GestureInputSchema>

/**
 * Voice command input from Eleven Labs
 */
export const VoiceInputSchema = z.object({
  type: z.literal('voice'),
  command: z.string(),
  confidence: z.number(),
  transcript: z.string().optional()
})

export type VoiceInput = z.infer<typeof VoiceInputSchema>

/**
 * Union type for all input modalities
 */
export const MultimodalInputSchema = z.union([GestureInputSchema, VoiceInputSchema])
export type MultimodalInput = z.infer<typeof MultimodalInputSchema>

/**
 * Intent context with additional parameters
 */
export const IntentContextSchema = z.object({
  intent: IntentEnum,
  input: MultimodalInputSchema,
  parameters: z.record(z.string(), z.unknown()).optional()
})

export type IntentContext = z.infer<typeof IntentContextSchema>