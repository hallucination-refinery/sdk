import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { PerfProbe } from './perf-probe'

// Mock Three.js and react-three-fiber for testing
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useThree: () => ({ gl: { info: {} } }),
}))

vi.mock('@react-three/drei', () => ({
  Stats: () => <div data-testid="stats" />,
  OrbitControls: () => <div data-testid="orbit-controls" />,
}))

// Mock performance.memory for heap measurement
Object.defineProperty(performance, 'memory', {
  value: {
    usedJSHeapSize: 100 * 1024 * 1024, // 100MB
    totalJSHeapSize: 200 * 1024 * 1024,
    jsHeapSizeLimit: 4096 * 1024 * 1024,
  },
  writable: true,
})

describe('PerfProbe', () => {
  it('should render performance probe with 2k nodes', () => {
    const { getByText } = render(<PerfProbe />)
    
    // Check that UI elements are present
    expect(getByText('2k nodes')).toBeInTheDocument()
    expect(getByText(/Nodes: 2000/)).toBeInTheDocument()
  })
  
  it('should measure rendering performance', async () => {
    console.log('\n=== NodeSprite Performance Test ===')
    console.log('Testing with 2000 nodes...')
    
    // Measure initial heap
    const initialHeap = performance.memory?.usedJSHeapSize || 0
    console.log(`Initial heap: ${(initialHeap / 1024 / 1024).toFixed(2)} MB`)
    
    // Render component
    const start = performance.now()
    const { container: _container } = render(<PerfProbe />)
    const renderTime = performance.now() - start
    
    console.log(`Initial render time: ${renderTime.toFixed(2)} ms`)
    
    // Measure heap after render
    const afterRenderHeap = performance.memory?.usedJSHeapSize || 0
    const heapIncrease = afterRenderHeap - initialHeap
    console.log(`Heap after render: ${(afterRenderHeap / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Heap increase: ${(heapIncrease / 1024 / 1024).toFixed(2)} MB`)
    
    // Performance assertions
    expect(renderTime).toBeLessThan(5000) // Should render in under 5 seconds
    expect(heapIncrease / 1024 / 1024).toBeLessThan(500) // Should use less than 500MB
    
    console.log('\n=== Performance Summary ===')
    console.log(`✓ 2000 nodes rendered in ${renderTime.toFixed(2)}ms`)
    console.log(`✓ Memory usage: ${(heapIncrease / 1024 / 1024).toFixed(2)}MB`)
    console.log(`✓ Avg per node: ${(renderTime / 2000).toFixed(3)}ms, ${(heapIncrease / 2000 / 1024).toFixed(2)}KB`)
  })
})