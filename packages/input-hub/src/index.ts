// @refinery/input-hub - Entry point
export const version = '0.0.0'

import type { RendererCommand } from '@refinery/store'
import type { Intent, GestureInput, VoiceInput, MultimodalInput, IntentContext } from '@refinery/schema'

// Re-export Intent types from schema for convenience
export type { Intent, GestureInput, VoiceInput, MultimodalInput, IntentContext } from '@refinery/schema'

// Create Intent enum for switch statement compatibility
const IntentValues = {
  CREATE_NODE: 'CREATE_NODE' as const,
  DELETE_NODE: 'DELETE_NODE' as const,
  SELECT_NODE: 'SELECT_NODE' as const,
  MOVE_NODE: 'MOVE_NODE' as const,
  CREATE_EDGE: 'CREATE_EDGE' as const,
  DELETE_EDGE: 'DELETE_EDGE' as const,
  PAN_CAMERA: 'PAN_CAMERA' as const,
  ZOOM_IN: 'ZOOM_IN' as const,
  ZOOM_OUT: 'ZOOM_OUT' as const,
  FIT_VIEW: 'FIT_VIEW' as const,
  SELECT_ALL: 'SELECT_ALL' as const,
  CLEAR_SELECTION: 'CLEAR_SELECTION' as const,
  TOGGLE_LAYOUT: 'TOGGLE_LAYOUT' as const,
  RESET_LAYOUT: 'RESET_LAYOUT' as const,
}

export const Intent = IntentValues

/**
 * Emits an intent as a RendererCommand for the store to process
 * 
 * @param context - The intent context with input data
 * @returns RendererCommand or null if intent cannot be processed
 */
export function emitIntent(context: IntentContext): RendererCommand | null {
  const { intent, parameters = {} } = context
  
  switch (intent) {
    case Intent.CREATE_NODE:
      // TODO: Generate proper node ID and position
      return {
        type: 'ADD_NODE',
        payload: {
          node: {
            id: parameters.id as string || `node-${Date.now()}`,
            label: parameters.label as string || 'New Node',
            position: parameters.position as { x: number; y: number; z: number } || { x: 0, y: 0, z: 0 }
          }
        }
      }
      
    case Intent.SELECT_NODE:
      return {
        type: 'SELECT_NODES',
        payload: {
          nodeIds: parameters.nodeIds as string[] || [],
          mode: 'replace'
        }
      }
      
    case Intent.CLEAR_SELECTION:
      return { type: 'CLEAR_SELECTION' }
      
    case Intent.ZOOM_IN:
      return {
        type: 'SET_ZOOM',
        payload: { zoom: parameters.zoom as number || 1.2 }
      }
      
    case Intent.ZOOM_OUT:
      return {
        type: 'SET_ZOOM',
        payload: { zoom: parameters.zoom as number || 0.8 }
      }
      
    case Intent.FIT_VIEW:
      return {
        type: 'FIT_TO_NODES',
        payload: { nodeIds: parameters.nodeIds as string[] }
      }
      
    case Intent.RESET_LAYOUT:
      return { type: 'RESET_LAYOUT' }
      
    default:
      // TODO: Implement remaining intents
      return null
  }
}
