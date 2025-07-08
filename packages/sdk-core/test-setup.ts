import '@testing-library/jest-dom'

// Mock Three.js and React Three Fiber
vi.mock('three', () => ({
  Vector3: vi.fn(),
  BufferGeometry: vi.fn(() => ({
    setFromPoints: vi.fn()
  })),
  Line: vi.fn(),
  LineBasicMaterial: vi.fn()
}))

vi.mock('@react-three/fiber', () => {
  const React = require('react')
  return {
    Canvas: ({ children, style, ...props }: any) => React.createElement('div', { 
      'data-testid': 'three-canvas',
      style,
      ...props 
    }, children),
    useThree: vi.fn(() => ({
      camera: {
        position: { x: 0, y: 0, z: 100, set: vi.fn() },
        zoom: 1,
        updateProjectionMatrix: vi.fn()
      }
    })),
    useFrame: vi.fn()
  }
})

vi.mock('@react-three/drei', () => {
  const React = require('react')
  return {
    OrbitControls: () => null,
    PerspectiveCamera: () => null,
    Stats: () => React.createElement('div', { 'data-testid': 'mock-stats' }, 'Stats')
  }
})