import { useRef, useMemo, useCallback, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Node } from '@refinery/schema'

export interface ConceptParticlesProps {
  /** Array of concepts to render as particles */
  concepts: Node[]
  /** Array of brain mesh vertices for positioning */
  vertices: THREE.Vector3[]
  /** Size of particles in pixels (default: 5) */
  particleSize?: number
  /** Whether particles should be visible */
  visible?: boolean
  /** Callback when a particle is hovered */
  onHover?: (concept: Node | null, index: number) => void
  /** Callback when a particle is clicked */
  onClick?: (concept: Node, index: number) => void
}

interface InstanceData {
  position: THREE.Vector3
  color: THREE.Color
  scale: number
  originalScale: number
  concept: Node
}

/**
 * Maps concept category to color
 * TODO: Move to shared utility when category system is finalized
 */
function getCategoryColor(concept: Node): THREE.Color {
  // Use concept.color if available, otherwise derive from metadata or id
  if (concept.color) {
    return new THREE.Color(concept.color)
  }

  // Fallback: Hash concept.id to generate consistent color
  const hash = concept.id.split('').reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0)
    return acc & acc // Convert to 32bit integer
  }, 0)

  // Convert hash to hue (0-360)
  const hue = Math.abs(hash) % 360
  const color = new THREE.Color()
  color.setHSL(hue / 360, 0.7, 0.6) // Vibrant colors with good contrast

  return color
}

/**
 * Maps concept to vertex position using djb2 hash
 * Implements deterministic positioning as specified in Session 4
 */
function mapConceptToVertex(concept: Node, vertices: THREE.Vector3[]): THREE.Vector3 {
  if (vertices.length === 0) {
    return new THREE.Vector3(0, 0, 0)
  }

  // Use concept position if available
  if (concept.position) {
    return new THREE.Vector3(concept.position.x, concept.position.y, concept.position.z)
  }

  // djb2 hash implementation for deterministic mapping
  let hash = 5381
  for (let i = 0; i < concept.id.length; i++) {
    hash = (hash << 5) + hash + concept.id.charCodeAt(i)
  }

  // Map hash to vertex index
  const vertexIndex = Math.abs(hash) % vertices.length
  return vertices[vertexIndex].clone()
}

export function ConceptParticles({
  concepts = [],
  vertices = [],
  particleSize = 5,
  visible = true,
  onHover,
  onClick,
}: ConceptParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Create instance data for up to 500 concepts
  const instanceData = useMemo<InstanceData[]>(() => {
    const maxInstances = 500
    const data: InstanceData[] = []

    for (let i = 0; i < maxInstances; i++) {
      const concept = concepts[i]
      if (!concept) {
        // Create placeholder data for unused instances
        data.push({
          position: new THREE.Vector3(1000, 1000, 1000), // Far away (invisible)
          color: new THREE.Color(0x000000),
          scale: 0, // Scale to 0 to hide
          originalScale: particleSize,
          concept: { id: '', label: '' } as Node,
        })
        continue
      }

      const position = mapConceptToVertex(concept, vertices)
      const color = getCategoryColor(concept)
      const scale = concept.size || particleSize

      data.push({
        position,
        color,
        scale,
        originalScale: scale,
        concept,
      })
    }

    return data
  }, [concepts, vertices, particleSize])

  // Update instance matrices and colors
  useFrame(() => {
    if (!meshRef.current) return

    const mesh = meshRef.current
    const matrix = new THREE.Matrix4()

    instanceData.forEach((data, index) => {
      // Apply hover scaling (1.5x when hovered)
      const scale = hoveredIndex === index ? data.originalScale * 1.5 : data.originalScale

      // Set matrix for position and scale
      matrix.makeScale(scale, scale, scale)
      matrix.setPosition(data.position)
      mesh.setMatrixAt(index, matrix)

      // Set color
      mesh.setColorAt(index, data.color)
    })

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }
  })

  // Handle pointer events for hover/click interaction
  const handlePointerMove = useCallback(
    (event: any) => {
      if (!meshRef.current || typeof event.instanceId !== 'number') return

      const instanceId = event.instanceId
      const concept = instanceData[instanceId]?.concept

      if (concept && concept.id) {
        setHoveredIndex(instanceId)
        onHover?.(concept, instanceId)
      }
    },
    [instanceData, onHover]
  )

  const handlePointerLeave = useCallback(() => {
    setHoveredIndex(null)
    onHover?.(null, -1)
  }, [onHover])

  const handleClick = useCallback(
    (event: any) => {
      if (!meshRef.current || typeof event.instanceId !== 'number') return

      const instanceId = event.instanceId
      const concept = instanceData[instanceId]?.concept

      if (concept && concept.id) {
        onClick?.(concept, instanceId)
      }
    },
    [instanceData, onClick]
  )

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, 500]} // 500 instances per acceptance spec
      visible={visible}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Simple sphere geometry for particles */}
      <sphereGeometry args={[1, 8, 6]} />

      {/* Material optimized for instanced rendering */}
      <meshBasicMaterial
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

export default ConceptParticles
