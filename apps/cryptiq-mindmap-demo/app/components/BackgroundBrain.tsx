'use client'

import { Suspense, useMemo, useState, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'

export default function BackgroundBrain() {
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const [introStart, setIntroStart] = useState<number | null>(null)
  const [anchorPool, setAnchorPool] = useState<number[] | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const concepts = useMindmapStore().getVisibleConcepts()
  const liveConcepts = useMemo(() => (concepts as Node[]) || [], [concepts])
  const ambientConcepts = useMemo<Node[]>(() => {
    // Fallback: 500 ambient nodes so intro animation always plays
    const cats = ['values', 'traits', 'emotions', 'coping', 'goals']
    return Array.from(
      { length: 500 },
      (_, i) =>
        ({
          id: `ambient-${i + 1}`,
          label: `Ambient ${i + 1}`,
          size: 1,
          metadata: { category: cats[i % cats.length] } as Record<string, unknown>,
        }) as Node
    )
  }, [])
  const conceptArray = liveConcepts.length > 0 ? liveConcepts : ambientConcepts

  // Load canonical farthest-point anchors once (cached). If unavailable, set to empty array.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/models/brain-anchors-500.json', { cache: 'force-cache' })
        if (!res.ok) throw new Error('anchors missing')
        const json = await res.json()
        const arr: number[] = Array.isArray(json) ? json : json.indices
        if (!cancelled && Array.isArray(arr)) setAnchorPool(arr)
      } catch {
        // No shipped anchors: compute in a worker once vertices are available
        if (!cancelled) setAnchorPool([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // If no static anchors, compute an anchor pool off-thread once we have vertices
  useEffect(() => {
    if (anchorPool === null) return // still trying static
    if (anchorPool.length > 0) return // already have static
    if (vertices.length === 0) return // need vertices
    if (workerRef.current) return // already computing
    try {
      const w = new Worker(new URL('./brainAnchors.worker.ts', import.meta.url), {
        type: 'module',
      })
      workerRef.current = w
      w.onmessage = (e: MessageEvent<{ anchors?: number[]; error?: string }>) => {
        if (e.data?.anchors && Array.isArray(e.data.anchors)) {
          setAnchorPool(e.data.anchors)
        }
        w.terminate()
        workerRef.current = null
      }
      const verts = vertices.slice(0, vertices.length).map((v) => ({ x: v.x, y: v.y, z: v.z }))
      w.postMessage({ vertices: verts, count: Math.min(500, conceptArray.length) })
    } catch {
      // If worker fails, leave anchorPool as [] so we still render with hash fallback
    }
  }, [anchorPool, vertices, conceptArray.length])

  // Build mappedIndices exactly how /brain does it: concept index → anchorPool[i % L].
  const mappedIndices = useMemo(() => {
    if (!anchorPool || anchorPool.length === 0) return null
    if (vertices.length === 0 || conceptArray.length === 0) return null
    const pool = anchorPool.filter((i) => i >= 0 && i < vertices.length)
    if (pool.length === 0) return null
    const n = Math.min(500, conceptArray.length)
    const out = new Array<number>(n)
    for (let i = 0; i < n; i++) out[i] = pool[i % pool.length]
    return out
  }, [anchorPool, vertices, conceptArray])

  // Brain shell fade-in (opacity only) after particles finish
  useEffect(() => {
    if (vertices.length === 0 || introStart != null) return
    // Wait for anchorPool fetch to resolve (null => still loading, [] => missing OK)
    if (conceptArray.length > 0 && anchorPool === null) return
    // Delay shell fade until particles finish: 1200ms + 300ms = 1500ms
    const PARTICLES_MS = 1200
    const PARTICLES_STAGGER_MS = 300
    const SHELL_DELAY_MS = PARTICLES_MS + PARTICLES_STAGGER_MS
    const start = performance.now() + SHELL_DELAY_MS
    setIntroStart(start)
    const INTRO_MS = 1200
    const EXTRA_DELAY = 400
    let raf = 0
    const tick = () => {
      const now = performance.now()
      if (now < start) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = Math.min(1, (now - start) / (INTRO_MS + EXTRA_DELAY))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [vertices, conceptArray.length, anchorPool, introStart])

  function CameraFitter({ target = 0.72 }: { target?: number }) {
    const { camera } = useThree()
    useMemo(() => {
      if (vertices.length === 0) return
      const c = vertices
        .reduce((acc, v) => acc.add(v), new THREE.Vector3())
        .multiplyScalar(1 / vertices.length)
      let r = 0
      for (const v of vertices) r = Math.max(r, v.distanceTo(c))
      if ((camera as THREE.Camera) && (camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
        const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
        const z = r / Math.max(0.1, target * Math.tan(fov / 2))
        camera.position.set(0, 80, -z)
        camera.lookAt(0, 0, 0)
        ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
      }
    }, [camera, vertices, target])
    return null
  }

  const enableControls = useMemo(() => {
    if (typeof window === 'undefined') return false
    return (
      window.location.search.includes('controls') || process.env.NEXT_PUBLIC_ENABLE_CONTROLS === '1'
    )
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: enableControls ? 'auto' : 'none',
      }}
      aria-hidden={!enableControls}
    >
      <Canvas
        camera={{ position: [0, 80, 220], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#010C2A' }}
      >
        <CameraFitter target={0.75} />
        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <directionalLight position={[-8, 6, -4]} intensity={0.3} color={0x3eb4ff} />

        {/* Brain Mesh */}
        <Suspense fallback={null}>
          <BrainMesh
            modelPath="/models/brain.obj"
            wireframeColor={'#003375'}
            opacity={0.08}
            scale={1}
            wireframe={true}
            depthWrite={false}
            usePhysical={true}
            physicalTransmission={0.2}
            physicalThickness={0.25}
            emissiveIntensity={0.35}
            onVerticesLoaded={setVertices}
            visible={true}
          />
        </Suspense>

        {/* Concept Orbs */}
        {vertices.length > 0 && conceptArray.length > 0 && (
          <ConceptParticles
            concepts={conceptArray}
            vertices={vertices}
            mappedIndices={mappedIndices ?? undefined}
            particleSize={4}
            visible={true}
            activeLens="affinity"
            surfaceOffset={0.1}
            renderMode={'spheres'}
            intro={true}
            introDurationMs={2000}
          />
        )}

        {enableControls && <OrbitControls enableDamping dampingFactor={0.12} />}
      </Canvas>
    </div>
  )
}
