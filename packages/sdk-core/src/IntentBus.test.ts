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
    describe('Node commands', () => {
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

      it('should process UPDATE_NODE command', () => {
        const state = createInitialCanvasState()
        const node: Node = {
          id: 'node-1',
          label: 'Original Label',
          position: { x: 0, y: 0, z: 0 }
        }
        state.nodes.set('node-1', node)
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_NODE',
          payload: {
            id: 'node-1',
            updates: { label: 'Updated Label' }
          }
        })
        
        expect(newState.nodes.get('node-1')?.label).toBe('Updated Label')
      })

      it('should not update non-existent node', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_NODE',
          payload: {
            id: 'non-existent',
            updates: { label: 'Updated Label' }
          }
        })
        
        expect(newState.nodes.size).toBe(0)
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

      it('should remove node from selection and hover when removing', () => {
        const state = createInitialCanvasState()
        const node: Node = {
          id: 'node-1',
          label: 'Test Node',
          position: { x: 0, y: 0, z: 0 }
        }
        state.nodes.set('node-1', node)
        state.selectedNodeIds.add('node-1')
        state.hoveredNodeId = 'node-1'
        
        const newState = processCanvasCommand(state, {
          type: 'REMOVE_NODE',
          payload: { id: 'node-1' }
        })
        
        expect(newState.selectedNodeIds.has('node-1')).toBe(false)
        expect(newState.hoveredNodeId).toBe(null)
      })

      it('should process BATCH_ADD_NODES command', () => {
        const state = createInitialCanvasState()
        const nodes: Node[] = [
          { id: 'node-1', label: 'Node 1', position: { x: 0, y: 0, z: 0 } },
          { id: 'node-2', label: 'Node 2', position: { x: 10, y: 10, z: 0 } },
          { id: 'node-3', label: 'Node 3', position: { x: 20, y: 20, z: 0 } }
        ]
        
        const newState = processCanvasCommand(state, {
          type: 'BATCH_ADD_NODES',
          payload: { nodes }
        })
        
        expect(newState.nodes.size).toBe(3)
        expect(newState.nodes.get('node-1')?.label).toBe('Node 1')
        expect(newState.nodes.get('node-2')?.label).toBe('Node 2')
        expect(newState.nodes.get('node-3')?.label).toBe('Node 3')
      })

      it('should process BATCH_UPDATE_NODES command', () => {
        const state = createInitialCanvasState()
        state.nodes.set('node-1', { id: 'node-1', label: 'Old 1', position: { x: 0, y: 0, z: 0 } })
        state.nodes.set('node-2', { id: 'node-2', label: 'Old 2', position: { x: 10, y: 10, z: 0 } })
        
        const newState = processCanvasCommand(state, {
          type: 'BATCH_UPDATE_NODES',
          payload: {
            updates: [
              { id: 'node-1', updates: { label: 'New 1' } },
              { id: 'node-2', updates: { label: 'New 2' } },
              { id: 'node-3', updates: { label: 'Should not exist' } } // Non-existent
            ]
          }
        })
        
        expect(newState.nodes.get('node-1')?.label).toBe('New 1')
        expect(newState.nodes.get('node-2')?.label).toBe('New 2')
        expect(newState.nodes.has('node-3')).toBe(false)
      })

      it('should process BATCH_REMOVE_NODES command', () => {
        const state = createInitialCanvasState()
        state.nodes.set('node-1', { id: 'node-1', label: 'Node 1', position: { x: 0, y: 0, z: 0 } })
        state.nodes.set('node-2', { id: 'node-2', label: 'Node 2', position: { x: 10, y: 10, z: 0 } })
        state.nodes.set('node-3', { id: 'node-3', label: 'Node 3', position: { x: 20, y: 20, z: 0 } })
        state.selectedNodeIds.add('node-1')
        state.selectedNodeIds.add('node-2')
        state.hoveredNodeId = 'node-2'
        
        const newState = processCanvasCommand(state, {
          type: 'BATCH_REMOVE_NODES',
          payload: { ids: ['node-1', 'node-2'] }
        })
        
        expect(newState.nodes.size).toBe(1)
        expect(newState.nodes.has('node-3')).toBe(true)
        expect(newState.selectedNodeIds.size).toBe(0)
        expect(newState.hoveredNodeId).toBe(null)
      })
    })

    describe('Edge commands', () => {
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

      it('should process UPDATE_EDGE command', () => {
        const state = createInitialCanvasState()
        const edge: Edge = {
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2',
          label: 'Original'
        }
        state.edges.set('edge-1', edge)
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_EDGE',
          payload: {
            id: 'edge-1',
            updates: { label: 'Updated' }
          }
        })
        
        expect(newState.edges.get('edge-1')?.label).toBe('Updated')
      })

      it('should not update non-existent edge', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_EDGE',
          payload: {
            id: 'non-existent',
            updates: { label: 'Updated' }
          }
        })
        
        expect(newState.edges.size).toBe(0)
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

      it('should remove edge from selection and hover when removing', () => {
        const state = createInitialCanvasState()
        const edge: Edge = {
          id: 'edge-1',
          source: 'node-1',
          target: 'node-2'
        }
        state.edges.set('edge-1', edge)
        state.selectedEdgeIds.add('edge-1')
        state.hoveredEdgeId = 'edge-1'
        
        const newState = processCanvasCommand(state, {
          type: 'REMOVE_EDGE',
          payload: { id: 'edge-1' }
        })
        
        expect(newState.selectedEdgeIds.has('edge-1')).toBe(false)
        expect(newState.hoveredEdgeId).toBe(null)
      })

      it('should process BATCH_ADD_EDGES command', () => {
        const state = createInitialCanvasState()
        const edges: Edge[] = [
          { id: 'edge-1', source: 'node-1', target: 'node-2' },
          { id: 'edge-2', source: 'node-2', target: 'node-3' },
          { id: 'edge-3', source: 'node-3', target: 'node-1' }
        ]
        
        const newState = processCanvasCommand(state, {
          type: 'BATCH_ADD_EDGES',
          payload: { edges }
        })
        
        expect(newState.edges.size).toBe(3)
        expect(newState.edges.get('edge-1')?.source).toBe('node-1')
        expect(newState.edges.get('edge-2')?.source).toBe('node-2')
        expect(newState.edges.get('edge-3')?.source).toBe('node-3')
      })

      it('should process BATCH_UPDATE_EDGES command', () => {
        const state = createInitialCanvasState()
        state.edges.set('edge-1', { id: 'edge-1', source: 'node-1', target: 'node-2', label: 'Old 1' })
        state.edges.set('edge-2', { id: 'edge-2', source: 'node-2', target: 'node-3', label: 'Old 2' })
        
        const newState = processCanvasCommand(state, {
          type: 'BATCH_UPDATE_EDGES',
          payload: {
            updates: [
              { id: 'edge-1', updates: { label: 'New 1' } },
              { id: 'edge-2', updates: { label: 'New 2' } },
              { id: 'edge-3', updates: { label: 'Should not exist' } } // Non-existent
            ]
          }
        })
        
        expect(newState.edges.get('edge-1')?.label).toBe('New 1')
        expect(newState.edges.get('edge-2')?.label).toBe('New 2')
        expect(newState.edges.has('edge-3')).toBe(false)
      })

      it('should process BATCH_REMOVE_EDGES command', () => {
        const state = createInitialCanvasState()
        state.edges.set('edge-1', { id: 'edge-1', source: 'node-1', target: 'node-2' })
        state.edges.set('edge-2', { id: 'edge-2', source: 'node-2', target: 'node-3' })
        state.edges.set('edge-3', { id: 'edge-3', source: 'node-3', target: 'node-1' })
        state.selectedEdgeIds.add('edge-1')
        state.selectedEdgeIds.add('edge-2')
        state.hoveredEdgeId = 'edge-2'
        
        const newState = processCanvasCommand(state, {
          type: 'BATCH_REMOVE_EDGES',
          payload: { ids: ['edge-1', 'edge-2'] }
        })
        
        expect(newState.edges.size).toBe(1)
        expect(newState.edges.has('edge-3')).toBe(true)
        expect(newState.selectedEdgeIds.size).toBe(0)
        expect(newState.hoveredEdgeId).toBe(null)
      })
    })

    describe('Camera commands', () => {
      it('should process SET_CAMERA_POSITION command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_CAMERA_POSITION',
          payload: { x: 50, y: 100, z: 200 }
        })
        
        expect(newState.camera).toEqual({ x: 50, y: 100, z: 200 })
      })

      it('should process SET_ZOOM command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_ZOOM',
          payload: { zoom: 2.5 }
        })
        
        expect(newState.zoom).toBe(2.5)
      })

      it('should process FIT_TO_NODES command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'FIT_TO_NODES',
          payload: { nodeIds: ['node-1', 'node-2'] }
        })
        
        // Since FIT_TO_NODES is TODO, state should remain unchanged
        expect(newState.camera).toEqual(state.camera)
      })

      it('should process CENTER_ON_NODE command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'CENTER_ON_NODE',
          payload: { nodeId: 'node-1' }
        })
        
        // Since CENTER_ON_NODE is TODO, state should remain unchanged
        expect(newState.camera).toEqual(state.camera)
      })
    })

    describe('Selection commands', () => {
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

      it('should process SELECT_NODES command with add mode', () => {
        const state = createInitialCanvasState()
        state.selectedNodeIds.add('node-1')
        
        const newState = processCanvasCommand(state, {
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-2', 'node-3'], mode: 'add' }
        })
        
        expect(newState.selectedNodeIds.size).toBe(3)
        expect(newState.selectedNodeIds.has('node-1')).toBe(true)
        expect(newState.selectedNodeIds.has('node-2')).toBe(true)
        expect(newState.selectedNodeIds.has('node-3')).toBe(true)
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

      it('should process SELECT_EDGES command with replace mode', () => {
        const state = createInitialCanvasState()
        state.selectedEdgeIds.add('old-edge')
        
        const newState = processCanvasCommand(state, {
          type: 'SELECT_EDGES',
          payload: { edgeIds: ['edge-1', 'edge-2'], mode: 'replace' }
        })
        
        expect(newState.selectedEdgeIds.size).toBe(2)
        expect(newState.selectedEdgeIds.has('edge-1')).toBe(true)
        expect(newState.selectedEdgeIds.has('edge-2')).toBe(true)
        expect(newState.selectedEdgeIds.has('old-edge')).toBe(false)
      })

      it('should process SELECT_EDGES command with add mode', () => {
        const state = createInitialCanvasState()
        state.selectedEdgeIds.add('edge-1')
        
        const newState = processCanvasCommand(state, {
          type: 'SELECT_EDGES',
          payload: { edgeIds: ['edge-2', 'edge-3'], mode: 'add' }
        })
        
        expect(newState.selectedEdgeIds.size).toBe(3)
        expect(newState.selectedEdgeIds.has('edge-1')).toBe(true)
        expect(newState.selectedEdgeIds.has('edge-2')).toBe(true)
        expect(newState.selectedEdgeIds.has('edge-3')).toBe(true)
      })

      it('should process SELECT_EDGES command with toggle mode', () => {
        const state = createInitialCanvasState()
        state.selectedEdgeIds.add('edge-1')
        
        const newState = processCanvasCommand(state, {
          type: 'SELECT_EDGES',
          payload: { edgeIds: ['edge-1', 'edge-2'], mode: 'toggle' }
        })
        
        expect(newState.selectedEdgeIds.size).toBe(1)
        expect(newState.selectedEdgeIds.has('edge-1')).toBe(false)
        expect(newState.selectedEdgeIds.has('edge-2')).toBe(true)
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

      it('should process SET_HOVER_NODE command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_HOVER_NODE',
          payload: { nodeId: 'node-1' }
        })
        
        expect(newState.hoveredNodeId).toBe('node-1')
      })

      it('should process SET_HOVER_EDGE command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_HOVER_EDGE',
          payload: { edgeId: 'edge-1' }
        })
        
        expect(newState.hoveredEdgeId).toBe('edge-1')
      })
    })

    describe('Layout commands', () => {
      it('should process SET_LAYOUT command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_LAYOUT',
          payload: { layout: 'radial' }
        })
        
        expect(newState.layout).toBe('radial')
      })

      it('should process PAUSE_LAYOUT command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'PAUSE_LAYOUT'
        })
        
        expect(newState.layoutPaused).toBe(true)
      })

      it('should process RESUME_LAYOUT command', () => {
        const state = createInitialCanvasState()
        state.layoutPaused = true
        
        const newState = processCanvasCommand(state, {
          type: 'RESUME_LAYOUT'
        })
        
        expect(newState.layoutPaused).toBe(false)
      })

      it('should process RESET_LAYOUT command', () => {
        const state = createInitialCanvasState()
        state.layoutPaused = true
        
        const newState = processCanvasCommand(state, {
          type: 'RESET_LAYOUT'
        })
        
        expect(newState.layoutPaused).toBe(false)
      })
    })

    describe('Theme commands', () => {
      it('should process SET_THEME command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_THEME',
          payload: { theme: 'dark' }
        })
        
        expect(newState.theme).toBe('dark')
      })

      it('should process SET_THEME command with custom theme', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'SET_THEME',
          payload: { 
            theme: 'custom',
            customTheme: { background: '#000000' }
          }
        })
        
        expect(newState.theme).toBe('custom')
        expect(newState.customTheme).toEqual({ background: '#000000' })
      })

      it('should process UPDATE_THEME_PROPERTY command', () => {
        const state = createInitialCanvasState()
        state.theme = 'custom'
        state.customTheme = { background: '#000000' }
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_THEME_PROPERTY',
          payload: { 
            property: 'background',
            value: '#ffffff'
          }
        })
        
        expect(newState.customTheme.background).toBe('#ffffff')
      })

      it('should not update theme property when not custom theme', () => {
        const state = createInitialCanvasState()
        state.theme = 'light'
        
        const newState = processCanvasCommand(state, {
          type: 'UPDATE_THEME_PROPERTY',
          payload: { 
            property: 'background',
            value: '#ffffff'
          }
        })
        
        expect(newState.customTheme).toBeUndefined()
      })
    })

    describe('Highlight commands', () => {
      it('should process HIGHLIGHT_NODES command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'HIGHLIGHT_NODES',
          payload: { 
            nodeIds: ['node-1', 'node-2'],
            color: '#ff0000',
            intensity: 0.8
          }
        })
        
        expect(newState.highlightedNodes.size).toBe(2)
        expect(newState.highlightedNodes.get('node-1')).toEqual({
          color: '#ff0000',
          intensity: 0.8
        })
        expect(newState.highlightedNodes.get('node-2')).toEqual({
          color: '#ff0000',
          intensity: 0.8
        })
      })

      it('should process HIGHLIGHT_EDGES command', () => {
        const state = createInitialCanvasState()
        
        const newState = processCanvasCommand(state, {
          type: 'HIGHLIGHT_EDGES',
          payload: { 
            edgeIds: ['edge-1', 'edge-2'],
            color: '#00ff00',
            intensity: 0.5
          }
        })
        
        expect(newState.highlightedEdges.size).toBe(2)
        expect(newState.highlightedEdges.get('edge-1')).toEqual({
          color: '#00ff00',
          intensity: 0.5
        })
        expect(newState.highlightedEdges.get('edge-2')).toEqual({
          color: '#00ff00',
          intensity: 0.5
        })
      })

      it('should process CLEAR_HIGHLIGHTS command', () => {
        const state = createInitialCanvasState()
        state.highlightedNodes.set('node-1', { color: '#ff0000', intensity: 0.8 })
        state.highlightedEdges.set('edge-1', { color: '#00ff00', intensity: 0.5 })
        
        const newState = processCanvasCommand(state, {
          type: 'CLEAR_HIGHLIGHTS'
        })
        
        expect(newState.highlightedNodes.size).toBe(0)
        expect(newState.highlightedEdges.size).toBe(0)
      })
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

    it('should handle createInitialCanvasState with overrides', () => {
      const overrides = {
        theme: 'dark' as const,
        zoom: 2,
        camera: { x: 10, y: 20, z: 30 },
        layoutPaused: true
      }
      
      const state = createInitialCanvasState(overrides)
      
      expect(state.theme).toBe('dark')
      expect(state.zoom).toBe(2)
      expect(state.camera).toEqual({ x: 10, y: 20, z: 30 })
      expect(state.layoutPaused).toBe(true)
    })
  })
})