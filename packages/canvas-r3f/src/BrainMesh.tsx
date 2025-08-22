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
  /** Whether depth writes are enabled on the material (set false for debug wireframe visibility) */
  depthWrite?: boolean
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
  depthWrite = true,
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
  | 'depthWrite'
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
      const allVertices: { position: THREE.Vector3; normal: THREE.Vector3 }[] = []

      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geometry = child.geometry
          if (geometry instanceof THREE.BufferGeometry) {
            // Ensure normals exist
            if (!geometry.attributes.normal) {
              geometry.computeVertexNormals()
            }

            const positions = geometry.attributes.position
            const normals = geometry.attributes.normal
            if (positions && normals) {
              // Prepare normal matrix to transform normals into world space
              const normalMatrix = new THREE.Matrix3().getNormalMatrix(child.matrixWorld)

              for (let i = 0; i < positions.count; i++) {
                const p = new THREE.Vector3(
                  positions.getX(i),
                  positions.getY(i),
                  positions.getZ(i)
                ).applyMatrix4(child.matrixWorld)

                const n = new THREE.Vector3(normals.getX(i), normals.getY(i), normals.getZ(i))
                  .applyMatrix3(normalMatrix)
                  .normalize()

                allVertices.push({ position: p, normal: n })
              }
            }
          }
        }
      })

      // Compute centroid
      const centroid = allVertices
        .reduce((acc, v) => acc.add(v.position), new THREE.Vector3())
        .multiplyScalar(1 / Math.max(1, allVertices.length))

      // Filter to outward-facing surface vertices and deduplicate by rounding
      const outwardThreshold = 0.4 // cos(theta) threshold; higher → more strictly outward
      const quantize = (v: THREE.Vector3) => `${v.x.toFixed(2)}|${v.y.toFixed(2)}|${v.z.toFixed(2)}`

      const seen = new Set<string>()
      const surfaceVertices: THREE.Vector3[] = []

      for (const { position, normal } of allVertices) {
        const radial = position.clone().sub(centroid)
        const radialLen = radial.length()
        if (radialLen === 0) continue
        radial.normalize()
        const score = normal.dot(radial)
        if (score >= outwardThreshold) {
          const key = quantize(position)
          if (!seen.has(key)) {
            seen.add(key)
            surfaceVertices.push(position)
          }
        }
      }

      // Fallback: if filtering was too aggressive, use original positions
      const resultVertices =
        surfaceVertices.length >= 35000 ? surfaceVertices : allVertices.map((v) => v.position)

      onVerticesLoaded(resultVertices)

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
          depthWrite,
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
          depthWrite,
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
  depthWrite = true,
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
          depthWrite={depthWrite}
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
