import { describe, it, expect } from 'vitest'
import { createInitialCanvasState, processCanvasCommand } from './IntentBus'
import type { CanvasState } from './IntentBus'

describe('IntentBus', () => {
  describe('createInitialCanvasState', () => {
    it('should create default state', () => {
      const state = createInitialCanvasState()
      
      expect(state.nodes).toBeInstanceOf(Map)
      expect(state.edges).toBeInstanceOf(Map)
      expect(state.selectedNodeIds).toBeInstanceOf(Set)
      expect(state.selectedEdgeIds).toBeInstanceOf(Set)
      expect(state.camera).toEqual({ x: 0, y: 0, z: 100 })
      expect(state.zoom).toBe(1)
      expect(state.theme).toBe('light')
      expect(state.layout).toBe('force')
      expect(state.layoutPaused).toBe(false)
    })

    it('should accept overrides', () => {
      const overrides = {
        theme: 'dark' as const,
        zoom: 2,
        camera: { x: 50, y: 50, z: 150 }
      }
      const state = createInitialCanvasState(overrides)
      
      expect(state.theme).toBe('dark')
      expect(state.zoom).toBe(2)
      expect(state.camera).toEqual({ x: 50, y: 50, z: 150 })
    })
  })

  describe('processCanvasCommand', () => {
    let state: CanvasState

    beforeEach(() => {
      state = createInitialCanvasState()
    })

    describe('Node commands', () => {
      it('should handle ADD_NODE', () => {
        const node = { id: 'node-1', label: 'Test Node' }
        const newState = processCanvasCommand(state, {
          type: 'ADD_NODE',
          payload: { node }
        })

        expect(newState.nodes.size).toBe(1)
        expect(newState.nodes.get('node-1')).toEqual(node)
      })

      it('should handle UPDATE_NODE', () => {
        // First add a node
        state.nodes.set('node-1', { id: 'node-1', label: 'Original' })
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_NODE',
          payload: { id: 'node-1', updates: { label: 'Updated' } }
        })

        expect(newState.nodes.get('node-1')).toEqual({ id: 'node-1', label: 'Updated' })
      })

      it('should handle REMOVE_NODE', () => {
        state.nodes.set('node-1', { id: 'node-1', label: 'Test' })
        state.selectedNodeIds.add('node-1')
        state.hoveredNodeId = 'node-1'

        const newState = processCanvasCommand(state, {
          type: 'REMOVE_NODE',
          payload: { id: 'node-1' }
        })

        expect(newState.nodes.has('node-1')).toBe(false)
        expect(newState.selectedNodeIds.has('node-1')).toBe(false)
        expect(newState.hoveredNodeId).toBeNull()
      })

      it('should handle BATCH_ADD_NODES', () => {
        const nodes = [
          { id: 'node-1', label: 'Node 1' },
          { id: 'node-2', label: 'Node 2' }
        ]

        const newState = processCanvasCommand(state, {
          type: 'BATCH_ADD_NODES',
          payload: { nodes }
        })

        expect(newState.nodes.size).toBe(2)
        expect(newState.nodes.get('node-1')).toEqual(nodes[0])
        expect(newState.nodes.get('node-2')).toEqual(nodes[1])
      })

      it('should handle BATCH_UPDATE_NODES', () => {
        state.nodes.set('node-1', { id: 'node-1', label: 'Original 1' })
        state.nodes.set('node-2', { id: 'node-2', label: 'Original 2' })

        const newState = processCanvasCommand(state, {
          type: 'BATCH_UPDATE_NODES',
          payload: {
            updates: [
              { id: 'node-1', updates: { label: 'Updated 1' } },
              { id: 'node-2', updates: { label: 'Updated 2' } }
            ]
          }
        })

        expect(newState.nodes.get('node-1')?.label).toBe('Updated 1')
        expect(newState.nodes.get('node-2')?.label).toBe('Updated 2')
      })

      it('should handle BATCH_REMOVE_NODES', () => {
        state.nodes.set('node-1', { id: 'node-1', label: 'Node 1' })
        state.nodes.set('node-2', { id: 'node-2', label: 'Node 2' })
        state.selectedNodeIds.add('node-1')
        state.hoveredNodeId = 'node-2'

        const newState = processCanvasCommand(state, {
          type: 'BATCH_REMOVE_NODES',
          payload: { ids: ['node-1', 'node-2'] }
        })

        expect(newState.nodes.size).toBe(0)
        expect(newState.selectedNodeIds.size).toBe(0)
        expect(newState.hoveredNodeId).toBeNull()
      })
    })

    describe('Edge commands', () => {
      it('should handle ADD_EDGE', () => {
        const edge = { id: 'edge-1', source: 'node-1', target: 'node-2' }
        const newState = processCanvasCommand(state, {
          type: 'ADD_EDGE',
          payload: { edge }
        })

        expect(newState.edges.size).toBe(1)
        expect(newState.edges.get('edge-1')).toEqual(edge)
      })

      it('should handle UPDATE_EDGE', () => {
        state.edges.set('edge-1', { id: 'edge-1', source: 'node-1', target: 'node-2' })
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_EDGE',
          payload: { id: 'edge-1', updates: { label: 'Updated Edge' } }
        })

        expect(newState.edges.get('edge-1')).toHaveProperty('label', 'Updated Edge')
      })

      it('should handle REMOVE_EDGE', () => {
        state.edges.set('edge-1', { id: 'edge-1', source: 'node-1', target: 'node-2' })
        state.selectedEdgeIds.add('edge-1')
        state.hoveredEdgeId = 'edge-1'

        const newState = processCanvasCommand(state, {
          type: 'REMOVE_EDGE',
          payload: { id: 'edge-1' }
        })

        expect(newState.edges.has('edge-1')).toBe(false)
        expect(newState.selectedEdgeIds.has('edge-1')).toBe(false)
        expect(newState.hoveredEdgeId).toBeNull()
      })
    })

    describe('Camera commands', () => {
      it('should handle SET_CAMERA_POSITION', () => {
        const newState = processCanvasCommand(state, {
          type: 'SET_CAMERA_POSITION',
          payload: { x: 100, y: 200, z: 300 }
        })

        expect(newState.camera).toEqual({ x: 100, y: 200, z: 300 })
      })

      it('should handle SET_ZOOM', () => {
        const newState = processCanvasCommand(state, {
          type: 'SET_ZOOM',
          payload: { zoom: 2.5 }
        })

        expect(newState.zoom).toBe(2.5)
      })
    })

    describe('Selection commands', () => {
      it('should handle SELECT_NODES with replace mode', () => {
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

      it('should handle SELECT_NODES with add mode', () => {
        state.selectedNodeIds.add('existing-node')

        const newState = processCanvasCommand(state, {
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-1'], mode: 'add' }
        })

        expect(newState.selectedNodeIds.size).toBe(2)
        expect(newState.selectedNodeIds.has('existing-node')).toBe(true)
        expect(newState.selectedNodeIds.has('node-1')).toBe(true)
      })

      it('should handle SELECT_NODES with toggle mode', () => {
        state.selectedNodeIds.add('node-1')
        state.selectedNodeIds.add('node-2')

        const newState = processCanvasCommand(state, {
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-1', 'node-3'], mode: 'toggle' }
        })

        expect(newState.selectedNodeIds.size).toBe(2)
        expect(newState.selectedNodeIds.has('node-1')).toBe(false) // toggled off
        expect(newState.selectedNodeIds.has('node-2')).toBe(true)  // unchanged
        expect(newState.selectedNodeIds.has('node-3')).toBe(true)  // toggled on
      })

      it('should handle CLEAR_SELECTION', () => {
        state.selectedNodeIds.add('node-1')
        state.selectedEdgeIds.add('edge-1')

        const newState = processCanvasCommand(state, {
          type: 'CLEAR_SELECTION'
        })

        expect(newState.selectedNodeIds.size).toBe(0)
        expect(newState.selectedEdgeIds.size).toBe(0)
      })

      it('should handle SET_HOVER_NODE', () => {
        const newState = processCanvasCommand(state, {
          type: 'SET_HOVER_NODE',
          payload: { nodeId: 'node-1' }
        })

        expect(newState.hoveredNodeId).toBe('node-1')
      })

      it('should handle SET_HOVER_EDGE', () => {
        const newState = processCanvasCommand(state, {
          type: 'SET_HOVER_EDGE',
          payload: { edgeId: 'edge-1' }
        })

        expect(newState.hoveredEdgeId).toBe('edge-1')
      })
    })

    describe('Layout commands', () => {
      it('should handle SET_LAYOUT', () => {
        const newState = processCanvasCommand(state, {
          type: 'SET_LAYOUT',
          payload: { layout: 'radial' }
        })

        expect(newState.layout).toBe('radial')
      })

      it('should handle PAUSE_LAYOUT', () => {
        const newState = processCanvasCommand(state, {
          type: 'PAUSE_LAYOUT'
        })

        expect(newState.layoutPaused).toBe(true)
      })

      it('should handle RESUME_LAYOUT', () => {
        state.layoutPaused = true

        const newState = processCanvasCommand(state, {
          type: 'RESUME_LAYOUT'
        })

        expect(newState.layoutPaused).toBe(false)
      })

      it('should handle RESET_LAYOUT', () => {
        state.layoutPaused = true

        const newState = processCanvasCommand(state, {
          type: 'RESET_LAYOUT'
        })

        expect(newState.layoutPaused).toBe(false)
      })
    })

    describe('Theme commands', () => {
      it('should handle SET_THEME', () => {
        const newState = processCanvasCommand(state, {
          type: 'SET_THEME',
          payload: { theme: 'dark' }
        })

        expect(newState.theme).toBe('dark')
      })

      it('should handle UPDATE_THEME_PROPERTY', () => {
        state.theme = 'custom'
        state.customTheme = { primaryColor: '#000' }

        const newState = processCanvasCommand(state, {
          type: 'UPDATE_THEME_PROPERTY',
          payload: { property: 'primaryColor', value: '#fff' }
        })

        expect(newState.customTheme).toEqual({ primaryColor: '#fff' })
      })
    })

    describe('Highlight commands', () => {
      it('should handle HIGHLIGHT_NODES', () => {
        const newState = processCanvasCommand(state, {
          type: 'HIGHLIGHT_NODES',
          payload: { 
            nodeIds: ['node-1', 'node-2'], 
            color: '#ff0000',
            intensity: 0.8
          }
        })

        expect(newState.highlightedNodes.size).toBe(2)
        expect(newState.highlightedNodes.get('node-1')).toEqual({ color: '#ff0000', intensity: 0.8 })
      })

      it('should handle HIGHLIGHT_EDGES', () => {
        const newState = processCanvasCommand(state, {
          type: 'HIGHLIGHT_EDGES',
          payload: { 
            edgeIds: ['edge-1'], 
            color: '#00ff00',
            intensity: 0.5
          }
        })

        expect(newState.highlightedEdges.size).toBe(1)
        expect(newState.highlightedEdges.get('edge-1')).toEqual({ color: '#00ff00', intensity: 0.5 })
      })

      it('should handle CLEAR_HIGHLIGHTS', () => {
        state.highlightedNodes.set('node-1', { color: '#ff0000' })
        state.highlightedEdges.set('edge-1', { color: '#00ff00' })

        const newState = processCanvasCommand(state, {
          type: 'CLEAR_HIGHLIGHTS'
        })

        expect(newState.highlightedNodes.size).toBe(0)
        expect(newState.highlightedEdges.size).toBe(0)
      })
    })
  })
})