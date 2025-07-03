import { describe, it, expect, beforeEach } from 'vitest'
import { createUISlice } from './ui-slice'

describe('UISlice', () => {
  let slice: ReturnType<typeof createUISlice>
  let setState: any
  let getState: any

  beforeEach(() => {
    const state = createUISlice(() => {}, () => slice)
    slice = state
    setState = (fn: any) => {
      const result = fn(slice)
      if (result) Object.assign(slice, result)
    }
    getState = () => slice
    // Re-create slice with proper set/get
    slice = createUISlice(setState, getState)
  })

  describe('Selection actions', () => {
    it('should select nodes with replace mode', () => {
      const command = slice.selectNodes(['node-1', 'node-2'], 'replace')

      expect(slice.selectedNodeIds.has('node-1')).toBe(true)
      expect(slice.selectedNodeIds.has('node-2')).toBe(true)
      expect(slice.selectedNodeIds.size).toBe(2)
      expect(command).toEqual({
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node-1', 'node-2'], mode: 'replace' }
      })
    })

    it('should add nodes to selection', () => {
      slice.selectNodes(['node-1'], 'replace')
      slice.selectNodes(['node-2', 'node-3'], 'add')

      expect(slice.selectedNodeIds.size).toBe(3)
      expect(slice.selectedNodeIds.has('node-1')).toBe(true)
      expect(slice.selectedNodeIds.has('node-2')).toBe(true)
      expect(slice.selectedNodeIds.has('node-3')).toBe(true)
    })

    it('should toggle node selection', () => {
      slice.selectNodes(['node-1', 'node-2'], 'replace')
      slice.selectNodes(['node-2', 'node-3'], 'toggle')

      expect(slice.selectedNodeIds.has('node-1')).toBe(true)
      expect(slice.selectedNodeIds.has('node-2')).toBe(false) // Toggled off
      expect(slice.selectedNodeIds.has('node-3')).toBe(true)  // Toggled on
    })

    it('should select edges', () => {
      const command = slice.selectEdges(['edge-1', 'edge-2'], 'replace')

      expect(slice.selectedEdgeIds.has('edge-1')).toBe(true)
      expect(slice.selectedEdgeIds.has('edge-2')).toBe(true)
      expect(command).toEqual({
        type: 'SELECT_EDGES',
        payload: { edgeIds: ['edge-1', 'edge-2'], mode: 'replace' }
      })
    })

    it('should clear selection', () => {
      slice.selectNodes(['node-1'], 'replace')
      slice.selectEdges(['edge-1'], 'replace')

      const command = slice.clearSelection()

      expect(slice.selectedNodeIds.size).toBe(0)
      expect(slice.selectedEdgeIds.size).toBe(0)
      expect(command).toEqual({ type: 'CLEAR_SELECTION' })
    })

    it('should set hover states', () => {
      let command = slice.setHoverNode('node-1')
      expect(slice.hoveredNodeId).toBe('node-1')
      expect(command).toEqual({
        type: 'SET_HOVER_NODE',
        payload: { nodeId: 'node-1' }
      })

      command = slice.setHoverEdge('edge-1')
      expect(slice.hoveredEdgeId).toBe('edge-1')
      expect(command).toEqual({
        type: 'SET_HOVER_EDGE',
        payload: { edgeId: 'edge-1' }
      })
    })
  })

  describe('Camera actions', () => {
    it('should set camera position', () => {
      const command = slice.setCameraPosition(10, 20, 30)

      expect(slice.camera.position).toEqual({ x: 10, y: 20, z: 30 })
      expect(command).toEqual({
        type: 'SET_CAMERA_POSITION',
        payload: { x: 10, y: 20, z: 30 }
      })
    })

    it('should set zoom level', () => {
      const command = slice.setZoom(2.5)

      expect(slice.camera.zoom).toBe(2.5)
      expect(command).toEqual({
        type: 'SET_ZOOM',
        payload: { zoom: 2.5 }
      })
    })

    it('should create fit to nodes command', () => {
      const command = slice.fitToNodes(['node-1', 'node-2'])

      expect(command).toEqual({
        type: 'FIT_TO_NODES',
        payload: { nodeIds: ['node-1', 'node-2'] }
      })
    })

    it('should create center on node command', () => {
      const command = slice.centerOnNode('node-1')

      expect(command).toEqual({
        type: 'CENTER_ON_NODE',
        payload: { nodeId: 'node-1' }
      })
    })
  })

  describe('Layout actions', () => {
    it('should set layout type', () => {
      const command = slice.setLayout('hierarchical')

      expect(slice.layout.type).toBe('hierarchical')
      expect(slice.layout.isPaused).toBe(false)
      expect(command).toEqual({
        type: 'SET_LAYOUT',
        payload: { layout: 'hierarchical' }
      })
    })

    it('should pause layout', () => {
      const command = slice.pauseLayout()

      expect(slice.layout.isPaused).toBe(true)
      expect(command).toEqual({ type: 'PAUSE_LAYOUT' })
    })

    it('should resume layout', () => {
      slice.pauseLayout()
      const command = slice.resumeLayout()

      expect(slice.layout.isPaused).toBe(false)
      expect(command).toEqual({ type: 'RESUME_LAYOUT' })
    })

    it('should reset layout', () => {
      slice.pauseLayout()
      const command = slice.resetLayout()

      expect(slice.layout.isPaused).toBe(false)
      expect(command).toEqual({ type: 'RESET_LAYOUT' })
    })
  })

  describe('Theme actions', () => {
    it('should set theme', () => {
      const customTheme = { primaryColor: '#ff0000' }
      const command = slice.setTheme('custom', customTheme)

      expect(slice.theme.mode).toBe('custom')
      expect(slice.theme.customTheme).toEqual(customTheme)
      expect(command).toEqual({
        type: 'SET_THEME',
        payload: { theme: 'custom', customTheme }
      })
    })

    it('should update theme property', () => {
      const command = slice.updateThemeProperty('primaryColor', '#00ff00')

      expect(slice.theme.customTheme).toEqual({ primaryColor: '#00ff00' })
      expect(command).toEqual({
        type: 'UPDATE_THEME_PROPERTY',
        payload: { property: 'primaryColor', value: '#00ff00' }
      })
    })
  })

  describe('Highlight actions', () => {
    it('should highlight nodes', () => {
      const command = slice.highlightNodes(['node-1', 'node-2'], '#ff0000', 0.8)

      expect(slice.highlights.nodes.get('node-1')).toEqual({ color: '#ff0000', intensity: 0.8 })
      expect(slice.highlights.nodes.get('node-2')).toEqual({ color: '#ff0000', intensity: 0.8 })
      expect(command).toEqual({
        type: 'HIGHLIGHT_NODES',
        payload: { nodeIds: ['node-1', 'node-2'], color: '#ff0000', intensity: 0.8 }
      })
    })

    it('should highlight edges with defaults', () => {
      const command = slice.highlightEdges(['edge-1'])

      expect(slice.highlights.edges.get('edge-1')).toEqual({ color: '#ffeb3b', intensity: 1 })
      expect(command).toEqual({
        type: 'HIGHLIGHT_EDGES',
        payload: { edgeIds: ['edge-1'], color: '#ffeb3b', intensity: 1 }
      })
    })

    it('should clear highlights', () => {
      slice.highlightNodes(['node-1'], '#ff0000')
      slice.highlightEdges(['edge-1'], '#00ff00')

      const command = slice.clearHighlights()

      expect(slice.highlights.nodes.size).toBe(0)
      expect(slice.highlights.edges.size).toBe(0)
      expect(command).toEqual({ type: 'CLEAR_HIGHLIGHTS' })
    })
  })

  describe('Query methods', () => {
    beforeEach(() => {
      slice.selectNodes(['node-1', 'node-2'], 'replace')
      slice.selectEdges(['edge-1'], 'replace')
      slice.highlightNodes(['node-1'], '#ff0000')
      slice.highlightEdges(['edge-1'], '#00ff00')
    })

    it('should check if node is selected', () => {
      expect(slice.isNodeSelected('node-1')).toBe(true)
      expect(slice.isNodeSelected('node-3')).toBe(false)
    })

    it('should check if edge is selected', () => {
      expect(slice.isEdgeSelected('edge-1')).toBe(true)
      expect(slice.isEdgeSelected('edge-2')).toBe(false)
    })

    it('should get selected nodes', () => {
      const nodes = slice.getSelectedNodes()
      expect(nodes).toEqual(['node-1', 'node-2'])
    })

    it('should get selected edges', () => {
      const edges = slice.getSelectedEdges()
      expect(edges).toEqual(['edge-1'])
    })

    it('should get highlighted nodes', () => {
      const highlights = slice.getHighlightedNodes()
      expect(highlights.get('node-1')).toEqual({ color: '#ff0000', intensity: 1 })
    })

    it('should get highlighted edges', () => {
      const highlights = slice.getHighlightedEdges()
      expect(highlights.get('edge-1')).toEqual({ color: '#00ff00', intensity: 1 })
    })
  })
})