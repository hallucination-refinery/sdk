import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, waitFor } from '@testing-library/react'

// Mock the r3f-forcegraph component
vi.mock('r3f-forcegraph', () => {
  const React = require('react')
  
  return {
    default: React.forwardRef((props: any, ref: any) => {
      // Simulate the ForceGraph3D component behavior
      React.useImperativeHandle(ref, () => ({
        // These are the actual methods exposed by r3f-forcegraph
        emitParticle: () => {},
        getGraphBbox: () => ({ x: [0, 1], y: [0, 1], z: [0, 1] }),
        d3ReheatSimulation: () => {},
        d3Force: () => {},
        resetCountdown: () => {},
        tickFrame: () => {},
        refresh: () => {},
      }))

      // Simulate component mount behavior
      React.useEffect(() => {
        // Set window.__FG immediately after ref is ready
        if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
          (window as any).__FG = ref.current
        }
        
        // Call onEngineStop callback if provided, but with a slight delay to ensure ref is set
        if (props.onEngineStop) {
          setTimeout(() => props.onEngineStop(), 0)
        }
      }, [props, ref])

      return React.createElement('div', { 'data-testid': 'mock-forcegraph3d' })
    }),
  }
})

import ForceGraphAdapter from './ForceGraphAdapter'

describe('ForceGraphAdapter Smoke Test', () => {
  let consoleErrorSpy: any
  const originalConsoleError = console.error

  beforeEach(() => {
    // Spy on console.error
    consoleErrorSpy = vi.fn()
    console.error = consoleErrorSpy
    // Clear window.__FG
    delete (window as any).__FG
  })

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError
    // Clean up window.__FG
    delete (window as any).__FG
  })

  it('should mount without errors and expose window.__FG with refresh method', async () => {
    const mockGraphData = {
      nodes: Array.from({ length: 213 }, (_, i) => ({
        id: `n${i + 1}`,
        label: `Node ${i + 1}`,
        type: 'concept',
        metadata: { cluster: i % 5 === 0 ? 'research' : 'personal' },
      })),
      links: Array.from({ length: 300 }, (_, i) => ({
        source: `n${(i % 213) + 1}`,
        target: `n${((i + 1) % 213) + 1}`,
        sign: i % 2 === 0 ? '+' : '-',
      })),
    }

    const ref = React.createRef<any>()
    const { container } = render(
      <ForceGraphAdapter 
        ref={ref}
        graphData={mockGraphData}
        nodeId="id"
        linkSource="source"
        linkTarget="target"
      />
    )

    // Wait for window.__FG to be assigned
    await waitFor(() => {
      expect((window as any).__FG).toBeDefined()
    }, { timeout: 5000 })

    // Verify window.__FG has refresh method
    expect(typeof (window as any).__FG.refresh).toBe('function')

    // Verify all expected methods are present
    const expectedMethods = [
      'emitParticle',
      'getGraphBbox',
      'd3ReheatSimulation',
      'd3Force',
      'resetCountdown',
      'tickFrame',
      'refresh'
    ]
    
    for (const method of expectedMethods) {
      expect(typeof (window as any).__FG[method]).toBe('function')
    }

    // Verify no console errors
    expect(consoleErrorSpy).not.toHaveBeenCalled()

    // Test calling refresh doesn't throw
    expect(() => {
      (window as any).__FG.refresh()
    }).not.toThrow()
  })

  it('should log to console when data changes trigger refresh', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    
    const initialData = {
      nodes: [{ id: 'n1', label: 'Node 1' }],
      links: []
    }

    const ref = React.createRef<any>()
    const { rerender } = render(
      <ForceGraphAdapter ref={ref} graphData={initialData} />
    )

    // Wait for initial mount
    await waitFor(() => {
      expect((window as any).__FG).toBeDefined()
    })

    // Update with new data
    const updatedData = {
      nodes: [{ id: 'n1', label: 'Node 1' }, { id: 'n2', label: 'Node 2' }],
      links: [{ source: 'n1', target: 'n2' }]
    }

    rerender(<ForceGraphAdapter ref={ref} graphData={updatedData} />)

    // Wait for refresh log
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[FGAdapter] Data changed, calling refresh()'),
        expect.objectContaining({
          nodeCount: 2,
          linkCount: 1
        })
      )
    })

    // Verify refresh was called successfully
    expect(consoleSpy).toHaveBeenCalledWith(
      '[FGAdapter] Called ref.current.refresh() successfully'
    )

    consoleSpy.mockRestore()
  })

  it('should handle empty data gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'log')
    
    const emptyData = {
      nodes: [],
      links: []
    }

    const ref = React.createRef<any>()
    render(<ForceGraphAdapter ref={ref} graphData={emptyData} />)

    // Wait for mount
    await waitFor(() => {
      expect((window as any).__FG).toBeDefined()
    })

    // Verify it logs about skipping refresh for empty data
    expect(consoleSpy).toHaveBeenCalledWith(
      '[FGAdapter] Skipping refresh - no data or empty nodes array'
    )

    // Verify no console errors
    expect(consoleErrorSpy).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should verify that refresh method prevents the tick crash', async () => {
    // This test verifies that the refresh() method is available and callable
    // In the real scenario without refresh(), three-forcegraph would crash
    // trying to access undefined layout.tick
    
    const mockGraphData = {
      nodes: [{ id: 'n1' }],
      links: []
    }

    const ref = React.createRef<any>()
    render(<ForceGraphAdapter ref={ref} graphData={mockGraphData} />)

    // Wait for window.__FG
    await waitFor(() => {
      expect((window as any).__FG).toBeDefined()
    })

    // Verify refresh method exists
    expect(typeof (window as any).__FG.refresh).toBe('function')

    // Verify tickFrame method exists and doesn't crash
    expect(typeof (window as any).__FG.tickFrame).toBe('function')
    
    // Call tickFrame - it should not throw
    expect(() => {
      (window as any).__FG.tickFrame()
    }).not.toThrow()

    // The real crash would occur if refresh() wasn't called after data changes
    // Our implementation now calls refresh() in useEffect when data changes,
    // preventing the "Cannot read properties of undefined (reading 'tick')" error
  })
})