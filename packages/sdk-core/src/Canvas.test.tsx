import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { Canvas } from './Canvas'
import { CanvasProvider } from './CanvasProvider'

// Mock canvas state
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

// Mock useCanvas hook
vi.mock('./CanvasProvider', () => ({
  useCanvas: vi.fn(() => ({
    state: mockCanvasState,
    enqueueCommand: vi.fn(),
    enqueueCommands: vi.fn()
  })),
  CanvasProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// Mock React Three Fiber Canvas
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style, camera, gl, ...props }: any) => (
    <div 
      data-testid="three-canvas" 
      style={style}
      data-camera={JSON.stringify(camera)}
      data-gl={JSON.stringify(gl)}
      {...props}
    >
      {children}
    </div>
  )
}))

describe('Canvas', () => {
  it('should render with default props', () => {
    render(
      <Canvas>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toBeInTheDocument()
    
    // Check container has default dimensions
    const container = canvas.parentElement
    expect(container).toHaveStyle({ width: '100%', height: '100vh' })
  })

  it('should accept custom dimensions as numbers', () => {
    render(
      <Canvas width={800} height={600}>
        <mesh />
      </Canvas>
    )

    const container = screen.getByTestId('three-canvas').parentElement
    expect(container).toHaveStyle({ width: '800px', height: '600px' })
  })

  it('should accept custom dimensions as strings', () => {
    render(
      <Canvas width="50vw" height="50vh">
        <mesh />
      </Canvas>
    )

    const container = screen.getByTestId('three-canvas').parentElement
    expect(container).toHaveStyle({ width: '50vw', height: '50vh' })
  })

  it('should apply custom className', () => {
    render(
      <Canvas className="custom-canvas-class">
        <mesh />
      </Canvas>
    )

    const container = screen.getByTestId('three-canvas').parentElement
    expect(container).toHaveClass('custom-canvas-class')
  })

  it('should apply light theme background', () => {
    render(
      <Canvas>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#f5f5f5' })
  })

  it('should apply dark theme background', () => {
    mockCanvasState.theme = 'dark'
    
    render(
      <Canvas>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#1a1a1a' })
  })

  it('should merge custom styles with theme background', () => {
    mockCanvasState.theme = 'light'
    
    render(
      <Canvas style={{ border: '1px solid red', padding: '10px' }}>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ 
      background: '#f5f5f5',
      border: '1px solid red',
      padding: '10px'
    })
  })

  it('should override theme background with custom style', () => {
    mockCanvasState.theme = 'light'
    
    render(
      <Canvas style={{ background: '#ff0000' }}>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#ff0000' })
  })

  it('should pass camera prop to ThreeCanvas', () => {
    const customCamera = { 
      fov: 75, 
      position: [0, 0, 5],
      near: 0.1,
      far: 1000
    }
    
    render(
      <Canvas camera={customCamera}>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas.getAttribute('data-camera')).toBe(JSON.stringify(customCamera))
  })

  it('should pass gl prop to ThreeCanvas', () => {
    const customGl = { 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    }
    
    render(
      <Canvas gl={customGl}>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas.getAttribute('data-gl')).toBe(JSON.stringify(customGl))
  })

  it('should render children correctly', () => {
    render(
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas.innerHTML).toContain('ambientlight')
    expect(canvas.innerHTML).toContain('directionallight')
    expect(canvas.innerHTML).toContain('mesh')
    expect(canvas.innerHTML).toContain('boxgeometry')
    expect(canvas.innerHTML).toContain('meshstandardmaterial')
  })

  it('should handle empty children', () => {
    const { container } = render(
      <Canvas />
    )

    expect(container.querySelector('[data-testid="three-canvas"]')).toBeInTheDocument()
  })

  it('should pass additional props to ThreeCanvas', () => {
    render(
      <Canvas 
        shadows
        dpr={[1, 2]}
        data-custom="test"
      >
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas.getAttribute('dpr')).toBe('1,2')
    expect(canvas.getAttribute('data-custom')).toBe('test')
  })

  it('should work with custom theme', () => {
    mockCanvasState.theme = 'custom'
    mockCanvasState.customTheme = {
      background: '#123456',
      node: { default: '#ffffff', selected: '#00ff00' },
      edge: { default: '#cccccc', selected: '#00ff00' }
    }
    
    render(
      <Canvas>
        <mesh />
      </Canvas>
    )

    // With custom theme, it should still use the default backgrounds
    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#f5f5f5' })
  })

  it('should handle style prop as undefined', () => {
    render(
      <Canvas style={undefined}>
        <mesh />
      </Canvas>
    )

    const canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#f5f5f5' })
  })

  it('should maintain reactivity to theme changes', () => {
    const { rerender } = render(
      <Canvas>
        <mesh />
      </Canvas>
    )

    let canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#f5f5f5' })

    // Change theme
    mockCanvasState.theme = 'dark'
    
    rerender(
      <Canvas>
        <mesh />
      </Canvas>
    )

    canvas = screen.getByTestId('three-canvas')
    expect(canvas).toHaveStyle({ background: '#1a1a1a' })
  })
})