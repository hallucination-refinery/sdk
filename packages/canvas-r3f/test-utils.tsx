import React from 'react'
import { renderHook } from '@testing-library/react'
import { CanvasProvider } from './src/CanvasProvider'

export function renderCanvasHook<T>(callback: () => T) {
  // Create a real DOM node for React 18+ createRoot to attach to,
  // preventing it from throwing "Target container is not a DOM element"
  const container = document.createElement('div')
  document.body.appendChild(container)

  // The wrapper provides the CanvasProvider to the hook being tested
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CanvasProvider>{children}</CanvasProvider>
  )

  // Render the hook with the wrapper. The container will be cleaned up automatically.
  return renderHook(callback, { wrapper })
}
