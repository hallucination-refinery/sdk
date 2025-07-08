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

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => children,
  useThree: vi.fn(() => ({
    camera: {
      position: { x: 0, y: 0, z: 100, set: vi.fn() },
      zoom: 1,
      updateProjectionMatrix: vi.fn()
    }
  })),
  useFrame: vi.fn()
}))

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  PerspectiveCamera: () => null,
  Stats: () => null
}))