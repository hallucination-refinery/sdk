'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls, Stats } from '@react-three/drei'
import { Suspense, useEffect, useState, useRef, useCallback, useMemo } from 'react'
// dynamic import no longer used
// import KeyboardControls from './KeyboardControls';
import PrivacyBadge from './PrivacyBadge'
import ControlsHUD from './ControlsHUD'
import CategoryHUD from './CategoryHUD'
import { CategoryProvider, useCategory } from '@/contexts/CategoryContext'
import { useCanvas } from '@refinery/sdk-core'
import { useRefineryStore } from '@refinery/store'
import { performTwoHopTraversal, type TraversalResult } from '@/utils/graphTraversal'
import TimeSlider from './TimeSlider'
import LensSelector from './LensSelector'
import SceneContent, { type IdeaNodeWithPosition } from './SceneContent'
const timelineData = require('@/data/timeline.json')

// Types for concepts data
interface Concept {
  id: string
  type: string
  label: string
  clusterId?: string
  meta?: { topics?: string[]; secret?: boolean }
}

interface Edge {
  source: string
  target: string
  type: string
}

// graphBundle imported as JSON ESM above

const dates: string[] = (timelineData as any[]).map((d) => d.date)

// Note: We're using CrypticAnimusScene instead of the SDK's AnimusScene
// for custom glowing orb visualization

// Extended IdeaNode type moved to SceneContent.tsx

// convertConceptsToIdeaNodes no longer used

