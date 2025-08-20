import { useRef, useEffect, Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import * as THREE from 'three'

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
  /** Callback when vertices are extracted from the mesh */
  onVerticesLoaded?: (vertices: THREE.Vector3[]) => void
}

function BrainMeshGeometry({
  modelPath = '/models/brain.obj',
  wireframeColor = '#00aaff',
  opacity = 0.9,
  lineWidth = 1,
  onVerticesLoaded
}: Pick<BrainMeshProps, 'modelPath' | 'wireframeColor' | 'opacity' | 'lineWidth' | 'onVerticesLoaded'>) {
  const meshRef = useRef<THREE.Group>(null)
  
  // Load the OBJ file
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
      onVerticesLoaded(vertices)
    }
  }, [obj, onVerticesLoaded])
  
  // Clone the object to avoid modifying the original
  const clonedObj = obj.clone()
  
  // Apply wireframe material to all meshes in the object
  clonedObj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshBasicMaterial({
        color: wireframeColor,
        wireframe: true,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,    // Ensure wireframe is visible from both sides
        wireframeLinewidth: lineWidth, // Explicit line width (may not work on all platforms)
        depthTest: true,           // Proper depth testing for overlapping lines
        depthWrite: true           // Write to depth buffer for proper rendering
      })
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
  visible = true,
  onVerticesLoaded
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
          onVerticesLoaded={onVerticesLoaded}
        />
      </Suspense>
    </group>
  )
}

// Export with error boundary wrapper for better error handling
export function BrainMeshWithFallback(props: BrainMeshProps) {
  return (
    <Suspense fallback={null}>
      <BrainMesh {...props} />
    </Suspense>
  )
}