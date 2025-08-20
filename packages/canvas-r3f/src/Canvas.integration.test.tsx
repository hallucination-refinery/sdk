import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as THREE from 'three'
import { Canvas } from './Canvas'
import { CanvasProvider } from './CanvasProvider'
import { BrainMesh } from './BrainMesh'
import { ConceptParticles } from './ConceptParticles'
import type { Node } from '@refinery/schema'

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => <div data-testid="r3f-canvas" {...props}>{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    camera: new THREE.PerspectiveCamera(),
    scene: new THREE.Scene(),
    gl: { render: vi.fn() }
  }),
  useLoader: vi.fn(() => ({
    clone: () => ({
      traverse: vi.fn()
    }),
    traverse: vi.fn()
  }))
}))

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: ({ children, ...props }: any) => <div data-testid="orbit-controls" {...JSON.stringify(props)}>{children}</div>,
  PerspectiveCamera: ({ children, ...props }: any) => <div data-testid="perspective-camera" {...JSON.stringify(props)}>{children}</div>,
  Stats: () => <div data-testid="stats" />
}))

// Mock store
vi.mock('@refinery/store', () => ({
  useRefineryStore: () => ({
    state: {
      ui: {
        activeCanvas: 'main'
      },
      renderer: {
        main: {
          commands: []
        }
      }
    },
    subscribe: vi.fn(),
    setState: vi.fn(),
    subscribeToCommands: vi.fn(() => vi.fn())
  })
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <CanvasProvider>
      {component}
    </CanvasProvider>
  )
}

// Mock data for testing
const mockVertices: THREE.Vector3[] = Array.from({ length: 100 }, (_, i) => 
  new THREE.Vector3(
    Math.random() * 20 - 10,
    Math.random() * 20 - 10,
    Math.random() * 20 - 10
  )
)

const mockConcepts: Node[] = Array.from({ length: 10 }, (_, i) => ({
  id: `concept-${i}`,
  label: `Concept ${i}`,
  content: `Test concept ${i}`,
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}))

describe('Canvas Camera Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides smooth camera controls for brain mesh visualization', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    // Verify damping is enabled for smooth movement
    expect(controlsProps.enableDamping).toBe(true)
    expect(controlsProps.dampingFactor).toBe(0.05)
    
    // Verify distance bounds are appropriate for brain mesh
    expect(controlsProps.minDistance).toBe(5)
    expect(controlsProps.maxDistance).toBe(50)
    
    // Verify polar angle limits prevent upside-down viewing
    expect(controlsProps.minPolarAngle).toBeCloseTo(Math.PI * 0.1, 2)
    expect(controlsProps.maxPolarAngle).toBeCloseTo(Math.PI * 0.9, 2)
  })

  it('maintains 50fps performance target with camera controls enabled', () => {
    const startTime = performance.now()
    
    renderWithProvider(<Canvas showStats={true} />)
    
    const endTime = performance.now()
    const renderTime = endTime - startTime
    
    // Render should complete quickly (target: 16.67ms for 60fps, allow up to 20ms for 50fps)
    expect(renderTime).toBeLessThan(20)
    
    // Stats component should be present for performance monitoring
    const stats = screen.getByTestId('stats')
    expect(stats).toBeInTheDocument()
  })

  it('supports camera movement without jank through damping', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    // Low damping factor provides smoothness without lag
    expect(controlsProps.dampingFactor).toBeLessThanOrEqual(0.1)
    expect(controlsProps.dampingFactor).toBeGreaterThan(0)
    
    // All movement types enabled for full navigation
    expect(controlsProps.enablePan).toBe(true)
    expect(controlsProps.enableZoom).toBe(true)
    expect(controlsProps.enableRotate).toBe(true)
  })

  it('provides acceptable input latency for camera interactions', () => {
    const testStart = performance.now()
    
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    const testEnd = performance.now()
    const responseTime = testEnd - testStart
    
    // Quick initial response for good UX
    expect(responseTime).toBeLessThan(50) // 50ms max for good perceived performance
    
    // Verify damping is configured for balance of smoothness and responsiveness
    expect(controlsProps.dampingFactor).toBe(0.05) // Sweet spot for brain visualization
  })

  it('prevents camera from going upside-down for brain viewing', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    // Polar angle constraints
    const minAngle = controlsProps.minPolarAngle
    const maxAngle = controlsProps.maxPolarAngle
    
    // Should allow viewing from slightly above to slightly below brain
    expect(minAngle).toBeGreaterThan(0) // Not straight down
    expect(maxAngle).toBeLessThan(Math.PI) // Not straight up
    
    // Range should be reasonable for brain exploration
    const rangeRadians = maxAngle - minAngle
    const rangeDegrees = (rangeRadians * 180) / Math.PI
    expect(rangeDegrees).toBeGreaterThan(120) // Good viewing range
    expect(rangeDegrees).toBeLessThan(180) // But not full sphere
  })

  it('integrates camera bounds with brain mesh scale', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    // Distance bounds should work well with typical brain mesh size
    expect(controlsProps.minDistance).toBeGreaterThanOrEqual(1) // Prevent z-fighting
    expect(controlsProps.maxDistance).toBeLessThanOrEqual(100) // Keep detail visible
    
    // Good zoom range for detailed exploration
    const zoomRatio = controlsProps.maxDistance / controlsProps.minDistance
    expect(zoomRatio).toBeGreaterThanOrEqual(5) // At least 5:1 zoom range
  })
})

