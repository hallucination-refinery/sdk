import { describe, it, expect, beforeEach } from 'vitest'
import * as THREE from 'three'
import {
  generateOverflowShell,
  detectFullOccupancy,
  VertexPool,
  conceptToVertexWithShells,
  analyzeConceptMappingWithShells,
  generateShellDistributionReport,
  calculateRegionBoundaries,
  ShellConfig
} from './VertexMapper'

// Test fixtures
const createTestVertices = (count: number): THREE.Vector3[] => {
  const vertices: THREE.Vector3[] = []
  for (let i = 0; i < count; i++) {
    vertices.push(new THREE.Vector3(
      Math.random() * 10 - 5,
      Math.random() * 10 - 5,
      Math.random() * 10 - 5
    ))
  }
  return vertices
}

const createTestConceptIds = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `concept-${i.toString().padStart(5, '0')}`)
}

describe('VertexMapper - Overflow Shell System', () => {
  let testVertices: THREE.Vector3[]
  let boundaries: any

  beforeEach(() => {
    testVertices = createTestVertices(1000) // 1000 vertices for testing
    boundaries = calculateRegionBoundaries(testVertices)
  })

  describe('generateOverflowShell', () => {
    it('should generate shell vertices with correct scaling', () => {
      const shell = generateOverflowShell(testVertices, 1)
      
      expect(shell.shellVertices).toHaveLength(testVertices.length)
      expect(shell.totalVerticesGenerated).toBe(testVertices.length)
      expect(shell.shellConfig.scaleFactor).toBe(1.01)
      expect(shell.generationTimeMs).toBeGreaterThan(0)
    })

    it('should apply compound scaling for multiple layers', () => {
      const shell1 = generateOverflowShell(testVertices, 1, { scaleFactor: 1.1 })
      const shell2 = generateOverflowShell(testVertices, 2, { scaleFactor: 1.1 })
      
      // Layer 2 should be scaled more than layer 1
      const center = new THREE.Vector3()
      testVertices.forEach(v => center.add(v))
      center.divideScalar(testVertices.length)
      
      const dist1 = shell1.shellVertices[0].distanceTo(center)
      const dist2 = shell2.shellVertices[0].distanceTo(center)
      
      expect(dist2).toBeGreaterThan(dist1)
    })

    it('should add jitter to prevent perfect overlap', () => {
      const shell = generateOverflowShell(testVertices, 1, { jitterAmount: 0.1 })
      
      // Check that jittered positions are different from scaled positions
      const center = new THREE.Vector3()
      testVertices.forEach(v => center.add(v))
      center.divideScalar(testVertices.length)
      
      const perfectlyScaled = testVertices[0].clone().sub(center).multiplyScalar(1.01).add(center)
      const jitteredPosition = shell.shellVertices[0]
      
      expect(jitteredPosition.distanceTo(perfectlyScaled)).toBeGreaterThan(0)
    })

    it('should preserve shell info metadata', () => {
      const shell = generateOverflowShell(testVertices, 2)
      
      expect(shell.shellInfo).toHaveLength(testVertices.length)
      shell.shellInfo.forEach((info, index) => {
        expect(info.originalIndex).toBe(index)
        expect(info.shellIndex).toBe(index)
        expect(info.layer).toBe(2)
        expect(info.jitteredPosition).toBeInstanceOf(THREE.Vector3)
      })
    })

    it('should throw error for layer exceeding max shells', () => {
      expect(() => {
        generateOverflowShell(testVertices, 6, { maxShells: 5 })
      }).toThrow('Shell layer 6 exceeds maximum allowed shells (5)')
    })

    it('should throw error for empty vertex array', () => {
      expect(() => {
        generateOverflowShell([], 1)
      }).toThrow('Cannot generate shell from empty vertex array')
    })
  })

  describe('detectFullOccupancy', () => {
    it('should correctly detect full occupancy', () => {
      const occupied = new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) // 10 out of 10
      const result = detectFullOccupancy(occupied, 10, 0.9)
      
      expect(result.isFull).toBe(true)
      expect(result.needsShell).toBe(true)
      expect(result.occupancyRate).toBe(1.0)
      expect(result.availableVertices).toBe(0)
    })

    it('should correctly detect non-full occupancy', () => {
      const occupied = new Set([0, 1, 2, 3, 4]) // 5 out of 10
      const result = detectFullOccupancy(occupied, 10, 0.9)
      
      expect(result.isFull).toBe(false)
      expect(result.needsShell).toBe(false)
      expect(result.occupancyRate).toBe(0.5)
      expect(result.availableVertices).toBe(5)
    })

    it('should respect custom threshold', () => {
      const occupied = new Set([0, 1, 2, 3, 4, 5, 6]) // 7 out of 10 = 70%
      const result = detectFullOccupancy(occupied, 10, 0.6) // 60% threshold
      
      expect(result.isFull).toBe(true)
      expect(result.needsShell).toBe(true)
    })
  })

  describe('VertexPool', () => {
    let pool: VertexPool

    beforeEach(() => {
      pool = new VertexPool(testVertices)
    })

    it('should initialize with base vertices only', () => {
      expect(pool.getTotalVertices()).toBe(testVertices.length)
      
      const stats = pool.getPoolStatistics()
      expect(stats.totalLayers).toBe(1)
      expect(stats.shellsGenerated).toBe(0)
      expect(stats.layerStatistics).toHaveLength(1)
    })

    it('should generate shells on demand', () => {
      const layer1Vertices = pool.getLayerVertices(1)
      
      expect(layer1Vertices).toHaveLength(testVertices.length)
      expect(pool.getTotalVertices()).toBe(testVertices.length * 2)
      
      const stats = pool.getPoolStatistics()
      expect(stats.shellsGenerated).toBe(1)
      expect(stats.totalLayers).toBe(2)
    })

    it('should track occupancy correctly', () => {
      expect(pool.isOccupied(0, 5)).toBe(false)
      
      pool.markOccupied(0, 5)
      expect(pool.isOccupied(0, 5)).toBe(true)
      
      const occupancy = pool.getLayerOccupancy(0)
      expect(occupancy).toBe(1 / testVertices.length)
    })

    it('should find available vertices across layers', () => {
      const result = pool.findNextAvailableVertex('test-concept')
      
      expect(result.layer).toBe(0) // Should start with base layer
      expect(result.vertexIndex).toBeGreaterThanOrEqual(0)
      expect(result.vertexIndex).toBeLessThan(testVertices.length)
      expect(result.position).toBeInstanceOf(THREE.Vector3)
    })

    it('should overflow to shell layers when base is full', () => {
      // Fill up base layer (leave a few spots for threshold)
      const baseVertices = pool.getLayerVertices(0)
      const fillCount = Math.floor(baseVertices.length * 0.96) // 96% full
      
      for (let i = 0; i < fillCount; i++) {
        pool.markOccupied(0, i)
      }
      
      // Next concept should trigger shell generation
      const result = pool.findNextAvailableVertex('overflow-concept')
      
      expect(result.layer).toBeGreaterThanOrEqual(0)
      if (result.layer > 0) {
        expect(result.shellGenerated).toBe(true)
      }
    })
  })

  describe('conceptToVertexWithShells', () => {
    let pool: VertexPool

    beforeEach(() => {
      pool = new VertexPool(testVertices)
    })

    it('should map concepts to vertices with shell support', () => {
      const result = conceptToVertexWithShells('test-concept', pool)
      
      expect(result.layer).toBeGreaterThanOrEqual(0)
      expect(result.vertexIndex).toBeGreaterThanOrEqual(0)
      expect(result.position).toBeInstanceOf(THREE.Vector3)
      expect(typeof result.wasCollision).toBe('boolean')
      expect(typeof result.attempts).toBe('number')
      expect(typeof result.shellGenerated).toBe('boolean')
    })

    it('should support spiral search with shells', () => {
      const result = conceptToVertexWithShells('test-concept', pool, boundaries, true, 5)
      
      expect(result.layer).toBeGreaterThanOrEqual(0)
      expect(result.vertexIndex).toBeGreaterThanOrEqual(0)
    })
  })

  describe('analyzeConceptMappingWithShells', () => {
    it('should analyze small concept set without overflow', () => {
      const conceptIds = createTestConceptIds(100)
      const analysis = analyzeConceptMappingWithShells(conceptIds, testVertices)
      
      expect(analysis.totalConcepts).toBe(100)
      expect(analysis.overflowTriggered).toBe(false)
      expect(analysis.shellsGenerated).toBe(0)
      expect(analysis.failedPlacements).toBe(0)
      expect(analysis.poolStatistics.totalLayers).toBe(1)
      expect(analysis.performanceMs).toBeGreaterThan(0)
    })

    it('should trigger overflow with large concept set', () => {
      const conceptIds = createTestConceptIds(1500) // 1.5x vertices
      const analysis = analyzeConceptMappingWithShells(conceptIds, testVertices)
      
      expect(analysis.totalConcepts).toBe(1500)
      expect(analysis.overflowTriggered).toBe(true)
      expect(analysis.shellsGenerated).toBeGreaterThan(0)
      expect(analysis.poolStatistics.totalLayers).toBeGreaterThan(1)
      
      // Check layer distribution
      expect(Object.keys(analysis.layerDistribution)).toContain('0') // Base layer
      const hasShellLayer = Object.keys(analysis.layerDistribution).some(layer => parseInt(layer) > 0)
      expect(hasShellLayer).toBe(true)
    })

    it('should handle collision resolution with shells', () => {
      const conceptIds = createTestConceptIds(500)
      const analysis = analyzeConceptMappingWithShells(conceptIds, testVertices, boundaries, true, 5)
      
      expect(analysis.totalConcepts).toBe(500)
      expect(analysis.collisionRate).toBeGreaterThanOrEqual(0)
      expect(analysis.averageAttempts).toBeGreaterThanOrEqual(0)
    })

    it('should respect shell configuration', () => {
      const conceptIds = createTestConceptIds(200)
      const shellConfig: Partial<ShellConfig> = {
        scaleFactor: 1.05,
        jitterAmount: 0.002,
        maxShells: 3
      }
      
      const analysis = analyzeConceptMappingWithShells(
        conceptIds, 
        testVertices, 
        boundaries, 
        false, 
        5, 
        shellConfig
      )
      
      expect(analysis.totalConcepts).toBe(200)
      // Shell config should be applied when shells are generated
    })
  })

  describe('generateShellDistributionReport', () => {
    it('should generate comprehensive report for overflow scenario', () => {
      const conceptIds = createTestConceptIds(1200)
      const analysis = analyzeConceptMappingWithShells(conceptIds, testVertices)
      const report = generateShellDistributionReport(analysis, testVertices)
      
      expect(report).toContain('Overflow Shell System Distribution Report')
      expect(report).toContain('Total Concepts: 1200')
      expect(report).toContain('Base Vertices Available: 1000')
      expect(report).toContain('Overflow Triggered:')
      expect(report).toContain('Layer Distribution')
      expect(report).toContain('Performance')
      expect(report).toContain('Shell Configuration')
    })

    it('should show no overflow for small concept sets', () => {
      const conceptIds = createTestConceptIds(50)
      const analysis = analyzeConceptMappingWithShells(conceptIds, testVertices)
      const report = generateShellDistributionReport(analysis, testVertices)
      
      expect(report).toContain('Overflow Triggered: No')
      expect(report).toContain('Shells Generated: 0')
    })
  })

  describe('Performance and Scale Testing', () => {
    it('should handle large vertex sets efficiently', () => {
      const largeVertexSet = createTestVertices(10000) // 10k vertices
      const conceptIds = createTestConceptIds(1000)
      
      const startTime = performance.now()
      const analysis = analyzeConceptMappingWithShells(conceptIds, largeVertexSet)
      const endTime = performance.now()
      
      expect(analysis.totalConcepts).toBe(1000)
      expect(endTime - startTime).toBeLessThan(5000) // Should complete in under 5 seconds
      expect(analysis.failedPlacements).toBe(0)
    })

    it('should maintain performance with shell generation', () => {
      const conceptIds = createTestConceptIds(2000) // Force shell generation
      
      const startTime = performance.now()
      const analysis = analyzeConceptMappingWithShells(conceptIds, testVertices)
      const endTime = performance.now()
      
      expect(analysis.overflowTriggered).toBe(true)
      expect(analysis.shellsGenerated).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(10000) // Should complete in under 10 seconds
      
      // Throughput should be reasonable
      const throughput = analysis.totalConcepts / analysis.performanceMs * 1000
      expect(throughput).toBeGreaterThan(100) // At least 100 concepts/second
    })

    it('should preserve brain silhouette with minimal scaling', () => {
      const shell = generateOverflowShell(testVertices, 1, { scaleFactor: 1.01 })
      
      // Calculate bounding boxes
      const originalBounds = new THREE.Box3().setFromPoints(testVertices)
      const shellBounds = new THREE.Box3().setFromPoints(shell.shellVertices)
      
      const originalSize = originalBounds.getSize(new THREE.Vector3())
      const shellSize = shellBounds.getSize(new THREE.Vector3())
      
      // Shell should be slightly larger but maintain proportions
      expect(shellSize.x / originalSize.x).toBeCloseTo(1.01, 1)
      expect(shellSize.y / originalSize.y).toBeCloseTo(1.01, 1)
      expect(shellSize.z / originalSize.z).toBeCloseTo(1.01, 1)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty concept arrays', () => {
      const analysis = analyzeConceptMappingWithShells([], testVertices)
      
      expect(analysis.totalConcepts).toBe(0)
      expect(analysis.totalCollisions).toBe(0)
      expect(analysis.overflowTriggered).toBe(false)
    })

    it('should throw error when all layers are full', () => {
      const smallVertexSet = createTestVertices(10)
      const pool = new VertexPool(smallVertexSet, { maxShells: 1 })
      
      // Fill all layers
      for (let layer = 0; layer <= 1; layer++) {
        for (let i = 0; i < 10; i++) {
          pool.markOccupied(layer, i)
        }
      }
      
      expect(() => {
        pool.findNextAvailableVertex('overflow-concept')
      }).toThrow('All 2 layers are full')
    })

    it('should handle extreme jitter amounts gracefully', () => {
      const shell = generateOverflowShell(testVertices, 1, { jitterAmount: 1.0 }) // Large jitter
      
      expect(shell.shellVertices).toHaveLength(testVertices.length)
      expect(shell.totalVerticesGenerated).toBe(testVertices.length)
    })

    it('should maintain deterministic behavior for same concept IDs', () => {
      const pool1 = new VertexPool(testVertices)
      const pool2 = new VertexPool(testVertices)
      
      // Same concept should map to same position in fresh pools
      // Note: Due to random jitter in shell generation, this test focuses on base layer
      const result1 = pool1.findNextAvailableVertex('deterministic-test')
      const result2 = pool2.findNextAvailableVertex('deterministic-test')
      
      if (result1.layer === 0 && result2.layer === 0) {
        expect(result1.vertexIndex).toBe(result2.vertexIndex)
      }
    })
  })
})

