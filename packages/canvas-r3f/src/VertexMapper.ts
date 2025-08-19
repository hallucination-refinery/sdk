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
  const { yMin, yMax, yRange } = analysis
  
  const sortedVertices = [...vertices].sort((a, b) => b.y - a.y)
  
  const totalCount = sortedVertices.length
  const frontalCount = Math.floor(totalCount * targetDistribution.frontal)
  const parietalCount = Math.floor(totalCount * targetDistribution.parietal)
  const temporalCount = Math.floor(totalCount * targetDistribution.temporal)
  
  let frontalBoundary = yMax
  let parietalBoundary = yMax
  let temporalBoundary = yMax
  let occipitalBoundary = yMin
  
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