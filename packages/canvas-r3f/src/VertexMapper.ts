import * as THREE from 'three'

export interface RegionBoundaries {
  frontal: { min: number; max: number }
  parietal: { min: number; max: number }
  temporal: { min: number; max: number }
  occipital: { min: number; max: number }
}

export interface RegionDistribution {
  frontal: number
  parietal: number
  temporal: number
  occipital: number
}

export function extractVerticesFromObject(object: THREE.Object3D): THREE.Vector3[] {
  const vertices: THREE.Vector3[] = []
  
  object.traverse((child) => {
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
  
  return vertices
}

export function analyzeVertexDistribution(vertices: THREE.Vector3[]): {
  yMin: number
  yMax: number
  yRange: number
  count: number
  yHistogram: Map<number, number>
} {
  if (vertices.length === 0) {
    return {
      yMin: 0,
      yMax: 0,
      yRange: 0,
      count: 0,
      yHistogram: new Map()
    }
  }
  
  let yMin = Infinity
  let yMax = -Infinity
  const yHistogram = new Map<number, number>()
  
  vertices.forEach(vertex => {
    yMin = Math.min(yMin, vertex.y)
    yMax = Math.max(yMax, vertex.y)
    
    const bucket = Math.floor(vertex.y * 10) / 10
    yHistogram.set(bucket, (yHistogram.get(bucket) || 0) + 1)
  })
  
  return {
    yMin,
    yMax,
    yRange: yMax - yMin,
    count: vertices.length,
    yHistogram
  }
}

export function calculateRegionBoundaries(
  vertices: THREE.Vector3[],
  targetDistribution: RegionDistribution = {
    frontal: 0.30,
    parietal: 0.25,
    temporal: 0.25,
    occipital: 0.20
  }
): RegionBoundaries {
  const analysis = analyzeVertexDistribution(vertices)
  const { yMin, yMax } = analysis
  
  const sortedVertices = [...vertices].sort((a, b) => b.y - a.y)
  
  const totalCount = sortedVertices.length
  const frontalCount = Math.floor(totalCount * targetDistribution.frontal)
  const parietalCount = Math.floor(totalCount * targetDistribution.parietal)
  const temporalCount = Math.floor(totalCount * targetDistribution.temporal)
  
  let frontalBoundary = yMax
  let parietalBoundary = yMax
  let temporalBoundary = yMax
  
  if (sortedVertices.length > frontalCount) {
    frontalBoundary = sortedVertices[frontalCount - 1].y
  }
  
  if (sortedVertices.length > frontalCount + parietalCount) {
    parietalBoundary = sortedVertices[frontalCount + parietalCount - 1].y
  }
  
  if (sortedVertices.length > frontalCount + parietalCount + temporalCount) {
    temporalBoundary = sortedVertices[frontalCount + parietalCount + temporalCount - 1].y
  }
  
  return {
    frontal: { min: frontalBoundary, max: yMax },
    parietal: { min: parietalBoundary, max: frontalBoundary },
    temporal: { min: temporalBoundary, max: parietalBoundary },
    occipital: { min: yMin, max: temporalBoundary }
  }
}

export function getRegionVertices(
  vertices: THREE.Vector3[],
  regionIndex: number,
  boundaries?: RegionBoundaries
): number[] {
  const regionBoundaries = boundaries || calculateRegionBoundaries(vertices)
  
  const regionRanges = [
    regionBoundaries.frontal,
    regionBoundaries.parietal,
    regionBoundaries.temporal,
    regionBoundaries.occipital
  ]
  
  if (regionIndex < 0 || regionIndex >= regionRanges.length) {
    throw new Error(`Invalid region index: ${regionIndex}. Must be 0-3`)
  }
  
  const range = regionRanges[regionIndex]
  const indices: number[] = []
  
  vertices.forEach((vertex, index) => {
    if (regionIndex === 0) {
      if (vertex.y > range.min && vertex.y <= range.max) {
        indices.push(index)
      }
    } else if (regionIndex === 3) {
      if (vertex.y >= range.min && vertex.y < range.max) {
        indices.push(index)
      }
    } else {
      if (vertex.y > range.min && vertex.y <= range.max) {
        indices.push(index)
      }
    }
  })
  
  return indices
}

export function validateRegionDistribution(
  vertices: THREE.Vector3[],
  boundaries: RegionBoundaries,
  tolerance: number = 0.05
): {
  valid: boolean
  actual: RegionDistribution
  target: RegionDistribution
  errors: string[]
} {
  const frontalIndices = getRegionVertices(vertices, 0, boundaries)
  const parietalIndices = getRegionVertices(vertices, 1, boundaries)
  const temporalIndices = getRegionVertices(vertices, 2, boundaries)
  const occipitalIndices = getRegionVertices(vertices, 3, boundaries)
  
  const total = vertices.length
  const actual: RegionDistribution = {
    frontal: frontalIndices.length / total,
    parietal: parietalIndices.length / total,
    temporal: temporalIndices.length / total,
    occipital: occipitalIndices.length / total
  }
  
  const target: RegionDistribution = {
    frontal: 0.30,
    parietal: 0.25,
    temporal: 0.25,
    occipital: 0.20
  }
  
  const errors: string[] = []
  let valid = true
  
  Object.entries(target).forEach(([region, targetValue]) => {
    const actualValue = actual[region as keyof RegionDistribution]
    const diff = Math.abs(actualValue - targetValue)
    
    if (diff > tolerance) {
      valid = false
      errors.push(
        `${region}: ${(actualValue * 100).toFixed(1)}% (target: ${(targetValue * 100).toFixed(1)}%, diff: ${(diff * 100).toFixed(1)}%)`
      )
    }
  })
  
  return {
    valid,
    actual,
    target,
    errors
  }
}

export function getRegionColor(regionIndex: number): string {
  const colors = [
    '#ff0000',
    '#00ff00',
    '#0000ff',
    '#ffff00'
  ]
  
  return colors[regionIndex] || '#ffffff'
}

export function getRegionName(regionIndex: number): string {
  const names = ['frontal', 'parietal', 'temporal', 'occipital']
  return names[regionIndex] || 'unknown'
}

// Concept-to-vertex mapping functions (Session 4)

/**
 * djb2 hash function for deterministic string hashing
 * Original implementation by Dan Bernstein
 * Provides excellent distribution for concept IDs
 */
export function djb2Hash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return hash
}

/**
 * Finds the distance between two vertices in 3D space
 */
function calculateVertexDistance(v1: THREE.Vector3, v2: THREE.Vector3): number {
  return v1.distanceTo(v2)
}

/**
 * Performs a spiral search around a target vertex to find the nearest unoccupied vertex
 * Returns the nearest available vertex within the search radius
 */
export function spiralSearch(
  targetVertexIndex: number,
  vertices: THREE.Vector3[],
  occupied: Set<number>,
  searchRadius: number = 5
): {
  vertexIndex: number
  attempts: number
} {
  const targetVertex = vertices[targetVertexIndex]
  const candidates: { index: number; distance: number }[] = []
  
  // Find all vertices within the search radius
  for (let i = 0; i < vertices.length; i++) {
    if (!occupied.has(i)) {
      const distance = calculateVertexDistance(targetVertex, vertices[i])
      if (distance <= searchRadius) {
        candidates.push({ index: i, distance })
      }
    }
  }
  
  // If no candidates found within radius, expand search or fall back to linear probing
  if (candidates.length === 0) {
    // Fall back to nearest unoccupied vertex
    let nearestIndex = -1
    let nearestDistance = Infinity
    let attempts = 0
    
    for (let i = 0; i < vertices.length; i++) {
      attempts++
      if (!occupied.has(i)) {
        const distance = calculateVertexDistance(targetVertex, vertices[i])
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = i
        }
      }
    }
    
    if (nearestIndex === -1) {
      throw new Error('No unoccupied vertices available')
    }
    
    return { vertexIndex: nearestIndex, attempts }
  }
  
  // Sort by distance and return the nearest one
  candidates.sort((a, b) => a.distance - b.distance)
  return { vertexIndex: candidates[0].index, attempts: candidates.length }
}

