import { describe, it, expect } from 'vitest'
import * as Schema from '../index'

describe('@refinery/schema exports', () => {
  it('should export version', () => {
    expect(Schema.version).toBe('0.0.0')
  })

  it('should export Zod', () => {
    expect(Schema.z).toBeDefined()
    expect(typeof Schema.z.object).toBe('function')
    expect(typeof Schema.z.string).toBe('function')
  })

  describe('core exports', () => {
    it('should export vector types and utilities', () => {
      expect(Schema.Vector3Schema).toBeDefined()
      expect(Schema.Vector2Schema).toBeDefined()
      expect(Schema.VectorUtils).toBeDefined()
      expect(typeof Schema.VectorUtils.zero3).toBe('function')
    })

    it('should export IdeaNode types and utilities', () => {
      expect(Schema.IdeaNodeSchema).toBeDefined()
      expect(Schema.IdeaNodeMetadataSchema).toBeDefined()
      expect(Schema.CreateIdeaNodeSchema).toBeDefined()
      expect(typeof Schema.isIdeaNode).toBe('function')
      expect(typeof Schema.parseIdeaNode).toBe('function')
      expect(typeof Schema.safeParseIdeaNode).toBe('function')
    })

    it('should export Edge types and utilities', () => {
      expect(Schema.EdgeSchema).toBeDefined()
      expect(Schema.EdgeTypeSchema).toBeDefined()
      expect(Schema.EdgeStrengthSchema).toBeDefined()
      expect(Schema.CreateEdgeSchema).toBeDefined()
      expect(typeof Schema.isEdge).toBe('function')
      expect(typeof Schema.parseEdge).toBe('function')
      expect(typeof Schema.safeParseEdge).toBe('function')
      expect(typeof Schema.edgeConnects).toBe('function')
      expect(typeof Schema.getOtherNode).toBe('function')
    })

    it('should export Graph types and utilities', () => {
      expect(Schema.GraphSchema).toBeDefined()
      expect(Schema.GraphStatsSchema).toBeDefined()
      expect(Schema.NodeNeighborsSchema).toBeDefined()
      expect(Schema.GraphUtils).toBeDefined()
      expect(typeof Schema.GraphUtils.empty).toBe('function')
      expect(typeof Schema.GraphUtils.getNode).toBe('function')
      expect(typeof Schema.GraphUtils.addNode).toBe('function')
    })

    it('should export Selection types and utilities', () => {
      expect(Schema.SelectionSchema).toBeDefined()
      expect(Schema.SelectionOperationSchema).toBeDefined()
      expect(Schema.SelectionChangeEventSchema).toBeDefined()
      expect(Schema.SelectionUtils).toBeDefined()
      expect(typeof Schema.SelectionUtils.empty).toBe('function')
      expect(typeof Schema.SelectionUtils.selectNodes).toBe('function')
    })

    it('should export Layout types and utilities', () => {
      expect(Schema.LayoutTypeSchema).toBeDefined()
      expect(Schema.LayoutConfigSchema).toBeDefined()
      expect(Schema.LayoutStateSchema).toBeDefined()
      expect(Schema.ForceLayoutParamsSchema).toBeDefined()
      expect(Schema.HierarchicalLayoutParamsSchema).toBeDefined()
      expect(Schema.CircularLayoutParamsSchema).toBeDefined()
      expect(Schema.GridLayoutParamsSchema).toBeDefined()
      expect(Schema.DefaultLayouts).toBeDefined()
      expect(typeof Schema.DefaultLayouts.forceDirected).toBe('function')
    })
  })

  describe('TypeScript types', () => {
    it('should allow type usage', () => {
      // Test that types are properly exported (compile-time check)
      const node: Schema.IdeaNode = {
        id: 'test',
        label: 'Test Node',
      }
      expect(node.id).toBe('test')

      const edge: Schema.Edge = {
        id: 'edge-1',
        source: 'n1',
        target: 'n2',
        type: 'relates-to',
        strength: 1,
        directed: false,
        visible: true,
      }
      expect(edge.source).toBe('n1')

      const graph: Schema.Graph = {
        nodes: [node],
        edges: [edge],
      }
      expect(graph.nodes).toHaveLength(1)

      const selection: Schema.Selection = {
        nodeIds: new Set(['n1']),
        edgeIds: new Set(['e1']),
      }
      expect(selection.nodeIds.size).toBe(1)

      const layout: Schema.LayoutConfig = {
        type: 'force-directed',
        params: {
          chargeStrength: -400,
        },
      }
      expect(layout.type).toBe('force-directed')
    })
  })
})