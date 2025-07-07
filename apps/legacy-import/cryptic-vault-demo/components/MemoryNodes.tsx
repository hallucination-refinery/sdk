'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance, Html, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { MemoryData, CLUSTER_COLORS } from '@/lib/types';

interface MemoryNodesProps {
  memories: MemoryData[];
}

interface ConnectionLine {
  start: THREE.Vector3;
  end: THREE.Vector3;
  strength: number; // 0-1 for line opacity
  isSecret: boolean;
}

export default function MemoryNodes({ memories }: MemoryNodesProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const meshRef = useRef<any>(null);
  const secretMeshRef = useRef<any>(null);

  // Separate memories into regular and secret
  const { regularMemories, secretMemories } = useMemo(() => {
    const regular: MemoryData[] = [];
    const secret: MemoryData[] = [];
    
    memories.forEach(memory => {
      if (memory.metadata.isSecret) {
        secret.push(memory);
      } else {
        regular.push(memory);
      }
    });
    
    return { regularMemories: regular, secretMemories: secret };
  }, [memories]);

  // Create enhanced connection lines with strength
  const connectionLines = useMemo(() => {
    const lines: ConnectionLine[] = [];
    const memoryMap = new Map(memories.map(m => [m.id, m]));

    memories.forEach((memory) => {
      const startPos = new THREE.Vector3(...memory.position);

      memory.connections.forEach((targetId) => {
        const targetMemory = memoryMap.get(targetId);
        if (targetMemory && memory.id < targetId) { // Avoid duplicates
          // Calculate connection strength based on shared tags
          const sharedTags = memory.metadata.topics.filter(tag => 
            targetMemory.metadata.topics.includes(tag)
          );
          
          const strength = Math.min(sharedTags.length / 3, 1); // Max strength at 3 shared tags
          const isSecret = (memory.metadata.isSecret || false) || (targetMemory.metadata.isSecret || false);
          
          lines.push({
            start: startPos,
            end: new THREE.Vector3(...targetMemory.position),
            strength,
            isSecret
          });
        }
      });
    });

    return lines;
  }, [memories]);

  // Animate nodes and secret glow
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
    if (secretMeshRef.current && secretMeshRef.current.material) {
      secretMeshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      // Pulsing glow for secret nodes
      const material = secretMeshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  // Get memory by ID for hover display
  const getMemoryById = (id: string) => memories.find((m) => m.id === id);

  return (
    <>
      {/* Regular Memory Nodes */}
      {regularMemories.length > 0 && (
        <Instances ref={meshRef} limit={regularMemories.length} range={regularMemories.length}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial 
            emissive="#ffffff" 
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.7}
          />

          {regularMemories.map((memory) => {
            const color = CLUSTER_COLORS[memory.cluster] || '#ffffff';

            return (
              <Instance
                key={memory.id}
                position={memory.position}
                color={color}
                scale={hoveredId === memory.id ? 1.5 : 1}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredId(memory.id);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredId(null);
                }}
              />
            );
          })}
        </Instances>
      )}

      {/* Secret Memory Nodes - with special treatment */}
      {secretMemories.length > 0 && (
        <Instances ref={secretMeshRef} limit={secretMemories.length} range={secretMemories.length}>
          <sphereGeometry args={[0.6, 20, 20]} />
          <meshStandardMaterial 
            color="#ffd700"
            emissive="#ff6b6b"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.2}
          />

          {secretMemories.map((memory) => {
            return (
              <Instance
                key={memory.id}
                position={memory.position}
                scale={hoveredId === memory.id ? 1.5 : 1}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredId(memory.id);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredId(null);
                }}
              />
            );
          })}
        </Instances>
      )}

      {/* Secret Memory Glow Effect */}
      {secretMemories.map((memory) => (
        <Sphere
          key={`glow-${memory.id}`}
          args={[0.8, 16, 16]}
          position={memory.position}
        >
          <meshBasicMaterial
            color="#ff6b6b"
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </Sphere>
      ))}

      {/* Connection Lines */}
      {connectionLines.map((line, index) => (
        <lineSegments key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([
                ...line.start.toArray(),
                ...line.end.toArray()
              ]), 3]}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color={line.isSecret ? '#ff6b6b' : '#4a5568'} 
            opacity={line.isSecret ? 0.5 : 0.2 + (line.strength * 0.3)} 
            transparent 
            linewidth={line.strength > 0.5 ? 2 : 1}
          />
        </lineSegments>
      ))}

      {/* Hover Label */}
      {hoveredId && (
        <Html
          position={getMemoryById(hoveredId)?.position}
          center
          distanceFactor={10}
          style={{
            pointerEvents: 'none',
            transform: 'translateY(-30px)',
          }}
        >
          <div className="memory-label bg-gray-900/95 p-3 rounded-lg shadow-lg max-w-xs">
            {getMemoryById(hoveredId)?.metadata.isSecret && (
              <span className="text-xs text-red-400 font-bold mb-1 block">🔒 SECRET</span>
            )}
            <p className="font-medium text-white">{getMemoryById(hoveredId)?.content}</p>
            <div className="text-xs text-gray-400 mt-2">
              <p>{getMemoryById(hoveredId)?.metadata.originalCategory} • {getMemoryById(hoveredId)?.metadata.date}</p>
              <p className="mt-1">
                {getMemoryById(hoveredId)?.metadata.topics.slice(0, 3).join(', ')}
                {(getMemoryById(hoveredId)?.metadata.topics.length || 0) > 3 && '...'}
              </p>
            </div>
          </div>
        </Html>
      )}

      {/* Privacy Indicator */}
      <Html
        position={[0, -15, 0]}
        center
        style={{
          pointerEvents: 'none',
        }}
      >
        <div className="text-xs text-green-400 bg-gray-900/80 px-2 py-1 rounded-full">
          ✓ All data processed locally
        </div>
      </Html>
    </>
  );
}
