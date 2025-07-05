import { describe, it, expect } from 'vitest'
import {
  forgeGraph,
  forgeFromJSON,
  forgeFromYAML,
  forgeFromCSV,
  forgeFromGraphML,
  ForgeError,
  ForgeConfigSchema,
  ForgeResultSchema,
} from './forgeGraph'
import { GraphSchema } from '@refinery/schema'

describe('forgeGraph', () => {
  describe('ForgeConfigSchema', () => {
    it('should validate a minimal config', () => {
      const config = { source: 'test.json' }
      const result = ForgeConfigSchema.parse(config)
      expect(result.source).toBe('test.json')
      expect(result.format).toBe('json')
      expect(result.validate).toBe(true)
      expect(result.generateIds).toBe(true)
    })

    it('should validate a full config', () => {
      const config = {
        source: 'test.yaml',
        format: 'yaml' as const,
        validate: false,
        generateIds: false,
        maxNodes: 1000,
        maxEdges: 5000,
      }
      const result = ForgeConfigSchema.parse(config)
      expect(result).toEqual(config)
    })

    it('should reject invalid format', () => {
      const config = { source: 'test.txt', format: 'invalid' }
      expect(() => ForgeConfigSchema.parse(config)).toThrow()
    })

    it('should reject negative maxNodes', () => {
      const config = { source: 'test.json', maxNodes: -1 }
      expect(() => ForgeConfigSchema.parse(config)).toThrow()
    })
  })

  describe('forgeGraph function', () => {
    it('should return a valid placeholder graph', async () => {
      const result = await forgeGraph({ source: 'test.json' })
      
      // Validate result structure
      expect(ForgeResultSchema.parse(result)).toBeDefined()
      
      // Check graph structure
      expect(result.graph.nodes).toHaveLength(2)
      expect(result.graph.edges).toHaveLength(1)
      expect(result.graph.id).toMatch(/^forge-placeholder-\d+$/)
      
      // Check metadata
      expect(result.metadata.nodeCount).toBe(2)
      expect(result.metadata.edgeCount).toBe(1)
      expect(result.metadata.format).toBe('json')
      expect(result.metadata.source).toBe('test.json')
      expect(result.metadata.loadTime).toBeGreaterThanOrEqual(0)
      
      // Check warnings
      expect(result.warnings).toContain('Using placeholder implementation - actual loading not yet implemented')
    })

    it('should validate the graph against schema when validate is true', async () => {
      const result = await forgeGraph({ 
        source: 'test.json',
        validate: true 
      })
      
      // The graph should be valid according to GraphSchema
      expect(() => GraphSchema.parse(result.graph)).not.toThrow()
    })

    it('should skip validation when validate is false', async () => {
      // This should not throw even if we had an invalid graph
      const result = await forgeGraph({ 
        source: 'test.json',
        validate: false 
      })
      
      expect(result).toBeDefined()
    })
  })

  describe('format-specific loaders', () => {
    it('forgeFromJSON should use json format', async () => {
      const result = await forgeFromJSON('data.json')
      expect(result.metadata.format).toBe('json')
    })

    it('forgeFromYAML should use yaml format', async () => {
      const result = await forgeFromYAML('data.yaml')
      expect(result.metadata.format).toBe('yaml')
    })

    it('forgeFromCSV should use csv format', async () => {
      const result = await forgeFromCSV('data.csv')
      expect(result.metadata.format).toBe('csv')
    })

    it('forgeFromGraphML should use graphml format', async () => {
      const result = await forgeFromGraphML('data.graphml')
      expect(result.metadata.format).toBe('graphml')
    })
  })

  describe('ForgeError', () => {
    it('should create error with correct properties', () => {
      const error = new ForgeError(
        'Test error',
        'PARSE_ERROR',
        { line: 42 }
      )
      
      expect(error.message).toBe('Test error')
      expect(error.code).toBe('PARSE_ERROR')
      expect(error.details).toEqual({ line: 42 })
      expect(error.name).toBe('ForgeError')
      expect(error instanceof Error).toBe(true)
    })
  })

  describe('placeholder graph structure', () => {
    it('should create valid nodes with required fields', async () => {
      const result = await forgeGraph({ source: 'test.json' })
      
      result.graph.nodes.forEach(node => {
        expect(node.id).toBeTruthy()
        expect(node.label).toBeTruthy()
        expect(node.content).toBeTruthy()
        expect(node.position).toBeDefined()
        expect(node.metadata).toBeDefined()
        expect(node.createdAt).toBeTruthy()
        expect(node.updatedAt).toBeTruthy()
      })
    })

    it('should create valid edges with correct references', async () => {
      const result = await forgeGraph({ source: 'test.json' })
      
      const nodeIds = result.graph.nodes.map(n => n.id)
      
      result.graph.edges.forEach(edge => {
        expect(edge.id).toBeTruthy()
        expect(nodeIds).toContain(edge.source)
        expect(nodeIds).toContain(edge.target)
        expect(edge.type).toBe('relates-to')
        expect(typeof edge.directed).toBe('boolean')
        expect(edge.metadata).toBeDefined()
        expect(edge.createdAt).toBeTruthy()
        expect(edge.updatedAt).toBeTruthy()
      })
    })

    it('should include forge metadata', async () => {
      const result = await forgeGraph({ source: 'test.json' })
      
      expect(result.graph.metadata).toBeDefined()
      expect(result.graph.metadata?.forgedAt).toBeTruthy()
      expect(result.graph.metadata?.forgeVersion).toBe('0.0.0')
    })
  })
})