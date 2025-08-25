'use client'

import { Suspense, useMemo, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'

export default function BackgroundBrain() {
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const concepts = useMindmapStore().getVisibleConcepts()
  const liveConcepts = useMemo(() => (concepts as Node[]) || [], [concepts])
  const ambientConcepts = useMemo<Node[]>(() => {
    // Fallback: 500 ambient nodes so intro animation always plays
    const cats = ['values', 'traits', 'emotions', 'coping', 'goals']
    return Array.from({ length: 500 }, (_, i) => ({
      id: `ambient-${i + 1}`,
      label: `Ambient ${i + 1}`,
      size: 1,
      metadata: { category: cats[i % cats.length] } as any,
    } as Node))
  }, [])
  const conceptArray = liveConcepts.length > 0 ? liveConcepts : ambientConcepts

  function CameraFitter({ target = 0.65 }: { target?: number }) {
    const { camera } = useThree()
    useMemo(() => {
      if (vertices.length === 0) return
      const c = vertices.reduce((acc, v) => acc.add(v), new THREE.Vector3()).multiplyScalar(1 / vertices.length)
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
            opacity={0.1}
            wireframe={false}
            depthWrite={false}
            usePhysical={true}
            physicalTransmission={0.2}
            physicalThickness={0.2}
            scale={1}
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
          />
        )}
      </Canvas>
    </div>
  )
}
