'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { type IdeaNode } from '@refinery/schema';
import { useCategory } from '@/contexts/CategoryContext';
import { getClusterColor, OPACITY_VALUES } from '@/utils/clusterPalette';

// Extended IdeaNode type with position for 3D visualization
interface IdeaNodeWithPosition extends IdeaNode {
  position?: number[];
}

export interface ClusterVisualizationProps {
  nodes: IdeaNodeWithPosition[];
  opacity?: number;
  visible?: boolean;
}

interface Cluster {
  id: string;
  nodes: IdeaNodeWithPosition[];
  centroid: THREE.Vector3;
  radius: number;
  color: number;
}

// Compute clusters from nodes
function computeClusters(nodes: IdeaNodeWithPosition[]): Cluster[] {
  const clusterMap = new Map<string, IdeaNodeWithPosition[]>();

  // Group nodes by cluster
  nodes.forEach((node) => {
    const clusterId = (node.metadata as any)?.cluster || 'default';
    if (!clusterMap.has(clusterId)) {
      clusterMap.set(clusterId, []);
    }
    clusterMap.get(clusterId)!.push(node);
  });

  // Convert to cluster objects
  const clusters: Cluster[] = [];

  clusterMap.forEach((clusterNodes, clusterId) => {
    // Calculate centroid
    const centroid = new THREE.Vector3();
    clusterNodes.forEach((node) => {
      if (node.position && Array.isArray(node.position)) {
        centroid.x += node.position[0];
        centroid.y += node.position[1];
        centroid.z += node.position[2];
      }
    });
    centroid.divideScalar(clusterNodes.length);

    // Calculate radius (max distance from centroid)
    let maxDistance = 0;
    clusterNodes.forEach((node) => {
      if (node.position && Array.isArray(node.position)) {
        const nodePos = new THREE.Vector3(
          node.position[0],
          node.position[1],
          node.position[2],
        );
        const distance = nodePos.distanceTo(centroid);
        maxDistance = Math.max(maxDistance, distance);
      }
    });

    // Use centralized cluster color
    const colorHex = getClusterColor(clusterId);
    const color = new THREE.Color(colorHex).getHex();

    clusters.push({
      id: clusterId,
      nodes: clusterNodes,
      centroid,
      radius: maxDistance + 10, // Add padding
      color,
    });
  });

  return clusters;
}

// Single cluster metaball
function ClusterMetaball({
  cluster,
  opacity,
}: {
  cluster: Cluster;
  opacity: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { activeCategories } = useCategory();

  // Check if this cluster is active
  const isActive =
    !activeCategories ||
    activeCategories.size === 0 ||
    activeCategories.has(cluster.id);
  const finalOpacity = isActive
    ? opacity * 0.7
    : opacity * OPACITY_VALUES.dimmed;

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group
      position={[cluster.centroid.x, cluster.centroid.y, cluster.centroid.z]}
    >
      <mesh ref={meshRef}>
        <sphereGeometry args={[cluster.radius, 32, 32]} />
        <meshPhysicalMaterial
          color={cluster.color}
          opacity={finalOpacity}
          transparent
          roughness={0.3}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0}
          emissive={cluster.color}
          emissiveIntensity={isActive ? 0.2 : 0.05}
        />
      </mesh>
      <Text
        position={[0, cluster.radius + 5, 0]}
        fontSize={8}
        color="#1e293b"
        anchorX="center"
        anchorY="middle"
        visible={isActive}
      >
        {cluster.id}
      </Text>
    </group>
  );
}

export function ClusterVisualization({
  nodes,
  opacity = 1,
  visible = true,
}: ClusterVisualizationProps) {
  const clusters = useMemo(() => computeClusters(nodes), [nodes]);

  return (
    <group visible={visible}>
      {clusters.map((cluster) => (
        <ClusterMetaball key={cluster.id} cluster={cluster} opacity={opacity} />
      ))}
    </group>
  );
}
