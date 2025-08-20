import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as THREE from 'three'
import { Canvas } from './Canvas'
import { CanvasProvider } from './CanvasProvider'

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => <div data-testid="r3f-canvas" {...props}>{children}</div>,
  useFrame: vi.fn(),
  useThree: () => ({
    camera: new THREE.PerspectiveCamera(),
    scene: new THREE.Scene(),
    gl: { render: vi.fn() }
  }),
  useLoader: vi.fn()
}))

// Mock @react-three/drei
vi.mock('@react-three/drei', () => ({
  OrbitControls: ({ children, ...props }: any) => <div data-testid="orbit-controls" {...props}>{children}</div>,
  PerspectiveCamera: ({ children, ...props }: any) => <div data-testid="perspective-camera" {...props}>{children}</div>,
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
    subscribeToCommands: vi.fn(() => vi.fn()) // Returns unsubscribe function
  })
}))

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <CanvasProvider>
      {component}
    </CanvasProvider>
  )
}

describe('Canvas Camera Controls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders Canvas with enhanced OrbitControls', () => {
    renderWithProvider(<Canvas />)
    
    const canvas = screen.getByTestId('r3f-canvas')
    expect(canvas).toBeInTheDocument()
    
    const orbitControls = screen.getByTestId('orbit-controls')
    expect(orbitControls).toBeInTheDocument()
  })

  it('configures OrbitControls with Session 8 specifications', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    // Check min/max distance
    expect(orbitControls).toHaveAttribute('minDistance', '5')
    expect(orbitControls).toHaveAttribute('maxDistance', '50')
    
    // Check polar angle limits (no upside-down)
    expect(orbitControls).toHaveAttribute('minPolarAngle', String(Math.PI * 0.1))
    expect(orbitControls).toHaveAttribute('maxPolarAngle', String(Math.PI * 0.9))
    
    // Check damping
    expect(orbitControls).toHaveAttribute('enableDamping', 'true')
    expect(orbitControls).toHaveAttribute('dampingFactor', '0.05')
    
    // Check basic controls enabled
    expect(orbitControls).toHaveAttribute('enablePan', 'true')
    expect(orbitControls).toHaveAttribute('enableZoom', 'true')
    expect(orbitControls).toHaveAttribute('enableRotate', 'true')
  })

  it('renders with PerspectiveCamera configuration', () => {
    renderWithProvider(<Canvas />)
    
    const camera = screen.getByTestId('perspective-camera')
    expect(camera).toBeInTheDocument()
    expect(camera).toHaveAttribute('makeDefault', 'true')
  })

  it('handles camera movement without jank', () => {
    const onCameraMove = vi.fn()
    
    renderWithProvider(<Canvas />)
    
    // Camera controls should be smooth with damping
    const orbitControls = screen.getByTestId('orbit-controls')
    expect(orbitControls).toHaveAttribute('enableDamping', 'true')
    expect(orbitControls).toHaveAttribute('dampingFactor', '0.05')
  })

  it('supports stats display for performance monitoring', () => {
    renderWithProvider(<Canvas showStats={true} />)
    
    const stats = screen.getByTestId('stats')
    expect(stats).toBeInTheDocument()
  })

  it('maintains acceptable zoom bounds for brain visualization', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    // MinDistance of 5 prevents too close zoom that would make brain unusable
    expect(orbitControls).toHaveAttribute('minDistance', '5')
    
    // MaxDistance of 50 prevents zooming out so far that details are lost
    expect(orbitControls).toHaveAttribute('maxDistance', '50')
  })

  it('prevents camera from going upside-down', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    // Polar angle limits prevent upside-down camera orientation
    const minPolarAngle = parseFloat(orbitControls.getAttribute('minPolarAngle') || '0')
    const maxPolarAngle = parseFloat(orbitControls.getAttribute('maxPolarAngle') || '0')
    
    // Should allow viewing from slightly above (18°) to slightly below (162°)
    expect(minPolarAngle).toBeCloseTo(Math.PI * 0.1, 2)
    expect(maxPolarAngle).toBeCloseTo(Math.PI * 0.9, 2)
    
    // Should not allow full 0-π range (which would include upside-down)
    expect(minPolarAngle).toBeGreaterThan(0)
    expect(maxPolarAngle).toBeLessThan(Math.PI)
  })

  it('configures smooth damping for natural camera movement', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    expect(orbitControls).toHaveAttribute('enableDamping', 'true')
    
    // 0.05 damping provides good balance between responsiveness and smoothness
    const dampingFactor = parseFloat(orbitControls.getAttribute('dampingFactor') || '0')
    expect(dampingFactor).toBe(0.05)
  })

  it('enables all required control types', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    expect(orbitControls).toHaveAttribute('enablePan', 'true')
    expect(orbitControls).toHaveAttribute('enableZoom', 'true')
    expect(orbitControls).toHaveAttribute('enableRotate', 'true')
  })

  it('maintains standard speed settings for good UX', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    expect(orbitControls).toHaveAttribute('zoomSpeed', '1')
    expect(orbitControls).toHaveAttribute('panSpeed', '1')
    expect(orbitControls).toHaveAttribute('rotateSpeed', '1')
  })
})

describe('Canvas Camera Performance', () => {
  it('should maintain acceptable input latency with damping', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    // Low damping factor (0.05) ensures responsive controls
    const dampingFactor = parseFloat(orbitControls.getAttribute('dampingFactor') || '0')
    expect(dampingFactor).toBeLessThanOrEqual(0.1) // Should be responsive
    expect(dampingFactor).toBeGreaterThan(0) // But still provide smoothing
  })

  it('should have reasonable distance bounds for brain mesh scale', () => {
    renderWithProvider(<Canvas />)
    
    const orbitControls = screen.getByTestId('orbit-controls')
    
    const minDistance = parseInt(orbitControls.getAttribute('minDistance') || '0')
    const maxDistance = parseInt(orbitControls.getAttribute('maxDistance') || '0')
    
    // Distance bounds should provide good viewing range for brain mesh
    expect(minDistance).toBeGreaterThanOrEqual(1) // Prevent z-fighting
    expect(maxDistance).toBeLessThanOrEqual(100) // Keep details visible
    expect(maxDistance / minDistance).toBeGreaterThanOrEqual(5) // Good zoom range
  })
})