/**
 * Performs a spiral search within a specific brain region
 * Similar to spiralSearch but constrained to region vertices
 */
export function spiralSearchInRegion(
  targetVertexIndex: number,
  vertices: THREE.Vector3[],
  regionVertexIndices: number[],
  occupied: Set<number>,
  searchRadius: number = 5
): {
  vertexIndex: number
  attempts: number
} {
  const targetVertex = vertices[targetVertexIndex]
  const candidates: { index: number; distance: number }[] = []
  
  // Find all unoccupied vertices within the region and search radius
  for (const regionIndex of regionVertexIndices) {
    if (!occupied.has(regionIndex)) {
      const distance = calculateVertexDistance(targetVertex, vertices[regionIndex])
      if (distance <= searchRadius) {
        candidates.push({ index: regionIndex, distance })
      }
    }
  }
  
  // If no candidates found within radius, fall back to nearest in region
  if (candidates.length === 0) {
    let nearestIndex = -1
    let nearestDistance = Infinity
    let attempts = 0
    
    for (const regionIndex of regionVertexIndices) {
      attempts++
      if (!occupied.has(regionIndex)) {
        const distance = calculateVertexDistance(targetVertex, vertices[regionIndex])
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = regionIndex
        }
      }
    }
    
    if (nearestIndex === -1) {
      throw new Error('No unoccupied vertices available in region')
    }
    
    return { vertexIndex: nearestIndex, attempts }
  }
  
  // Sort by distance and return the nearest one
  candidates.sort((a, b) => a.distance - b.distance)
  return { vertexIndex: candidates[0].index, attempts: candidates.length }
}

