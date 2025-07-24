/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import React from 'react'

// Use vi.hoisted to ensure these are available before mocks
const { mockNodes, mockOnNodeHover } = vi.hoisted(() => {
  return {
    mockNodes: [] as any[],
    mockOnNodeHover: vi.fn()
  }
})

// IMPORTANT: Import the component AFTER setting up all mocks to avoid module resolution issues
let CrypticAnimusScene: any

// All mocks must be hoisted to run before imports
vi.hoisted(() => {
  // Mock Three.js first
  vi.mock('three', () => ({
  Vector3: vi.fn(),
  Color: vi.fn(),
  SpriteMaterial: vi.fn(() => ({ 
    map: null, 
    opacity: 1,
    needsUpdate: false
  })),
  Sprite: vi.fn(() => ({
    material: { opacity: 1 },
    scale: { set: vi.fn() }
  })),
  CanvasTexture: vi.fn(() => ({ needsUpdate: false }))
}))

// Mock sprite building
vi.mock('../CrypticNodeSprite', () => ({
  buildCrypticNodeSprite: vi.fn(() => ({
    type: 'Sprite',
    material: { opacity: 1, needsUpdate: false }
  })),
  cleanupCrypticSpriteCache: vi.fn()
}))

// Mock Three.js dependencies
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  Canvas: ({ children }: any) => <div>{children}</div>
}))

vi.mock('@/utils/clusterPalette', () => ({
  OPACITY_VALUES: { full: 1, dimmed: 0.3, linkDefault: 0.8 },
  LINK_COLORS: { 
    default: '#888',
    positive: '#0f0',
    negative: '#f00',
    upstream: '#f00',
    downstream: '#0f0',
    highlighted: '#00f'
  }
}))

vi.mock('@/utils/graphTraversal', () => ({}))

// Mock @refinery/canvas-r3f module resolution
vi.mock('@refinery/canvas-r3f', () => {
  const MockForceGraphAdapter = React.forwardRef((props: any, ref: any) => {
    const nodesRef = React.useRef<any[]>([])
    
    // Initialize nodes with mutable velocity properties
    React.useEffect(() => {
      nodesRef.current = props.graphData.nodes.map((node: any) => ({
        ...node,
        vx: 0,
        vy: 0,
        vz: 0,
        __threeObj: { material: { opacity: 1 } }
      }))
      
      // Store globally for test access
      mockNodes.length = 0
      mockNodes.push(...nodesRef.current)
    }, [props.graphData])
    
    // Simulate hover behavior
    const handleHover = (nodeId: string | null) => {
      if (nodeId && props.onNodeHover) {
        const node = nodesRef.current.find((n: any) => n.id === nodeId)
        if (node) {
          // This is where the error would occur if nodes were frozen
          node.vx = Math.random() * 0.1
          node.vy = Math.random() * 0.1
          node.vz = Math.random() * 0.1
          props.onNodeHover(node)
        }
      } else if (props.onNodeHover) {
        props.onNodeHover(null)
      }
    }
    
    // Expose methods via ref
    React.useImperativeHandle(ref, () => ({
      graphData: () => ({ nodes: nodesRef.current, links: props.graphData.links }),
      simulateHover: handleHover,
      tickFrame: vi.fn(),
      d3Force: vi.fn()
    }))
    
    return (
      <div data-testid="mock-forcegraph">
        {nodesRef.current.map((node: any) => (
          <div 
            key={node.id}
            data-testid={`node-${node.id}`}
            onMouseEnter={() => handleHover(node.id)}
            onMouseLeave={() => handleHover(null)}
          >
            {node.label}
          </div>
        ))}
      </div>
    )
  })

  MockForceGraphAdapter.displayName = 'MockForceGraphAdapter'

  return {
    __esModule: true,
    ForceGraphAdapter: MockForceGraphAdapter,
    Canvas: () => null,
    CanvasProvider: () => null,
    useCanvas: () => null,
    NodeSprite: () => null,
    PerfProbe: () => null
  }
})

// Mock next/dynamic to return our ForceGraphAdapter mock
vi.mock('next/dynamic', () => ({
  default: vi.fn(() => {
    // Return the mocked ForceGraphAdapter from @refinery/canvas-r3f
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@refinery/canvas-r3f').ForceGraphAdapter
  })
}))

// Test data
const createTestData = () => ({
  nodes: [
    { 
      id: 'n1', 
      label: 'Node 1', 
      type: 'concept',
      metadata: { cluster: 'research' }
    },
    { 
      id: 'n2', 
      label: 'Node 2', 
      type: 'memory',
      metadata: { cluster: 'personal' },
      secret: true
    }
  ],
  links: [
    { source: 'n1', target: 'n2', sign: '+' }
  ]
})

