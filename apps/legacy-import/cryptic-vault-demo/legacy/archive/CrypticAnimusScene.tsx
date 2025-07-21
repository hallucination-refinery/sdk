'use client'

import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { buildCrypticNodeSprite, cleanupCrypticSpriteCache } from './CrypticNodeSprite'
import { useFrame } from '@react-three/fiber'
import { OPACITY_VALUES, LINK_COLORS } from '../utils/clusterPalette'
import * as THREE from 'three'
import { type TraversalResult } from '../utils/graphTraversal'
import { type IdeaNode, type Edge } from '@refinery/schema'

// Local type for nodes that have been processed by r3f-forcegraph
type IdeaNodeWithObj = IdeaNode & { __threeObj?: THREE.Object3D }

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
    nodes: IdeaNode[]
    links: Edge[]
  }
  onNodeClick?: (node: IdeaNode) => void
  onNodeHoverProp?: (node: IdeaNode | null) => void
  mouseSelectedNodeId?: string | null
  searchResultOutlineIds?: string[]
  currentInteractionMode?: 'mouse' | 'gesture'
  gesturedNodeId?: string | null
  _onBackgroundClickRequest?: () => void
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
  _onBackgroundClickRequest,
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
    const nodes = data.nodes.map((n) => ({ ...n }))
    const links = data.links.map((l) => ({ ...l }))
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
  }, []) // Run when ref changes from null to ForceGraph instance

  // PERFORMANCE: Cleanup sprite cache on unmount
  useEffect(() => {
    return () => {
      cleanupCrypticSpriteCache()
    }
  }, [])

  // Custom node rendering - memoized to prevent recreating the callback
  const nodeThreeObject = useCallback(
    (node: IdeaNode): any => {
      // Calculate selection states
      const isSelected = currentInteractionMode === 'mouse' && node.id === mouseSelectedNodeId
      const isGestureSelected = currentInteractionMode === 'gesture' && node.id === gesturedNodeId
      const isSearchResult = searchResultOutlineIds?.includes(node.id)

      // Determine selection color
      let selectionColor: string | undefined = undefined
      if (isSelected) {
        selectionColor = '#FFA500' // Orange
      } else if (isGestureSelected) {
        selectionColor = '#00FFFF' // Cyan
      } else if (isSearchResult) {
        selectionColor = '#90EE90' // Light green
      }

      // Get node metadata - the data structure has these directly on the node
      const conceptType = node.metadata?.type || 'default'
      const cluster = node.metadata?.cluster || 'default'
      const isSecret = node.metadata?.secret || false

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
    (node: IdeaNode) => {
      if (onNodeClick) {
        onNodeClick(node)
      }
    },
    [onNodeClick]
  )

  // Handle node hover - memoized to prevent re-creating function
  const handleNodeHover = useCallback(
    (node: IdeaNode | null) => {
      onNodeHoverProp?.(node)
    },
    [onNodeHoverProp]
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

    const nodesArr: IdeaNodeWithObj[] = graphAccessor.nodes || []
    nodesArr.forEach((n: IdeaNodeWithObj) => {
      const sprite = n.__threeObj as THREE.Sprite | undefined
      if (!sprite || !sprite.material) return // Guard against missing sprites

      const nodeType = n.metadata?.type
      const isVisibleByTime = visibleIds ? visibleIds.has(n.id) : true
      const isVisibleByPrivacy = showSecrets || !n.metadata?.secret

      const isActive =
        !activeCategories || activeCategories.size === 0 || activeCategories.has(nodeType || '')

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
    (link: Edge) => {
      if (highlightState) {
        const sourceId =
          typeof link.source === 'string' ? link.source : (link.source as IdeaNode).id
        const targetId =
          typeof link.target === 'string' ? link.target : (link.target as IdeaNode).id

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

      if (link.metadata?.sign === '+') return LINK_COLORS.positive
      if (link.metadata?.sign === '-') return LINK_COLORS.negative

      return LINK_COLORS.default
    },
    [highlightState]
  )

  const getLinkWidth = useCallback(
    (link: Edge) => {
      const isHighlighted =
        highlightState?.nodeIds.has(
          typeof link.source === 'string' ? link.source : (link.source as IdeaNode).id
        ) &&
        highlightState?.nodeIds.has(
          typeof link.target === 'string' ? link.target : (link.target as IdeaNode).id
        )
      const baseWidth = 0.4
      const weightedWidth = 0.5 + 2 * (link.metadata?.weight || 0.5)
      return isHighlighted ? Math.min(weightedWidth + 1, 3) : baseWidth
    },
    [highlightState]
  )

  // Memoize helper to decide if a node passes current filters
  const nodePassesFilters = useCallback(
    (node: IdeaNode): boolean => {
      if (!node) return false
      if (!showSecrets && node.metadata?.secret) return false
      // Time slider filter
      if (visibleIds && !visibleIds.has(node.id)) return false
      // Category/type filter
      const typeMatch =
        !activeCategories ||
        activeCategories.size === 0 ||
        activeCategories.has(node.metadata?.type || '')
      if (!typeMatch) return false
      // Tag filter (from TagHUD)
      const tagMatch =
        !activeTags ||
        activeTags.size === 0 ||
        (node.metadata?.topics || []).some((t: string) => activeTags.has(t))
      if (!tagMatch) return false
      return true
    },
    [showSecrets, visibleIds, activeCategories, activeTags]
  )

  return (
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
      linkVisibility={(link: Edge) => {
        const sId = typeof link.source === 'string' ? link.source : (link.source as IdeaNode).id
        const tId = typeof link.target === 'string' ? link.target : (link.target as IdeaNode).id

        const sourceNode = nodeMap.get(sId)
        const targetNode = nodeMap.get(tId)

        return nodePassesFilters(sourceNode) && nodePassesFilters(targetNode)
      }}
    />
  )
}
