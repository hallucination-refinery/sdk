'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { clampDpr, capInstances } from './perf'
import { useFormationTransition } from './transitions'

export type FormationViewProps = {
  positions: Float32Array
}

function InstancedFormation({ positions }: FormationViewProps) {
  const { gl } = useThree()
  const mesh = useRef<any>(null)

  // limit device pixel ratio to reduce GPU load
  useEffect(() => {
    clampDpr(gl)
  }, [gl])

  // respect device/env caps on instance count and keep mesh mounted
  const maxInstances = useMemo(
    () => capInstances(positions.length / 3),
    [positions.length]
  )
  const visibleCount = useFormationTransition(mesh, positions, maxInstances)

  // expose visible count instead of remounting
  useEffect(() => {
    const m = mesh.current
    if (m) m.count = visibleCount
  }, [visibleCount])

  const instancedArgs = useMemo(
    () => [undefined, undefined, maxInstances] as const,
    [maxInstances]
  )

  return (
    <group scale={1.8}>
      {/* @ts-expect-error r3f intrinsic */}
      <instancedMesh ref={mesh} args={instancedArgs}>
        {/* @ts-expect-error r3f intrinsic */}
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial color={0xffffff} toneMapped={false} transparent opacity={1} />
        {/* @ts-expect-error r3f intrinsic */}
      </instancedMesh>
    </group>
  )
}

export default function FormationView({ positions }: FormationViewProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
      onContextLost={(e) => e.preventDefault()}
      gl={{ powerPreference: 'high-performance' }}
    >
      <InstancedFormation positions={positions} />
    </Canvas>
  )
}
