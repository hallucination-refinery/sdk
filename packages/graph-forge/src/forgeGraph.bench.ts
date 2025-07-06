import { bench, describe } from 'vitest'
import { forgeGraph, forgeFromJSON } from './forgeGraph'
import { writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

// Generate test data with specified number of nodes
function generateTestGraph(nodeCount: number, edgeCount?: number) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => ({
    id: `node-${i}`,
    label: `Node ${i}`,
    content: `Content for node ${i}`,
    position: { x: Math.random() * 1000, y: Math.random() * 1000, z: 0 },
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  // Default to ~2.5 edges per node for realistic graph
  const actualEdgeCount = edgeCount ?? Math.floor(nodeCount * 2.5)
  const edges = Array.from({ length: actualEdgeCount }, (_, i) => ({
    id: `edge-${i}`,
    source: `node-${Math.floor(Math.random() * nodeCount)}`,
    target: `node-${Math.floor(Math.random() * nodeCount)}`,
    type: 'relates-to',
    directed: false,
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))

  return {
    id: `test-graph-${nodeCount}`,
    name: `Test Graph with ${nodeCount} nodes`,
    description: `Performance test graph`,
    nodes,
    edges,
    metadata: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

describe('forgeGraph performance', () => {
  // Create test files
  const testDir = tmpdir()
  const smallGraphPath = join(testDir, 'small-graph.json')
  const mediumGraphPath = join(testDir, 'medium-graph.json')
  const largeGraphPath = join(testDir, 'large-graph.json')
  const targetGraphPath = join(testDir, 'target-graph.json')

  // Generate and write test graphs
  writeFileSync(smallGraphPath, JSON.stringify(generateTestGraph(100)))
  writeFileSync(mediumGraphPath, JSON.stringify(generateTestGraph(1000)))
  writeFileSync(largeGraphPath, JSON.stringify(generateTestGraph(5000)))
  writeFileSync(targetGraphPath, JSON.stringify(generateTestGraph(2000, 5000))) // 2k nodes, 5k edges

  bench('forgeGraph with 100 nodes', async () => {
    await forgeFromJSON(smallGraphPath)
  })

  bench('forgeGraph with 1,000 nodes', async () => {
    await forgeFromJSON(mediumGraphPath)
  })

  bench('forgeGraph with 2,000 nodes (target)', async () => {
    await forgeFromJSON(targetGraphPath)
  }, {
    iterations: 10,
  })

  bench('forgeGraph with 5,000 nodes', async () => {
    await forgeFromJSON(largeGraphPath)
  }, {
    iterations: 5,
  })

  bench('forgeGraph placeholder (current)', async () => {
    await forgeGraph({ source: 'dummy.json' })
  }, {
    iterations: 100,
  })
})

// Standalone performance test for development
export async function runPerformanceTest() {
  console.log('Running performance test for 2k nodes...')
  
  const testGraph = generateTestGraph(2000, 5000)
  const testPath = join(tmpdir(), 'perf-test-2k.json')
  writeFileSync(testPath, JSON.stringify(testGraph))
  
  const runs = 10
  const times: number[] = []
  
  for (let i = 0; i < runs; i++) {
    const start = performance.now()
    const result = await forgeFromJSON(testPath)
    const end = performance.now()
    const time = end - start
    times.push(time)
    
    if (i === 0) {
      console.log(`Loaded ${result.metadata.nodeCount} nodes, ${result.metadata.edgeCount} edges`)
    }
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)
  
  console.log(`\nPerformance Results (${runs} runs):`);
  console.log(`Average: ${avg.toFixed(2)}ms`)
  console.log(`Min: ${min.toFixed(2)}ms`)
  console.log(`Max: ${max.toFixed(2)}ms`)
  console.log(`Target: ≤300ms`)
  console.log(`Status: ${avg <= 300 ? '✅ PASS' : '❌ FAIL'}`)
  
  return { avg, min, max, times }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTest()
}