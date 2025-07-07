import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ControlsHUD from '../ControlsHUD'

describe('ControlsHUD', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders controls information', () => {
    render(<ControlsHUD />)
    
    expect(screen.getByText('Controls')).toBeInTheDocument()
    expect(screen.getByText('WASD/Arrows - Pan camera')).toBeInTheDocument()
    expect(screen.getByText('Q/E or Mouse wheel - Zoom')).toBeInTheDocument()
    expect(screen.getByText('Space - Auto-zoom to center')).toBeInTheDocument()
    expect(screen.getByText('R - Reset camera')).toBeInTheDocument()
    expect(screen.getByText('Click - Select node')).toBeInTheDocument()
    expect(screen.getByText('Drag - Rotate view')).toBeInTheDocument()
  })

  it('starts with opacity 100', () => {
    render(<ControlsHUD />)
    
    const hudElement = screen.getByText('Controls').closest('div')?.parentElement
    expect(hudElement).toHaveClass('opacity-100')
  })

  it('sets up timer to fade out after 8 seconds', () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout')
    
    render(<ControlsHUD />)
    
    // Check that setTimeout was called with 8000ms
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 8000)
    
    setTimeoutSpy.mockRestore()
  })

  it('applies correct styling', () => {
    render(<ControlsHUD />)
    
    const controlsBox = screen.getByText('Controls').closest('div')
    
    expect(controlsBox).toHaveClass(
      'bg-black/90',
      'backdrop-blur-md',
      'rounded-lg',
      'p-4',
      'border',
      'border-white/50'
    )
  })

  it('has fixed positioning at bottom left', () => {
    render(<ControlsHUD />)
    
    const hudElement = screen.getByText('Controls').closest('div')?.parentElement
    
    expect(hudElement).toHaveClass('fixed', 'bottom-8', 'left-8')
  })
})