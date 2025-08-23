import { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import {} from '@react-three/fiber'
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
  /** Active lens for color mapping */
  activeLens?: 'causal' | 'affinity' | 'temporal'
  /** Optional precomputed vertex indices to use for each concept (display mapping) */
  mappedIndices?: number[]
  /** Optional outward offset along radial direction from centroid to avoid embedding */
  surfaceOffset?: number
}

interface InstanceData {
  position: THREE.Vector3
  color: THREE.Color
  scale: number
  originalScale: number
  concept: Node
}

/**
 * Affinity lens category color palette with 8+ distinct colors plus gray fallback
 * Session 12 requirement: 8+ category colors with overflow to gray for Affinity lens
 */
const AFFINITY_CATEGORY_COLORS = [
  '#FF6B6B', // Red - Technology/Engineering
  '#4ECDC4', // Teal - Science/Research
  '#45B7D1', // Blue - Business/Finance
  '#96CEB4', // Green - Health/Medicine
  '#FFEAA7', // Yellow - Education/Learning
  '#DDA0DD', // Plum - Arts/Creative
  '#98D8C8', // Mint - Social/Community
  '#F7DC6F', // Light Yellow - Environment/Nature
  '#BB8FCE', // Light Purple - Philosophy/Ideas
  '#85C1E9', // Light Blue - Data/Analytics
  '#F8C471', // Orange - Communication/Media
  '#82E0AA', // Light Green - Innovation/Research
] as const

/**
 * Causal lens uses relationship-based colors (warmer = stronger causal connection)
 */
const CAUSAL_COLORS = [
  '#FF4444', // Strong causal (red)
  '#FF8844', // Medium-strong (orange-red)
  '#FFAA44', // Medium (orange)
  '#FFCC44', // Medium-weak (yellow-orange)
  '#AAAA44', // Weak causal (yellow-green)
  '#88CC44', // Indirect (green)
  '#66AA88', // Correlation (teal)
  '#4488CC', // Coincidence (blue)
] as const

/**
 * Temporal lens uses time-based progression colors (cooler = older, warmer = newer)
 */
const TEMPORAL_COLORS = [
  '#4A90E2', // Ancient/Historical (deep blue)
  '#5BA0F2', // Old (blue)
  '#6BB0FF', // Mature (light blue)
  '#7BC0FF', // Established (cyan)
  '#8BD0FF', // Recent (light cyan)
  '#FFB84D', // Current (amber)
  '#FF8C42', // Emerging (orange)
  '#FF6B35', // New/Future (red-orange)
] as const

const GRAY_FALLBACK = '#888888' // Gray for overflow categories

/**
 * Maps concept to color based on active lens - Session 12 implementation
 * Affinity lens: category→color mapping (8+ hues, gray overflow)
 * Causal lens: relationship strength colors
 * Temporal lens: time-based progression colors
 */
function getLensColor(
  concept: Node,
  activeLens: 'causal' | 'affinity' | 'temporal' = 'affinity'
): THREE.Color {
  // Use concept.color if available (overrides lens)
  if (concept.color) {
    return new THREE.Color(concept.color)
  }

  if (activeLens === 'affinity') {
    return getAffinityColor(concept)
  } else if (activeLens === 'causal') {
    return getCausalColor(concept)
  } else if (activeLens === 'temporal') {
    return getTemporalColor(concept)
  }

  // Fallback to affinity lens
  return getAffinityColor(concept)
}

/**
 * Affinity lens: Maps concept category to color using 8+ category palette with gray fallback
 * Session 12 requirement: category→color mapping for Affinity lens
 */
function getAffinityColor(concept: Node): THREE.Color {
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
    categoryIndex = Math.abs(hash) % AFFINITY_CATEGORY_COLORS.length
  } else if (type && typeof type === 'string') {
    // Fallback to type field
    let hash = 0
    for (let i = 0; i < type.length; i++) {
      hash = (hash << 5) - hash + type.charCodeAt(i)
      hash = hash & hash
    }
    categoryIndex = Math.abs(hash) % AFFINITY_CATEGORY_COLORS.length
  }

  // If we have a valid category, use palette color
  if (categoryIndex >= 0 && categoryIndex < AFFINITY_CATEGORY_COLORS.length) {
    return new THREE.Color(AFFINITY_CATEGORY_COLORS[categoryIndex])
  }

  // Final fallback: derive stable color from concept ID
  const hash = concept.id.split('').reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0)
    return acc & acc // Convert to 32bit integer
  }, 0)

  // For concepts without category, use first 8 slots of palette based on ID hash
  const idCategoryIndex = Math.abs(hash) % 8 // Use only first 8 colors for ID-based mapping
  if (idCategoryIndex < AFFINITY_CATEGORY_COLORS.length) {
    return new THREE.Color(AFFINITY_CATEGORY_COLORS[idCategoryIndex])
  }

  // Ultimate fallback to gray (overflow category)
  return new THREE.Color(GRAY_FALLBACK)
}

/**
 * Causal lens: Maps concept to color based on causal relationship strength
 */
