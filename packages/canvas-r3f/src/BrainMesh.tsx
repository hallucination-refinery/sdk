import { useRef, useEffect, Suspense, useState } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'
import { LoadingIndicator } from './LoadingIndicator'

export interface BrainMeshProps {
  /** Path to the brain OBJ file */
  modelPath?: string
  /** Position of the brain mesh */
  position?: [number, number, number]
  /** Scale of the brain mesh */
  scale?: [number, number, number] | number
  /** Rotation of the brain mesh */
  rotation?: [number, number, number]
  /** Color of the wireframe */
  wireframeColor?: string
  /** Opacity of the wireframe */
  opacity?: number
  /** Line width for wireframe (may not work on all platforms) */
  lineWidth?: number
  /** Whether the mesh is visible */
  visible?: boolean
  /** Whether to render as wireframe (true) or solid (false) */
  wireframe?: boolean
  /** Callback when vertices are extracted from the mesh */
  onVerticesLoaded?: (vertices: THREE.Vector3[]) => void
  /** Callback when loading state changes */
  onLoadingChange?: (loading: boolean) => void
  /** Callback when mesh loading starts */
  onLoadStart?: () => void
  /** Callback when mesh loading completes */
  onLoadComplete?: () => void
  /** Callback when loading error occurs */
  onLoadError?: (error: Error) => void
}

function BrainMeshGeometry({
  modelPath = '/models/brain.obj',
  wireframeColor = '#00aaff',
  opacity = 0.9,
  lineWidth = 1,
  wireframe = true,
  onVerticesLoaded,
  onLoadingChange,
  onLoadStart,
  onLoadComplete,
  onLoadError: _onLoadError,
}: Pick<
  BrainMeshProps,
  | 'modelPath'
  | 'wireframeColor'
  | 'opacity'
  | 'lineWidth'
  | 'wireframe'
  | 'onVerticesLoaded'
  | 'onLoadingChange'
  | 'onLoadStart'
  | 'onLoadComplete'
  | 'onLoadError'
>) {
  const meshRef = useRef<THREE.Group>(null)
  const [loadingStarted, setLoadingStarted] = useState(false)

  // Notify loading start
  useEffect(() => {
    if (!loadingStarted) {
      setLoadingStarted(true)
      onLoadStart?.()
      onLoadingChange?.(true)
    }
  }, [loadingStarted, onLoadStart, onLoadingChange])

  // Load the OBJ file (suspends under React Suspense until ready)
  const obj = useLoader(OBJLoader, modelPath)

  // Extract vertices from the loaded object and notify parent
  useEffect(() => {
    if (onVerticesLoaded) {
      const vertices: THREE.Vector3[] = []
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geometry = child.geometry
          if (geometry instanceof THREE.BufferGeometry) {
            const positions = geometry.attributes.position
            if (positions) {
              for (let i = 0; i < positions.count; i++) {
                const vertex = new THREE.Vector3(
                  positions.getX(i),
                  positions.getY(i),
                  positions.getZ(i)
                )
                vertex.applyMatrix4(child.matrixWorld)
                vertices.push(vertex)
              }
            }
          }
        }
      })
      // Always use the loaded vertices - no fallback needed
      onVerticesLoaded(vertices)

      // Notify that loading is complete
      onLoadComplete?.()
      onLoadingChange?.(false)
    }
  }, [obj, onVerticesLoaded, onLoadComplete, onLoadingChange])

  // Clone the object to avoid modifying the original
  const clonedObj = obj.clone()

  // Apply material to all meshes in the object
  clonedObj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (wireframe) {
        child.material = new THREE.MeshBasicMaterial({
          color: wireframeColor,
          wireframe: true,
          transparent: true,
          opacity,
          side: THREE.DoubleSide,
          wireframeLinewidth: lineWidth,
          depthTest: true,
          depthWrite: true,
        })
      } else {
        // Solid surface with proper lighting
        child.material = new THREE.MeshPhongMaterial({
          color: wireframeColor,
          transparent: true,
          opacity,
          side: THREE.DoubleSide,
          shininess: 30,
          specular: 0x222222,
          depthTest: true,
          depthWrite: true,
        })
      }
    }
  })

  return <primitive ref={meshRef} object={clonedObj} />
}

export function BrainMesh({
  modelPath = '/models/brain.obj',
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  wireframeColor = '#00aaff',
  opacity = 0.9,
  lineWidth = 1,
  wireframe = true,
  visible = true,
  onVerticesLoaded,
  onLoadingChange,
  onLoadStart,
  onLoadComplete,
  onLoadError,
}: BrainMeshProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Calculate scale - ensure it's a tuple type
  const meshScale: [number, number, number] = Array.isArray(scale)
    ? [scale[0], scale[1], scale[2] ?? scale[1]]
    : [scale, scale, scale]

  return (
    <group
      ref={groupRef}
      position={position}
      scale={meshScale}
      rotation={rotation}
      visible={visible}
    >
      <Suspense fallback={null}>
        <BrainMeshGeometry
          modelPath={modelPath}
          wireframeColor={wireframeColor}
          opacity={opacity}
          lineWidth={lineWidth}
          wireframe={wireframe}
          onVerticesLoaded={onVerticesLoaded}
          onLoadingChange={onLoadingChange}
          onLoadStart={onLoadStart}
          onLoadComplete={onLoadComplete}
          onLoadError={onLoadError}
        />
      </Suspense>
    </group>
  )
}

// Export with error boundary wrapper for better error handling
export function BrainMeshWithFallback(
  props: BrainMeshProps & {
    showLoadingIndicator?: boolean
    loadingMessage?: string
  }
) {
  const {
    showLoadingIndicator = true,
    loadingMessage = 'Loading brain mesh...',
    ...meshProps
  } = props

  return (
    <Suspense
      fallback={
        showLoadingIndicator ? (
          <LoadingIndicator
            message={loadingMessage}
            position={meshProps.position}
            scale={Array.isArray(meshProps.scale) ? meshProps.scale[0] : meshProps.scale}
          />
        ) : null
      }
    >
      <BrainMesh {...meshProps} />
    </Suspense>
  )
}
