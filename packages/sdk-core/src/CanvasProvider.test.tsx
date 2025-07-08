import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { CanvasProvider, useCanvas } from './CanvasProvider'
import type { RendererCommand } from '@refinery/store'

// Create mock store
const mockStore = {
  enqueueCommand: vi.fn(),
  enqueueCommands: vi.fn(),
  subscribeToCommands: vi.fn(() => vi.fn())
}

// Mock @refinery/store
vi.mock('@refinery/store', () => ({
  useRefineryStore: vi.fn(() => mockStore)
}))

describe('CanvasProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CanvasProvider>{children}</CanvasProvider>
  )

  describe('useCanvas hook', () => {
    it('should provide canvas state', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      expect(result.current.state).toBeDefined()
      expect(result.current.state.nodes).toBeInstanceOf(Map)
      expect(result.current.state.edges).toBeInstanceOf(Map)
      expect(result.current.state.selectedNodeIds).toBeInstanceOf(Set)
      expect(result.current.state.selectedEdgeIds).toBeInstanceOf(Set)
      expect(result.current.state.camera).toEqual({ x: 0, y: 0, z: 100 })
      expect(result.current.state.zoom).toBe(1)
      expect(result.current.state.theme).toBe('light')
    })

    it('should provide command functions', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      expect(result.current.enqueueCommand).toBeDefined()
      expect(result.current.enqueueCommands).toBeDefined()
      expect(typeof result.current.enqueueCommand).toBe('function')
      expect(typeof result.current.enqueueCommands).toBe('function')
    })

    it('should throw when used outside provider', () => {
      expect(() => {
        renderHook(() => useCanvas())
      }).toThrow('useCanvas must be used within CanvasProvider')
    })
  })

  describe('CanvasProvider with initial state', () => {
    it('should accept initial state', () => {
      const initialState = {
        theme: 'dark' as const,
        zoom: 2,
        camera: { x: 10, y: 20, z: 30 }
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <CanvasProvider initialState={initialState}>{children}</CanvasProvider>
      )

      const { result } = renderHook(() => useCanvas(), { wrapper })

      expect(result.current.state.theme).toBe('dark')
      expect(result.current.state.zoom).toBe(2)
      expect(result.current.state.camera).toEqual({ x: 10, y: 20, z: 30 })
    })
  })

  describe('Command processing', () => {
    let commandCallback: (commands: RendererCommand[]) => void

    beforeEach(() => {
      vi.clearAllMocks()
      // Capture the callback when subscribeToCommands is called
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        commandCallback = callback
        return vi.fn()
      })
    })

    // Node commands
    it('should process ADD_NODE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'ADD_NODE',
          payload: {
            node: {
              id: 'node-1',
              label: 'Test Node',
              content: 'Test content',
              position: { x: 0, y: 0, z: 0 }
            }
          }
        }])
      })

      expect(result.current.state.nodes.size).toBe(1)
      expect(result.current.state.nodes.get('node-1')).toEqual({
        id: 'node-1',
        label: 'Test Node',
        content: 'Test content',
        position: { x: 0, y: 0, z: 0 }
      })
    })

    it('should process UPDATE_NODE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First add a node
      act(() => {
        commandCallback([{
          type: 'ADD_NODE',
          payload: {
            node: { id: 'node-1', label: 'Original' }
          }
        }])
      })

      // Then update it
      act(() => {
        commandCallback([{
          type: 'UPDATE_NODE',
          payload: {
            id: 'node-1',
            updates: { label: 'Updated' }
          }
        }])
      })

      expect(result.current.state.nodes.get('node-1')?.label).toBe('Updated')
    })

    it('should ignore UPDATE_NODE for non-existent node', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'UPDATE_NODE',
          payload: {
            id: 'non-existent',
            updates: { label: 'Updated' }
          }
        }])
      })

      expect(result.current.state.nodes.size).toBe(0)
    })

    it('should process REMOVE_NODE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add nodes and selections
      act(() => {
        commandCallback([
          {
            type: 'ADD_NODE',
            payload: { node: { id: 'node-1', label: 'Node 1' } }
          },
          {
            type: 'ADD_NODE',
            payload: { node: { id: 'node-2', label: 'Node 2' } }
          },
          {
            type: 'SELECT_NODES',
            payload: { nodeIds: ['node-1', 'node-2'], mode: 'replace' }
          },
          {
            type: 'SET_HOVER_NODE',
            payload: { nodeId: 'node-1' }
          }
        ])
      })

      // Remove node-1
      act(() => {
        commandCallback([{
          type: 'REMOVE_NODE',
          payload: { id: 'node-1' }
        }])
      })

      expect(result.current.state.nodes.size).toBe(1)
      expect(result.current.state.nodes.has('node-1')).toBe(false)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(false)
      expect(result.current.state.hoveredNodeId).toBeNull()
    })

    it('should process BATCH_ADD_NODES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'BATCH_ADD_NODES',
          payload: {
            nodes: [
              { id: 'node-1', label: 'Node 1' },
              { id: 'node-2', label: 'Node 2' },
              { id: 'node-3', label: 'Node 3' }
            ]
          }
        }])
      })

      expect(result.current.state.nodes.size).toBe(3)
      expect(result.current.state.nodes.get('node-1')?.label).toBe('Node 1')
      expect(result.current.state.nodes.get('node-2')?.label).toBe('Node 2')
      expect(result.current.state.nodes.get('node-3')?.label).toBe('Node 3')
    })

    it('should process BATCH_UPDATE_NODES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First add nodes
      act(() => {
        commandCallback([{
          type: 'BATCH_ADD_NODES',
          payload: {
            nodes: [
              { id: 'node-1', label: 'Node 1' },
              { id: 'node-2', label: 'Node 2' },
              { id: 'node-3', label: 'Node 3' }
            ]
          }
        }])
      })

      // Update multiple nodes
      act(() => {
        commandCallback([{
          type: 'BATCH_UPDATE_NODES',
          payload: {
            updates: [
              { id: 'node-1', updates: { label: 'Updated 1' } },
              { id: 'node-2', updates: { label: 'Updated 2' } },
              { id: 'non-existent', updates: { label: 'Should not update' } }
            ]
          }
        }])
      })

      expect(result.current.state.nodes.get('node-1')?.label).toBe('Updated 1')
      expect(result.current.state.nodes.get('node-2')?.label).toBe('Updated 2')
      expect(result.current.state.nodes.get('node-3')?.label).toBe('Node 3')
    })

    it('should process BATCH_REMOVE_NODES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Setup nodes with selections and hover
      act(() => {
        commandCallback([
          {
            type: 'BATCH_ADD_NODES',
            payload: {
              nodes: [
                { id: 'node-1', label: 'Node 1' },
                { id: 'node-2', label: 'Node 2' },
                { id: 'node-3', label: 'Node 3' }
              ]
            }
          },
          {
            type: 'SELECT_NODES',
            payload: { nodeIds: ['node-1', 'node-2', 'node-3'], mode: 'replace' }
          },
          {
            type: 'SET_HOVER_NODE',
            payload: { nodeId: 'node-2' }
          }
        ])
      })

      // Remove multiple nodes
      act(() => {
        commandCallback([{
          type: 'BATCH_REMOVE_NODES',
          payload: { ids: ['node-1', 'node-2'] }
        }])
      })

      expect(result.current.state.nodes.size).toBe(1)
      expect(result.current.state.nodes.has('node-3')).toBe(true)
      expect(result.current.state.selectedNodeIds.size).toBe(1)
      expect(result.current.state.selectedNodeIds.has('node-3')).toBe(true)
      expect(result.current.state.hoveredNodeId).toBeNull()
    })

    // Edge commands
    it('should process ADD_EDGE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'ADD_EDGE',
          payload: {
            edge: { id: 'edge-1', source: 'node-1', target: 'node-2' }
          }
        }])
      })

      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.edges.get('edge-1')).toEqual({
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      })
    })

    it('should process UPDATE_EDGE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First add an edge
      act(() => {
        commandCallback([{
          type: 'ADD_EDGE',
          payload: {
            edge: { id: 'edge-1', source: 'node-1', target: 'node-2' }
          }
        }])
      })

      // Then update it
      act(() => {
        commandCallback([{
          type: 'UPDATE_EDGE',
          payload: {
            id: 'edge-1',
            updates: { label: 'Connection' }
          }
        }])
      })

      expect(result.current.state.edges.get('edge-1')).toMatchObject({
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        label: 'Connection'
      })
    })

    it('should ignore UPDATE_EDGE for non-existent edge', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'UPDATE_EDGE',
          payload: {
            id: 'non-existent',
            updates: { label: 'Should not update' }
          }
        }])
      })

      expect(result.current.state.edges.size).toBe(0)
    })

    it('should process REMOVE_EDGE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add edges and selections
      act(() => {
        commandCallback([
          {
            type: 'ADD_EDGE',
            payload: { edge: { id: 'edge-1', source: 'n1', target: 'n2' } }
          },
          {
            type: 'ADD_EDGE',
            payload: { edge: { id: 'edge-2', source: 'n2', target: 'n3' } }
          },
          {
            type: 'SELECT_EDGES',
            payload: { edgeIds: ['edge-1', 'edge-2'], mode: 'replace' }
          },
          {
            type: 'SET_HOVER_EDGE',
            payload: { edgeId: 'edge-1' }
          }
        ])
      })

      // Remove edge-1
      act(() => {
        commandCallback([{
          type: 'REMOVE_EDGE',
          payload: { id: 'edge-1' }
        }])
      })

      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.edges.has('edge-1')).toBe(false)
      expect(result.current.state.selectedEdgeIds.has('edge-1')).toBe(false)
      expect(result.current.state.hoveredEdgeId).toBeNull()
    })

    it('should process BATCH_ADD_EDGES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'BATCH_ADD_EDGES',
          payload: {
            edges: [
              { id: 'edge-1', source: 'node-1', target: 'node-2' },
              { id: 'edge-2', source: 'node-2', target: 'node-3' }
            ]
          }
        }])
      })

      expect(result.current.state.edges.size).toBe(2)
    })

    it('should process BATCH_UPDATE_EDGES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First add edges
      act(() => {
        commandCallback([{
          type: 'BATCH_ADD_EDGES',
          payload: {
            edges: [
              { id: 'edge-1', source: 'n1', target: 'n2' },
              { id: 'edge-2', source: 'n2', target: 'n3' },
              { id: 'edge-3', source: 'n3', target: 'n4' }
            ]
          }
        }])
      })

      // Update multiple edges
      act(() => {
        commandCallback([{
          type: 'BATCH_UPDATE_EDGES',
          payload: {
            updates: [
              { id: 'edge-1', updates: { label: 'Updated 1' } },
              { id: 'edge-2', updates: { label: 'Updated 2' } },
              { id: 'non-existent', updates: { label: 'Should not update' } }
            ]
          }
        }])
      })

      expect(result.current.state.edges.get('edge-1')?.label).toBe('Updated 1')
      expect(result.current.state.edges.get('edge-2')?.label).toBe('Updated 2')
      expect(result.current.state.edges.get('edge-3')?.label).toBeUndefined()
    })

    it('should process BATCH_REMOVE_EDGES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Setup edges with selections and hover
      act(() => {
        commandCallback([
          {
            type: 'BATCH_ADD_EDGES',
            payload: {
              edges: [
                { id: 'edge-1', source: 'n1', target: 'n2' },
                { id: 'edge-2', source: 'n2', target: 'n3' },
                { id: 'edge-3', source: 'n3', target: 'n4' }
              ]
            }
          },
          {
            type: 'SELECT_EDGES',
            payload: { edgeIds: ['edge-1', 'edge-2', 'edge-3'], mode: 'replace' }
          },
          {
            type: 'SET_HOVER_EDGE',
            payload: { edgeId: 'edge-2' }
          }
        ])
      })

      // Remove multiple edges
      act(() => {
        commandCallback([{
          type: 'BATCH_REMOVE_EDGES',
          payload: { ids: ['edge-1', 'edge-2'] }
        }])
      })

      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.edges.has('edge-3')).toBe(true)
      expect(result.current.state.selectedEdgeIds.size).toBe(1)
      expect(result.current.state.selectedEdgeIds.has('edge-3')).toBe(true)
      expect(result.current.state.hoveredEdgeId).toBeNull()
    })

    // Camera commands
    it('should process SET_CAMERA_POSITION command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'SET_CAMERA_POSITION',
          payload: { x: 50, y: 50, z: 50 }
        }])
      })

      expect(result.current.state.camera).toEqual({ x: 50, y: 50, z: 50 })
    })

    it('should process SET_ZOOM command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'SET_ZOOM',
          payload: { zoom: 2.5 }
        }])
      })

      expect(result.current.state.zoom).toBe(2.5)
    })

    it('should process FIT_TO_NODES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'FIT_TO_NODES',
          payload: { nodeIds: ['node-1', 'node-2'] }
        }])
      })

      // TODO: Should be implemented to calculate camera position
      expect(result.current).toBeDefined()
    })

    it('should process CENTER_ON_NODE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'CENTER_ON_NODE',
          payload: { nodeId: 'node-1' }
        }])
      })

      // TODO: Should be implemented to center camera on node
      expect(result.current).toBeDefined()
    })

    // Selection commands
    it('should process SELECT_NODES with replace mode', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add initial selection
      act(() => {
        commandCallback([{
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-1', 'node-2'], mode: 'replace' }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)

      // Replace selection
      act(() => {
        commandCallback([{
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-3'], mode: 'replace' }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(1)
      expect(result.current.state.selectedNodeIds.has('node-3')).toBe(true)
    })

    it('should process SELECT_NODES with add mode', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Initial selection
      act(() => {
        commandCallback([{
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-1'], mode: 'replace' }
        }])
      })

      // Add to selection
      act(() => {
        commandCallback([{
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-2', 'node-3'], mode: 'add' }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(3)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('node-2')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('node-3')).toBe(true)
    })

    it('should process SELECT_NODES with toggle mode', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Initial selection
      act(() => {
        commandCallback([{
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-1', 'node-2'], mode: 'replace' }
        }])
      })

      // Toggle selection
      act(() => {
        commandCallback([{
          type: 'SELECT_NODES',
          payload: { nodeIds: ['node-2', 'node-3'], mode: 'toggle' }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('node-2')).toBe(false)
      expect(result.current.state.selectedNodeIds.has('node-3')).toBe(true)
    })

    it('should process SELECT_EDGES with all modes', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Replace mode
      act(() => {
        commandCallback([{
          type: 'SELECT_EDGES',
          payload: { edgeIds: ['edge-1', 'edge-2'], mode: 'replace' }
        }])
      })

      expect(result.current.state.selectedEdgeIds.size).toBe(2)

      // Add mode
      act(() => {
        commandCallback([{
          type: 'SELECT_EDGES',
          payload: { edgeIds: ['edge-3'], mode: 'add' }
        }])
      })

      expect(result.current.state.selectedEdgeIds.size).toBe(3)

      // Toggle mode
      act(() => {
        commandCallback([{
          type: 'SELECT_EDGES',
          payload: { edgeIds: ['edge-2', 'edge-4'], mode: 'toggle' }
        }])
      })

      expect(result.current.state.selectedEdgeIds.size).toBe(3)
      expect(result.current.state.selectedEdgeIds.has('edge-2')).toBe(false)
      expect(result.current.state.selectedEdgeIds.has('edge-4')).toBe(true)
    })

    it('should process CLEAR_SELECTION command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add selections
      act(() => {
        commandCallback([
          {
            type: 'SELECT_NODES',
            payload: { nodeIds: ['node-1', 'node-2'], mode: 'replace' }
          },
          {
            type: 'SELECT_EDGES',
            payload: { edgeIds: ['edge-1', 'edge-2'], mode: 'replace' }
          }
        ])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)
      expect(result.current.state.selectedEdgeIds.size).toBe(2)

      // Clear all selections
      act(() => {
        commandCallback([{ type: 'CLEAR_SELECTION' }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(0)
      expect(result.current.state.selectedEdgeIds.size).toBe(0)
    })

    it('should process SET_HOVER_NODE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'SET_HOVER_NODE',
          payload: { nodeId: 'node-1' }
        }])
      })

      expect(result.current.state.hoveredNodeId).toBe('node-1')

      // Clear hover
      act(() => {
        commandCallback([{
          type: 'SET_HOVER_NODE',
          payload: { nodeId: null }
        }])
      })

      expect(result.current.state.hoveredNodeId).toBeNull()
    })

    it('should process SET_HOVER_EDGE command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'SET_HOVER_EDGE',
          payload: { edgeId: 'edge-1' }
        }])
      })

      expect(result.current.state.hoveredEdgeId).toBe('edge-1')
    })

    // Layout commands
    it('should process SET_LAYOUT command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'SET_LAYOUT',
          payload: { layout: 'radial' }
        }])
      })

      expect(result.current.state.layout).toBe('radial')
    })

    it('should process PAUSE_LAYOUT command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{ type: 'PAUSE_LAYOUT' }])
      })

      expect(result.current.state.layoutPaused).toBe(true)
    })

    it('should process RESUME_LAYOUT command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First pause
      act(() => {
        commandCallback([{ type: 'PAUSE_LAYOUT' }])
      })

      // Then resume
      act(() => {
        commandCallback([{ type: 'RESUME_LAYOUT' }])
      })

      expect(result.current.state.layoutPaused).toBe(false)
    })

    it('should process RESET_LAYOUT command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Pause layout first
      act(() => {
        commandCallback([{ type: 'PAUSE_LAYOUT' }])
      })

      // Reset layout
      act(() => {
        commandCallback([{ type: 'RESET_LAYOUT' }])
      })

      expect(result.current.state.layoutPaused).toBe(false)
    })

    // Theme commands
    it('should process SET_THEME command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'SET_THEME',
          payload: { 
            theme: 'dark',
            customTheme: undefined
          }
        }])
      })

      expect(result.current.state.theme).toBe('dark')
    })

    it('should process SET_THEME with custom theme', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      const customTheme = {
        backgroundColor: '#000',
        nodeColor: '#fff'
      }

      act(() => {
        commandCallback([{
          type: 'SET_THEME',
          payload: { 
            theme: 'custom',
            customTheme
          }
        }])
      })

      expect(result.current.state.theme).toBe('custom')
      expect(result.current.state.customTheme).toEqual(customTheme)
    })

    it('should process UPDATE_THEME_PROPERTY command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First set custom theme
      act(() => {
        commandCallback([{
          type: 'SET_THEME',
          payload: { 
            theme: 'custom',
            customTheme: { backgroundColor: '#000' }
          }
        }])
      })

      // Update theme property
      act(() => {
        commandCallback([{
          type: 'UPDATE_THEME_PROPERTY',
          payload: { 
            property: 'nodeColor',
            value: '#ff0000'
          }
        }])
      })

      expect(result.current.state.customTheme).toEqual({
        backgroundColor: '#000',
        nodeColor: '#ff0000'
      })
    })

    it('should ignore UPDATE_THEME_PROPERTY when not custom theme', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'UPDATE_THEME_PROPERTY',
          payload: { 
            property: 'nodeColor',
            value: '#ff0000'
          }
        }])
      })

      expect(result.current.state.customTheme).toBeUndefined()
    })

    // Highlight commands
    it('should process HIGHLIGHT_NODES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'HIGHLIGHT_NODES',
          payload: { 
            nodeIds: ['node-1', 'node-2'],
            color: '#ff0000',
            intensity: 0.8
          }
        }])
      })

      expect(result.current.state.highlightedNodes.size).toBe(2)
      expect(result.current.state.highlightedNodes.get('node-1')).toEqual({
        color: '#ff0000',
        intensity: 0.8
      })
    })

    it('should process HIGHLIGHT_EDGES command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([{
          type: 'HIGHLIGHT_EDGES',
          payload: { 
            edgeIds: ['edge-1', 'edge-2'],
            color: '#00ff00',
            intensity: 0.5
          }
        }])
      })

      expect(result.current.state.highlightedEdges.size).toBe(2)
      expect(result.current.state.highlightedEdges.get('edge-1')).toEqual({
        color: '#00ff00',
        intensity: 0.5
      })
    })

    it('should process CLEAR_HIGHLIGHTS command', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add highlights
      act(() => {
        commandCallback([
          {
            type: 'HIGHLIGHT_NODES',
            payload: { 
              nodeIds: ['node-1'],
              color: '#ff0000',
              intensity: 0.8
            }
          },
          {
            type: 'HIGHLIGHT_EDGES',
            payload: { 
              edgeIds: ['edge-1'],
              color: '#00ff00',
              intensity: 0.5
            }
          }
        ])
      })

      expect(result.current.state.highlightedNodes.size).toBe(1)
      expect(result.current.state.highlightedEdges.size).toBe(1)

      // Clear all highlights
      act(() => {
        commandCallback([{ type: 'CLEAR_HIGHLIGHTS' }])
      })

      expect(result.current.state.highlightedNodes.size).toBe(0)
      expect(result.current.state.highlightedEdges.size).toBe(0)
    })

    it('should process multiple commands in sequence', () => {
      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        commandCallback([
          {
            type: 'BATCH_ADD_NODES',
            payload: {
              nodes: [
                { id: 'node-1', label: 'Node 1' },
                { id: 'node-2', label: 'Node 2' }
              ]
            }
          },
          {
            type: 'ADD_EDGE',
            payload: {
              edge: { id: 'edge-1', source: 'node-1', target: 'node-2' }
            }
          },
          {
            type: 'SELECT_NODES',
            payload: { nodeIds: ['node-1'], mode: 'replace' }
          },
          {
            type: 'SET_THEME',
            payload: { theme: 'dark' }
          }
        ])
      })

      expect(result.current.state.nodes.size).toBe(2)
      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.selectedNodeIds.size).toBe(1)
      expect(result.current.state.theme).toBe('dark')
    })
  })
})