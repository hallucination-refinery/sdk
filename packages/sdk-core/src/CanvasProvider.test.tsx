import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { CanvasProvider, useCanvas } from './CanvasProvider'
import type { RendererCommand } from '@refinery/store'
import { useRefineryStore } from '@refinery/store'

// Mock @refinery/store
vi.mock('@refinery/store', () => ({
  useRefineryStore: vi.fn(() => ({
    enqueueCommand: vi.fn(),
    enqueueCommands: vi.fn(),
    subscribeToCommands: vi.fn(() => vi.fn())
  }))
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
    it('should process ADD_NODE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      expect(result.current.state.nodes.size).toBe(0)

      act(() => {
        subscribeCallback!([{
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
      expect(result.current.state.nodes.get('node-1')).toMatchObject({
        id: 'node-1',
        label: 'Test Node'
      })
    })

    it('should process UPDATE_NODE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First add a node
      act(() => {
        subscribeCallback!([{
          type: 'ADD_NODE',
          payload: {
            node: {
              id: 'node-1',
              label: 'Original Label',
              position: { x: 0, y: 0, z: 0 }
            }
          }
        }])
      })

      expect(result.current.state.nodes.get('node-1')?.label).toBe('Original Label')

      // Then update it
      act(() => {
        subscribeCallback!([{
          type: 'UPDATE_NODE',
          payload: {
            id: 'node-1',
            updates: { label: 'Updated Label' }
          }
        }])
      })

      expect(result.current.state.nodes.get('node-1')?.label).toBe('Updated Label')
    })

    it('should not update non-existent node', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'UPDATE_NODE',
          payload: {
            id: 'non-existent',
            updates: { label: 'Updated Label' }
          }
        }])
      })

      expect(result.current.state.nodes.size).toBe(0)
    })

    it('should process REMOVE_NODE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add a node and select it
      act(() => {
        subscribeCallback!([
          {
            type: 'ADD_NODE',
            payload: {
              node: {
                id: 'node-1',
                label: 'Test Node',
                position: { x: 0, y: 0, z: 0 }
              }
            }
          },
          {
            type: 'SELECT_NODES',
            payload: {
              nodeIds: ['node-1'],
              mode: 'replace'
            }
          },
          {
            type: 'SET_HOVER_NODE',
            payload: { nodeId: 'node-1' }
          }
        ])
      })

      expect(result.current.state.nodes.size).toBe(1)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(true)
      expect(result.current.state.hoveredNodeId).toBe('node-1')

      // Remove the node
      act(() => {
        subscribeCallback!([{
          type: 'REMOVE_NODE',
          payload: { id: 'node-1' }
        }])
      })

      expect(result.current.state.nodes.size).toBe(0)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(false)
      expect(result.current.state.hoveredNodeId).toBe(null)
    })

    it('should process BATCH_ADD_NODES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'BATCH_ADD_NODES',
          payload: {
            nodes: [
              { id: 'node-1', label: 'Node 1', position: { x: 0, y: 0, z: 0 } },
              { id: 'node-2', label: 'Node 2', position: { x: 10, y: 10, z: 0 } },
              { id: 'node-3', label: 'Node 3', position: { x: 20, y: 20, z: 0 } }
            ]
          }
        }])
      })

      expect(result.current.state.nodes.size).toBe(3)
      expect(result.current.state.nodes.get('node-1')?.label).toBe('Node 1')
      expect(result.current.state.nodes.get('node-2')?.label).toBe('Node 2')
      expect(result.current.state.nodes.get('node-3')?.label).toBe('Node 3')
    })

    it('should process BATCH_UPDATE_NODES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First add some nodes
      act(() => {
        subscribeCallback!([{
          type: 'BATCH_ADD_NODES',
          payload: {
            nodes: [
              { id: 'node-1', label: 'Old 1', position: { x: 0, y: 0, z: 0 } },
              { id: 'node-2', label: 'Old 2', position: { x: 10, y: 10, z: 0 } }
            ]
          }
        }])
      })

      // Then batch update them
      act(() => {
        subscribeCallback!([{
          type: 'BATCH_UPDATE_NODES',
          payload: {
            updates: [
              { id: 'node-1', updates: { label: 'New 1' } },
              { id: 'node-2', updates: { label: 'New 2' } },
              { id: 'node-3', updates: { label: 'Should not exist' } } // Non-existent node
            ]
          }
        }])
      })

      expect(result.current.state.nodes.get('node-1')?.label).toBe('New 1')
      expect(result.current.state.nodes.get('node-2')?.label).toBe('New 2')
      expect(result.current.state.nodes.has('node-3')).toBe(false)
    })

    it('should process BATCH_REMOVE_NODES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add nodes, select them, and hover one
      act(() => {
        subscribeCallback!([
          {
            type: 'BATCH_ADD_NODES',
            payload: {
              nodes: [
                { id: 'node-1', label: 'Node 1', position: { x: 0, y: 0, z: 0 } },
                { id: 'node-2', label: 'Node 2', position: { x: 10, y: 10, z: 0 } },
                { id: 'node-3', label: 'Node 3', position: { x: 20, y: 20, z: 0 } }
              ]
            }
          },
          {
            type: 'SELECT_NODES',
            payload: {
              nodeIds: ['node-1', 'node-2'],
              mode: 'replace'
            }
          },
          {
            type: 'SET_HOVER_NODE',
            payload: { nodeId: 'node-2' }
          }
        ])
      })

      expect(result.current.state.nodes.size).toBe(3)
      expect(result.current.state.selectedNodeIds.size).toBe(2)
      expect(result.current.state.hoveredNodeId).toBe('node-2')

      // Batch remove nodes
      act(() => {
        subscribeCallback!([{
          type: 'BATCH_REMOVE_NODES',
          payload: { ids: ['node-1', 'node-2'] }
        }])
      })

      expect(result.current.state.nodes.size).toBe(1)
      expect(result.current.state.nodes.has('node-3')).toBe(true)
      expect(result.current.state.selectedNodeIds.size).toBe(0)
      expect(result.current.state.hoveredNodeId).toBe(null)
    })

    // Edge commands
    it('should process ADD_EDGE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'ADD_EDGE',
          payload: {
            edge: {
              id: 'edge-1',
              source: 'node-1',
              target: 'node-2'
            }
          }
        }])
      })

      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.edges.get('edge-1')).toMatchObject({
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      })
    })

    it('should process UPDATE_EDGE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add an edge
      act(() => {
        subscribeCallback!([{
          type: 'ADD_EDGE',
          payload: {
            edge: {
              id: 'edge-1',
              source: 'node-1',
              target: 'node-2',
              label: 'Original'
            }
          }
        }])
      })

      // Update it
      act(() => {
        subscribeCallback!([{
          type: 'UPDATE_EDGE',
          payload: {
            id: 'edge-1',
            updates: { label: 'Updated' }
          }
        }])
      })

      expect(result.current.state.edges.get('edge-1')?.label).toBe('Updated')

      // Try to update non-existent edge
      act(() => {
        subscribeCallback!([{
          type: 'UPDATE_EDGE',
          payload: {
            id: 'non-existent',
            updates: { label: 'Should not work' }
          }
        }])
      })

      expect(result.current.state.edges.size).toBe(1)
    })

    it('should process REMOVE_EDGE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add edge, select it, and hover it
      act(() => {
        subscribeCallback!([
          {
            type: 'ADD_EDGE',
            payload: {
              edge: {
                id: 'edge-1',
                source: 'node-1',
                target: 'node-2'
              }
            }
          },
          {
            type: 'SELECT_EDGES',
            payload: {
              edgeIds: ['edge-1'],
              mode: 'replace'
            }
          },
          {
            type: 'SET_HOVER_EDGE',
            payload: { edgeId: 'edge-1' }
          }
        ])
      })

      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.selectedEdgeIds.has('edge-1')).toBe(true)
      expect(result.current.state.hoveredEdgeId).toBe('edge-1')

      // Remove the edge
      act(() => {
        subscribeCallback!([{
          type: 'REMOVE_EDGE',
          payload: { id: 'edge-1' }
        }])
      })

      expect(result.current.state.edges.size).toBe(0)
      expect(result.current.state.selectedEdgeIds.has('edge-1')).toBe(false)
      expect(result.current.state.hoveredEdgeId).toBe(null)
    })

    it('should process BATCH_ADD_EDGES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'BATCH_ADD_EDGES',
          payload: {
            edges: [
              { id: 'edge-1', source: 'node-1', target: 'node-2' },
              { id: 'edge-2', source: 'node-2', target: 'node-3' },
              { id: 'edge-3', source: 'node-3', target: 'node-1' }
            ]
          }
        }])
      })

      expect(result.current.state.edges.size).toBe(3)
      expect(result.current.state.edges.get('edge-1')?.source).toBe('node-1')
      expect(result.current.state.edges.get('edge-2')?.source).toBe('node-2')
      expect(result.current.state.edges.get('edge-3')?.source).toBe('node-3')
    })

    it('should process BATCH_UPDATE_EDGES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add edges
      act(() => {
        subscribeCallback!([{
          type: 'BATCH_ADD_EDGES',
          payload: {
            edges: [
              { id: 'edge-1', source: 'node-1', target: 'node-2', label: 'Old 1' },
              { id: 'edge-2', source: 'node-2', target: 'node-3', label: 'Old 2' }
            ]
          }
        }])
      })

      // Update them
      act(() => {
        subscribeCallback!([{
          type: 'BATCH_UPDATE_EDGES',
          payload: {
            updates: [
              { id: 'edge-1', updates: { label: 'New 1' } },
              { id: 'edge-2', updates: { label: 'New 2' } },
              { id: 'edge-3', updates: { label: 'Should not exist' } } // Non-existent edge
            ]
          }
        }])
      })

      expect(result.current.state.edges.get('edge-1')?.label).toBe('New 1')
      expect(result.current.state.edges.get('edge-2')?.label).toBe('New 2')
      expect(result.current.state.edges.has('edge-3')).toBe(false)
    })

    it('should process BATCH_REMOVE_EDGES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add edges, select them, and hover one
      act(() => {
        subscribeCallback!([
          {
            type: 'BATCH_ADD_EDGES',
            payload: {
              edges: [
                { id: 'edge-1', source: 'node-1', target: 'node-2' },
                { id: 'edge-2', source: 'node-2', target: 'node-3' },
                { id: 'edge-3', source: 'node-3', target: 'node-1' }
              ]
            }
          },
          {
            type: 'SELECT_EDGES',
            payload: {
              edgeIds: ['edge-1', 'edge-2'],
              mode: 'replace'
            }
          },
          {
            type: 'SET_HOVER_EDGE',
            payload: { edgeId: 'edge-2' }
          }
        ])
      })

      expect(result.current.state.edges.size).toBe(3)
      expect(result.current.state.selectedEdgeIds.size).toBe(2)
      expect(result.current.state.hoveredEdgeId).toBe('edge-2')

      // Batch remove edges
      act(() => {
        subscribeCallback!([{
          type: 'BATCH_REMOVE_EDGES',
          payload: { ids: ['edge-1', 'edge-2'] }
        }])
      })

      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.edges.has('edge-3')).toBe(true)
      expect(result.current.state.selectedEdgeIds.size).toBe(0)
      expect(result.current.state.hoveredEdgeId).toBe(null)
    })

    // Camera commands
    it('should process SET_CAMERA_POSITION command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'SET_CAMERA_POSITION',
          payload: { x: 50, y: 50, z: 50 }
        }])
      })

      expect(result.current.state.camera).toEqual({ x: 50, y: 50, z: 50 })
    })

    it('should process SET_ZOOM command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'SET_ZOOM',
          payload: { zoom: 2.5 }
        }])
      })

      expect(result.current.state.zoom).toBe(2.5)
    })

    it('should process FIT_TO_NODES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'FIT_TO_NODES',
          payload: { nodeIds: ['node-1', 'node-2'] }
        }])
      })

      // Since FIT_TO_NODES is a TODO, state should remain unchanged
      expect(result.current.state.camera).toEqual({ x: 0, y: 0, z: 100 })
    })

    it('should process CENTER_ON_NODE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'CENTER_ON_NODE',
          payload: { nodeId: 'node-1' }
        }])
      })

      // Since CENTER_ON_NODE is a TODO, state should remain unchanged
      expect(result.current.state.camera).toEqual({ x: 0, y: 0, z: 100 })
    })

    // Selection commands
    it('should process SELECT_NODES command with replace mode', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add some initial selection
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_NODES',
          payload: {
            nodeIds: ['old-1', 'old-2'],
            mode: 'replace'
          }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)

      // Replace selection
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_NODES',
          payload: {
            nodeIds: ['node-1', 'node-2'],
            mode: 'replace'
          }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('node-2')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('old-1')).toBe(false)
    })

    it('should process SELECT_NODES command with add mode', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add initial selection
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_NODES',
          payload: {
            nodeIds: ['node-1'],
            mode: 'replace'
          }
        }])
      })

      // Add more nodes
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_NODES',
          payload: {
            nodeIds: ['node-2', 'node-3'],
            mode: 'add'
          }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(3)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('node-2')).toBe(true)
      expect(result.current.state.selectedNodeIds.has('node-3')).toBe(true)
    })

    it('should process SELECT_NODES command with toggle mode', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add initial selection
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_NODES',
          payload: {
            nodeIds: ['node-1', 'node-2'],
            mode: 'replace'
          }
        }])
      })

      // Toggle nodes
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_NODES',
          payload: {
            nodeIds: ['node-1', 'node-3'],
            mode: 'toggle'
          }
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(false) // Toggled off
      expect(result.current.state.selectedNodeIds.has('node-2')).toBe(true)  // Unchanged
      expect(result.current.state.selectedNodeIds.has('node-3')).toBe(true)  // Toggled on
    })

    it('should process SELECT_EDGES command with all modes', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Replace mode
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_EDGES',
          payload: {
            edgeIds: ['edge-1', 'edge-2'],
            mode: 'replace'
          }
        }])
      })

      expect(result.current.state.selectedEdgeIds.size).toBe(2)

      // Add mode
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_EDGES',
          payload: {
            edgeIds: ['edge-3'],
            mode: 'add'
          }
        }])
      })

      expect(result.current.state.selectedEdgeIds.size).toBe(3)

      // Toggle mode
      act(() => {
        subscribeCallback!([{
          type: 'SELECT_EDGES',
          payload: {
            edgeIds: ['edge-2', 'edge-4'],
            mode: 'toggle'
          }
        }])
      })

      expect(result.current.state.selectedEdgeIds.size).toBe(3)
      expect(result.current.state.selectedEdgeIds.has('edge-1')).toBe(true)
      expect(result.current.state.selectedEdgeIds.has('edge-2')).toBe(false) // Toggled off
      expect(result.current.state.selectedEdgeIds.has('edge-3')).toBe(true)
      expect(result.current.state.selectedEdgeIds.has('edge-4')).toBe(true)  // Toggled on
    })

    it('should process CLEAR_SELECTION command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add selections
      act(() => {
        subscribeCallback!([
          {
            type: 'SELECT_NODES',
            payload: {
              nodeIds: ['node-1', 'node-2'],
              mode: 'replace'
            }
          },
          {
            type: 'SELECT_EDGES',
            payload: {
              edgeIds: ['edge-1', 'edge-2'],
              mode: 'replace'
            }
          }
        ])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(2)
      expect(result.current.state.selectedEdgeIds.size).toBe(2)

      // Clear selection
      act(() => {
        subscribeCallback!([{
          type: 'CLEAR_SELECTION'
        }])
      })

      expect(result.current.state.selectedNodeIds.size).toBe(0)
      expect(result.current.state.selectedEdgeIds.size).toBe(0)
    })

    it('should process SET_HOVER_NODE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'SET_HOVER_NODE',
          payload: { nodeId: 'node-1' }
        }])
      })

      expect(result.current.state.hoveredNodeId).toBe('node-1')

      act(() => {
        subscribeCallback!([{
          type: 'SET_HOVER_NODE',
          payload: { nodeId: null }
        }])
      })

      expect(result.current.state.hoveredNodeId).toBe(null)
    })

    it('should process SET_HOVER_EDGE command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'SET_HOVER_EDGE',
          payload: { edgeId: 'edge-1' }
        }])
      })

      expect(result.current.state.hoveredEdgeId).toBe('edge-1')
    })

    // Layout commands
    it('should process SET_LAYOUT command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'SET_LAYOUT',
          payload: { layout: 'radial' }
        }])
      })

      expect(result.current.state.layout).toBe('radial')
    })

    it('should process PAUSE_LAYOUT command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'PAUSE_LAYOUT'
        }])
      })

      expect(result.current.state.layoutPaused).toBe(true)
    })

    it('should process RESUME_LAYOUT command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First pause
      act(() => {
        subscribeCallback!([{
          type: 'PAUSE_LAYOUT'
        }])
      })

      expect(result.current.state.layoutPaused).toBe(true)

      // Then resume
      act(() => {
        subscribeCallback!([{
          type: 'RESUME_LAYOUT'
        }])
      })

      expect(result.current.state.layoutPaused).toBe(false)
    })

    it('should process RESET_LAYOUT command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // First pause
      act(() => {
        subscribeCallback!([{
          type: 'PAUSE_LAYOUT'
        }])
      })

      // Then reset
      act(() => {
        subscribeCallback!([{
          type: 'RESET_LAYOUT'
        }])
      })

      expect(result.current.state.layoutPaused).toBe(false)
    })

    // Theme commands
    it('should process SET_THEME command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
          type: 'SET_THEME',
          payload: { 
            theme: 'custom',
            customTheme: { background: '#000000' }
          }
        }])
      })

      expect(result.current.state.theme).toBe('custom')
      expect(result.current.state.customTheme).toEqual({ background: '#000000' })
    })

    it('should process UPDATE_THEME_PROPERTY command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Set custom theme first
      act(() => {
        subscribeCallback!([{
          type: 'SET_THEME',
          payload: { 
            theme: 'custom',
            customTheme: { background: '#000000' }
          }
        }])
      })

      // Update theme property
      act(() => {
        subscribeCallback!([{
          type: 'UPDATE_THEME_PROPERTY',
          payload: { 
            property: 'background',
            value: '#ffffff'
          }
        }])
      })

      expect(result.current.state.customTheme.background).toBe('#ffffff')

      // Try to update when not custom theme
      act(() => {
        subscribeCallback!([{
          type: 'SET_THEME',
          payload: { theme: 'light' }
        }])
      })

      act(() => {
        subscribeCallback!([{
          type: 'UPDATE_THEME_PROPERTY',
          payload: { 
            property: 'background',
            value: '#ff0000'
          }
        }])
      })

      // Should not update
      expect(result.current.state.customTheme).toBeUndefined()
    })

    // Highlight commands
    it('should process HIGHLIGHT_NODES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
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
      expect(result.current.state.highlightedNodes.get('node-2')).toEqual({
        color: '#ff0000',
        intensity: 0.8
      })
    })

    it('should process HIGHLIGHT_EDGES command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([{
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

    it('should process CLEAR_HIGHLIGHTS command', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      // Add highlights
      act(() => {
        subscribeCallback!([
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

      // Clear highlights
      act(() => {
        subscribeCallback!([{
          type: 'CLEAR_HIGHLIGHTS'
        }])
      })

      expect(result.current.state.highlightedNodes.size).toBe(0)
      expect(result.current.state.highlightedEdges.size).toBe(0)
    })

    it('should process multiple commands in sequence', async () => {
      let subscribeCallback: (commands: RendererCommand[]) => void
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn((callback: (commands: RendererCommand[]) => void) => {
          subscribeCallback = callback
          return vi.fn()
        })
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        subscribeCallback!([
          {
            type: 'ADD_NODE',
            payload: {
              node: { id: 'node-1', label: 'Node 1', position: { x: 0, y: 0, z: 0 } }
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

      expect(result.current.state.nodes.size).toBe(1)
      expect(result.current.state.edges.size).toBe(1)
      expect(result.current.state.selectedNodeIds.has('node-1')).toBe(true)
      expect(result.current.state.theme).toBe('dark')
    })
  })

  describe('Subscription cleanup', () => {
    it('should unsubscribe on unmount', () => {
      const unsubscribeMock = vi.fn()
      const mockStore = {
        enqueueCommand: vi.fn(),
        enqueueCommands: vi.fn(),
        subscribeToCommands: vi.fn(() => unsubscribeMock)
      }

      vi.mocked(useRefineryStore).mockReturnValue(mockStore)

      const { unmount } = renderHook(() => useCanvas(), { wrapper })

      expect(mockStore.subscribeToCommands).toHaveBeenCalledTimes(1)
      expect(unsubscribeMock).not.toHaveBeenCalled()

      unmount()

      expect(unsubscribeMock).toHaveBeenCalledTimes(1)
    })
  })
})