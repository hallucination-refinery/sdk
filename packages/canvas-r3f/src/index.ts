// @refinery/canvas-r3f - Entry point
export const version = '0.0.0'

// Components
export { Canvas } from './Canvas'
export { CanvasProvider, useCanvas } from './CanvasProvider'
export { NodeSprite, BrainMesh, BrainMeshWithFallback, BrainRegionDebug, BrainRegionStats } from './components'
export { ConceptParticles } from './ConceptParticles'
export type { ConceptParticlesProps } from './ConceptParticles'
export type { NodeSpriteProps, BrainMeshProps, BrainRegionDebugProps } from './components'

// Vertex mapping utilities
export * from './VertexMapper'
export { useBrainVertices } from './hooks/useBrainVertices'
export type { BrainVerticesState } from './hooks/useBrainVertices'

// Re-export types for convenience
export type { RendererCommand } from '@refinery/store'

// Performance testing
export { PerfProbe } from './perf-probe'
export { BrainPerformanceBaseline } from './BrainPerformanceBaseline'

// Session 12: Integration Testing
export { default as BrainIntegrationTest, BasicIntegrationTest, StressIntegrationTest, EdgeCaseIntegrationTest } from './BrainIntegrationTest'
export type { BrainIntegrationTestProps } from './BrainIntegrationTest'

// Session 13: Demo & Documentation - Enhanced UI Components
export { LoadingIndicator, LoadingText } from './LoadingIndicator'
export { Canvas3DErrorBoundary, UIErrorBoundary, withErrorBoundary, useErrorHandler, BrainMeshLoadError, ConceptMappingError, PerformanceError } from './ErrorBoundary'
export type { LoadingIndicatorProps } from './LoadingIndicator'
export type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary'

// Adapters
export * from './adapters'
