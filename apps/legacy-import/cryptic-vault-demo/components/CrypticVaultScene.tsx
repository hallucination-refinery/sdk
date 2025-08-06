// @ts-nocheck
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls, Stats } from '@react-three/drei'
import { Suspense, useEffect, useState, useRef, useCallback, useMemo } from 'react'
// import KeyboardControls from './KeyboardControls';
import PrivacyBadge from './PrivacyBadge'
import ControlsHUD from './ControlsHUD'
import CategoryHUD from './CategoryHUD'
import { CategoryProvider, useCategory } from '@/contexts/CategoryContext'
import {
  useGraphStore,
  useUIStore,
  useAppStore,
  useSingleSelectedNode,
  mapToArrays,
  arraysToMaps,
} from '@/store'
import { type IdeaNode } from '@refinery/schema'
import { ClusterVisualization } from './ClusterVisualization'
import CrypticAnimusScene from './CrypticAnimusScene'
import BrainMeshView from './BrainMeshView'
import { performTwoHopTraversal, type TraversalResult } from '@/utils/graphTraversal'
import TimeSlider from './TimeSlider'
import LensSelector from './LensSelector'
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

interface ConceptsData {
  nodes: Concept[]
  edges: Edge[]
  memories?: any[]
  clusters: Record<string, { name: string; color: string }>
  meta: any
}

// Load graph bundle with edge arrays
const graphBundle = require('@/data/graph_bundle.json')
const conceptsJson = require('@/data/concepts.json') as ConceptsData
const dates: string[] = (timelineData as any[]).map((d) => d.date)

// Note: We're using CrypticAnimusScene instead of the SDK's AnimusScene
// for custom glowing orb visualization

// Extended IdeaNode type with position for 3D visualization
interface IdeaNodeWithPosition extends IdeaNode {
  position?: number[]
}

// Convert concepts data to IdeaNode format
function convertConceptsToIdeaNodes(
  concepts: Concept[],
  edges: Edge[]
): {
  nodes: IdeaNodeWithPosition[]
  links: { source: string; target: string; tier: 0 }[]
} {
  const nodes: IdeaNodeWithPosition[] = concepts.map((concept) => ({
    id: concept.id,
    type: concept.type as any,
    label: concept.label,
    links: [], // Will be populated from edges
    metadata: {
      source: 'system' as const,
      created: Date.now(),
      relevanceScore: 0.8,
      conceptType: concept.type,
      topics: concept.meta?.topics ?? [],
      secret: concept.meta?.secret ?? false,
      cluster: concept.clusterId || 'cluster_bridge',
    },
    secret: concept.meta?.secret ?? false,
    state: {
      isSelected: false,
      currentLOD: 'Mid' as const,
      isCollapsed: false,
      isHidden: false,
      isLinkingStart: false,
    },
    // Remove position assignment - let physics engine calculate
    // position: concept.position, // Pre-computed 3D position
  }))

  // Create links from edges
  const links: { source: string; target: string; tier: 0 }[] = edges.map((edge) => ({
    source: edge.source,
    target: edge.target,
    tier: 0,
  }))

  // Update node links array for each node
  nodes.forEach((node) => {
    const nodeLinks = edges.filter((edge) => edge.source === node.id).map((edge) => edge.target)
    node.links = nodeLinks
  })

  return { nodes, links }
}

