import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Animus } from './Animus'
import { CanvasProvider } from './CanvasProvider'
import { useCanvas } from './CanvasProvider'
import { useFrame, useThree } from '@react-three/fiber'
import type { IdeaNode, Edge } from '@refinery/schema'

// Mock canvas context
const mockEnqueueCommand = vi.fn()

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
    enqueueCommand: mockEnqueueCommand,
    enqueueCommands: vi.fn()
  })),
  CanvasProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}))

// Mock camera for useThree
const mockCamera = {
  position: { x: 0, y: 0, z: 100, set: vi.fn() },
  zoom: 1,
  updateProjectionMatrix: vi.fn()
}

// Mock React Three Fiber Canvas to render a div
let frameCallbacks: Function[] = []
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, style, onClick, ...props }: any) => (
    <div 
      data-testid="three-canvas" 
      style={style} 
      onClick={onClick}
      {...props}
    >{children}</div>
  ),
  useThree: vi.fn(() => ({
    camera: mockCamera
  })),
  useFrame: vi.fn((callback) => {
    frameCallbacks.push(callback)
  })
}))

// Mock @react-three/drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  PerspectiveCamera: ({ children, position, zoom, ...props }: any) => (
    <div data-testid="perspective-camera" data-position={position} data-zoom={zoom}>
      {children}
    </div>
  ),
  Stats: () => <div>Stats</div>
}))

// Mock Scene component
vi.mock('./Scene', () => ({
  Scene: (props: any) => (
    <div data-testid="scene">
      {props.nodes.map((node: IdeaNode) => (
        <div
          key={node.id}
          data-testid={`node-${node.id}`}
          onClick={(e) => props.onNodeClick(node.id, e)}
          onPointerOver={() => props.onNodePointerOver(node.id)}
          onPointerOut={() => props.onNodePointerOut()}
        />
      ))}
      {props.edges.map((edge: Edge) => (
        <div
          key={edge.id}
          data-testid={`edge-${edge.id}`}
          onClick={(e) => props.onEdgeClick(edge.id, e)}
          onPointerOver={() => props.onEdgePointerOver(edge.id)}
          onPointerOut={() => props.onEdgePointerOut()}
        />
      ))}
    </div>
  )
}))

