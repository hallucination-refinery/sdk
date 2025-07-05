import { Suspense, useRef, useEffect } from 'react'
import { Canvas as ThreeCanvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import * as THREE from 'three'
import { useCanvas } from './CanvasProvider'
import type { IdeaNode, Edge } from '@refinery/schema'

interface CanvasProps {
  width?: number | string
  height?: number | string
  showStats?: boolean
  className?: string
}

// Node component
function Node({ node, selected, highlighted }: { node: IdeaNode; selected: boolean; highlighted?: { color?: string; intensity?: number } }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { enqueueCommand } = useCanvas()
  
  // Default position if not provided
  const position = node.position || { x: 0, y: 0, z: 0 }
  
  // Determine color based on state
  const color = highlighted?.color || (selected ? '#4CAF50' : '#2196F3')
  const scale = selected ? 1.2 : 1
  const intensity = highlighted?.intensity || 1

  const handlePointerOver = () => {
    enqueueCommand({ type: 'SET_HOVER_NODE', payload: { nodeId: node.id } })
  }

  const handlePointerOut = () => {
    enqueueCommand({ type: 'SET_HOVER_NODE', payload: { nodeId: null } })
  }

  const handleClick = (event: any) => {
    event?.stopPropagation?.()
    const mode = event?.shiftKey ? 'toggle' : 'replace'
    enqueueCommand({ type: 'SELECT_NODES', payload: { nodeIds: [node.id], mode } })
  }

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        scale={scale}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity * 0.3} />
      </mesh>
      {/* Label */}
      {node.content && typeof node.content === 'object' && 'title' in node.content && (
        <sprite position={[0, 1, 0]} scale={[2, 0.5, 1]}>
          <spriteMaterial color="white" />
        </sprite>
      )}
    </group>
  )
}

// Edge component
function EdgeLine({ edge, selected, highlighted }: { edge: Edge; selected: boolean; highlighted?: { color?: string; intensity?: number } }) {
  const { state, enqueueCommand } = useCanvas()

  // Get node positions
  const sourceNode = state.nodes.get(edge.source)
  const targetNode = state.nodes.get(edge.target)

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

  const handlePointerOver = () => {
    enqueueCommand({ type: 'SET_HOVER_EDGE', payload: { edgeId: edge.id } })
  }

  const handlePointerOut = () => {
    enqueueCommand({ type: 'SET_HOVER_EDGE', payload: { edgeId: null } })
  }

  const handleClick = (event: any) => {
    event?.stopPropagation?.()
    const mode = event?.shiftKey ? 'toggle' : 'replace'
    enqueueCommand({ type: 'SELECT_EDGES', payload: { edgeIds: [edge.id], mode } })
  }

  return (
    <primitive
      object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, opacity, transparent: true }))}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  )
}

// Scene content
function SceneContent() {
  const { state } = useCanvas()
  const { camera } = useThree()

  // Update camera position when state changes
  useEffect(() => {
    if (camera && state.camera) {
      camera.position.set(state.camera.x, state.camera.y, state.camera.z)
    }
  }, [camera, state.camera])

  // Convert Maps to arrays for rendering
  const nodes = Array.from(state.nodes.values())
  const edges = Array.from(state.edges.values())

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
          selected={state.selectedEdgeIds.has(edge.id)}
          highlighted={state.highlightedEdges.get(edge.id)}
        />
      ))}

      {/* Render nodes */}
      {nodes.map(node => (
        <Node
          key={node.id}
          node={node}
          selected={state.selectedNodeIds.has(node.id)}
          highlighted={state.highlightedNodes.get(node.id)}
        />
      ))}
    </>
  )
}

// Camera controller
function CameraController() {
  const { state, enqueueCommand } = useCanvas()
  const { camera } = useThree()
  const prevZoom = useRef(state.zoom)

  useFrame(() => {
    // Apply zoom
    if (camera && 'zoom' in camera && prevZoom.current !== state.zoom) {
      camera.zoom = state.zoom
      camera.updateProjectionMatrix()
      prevZoom.current = state.zoom
    }

    // Update camera position in state if changed by controls
    if (camera && (
      camera.position.x !== state.camera.x ||
      camera.position.y !== state.camera.y ||
      camera.position.z !== state.camera.z
    )) {
      enqueueCommand({
        type: 'SET_CAMERA_POSITION',
        payload: {
          x: camera.position.x,
          y: camera.position.y,
          z: camera.position.z
        }
      })
    }
  })

  return null
}

// Main Canvas component
export function Canvas({
  width = '100%',
  height = '100vh',
  showStats = false,
  className
}: CanvasProps) {
  const { state, enqueueCommand } = useCanvas()

  const handleCanvasClick = () => {
    // Clear selection when clicking on empty space
    enqueueCommand({ type: 'CLEAR_SELECTION' })
  }

  return (
    <div className={className} style={{ width, height }}>
      <ThreeCanvas
        onClick={handleCanvasClick}
        style={{ background: state.theme === 'dark' ? '#1a1a1a' : '#f5f5f5' }}
      >
        <PerspectiveCamera
          makeDefault
          position={[state.camera.x, state.camera.y, state.camera.z]}
          zoom={state.zoom}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={1}
          panSpeed={1}
          rotateSpeed={1}
        />

        <CameraController />

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>

        {showStats && <Stats />}
      </ThreeCanvas>
    </div>
  )
}