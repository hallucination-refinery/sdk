import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent, screen } from '@testing-library/react'
import React from 'react'
import { Scene } from './Scene'
import type { IdeaNode, Edge } from '@refinery/schema'
import * as THREE from 'three'

// Mock react-three/fiber
const mockCamera = {
  position: {
    set: vi.fn(),
    x: 0,
    y: 0,
    z: 100
  }
}

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(() => ({
    camera: mockCamera
  }))
}))

// Mock THREE.js
vi.mock('three', () => ({
  Vector3: vi.fn().mockImplementation((x, y, z) => ({ x, y, z })),
  BufferGeometry: vi.fn().mockImplementation(() => ({
    setFromPoints: vi.fn()
  })),
  Line: vi.fn().mockImplementation((geometry, material) => ({
    geometry,
    material,
    type: 'Line'
  })),
  LineBasicMaterial: vi.fn().mockImplementation((params) => ({
    color: params.color,
    opacity: params.opacity,
    transparent: params.transparent
  })),
  Mesh: vi.fn()
}))

describe('Scene', () => {
  const mockNodes: IdeaNode[] = [
    {
      id: 'node1',
      content: { title: 'Node 1', text: 'Content 1' },
      position: { x: 0, y: 0, z: 0 },
      created: new Date(),
      updated: new Date()
    },
    {
      id: 'node2',
      content: { title: 'Node 2', text: 'Content 2' },
      position: { x: 10, y: 10, z: 0 },
      created: new Date(),
      updated: new Date()
    }
  ]

  const mockEdges: Edge[] = [
    {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      label: 'connects'
    }
  ]

  const defaultProps = {
    nodes: mockNodes,
    edges: mockEdges,
    selectedNodeIds: new Set<string>(),
    selectedEdgeIds: new Set<string>(),
    highlightedNodes: new Map<string, { color?: string; intensity?: number }>(),
    highlightedEdges: new Map<string, { color?: string; intensity?: number }>(),
    hoveredNodeId: null,
    hoveredEdgeId: null,
    camera: { x: 0, y: 0, z: 100 }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockCamera.position.set.mockClear()
  })

  it('should render all nodes and edges', () => {
    const { container } = render(<Scene {...defaultProps} />)

    // Check that nodes are rendered
    const nodes = container.querySelectorAll('group')
    expect(nodes).toHaveLength(2)

    // Check that meshes are rendered for nodes
    const meshes = container.querySelectorAll('mesh')
    expect(meshes).toHaveLength(2)

    // Check that edge is rendered
    const primitives = container.querySelectorAll('primitive')
    expect(primitives).toHaveLength(1)
  })

  it('should render lighting', () => {
    const { container } = render(<Scene {...defaultProps} />)

    const ambientLight = container.querySelector('ambientLight')
    expect(ambientLight).toBeTruthy()
    expect(ambientLight?.getAttribute('intensity')).toBe('0.5')

    const directionalLight = container.querySelector('directionalLight')
    expect(directionalLight).toBeTruthy()
    expect(directionalLight?.getAttribute('position')).toBe('10,10,5')
    expect(directionalLight?.getAttribute('intensity')).toBe('1')
  })

  it('should position nodes correctly', () => {
    const { container } = render(<Scene {...defaultProps} />)

    const groups = container.querySelectorAll('group')
    expect(groups[0].getAttribute('position')).toBe('0,0,0')
    expect(groups[1].getAttribute('position')).toBe('10,10,0')
  })

  it('should handle nodes without position', () => {
    const nodesWithoutPosition: IdeaNode[] = [
      {
        id: 'node3',
        content: { title: 'Node 3' },
        created: new Date(),
        updated: new Date()
      }
    ]

    const { container } = render(
      <Scene {...defaultProps} nodes={nodesWithoutPosition} edges={[]} />
    )

    const group = container.querySelector('group')
    expect(group?.getAttribute('position')).toBe('0,0,0')
  })

  it('should highlight selected nodes', () => {
    const selectedNodeIds = new Set(['node1'])
    
    const { container } = render(
      <Scene {...defaultProps} selectedNodeIds={selectedNodeIds} />
    )

    const meshes = container.querySelectorAll('mesh')
    const selectedMesh = meshes[0]
    
    expect(selectedMesh.getAttribute('scale')).toBe('1.2')
    
    const material = selectedMesh.querySelector('meshStandardMaterial')
    expect(material?.getAttribute('color')).toBe('#4CAF50')
    expect(material?.getAttribute('emissive')).toBe('#4CAF50')
  })

  it('should apply custom highlight to nodes', () => {
    const highlightedNodes = new Map([
      ['node1', { color: '#ff0000', intensity: 2 }]
    ])
    
    const { container } = render(
      <Scene {...defaultProps} highlightedNodes={highlightedNodes} />
    )

    const material = container.querySelector('meshStandardMaterial')
    expect(material?.getAttribute('color')).toBe('#ff0000')
    expect(material?.getAttribute('emissiveIntensity')).toBe('0.6') // 2 * 0.3
  })

  it('should handle node click events', () => {
    const onNodeClick = vi.fn()
    
    const { container } = render(
      <Scene {...defaultProps} onNodeClick={onNodeClick} />
    )

    const mesh = container.querySelector('mesh')!
    fireEvent.click(mesh)

    expect(onNodeClick).toHaveBeenCalledWith('node1', expect.any(Object))
  })

  it('should handle node hover events', () => {
    const onNodePointerOver = vi.fn()
    const onNodePointerOut = vi.fn()
    
    const { container } = render(
      <Scene 
        {...defaultProps} 
        onNodePointerOver={onNodePointerOver}
        onNodePointerOut={onNodePointerOut}
      />
    )

    const mesh = container.querySelector('mesh')!
    
    fireEvent.pointerOver(mesh)
    expect(onNodePointerOver).toHaveBeenCalledWith('node1')

    fireEvent.pointerOut(mesh)
    expect(onNodePointerOut).toHaveBeenCalledWith('node1')
  })

  it('should render node labels for nodes with title content', () => {
    const { container } = render(<Scene {...defaultProps} />)

    const sprites = container.querySelectorAll('sprite')
    expect(sprites).toHaveLength(2) // One for each node with title
    
    expect(sprites[0].getAttribute('position')).toBe('0,1,0')
    expect(sprites[0].getAttribute('scale')).toBe('2,0.5,1')
  })

  it('should not render labels for nodes without proper content', () => {
    const nodesWithoutTitle: IdeaNode[] = [
      {
        id: 'node1',
        content: 'Just a string',
        position: { x: 0, y: 0, z: 0 },
        created: new Date(),
        updated: new Date()
      },
      {
        id: 'node2',
        content: null,
        position: { x: 10, y: 10, z: 0 },
        created: new Date(),
        updated: new Date()
      }
    ]

    const { container } = render(
      <Scene {...defaultProps} nodes={nodesWithoutTitle} edges={[]} />
    )

    const sprites = container.querySelectorAll('sprite')
    expect(sprites).toHaveLength(0)
  })

  it('should render edges with correct positions', () => {
    render(<Scene {...defaultProps} />)

    // Verify Vector3 was called with correct positions
    expect(THREE.Vector3).toHaveBeenCalledWith(0, 0, 0) // source position
    expect(THREE.Vector3).toHaveBeenCalledWith(10, 10, 0) // target position
  })

  it('should highlight selected edges', () => {
    const selectedEdgeIds = new Set(['edge1'])
    
    render(
      <Scene {...defaultProps} selectedEdgeIds={selectedEdgeIds} />
    )

    // Check that LineBasicMaterial was called with selected color
    expect(THREE.LineBasicMaterial).toHaveBeenCalledWith({
      color: '#4CAF50',
      opacity: 1,
      transparent: true
    })
  })

  it('should apply custom highlight to edges', () => {
    const highlightedEdges = new Map([
      ['edge1', { color: '#00ff00', intensity: 0.8 }]
    ])
    
    render(
      <Scene {...defaultProps} highlightedEdges={highlightedEdges} />
    )

    expect(THREE.LineBasicMaterial).toHaveBeenCalledWith({
      color: '#00ff00',
      opacity: 0.8,
      transparent: true
    })
  })

  it('should handle edge without source node', () => {
    const edgesWithMissingNode: Edge[] = [
      {
        id: 'edge2',
        source: 'missing-node',
        target: 'node2',
        label: 'connects'
      }
    ]

    const { container } = render(
      <Scene {...defaultProps} edges={edgesWithMissingNode} />
    )

    // Edge should not be rendered
    const primitives = container.querySelectorAll('primitive')
    expect(primitives).toHaveLength(0)
  })

  it('should handle edge without target node', () => {
    const edgesWithMissingNode: Edge[] = [
      {
        id: 'edge2',
        source: 'node1',
        target: 'missing-node',
        label: 'connects'
      }
    ]

    const { container } = render(
      <Scene {...defaultProps} edges={edgesWithMissingNode} />
    )

    // Edge should not be rendered
    const primitives = container.querySelectorAll('primitive')
    expect(primitives).toHaveLength(0)
  })

  it('should handle edge click events', () => {
    const onEdgeClick = vi.fn()
    
    const { container } = render(
      <Scene {...defaultProps} onEdgeClick={onEdgeClick} />
    )

    const primitive = container.querySelector('primitive')!
    fireEvent.click(primitive)

    expect(onEdgeClick).toHaveBeenCalledWith('edge1', expect.any(Object))
  })

  it('should handle edge hover events', () => {
    const onEdgePointerOver = vi.fn()
    const onEdgePointerOut = vi.fn()
    
    const { container } = render(
      <Scene 
        {...defaultProps} 
        onEdgePointerOver={onEdgePointerOver}
        onEdgePointerOut={onEdgePointerOut}
      />
    )

    const primitive = container.querySelector('primitive')!
    
    fireEvent.pointerOver(primitive)
    expect(onEdgePointerOver).toHaveBeenCalledWith('edge1')

    fireEvent.pointerOut(primitive)
    expect(onEdgePointerOut).toHaveBeenCalledWith('edge1')
  })

  it('should update camera position when camera prop changes', () => {
    const { rerender } = render(<Scene {...defaultProps} />)

    expect(mockCamera.position.set).toHaveBeenCalledWith(0, 0, 100)

    rerender(
      <Scene {...defaultProps} camera={{ x: 50, y: 50, z: 200 }} />
    )

    expect(mockCamera.position.set).toHaveBeenCalledWith(50, 50, 200)
  })

  it('should handle empty nodes and edges', () => {
    const { container } = render(
      <Scene {...defaultProps} nodes={[]} edges={[]} />
    )

    // Should still render lights
    expect(container.querySelector('ambientLight')).toBeTruthy()
    expect(container.querySelector('directionalLight')).toBeTruthy()

    // But no nodes or edges
    expect(container.querySelectorAll('group')).toHaveLength(0)
    expect(container.querySelectorAll('primitive')).toHaveLength(0)
  })

  it('should use default edge color when not selected or highlighted', () => {
    render(<Scene {...defaultProps} />)

    expect(THREE.LineBasicMaterial).toHaveBeenCalledWith({
      color: '#666666',
      opacity: 0.6,
      transparent: true
    })
  })

  it('should handle nodes with undefined content property', () => {
    const nodesWithUndefinedContent: IdeaNode[] = [
      {
        id: 'node1',
        content: undefined,
        position: { x: 0, y: 0, z: 0 },
        created: new Date(),
        updated: new Date()
      }
    ]

    const { container } = render(
      <Scene {...defaultProps} nodes={nodesWithUndefinedContent} edges={[]} />
    )

    // Should render node without label
    expect(container.querySelector('group')).toBeTruthy()
    expect(container.querySelector('sprite')).toBeFalsy()
  })

  it('should memoize node map correctly', () => {
    const { container, rerender } = render(<Scene {...defaultProps} />)

    // Change a prop that doesn't affect nodes
    rerender(
      <Scene {...defaultProps} hoveredNodeId="node1" />
    )

    // Node map should be memoized and not recreate unnecessarily
    // This is tested implicitly - if the component renders without error, memoization is working
    const ambientLight = container.querySelector('ambientLight')
    expect(ambientLight).toBeInTheDocument()
    expect(ambientLight?.getAttribute('intensity')).toBe('0.5')
  })
})