import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { IdeaNode, Edge } from '@refinery/schema'

export interface SceneProps {
  nodes: IdeaNode[]
  edges: Edge[]
  selectedNodeIds: Set<string>
  selectedEdgeIds: Set<string>
  highlightedNodes: Map<string, { color?: string; intensity?: number }>
  highlightedEdges: Map<string, { color?: string; intensity?: number }>
  hoveredNodeId: string | null
  hoveredEdgeId: string | null
  camera: { x: number; y: number; z: number }
  onNodeClick?: (nodeId: string, event: any) => void
  onNodePointerOver?: (nodeId: string) => void
  onNodePointerOut?: (nodeId: string) => void
  onEdgeClick?: (edgeId: string, event: any) => void
  onEdgePointerOver?: (edgeId: string) => void
  onEdgePointerOut?: (edgeId: string) => void
}

// Node component
function Node({ 
  node, 
  selected, 
  highlighted,
  onPointerOver,
  onPointerOut,
  onClick
}: { 
  node: IdeaNode
  selected: boolean
  highlighted?: { color?: string; intensity?: number }
  onPointerOver?: () => void
  onPointerOut?: () => void
  onClick?: (event: any) => void
}) {
  const meshRef = React.useRef<THREE.Mesh>(null)
  
  // Default position if not provided
  const position = node.position || { x: 0, y: 0, z: 0 }
  
  // Determine color based on state
  const color = highlighted?.color || (selected ? '#4CAF50' : '#2196F3')
  const scale = selected ? 1.2 : 1
  const intensity = highlighted?.intensity || 1

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.3} />
      </mesh>
      {/* Label */}
      {node.content && typeof node.content === 'object' && node.content !== null && 'title' in node.content && (
        <sprite position={[0, 1, 0]} scale={[2, 0.5, 1]}>
          <spriteMaterial color="white" />
        </sprite>
      )}
    </group>
  )
}

// Edge component
function EdgeLine({ 
  edge: _edge, 
  selected, 
  highlighted,
  sourceNode,
  targetNode,
  onPointerOver,
  onPointerOut,
  onClick
}: { 
  edge: Edge
  selected: boolean
  highlighted?: { color?: string; intensity?: number }
  sourceNode: IdeaNode | undefined
  targetNode: IdeaNode | undefined
  onPointerOver?: () => void
  onPointerOut?: () => void
  onClick?: (event: any) => void
}) {
  if (!sourceNode || !targetNode) return null

  const sourcePos = sourceNode.position || { x: 0, y: 0, z: 0 }
  const targetPos = targetNode.position || { x: 0, y: 0, z: 0 }

  // Create line geometry
  const points = [
    new THREE.Vector3(sourcePos.x, sourcePos.y, sourcePos.z),
    new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z)
  ]
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Determine color
  const color = highlighted?.color || (selected ? '#4CAF50' : '#666666')
  const opacity = highlighted?.intensity || (selected ? 1 : 0.6)

  return (
    <primitive
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, opacity, transparent: true }))}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  )
}

// Scene content
export function Scene({
  nodes,
  edges,
  selectedNodeIds,
  selectedEdgeIds,
  highlightedNodes,
  highlightedEdges,
  hoveredNodeId: _hoveredNodeId,
  hoveredEdgeId: _hoveredEdgeId,
  camera,
  onNodeClick,
  onNodePointerOver,
  onNodePointerOut,
  onEdgeClick,
  onEdgePointerOver,
  onEdgePointerOut
}: SceneProps) {
  const { camera: threeCamera } = useThree()

  // Update camera position when state changes
  useEffect(() => {
    if (threeCamera && camera) {
      threeCamera.position.set(camera.x, camera.y, camera.z)
    }
  }, [threeCamera, camera])

  // Create node map for edge lookups
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, IdeaNode>()
    nodes.forEach(node => map.set(node.id, node))
    return map
  }, [nodes])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Render edges first (behind nodes) */}
      {edges.map(edge => (
        <EdgeLine
          key={edge.id}
          edge={edge}
          selected={selectedEdgeIds.has(edge.id)}
          highlighted={highlightedEdges.get(edge.id)}
          sourceNode={nodeMap.get(edge.source)}
          targetNode={nodeMap.get(edge.target)}
          onPointerOver={() => onEdgePointerOver?.(edge.id)}
          onPointerOut={() => onEdgePointerOut?.(edge.id)}
          onClick={(event) => onEdgeClick?.(edge.id, event)}
        />
      ))}

      {/* Render nodes */}
      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          selected={selectedNodeIds.has(node.id)}
          highlighted={highlightedNodes.get(node.id)}
          onPointerOver={() => onNodePointerOver?.(node.id)}
          onPointerOut={() => onNodePointerOut?.(node.id)}
          onClick={(event) => onNodeClick?.(node.id, event)}
        />
      ))}
    </>
  )
}