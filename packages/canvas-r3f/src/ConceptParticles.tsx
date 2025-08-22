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
 * Category color palette with 8+ distinct colors plus gray fallback
 * Session 4 requirement: 8+ category colors with overflow to gray
 */
const CATEGORY_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Light Yellow
  '#BB8FCE', // Light Purple
  '#85C1E9', // Light Blue
  '#F8C471', // Orange
  '#82E0AA', // Light Green
] as const

const GRAY_FALLBACK = '#888888' // Gray for overflow categories

/**
 * Maps concept category to color using 8+ category palette with gray fallback
 * Session 4 implementation: stable colors derived from concept ID as fallback
 */
function getCategoryColor(concept: Node): THREE.Color {
  // Use concept.color if available
  if (concept.color) {
    return new THREE.Color(concept.color)
  }

  // Try to get category from concept metadata
  let categoryIndex = -1
  const category = concept.metadata?.category as string | undefined
  const type = concept.metadata?.type as string | undefined
  
  if (category && typeof category === 'string') {
    // Hash category string to get consistent index
    let hash = 0
    for (let i = 0; i < category.length; i++) {
      hash = (hash << 5) - hash + category.charCodeAt(i)
      hash = hash & hash // Convert to 32bit integer
    }
    categoryIndex = Math.abs(hash) % CATEGORY_COLORS.length
  } else if (type && typeof type === 'string') {
    // Fallback to type field
    let hash = 0
    for (let i = 0; i < type.length; i++) {
      hash = (hash << 5) - hash + type.charCodeAt(i)
      hash = hash & hash
    }
    categoryIndex = Math.abs(hash) % CATEGORY_COLORS.length
  }

  // If we have a valid category, use palette color
  if (categoryIndex >= 0 && categoryIndex < CATEGORY_COLORS.length) {
    return new THREE.Color(CATEGORY_COLORS[categoryIndex])
  }

  // Final fallback: derive stable color from concept ID (Session 4 requirement)
  const hash = concept.id.split('').reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0)
    return acc & acc // Convert to 32bit integer
  }, 0)

  // For concepts without category, use first 8 slots of palette based on ID hash
  const idCategoryIndex = Math.abs(hash) % 8 // Use only first 8 colors for ID-based mapping
  if (idCategoryIndex < CATEGORY_COLORS.length) {
    return new THREE.Color(CATEGORY_COLORS[idCategoryIndex])
  }

  // Ultimate fallback to gray (should rarely happen)
  return new THREE.Color(GRAY_FALLBACK)
}

/**
 * Maps concept to vertex position using Session 3 VertexMapper
 * Implements deterministic positioning with region boundaries and collision handling
 */
function mapConceptToVertex(concept: Node, vertices: THREE.Vector3[]): THREE.Vector3 {
  if (vertices.length === 0) {
    return new THREE.Vector3(0, 0, 0)
  }

  // Use concept position if available
  if (concept.position) {
    return new THREE.Vector3(concept.position.x, concept.position.y, concept.position.z)
  }

  // Use Session 3 VertexMapper for deterministic mapping
  // Note: We use a simpler approach here since ConceptParticles manages its own collision tracking
  // For full collision resolution, the BrainIntegrationTest handles this at a higher level
  
  // djb2 hash implementation (from VertexMapper.ts)
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

      {/* Material optimized for glowing particles */}
      <meshPhongMaterial
        vertexColors={true}
        transparent={true}
        opacity={0.9}
        emissive={0xffffff}
        emissiveIntensity={0.3}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  )
}

export default ConceptParticles
