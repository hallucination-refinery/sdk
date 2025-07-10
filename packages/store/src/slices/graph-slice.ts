/**
 * Graph slice - manages nodes and edges state
 */

import { produce } from 'immer'
import type { IdeaNode, Edge } from '@refinery/schema'
import { EdgeSchema } from '@refinery/schema'
import type { GraphState } from '../types/state'
import type { RendererCommand } from '../types/renderer-commands'
import { 
  createValidatedAction,
  AddNodePayloadSchema,
  UpdateNodePayloadSchema,
  RemoveNodePayloadSchema,
  BatchAddNodesPayloadSchema,
  BatchUpdateNodesPayloadSchema,
  BatchRemoveNodesPayloadSchema,
  AddEdgePayloadSchema,
  UpdateEdgePayloadSchema,
  RemoveEdgePayloadSchema,
  BatchAddEdgesPayloadSchema,
  BatchUpdateEdgesPayloadSchema,
  BatchRemoveEdgesPayloadSchema
} from '../validation'

export interface GraphSlice extends GraphState {
  // Node actions
  addNode: (node: IdeaNode) => RendererCommand
  updateNode: (payload: { id: string; data: Partial<IdeaNode> }) => RendererCommand | null
  removeNode: (id: string) => RendererCommand | null
  batchAddNodes: (nodes: IdeaNode[]) => RendererCommand
  batchUpdateNodes: (updates: Array<{ id: string; data: Partial<IdeaNode> }>) => RendererCommand
  batchRemoveNodes: (ids: string[]) => RendererCommand
  
  // Edge actions
  addEdge: (edge: Edge) => RendererCommand
  updateEdge: (payload: { id: string; data: Partial<Edge> }) => RendererCommand | null
  removeEdge: (id: string) => RendererCommand | null
  batchAddEdges: (edges: Edge[]) => RendererCommand
  batchUpdateEdges: (updates: Array<{ id: string; data: Partial<Edge> }>) => RendererCommand
  batchRemoveEdges: (ids: string[]) => RendererCommand
  
  // Query methods
  getNode: (id: string) => IdeaNode | undefined
  getEdge: (id: string) => Edge | undefined
  getAllNodes: () => IdeaNode[]
  getAllEdges: () => Edge[]
  getNodeEdges: (nodeId: string) => Edge[]
  
  // Utility methods
  clearGraph: () => RendererCommand[]
  generateNodeId: () => string
  generateEdgeId: () => string
}