/**
 * Maps a concept ID to a vertex index using djb2 hash
 * Includes occupancy tracking to prevent collisions
 */
export function conceptToVertex(
  conceptId: string,
  vertices: THREE.Vector3[],
  occupied: Set<number> = new Set(),
  boundaries?: RegionBoundaries,
  useSpiral: boolean = false,
  searchRadius: number = 5
): {
  vertexIndex: number
  wasCollision: boolean
  attempts: number
} {
  if (vertices.length === 0) {
    throw new Error('Cannot map concept to empty vertex array')
  }

  const hash = djb2Hash(conceptId)
  
  // If no boundaries provided, use full vertex set
  if (!boundaries) {
    let attempts = 0
    let vertexIndex = Math.abs(hash) % vertices.length
    let wasCollision = false

    // Use spiral search if enabled
    if (useSpiral && occupied.has(vertexIndex)) {
      wasCollision = true
      const spiralResult = spiralSearch(vertexIndex, vertices, occupied, searchRadius)
      attempts = spiralResult.attempts
      vertexIndex = spiralResult.vertexIndex
    } else {
      // Linear probing for collision resolution
      while (occupied.has(vertexIndex)) {
        attempts++
        wasCollision = true
        vertexIndex = (vertexIndex + 1) % vertices.length
        
        // Prevent infinite loops
        if (attempts >= vertices.length) {
          throw new Error(`All ${vertices.length} vertices are occupied`)
        }
      }
    }

    occupied.add(vertexIndex)
    return { vertexIndex, wasCollision, attempts }
  }

  // Region-based mapping using brain regions
  const regionIndex = Math.abs(hash) % 4 // 0-3 for four brain regions
  const regionVertexIndices = getRegionVertices(vertices, regionIndex, boundaries)
  
  if (regionVertexIndices.length === 0) {
    throw new Error(`No vertices available in region ${regionIndex}`)
  }

  let attempts = 0
  let localIndex = Math.abs(hash >> 2) % regionVertexIndices.length
  let vertexIndex = regionVertexIndices[localIndex]
  let wasCollision = false

  // Use spiral search if enabled
  if (useSpiral && occupied.has(vertexIndex)) {
    wasCollision = true
    const spiralResult = spiralSearchInRegion(vertexIndex, vertices, regionVertexIndices, occupied, searchRadius)
    attempts = spiralResult.attempts
    vertexIndex = spiralResult.vertexIndex
  } else {
    // Linear probing within the region
    while (occupied.has(vertexIndex)) {
      attempts++
      wasCollision = true
      localIndex = (localIndex + 1) % regionVertexIndices.length
      vertexIndex = regionVertexIndices[localIndex]
      
      // Prevent infinite loops
      if (attempts >= regionVertexIndices.length) {
        throw new Error(`All ${regionVertexIndices.length} vertices in region ${regionIndex} are occupied`)
      }
    }
  }

  occupied.add(vertexIndex)
  return { vertexIndex, wasCollision, attempts }
}