describe('Animus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    frameCallbacks = []
    mockCanvasState.theme = 'light'
    mockCanvasState.nodes.clear()
    mockCanvasState.edges.clear()
    mockCamera.position.x = 0
    mockCamera.position.y = 0
    mockCamera.position.z = 100
    mockCamera.zoom = 1
  })

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

  it('should render nodes and edges from state', () => {
    // Add test nodes and edges
    const testNode: IdeaNode = {
      id: 'node1',
      content: { title: 'Test Node' },
      position: { x: 0, y: 0, z: 0 },
      created: new Date(),
      updated: new Date()
    }
    
    const testEdge: Edge = {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      label: 'test'
    }

    mockCanvasState.nodes.set('node1', testNode)
    mockCanvasState.edges.set('edge1', testEdge)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    expect(screen.getByTestId('node-node1')).toBeInTheDocument()
    expect(screen.getByTestId('edge-edge1')).toBeInTheDocument()
  })

  it('should handle canvas click to clear selection', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const canvas = screen.getByTestId('three-canvas')
    fireEvent.click(canvas)

    expect(mockEnqueueCommand).toHaveBeenCalledWith({ type: 'CLEAR_SELECTION' })
  })

  it('should handle node click with replace mode', () => {
    const testNode: IdeaNode = {
      id: 'node1',
      content: { title: 'Test Node' },
      position: { x: 0, y: 0, z: 0 },
      created: new Date(),
      updated: new Date()
    }
    mockCanvasState.nodes.set('node1', testNode)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const node = screen.getByTestId('node-node1')
    fireEvent.click(node, { shiftKey: false })

    // The stopPropagation is called via optional chaining in the code
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SELECT_NODES',
      payload: { nodeIds: ['node1'], mode: 'replace' }
    })
  })

  it('should handle node click with toggle mode (shift key)', () => {
    const testNode: IdeaNode = {
      id: 'node1',
      content: { title: 'Test Node' },
      position: { x: 0, y: 0, z: 0 },
      created: new Date(),
      updated: new Date()
    }
    mockCanvasState.nodes.set('node1', testNode)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const node = screen.getByTestId('node-node1')
    fireEvent.click(node, { shiftKey: true })

    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SELECT_NODES',
      payload: { nodeIds: ['node1'], mode: 'toggle' }
    })
  })

  it('should handle node hover events', () => {
    const testNode: IdeaNode = {
      id: 'node1',
      content: { title: 'Test Node' },
      position: { x: 0, y: 0, z: 0 },
      created: new Date(),
      updated: new Date()
    }
    mockCanvasState.nodes.set('node1', testNode)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const node = screen.getByTestId('node-node1')
    
    fireEvent.pointerOver(node)
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SET_HOVER_NODE',
      payload: { nodeId: 'node1' }
    })

    fireEvent.pointerOut(node)
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SET_HOVER_NODE',
      payload: { nodeId: null }
    })
  })

  it('should handle edge click with replace mode', () => {
    const testEdge: Edge = {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      label: 'test'
    }
    mockCanvasState.edges.set('edge1', testEdge)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const edge = screen.getByTestId('edge-edge1')
    fireEvent.click(edge, { shiftKey: false })

    // The stopPropagation is called via optional chaining in the code
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SELECT_EDGES',
      payload: { edgeIds: ['edge1'], mode: 'replace' }
    })
  })

  it('should handle edge click with toggle mode (shift key)', () => {
    const testEdge: Edge = {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      label: 'test'
    }
    mockCanvasState.edges.set('edge1', testEdge)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const edge = screen.getByTestId('edge-edge1')
    fireEvent.click(edge, { shiftKey: true })

    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SELECT_EDGES',
      payload: { edgeIds: ['edge1'], mode: 'toggle' }
    })
  })

  it('should handle edge hover events', () => {
    const testEdge: Edge = {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      label: 'test'
    }
    mockCanvasState.edges.set('edge1', testEdge)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const edge = screen.getByTestId('edge-edge1')
    
    fireEvent.pointerOver(edge)
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SET_HOVER_EDGE',
      payload: { edgeId: 'edge1' }
    })

    fireEvent.pointerOut(edge)
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SET_HOVER_EDGE',
      payload: { edgeId: null }
    })
  })

  it('should handle events without stopPropagation method', () => {
    const testNode: IdeaNode = {
      id: 'node1',
      content: { title: 'Test Node' },
      position: { x: 0, y: 0, z: 0 },
      created: new Date(),
      updated: new Date()
    }
    mockCanvasState.nodes.set('node1', testNode)

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const node = screen.getByTestId('node-node1')
    const mockEvent = {} // No stopPropagation method
    fireEvent.click(node, mockEvent)

    // Should not throw error
    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SELECT_NODES',
      payload: { nodeIds: ['node1'], mode: 'replace' }
    })
  })

  it('should render orbit controls', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
  })

  it('should render perspective camera with correct props', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    const camera = screen.getByTestId('perspective-camera')
    expect(camera).toBeInTheDocument()
    expect(camera.getAttribute('data-position')).toBe('0,0,100')
    expect(camera.getAttribute('data-zoom')).toBe('1')
  })

  // Tests for CameraController
  it('should update zoom when state zoom changes', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    // Simulate frame callback
    mockCanvasState.zoom = 2
    frameCallbacks.forEach(cb => cb())

    expect(mockCamera.zoom).toBe(2)
    expect(mockCamera.updateProjectionMatrix).toHaveBeenCalled()
  })

  it('should update camera position in state when camera moves', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    // Simulate camera movement
    mockCamera.position.x = 50
    mockCamera.position.y = 50
    mockCamera.position.z = 150

    frameCallbacks.forEach(cb => cb())

    expect(mockEnqueueCommand).toHaveBeenCalledWith({
      type: 'SET_CAMERA_POSITION',
      payload: { x: 50, y: 50, z: 150 }
    })
  })

  it('should not update camera position if it hasn\'t changed', () => {
    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    // Camera position matches state
    mockCamera.position.x = 0
    mockCamera.position.y = 0
    mockCamera.position.z = 100

    const commandCountBefore = mockEnqueueCommand.mock.calls.length
    frameCallbacks.forEach(cb => cb())

    // Should not call enqueueCommand for camera position
    const commandCountAfter = mockEnqueueCommand.mock.calls.length
    expect(commandCountAfter).toBe(commandCountBefore)
  })

  it('should handle camera without zoom property', () => {
    const cameraWithoutZoom = {
      position: { x: 0, y: 0, z: 100 },
      updateProjectionMatrix: vi.fn()
    }
    
    ;(useThree as any).mockReturnValue({ camera: cameraWithoutZoom })

    render(
      <CanvasProvider>
        <Animus />
      </CanvasProvider>
    )

    mockCanvasState.zoom = 2
    frameCallbacks.forEach(cb => cb())

    // Should not throw error
    expect(cameraWithoutZoom.updateProjectionMatrix).not.toHaveBeenCalled()
  })
})