export const createGraphSlice = (set: any, get: any): GraphSlice => ({
  // Initial state
  nodes: new Map(),
  edges: new Map(),
  nodeIdCounter: 0,
  edgeIdCounter: 0,

  // Node actions
  addNode: createValidatedAction('addNode', AddNodePayloadSchema, (node) => {
    set(
      produce((state: GraphSlice) => {
        state.nodes.set(node.id, node)
      })
    )
    return { type: 'ADD_NODE', payload: { node } }
  }),

  updateNode: createValidatedAction('updateNode', UpdateNodePayloadSchema, ({ id, data }) => {
    const node = get().nodes.get(id)
    if (!node) return null

    set(
      produce((state: GraphSlice) => {
        const existing = state.nodes.get(id)
        if (existing) {
          state.nodes.set(id, { ...existing, ...data })
        }
      })
    )
    return { type: 'UPDATE_NODE', payload: { id, updates: data } }
  }),

  removeNode: createValidatedAction('removeNode', RemoveNodePayloadSchema, (id) => {
    const node = get().nodes.get(id)
    if (!node) return null

    set(
      produce((state: GraphSlice) => {
        state.nodes.delete(id)
        // Remove connected edges
        for (const [edgeId, edge] of state.edges) {
          if (edge.source === id || edge.target === id) {
            state.edges.delete(edgeId)
          }
        }
      })
    )
    return { type: 'REMOVE_NODE', payload: { id } }
  }),

  batchAddNodes: createValidatedAction('batchAddNodes', BatchAddNodesPayloadSchema, (nodes) => {
    set(
      produce((state: GraphSlice) => {
        for (const node of nodes) {
          state.nodes.set(node.id, node)
        }
      })
    )
    return { type: 'BATCH_ADD_NODES', payload: { nodes } }
  }),

  batchUpdateNodes: createValidatedAction('batchUpdateNodes', BatchUpdateNodesPayloadSchema, (updates) => {
    set(
      produce((state: GraphSlice) => {
        for (const { id, data } of updates) {
          const existing = state.nodes.get(id)
          if (existing) {
            state.nodes.set(id, { ...existing, ...data })
          }
        }
      })
    )
    return { type: 'BATCH_UPDATE_NODES', payload: { updates: updates.map(u => ({ id: u.id, updates: u.data })) } }
  }),

  batchRemoveNodes: createValidatedAction('batchRemoveNodes', BatchRemoveNodesPayloadSchema, (ids) => {
    set(
      produce((state: GraphSlice) => {
        for (const id of ids) {
          state.nodes.delete(id)
        }
        // Remove connected edges
        for (const [edgeId, edge] of state.edges) {
          if (ids.includes(edge.source) || ids.includes(edge.target)) {
            state.edges.delete(edgeId)
          }
        }
      })
    )
    return { type: 'BATCH_REMOVE_NODES', payload: { ids } }
  }),

  // Edge actions
  addEdge: createValidatedAction('addEdge', AddEdgePayloadSchema, (edge) => {
    // Parse edge to apply defaults
    const parsedEdge = EdgeSchema.parse(edge) as Edge
    set(
      produce((state: GraphSlice) => {
        state.edges.set(parsedEdge.id, parsedEdge)
      })
    )
    return { type: 'ADD_EDGE', payload: { edge: parsedEdge } }
  }),

  updateEdge: createValidatedAction('updateEdge', UpdateEdgePayloadSchema, ({ id, data }) => {
    const edge = get().edges.get(id)
    if (!edge) return null

    set(
      produce((state: GraphSlice) => {
        const existing = state.edges.get(id)
        if (existing) {
          state.edges.set(id, { ...existing, ...data })
        }
      })
    )
    return { type: 'UPDATE_EDGE', payload: { id, updates: data } }
  }),

  removeEdge: createValidatedAction('removeEdge', RemoveEdgePayloadSchema, (id) => {
    const edge = get().edges.get(id)
    if (!edge) return null

    set(
      produce((state: GraphSlice) => {
        state.edges.delete(id)
      })
    )
    return { type: 'REMOVE_EDGE', payload: { id } }
  }),

  batchAddEdges: createValidatedAction('batchAddEdges', BatchAddEdgesPayloadSchema, (edges) => {
    // Parse edges to apply defaults
    const parsedEdges = edges.map(edge => EdgeSchema.parse(edge) as Edge)
    set(
      produce((state: GraphSlice) => {
        for (const edge of parsedEdges) {
          state.edges.set(edge.id, edge)
        }
      })
    )
    return { type: 'BATCH_ADD_EDGES', payload: { edges: parsedEdges } }
  }),

  batchUpdateEdges: createValidatedAction('batchUpdateEdges', BatchUpdateEdgesPayloadSchema, (updates) => {
    set(
      produce((state: GraphSlice) => {
        for (const { id, data } of updates) {
          const existing = state.edges.get(id)
          if (existing) {
            state.edges.set(id, { ...existing, ...data })
          }
        }
      })
    )
    return { type: 'BATCH_UPDATE_EDGES', payload: { updates: updates.map(u => ({ id: u.id, updates: u.data })) } }
  }),

  batchRemoveEdges: createValidatedAction('batchRemoveEdges', BatchRemoveEdgesPayloadSchema, (ids) => {
    set(
      produce((state: GraphSlice) => {
        for (const id of ids) {
          state.edges.delete(id)
        }
      })
    )
    return { type: 'BATCH_REMOVE_EDGES', payload: { ids } }
  }),

  // Query methods
  getNode: (id) => get().nodes.get(id),
  getEdge: (id) => get().edges.get(id),
  getAllNodes: () => Array.from(get().nodes.values()),
  getAllEdges: () => Array.from(get().edges.values()),
  getNodeEdges: (nodeId) => {
    const edges = Array.from(get().edges.values()) as Edge[]
    return edges.filter(edge => edge.source === nodeId || edge.target === nodeId)
  },

  // Utility methods
  clearGraph: () => {
    const nodeIds = Array.from(get().nodes.keys()) as string[]
    const edgeIds = Array.from(get().edges.keys()) as string[]
    
    set(
      produce((state: GraphSlice) => {
        state.nodes.clear()
        state.edges.clear()
      })
    )
    
    const commands: RendererCommand[] = [
      { type: 'BATCH_REMOVE_NODES', payload: { ids: nodeIds } },
      { type: 'BATCH_REMOVE_EDGES', payload: { ids: edgeIds } }
    ]
    return commands
  },

  generateNodeId: () => {
    set(
      produce((state: GraphSlice) => {
        state.nodeIdCounter += 1
      })
    )
    return `node-${get().nodeIdCounter}`
  },

  generateEdgeId: () => {
    set(
      produce((state: GraphSlice) => {
        state.edgeIdCounter += 1
      })
    )
    return `edge-${get().edgeIdCounter}`
  }
})