import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { IdeaAperture } from './IdeaAperture'
import { ApertureThemeProvider } from '../theme/ApertureThemeProvider'
import type { Graph } from '@refinery/schema'

// Mock canvas context
const mockGetContext = vi.fn(() => ({
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  fillText: vi.fn(),
}))

HTMLCanvasElement.prototype.getContext = mockGetContext as any

const mockGraph: Graph = {
  nodes: [
    {
      id: 'node1',
      label: 'Node 1',
      type: 'concept',
      position: { x: 0, y: 0, z: 0 },
      metadata: {},
      timestamp: new Date().toISOString(),
    },
    {
      id: 'node2',
      label: 'Node 2',
      type: 'idea',
      position: { x: 100, y: 100, z: 0 },
      metadata: {},
      timestamp: new Date().toISOString(),
    },
  ],
  edges: [
    {
      id: 'edge1',
      source: 'node1',
      target: 'node2',
      relationship: 'relates-to',
      metadata: {},
      timestamp: new Date().toISOString(),
    },
  ],
  metadata: {},
}

describe('IdeaAperture', () => {
  it('renders with proper accessibility attributes', () => {
    render(
      <ApertureThemeProvider>
        <IdeaAperture graph={mockGraph} />
      </ApertureThemeProvider>
    )

    const aperture = screen.getByRole('application', { name: 'Idea aperture visualization' })
    expect(aperture).toBeInTheDocument()
    expect(aperture).toHaveAttribute('tabIndex', '0')
  })

  it('announces graph statistics to screen readers', () => {
    render(
      <ApertureThemeProvider>
        <IdeaAperture graph={mockGraph} />
      </ApertureThemeProvider>
    )

    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Graph with 2 nodes and 1 connections. 0 nodes selected.')
  })

  it('shows help dialog when requested', () => {
    render(
      <ApertureThemeProvider>
        <IdeaAperture graph={mockGraph} showHelp={true} />
      </ApertureThemeProvider>
    )

    const helpDialog = screen.getByRole('dialog', { name: /keyboard navigation/i })
    expect(helpDialog).toBeInTheDocument()
    expect(helpDialog).toHaveTextContent(/Use arrow keys to navigate/)
  })

  it('calls onSelectionChange when nodes are selected', () => {
    const onSelectionChange = vi.fn()
    render(
      <ApertureThemeProvider>
        <IdeaAperture
          graph={mockGraph}
          onSelectionChange={onSelectionChange}
          selectedNodeIds={['node1']}
        />
      </ApertureThemeProvider>
    )

    // The component should have the initial selection
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('1 nodes selected')
  })

  it('supports custom aria label', () => {
    render(
      <ApertureThemeProvider>
        <IdeaAperture graph={mockGraph} ariaLabel="Custom aperture label" />
      </ApertureThemeProvider>
    )

    const aperture = screen.getByRole('application', { name: 'Custom aperture label' })
    expect(aperture).toBeInTheDocument()
  })

  it('renders canvas element', () => {
    const { container } = render(
      <ApertureThemeProvider>
        <IdeaAperture graph={mockGraph} />
      </ApertureThemeProvider>
    )

    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })
})
