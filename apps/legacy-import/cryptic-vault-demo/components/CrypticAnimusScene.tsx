// @ts-nocheck
'use client'

import React, { useEffect, useState, useCallback, useMemo, useLayoutEffect, useRef } from 'react'
// Static import ensures ref is forwarded correctly
import dynamic from 'next/dynamic'
const ForceGraph3D = dynamic(
  () => import('@refinery/canvas-r3f').then((m) => m.ForceGraphAdapter),
  { ssr: false, loading: () => null, forwardRef: true }
)
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
  graphVersion?: number
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
  graphVersion = 0,
}: CrypticAnimusSceneProps) {
  console.log('[Animus mounted] version', graphVersion)
  const fgInstanceRef = useRef<any>(null)
  const [ready, setReady] = useState(false)

  // Callback ref – saves instance without causing re-render loop
  const handleFGRef = useCallback((inst: any) => {
    if (inst && !fgInstanceRef.current) {
      fgInstanceRef.current = inst
      ;(window as any).__FG = inst
      setReady(true) // flips exactly once
    }
  }, [])

  const {
    nodes: memoizedNodes,
    links: memoizedLinks,
    nodeMap,
  } = useMemo(() => {
    // Use data directly - ForceGraphAdapter will handle the single necessary clone
    const nodes = data.nodes
    const links = data.links
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

  // Configure physics forces once per structural graph version
  const version = graphVersion

  // Unified physics setup + alpha kick (robust against race)
  useEffect(() => {
    if (!ready || version === 0) return

    const api = fgInstanceRef.current
    if (!api) return

    // If API not yet fully initialised, retry next frame
    if (!api.d3Force || !api.d3Alpha) {
      const id = requestAnimationFrame(() => setReady((r) => !r))
      return () => cancelAnimationFrame(id)
    }

    console.log('[Physics] configuring forces + alpha kick (v', version, ')')

    // Configure forces
    api.d3Force('link')?.distance(200)?.strength(0.2)
    api.d3Force('charge')?.strength(-200)?.distanceMax(600)
    api.d3Force('center')?.strength(0.1)

    // Kick simulation energy
    api.d3ReheatSimulation?.()
    api.d3Alpha(0.8).restart()

    console.log('α =', api.d3Alpha(), 'frozen?', Object.isFrozen(api.graphData().nodes[0]))
  }, [ready, version])

  // Reheat simulation when graph version changes (structural mutations)

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
    const api = fgInstanceRef.current
    if (!api) return

    // Tick the physics simulation
    if (api.tickFrame) {
      api.tickFrame()
    }

    const graphAccessor: any = typeof api.graphData === 'function' ? api.graphData() : api.graphData
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
    <ForceGraph3D
      ref={handleFGRef}
      graphData={memoizedGraphData}
      dataVersion={version}
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
  )
}
