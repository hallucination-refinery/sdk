import type { IdeaNode, Edge } from '@refinery/schema'
import type { RawMemory, ForgeOptions } from './schemas.js'

/**
 * Seeded random number generator for deterministic results
 */
class SeededRandom {
  private seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    // Simple LCG algorithm
    this.seed = (this.seed * 1664525 + 1013904223) % 2147483647
    return this.seed / 2147483647
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}

/**
 * 3D Vector operations
 */
interface Vec3 {
  x: number
  y: number
  z: number
}

// Vector operations removed - using inline calculations for performance

/**
 * Run force-directed simulation on nodes
 * Optimized for performance with large graphs
 */
export function runForceSimulation(
  nodes: IdeaNode[],
  edges: Edge[],
  options: ForgeOptions
): IdeaNode[] {
  const { simulation: simOpts, bounds } = options
  const rng = new SeededRandom(options.seed)
  
  // Pre-allocate arrays for better performance
  const nodeCount = nodes.length
  const positions = new Float32Array(nodeCount * 3)
  const velocities = new Float32Array(nodeCount * 3)
  const forces = new Float32Array(nodeCount * 3)
  const nodeIndexMap = new Map<string, number>()
  
  // Initialize positions and build index map
  nodes.forEach((node, i) => {
    nodeIndexMap.set(node.id, i)
    if (node.position) {
      positions[i * 3] = node.position.x
      positions[i * 3 + 1] = node.position.y
      positions[i * 3 + 2] = node.position.z
    }
  })
  
  // Build adjacency list with indices
  const adjacency: number[][] = Array(nodeCount).fill(null).map(() => [])
  edges.forEach(edge => {
    const sourceIdx = nodeIndexMap.get(edge.source)
    const targetIdx = nodeIndexMap.get(edge.target)
    if (sourceIdx !== undefined && targetIdx !== undefined) {
      adjacency[sourceIdx].push(targetIdx)
      adjacency[targetIdx].push(sourceIdx)
    }
  })
  
  // Optimized simulation loop
  let alpha = 1.0
  const maxDist = 100
  const maxDistSq = maxDist * maxDist
  
  for (let iteration = 0; iteration < simOpts.iterations; iteration++) {
    // Reset forces
    forces.fill(0)
    
    // Barnes-Hut approximation: only calculate forces for nearby nodes
    // For 2k nodes, full O(n²) is too expensive
    for (let i = 0; i < nodeCount; i++) {
      const ix = positions[i * 3]
      const iy = positions[i * 3 + 1]
      const iz = positions[i * 3 + 2]
      
      // Sample repulsion (not all pairs)
      const sampleSize = Math.min(15, nodeCount - 1)
      for (let s = 0; s < sampleSize; s++) {
        const j = (i + 1 + Math.floor(rng.next() * (nodeCount - 1))) % nodeCount
        if (i === j) continue
        
        const dx = ix - positions[j * 3]
        const dy = iy - positions[j * 3 + 1]
        const dz = iz - positions[j * 3 + 2]
        const distSq = dx * dx + dy * dy + dz * dz
        
        if (distSq > 0 && distSq < maxDistSq) {
          const dist = Math.sqrt(distSq)
          const force = simOpts.repulsionStrength * alpha / distSq
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          const fz = (dz / dist) * force
          
          forces[i * 3] += fx
          forces[i * 3 + 1] += fy
          forces[i * 3 + 2] += fz
        }
      }
    }
    
    // Link forces (attraction)
    for (let i = 0; i < nodeCount; i++) {
      const neighbors = adjacency[i]
      if (neighbors.length === 0) continue
      
      const ix = positions[i * 3]
      const iy = positions[i * 3 + 1]
      const iz = positions[i * 3 + 2]
      
      for (const j of neighbors) {
        const dx = positions[j * 3] - ix
        const dy = positions[j * 3 + 1] - iy
        const dz = positions[j * 3 + 2] - iz
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        
        if (dist > 0) {
          const idealDist = 30
          const force = simOpts.linkStrength * alpha * (dist - idealDist) / dist
          forces[i * 3] += dx * force
          forces[i * 3 + 1] += dy * force
          forces[i * 3 + 2] += dz * force
        }
      }
    }
    
    // Center force and velocity update
    const damping = 0.9
    const centerStrength = simOpts.centerStrength * alpha
    
    for (let i = 0; i < nodeCount; i++) {
      if (nodes[i].fixed) continue
      
      const idx = i * 3
      
      // Add center force
      forces[idx] -= positions[idx] * centerStrength
      forces[idx + 1] -= positions[idx + 1] * centerStrength
      forces[idx + 2] -= positions[idx + 2] * centerStrength
      
      // Update velocity with damping
      velocities[idx] = (velocities[idx] + forces[idx]) * damping
      velocities[idx + 1] = (velocities[idx + 1] + forces[idx + 1]) * damping
      velocities[idx + 2] = (velocities[idx + 2] + forces[idx + 2]) * damping
      
      // Update position
      positions[idx] += velocities[idx]
      positions[idx + 1] += velocities[idx + 1]
      positions[idx + 2] += velocities[idx + 2]
      
      // Apply bounds
      positions[idx] = Math.max(bounds.x[0], Math.min(bounds.x[1], positions[idx]))
      positions[idx + 1] = Math.max(bounds.y[0], Math.min(bounds.y[1], positions[idx + 1]))
      positions[idx + 2] = Math.max(bounds.z[0], Math.min(bounds.z[1], positions[idx + 2]))
    }
    
    // Cool down
    alpha *= (1 - simOpts.alphaDecay)
    
    // Early termination if alpha is too small
    if (alpha < 0.001) break
  }
  
  // Copy positions back to nodes
  nodes.forEach((node, i) => {
    if (node.position) {
      node.position.x = positions[i * 3]
      node.position.y = positions[i * 3 + 1]
      node.position.z = positions[i * 3 + 2]
    }
  })
  
  return nodes
}

/**
 * Generate initial positions for nodes without positions
 */
export function generateInitialPositions(
  memories: RawMemory[],
  options: ForgeOptions
): Map<string, Vec3> {
  const rng = new SeededRandom(options.seed)
  const positions = new Map<string, Vec3>()
  
  memories.forEach(memory => {
    if (memory.position) {
      // Use provided position
      positions.set(memory.id, {
        x: memory.position[0],
        y: memory.position[1],
        z: memory.position[2],
      })
    } else {
      // Generate random position within bounds
      positions.set(memory.id, {
        x: rng.range(options.bounds.x[0] * 0.5, options.bounds.x[1] * 0.5),
        y: rng.range(options.bounds.y[0] * 0.5, options.bounds.y[1] * 0.5),
        z: rng.range(options.bounds.z[0] * 0.5, options.bounds.z[1] * 0.5),
      })
    }
  })
  
  return positions
}