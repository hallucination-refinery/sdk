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
    it('should load a valid graph from JSON file', async () => {
      // Create a test JSON file
      const testData = {
        id: 'test-graph',
        name: 'Test Graph',
        nodes: [
          { id: 'n1', label: 'Node 1', position: { x: 0, y: 0, z: 0 } },
          { id: 'n2', label: 'Node 2', position: { x: 100, y: 0, z: 0 } }
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', type: 'relates-to' }
        ]
      }
      
      // Mock file system
      const { writeFileSync, unlinkSync } = await import('fs')
      const { tmpdir } = await import('os')
      const { join } = await import('path')
      
      const testPath = join(tmpdir(), 'test-graph.json')
      writeFileSync(testPath, JSON.stringify(testData))
      
      try {
        const result = await forgeGraph({ source: testPath })
        
        // Validate result structure
        expect(ForgeResultSchema.parse(result)).toBeDefined()
        
        // Check graph structure
        expect(result.graph.nodes).toHaveLength(2)
        expect(result.graph.edges).toHaveLength(1)
        expect(result.graph.id).toBe('test-graph')
        expect(result.graph.name).toBe('Test Graph')
        
        // Check metadata
        expect(result.metadata.nodeCount).toBe(2)
        expect(result.metadata.edgeCount).toBe(1)
        expect(result.metadata.format).toBe('json')
        expect(result.metadata.source).toBe(testPath)
        expect(result.metadata.loadTime).toBeGreaterThanOrEqual(0)
        expect(result.metadata.loadTime).toBeLessThan(100) // Should be fast for 2 nodes
        
        // Check no warnings for valid graph
        expect(result.warnings).toHaveLength(0)
      } finally {
        unlinkSync(testPath)
      }
    })

    it('should validate the graph against schema when validate is true', async () => {
      const { writeFileSync, unlinkSync } = await import('fs')
      const { tmpdir } = await import('os')
      const { join } = await import('path')
      
      const testPath = join(tmpdir(), 'validate-test.json')
      writeFileSync(testPath, JSON.stringify({
        nodes: [{ id: 'n1' }],
        edges: []
      }))
      
      try {
        const result = await forgeGraph({ 
          source: testPath,
          validate: true 
        })
        
        // The graph should be valid according to GraphSchema
        expect(() => GraphSchema.parse(result.graph)).not.toThrow()
      } finally {
        unlinkSync(testPath)
      }
    })

    it('should skip validation when validate is false', async () => {
      const { writeFileSync, unlinkSync } = await import('fs')
      const { tmpdir } = await import('os')
      const { join } = await import('path')
      
      const testPath = join(tmpdir(), 'no-validate-test.json')
      writeFileSync(testPath, JSON.stringify({
        nodes: [{ id: 'n1' }],
        edges: []
      }))
      
      try {
        // This should not throw even if we had an invalid graph
        const result = await forgeGraph({ 
          source: testPath,
          validate: false 
        })
        
        expect(result).toBeDefined()
      } finally {
        unlinkSync(testPath)
      }
    })
  })

  describe('format-specific loaders', () => {
    it('forgeFromJSON should use json format', async () => {
      const { writeFileSync, unlinkSync } = await import('fs')
      const { tmpdir } = await import('os')
      const { join } = await import('path')
      
      const testPath = join(tmpdir(), 'format-test.json')
      writeFileSync(testPath, JSON.stringify({ nodes: [], edges: [] }))
      
      try {
        const result = await forgeFromJSON(testPath)
        expect(result.metadata.format).toBe('json')
      } finally {
        unlinkSync(testPath)
      }
    })

    it('forgeFromYAML should throw not implemented', async () => {
      await expect(forgeFromYAML('data.yaml')).rejects.toThrow('yaml')
    })

    it('forgeFromCSV should throw not implemented', async () => {
      await expect(forgeFromCSV('data.csv')).rejects.toThrow('csv')
    })

    it('forgeFromGraphML should throw not implemented', async () => {
      await expect(forgeFromGraphML('data.graphml')).rejects.toThrow('graphml')
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

  describe('edge validation', () => {
    it('should warn about edges with invalid node references', async () => {
      const { writeFileSync, unlinkSync } = await import('fs')
      const { tmpdir } = await import('os')
      const { join } = await import('path')
      
      const testPath = join(tmpdir(), 'invalid-edges.json')
      writeFileSync(testPath, JSON.stringify({
        nodes: [{ id: 'n1' }, { id: 'n2' }],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2' }, // valid
          { id: 'e2', source: 'n1', target: 'n3' }, // invalid target
          { id: 'e3', source: 'n4', target: 'n2' }  // invalid source
        ]
      }))
      
      try {
        const result = await forgeGraph({ source: testPath })
        
        // Should only have 1 valid edge
        expect(result.graph.edges).toHaveLength(1)
        expect(result.graph.edges[0].id).toBe('e1')
        
        // Should have warnings about invalid edges
        expect(result.warnings).toHaveLength(2)
        expect(result.warnings[0]).toContain('e2')
        expect(result.warnings[0]).toContain('non-existent')
        expect(result.warnings[1]).toContain('e3')
      } finally {
        unlinkSync(testPath)
      }
    })

    it('should generate IDs when generateIds is true', async () => {
      const { writeFileSync, unlinkSync } = await import('fs')
      const { tmpdir } = await import('os')
      const { join } = await import('path')
      
      const testPath = join(tmpdir(), 'no-ids.json')
      writeFileSync(testPath, JSON.stringify({
        nodes: [{ position: { x: 0, y: 0, z: 0 } }], // no id
        edges: []
      }))
      
      try {
        const result = await forgeGraph({ 
          source: testPath,
          generateIds: true 
        })
        
        // Should have generated an ID
        expect(result.graph.nodes[0].id).toMatch(/^node-\d+-0$/)
      } finally {
        unlinkSync(testPath)
      }
    })
  })
})