import React, { forwardRef, useMemo, useEffect } from 'react'
// TODO: Remove this adapter once force-graph is replaced with SDK renderer
import ForceGraph3D from 'r3f-forcegraph'
import * as THREE from 'three'

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
// Helper to tint sprite material with proper color mutation
const tintSprite = (material: any, hex: number) => {
  if (!material || !material.color) {
    console.error('[tintSprite] Invalid material:', material)
    return
  }
  material.color.setHex(hex)
  material.needsUpdate = true
}

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
  const originalColorsRef = React.useRef<Map<string, number>>(new Map())
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
  
  // Imperative visual feedback methods with material mutations
  const highlightNode = React.useCallback((nodeId: string | null) => {
    const graphData = internalRef.current?.graphData?.()
    if (!graphData || !graphData.nodes) return
    
    // Reset previous highlight
    if (highlightedNodeRef.current) {
      const prevNode = graphData.nodes.find((n: any) => n.id === highlightedNodeRef.current)
      if (prevNode?.__threeObj?.material) {
        const origColor = originalColorsRef.current.get(highlightedNodeRef.current)
        if (origColor !== undefined) {
          // Check if still selected before resetting
          if (!selectedNodesRef.current.has(highlightedNodeRef.current)) {
            tintSprite(prevNode.__threeObj.material, origColor)
          } else {
            // Keep orange if selected
            tintSprite(prevNode.__threeObj.material, 0xffa500)
          }
        }
      }
    }
    
    // Apply new highlight
    highlightedNodeRef.current = nodeId
    if (nodeId) {
      const node = graphData.nodes.find((n: any) => n.id === nodeId)
      if (node?.__threeObj?.material) {
        // Store original color if not stored
        if (!originalColorsRef.current.has(nodeId)) {
          const currentColor = node.__threeObj.material.color.getHex()
          originalColorsRef.current.set(nodeId, currentColor)
        }
        // Apply yellow highlight
        tintSprite(node.__threeObj.material, 0xffff00)
        
        // DEV-ONLY PROBE
        if (process.env.NODE_ENV !== 'production') {
          const material = node.__threeObj.material
          console.assert(
            material instanceof THREE.SpriteMaterial,
            '[highlightNode] Expected SpriteMaterial, got:', material?.constructor?.name
          )
          console.log('[PROBE] highlightNode:', {
            nodeId,
            materialType: material?.constructor?.name,
            colorAfter: material?.color?.getHexString?.()
          })
          if (material?.color?.getHex?.() !== 0xffff00) {
            throw new Error(`[highlightNode] Color mutation failed! Expected 0xffff00, got ${material?.color?.getHex?.()}`)
          }
        }
      }
    }
    
    // Force refresh
    if (internalRef.current?.refresh) {
      internalRef.current.refresh()
    }
  }, [])

  const selectNode = React.useCallback((nodeId: string, toggle: boolean = true) => {
    const graphData = internalRef.current?.graphData?.()
    if (!graphData || !graphData.nodes) return
    
    const node = graphData.nodes.find((n: any) => n.id === nodeId)
    if (!node?.__threeObj?.material) return
    
    const wasSelected = selectedNodesRef.current.has(nodeId)
    
    // Toggle selection state
    if (toggle && wasSelected) {
      selectedNodesRef.current.delete(nodeId)
      // Restore original color (unless highlighted)
      const origColor = originalColorsRef.current.get(nodeId)
      if (origColor !== undefined && highlightedNodeRef.current !== nodeId) {
        tintSprite(node.__threeObj.material, origColor)
      } else if (highlightedNodeRef.current === nodeId) {
        // Keep yellow if highlighted
        tintSprite(node.__threeObj.material, 0xffff00)
      }
    } else if (!wasSelected) {
      selectedNodesRef.current.add(nodeId)
      // Store original color if not stored
      if (!originalColorsRef.current.has(nodeId)) {
        const currentColor = node.__threeObj.material.color.getHex()
        originalColorsRef.current.set(nodeId, currentColor)
      }
      // Apply orange selection
      tintSprite(node.__threeObj.material, 0xffa500)
    }
    
    // DEV-ONLY PROBE
    if (process.env.NODE_ENV !== 'production') {
      const material = node.__threeObj.material
      const isNowSelected = selectedNodesRef.current.has(nodeId)
      console.assert(
        material instanceof THREE.SpriteMaterial,
        '[selectNode] Expected SpriteMaterial, got:', material?.constructor?.name
      )
      console.log('[PROBE] selectNode:', {
        nodeId,
        wasSelected,
        isNowSelected,
        materialType: material?.constructor?.name,
        colorAfter: material?.color?.getHexString?.()
      })
      if (isNowSelected && material?.color?.getHex?.() !== 0xffa500) {
        throw new Error(`[selectNode] Color mutation failed! Expected 0xffa500 for selected, got ${material?.color?.getHex?.()}`)
      }
    }
    
    // Force refresh
    if (internalRef.current?.refresh) {
      internalRef.current.refresh()
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

  // One-shot reheat on lens change with hasBurstRef gate
  useEffect(() => {
    if (!internalRef.current) return
    
    // Check if lens (activeCategories or activeTags) changed
    const categoriesChanged = activeCategories !== prevLensRef.current.categories
    const tagsChanged = activeTags !== prevLensRef.current.tags
    
    if ((categoriesChanged || tagsChanged) && !hasReheatedRef.current) {
      // Trigger reheat with proper gating
      if (internalRef.current.d3ReheatSimulation) {
        try {
          // Ensure graph data exists before reheating
          const graphData = internalRef.current.graphData?.()
          if (graphData && graphData.nodes && graphData.nodes.length > 0) {
            internalRef.current.d3ReheatSimulation()
            hasReheatedRef.current = true
            
            // DEV-ONLY PROBE
            if (process.env.NODE_ENV !== 'production') {
              console.log('[PROBE] Lens change triggered d3ReheatSimulation:', {
                categoriesChanged,
                tagsChanged,
                nodeCount: graphData.nodes.length
              })
            }
            
            // Reset flag after a delay to allow future reheats
            setTimeout(() => {
              hasReheatedRef.current = false
            }, 2000) // 2 second cooldown
          }
        } catch (error) {
          console.error('[FGAdapter] Error calling d3ReheatSimulation:', error)
        }
      }
      
      // Update prev refs
      prevLensRef.current = { categories: activeCategories, tags: activeTags }
    }
  }, [activeCategories, activeTags])

  // Remove nodeColor prop - we're using imperative mutations instead

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
