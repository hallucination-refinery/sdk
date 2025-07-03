import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { RefineryStore } from '../store'
import {
  selectNodes,
  selectEdges,
  selectNodesArray,
  selectNodeIds,
  selectNodeCount,
  selectSelectedNodes,
  selectSelectedEdges,
  selectHoveredNode,
  selectGraphStats,
  createNodeEdgesSelector,
  createNodeNeighborsSelector,
  createNodeDegreeSelector,
  createNodesWithMetadataSelector,
  createNodesWithLabelSelector,
  selectHighlightedNodes,
  selectUIState
} from './index'
import type { IdeaNode, Edge } from '@refinery/schema'

// Create a test store
const createTestStore = () => {
  return create<RefineryStore>()(
    immer(() => ({
      // Graph state
      nodes: new Map<string, IdeaNode>(),
      edges: new Map<string, Edge>(),
      nodeIdCounter: 0,
      edgeIdCounter: 0,
      
      // UI state
      selectedNodeIds: new Set<string>(),
      selectedEdgeIds: new Set<string>(),
      hoveredNodeId: null,
      hoveredEdgeId: null,
      camera: { position: { x: 0, y: 0, z: 100 }, zoom: 1 },
      layout: { type: 'force' as const, isPaused: false },
      theme: { mode: 'light' as const },
      highlights: { nodes: new Map(), edges: new Map() },
      
      // Async state
      jobs: new Map(),
      isLoading: false,
      error: null,
      
      // Dummy actions (not tested here)
      addNode: () => ({ type: 'ADD_NODE', payload: { node: {} as any } }),
      updateNode: () => null,
      removeNode: () => null,
      batchAddNodes: () => ({ type: 'BATCH_ADD_NODES', payload: { nodes: [] } }),
      batchUpdateNodes: () => ({ type: 'BATCH_UPDATE_NODES', payload: { updates: [] } }),
      batchRemoveNodes: () => ({ type: 'BATCH_REMOVE_NODES', payload: { ids: [] } }),
      addEdge: () => ({ type: 'ADD_EDGE', payload: { edge: {} as any } }),
      updateEdge: () => null,
      removeEdge: () => null,
      batchAddEdges: () => ({ type: 'BATCH_ADD_EDGES', payload: { edges: [] } }),
      batchUpdateEdges: () => ({ type: 'BATCH_UPDATE_EDGES', payload: { updates: [] } }),
      batchRemoveEdges: () => ({ type: 'BATCH_REMOVE_EDGES', payload: { ids: [] } }),
      getNode: () => undefined,
      getEdge: () => undefined,
      getAllNodes: () => [],
      getAllEdges: () => [],
      getNodeEdges: () => [],
      clearGraph: () => [],
      generateNodeId: () => '',
      generateEdgeId: () => '',
      
      selectNodes: () => ({ type: 'SELECT_NODES', payload: { nodeIds: [], mode: 'replace' } }),
      selectEdges: () => ({ type: 'SELECT_EDGES', payload: { edgeIds: [], mode: 'replace' } }),
      clearSelection: () => ({ type: 'CLEAR_SELECTION' }),
      setHoverNode: () => ({ type: 'SET_HOVER_NODE', payload: { nodeId: null } }),
      setHoverEdge: () => ({ type: 'SET_HOVER_EDGE', payload: { edgeId: null } }),
      setCameraPosition: () => ({ type: 'SET_CAMERA_POSITION', payload: { x: 0, y: 0, z: 0 } }),
      setZoom: () => ({ type: 'SET_ZOOM', payload: { zoom: 1 } }),
      fitToNodes: () => ({ type: 'FIT_TO_NODES', payload: {} }),
      centerOnNode: () => ({ type: 'CENTER_ON_NODE', payload: { nodeId: '' } }),
      setLayout: () => ({ type: 'SET_LAYOUT', payload: { layout: 'force' } }),
      pauseLayout: () => ({ type: 'PAUSE_LAYOUT' }),
      resumeLayout: () => ({ type: 'RESUME_LAYOUT' }),
      resetLayout: () => ({ type: 'RESET_LAYOUT' }),
      setTheme: () => ({ type: 'SET_THEME', payload: { theme: 'light' } }),
      updateThemeProperty: () => ({ type: 'UPDATE_THEME_PROPERTY', payload: { property: '', value: '' } }),
      highlightNodes: () => ({ type: 'HIGHLIGHT_NODES', payload: { nodeIds: [] } }),
      highlightEdges: () => ({ type: 'HIGHLIGHT_EDGES', payload: { edgeIds: [] } }),
      clearHighlights: () => ({ type: 'CLEAR_HIGHLIGHTS' }),
      isNodeSelected: () => false,
      isEdgeSelected: () => false,
      getSelectedNodes: () => [],
      getSelectedEdges: () => [],
      getHighlightedNodes: () => new Map(),
      getHighlightedEdges: () => new Map(),
      
      startJob: () => {},
      updateJobProgress: () => {},
      completeJob: () => {},
      failJob: () => {},
      cancelJob: () => {},
      clearCompletedJobs: () => {},
      setLoading: () => {},
      setError: () => {},
      getJob: () => undefined,
      getActiveJobs: () => [],
      getCompletedJobs: () => [],
      getFailedJobs: () => [],
      
      commandQueue: {} as any,
      enqueueCommand: () => {},
      enqueueCommands: () => {},
      subscribeToCommands: () => () => {}
    }))
  )
}

