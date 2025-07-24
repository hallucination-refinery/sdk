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

  // Configure physics forces
  useEffect(() => {
    if (!fgRef.current || !fgRef.current.d3Force) return

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

    // Let the simulation run continuously; we will let ForceGraph manage alpha decay
  }, [fgRef.current]) // Run when ref changes from null to ForceGraph instance

  // Expose ForceGraph ref for console inspection
  useEffect(() => {
    if (fgRef.current) {
      console.log('FG ref', fgRef.current)
      ;(window as any).__FG = fgRef.current
      fgRef.current.d3ReheatSimulation?.()

      // TEMP diagnostics: kick simulation each second and log alpha
      const id = setInterval(() => {
        fgRef.current?.d3ReheatSimulation?.()
        const force = fgRef.current?.d3Force?.()
        const a = force?.alpha ? force.alpha() : 'n/a'
        console.log('[Diag alpha]', a)
      }, 1000)
      return () => clearInterval(id)
    }
  }, [fgRef.current])

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
