'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { clampDpr, capInstances } from './perf';
import { useFormationTransition } from './transitions';

export type FormationViewProps = {
  positions: Float32Array;
};

function InstancedFormation({ positions }: FormationViewProps) {
  const { gl } = useThree();
  const mesh = useRef<THREE.InstancedMesh>(null);

  // limit device pixel ratio to reduce GPU load
  useEffect(() => {
    clampDpr(gl);
  }, [gl]);

  const maxInstances = capInstances(positions.length / 3);
  const count = useFormationTransition(mesh, positions, maxInstances);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 1, 1]} />
      <meshBasicMaterial
        color={0xffffff}
        toneMapped={false}
        transparent
        opacity={1}
      />
    </instancedMesh>
  );
}

export default function FormationView({ positions }: FormationViewProps) {
  return (
    <Canvas dpr={[1, 2]}>
      <group scale={1.8}>
        <InstancedFormation positions={positions} />
      </group>
    </Canvas>
  );
}
