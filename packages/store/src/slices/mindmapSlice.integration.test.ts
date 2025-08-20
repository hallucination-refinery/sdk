/**
 * Integration tests for mindmap slice with ConceptParticles component patterns
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { enableMapSet } from 'immer'
import { createMindmapSlice, type MindmapSlice } from './mindmapSlice'
import type { Node, Vector3 } from '@refinery/schema'

// Enable Immer support for Maps and Sets
enableMapSet()

// Simulate loading test fixture data
const loadFixtureData = async (): Promise<{ concepts: Node[], vertices: Vector3[] }> => {
  return {
    concepts: [
      {
        id: 'concept_001',
        label: 'Artificial Intelligence',
        color: '#3498db',
        metadata: { category: 'Technology', importance: 8 }
      },
      {
        id: 'concept_002', 
        label: 'Machine Learning',
        color: '#e74c3c',
        metadata: { category: 'Technology', importance: 9 }
      },
      {
        id: 'concept_003',
        label: 'Neural Networks',
        color: '#2ecc71',
        metadata: { category: 'Technology', importance: 7 }
      }
    ],
    vertices: Array.from({ length: 100 }, (_, i) => ({
      x: Math.cos(i * 0.1) * 10,
      y: Math.sin(i * 0.1) * 10,
      z: (i % 10) * 2
    }))
  }
}

describe('MindmapSlice Integration', () => {
  let store: MindmapSlice
  let get: () => MindmapSlice

  beforeEach(() => {
    const testStore = create<MindmapSlice>((set, getFn) => {
      get = getFn
      return createMindmapSlice(set, getFn)
    })
    
    store = testStore.getState()
  })

  describe('ConceptParticles Integration Pattern', () => {
    it('should handle complete initialization flow', async () => {
      const { concepts, vertices } = await loadFixtureData()
      
      // 1. Load brain vertices first (brain mesh loaded)
      store.setBrainVertices(vertices)
      store.setBrainMeshLoaded(true)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      let state = get()
      expect(state.isBrainMeshLoaded).toBe(true)
      expect(state.vertices).toHaveLength(100)
      
      // 2. Load concepts
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      expect(state.concepts.size).toBe(3)
      expect(state.visibleCategories.has('Technology')).toBe(true)
      
      // 3. Set concept positions (simulating vertex mapping)
      store.setConceptPosition('concept_001', 0, 0)
      store.setConceptPosition('concept_002', 1, 0) 
      store.setConceptPosition('concept_003', 2, 0)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      expect(state.conceptPositions.size).toBe(3)
      expect(state.getConceptPosition('concept_001')).toEqual({ vertexIndex: 0, shell: 0 })
      
      // 4. Test interaction patterns
      store.setHoveredConcept('concept_001')
      store.selectConcepts(['concept_001'], 'replace')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      expect(state.hoveredConceptId).toBe('concept_001')
      expect(state.isConceptSelected('concept_001')).toBe(true)
      expect(state.getSelectedConcepts()).toHaveLength(1)
    })

    it('should handle category filtering for performance', async () => {
      const { concepts } = await loadFixtureData()
      
      // Add concepts from different categories
      const mixedConcepts = [
        ...concepts,
        {
          id: 'concept_004',
          label: 'Ethics',
          color: '#9b59b6',
          metadata: { category: 'Philosophy', importance: 6 }
        },
        {
          id: 'concept_005', 
          label: 'Consciousness',
          color: '#f39c12',
          metadata: { category: 'Philosophy', importance: 8 }
        }
      ] as Node[]
      
      store.loadConcepts(mixedConcepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      let state = get()
      expect(state.getAllCategories()).toEqual(['Technology', 'Philosophy'])
      expect(state.getVisibleConcepts()).toHaveLength(5) // All visible initially
      
      // Filter to only Technology (performance optimization for rendering)
      store.setVisibleCategories(['Technology'])
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      const visible = state.getVisibleConcepts()
      expect(visible).toHaveLength(3)
      expect(visible.every(c => c.metadata?.category === 'Technology')).toBe(true)
      
      // Performance metrics
      const metrics = state.getConceptMetrics()
      expect(metrics.total).toBe(5)
      expect(metrics.visible).toBe(3)
      expect(metrics.selected).toBe(0)
    })

    it('should handle visual state updates for hover effects', async () => {
      const { concepts } = await loadFixtureData()
      
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Test hover scale animation
      store.setConceptVisual('concept_001', { scale: 1.5 })
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      let state = get()
      let visual = state.getConceptVisual('concept_001')
      expect(visual.scale).toBe(1.5)
      expect(visual.visible).toBe(true)
      
      // Test hover end (reset scale)
      store.setConceptVisual('concept_001', { scale: 1.0 })
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      visual = state.getConceptVisual('concept_001')
      expect(visual.scale).toBe(1.0)
      
      // Test hiding concept
      store.setConceptVisual('concept_002', { visible: false })
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      visual = state.getConceptVisual('concept_002')
      expect(visual.visible).toBe(false)
    })

    it('should track render performance metrics', async () => {
      const { concepts, vertices } = await loadFixtureData()
      
      store.loadConcepts(concepts)
      store.setBrainVertices(vertices)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Simulate frame rate tracking
      const frameMetrics = { renderTime: 16.67, frameRate: 60 }
      store.updateRenderMetrics(frameMetrics)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const state = get()
      expect(state.renderMetrics.lastRenderTime).toBe(16.67)
      expect(state.renderMetrics.frameRate).toBe(60)
      expect(state.renderMetrics.conceptCount).toBe(3)
      
      // Simulate performance degradation
      const degradedMetrics = { renderTime: 33.33, frameRate: 30 }
      store.updateRenderMetrics(degradedMetrics)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const updatedState = get()
      expect(updatedState.renderMetrics.frameRate).toBe(30)
    })

    it('should handle multi-selection scenarios', async () => {
      const { concepts } = await loadFixtureData()
      
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Multi-select with Ctrl+click pattern
      store.selectConcepts(['concept_001'], 'replace')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      store.selectConcepts(['concept_002'], 'add')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      let state = get()
      expect(state.getSelectedConcepts()).toHaveLength(2)
      expect(state.isConceptSelected('concept_001')).toBe(true)
      expect(state.isConceptSelected('concept_002')).toBe(true)
      
      // Toggle deselection
      store.selectConcepts(['concept_001'], 'toggle')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      state = get()
      expect(state.getSelectedConcepts()).toHaveLength(1)
      expect(state.isConceptSelected('concept_001')).toBe(false)
      expect(state.isConceptSelected('concept_002')).toBe(true)
    })

    it('should handle shell positioning for overflow scenarios', async () => {
      const { concepts } = await loadFixtureData()
      
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Simulate overflow shell positioning
      store.setConceptPosition('concept_001', 0, 0) // Core brain
      store.setConceptPosition('concept_002', 1, 1) // First shell
      store.setConceptPosition('concept_003', 2, 2) // Second shell
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const state = get()
      expect(state.getConceptPosition('concept_001')?.shell).toBe(0)
      expect(state.getConceptPosition('concept_002')?.shell).toBe(1)
      expect(state.getConceptPosition('concept_003')?.shell).toBe(2)
      
      // Test bulk position update
      const newPositions = new Map([
        ['concept_001', { vertexIndex: 10, shell: 0 }],
        ['concept_002', { vertexIndex: 11, shell: 0 }],
        ['concept_003', { vertexIndex: 12, shell: 1 }]
      ])
      
      store.updateConceptPositions(newPositions)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const updatedState = get()
      expect(updatedState.getConceptPosition('concept_001')?.vertexIndex).toBe(10)
      expect(updatedState.getConceptPosition('concept_003')?.shell).toBe(1)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty data gracefully', async () => {
      store.loadConcepts([])
      store.setBrainVertices([])
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const state = get()
      expect(state.concepts.size).toBe(0)
      expect(state.vertices).toHaveLength(0)
      expect(state.getVisibleConcepts()).toHaveLength(0)
      expect(state.getAllCategories()).toHaveLength(0)
      expect(state.getConceptMetrics().total).toBe(0)
    })

    it('should handle concept without category', async () => {
      const conceptWithoutCategory: Node = {
        id: 'concept_no_cat',
        label: 'No Category Concept',
        color: '#ffffff'
        // No metadata.category
      }
      
      store.loadConcepts([conceptWithoutCategory])
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const state = get()
      expect(state.concepts.size).toBe(1)
      expect(state.getAllCategories()).toHaveLength(0)
      expect(state.getVisibleConcepts()).toHaveLength(1) // Should still be visible
    })

    it('should handle invalid concept operations', async () => {
      const { concepts } = await loadFixtureData()
      
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Try to get non-existent concept
      expect(store.getConcept('nonexistent')).toBeUndefined()
      expect(store.getConceptPosition('nonexistent')).toBeUndefined()
      
      // Try to select non-existent concept (should not error)
      store.selectConcepts(['nonexistent'], 'replace')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const state = get()
      expect(state.selectedConceptIds.has('nonexistent')).toBe(true) // Still tracked
      expect(state.getSelectedConcepts()).toHaveLength(0) // But no actual concepts returned
    })
  })
})