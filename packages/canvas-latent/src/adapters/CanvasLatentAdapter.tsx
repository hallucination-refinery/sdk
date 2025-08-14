import React, { forwardRef, useImperativeHandle, useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { DEFAULT_ANIMATION_CONFIG } from '../constants'
import { NodeAttributeManager } from '../core/NodeAttributeManager'
import { InstancedNodeMesh } from '../core/InstancedNodeMesh'
import { PositionCalculator } from '../utils/PositionCalculator'
const FORCE_VISIBLE = process.env.NEXT_PUBLIC_LATENT_TRACE === '1'
import type { CanvasLatentProps, CanvasLatentRef } from '../types'

const CanvasLatentAdapter = forwardRef<CanvasLatentRef, CanvasLatentProps>((props, ref) => {
  const {
    graphData,
    onNodeClick,
    onNodeHover,
    onNodeRightClick: _onNodeRightClick,
    onBackgroundClick,
    onBackgroundRightClick: _onBackgroundRightClick,
    nodeColor,
    nodeRelSize,
    enableNavigationControls,
    enablePointerInteraction,
    // Accept but ignore for compatibility (do not spread on DOM)
    nodeThreeObject: _nodeThreeObject,
    nodeThreeObjectExtend: _nodeThreeObjectExtend,
  } = props

  // Internal refs for implementation
  const internalGraphData = useRef(graphData)
  const sceneRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const controlsRef = useRef<any>(null)

  // Update internal graph data when prop changes
  useEffect(() => {
    internalGraphData.current = graphData
  }, [graphData])

  // Ref API implementation
  const refMethods: CanvasLatentRef = {
    // Graph data methods
    graphData: () => internalGraphData.current,

    // Camera methods
    cameraPosition: (_position, _lookAt, _duration) => {
      // Stub implementation - return current position
      return { x: 0, y: 0, z: 100 }
    },

    zoomToFit: (_duration, padding, _nodeFilter) => {
      // Stub implementation
      console.warn('zoomToFit called', { padding })
    },

    // Node methods
    centerAt: (x = 0, y = 0, _duration) => {
      // Stub implementation
      return { x, y }
    },

    zoom: (zoomLevel, _duration) => {
      // Stub implementation
      return zoomLevel || 1
    },

    // Force simulation methods (no-ops)
    d3Force: (_forceName, _force) => {
      // No-op for canvas-latent
      return null
    },

    d3ReheatSimulation: () => {
      // No-op for canvas-latent
    },

    d3AlphaTarget: (target) => {
      // No-op for canvas-latent
      return target || 0
    },

    d3AlphaDecay: (decay) => {
      // No-op for canvas-latent
      return decay || 0.0228
    },

    d3VelocityDecay: (decay) => {
      // No-op for canvas-latent
      return decay || 0.4
    },

    // Utility methods
    refresh: () => {},

    pauseAnimation: () => {},

    resumeAnimation: () => {},

    // Scene access
    scene: () => sceneRef.current,
    camera: () => cameraRef.current,
    renderer: () => rendererRef.current,
    controls: () => controlsRef.current,

    // Screen/world coordinate conversion
    screen2GraphCoords: (x, y, distance = 0) => {
      // Stub implementation
      return { x, y, z: distance }
    },

    graph2ScreenCoords: (x, y, _z = 0) => {
      // Stub implementation
      return { x, y }
    },

    // Node position methods
    getGraphBbox: (nodeFilter) => {
      // Stub implementation
      const nodes = internalGraphData.current.nodes
      const filteredNodes = nodeFilter ? nodes.filter(nodeFilter) : nodes

      if (filteredNodes.length === 0) {
        return { x: [0, 0], y: [0, 0], z: [0, 0] }
      }

      // Calculate bounding box from filtered nodes
      let minX = Infinity,
        maxX = -Infinity
      let minY = Infinity,
        maxY = -Infinity
      let minZ = Infinity,
        maxZ = -Infinity

      filteredNodes.forEach((node: any) => {
        const x = node.x || 0
        const y = node.y || 0
        const z = node.z || 0

        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y)
        minZ = Math.min(minZ, z)
        maxZ = Math.max(maxZ, z)
      })

      return {
        x: [minX, maxX],
        y: [minY, maxY],
        z: [minZ, maxZ],
      }
    },
  }

  // Expose ref methods
  useImperativeHandle(ref, () => refMethods, [graphData])

  // Expose to window.__FG for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as any).__FG = refMethods
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__FG
      }
    }
  }, [])

  // Wire store callbacks with raycaster interaction
  // (legacy interaction helpers removed; R3F handlers used instead)

  // R3F scene that mounts InstancedMesh and wires attributes/interaction
  function LatentScene() {
    const three = useThree()
    const orbitRef = useRef<any>(null)
    const meshRef = useRef<THREE.InstancedMesh | null>(null)
    const mgrRef = useRef<NodeAttributeManager | null>(null)
    const burstStartRef = useRef<number | null>(null)
    const burstDoneRef = useRef<boolean>(false)
    const targetsRef = useRef<THREE.Vector3[]>([])

    // Build mesh + manager once per graph size
    const count = graphData?.nodes?.length ?? 0
    const calc = useMemo(() => new PositionCalculator(42), [count])

    useEffect(() => {
      if (!count) return

      const { mesh } = InstancedNodeMesh.build(count)
      // Ensure instanceColor attribute exists for per-instance colors
      ;(mesh as any).instanceColor = new THREE.InstancedBufferAttribute(
        new Float32Array(count * 3),
        3
      )

      // Scale geometry by nodeRelSize (uniform for baseline)
      if (nodeRelSize && nodeRelSize !== 1) {
        mesh.scale.setScalar(nodeRelSize)
      }

      // Attach to group/scene
      ;(three.scene as any).add(mesh)
      meshRef.current = mesh

      // Attribute manager
      const mgr = new NodeAttributeManager(count)
      mgr.setMesh(mesh)
      mgrRef.current = mgr
      if (FORCE_VISIBLE) {
        const positions: THREE.Vector3[] = []
        for (let i=0;i<count;i++) {
          const n=graphData.nodes[i]
          const tx=(n.x ?? n.position?.x) ?? 0
          const ty=(n.y ?? n.position?.y) ?? 0
          const tz=(n.z ?? n.position?.z) ?? 0
          mgr.setPosition(n.id ?? String(i), new THREE.Vector3(tx,ty,tz))
          mgr.setOpacity(n.id ?? String(i), 1)
          // Initialize visible color (prefer nodeColor prop, else default medium-blue)
          const colorStr = typeof nodeColor === 'function' ? nodeColor(n) : undefined
          const color = new THREE.Color(colorStr ?? 0x2196f3)
          mgr.setColor(n.id ?? String(i), color)
          positions.push(new THREE.Vector3(tx,ty,tz))
        }
        mgr.flush()
        try {
          InstancedNodeMesh.zoomToFit(positions, three.camera as any, orbitRef.current, 1.2)
          // One-shot reframe to ensure reliable framing after first paint
          setTimeout(() => {
            try { InstancedNodeMesh.zoomToFit(positions, three.camera as any, orbitRef.current, 1.2) } catch (_err) { void _err }
          }, 300)
        } catch (_err) { void _err }
        try { (mesh.material as any).transparent=false } catch (_err) { void _err }
        burstDoneRef.current=true
      }

      // Register nodes, set initial positions at origin (burst start)
      targetsRef.current = []
      for (let i = 0; i < count; i++) {
        const n = graphData.nodes[i]
        const nodeId = n.id ?? String(i)
        mgr.registerNode(nodeId, i, {
          id: nodeId,
          position: { x: 0, y: 0, z: 0 },
          category: n.category,
          tags: n.tags,
          timestamp: n.timestamp,
        } as any)

        // Initial at origin
        mgr.setPosition(nodeId, new THREE.Vector3(0, 0, 0))
        mgr.setOpacity(nodeId, 1)

        // Initialize visible color before first flush (prefer nodeColor, else default medium-blue)
        {
          const colorStr = typeof nodeColor === 'function' ? nodeColor(n) : undefined
          const c = new THREE.Color(colorStr ?? 0x2196f3)
          mgr.setColor(nodeId, c)
        }

        // Target position from data if present, else deterministic
        const tx = n.x ?? n.position?.x ?? undefined
        const ty = n.y ?? n.position?.y ?? undefined
        const tz = n.z ?? n.position?.z ?? undefined
        const target =
          tx !== undefined && ty !== undefined && tz !== undefined
            ? new THREE.Vector3(tx, ty, tz)
            : calc.calculate(nodeId, undefined, i)
        targetsRef.current.push(target)
      }

      // Start burst animation clock
      burstStartRef.current = performance.now()
      burstDoneRef.current = false

      // Initial camera frame: zoom to fit after burst completes
      return () => {
        ;(three.scene as any).remove(mesh)
        mgr.dispose()
      }
    }, [count])

    // Pointer interactions via r3f events on primitive mesh
    // Pointer handlers will be attached via raycaster integration in a follow-up edit

    // Animate burst on mount; then remain static
    useFrame(() => {
      const mgr = mgrRef.current
      const mesh = meshRef.current
      if (!mgr || !mesh) return

      const now = performance.now()
      const start = burstStartRef.current
      const dur = DEFAULT_ANIMATION_CONFIG.burstDuration

      if (!burstDoneRef.current && start != null) {
        const t = Math.min(1, (now - start) / dur)
        for (let i = 0; i < (internalGraphData.current.nodes?.length ?? 0); i++) {
          const n = internalGraphData.current.nodes[i]
          const id = n.id ?? String(i)
          const target = targetsRef.current[i]
          const pos = new THREE.Vector3().copy(target).multiplyScalar(t) // lerp from (0,0,0)
          mgr.setPosition(id, pos)
        }
        if (t >= 1) {
          burstDoneRef.current = true
          // Post-burst zoom to fit + one-shot reframe
          const positions = targetsRef.current
          InstancedNodeMesh.zoomToFit(positions, three.camera as any, orbitRef.current, 1.2)
          setTimeout(() => {
            try { InstancedNodeMesh.zoomToFit(positions, three.camera as any, orbitRef.current, 1.2) } catch (_err) { void _err }
          }, 300)
        }
      }

      // Flush all dirty ranges in one go
      mgr.flush()
    })

    const OC: any = OrbitControls
    return (
      <>
        {enableNavigationControls && <OC ref={orbitRef} makeDefault />}
        {/* events attached at Canvas root via onPointerMissed; per-instance handlers on primitive require jsx pragma. */}
        {/* Mesh is attached imperatively to scene; we rely on manager + flush in frame. */}
      </>
    )
  }

  return (
    <Canvas
      style={{ width: '100%', height: '100%', background: '#0d1117' }}
      onPointerMissed={(e) => onBackgroundClick?.(e)}
    >
      <LatentScene />
    </Canvas>
  )
})

CanvasLatentAdapter.displayName = 'CanvasLatentAdapter'

export default CanvasLatentAdapter