describe('Selectors', () => {
  let store: ReturnType<typeof createTestStore>

  beforeEach(() => {
    store = createTestStore()
    
    // Add test data
    const nodes: IdeaNode[] = [
      { id: 'node-1', label: 'Node 1', metadata: { type: 'A', priority: 1 } },
      { id: 'node-2', label: 'Node 2', metadata: { type: 'B', priority: 2 } },
      { id: 'node-3', label: 'Another Node', metadata: { type: 'A', priority: 3 } }
    ]
    
    const edges: Edge[] = [
      { id: 'edge-1', source: 'node-1', target: 'node-2' },
      { id: 'edge-2', source: 'node-2', target: 'node-3' },
      { id: 'edge-3', source: 'node-1', target: 'node-3' }
    ]
    
    store.setState(state => {
      nodes.forEach(node => state.nodes.set(node.id, node))
      edges.forEach(edge => state.edges.set(edge.id, edge))
      state.selectedNodeIds.add('node-1')
      state.selectedNodeIds.add('node-2')
      state.selectedEdgeIds.add('edge-1')
      state.hoveredNodeId = 'node-1'
      state.hoveredEdgeId = 'edge-1'
      state.highlights.nodes.set('node-1', { color: '#ff0000', intensity: 0.8 })
    })
  })

  describe('Basic selectors', () => {
    it('should select nodes map', () => {
      const nodes = selectNodes(store.getState())
      expect(nodes.size).toBe(3)
      expect(nodes.get('node-1')?.label).toBe('Node 1')
    })

    it('should select edges map', () => {
      const edges = selectEdges(store.getState())
      expect(edges.size).toBe(3)
      expect(edges.get('edge-1')?.source).toBe('node-1')
    })
  })

  describe('Node selectors', () => {
    it('should select nodes array', () => {
      const nodes = selectNodesArray(store.getState())
      expect(nodes).toHaveLength(3)
      expect(nodes[0]).toHaveProperty('id')
      expect(nodes[0]).toHaveProperty('label')
    })

    it('should select node ids', () => {
      const ids = selectNodeIds(store.getState())
      expect(ids).toHaveLength(3)
      expect(ids).toContain('node-1')
      expect(ids).toContain('node-2')
      expect(ids).toContain('node-3')
    })

    it('should select node count', () => {
      const count = selectNodeCount(store.getState())
      expect(count).toBe(3)
    })

    it('should memoize node selectors', () => {
      const nodes1 = selectNodesArray(store.getState())
      const nodes2 = selectNodesArray(store.getState())
      expect(nodes1).toBe(nodes2) // Same reference due to memoization
    })
  })

  describe('Selection selectors', () => {
    it('should select selected nodes with full data', () => {
      const selected = selectSelectedNodes(store.getState())
      expect(selected).toHaveLength(2)
      expect(selected[0].id).toBe('node-1')
      expect(selected[1].id).toBe('node-2')
    })

    it('should select selected edges with full data', () => {
      const selected = selectSelectedEdges(store.getState())
      expect(selected).toHaveLength(1)
      expect(selected[0].id).toBe('edge-1')
    })

    it('should select hovered node', () => {
      const hovered = selectHoveredNode(store.getState())
      expect(hovered?.id).toBe('node-1')
    })
  })

  describe('Graph statistics', () => {
    it('should calculate graph statistics', () => {
      const stats = selectGraphStats(store.getState())
      expect(stats.nodeCount).toBe(3)
      expect(stats.edgeCount).toBe(3)
      expect(stats.avgDegree).toBe(2) // (3 edges * 2) / 3 nodes
      expect(stats.density).toBe(1) // 2 * 3 / (3 * 2) = 1 (fully connected)
    })
  })

  describe('Node connectivity selectors', () => {
    it('should select edges connected to a node', () => {
      const selector = createNodeEdgesSelector('node-1')
      const edges = selector(store.getState())
      expect(edges).toHaveLength(2)
      expect(edges.every(e => e.source === 'node-1' || e.target === 'node-1')).toBe(true)
    })

    it('should select node neighbors', () => {
      const selector = createNodeNeighborsSelector('node-1')
      const neighbors = selector(store.getState())
      expect(neighbors).toHaveLength(2)
      expect(neighbors.map(n => n.id)).toContain('node-2')
      expect(neighbors.map(n => n.id)).toContain('node-3')
    })

    it('should calculate node degree', () => {
      const selector = createNodeDegreeSelector('node-2')
      const degree = selector(store.getState())
      expect(degree).toBe(2)
    })
  })

  describe('Filter selectors', () => {
    it('should filter nodes by metadata', () => {
      const selector = createNodesWithMetadataSelector('type', 'A')
      const nodes = selector(store.getState())
      expect(nodes).toHaveLength(2)
      expect(nodes[0].id).toBe('node-1')
      expect(nodes[1].id).toBe('node-3')
    })

    it('should filter nodes by label pattern', () => {
      const selector = createNodesWithLabelSelector('Another')
      const nodes = selector(store.getState())
      expect(nodes).toHaveLength(1)
      expect(nodes[0].id).toBe('node-3')
    })

    it('should filter nodes by regex', () => {
      const selector = createNodesWithLabelSelector(/node \d/i)
      const nodes = selector(store.getState())
      expect(nodes).toHaveLength(2)
    })
  })

  describe('Highlight selectors', () => {
    it('should select highlighted nodes with data', () => {
      const highlighted = selectHighlightedNodes(store.getState())
      expect(highlighted).toHaveLength(1)
      expect(highlighted[0].node?.id).toBe('node-1')
      expect(highlighted[0].color).toBe('#ff0000')
      expect(highlighted[0].intensity).toBe(0.8)
    })
  })

  describe('Combined UI state selector', () => {
    it('should select combined UI state', () => {
      const uiState = selectUIState(store.getState())
      
      expect(uiState.selection.nodes).toHaveLength(2)
      expect(uiState.selection.edges).toHaveLength(1)
      expect(uiState.selection.nodeCount).toBe(2)
      expect(uiState.selection.edgeCount).toBe(1)
      
      expect(uiState.hover.node?.id).toBe('node-1')
      expect(uiState.hover.edge?.id).toBe('edge-1')
      
      expect(uiState.camera.position.z).toBe(100)
      expect(uiState.layout.type).toBe('force')
      expect(uiState.theme).toBe('light')
    })
  })
})