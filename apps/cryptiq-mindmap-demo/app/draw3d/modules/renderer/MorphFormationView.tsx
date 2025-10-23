'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { clampDpr, capInstances } from './perf'
import { resampleCloud, computeMorphMap, easeOutBack, easeOutQuad } from './morph'

export type MorphFormationViewProps = {
  source?: Float32Array
  target: Float32Array
  durationMs?: number
  bounce?: boolean
  fitScale?: number
}

function InstancedMorph({
  source,
  target,
  durationMs = 500,
  bounce = false,
  fitScale = 1,
}: MorphFormationViewProps) {
  const { gl } = useThree()
  const mesh = useRef<any>(null)
  const dummy = useRef<any>(new THREE.Object3D())
  const capacity = useRef(0)
  const anim = useRef<{ start: number; duration: number; active: boolean }>({
    start: 0,
    duration: durationMs,
    active: false,
  })

  if (capacity.current === 0) {
    const maxCount = Math.max(source ? source.length : 0, target.length) / 3
    capacity.current = capInstances(maxCount)
  }

  // limit device pixel ratio to reduce GPU load
  useEffect(() => {
    clampDpr(gl)
  }, [gl])

  const data = useMemo(() => {
    const maxCount = Math.max(source ? source.length : 0, target.length) / 3
    const count = capInstances(maxCount) // respect device/env caps
    const tgt = resampleCloud(target, count)
    const src = source ? resampleCloud(source, count) : undefined
    const map = src ? computeMorphMap(src, tgt) : undefined
    return { count, src, tgt, map }
  }, [source, target])

  const radii = useMemo(() => {
    const arr = new Float32Array(data.count)
    let maxR = 0
    const t = data.tgt
    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3
      const x = t[i3]
      const y = t[i3 + 1]
      const z = t[i3 + 2]
      const r = Math.sqrt(x * x + y * y + z * z)
      arr[i] = r
      if (r > maxR) maxR = r
    }
    if (maxR > 0) {
      for (let i = 0; i < data.count; i++) arr[i] /= maxR
    }
    return arr
  }, [data])

  // Initialize instance positions and scales
  useEffect(() => {
    const m = mesh.current
    if (!m) return
    if (capacity.current < data.count) {
      // Guard disposal to avoid leaking the previous GPU buffer when resizing capacity
      if ((m.instanceMatrix as any)?.dispose) {
        ;(m.instanceMatrix as any).dispose()
      }
      // If instanceColor gets introduced later, dispose it here as well to avoid a parallel leak
      if ((m.instanceColor as any)?.dispose) {
        ;(m.instanceColor as any).dispose()
      }
      capacity.current = data.count
      m.instanceMatrix = new (THREE as any).InstancedBufferAttribute(
        new Float32Array(capacity.current * 16),
        16
      )
    }
    m.instanceMatrix.setUsage((THREE as any).DynamicDrawUsage)
    m.count = data.count
    const { src, tgt, map } = data
    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3
      if (src && map) {
        const sIdx = map[i] * 3
        dummy.current.position.set(src[sIdx], src[sIdx + 1], src[sIdx + 2])
      } else {
        dummy.current.position.set(tgt[i3], tgt[i3 + 1], tgt[i3 + 2])
      }
      dummy.current.scale.setScalar(0)
      dummy.current.updateMatrix()
      m.setMatrixAt(i, dummy.current.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    anim.current = {
      start: performance.now(),
      duration: durationMs,
      active: true,
    }
  }, [data, durationMs])

  useFrame(() => {
    const m = mesh.current
    if (!m) return
    const { start, duration, active } = anim.current
    if (!active) return
    const t = Math.min((performance.now() - start) / duration, 1)
    const eased = easeOutQuad(t)
    const scaleVal = bounce ? easeOutBack(eased) : eased
    const thresh = eased

    const tgt = data.tgt
    const src = data.src
    const map = data.map

    for (let i = 0; i < data.count; i++) {
      const i3 = i * 3
      if (src && map) {
        const sIdx = map[i] * 3
        dummy.current.position.set(
          src[sIdx] + (tgt[i3] - src[sIdx]) * eased,
          src[sIdx + 1] + (tgt[i3 + 1] - src[sIdx + 1]) * eased,
          src[sIdx + 2] + (tgt[i3 + 2] - src[sIdx + 2]) * eased
        )
      } else {
        dummy.current.position.set(tgt[i3], tgt[i3 + 1], tgt[i3 + 2])
      }

      const visible = radii[i] <= thresh
      dummy.current.scale.setScalar(visible ? scaleVal : 0)
      dummy.current.updateMatrix()
      m.setMatrixAt(i, dummy.current.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    if (t >= 1) anim.current.active = false
  })

  return (
    <group scale={1.8 * fitScale}>
      {/* @ts-expect-error r3f intrinsic */}
      <instancedMesh ref={mesh} args={[undefined, undefined, capacity.current]}>
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
    <Canvas
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e: any) => e.preventDefault())
      }}
      gl={{ powerPreference: 'high-performance' }}
    >
      <InstancedMorph {...props} />
    </Canvas>
  )
}
