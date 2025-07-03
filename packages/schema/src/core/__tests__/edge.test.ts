import { describe, it, expect } from 'vitest'
import {
  EdgeSchema,
  EdgeTypeSchema,
  EdgeStrengthSchema,
  CreateEdgeSchema,
  isEdge,
  parseEdge,
  safeParseEdge,
  edgeConnects,
  getOtherNode,
  type Edge,
} from '../edge'

describe('EdgeSchema', () => {
  describe('validation', () => {
    it('should validate minimal valid edge', () => {
      const edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
      }
      const result = EdgeSchema.safeParse(edge)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.type).toBe('relates-to') // default
        expect(result.data.strength).toBe(1) // default
        expect(result.data.directed).toBe(false) // default
        expect(result.data.visible).toBe(true) // default
      }
    })

    it('should validate complete edge with all fields', () => {
      const edge: Edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'depends-on',
        label: 'Strong dependency',
        strength: 0.8,
        directed: true,
        color: '#0000ff',
        width: 2,
        selected: true,
        hovered: false,
        visible: true,
        metadata: { priority: 'high', tags: ['critical'] },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
      }
      const result = EdgeSchema.safeParse(edge)
      expect(result.success).toBe(true)
    })

    it('should reject invalid edges', () => {
      expect(EdgeSchema.safeParse({}).success).toBe(false) // missing required fields
      expect(EdgeSchema.safeParse({ id: 'e1', source: 'n1' }).success).toBe(false) // missing target
      expect(EdgeSchema.safeParse({ id: 'e1', target: 'n2' }).success).toBe(false) // missing source
    })

    it('should reject invalid field values', () => {
      const base = { id: 'e1', source: 'n1', target: 'n2' }
      
      expect(EdgeSchema.safeParse({ ...base, strength: -0.5 }).success).toBe(false) // negative
      expect(EdgeSchema.safeParse({ ...base, strength: 1.5 }).success).toBe(false) // > 1
      expect(EdgeSchema.safeParse({ ...base, width: -2 }).success).toBe(false) // negative width
      expect(EdgeSchema.safeParse({ ...base, type: 'invalid-type' }).success).toBe(false)
    })
  })

  describe('EdgeTypeSchema', () => {
    it('should accept valid edge types', () => {
      const validTypes = [
        'relates-to',
        'depends-on',
        'contains',
        'references',
        'conflicts-with',
        'supports',
        'opposes',
        'derived-from',
        'implements',
        'extends',
        'custom',
      ]
      
      validTypes.forEach(type => {
        expect(EdgeTypeSchema.safeParse(type).success).toBe(true)
      })
    })

    it('should reject invalid edge types', () => {
      expect(EdgeTypeSchema.safeParse('invalid').success).toBe(false)
      expect(EdgeTypeSchema.safeParse('').success).toBe(false)
      expect(EdgeTypeSchema.safeParse(123).success).toBe(false)
    })
  })

  describe('EdgeStrengthSchema', () => {
    it('should accept valid strengths', () => {
      expect(EdgeStrengthSchema.safeParse(0).success).toBe(true)
      expect(EdgeStrengthSchema.safeParse(0.5).success).toBe(true)
      expect(EdgeStrengthSchema.safeParse(1).success).toBe(true)
    })

    it('should reject invalid strengths', () => {
      expect(EdgeStrengthSchema.safeParse(-0.1).success).toBe(false)
      expect(EdgeStrengthSchema.safeParse(1.1).success).toBe(false)
      expect(EdgeStrengthSchema.safeParse('0.5').success).toBe(false)
    })

    it('should provide default value', () => {
      const result = EdgeStrengthSchema.safeParse(undefined)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe(1)
      }
    })
  })

  describe('CreateEdgeSchema', () => {
    it('should require only essential fields', () => {
      const edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
      }
      expect(CreateEdgeSchema.safeParse(edge).success).toBe(true)
    })

    it('should accept optional fields', () => {
      const edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
        type: 'depends-on',
        strength: 0.7,
        directed: true,
      }
      expect(CreateEdgeSchema.safeParse(edge).success).toBe(true)
    })
  })

  describe('utility functions', () => {
    const validEdge: Edge = {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      type: 'relates-to',
      strength: 1,
      directed: false,
      visible: true,
    }

    describe('isEdge', () => {
      it('should identify valid edges', () => {
        expect(isEdge(validEdge)).toBe(true)
        expect(isEdge({ id: 'e1', source: 'n1', target: 'n2' })).toBe(true)
      })

      it('should reject invalid edges', () => {
        expect(isEdge({})).toBe(false)
        expect(isEdge(null)).toBe(false)
        expect(isEdge({ id: 'e1', source: 'n1' })).toBe(false)
      })
    })

    describe('parseEdge', () => {
      it('should parse valid edges', () => {
        const parsed = parseEdge(validEdge)
        expect(parsed.id).toBe('edge-1')
        expect(parsed.source).toBe('node-1')
        expect(parsed.target).toBe('node-2')
      })

      it('should throw for invalid edges', () => {
        expect(() => parseEdge({})).toThrow()
        expect(() => parseEdge({ id: 'e1' })).toThrow()
      })
    })

    describe('safeParseEdge', () => {
      it('should return parsed edge for valid input', () => {
        const parsed = safeParseEdge(validEdge)
        expect(parsed).toBeDefined()
        expect(parsed?.id).toBe('edge-1')
      })

      it('should return undefined for invalid input', () => {
        expect(safeParseEdge({})).toBeUndefined()
        expect(safeParseEdge(null)).toBeUndefined()
      })
    })

    describe('edgeConnects', () => {
      it('should check undirected edge connections', () => {
        const edge: Edge = {
          ...validEdge,
          directed: false,
        }
        
        expect(edgeConnects(edge, 'node-1', 'node-2')).toBe(true)
        expect(edgeConnects(edge, 'node-2', 'node-1')).toBe(true) // either direction
        expect(edgeConnects(edge, 'node-1', 'node-3')).toBe(false)
        expect(edgeConnects(edge, 'node-3', 'node-4')).toBe(false)
      })

      it('should check directed edge connections', () => {
        const edge: Edge = {
          ...validEdge,
          directed: true,
        }
        
        expect(edgeConnects(edge, 'node-1', 'node-2')).toBe(true)
        expect(edgeConnects(edge, 'node-2', 'node-1')).toBe(false) // direction matters
      })
    })

    describe('getOtherNode', () => {
      it('should return the other node', () => {
        expect(getOtherNode(validEdge, 'node-1')).toBe('node-2')
        expect(getOtherNode(validEdge, 'node-2')).toBe('node-1')
      })

      it('should return undefined for unconnected nodes', () => {
        expect(getOtherNode(validEdge, 'node-3')).toBeUndefined()
      })
    })
  })
})