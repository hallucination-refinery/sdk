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

  // Lens props for detecting changes
  activeCategories?: Set<string>
  activeTags?: Set<string>

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

  // Visual feedback methods
  highlightNode: (nodeId: string | null) => void
  selectNode: (nodeId: string, toggle?: boolean) => void
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
  
  const { graphData, dataVersion = 0, disableLinkForce, activeCategories, activeTags, ...restProps } = props
  const internalRef = React.useRef<any>(null)
  const highlightedNodeRef = React.useRef<string | null>(null)
  const selectedNodesRef = React.useRef<Set<string>>(new Set())
  const prevLensRef = React.useRef<{ categories?: Set<string>; tags?: Set<string> }>({})
  const hasReheatedRef = React.useRef(false)
  const safeGraphData = useMemo(() => {
    // console.log('[ForceGraphAdapter] Creating safe data for version:', dataVersion)  // COMMENTED OUT: Render-phase console.log
    return structuredClone(graphData)
  }, [graphData, dataVersion]) // Both dependencies for proper tracking
  // --- freeze-crash guard ----------------------------------------------
  useEffect(() => {
    if (disableLinkForce && internalRef.current) {
      internalRef.current.d3Force('link', null)
    }
  }, [disableLinkForce])
  // ----------------------------------------------------------------------
  
  // Imperative visual feedback methods
  const highlightNode = React.useCallback((nodeId: string | null) => {
    const prevHighlighted = highlightedNodeRef.current
    highlightedNodeRef.current = nodeId
    
    if (!internalRef.current) return
    
    try {
      const graphData = internalRef.current.graphData()
      if (!graphData || !graphData.nodes) return
      
      // Reset previous highlighted node
      if (prevHighlighted) {
        const prevNode = graphData.nodes.find((n: any) => n.id === prevHighlighted)
        if (prevNode && prevNode.__threeObj) {
          const sprite = prevNode.__threeObj
          if (sprite.material) {
            // Reset to original color (stored in material.color)
            sprite.material.opacity = selectedNodesRef.current.has(prevHighlighted) ? 1.0 : 0.9
            sprite.material.needsUpdate = true
          }
        }
      }
      
      // Highlight new node
      if (nodeId) {
        const node = graphData.nodes.find((n: any) => n.id === nodeId)
        if (node && node.__threeObj) {
          const sprite = node.__threeObj
          if (sprite.material) {
            // Increase opacity for highlight
            sprite.material.opacity = 1.0
            sprite.material.needsUpdate = true
          }
        }
      }
      
      // Trigger refresh to update visuals
      if (internalRef.current.refresh) {
        internalRef.current.refresh()
      }
    } catch (error) {
      console.error('[FGAdapter] Error in highlightNode:', error)
    }
  }, [])

  const selectNode = React.useCallback((nodeId: string, toggle: boolean = true) => {
    const wasSelected = selectedNodesRef.current.has(nodeId)
    
    if (toggle && wasSelected) {
      selectedNodesRef.current.delete(nodeId)
    } else if (!wasSelected) {
      selectedNodesRef.current.add(nodeId)
    }
    
    if (!internalRef.current) return
    
    try {
      const graphData = internalRef.current.graphData()
      if (!graphData || !graphData.nodes) return
      
      const node = graphData.nodes.find((n: any) => n.id === nodeId)
      if (node && node.__threeObj) {
        const sprite = node.__threeObj
        if (sprite.material) {
          // Toggle selection visual
          const isNowSelected = selectedNodesRef.current.has(nodeId)
          sprite.material.opacity = isNowSelected ? 1.0 : 0.9
          
          // Could also adjust color tint for selection
          if (sprite.material.color) {
            const tint = isNowSelected ? 0xffaa00 : 0xffffff // Orange tint for selection
            sprite.material.color.setHex(tint)
          }
          
          sprite.material.needsUpdate = true
        }
      }
      
      // Trigger refresh to update visuals
      if (internalRef.current.refresh) {
        internalRef.current.refresh()
      }
    } catch (error) {
      console.error('[FGAdapter] Error in selectNode:', error)
    }
  }, [])

  // Merge refs and add custom methods
  React.useImperativeHandle(ref, () => {
    if (!internalRef.current) return {} as any
    return {
      ...internalRef.current,
      highlightNode,
      selectNode
    }
  }, [highlightNode, selectNode])

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
    if (internalRef.current) {
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
      if (typeof internalRef.current.refresh === 'function') {
        try {
          internalRef.current.refresh()
          console.log('[FGAdapter] Called ref.current.refresh() successfully')
          
          // Also update window.__FG reference in case it changed
          if ((window as any).__FG !== internalRef.current) {
            (window as any).__FG = internalRef.current
            console.log('[FGAdapter] Updated window.__FG with latest ref.current')
          }
        } catch (error) {
          console.error('[FGAdapter] Error calling refresh():', error)
        }
      } else {
        console.warn('[FGAdapter] refresh() method not found on ref.current')
        console.log('[FGAdapter] Available methods:', Object.keys(internalRef.current || {}))
      }
    }
  }, [safeGraphData])

  // One-shot reheat on lens change
  useEffect(() => {
    if (!internalRef.current) return
    
    // Check if lens (activeCategories or activeTags) changed
    const categoriesChanged = activeCategories !== prevLensRef.current.categories
    const tagsChanged = activeTags !== prevLensRef.current.tags
    
    if ((categoriesChanged || tagsChanged) && !hasReheatedRef.current) {
      console.log('[FGAdapter] Lens changed, triggering one-shot reheat')
      
      // Trigger reheat - TEMPORARILY DISABLED to prevent layoutTick crash
      // if (internalRef.current.d3ReheatSimulation) {
      //   try {
      //     internalRef.current.d3ReheatSimulation()
      //     hasReheatedRef.current = true
      //     
      //     // Reset flag after a delay to allow future reheats
      //     setTimeout(() => {
      //       hasReheatedRef.current = false
      //     }, 2000) // 2 second cooldown
      //   } catch (error) {
      //     console.error('[FGAdapter] Error calling d3ReheatSimulation:', error)
      //   }
      // }
      
      // Update prev refs
      prevLensRef.current = { categories: activeCategories, tags: activeTags }
    }
  }, [activeCategories, activeTags])

  return (
    <ForceGraph3D
      ref={internalRef}
      {...restProps} /* all user props EXCEPT graphData */
      graphData={safeGraphData} /* deep‑cloned, unfrozen data       */
      // Removed freeze guards to allow natural simulation
      // cooldownTime={Infinity} - was preventing time-based stopping
      // cooldownTicks={0} - was stopping after 1 tick
      // d3AlphaDecay={0} - was preventing alpha from decreasing
      onEngineStop={() => {
        if (internalRef.current) {
          internalRef.current.d3AlphaTarget?.(0.3)?.restart?.()
        }
      }}
    />
  )
})

ForceGraphAdapter.displayName = 'ForceGraphAdapter'

export default ForceGraphAdapter
