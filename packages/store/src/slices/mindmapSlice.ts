/**
 * Mindmap slice - manages concepts, brain mesh vertices, and 3D positioning state
 */

import { produce } from 'immer'
import type { Node, Vector3 } from '@refinery/schema'
import type { RendererCommand } from '../types/renderer-commands'

export interface MindmapState {
  /** Concepts loaded in the mindmap */
  concepts: Map<string, Node>
  /** Brain mesh vertices for positioning concepts */
  vertices: Vector3[]
  /** Currently selected concept IDs */
  selectedConceptIds: Set<string>
  /** Currently hovered concept ID */
  hoveredConceptId: string | null
  /** Concept to vertex mapping for deterministic positioning */
  conceptPositions: Map<string, { vertexIndex: number; shell: number }>
  /** Brain mesh loading state */
  isBrainMeshLoaded: boolean
  /** Concept-specific visual states */
  conceptVisuals: Map<string, { scale: number; color: string; visible: boolean }>
  /** Category filters */
  visibleCategories: Set<string>
  /** Performance metrics */
  renderMetrics: {
    lastRenderTime: number
    frameRate: number
    conceptCount: number
  }
}

export interface MindmapSlice extends MindmapState {
  // Concept management
  loadConcepts: (concepts: Node[]) => RendererCommand
  addConcept: (concept: Node) => RendererCommand
  removeConcept: (conceptId: string) => RendererCommand
  updateConcept: (conceptId: string, updates: Partial<Node>) => RendererCommand
  clearConcepts: () => RendererCommand
  
  // Brain mesh management
  setBrainVertices: (vertices: Vector3[]) => RendererCommand
  setBrainMeshLoaded: (loaded: boolean) => RendererCommand
  
  // Selection management
  selectConcepts: (conceptIds: string[], mode: 'replace' | 'add' | 'toggle') => RendererCommand
  clearConceptSelection: () => RendererCommand
  setHoveredConcept: (conceptId: string | null) => RendererCommand
  
  // Position management
  setConceptPosition: (conceptId: string, vertexIndex: number, shell?: number) => RendererCommand
  clearConceptPositions: () => RendererCommand
  updateConceptPositions: (positions: Map<string, { vertexIndex: number; shell: number }>) => RendererCommand
  
  // Visual state management
  setConceptVisual: (conceptId: string, visual: { scale?: number; color?: string; visible?: boolean }) => RendererCommand
  resetConceptVisuals: () => RendererCommand
  
  // Category filtering
  setVisibleCategories: (categories: string[]) => RendererCommand
  toggleCategory: (category: string) => RendererCommand
  showAllCategories: () => RendererCommand
  
  // Performance tracking
  updateRenderMetrics: (metrics: { renderTime: number; frameRate: number }) => RendererCommand
  
  // Query methods
  getConcept: (conceptId: string) => Node | undefined
  getConceptsByCategory: (category: string) => Node[]
  getVisibleConcepts: () => Node[]
  isConceptSelected: (conceptId: string) => boolean
  getSelectedConcepts: () => Node[]
  getConceptPosition: (conceptId: string) => { vertexIndex: number; shell: number } | undefined
  getConceptVisual: (conceptId: string) => { scale: number; color: string; visible: boolean }
  getAllCategories: () => string[]
  getConceptMetrics: () => { total: number; visible: number; selected: number }
}