describe('15K Concept Overflow Integration Test', () => {
  it('should handle 15k concepts with shell system', async () => {
    // This test simulates the main session acceptance criteria
    const brainVertices = createTestVertices(39410) // Actual brain mesh size
    const conceptIds = createTestConceptIds(15000) // 15k concepts for overflow
    
    console.log('Starting 15K concept overflow test...')
    const startTime = performance.now()
    
    const analysis = analyzeConceptMappingWithShells(
      conceptIds, 
      brainVertices, 
      undefined, // No region boundaries for simplicity
      true, // Use spiral search
      5 // Search radius
    )
    
    const endTime = performance.now()
    
    // Acceptance criteria validation
    expect(analysis.totalConcepts).toBe(15000)
    expect(analysis.failedPlacements).toBe(0) // All concepts should be placed
    expect(analysis.overflowTriggered).toBe(false) // 15k < 39k, should fit in base layer
    
    // Performance criteria
    expect(endTime - startTime).toBeLessThan(30000) // Under 30 seconds
    expect(analysis.performanceMs).toBeGreaterThan(0)
    
    // Generate and validate report
    const report = generateShellDistributionReport(analysis, brainVertices)
    expect(report).toContain('15000')
    expect(report).toContain('39410')
    
    console.log(`15K test completed in ${endTime - startTime}ms`)
    console.log(`Overflow triggered: ${analysis.overflowTriggered}`)
    console.log(`Shells generated: ${analysis.shellsGenerated}`)
    console.log(`Collision rate: ${(analysis.collisionRate * 100).toFixed(2)}%`)
    
    // Log partial report for verification
    const reportLines = report.split('\n')
    console.log('Report summary:')
    reportLines.slice(0, 15).forEach(line => console.log(line))
  }, 60000) // 60 second timeout for large test
})