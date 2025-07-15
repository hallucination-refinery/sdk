import React, { forwardRef } from 'react'
// TODO: Remove this adapter once force-graph is replaced with SDK renderer
import ForceGraph3D from 'r3f-forcegraph'

/**
 * ForceGraphAdapter - Thin wrapper around r3f-forcegraph for legacy compatibility
 * 
 * This adapter isolates the force-graph dependency and provides a migration path
 * to the SDK's native renderer. All props are passed through unchanged.
 * 
 * @deprecated Will be removed once Cryptiq Mindmap migrates to SDK renderer
 */

export interface ForceGraphAdapterProps {
  // Core props
  ref?: React.Ref<any>
  graphData: { nodes: any[]; links: any[] }
  
  // Node/Link ID accessors
  nodeId?: string
  linkSource?: string
  linkTarget?: string
  
  // Event handlers
  onNodeClick?: (node: any, event?: any) => void
  onNodeHover?: (node: any | null) => void
  onNodeRightClick?: (node: any, event?: any) => void
  onLinkClick?: (link: any, event?: any) => void
  onLinkHover?: (link: any | null) => void
  onBackgroundClick?: (event?: any) => void
  onBackgroundRightClick?: (event?: any) => void
  
  // Node rendering
  nodeThreeObject?: (node: any) => any
  nodeThreeObjectExtend?: (obj: any, node: any) => boolean
  nodeVisibility?: (node: any) => boolean
  nodeColor?: (node: any) => string
  nodeOpacity?: number
  nodeRelSize?: number
  nodeVal?: (node: any) => number
  nodeLabel?: (node: any) => string
  nodeDesc?: (node: any) => string
  
  // Link rendering
  linkVisibility?: (link: any) => boolean
  linkColor?: (link: any) => string
  linkWidth?: (link: any) => number
  linkCurvature?: number | ((link: any) => number)
  linkCurveRotation?: number | ((link: any) => number)
  linkMaterial?: any
  linkOpacity?: number
  linkResolution?: number
  
  // Force simulation
  d3AlphaDecay?: number
  d3VelocityDecay?: number
  warmupTicks?: number
  cooldownTicks?: number
  cooldownTime?: number
  
  // Camera
  enableNodeDrag?: boolean
  enableNavigationControls?: boolean
  enablePointerInteraction?: boolean
  
  // Performance
  enableZoomPanInteraction?: boolean
  
  // Other
  [key: string]: any
}

export interface ForceGraphAdapterRef {
  // Physics engine methods
  d3Force: (forceName: string, force?: any) => any
  d3ReheatSimulation: () => void
  
  // Data access
  graphData: () => { nodes: any[]; links: any[] }
  
  // Animation control
  tickFrame: () => void
  
  // Camera control
  cameraPosition: (position?: { x?: number; y?: number; z?: number }, lookAt?: { x?: number; y?: number; z?: number }, transitionMs?: number) => void
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: any) => boolean) => void
  
  // Scene access
  scene: () => any
  camera: () => any
  renderer: () => any
  controls: () => any
  
  // Node/Link access
  getGraphBbox: (nodeFilter?: (node: any) => boolean) => { x: [number, number]; y: [number, number]; z: [number, number] }
}

const ForceGraphAdapter = forwardRef<ForceGraphAdapterRef, ForceGraphAdapterProps>((props, ref) => {
  // Pass through all props to the underlying ForceGraph3D component
  return <ForceGraph3D ref={ref} {...props} />
})

ForceGraphAdapter.displayName = 'ForceGraphAdapter'

export default ForceGraphAdapter