function CrypticVaultSceneContent() {
  const controlsRef = useRef<any>(null)
  const { state: _canvasState, enqueueCommand: _enqueueCommand } = useCanvas()
  const store = useRefineryStore()
  const [loading, setLoading] = useState(true)
  const [enrichedImages] = useState(new Map<string, string>())
  const [viewMode] = useState<'nodes' | 'clusters' | 'brain'>('nodes')
  const { setActiveCategories } = useCategory()
  const [timeIndex, setTimeIndex] = useState(0)
  const [activeLens, setActiveLens] = useState<'causal' | 'affinity' | 'temporal'>('causal')
  const [_timelineDate, _setTimelineDate] = useState<string>('')
  const isInitializedRef = useRef(false)
  const [interactionState, setInteractionState] = useState({
    masterGraphData: null as any,
    mouseSelectedNodeId: null as string | null,
    searchResultNodeIds: [] as string[],
    currentInteractionMode: 'mouse' as string,
    gesturedNodeId: null as string | null,
    activeLens: 'causal' as 'causal' | 'affinity' | 'temporal',
  })
  const [highlightState, setHighlightState] = useState<TraversalResult | null>(null)
  const [highlightActiveTime, setHighlightActiveTime] = useState<number>(0)
  const nodeCache = useRef<Record<string, any>>({})
  const linkCache = useRef<Record<string, any>>({})

  const {
    nodes: rawNodes,
    edges_causal: rawEdgesCausal = [],
    edges_affinity: rawEdgesAffinity = [],
    edges_temporal: rawEdgesTemporal = [],
  } = graphBundle as any

  // activeLens is now managed in local state

  // choose edge array based on active lens
  const rawEdges =
    activeLens === 'affinity'
      ? rawEdgesAffinity
      : activeLens === 'temporal'
        ? rawEdgesTemporal
        : rawEdgesCausal

  // Build full node & link object caches ONCE (they keep positions/state)
  const allNodes: IdeaNodeWithPosition[] = useMemo(() => {
    const created = rawNodes.map((n: any) => {
      if (!nodeCache.current[n.id]) {
        nodeCache.current[n.id] = {
          id: n.id,
          type: n.type,
          label: n.title,
          links: [],
          meta: { ...(n.meta || {}), source: 'system', created: Date.now() },
          state: { isCollapsed: false, isHidden: false },
          secret: n.secret ?? false,
        }
        // One-off probe – should run only during first creation
        if (n.id === 'c_001') {
          // eslint-disable-next-line no-console
          console.log(
            '[Probe A0] Newly created node frozen?',
            Object.isFrozen(nodeCache.current[n.id])
          )
        }
      }
      return nodeCache.current[n.id]
    })
    return created
  }, [])

  // (diagnostic logs removed)

  const allLinks = useMemo(() => {
    return rawEdges.map((e: any) => {
      if (!linkCache.current[e.id]) {
        linkCache.current[e.id] = {
          id: e.id,
          source: e.source,
          target: e.target,
          tier: 0,
        }
      }
      return linkCache.current[e.id]
    })
  }, [rawEdges])

  const graphData = useMemo(
    () => ({
      nodes: allNodes as any,
      links: [...rawEdgesCausal, ...rawEdgesAffinity, ...rawEdgesTemporal],
      edges_causal: rawEdgesCausal,
      edges_affinity: rawEdgesAffinity,
      edges_temporal: rawEdgesTemporal,
    }),
    [allNodes, rawEdgesCausal, rawEdgesAffinity, rawEdgesTemporal]
  )

  // --- Compute visibility set based on current slider time ---
  const visibleIdSet: Set<string> = useMemo(() => {
    return new Set<string>(
      rawNodes
        .filter((n: any) => new Date(n.firstDate) <= new Date(dates[timeIndex]))
        .map((n: any) => n.id)
    )
  }, [timeIndex])

  // visible nodes & edges for interactions (without recreating objects)
  const visibleNodesCurrent = useMemo(() => {
    return allNodes.filter((n) => visibleIdSet.has(n.id))
  }, [visibleIdSet])

  const visibleEdgesCurrent = useMemo(() => {
    return allLinks.filter((e: any) => visibleIdSet.has(e.source) && visibleIdSet.has(e.target))
  }, [visibleIdSet, allLinks])

  useEffect(() => {
    // Only initialize once
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    // Initialize graph data with all nodes
    setInteractionState((prev) => ({
      ...prev,
      masterGraphData: graphData,
    }))

    // Initialize nodes and edges in the store
    const nodesToAdd = allNodes.map((node: any) => ({
      id: node.id,
      label: node.label,
      content: node.label,
      metadata: node.meta,
    }))

    // Probe before store update
    // removed diagnostic log

    // Pass a deep JSON clone to the store to decouple references
    store.batchAddNodes(JSON.parse(JSON.stringify(nodesToAdd)))

    // Probe right after store update
    // removed diagnostic log

    const edgesToAdd = allLinks.map((link: any) => ({
      id: link.id,
      source: link.source,
      target: link.target,
      label: '',
    }))

    store.batchAddEdges(edgesToAdd)

    if (allNodes.length > 0) {
      // removed diagnostic log
    }

    setLoading(false)
  }, [graphData, allNodes, allLinks, store])

  const handleNodeClick = useCallback(
    (clickedNode: any) => {
      const nodeId = clickedNode.id as string
      setInteractionState((prev) => ({
        ...prev,
        mouseSelectedNodeId: nodeId,
      }))

      // Update selection in store
      store.selectNodes([nodeId], 'replace')

      // Perform two-hop traversal using currently visible subset
      const traversalResult = performTwoHopTraversal(
        nodeId,
        visibleNodesCurrent as any,
        visibleEdgesCurrent as any
      )
      setHighlightState(traversalResult)
      setHighlightActiveTime(Date.now())
    },
    [store, visibleNodesCurrent, visibleEdgesCurrent]
  )

  const handleNodeHover = useCallback(
    (nodeId: string | null) => {
      store.setHoverNode(nodeId)
    },
    [store]
  )

  const handleBackgroundClick = useCallback(() => {
    setInteractionState((prev) => ({
      ...prev,
      mouseSelectedNodeId: null,
    }))
    store.clearSelection()
    setHighlightState(null)
    setHighlightActiveTime(0)
  }, [store])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHighlightState(null)
        setHighlightActiveTime(0)
        setInteractionState((prev) => ({
          ...prev,
          mouseSelectedNodeId: null,
        }))
        store.clearSelection()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [store])

  // set initial timeIndex to latest on mount
  useEffect(() => {
    setTimeIndex(dates.length - 1)
    _setTimelineDate(dates[dates.length - 1])
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-cryptic text-lg animate-pulse">Loading Memory Vault...</div>
      </div>
    )
  }

  // removed diagnostic log

  return (
    <>
      <div className="relative w-screen h-screen">
        <Canvas
          camera={{ position: [0, 0, 100], fov: 50, far: 5000 }}
          gl={{ alpha: false }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            background: '#EDE4D7',
          }}
        >
          {/* Set Three.js scene clear color */}
          <color attach="background" args={['#EDE4D7']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} castShadow />

          <Suspense fallback={null}>
            <SceneContent
              viewMode={viewMode}
              nodes={allNodes}
              links={allLinks}
              visibleIds={visibleIdSet}
              handleNodeClick={handleNodeClick}
              handleNodeHover={handleNodeHover}
              handleBackgroundClick={handleBackgroundClick}
              enrichedImages={enrichedImages}
              interactionState={interactionState}
              highlightState={highlightState}
              highlightActiveTime={highlightActiveTime}
            />
          </Suspense>

          <DreiOrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={5000}
            enablePan={true}
            panSpeed={0.8}
            makeDefault
          />

          {/* <KeyboardControls /> */}

          {/* Development only */}
          {process.env.NODE_ENV === 'development' && <Stats />}
        </Canvas>
      </div>

      <PrivacyBadge />
      <ControlsHUD />
      <CategoryHUD nodes={rawNodes} onCategoriesChange={setActiveCategories} />

      {/* Time slider */}
      <TimeSlider
        dates={dates}
        timeIndex={timeIndex}
        onTimeIndexChange={(idx) => {
          setTimeIndex(idx)
          _setTimelineDate(dates[idx])
        }}
      />
      {/* Lens selector */}
      <LensSelector
        activeLens={activeLens}
        onLensChange={(lens) => {
          setActiveLens(lens)
          setInteractionState((prev) => ({ ...prev, activeLens: lens }))
        }}
      />
    </>
  )
}

export default function CrypticVaultScene() {
  return (
    <CategoryProvider>
      <CrypticVaultSceneContent />
    </CategoryProvider>
  )
}
