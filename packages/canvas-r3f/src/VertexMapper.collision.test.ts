import { describe, test, expect } from 'vitest'
import * as THREE from 'three'
import {
  analyzeConceptMapping,
  generateDistributionReport,
  conceptToVertex,
  calculateRegionBoundaries,
  spiralSearch,
  spiralSearchInRegion,
  getRegionVertices
} from './VertexMapper'

// Mock vertices for testing (simplified brain-like structure)
function createTestVertices(count: number): THREE.Vector3[] {
  const vertices: THREE.Vector3[] = []
  
  // Create vertices distributed in a brain-like pattern
  // Higher Y values = frontal, lower Y = occipital
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(-1 + (2 * i) / count)
    const theta = Math.sqrt(count * Math.PI) * phi
    
    const x = Math.cos(theta) * Math.sin(phi) * 50
    const y = Math.sin(theta) * Math.sin(phi) * 50 + 25 // Shift up for brain-like Y distribution
    const z = Math.cos(phi) * 50
    
    vertices.push(new THREE.Vector3(x, y, z))
  }
  
  return vertices
}

// Load test concepts from fixture
async function loadTestConcepts(count: number): Promise<string[]> {
  const fs = await import('fs')
  const path = await import('path')
  
  try {
    const fixturePath = path.join(__dirname, '../fixtures/concepts-200.json')
    const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf-8'))
    return fixtureData.concepts.slice(0, count).map((c: any) => c.id)
  } catch (error) {
    // Fallback to generated concept IDs if fixture not available
    console.warn('Using fallback concept IDs for testing')
    return Array.from({ length: count }, (_, i) => `concept_${(i + 1).toString().padStart(3, '0')}`)
  }
}

