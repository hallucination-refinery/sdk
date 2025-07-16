/**
 * Persistence helpers for saving and loading store state
 */

import type { IdeaNode, Edge, Graph } from '@refinery/schema'
import type { RefineryStore } from './store'
import type { GraphState, UIState } from './types/state'

// Serializable state format
export interface SerializedState {
  version: string
  timestamp: number
  graph: {
    nodes: IdeaNode[]
    edges: Edge[]
    nodeIdCounter: number
    edgeIdCounter: number
  }
  ui?: {
    selectedNodeIds: string[]
    selectedEdgeIds: string[]
    camera: {
      position: { x: number; y: number; z: number }
      zoom: number
    }
    layout: {
      type: 'force' | 'radial' | 'hierarchical'
      isPaused: boolean
    }
    theme: {
      mode: 'light' | 'dark' | 'custom'
      customTheme?: Record<string, unknown>
    }
  }
}

// Export functions
export function serializeState(store: RefineryStore, includeUI = false): SerializedState {
  const state: SerializedState = {
    version: '1.0.0',
    timestamp: Date.now(),
    graph: {
      nodes: Array.from(store.nodes.values()),
      edges: Array.from(store.edges.values()),
      nodeIdCounter: store.nodeIdCounter,
      edgeIdCounter: store.edgeIdCounter
    }
  }

  if (includeUI) {
    state.ui = {
      selectedNodeIds: Array.from(store.selectedNodeIds),
      selectedEdgeIds: Array.from(store.selectedEdgeIds),
      camera: { ...store.camera },
      layout: { ...store.layout },
      theme: { ...store.theme }
    }
  }

  return state
}

export function serializeToJSON(store: RefineryStore, includeUI = false): string {
  return JSON.stringify(serializeState(store, includeUI), null, 2)
}

// Import functions
export function deserializeState(data: SerializedState): {
  graph: Partial<GraphState>
  ui?: Partial<UIState>
} {
  const result: {
    graph: Partial<GraphState>
    ui?: Partial<UIState>
  } = {
    graph: {
      nodes: new Map(data.graph.nodes.map(node => [node.id, node])),
      edges: new Map(data.graph.edges.map(edge => [edge.id, edge])),
      nodeIdCounter: data.graph.nodeIdCounter,
      edgeIdCounter: data.graph.edgeIdCounter
    }
  }

  if (data.ui) {
    result.ui = {
      selectedNodeIds: new Set(data.ui.selectedNodeIds),
      selectedEdgeIds: new Set(data.ui.selectedEdgeIds),
      camera: data.ui.camera,
      layout: data.ui.layout,
      theme: data.ui.theme,
      hoveredNodeId: null,
      hoveredEdgeId: null,
      highlights: {
        nodes: new Map(),
        edges: new Map()
      }
    }
  }

  return result
}

export function deserializeFromJSON(json: string): {
  graph: Partial<GraphState>
  ui?: Partial<UIState>
} {
  const data = JSON.parse(json) as SerializedState
  return deserializeState(data)
}

// Graph format converters
export function toGraphFormat(store: RefineryStore): Graph {
  return {
    nodes: Array.from(store.nodes.values()),
    edges: Array.from(store.edges.values())
  }
}

export function fromGraphFormat(graph: Graph): {
  nodes: Map<string, IdeaNode>
  edges: Map<string, Edge>
} {
  return {
    nodes: new Map(graph.nodes.map(node => [node.id, node])),
    edges: new Map(graph.edges.map(edge => [edge.id, edge]))
  }
}

// LocalStorage helpers
const STORAGE_KEY = 'refinery-store-state'

export function saveToLocalStorage(store: RefineryStore, includeUI = false): void {
  try {
    const serialized = serializeToJSON(store, includeUI)
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save state to localStorage:', error)
  }
}

export function loadFromLocalStorage(): {
  graph: Partial<GraphState>
  ui?: Partial<UIState>
} | null {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null
    
    return deserializeFromJSON(serialized)
  } catch (error) {
    console.error('Failed to load state from localStorage:', error)
    return null
  }
}

export function clearLocalStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

// File export/import helpers
export function exportToFile(store: RefineryStore, filename = 'graph-export.json', includeUI = false): void {
  const serialized = serializeToJSON(store, includeUI)
  const blob = new Blob([serialized], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function importFromFile(file: File): Promise<{
  graph: Partial<GraphState>
  ui?: Partial<UIState>
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string
        const state = deserializeFromJSON(json)
        resolve(state)
      } catch (error) {
        reject(new Error(`Failed to parse file: ${error}`))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsText(file)
  })
}

// Validation helpers
export function validateSerializedState(data: unknown): data is SerializedState {
  if (!data || typeof data !== 'object') return false
  
  const state = data as any
  
  // Check required fields
  if (!state.version || typeof state.version !== 'string') return false
  if (!state.timestamp || typeof state.timestamp !== 'number') return false
  if (!state.graph || typeof state.graph !== 'object') return false
  if (!Array.isArray(state.graph.nodes)) return false
  if (!Array.isArray(state.graph.edges)) return false
  
  // Validate nodes
  for (const node of state.graph.nodes) {
    if (!node.id || typeof node.id !== 'string') return false
    if (!node.label || typeof node.label !== 'string') return false
  }
  
  // Validate edges
  for (const edge of state.graph.edges) {
    if (!edge.id || typeof edge.id !== 'string') return false
    if (!edge.source || typeof edge.source !== 'string') return false
    if (!edge.target || typeof edge.target !== 'string') return false
  }
  
  return true
}