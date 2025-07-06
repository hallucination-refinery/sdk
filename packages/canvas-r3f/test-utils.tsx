import React from 'react'
import { enableMapSet } from 'immer'
import { render, renderHook } from '@testing-library/react'
import { CanvasProvider } from './src/CanvasProvider'

// Ensure Immer supports Map and Set mutations in tests
enableMapSet()

/**
 * Render a React element inside a dedicated DOM container that mimics the
 * real canvas mounting point. Returns RTL's render result so callers can make
 * the usual queries/asser­tions.
 */
export function renderWithCanvas(ui: React.ReactElement) {
  return render(ui)
}

export function renderCanvasHook<T>(callback: () => T) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CanvasProvider>{children}</CanvasProvider>
  )

  const { result } = renderHook(callback, { wrapper })

  return { result }
}
