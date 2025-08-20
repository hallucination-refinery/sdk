/**
 * Main store combining all slices with command queue integration
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { enableMapSet } from 'immer'
import { createGraphSlice, GraphSlice } from './slices/graph-slice'
import { createUISlice, UISlice } from './slices/ui-slice'
import { createAsyncSlice, AsyncSlice } from './slices/async-slice'
import { createMindmapSlice, MindmapSlice } from './slices/mindmapSlice'
import { CommandQueue } from './command-queue'
import type { RendererCommand } from './types/renderer-commands'

// Enable Immer support for Maps and Sets
enableMapSet()

// Combined store type
export type RefineryStore = GraphSlice & UISlice & AsyncSlice & MindmapSlice & {
  commandQueue: CommandQueue
  enqueueCommand: (command: RendererCommand) => void
  enqueueCommands: (commands: RendererCommand[]) => void
  subscribeToCommands: (callback: (commands: RendererCommand[]) => void) => () => void
}

// Create command queue instance
const commandQueue = new CommandQueue(0) // Synchronous by default

// Create store with middleware
export const useRefineryStore = create<RefineryStore>()(
  devtools(
    immer((set, get) => ({
      // Combine all slices
      ...createGraphSlice(set, get),
      ...createUISlice(set, get),
      ...createAsyncSlice(set, get),
      ...createMindmapSlice(set, get),
      
      // Command queue integration
      commandQueue,
      
      enqueueCommand: (command) => {
        commandQueue.enqueue(command)
      },
      
      enqueueCommands: (commands) => {
        commandQueue.enqueueBatch(commands)
      },
      
      subscribeToCommands: (callback) => {
        return commandQueue.subscribe(callback)
      }
    })),
    {
      name: 'refinery-store'
    }
  )
)

// Helper to wrap actions with command enqueueing
export function withCommand<T extends any[], R extends RendererCommand | RendererCommand[] | null>(
  action: (...args: T) => R
): (...args: T) => R {
  return (...args: T) => {
    const command = action(...args)
    if (command) {
      if (Array.isArray(command)) {
        commandQueue.enqueueBatch(command)
      } else {
        commandQueue.enqueue(command)
      }
    }
    return command
  }
}

// Export individual slice hooks for convenience
export const useGraphStore = () => {
  const store = useRefineryStore()
  return {
    nodes: store.nodes,
    edges: store.edges,
    addNode: withCommand(store.addNode),
    updateNode: withCommand(store.updateNode),
    removeNode: withCommand(store.removeNode),
    batchAddNodes: withCommand(store.batchAddNodes),
    batchUpdateNodes: withCommand(store.batchUpdateNodes),
    batchRemoveNodes: withCommand(store.batchRemoveNodes),
    addEdge: withCommand(store.addEdge),
    updateEdge: withCommand(store.updateEdge),
    removeEdge: withCommand(store.removeEdge),
    batchAddEdges: withCommand(store.batchAddEdges),
    batchUpdateEdges: withCommand(store.batchUpdateEdges),
    batchRemoveEdges: withCommand(store.batchRemoveEdges),
    getNode: store.getNode,
    getEdge: store.getEdge,
    getAllNodes: store.getAllNodes,
    getAllEdges: store.getAllEdges,
    getNodeEdges: store.getNodeEdges,
    clearGraph: withCommand(store.clearGraph),
    generateNodeId: store.generateNodeId,
    generateEdgeId: store.generateEdgeId
  }
}

export const useUIStore = () => {
  const store = useRefineryStore()
  return {
    selectedNodeIds: store.selectedNodeIds,
    selectedEdgeIds: store.selectedEdgeIds,
    hoveredNodeId: store.hoveredNodeId,
    hoveredEdgeId: store.hoveredEdgeId,
    camera: store.camera,
    layout: store.layout,
    theme: store.theme,
    highlights: store.highlights,
    selectNodes: withCommand(store.selectNodes),
    selectEdges: withCommand(store.selectEdges),
    clearSelection: withCommand(store.clearSelection),
    setHoverNode: withCommand(store.setHoverNode),
    setHoverEdge: withCommand(store.setHoverEdge),
    setCameraPosition: withCommand(store.setCameraPosition),
    setZoom: withCommand(store.setZoom),
    fitToNodes: withCommand(store.fitToNodes),
    centerOnNode: withCommand(store.centerOnNode),
    setLayout: withCommand(store.setLayout),
    pauseLayout: withCommand(store.pauseLayout),
    resumeLayout: withCommand(store.resumeLayout),
    resetLayout: withCommand(store.resetLayout),
    setTheme: withCommand(store.setTheme),
    updateThemeProperty: withCommand(store.updateThemeProperty),
    highlightNodes: withCommand(store.highlightNodes),
    highlightEdges: withCommand(store.highlightEdges),
    clearHighlights: withCommand(store.clearHighlights),
    isNodeSelected: store.isNodeSelected,
    isEdgeSelected: store.isEdgeSelected,
    getSelectedNodes: store.getSelectedNodes,
    getSelectedEdges: store.getSelectedEdges,
    getHighlightedNodes: store.getHighlightedNodes,
    getHighlightedEdges: store.getHighlightedEdges
  }
}

export const useAsyncStore = () => {
  const store = useRefineryStore()
  return {
    jobs: store.jobs,
    isLoading: store.isLoading,
    error: store.error,
    startJob: store.startJob,
    updateJobProgress: store.updateJobProgress,
    completeJob: store.completeJob,
    failJob: store.failJob,
    cancelJob: store.cancelJob,
    clearCompletedJobs: store.clearCompletedJobs,
    setLoading: store.setLoading,
    setError: store.setError,
    getJob: store.getJob,
    getActiveJobs: store.getActiveJobs,
    getCompletedJobs: store.getCompletedJobs,
    getFailedJobs: store.getFailedJobs
  }
}

export const useMindmapStore = () => {
  const store = useRefineryStore()
  return {
    // State
    concepts: store.concepts,
    vertices: store.vertices,
    selectedConceptIds: store.selectedConceptIds,
    hoveredConceptId: store.hoveredConceptId,
    conceptPositions: store.conceptPositions,
    isBrainMeshLoaded: store.isBrainMeshLoaded,
    conceptVisuals: store.conceptVisuals,
    visibleCategories: store.visibleCategories,
    renderMetrics: store.renderMetrics,
    
    // Actions
    loadConcepts: withCommand(store.loadConcepts),
    addConcept: withCommand(store.addConcept),
    removeConcept: withCommand(store.removeConcept),
    updateConcept: withCommand(store.updateConcept),
    clearConcepts: withCommand(store.clearConcepts),
    setBrainVertices: withCommand(store.setBrainVertices),
    setBrainMeshLoaded: withCommand(store.setBrainMeshLoaded),
    selectConcepts: withCommand(store.selectConcepts),
    clearConceptSelection: withCommand(store.clearConceptSelection),
    setHoveredConcept: withCommand(store.setHoveredConcept),
    setConceptPosition: withCommand(store.setConceptPosition),
    clearConceptPositions: withCommand(store.clearConceptPositions),
    updateConceptPositions: withCommand(store.updateConceptPositions),
    setConceptVisual: withCommand(store.setConceptVisual),
    resetConceptVisuals: withCommand(store.resetConceptVisuals),
    setVisibleCategories: withCommand(store.setVisibleCategories),
    toggleCategory: withCommand(store.toggleCategory),
    showAllCategories: withCommand(store.showAllCategories),
    updateRenderMetrics: withCommand(store.updateRenderMetrics),
    
    // Queries
    getConcept: store.getConcept,
    getConceptsByCategory: store.getConceptsByCategory,
    getVisibleConcepts: store.getVisibleConcepts,
    isConceptSelected: store.isConceptSelected,
    getSelectedConcepts: store.getSelectedConcepts,
    getConceptPosition: store.getConceptPosition,
    getConceptVisual: store.getConceptVisual,
    getAllCategories: store.getAllCategories,
    getConceptMetrics: store.getConceptMetrics
  }
}