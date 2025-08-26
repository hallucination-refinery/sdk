'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'

export default function BackgroundBrain() {
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const [introStart, setIntroStart] = useState<number | null>(null)
  const [brainOpacity, setBrainOpacity] = useState(0)
  const [brainScale, setBrainScale] = useState(0.92)
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
          metadata: { category: cats[i % cats.length] } as any,
        }) as Node
    )
  }, [])
  const conceptArray = liveConcepts.length > 0 ? liveConcepts : ambientConcepts

  // Even surface coverage using spherical binning (phi x theta grid)
  const mappedIndices = useMemo(() => {
    const desired = 500
    if (vertices.length === 0) return undefined
    const centroid = vertices
      .reduce((acc, v) => acc.add(v), new THREE.Vector3())
      .multiplyScalar(1 / vertices.length)
    const phiBins = 20
    const thetaBins = 25
    const bins: number[][] = Array.from({ length: phiBins * thetaBins }, () => [])
    for (let i = 0; i < vertices.length; i++) {
      const p = vertices[i].clone().sub(centroid)
      if (p.lengthSq() === 0) continue
      const r = p.length()
      const nx = p.x / r
      const ny = p.y / r
      const nz = p.z / r
      const phi = Math.atan2(ny, nx) // [-pi, pi]
      const theta = Math.acos(Math.max(-1, Math.min(1, nz))) // [0, pi]
      const pi = Math.min(phiBins - 1, Math.max(0, Math.floor(((phi + Math.PI) / (2 * Math.PI)) * phiBins)))
      const ti = Math.min(thetaBins - 1, Math.max(0, Math.floor((theta / Math.PI) * thetaBins)))
      bins[ti * phiBins + pi].push(i)
    }
    const out: number[] = []
    let bi = 0
    while (out.length < desired) {
      let attempts = 0
      while (attempts < bins.length && bins[bi].length === 0) {
        bi = (bi + 1) % bins.length
        attempts++
      }
      if (bins[bi].length === 0) break
      const idx = bins[bi].pop() as number
      out.push(idx)
      bi = (bi + 1) % bins.length
    }
    // Fallback: pad with modulo indices
    while (out.length < desired) out.push(out[out.length % Math.max(1, out.length)])
    return out
  }, [vertices])

  // Brain intro animation (opacity/scale) in tandem with particles
  useEffect(() => {
    if (vertices.length === 0 || introStart != null) return
    const start = performance.now()
    setIntroStart(start)
    const INTRO_MS = 1200
    const EXTRA_DELAY = 300
    const easeExpoInOut = (t: number) => {
      if (t <= 0) return 0
      if (t >= 1) return 1
      return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
    }
    let raf = 0
    const tick = () => {
      const now = performance.now()
      const t = Math.min(1, (now - start) / (INTRO_MS + EXTRA_DELAY))
      const e = easeExpoInOut(t)
      setBrainOpacity(0.1 * e)
      setBrainScale(0.92 + 0.08 * e)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [vertices, introStart])

  function CameraFitter({ target = 0.65 }: { target?: number }) {
    const { camera } = useThree()
    useMemo(() => {
      if (vertices.length === 0) return
      const c = vertices
        .reduce((acc, v) => acc.add(v), new THREE.Vector3())
        .multiplyScalar(1 / vertices.length)
      let r = 0
      for (const v of vertices) r = Math.max(r, v.distanceTo(c))
      if ((camera as any).isPerspectiveCamera) {
        const fov = ((camera as THREE.PerspectiveCamera).fov * Math.PI) / 180
        const z = r / Math.max(0.1, target * Math.tan(fov / 2))
        camera.position.set(0, 80, z)
        camera.lookAt(0, 0, 0)
        ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
      }
    }, [camera, vertices, target])
    return null
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} aria-hidden>
      <Canvas camera={{ position: [0, 80, 220], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <CameraFitter target={0.65} />
        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <directionalLight position={[-8, 6, -4]} intensity={0.3} color={0x3eb4ff} />

        {/* Brain Mesh */}
        <Suspense fallback={null}>
          <BrainMesh
            modelPath="/models/brain.obj"
            wireframeColor={'#081E4A'}
            opacity={brainOpacity}
            wireframe={false}
            depthWrite={false}
            usePhysical={true}
            physicalTransmission={0.2}
            physicalThickness={0.2}
            scale={brainScale}
            onVerticesLoaded={setVertices}
            visible={true}
          />
        </Suspense>

        {/* Concept Orbs */}
        {vertices.length > 0 && conceptArray.length > 0 && (
          <ConceptParticles
            concepts={conceptArray}
            vertices={vertices}
            particleSize={3}
            visible={true}
            activeLens="affinity"
            surfaceOffset={1.0}
            renderMode={'spheres'}
            intro={true}
            introDurationMs={1200}
            mappedIndices={mappedIndices}
          />
        )}
      </Canvas>
    </div>
  )
}
