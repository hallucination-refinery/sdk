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
        content: 'Test Node',
        position: { x: 0, y: 0, z: 0 }
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
        content: 'Test Node',
        position: { x: 0, y: 0, z: 0 }
      }
      slice.addNode(node)

      const command = slice.updateNode({ id: 'node-1', data: { content: 'Updated' } })

      expect(slice.nodes.get('node-1')?.content).toBe('Updated')
      expect(command).toEqual({
        type: 'UPDATE_NODE',
        payload: { id: 'node-1', updates: { content: 'Updated' } }
      })
    })

    it('should return null when updating non-existent node', () => {
      const command = slice.updateNode({ id: 'non-existent', data: { content: 'Updated' } })
      expect(command).toBeNull()
    })

    it('should remove a node and connected edges', () => {
      const node: IdeaNode = { id: 'node-1', label: 'Node 1', content: 'Node 1', position: { x: 0, y: 0, z: 0 } }
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
        { id: 'node-1', label: 'Node 1', content: 'Node 1', position: { x: 0, y: 0, z: 0 } },
        { id: 'node-2', label: 'Node 2', content: 'Node 2', position: { x: 100, y: 100, z: 0 } }
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
        { id: 'node-1', label: 'Node 1', content: 'Node 1', position: { x: 0, y: 0, z: 0 } },
        { id: 'node-2', label: 'Node 2', content: 'Node 2', position: { x: 100, y: 100, z: 0 } }
      ])

      const updates = [
        { id: 'node-1', data: { content: 'Updated 1' } },
        { id: 'node-2', data: { content: 'Updated 2' } }
      ]

      const command = slice.batchUpdateNodes(updates)

      expect(slice.nodes.get('node-1')?.content).toBe('Updated 1')
      expect(slice.nodes.get('node-2')?.content).toBe('Updated 2')
      expect(command).toEqual({
        type: 'BATCH_UPDATE_NODES',
        payload: { updates: [
          { id: 'node-1', updates: { content: 'Updated 1' } },
          { id: 'node-2', updates: { content: 'Updated 2' } }
        ] }
      })
    })

    it('should batch remove nodes and connected edges', () => {
      slice.batchAddNodes([
        { id: 'node-1', label: 'Node 1', content: 'Node 1', position: { x: 0, y: 0, z: 0 } },
        { id: 'node-2', label: 'Node 2', content: 'Node 2', position: { x: 100, y: 100, z: 0 } },
        { id: 'node-3', label: 'Node 3', content: 'Node 3', position: { x: 200, y: 200, z: 0 } }
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

      // After parsing, edge should have defaults applied
      const expectedEdge = {
        ...edge,
        type: 'relates-to',
        strength: 1,
        directed: false,
        visible: true
      }

      expect(slice.edges.get('edge-1')).toEqual(expectedEdge)
      expect(command).toEqual({
        type: 'ADD_EDGE',
        payload: { edge: expectedEdge }
      })
    })

    it('should update an edge', () => {
      const edge: Edge = {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      }
      slice.addEdge(edge)

      const command = slice.updateEdge({ id: 'edge-1', data: { metadata: { weight: 1 } } })

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

      // After parsing, edges should have defaults applied
      const expectedEdges = edges.map(edge => ({
        ...edge,
        type: 'relates-to',
        strength: 1,
        directed: false,
        visible: true
      }))

      expect(slice.edges.size).toBe(2)
      expect(command).toEqual({
        type: 'BATCH_ADD_EDGES',
        payload: { edges: expectedEdges }
      })
    })
  })

  describe('Query methods', () => {
    beforeEach(() => {
      slice.batchAddNodes([
        { id: 'node-1', label: 'Node 1', content: 'Node 1', position: { x: 0, y: 0, z: 0 } },
        { id: 'node-2', label: 'Node 2', content: 'Node 2', position: { x: 100, y: 100, z: 0 } },
        { id: 'node-3', label: 'Node 3', content: 'Node 3', position: { x: 200, y: 200, z: 0 } }
      ])
      slice.batchAddEdges([
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-1', target: 'node-3' },
        { id: 'edge-3', source: 'node-2', target: 'node-3' }
      ])
    })

    it('should get a node by id', () => {
      const node = slice.getNode('node-1')
      expect(node?.content).toBe('Node 1')
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
        { id: 'node-1', label: 'Node 1', content: 'Node 1', position: { x: 0, y: 0, z: 0 } },
        { id: 'node-2', label: 'Node 2', content: 'Node 2', position: { x: 100, y: 100, z: 0 } }
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