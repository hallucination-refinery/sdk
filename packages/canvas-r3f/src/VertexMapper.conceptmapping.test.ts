import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import {
  djb2Hash,
  conceptToVertex,
  analyzeConceptMapping,
  generateDistributionReport,
  calculateRegionBoundaries,
  type RegionBoundaries
} from './VertexMapper'

describe('Concept Mapping Algorithm (Session 4)', () => {
  let vertices: THREE.Vector3[]
  let boundaries: RegionBoundaries

  beforeEach(() => {
    // Create a realistic set of 1000 vertices for testing
    vertices = []
    for (let i = 0; i < 1000; i++) {
      // Create vertices distributed in Y from -50 to +50 (brain-like)
      const y = -50 + (i / 1000) * 100
      vertices.push(new THREE.Vector3(
        Math.random() * 20 - 10, // X: -10 to 10
        y,
        Math.random() * 20 - 10  // Z: -10 to 10
      ))
    }
    
    boundaries = calculateRegionBoundaries(vertices)
  })

  describe('djb2Hash function', () => {
    it('produces consistent hashes for same input', () => {
      const conceptId = 'test_concept_123'
      const hash1 = djb2Hash(conceptId)
      const hash2 = djb2Hash(conceptId)
      
      expect(hash1).toBe(hash2)
      expect(typeof hash1).toBe('number')
    })

    it('produces different hashes for different inputs', () => {
      const hash1 = djb2Hash('concept_1')
      const hash2 = djb2Hash('concept_2')
      const hash3 = djb2Hash('concept_3')
      
      expect(hash1).not.toBe(hash2)
      expect(hash2).not.toBe(hash3)
      expect(hash1).not.toBe(hash3)
    })

    it('handles edge cases correctly', () => {
      expect(djb2Hash('')).toBe(5381) // Initial hash value
      expect(djb2Hash('a')).not.toBe(5381)
      expect(djb2Hash('A')).not.toBe(djb2Hash('a')) // Case sensitive
    })
  })

  describe('conceptToVertex mapping', () => {
    it('maps concepts to valid vertex indices', () => {
      const occupied = new Set<number>()
      const result = conceptToVertex('concept_1', vertices, occupied)
      
      expect(result.vertexIndex).toBeGreaterThanOrEqual(0)
      expect(result.vertexIndex).toBeLessThan(vertices.length)
      expect(result.wasCollision).toBe(false)
      expect(result.attempts).toBe(0)
      expect(occupied.has(result.vertexIndex)).toBe(true)
    })

    it('handles collisions with linear probing', () => {
      const occupied = new Set<number>()
      
      // Map first concept
      const result1 = conceptToVertex('concept_1', vertices, occupied)
      expect(result1.wasCollision).toBe(false)
      
      // Force a collision by pre-occupying the expected index
      const hash2 = djb2Hash('concept_2')
      const expectedIndex2 = Math.abs(hash2) % vertices.length
      occupied.add(expectedIndex2)
      
      const result2 = conceptToVertex('concept_2', vertices, occupied)
      expect(result2.vertexIndex).not.toBe(expectedIndex2)
      expect(result2.wasCollision).toBe(true)
      expect(result2.attempts).toBeGreaterThan(0)
    })

    it('uses region-based mapping when boundaries provided', () => {
      const occupied = new Set<number>()
      const result = conceptToVertex('concept_region_test', vertices, occupied, boundaries)
      
      expect(result.vertexIndex).toBeGreaterThanOrEqual(0)
      expect(result.vertexIndex).toBeLessThan(vertices.length)
      expect(occupied.has(result.vertexIndex)).toBe(true)
    })

    it('throws error for empty vertex array', () => {
      const occupied = new Set<number>()
      
      expect(() => {
        conceptToVertex('concept_1', [], occupied)
      }).toThrow('Cannot map concept to empty vertex array')
    })

    it('throws error when all vertices occupied', () => {
      const smallVertices = [new THREE.Vector3(0, 0, 0)]
      const occupied = new Set([0]) // Pre-occupy the only vertex
      
      expect(() => {
        conceptToVertex('concept_1', smallVertices, occupied)
      }).toThrow('All 1 vertices are occupied')
    })
  })

  describe('Session 4 Acceptance Criteria: 100 Concepts Test', () => {
    it('maps actual fixture concepts to brain vertices', async () => {
      // Load actual fixture data
      const fixtureData = await import('../fixtures/concepts-100.json')
      const conceptIds = fixtureData.concepts.map((concept: any) => concept.id)
      
      expect(conceptIds).toHaveLength(100)
      
      // Create realistic brain vertex count
      const brainVertices: THREE.Vector3[] = []
      for (let i = 0; i < 39410; i++) {
        const y = -100 + (i / 39410) * 200
        brainVertices.push(new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          y,
          (Math.random() - 0.5) * 100
        ))
      }
      
      const boundaries = calculateRegionBoundaries(brainVertices)
      const analysis = analyzeConceptMapping(conceptIds, brainVertices, boundaries)
      
      // Session 4 acceptance criteria with real data
      expect(analysis.totalConcepts).toBe(100)
      expect(analysis.totalCollisions).toBe(0) // No collisions expected
      expect(analysis.collisionRate).toBe(0)
      expect(analysis.performanceMs).toBeLessThan(200) // Region-based mapping with 39k vertices
      
      // Verify reasonable region distribution
      const totalRegionConcepts = Object.values(analysis.regionDistribution).reduce((sum, count) => sum + count, 0)
      expect(totalRegionConcepts).toBe(100)
      
      console.log('=== Real Fixture Data Results ===')
      console.log(generateDistributionReport(analysis, brainVertices))
    })

    it('maps 100 concepts without collisions in 39,410 vertex space', () => {
      // Create large vertex array simulating actual brain mesh
      const largeVertices: THREE.Vector3[] = []
      for (let i = 0; i < 39410; i++) {
        const y = -100 + (i / 39410) * 200 // Distributed Y from -100 to 100
        largeVertices.push(new THREE.Vector3(
          (Math.random() - 0.5) * 100,
          y,
          (Math.random() - 0.5) * 100
        ))
      }
      
      // Generate 100 concept IDs
      const conceptIds = Array.from({ length: 100 }, (_, i) => `concept_${i.toString().padStart(3, '0')}`)
      
      const analysis = analyzeConceptMapping(conceptIds, largeVertices)
      
      // Session 4 acceptance criteria
      expect(analysis.totalConcepts).toBe(100)
      expect(analysis.totalCollisions).toBe(0) // No collisions expected with 39k vertices
      expect(analysis.collisionRate).toBe(0)
      expect(analysis.performanceMs).toBeLessThan(100) // Should be very fast
      
      console.log('=== Session 4 Results: 100 Concepts on 39,410 Vertices ===')
      console.log(generateDistributionReport(analysis, largeVertices))
    })

    it('demonstrates collision behavior with denser mapping', () => {
      // Test with only 150 vertices for 100 concepts (higher density)
      const denseVertices = vertices.slice(0, 150)
      const conceptIds = Array.from({ length: 100 }, (_, i) => `dense_concept_${i}`)
      
      const analysis = analyzeConceptMapping(conceptIds, denseVertices)
      
      expect(analysis.totalConcepts).toBe(100)
      expect(analysis.collisionRate).toBeGreaterThan(0) // Expect some collisions
      expect(analysis.averageAttempts).toBeGreaterThan(0) // Some retry attempts expected
      
      console.log('=== Dense Mapping Results: 100 Concepts on 150 Vertices ===')
      console.log(generateDistributionReport(analysis, denseVertices))
    })
  })

  describe('Performance profiling', () => {
    it('profiles mapping performance for different concept counts', () => {
      const testSizes = [10, 50, 100, 500]
      const results: { size: number; throughput: number; avgTime: number }[] = []
      
      for (const size of testSizes) {
        const conceptIds = Array.from({ length: size }, (_, i) => `perf_concept_${i}`)
        const analysis = analyzeConceptMapping(conceptIds, vertices)
        
        const throughput = (size / analysis.performanceMs) * 1000 // concepts/second
        const avgTime = analysis.performanceMs / size
        
        results.push({ size, throughput, avgTime })
        
        // Each concept should map in well under 1ms
        expect(avgTime).toBeLessThan(1)
      }
      
      console.log('=== Performance Profiling Results ===')
      results.forEach(result => {
        console.log(`${result.size} concepts: ${result.throughput.toFixed(0)} concepts/sec, ${result.avgTime.toFixed(4)}ms avg`)
      })
    })
  })

  describe('Distribution analysis', () => {
    it('analyzes region distribution with boundaries', () => {
      const conceptIds = Array.from({ length: 100 }, (_, i) => `region_concept_${i}`)
      const analysis = analyzeConceptMapping(conceptIds, vertices, boundaries)
      
      // Should have concepts in all 4 regions
      const totalMapped = Object.values(analysis.regionDistribution).reduce((sum, count) => sum + count, 0)
      expect(totalMapped).toBe(100)
      
      // Each region should have some concepts (though distribution may vary)
      expect(Object.keys(analysis.regionDistribution)).toHaveLength(4)
      
      console.log('=== Region Distribution Analysis ===')
      console.log(generateDistributionReport(analysis, vertices))
    })
  })

  describe('generateDistributionReport', () => {
    it('creates comprehensive distribution report', () => {
      const conceptIds = ['concept_1', 'concept_2', 'concept_3']
      const analysis = analyzeConceptMapping(conceptIds, vertices, boundaries)
      const report = generateDistributionReport(analysis, vertices)
      
      expect(report).toContain('Concept Mapping Distribution Report')
      expect(report).toContain('Total Concepts: 3')
      expect(report).toContain('Collision Rate:')
      expect(report).toContain('Region Distribution')
      expect(report).toContain('Performance')
      expect(report).toContain('Throughput:')
    })
  })

  describe('Deterministic behavior', () => {
    it('produces identical results across multiple runs', () => {
      const conceptIds = ['concept_alpha', 'concept_beta', 'concept_gamma']
      
      const analysis1 = analyzeConceptMapping(conceptIds, vertices, boundaries)
      const analysis2 = analyzeConceptMapping(conceptIds, vertices, boundaries)
      
      // Should be identical (deterministic)
      expect(analysis1.totalCollisions).toBe(analysis2.totalCollisions)
      expect(analysis1.collisionRate).toBe(analysis2.collisionRate)
      expect(analysis1.regionDistribution).toEqual(analysis2.regionDistribution)
    })
  })
})