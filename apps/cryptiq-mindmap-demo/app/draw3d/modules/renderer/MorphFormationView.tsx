'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { clampDpr, capInstances } from './perf'
import { pairAndMorph } from './morph'

export type MorphFormationViewProps = {
  source: Float32Array
  target: Float32Array
  durationMs?: number
}

function InstancedMorph({ source, target, durationMs }: MorphFormationViewProps) {
  const { gl } = useThree()
  const mesh = useRef<any>(null)
  const dummy = useRef<any>(new THREE.Object3D())
  const anim = useRef<{ start: number; duration: number; active: boolean }>({
    start: 0,
    duration: 300,
    active: false,
  })

  useEffect(() => {
    clampDpr(gl)
  }, [gl])

  const data = useMemo(() => {
    const maxCount = Math.max(source.length, target.length) / 3
    const count = capInstances(maxCount)
    return pairAndMorph(source, target, count)
  }, [source, target])

  const count = data.source.length / 3

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    const src = data.source
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.current.position.set(src[i3], src[i3 + 1], src[i3 + 2])
      dummy.current.updateMatrix()
      m.setMatrixAt(i, dummy.current.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    anim.current = {
      start: performance.now(),
      duration: durationMs ?? 300 + Math.random() * 200,
      active: true,
    }
  }, [data, durationMs, count])

  useFrame(() => {
    const m = mesh.current
    if (!m) return
    const { start, duration, active } = anim.current
    if (!active) return
    const t = Math.min((performance.now() - start) / duration, 1)
    const src = data.source
    const tgt = data.target
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.current.position.set(
        src[i3] + (tgt[i3] - src[i3]) * t,
        src[i3 + 1] + (tgt[i3 + 1] - src[i3 + 1]) * t,
        src[i3 + 2] + (tgt[i3 + 2] - src[i3 + 2]) * t
      )
      dummy.current.updateMatrix()
      m.setMatrixAt(i, dummy.current.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    if (t >= 1) {
      anim.current.active = false
    }
  })

  return (
    <group scale={1.8}>
      {/* @ts-expect-error r3f intrinsic */}
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        {/* @ts-expect-error r3f intrinsic */}
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial color={0xffffff} toneMapped={false} transparent opacity={1} />
        {/* @ts-expect-error r3f intrinsic */}
      </instancedMesh>
    </group>
  )
}

export default function MorphFormationView(props: MorphFormationViewProps) {
  return (
    <Canvas dpr={[1, 2]} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <InstancedMorph {...props} />
    </Canvas>
  )
}