/**
 * Analyzes concept-to-vertex mapping distribution
 * Tests collision rate, region distribution, and performance
 */
export function analyzeConceptMapping(
  conceptIds: string[],
  vertices: THREE.Vector3[],
  boundaries?: RegionBoundaries,
  useSpiral: boolean = false,
  searchRadius: number = 5
): {
  totalConcepts: number
  totalCollisions: number
  collisionRate: number
  averageAttempts: number
  regionDistribution: Record<number, number>
  performanceMs: number
  spiralSearchUsed: boolean
  searchRadius: number
  failedPlacements: number
} {
  const startTime = performance.now()
  const occupied = new Set<number>()
  const regionCounts = { 0: 0, 1: 0, 2: 0, 3: 0 }
  
  let totalCollisions = 0
  let totalAttempts = 0
  let failedPlacements = 0

  for (const conceptId of conceptIds) {
    try {
      const result = conceptToVertex(conceptId, vertices, occupied, boundaries, useSpiral, searchRadius)
      
      if (result.wasCollision) {
        totalCollisions++
      }
      totalAttempts += result.attempts

      // Determine which region this vertex belongs to
      if (boundaries) {
        for (let regionIndex = 0; regionIndex < 4; regionIndex++) {
          const regionVertices = getRegionVertices(vertices, regionIndex, boundaries)
          if (regionVertices.includes(result.vertexIndex)) {
            regionCounts[regionIndex as keyof typeof regionCounts]++
            break
          }
        }
      }
    } catch (error) {
      failedPlacements++
      console.warn(`Failed to place concept ${conceptId}: ${error.message}`)
    }
  }

  const endTime = performance.now()
  
  return {
    totalConcepts: conceptIds.length,
    totalCollisions,
    collisionRate: totalCollisions / conceptIds.length,
    averageAttempts: totalAttempts / conceptIds.length,
    regionDistribution: regionCounts,
    performanceMs: endTime - startTime,
    spiralSearchUsed: useSpiral,
    searchRadius,
    failedPlacements
  }
}

/**
 * Generates a visual distribution report for concept mapping
 */
export function generateDistributionReport(
  analysis: ReturnType<typeof analyzeConceptMapping>,
  vertices: THREE.Vector3[]
): string {
  const { 
    totalConcepts, 
    totalCollisions, 
    collisionRate, 
    averageAttempts, 
    regionDistribution, 
    performanceMs,
    spiralSearchUsed,
    searchRadius,
    failedPlacements
  } = analysis
  
  const report = [
    '=== Concept Mapping Distribution Report ===',
    '',
    `Total Concepts: ${totalConcepts}`,
    `Total Vertices Available: ${vertices.length}`,
    `Utilization: ${((totalConcepts / vertices.length) * 100).toFixed(2)}%`,
    '',
    '--- Collision Analysis ---',
    `Total Collisions: ${totalCollisions}`,
    `Collision Rate: ${(collisionRate * 100).toFixed(2)}%`,
    `Average Attempts per Concept: ${averageAttempts.toFixed(2)}`,
    `Failed Placements: ${failedPlacements}`,
    '',
    '--- Collision Resolution Strategy ---',
    `Spiral Search Enabled: ${spiralSearchUsed ? 'Yes' : 'No'}`,
    `Search Radius: ${searchRadius} units`,
    `Resolution Method: ${spiralSearchUsed ? 'Spiral Search + Linear Fallback' : 'Linear Probing'}`,
    '',
    '--- Region Distribution ---',
    `Frontal (0): ${regionDistribution[0]} concepts`,
    `Parietal (1): ${regionDistribution[1]} concepts`,
    `Temporal (2): ${regionDistribution[2]} concepts`,
    `Occipital (3): ${regionDistribution[3]} concepts`,
    '',
    '--- Performance ---',
    `Total Mapping Time: ${performanceMs.toFixed(2)}ms`,
    `Average per Concept: ${(performanceMs / totalConcepts).toFixed(4)}ms`,
    `Throughput: ${(totalConcepts / performanceMs * 1000).toFixed(0)} concepts/second`,
    ''
  ].join('\n')
  
  return report
}

