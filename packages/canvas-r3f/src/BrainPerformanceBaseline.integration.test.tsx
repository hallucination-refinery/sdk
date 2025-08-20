import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { BrainPerformanceBaseline } from './BrainPerformanceBaseline'

// Mock Three.js components
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="canvas">{children}</div>,
  useThree: () => ({ gl: { info: { render: { calls: 5 } } } }),
  useFrame: vi.fn()
}))

vi.mock('@react-three/drei', () => ({
  Stats: () => <div data-testid="stats" />,
  OrbitControls: () => <div data-testid="controls" />
}))

vi.mock('./BrainMesh', () => ({
  BrainMesh: () => <div data-testid="brain-mesh" />
}))

vi.mock('./ConceptParticles', () => ({
  ConceptParticles: () => <div data-testid="concept-particles" />
}))

// Mock fetch
global.fetch = vi.fn().mockResolvedValue({
  json: () => Promise.resolve({
    concepts: Array.from({ length: 100 }, (_, i) => ({
      id: `concept-${i}`,
      label: `Concept ${i}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  })
})

describe('BrainPerformanceBaseline Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render without crashing', () => {
    expect(() => {
      render(<BrainPerformanceBaseline />)
    }).not.toThrow()
  })

  it('should contain all required UI elements', () => {
    render(<BrainPerformanceBaseline />)
    
    // Core UI elements
    expect(screen.getByText('🧠 Brain Performance Baseline')).toBeInTheDocument()
    expect(screen.getByText('Concepts:')).toBeInTheDocument()
    expect(screen.getByText('FPS:')).toBeInTheDocument()
    expect(screen.getByText('Memory:')).toBeInTheDocument()
    expect(screen.getByText('Draw Calls:')).toBeInTheDocument()
    
    // Three.js components
    expect(screen.getByTestId('canvas')).toBeInTheDocument()
    expect(screen.getByTestId('stats')).toBeInTheDocument()
    expect(screen.getByTestId('controls')).toBeInTheDocument()
    expect(screen.getByTestId('brain-mesh')).toBeInTheDocument()
  })

  it('should have concept count controls', () => {
    render(<BrainPerformanceBaseline />)
    
    // Concept count buttons
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('2000')).toBeInTheDocument()
    
    // Benchmark control
    expect(screen.getByText('🚀 Run Benchmark')).toBeInTheDocument()
  })

  it('should export performance monitoring capabilities', () => {
    // Verify the component exports expected functionality
    expect(BrainPerformanceBaseline).toBeDefined()
    expect(typeof BrainPerformanceBaseline).toBe('function')
  })
})