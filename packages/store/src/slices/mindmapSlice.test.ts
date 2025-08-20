/**
 * Tests for mindmap slice
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { enableMapSet } from 'immer'
import { createMindmapSlice, type MindmapSlice } from './mindmapSlice'
import type { Node, Vector3 } from '@refinery/schema'

// Enable Immer support for Maps and Sets
enableMapSet()

// Test store type
type TestStore = MindmapSlice

// Test concepts
const mockConcepts: Node[] = [
  {
    id: 'concept_001',
    label: 'Artificial Intelligence',
    content: 'AI concepts and techniques',
    color: '#3498db',
    createdAt: '2023-08-28T12:25:40.998Z',
    updatedAt: '2023-09-25T14:52:31.025Z',
    metadata: {
      category: 'Technology',
      importance: 8
    }
  },
  {
    id: 'concept_002',
    label: 'Machine Learning',
    content: 'ML algorithms and approaches',
    color: '#e74c3c',
    createdAt: '2023-09-01T10:15:20.500Z',
    updatedAt: '2023-09-20T16:30:45.123Z',
    metadata: {
      category: 'Technology',
      importance: 9
    }
  },
  {
    id: 'concept_003',
    label: 'Philosophy of Mind',
    content: 'Philosophical questions about consciousness',
    color: '#9b59b6',
    createdAt: '2023-07-15T14:20:10.789Z',
    updatedAt: '2023-08-10T09:45:30.456Z',
    metadata: {
      category: 'Philosophy',
      importance: 7
    }
  }
]

// Test vertices
const mockVertices: Vector3[] = [
  { x: 0, y: 0, z: 0 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 0, z: 1 },
  { x: 0, y: -1, z: 0 },
  { x: 2, y: 0, z: -1 }
]

describe('MindmapSlice', () => {
  let store: TestStore
  let get: () => TestStore
  let set: (fn: (state: TestStore) => void) => void

  beforeEach(() => {
    const testStore = create<TestStore>((setFn, getFn) => {
      set = setFn
      get = getFn
      return createMindmapSlice(setFn, getFn)
    })
    
    store = testStore.getState()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      expect(store.concepts.size).toBe(0)
      expect(store.vertices).toEqual([])
      expect(store.selectedConceptIds.size).toBe(0)
      expect(store.hoveredConceptId).toBe(null)
      expect(store.conceptPositions.size).toBe(0)
      expect(store.isBrainMeshLoaded).toBe(false)
      expect(store.conceptVisuals.size).toBe(0)
      expect(store.visibleCategories.size).toBe(0)
      expect(store.renderMetrics.conceptCount).toBe(0)
      expect(store.renderMetrics.frameRate).toBe(60)
    })
  })

  describe('Concept Management', () => {
    it('should load concepts correctly', () => {
      const command = store.loadConcepts(mockConcepts)
      
      expect(command.type).toBe('LOAD_CONCEPTS')
      expect(command.payload.concepts).toEqual(mockConcepts)
      
      // Check state after microtask
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.concepts.size).toBe(3)
          expect(state.concepts.get('concept_001')).toEqual(mockConcepts[0])
          expect(state.conceptVisuals.size).toBe(3)
          expect(state.visibleCategories.has('Technology')).toBe(true)
          expect(state.visibleCategories.has('Philosophy')).toBe(true)
          expect(state.renderMetrics.conceptCount).toBe(3)
          resolve(undefined)
        })
      })
    })

    it('should add single concept', () => {
      const newConcept: Node = {
        id: 'concept_004',
        label: 'Quantum Computing',
        color: '#f39c12',
        metadata: { category: 'Science', importance: 8 }
      }
      
      const command = store.addConcept(newConcept)
      
      expect(command.type).toBe('ADD_CONCEPT')
      expect(command.payload.concept).toEqual(newConcept)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.concepts.size).toBe(1)
          expect(state.concepts.get('concept_004')).toEqual(newConcept)
          expect(state.visibleCategories.has('Science')).toBe(true)
          resolve(undefined)
        })
      })
    })

    it('should remove concept', () => {
      // First load concepts
      store.loadConcepts(mockConcepts)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const command = store.removeConcept('concept_002')
          
          expect(command.type).toBe('REMOVE_CONCEPT')
          expect(command.payload.conceptId).toBe('concept_002')
          
          queueMicrotask(() => {
            const state = get()
            expect(state.concepts.size).toBe(2)
            expect(state.concepts.has('concept_002')).toBe(false)
            expect(state.renderMetrics.conceptCount).toBe(2)
            resolve(undefined)
          })
        })
      })
    })

    it('should update concept', () => {
      store.loadConcepts([mockConcepts[0]])
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const updates = { label: 'Updated AI', color: '#new123' }
          const command = store.updateConcept('concept_001', updates)
          
          expect(command.type).toBe('UPDATE_CONCEPT')
          expect(command.payload.conceptId).toBe('concept_001')
          expect(command.payload.updates).toEqual(updates)
          
          queueMicrotask(() => {
            const state = get()
            const concept = state.concepts.get('concept_001')
            expect(concept?.label).toBe('Updated AI')
            expect(concept?.color).toBe('#new123')
            resolve(undefined)
          })
        })
      })
    })

    it('should clear all concepts', () => {
      store.loadConcepts(mockConcepts)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const command = store.clearConcepts()
          
          expect(command.type).toBe('CLEAR_CONCEPTS')
          
          queueMicrotask(() => {
            const state = get()
            expect(state.concepts.size).toBe(0)
            expect(state.selectedConceptIds.size).toBe(0)
            expect(state.conceptPositions.size).toBe(0)
            expect(state.conceptVisuals.size).toBe(0)
            expect(state.hoveredConceptId).toBe(null)
            expect(state.renderMetrics.conceptCount).toBe(0)
            resolve(undefined)
          })
        })
      })
    })
  })

  describe('Brain Mesh Management', () => {
    it('should set brain vertices', () => {
      const command = store.setBrainVertices(mockVertices)
      
      expect(command.type).toBe('SET_BRAIN_VERTICES')
      expect(command.payload.vertices).toEqual(mockVertices)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.vertices).toEqual(mockVertices)
          resolve(undefined)
        })
      })
    })

    it('should set brain mesh loaded state', () => {
      const command = store.setBrainMeshLoaded(true)
      
      expect(command.type).toBe('SET_BRAIN_MESH_LOADED')
      expect(command.payload.loaded).toBe(true)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.isBrainMeshLoaded).toBe(true)
          resolve(undefined)
        })
      })
    })
  })

  describe('Selection Management', () => {
    beforeEach(() => {
      store.loadConcepts(mockConcepts)
      return new Promise(resolve => queueMicrotask(resolve))
    })

    it('should select concepts in replace mode', () => {
      const command = store.selectConcepts(['concept_001', 'concept_002'], 'replace')
      
      expect(command.type).toBe('SELECT_CONCEPTS')
      expect(command.payload.conceptIds).toEqual(['concept_001', 'concept_002'])
      expect(command.payload.mode).toBe('replace')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.selectedConceptIds.has('concept_001')).toBe(true)
          expect(state.selectedConceptIds.has('concept_002')).toBe(true)
          expect(state.selectedConceptIds.size).toBe(2)
          resolve(undefined)
        })
      })
    })

    it('should select concepts in toggle mode', () => {
      // First select one concept
      store.selectConcepts(['concept_001'], 'replace')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          // Then toggle selection (should deselect concept_001, select concept_002)
          store.selectConcepts(['concept_001', 'concept_002'], 'toggle')
          
          queueMicrotask(() => {
            const state = get()
            expect(state.selectedConceptIds.has('concept_001')).toBe(false)
            expect(state.selectedConceptIds.has('concept_002')).toBe(true)
            expect(state.selectedConceptIds.size).toBe(1)
            resolve(undefined)
          })
        })
      })
    })

    it('should clear selection', () => {
      store.selectConcepts(['concept_001', 'concept_002'], 'replace')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const command = store.clearConceptSelection()
          
          expect(command.type).toBe('CLEAR_CONCEPT_SELECTION')
          
          queueMicrotask(() => {
            const state = get()
            expect(state.selectedConceptIds.size).toBe(0)
            resolve(undefined)
          })
        })
      })
    })

    it('should set hovered concept', () => {
      const command = store.setHoveredConcept('concept_001')
      
      expect(command.type).toBe('SET_HOVERED_CONCEPT')
      expect(command.payload.conceptId).toBe('concept_001')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.hoveredConceptId).toBe('concept_001')
          resolve(undefined)
        })
      })
    })
  })

  describe('Position Management', () => {
    it('should set concept position', () => {
      const command = store.setConceptPosition('concept_001', 5, 1)
      
      expect(command.type).toBe('SET_CONCEPT_POSITION')
      expect(command.payload.conceptId).toBe('concept_001')
      expect(command.payload.vertexIndex).toBe(5)
      expect(command.payload.shell).toBe(1)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          const position = state.conceptPositions.get('concept_001')
          expect(position).toEqual({ vertexIndex: 5, shell: 1 })
          resolve(undefined)
        })
      })
    })

    it('should clear concept positions', () => {
      store.setConceptPosition('concept_001', 5, 1)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const command = store.clearConceptPositions()
          
          expect(command.type).toBe('CLEAR_CONCEPT_POSITIONS')
          
          queueMicrotask(() => {
            const state = get()
            expect(state.conceptPositions.size).toBe(0)
            resolve(undefined)
          })
        })
      })
    })
  })

  describe('Category Filtering', () => {
    beforeEach(() => {
      store.loadConcepts(mockConcepts)
      return new Promise(resolve => queueMicrotask(resolve))
    })

    it('should set visible categories', () => {
      const command = store.setVisibleCategories(['Technology'])
      
      expect(command.type).toBe('SET_VISIBLE_CATEGORIES')
      expect(command.payload.categories).toEqual(['Technology'])
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.visibleCategories.has('Technology')).toBe(true)
          expect(state.visibleCategories.has('Philosophy')).toBe(false)
          expect(state.visibleCategories.size).toBe(1)
          resolve(undefined)
        })
      })
    })

    it('should toggle category', () => {
      const command = store.toggleCategory('Technology')
      
      expect(command.type).toBe('TOGGLE_CATEGORY')
      expect(command.payload.category).toBe('Technology')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          // Should remove Technology since it was already visible
          expect(state.visibleCategories.has('Technology')).toBe(false)
          resolve(undefined)
        })
      })
    })

    it('should show all categories', () => {
      // First hide some categories
      store.setVisibleCategories(['Technology'])
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const command = store.showAllCategories()
          
          expect(command.type).toBe('SHOW_ALL_CATEGORIES')
          
          queueMicrotask(() => {
            const state = get()
            expect(state.visibleCategories.has('Technology')).toBe(true)
            expect(state.visibleCategories.has('Philosophy')).toBe(true)
            resolve(undefined)
          })
        })
      })
    })
  })

  describe('Query Methods', () => {
    beforeEach(() => {
      store.loadConcepts(mockConcepts)
      return new Promise(resolve => queueMicrotask(resolve))
    })

    it('should get concept by id', () => {
      const concept = store.getConcept('concept_001')
      expect(concept).toEqual(mockConcepts[0])
      
      const nonExistent = store.getConcept('nonexistent')
      expect(nonExistent).toBeUndefined()
    })

    it('should get concepts by category', () => {
      const techConcepts = store.getConceptsByCategory('Technology')
      expect(techConcepts).toHaveLength(2)
      expect(techConcepts.map(c => c.id)).toEqual(['concept_001', 'concept_002'])
      
      const philConcepts = store.getConceptsByCategory('Philosophy')
      expect(philConcepts).toHaveLength(1)
      expect(philConcepts[0].id).toBe('concept_003')
    })

    it('should get visible concepts based on category filters', () => {
      // All categories visible by default
      let visible = store.getVisibleConcepts()
      expect(visible).toHaveLength(3)
      
      // Filter to only Technology
      store.setVisibleCategories(['Technology'])
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          visible = store.getVisibleConcepts()
          expect(visible).toHaveLength(2)
          expect(visible.map(c => c.id)).toEqual(['concept_001', 'concept_002'])
          resolve(undefined)
        })
      })
    })

    it('should check if concept is selected', () => {
      expect(store.isConceptSelected('concept_001')).toBe(false)
      
      store.selectConcepts(['concept_001'], 'replace')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          expect(store.isConceptSelected('concept_001')).toBe(true)
          expect(store.isConceptSelected('concept_002')).toBe(false)
          resolve(undefined)
        })
      })
    })

    it('should get selected concepts', () => {
      store.selectConcepts(['concept_001', 'concept_003'], 'replace')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const selected = store.getSelectedConcepts()
          expect(selected).toHaveLength(2)
          expect(selected.map(c => c.id)).toEqual(['concept_001', 'concept_003'])
          resolve(undefined)
        })
      })
    })

    it('should get all categories', () => {
      const categories = store.getAllCategories()
      expect(categories).toEqual(['Technology', 'Philosophy'])
    })

    it('should get concept metrics', () => {
      store.selectConcepts(['concept_001'], 'replace')
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const metrics = store.getConceptMetrics()
          expect(metrics.total).toBe(3)
          expect(metrics.visible).toBe(3) // All categories visible
          expect(metrics.selected).toBe(1)
          resolve(undefined)
        })
      })
    })
  })

  describe('Performance Tracking', () => {
    it('should update render metrics', () => {
      const metrics = { renderTime: 16.67, frameRate: 60 }
      const command = store.updateRenderMetrics(metrics)
      
      expect(command.type).toBe('UPDATE_RENDER_METRICS')
      expect(command.payload.metrics).toEqual(metrics)
      
      return new Promise(resolve => {
        queueMicrotask(() => {
          const state = get()
          expect(state.renderMetrics.lastRenderTime).toBe(16.67)
          expect(state.renderMetrics.frameRate).toBe(60)
          resolve(undefined)
        })
      })
    })
  })
})