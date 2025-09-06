'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { clampDpr, capInstances } from '../../../../../../app/draw3d/modules/renderer/perf';

export type FormationViewProps = {
  positions: Float32Array;
};

function InstancedFormation({ positions }: FormationViewProps) {
  const { gl } = useThree();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // limit device pixel ratio to reduce GPU load
  useEffect(() => {
    clampDpr(gl);
  }, [gl]);

  const count = capInstances(positions.length / 3);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2]
      );
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [positions, count, dummy]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.01, 1, 1]} />
      <meshBasicMaterial color={0xffffff} toneMapped={false} />
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

