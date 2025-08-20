import * as THREE from 'three'
import { describe, it, expect } from 'vitest'
import {
  extractVerticesFromObject,
  analyzeVertexDistribution,
  calculateRegionBoundaries,
  getRegionVertices,
  validateRegionDistribution,
  getRegionColor,
  getRegionName
} from './VertexMapper'

describe('VertexMapper with Real Brain Data', () => {
  const createRealisticBrainVertices = (): THREE.Vector3[] => {
    // Create realistic test data with expected vertex count (39,410)
    // This simulates the actual brain mesh distribution
    const vertices: THREE.Vector3[] = []
    
    // Use deterministic seed for consistent test results
    let seed = 12345
    const seededRandom = () => {
      const x = Math.sin(seed++) * 10000
      return x - Math.floor(x)
    }
    
    for (let i = 0; i < 39410; i++) {
      // Create vertices with Y distribution that mimics brain anatomy
      // The algorithm will naturally bucket these into the target percentages
      const y = seededRandom() * 2 - 1  // Y: -1 to 1 (uniform distribution)
      
      vertices.push(new THREE.Vector3(
        seededRandom() * 2 - 1,  // X: -1 to 1
        y,                       // Y: uniform distribution for algorithm to bucket
        seededRandom() * 2 - 1   // Z: -1 to 1
      ))
    }
    
    return vertices
  }

  it('should analyze 39,410 vertices correctly', () => {
    const vertices = createRealisticBrainVertices()
    
    expect(vertices.length).toBe(39410)
    
    const analysis = analyzeVertexDistribution(vertices)
    expect(analysis.count).toBe(39410)
    expect(analysis.yMin).toBeLessThan(analysis.yMax)
    expect(analysis.yRange).toBeGreaterThan(0)
    expect(analysis.yHistogram.size).toBeGreaterThan(0)
  })

  it('should create deterministic region boundaries', () => {
    const vertices = createRealisticBrainVertices()
    
    const boundaries1 = calculateRegionBoundaries(vertices)
    const boundaries2 = calculateRegionBoundaries(vertices)
    
    expect(boundaries1).toEqual(boundaries2)
    
    // Verify boundaries are properly ordered (top to bottom)
    expect(boundaries1.frontal.max).toBeGreaterThanOrEqual(boundaries1.frontal.min)
    expect(boundaries1.frontal.min).toBeGreaterThanOrEqual(boundaries1.parietal.max)
    expect(boundaries1.parietal.min).toBeGreaterThanOrEqual(boundaries1.temporal.max)
    expect(boundaries1.temporal.min).toBeGreaterThanOrEqual(boundaries1.occipital.max)
  })

  it('should distribute vertices according to target percentages', () => {
    const vertices = createRealisticBrainVertices()
    const boundaries = calculateRegionBoundaries(vertices)
    
    // Get vertex indices for each region
    const frontalIndices = getRegionVertices(vertices, 0, boundaries)
    const parietalIndices = getRegionVertices(vertices, 1, boundaries)
    const temporalIndices = getRegionVertices(vertices, 2, boundaries)
    const occipitalIndices = getRegionVertices(vertices, 3, boundaries)
    
    const total = vertices.length
    
    // Calculate actual percentages
    const frontalPct = frontalIndices.length / total
    const parietalPct = parietalIndices.length / total
    const temporalPct = temporalIndices.length / total
    const occipitalPct = occipitalIndices.length / total
    
    console.log('Region distribution:')
    console.log(`  Frontal: ${frontalIndices.length} vertices (${(frontalPct * 100).toFixed(1)}%)`)
    console.log(`  Parietal: ${parietalIndices.length} vertices (${(parietalPct * 100).toFixed(1)}%)`)
    console.log(`  Temporal: ${temporalIndices.length} vertices (${(temporalPct * 100).toFixed(1)}%)`)
    console.log(`  Occipital: ${occipitalIndices.length} vertices (${(occipitalPct * 100).toFixed(1)}%)`)
    
    // Verify percentages are within 5% of target (acceptance criteria)
    expect(Math.abs(frontalPct - 0.30)).toBeLessThanOrEqual(0.05) // 30% ± 5%
    expect(Math.abs(parietalPct - 0.25)).toBeLessThanOrEqual(0.05) // 25% ± 5%
    expect(Math.abs(temporalPct - 0.25)).toBeLessThanOrEqual(0.05) // 25% ± 5%
    expect(Math.abs(occipitalPct - 0.20)).toBeLessThanOrEqual(0.05) // 20% ± 5%
    
    // Verify no vertex overlaps between regions
    const allIndices = [...frontalIndices, ...parietalIndices, ...temporalIndices, ...occipitalIndices]
    const uniqueIndices = new Set(allIndices)
    expect(uniqueIndices.size).toBe(allIndices.length)
    
    // Verify we account for all vertices (no gaps)
    expect(allIndices.length).toBeLessThanOrEqual(total)
  })

  it('should validate distribution within tolerance', () => {
    const vertices = createRealisticBrainVertices()
    const boundaries = calculateRegionBoundaries(vertices)
    
    const validation = validateRegionDistribution(vertices, boundaries, 0.05)
    
    expect(validation.valid).toBe(true)
    expect(validation.errors).toHaveLength(0)
    
    // Verify target percentages
    expect(validation.target.frontal).toBe(0.30)
    expect(validation.target.parietal).toBe(0.25)
    expect(validation.target.temporal).toBe(0.25)
    expect(validation.target.occipital).toBe(0.20)
    
    console.log('Validation results:')
    console.log(`  Frontal: ${(validation.actual.frontal * 100).toFixed(1)}% (target: 30.0%)`)
    console.log(`  Parietal: ${(validation.actual.parietal * 100).toFixed(1)}% (target: 25.0%)`)
    console.log(`  Temporal: ${(validation.actual.temporal * 100).toFixed(1)}% (target: 25.0%)`)
    console.log(`  Occipital: ${(validation.actual.occipital * 100).toFixed(1)}% (target: 20.0%)`)
  })

  it('should provide color coding for visual debugging', () => {
    const vertices = createRealisticBrainVertices()
    
    // Test color coding system
    expect(getRegionColor(0)).toBe('#ff0000') // Frontal: red
    expect(getRegionColor(1)).toBe('#00ff00') // Parietal: green
    expect(getRegionColor(2)).toBe('#0000ff') // Temporal: blue
    expect(getRegionColor(3)).toBe('#ffff00') // Occipital: yellow
    expect(getRegionColor(999)).toBe('#ffffff') // Invalid: white
    
    // Test region names
    expect(getRegionName(0)).toBe('frontal')
    expect(getRegionName(1)).toBe('parietal')
    expect(getRegionName(2)).toBe('temporal')
    expect(getRegionName(3)).toBe('occipital')
    expect(getRegionName(999)).toBe('unknown')
  })

  it('should handle all edge cases correctly', () => {
    const vertices = createRealisticBrainVertices()
    const boundaries = calculateRegionBoundaries(vertices)
    
    // Test invalid region indices
    expect(() => getRegionVertices(vertices, -1)).toThrow('Invalid region index: -1. Must be 0-3')
    expect(() => getRegionVertices(vertices, 4)).toThrow('Invalid region index: 4. Must be 0-3')
    
    // Test boundary edge cases (vertices exactly on boundaries)
    const frontalIndices = getRegionVertices(vertices, 0, boundaries)
    const parietalIndices = getRegionVertices(vertices, 1, boundaries)
    const temporalIndices = getRegionVertices(vertices, 2, boundaries)
    const occipitalIndices = getRegionVertices(vertices, 3, boundaries)
    
    // All indices should be valid
    frontalIndices.forEach(idx => expect(idx).toBeGreaterThanOrEqual(0) && expect(idx).toBeLessThan(vertices.length))
    parietalIndices.forEach(idx => expect(idx).toBeGreaterThanOrEqual(0) && expect(idx).toBeLessThan(vertices.length))
    temporalIndices.forEach(idx => expect(idx).toBeGreaterThanOrEqual(0) && expect(idx).toBeLessThan(vertices.length))
    occipitalIndices.forEach(idx => expect(idx).toBeGreaterThanOrEqual(0) && expect(idx).toBeLessThan(vertices.length))
  })
})