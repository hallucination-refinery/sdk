import * as THREE from 'three'
import {
  extractVerticesFromObject,
  analyzeVertexDistribution,
  calculateRegionBoundaries,
  getRegionVertices,
  validateRegionDistribution
} from './VertexMapper'

describe('VertexMapper', () => {
  function createTestVertices(count: number): THREE.Vector3[] {
    const vertices: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      vertices.push(new THREE.Vector3(
        Math.random() * 2 - 1,
        (i / count) * 2 - 1,
        Math.random() * 2 - 1
      ))
    }
    return vertices
  }

  describe('analyzeVertexDistribution', () => {
    it('should analyze vertex Y distribution correctly', () => {
      const vertices = createTestVertices(100)
      const analysis = analyzeVertexDistribution(vertices)

      expect(analysis.count).toBe(100)
      expect(analysis.yMin).toBeLessThanOrEqual(analysis.yMax)
      expect(analysis.yRange).toBeCloseTo(analysis.yMax - analysis.yMin)
      expect(analysis.yHistogram.size).toBeGreaterThan(0)
    })

    it('should handle empty vertex array', () => {
      const analysis = analyzeVertexDistribution([])
      
      expect(analysis.count).toBe(0)
      expect(analysis.yMin).toBe(0)
      expect(analysis.yMax).toBe(0)
      expect(analysis.yRange).toBe(0)
      expect(analysis.yHistogram.size).toBe(0)
    })
  })

  describe('calculateRegionBoundaries', () => {
    it('should calculate deterministic boundaries', () => {
      const vertices = createTestVertices(1000)
      
      const boundaries1 = calculateRegionBoundaries(vertices)
      const boundaries2 = calculateRegionBoundaries(vertices)
      
      expect(boundaries1).toEqual(boundaries2)
    })

    it('should create non-overlapping regions', () => {
      const vertices = createTestVertices(1000)
      const boundaries = calculateRegionBoundaries(vertices)
      
      expect(boundaries.frontal.max).toBeGreaterThanOrEqual(boundaries.frontal.min)
      expect(boundaries.frontal.min).toBeGreaterThanOrEqual(boundaries.parietal.max)
      expect(boundaries.parietal.min).toBeGreaterThanOrEqual(boundaries.temporal.max)
      expect(boundaries.temporal.min).toBeGreaterThanOrEqual(boundaries.occipital.max)
    })
  })

  describe('getRegionVertices', () => {
    it('should return correct vertices for each region', () => {
      const vertices = createTestVertices(1000)
      const boundaries = calculateRegionBoundaries(vertices)
      
      const frontal = getRegionVertices(vertices, 0, boundaries)
      const parietal = getRegionVertices(vertices, 1, boundaries)
      const temporal = getRegionVertices(vertices, 2, boundaries)
      const occipital = getRegionVertices(vertices, 3, boundaries)
      
      const total = frontal.length + parietal.length + temporal.length + occipital.length
      expect(total).toBeLessThanOrEqual(vertices.length)
      
      const allIndices = [...frontal, ...parietal, ...temporal, ...occipital]
      const uniqueIndices = new Set(allIndices)
      expect(uniqueIndices.size).toBe(allIndices.length)
    })

    it('should throw error for invalid region index', () => {
      const vertices = createTestVertices(100)
      
      expect(() => getRegionVertices(vertices, -1)).toThrow('Invalid region index')
      expect(() => getRegionVertices(vertices, 4)).toThrow('Invalid region index')
    })
  })

  describe('validateRegionDistribution', () => {
    it('should validate distribution within tolerance', () => {
      const vertices: THREE.Vector3[] = []
      
      // Create vertices with Y values distributed to match target percentages
      // Total: 1000 vertices
      // Frontal (30%): 300 vertices at top
      for (let i = 0; i < 300; i++) {
        vertices.push(new THREE.Vector3(0, 1.0 - (i / 300) * 0.3, 0))
      }
      // Parietal (25%): 250 vertices
      for (let i = 0; i < 250; i++) {
        vertices.push(new THREE.Vector3(0, 0.7 - (i / 250) * 0.25, 0))
      }
      // Temporal (25%): 250 vertices  
      for (let i = 0; i < 250; i++) {
        vertices.push(new THREE.Vector3(0, 0.45 - (i / 250) * 0.25, 0))
      }
      // Occipital (20%): 200 vertices at bottom
      for (let i = 0; i < 200; i++) {
        vertices.push(new THREE.Vector3(0, 0.2 - (i / 200) * 0.2, 0))
      }
      
      const boundaries = calculateRegionBoundaries(vertices)
      const validation = validateRegionDistribution(vertices, boundaries)
      
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect invalid distribution', () => {
      const vertices: THREE.Vector3[] = []
      
      for (let i = 0; i < 500; i++) {
        vertices.push(new THREE.Vector3(0, 0.8, 0))
      }
      for (let i = 0; i < 500; i++) {
        vertices.push(new THREE.Vector3(0, -0.8, 0))
      }
      
      const boundaries = calculateRegionBoundaries(vertices)
      const validation = validateRegionDistribution(vertices, boundaries, 0.05)
      
      expect(validation.valid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })
  })

  describe('deterministic behavior', () => {
    it('should produce identical results across multiple runs', () => {
      const seed = 12345
      const random = (s: number) => {
        const x = Math.sin(s) * 10000
        return x - Math.floor(x)
      }
      
      const createSeededVertices = () => {
        const verts: THREE.Vector3[] = []
        for (let i = 0; i < 1000; i++) {
          verts.push(new THREE.Vector3(
            random(seed + i * 3),
            random(seed + i * 3 + 1) * 2 - 1,
            random(seed + i * 3 + 2)
          ))
        }
        return verts
      }
      
      const vertices1 = createSeededVertices()
      const vertices2 = createSeededVertices()
      
      const boundaries1 = calculateRegionBoundaries(vertices1)
      const boundaries2 = calculateRegionBoundaries(vertices2)
      
      expect(boundaries1).toEqual(boundaries2)
      
      for (let region = 0; region < 4; region++) {
        const indices1 = getRegionVertices(vertices1, region, boundaries1)
        const indices2 = getRegionVertices(vertices2, region, boundaries2)
        expect(indices1).toEqual(indices2)
      }
    })
  })
})