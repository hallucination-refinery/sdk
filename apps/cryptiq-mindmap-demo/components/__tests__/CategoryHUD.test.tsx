import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import CategoryHUD from '../CategoryHUD'

describe('CategoryHUD', () => {
  const mockNodes = [
    { id: '1', label: 'Technology Topic 1' },
    { id: '2', label: 'Science Topic 1' },
    { id: '3', label: 'Business Topic 1' },
    { id: '4', label: 'Technology Topic 2' },
    { id: '5', label: 'Design Topic 1' },
    { id: '6', label: 'Random Node' },
  ]

  it('renders category chips for unique categories', () => {
    render(<CategoryHUD nodes={mockNodes} />)
    
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('starts with all categories active', () => {
    const onCategoriesChange = vi.fn()
    render(<CategoryHUD nodes={mockNodes} onCategoriesChange={onCategoriesChange} />)
    
    expect(onCategoriesChange).toHaveBeenCalledWith(
      new Set(['Business', 'Design', 'Science', 'Technology'])
    )
  })

  it('toggles category on chip click', () => {
    const onCategoriesChange = vi.fn()
    render(<CategoryHUD nodes={mockNodes} onCategoriesChange={onCategoriesChange} />)
    
    const techChip = screen.getByText('Technology')
    fireEvent.click(techChip)
    
    expect(onCategoriesChange).toHaveBeenLastCalledWith(
      new Set(['Business', 'Design', 'Science'])
    )
  })

  it('resets all categories when reset button is clicked', () => {
    const onCategoriesChange = vi.fn()
    render(<CategoryHUD nodes={mockNodes} onCategoriesChange={onCategoriesChange} />)
    
    // First deactivate a category
    const techChip = screen.getByText('Technology')
    fireEvent.click(techChip)
    
    // Then reset
    const resetButton = screen.getByText('Reset filters')
    fireEvent.click(resetButton)
    
    expect(onCategoriesChange).toHaveBeenLastCalledWith(
      new Set(['Business', 'Design', 'Science', 'Technology'])
    )
  })

  it('renders reset button when categories exist', () => {
    render(<CategoryHUD nodes={mockNodes} />)
    expect(screen.getByText('Reset filters')).toBeInTheDocument()
  })

  it('handles empty nodes array', () => {
    render(<CategoryHUD nodes={[]} />)
    expect(screen.queryByText('Reset filters')).not.toBeInTheDocument()
  })

  it('applies correct classes to active chips', () => {
    render(<CategoryHUD nodes={mockNodes} />)
    
    const techChip = screen.getByText('Technology')
    const chipButton = techChip.closest('button')
    
    expect(chipButton).toHaveClass('shadow-lg', 'transform', 'scale-105')
    expect(chipButton).not.toHaveClass('opacity-60')
  })

  it('applies correct classes to inactive chips', () => {
    render(<CategoryHUD nodes={mockNodes} />)
    
    const techChip = screen.getByText('Technology')
    fireEvent.click(techChip)
    
    const chipButton = techChip.closest('button')
    
    expect(chipButton).toHaveClass('opacity-60')
    expect(chipButton).not.toHaveClass('shadow-lg', 'transform', 'scale-105')
  })
})