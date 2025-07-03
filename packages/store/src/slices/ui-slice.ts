/**
 * UI slice - manages selection, camera, layout, theme, and highlights
 */

import { produce } from 'immer'
import type { UIState } from '../types/state'
import type { RendererCommand } from '../types/renderer-commands'

export interface UISlice extends UIState {
  // Selection actions
  selectNodes: (nodeIds: string[], mode: 'replace' | 'add' | 'toggle') => RendererCommand
  selectEdges: (edgeIds: string[], mode: 'replace' | 'add' | 'toggle') => RendererCommand
  clearSelection: () => RendererCommand
  setHoverNode: (nodeId: string | null) => RendererCommand
  setHoverEdge: (edgeId: string | null) => RendererCommand
  
  // Camera actions
  setCameraPosition: (x: number, y: number, z: number) => RendererCommand
  setZoom: (zoom: number) => RendererCommand
  fitToNodes: (nodeIds?: string[]) => RendererCommand
  centerOnNode: (nodeId: string) => RendererCommand
  
  // Layout actions
  setLayout: (layout: 'force' | 'radial' | 'hierarchical') => RendererCommand
  pauseLayout: () => RendererCommand
  resumeLayout: () => RendererCommand
  resetLayout: () => RendererCommand
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'custom', customTheme?: any) => RendererCommand
  updateThemeProperty: (property: string, value: any) => RendererCommand
  
  // Highlight actions
  highlightNodes: (nodeIds: string[], color?: string, intensity?: number) => RendererCommand
  highlightEdges: (edgeIds: string[], color?: string, intensity?: number) => RendererCommand
  clearHighlights: () => RendererCommand
  
  // Query methods
  isNodeSelected: (nodeId: string) => boolean
  isEdgeSelected: (edgeId: string) => boolean
  getSelectedNodes: () => string[]
  getSelectedEdges: () => string[]
  getHighlightedNodes: () => Map<string, { color: string; intensity: number }>
  getHighlightedEdges: () => Map<string, { color: string; intensity: number }>
}

