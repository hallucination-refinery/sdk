import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import {
  analyzeConceptMappingWithShells,
  generateShellDistributionReport,
  calculateRegionBoundaries,
  VertexPool
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

describe('VertexMapper - Performance Testing', () => {
  it('should handle 10k concepts efficiently', () => {
    const brainVertices = createTestVertices(39410) // Actual brain size
    const conceptIds = createTestConceptIds(10000) // 10k concepts
    
    console.log('Starting 10K concept performance test...')
    const startTime = performance.now()
    
    const analysis = analyzeConceptMappingWithShells(
      conceptIds, 
      brainVertices, 
      undefined, 
      false, // No spiral search for speed
      5
    )
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Performance expectations
    expect(analysis.totalConcepts).toBe(10000)
    expect(analysis.failedPlacements).toBe(0)
    expect(duration).toBeLessThan(15000) // 15 seconds max
    
    // Should not need overflow for 10k on 39k vertices
    expect(analysis.overflowTriggered).toBe(false)
    
    console.log(`10K test completed in ${duration}ms`)
    console.log(`Throughput: ${(analysis.totalConcepts / analysis.performanceMs * 1000).toFixed(0)} concepts/second`)
  }, 30000)

  it('should handle overflow scenario with good performance', () => {
    const smallVertexSet = createTestVertices(1000) // Small vertex set to force overflow
    const conceptIds = createTestConceptIds(2500) // 2.5x overflow
    
    console.log('Starting overflow performance test...')
    const startTime = performance.now()
    
    const analysis = analyzeConceptMappingWithShells(
      conceptIds, 
      smallVertexSet, 
      undefined, 
      false, // No spiral search for speed
      5
    )
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    // Should successfully handle overflow
    expect(analysis.totalConcepts).toBe(2500)
    expect(analysis.failedPlacements).toBe(0)
    expect(analysis.overflowTriggered).toBe(true)
    expect(analysis.shellsGenerated).toBeGreaterThan(0)
    expect(duration).toBeLessThan(5000) // 5 seconds max for overflow
    
    console.log(`Overflow test completed in ${duration}ms`)
    console.log(`Shells generated: ${analysis.shellsGenerated}`)
    console.log(`Layers used: ${analysis.poolStatistics.totalLayers}`)
  }, 15000)

  it('should scale shell generation efficiently', () => {
    const vertices = createTestVertices(1000)
    const pool = new VertexPool(vertices)
    
    // Test shell generation time
    const startTime = performance.now()
    
    // Generate 3 shells
    for (let i = 1; i <= 3; i++) {
      pool.getLayerVertices(i)
    }
    
    const endTime = performance.now()
    const duration = endTime - startTime
    
    const stats = pool.getPoolStatistics()
    expect(stats.shellsGenerated).toBe(3)
    expect(stats.totalLayers).toBe(4) // Base + 3 shells
    expect(duration).toBeLessThan(1000) // Shell generation should be fast
    
    console.log(`Shell generation (3 shells) completed in ${duration}ms`)
  })

  it('should maintain brain silhouette with minimal distortion', () => {
    const vertices = createTestVertices(1000)
    const pool = new VertexPool(vertices, { scaleFactor: 1.01, jitterAmount: 0.001 })
    
    // Get original bounds
    const originalBounds = new THREE.Box3().setFromPoints(vertices)
    const originalSize = originalBounds.getSize(new THREE.Vector3())
    
    // Generate first shell
    const shell1Vertices = pool.getLayerVertices(1)
    const shell1Bounds = new THREE.Box3().setFromPoints(shell1Vertices)
    const shell1Size = shell1Bounds.getSize(new THREE.Vector3())
    
    // Generate second shell
    const shell2Vertices = pool.getLayerVertices(2)
    const shell2Bounds = new THREE.Box3().setFromPoints(shell2Vertices)
    const shell2Size = shell2Bounds.getSize(new THREE.Vector3())
    
    // Verify silhouette preservation
    const shell1Scale = shell1Size.length() / originalSize.length()
    const shell2Scale = shell2Size.length() / originalSize.length()
    
    expect(shell1Scale).toBeCloseTo(1.01, 2) // 1% larger
    expect(shell2Scale).toBeCloseTo(1.0201, 2) // ~2% larger (1.01^2)
    
    console.log(`Original size: ${originalSize.length().toFixed(3)}`)
    console.log(`Shell 1 size: ${shell1Size.length().toFixed(3)} (${shell1Scale.toFixed(3)}x)`)
    console.log(`Shell 2 size: ${shell2Size.length().toFixed(3)} (${shell2Scale.toFixed(3)}x)`)
  })
})