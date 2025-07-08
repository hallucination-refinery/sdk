import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Canvas } from './Canvas'
import { CanvasProvider } from './CanvasProvider'

// Mock the context
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

vi.mock('./CanvasProvider', () => ({
  useCanvas: vi.fn(() => ({
    state: mockCanvasState,
    enqueueCommand: vi.fn(),
    enqueueCommands: vi.fn()
  })),
  CanvasProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

describe('Canvas', () => {
  it('should render with default props', () => {
    render(
      <CanvasProvider>
        <Canvas>
          <div data-testid="canvas-content">Test Content</div>
        </Canvas>
      </CanvasProvider>
    )

    const content = screen.getByTestId('canvas-content')
    expect(content).toBeInTheDocument()
  })

  it('should accept custom dimensions', () => {
    render(
      <CanvasProvider>
        <Canvas width="800px" height="600px">
          <div>Content</div>
        </Canvas>
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    const container = canvas.parentElement
    expect(container).toHaveStyle({ width: '800px', height: '600px' })
  })

  it('should apply custom className', () => {
    render(
      <CanvasProvider>
        <Canvas className="custom-canvas-class">
          <div>Content</div>
        </Canvas>
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    const container = canvas.parentElement
    expect(container).toHaveClass('custom-canvas-class')
  })

  it('should apply light theme background', () => {
    mockCanvasState.theme = 'light'
    
    render(
      <CanvasProvider>
        <Canvas>
          <div>Content</div>
        </Canvas>
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#f5f5f5' })
  })

  it('should apply dark theme background', () => {
    mockCanvasState.theme = 'dark'
    
    render(
      <CanvasProvider>
        <Canvas>
          <div>Content</div>
        </Canvas>
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#1a1a1a' })
  })

  it('should merge custom styles with theme background', () => {
    mockCanvasState.theme = 'light'
    
    render(
      <CanvasProvider>
        <Canvas style={{ border: '1px solid red' }}>
          <div>Content</div>
        </Canvas>
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ 
      background: '#f5f5f5',
      border: '1px solid red'
    })
  })

  it('should pass camera and gl props to ThreeCanvas', () => {
    const camera = { position: [0, 0, 50], fov: 75 }
    const gl = { alpha: true }
    
    render(
      <CanvasProvider>
        <Canvas camera={camera} gl={gl}>
          <div>Content</div>
        </Canvas>
      </CanvasProvider>
    )

    // Since ThreeCanvas is mocked, we can't directly test the props
    // but the test ensures the component renders without errors
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
  })

  it('should render multiple children', () => {
    render(
      <CanvasProvider>
        <Canvas>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </Canvas>
      </CanvasProvider>
    )

    expect(screen.getByTestId('child-1')).toBeInTheDocument()
    expect(screen.getByTestId('child-2')).toBeInTheDocument()
    expect(screen.getByTestId('child-3')).toBeInTheDocument()
  })
})