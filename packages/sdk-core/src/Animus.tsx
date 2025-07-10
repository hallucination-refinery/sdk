import { Suspense, useRef } from 'react'
import { Canvas as ThreeCanvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Stats } from '@react-three/drei'
import { Scene } from './Scene'
import { useCanvas } from './CanvasProvider'

export interface AnimusProps {
  width?: number | string
  height?: number | string
  showStats?: boolean
  className?: string
}

// Camera controller
function CameraController() {
  const { state, enqueueCommand } = useCanvas()
  const { camera: threeCamera } = useThree()
  const prevZoom = useRef(state.zoom)

  useFrame(() => {
    // Apply zoom
    if (threeCamera && 'zoom' in threeCamera && prevZoom.current !== state.zoom) {
      threeCamera.zoom = state.zoom
      threeCamera.updateProjectionMatrix()
      prevZoom.current = state.zoom
    }

    // Update camera position in state if changed by controls
    if (threeCamera && (
      threeCamera.position.x !== state.camera.x ||
      threeCamera.position.y !== state.camera.y ||
      threeCamera.position.z !== state.camera.z
    )) {
      enqueueCommand({
        type: 'SET_CAMERA_POSITION',
        payload: {
          x: threeCamera.position.x,
          y: threeCamera.position.y,
          z: threeCamera.position.z
        }
      })
    }
  })

  return null
}

// Main Animus component
export function Animus({
  width = '100%',
  height = '100vh',
  showStats = false,
  className
}: AnimusProps) {
  const { state, enqueueCommand } = useCanvas()
  
  // Convert Maps to arrays for rendering
  const nodes = Array.from(state.nodes.values())
  const edges = Array.from(state.edges.values())
  const handleCanvasClick = () => {
    // Clear selection when clicking on empty space
    enqueueCommand({ type: 'CLEAR_SELECTION' })
  }

  const handleNodeClick = (nodeId: string, event: any) => {
    event?.stopPropagation?.()
    const mode = event?.shiftKey ? 'toggle' : 'replace'
    enqueueCommand({ type: 'SELECT_NODES', payload: { nodeIds: [nodeId], mode } })
  }

  const handleNodePointerOver = (nodeId: string) => {
    enqueueCommand({ type: 'SET_HOVER_NODE', payload: { nodeId } })
  }

  const handleNodePointerOut = () => {
    enqueueCommand({ type: 'SET_HOVER_NODE', payload: { nodeId: null } })
  }

  const handleEdgeClick = (edgeId: string, event: any) => {
    event?.stopPropagation?.()
    const mode = event?.shiftKey ? 'toggle' : 'replace'
    enqueueCommand({ type: 'SELECT_EDGES', payload: { edgeIds: [edgeId], mode } })
  }

  const handleEdgePointerOver = (edgeId: string) => {
    enqueueCommand({ type: 'SET_HOVER_EDGE', payload: { edgeId } })
  }

  const handleEdgePointerOut = () => {
    enqueueCommand({ type: 'SET_HOVER_EDGE', payload: { edgeId: null } })
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
          <Scene
            nodes={nodes}
            edges={edges}
            selectedNodeIds={state.selectedNodeIds}
            selectedEdgeIds={state.selectedEdgeIds}
            highlightedNodes={state.highlightedNodes}
            highlightedEdges={state.highlightedEdges}
            hoveredNodeId={state.hoveredNodeId}
            hoveredEdgeId={state.hoveredEdgeId}
            camera={state.camera}
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