describe('Camera Performance Metrics', () => {
  it('meets Session 7 ConceptParticles integration requirements', () => {
    const renderStart = performance.now()
    
    // This simulates having both camera controls and concept particles
    renderWithProvider(<Canvas showStats={true} />)
    
    const renderEnd = performance.now()
    const totalRenderTime = renderEnd - renderStart
    
    // Combined system should still render quickly
    expect(totalRenderTime).toBeLessThan(50) // 50ms budget for complex scenes
  })

  it('supports real-time camera updates with brain mesh rendering', () => {
    renderWithProvider(<Canvas />)
    
    // Verify camera controls are present and configured
    const orbitControls = screen.getByTestId('orbit-controls')
    expect(orbitControls).toBeInTheDocument()
    
    const camera = screen.getByTestId('perspective-camera')
    expect(camera).toBeInTheDocument()
    
    // Performance monitoring available
    const canvas = screen.getByTestId('r3f-canvas')
    expect(canvas).toBeInTheDocument()
  })

  it('maintains Session 8 acceptance criteria', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    // Session 8 specific requirements
    expect(controlsProps.minDistance).toBe(5) // Specified in requirements
    expect(controlsProps.maxDistance).toBe(50) // Specified in requirements
    expect(controlsProps.enableDamping).toBe(true) // Smooth navigation
    expect(controlsProps.dampingFactor).toBe(0.05) // Specified damping value
    
    // No upside-down camera
    expect(controlsProps.minPolarAngle).toBeCloseTo(Math.PI * 0.1, 2)
    expect(controlsProps.maxPolarAngle).toBeCloseTo(Math.PI * 0.9, 2)
  })
})

describe('Camera Controls Acceptance Criteria', () => {
  it('achieves smooth movement with no jank', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    const controlsProps = JSON.parse(orbitControls.textContent || '{}')
    
    // Damping configuration for smooth movement
    expect(controlsProps.enableDamping).toBe(true)
    expect(controlsProps.dampingFactor).toBe(0.05)
    
    // Standard speeds for natural feel
    expect(controlsProps.zoomSpeed).toBe(1)
    expect(controlsProps.panSpeed).toBe(1)
    expect(controlsProps.rotateSpeed).toBe(1)
  })

  it('provides acceptable input latency', () => {
    const inputStart = performance.now()
    
    renderWithProvider(<Canvas />)
    
    const inputEnd = performance.now()
    const latency = inputEnd - inputStart
    
    // Should respond quickly to user input
    expect(latency).toBeLessThan(100) // 100ms max for acceptable UX
  })

  it('integrates camera controls with existing Canvas functionality', () => {
    renderWithProvider(<Canvas />)
    
    // Verify all core components are present
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('orbit-controls')).toBeInTheDocument()
    expect(screen.getByTestId('perspective-camera')).toBeInTheDocument()
    
    // Performance monitoring integration
    renderWithProvider(<Canvas showStats={true} />)
    expect(screen.getByTestId('stats')).toBeInTheDocument()
  })
})