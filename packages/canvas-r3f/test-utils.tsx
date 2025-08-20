import React from 'react'
import { enableMapSet } from 'immer'
import { render, renderHook } from '@testing-library/react'
import { Canvas } from '@react-three/fiber'
import { CanvasProvider } from './src/CanvasProvider'

// Ensure Immer supports Map and Set mutations in tests
enableMapSet()

// Add ResizeObserver polyfill for R3F
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = MockResizeObserver as any
}

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

/**
 * Render component inside R3F Canvas for testing Three.js components
 */
export function renderWithR3F(ui: React.ReactElement, canvasProps: any = {}) {
  return render(
    <Canvas 
      gl={{ preserveDrawingBuffer: false }} 
      camera={{ position: [0, 0, 5] }}
      {...canvasProps}
    >
      {ui}
    </Canvas>
  )
}
