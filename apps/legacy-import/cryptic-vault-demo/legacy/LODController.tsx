'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface LODLevel {
  name: 'NEAR' | 'MID' | 'FAR' | 'BRAIN';
  minDistance: number;
  maxDistance: number;
  opacity: number;
}

export interface LODControllerProps {
  onLODChange?: (level: LODLevel) => void;
  children?: React.ReactNode;
}

// LOD thresholds as specified in the task
const LOD_LEVELS: LODLevel[] = [
  { name: 'NEAR', minDistance: 0, maxDistance: 800, opacity: 1 },
  { name: 'MID', minDistance: 800, maxDistance: 2000, opacity: 1 },
  { name: 'FAR', minDistance: 2000, maxDistance: 3000, opacity: 1 },
  { name: 'BRAIN', minDistance: 3000, maxDistance: Infinity, opacity: 1 },
];

export function LODController({ onLODChange, children }: LODControllerProps) {
  const { camera } = useThree();
  const [currentLOD, setCurrentLOD] = useState<LODLevel>(LOD_LEVELS[0]);
  const [lodMix, setLodMix] = useState(0);
  const previousLOD = useRef(currentLOD);

  useFrame(() => {
    // Calculate camera distance from origin
    const distance = camera.position.length();

    // Find current LOD level
    const newLOD =
      LOD_LEVELS.find(
        (level) =>
          distance >= level.minDistance && distance < level.maxDistance,
      ) || LOD_LEVELS[LOD_LEVELS.length - 1];

    // Calculate transition mix for smooth blending
    if (newLOD.name === 'MID' && distance < 1200) {
      // Transitioning from NEAR to MID
      const transitionFactor = THREE.MathUtils.smoothstep(distance, 800, 1100);
      setLodMix(transitionFactor);
    } else if (newLOD.name === 'FAR' && distance < 2400) {
      // Transitioning from MID to FAR
      const transitionFactor = THREE.MathUtils.smoothstep(distance, 2000, 2300);
      setLodMix(transitionFactor);
    } else if (newLOD.name === 'BRAIN' && distance < 3300) {
      // Transitioning from FAR to BRAIN
      const transitionFactor = THREE.MathUtils.smoothstep(distance, 3000, 3300);
      setLodMix(transitionFactor);
    } else {
      setLodMix(newLOD.name === 'NEAR' ? 0 : 1);
    }

    // Update LOD if changed
    if (newLOD.name !== previousLOD.current.name) {
      setCurrentLOD(newLOD);
      previousLOD.current = newLOD;
      onLODChange?.(newLOD);
    }
  });

  // Provide LOD context to children
  return (
    <group>
      <lodContext.Provider value={{ currentLOD, lodMix }}>
        {children}
      </lodContext.Provider>
    </group>
  );
}

// Context for LOD state
import { createContext, useContext } from 'react';

interface LODContextValue {
  currentLOD: LODLevel;
  lodMix: number;
}

const lodContext = createContext<LODContextValue>({
  currentLOD: LOD_LEVELS[0],
  lodMix: 0,
});

export function useLOD() {
  return useContext(lodContext);
}
