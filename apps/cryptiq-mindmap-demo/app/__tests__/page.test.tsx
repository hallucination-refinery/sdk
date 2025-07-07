import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from '../page'

// Mock the IdeaAperture component since it depends on Three.js
vi.mock('@refinery/widget-aperture', () => ({
  IdeaAperture: ({ graph, ariaLabel }: any) => (
    <div data-testid="idea-aperture" aria-label={ariaLabel} data-nodes={graph.nodes.length} data-edges={graph.edges.length}>
      Mindmap visualization
    </div>
  ),
  ApertureThemeProvider: ({ children }: any) => <>{children}</>,
}))

describe('Home Page', () => {
  it('renders the IdeaAperture component', () => {
    render(<Home />)
    
    const aperture = screen.getByTestId('idea-aperture')
    expect(aperture).toBeInTheDocument()
    expect(aperture).toHaveAttribute('aria-label', 'Cryptiq Mind Map Demo')
  })

  it('generates 1k nodes graph', () => {
    render(<Home />)
    
    const aperture = screen.getByTestId('idea-aperture')
    const nodeCount = parseInt(aperture.getAttribute('data-nodes') || '0')
    
    // Should generate around 1000 nodes (1014 based on our algorithm)
    expect(nodeCount).toBeGreaterThan(1000)
    expect(nodeCount).toBeLessThan(1050)
  })

  it('renders CategoryHUD component', () => {
    render(<Home />)
    
    // CategoryHUD should show reset button when categories exist
    expect(screen.getByText('Reset filters')).toBeInTheDocument()
  })

  it('renders ControlsHUD component', () => {
    render(<Home />)
    
    expect(screen.getByText('Controls')).toBeInTheDocument()
    expect(screen.getByText('WASD/Arrows - Pan camera')).toBeInTheDocument()
  })

  it('filters nodes when categories are toggled', () => {
    render(<Home />)
    
    // Find and click Technology category to deactivate it
    const techChip = screen.getByText('Technology')
    fireEvent.click(techChip)
    
    // The IdeaAperture should receive filtered graph
    const aperture = screen.getByTestId('idea-aperture')
    const nodeCount = parseInt(aperture.getAttribute('data-nodes') || '0')
    
    // Should have fewer nodes after filtering
    expect(nodeCount).toBeLessThan(1000)
  })

  it('restores all nodes when reset is clicked', () => {
    render(<Home />)
    
    // First deactivate a category
    const techChip = screen.getByText('Technology')
    fireEvent.click(techChip)
    
    // Then reset
    const resetButton = screen.getByText('Reset filters')
    fireEvent.click(resetButton)
    
    // Should have all nodes again
    const aperture = screen.getByTestId('idea-aperture')
    const nodeCount = parseInt(aperture.getAttribute('data-nodes') || '0')
    
    expect(nodeCount).toBeGreaterThan(1000)
  })

  it('applies correct layout styling', () => {
    const { container } = render(<Home />)
    
    const main = container.querySelector('main')
    expect(main).toHaveClass('w-screen', 'h-screen')
  })
})