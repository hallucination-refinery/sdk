import React, { forwardRef, useMemo, useEffect } from 'react'
// TODO: Remove this adapter once force-graph is replaced with SDK renderer
import ForceGraph3D from 'r3f-forcegraph'

// ---------------------------------------------------------------------------
// TEMP MONKEY‑PATCH (remove once ForceGraph is fully retired)
//
// three‑forcegraph/d3‑force‑3d freezes node objects when the simulation
// cools.  Later, when forces try to mutate `vx`, `vy`, or `vz`, React
// surfaces a "Cannot assign to read only property 'vx'" crash.  We
// override `Object.freeze` so that it becomes a no‑op **only** for
// objects that look like physics nodes (i.e. they already have `vx`,
// `vy`, and `vz` numeric props).  All other objects are frozen
// normally by delegating to the original implementation.
// ---------------------------------------------------------------------------
const __origFreeze = Object.freeze
Object.freeze = function (obj: any) {
  if (obj && typeof obj === 'object' && 'vx' in obj && 'vy' in obj && 'vz' in obj) {
    // Skip freezing physics node objects
    return obj
  }
  return __origFreeze(obj)
}
// ---------------------------------------------------------------------------

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

  // Camera
  enableNodeDrag?: boolean
  enableNavigationControls?: boolean
  enablePointerInteraction?: boolean

  // Performance
  enableZoomPanInteraction?: boolean

  // Freeze crash guard
  disableLinkForce?: boolean // defaults to false

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
  cameraPosition: (
    position?: { x?: number; y?: number; z?: number },
    lookAt?: { x?: number; y?: number; z?: number },
    transitionMs?: number
  ) => void
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: any) => boolean) => void

  // Scene access
  scene: () => any
  camera: () => any
  renderer: () => any
  controls: () => any

  // Node/Link access
  getGraphBbox: (nodeFilter?: (node: any) => boolean) => {
    x: [number, number]
    y: [number, number]
    z: [number, number]
  }
}

/**
 * ForceGraphAdapter - Thin wrapper around r3f-forcegraph for legacy compatibility
 *
 * This adapter isolates the force-graph dependency and provides a migration path
 * to the SDK's native renderer. All props are passed through unchanged.
 *
 * @deprecated Will be removed once Cryptiq Mindmap migrates to SDK renderer
 */
const ForceGraphAdapter = forwardRef<ForceGraphAdapterRef, ForceGraphAdapterProps>((props, ref) => {
  console.log('[FGAdapter] mounted')
  const { graphData, dataVersion = 0, disableLinkForce, ...restProps } = props
  const safeGraphData = useMemo(() => structuredClone(graphData), [dataVersion])
  // --- freeze-crash guard ----------------------------------------------
  useEffect(() => {
    if (disableLinkForce) {
      ;(ref as React.RefObject<any>).current?.d3Force('link', null)
    }
  }, [disableLinkForce, ref])
  // ----------------------------------------------------------------------

  return (
    // @ts-expect-error - ForceGraph3D has its own ref type that we're wrapping
    <ForceGraph3D
      ref={ref}
      {...restProps} /* all user props EXCEPT graphData */
      graphData={safeGraphData} /* deep‑cloned, unfrozen data       */
      cooldownTime={Infinity} /* time‑freeze guard  */
      cooldownTicks={0} /* tick‑freeze guard  */
      d3AlphaDecay={0} /* alpha‑freeze guard */
      onEngineStop={() => {
        const api = (ref as React.RefObject<any>).current
        api?.d3AlphaTarget?.(0.3)?.restart?.()
      }}
    />
  )
})

ForceGraphAdapter.displayName = 'ForceGraphAdapter'

export default ForceGraphAdapter
