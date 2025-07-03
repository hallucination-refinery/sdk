import { describe, it, expect, beforeEach } from 'vitest'
import { createGraphSlice } from './graph-slice'
import type { IdeaNode, Edge } from '@refinery/schema'

describe('GraphSlice', () => {
  let slice: ReturnType<typeof createGraphSlice>
  let setState: any
  let getState: any

  beforeEach(() => {
    const state = createGraphSlice(() => {}, () => slice)
    slice = state
    setState = (fn: any) => {
      const result = fn(slice)
      if (result) Object.assign(slice, result)
    }
    getState = () => slice
    // Re-create slice with proper set/get
    slice = createGraphSlice(setState, getState)
  })

  describe('Node operations', () => {
    it('should add a node', () => {
      const node: IdeaNode = {
        id: 'node-1',
        label: 'Test Node',
        metadata: { type: 'test' }
      }

      const command = slice.addNode(node)

      expect(slice.nodes.get('node-1')).toEqual(node)
      expect(command).toEqual({
        type: 'ADD_NODE',
        payload: { node }
      })
    })

    it('should update a node', () => {
      const node: IdeaNode = {
        id: 'node-1',
        label: 'Test Node',
        metadata: {}
      }
      slice.addNode(node)

      const command = slice.updateNode('node-1', { label: 'Updated' })

      expect(slice.nodes.get('node-1')?.label).toBe('Updated')
      expect(command).toEqual({
        type: 'UPDATE_NODE',
        payload: { id: 'node-1', updates: { label: 'Updated' } }
      })
    })

    it('should return null when updating non-existent node', () => {
      const command = slice.updateNode('non-existent', { label: 'Updated' })
      expect(command).toBeNull()
    })

    it('should remove a node and connected edges', () => {
      const node: IdeaNode = { id: 'node-1', label: 'Node 1', metadata: {} }
      const edge: Edge = { id: 'edge-1', source: 'node-1', target: 'node-2' }
      
      slice.addNode(node)
      slice.addEdge(edge)

      const command = slice.removeNode('node-1')

      expect(slice.nodes.has('node-1')).toBe(false)
      expect(slice.edges.has('edge-1')).toBe(false)
      expect(command).toEqual({
        type: 'REMOVE_NODE',
        payload: { id: 'node-1' }
      })
    })

    it('should batch add nodes', () => {
      const nodes: IdeaNode[] = [
        { id: 'node-1', label: 'Node 1', metadata: {} },
        { id: 'node-2', label: 'Node 2', metadata: {} }
      ]

      const command = slice.batchAddNodes(nodes)

      expect(slice.nodes.size).toBe(2)
      expect(slice.nodes.get('node-1')).toEqual(nodes[0])
      expect(slice.nodes.get('node-2')).toEqual(nodes[1])
      expect(command).toEqual({
        type: 'BATCH_ADD_NODES',
        payload: { nodes }
      })
    })

    it('should batch update nodes', () => {
      slice.batchAddNodes([
        { id: 'node-1', label: 'Node 1', metadata: {} },
        { id: 'node-2', label: 'Node 2', metadata: {} }
      ])

      const updates = [
        { id: 'node-1', updates: { label: 'Updated 1' } },
        { id: 'node-2', updates: { label: 'Updated 2' } }
      ]

      const command = slice.batchUpdateNodes(updates)

      expect(slice.nodes.get('node-1')?.label).toBe('Updated 1')
      expect(slice.nodes.get('node-2')?.label).toBe('Updated 2')
      expect(command).toEqual({
        type: 'BATCH_UPDATE_NODES',
        payload: { updates }
      })
    })

    it('should batch remove nodes and connected edges', () => {
      slice.batchAddNodes([
        { id: 'node-1', label: 'Node 1', metadata: {} },
        { id: 'node-2', label: 'Node 2', metadata: {} },
        { id: 'node-3', label: 'Node 3', metadata: {} }
      ])
      slice.batchAddEdges([
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-2', target: 'node-3' }
      ])

      const command = slice.batchRemoveNodes(['node-1', 'node-2'])

      expect(slice.nodes.size).toBe(1)
      expect(slice.nodes.has('node-3')).toBe(true)
      expect(slice.edges.size).toBe(0) // Both edges should be removed
      expect(command).toEqual({
        type: 'BATCH_REMOVE_NODES',
        payload: { ids: ['node-1', 'node-2'] }
      })
    })
  })

  describe('Edge operations', () => {
    it('should add an edge', () => {
      const edge: Edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      }

      const command = slice.addEdge(edge)

      expect(slice.edges.get('edge-1')).toEqual(edge)
      expect(command).toEqual({
        type: 'ADD_EDGE',
        payload: { edge }
      })
    })

    it('should update an edge', () => {
      const edge: Edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      }
      slice.addEdge(edge)

      const command = slice.updateEdge('edge-1', { metadata: { weight: 1 } })

      expect(slice.edges.get('edge-1')?.metadata).toEqual({ weight: 1 })
      expect(command).toEqual({
        type: 'UPDATE_EDGE',
        payload: { id: 'edge-1', updates: { metadata: { weight: 1 } } }
      })
    })

    it('should remove an edge', () => {
      const edge: Edge = { id: 'edge-1', source: 'node-1', target: 'node-2' }
      slice.addEdge(edge)

      const command = slice.removeEdge('edge-1')

      expect(slice.edges.has('edge-1')).toBe(false)
      expect(command).toEqual({
        type: 'REMOVE_EDGE',
        payload: { id: 'edge-1' }
      })
    })

    it('should batch add edges', () => {
      const edges: Edge[] = [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-2', target: 'node-3' }
      ]

      const command = slice.batchAddEdges(edges)

      expect(slice.edges.size).toBe(2)
      expect(command).toEqual({
        type: 'BATCH_ADD_EDGES',
        payload: { edges }
      })
    })
  })

  describe('Query methods', () => {
    beforeEach(() => {
      slice.batchAddNodes([
        { id: 'node-1', label: 'Node 1', metadata: {} },
        { id: 'node-2', label: 'Node 2', metadata: {} },
        { id: 'node-3', label: 'Node 3', metadata: {} }
      ])
      slice.batchAddEdges([
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-1', target: 'node-3' },
        { id: 'edge-3', source: 'node-2', target: 'node-3' }
      ])
    })

    it('should get a node by id', () => {
      const node = slice.getNode('node-1')
      expect(node?.label).toBe('Node 1')
    })

    it('should get an edge by id', () => {
      const edge = slice.getEdge('edge-1')
      expect(edge?.source).toBe('node-1')
      expect(edge?.target).toBe('node-2')
    })

    it('should get all nodes', () => {
      const nodes = slice.getAllNodes()
      expect(nodes).toHaveLength(3)
    })

    it('should get all edges', () => {
      const edges = slice.getAllEdges()
      expect(edges).toHaveLength(3)
    })

    it('should get edges connected to a node', () => {
      const edges = slice.getNodeEdges('node-1')
      expect(edges).toHaveLength(2)
      expect(edges.every(e => e.source === 'node-1' || e.target === 'node-1')).toBe(true)
    })
  })

  describe('Utility methods', () => {
    it('should clear the graph', () => {
      slice.batchAddNodes([
        { id: 'node-1', label: 'Node 1', metadata: {} },
        { id: 'node-2', label: 'Node 2', metadata: {} }
      ])
      slice.addEdge({ id: 'edge-1', source: 'node-1', target: 'node-2' })

      const commands = slice.clearGraph()

      expect(slice.nodes.size).toBe(0)
      expect(slice.edges.size).toBe(0)
      expect(commands).toHaveLength(2)
      expect(commands[0].type).toBe('BATCH_REMOVE_NODES')
      expect(commands[1].type).toBe('BATCH_REMOVE_EDGES')
    })

    it('should generate unique node ids', () => {
      const id1 = slice.generateNodeId()
      const id2 = slice.generateNodeId()
      
      expect(id1).toBe('node-1')
      expect(id2).toBe('node-2')
      expect(id1).not.toBe(id2)
    })

    it('should generate unique edge ids', () => {
      const id1 = slice.generateEdgeId()
      const id2 = slice.generateEdgeId()
      
      expect(id1).toBe('edge-1')
      expect(id2).toBe('edge-2')
      expect(id1).not.toBe(id2)
    })
  })
})