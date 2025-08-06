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
  // console.log('[FGAdapter] mounted')  // COMMENTED OUT: Render-phase console.log
  // console.log('[FGAdapter] ref type:', ref)  // COMMENTED OUT: Render-phase console.log
  // console.log('[FGAdapter] typeof ref:', typeof ref)  // COMMENTED OUT: Render-phase console.log
  
  const { graphData, dataVersion = 0, disableLinkForce, ...restProps } = props
  const safeGraphData = useMemo(() => {
    // console.log('[ForceGraphAdapter] Creating safe data for version:', dataVersion)  // COMMENTED OUT: Render-phase console.log
    return structuredClone(graphData)
  }, [graphData, dataVersion]) // Both dependencies for proper tracking
  // --- freeze-crash guard ----------------------------------------------
  useEffect(() => {
    if (disableLinkForce) {
      ;(ref as React.RefObject<any>).current?.d3Force('link', null)
    }
  }, [disableLinkForce, ref])
  // ----------------------------------------------------------------------
  
  // Expose ref.current to window.__FG unconditionally after mount
  useEffect(() => {
    console.log('[FGAdapter] ref after mount:', ref)
    if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
      console.log('[FGAdapter] ref.current:', ref.current)
      console.log('[FGAdapter] ref.current keys:', Object.keys(ref.current || {}))
      console.log('[FGAdapter] Assigning window.__FG = ref.current')
      ;(window as any).__FG = ref.current
      console.log('[FGAdapter] window.__FG assigned successfully')
      console.log('[CLAUDE] ready-for-smoke-screen')
    }
  }, [ref])

  // Critical: Call refresh() when data changes to trigger re-render
  useEffect(() => {
    if (ref && typeof ref === 'object' && 'current' in ref && ref.current) {
      // Edge case: Check if data exists and has nodes before calling refresh
      if (!safeGraphData || !safeGraphData.nodes || safeGraphData.nodes.length === 0) {
        console.log('[FGAdapter] Skipping refresh - no data or empty nodes array')
        return
      }
      
      console.log('[FGAdapter] Data changed, calling refresh()', {
        nodeCount: safeGraphData.nodes.length,
        linkCount: safeGraphData.links?.length || 0
      })
      
      // Check if refresh method exists (it should according to r3f-forcegraph API)
      if (typeof (ref.current as any).refresh === 'function') {
        try {
          (ref.current as any).refresh()
          console.log('[FGAdapter] Called ref.current.refresh() successfully')
          
          // Also update window.__FG reference in case it changed
          if ((window as any).__FG !== ref.current) {
            (window as any).__FG = ref.current
            console.log('[FGAdapter] Updated window.__FG with latest ref.current')
          }
        } catch (error) {
          console.error('[FGAdapter] Error calling refresh():', error)
        }
      } else {
        console.warn('[FGAdapter] refresh() method not found on ref.current')
        console.log('[FGAdapter] Available methods:', Object.keys(ref.current || {}))
      }
    }
  }, [safeGraphData, ref])

  return (
    <ForceGraph3D
      ref={ref}
      {...restProps} /* all user props EXCEPT graphData */
      graphData={safeGraphData} /* deep‑cloned, unfrozen data       */
      // Removed freeze guards to allow natural simulation
      // cooldownTime={Infinity} - was preventing time-based stopping
      // cooldownTicks={0} - was stopping after 1 tick
      // d3AlphaDecay={0} - was preventing alpha from decreasing
      onEngineStop={() => {
        const api = (ref as React.RefObject<any>).current
        api?.d3AlphaTarget?.(0.3)?.restart?.()
      }}
    />
  )
})

ForceGraphAdapter.displayName = 'ForceGraphAdapter'

export default ForceGraphAdapter
