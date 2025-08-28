'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as THREE from 'three'
import React, { useEffect, useMemo, useRef } from 'react'
// Post-processing pixelation (same approach as BackgroundBrain)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - type defs for three/examples may be missing in this workspace
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { RenderPixelatedPass } from 'three/examples/jsm/postprocessing/RenderPixelatedPass'

type MaskModelProps = {
  url: string
  opacity?: number
}

function normalizeScene(scene: THREE.Object3D): { group: THREE.Group } {
  // Clone so we can safely modify
  const cloned = scene.clone(true)
  const group = new THREE.Group()
  group.add(cloned)

  // Center and unit-scale
  const box = new THREE.Box3().setFromObject(cloned)
  const size = new THREE.Vector3()
  box.getSize(size)
  const maxDim = Math.max(size.x, size.y, size.z) || 1
  const scale = 1 / maxDim
  const center = new THREE.Vector3()
  box.getCenter(center)
  cloned.position.sub(center) // center to origin
  cloned.scale.setScalar(scale)

  return { group }
}

function MaskModel({ url, opacity = 1 }: MaskModelProps) {
  const { scene } = useGLTF(url)

  const obj = useMemo(() => normalizeScene(scene), [scene])

  // Preserve original materials & textures; only enable transparency and set opacity
  obj.group.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m: THREE.Material) => {
        const mat = m as THREE.Material & { opacity?: number; transparent?: boolean }
        mat.transparent = true
        if (typeof opacity === 'number') mat.opacity = opacity
      })
    }
  })

  return <primitive object={obj.group} />
}

function Pixelation({ pixelSize = 4 }: { pixelSize?: number }) {
  const { gl, scene, camera, size } = useThree()
  const composerRef = useRef<EffectComposer | null>(null)
  useEffect(() => {
    const composer = new EffectComposer(gl)
    composer.addPass(new RenderPass(scene, camera))
    const pixelPass = new RenderPixelatedPass(pixelSize, scene, camera)
    composer.addPass(pixelPass)
    composer.setSize(size.width, size.height)
    composerRef.current = composer
    return () => {
      composer.dispose()
      composerRef.current = null
    }
  }, [gl, scene, camera, size, pixelSize])
  useEffect(() => {
    if (composerRef.current) composerRef.current.setSize(size.width, size.height)
  }, [size])
  useFrame(() => {
    if (composerRef.current) composerRef.current.render()
  }, 1)
  return null
}

export default function MaskStage({ model, opacity = 1 }: { model: string; opacity?: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        ;(gl as unknown as { toneMappingExposure?: number }).toneMappingExposure = 1.2
      }}
    >
      {/* Quick lighting pass to lift PBR without HDRI */}
      <hemisphereLight args={[0xffffff, 0x222233, 0.8]} />
      <ambientLight intensity={2.5} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, -2, -2]} intensity={0.8} />
      <group position={[0, -0.05, 0]}>
        <MaskModel url={model} opacity={opacity} />
      </group>
      {/* Pixelate final frame so textures remain but receive the effect */}
      <Pixelation pixelSize={4} />
    </Canvas>
  )
}

// Preloads disabled during pointcloud testing to avoid 404 and extra GLTF work
// useGLTF.preload('/models/mask-placeholder.glb')
// useGLTF.preload('/models/realistic_croissant.glb')
