import { z } from 'zod'
import { GraphSchema, type Graph } from '@refinery/schema'
import { loadJSON } from './loaders/json-loader'

/**
 * Configuration schema for the graph forge loader
 */
export const ForgeConfigSchema = z.object({
  /**
   * Source file path or URL to load the graph from
   */
  source: z.string(),
  
  /**
   * Format of the source data
   */
  format: z.enum(['json', 'yaml', 'csv', 'graphml']).default('json'),
  
  /**
   * Whether to validate the loaded graph against the schema
   */
  validate: z.boolean().default(true),
  
  /**
   * Whether to auto-generate IDs for nodes/edges that lack them
   */
  generateIds: z.boolean().default(true),
  
  /**
   * Maximum number of nodes to load (for large graphs)
   */
  maxNodes: z.number().int().positive().optional(),
  
  /**
   * Maximum number of edges to load (for large graphs)
   */
  maxEdges: z.number().int().positive().optional(),
})

export type ForgeConfig = z.infer<typeof ForgeConfigSchema>

/**
 * Result of a graph forge operation
 */
export const ForgeResultSchema = z.object({
  /**
   * The loaded and validated graph
   */
  graph: GraphSchema,
  
  /**
   * Any warnings generated during loading
   */
  warnings: z.array(z.string()),
  
  /**
   * Metadata about the loading process
   */
  metadata: z.object({
    loadTime: z.number(),
    nodeCount: z.number().int(),
    edgeCount: z.number().int(),
    format: z.string(),
    source: z.string(),
  }),
})

export type ForgeResult = z.infer<typeof ForgeResultSchema>

/**
 * Error that can occur during graph forging
 */
export class ForgeError extends Error {
  constructor(
    message: string,
    public readonly code: 'INVALID_FORMAT' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'IO_ERROR',
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'ForgeError'
  }
}

/**
 * Main function to forge (load and validate) a graph from various sources
 * 
 * @param config - Configuration for the forge operation
 * @returns Promise resolving to the forge result
 * @throws ForgeError if loading or validation fails
 */
export async function forgeGraph(config: ForgeConfig): Promise<ForgeResult> {
  const startTime = Date.now()
  const warnings: string[] = []
  
  // Validate config
  const validatedConfig = ForgeConfigSchema.parse(config)
  
  let graph: Graph
  
  // Load based on format
  switch (validatedConfig.format) {
    case 'json':
      graph = await loadJSON(validatedConfig.source, {
        validate: validatedConfig.validate,
        generateIds: validatedConfig.generateIds,
        maxNodes: validatedConfig.maxNodes,
        maxEdges: validatedConfig.maxEdges,
      })
      break
      
    case 'yaml':
    case 'csv':
    case 'graphml':
      // TODO: Implement other format loaders
      throw new ForgeError(
        `Format '${validatedConfig.format}' loader not yet implemented`,
        'INVALID_FORMAT'
      )
      
    default:
      throw new ForgeError(
        `Unknown format: ${validatedConfig.format}`,
        'INVALID_FORMAT'
      )
  }
  
  // Extract any warnings from graph metadata
  if (graph.metadata?.warnings && Array.isArray(graph.metadata.warnings)) {
    warnings.push(...graph.metadata.warnings)
    delete graph.metadata.warnings
  }
  
  // Validate if requested (full validation)
  if (validatedConfig.validate) {
    try {
      GraphSchema.parse(graph)
    } catch (error) {
      throw new ForgeError(
        'Graph validation failed',
        'VALIDATION_ERROR',
        error
      )
    }
  }
  
  const loadTime = Date.now() - startTime
  
  return {
    graph,
    warnings,
    metadata: {
      loadTime,
      nodeCount: graph.nodes.length,
      edgeCount: graph.edges.length,
      format: validatedConfig.format,
      source: validatedConfig.source,
    },
  }
}

/**
 * Load a graph from a JSON file
 * 
 * @param filePath - Path to the JSON file
 * @returns Promise resolving to the loaded graph
 */
export async function forgeFromJSON(filePath: string): Promise<ForgeResult> {
  return forgeGraph({
    source: filePath,
    format: 'json',
  })
}

/**
 * Load a graph from a YAML file
 * 
 * @param filePath - Path to the YAML file
 * @returns Promise resolving to the loaded graph
 */
export async function forgeFromYAML(filePath: string): Promise<ForgeResult> {
  return forgeGraph({
    source: filePath,
    format: 'yaml',
  })
}

/**
 * Load a graph from a CSV file
 * 
 * @param filePath - Path to the CSV file
 * @returns Promise resolving to the loaded graph
 */
export async function forgeFromCSV(filePath: string): Promise<ForgeResult> {
  return forgeGraph({
    source: filePath,
    format: 'csv',
  })
}

/**
 * Load a graph from a GraphML file
 * 
 * @param filePath - Path to the GraphML file
 * @returns Promise resolving to the loaded graph
 */
export async function forgeFromGraphML(filePath: string): Promise<ForgeResult> {
  return forgeGraph({
    source: filePath,
    format: 'graphml',
  })
}