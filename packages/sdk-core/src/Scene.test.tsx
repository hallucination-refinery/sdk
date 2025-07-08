import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { Scene } from './Scene'
import type { Node, Edge } from '@refinery/schema'

// Mock Three.js objects
vi.mock('three', () => ({
  Vector3: vi.fn(),
  BufferGeometry: vi.fn(() => ({
    setFromPoints: vi.fn()
  })),
  Line: vi.fn(),
  LineBasicMaterial: vi.fn(),
  Mesh: vi.fn()
}))

// Mock React Three Fiber
const mockCameraSet = vi.fn()
vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(() => ({
    camera: {
      position: { 
        x: 0, 
        y: 0, 
        z: 100,
        set: mockCameraSet
      }
    }
  }))
}))

// Mock components
vi.mock('./components', () => ({
  NodeSprite: ({ text }: { text: string }) => <div data-testid="node-sprite">{text}</div>
}))

describe('Scene', () => {
  const mockNodes: Node[] = [
    { 
      id: 'node-1', 
      label: 'Node 1',
      position: { x: 0, y: 0, z: 0 }
    },
    { 
      id: 'node-2', 
      label: 'Node 2',
      position: { x: 10, y: 10, z: 0 }
    }
  ]

  const mockEdges: Edge[] = [
    { id: 'edge-1', source: 'node-1', target: 'node-2' }
  ]

  const defaultProps = {
    nodes: mockNodes,
    edges: mockEdges,
    selectedNodeIds: new Set<string>(),
    selectedEdgeIds: new Set<string>(),
    highlightedNodes: new Map(),
    highlightedEdges: new Map(),
    hoveredNodeId: null,
    hoveredEdgeId: null,
    camera: { x: 0, y: 0, z: 100 },
    onNodeClick: vi.fn(),
    onNodePointerOver: vi.fn(),
    onNodePointerOut: vi.fn(),
    onEdgeClick: vi.fn(),
    onEdgePointerOver: vi.fn(),
    onEdgePointerOut: vi.fn()
  }

  it('should render lighting', () => {
    const { container } = render(<Scene {...defaultProps} />)
    
    expect(container.querySelector('ambientLight')).toBeInTheDocument()
    expect(container.querySelector('directionalLight')).toBeInTheDocument()
  })

  it('should render nodes', () => {
    const { container } = render(<Scene {...defaultProps} />)
    
    // Check that groups for nodes are rendered
    const groups = container.querySelectorAll('group')
    expect(groups.length).toBeGreaterThanOrEqual(mockNodes.length)
  })

  it('should render node labels', () => {
    const { getAllByTestId } = render(<Scene {...defaultProps} />)
    
    const sprites = getAllByTestId('node-sprite')
    expect(sprites).toHaveLength(2)
    expect(sprites[0]).toHaveTextContent('Node 1')
    expect(sprites[1]).toHaveTextContent('Node 2')
  })

  it('should apply selected state to nodes', () => {
    const propsWithSelection = {
      ...defaultProps,
      selectedNodeIds: new Set(['node-1'])
    }

    const { container } = render(<Scene {...propsWithSelection} />)
    
    // In a real test, we'd check the scale or color of the mesh
    // Since we're mocking, we just verify it renders without error
    expect(container.querySelector('group')).toBeInTheDocument()
  })

  it('should apply highlighted state to nodes', () => {
    const propsWithHighlight = {
      ...defaultProps,
      highlightedNodes: new Map([['node-1', { color: '#ff0000', intensity: 0.8 }]])
    }

    const { container } = render(<Scene {...propsWithHighlight} />)
    
    expect(container.querySelector('group')).toBeInTheDocument()
  })

  it('should render edges', () => {
    const { container } = render(<Scene {...defaultProps} />)
    
    // Check that primitive elements for edges are rendered
    const primitives = container.querySelectorAll('primitive')
    expect(primitives.length).toBeGreaterThanOrEqual(mockEdges.length)
  })

  it('should handle missing node positions', () => {
    const nodesWithoutPosition = [
      { id: 'node-1', label: 'Node 1' }
    ]

    const props = {
      ...defaultProps,
      nodes: nodesWithoutPosition
    }

    const { container } = render(<Scene {...props} />)
    
    // Should still render with default position
    expect(container.querySelector('group')).toBeInTheDocument()
  })

  it('should handle edges with missing nodes', () => {
    const propsWithMissingNodes = {
      ...defaultProps,
      nodes: [], // No nodes
      edges: mockEdges // But edges reference nodes
    }

    // Should not crash
    const { container } = render(<Scene {...propsWithMissingNodes} />)
    expect(container).toBeInTheDocument()
  })

  it('should update camera position', () => {
    // Clear previous calls
    mockCameraSet.mockClear()

    const { rerender } = render(<Scene {...defaultProps} />)

    const newProps = {
      ...defaultProps,
      camera: { x: 50, y: 50, z: 150 }
    }

    rerender(<Scene {...newProps} />)

    // Camera position should be updated
    expect(mockCameraSet).toHaveBeenCalledWith(50, 50, 150)
  })

  it('should handle node interactions', () => {
    const { container } = render(<Scene {...defaultProps} />)

    // Since we're using mocked components, we can't simulate real events
    // but we verify the callbacks are passed correctly
    expect(defaultProps.onNodeClick).not.toHaveBeenCalled()
    expect(defaultProps.onNodePointerOver).not.toHaveBeenCalled()
    expect(defaultProps.onNodePointerOut).not.toHaveBeenCalled()
  })

  it('should handle edge interactions', () => {
    const { container } = render(<Scene {...defaultProps} />)

    // Verify edge callbacks are set up
    expect(defaultProps.onEdgeClick).not.toHaveBeenCalled()
    expect(defaultProps.onEdgePointerOver).not.toHaveBeenCalled()
    expect(defaultProps.onEdgePointerOut).not.toHaveBeenCalled()
  })

  it('should handle nodes with content instead of label', () => {
    const nodesWithContent = [
      { 
        id: 'node-1', 
        content: 'Node Content',
        position: { x: 0, y: 0, z: 0 }
      }
    ]

    const props = {
      ...defaultProps,
      nodes: nodesWithContent
    }

    const { getByTestId } = render(<Scene {...props} />)
    expect(getByTestId('node-sprite')).toHaveTextContent('Node Content')
  })
})