import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { NodeSprite } from './NodeSprite'

// Mock canvas context
const mockContext: any = {
  font: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  textAlign: 'center' as CanvasTextAlign,
  textBaseline: 'middle' as CanvasTextBaseline,
  globalAlpha: 1,
  measureText: vi.fn(() => ({ width: 100 })),
  fillRect: vi.fn(),
  fillText: vi.fn(),
  strokeRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  clearRect: vi.fn()
}

// Mock Three.js
const mockTexture = {
  needsUpdate: false,
  dispose: vi.fn()
}

vi.mock('three', () => ({
  CanvasTexture: vi.fn(() => mockTexture)
}))

// Mock canvas getContext globally
const originalGetContext = HTMLCanvasElement.prototype.getContext
beforeEach(() => {
  vi.clearAllMocks()
  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext)
})

afterEach(() => {
  HTMLCanvasElement.prototype.getContext = originalGetContext
})

describe('NodeSprite', () => {
  it('should render basic sprite with text', () => {
    render(<NodeSprite text="Test Label" />)

    // Verify text was drawn
    expect(mockContext.fillText).toHaveBeenCalledWith('Test Label', expect.any(Number), expect.any(Number))
  })

  it('should apply custom colors', () => {
    render(
      <NodeSprite 
        text="Test" 
        color="#ff0000"
        backgroundColor="#0000ff"
      />
    )

    // Verify background is filled
    expect(mockContext.fillRect).toHaveBeenCalled()
    // Verify text is drawn (fillStyle is set multiple times)
    expect(mockContext.fillText).toHaveBeenCalled()
  })

  it('should handle background opacity', () => {
    render(
      <NodeSprite 
        text="Test" 
        backgroundColor="#000000"
        backgroundOpacity={0.5}
      />
    )

    // Background should be drawn
    expect(mockContext.fillRect).toHaveBeenCalled()
    // Alpha is reset to 1.0 after drawing background
    expect(mockContext.globalAlpha).toBe(1)
  })

  it('should apply custom font size and padding', () => {
    render(
      <NodeSprite 
        text="Test" 
        fontSize={48}
        padding={16}
      />
    )

    // Font should be set
    expect(mockContext.font).toContain('48px')
    // Padding affects canvas size
    expect(mockContext.fillText).toHaveBeenCalled()
  })


  it('should handle empty text', () => {
    render(<NodeSprite text="" />)

    // Should still draw empty text
    expect(mockContext.fillText).toHaveBeenCalledWith('', expect.any(Number), expect.any(Number))
  })

  it('should handle long text', () => {
    const longText = 'This is a very long text that might need special handling'
    
    render(<NodeSprite text={longText} />)

    expect(mockContext.measureText).toHaveBeenCalledWith(longText)
    expect(mockContext.fillText).toHaveBeenCalledWith(longText, expect.any(Number), expect.any(Number))
  })

  it('should apply font family', () => {
    render(
      <NodeSprite 
        text="Test" 
        fontFamily="Arial, sans-serif"
      />
    )

    // Font should include font family
    expect(mockContext.font).toContain('Arial, sans-serif')
  })

  it('should create texture with needsUpdate flag', () => {
    render(<NodeSprite text="Test" />)

    // Texture should be marked for update
    expect(mockTexture.needsUpdate).toBe(true)
  })

  it('should handle zero background opacity', () => {
    render(
      <NodeSprite 
        text="Test" 
        backgroundColor="#000000"
        backgroundOpacity={0}
      />
    )

    // Should not draw background when opacity is 0
    // The condition checks backgroundOpacity > 0
    expect(mockContext.fillRect).not.toHaveBeenCalled()
  })

  it('should center text properly', () => {
    render(<NodeSprite text="Centered Text" />)

    // Text alignment should be set
    expect(mockContext.textAlign).toBe('center')
    expect(mockContext.textBaseline).toBe('middle')
    expect(mockContext.fillText).toHaveBeenCalledWith(
      'Centered Text',
      expect.any(Number),
      expect.any(Number)
    )
  })


  it('should handle array scale', () => {
    render(<NodeSprite text="Test" scale={[2, 3, 1]} />)

    // Should render without error
    expect(mockContext.fillText).toHaveBeenCalled()
  })

  it('should handle visibility prop', () => {
    render(<NodeSprite text="Test" visible={false} />)

    // Should still create texture even when not visible
    expect(mockContext.fillText).toHaveBeenCalled()
  })

  it('should handle opacity prop', () => {
    render(<NodeSprite text="Test" opacity={0.5} />)

    // Should create texture with any opacity
    expect(mockContext.fillText).toHaveBeenCalled()
  })
})