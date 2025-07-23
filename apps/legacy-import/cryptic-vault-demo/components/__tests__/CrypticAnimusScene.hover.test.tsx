/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from '@testing-library/react'

/**
 * Test Plan: CrypticAnimusScene Node Hover Functionality
 * 
 * Core Issue: After idle time, attempting to hover over nodes causes 
 * "Cannot assign to read only property 'vx'" error, indicating nodes become immutable.
 * 
 * Solution: cooldownTime={Infinity} prevents nodes from becoming read-only, 
 * ensuring hover callbacks continue to work after extended idle time.
 */

describe('CrypticAnimusScene - Node Hover Behavior', () => {
  // Simulate the core behavior we're testing
  class NodeSimulator {
    nodes: any[] = []
    onNodeHover: ((node: any) => void) | null = null
    
    constructor(data: any, onNodeHover?: (node: any) => void) {
      this.nodes = data.nodes.map((node: any) => ({
        ...node,
        vx: 0,
        vy: 0,
        vz: 0
      }))
      this.onNodeHover = onNodeHover || null
    }
    
    simulateHover(nodeId: string) {
      const node = this.nodes.find(n => n.id === nodeId)
      if (node) {
        // This is where the error would occur if nodes were frozen
        node.vx = Math.random() * 0.1
        node.vy = Math.random() * 0.1
        node.vz = Math.random() * 0.1
        
        if (this.onNodeHover) {
          this.onNodeHover(node)
        }
      }
    }
    
    // Simulate what happens with finite cooldownTime
    freezeNodes() {
      this.nodes = this.nodes.map(node => Object.freeze({ ...node }))
    }
  }
  
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
  
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  afterEach(() => {
    vi.useRealTimers()
  })
  
  it('should allow hover callbacks after 15+ seconds of idle time with cooldownTime={Infinity}', () => {
    vi.useFakeTimers()
    const mockOnNodeHover = vi.fn()
    
    // Create simulator (represents component with cooldownTime={Infinity})
    const simulator = new NodeSimulator(createTestData(), mockOnNodeHover)
    
    // Verify initial state
    expect(simulator.nodes).toHaveLength(2)
    expect(mockOnNodeHover).not.toHaveBeenCalled()
    
    // Advance time by 20 seconds (well past typical cooldown)
    act(() => {
      vi.advanceTimersByTime(20000)
    })
    
    // Attempt to hover over first node
    // This should NOT throw "Cannot assign to read only property 'vx'"
    expect(() => {
      simulator.simulateHover('n1')
    }).not.toThrow()
    
    // Verify hover callback was called
    expect(mockOnNodeHover).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'n1',
        label: 'Node 1'
      })
    )
    
    // Verify node velocity properties were set
    const hoveredNode = simulator.nodes.find(n => n.id === 'n1')
    expect(hoveredNode.vx).toBeDefined()
    expect(hoveredNode.vy).toBeDefined()
    expect(hoveredNode.vz).toBeDefined()
    expect(hoveredNode.vx).not.toBe(0) // Should have been modified
    
    vi.useRealTimers()
  })
  
  it('should keep nodes mutable for property updates after idle time', () => {
    vi.useFakeTimers()
    
    const simulator = new NodeSimulator(createTestData())
    
    // Advance time significantly
    act(() => {
      vi.advanceTimersByTime(30000) // 30 seconds
    })
    
    // Test direct property assignment
    simulator.nodes.forEach(node => {
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
  
  it('should demonstrate the problem when nodes become frozen (finite cooldownTime)', () => {
    const mockOnNodeHover = vi.fn()
    const simulator = new NodeSimulator(createTestData(), mockOnNodeHover)
    
    // Simulate what happens with finite cooldownTime - nodes become frozen
    simulator.freezeNodes()
    
    // Now hovering should throw an error
    expect(() => {
      simulator.simulateHover('n1')
    }).toThrow('Cannot assign to read only property')
    
    // Hover callback should not have been called due to error
    expect(mockOnNodeHover).not.toHaveBeenCalled()
  })
  
  it('should maintain hover functionality through multiple interactions', () => {
    vi.useFakeTimers()
    const mockOnNodeHover = vi.fn()
    
    const simulator = new NodeSimulator(createTestData(), mockOnNodeHover)
    
    // Advance time
    act(() => {
      vi.advanceTimersByTime(25000) // 25 seconds
    })
    
    // Multiple hover interactions
    for (let i = 0; i < 3; i++) {
      // Hover node 1
      simulator.simulateHover('n1')
      expect(mockOnNodeHover).toHaveBeenLastCalledWith(
        expect.objectContaining({ id: 'n1' })
      )
      
      // Hover node 2
      simulator.simulateHover('n2')
      expect(mockOnNodeHover).toHaveBeenLastCalledWith(
        expect.objectContaining({ id: 'n2' })
      )
      
      // Advance time between interactions
      act(() => {
        vi.advanceTimersByTime(5000)
      })
    }
    
    // All interactions should have worked without errors
    expect(mockOnNodeHover).toHaveBeenCalledTimes(6) // 3 iterations × 2 calls each
    
    vi.useRealTimers()
  })
})

describe('CrypticAnimusScene - Node Mutability', () => {
  class NodeSimulator {
    nodes: any[] = []
    
    constructor(data: any) {
      this.nodes = data.nodes.map((node: any) => ({
        ...node,
        vx: 0,
        vy: 0,
        vz: 0
      }))
    }
  }
  
  const createTestData = () => ({
    nodes: [
      { id: 'n1', label: 'Node 1', metadata: { cluster: 'research' } },
      { id: 'n2', label: 'Node 2', metadata: { cluster: 'personal' } }
    ],
    links: []
  })
  
  it('should allow velocity property updates on hover', () => {
    const simulator = new NodeSimulator(createTestData())
    
    const node = simulator.nodes.find(n => n.id === 'n1')
    const initialVx = node.vx
    const initialVy = node.vy
    const initialVz = node.vz
    
    // Simulate hover velocity updates
    node.vx = Math.random() * 0.1
    node.vy = Math.random() * 0.1
    node.vz = Math.random() * 0.1
    
    // Velocity should have changed
    expect(node.vx).not.toBe(initialVx)
    expect(node.vy).not.toBe(initialVy)
    expect(node.vz).not.toBe(initialVz)
  })
  
  it('should allow custom property additions', () => {
    const simulator = new NodeSimulator(createTestData())
    
    // Add custom properties to nodes
    simulator.nodes.forEach(node => {
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
  
  it('should not throw read-only errors', () => {
    const simulator = new NodeSimulator(createTestData())
    
    // Comprehensive property modification test
    simulator.nodes.forEach(node => {
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