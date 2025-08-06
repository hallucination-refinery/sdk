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
}: CrypticAnimusSceneProps) {
  const fgRef = useRef<any>(null)
  
  // Replace graphVersion with ref-based tracking to prevent remounts
  const graphDataRef = useRef(data)
  const prevDataStatsRef = useRef<{ nodeCount: number; linkCount: number }>({ nodeCount: 0, linkCount: 0 })
  const hasSpawnedRef = useRef(false)
  
  // Debug mode flag
  const isDebugMode = process.env.NODE_ENV === 'development' && 
                     process.env.NEXT_PUBLIC_DEBUG_GRAPH === 'true'
  
  // Retry counters
  const physicsRetryCount = useRef(0)
  const windowFGRetryCount = useRef(0)
  
  // Track RAW structure changes and update ref without remounts
  useEffect(() => {
    const nodeCount = data.nodes.length
    const linkCount = data.links.length
    
    if (prevDataStatsRef.current.nodeCount !== nodeCount || 
        prevDataStatsRef.current.linkCount !== linkCount) {
      console.log('[GRAPH VERSION] Raw structure changed - updating ref. Nodes:', nodeCount, 'Links:', linkCount)
      graphDataRef.current = data
      prevDataStatsRef.current = { nodeCount, linkCount }
    }
  }, [data]) // Track data changes
  
  // Validation logging (separate useEffect)
  useEffect(() => {
    console.log('[REMOUNT CHECK] graphDataRef updated, visibleIds:', visibleIds?.size)
  }, [visibleIds?.size])

  const {
    nodes: memoizedNodes,
    links: memoizedLinks,
    nodeMap,
  } = useMemo(() => {
    // console.log('[CrypticAnimusScene] Memoizing graph data')  // COMMENTED OUT: Render-phase console.log
    
    // Use structuredClone to ensure fresh objects, replacing shallow spreads
    const nodes = structuredClone(data.nodes)
    const links = structuredClone(data.links)
    
    // Gate spawn logic with hasSpawnedRef
    if (!hasSpawnedRef.current && nodes.length > 0) {
      const spawnMode = process.env.NEXT_PUBLIC_GRAPH_SPAWN
      const nodeCount = nodes.length
      let positionsAdded = 0
      
      if (spawnMode === "sphere") {
        // Use sphere pattern for initial positions
        const radius = Math.cbrt(nodeCount) * 50 // Scale radius based on node count
        
        nodes.forEach((node, index) => {
          // Use golden ratio for better distribution
          const goldenRatio = (1 + Math.sqrt(5)) / 2
          const theta = 2 * Math.PI * index / goldenRatio
          const phi = Math.acos(1 - 2 * (index + 0.5) / nodeCount)
          
          // Convert spherical to cartesian coordinates
          node.x = radius * Math.sin(phi) * Math.cos(theta)
          node.y = radius * Math.sin(phi) * Math.sin(theta)
          node.z = radius * Math.cos(phi)
          
          // Add small random perturbation to avoid perfect symmetry
          node.x += (Math.random() - 0.5) * 10
          node.y += (Math.random() - 0.5) * 10
          node.z += (Math.random() - 0.5) * 10
          
          positionsAdded++
        })
        
        console.log(`[INIT POSITIONS] Spawned ${positionsAdded} nodes - mode: sphere (radius: ${radius.toFixed(0)})`)
      } else {
        // Default: spawn all nodes at origin for burst animation
        nodes.forEach((node) => {
          node.x = 0
          node.y = 0
          node.z = 0
          positionsAdded++
        })
        
        console.log(`[INIT POSITIONS] Spawned ${positionsAdded} nodes - mode: origin`)
      }
      
      hasSpawnedRef.current = true
    }
    
    const nodeMap = new Map(nodes.map((node) => [node.id, node]))
    return { nodes, links, nodeMap }
  }, [data]) // Use data dependency

  const memoizedGraphData = useMemo(
    () => ({
      nodes: memoizedNodes,
      links: memoizedLinks,
    }),
    [memoizedNodes, memoizedLinks]
  )

  // Log before rendering ForceGraph3D to confirm component mounts
  // console.log('[Animus] render ForceGraph3D')  // COMMENTED OUT: Render-phase console.log
  
  // Build verification marker
  // console.log('[Build marker] CrypticAnimusScene v3 - useEffect deps fix - built at:', new Date().toISOString())  // COMMENTED OUT: Render-phase console.log
  
  // Debug data availability
  // console.log('[Data debug] nodes:', memoizedGraphData.nodes.length, 'links:', memoizedGraphData.links.length)  // COMMENTED OUT: Render-phase console.log
  // console.log('[Data debug] ForceGraph3D component loaded:', !!ForceGraph3D)  // COMMENTED OUT: Render-phase console.log
  
  // Debug filter states that control node visibility
  // console.log('[FILTERS] visibleIds:', visibleIds ? `Set(${visibleIds.size})` : 'undefined')  // COMMENTED OUT: Render-phase console.log
  // console.log('[FILTERS] activeCategories:', activeCategories ? `Set(${activeCategories.size})` : 'undefined')  // COMMENTED OUT: Render-phase console.log
  // console.log('[FILTERS] showSecrets:', showSecrets)  // COMMENTED OUT: Render-phase console.log
  // console.log('[FILTERS] activeTags:', activeTags ? `Set(${activeTags.size})` : 'undefined')  // COMMENTED OUT: Render-phase console.log

  // Configure physics forces
  useEffect(() => {
    const checkAndConfigurePhysics = () => {
      if (!fgRef.current || !fgRef.current.d3Force) {
        physicsRetryCount.current++
        if (physicsRetryCount.current > 50) { // Max 5 seconds
          console.error('[Physics config] Failed to initialize after 50 retries')
          return
        }
        // Only log first retry and every 10th
        if (physicsRetryCount.current === 1 || physicsRetryCount.current % 10 === 0) {
          console.log(`[Physics config] Retry ${physicsRetryCount.current}...`)
        }
        setTimeout(checkAndConfigurePhysics, 100)
        return
      }
      
      console.log('[Physics config] Initialized successfully')
      physicsRetryCount.current = 0

      console.log('[CrypticAnimusScene] Configuring physics forces!')

      // Configure physics for a very spread-out layout with rigid links
      fgRef.current
        .d3Force('link')
        ?.distance(200) // Significantly increase the target link length
        ?.strength(0.5) // Make links very stiff to enforce equal distance

      fgRef.current
        .d3Force('charge')
        ?.strength(-500) // Much stronger repulsion to ensure node separation
        ?.distanceMax(800) // Increase max distance for charge effect

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
        windowFGRetryCount.current++
        if (windowFGRetryCount.current > 50) {
          console.error('[Window FG] Failed to setup after 50 retries')
          return
        }
        if (windowFGRetryCount.current === 1 || windowFGRetryCount.current % 10 === 0) {
          console.log(`[Window FG] Retry ${windowFGRetryCount.current}...`)
        }
        setTimeout(setupWindowFG, 100)
        return
      }
      
      windowFGRetryCount.current = 0
      
      ;(window as any).__FG = fgRef.current
      
      if (isDebugMode) {
        console.log('FG ref', fgRef.current)
        console.log('[Window FG] window.__FG assigned successfully')
      }
      
      // Wrap all operations in try-catch to prevent debugger pause
      try {
        if (isDebugMode) {
          // === Phase 0 Instrumentation - BEFORE ===
          const simData = (window as any).__FG?.graphData?.()
          if (simData?.nodes?.length > 0) {
            const beforePos = { x: simData.nodes[0].x, y: simData.nodes[0].y, z: simData.nodes[0].z }
            console.log('[FREEZE-TEST before]', {
              node0: simData.nodes[0],
              hasVelocity: 'vx' in simData.nodes[0],
              position: beforePos,
              frozen: Object.isFrozen(simData.nodes[0]),
            })
            ;(window as any).__beforePos = beforePos
          }
          // === Phase 0 Instrumentation - AFTER ===
          if (simData?.nodes?.length > 0 && (window as any).__beforePos) {
            console.log('[FREEZE-TEST after ]', {
              node0: simData.nodes[0],
              hasVelocity: 'vx' in simData.nodes[0],
              position: { x: simData.nodes[0].x, y: simData.nodes[0].y, z: simData.nodes[0].z },
              positionChanged:
                simData.nodes[0].x !== (window as any).__beforePos.x || 
                simData.nodes[0].y !== (window as any).__beforePos.y || 
                simData.nodes[0].z !== (window as any).__beforePos.z,
            })
          }
        }
        // Initial reheat and force multiple ticks with counting
        console.log('%c[REHEAT] Initial d3ReheatSimulation called', 'color: red; font-weight: bold; font-size: 14px')
        if (fgRef.current.d3ReheatSimulation) {
          // FIXME: Also check engine ready before d3ReheatSimulation
          // if (!(fgRef.current as any).__kapsuleInstance?.layout) {
          //   console.log('[REHEAT] Force layout engine not ready, skipping reheat')
          //   return
          // }
          fgRef.current.d3ReheatSimulation()
        }
        
        // Force many ticks to ensure initial separation
        let tickCount = 0
        const maxTicks = 20 // perf cap
        console.log('[TICKS] Starting forced tick execution...')
        
        // early-exit until the kapsule instance exists
        if (!fgRef.current?.tickFrame) {
          console.log('[TICKS] ForceGraph not ready yet, skipping tick execution')
          return
        }
        
        // FIXME: Add engine ready check to prevent tick crash
        // The crash "Cannot read properties of undefined (reading 'tick')" occurs when
        // tickFrame() is called before the D3 force layout engine is initialized.
        // Uncomment the following guard to prevent the crash:
        /*
        if (!(fgRef.current as any).__kapsuleInstance?.layout) {
          console.log('[TICKS] Force layout engine not initialized yet, skipping tick execution')
          return
        }
        */
        
        // run the warm-up ticks **after** the instance is ready
        for (let i = 0; i < maxTicks; i++) {
          if (fgRef.current.tickFrame) {
            const result = fgRef.current.tickFrame()
            if (result !== undefined) tickCount++
          }
        }
        console.log(`[TICKS] Executed ${tickCount} ticks successfully (target: ${maxTicks})`)
        
        // Verify simulation is active
        console.log('[SIMULATION] Testing if forces are applied...')
        const linkForce = fgRef.current.d3Force?.('link')
        const chargeForce = fgRef.current.d3Force?.('charge')
        const centerForce = fgRef.current.d3Force?.('center')
        console.log('[FORCES] link:', !!linkForce, 'charge:', !!chargeForce, 'center:', !!centerForce)
        
        // Remove problematic debug code that references undefined graphData
        console.log('[Debug] window.__FG type:', typeof (window as any).__FG)
        console.log('[Debug] window.__FG has graphData method:', typeof (window as any).__FG?.graphData === 'function')
      } catch (error) {
        console.error('[Window FG] Error during initial setup:', error)
        console.error('[Window FG] Stack trace:', (error as Error).stack)
      }
      
      // Initial position check
      if (isDebugMode) {
        setTimeout(() => {
        try {
          const simData = (window as any).__FG?.graphData?.()
          if (simData?.nodes?.length > 0) {
            console.log('[INITIAL POS] Checking initial node positions...')
            const sampleSize = Math.min(5, simData.nodes.length)
            let allAtOrigin = true
            
            for (let i = 0; i < sampleSize; i++) {
              const node = simData.nodes[i]
              const x = node.x ?? 0
              const y = node.y ?? 0
              const z = node.z ?? 0
              
              if (Math.abs(x) > 0.01 || Math.abs(y) > 0.01 || Math.abs(z) > 0.01) {
                allAtOrigin = false
              }
              
              console.log(`[INITIAL POS] Node ${node.id}: (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`)
            }
            
            if (allAtOrigin) {
              console.error('[INITIAL POS] CRITICAL: All nodes start at origin (0,0,0)!')
              console.log('[INITIAL POS] This explains the clumping - nodes need initial positions')
            } else {
              console.log('[INITIAL POS] Good: Nodes have initial positions')
            }
          }
        } catch (e) {
          console.error('[INITIAL POS] Error checking positions:', e)
        }
      }, 500) // Wait a bit for simulation to initialize
      }
      
      // Position monitoring commented out due to runtime error at line 167
      // TODO: Access simulation data correctly through ForceGraph API
      // Previous code was accessing input graphData instead of simulation data
      
      // PHASE 1: Deep inspection of window.__FG - wait 1s to ensure full initialization
      if (isDebugMode) {
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
        // Note: r3f-forcegraph doesn't expose internal state like __kapsuleInstance
        const hiddenProps = ['_engine', '_state', '_simulation', '_graphForce', '__graphSimulation']
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
          
          const keys = Object.keys((window as any).__FG)
          const protoKeys = Object.keys(Object.getPrototypeOf((window as any).__FG) || {})
          
          console.log(`=== PHASE 2: Ref Evolution at ${label} ===`)
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
      
      // PHASE 2B: Access Simulation Data Correctly
      setTimeout(() => {
        console.log('=== PHASE 2B: Accessing Simulation Data ===')
        
        if (!(window as any).__FG) {
          console.log('ERROR: window.__FG is undefined')
          return
        }
        
        // Test 1: graphData() method
        console.log('1. Testing graphData() method:')
        try {
          const simData = (window as any).__FG.graphData?.()
          console.log('  graphData() returned:', typeof simData)
          console.log('  Has nodes?', Array.isArray(simData?.nodes))
          console.log('  Node count:', simData?.nodes?.length)
          if (simData?.nodes?.length > 0) {
            console.log('  First node:', simData.nodes[0])
            console.log('  Node has x,y,z?', 'x' in simData.nodes[0], 'y' in simData.nodes[0], 'z' in simData.nodes[0])
            
            // Check first 3 nodes for positions
            const sample = simData.nodes.slice(0, 3)
            sample.forEach((node: any, i: number) => {
              console.log(`  Node ${i}: id=${node.id}, x=${node.x}, y=${node.y}, z=${node.z}`)
            })
          }
        } catch (e) {
          console.log('  graphData() ERROR:', e)
        }
        
        // Test 2: THREE.js scene graph
        console.log('2. Exploring THREE.js scene:')
        try {
          const fg = (window as any).__FG
          console.log('  FG is THREE.Object3D?', fg?.isObject3D)
          console.log('  FG type:', fg?.type)
          console.log('  Children count:', fg?.children?.length)
          if (fg?.children?.length > 0) {
            console.log('  First child type:', fg.children[0]?.type)
            console.log('  First child name:', fg.children[0]?.name)
          }
        } catch (e) {
          console.log('  THREE.js exploration ERROR:', e)
        }
        
        // Test 3: getGraphBbox for bounds
        console.log('3. Testing getGraphBbox:')
        try {
          const bbox = (window as any).__FG.getGraphBbox?.()
          console.log('  Bounding box:', bbox)
        } catch (e) {
          console.log('  getGraphBbox ERROR:', e)
        }
      }, 2000)
      
      // Monitor positions over time
      const monitorPositions = (delay: number, label: string) => {
        setTimeout(() => {
          if (!(window as any).__FG) return
          
          try {
            const simData = (window as any).__FG.graphData?.()
            if (simData?.nodes?.length > 0) {
              const sample = simData.nodes.slice(0, 3)
              console.log(`=== Position Monitor at ${label} ===`)
              sample.forEach((node: any) => {
                console.log(`Node ${node.id}: x=${node.x?.toFixed(2)}, y=${node.y?.toFixed(2)}, z=${node.z?.toFixed(2)}`)
              })
            }
          } catch (e) {
            console.log(`Position monitor error at ${label}:`, e)
          }
        }, delay)
      }
      
      // Monitor at different times
      monitorPositions(3000, '3s')
      monitorPositions(4000, '4s')
      monitorPositions(5000, '5s')
      
      // PHASE 4: Force Simulation Activation
      setTimeout(() => {
        console.log('=== PHASE 4: Force Simulation Activation ===')
        
        if (!(window as any).__FG) {
          console.log('ERROR: window.__FG is undefined')
          return
        }
        
        // Test 1: Add positional forces to spread nodes
        console.log('1. Adding positional forces to spread nodes:')
        try {
          // Add weak x,y forces to prevent all nodes at center
          const xForce = (window as any).__FG.d3Force?.('x', null)
          const yForce = (window as any).__FG.d3Force?.('y', null)
          console.log('  Cleared x,y forces')
          
          // Add collision force to push nodes apart
          console.log('  Testing collision force...')
          const hasCollide = (window as any).__FG.d3Force?.('collide')
          console.log('  Current collide force:', !!hasCollide)
          
          // Strengthen charge force even more
          const chargeForce = (window as any).__FG.d3Force?.('charge')
          if (chargeForce && chargeForce.strength) {
            chargeForce.strength(-800) // Very strong repulsion
            console.log('  Increased charge force strength to -800')
          }
          
          // Reheat after force changes
          console.log('%c[REHEAT] After force modifications', 'color: green; font-weight: bold')
          ;(window as any).__FG.d3ReheatSimulation?.()
          
          // Force many ticks
          const maxTicks = 20 // perf cap
          for (let i = 0; i < maxTicks; i++) {
            (window as any).__FG.tickFrame?.()
          }
          console.log(`  Forced ${maxTicks} additional ticks`)
        } catch (e) {
          console.log('  Force modification ERROR:', e)
        }
        
        // Test 2: Manual node position spreading
        console.log('2. Testing manual node spreading:')
        try {
          const simData = (window as any).__FG.graphData?.()
          if (simData?.nodes?.length > 0) {
            console.log('  Current first 3 nodes:')
            simData.nodes.slice(0, 3).forEach((n: any) => {
              console.log(`    ${n.id}: x=${n.x}, y=${n.y}, z=${n.z}`)
            })
            
            // Check if all at origin
            const allAtOrigin = simData.nodes.every((n: any) => 
              n.x === 0 && n.y === 0 && n.z === 0
            )
            console.log('  All nodes at origin?', allAtOrigin)
            
            if (allAtOrigin) {
              console.log('  Manually spreading nodes...')
              // Spread nodes in a sphere
              simData.nodes.forEach((node: any, i: number) => {
                const angle1 = (i / simData.nodes.length) * Math.PI * 2
                const angle2 = (i / simData.nodes.length) * Math.PI
                const radius = 100
                node.x = radius * Math.sin(angle2) * Math.cos(angle1)
                node.y = radius * Math.sin(angle2) * Math.sin(angle1)
                node.z = radius * Math.cos(angle2)
              })
              
              // Update graph with new positions
              ;(window as any).__FG.graphData?.(simData)
              console.log('  Applied manual spreading')
              
              // Reheat and tick
              ;(window as any).__FG.d3ReheatSimulation?.()
              const maxTicks = 20 // perf cap
              for (let i = 0; i < maxTicks; i++) {
                (window as any).__FG.tickFrame?.()
              }
            }
          }
        } catch (e) {
          console.log('  Manual spreading ERROR:', e)
        }
        
        // Test 3: Use refresh method
        console.log('3. Testing refresh method:')
        try {
          ;(window as any).__FG.refresh?.()
          console.log('  Called refresh()')
        } catch (e) {
          console.log('  refresh() ERROR:', e)
        }
      }, 4500) // Run after other phases complete
      }

      // TEMP diagnostics: kick simulation each second and log alpha
      // REMOVED: Per-second timer to improve performance
      // intervalId = setInterval(() => { ... }, 1000)
    }
    
    setupWindowFG()
    
    return () => {
      // Cleanup removed since intervalId timer was disabled
      // if (intervalId) clearInterval(intervalId)
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
    [] // Remove all dependencies - sprites are cached globally
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
      // Use imperative selectNode method on adapter ref
      if (fgRef.current?.selectNode) {
        fgRef.current.selectNode(node.id, true)
      }
      // Also call the prop handler if provided
      if (onNodeClick) {
        onNodeClick(node)
      }
    },
    [onNodeClick]
  )

  // Handle node hover - memoized to prevent re-creating function
  const handleNodeHover = useCallback(
    (node: any) => {
      // Use imperative highlightNode method on adapter ref
      if (fgRef.current?.highlightNode) {
        fgRef.current.highlightNode(node ? node.id : null)
      }
      // Also call the prop handler if provided
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
      const sourceNode = nodeMap.get(sourceId)
      const targetNode = nodeMap.get(targetId)

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
    [activeCategories, highlightState, visibleIds, nodeMap] // Include actual deps
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

  // Add memoized nodeVisibility callback
  const nodeVisibility = useCallback(
    (node: any) => {
      return nodePassesFilters(node)
    },
    [nodePassesFilters]
  )

  // Add memoized linkVisibility callback to prevent prop changes
  const linkVisibility = useCallback(
    (link: any) => {
      const sId = typeof link.source === 'object' ? link.source.id : link.source
      const tId = typeof link.target === 'object' ? link.target.id : link.target

      const sourceNode = nodeMap.get(sId)
      const targetNode = nodeMap.get(tId)

      return nodePassesFilters(sourceNode) && nodePassesFilters(targetNode)
    },
    [nodeMap, nodePassesFilters]
  )

  // Sample check: are any nodes passing filters?
  const passingNodes = memoizedNodes.filter(nodePassesFilters)
  // console.log('[FILTERS] Nodes passing filters:', passingNodes.length, '/', memoizedNodes.length)  // COMMENTED OUT: Render-phase console.log
  if (passingNodes.length === 0) {
    // console.error('[FILTERS] WARNING: No nodes pass visibility filters!')  // COMMENTED OUT: Render-phase console.log
  }

  return (
    <FGErrorBoundary>
      <ForceGraph3D
        ref={fgRef}
        graphData={memoizedGraphData}
        // dataVersion removed to prevent remounts
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
        cooldownTime={Infinity}
        nodeVisibility={nodeVisibility} // Use memoized callback
        linkVisibility={linkVisibility} // Use memoized callback
        linkOpacity={getLinkOpacity}
        onBackgroundClick={onBackgroundClickRequest}
        activeCategories={activeCategories}
        activeTags={activeTags}
      />
    </FGErrorBoundary>
  )
}