// Scene content component that renders based on view mode
function SceneContent({
  viewMode,
  visibleIds,
  handleNodeClick,
  handleNodeHover,
  handleBackgroundClick,
  enrichedImages,
  highlightState,
  highlightActiveTime,
  singleSelectedNodeId,
}: {
  viewMode: 'nodes' | 'clusters' | 'brain'
  visibleIds: Set<string>
  handleNodeClick: (node: any) => void
  handleNodeHover: (nodeId: string | null) => void
  handleBackgroundClick: () => void
  enrichedImages: Map<string, string>
  highlightState: TraversalResult | null
  highlightActiveTime: number
  singleSelectedNodeId: string | null
}) {
  const { activeCategories } = useCategory()
  // Get graph data from store and convert to arrays for ForceGraph3D
  const graphStore = useGraphStore()
  const appStore = useAppStore()
  const uiStore = useUIStore()

  // Transform nodes and links inside the component to prevent unnecessary recreations
  const transformedData = useMemo(() => {
    // CRITICAL: Remove ALL visibility filtering from transformedData
    // Convert ALL nodes/edges to arrays WITHOUT filtering
    const allNodesArray = Array.from(graphStore.nodes.values())
    const allEdgesArray = Array.from(graphStore.edges.values())

    const transformedNodes: any[] = allNodesArray.map((node) => ({
      ...node,
      childLinks: [],
      state: {
        ...node.state,
        isCollapsed: node.state?.isCollapsed ?? false,
        isHidden: node.state?.isHidden ?? false,
      },
    }))

    const transformedLinks: any[] = allEdgesArray.map((link) => ({
      id: link.id || `${link.source}-${link.target}`,
      source: link.source,
      target: link.target,
      tier: link.tier || 0,
      confidence: link.confidence || 0.8,
    }))

    // console.log(
    //   '[SceneContent] Transforming full graph - NO filtering. Nodes:',
    //   transformedNodes.length
    // )  // COMMENTED OUT: Render-phase console.log in useMemo
    return { nodes: transformedNodes, links: transformedLinks }
  }, [graphStore.nodes, graphStore.edges]) // NO visibleIds dependency!

  return (
    <>
      {/* Nodes View: Individual memory nodes */}
      {viewMode === 'nodes' && transformedData.nodes.length > 0 && (
        <CrypticAnimusScene
          data={transformedData}
          onNodeClick={handleNodeClick}
          onNodeHoverProp={handleNodeHover}
          mouseSelectedNodeId={singleSelectedNodeId}
          searchResultOutlineIds={appStore.searchResultNodeIds}
          currentInteractionMode={appStore.currentInteractionMode}
          gesturedNodeId={appStore.gesturedNodeId}
          activeCategories={activeCategories}
          onBackgroundClickRequest={handleBackgroundClick}
          highlightState={highlightState}
          visibleIds={visibleIds}
        />
      )}

      {/* Clusters View: Grouped patterns */}
      {viewMode === 'clusters' && (
        <ClusterVisualization nodes={transformedData.nodes} opacity={1} visible={true} />
      )}

      {/* Brain View: Brain mesh visualization */}
      {viewMode === 'brain' && (
        <BrainMeshView nodes={transformedData.nodes} opacity={1} visible={true} />
      )}

      {/* EnergyRippleOverlay disabled for now */}
    </>
  )
}

