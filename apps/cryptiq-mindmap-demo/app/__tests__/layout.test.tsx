import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock Next.js font imports
vi.mock('next/font/google', () => ({
  Geist: () => ({
    variable: '--font-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: '--font-geist-mono',
  }),
}))

// Import after mocking
import RootLayout, { metadata } from '../layout'

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )
    
    const child = container.querySelector('[data-testid="test-child"]')
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent('Test Content')
  })

  it('has correct metadata', () => {
    expect(metadata.title).toBe('Cryptiq Mind Map Demo')
    expect(metadata.description).toBe('Interactive mind map visualization with 1000+ nodes')
  })

  it('renders with proper structure', () => {
    const { container } = render(
      <RootLayout>
        <div>Test</div>
      </RootLayout>
    )
    
    // Check that the component renders without errors
    expect(container).toBeInTheDocument()
  })
})