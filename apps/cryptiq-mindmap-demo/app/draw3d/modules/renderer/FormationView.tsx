'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useFormationTransition } from '../../../../../../app/draw3d/modules/renderer/transitions';
import type * as THREE from 'three';

export type FormationViewProps = {
  positions: Float32Array;
};

const MAX_INSTANCES = 20000;

function InstancedFormation({ positions }: FormationViewProps) {
  const { gl } = useThree();
  const mesh = useRef<THREE.InstancedMesh>(null);

  // limit device pixel ratio to reduce GPU load
  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }, [gl]);

  const count = useFormationTransition(mesh, positions, MAX_INSTANCES);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.01, 1, 1]} />
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
      <InstancedFormation positions={positions} />
    </Canvas>
  );
}