// Overflow Shell System (Session 6)

/**
 * Interface for shell vertex mapping information
 */
export interface ShellVertexInfo {
  originalIndex: number
  shellIndex: number
  layer: number
  jitteredPosition: THREE.Vector3
}

/**
 * Configuration for overflow shell generation
 */
export interface ShellConfig {
  scaleFactor: number      // Default: 1.01 (1% larger)
  jitterAmount: number     // Default: 0.001 (±0.1% positional jitter)
  maxShells: number        // Default: 5 (support up to 5 overflow shells)
}

/**
 * Result of shell generation with metadata
 */
export interface ShellGenerationResult {
  shellVertices: THREE.Vector3[]
  shellInfo: ShellVertexInfo[]
  totalVerticesGenerated: number
  shellConfig: ShellConfig
  generationTimeMs: number
}

/**
 * Generates overflow shell vertices around the original brain mesh
 * Creates a scaled version of the brain with positional jitter to maintain silhouette
 */
export function generateOverflowShell(
  originalVertices: THREE.Vector3[],
  layer: number = 1,
  config: Partial<ShellConfig> = {}
): ShellGenerationResult {
  const startTime = performance.now()
  
  const defaultConfig: ShellConfig = {
    scaleFactor: 1.01,
    jitterAmount: 0.001,
    maxShells: 5
  }
  
  const shellConfig = { ...defaultConfig, ...config }
  
  if (layer > shellConfig.maxShells) {
    throw new Error(`Shell layer ${layer} exceeds maximum allowed shells (${shellConfig.maxShells})`)
  }
  
  if (originalVertices.length === 0) {
    throw new Error('Cannot generate shell from empty vertex array')
  }
  
  // Calculate the center of the original mesh for scaling
  const center = new THREE.Vector3()
  originalVertices.forEach(vertex => center.add(vertex))
  center.divideScalar(originalVertices.length)
  
  // Generate shell vertices with scaling and jitter
  const shellVertices: THREE.Vector3[] = []
  const shellInfo: ShellVertexInfo[] = []
  
  // Compound scaling for multiple layers (1.01^layer)
  const layerScaleFactor = Math.pow(shellConfig.scaleFactor, layer)
  
  originalVertices.forEach((vertex, originalIndex) => {
    // Scale vertex outward from center
    const scaledVertex = vertex.clone().sub(center).multiplyScalar(layerScaleFactor).add(center)
    
    // Add deterministic jitter based on vertex index and layer to maintain reproducibility
    const jitterSeed = (originalIndex * 1000 + layer) % 1000
    const jitterX = (Math.sin(jitterSeed * 0.1) * shellConfig.jitterAmount)
    const jitterY = (Math.cos(jitterSeed * 0.1) * shellConfig.jitterAmount)
    const jitterZ = (Math.sin(jitterSeed * 0.15) * shellConfig.jitterAmount)
    
    const jitteredVertex = scaledVertex.clone().add(new THREE.Vector3(jitterX, jitterY, jitterZ))
    
    shellVertices.push(jitteredVertex)
    shellInfo.push({
      originalIndex,
      shellIndex: originalIndex, // Same indexing as original
      layer,
      jitteredPosition: jitteredVertex
    })
  })
  
  const endTime = performance.now()
  
  return {
    shellVertices,
    shellInfo,
    totalVerticesGenerated: shellVertices.length,
    shellConfig,
    generationTimeMs: endTime - startTime
  }
}

