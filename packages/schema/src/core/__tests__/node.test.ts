import { describe, it, expect } from 'vitest'
import {
  NodeSchema,
  NodeMetadataSchema,
  CreateNodeSchema,
  isNode,
  parseNode,
  safeParseNode,
  type Node,
} from '../node'

describe('NodeSchema', () => {
  describe('validation', () => {
    it('should validate minimal valid node', () => {
      const node = {
        id: 'node-1',
        label: 'Test Node',
      }
      const result = NodeSchema.safeParse(node)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('node-1')
        expect(result.data.label).toBe('Test Node')
      }
    })

    it('should validate complete node with all fields', () => {
      const node: Node = {
        id: 'node-1',
        label: 'Test Node',
        content: 'Full description',
        position: { x: 10, y: 20, z: 30 },
        velocity: { x: 1, y: 2, z: 3 },
        color: '#ff0000',
        size: 10,
        selected: true,
        hovered: false,
        fixed: true,
        metadata: { custom: 'value', nested: { data: true } },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T12:00:00.000Z',
      }
      const result = NodeSchema.safeParse(node)
      expect(result.success).toBe(true)
    })

    it('should reject invalid nodes', () => {
      expect(NodeSchema.safeParse({}).success).toBe(false) // missing required fields
      expect(NodeSchema.safeParse({ id: 'node-1' }).success).toBe(false) // missing label
      expect(NodeSchema.safeParse({ label: 'Test' }).success).toBe(false) // missing id
      expect(NodeSchema.safeParse({ id: 123, label: 'Test' }).success).toBe(false) // wrong type
    })

    it('should reject invalid optional fields', () => {
      const base = { id: 'node-1', label: 'Test' }
      
      expect(NodeSchema.safeParse({ ...base, size: -5 }).success).toBe(false) // negative size
      expect(NodeSchema.safeParse({ ...base, position: { x: 1, y: 2 } }).success).toBe(false) // missing z
      expect(NodeSchema.safeParse({ ...base, createdAt: 'invalid-date' }).success).toBe(false)
    })
  })

  describe('metadata validation', () => {
    it('should accept any metadata structure', () => {
      const metadata = {
        string: 'value',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        nested: { deep: { value: 'test' } },
        null: null,
        undefined: undefined,
      }
      const result = NodeMetadataSchema.safeParse(metadata)
      expect(result.success).toBe(true)
    })

    it('should reject non-object metadata', () => {
      expect(NodeMetadataSchema.safeParse('string').success).toBe(false)
      expect(NodeMetadataSchema.safeParse(123).success).toBe(false)
      expect(NodeMetadataSchema.safeParse([]).success).toBe(false)
    })
  })

  describe('CreateNodeSchema', () => {
    it('should require only id and label', () => {
      const node = { id: 'node-1', label: 'Test' }
      expect(CreateNodeSchema.safeParse(node).success).toBe(true)
    })

    it('should accept optional fields', () => {
      const node = {
        id: 'node-1',
        label: 'Test',
        content: 'Description',
        color: '#ff0000',
      }
      expect(CreateNodeSchema.safeParse(node).success).toBe(true)
    })
  })

  describe('utility functions', () => {
    const validNode: Node = {
      id: 'node-1',
      label: 'Test Node',
    }

    const invalidNode = {
      id: 123,
      label: 'Test',
    }

    describe('isNode', () => {
      it('should return true for valid nodes', () => {
        expect(isNode(validNode)).toBe(true)
      })

      it('should return false for invalid nodes', () => {
        expect(isNode(invalidNode)).toBe(false)
        expect(isNode({})).toBe(false)
        expect(isNode(null)).toBe(false)
      })
    })

    describe('parseNode', () => {
      it('should parse valid nodes', () => {
        const parsed = parseNode(validNode)
        expect(parsed.id).toBe('node-1')
        expect(parsed.label).toBe('Test Node')
      })

      it('should throw for invalid nodes', () => {
        expect(() => parseNode(invalidNode)).toThrow()
        expect(() => parseNode({})).toThrow()
      })
    })

    describe('safeParseNode', () => {
      it('should return parsed node for valid input', () => {
        const parsed = safeParseNode(validNode)
        expect(parsed).toBeDefined()
        expect(parsed?.id).toBe('node-1')
      })

      it('should return undefined for invalid input', () => {
        expect(safeParseNode(invalidNode)).toBeUndefined()
        expect(safeParseNode({})).toBeUndefined()
        expect(safeParseNode(null)).toBeUndefined()
      })
    })
  })

  describe('type inference', () => {
    it('should infer correct types', () => {
      const node: Node = {
        id: 'node-1',
        label: 'Test',
        metadata: { custom: 'value' },
      }

      // TypeScript should allow accessing known properties
      expect(node.id).toBe('node-1')
      expect(node.label).toBe('Test')
      expect(node.metadata?.custom).toBe('value')
      
      // Optional properties should be possibly undefined
      expect(node.content).toBeUndefined()
      expect(node.position).toBeUndefined()
    })
  })
})