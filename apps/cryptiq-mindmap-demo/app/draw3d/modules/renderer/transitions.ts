import { useEffect, useRef, type MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const MIN_MS = 250
const MAX_MS = 400

export function useFormationTransition(
  mesh: MutableRefObject<any>,
  positions: Float32Array,
  maxInstances: number
) {
  const dummy = useRef<any>(new THREE.Object3D())
  const buffer = useRef<Float32Array>(new Float32Array(positions.length))
  const anim = useRef<{ start: number; duration: number; active: boolean }>({
    start: 0,
    duration: 300,
    active: false,
  })

  if (buffer.current.length !== positions.length) {
    buffer.current = new Float32Array(positions.length)
  }

  const count = Math.min(positions.length / 3, maxInstances)

  useEffect(() => {
    const m = mesh.current
    if (!m) return
    buffer.current.set(positions)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      dummy.current.position.set(buffer.current[i3], buffer.current[i3 + 1], buffer.current[i3 + 2])
      dummy.current.updateMatrix()
      m.setMatrixAt(i, dummy.current.matrix)
    }
    m.instanceMatrix.needsUpdate = true
    const material = m.material as any
    material.opacity = 0
    material.transparent = true
    m.scale.setScalar(0.8)
    anim.current = {
      start: performance.now(),
      duration: MIN_MS + Math.random() * (MAX_MS - MIN_MS),
      active: true,
    }
  }, [positions, count, mesh])

  useFrame(() => {
    const m = mesh.current
    if (!m) return
    const { start, duration, active } = anim.current
    if (!active) return
    const t = Math.min((performance.now() - start) / duration, 1)
    const material = m.material as any
    material.opacity = t
    m.scale.setScalar(0.8 + 0.2 * t)
    if (t >= 1) {
      anim.current.active = false
    }
  })

  return count
}