export const createUISlice = (set: any, get: any): UISlice => ({
  // Initial state
  selectedNodeIds: new Set(),
  selectedEdgeIds: new Set(),
  hoveredNodeId: null,
  hoveredEdgeId: null,
  camera: {
    position: { x: 0, y: 0, z: 100 },
    zoom: 1
  },
  layout: {
    type: 'force',
    isPaused: false
  },
  theme: {
    mode: 'light',
    customTheme: undefined
  },
  highlights: {
    nodes: new Map(),
    edges: new Map()
  },

  // Selection actions
  selectNodes: (nodeIds, mode) => {
    set(
      produce((state: UISlice) => {
        if (mode === 'replace') {
          state.selectedNodeIds = new Set(nodeIds)
        } else if (mode === 'add') {
          nodeIds.forEach(id => state.selectedNodeIds.add(id))
        } else if (mode === 'toggle') {
          nodeIds.forEach(id => {
            if (state.selectedNodeIds.has(id)) {
              state.selectedNodeIds.delete(id)
            } else {
              state.selectedNodeIds.add(id)
            }
          })
        }
      })
    )
    return { type: 'SELECT_NODES', payload: { nodeIds, mode } }
  },

  selectEdges: (edgeIds, mode) => {
    set(
      produce((state: UISlice) => {
        if (mode === 'replace') {
          state.selectedEdgeIds = new Set(edgeIds)
        } else if (mode === 'add') {
          edgeIds.forEach(id => state.selectedEdgeIds.add(id))
        } else if (mode === 'toggle') {
          edgeIds.forEach(id => {
            if (state.selectedEdgeIds.has(id)) {
              state.selectedEdgeIds.delete(id)
            } else {
              state.selectedEdgeIds.add(id)
            }
          })
        }
      })
    )
    return { type: 'SELECT_EDGES', payload: { edgeIds, mode } }
  },

  clearSelection: () => {
    set(
      produce((state: UISlice) => {
        state.selectedNodeIds.clear()
        state.selectedEdgeIds.clear()
      })
    )
    return { type: 'CLEAR_SELECTION' }
  },

  setHoverNode: (nodeId) => {
    set(
      produce((state: UISlice) => {
        state.hoveredNodeId = nodeId
      })
    )
    return { type: 'SET_HOVER_NODE', payload: { nodeId } }
  },

  setHoverEdge: (edgeId) => {
    set(
      produce((state: UISlice) => {
        state.hoveredEdgeId = edgeId
      })
    )
    return { type: 'SET_HOVER_EDGE', payload: { edgeId } }
  },

  // Camera actions
  setCameraPosition: (x, y, z) => {
    set(
      produce((state: UISlice) => {
        state.camera.position = { x, y, z }
      })
    )
    return { type: 'SET_CAMERA_POSITION', payload: { x, y, z } }
  },

  setZoom: (zoom) => {
    set(
      produce((state: UISlice) => {
        state.camera.zoom = zoom
      })
    )
    return { type: 'SET_ZOOM', payload: { zoom } }
  },

  fitToNodes: (nodeIds) => {
    return { type: 'FIT_TO_NODES', payload: { nodeIds } }
  },

  centerOnNode: (nodeId) => {
    return { type: 'CENTER_ON_NODE', payload: { nodeId } }
  },

  // Layout actions
  setLayout: (layout) => {
    set(
      produce((state: UISlice) => {
        state.layout.type = layout
        state.layout.isPaused = false
      })
    )
    return { type: 'SET_LAYOUT', payload: { layout } }
  },

  pauseLayout: () => {
    set(
      produce((state: UISlice) => {
        state.layout.isPaused = true
      })
    )
    return { type: 'PAUSE_LAYOUT' }
  },

  resumeLayout: () => {
    set(
      produce((state: UISlice) => {
        state.layout.isPaused = false
      })
    )
    return { type: 'RESUME_LAYOUT' }
  },

  resetLayout: () => {
    set(
      produce((state: UISlice) => {
        state.layout.isPaused = false
      })
    )
    return { type: 'RESET_LAYOUT' }
  },

  // Theme actions
  setTheme: (theme, customTheme) => {
    set(
      produce((state: UISlice) => {
        state.theme.mode = theme
        if (customTheme) {
          state.theme.customTheme = customTheme
        }
      })
    )
    return { type: 'SET_THEME', payload: { theme, customTheme } }
  },

  updateThemeProperty: (property, value) => {
    set(
      produce((state: UISlice) => {
        if (!state.theme.customTheme) {
          state.theme.customTheme = {}
        }
        state.theme.customTheme[property] = value
      })
    )
    return { type: 'UPDATE_THEME_PROPERTY', payload: { property, value } }
  },

  // Highlight actions
  highlightNodes: (nodeIds, color = '#ffeb3b', intensity = 1) => {
    set(
      produce((state: UISlice) => {
        nodeIds.forEach(id => {
          state.highlights.nodes.set(id, { color, intensity })
        })
      })
    )
    return { type: 'HIGHLIGHT_NODES', payload: { nodeIds, color, intensity } }
  },

  highlightEdges: (edgeIds, color = '#ffeb3b', intensity = 1) => {
    set(
      produce((state: UISlice) => {
        edgeIds.forEach(id => {
          state.highlights.edges.set(id, { color, intensity })
        })
      })
    )
    return { type: 'HIGHLIGHT_EDGES', payload: { edgeIds, color, intensity } }
  },

  clearHighlights: () => {
    set(
      produce((state: UISlice) => {
        state.highlights.nodes.clear()
        state.highlights.edges.clear()
      })
    )
    return { type: 'CLEAR_HIGHLIGHTS' }
  },

  // Query methods
  isNodeSelected: (nodeId) => get().selectedNodeIds.has(nodeId),
  isEdgeSelected: (edgeId) => get().selectedEdgeIds.has(edgeId),
  getSelectedNodes: () => Array.from(get().selectedNodeIds),
  getSelectedEdges: () => Array.from(get().selectedEdgeIds),
  getHighlightedNodes: () => get().highlights.nodes,
  getHighlightedEdges: () => get().highlights.edges
})