describe('Session 5: Collision Resolution with Spiral Search', () => {
  
  test('spiral search finds nearest unoccupied vertex', () => {
    const vertices = createTestVertices(100)
    const occupied = new Set([10, 11, 12, 13, 14]) // Occupy some vertices around target
    const targetIndex = 10
    
    const result = spiralSearch(targetIndex, vertices, occupied, 5)
    
    expect(result.vertexIndex).not.toBe(targetIndex)
    expect(occupied.has(result.vertexIndex)).toBe(false)
    expect(result.attempts).toBeGreaterThan(0)
  })
  
  test('spiral search in region respects region boundaries', () => {
    const vertices = createTestVertices(1000)
    const boundaries = calculateRegionBoundaries(vertices)
    const regionIndex = 0 // frontal region
    const regionVertices = getRegionVertices(vertices, regionIndex, boundaries)
    const occupied = new Set<number>()
    
    // Occupy the first few vertices in the region
    for (let i = 0; i < 5; i++) {
      occupied.add(regionVertices[i])
    }
    
    const targetIndex = regionVertices[0]
    const result = spiralSearchInRegion(targetIndex, vertices, regionVertices, occupied, 10)
    
    expect(regionVertices.includes(result.vertexIndex)).toBe(true)
    expect(occupied.has(result.vertexIndex)).toBe(false)
  })
  
  test('conceptToVertex with spiral search enabled', () => {
    const vertices = createTestVertices(500)
    const boundaries = calculateRegionBoundaries(vertices)
    const occupied = new Set<number>()
    
    // Test multiple concepts with spiral search
    const concepts = ['concept_001', 'concept_002', 'concept_003']
    const results = []
    
    for (const conceptId of concepts) {
      const result = conceptToVertex(conceptId, vertices, occupied, boundaries, true, 5)
      results.push(result)
    }
    
    // Verify all concepts got placed
    expect(results).toHaveLength(3)
    results.forEach(result => {
      expect(result.vertexIndex).toBeGreaterThanOrEqual(0)
      expect(result.vertexIndex).toBeLessThan(vertices.length)
    })
    
    // Verify no duplicates
    const vertexIndices = results.map(r => r.vertexIndex)
    const uniqueIndices = new Set(vertexIndices)
    expect(uniqueIndices.size).toBe(vertexIndices.length)
  })
  
  test('collision rate with 200 concepts using linear probing', async () => {
    const vertices = createTestVertices(1000) // Simulate brain mesh size
    const boundaries = calculateRegionBoundaries(vertices)
    const conceptIds = await loadTestConcepts(200)
    
    const analysis = analyzeConceptMapping(conceptIds, vertices, boundaries, false, 5)
    const report = generateDistributionReport(analysis, vertices)
    
    console.log('\n=== Linear Probing Results (200 concepts) ===')
    console.log(report)
    
    // Verify analysis results
    expect(analysis.totalConcepts).toBe(200)
    expect(analysis.spiralSearchUsed).toBe(false)
    expect(analysis.failedPlacements).toBe(0)
    expect(analysis.collisionRate).toBeLessThan(1.0) // Should be less than 100%
    
    // With 1000 vertices and 200 concepts (20% utilization), collision rate should be reasonable
    expect(analysis.collisionRate).toBeLessThan(0.5) // Less than 50%
  })
  
  test('collision rate with 200 concepts using spiral search', async () => {
    const vertices = createTestVertices(1000) // Simulate brain mesh size  
    const boundaries = calculateRegionBoundaries(vertices)
    const conceptIds = await loadTestConcepts(200)
    
    const analysis = analyzeConceptMapping(conceptIds, vertices, boundaries, true, 5)
    const report = generateDistributionReport(analysis, vertices)
    
    console.log('\n=== Spiral Search Results (200 concepts) ===')
    console.log(report)
    
    // Verify analysis results
    expect(analysis.totalConcepts).toBe(200)
    expect(analysis.spiralSearchUsed).toBe(true)
    expect(analysis.searchRadius).toBe(5)
    expect(analysis.failedPlacements).toBe(0)
    
    // Session 5 acceptance criteria: <5% collision rate
    expect(analysis.collisionRate).toBeLessThan(0.05) // Less than 5%
    
    // Spiral search should generally have lower collision rates
    expect(analysis.collisionRate).toBeGreaterThanOrEqual(0) // But still some collisions possible
  })
  
  test('performance comparison: linear vs spiral search', async () => {
    const vertices = createTestVertices(1000)
    const boundaries = calculateRegionBoundaries(vertices)
    const conceptIds = await loadTestConcepts(200)
    
    // Test linear probing
    const linearAnalysis = analyzeConceptMapping(conceptIds, vertices, boundaries, false, 5)
    
    // Reset and test spiral search
    const spiralAnalysis = analyzeConceptMapping(conceptIds, vertices, boundaries, true, 5)
    
    console.log('\n=== Performance Comparison ===')
    console.log(`Linear Probing: ${linearAnalysis.performanceMs.toFixed(2)}ms, ${linearAnalysis.collisionRate * 100}% collisions`)
    console.log(`Spiral Search: ${spiralAnalysis.performanceMs.toFixed(2)}ms, ${spiralAnalysis.collisionRate * 100}% collisions`)
    
    // Both should complete successfully
    expect(linearAnalysis.failedPlacements).toBe(0)
    expect(spiralAnalysis.failedPlacements).toBe(0)
    
    // Performance should be reasonable (under 1 second for 200 concepts)
    expect(linearAnalysis.performanceMs).toBeLessThan(1000)
    expect(spiralAnalysis.performanceMs).toBeLessThan(1000)
  })
  
  test('collision patterns are documented', async () => {
    const vertices = createTestVertices(500) // Smaller vertex set for higher collision rate
    const boundaries = calculateRegionBoundaries(vertices)
    const conceptIds = await loadTestConcepts(200)
    
    const analysis = analyzeConceptMapping(conceptIds, vertices, boundaries, true, 5)
    const report = generateDistributionReport(analysis, vertices)
    
    console.log('\n=== Collision Pattern Analysis (Dense Scenario) ===')
    console.log(report)
    
    // In dense scenario (40% utilization), we should see more collisions
    expect(analysis.totalConcepts).toBe(200)
    expect(analysis.collisionRate).toBeGreaterThan(0) // Some collisions expected
    
    // Report should contain collision analysis section
    expect(report).toContain('Collision Analysis')
    expect(report).toContain('Collision Resolution Strategy')
    expect(report).toContain('Region Distribution')
  })
  
  test('search radius affects collision resolution', async () => {
    const vertices = createTestVertices(300) // Very dense scenario
    const boundaries = calculateRegionBoundaries(vertices)
    const conceptIds = await loadTestConcepts(100)
    
    // Test different search radii
    const radius3Analysis = analyzeConceptMapping(conceptIds, vertices, boundaries, true, 3)
    const radius5Analysis = analyzeConceptMapping(conceptIds, vertices, boundaries, true, 5)
    const radius10Analysis = analyzeConceptMapping(conceptIds, vertices, boundaries, true, 10)
    
    console.log('\n=== Search Radius Impact ===')
    console.log(`Radius 3: ${radius3Analysis.collisionRate * 100}% collisions`)
    console.log(`Radius 5: ${radius5Analysis.collisionRate * 100}% collisions`)
    console.log(`Radius 10: ${radius10Analysis.collisionRate * 100}% collisions`)
    
    // All should complete successfully
    expect(radius3Analysis.failedPlacements).toBe(0)
    expect(radius5Analysis.failedPlacements).toBe(0)
    expect(radius10Analysis.failedPlacements).toBe(0)
    
    // Larger radius should generally have equal or better collision rates
    expect(radius10Analysis.collisionRate).toBeLessThanOrEqual(radius5Analysis.collisionRate + 0.1)
  })
})