import { z } from 'zod'

/**
 * Schema for selection state
 * Tracks which nodes and edges are currently selected
 */
export const SelectionSchema = z.object({
  /**
   * Set of selected node IDs
   */
  nodeIds: z.set(z.string()),
  
  /**
   * Set of selected edge IDs
   */
  edgeIds: z.set(z.string()),
  
  /**
   * Primary/active selection (for operations that need a single target)
   */
  primaryNodeId: z.string().optional(),
  
  /**
   * Timestamp when selection was last modified
   */
  lastModified: z.string().datetime().optional(),
})

/**
 * TypeScript type for selection state
 */
export type Selection = z.infer<typeof SelectionSchema>

/**
 * Schema for selection operations
 */
export const SelectionOperationSchema = z.enum([
  'set',      // Replace selection
  'add',      // Add to selection
  'remove',   // Remove from selection
  'toggle',   // Toggle selection state
  'clear',    // Clear all selections
])

export type SelectionOperation = z.infer<typeof SelectionOperationSchema>

/**
 * Schema for selection change event
 */
export const SelectionChangeEventSchema = z.object({
  operation: SelectionOperationSchema,
  nodeIds: z.array(z.string()).optional(),
  edgeIds: z.array(z.string()).optional(),
  previousSelection: SelectionSchema,
  newSelection: SelectionSchema,
})

export type SelectionChangeEvent = z.infer<typeof SelectionChangeEventSchema>

/**
 * Utility functions for selection operations
 */
export class SelectionUtils {
  /**
   * Create an empty selection
   */
  static empty(): Selection {
    return {
      nodeIds: new Set(),
      edgeIds: new Set(),
    }
  }
  
  /**
   * Check if selection is empty
   */
  static isEmpty(selection: Selection): boolean {
    return selection.nodeIds.size === 0 && selection.edgeIds.size === 0
  }
  
  /**
   * Check if a node is selected
   */
  static isNodeSelected(selection: Selection, nodeId: string): boolean {
    return selection.nodeIds.has(nodeId)
  }
  
  /**
   * Check if an edge is selected
   */
  static isEdgeSelected(selection: Selection, edgeId: string): boolean {
    return selection.edgeIds.has(edgeId)
  }
  
  /**
   * Select nodes (replace current selection)
   */
  static selectNodes(nodeIds: string[]): Selection {
    return {
      nodeIds: new Set(nodeIds),
      edgeIds: new Set(),
      primaryNodeId: nodeIds[0],
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Select edges (replace current selection)
   */
  static selectEdges(edgeIds: string[]): Selection {
    return {
      nodeIds: new Set(),
      edgeIds: new Set(edgeIds),
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Add nodes to selection
   */
  static addNodes(selection: Selection, nodeIds: string[]): Selection {
    const newNodeIds = new Set(selection.nodeIds)
    nodeIds.forEach(id => newNodeIds.add(id))
    return {
      ...selection,
      nodeIds: newNodeIds,
      primaryNodeId: selection.primaryNodeId || nodeIds[0],
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Add edges to selection
   */
  static addEdges(selection: Selection, edgeIds: string[]): Selection {
    const newEdgeIds = new Set(selection.edgeIds)
    edgeIds.forEach(id => newEdgeIds.add(id))
    return {
      ...selection,
      edgeIds: newEdgeIds,
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Remove nodes from selection
   */
  static removeNodes(selection: Selection, nodeIds: string[]): Selection {
    const newNodeIds = new Set(selection.nodeIds)
    nodeIds.forEach(id => newNodeIds.delete(id))
    
    // Update primary node if it was removed
    const primaryNodeId = selection.primaryNodeId && newNodeIds.has(selection.primaryNodeId)
      ? selection.primaryNodeId
      : newNodeIds.size > 0 ? Array.from(newNodeIds)[0] : undefined
    
    return {
      ...selection,
      nodeIds: newNodeIds,
      primaryNodeId,
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Remove edges from selection
   */
  static removeEdges(selection: Selection, edgeIds: string[]): Selection {
    const newEdgeIds = new Set(selection.edgeIds)
    edgeIds.forEach(id => newEdgeIds.delete(id))
    return {
      ...selection,
      edgeIds: newEdgeIds,
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Toggle node selection
   */
  static toggleNodes(selection: Selection, nodeIds: string[]): Selection {
    const newNodeIds = new Set(selection.nodeIds)
    nodeIds.forEach(id => {
      if (newNodeIds.has(id)) {
        newNodeIds.delete(id)
      } else {
        newNodeIds.add(id)
      }
    })
    
    // Update primary node
    const primaryNodeId = selection.primaryNodeId && newNodeIds.has(selection.primaryNodeId)
      ? selection.primaryNodeId
      : newNodeIds.size > 0 ? Array.from(newNodeIds)[0] : undefined
    
    return {
      ...selection,
      nodeIds: newNodeIds,
      primaryNodeId,
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Toggle edge selection
   */
  static toggleEdges(selection: Selection, edgeIds: string[]): Selection {
    const newEdgeIds = new Set(selection.edgeIds)
    edgeIds.forEach(id => {
      if (newEdgeIds.has(id)) {
        newEdgeIds.delete(id)
      } else {
        newEdgeIds.add(id)
      }
    })
    return {
      ...selection,
      edgeIds: newEdgeIds,
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Clear all selections
   */
  static clear(): Selection {
    return {
      nodeIds: new Set(),
      edgeIds: new Set(),
      primaryNodeId: undefined,
      lastModified: new Date().toISOString(),
    }
  }
  
  /**
   * Get selection counts
   */
  static getCounts(selection: Selection): { nodes: number; edges: number } {
    return {
      nodes: selection.nodeIds.size,
      edges: selection.edgeIds.size,
    }
  }
}