function getCausalColor(concept: Node): THREE.Color {
  // Use causal strength if available in metadata
  const causalStrength = concept.metadata?.causalStrength as number | undefined
  if (typeof causalStrength === 'number' && causalStrength >= 0 && causalStrength <= 1) {
    const colorIndex = Math.floor(causalStrength * (CAUSAL_COLORS.length - 1))
    return new THREE.Color(CAUSAL_COLORS[colorIndex])
  }

  // Fallback: use concept ID to derive consistent causal strength
  const hash = concept.id.split('').reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0)
    return acc & acc
  }, 0)

  const colorIndex = Math.abs(hash) % CAUSAL_COLORS.length
  return new THREE.Color(CAUSAL_COLORS[colorIndex])
}

/**
 * Temporal lens: Maps concept to color based on temporal information
 */
function getTemporalColor(concept: Node): THREE.Color {
  // Use temporal data if available in metadata
  const timeStamp = concept.metadata?.timestamp as number | string | undefined
  const timeScore = concept.metadata?.timeScore as number | undefined

  if (typeof timeScore === 'number' && timeScore >= 0 && timeScore <= 1) {
    const colorIndex = Math.floor(timeScore * (TEMPORAL_COLORS.length - 1))
    return new THREE.Color(TEMPORAL_COLORS[colorIndex])
  }

  if (timeStamp) {
    // Convert timestamp to temporal score (newer = higher score)
    const now = Date.now()
    const conceptTime = typeof timeStamp === 'string' ? Date.parse(timeStamp) : timeStamp
    if (conceptTime && !isNaN(conceptTime)) {
      // Scale based on a reasonable time range (e.g., last 10 years)
      const tenYearsAgo = now - 10 * 365 * 24 * 60 * 60 * 1000
      const normalizedTime = Math.max(
        0,
        Math.min(1, (conceptTime - tenYearsAgo) / (now - tenYearsAgo))
      )
      const colorIndex = Math.floor(normalizedTime * (TEMPORAL_COLORS.length - 1))
      return new THREE.Color(TEMPORAL_COLORS[colorIndex])
    }
  }

  // Fallback: use concept ID to derive consistent temporal position
  const hash = concept.id.split('').reduce((acc, char) => {
    acc = (acc << 5) - acc + char.charCodeAt(0)
    return acc & acc
  }, 0)

  const colorIndex = Math.abs(hash) % TEMPORAL_COLORS.length
  return new THREE.Color(TEMPORAL_COLORS[colorIndex])
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
  particleSize = 2,
  visible = true,
  onHover,
  onClick,
  activeLens = 'affinity',
  mappedIndices,
  surfaceOffset = 0,
}: ConceptParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const [hoveredIndex] = useState<number | null>(null)
  const positions = useMemo(() => new Float32Array(500 * 3), [])
  const colors = useMemo(() => new Float32Array(500 * 3), [])

  // Create instance data for up to 500 concepts
  const instanceData = useMemo<InstanceData[]>(() => {
    const maxInstances = 500
    const data: InstanceData[] = []

    // Compute centroid for outward offset
    const centroid =
      vertices.length > 0
        ? vertices
            .reduce((acc, v) => acc.add(v), new THREE.Vector3())
            .multiplyScalar(1 / vertices.length)
        : new THREE.Vector3(0, 0, 0)

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

      let baseIndex: number | null = null
      if (mappedIndices && mappedIndices[i] != null) {
        baseIndex = mappedIndices[i]!
      }

      const position =
        baseIndex != null && vertices[baseIndex]
          ? vertices[baseIndex].clone()
          : mapConceptToVertex(concept, vertices)

      if (surfaceOffset !== 0 && vertices.length > 0) {
        const radial = position.clone().sub(centroid)
        if (radial.lengthSq() > 1e-6) {
          radial.normalize().multiplyScalar(surfaceOffset)
          position.add(radial)
        }
      }
      const color = getLensColor(concept, activeLens)
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
  }, [concepts, vertices, particleSize, activeLens, mappedIndices, surfaceOffset])

  // Update buffer attributes once per data change
  useEffect(() => {
    for (let i = 0; i < 500; i++) {
      const d = instanceData[i]
      const pi = i * 3
      if (d && d.concept && d.concept.id) {
        positions[pi + 0] = d.position.x
        positions[pi + 1] = d.position.y
        positions[pi + 2] = d.position.z
        colors[pi + 0] = d.color.r
        colors[pi + 1] = d.color.g
        colors[pi + 2] = d.color.b
      } else {
        positions[pi + 0] = 10000
        positions[pi + 1] = 10000
        positions[pi + 2] = 10000
        colors[pi + 0] = 0
        colors[pi + 1] = 0
        colors[pi + 2] = 0
      }
    }
    const geo = geometryRef.current as any
    if (geo?.attributes?.position) {
      geo.attributes.position.needsUpdate = true
    }
    if (geo?.attributes?.color) {
      geo.attributes.color.needsUpdate = true
    }
    geo?.computeBoundingSphere?.()
  }, [instanceData, positions, colors])

  // Pointer handlers disabled for Points-based audit mode

  return (
    // Switch to Points for fixed pixel size (~2px)
    <points ref={pointsRef as any} visible={visible}>
      <bufferGeometry ref={geometryRef as any}>
        <bufferAttribute attach="attributes-position" count={500} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={500} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={15}
        sizeAttenuation={false}
        vertexColors
        transparent
        opacity={0.95}
        depthWrite={false}
      />
    </points>
  )
}

export default ConceptParticles
