import { readFile } from 'fs/promises'
import { z } from 'zod'
import type { Graph, IdeaNode, Edge } from '@refinery/schema'
import { ForgeError } from '../forgeGraph'

/**
 * Optimized JSON loader for large graphs
 * Performance optimizations:
 * - Minimal validation during parse
 * - Batch timestamp generation
 * - Pre-allocated arrays
 * - Node ID indexing for edge validation
 */

// Minimal validation schemas for performance
const MinimalNodeSchema = z.object({
  id: z.string().optional(), // Make id optional for generateIds
  label: z.string().optional(),
  content: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number().optional(),
  }).optional(),
  metadata: z.record(z.unknown()).optional(),
})

const MinimalEdgeSchema = z.object({
  id: z.string().optional(), // Make id optional for generateIds
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  directed: z.boolean().optional(),
  metadata: z.record(z.unknown()).optional(),
})

const MinimalGraphSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  nodes: z.array(MinimalNodeSchema),
  edges: z.array(MinimalEdgeSchema),
  metadata: z.record(z.unknown()).optional(),
})

export async function loadJSON(
  filePath: string,
  options: {
    validate?: boolean
    generateIds?: boolean
    maxNodes?: number
    maxEdges?: number
  } = {}
): Promise<Graph> {
  try {
    // Read file
    const content = await readFile(filePath, 'utf-8')
    
    // Parse JSON
    let data: any
    try {
      data = JSON.parse(content)
    } catch (error) {
      throw new ForgeError(
        `Failed to parse JSON from ${filePath}`,
        'PARSE_ERROR',
        error
      )
    }
    
    // Quick structure validation
    const parsed = MinimalGraphSchema.parse(data)
    
    // Apply limits if specified
    const nodes = options.maxNodes 
      ? parsed.nodes.slice(0, options.maxNodes)
      : parsed.nodes
    
    const edges = options.maxEdges
      ? parsed.edges.slice(0, options.maxEdges)
      : parsed.edges
    
    // Generate timestamps once
    const now = new Date().toISOString()
    
    // Process nodes with defaults (generate IDs first if needed)
    const processedNodes: IdeaNode[] = nodes.map((node, index) => ({
      id: options.generateIds && !node.id ? `node-${Date.now()}-${index}` : node.id!,
      label: node.label || 'Untitled',
      content: node.content || '',
      position: node.position || { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      color: '#6366f1',
      size: 1,
      metadata: node.metadata || {},
      selected: false,
      hovered: false,
      fixed: false,
      createdAt: now,
      updatedAt: now,
    }))
    
    // Build node ID set for O(1) edge validation (after processing nodes)
    const nodeIds = new Set(processedNodes.map(n => n.id))
    
    // Process edges with validation
    const processedEdges: Edge[] = []
    const edgeWarnings: string[] = []
    
    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i]
      
      // Skip invalid edges
      if (!nodeIds.has(edge.source)) {
        edgeWarnings.push(`Edge ${edge.id} references non-existent source node ${edge.source}`)
        continue
      }
      if (!nodeIds.has(edge.target)) {
        edgeWarnings.push(`Edge ${edge.id} references non-existent target node ${edge.target}`)
        continue
      }
      
      processedEdges.push({
        id: options.generateIds && !edge.id ? `edge-${Date.now()}-${i}` : edge.id,
        source: edge.source,
        target: edge.target,
        type: (edge.type as any) || 'relates-to',
        label: '',
        strength: 0.5,
        directed: edge.directed ?? false,
        metadata: edge.metadata || {},
        color: '#94a3b8',
        width: 1,
        style: 'solid',
        createdAt: now,
        updatedAt: now,
      })
    }
    
    // Build final graph
    const graph: Graph = {
      id: parsed.id || `graph-${Date.now()}`,
      name: parsed.name || 'Imported Graph',
      description: parsed.description || '',
      nodes: processedNodes,
      edges: processedEdges,
      metadata: {
        ...parsed.metadata,
        importedFrom: filePath,
        importedAt: now,
        warnings: edgeWarnings.length > 0 ? edgeWarnings : undefined,
      },
      createdAt: now,
      updatedAt: now,
    }
    
    return graph
    
  } catch (error) {
    if (error instanceof ForgeError) {
      throw error
    }
    throw new ForgeError(
      `Failed to load JSON from ${filePath}`,
      'IO_ERROR',
      error
    )
  }
}