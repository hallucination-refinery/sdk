import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRefineryStore } from '@refinery/store'
import type { RendererCommand } from '@refinery/store'
import type { Node, Edge } from '@refinery/schema'

interface CanvasState {
  nodes: Map<string, Node>
  edges: Map<string, Edge>
  selectedNodeIds: Set<string>
  selectedEdgeIds: Set<string>
  hoveredNodeId: string | null
  hoveredEdgeId: string | null
  camera: { x: number; y: number; z: number }
  zoom: number
  layout: 'force' | 'radial' | 'hierarchical'
  layoutPaused: boolean
  theme: 'light' | 'dark' | 'custom'
  customTheme?: any
  highlightedNodes: Map<string, { color?: string; intensity?: number }>
  highlightedEdges: Map<string, { color?: string; intensity?: number }>
}

interface CanvasContextValue {
  state: CanvasState
  enqueueCommand: (command: RendererCommand) => void
  enqueueCommands: (commands: RendererCommand[]) => void
}

const CanvasContext = createContext<CanvasContextValue | null>(null)

export function useCanvas() {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error('useCanvas must be used within CanvasProvider')
  }
  return context
}

interface CanvasProviderProps {
  children: React.ReactNode
  initialState?: Partial<CanvasState>
}

export function CanvasProvider({ children, initialState }: CanvasProviderProps) {
  const store = useRefineryStore()
  const [state, setState] = useState<CanvasState>({
    nodes: new Map(),
    edges: new Map(),
    selectedNodeIds: new Set(),
    selectedEdgeIds: new Set(),
    hoveredNodeId: null,
    hoveredEdgeId: null,
    camera: { x: 0, y: 0, z: 100 },
    zoom: 1,
    layout: 'force',
    layoutPaused: false,
    theme: 'light',
    customTheme: undefined,
    highlightedNodes: new Map(),
    highlightedEdges: new Map(),
    ...initialState
  })

  // Process a single command
  const processCommand = useCallback((command: RendererCommand) => {
    setState(prevState => {
      const newState = { ...prevState }

      switch (command.type) {
        // Node commands
        case 'ADD_NODE':
          newState.nodes = new Map(newState.nodes)
          newState.nodes.set(command.payload.node.id, command.payload.node)
          break

        case 'UPDATE_NODE':
          if (newState.nodes.has(command.payload.id)) {
            newState.nodes = new Map(newState.nodes)
            const node = newState.nodes.get(command.payload.id)!
            newState.nodes.set(command.payload.id, { ...node, ...command.payload.updates })
          }
          break

        case 'REMOVE_NODE':
          newState.nodes = new Map(newState.nodes)
          newState.nodes.delete(command.payload.id)
          newState.selectedNodeIds = new Set(newState.selectedNodeIds)
          newState.selectedNodeIds.delete(command.payload.id)
          if (newState.hoveredNodeId === command.payload.id) {
            newState.hoveredNodeId = null
          }
          break

        case 'BATCH_ADD_NODES':
          newState.nodes = new Map(newState.nodes)
          command.payload.nodes.forEach(node => {
            newState.nodes.set(node.id, node)
          })
          break

        case 'BATCH_UPDATE_NODES':
          newState.nodes = new Map(newState.nodes)
          command.payload.updates.forEach(({ id, updates }) => {
            const node = newState.nodes.get(id)
            if (node) {
              newState.nodes.set(id, { ...node, ...updates })
            }
          })
          break

        case 'BATCH_REMOVE_NODES':
          newState.nodes = new Map(newState.nodes)
          newState.selectedNodeIds = new Set(newState.selectedNodeIds)
          command.payload.ids.forEach(id => {
            newState.nodes.delete(id)
            newState.selectedNodeIds.delete(id)
          })
          if (command.payload.ids.includes(newState.hoveredNodeId!)) {
            newState.hoveredNodeId = null
          }
          break

        // Edge commands
        case 'ADD_EDGE':
          newState.edges = new Map(newState.edges)
          newState.edges.set(command.payload.edge.id, command.payload.edge)
          break

        case 'UPDATE_EDGE':
          if (newState.edges.has(command.payload.id)) {
            newState.edges = new Map(newState.edges)
            const edge = newState.edges.get(command.payload.id)!
            newState.edges.set(command.payload.id, { ...edge, ...command.payload.updates })
          }
          break

        case 'REMOVE_EDGE':
          newState.edges = new Map(newState.edges)
          newState.edges.delete(command.payload.id)
          newState.selectedEdgeIds = new Set(newState.selectedEdgeIds)
          newState.selectedEdgeIds.delete(command.payload.id)
          if (newState.hoveredEdgeId === command.payload.id) {
            newState.hoveredEdgeId = null
          }
          break

        case 'BATCH_ADD_EDGES':
          newState.edges = new Map(newState.edges)
          command.payload.edges.forEach(edge => {
            newState.edges.set(edge.id, edge)
          })
          break

        case 'BATCH_UPDATE_EDGES':
          newState.edges = new Map(newState.edges)
          command.payload.updates.forEach(({ id, updates }) => {
            const edge = newState.edges.get(id)
            if (edge) {
              newState.edges.set(id, { ...edge, ...updates })
            }
          })
          break

        case 'BATCH_REMOVE_EDGES':
          newState.edges = new Map(newState.edges)
          newState.selectedEdgeIds = new Set(newState.selectedEdgeIds)
          command.payload.ids.forEach(id => {
            newState.edges.delete(id)
            newState.selectedEdgeIds.delete(id)
          })
          if (command.payload.ids.includes(newState.hoveredEdgeId!)) {
            newState.hoveredEdgeId = null
          }
          break

        // Camera commands
        case 'SET_CAMERA_POSITION':
          newState.camera = { ...command.payload }
          break

        case 'SET_ZOOM':
          newState.zoom = command.payload.zoom
          break

        case 'FIT_TO_NODES':
          // TODO: Implement camera fitting logic
          break

        case 'CENTER_ON_NODE':
          // TODO: Implement centering logic
          break

        // Selection commands
        case 'SELECT_NODES':
          newState.selectedNodeIds = new Set(newState.selectedNodeIds)
          if (command.payload.mode === 'replace') {
            newState.selectedNodeIds = new Set(command.payload.nodeIds)
          } else if (command.payload.mode === 'add') {
            command.payload.nodeIds.forEach(id => newState.selectedNodeIds.add(id))
          } else if (command.payload.mode === 'toggle') {
            command.payload.nodeIds.forEach(id => {
              if (newState.selectedNodeIds.has(id)) {
                newState.selectedNodeIds.delete(id)
              } else {
                newState.selectedNodeIds.add(id)
              }
            })
          }
          break

        case 'SELECT_EDGES':
          newState.selectedEdgeIds = new Set(newState.selectedEdgeIds)
          if (command.payload.mode === 'replace') {
            newState.selectedEdgeIds = new Set(command.payload.edgeIds)
          } else if (command.payload.mode === 'add') {
            command.payload.edgeIds.forEach(id => newState.selectedEdgeIds.add(id))
          } else if (command.payload.mode === 'toggle') {
            command.payload.edgeIds.forEach(id => {
              if (newState.selectedEdgeIds.has(id)) {
                newState.selectedEdgeIds.delete(id)
              } else {
                newState.selectedEdgeIds.add(id)
              }
            })
          }
          break

        case 'CLEAR_SELECTION':
          newState.selectedNodeIds = new Set()
          newState.selectedEdgeIds = new Set()
          break

        case 'SET_HOVER_NODE':
          newState.hoveredNodeId = command.payload.nodeId
          break

        case 'SET_HOVER_EDGE':
          newState.hoveredEdgeId = command.payload.edgeId
          break

        // Layout commands
        case 'SET_LAYOUT':
          newState.layout = command.payload.layout
          break

        case 'PAUSE_LAYOUT':
          newState.layoutPaused = true
          break

        case 'RESUME_LAYOUT':
          newState.layoutPaused = false
          break

        case 'RESET_LAYOUT':
          newState.layoutPaused = false
          // TODO: Reset layout positions
          break

        // Theme commands
        case 'SET_THEME':
          newState.theme = command.payload.theme
          newState.customTheme = command.payload.customTheme
          break

        case 'UPDATE_THEME_PROPERTY':
          if (newState.theme === 'custom' && newState.customTheme) {
            newState.customTheme = { ...newState.customTheme, [command.payload.property]: command.payload.value }
          }
          break

        // Highlight commands
        case 'HIGHLIGHT_NODES':
          newState.highlightedNodes = new Map(newState.highlightedNodes)
          command.payload.nodeIds.forEach(id => {
            newState.highlightedNodes.set(id, {
              color: command.payload.color,
              intensity: command.payload.intensity
            })
          })
          break

        case 'HIGHLIGHT_EDGES':
          newState.highlightedEdges = new Map(newState.highlightedEdges)
          command.payload.edgeIds.forEach(id => {
            newState.highlightedEdges.set(id, {
              color: command.payload.color,
              intensity: command.payload.intensity
            })
          })
          break

        case 'CLEAR_HIGHLIGHTS':
          newState.highlightedNodes = new Map()
          newState.highlightedEdges = new Map()
          break
      }

      return newState
    })
  }, [])

  // Subscribe to command queue
  useEffect(() => {
    const unsubscribe = store.subscribeToCommands((commands) => {
      commands.forEach(processCommand)
    })

    return unsubscribe
  }, [store, processCommand])

  const contextValue: CanvasContextValue = {
    state,
    enqueueCommand: store.enqueueCommand,
    enqueueCommands: store.enqueueCommands
  }

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  )
}