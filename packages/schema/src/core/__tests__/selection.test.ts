import { describe, it, expect } from 'vitest'
import {
  SelectionSchema,
  SelectionUtils,
  type Selection,
} from '../selection'

describe('SelectionSchema', () => {
  describe('validation', () => {
    it('should validate empty selection', () => {
      const selection = {
        nodeIds: new Set<string>(),
        edgeIds: new Set<string>(),
      }
      const result = SelectionSchema.safeParse(selection)
      expect(result.success).toBe(true)
    })

    it('should validate selection with items', () => {
      const selection: Selection = {
        nodeIds: new Set(['n1', 'n2']),
        edgeIds: new Set(['e1']),
        primaryNodeId: 'n1',
        lastModified: '2025-01-01T00:00:00.000Z',
      }
      const result = SelectionSchema.safeParse(selection)
      expect(result.success).toBe(true)
    })

    it('should reject invalid selections', () => {
      expect(SelectionSchema.safeParse({}).success).toBe(false)
      expect(SelectionSchema.safeParse({ nodeIds: [] }).success).toBe(false) // should be Set
      expect(SelectionSchema.safeParse({ nodeIds: new Set(), edgeIds: [] }).success).toBe(false)
    })
  })
})

describe('SelectionUtils', () => {
  describe('creation and checking', () => {
    it('should create empty selection', () => {
      const selection = SelectionUtils.empty()
      expect(selection.nodeIds.size).toBe(0)
      expect(selection.edgeIds.size).toBe(0)
      expect(selection.primaryNodeId).toBeUndefined()
    })

    it('should check if selection is empty', () => {
      expect(SelectionUtils.isEmpty(SelectionUtils.empty())).toBe(true)
      
      const nonEmpty: Selection = {
        nodeIds: new Set(['n1']),
        edgeIds: new Set(),
      }
      expect(SelectionUtils.isEmpty(nonEmpty)).toBe(false)
    })

    it('should check node selection', () => {
      const selection: Selection = {
        nodeIds: new Set(['n1', 'n2']),
        edgeIds: new Set(),
      }
      
      expect(SelectionUtils.isNodeSelected(selection, 'n1')).toBe(true)
      expect(SelectionUtils.isNodeSelected(selection, 'n3')).toBe(false)
    })

    it('should check edge selection', () => {
      const selection: Selection = {
        nodeIds: new Set(),
        edgeIds: new Set(['e1', 'e2']),
      }
      
      expect(SelectionUtils.isEdgeSelected(selection, 'e1')).toBe(true)
      expect(SelectionUtils.isEdgeSelected(selection, 'e3')).toBe(false)
    })
  })

  describe('select operations', () => {
    it('should select nodes (replace)', () => {
      const selection = SelectionUtils.selectNodes(['n1', 'n2'])
      
      expect(selection.nodeIds.size).toBe(2)
      expect(selection.nodeIds.has('n1')).toBe(true)
      expect(selection.nodeIds.has('n2')).toBe(true)
      expect(selection.edgeIds.size).toBe(0)
      expect(selection.primaryNodeId).toBe('n1')
      expect(selection.lastModified).toBeDefined()
    })

    it('should select edges (replace)', () => {
      const selection = SelectionUtils.selectEdges(['e1', 'e2'])
      
      expect(selection.edgeIds.size).toBe(2)
      expect(selection.edgeIds.has('e1')).toBe(true)
      expect(selection.edgeIds.has('e2')).toBe(true)
      expect(selection.nodeIds.size).toBe(0)
    })
  })

  describe('add operations', () => {
    it('should add nodes to selection', () => {
      const initial: Selection = {
        nodeIds: new Set(['n1']),
        edgeIds: new Set(),
        primaryNodeId: 'n1',
      }
      
      const updated = SelectionUtils.addNodes(initial, ['n2', 'n3'])
      
      expect(updated.nodeIds.size).toBe(3)
      expect(updated.nodeIds.has('n1')).toBe(true)
      expect(updated.nodeIds.has('n2')).toBe(true)
      expect(updated.nodeIds.has('n3')).toBe(true)
      expect(updated.primaryNodeId).toBe('n1') // preserved
    })

    it('should set primary node when adding to empty selection', () => {
      const empty = SelectionUtils.empty()
      const updated = SelectionUtils.addNodes(empty, ['n1', 'n2'])
      
      expect(updated.primaryNodeId).toBe('n1')
    })

    it('should add edges to selection', () => {
      const initial: Selection = {
        nodeIds: new Set(),
        edgeIds: new Set(['e1']),
      }
      
      const updated = SelectionUtils.addEdges(initial, ['e2', 'e3'])
      
      expect(updated.edgeIds.size).toBe(3)
      expect(updated.edgeIds.has('e1')).toBe(true)
      expect(updated.edgeIds.has('e2')).toBe(true)
      expect(updated.edgeIds.has('e3')).toBe(true)
    })
  })

  describe('remove operations', () => {
    it('should remove nodes from selection', () => {
      const initial: Selection = {
        nodeIds: new Set(['n1', 'n2', 'n3']),
        edgeIds: new Set(),
        primaryNodeId: 'n1',
      }
      
      const updated = SelectionUtils.removeNodes(initial, ['n1', 'n3'])
      
      expect(updated.nodeIds.size).toBe(1)
      expect(updated.nodeIds.has('n2')).toBe(true)
      expect(updated.primaryNodeId).toBe('n2') // updated since n1 was removed
    })

    it('should clear primary node when all nodes removed', () => {
      const initial: Selection = {
        nodeIds: new Set(['n1']),
        edgeIds: new Set(),
        primaryNodeId: 'n1',
      }
      
      const updated = SelectionUtils.removeNodes(initial, ['n1'])
      
      expect(updated.nodeIds.size).toBe(0)
      expect(updated.primaryNodeId).toBeUndefined()
    })

    it('should remove edges from selection', () => {
      const initial: Selection = {
        nodeIds: new Set(),
        edgeIds: new Set(['e1', 'e2', 'e3']),
      }
      
      const updated = SelectionUtils.removeEdges(initial, ['e1', 'e3'])
      
      expect(updated.edgeIds.size).toBe(1)
      expect(updated.edgeIds.has('e2')).toBe(true)
    })
  })

  describe('toggle operations', () => {
    it('should toggle node selection', () => {
      const initial: Selection = {
        nodeIds: new Set(['n1', 'n3']),
        edgeIds: new Set(),
        primaryNodeId: 'n1',
      }
      
      // Toggle n1 (remove), n2 (add), n3 (remove)
      const updated = SelectionUtils.toggleNodes(initial, ['n1', 'n2', 'n3'])
      
      expect(updated.nodeIds.size).toBe(1)
      expect(updated.nodeIds.has('n2')).toBe(true)
      expect(updated.primaryNodeId).toBe('n2') // updated since n1 was removed
    })

    it('should toggle edge selection', () => {
      const initial: Selection = {
        nodeIds: new Set(),
        edgeIds: new Set(['e1', 'e3']),
      }
      
      // Toggle e1 (remove), e2 (add), e3 (remove)
      const updated = SelectionUtils.toggleEdges(initial, ['e1', 'e2', 'e3'])
      
      expect(updated.edgeIds.size).toBe(1)
      expect(updated.edgeIds.has('e2')).toBe(true)
    })
  })

  describe('clear and counts', () => {
    it('should clear all selections', () => {
      const selection = SelectionUtils.clear()
      
      expect(selection.nodeIds.size).toBe(0)
      expect(selection.edgeIds.size).toBe(0)
      expect(selection.primaryNodeId).toBeUndefined()
      expect(selection.lastModified).toBeDefined()
    })

    it('should get selection counts', () => {
      const selection: Selection = {
        nodeIds: new Set(['n1', 'n2', 'n3']),
        edgeIds: new Set(['e1', 'e2']),
      }
      
      const counts = SelectionUtils.getCounts(selection)
      expect(counts.nodes).toBe(3)
      expect(counts.edges).toBe(2)
    })
  })
})