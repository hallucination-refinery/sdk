// @refinery/canvas-r3f - Entry point
export const version = '0.0.0'

// Components
export { Canvas } from './Canvas'
export { CanvasProvider, useCanvas } from './CanvasProvider'
export { NodeSprite } from './components'
export type { NodeSpriteProps } from './components'

// Re-export types for convenience
export type { RendererCommand } from '@refinery/store'

// Performance testing
export { PerfProbe } from './perf-probe'