/**
 * Detects if the base mesh has reached full occupancy and shell is needed
 */
export function detectFullOccupancy(
  occupied: Set<number>,
  totalVertices: number,
  threshold: number = 0.95
): {
  isFull: boolean
  occupancyRate: number
  availableVertices: number
  needsShell: boolean
} {
  const occupancyRate = occupied.size / totalVertices
  const availableVertices = totalVertices - occupied.size
  const isFull = occupancyRate >= threshold
  
  return {
    isFull,
    occupancyRate,
    availableVertices,
    needsShell: isFull
  }
}

/**
 * Enhanced vertex pool that manages both base mesh and overflow shells
 */
export class VertexPool {
  private baseVertices: THREE.Vector3[]
  private shells: Map<number, ShellGenerationResult> = new Map()
  private occupied: Set<string> = new Set() // Uses "layer:index" format
  private shellConfig: ShellConfig
  
  constructor(baseVertices: THREE.Vector3[], config: Partial<ShellConfig> = {}) {
    this.baseVertices = baseVertices
    this.shellConfig = {
      scaleFactor: 1.01,
      jitterAmount: 0.001,
      maxShells: 5,
      ...config
    }
  }
  
  /**
   * Gets the total number of available vertices across all layers
   */
  getTotalVertices(): number {
    return this.baseVertices.length * (1 + this.shells.size)
  }
  
  /**
   * Gets vertices from a specific layer (0 = base, 1+ = shells)
   */
  getLayerVertices(layer: number): THREE.Vector3[] {
    if (layer === 0) {
      return this.baseVertices
    }
    
    const shell = this.shells.get(layer)
    if (!shell) {
      // Generate shell on demand
      const generatedShell = generateOverflowShell(this.baseVertices, layer, this.shellConfig)
      this.shells.set(layer, generatedShell)
      return generatedShell.shellVertices
    }
    
    return shell.shellVertices
  }
  
  /**
   * Checks if a vertex position is occupied
   */
  isOccupied(layer: number, index: number): boolean {
    return this.occupied.has(`${layer}:${index}`)
  }
  
  /**
   * Marks a vertex position as occupied
   */
  markOccupied(layer: number, index: number): void {
    this.occupied.add(`${layer}:${index}`)
  }
  
  /**
   * Gets the occupancy rate for a specific layer
   */
  getLayerOccupancy(layer: number): number {
    const layerVertices = this.getLayerVertices(layer)
    const layerOccupied = Array.from(this.occupied)
      .filter(key => key.startsWith(`${layer}:`))
      .length
    
    return layerOccupied / layerVertices.length
  }
  
  /**
   * Finds the next available vertex, creating shells as needed
   */
  findNextAvailableVertex(
    conceptId: string,
    boundaries?: RegionBoundaries,
    useSpiral: boolean = false,
    searchRadius: number = 5
  ): {
    layer: number
    vertexIndex: number
    position: THREE.Vector3
    wasCollision: boolean
    attempts: number
    shellGenerated: boolean
  } {
    let shellGenerated = false
    
    // Try base layer first
    for (let layer = 0; layer <= this.shellConfig.maxShells; layer++) {
      // Check if shell needs to be generated
      if (layer > 0 && !this.shells.has(layer)) {
        shellGenerated = true
      }
      
      const layerVertices = this.getLayerVertices(layer)
      
      // Check if this layer has space (use lower threshold for earlier overflow)
      const layerOccupied = new Set(
        Array.from(this.occupied)
          .filter(key => key.startsWith(`${layer}:`))
          .map(key => parseInt(key.split(':')[1]))
      )
      
      const occupancyStatus = detectFullOccupancy(
        layerOccupied,
        layerVertices.length,
        0.90 // Lower threshold to trigger overflow earlier
      )
      
      if (!occupancyStatus.isFull || layer === this.shellConfig.maxShells) {
        // Try to place in this layer
        try {
          const result = conceptToVertex(
            conceptId,
            layerVertices,
            layerOccupied,
            boundaries,
            useSpiral,
            searchRadius
          )
          
          // Mark as occupied in the pool
          this.markOccupied(layer, result.vertexIndex)
          
          return {
            layer,
            vertexIndex: result.vertexIndex,
            position: layerVertices[result.vertexIndex],
            wasCollision: result.wasCollision,
            attempts: result.attempts,
            shellGenerated
          }
        } catch {
          // This layer is full, try next layer
          continue
        }
      }
    }
    
    throw new Error(`All ${this.shellConfig.maxShells + 1} layers are full. Cannot place more concepts.`)
  }
  