function CrypticVaultSceneContent() {
  const controlsRef = useRef<any>(null)
  const graphStore = useGraphStore()
  const uiStore = useUIStore()
  const appStore = useAppStore()
  const singleSelectedNodeId = useSingleSelectedNode()
  const [loading, setLoading] = useState(true)
  const [viewMode] = useState<'nodes' | 'clusters' | 'brain'>('nodes')
  const { setActiveCategories } = useCategory()
  const timeIndex = appStore.timeIndex
  const [highlightState, setHighlightState] = useState<TraversalResult | null>(null)
  const [highlightActiveTime, setHighlightActiveTime] = useState<number>(0)
  const nodeCache = useRef<Record<string, any>>({})
  const linkCache = useRef<Record<string, any>>({})
  const hasInitialisedGraph = useRef<boolean>(false)

  // Stub for enrichedImages - empty Map as documented
  const enrichedImages = new Map<string, string>()

  const {
    nodes: rawNodes,
    edges_causal: rawEdgesCausal = [],
    edges_affinity: rawEdgesAffinity = [],
    edges_temporal: rawEdgesTemporal = [],
  } = graphBundle as any

  const activeLens = appStore.activeLens

  // choose edge array based on active lens
  const rawEdges =
    activeLens === 'affinity'
      ? rawEdgesAffinity
      : activeLens === 'temporal'
        ? rawEdgesTemporal
        : rawEdgesCausal

  // Build full node & link object caches ONCE (they keep positions/state)
  const allNodes: IdeaNodeWithPosition[] = useMemo(() => {
    return rawNodes.map((n: any) => {
      if (!nodeCache.current[n.id]) {
        nodeCache.current[n.id] = {
          id: n.id,
          type: n.type,
          label: n.title,
          links: [],
          metadata: { ...(n.meta || {}), source: 'system', created: Date.now() },
          state: { isCollapsed: false, isHidden: false },
          secret: n.secret ?? false,
        }
      }
      return nodeCache.current[n.id]
    })
  }, [])

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
    // Guard to prevent re-initialization
    if (hasInitialisedGraph.current) return
    hasInitialisedGraph.current = true

    // Convert array data to Maps and initialize graph store
    const nodeArray = graphData.nodes.map((n: any) => ({
      id: n.id,
      label: n.label || n.title || '',
      type: n.type || 'idea',
      links: n.links || [],
      metadata: { ...n.meta, source: 'system', created: n.meta?.created || Date.now() },
      state: n.state || {
        isSelected: false,
        currentLOD: 'Mid',
        isCollapsed: false,
        isHidden: false,
        isLinkingStart: false,
      },
      secret: n.secret ?? false,
    }))

    const edgeArray = [
      ...graphData.edges_causal,
      ...graphData.edges_affinity,
      ...graphData.edges_temporal,
    ].map((e: any) => ({
      id: e.id || `${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      confidence: e.confidence || e.weight || 0.8,
    }))

    const { nodes: nodesMap, edges: edgesMap } = arraysToMaps(nodeArray, edgeArray)

    // Batch add nodes and edges to store
    graphStore.batchAddNodes(nodeArray)
    graphStore.batchAddEdges(edgeArray)

    // Initialize dial state
    appStore.setDialState({
      interwingleMode: 0, // Minimal filtering
      searchDepth: 3, // Maximum allowed depth
    })

    setLoading(false)
  }, [graphData, graphStore, appStore])

  const handleNodeClick = useCallback(
    (clickedNode: any) => {
      const nodeId = clickedNode.id as string
      // uiStore.selectNodes([nodeId], 'replace')  // COMMENTED OUT: Testing for render-phase state write

      // Perform two-hop traversal using currently visible subset
      const traversalResult = performTwoHopTraversal(
        nodeId,
        visibleNodesCurrent as any,
        visibleEdgesCurrent as any
      )
      setHighlightState(traversalResult)
      setHighlightActiveTime(Date.now())
    },
    [uiStore, visibleNodesCurrent, visibleEdgesCurrent]
  )

  const handleNodeHover = useCallback(
    (nodeId: string | null) => {
      // uiStore.setHoverNode(nodeId)  // COMMENTED OUT: Testing for render-phase state write
    },
    [uiStore]
  )

  const handleBackgroundClick = useCallback(() => {
    uiStore.selectNodes([], 'replace')
    setHighlightState(null)
    setHighlightActiveTime(0)
  }, [uiStore])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHighlightState(null)
        setHighlightActiveTime(0)
        uiStore.selectNodes([], 'replace')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [uiStore])

  // set initial timeIndex to latest on mount
  useEffect(() => {
    appStore.setTimeIndex(dates.length - 1)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-cryptic text-lg animate-pulse">Loading Memory Vault...</div>
      </div>
    )
  }

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
              visibleIds={visibleIdSet}
              handleNodeClick={handleNodeClick}
              handleNodeHover={handleNodeHover}
              handleBackgroundClick={handleBackgroundClick}
              enrichedImages={enrichedImages}
              highlightState={highlightState}
              highlightActiveTime={highlightActiveTime}
              singleSelectedNodeId={singleSelectedNodeId}
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
      <TimeSlider dates={dates} />
      {/* Lens selector */}
      <LensSelector />
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
