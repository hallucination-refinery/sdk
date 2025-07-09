import { describe, it, expect } from 'vitest'
import { createInitialCanvasState, processCanvasCommand } from './IntentBus'
import type { Node, Edge } from '@refinery/schema'

describe('IntentBus', () => {
  describe('createInitialCanvasState', () => {
    it('should create initial state with empty collections', () => {
      const state = createInitialCanvasState()
      
      expect(state.nodes).toBeInstanceOf(Map)
      expect(state.nodes.size).toBe(0)
      expect(state.edges).toBeInstanceOf(Map)
      expect(state.edges.size).toBe(0)
      expect(state.selectedNodeIds).toBeInstanceOf(Set)
      expect(state.selectedNodeIds.size).toBe(0)
      expect(state.selectedEdgeIds).toBeInstanceOf(Set)
      expect(state.selectedEdgeIds.size).toBe(0)
    })

    it('should have default camera and theme settings', () => {
      const state = createInitialCanvasState()
      
      expect(state.camera).toEqual({ x: 0, y: 0, z: 100 })
      expect(state.zoom).toBe(1)
      expect(state.theme).toBe('light')
      expect(state.layout).toBe('force')
      expect(state.layoutPaused).toBe(false)
    })
  })

  describe('processCanvasCommand', () => {
    it('should process ADD_NODE command', () => {
      const state = createInitialCanvasState()
      const node: Node = {
        id: 'node-1',
        label: 'Test Node',
        content: 'Test content',
        position: { x: 10, y: 20, z: 30 }
      }
      
      const newState = processCanvasCommand(state, {
        type: 'ADD_NODE',
        payload: { node }
      })
      
      expect(newState.nodes.size).toBe(1)
      expect(newState.nodes.get('node-1')).toEqual(node)
    })

    it('should process REMOVE_NODE command', () => {
      const state = createInitialCanvasState()
      const node: Node = {
        id: 'node-1',
        label: 'Test Node',
        position: { x: 0, y: 0, z: 0 }
      }
      state.nodes.set('node-1', node)
      
      const newState = processCanvasCommand(state, {
        type: 'REMOVE_NODE',
        payload: { id: 'node-1' }
      })
      
      expect(newState.nodes.size).toBe(0)
      expect(newState.nodes.has('node-1')).toBe(false)
    })

    it('should process SELECT_NODES command with replace mode', () => {
      const state = createInitialCanvasState()
      state.selectedNodeIds.add('old-node')
      
      const newState = processCanvasCommand(state, {
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node-1', 'node-2'], mode: 'replace' }
      })
      
      expect(newState.selectedNodeIds.size).toBe(2)
      expect(newState.selectedNodeIds.has('node-1')).toBe(true)
      expect(newState.selectedNodeIds.has('node-2')).toBe(true)
      expect(newState.selectedNodeIds.has('old-node')).toBe(false)
    })

    it('should process SELECT_NODES command with toggle mode', () => {
      const state = createInitialCanvasState()
      state.selectedNodeIds.add('node-1')
      
      const newState = processCanvasCommand(state, {
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node-1', 'node-2'], mode: 'toggle' }
      })
      
      expect(newState.selectedNodeIds.size).toBe(1)
      expect(newState.selectedNodeIds.has('node-1')).toBe(false)
      expect(newState.selectedNodeIds.has('node-2')).toBe(true)
    })

    it('should process CLEAR_SELECTION command', () => {
      const state = createInitialCanvasState()
      state.selectedNodeIds.add('node-1')
      state.selectedEdgeIds.add('edge-1')
      
      const newState = processCanvasCommand(state, {
        type: 'CLEAR_SELECTION'
      })
      
      expect(newState.selectedNodeIds.size).toBe(0)
      expect(newState.selectedEdgeIds.size).toBe(0)
    })

    it('should process SET_THEME command', () => {
      const state = createInitialCanvasState()
      
      const newState = processCanvasCommand(state, {
        type: 'SET_THEME',
        payload: { theme: 'dark' }
      })
      
      expect(newState.theme).toBe('dark')
    })

    it('should process SET_CAMERA_POSITION command', () => {
      const state = createInitialCanvasState()
      
      const newState = processCanvasCommand(state, {
        type: 'SET_CAMERA_POSITION',
        payload: { x: 50, y: 100, z: 200 }
      })
      
      expect(newState.camera).toEqual({ x: 50, y: 100, z: 200 })
    })

    it('should process ADD_EDGE command', () => {
      const state = createInitialCanvasState()
      const edge: Edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      }
      
      const newState = processCanvasCommand(state, {
        type: 'ADD_EDGE',
        payload: { edge }
      })
      
      expect(newState.edges.size).toBe(1)
      expect(newState.edges.get('edge-1')).toEqual(edge)
    })

    it('should process REMOVE_EDGE command', () => {
      const state = createInitialCanvasState()
      const edge: Edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      }
      state.edges.set('edge-1', edge)
      
      const newState = processCanvasCommand(state, {
        type: 'REMOVE_EDGE',
        payload: { id: 'edge-1' }
      })
      
      expect(newState.edges.size).toBe(0)
      expect(newState.edges.has('edge-1')).toBe(false)
    })

    it('should handle unknown command without errors', () => {
      const state = createInitialCanvasState()
      state.nodes.set('test', { id: 'test', label: 'Test', position: { x: 0, y: 0, z: 0 } })
      
      const newState = processCanvasCommand(state, {
        type: 'UNKNOWN_COMMAND' as any,
        payload: {}
      })
      
      // State should be unchanged
      expect(newState.nodes.size).toBe(1)
      expect(newState.nodes.get('test')).toEqual({ id: 'test', label: 'Test', position: { x: 0, y: 0, z: 0 } })
      expect(newState.camera).toEqual(state.camera)
      expect(newState.theme).toBe(state.theme)
    })
  })
})