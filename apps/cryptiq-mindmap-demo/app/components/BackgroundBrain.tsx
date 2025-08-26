'use client'

import { Suspense, useMemo, useState, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { calculateRegionBoundaries, getRegionVertices } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'
import { Environment } from '@react-three/drei'

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
      { length: 1000 },
      (_, i) =>
        ({
          id: `ambient-${i + 1}`,
          label: `Ambient ${i + 1}`,
          size: 1,
          metadata: { category: cats[i % cats.length] } as any,
        }) as Node
    )
  }, [])
  const conceptArray = (liveConcepts.length > 0 ? liveConcepts : ambientConcepts).slice(0, 1000)

  // Use the same region-quota mapping as /brain
  const mappedIndices = useMemo(() => {
    if (vertices.length === 0) return undefined
    const boundaries = calculateRegionBoundaries(vertices)
    const R0 = getRegionVertices(vertices, 0, boundaries)
    const R1 = getRegionVertices(vertices, 1, boundaries)
    const R2 = getRegionVertices(vertices, 2, boundaries)
    const R3 = getRegionVertices(vertices, 3, boundaries)
    const N = 500
    const q0 = Math.max(0, Math.floor(N * 0.3))
    const q1 = Math.max(0, Math.floor(N * 0.25))
    const q2 = Math.max(0, Math.floor(N * 0.25))
    const q3 = Math.max(0, N - (q0 + q1 + q2))
    const takeEven = (arr: number[], count: number): number[] => {
      if (arr.length === 0 || count <= 0) return []
      const step = Math.max(1, Math.floor(arr.length / count))
      const out: number[] = []
      for (let i = 0, j = 0; i < count; i++, j = (j + step) % arr.length) out.push(arr[j])
      return out
    }
    return [...takeEven(R0, q0), ...takeEven(R1, q1), ...takeEven(R2, q2), ...takeEven(R3, q3)]
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
      setBrainOpacity(0.32 * e)
      setBrainScale(0.9 + 0.1 * e)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [vertices, introStart])

  function CameraFitter({ target = 0.72 }: { target?: number }) {
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
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
          ;(gl as any).physicallyCorrectLights = true
          const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1
          gl.setPixelRatio(dpr)
        }}
        style={{ background: '#010C2A' }}
      >
        <CameraFitter />
        {/* Lights */}
        <ambientLight intensity={1} />
        <hemisphereLight args={[0x223355, 0x000011, 0.08]} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <directionalLight position={[-8, 6, -4]} intensity={0.25} color={0x2bc7ff} />
        <Environment preset="studio" background={false} blur={0.3} />

        {/* Brain Mesh */}
        <Suspense fallback={null}>
          <BrainMesh
            modelPath="/models/brain.obj"
            wireframeColor={isScreenshotMode ? '#081E4A' : '#3eb4ff'}
            opacity={isScreenshotMode ? 0.08 : 1}
            wireframe={!isScreenshotMode}
            depthWrite={false}
            usePhysical={isScreenshotMode}
            useTwoPass={isScreenshotMode}
            rimColor="#2BC7FF"
            rimStrength={0.5}
            rimPower={2.5}
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
            surfaceOffset={1.0}
            renderMode={'spheres'}
            intro={true}
            introDurationMs={2000}
            mappedIndices={mappedIndices}
            
          />
        )}
      </Canvas>
    </div>
  )
}
