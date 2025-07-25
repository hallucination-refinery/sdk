// @ts-nocheck
'use client'

import React, { useEffect, useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
// Local type definition to avoid r3f-forcegraph dependency
type NodeObject<T = any> = T & {
  id?: string | number
  x?: number
  y?: number
  z?: number
  [key: string]: any
}
import { buildCrypticNodeSprite, cleanupCrypticSpriteCache } from './CrypticNodeSprite'
import { useFrame } from '@react-three/fiber'
import { OPACITY_VALUES, LINK_COLORS } from '@/utils/clusterPalette'
import * as THREE from 'three'
import { type TraversalResult } from '@/utils/graphTraversal'

// Local error boundary to surface ForceGraph render errors
class FGErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('[FGErrorBoundary]', error, info)
  }
  render() {
    // @ts-ignore
    return this.props.children
  }
}

// Use SDK ForceGraphAdapter instead of direct r3f-forcegraph import
const ForceGraph3D = dynamic(
  () => import('@refinery/canvas-r3f').then((mod) => mod.ForceGraphAdapter),
  {
    ssr: false,
    loading: () => null, // Return null while loading to prevent flashing
  }
)

interface CrypticAnimusSceneProps {
  data: {
    nodes: any[]
    links: any[]
  }
  onNodeClick?: (node: any) => void
  onNodeHoverProp?: (node: any | null) => void
  mouseSelectedNodeId?: string | null
  searchResultOutlineIds?: string[]
  currentInteractionMode?: 'mouse' | 'gesture'
  gesturedNodeId?: string | null
  onBackgroundClickRequest?: () => void
  activeCategories?: Set<string>
  highlightState?: TraversalResult | null
  visibleIds?: Set<string>
  showSecrets?: boolean
  activeTags?: Set<string>
}

