import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Animus } from './Animus'
import { CanvasProvider } from './CanvasProvider'

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

vi.mock('./CanvasProvider', () => ({
  useCanvas: vi.fn(() => ({
    state: mockCanvasState,
    enqueueCommand: vi.fn(),
    enqueueCommands: vi.fn()
  })),
  CanvasProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// Mock React Three Fiber Canvas to render a div
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style, ...props }: any) => <div data-testid="three-canvas" style={style} {...props}>{children}</div>,
  useThree: vi.fn(() => ({
    camera: {
      position: { x: 0, y: 0, z: 100, set: vi.fn() },
      zoom: 1,
      updateProjectionMatrix: vi.fn()
    }
  })),
  useFrame: vi.fn()
}))

// Mock @react-three/drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: ({ children, ...props }: any) => <>{children}</>,
  Stats: () => <div>Stats</div>
}))

describe('Animus', () => {
  it('should render with default props', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toBeInTheDocument()
    
    // Check the container div has the proper dimensions
    const container = canvas.parentElement
    expect(container).toHaveStyle({ width: '100%', height: '100vh' })
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
    const { container } = render(
      <CanvasProvider>
        <Animus showStats={true} />
      </CanvasProvider>
    )

    // Stats component is mocked, so we just check if it's rendered
    expect(container.innerHTML).toContain('Stats')
  })

  it('should not render Stats component when showStats is false', () => {
    const { container } = render(
      <CanvasProvider>
        <Animus showStats={false} />
      </CanvasProvider>
    )

    expect(container.innerHTML).not.toContain('Stats')
  })
})