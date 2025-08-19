// @refinery/canvas-r3f - Entry point
export const version = '0.0.0'

// Components
export { Canvas } from './Canvas'
export { CanvasProvider, useCanvas } from './CanvasProvider'
export { NodeSprite, BrainMesh, BrainMeshWithFallback, BrainRegionDebug, BrainRegionStats } from './components'
export type { NodeSpriteProps, BrainMeshProps, BrainRegionDebugProps } from './components'

// Vertex mapping utilities
export * from './VertexMapper'
export { useBrainVertices } from './hooks/useBrainVertices'
export type { BrainVerticesState } from './hooks/useBrainVertices'

// Re-export types for convenience
export type { RendererCommand } from '@refinery/store'

// Performance testing
export { PerfProbe } from './perf-probe'

// Adapters
export * from './adapters'
