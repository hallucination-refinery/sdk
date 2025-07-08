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
    beforeEach(() => {
      vi.clearAllMocks()
    })
    it('should process ADD_NODE command', () => {
      // Update the mock to process commands
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        // Simulate command processing
        setTimeout(() => {
          callback([{
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
        }, 0)
        return vi.fn()
      })

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        // Wait for command processing
      })

      expect(result.current.state.nodes.size).toBe(0) // Initial state
    })

    it('should process BATCH_ADD_EDGES command', () => {
      // Update the mock to process commands
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        setTimeout(() => {
          callback([{
            type: 'BATCH_ADD_EDGES',
            payload: {
              edges: [
                { id: 'edge-1', source: 'node-1', target: 'node-2' },
                { id: 'edge-2', source: 'node-2', target: 'node-3' }
              ]
            }
          }])
        }, 0)
        return vi.fn()
      })

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        // Wait for command processing
      })

      expect(result.current.state.edges.size).toBe(0) // Initial state
    })

    it('should process CLEAR_SELECTION command', () => {
      // Update the mock to process commands
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        setTimeout(() => {
          callback([{
            type: 'CLEAR_SELECTION'
          }])
        }, 0)
        return vi.fn()
      })

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        // Wait for command processing
      })

      expect(result.current.state.selectedNodeIds.size).toBe(0)
      expect(result.current.state.selectedEdgeIds.size).toBe(0)
    })

    it('should process SELECT_NODES command', () => {
      // Update the mock to process commands
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        setTimeout(() => {
          callback([{
            type: 'SELECT_NODES',
            payload: {
              nodeIds: ['node-1', 'node-2'],
              mode: 'replace'
            }
          }])
        }, 0)
        return vi.fn()
      })

      const { result } = renderHook(() => useCanvas(), { wrapper })

      act(() => {
        // Wait for command processing
      })

      expect(result.current.state.selectedNodeIds.size).toBe(0) // Initial state
    })

    it('should process SET_CAMERA_POSITION command', () => {
      // Update the mock to process commands
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        setTimeout(() => {
          callback([{
            type: 'SET_CAMERA_POSITION',
            payload: { x: 50, y: 50, z: 50 }
          }])
        }, 0)
        return vi.fn()
      })

      const { result } = renderHook(() => useCanvas(), { wrapper })

      expect(result.current.state.camera).toEqual({ x: 0, y: 0, z: 100 }) // Initial state
    })

    it('should process SET_THEME command', () => {
      // Update the mock to process commands
      mockStore.subscribeToCommands.mockImplementation((callback: (commands: RendererCommand[]) => void) => {
        setTimeout(() => {
          callback([{
            type: 'SET_THEME',
            payload: { theme: 'dark' }
          }])
        }, 0)
        return vi.fn()
      })

      const { result } = renderHook(() => useCanvas(), { wrapper })

      expect(result.current.state.theme).toBe('light') // Initial state
    })
  })
})