import { describe, it, expect, bench } from 'vitest'
import { forgeGraph, type RawMemory } from './index'

describe('forgeGraph performance', () => {
  // Generate test data
  function generateMemories(count: number): RawMemory[] {
    const memories: RawMemory[] = []
    
    for (let i = 0; i < count; i++) {
      const connections: string[] = []
      
      // Create some random connections (sparse graph)
      const numConnections = Math.floor(Math.random() * 5)
      for (let j = 0; j < numConnections; j++) {
        const target = Math.floor(Math.random() * count)
        if (target !== i) {
          connections.push(`mem_${target.toString().padStart(4, '0')}`)
        }
      }
      
      memories.push({
        id: `mem_${i.toString().padStart(4, '0')}`,
        content: `Memory content for item ${i}`,
        cluster: ['work', 'personal', 'ideas', 'reference'][i % 4],
        connections,
        metadata: {
          index: i,
          timestamp: new Date().toISOString(),
        },
      })
    }
    
    return memories
  }

  // Test with different sizes
  const sizes = [100, 500, 1000, 2000]
  
  sizes.forEach(size => {
    bench(`forgeGraph with ${size} nodes`, () => {
      const memories = generateMemories(size)
      const result = forgeGraph(memories, {
        seed: 42,
        simulation: {
          iterations: 300,
        },
      })
      
      // Verify output
      expect(result.nodes).toHaveLength(size)
      expect(result.edges.length).toBeGreaterThan(0)
    }, {
      warmupIterations: 1,
      iterations: 5,
    })
  })

  // Specific test for 2k nodes under 300ms
  it('should layout 2k nodes in under 300ms', () => {
    const memories = generateMemories(2000)
    
    const start = performance.now()
    const result = forgeGraph(memories, {
      seed: 42,
      simulation: {
        iterations: 300,
      },
    })
    const elapsed = performance.now() - start
    
    console.log(`2k node layout took ${elapsed.toFixed(2)}ms`)
    
    expect(result.nodes).toHaveLength(2000)
    expect(elapsed).toBeLessThan(300)
  })

  // Test minimal iterations for speed
  bench('forgeGraph 2k nodes with 100 iterations', () => {
    const memories = generateMemories(2000)
    forgeGraph(memories, {
      seed: 42,
      simulation: {
        iterations: 100,
      },
    })
  })

  // Test memory efficiency
  it('should handle 10k nodes without running out of memory', () => {
    const memories = generateMemories(10000)
    
    const start = performance.now()
    const result = forgeGraph(memories, {
      seed: 42,
      simulation: {
        iterations: 50, // Fewer iterations for large graph
      },
    })
    const elapsed = performance.now() - start
    
    console.log(`10k node layout took ${elapsed.toFixed(2)}ms`)
    
    expect(result.nodes).toHaveLength(10000)
  })
})