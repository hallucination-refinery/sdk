/**
 * Graph slice - manages nodes and edges state
 */

import { produce } from 'immer'
import type { IdeaNode, Edge } from '@refinery/schema'
import type { GraphState } from '../types/state'
import type { RendererCommand } from '../types/renderer-commands'

// Helper to increment version for structural mutations
const incrementVersion = (state: GraphSlice) => {
  state.graphVersion = (state.graphVersion ?? 0) + 1
  // Temporary alias until all callers migrate
  // @ts-expect-error temporary alias property for migration
  state.version = state.graphVersion
}

export interface GraphSlice extends GraphState {
  // Node actions
  addNode: (node: IdeaNode) => RendererCommand
  updateNode: (id: string, updates: Partial<IdeaNode>) => RendererCommand | null
  removeNode: (id: string) => RendererCommand | null
  batchAddNodes: (nodes: IdeaNode[]) => RendererCommand
  batchUpdateNodes: (updates: Array<{ id: string; updates: Partial<IdeaNode> }>) => RendererCommand
  batchRemoveNodes: (ids: string[]) => RendererCommand

  // Edge actions
  addEdge: (edge: Edge) => RendererCommand
  updateEdge: (id: string, updates: Partial<Edge>) => RendererCommand | null
  removeEdge: (id: string) => RendererCommand | null
  batchAddEdges: (edges: Edge[]) => RendererCommand
  batchUpdateEdges: (updates: Array<{ id: string; updates: Partial<Edge> }>) => RendererCommand
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
  graphVersion: 0,
  // Temporary alias field – remove after migration
  // @ts-expect-error temporary alias property for migration
  version: 0,

  // Node actions
  addNode: (node) => {
    set(
      produce((state: GraphSlice) => {
        state.nodes.set(node.id, node)
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'ADD_NODE', payload: { node } }
  },

  updateNode: (id, updates) => {
    const node = get().nodes.get(id)
    if (!node) return null

    set(
      produce((state: GraphSlice) => {
        const existing = state.nodes.get(id)
        if (existing) {
          state.nodes.set(id, { ...existing, ...updates })
        }
      })
    )
    return { type: 'UPDATE_NODE', payload: { id, updates } }
  },

  removeNode: (id) => {
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
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'REMOVE_NODE', payload: { id } }
  },

  batchAddNodes: (nodes) => {
    set(
      produce((state: GraphSlice) => {
        for (const node of nodes) {
          state.nodes.set(node.id, node)
        }
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'BATCH_ADD_NODES', payload: { nodes } }
  },

  batchUpdateNodes: (updates) => {
    set(
      produce((state: GraphSlice) => {
        for (const { id, updates: nodeUpdates } of updates) {
          const existing = state.nodes.get(id)
          if (existing) {
            state.nodes.set(id, { ...existing, ...nodeUpdates })
          }
        }
      })
    )
    return { type: 'BATCH_UPDATE_NODES', payload: { updates } }
  },

  batchRemoveNodes: (ids) => {
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
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'BATCH_REMOVE_NODES', payload: { ids } }
  },

  // Edge actions
  addEdge: (edge) => {
    set(
      produce((state: GraphSlice) => {
        state.edges.set(edge.id, edge)
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'ADD_EDGE', payload: { edge } }
  },

  updateEdge: (id, updates) => {
    const edge = get().edges.get(id)
    if (!edge) return null

    set(
      produce((state: GraphSlice) => {
        const existing = state.edges.get(id)
        if (existing) {
          state.edges.set(id, { ...existing, ...updates })
        }
      })
    )
    return { type: 'UPDATE_EDGE', payload: { id, updates } }
  },

  removeEdge: (id) => {
    const edge = get().edges.get(id)
    if (!edge) return null

    set(
      produce((state: GraphSlice) => {
        state.edges.delete(id)
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'REMOVE_EDGE', payload: { id } }
  },

  batchAddEdges: (edges) => {
    set(
      produce((state: GraphSlice) => {
        for (const edge of edges) {
          state.edges.set(edge.id, edge)
        }
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'BATCH_ADD_EDGES', payload: { edges } }
  },

  batchUpdateEdges: (updates) => {
    set(
      produce((state: GraphSlice) => {
        for (const { id, updates: edgeUpdates } of updates) {
          const existing = state.edges.get(id)
          if (existing) {
            state.edges.set(id, { ...existing, ...edgeUpdates })
          }
        }
      })
    )
    return { type: 'BATCH_UPDATE_EDGES', payload: { updates } }
  },

  batchRemoveEdges: (ids) => {
    set(
      produce((state: GraphSlice) => {
        for (const id of ids) {
          state.edges.delete(id)
        }
        incrementVersion(state) // Structural mutation
      })
    )
    return { type: 'BATCH_REMOVE_EDGES', payload: { ids } }
  },

  // Query methods
  getNode: (id) => get().nodes.get(id),
  getEdge: (id) => get().edges.get(id),
  getAllNodes: () => Array.from(get().nodes.values()),
  getAllEdges: () => Array.from(get().edges.values()),
  getNodeEdges: (nodeId) => {
    const edges = Array.from(get().edges.values()) as Edge[]
    return edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)
  },

  // Utility methods
  clearGraph: () => {
    const nodeIds = Array.from(get().nodes.keys()) as string[]
    const edgeIds = Array.from(get().edges.keys()) as string[]

    set(
      produce((state: GraphSlice) => {
        state.nodes.clear()
        state.edges.clear()
        incrementVersion(state) // Structural mutation
      })
    )

    const commands: RendererCommand[] = [
      { type: 'BATCH_REMOVE_NODES', payload: { ids: nodeIds } },
      { type: 'BATCH_REMOVE_EDGES', payload: { ids: edgeIds } },
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
  },
})
