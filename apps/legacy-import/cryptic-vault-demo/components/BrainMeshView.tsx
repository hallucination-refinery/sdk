'use client';

import React from 'react';
import * as THREE from 'three';

interface BrainMeshViewProps {
  nodes: any[];
  opacity?: number;
  visible?: boolean;
}

export function BrainMeshView({
  nodes,
  opacity = 1,
  visible = true,
}: BrainMeshViewProps) {
  return (
    <group visible={visible}>
      {/* Placeholder brain mesh - replace with actual brain model later */}
      <mesh>
        <sphereGeometry args={[80, 64, 64]} />
        <meshStandardMaterial
          color="#8B7FD8"
          opacity={opacity}
          transparent
          roughness={0.3}
          metalness={0.2}
          emissive="#4A3F70"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Placeholder text */}
      <group position={[0, 100, 0]}>
        <mesh>
          <planeGeometry args={[200, 40]} />
          <meshBasicMaterial color="black" opacity={0.8} transparent />
        </mesh>
        {/* Note: Text would go here but needs @react-three/drei */}
      </group>
    </group>
  );
}
