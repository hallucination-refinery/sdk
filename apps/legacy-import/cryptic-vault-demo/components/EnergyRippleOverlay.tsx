'use client';

import { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { ShaderMaterial } from 'three';
import * as THREE from 'three';
import type { TraversalResult } from '@/utils/graphTraversal';

// Extend shader material for TypeScript
extend({ ShaderMaterial });

interface EnergyRippleOverlayProps {
  highlightState: TraversalResult | null;
  nodes: any[];
  activeTime?: number; // Time when highlight was activated
}

const vertexShader = `
  attribute vec3 color;
  attribute float size;
  attribute float ripplePhase;
  
  varying vec3 vColor;
  varying float vRipplePhase;
  
  void main() {
    vColor = color;
    vRipplePhase = ripplePhase;
    
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform float time;
  uniform float rippleDuration;
  
  varying vec3 vColor;
  varying float vRipplePhase;
  
  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    
    // Calculate ripple progress (0 to 1)
    float progress = mod(time - vRipplePhase, rippleDuration) / rippleDuration;
    
    // Create expanding ring
    float ringRadius = progress * 0.5;
    float ringWidth = 0.1;
    float ring = smoothstep(ringRadius - ringWidth, ringRadius, dist) - 
                 smoothstep(ringRadius, ringRadius + ringWidth, dist);
    
    // Fade out over time
    float fadeOut = 1.0 - progress;
    
    // Combine effects
    float alpha = ring * fadeOut * 0.8;
    
    // Add central glow
    float glow = exp(-dist * 4.0) * 0.3 * fadeOut;
    alpha += glow;
    
    gl_FragColor = vec4(vColor, alpha);
  }
`;

export default function EnergyRippleOverlay({
  highlightState,
  nodes,
  activeTime = 0,
}: EnergyRippleOverlayProps) {
  const meshRef = useRef<THREE.Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  
  // Create particle data for highlighted nodes
  const particleData = useMemo(() => {
    if (!highlightState || highlightState.nodeIds.size === 0) {
      return { positions: [], colors: [], sizes: [], ripplePhases: [] };
    }
    
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];
    const ripplePhases: number[] = [];
    
    nodes.forEach(node => {
      if (highlightState.nodeIds.has(node.id)) {
        // Position
        const pos = node.position || [0, 0, 0];
        positions.push(pos[0], pos[1], pos[2]);
        
        // Color based on upstream/downstream
        let color = new THREE.Color('#FFFFFF');
        if (highlightState.upstreamNodes.has(node.id)) {
          color = new THREE.Color('#FFA500'); // Orange
        } else if (highlightState.downstreamNodes.has(node.id)) {
          color = new THREE.Color('#00FF00'); // Green
        } else {
          color = new THREE.Color('#FFFF00'); // Yellow for selected
        }
        colors.push(color.r, color.g, color.b);
        
        // Size
        sizes.push(60);
        
        // Random phase offset for ripple timing
        ripplePhases.push(Math.random() * 0.5);
      }
    });
    
    return { positions, colors, sizes, ripplePhases };
  }, [highlightState, nodes]);
  
  // Create buffer attributes
  const bufferAttributes = useMemo(() => {
    if (particleData.positions.length === 0) return null;
    
    return {
      position: new THREE.Float32BufferAttribute(particleData.positions, 3),
      color: new THREE.Float32BufferAttribute(particleData.colors, 3),
      size: new THREE.Float32BufferAttribute(particleData.sizes, 1),
      ripplePhase: new THREE.Float32BufferAttribute(particleData.ripplePhases, 1),
    };
  }, [particleData]);
  
  // Update time uniform
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = state.clock.elapsedTime;
    }
  });
  
  // Don't render if no highlights
  if (!highlightState || highlightState.nodeIds.size === 0 || !bufferAttributes) {
    return null;
  }
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          {...bufferAttributes.position}
        />
        <bufferAttribute
          attach="attributes-color"
          {...bufferAttributes.color}
        />
        <bufferAttribute
          attach="attributes-size"
          {...bufferAttributes.size}
        />
        <bufferAttribute
          attach="attributes-ripplePhase"
          {...bufferAttributes.ripplePhase}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          time: { value: 0 },
          rippleDuration: { value: 1.5 },
        }}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}