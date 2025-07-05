import { Suspense, useRef } from 'react'
import { Canvas as ThreeCanvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import { Scene } from './Scene'
import type { IdeaNode, Edge } from '@refinery/schema'
import type { RendererCommand } from '@refinery/store'

export interface IdeaCanvasProps {
  width?: number | string
  height?: number | string
  showStats?: boolean
  className?: string
  nodes: IdeaNode[]
  edges: Edge[]
  selectedNodeIds: Set<string>
  selectedEdgeIds: Set<string>
  hoveredNodeId: string | null
  hoveredEdgeId: string | null
  camera: { x: number; y: number; z: number }
  zoom: number
  theme: 'light' | 'dark' | 'custom'
  highlightedNodes: Map<string, { color?: string; intensity?: number }>
  highlightedEdges: Map<string, { color?: string; intensity?: number }>
  onCommand: (command: RendererCommand) => void
}

// Camera controller
function CameraController({ 
  camera,
  zoom,
  onCameraChange 
}: { 
  camera: { x: number; y: number; z: number }
  zoom: number
  onCameraChange: (position: { x: number; y: number; z: number }) => void
}) {
  const { camera: threeCamera } = useThree()
  const prevZoom = useRef(zoom)

  useFrame(() => {
    // Apply zoom
    if (threeCamera && 'zoom' in threeCamera && prevZoom.current !== zoom) {
      threeCamera.zoom = zoom
      threeCamera.updateProjectionMatrix()
      prevZoom.current = zoom
    }

    // Update camera position in state if changed by controls
    if (threeCamera && (
      threeCamera.position.x !== camera.x ||
      threeCamera.position.y !== camera.y ||
      threeCamera.position.z !== camera.z
    )) {
      onCameraChange({
        x: threeCamera.position.x,
        y: threeCamera.position.y,
        z: threeCamera.position.z
      })
    }
  })

  return null
}

// Main IdeaCanvas component
export function IdeaCanvas({
  width = '100%',
  height = '100vh',
  showStats = false,
  className,
  nodes,
  edges,
  selectedNodeIds,
  selectedEdgeIds,
  hoveredNodeId,
  hoveredEdgeId,
  camera,
  zoom,
  theme,
  highlightedNodes,
  highlightedEdges,
  onCommand
}: IdeaCanvasProps) {
  const handleCanvasClick = () => {
    // Clear selection when clicking on empty space
    onCommand({ type: 'CLEAR_SELECTION' })
  }

  const handleNodeClick = (nodeId: string, event: any) => {
    event?.stopPropagation?.()
    const mode = event?.shiftKey ? 'toggle' : 'replace'
    onCommand({ type: 'SELECT_NODES', payload: { nodeIds: [nodeId], mode } })
  }

  const handleNodePointerOver = (nodeId: string) => {
    onCommand({ type: 'SET_HOVER_NODE', payload: { nodeId } })
  }

  const handleNodePointerOut = () => {
    onCommand({ type: 'SET_HOVER_NODE', payload: { nodeId: null } })
  }

  const handleEdgeClick = (edgeId: string, event: any) => {
    event?.stopPropagation?.()
    const mode = event?.shiftKey ? 'toggle' : 'replace'
    onCommand({ type: 'SELECT_EDGES', payload: { edgeIds: [edgeId], mode } })
  }

  const handleEdgePointerOver = (edgeId: string) => {
    onCommand({ type: 'SET_HOVER_EDGE', payload: { edgeId } })
  }

  const handleEdgePointerOut = () => {
    onCommand({ type: 'SET_HOVER_EDGE', payload: { edgeId: null } })
  }

  const handleCameraChange = (position: { x: number; y: number; z: number }) => {
    onCommand({
      type: 'SET_CAMERA_POSITION',
      payload: position
    })
  }

  return (
    <div className={className} style={{ width, height }}>
      <ThreeCanvas
        onClick={handleCanvasClick}
        style={{ background: theme === 'dark' ? '#1a1a1a' : '#f5f5f5' }}
      >
        <PerspectiveCamera
          makeDefault
          position={[camera.x, camera.y, camera.z]}
          zoom={zoom}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={1}
          panSpeed={1}
          rotateSpeed={1}
        />

        <CameraController
          camera={camera}
          zoom={zoom}
          onCameraChange={handleCameraChange}
        />

        <Suspense fallback={null}>
          <Scene
            nodes={nodes}
            edges={edges}
            selectedNodeIds={selectedNodeIds}
            selectedEdgeIds={selectedEdgeIds}
            highlightedNodes={highlightedNodes}
            highlightedEdges={highlightedEdges}
            hoveredNodeId={hoveredNodeId}
            hoveredEdgeId={hoveredEdgeId}
            camera={camera}
            onNodeClick={handleNodeClick}
            onNodePointerOver={handleNodePointerOver}
            onNodePointerOut={handleNodePointerOut}
            onEdgeClick={handleEdgeClick}
            onEdgePointerOver={handleEdgePointerOver}
            onEdgePointerOut={handleEdgePointerOut}
          />
        </Suspense>

        {showStats && <Stats />}
      </ThreeCanvas>
    </div>
  )
}