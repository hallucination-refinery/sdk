import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Animus } from './Animus'
import { CanvasProvider, useCanvas } from './CanvasProvider'

// Mock canvas context
const mockCanvasState = {
  nodes: new Map(),
  edges: new Map(),
  selectedNodeIds: new Set<string>(),
  selectedEdgeIds: new Set<string>(),
  hoveredNodeId: null,
  hoveredEdgeId: null,
  camera: { x: 0, y: 0, z: 100 },
  zoom: 1,
  layout: 'force' as const,
  layoutPaused: false,
  theme: 'light' as 'light' | 'dark' | 'custom',
  customTheme: undefined,
  highlightedNodes: new Map(),
  highlightedEdges: new Map()
}

const mockEnqueueCommand = vi.fn()
const mockEnqueueCommands = vi.fn()

vi.mock('./CanvasProvider', () => ({
  useCanvas: vi.fn(() => ({
    state: mockCanvasState,
    enqueueCommand: mockEnqueueCommand,
    enqueueCommands: mockEnqueueCommands
  })),
  CanvasProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// Mock React Three Fiber Canvas to render a div
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => <div data-testid="three-canvas" {...props}>{children}</div>,
  useThree: vi.fn(() => ({
    camera: {
      position: { x: 0, y: 0, z: 100, set: vi.fn() },
      zoom: 1,
      updateProjectionMatrix: vi.fn()
    }
  })),
  useFrame: vi.fn()
}))

// Mock Scene component to avoid canvas creation issues
vi.mock('./Scene', () => ({
  Scene: ({ nodes, edges }: any) => {
    const React = require('react')
    return React.createElement('div', { 'data-testid': 'mock-scene' }, [
      React.createElement('ambientLight', { key: 'ambient', intensity: 0.5 }),
      React.createElement('directionalLight', { key: 'directional', position: [10, 10, 5], intensity: 1 })
    ])
  }
}))

describe('Animus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  it('should render with default props', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toBeInTheDocument()
    // Check parent div has correct dimensions
    const parent = canvas.parentElement
    expect(parent).toHaveStyle({ width: '100%', height: '100vh' })
  })

  it('should accept custom dimensions', () => {
    render(
      <CanvasProvider>
        <Animus width="800px" height="600px" />
      </CanvasProvider>
    )

    const container = screen.getByTestId('three-canvas').parentElement
    expect(container).toHaveStyle({ width: '800px', height: '600px' })
  })

  it('should apply custom className', () => {
    render(
      <CanvasProvider>
        <Animus className="custom-canvas" />
      </CanvasProvider>
    )

    const container = screen.getByTestId('three-canvas').parentElement
    expect(container).toHaveClass('custom-canvas')
  })

  it('should apply theme background color', () => {
    // Test light theme
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    let canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#f5f5f5' })

    // Test dark theme
    mockCanvasState.theme = 'dark'
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    canvas = screen.getAllByTestId('three-canvas')[1]
    expect(canvas).toHaveStyle({ background: '#1a1a1a' })
  })

  it('should render Stats component when showStats is true', () => {
    render(
      <CanvasProvider>
        <Animus showStats={true} />
      </CanvasProvider>
    )

    // Stats component is mocked, check if our mock was called
    const statsElements = screen.queryAllByTestId('mock-stats')
    expect(statsElements.length).toBeGreaterThan(0)
  })

  it('should not render Stats component when showStats is false', () => {
    render(
      <CanvasProvider>
        <Animus showStats={false} />
      </CanvasProvider>
    )

    const statsElements = screen.queryAllByTestId('mock-stats')
    expect(statsElements.length).toBe(0)
  })

  describe('Canvas interactions', () => {
    it('should handle canvas click to clear selection', () => {
      mockEnqueueCommand.mockClear()

      render(
        <CanvasProvider>
          <Animus />
        </CanvasProvider>
      )

      const canvas = screen.getByTestId('three-canvas')
      canvas.click()

      expect(mockEnqueueCommand).toHaveBeenCalledWith({ type: 'CLEAR_SELECTION' })
    })
  })

  describe('Scene interactions', () => {
    it('should render with nodes', () => {
      // Add nodes to the mock state
      mockCanvasState.nodes.set('node-1', { id: 'node-1', label: 'Test Node' })

      render(
        <CanvasProvider>
          <Animus />
        </CanvasProvider>
      )

      // Scene component would handle the actual click, we're testing that canvas renders
      expect(screen.getByTestId('three-canvas')).toBeInTheDocument()

      // Clean up
      mockCanvasState.nodes.clear()
    })

    it('should render lighting elements', () => {
      const { container } = render(
        <CanvasProvider>
          <Animus />
        </CanvasProvider>
      )

      // Check that Scene is rendered with lighting
      expect(container.querySelector('ambientLight')).toBeInTheDocument()
      expect(container.querySelector('directionalLight')).toBeInTheDocument()
    })
  })

  describe('Camera controls', () => {
    it('should render with custom camera position', () => {
      // Set custom camera position
      const originalCamera = mockCanvasState.camera
      mockCanvasState.camera = { x: 10, y: 20, z: 30 }
      mockCanvasState.zoom = 1.5

      render(
        <CanvasProvider>
          <Animus />
        </CanvasProvider>
      )

      // Canvas should render with custom camera settings
      expect(screen.getByTestId('three-canvas')).toBeInTheDocument()

      // Restore original camera
      mockCanvasState.camera = originalCamera
      mockCanvasState.zoom = 1
    })

    it('should include camera controls', () => {
      render(
        <CanvasProvider>
          <Animus />
        </CanvasProvider>
      )

      // Canvas renders with controls (OrbitControls and CameraController are children)
      const canvas = screen.getByTestId('three-canvas')
      expect(canvas).toBeInTheDocument()
      expect(canvas.children.length).toBeGreaterThan(0)
    })
  })
})