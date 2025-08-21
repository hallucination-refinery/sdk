#!/usr/bin/env node
import { mapConceptsToVertices, analyzeMapping } from '../packages/canvas-r3f/dist/index.js'

// Create mock vertices (simulate brain mesh)
const createMockVertices = (count) => {
  const vertices = []
  for (let i = 0; i < count; i++) {
    vertices.push({ x: Math.random() * 100, y: Math.random() * 100, z: Math.random() * 100 })
  }
  return vertices
}

// Create test concepts
const createTestConcepts = (count) => {
  const concepts = []
  for (let i = 0; i < count; i++) {
    concepts.push(`concept-${i}`)
  }
  return concepts
}

// Run reproducibility test
const vertices = createMockVertices(39410) // Use actual vertex count
const concepts = createTestConcepts(500)

// First run
const mapping1 = mapConceptsToVertices(concepts, vertices, { useSpiral: true })

// Second run - should produce identical results
const mapping2 = mapConceptsToVertices(concepts, vertices, { useSpiral: true })

// Verify reproducibility
let identical = true
for (let i = 0; i < concepts.length; i++) {
  if (mapping1.mappings[i].vertexIndex !== mapping2.mappings[i].vertexIndex) {
    identical = false
    break
  }
}

// Calculate collision rate
const uniqueIndices = new Set(mapping1.mappings.map(m => m.vertexIndex))
const collisionRate = ((concepts.length - uniqueIndices.size) / concepts.length) * 100

// Create distribution stats
const stats = {
  totalConcepts: concepts.length,
  uniqueVertices: uniqueIndices.size,
  collisionRate: collisionRate.toFixed(2) + '%',
  reproducible: identical,
  distributionByRegion: mapping1.distributionByRegion || {},
  spiralSearchUsed: mapping1.spiralSearchUsed || false
}

// Write stats
import fs from 'fs'
fs.writeFileSync('.clmem/artifacts/w03/distribution-stats.json', JSON.stringify(stats, null, 2))
fs.writeFileSync('.clmem/artifacts/w03/reproducibility.txt', identical ? 'PASS: Mappings are reproducible' : 'FAIL: Mappings are not reproducible')

console.log('Distribution stats:', stats)
console.log('Reproducibility:', identical ? 'PASS' : 'FAIL')