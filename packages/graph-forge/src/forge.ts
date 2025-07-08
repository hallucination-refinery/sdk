import type { IdeaNode, Edge } from '@refinery/schema'
import { 
  RawMemorySchema, 
  ForgeOptionsSchema,
  type RawMemory, 
  type ForgeOptions, 
  type WidgetManifest 
} from './schemas.js'
import { generateInitialPositions, runForceSimulation } from './force-simulation.js'

/**
 * Result of the forge operation
 */
export interface ForgeResult {
  nodes: IdeaNode[]
  edges: Edge[]
  widgetSpec: WidgetManifest
}

/**
 * Color palette for clusters
 */
const CLUSTER_COLORS: Record<string, string> = {
  personal: '#6366f1',      // Indigo
  work: '#06b6d4',         // Cyan
  ideas: '#8b5cf6',        // Purple
  reference: '#10b981',    // Emerald
  project: '#f59e0b',      // Amber
  archive: '#6b7280',      // Gray
  default: '#94a3b8',      // Slate
}

/**
 * Convert raw memories into a graph with force-directed layout
 * 
 * @param raw - Array of raw memory objects
 * @param opts - Optional configuration
 * @returns Graph with positioned nodes, edges, and widget spec
 */
export function forgeGraph(
  raw: RawMemory[],
  opts: Partial<ForgeOptions> = {}
): ForgeResult {
  // Validate and merge options
  const options = ForgeOptionsSchema.parse(opts)
  
  // Validate raw memories
  const memories = raw.map(m => RawMemorySchema.parse(m))
  
  // Generate initial positions
  const positions = generateInitialPositions(memories, options)
  
  // Create nodes
  const nodes: IdeaNode[] = memories.map(memory => {
    const position = positions.get(memory.id)!
    const cluster = memory.cluster || 'default'
    
    return {
      id: memory.id,
      label: memory.content.slice(0, 50) + (memory.content.length > 50 ? '...' : ''),
      content: memory.content,
      position,
      velocity: { x: 0, y: 0, z: 0 },
      color: CLUSTER_COLORS[cluster] || CLUSTER_COLORS.default,
      size: 1,
      metadata: {
        ...memory.metadata,
        cluster,
        raw: memory,
      },
      selected: false,
      hovered: false,
      fixed: false,
    }
  })
  
  // Create edges from connections
  const edges: Edge[] = []
  const edgeSet = new Set<string>() // To avoid duplicates
  
  memories.forEach(memory => {
    if (memory.connections) {
      memory.connections.forEach((targetId, index) => {
        // Only create edge if target exists
        if (memories.some(m => m.id === targetId)) {
          const edgeId = [memory.id, targetId].sort().join('-')
          
          // Avoid duplicate edges
          if (!edgeSet.has(edgeId)) {
            edgeSet.add(edgeId)
            
            edges.push({
              id: `edge-${memory.id}-${targetId}-${index}`,
              source: memory.id,
              target: targetId,
              type: 'relates-to',
              label: '',
              strength: 0.5,
              directed: false,
              visible: true,
              metadata: {},
              color: '#94a3b8',
              width: 1,
            })
          }
        }
      })
    }
  })
  
  // Run force simulation to position nodes
  const positionedNodes = runForceSimulation(nodes, edges, options)
  
  // Generate widget spec based on the data
  const clusters = new Set(memories.map(m => m.cluster).filter(Boolean))
  
  const widgetSpec: WidgetManifest = {
    layout: 'force',
    nodeStyle: {
      sizeRange: [0.5, 2.0],
      colorByCluster: clusters.size > 1,
      showLabels: true,
    },
    edgeStyle: {
      curved: false,
      directed: false,
      opacity: 0.6,
    },
    camera: {
      initialDistance: Math.max(100, nodes.length * 0.5),
      fov: 75,
    },
  }
  
  return {
    nodes: positionedNodes,
    edges,
    widgetSpec,
  }
}