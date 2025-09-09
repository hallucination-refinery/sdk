'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
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

  // respect device/env caps on instance count
  const maxInstances = capInstances(positions.length / 3)
  const count = useFormationTransition(mesh, positions, maxInstances)

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

export default function FormationView({ positions }: FormationViewProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    >
      <InstancedFormation positions={positions} />
    </Canvas>
  )
}
