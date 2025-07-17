/**
 * Tests for app-slice state migration
 * Verifies that lens switching, timeline navigation, and state updates work correctly
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAppStore, selectTimelineDate } from '../app-slice'
import { useUIStore, useGraphStore } from '@refinery/store'
import { mapToArrays } from '../graph-utils'

describe('App Slice Migration', () => {
  beforeEach(() => {
    // Reset stores between tests
    useAppStore.getState().reset()
    // Note: @refinery/store doesn't expose getInitialState, so we'll clear manually
    useUIStore.getState().clearSelection()
    useGraphStore.getState().clearGraph()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAppStore())
    
    expect(result.current.activeLens).toBe('causal')
    expect(result.current.timeIndex).toBe(0)
    expect(result.current.timelineDate).toBeNull()
    expect(result.current.dialState).toEqual({
      interwingleMode: 0,
      searchDepth: 3
    })
    expect(result.current.searchResultNodeIds).toEqual([])
    expect(result.current.currentInteractionMode).toBe('mouse')
    expect(result.current.gesturedNodeId).toBeNull()
  })

  it('should update activeLens and trigger re-render', () => {
    const { result } = renderHook(() => useAppStore())
    
    expect(result.current.activeLens).toBe('causal')
    
    act(() => {
      result.current.setActiveLens('affinity')
    })
    
    expect(result.current.activeLens).toBe('affinity')
    
    act(() => {
      result.current.setActiveLens('temporal')
    })
    
    expect(result.current.activeLens).toBe('temporal')
  })
  
  it('should update timeIndex and derive timelineDate', () => {
    const dates = ['2024-01-01', '2024-01-02', '2024-01-03']
    const { result } = renderHook(() => {
      const state = useAppStore()
      const timelineDate = useAppStore(selectTimelineDate(dates))
      return { ...state, timelineDate }
    })
    
    expect(result.current.timeIndex).toBe(0)
    expect(result.current.timelineDate).toBe('2024-01-01')
    
    act(() => {
      result.current.setTimeIndex(2)
    })
    
    expect(result.current.timeIndex).toBe(2)
    expect(result.current.timelineDate).toBe('2024-01-03')
    
    // Test edge case - index out of bounds
    act(() => {
      result.current.setTimeIndex(10)
    })
    
    expect(result.current.timeIndex).toBe(10)
    expect(result.current.timelineDate).toBeNull()
  })
  
  it('should update dialState correctly', () => {
    const { result } = renderHook(() => useAppStore())
    
    const newDialState = {
      interwingleMode: 2,
      searchDepth: 5
    }
    
    act(() => {
      result.current.setDialState(newDialState)
    })
    
    expect(result.current.dialState).toEqual(newDialState)
  })
  
  it('should manage search result node IDs', () => {
    const { result } = renderHook(() => useAppStore())
    
    const searchResults = ['node-1', 'node-2', 'node-3']
    
    act(() => {
      result.current.setSearchResultNodeIds(searchResults)
    })
    
    expect(result.current.searchResultNodeIds).toEqual(searchResults)
    
    // Clear search results
    act(() => {
      result.current.setSearchResultNodeIds([])
    })
    
    expect(result.current.searchResultNodeIds).toEqual([])
  })
  
  it('should convert single selectedNodeId to Set in UISlice', () => {
    const { result } = renderHook(() => useUIStore())
    
    act(() => {
      result.current.selectNodes(['node-1'], 'replace')
    })
    
    expect(result.current.selectedNodeIds).toEqual(new Set(['node-1']))
    expect(result.current.getSelectedNodes()).toEqual(['node-1'])
    
    // Test multiple selection
    act(() => {
      result.current.selectNodes(['node-2', 'node-3'], 'add')
    })
    
    expect(result.current.selectedNodeIds.size).toBe(3)
    expect(result.current.getSelectedNodes()).toContain('node-1')
    expect(result.current.getSelectedNodes()).toContain('node-2')
    expect(result.current.getSelectedNodes()).toContain('node-3')
  })
  
  it('should integrate with graph store for data conversion', () => {
    const { result: graphResult } = renderHook(() => useGraphStore())
    const { result: appResult } = renderHook(() => useAppStore())
    
    // Add test data to graph store
    act(() => {
      graphResult.current.batchAddNodes([
        { 
          id: 'n1', 
          label: 'Node 1', 
          type: 'idea',
          links: [],
          meta: { source: 'test', created: Date.now() },
          state: { isSelected: false, currentLOD: 'Mid', isCollapsed: false, isHidden: false, isLinkingStart: false }
        },
        { 
          id: 'n2', 
          label: 'Node 2', 
          type: 'idea',
          links: [],
          meta: { source: 'test', created: Date.now() },
          state: { isSelected: false, currentLOD: 'Mid', isCollapsed: false, isHidden: false, isLinkingStart: false }
        }
      ])
      graphResult.current.batchAddEdges([
        { id: 'e1', source: 'n1', target: 'n2', confidence: 0.9 }
      ])
    })
    
    // Convert to arrays
    const { nodes, links } = mapToArrays(
      graphResult.current.nodes,
      graphResult.current.edges
    )
    
    // Verify conversion
    expect(nodes).toHaveLength(2)
    expect(links).toHaveLength(1)
    expect(links[0]).toMatchObject({
      source: 'n1',
      target: 'n2',
      tier: 0
    })
    
    // Test lens switching with graph data
    act(() => {
      appResult.current.setActiveLens('affinity')
    })
    
    expect(appResult.current.activeLens).toBe('affinity')
  })
  
  it('should reset to initial state', () => {
    const { result } = renderHook(() => useAppStore())
    
    // Change some state
    act(() => {
      result.current.setActiveLens('temporal')
      result.current.setTimeIndex(5)
      result.current.setSearchResultNodeIds(['node-1'])
      result.current.setGesturedNodeId('gesture-1')
    })
    
    expect(result.current.activeLens).toBe('temporal')
    expect(result.current.timeIndex).toBe(5)
    
    // Reset
    act(() => {
      result.current.reset()
    })
    
    expect(result.current.activeLens).toBe('causal')
    expect(result.current.timeIndex).toBe(0)
    expect(result.current.searchResultNodeIds).toEqual([])
    expect(result.current.gesturedNodeId).toBeNull()
  })
})