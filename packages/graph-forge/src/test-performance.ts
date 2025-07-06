#!/usr/bin/env node
import { forgeFromJSON } from './forgeGraph.js'
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

async function runPerformanceTest() {
  console.log('Running performance test for 2k nodes...')
  
  const testGraph = generateTestGraph(2000, 5000)
  const testPath = join(tmpdir(), 'perf-test-2k.json')
  writeFileSync(testPath, JSON.stringify(testGraph))
  
  console.log(`Generated test file: ${testPath}`)
  console.log(`File size: ${(JSON.stringify(testGraph).length / 1024 / 1024).toFixed(2)} MB`)
  
  const runs = 10
  const times: number[] = []
  
  // Warmup run
  await forgeFromJSON(testPath)
  
  for (let i = 0; i < runs; i++) {
    const start = performance.now()
    const result = await forgeFromJSON(testPath)
    const end = performance.now()
    const time = end - start
    times.push(time)
    
    if (i === 0) {
      console.log(`\nLoaded ${result.metadata.nodeCount} nodes, ${result.metadata.edgeCount} edges`)
      console.log(`Warnings: ${result.warnings.length > 0 ? result.warnings.join(', ') : 'None'}`)
    }
    
    process.stdout.write(`Run ${i + 1}/${runs}: ${time.toFixed(2)}ms\r`)
  }
  
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const min = Math.min(...times)
  const max = Math.max(...times)
  
  console.log(`\n\nPerformance Results (${runs} runs):`);
  console.log(`Average: ${avg.toFixed(2)}ms`)
  console.log(`Min: ${min.toFixed(2)}ms`)
  console.log(`Max: ${max.toFixed(2)}ms`)
  console.log(`Target: ≤300ms`)
  console.log(`Status: ${avg <= 300 ? '✅ PASS' : '❌ FAIL'}`)
  
  // Test smaller graphs too
  console.log('\n--- Testing different graph sizes ---')
  
  const sizes = [100, 500, 1000, 5000, 10000]
  for (const size of sizes) {
    const graph = generateTestGraph(size)
    const path = join(tmpdir(), `test-${size}.json`)
    writeFileSync(path, JSON.stringify(graph))
    
    const start = performance.now()
    await forgeFromJSON(path)
    const time = performance.now() - start
    
    console.log(`${size.toString().padStart(5)} nodes: ${time.toFixed(2)}ms`)
  }
}

runPerformanceTest().catch(console.error)