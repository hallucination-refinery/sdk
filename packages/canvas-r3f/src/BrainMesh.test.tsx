import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import { BrainMesh, BrainMeshWithFallback } from './BrainMesh'

describe('BrainMesh', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Canvas>
        <BrainMesh />
      </Canvas>
    )
    expect(container).toBeTruthy()
  })

  it('accepts custom props', () => {
    const { container } = render(
      <Canvas>
        <BrainMesh
          position={[1, 2, 3]}
          scale={2}
          rotation={[0, Math.PI / 2, 0]}
          wireframeColor="#ff0000"
          opacity={0.5}
          visible={false}
          modelPath="/custom/path/brain.obj"
        />
      </Canvas>
    )
    expect(container).toBeTruthy()
  })

  it('renders with fallback wrapper', () => {
    const { container } = render(
      <Canvas>
        <BrainMeshWithFallback />
      </Canvas>
    )
    expect(container).toBeTruthy()
  })
})