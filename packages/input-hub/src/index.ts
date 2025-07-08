// @refinery/input-hub - Entry point
export const version = '0.0.0'

import type { RendererCommand } from '@refinery/store'
import type { Intent, IntentContext } from '@refinery/schema'

// Re-export Intent types from schema for convenience
export type { Intent, GestureInput, VoiceInput, MultimodalInput, IntentContext } from '@refinery/schema'

// Create Intent constants for switch statement compatibility
export const IntentValues = {
  CREATE_NODE: 'CREATE_NODE' as Intent,
  DELETE_NODE: 'DELETE_NODE' as Intent,
  SELECT_NODE: 'SELECT_NODE' as Intent,
  MOVE_NODE: 'MOVE_NODE' as Intent,
  CREATE_EDGE: 'CREATE_EDGE' as Intent,
  DELETE_EDGE: 'DELETE_EDGE' as Intent,
  PAN_CAMERA: 'PAN_CAMERA' as Intent,
  ZOOM_IN: 'ZOOM_IN' as Intent,
  ZOOM_OUT: 'ZOOM_OUT' as Intent,
  FIT_VIEW: 'FIT_VIEW' as Intent,
  SELECT_ALL: 'SELECT_ALL' as Intent,
  CLEAR_SELECTION: 'CLEAR_SELECTION' as Intent,
  TOGGLE_LAYOUT: 'TOGGLE_LAYOUT' as Intent,
  RESET_LAYOUT: 'RESET_LAYOUT' as Intent,
} as const

/**
 * Emits an intent as a RendererCommand for the store to process
 * 
 * @param context - The intent context with input data
 * @returns RendererCommand or null if intent cannot be processed
 */
export function emitIntent(context: IntentContext): RendererCommand | null {
  const { intent, parameters = {} } = context
  
  switch (intent) {
    case IntentValues.CREATE_NODE:
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
      
    case IntentValues.SELECT_NODE:
      return {
        type: 'SELECT_NODES',
        payload: {
          nodeIds: parameters.nodeIds as string[] || [],
          mode: 'replace'
        }
      }
      
    case IntentValues.CLEAR_SELECTION:
      return { type: 'CLEAR_SELECTION' }
      
    case IntentValues.ZOOM_IN:
      return {
        type: 'SET_ZOOM',
        payload: { zoom: parameters.zoom as number || 1.2 }
      }
      
    case IntentValues.ZOOM_OUT:
      return {
        type: 'SET_ZOOM',
        payload: { zoom: parameters.zoom as number || 0.8 }
      }
      
    case IntentValues.FIT_VIEW:
      return {
        type: 'FIT_TO_NODES',
        payload: { nodeIds: parameters.nodeIds as string[] }
      }
      
    case IntentValues.RESET_LAYOUT:
      return { type: 'RESET_LAYOUT' }
      
    default:
      // TODO: Implement remaining intents
      return null
  }
}
