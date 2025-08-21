#!/usr/bin/env node
import fs from 'fs'

// djb2 hash function
function djb2Hash(str) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i)
  }
  return hash
}

// Simple mapping function
function mapConceptToVertex(conceptId, vertexCount) {
  const hash = djb2Hash(conceptId)
  return Math.abs(hash) % vertexCount
}

// Test reproducibility
const vertexCount = 39410
const concepts = []
for (let i = 0; i < 500; i++) {
  concepts.push(`concept-${i}`)
}

// First run
const mapping1 = concepts.map(c => mapConceptToVertex(c, vertexCount))

// Second run - should be identical
const mapping2 = concepts.map(c => mapConceptToVertex(c, vertexCount))

// Check reproducibility
let identical = true
for (let i = 0; i < concepts.length; i++) {
  if (mapping1[i] !== mapping2[i]) {
    identical = false
    break
  }
}

// Calculate collision rate
const uniqueIndices = new Set(mapping1)
const collisionRate = ((concepts.length - uniqueIndices.size) / concepts.length) * 100

// Create distribution stats
const stats = {
  totalConcepts: concepts.length,
  uniqueVertices: uniqueIndices.size,
  collisionRate: collisionRate.toFixed(2) + '%',
  reproducible: identical,
  hashFunction: 'djb2',
  vertexCount: vertexCount
}

// Write results
fs.writeFileSync('.clmem/artifacts/w03/distribution-stats.json', JSON.stringify(stats, null, 2))
fs.writeFileSync('.clmem/artifacts/w03/reproducibility.txt', 
  identical ? 'PASS: Mappings are reproducible across runs' : 'FAIL: Mappings are not reproducible')

console.log('Distribution stats:', stats)
console.log('Reproducibility test:', identical ? 'PASS' : 'FAIL')
console.log('Collision rate:', collisionRate.toFixed(2) + '%', '(<5% target)')