  /**
   * Gets statistics about the vertex pool usage
   */
  getPoolStatistics(): {
    totalLayers: number
    totalVertices: number
    totalOccupied: number
    overallOccupancyRate: number
    layerStatistics: Array<{
      layer: number
      vertices: number
      occupied: number
      occupancyRate: number
      isShell: boolean
    }>
    shellsGenerated: number
  } {
    const layerStats = []
    let totalVertices = 0
    const totalOccupied = this.occupied.size
    
    // Base layer stats
    const baseOccupied = Array.from(this.occupied)
      .filter(key => key.startsWith('0:'))
      .length
    
    layerStats.push({
      layer: 0,
      vertices: this.baseVertices.length,
      occupied: baseOccupied,
      occupancyRate: baseOccupied / this.baseVertices.length,
      isShell: false
    })
    totalVertices += this.baseVertices.length
    
    // Shell layer stats
    for (const [layer, shell] of this.shells) {
      const shellOccupied = Array.from(this.occupied)
        .filter(key => key.startsWith(`${layer}:`))
        .length
      
      layerStats.push({
        layer,
        vertices: shell.shellVertices.length,
        occupied: shellOccupied,
        occupancyRate: shellOccupied / shell.shellVertices.length,
        isShell: true
      })
      totalVertices += shell.shellVertices.length
    }
    
    return {
      totalLayers: 1 + this.shells.size,
      totalVertices,
      totalOccupied,
      overallOccupancyRate: totalOccupied / totalVertices,
      layerStatistics: layerStats,
      shellsGenerated: this.shells.size
    }
  }
}

/**
 * Enhanced concept-to-vertex mapping with overflow shell support
 * Uses VertexPool to automatically handle shell generation when base mesh is full
 */
export function conceptToVertexWithShells(
  conceptId: string,
  vertexPool: VertexPool,
  boundaries?: RegionBoundaries,
  useSpiral: boolean = false,
  searchRadius: number = 5
): {
  layer: number
  vertexIndex: number
  position: THREE.Vector3
  wasCollision: boolean
  attempts: number
  shellGenerated: boolean
} {
  return vertexPool.findNextAvailableVertex(conceptId, boundaries, useSpiral, searchRadius)
}

/**
 * Analyzes concept mapping distribution with shell support
 * Tests overflow behavior and shell generation performance
 */