export default function CrypticAnimusScene({
  data,
  onNodeClick,
  onNodeHoverProp,
  mouseSelectedNodeId,
  searchResultOutlineIds,
  currentInteractionMode = 'mouse',
  gesturedNodeId,
  onBackgroundClickRequest,
  activeCategories,
  highlightState,
  visibleIds,
  showSecrets = true,
  activeTags,
}: CrypticAnimusSceneProps) {
  const fgRef = useRef<any>(null)

  const {
    nodes: memoizedNodes,
    links: memoizedLinks,
    nodeMap,
  } = useMemo(() => {
    // Use structuredClone to ensure fresh objects, replacing shallow spreads
    const nodes = structuredClone(data.nodes)
    const links = structuredClone(data.links)
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    return { nodes, links, nodeMap }
  }, [data])

  const memoizedGraphData = useMemo(
    () => ({
      nodes: memoizedNodes,
      links: memoizedLinks,
    }),
    [memoizedNodes, memoizedLinks]
  )

  // Log before rendering ForceGraph3D to confirm component mounts
  console.log('[Animus] render ForceGraph3D')
  
  // Build verification marker
  console.log('[Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at:', new Date().toISOString())
  
  // Debug data availability
  console.log('[Data debug] nodes:', memoizedGraphData.nodes.length, 'links:', memoizedGraphData.links.length)
  console.log('[Data debug] ForceGraph3D component loaded:', !!ForceGraph3D)

  // Configure physics forces
  useEffect(() => {
    const checkAndConfigurePhysics = () => {
      if (!fgRef.current || !fgRef.current.d3Force) {
        console.log('[Physics config] Ref not ready, will retry...')
        // Retry after a short delay if ref not ready
        setTimeout(checkAndConfigurePhysics, 100)
        return
      }

      console.log('[CrypticAnimusScene] Configuring physics forces!')

      // Configure physics for a very spread-out layout with rigid links
      fgRef.current
        .d3Force('link')
        ?.distance(200) // Significantly increase the target link length
        ?.strength(0.5) // Make links very stiff to enforce equal distance

      fgRef.current
        .d3Force('charge')
        ?.strength(-200) // Increase repulsion to push nodes far apart
        ?.distanceMax(600)

      fgRef.current.d3Force('center')?.strength(0.1)
    }
    
    checkAndConfigurePhysics()
    // Let the simulation run continuously; we will let ForceGraph manage alpha decay
  }, []) // Run once on mount, retry internally if ref not ready

  // Expose ForceGraph ref for console inspection
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null
    
    const setupWindowFG = () => {
      if (!fgRef.current) {
        console.log('[Window FG] Ref not ready, will retry...')
        // Retry after a short delay if ref not ready
        setTimeout(setupWindowFG, 100)
        return
      }
      
      console.log('FG ref', fgRef.current)
      ;(window as any).__FG = fgRef.current
      console.log('[Window FG] window.__FG assigned successfully')
      
      // Initial reheat and force multiple ticks
      fgRef.current.d3ReheatSimulation?.()
      // Force multiple ticks to overcome cooldownTicks=0
      for (let i = 0; i < 100; i++) {
        fgRef.current.tickFrame?.()
      }
      
      // Add position monitoring to verify simulation activity
      let positionCheckCount = 0
      const checkNodePositions = () => {
        if (!(window as any).__FG || positionCheckCount >= 5) return
        
        try {
          // Try different methods to get node data
          const nodes = graphData?.nodes
          if (nodes && nodes.length > 0) {
            const sampleNodes = nodes.slice(0, 3) // Check first 3 nodes
            console.log(`=== Position Check ${positionCheckCount + 1} ===`)
            sampleNodes.forEach((node: any) => {
              console.log(`Node ${node.id}: x=${node.x ?? 'undefined'}, y=${node.y ?? 'undefined'}, z=${node.z ?? 'undefined'}`)
            })
            
            // Check if positions are changing
            if (positionCheckCount > 0) {
              const allUndefined = sampleNodes.every((n: any) => 
                n.x === undefined && n.y === undefined && n.z === undefined
              )
              const allAtOrigin = sampleNodes.every((n: any) => 
                n.x === 0 && n.y === 0 && n.z === 0
              )
              console.log('All positions undefined?', allUndefined)
              console.log('All nodes at origin?', allAtOrigin)
            }
          }
        } catch (e) {
          console.log('Position check error:', e)
        }
        
        positionCheckCount++
      }
      
      // Check positions at intervals
      setTimeout(checkNodePositions, 100)
      setTimeout(checkNodePositions, 500)
      setTimeout(checkNodePositions, 1000)
      setTimeout(checkNodePositions, 2000)
      setTimeout(checkNodePositions, 5000)
      
      // PHASE 1: Deep inspection of window.__FG - wait 1s to ensure full initialization
      setTimeout(() => {
        console.log('=== PHASE 1: window.__FG Deep Inspection ===')
        console.log('1. Basic info:')
        console.log('  Type:', typeof (window as any).__FG)
        console.log('  Constructor:', (window as any).__FG?.constructor?.name)
        
        console.log('2. Direct properties:')
        console.log('  Object.keys:', Object.keys((window as any).__FG || {}))
        console.log('  Object.getOwnPropertyNames:', Object.getOwnPropertyNames((window as any).__FG || {}))
        
        console.log('3. Prototype chain:')
        let proto = Object.getPrototypeOf((window as any).__FG)
        let level = 0
        while (proto && level < 5) {
          console.log(`  Level ${level}:`, Object.getOwnPropertyNames(proto))
          proto = Object.getPrototypeOf(proto)
          level++
        }
        
        console.log('4. All enumerable properties:')
        const allProps: any[] = []
        for (let key in (window as any).__FG) {
          allProps.push({
            key, 
            type: typeof (window as any).__FG[key],
            value: typeof (window as any).__FG[key] === 'function' ? '[Function]' : (window as any).__FG[key]
          })
        }
        console.table(allProps)
        
        console.log('5. Method availability:')
        const methods = ['d3Force', 'd3ReheatSimulation', 'tickFrame', 'emitParticle', 'getGraphBbox', 'resetCountdown', 'refresh']
        methods.forEach(m => {
          console.log(`  ${m}:`, typeof (window as any).__FG[m])
        })
        
        console.log('6. Hidden/private properties:')
        const hiddenProps = ['_engine', '_state', '_simulation', '__kapsuleInstance', '_graphForce', '__graphSimulation']
        hiddenProps.forEach(p => {
          console.log(`  ${p}:`, (window as any).__FG[p] !== undefined ? 'EXISTS' : 'undefined')
        })
      }, 1000)
      
      // PHASE 2: Monitor how ref evolves over time
      const checkRef = (delay: number, label: string) => {
        setTimeout(() => {
          if (!(window as any).__FG) {
            console.log(`[${label}] window.__FG is undefined`)
            return
          }
          
          const hasKapsule = !!((window as any).__FG.__kapsuleInstance)
          const keys = Object.keys((window as any).__FG)
          const protoKeys = Object.keys(Object.getPrototypeOf((window as any).__FG) || {})
          
          console.log(`=== PHASE 2: Ref Evolution at ${label} ===`)
          console.log('Has __kapsuleInstance:', hasKapsule)
          console.log('Direct keys count:', keys.length)
          console.log('Proto keys count:', protoKeys.length)
          
          // Check for any new properties
          const allCurrentProps = [...keys, ...protoKeys]
          console.log('All properties:', allCurrentProps)
          
          // Try to find simulation
          if ((window as any).__FG.d3Force) {
            const linkForce = (window as any).__FG.d3Force('link')
            console.log('d3Force("link") returns:', linkForce)
            console.log('Has .alpha() method?', typeof linkForce?.alpha === 'function')
          }
        }, delay)
      }

      // Check at multiple intervals
      checkRef(100, '100ms')
      checkRef(500, '500ms')
      checkRef(1000, '1s')
      checkRef(2000, '2s')
      checkRef(5000, '5s')
      
      // PHASE 3: Test force configuration and simulation methods
      setTimeout(() => {
        console.log('=== PHASE 3: Force & Simulation Testing ===')
        
        if (!(window as any).__FG) {
          console.log('ERROR: window.__FG is undefined')
          return
        }
        
        console.log('1. Testing d3Force method:')
        const d3ForceMethod = (window as any).__FG.d3Force
        console.log('  d3Force type:', typeof d3ForceMethod)
        console.log('  d3Force toString:', d3ForceMethod?.toString?.())
        
        console.log('2. Testing force retrieval:')
        const forces = ['link', 'charge', 'center', 'x', 'y', 'z', 'collide']
        forces.forEach(forceName => {
          try {
            const force = (window as any).__FG.d3Force?.(forceName)
            console.log(`  Force "${forceName}":`, force)
            console.log(`    Type:`, typeof force)
            console.log(`    Has strength?:`, typeof force?.strength === 'function')
            console.log(`    Has alpha?:`, typeof force?.alpha === 'function')
          } catch (e) {
            console.log(`  Force "${forceName}": ERROR -`, (e as Error).message)
          }
        })
        
        console.log('3. Testing simulation control methods:')
        try {
          console.log('  d3ReheatSimulation result:', (window as any).__FG.d3ReheatSimulation?.())
          console.log('  tickFrame result:', (window as any).__FG.tickFrame?.())
          console.log('  resetCountdown result:', (window as any).__FG.resetCountdown?.())
        } catch (e) {
          console.log('  Simulation control ERROR:', (e as Error).message)
        }
        
        console.log('4. Looking for simulation via d3Force:')
        // Sometimes d3Force() with no args returns the simulation
        try {
          const noArgResult = (window as any).__FG.d3Force?.()
          console.log('  d3Force() no args:', noArgResult)
          console.log('  Has .alpha()?:', typeof noArgResult?.alpha === 'function')
          console.log('  Has .nodes()?:', typeof noArgResult?.nodes === 'function')
        } catch (e) {
          console.log('  d3Force() no args ERROR:', (e as Error).message)
        }
        
        // PHASE 5: Alternative access attempts
        console.log('5. Alternative access attempts:')
        
        // Check THREE.Group properties (ThreeForceGraph extends Group)
        console.log('  Is THREE.Group?', (window as any).__FG instanceof (window as any).THREE?.Group)
        console.log('  Children:', (window as any).__FG.children?.length)
        
        // Look for graph data
        console.log('  graphData method?', typeof (window as any).__FG.graphData)
        if ((window as any).__FG.graphData) {
          const data = (window as any).__FG.graphData()
          console.log('  Graph data:', { nodes: data?.nodes?.length, links: data?.links?.length })
        }
        
        // Check for any property containing 'sim', 'engine', 'force'
        const allKeys: string[] = []
        for (let key in (window as any).__FG) {
          allKeys.push(key)
        }
        const relevantKeys = allKeys.filter(k => 
          k.toLowerCase().includes('sim') || 
          k.toLowerCase().includes('engine') || 
          k.toLowerCase().includes('force') ||
          k.toLowerCase().includes('alpha')
        )
        console.log('  Relevant keys:', relevantKeys)
      }, 3000)

      // TEMP diagnostics: kick simulation each second and log alpha
      intervalId = setInterval(() => {
        if (!fgRef.current) {
          console.log('[Diag alpha] Lost ref, stopping interval')
          if (intervalId) clearInterval(intervalId)
          return
        }
        
        fgRef.current.d3ReheatSimulation?.()
        // Force multiple ticks to overcome cooldownTicks=0
        for (let i = 0; i < 50; i++) {
          fgRef.current.tickFrame?.()
        }
        // Access alpha through the kapsule instance's d3ForceLayout
        const kapsuleInstance = (fgRef.current as any)?.__kapsuleInstance
        const alpha = kapsuleInstance?.d3ForceLayout?.alpha?.()
        console.log('[Diag alpha]', alpha ?? 'n/a', 'kapsule:', !!kapsuleInstance)
      }, 1000)
    }
    
    setupWindowFG()
    
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, []) // Run once on mount, retry internally if ref not ready

  // PERFORMANCE: Cleanup sprite cache on unmount
  useEffect(() => {
    return () => {
      cleanupCrypticSpriteCache()
    }
  }, [])

  // Custom node rendering - memoized to prevent recreating the callback
  const nodeThreeObject = useCallback(
    (node: any): any => {
      // Calculate selection states
      const isSelected = currentInteractionMode === 'mouse' && node.id === mouseSelectedNodeId
      const isGestureSelected = currentInteractionMode === 'gesture' && node.id === gesturedNodeId
      const isSearchResult = searchResultOutlineIds?.includes(node.id)

      // Determine selection color
      let selectionColor = undefined
      if (isSelected) {
        selectionColor = '#FFA500' // Orange
      } else if (isGestureSelected) {
        selectionColor = '#00FFFF' // Cyan
      } else if (isSearchResult) {
        selectionColor = '#90EE90' // Light green
      }

      // Get node metadata - the data structure has these directly on the node
      const conceptType = node.type || 'default'
      const cluster = node.metadata?.cluster || 'default'
      const isSecret = node.secret || false

      const sprite = buildCrypticNodeSprite(
        node.label || 'Untitled',
        conceptType,
        cluster,
        isSecret,
        selectionColor
      )

      return sprite
    },
    [currentInteractionMode, mouseSelectedNodeId, gesturedNodeId, searchResultOutlineIds]
  )

  // Ensure sprites start visible - set initial opacity
  const nodeThreeObjectExtend = useCallback((obj: any) => {
    if (obj?.material) {
      // Set initial opacity to 1 (fully visible) if it's not already set
      if (obj.material.opacity === undefined || obj.material.opacity === 0) {
        obj.material.opacity = 1
        obj.material.needsUpdate = true
      }
    }
    return false // Return false to not stop propagation
  }, [])

  // Handle node click - memoized
  const handleNodeClick = useCallback(
    (node: NodeObject<any>) => {
      if (onNodeClick) {
        onNodeClick(node)
      }
    },
    [onNodeClick]
  )

  // Handle node hover - memoized to prevent re-creating function
  const handleNodeHover = useCallback(
    (node: any) => {
      onNodeHoverProp?.(node)
    },
    [onNodeHoverProp]
  )

  // Memoize link opacity function to prevent recreating on every render
  const getLinkOpacity = useCallback(
    (link: any) => {
      // Get source and target IDs first
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source
      const targetId = typeof link.target === 'object' ? link.target.id : link.target

      // Check if both source and target nodes are active
      const sourceNode = memoizedGraphData.nodes.find((n: any) => n.id === sourceId)
      const targetNode = memoizedGraphData.nodes.find((n: any) => n.id === targetId)

      const sourceCluster = sourceNode?.metadata?.cluster || sourceNode?.cluster
      const targetCluster = targetNode?.metadata?.cluster || targetNode?.cluster

      const sourceVisible = !visibleIds || visibleIds.has(sourceId)
      const targetVisible = !visibleIds || visibleIds.has(targetId)

      const sourceActive =
        !activeCategories || activeCategories.size === 0 || activeCategories.has(sourceCluster)
      const targetActive =
        !activeCategories || activeCategories.size === 0 || activeCategories.has(targetCluster)

      // Check if link is highlighted
      const isHighlighted =
        highlightState &&
        highlightState.nodeIds.has(sourceId) &&
        highlightState.nodeIds.has(targetId)

      const visible = sourceVisible && targetVisible

      // Link is active if both nodes are active or if it's highlighted
      return visible && ((sourceActive && targetActive) || isHighlighted)
        ? OPACITY_VALUES.linkDefault
        : OPACITY_VALUES.dimmed
    },
    [memoizedGraphData.nodes, activeCategories, highlightState, visibleIds]
  )

  // --- Runtime sprite material updates each frame ---
  useFrame(() => {
    if (!fgRef.current) return

    // Tick the physics simulation
    if (fgRef.current.tickFrame) {
      fgRef.current.tickFrame()
    }

    const graphAccessor: any =
      typeof fgRef.current.graphData === 'function'
        ? fgRef.current.graphData()
        : fgRef.current.graphData
    if (!graphAccessor) return

    const nodesArr: any[] = graphAccessor.nodes || []
    nodesArr.forEach((n: any) => {
      const sprite = n.__threeObj as THREE.Sprite | undefined
      if (!sprite || !sprite.material) return // Guard against missing sprites

      const nodeType = n.type
      const isVisibleByTime = visibleIds ? visibleIds.has(n.id) : true
      const isVisibleByPrivacy = showSecrets || !n.secret

      const isActive =
        !activeCategories || activeCategories.size === 0 || activeCategories.has(nodeType)

      const isHighlighted = highlightState && highlightState.nodeIds.has(n.id)

      const targetOpacity =
        !isVisibleByTime || !isVisibleByPrivacy
          ? 0
          : isHighlighted
            ? OPACITY_VALUES.full
            : isActive
              ? OPACITY_VALUES.full
              : OPACITY_VALUES.dimmed

      if ((sprite.material as any).opacity !== targetOpacity) {
        ;(sprite.material as any).opacity = targetOpacity
        ;(sprite.material as any).needsUpdate = true
      }
    })
  })

  // Memoize link color function to prevent recreating on every render
  const getLinkColor = useCallback(
    (link: any) => {
      if (highlightState) {
        const sourceId = typeof link.source === 'object' ? link.source.id : link.source
        const targetId = typeof link.target === 'object' ? link.target.id : link.target

        const isUpstream =
          highlightState.upstreamNodes.has(sourceId) || highlightState.upstreamNodes.has(targetId)
        const isDownstream =
          highlightState.downstreamNodes.has(sourceId) ||
          highlightState.downstreamNodes.has(targetId)

        if (isUpstream) return LINK_COLORS.upstream
        if (isDownstream) return LINK_COLORS.downstream

        const bothInHighlight =
          highlightState.nodeIds.has(sourceId) && highlightState.nodeIds.has(targetId)
        if (bothInHighlight) return LINK_COLORS.highlighted
      }

      if (link.sign === '+') return LINK_COLORS.positive
      if (link.sign === '-') return LINK_COLORS.negative

      return LINK_COLORS.default
    },
    [highlightState]
  )

  const getLinkWidth = useCallback(
    (link: any) => {
      const isHighlighted =
        highlightState?.nodeIds.has(
          typeof link.source === 'object' ? link.source.id : link.source
        ) &&
        highlightState?.nodeIds.has(typeof link.target === 'object' ? link.target.id : link.target)
      const baseWidth = 0.4
      const weightedWidth = 0.5 + 2 * (link.weight || 0.5)
      return isHighlighted ? Math.min(weightedWidth + 1, 3) : baseWidth
    },
    [highlightState]
  )

  // Memoize helper to decide if a node passes current filters
  const nodePassesFilters = useCallback(
    (node: any): boolean => {
      if (!node) return false
      if (!showSecrets && node.secret) return false
      // Time slider filter
      if (visibleIds && !visibleIds.has(node.id)) return false
      // Category/type filter
      const typeMatch =
        !activeCategories || activeCategories.size === 0 || activeCategories.has(node.type)
      if (!typeMatch) return false
      // Tag filter (from TagHUD)
      const tagMatch =
        !activeTags ||
        activeTags.size === 0 ||
        (node.topics || node.metadata?.topics || []).some((t: string) => activeTags.has(t))
      if (!tagMatch) return false
      return true
    },
    [showSecrets, visibleIds, activeCategories, activeTags]
  )

  return (
    <FGErrorBoundary>
      <ForceGraph3D
        ref={fgRef}
        graphData={memoizedGraphData}
        nodeId="id"
        linkSource="source"
        linkTarget="target"
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={nodeThreeObjectExtend}
        linkColor={getLinkColor}
        linkWidth={getLinkWidth}
        linkCurvature={0.2}
        cooldownTime={Infinity} // keep simulation running; ForceGraph handles decay
        nodeVisibility={nodePassesFilters}
        linkVisibility={(link: any) => {
          const sId = typeof link.source === 'object' ? link.source.id : link.source
          const tId = typeof link.target === 'object' ? link.target.id : link.target

          const sourceNode = nodeMap.get(sId)
          const targetNode = nodeMap.get(tId)

          return nodePassesFilters(sourceNode) && nodePassesFilters(targetNode)
        }}
      />
    </FGErrorBoundary>
  )
}
