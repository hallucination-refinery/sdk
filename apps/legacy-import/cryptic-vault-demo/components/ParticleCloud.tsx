'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { type IdeaNode } from '@refinery/ideanode';

// Extended IdeaNode type with position for 3D visualization
interface IdeaNodeWithPosition extends IdeaNode {
  position?: number[];
}

export interface ParticleCloudProps {
  nodes: IdeaNodeWithPosition[];
  opacity?: number;
  visible?: boolean;
}

// Curl noise shader for organic movement
const vertexShader = `
  uniform float uTime;
  uniform float uScale;
  uniform float uMix;
  attribute vec3 targetPosition;
  attribute float aSize;
  varying vec3 vColor;
  
  // Simple curl noise function
  vec3 curl(vec3 p) {
    float e = 0.1;
    vec3 dx = vec3(e, 0.0, 0.0);
    vec3 dy = vec3(0.0, e, 0.0);
    vec3 dz = vec3(0.0, 0.0, e);
    
    vec3 p_x0 = sin(p - dx);
    vec3 p_x1 = sin(p + dx);
    vec3 p_y0 = sin(p - dy);
    vec3 p_y1 = sin(p + dy);
    vec3 p_z0 = sin(p - dz);
    vec3 p_z1 = sin(p + dz);
    
    float x = (p_y1.z - p_y0.z) - (p_z1.y - p_z0.y);
    float y = (p_z1.x - p_z0.x) - (p_x1.z - p_x0.z);
    float z = (p_x1.y - p_x0.y) - (p_y1.x - p_y0.x);
    
    return normalize(vec3(x, y, z) * 0.5);
  }
  
  void main() {
    vec3 pos = position;
    
    // Add curl noise for organic movement
    vec3 noisePos = pos * 0.05 + uTime * 0.1;
    vec3 curlOffset = curl(noisePos) * 5.0;
    pos += curlOffset;
    
    // Mix with target position for morphing
    pos = mix(pos, targetPosition, uMix);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos * uScale, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Fixed size for debugging - no attenuation
    gl_PointSize = aSize;
    
    // Bright white color for maximum visibility
    vColor = vec3(1.0, 1.0, 1.0);
  }
`;

const fragmentShader = `
  uniform float uOpacity;
  varying vec3 vColor;
  
  void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Soft edges
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    
    gl_FragColor = vec4(vColor, alpha * uOpacity);
  }
`;

export function ParticleCloud({
  nodes,
  opacity = 1,
  visible = true,
}: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create particle geometry from nodes
  const { positions, targetPositions, sizes } = useMemo(() => {
    const count = nodes.length;
    const positions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    nodes.forEach((node, i) => {
      // Initial random positions - more concentrated cloud
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const radius = 100 + Math.random() * 300; // Much smaller, concentrated cloud

      positions[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(theta);

      // Target positions from node data
      if (node.position && Array.isArray(node.position)) {
        targetPositions[i * 3] = node.position[0];
        targetPositions[i * 3 + 1] = node.position[1];
        targetPositions[i * 3 + 2] = node.position[2];
      } else {
        // Fallback to initial position
        targetPositions[i * 3] = positions[i * 3];
        targetPositions[i * 3 + 1] = positions[i * 3 + 1];
        targetPositions[i * 3 + 2] = positions[i * 3 + 2];
      }

      // Particle size - much larger for visibility
      sizes[i] = 20 + Math.random() * 10;
    });

    return { positions, targetPositions, sizes };
  }, [nodes]);

  // Debug logging
  useFrame((state) => {
    // Debug: Log every 60 frames
    if ((state.clock.elapsedTime * 60) % 60 < 1) {
      console.log('ParticleCloud Debug:', {
        visible,
        opacity,
        nodeCount: nodes.length,
        time: state.clock.elapsedTime.toFixed(2),
        cameraDistance: state.camera.position.length().toFixed(0),
      });
    }
  });

  return (
    <points ref={pointsRef} visible={visible}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPosition"
          args={[targetPositions, 3]}
          count={targetPositions.length / 3}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          args={[sizes, 1]}
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="white"
        size={30}
        sizeAttenuation={false}
        transparent
        opacity={opacity}
      />
    </points>
  );
}