export function analyzeConceptMappingWithShells(
  conceptIds: string[],
  baseVertices: THREE.Vector3[],
  boundaries?: RegionBoundaries,
  useSpiral: boolean = false,
  searchRadius: number = 5,
  shellConfig?: Partial<ShellConfig>
): {
  totalConcepts: number
  totalCollisions: number
  collisionRate: number
  averageAttempts: number
  shellsGenerated: number
  layerDistribution: Record<number, number>
  performanceMs: number
  failedPlacements: number
  poolStatistics: ReturnType<VertexPool['getPoolStatistics']>
  overflowTriggered: boolean
} {
  const startTime = performance.now()
  
  const vertexPool = new VertexPool(baseVertices, shellConfig)
  const layerCounts: Record<number, number> = {}
  
  let totalCollisions = 0
  let totalAttempts = 0
  let failedPlacements = 0
  let overflowTriggered = false

  for (const conceptId of conceptIds) {
    try {
      const result = conceptToVertexWithShells(
        conceptId,
        vertexPool,
        boundaries,
        useSpiral,
        searchRadius
      )
      
      if (result.wasCollision) {
        totalCollisions++
      }
      totalAttempts += result.attempts
      
      if (result.layer > 0) {
        overflowTriggered = true
      }
      
      // Track layer distribution
      layerCounts[result.layer] = (layerCounts[result.layer] || 0) + 1
      
    } catch (error) {
      failedPlacements++
      console.warn(`Failed to place concept ${conceptId}: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const endTime = performance.now()
  
  // Get final statistics from the pool
  const poolStats = vertexPool.getPoolStatistics()
  const shellsGenerated = poolStats.shellsGenerated
  
  return {
    totalConcepts: conceptIds.length,
    totalCollisions,
    collisionRate: totalCollisions / conceptIds.length,
    averageAttempts: totalAttempts / conceptIds.length,
    shellsGenerated,
    layerDistribution: layerCounts,
    performanceMs: endTime - startTime,
    failedPlacements,
    poolStatistics: poolStats,
    overflowTriggered
  }
}

/**
 * Generates a comprehensive report for shell-enabled concept mapping
 */
export function generateShellDistributionReport(
  analysis: ReturnType<typeof analyzeConceptMappingWithShells>,
  baseVertices: THREE.Vector3[]
): string {
  const { 
    totalConcepts, 
    totalCollisions, 
    collisionRate, 
    averageAttempts, 
    shellsGenerated,
    layerDistribution,
    performanceMs,
    failedPlacements,
    poolStatistics,
    overflowTriggered
  } = analysis
  
  const report = [
    '=== Overflow Shell System Distribution Report ===',
    '',
    `Total Concepts: ${totalConcepts}`,
    `Base Vertices Available: ${baseVertices.length}`,
    `Total Vertices After Shells: ${poolStatistics.totalVertices}`,
    `Overall Utilization: ${(poolStatistics.overallOccupancyRate * 100).toFixed(2)}%`,
    '',
    '--- Overflow Analysis ---',
    `Overflow Triggered: ${overflowTriggered ? 'Yes' : 'No'}`,
    `Shells Generated: ${shellsGenerated}`,
    `Total Layers Used: ${poolStatistics.totalLayers}`,
    `Capacity Multiplier: ${(poolStatistics.totalVertices / baseVertices.length).toFixed(2)}x`,
    '',
    '--- Collision Analysis ---',
    `Total Collisions: ${totalCollisions}`,
    `Collision Rate: ${(collisionRate * 100).toFixed(2)}%`,
    `Average Attempts per Concept: ${averageAttempts.toFixed(2)}`,
    `Failed Placements: ${failedPlacements}`,
    '',
    '--- Layer Distribution ---'
  ]
  
  // Add layer statistics
  poolStatistics.layerStatistics.forEach(layer => {
    const conceptsInLayer = layerDistribution[layer.layer] || 0
    report.push(
      `Layer ${layer.layer} (${layer.isShell ? 'Shell' : 'Base'}): ${conceptsInLayer} concepts, ` +
      `${layer.occupied}/${layer.vertices} vertices (${(layer.occupancyRate * 100).toFixed(1)}%)`
    )
  })
  
  report.push(
    '',
    '--- Performance ---',
    `Total Mapping Time: ${performanceMs.toFixed(2)}ms`,
    `Average per Concept: ${(performanceMs / totalConcepts).toFixed(4)}ms`,
    `Throughput: ${(totalConcepts / performanceMs * 1000).toFixed(0)} concepts/second`,
    '',
    '--- Shell Configuration ---',
    'Scale Factor: 1.01 (1% expansion per shell)',
    'Jitter Amount: ±0.001 (0.1% positional variance)',
    'Max Shells: 5 layers',
    ''
  )
  
  return report.join('\n')
}