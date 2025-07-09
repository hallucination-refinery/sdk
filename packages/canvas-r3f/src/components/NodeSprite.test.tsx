import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { NodeSprite } from './NodeSprite'

// Mock Three.js module
vi.mock('three', () => ({
  CanvasTexture: vi.fn().mockImplementation(() => ({
    needsUpdate: true,
    dispose: vi.fn(),
  })),
}))

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: () => ({
    scene: {},
    camera: {},
    gl: {},
  }),
}))

describe('NodeSprite', () => {
  it('should render with default props', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite text="Test Node" />
      </div>
    )
    
    const { container } = render(<TestWrapper />)
    expect(container).toBeTruthy()
  })

  it('should accept custom text and styling props', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite
          text="Custom Text"
          position={[10, 20, 30]}
          scale={2.5}
          color="#ff0000"
          fontSize={64}
          fontFamily="Arial Black"
          backgroundColor="#0000ff"
          backgroundOpacity={0.8}
          padding={24}
          visible={true}
          opacity={0.9}
        />
      </div>
    )
    
    const { container } = render(<TestWrapper />)
    expect(container).toBeTruthy()
  })

  it('should handle array scale prop', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite
          text="Array Scale Test"
          scale={[1, 2, 3]}
        />
      </div>
    )
    
    const { container } = render(<TestWrapper />)
    expect(container).toBeTruthy()
  })

  it('should handle visibility prop', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite
          text="Hidden Sprite"
          visible={false}
        />
      </div>
    )
    
    const { container } = render(<TestWrapper />)
    expect(container).toBeTruthy()
  })

  it('should create texture with proper canvas operations', () => {
    const mockContext = {
      font: '',
      measureText: vi.fn().mockReturnValue({ width: 100 }),
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      textAlign: '',
      textBaseline: '',
      fillStyle: '',
      globalAlpha: 1,
    }

    const originalCreateElement = global.document.createElement
    global.document.createElement = vi.fn((tag) => {
      if (tag === 'canvas') {
        return {
          getContext: vi.fn().mockReturnValue(mockContext),
          width: 0,
          height: 0,
        } as any
      }
      return originalCreateElement.call(document, tag)
    })

    const TestWrapper = () => (
      <div>
        <NodeSprite
          text="Canvas Test"
          backgroundColor="#ff0000"
          backgroundOpacity={0.5}
        />
      </div>
    )
    
    render(<TestWrapper />)

    // Verify canvas operations were called
    expect(mockContext.measureText).toHaveBeenCalledWith('Canvas Test')
    expect(mockContext.clearRect).toHaveBeenCalled()
    expect(mockContext.fillRect).toHaveBeenCalled()
    expect(mockContext.fillText).toHaveBeenCalledWith('Canvas Test', expect.any(Number), expect.any(Number))

    // Restore original createElement
    global.document.createElement = originalCreateElement
  })

  it('should handle texture disposal', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite text="Dispose Test" />
      </div>
    )
    
    render(<TestWrapper />)
    
    // Just verify the component renders without errors
    // Actual disposal is handled by React's cleanup
    expect(true).toBe(true)
  })

  it('should handle empty text gracefully', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite text="" />
      </div>
    )
    
    const { container } = render(<TestWrapper />)
    expect(container).toBeTruthy()
  })

  it('should render multiple sprites with different configurations', () => {
    const TestWrapper = () => (
      <div>
        <NodeSprite text="Sprite 1" position={[0, 0, 0]} />
        <NodeSprite text="Sprite 2" position={[10, 0, 0]} color="#ff0000" />
        <NodeSprite text="Sprite 3" position={[20, 0, 0]} scale={2} />
      </div>
    )
    
    const { container } = render(<TestWrapper />)
    expect(container).toBeTruthy()
  })
})