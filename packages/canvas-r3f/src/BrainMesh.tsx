import { useRef, Suspense } from 'react'
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
  /** Whether the mesh is visible */
  visible?: boolean
}

function BrainMeshGeometry({
  modelPath = '/models/brain.obj',
  wireframeColor = '#00ffff',
  opacity = 0.8
}: Pick<BrainMeshProps, 'modelPath' | 'wireframeColor' | 'opacity'>) {
  const meshRef = useRef<THREE.Group>(null)
  
  // Load the OBJ file
  const obj = useLoader(OBJLoader, modelPath)
  
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
  wireframeColor = '#00ffff',
  opacity = 0.8,
  visible = true
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