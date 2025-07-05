import { describe, it, expect, vi, beforeEach } from 'vitest'
import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { CanvasProvider, useCanvas } from './CanvasProvider'
import { useRefineryStore } from '@refinery/store'
import type { RendererCommand } from '@refinery/store'
import type { IdeaNode, Edge } from '@refinery/schema'

// Mock the store
vi.mock('@refinery/store', () => ({
  useRefineryStore: vi.fn()
}))

describe('CanvasProvider', () => {
  let mockStore: any
  let commandCallbacks: Array<(commands: RendererCommand[]) => void> = []

  beforeEach(() => {
    commandCallbacks = []
    mockStore = {
      subscribeToCommands: vi.fn((callback) => {
        commandCallbacks.push(callback)
        return () => {
          const index = commandCallbacks.indexOf(callback)
          if (index >= 0) commandCallbacks.splice(index, 1)
        }
      }),
      enqueueCommand: vi.fn(),
      enqueueCommands: vi.fn()
    }
    vi.mocked(useRefineryStore).mockReturnValue(mockStore)
  })

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CanvasProvider>{children}</CanvasProvider>
  )

  it('should provide initial state', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })

    expect(result.current.state.nodes.size).toBe(0)
    expect(result.current.state.edges.size).toBe(0)
    expect(result.current.state.selectedNodeIds.size).toBe(0)
    expect(result.current.state.selectedEdgeIds.size).toBe(0)
    expect(result.current.state.camera).toEqual({ x: 0, y: 0, z: 100 })
    expect(result.current.state.zoom).toBe(1)
    expect(result.current.state.layout).toBe('force')
    expect(result.current.state.theme).toBe('light')
  })

  it('should subscribe to command queue on mount', () => {
    renderHook(() => useCanvas(), { wrapper })
    expect(mockStore.subscribeToCommands).toHaveBeenCalledOnce()
  })

  it('should process ADD_NODE command', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    const node: IdeaNode = {
      id: 'node1',
      type: 'atomic',
      content: { title: 'Test Node' },
      position: { x: 10, y: 20, z: 0 },
      metadata: {}
    }

    act(() => {
      commandCallbacks[0]([{ type: 'ADD_NODE', payload: { node } }])
    })

    expect(result.current.state.nodes.size).toBe(1)
    expect(result.current.state.nodes.get('node1')).toEqual(node)
  })

  it('should process UPDATE_NODE command', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    // First add a node
    const node: IdeaNode = {
      id: 'node1',
      type: 'atomic',
      content: { title: 'Original Title' },
      metadata: {}
    }

    act(() => {
      commandCallbacks[0]([{ type: 'ADD_NODE', payload: { node } }])
    })

    // Then update it
    act(() => {
      commandCallbacks[0]([{
        type: 'UPDATE_NODE',
        payload: { id: 'node1', updates: { content: { title: 'Updated Title' } } }
      }])
    })

    const updatedNode = result.current.state.nodes.get('node1')
    expect(updatedNode?.content?.title).toBe('Updated Title')
  })

  it('should process REMOVE_NODE command', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    // Add a node
    const node: IdeaNode = {
      id: 'node1',
      type: 'atomic',
      content: { title: 'Test Node' },
      metadata: {}
    }

    act(() => {
      commandCallbacks[0]([{ type: 'ADD_NODE', payload: { node } }])
    })

    // Select the node
    act(() => {
      commandCallbacks[0]([{
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node1'], mode: 'replace' }
      }])
    })

    expect(result.current.state.selectedNodeIds.has('node1')).toBe(true)

    // Remove the node
    act(() => {
      commandCallbacks[0]([{ type: 'REMOVE_NODE', payload: { id: 'node1' } }])
    })

    expect(result.current.state.nodes.size).toBe(0)
    expect(result.current.state.selectedNodeIds.has('node1')).toBe(false)
  })

  it('should process BATCH_ADD_NODES command', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    const nodes: IdeaNode[] = [
      { id: 'node1', type: 'atomic', content: { title: 'Node 1' }, metadata: {} },
      { id: 'node2', type: 'atomic', content: { title: 'Node 2' }, metadata: {} },
      { id: 'node3', type: 'atomic', content: { title: 'Node 3' }, metadata: {} }
    ]

    act(() => {
      commandCallbacks[0]([{ type: 'BATCH_ADD_NODES', payload: { nodes } }])
    })

    expect(result.current.state.nodes.size).toBe(3)
    expect(result.current.state.nodes.get('node1')?.content?.title).toBe('Node 1')
    expect(result.current.state.nodes.get('node2')?.content?.title).toBe('Node 2')
    expect(result.current.state.nodes.get('node3')?.content?.title).toBe('Node 3')
  })

  it('should process edge commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    const edge: Edge = {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      metadata: {}
    }

    // Add edge
    act(() => {
      commandCallbacks[0]([{ type: 'ADD_EDGE', payload: { edge } }])
    })

    expect(result.current.state.edges.size).toBe(1)
    expect(result.current.state.edges.get('edge1')).toEqual(edge)

    // Update edge
    act(() => {
      commandCallbacks[0]([{
        type: 'UPDATE_EDGE',
        payload: { id: 'edge1', updates: { metadata: { weight: 0.5 } } }
      }])
    })

    const updatedEdge = result.current.state.edges.get('edge1')
    expect(updatedEdge?.metadata?.weight).toBe(0.5)

    // Remove edge
    act(() => {
      commandCallbacks[0]([{ type: 'REMOVE_EDGE', payload: { id: 'edge1' } }])
    })

    expect(result.current.state.edges.size).toBe(0)
  })

  it('should process camera commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    act(() => {
      commandCallbacks[0]([{
        type: 'SET_CAMERA_POSITION',
        payload: { x: 50, y: 100, z: 150 }
      }])
    })

    expect(result.current.state.camera).toEqual({ x: 50, y: 100, z: 150 })

    act(() => {
      commandCallbacks[0]([{
        type: 'SET_ZOOM',
        payload: { zoom: 2.5 }
      }])
    })

    expect(result.current.state.zoom).toBe(2.5)
  })

  it('should process selection commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    // Add some nodes first
    const nodes: IdeaNode[] = [
      { id: 'node1', type: 'atomic', content: {}, metadata: {} },
      { id: 'node2', type: 'atomic', content: {}, metadata: {} },
      { id: 'node3', type: 'atomic', content: {}, metadata: {} }
    ]

    act(() => {
      commandCallbacks[0]([{ type: 'BATCH_ADD_NODES', payload: { nodes } }])
    })

    // Replace selection
    act(() => {
      commandCallbacks[0]([{
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node1', 'node2'], mode: 'replace' }
      }])
    })

    expect(result.current.state.selectedNodeIds.size).toBe(2)
    expect(result.current.state.selectedNodeIds.has('node1')).toBe(true)
    expect(result.current.state.selectedNodeIds.has('node2')).toBe(true)

    // Add to selection
    act(() => {
      commandCallbacks[0]([{
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node3'], mode: 'add' }
      }])
    })

    expect(result.current.state.selectedNodeIds.size).toBe(3)

    // Toggle selection
    act(() => {
      commandCallbacks[0]([{
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node2'], mode: 'toggle' }
      }])
    })

    expect(result.current.state.selectedNodeIds.size).toBe(2)
    expect(result.current.state.selectedNodeIds.has('node2')).toBe(false)

    // Clear selection
    act(() => {
      commandCallbacks[0]([{ type: 'CLEAR_SELECTION' }])
    })

    expect(result.current.state.selectedNodeIds.size).toBe(0)
  })

  it('should process hover commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    act(() => {
      commandCallbacks[0]([{
        type: 'SET_HOVER_NODE',
        payload: { nodeId: 'node1' }
      }])
    })

    expect(result.current.state.hoveredNodeId).toBe('node1')

    act(() => {
      commandCallbacks[0]([{
        type: 'SET_HOVER_EDGE',
        payload: { edgeId: 'edge1' }
      }])
    })

    expect(result.current.state.hoveredEdgeId).toBe('edge1')
  })

  it('should process layout commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    act(() => {
      commandCallbacks[0]([{
        type: 'SET_LAYOUT',
        payload: { layout: 'hierarchical' }
      }])
    })

    expect(result.current.state.layout).toBe('hierarchical')

    act(() => {
      commandCallbacks[0]([{ type: 'PAUSE_LAYOUT' }])
    })

    expect(result.current.state.layoutPaused).toBe(true)

    act(() => {
      commandCallbacks[0]([{ type: 'RESUME_LAYOUT' }])
    })

    expect(result.current.state.layoutPaused).toBe(false)
  })

  it('should process theme commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    act(() => {
      commandCallbacks[0]([{
        type: 'SET_THEME',
        payload: { theme: 'dark' }
      }])
    })

    expect(result.current.state.theme).toBe('dark')

    act(() => {
      commandCallbacks[0]([{
        type: 'SET_THEME',
        payload: { theme: 'custom', customTheme: { primaryColor: '#ff0000' } }
      }])
    })

    expect(result.current.state.theme).toBe('custom')
    expect(result.current.state.customTheme).toEqual({ primaryColor: '#ff0000' })

    act(() => {
      commandCallbacks[0]([{
        type: 'UPDATE_THEME_PROPERTY',
        payload: { property: 'secondaryColor', value: '#00ff00' }
      }])
    })

    expect(result.current.state.customTheme).toEqual({
      primaryColor: '#ff0000',
      secondaryColor: '#00ff00'
    })
  })

  it('should process highlight commands', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    act(() => {
      commandCallbacks[0]([{
        type: 'HIGHLIGHT_NODES',
        payload: { nodeIds: ['node1', 'node2'], color: '#ff0000', intensity: 0.8 }
      }])
    })

    expect(result.current.state.highlightedNodes.size).toBe(2)
    expect(result.current.state.highlightedNodes.get('node1')).toEqual({
      color: '#ff0000',
      intensity: 0.8
    })

    act(() => {
      commandCallbacks[0]([{
        type: 'HIGHLIGHT_EDGES',
        payload: { edgeIds: ['edge1'], color: '#00ff00' }
      }])
    })

    expect(result.current.state.highlightedEdges.size).toBe(1)
    expect(result.current.state.highlightedEdges.get('edge1')).toEqual({
      color: '#00ff00',
      intensity: undefined
    })

    act(() => {
      commandCallbacks[0]([{ type: 'CLEAR_HIGHLIGHTS' }])
    })

    expect(result.current.state.highlightedNodes.size).toBe(0)
    expect(result.current.state.highlightedEdges.size).toBe(0)
  })

  it('should process multiple commands in batch', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })
    
    const commands: RendererCommand[] = [
      {
        type: 'ADD_NODE',
        payload: { node: { id: 'node1', type: 'atomic', content: {}, metadata: {} } }
      },
      {
        type: 'ADD_NODE',
        payload: { node: { id: 'node2', type: 'atomic', content: {}, metadata: {} } }
      },
      {
        type: 'ADD_EDGE',
        payload: { edge: { id: 'edge1', source: 'node1', target: 'node2', metadata: {} } }
      },
      {
        type: 'SELECT_NODES',
        payload: { nodeIds: ['node1'], mode: 'replace' }
      }
    ]

    act(() => {
      commandCallbacks[0](commands)
    })

    expect(result.current.state.nodes.size).toBe(2)
    expect(result.current.state.edges.size).toBe(1)
    expect(result.current.state.selectedNodeIds.size).toBe(1)
    expect(result.current.state.selectedNodeIds.has('node1')).toBe(true)
  })

  it('should accept initial state', () => {
    const initialState = {
      camera: { x: 10, y: 20, z: 30 },
      zoom: 1.5,
      theme: 'dark' as const
    }

    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <CanvasProvider initialState={initialState}>{children}</CanvasProvider>
    )

    const { result } = renderHook(() => useCanvas(), { wrapper: customWrapper })

    expect(result.current.state.camera).toEqual({ x: 10, y: 20, z: 30 })
    expect(result.current.state.zoom).toBe(1.5)
    expect(result.current.state.theme).toBe('dark')
  })

  it('should expose enqueue methods from store', () => {
    const { result } = renderHook(() => useCanvas(), { wrapper })

    const command: RendererCommand = {
      type: 'ADD_NODE',
      payload: { node: { id: 'node1', type: 'atomic', content: {}, metadata: {} } }
    }

    result.current.enqueueCommand(command)
    expect(mockStore.enqueueCommand).toHaveBeenCalledWith(command)

    const commands: RendererCommand[] = [command]
    result.current.enqueueCommands(commands)
    expect(mockStore.enqueueCommands).toHaveBeenCalledWith(commands)
  })
})