/**
 * Performance tests for mindmap slice re-render optimization
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { create } from 'zustand'
import { enableMapSet } from 'immer'
import { createMindmapSlice, type MindmapSlice } from './mindmapSlice'
import type { Node } from '@refinery/schema'

// Enable Immer support for Maps and Sets
enableMapSet()

// Create large dataset for performance testing
const createLargeDataset = (size: number): Node[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: `concept_${i.toString().padStart(6, '0')}`,
    label: `Concept ${i}`,
    color: `hsl(${(i * 137.5) % 360}, 70%, 50%)`,
    metadata: {
      category: ['Technology', 'Science', 'Philosophy', 'Art'][i % 4],
      importance: (i % 10) + 1
    }
  }))
}

describe('MindmapSlice Performance', () => {
  let store: MindmapSlice
  let get: () => MindmapSlice
  let renderCount = 0

  beforeEach(() => {
    renderCount = 0
    const testStore = create<MindmapSlice>((set, getFn) => {
      get = getFn
      return createMindmapSlice(
        (...args) => {
          renderCount++
          return set(...args)
        },
        getFn
      )
    })
    
    store = testStore.getState()
  })

  describe('Re-render Optimization', () => {
    it('should minimize re-renders for bulk concept loading', async () => {
      const concepts = createLargeDataset(1000)
      const startTime = performance.now()
      
      // Single bulk operation should trigger minimal renders
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const endTime = performance.now()
      const loadTime = endTime - startTime
      
      const state = get()
      expect(state.concepts.size).toBe(1000)
      expect(loadTime).toBeLessThan(100) // Should load 1000 concepts in <100ms
      expect(renderCount).toBe(1) // Only one render for bulk operation
      
      console.log(`Loaded 1000 concepts in ${loadTime.toFixed(2)}ms with ${renderCount} renders`)
    })

    it('should optimize selection operations', async () => {
      const concepts = createLargeDataset(100)
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      renderCount = 0 // Reset after initial load
      const startTime = performance.now()
      
      // Multiple selection operations
      const conceptIds = concepts.slice(0, 10).map(c => c.id)
      store.selectConcepts(conceptIds, 'replace')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const endTime = performance.now()
      const selectionTime = endTime - startTime
      
      const state = get()
      expect(state.selectedConceptIds.size).toBe(10)
      expect(selectionTime).toBeLessThan(10) // Selection should be fast
      expect(renderCount).toBe(1) // Only one render for selection
      
      console.log(`Selected 10 concepts in ${selectionTime.toFixed(2)}ms with ${renderCount} renders`)
    })

    it('should optimize category filtering without re-renders', async () => {
      const concepts = createLargeDataset(200)
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      renderCount = 0
      const startTime = performance.now()
      
      // Test query methods (should not trigger re-renders)
      const techConcepts = store.getConceptsByCategory('Technology')
      const visibleConcepts = store.getVisibleConcepts()
      const allCategories = store.getAllCategories()
      const metrics = store.getConceptMetrics()
      
      const endTime = performance.now()
      const queryTime = endTime - startTime
      
      expect(techConcepts.length).toBe(50) // 200/4 = 50 per category
      expect(visibleConcepts.length).toBe(200)
      expect(allCategories).toHaveLength(4)
      expect(metrics.total).toBe(200)
      expect(queryTime).toBeLessThan(5) // Queries should be very fast
      expect(renderCount).toBe(0) // Queries should not trigger renders
      
      console.log(`Executed 4 queries in ${queryTime.toFixed(2)}ms with ${renderCount} renders`)
    })

    it('should handle rapid hover state changes efficiently', async () => {
      const concepts = createLargeDataset(50)
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      renderCount = 0
      const startTime = performance.now()
      
      // Simulate rapid hover changes (mouse movement)
      const hoverOperations = []
      for (let i = 0; i < 10; i++) {
        hoverOperations.push(
          new Promise(resolve => {
            store.setHoveredConcept(`concept_${i.toString().padStart(6, '0')}`)
            queueMicrotask(resolve)
          })
        )
      }
      
      await Promise.all(hoverOperations)
      
      const endTime = performance.now()
      const hoverTime = endTime - startTime
      
      const state = get()
      expect(state.hoveredConceptId).toBe('concept_000009') // Last hover
      expect(hoverTime).toBeLessThan(20) // Hover changes should be fast
      // Note: Multiple async operations may trigger multiple renders
      
      console.log(`Processed 10 hover changes in ${hoverTime.toFixed(2)}ms with ${renderCount} renders`)
    })

    it('should optimize visual state updates', async () => {
      const concepts = createLargeDataset(100)
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      renderCount = 0
      const startTime = performance.now()
      
      // Batch visual updates
      const visualOperations = concepts.slice(0, 20).map(concept => 
        new Promise<void>(resolve => {
          store.setConceptVisual(concept.id, { 
            scale: 1.2, 
            color: '#ff0000',
            visible: true 
          })
          queueMicrotask(() => resolve())
        })
      )
      
      await Promise.all(visualOperations)
      
      const endTime = performance.now()
      const visualTime = endTime - startTime
      
      const state = get()
      const visual = state.getConceptVisual('concept_000000')
      expect(visual.scale).toBe(1.2)
      expect(visual.color).toBe('#ff0000')
      expect(visualTime).toBeLessThan(50) // Visual updates should be reasonably fast
      
      console.log(`Updated 20 visual states in ${visualTime.toFixed(2)}ms with ${renderCount} renders`)
    })

    it('should measure frame rate impact simulation', async () => {
      const concepts = createLargeDataset(500)
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Simulate frame rate monitoring
      const frameRates: number[] = []
      const startTime = performance.now()
      
      for (let frame = 0; frame < 60; frame++) { // Simulate 60 frames
        const frameStart = performance.now()
        
        // Simulate frame operations
        if (frame % 10 === 0) {
          // Occasional hover change
          store.setHoveredConcept(`concept_${(frame % 100).toString().padStart(6, '0')}`)
        }
        
        if (frame % 30 === 0) {
          // Occasional performance metric update
          const frameTime = performance.now() - frameStart
          store.updateRenderMetrics({ 
            renderTime: frameTime,
            frameRate: 1000 / frameTime 
          })
        }
        
        const frameEnd = performance.now()
        const frameTime = frameEnd - frameStart
        frameRates.push(1000 / frameTime)
        
        // Simulate frame delay
        await new Promise(resolve => setTimeout(resolve, 1))
      }
      
      const totalTime = performance.now() - startTime
      const avgFrameRate = frameRates.reduce((a, b) => a + b, 0) / frameRates.length
      
      const state = get()
      expect(state.renderMetrics.frameRate).toBeGreaterThan(0)
      expect(avgFrameRate).toBeGreaterThan(100) // Simulated high performance
      expect(totalTime).toBeLessThan(1000) // 60 frame simulation in <1s
      
      console.log(`Simulated 60 frames in ${totalTime.toFixed(2)}ms, avg FPS: ${avgFrameRate.toFixed(1)}`)
    })
  })

  describe('Memory Usage Optimization', () => {
    it('should efficiently manage large concept datasets', async () => {
      const initialMemory = process.memoryUsage()
      
      // Load large dataset
      const largeConcepts = createLargeDataset(5000)
      store.loadConcepts(largeConcepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const afterLoadMemory = process.memoryUsage()
      
      // Perform operations
      store.selectConcepts(largeConcepts.slice(0, 100).map(c => c.id), 'replace')
      store.setVisibleCategories(['Technology', 'Science'])
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const afterOpsMemory = process.memoryUsage()
      
      // Clear and check cleanup
      store.clearConcepts()
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      const afterClearMemory = process.memoryUsage()
      
      const state = get()
      expect(state.concepts.size).toBe(0)
      expect(state.selectedConceptIds.size).toBe(0)
      expect(state.conceptVisuals.size).toBe(0)
      
      // Memory should be released after clear
      const memoryIncrease = afterLoadMemory.heapUsed - initialMemory.heapUsed
      const memoryAfterClear = afterClearMemory.heapUsed - initialMemory.heapUsed
      
      console.log(`Memory increase after loading 5000 concepts: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`)
      console.log(`Memory remaining after clear: ${(memoryAfterClear / 1024 / 1024).toFixed(2)}MB`)
      
      // Memory should be mostly reclaimed (allow some overhead)
      expect(memoryAfterClear).toBeLessThan(memoryIncrease * 0.5)
    })

    it('should optimize Map and Set operations', async () => {
      const concepts = createLargeDataset(1000)
      
      const startTime = performance.now()
      
      // Test Map operations (concepts)
      store.loadConcepts(concepts)
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      let state = get()
      
      // Test Set operations (selection)
      const selectionIds = concepts.slice(0, 100).map(c => c.id)
      store.selectConcepts(selectionIds, 'replace')
      
      await new Promise(resolve => queueMicrotask(resolve))
      
      // Test Map lookup performance
      const lookupStart = performance.now()
      
      for (let i = 0; i < 100; i++) {
        const conceptId = `concept_${i.toString().padStart(6, '0')}`
        const concept = store.getConcept(conceptId)
        const isSelected = store.isConceptSelected(conceptId)
        expect(concept).toBeDefined()
        expect(isSelected).toBe(true)
      }
      
      const lookupTime = performance.now() - lookupStart
      const totalTime = performance.now() - startTime
      
      expect(lookupTime).toBeLessThan(10) // 100 lookups in <10ms
      expect(totalTime).toBeLessThan(100) // Total operations in <100ms
      
      console.log(`100 Map/Set lookups in ${lookupTime.toFixed(2)}ms`)
      console.log(`Total test time: ${totalTime.toFixed(2)}ms`)
    })
  })
})