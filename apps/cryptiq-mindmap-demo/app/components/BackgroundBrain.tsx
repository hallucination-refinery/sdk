'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { calculateRegionBoundaries, getRegionVertices } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'

export default function BackgroundBrain() {
  const isScreenshotMode =
    typeof window !== 'undefined' &&
    (process.env.NEXT_PUBLIC_SCREENSHOT_MODE === '1' ||
      window.location.search.includes('screenshot'))
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const [introStart, setIntroStart] = useState<number | null>(null)
  const [brainOpacity, setBrainOpacity] = useState(0)
  const [brainScale, setBrainScale] = useState(0.9)
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

  // Exact mapping used by /brain: region quotas + farthest-point sampling + deterministic order
  const mappedIndices = useMemo(() => {
    if (vertices.length === 0 || conceptArray.length === 0) return undefined

    const boundaries = calculateRegionBoundaries(vertices)
    const R0 = getRegionVertices(vertices, 0, boundaries)
    const R1 = getRegionVertices(vertices, 1, boundaries)
    const R2 = getRegionVertices(vertices, 2, boundaries)
    const R3 = getRegionVertices(vertices, 3, boundaries)

    const N = conceptArray.length
    const q0 = Math.max(0, Math.floor(N * 0.3))
    const q1 = Math.max(0, Math.floor(N * 0.25))
    const q2 = Math.max(0, Math.floor(N * 0.25))
    const q3 = Math.max(0, N - (q0 + q1 + q2))

    const hashSeed = (s: string): number => {
      let h = 1779033703 ^ s.length
      for (let i = 0; i < s.length; i++) {
        h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
        h = (h << 13) | (h >>> 19)
      }
      return h >>> 0
    }
    const mulberry32 = (aInit: number) => {
      let a = aInit >>> 0
      return () => {
        a += 0x6d2b79f5
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
      }
    }
    const shuffleDeterministic = <T,>(arr: T[], seed: string): T[] => {
      const rnd = mulberry32(hashSeed(seed))
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
    const farthestSample = (indices: number[], k: number, seed: string): number[] => {
      if (indices.length === 0 || k <= 0) return []
      const rnd = mulberry32(hashSeed(seed))
      const picked: number[] = []
      picked.push(indices[Math.floor(rnd() * indices.length)])
      while (picked.length < Math.min(k, indices.length)) {
        let bestIndex = -1
        let bestDist = -1
        for (const idx of indices) {
          let minD = Infinity
          const p = vertices[idx]
          for (const sel of picked) {
            const q = vertices[sel]
            const d = p.distanceToSquared(q)
            if (d < minD) minD = d
          }
          if (minD > bestDist) {
            bestDist = minD
            bestIndex = idx
          }
        }
        if (bestIndex === -1) break
        picked.push(bestIndex)
      }
      return picked
    }

    const anchors0 = farthestSample(R0, q0, 'fp-0')
    const anchors1 = farthestSample(R1, q1, 'fp-1')
    const anchors2 = farthestSample(R2, q2, 'fp-2')
    const anchors3 = farthestSample(R3, q3, 'fp-3')
    let anchorPool = [...anchors0, ...anchors1, ...anchors2, ...anchors3]
    if (anchorPool.length < N) {
      const remainder = N - anchorPool.length
      const allIndices = vertices.map((_, i) => i)
      anchorPool = anchorPool.concat(
        shuffleDeterministic(allIndices, 'anchors-all').slice(0, remainder)
      )
    }

    return conceptArray.map((_, i) => anchorPool[i % anchorPool.length])
  }, [vertices, conceptArray])

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
      setBrainOpacity(0.32 * e)
      setBrainScale(0.9 + 0.1 * e)
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
      <Canvas
        camera={{ position: [0, 80, 220], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#010C2A' }}
      >
        <CameraFitter target={0.65} />
        {/* Lights */}
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <directionalLight position={[-8, 6, -4]} intensity={0.3} color={0x3eb4ff} />

        {/* Brain Mesh */}
        <Suspense fallback={null}>
          <BrainMesh
            modelPath="/models/brain.obj"
            wireframeColor={isScreenshotMode ? '#081E4A' : '#3eb4ff'}
            opacity={isScreenshotMode ? 0.08 : 1}
            wireframe={!isScreenshotMode}
            depthWrite={false}
            usePhysical={isScreenshotMode}
            physicalTransmission={0.2}
            physicalThickness={0.25}
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
            surfaceOffset={0.1}
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
