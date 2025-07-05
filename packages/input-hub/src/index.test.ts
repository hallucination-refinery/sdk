import { describe, it, expect } from 'vitest'
import { version, emitIntent, Intent, type IntentContext, type GestureInput, type VoiceInput } from './index'

describe('input-hub Package', () => {
  it('should export version', () => {
    expect(version).toBe('0.0.0')
  })
})

describe('emitIntent', () => {
  it('should emit ADD_NODE command for CREATE_NODE intent', () => {
    const context: IntentContext = {
      intent: Intent.CREATE_NODE,
      input: {
        type: 'gesture',
        gesture: 'pinch',
        confidence: 0.9
      },
      parameters: {
        label: 'Test Node',
        position: { x: 100, y: 200, z: 0 }
      }
    }
    
    const command = emitIntent(context)
    
    expect(command).toMatchObject({
      type: 'ADD_NODE',
      payload: {
        node: {
          id: expect.any(String),
          label: 'Test Node',
          position: { x: 100, y: 200, z: 0 }
        }
      }
    })
  })
  
  it('should emit SELECT_NODES command for SELECT_NODE intent', () => {
    const context: IntentContext = {
      intent: Intent.SELECT_NODE,
      input: {
        type: 'voice',
        command: 'select node',
        confidence: 0.95
      },
      parameters: {
        nodeIds: ['node-1', 'node-2']
      }
    }
    
    const command = emitIntent(context)
    
    expect(command).toEqual({
      type: 'SELECT_NODES',
      payload: {
        nodeIds: ['node-1', 'node-2'],
        mode: 'replace'
      }
    })
  })
  
  it('should emit CLEAR_SELECTION command', () => {
    const context: IntentContext = {
      intent: Intent.CLEAR_SELECTION,
      input: {
        type: 'gesture',
        gesture: 'wave',
        confidence: 0.8
      }
    }
    
    const command = emitIntent(context)
    
    expect(command).toEqual({ type: 'CLEAR_SELECTION' })
  })
  
  it('should emit SET_ZOOM command for ZOOM_IN intent', () => {
    const context: IntentContext = {
      intent: Intent.ZOOM_IN,
      input: {
        type: 'gesture',
        gesture: 'spread',
        confidence: 0.85
      },
      parameters: {
        zoom: 1.5
      }
    }
    
    const command = emitIntent(context)
    
    expect(command).toEqual({
      type: 'SET_ZOOM',
      payload: { zoom: 1.5 }
    })
  })
  
  it('should return null for unimplemented intents', () => {
    const context: IntentContext = {
      intent: Intent.DELETE_NODE,
      input: {
        type: 'voice',
        command: 'delete node',
        confidence: 0.9
      }
    }
    
    const command = emitIntent(context)
    
    expect(command).toBeNull()
  })
  
  it('should handle missing parameters with defaults', () => {
    const context: IntentContext = {
      intent: Intent.CREATE_NODE,
      input: {
        type: 'gesture',
        gesture: 'tap',
        confidence: 0.7
      }
    }
    
    const command = emitIntent(context)
    
    expect(command).toMatchObject({
      type: 'ADD_NODE',
      payload: {
        node: {
          id: expect.stringMatching(/^node-\d+$/),
          label: 'New Node',
          position: { x: 0, y: 0, z: 0 }
        }
      }
    })
  })
})