export const createMindmapSlice = (set: any, get: any): MindmapSlice => ({
  // Initial state
  concepts: new Map(),
  vertices: [],
  selectedConceptIds: new Set(),
  hoveredConceptId: null,
  conceptPositions: new Map(),
  isBrainMeshLoaded: false,
  conceptVisuals: new Map(),
  visibleCategories: new Set(),
  renderMetrics: {
    lastRenderTime: 0,
    frameRate: 60,
    conceptCount: 0
  },

  // Concept management
  loadConcepts: (concepts) => {
    console.log('[MINDMAP] loadConcepts called:', { count: concepts.length, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          // Clear existing state
          state.concepts.clear()
          state.selectedConceptIds.clear()
          state.conceptPositions.clear()
          state.conceptVisuals.clear()
          state.hoveredConceptId = null
          
          // Load new concepts
          concepts.forEach(concept => {
            state.concepts.set(concept.id, concept)
            
            // Initialize visual state
            state.conceptVisuals.set(concept.id, {
              scale: 1.0,
              color: concept.color || '#ffffff',
              visible: true
            })
            
            // Extract and add categories
            const category = concept.metadata?.category as string
            if (category && typeof category === 'string') {
              state.visibleCategories.add(category)
            }
          })
          
          // Update metrics
          state.renderMetrics.conceptCount = concepts.length
          console.log('[MINDMAP] loadConcepts state updated:', { 
            conceptCount: state.concepts.size,
            categories: Array.from(state.visibleCategories)
          })
        })
      )
    })
    return { type: 'LOAD_CONCEPTS', payload: { concepts } }
  },

  addConcept: (concept) => {
    console.log('[MINDMAP] addConcept called:', { conceptId: concept.id, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.concepts.set(concept.id, concept)
          
          // Initialize visual state
          state.conceptVisuals.set(concept.id, {
            scale: 1.0,
            color: concept.color || '#ffffff',
            visible: true
          })
          
          // Add category if present
          const category = concept.metadata?.category as string
          if (category && typeof category === 'string') {
            state.visibleCategories.add(category)
          }
          
          state.renderMetrics.conceptCount = state.concepts.size
        })
      )
    })
    return { type: 'ADD_CONCEPT', payload: { concept } }
  },

  removeConcept: (conceptId) => {
    console.log('[MINDMAP] removeConcept called:', { conceptId, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.concepts.delete(conceptId)
          state.selectedConceptIds.delete(conceptId)
          state.conceptPositions.delete(conceptId)
          state.conceptVisuals.delete(conceptId)
          
          if (state.hoveredConceptId === conceptId) {
            state.hoveredConceptId = null
          }
          
          state.renderMetrics.conceptCount = state.concepts.size
        })
      )
    })
    return { type: 'REMOVE_CONCEPT', payload: { conceptId } }
  },

  updateConcept: (conceptId, updates) => {
    console.log('[MINDMAP] updateConcept called:', { conceptId, updates, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          const concept = state.concepts.get(conceptId)
          if (concept) {
            const updatedConcept = { ...concept, ...updates }
            state.concepts.set(conceptId, updatedConcept)
            
            // Update visual state if color changed
            if (updates.color) {
              const visual = state.conceptVisuals.get(conceptId)
              if (visual) {
                visual.color = updates.color
              }
            }
          }
        })
      )
    })
    return { type: 'UPDATE_CONCEPT', payload: { conceptId, updates } }
  },

  clearConcepts: () => {
    console.log('[MINDMAP] clearConcepts called:', { timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.concepts.clear()
          state.selectedConceptIds.clear()
          state.conceptPositions.clear()
          state.conceptVisuals.clear()
          state.hoveredConceptId = null
          state.renderMetrics.conceptCount = 0
        })
      )
    })
    return { type: 'CLEAR_CONCEPTS' }
  },

  // Brain mesh management
  setBrainVertices: (vertices) => {
    console.log('[MINDMAP] setBrainVertices called:', { count: vertices.length, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.vertices = vertices
        })
      )
    })
    return { type: 'SET_BRAIN_VERTICES', payload: { vertices } }
  },

  setBrainMeshLoaded: (loaded) => {
    console.log('[MINDMAP] setBrainMeshLoaded called:', { loaded, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.isBrainMeshLoaded = loaded
        })
      )
    })
    return { type: 'SET_BRAIN_MESH_LOADED', payload: { loaded } }
  },

  // Selection management
  selectConcepts: (conceptIds, mode) => {
    console.log('[MINDMAP] selectConcepts called:', { conceptIds, mode, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          const before = Array.from(state.selectedConceptIds)
          
          if (mode === 'replace') {
            state.selectedConceptIds = new Set(conceptIds)
          } else if (mode === 'add') {
            conceptIds.forEach(id => state.selectedConceptIds.add(id))
          } else if (mode === 'toggle') {
            conceptIds.forEach(id => {
              if (state.selectedConceptIds.has(id)) {
                state.selectedConceptIds.delete(id)
              } else {
                state.selectedConceptIds.add(id)
              }
            })
          }
          
          const after = Array.from(state.selectedConceptIds)
          console.log('[MINDMAP] selectConcepts state updated:', { before, after })
        })
      )
    })
    return { type: 'SELECT_CONCEPTS', payload: { conceptIds, mode } }
  },

  clearConceptSelection: () => {
    console.log('[MINDMAP] clearConceptSelection called:', { timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          const before = Array.from(state.selectedConceptIds)
          state.selectedConceptIds.clear()
          console.log('[MINDMAP] clearConceptSelection state updated:', { before, after: [] })
        })
      )
    })
    return { type: 'CLEAR_CONCEPT_SELECTION' }
  },

  setHoveredConcept: (conceptId) => {
    console.log('[MINDMAP] setHoveredConcept called:', { conceptId, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          const before = state.hoveredConceptId
          state.hoveredConceptId = conceptId
          console.log('[MINDMAP] setHoveredConcept state updated:', { before, after: conceptId })
        })
      )
    })
    return { type: 'SET_HOVERED_CONCEPT', payload: { conceptId } }
  },

  // Position management
  setConceptPosition: (conceptId, vertexIndex, shell = 0) => {
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.conceptPositions.set(conceptId, { vertexIndex, shell })
        })
      )
    })
    return { type: 'SET_CONCEPT_POSITION', payload: { conceptId, vertexIndex, shell } }
  },

  clearConceptPositions: () => {
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.conceptPositions.clear()
        })
      )
    })
    return { type: 'CLEAR_CONCEPT_POSITIONS' }
  },

  updateConceptPositions: (positions) => {
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.conceptPositions = new Map(positions)
        })
      )
    })
    return { type: 'UPDATE_CONCEPT_POSITIONS', payload: { positions } }
  },

  // Visual state management
  setConceptVisual: (conceptId, visual) => {
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          const existing = state.conceptVisuals.get(conceptId) || { scale: 1.0, color: '#ffffff', visible: true }
          state.conceptVisuals.set(conceptId, { ...existing, ...visual })
        })
      )
    })
    return { type: 'SET_CONCEPT_VISUAL', payload: { conceptId, visual } }
  },

  resetConceptVisuals: () => {
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.conceptVisuals.forEach((visual, conceptId) => {
            const concept = state.concepts.get(conceptId)
            visual.scale = 1.0
            visual.color = concept?.color || '#ffffff'
            visual.visible = true
          })
        })
      )
    })
    return { type: 'RESET_CONCEPT_VISUALS' }
  },

  // Category filtering
  setVisibleCategories: (categories) => {
    console.log('[MINDMAP] setVisibleCategories called:', { categories, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.visibleCategories = new Set(categories)
        })
      )
    })
    return { type: 'SET_VISIBLE_CATEGORIES', payload: { categories } }
  },

  toggleCategory: (category) => {
    console.log('[MINDMAP] toggleCategory called:', { category, timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          if (state.visibleCategories.has(category)) {
            state.visibleCategories.delete(category)
          } else {
            state.visibleCategories.add(category)
          }
        })
      )
    })
    return { type: 'TOGGLE_CATEGORY', payload: { category } }
  },

  showAllCategories: () => {
    console.log('[MINDMAP] showAllCategories called:', { timestamp: Date.now() })
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          // Add all categories from concepts
          state.concepts.forEach(concept => {
            const category = concept.metadata?.category as string
            if (category && typeof category === 'string') {
              state.visibleCategories.add(category)
            }
          })
        })
      )
    })
    return { type: 'SHOW_ALL_CATEGORIES' }
  },

  // Performance tracking
  updateRenderMetrics: (metrics) => {
    queueMicrotask(() => {
      set(
        produce((state: MindmapSlice) => {
          state.renderMetrics.lastRenderTime = metrics.renderTime
          state.renderMetrics.frameRate = metrics.frameRate
        })
      )
    })
    return { type: 'UPDATE_RENDER_METRICS', payload: { metrics } }
  },

  // Query methods
  getConcept: (conceptId) => get().concepts.get(conceptId),
  
  getConceptsByCategory: (category) => {
    const state = get()
    const concepts = Array.from(state.concepts.values()) as Node[]
    return concepts.filter(concept => 
      concept.metadata?.category === category
    )
  },
  
  getVisibleConcepts: () => {
    const state = get()
    const concepts = Array.from(state.concepts.values()) as Node[]
    return concepts.filter(concept => {
      const category = concept.metadata?.category as string
      return !category || state.visibleCategories.has(category)
    })
  },
  
  isConceptSelected: (conceptId) => get().selectedConceptIds.has(conceptId),
  
  getSelectedConcepts: () => {
    const state = get()
    return Array.from(state.selectedConceptIds).map(id => state.concepts.get(id)).filter(Boolean) as Node[]
  },
  
  getConceptPosition: (conceptId) => get().conceptPositions.get(conceptId),
  
  getConceptVisual: (conceptId) => {
    const state = get()
    return state.conceptVisuals.get(conceptId) || { scale: 1.0, color: '#ffffff', visible: true }
  },
  
  getAllCategories: () => {
    const state = get()
    const categories = new Set<string>()
    state.concepts.forEach(concept => {
      const category = concept.metadata?.category as string
      if (category && typeof category === 'string') {
        categories.add(category)
      }
    })
    return Array.from(categories)
  },
  
  getConceptMetrics: () => {
    const state = get()
    const visible = state.getVisibleConcepts().length
    const selected = state.selectedConceptIds.size
    return {
      total: state.concepts.size,
      visible,
      selected
    }
  }
})