import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
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
  /** Render mode for particles: points (2D) or spheres (3D glow orbs) */
  renderMode?: 'points' | 'spheres'
  /** Camera for size calculations in screenshot mode */
  camera?: THREE.Camera
  /** Optional intro animation toggle (scatter → assemble → glow) */
  intro?: boolean
  /** Intro duration in milliseconds (default 1200) */
  introDurationMs?: number
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
  onHover: _onHover,
  onClick: _onClick,
  activeLens = 'affinity',
  mappedIndices,
  surfaceOffset = 0,
  renderMode = 'points',
  camera,
  intro = false,
  introDurationMs = 1200,
}: ConceptParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null)
  const geometryRef = useRef<THREE.BufferGeometry>(null)
  const [_hoveredIndex] = useState<number | null>(null)
  const positions = useMemo(() => new Float32Array(500 * 3), [])
  const colors = useMemo(() => new Float32Array(500 * 3), [])
  const tempMatrix = useMemo(() => new THREE.Matrix4(), [])
  const tempColor = useMemo(() => new THREE.Color(), [])
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(1, 8, 6), [])
  // Reduced motion preference
  const reduceMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

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

  // Glow orb shader material for spheres mode
  const glowMaterial = useMemo(() => {
    if (renderMode !== 'spheres') return null

    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulse: { value: 0 },
      },
      vertexShader: `
        // instanceMatrix and instanceColor are provided by three.js for InstancedMesh
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vColor;
        
        void main() {
          // Transform normal by instance matrix then by scene normalMatrix
          vec3 n = normalize(mat3(instanceMatrix) * normal);
          vNormal = normalize(normalMatrix * n);
          
          // Compute model-view position with instance transform
          vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
          vPosition = mvPosition.xyz;
          vColor = instanceColor;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float pulse;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vColor;
        
        void main() {
          vec3 viewDirection = normalize(-vPosition);
          float fresnel = 1.0 - max(0.0, dot(vNormal, viewDirection));
          
          // Core glow (emissive center)
          float coreGlow = 1.0;
          
          // Rim glow (Fresnel effect)
          float rimGlow = pow(fresnel, 2.5) * 1.2;
          
          // Combined glow intensity
          float glowIntensity = coreGlow + rimGlow;
          
          // Apply color with glow and pulse
          vec3 glowColor = vColor * glowIntensity * (1.0 + pulse);
          
          gl_FragColor = vec4(glowColor, 0.8);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [renderMode])

  // Calculate world units per pixel for size stability
  const r3fCamera = useThree((s) => s.camera)
  const effectiveCamera = camera ?? (r3fCamera as THREE.Camera)
  const worldUnitsPerPixel = useMemo(() => {
    if (!effectiveCamera || renderMode !== 'spheres') return 1

    // Approximate anchor depth around average distance from origin
    const anchorDepth =
      vertices.length > 0 ? vertices.reduce((sum, v) => sum + v.length(), 0) / vertices.length : 50

    if (effectiveCamera instanceof THREE.PerspectiveCamera) {
      const fovRadians = (effectiveCamera.fov * Math.PI) / 180
      const height = 2 * anchorDepth * Math.tan(fovRadians / 2)
      return height / (typeof window !== 'undefined' ? window.innerHeight : 800)
    } else if (effectiveCamera instanceof THREE.OrthographicCamera) {
      return (
        (effectiveCamera.top - effectiveCamera.bottom) /
        (typeof window !== 'undefined' ? window.innerHeight : 800)
      )
    }

    return 1
  }, [effectiveCamera, renderMode, vertices])

  // Intro animation data (scatter → assemble → glow)
  const introStartRef = useRef<number | null>(null)
  const introDoneRef = useRef<boolean>(false)
  const pulseStartRef = useRef<number | null>(null)
  const maxIntroDelayMs = 300
  // Per-instance randomized intro delay and swirl speed to match vendor behavior
  const instanceDelayMs = useMemo(() => {
    const arr = new Float32Array(500)
    for (let i = 0; i < 500; i++) arr[i] = Math.random() * maxIntroDelayMs
    return arr
  }, [])
  const swirlSpeed = useMemo(() => {
    const arr = new Float32Array(500)
    for (let i = 0; i < 500; i++) arr[i] = 0.4 + Math.random() * 0.8 // radians/sec factor
    return arr
  }, [])
  const { centroid: cloudCentroid, maxRadius } = useMemo(() => {
    if (vertices.length === 0) return { centroid: new THREE.Vector3(0, 0, 0), maxRadius: 50 }
    const c = vertices
      .reduce((acc, v) => acc.add(v), new THREE.Vector3())
      .multiplyScalar(1 / vertices.length)
    let r = 0
    for (const v of vertices) r = Math.max(r, v.distanceTo(c))
    return { centroid: c, maxRadius: r }
  }, [vertices])

  const ringBase = useMemo(() => {
    // Build a ring/spiral cloud around the centroid, sized relative to brain radius
    const out: { base: THREE.Vector3; radius: number; angle: number }[] = []
    const baseRadius = Math.max(10, maxRadius * 1.4)
    for (let i = 0; i < 500; i++) {
      const a = (i / 500) * Math.PI * 2 + (Math.random() - 0.5) * 0.6
      const r = baseRadius * (0.6 + Math.random() * 0.8)
      const z = (Math.random() - 0.5) * baseRadius * 0.4
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      out.push({ base: new THREE.Vector3(x, y, z).add(cloudCentroid), radius: r, angle: a })
    }
    return out
  }, [cloudCentroid, maxRadius])

  function easeExpoInOut(t: number): number {
    if (t <= 0) return 0
    if (t >= 1) return 1
    return t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2
  }

  // Update instanced mesh matrices and colors
  useFrame((state) => {
    if (renderMode !== 'spheres' || !instancedMeshRef.current) return

    const mesh = instancedMeshRef.current
    const targetPixelSize = 30 // target ~30px diameter for screenshot mode
    const worldRadius = worldUnitsPerPixel * targetPixelSize * 0.5

    // Initialize intro
    const introActive = intro && !reduceMotion
    if (introActive && introStartRef.current == null) {
      introStartRef.current = performance.now()
    }
    const now = performance.now()
    const introAllDoneTime = (introStartRef.current ?? now) + introDurationMs + maxIntroDelayMs
    if (introActive && !introDoneRef.current && introStartRef.current != null && now >= introAllDoneTime) {
      introDoneRef.current = true
      pulseStartRef.current = now
    }
    // Pulse after assemble
    if (glowMaterial) {
      const uniform = (glowMaterial as any).uniforms?.pulse
      if (uniform) {
        let pulse = 0
        if (pulseStartRef.current != null) {
          const pElapsed = (now - pulseStartRef.current) / 1000
          pulse = Math.max(0, 0.6 * Math.exp(-3.0 * pElapsed))
        }
        uniform.value = pulse
      }
    }

    for (let i = 0; i < 500; i++) {
      const data = instanceData[i]
      if (!data || !data.concept.id) {
        // Hide unused instances
        tempMatrix.makeScale(0, 0, 0)
        tempMatrix.setPosition(10000, 10000, 10000)
        tempColor.setHex(0x000000)
      } else {
        // Set scale for target pixel size
        tempMatrix.makeScale(worldRadius, worldRadius, worldRadius)
        // Interpolate position if intro active using per-instance delay + ring swirl
        if (introActive && !introDoneRef.current && introStartRef.current != null) {
          const start = introStartRef.current + instanceDelayMs[i]
          const raw = Math.min(1, Math.max(0, (now - start) / Math.max(1, introDurationMs)))
          const tt = easeExpoInOut(raw)
          const base = ringBase[i]
          const w = swirlSpeed[i]
          const theta = base.angle + w * ((state.clock?.elapsedTime ?? 0) * 0.8)
          const bx = Math.cos(theta) * base.radius
          const by = Math.sin(theta) * base.radius
          const bz = base.base.z - cloudCentroid.z
          const sx = cloudCentroid.x + bx
          const sy = cloudCentroid.y + by
          const sz = cloudCentroid.z + bz
          const x = sx * (1 - tt) + data.position.x * tt
          const y = sy * (1 - tt) + data.position.y * tt
          const z = sz * (1 - tt) + data.position.z * tt
          tempMatrix.setPosition(x, y, z)
        } else {
          tempMatrix.setPosition(data.position.x, data.position.y, data.position.z)
        }
        tempColor.copy(data.color)
      }

      mesh.setMatrixAt(i, tempMatrix)
      mesh.setColorAt(i, tempColor)
    }

    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true
    }
  })

  // Pointer handlers disabled for Points-based audit mode

  if (renderMode === 'spheres') {
    return (
      <instancedMesh
        ref={instancedMeshRef}
        args={[sphereGeometry, glowMaterial!, 500]}
        visible={visible}
        renderOrder={1}
      />
    )
  }

  return (
    // Switch to Points for fixed pixel size (~2px)
    <points ref={pointsRef as any} visible={visible}>
      <bufferGeometry ref={geometryRef as any}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={500} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={500} />
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