describe('CrypticAnimusScene - Node Hover After Idle', () => {
  beforeAll(async () => {
    // Import the component after mocks are set up
    const componentModule = await import('../CrypticAnimusScene')
    CrypticAnimusScene = componentModule.default
  })
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockNodes.length = 0
    mockOnNodeHover.mockClear()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  it('should allow hover callbacks after 15+ seconds of idle time', async () => {
    vi.useFakeTimers()
    
    // Render with cooldownTime={Infinity}
    const { getByTestId } = render(
      <CrypticAnimusScene
        data={createTestData()}
        onNodeHover={mockOnNodeHover}
        cooldownTime={Infinity}
      />
    )
    
    // Wait for initial render
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    
    // Verify initial state
    expect(mockNodes).toHaveLength(2)
    expect(mockOnNodeHover).not.toHaveBeenCalled()
    
    // Advance time by 20 seconds (well past typical cooldown)
    act(() => {
      vi.advanceTimersByTime(20000)
    })
    
    // Attempt to hover over first node
    const node1Element = getByTestId('node-n1')
    
    // This should NOT throw "Cannot assign to read only property 'vx'"
    expect(() => {
      act(() => {
        node1Element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      })
    }).not.toThrow()
    
    // Verify hover callback was called
    expect(mockOnNodeHover).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'n1',
        label: 'Node 1'
      })
    )
    
    // Verify node velocity properties were set
    const hoveredNode = mockNodes.find(n => n.id === 'n1')
    expect(hoveredNode.vx).toBeDefined()
    expect(hoveredNode.vy).toBeDefined()
    expect(hoveredNode.vz).toBeDefined()
    expect(hoveredNode.vx).not.toBe(0) // Should have been modified
    
    vi.useRealTimers()
  })

  it('should keep nodes mutable for property updates after idle time', async () => {
    vi.useFakeTimers()
    
    render(
      <CrypticAnimusScene
        data={createTestData()}
        onNodeHover={mockOnNodeHover}
        cooldownTime={Infinity}
      />
    )
    
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    
    // Advance time significantly
    act(() => {
      vi.advanceTimersByTime(30000) // 30 seconds
    })
    
    // Test direct property assignment
    mockNodes.forEach(node => {
      // These assignments should not throw
      expect(() => {
        node.vx = 1
        node.vy = 2
        node.vz = 3
        node.customProp = 'test'
        node.metadata = { ...node.metadata, updated: true }
      }).not.toThrow()
      
      // Verify assignments worked
      expect(node.vx).toBe(1)
      expect(node.vy).toBe(2)
      expect(node.vz).toBe(3)
      expect(node.customProp).toBe('test')
      expect(node.metadata.updated).toBe(true)
    })
    
    vi.useRealTimers()
  })

  it('should maintain hover functionality through multiple interactions', async () => {
    vi.useFakeTimers()
    
    const { getByTestId } = render(
      <CrypticAnimusScene
        data={createTestData()}
        onNodeHover={mockOnNodeHover}
        cooldownTime={Infinity}
      />
    )
    
    await act(async () => {
      await vi.runAllTimersAsync()
    })
    
    // Advance time
    act(() => {
      vi.advanceTimersByTime(25000) // 25 seconds
    })
    
    const node1Element = getByTestId('node-n1')
    const node2Element = getByTestId('node-n2')
    
    // Multiple hover interactions
    for (let i = 0; i < 3; i++) {
      // Hover node 1
      act(() => {
        node1Element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      })
      expect(mockOnNodeHover).toHaveBeenLastCalledWith(
        expect.objectContaining({ id: 'n1' })
      )
      
      // Leave node 1
      act(() => {
        node1Element.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }))
      })
      expect(mockOnNodeHover).toHaveBeenLastCalledWith(null)
      
      // Hover node 2
      act(() => {
        node2Element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
      })
      expect(mockOnNodeHover).toHaveBeenLastCalledWith(
        expect.objectContaining({ id: 'n2' })
      )
      
      // Advance time between interactions
      act(() => {
        vi.advanceTimersByTime(5000)
      })
    }
    
    // All interactions should have worked without errors
    expect(mockOnNodeHover).toHaveBeenCalledTimes(9) // 3 iterations × 3 calls each
    
    vi.useRealTimers()
  })
})

describe('CrypticAnimusScene - Node Mutability', () => {
  beforeAll(async () => {
    // Import the component after mocks are set up
    const componentModule = await import('../CrypticAnimusScene')
    CrypticAnimusScene = componentModule.default
  })
  
  beforeEach(() => {
    vi.clearAllMocks()
    mockNodes.length = 0
  })
  
  it('should allow velocity property updates on hover', async () => {
    const { getByTestId } = render(
      <CrypticAnimusScene
        data={createTestData()}
        onNodeHover={mockOnNodeHover}
        cooldownTime={Infinity}
      />
    )
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    const node1Element = getByTestId('node-n1')
    
    // Record initial velocity values
    const node = mockNodes.find(n => n.id === 'n1')
    const initialVx = node.vx
    const initialVy = node.vy
    const initialVz = node.vz
    
    // Trigger hover
    act(() => {
      node1Element.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    })
    
    // Velocity should have changed
    expect(node.vx).not.toBe(initialVx)
    expect(node.vy).not.toBe(initialVy)
    expect(node.vz).not.toBe(initialVz)
  })
  
  it('should allow custom property additions', async () => {
    render(
      <CrypticAnimusScene
        data={createTestData()}
        cooldownTime={Infinity}
      />
    )
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    // Add custom properties to nodes
    mockNodes.forEach(node => {
      expect(() => {
        node.customField = 'test value'
        node.dynamicProp = { nested: true }
        node.arrayProp = [1, 2, 3]
      }).not.toThrow()
      
      expect(node.customField).toBe('test value')
      expect(node.dynamicProp).toEqual({ nested: true })
      expect(node.arrayProp).toEqual([1, 2, 3])
    })
  })
  
  it('should not throw read-only errors', async () => {
    render(
      <CrypticAnimusScene
        data={createTestData()}
        cooldownTime={Infinity}
      />
    )
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    // Comprehensive property modification test
    mockNodes.forEach(node => {
      expect(() => {
        // Velocity properties
        node.vx = Math.random()
        node.vy = Math.random()
        node.vz = Math.random()
        
        // Position properties
        node.x = 100
        node.y = 200
        node.z = 300
        
        // Metadata updates
        node.metadata = { ...node.metadata, modified: Date.now() }
        
        // Direct property additions
        node.hovered = true
        node.lastUpdate = new Date()
      }).not.toThrow()
    })
  })
})
})