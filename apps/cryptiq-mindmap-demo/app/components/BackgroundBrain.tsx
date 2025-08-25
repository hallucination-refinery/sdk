'use client'

import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { BrainMesh } from '@refinery/canvas-r3f'
import { ConceptParticles } from '@refinery/canvas-r3f'
import { useMindmapStore } from '@refinery/store'
import type { Node } from '@refinery/schema'

export default function BackgroundBrain() {
  const [vertices, setVertices] = useState<THREE.Vector3[]>([])
  const concepts = useMindmapStore().getVisibleConcepts()
  const conceptArray = useMemo(() => (concepts as Node[]) || [], [concepts])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }} aria-hidden>
      <Canvas camera={{ position: [0, 80, 220], fov: 45 }} gl={{ antialias: true, alpha: true }}>
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
          />
        )}
      </Canvas>
    </div>
  )
}
