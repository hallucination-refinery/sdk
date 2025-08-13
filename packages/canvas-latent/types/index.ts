import React from 'react'

/**
 * Lens type definition - determines graph layout strategy
 */
export type Lens = 'affinity' | 'causal' | 'temporal'

/**
 * Position data for a node in a specific lens view
 */
export interface LensPosition {
  x: number
  y: number
  z: number
}

/**
 * Core node data structure for canvas-latent
 * Compatible with ForceGraphAdapter expectations
 */
export interface NodeData {
  id: string
  
  // Core rendering properties
  label?: string
  desc?: string
  color?: string
  opacity?: number
  relSize?: number
  val?: number
  visibility?: boolean
  
  // Position management
  x?: number
  y?: number
  z?: number
  
  // Position by lens - optional positions for different viewing modes
  posByLens?: {
    affinity?: LensPosition
    causal?: LensPosition
    temporal?: LensPosition
  }
  
  // Physics properties (for d3-force compatibility)
  vx?: number
  vy?: number
  vz?: number
  fx?: number | null
  fy?: number | null
  fz?: number | null
  
  // Three.js object reference
  __threeObj?: any
  
  // HUD passthrough fields
  category?: string
  tags?: string[]
  metadata?: Record<string, any>
  
  // Event metadata
  timestamp?: number
  lastModified?: number
  
  // Selection/interaction state
  selected?: boolean
  highlighted?: boolean
  dragging?: boolean
  
  // Custom properties (passthrough)
  [key: string]: any
}

/**
 * Link data structure
 */
export interface LinkData {
  source: string | NodeData
  target: string | NodeData
  
  // Rendering properties
  color?: string
  opacity?: number
  width?: number
  curvature?: number
  curveRotation?: number
  visibility?: boolean
  
  // Metadata
  type?: string
  strength?: number
  
  // Custom properties (passthrough)
  [key: string]: any
}

/**
 * Graph data structure
 */
export interface GraphData {
  nodes: NodeData[]
  links: LinkData[]
}

/**
 * Node Attribute Manager - handles dynamic node property updates
 * This interface defines methods for managing node visual states
 */
export interface NodeAttributeManager {
  /**
   * Update a single node's attributes
   */
  updateNodeAttribute(nodeId: string, attribute: keyof NodeData, value: any): void
  
  /**
   * Batch update multiple nodes
   */
  updateNodesAttributes(updates: Array<{
    nodeId: string
    attributes: Partial<NodeData>
  }>): void
  
  /**
   * Get current attributes for a node
   */
  getNodeAttributes(nodeId: string): NodeData | undefined
  
  /**
   * Apply visual highlighting to a node (yellow: 0xffff00)
   */
  highlightNode(nodeId: string | null): void
  
  /**
   * Apply visual selection to a node (orange: 0xffa500)
   */
  selectNode(nodeId: string, toggle?: boolean): void
  
  /**
   * Clear all visual selections
   */
  clearSelections(): void
  
  /**
   * Update node position in current lens
   */
  updateNodePosition(nodeId: string, position: { x: number; y: number; z: number }): void
  
  /**
   * Update node position for a specific lens
   */
  updateNodeLensPosition(nodeId: string, lens: Lens, position: LensPosition): void
  
  /**
   * Get all selected node IDs
   */
  getSelectedNodes(): Set<string>
  
  /**
   * Get currently highlighted node ID
   */
  getHighlightedNode(): string | null
}

/**
 * ForceGraphAdapter Props Interface
 * Complete props that canvas-latent adapter must accept
 */
export interface ForceGraphAdapterProps {
  // Core props
  ref?: React.Ref<any>
  graphData: GraphData
  
  // Node/Link ID accessors
  nodeId?: string
  linkSource?: string
  linkTarget?: string
  
  // Event handlers
  onNodeClick?: (node: NodeData, event?: any) => void
  onNodeHover?: (node: NodeData | null) => void
  onNodeRightClick?: (node: NodeData, event?: any) => void
  onLinkClick?: (link: LinkData, event?: any) => void
  onLinkHover?: (link: LinkData | null) => void
  onBackgroundClick?: (event?: any) => void
  onBackgroundRightClick?: (event?: any) => void
  
  // Node rendering
  nodeThreeObject?: (node: NodeData) => any
  nodeThreeObjectExtend?: (obj: any, node: NodeData) => boolean
  nodeVisibility?: (node: NodeData) => boolean
  nodeColor?: (node: NodeData) => string
  nodeOpacity?: number
  nodeRelSize?: number
  nodeVal?: (node: NodeData) => number
  nodeLabel?: (node: NodeData) => string
  nodeDesc?: (node: NodeData) => string
  
  // Link rendering
  linkVisibility?: (link: LinkData) => boolean
  linkColor?: (link: LinkData) => string
  linkWidth?: (link: LinkData) => number
  linkCurvature?: number | ((link: LinkData) => number)
  linkCurveRotation?: number | ((link: LinkData) => number)
  linkMaterial?: any
  linkOpacity?: number
  linkResolution?: number
  
  // Camera
  enableNodeDrag?: boolean
  enableNavigationControls?: boolean
  enablePointerInteraction?: boolean
  
  // Performance
  enableZoomPanInteraction?: boolean
  
  // Freeze crash guard
  disableLinkForce?: boolean
  
  // Lens props for detecting changes
  activeCategories?: Set<string>
  activeTags?: Set<string>
  
  // Engine control
  onEngineStop?: () => void
  
  // Other (pass-through)
  [key: string]: any
}

/**
 * ForceGraphAdapter Ref Interface
 * Methods that must be exposed via React.forwardRef
 */
export interface ForceGraphAdapterRef {
  // Physics engine methods
  d3Force: (forceName: string, force?: any) => any
  d3ReheatSimulation: () => void
  d3AlphaTarget?: (alpha: number) => any
  restart?: () => void
  
  // Data access
  graphData: () => GraphData
  
  // Animation control
  tickFrame: () => void
  refresh?: () => void
  
  // Camera control
  cameraPosition: (
    position?: { x?: number; y?: number; z?: number },
    lookAt?: { x?: number; y?: number; z?: number },
    transitionMs?: number
  ) => void
  zoomToFit: (durationMs?: number, padding?: number, nodeFilter?: (node: NodeData) => boolean) => void
  
  // Scene access
  scene: () => any
  camera: () => any
  renderer: () => any
  controls: () => any
  
  // Node/Link access
  getGraphBbox: (nodeFilter?: (node: NodeData) => boolean) => {
    x: [number, number]
    y: [number, number]
    z: [number, number]
  }
  
  // Visual feedback methods (CRITICAL - custom implementations)
  highlightNode: (nodeId: string | null) => void
  selectNode: (nodeId: string, toggle?: boolean) => void
}

/**
 * Canvas renderer configuration
 */
export interface CanvasConfig {
  // Rendering settings
  antialias?: boolean
  alpha?: boolean
  logarithmicDepthBuffer?: boolean
  
  // Performance settings
  pixelRatio?: number
  maxTextureSize?: number
  
  // Camera settings
  fov?: number
  near?: number
  far?: number
  
  // Background
  backgroundColor?: number | string
  backgroundAlpha?: number
}

/**
 * Lens configuration for different viewing modes
 */
export interface LensConfig {
  // Active lens
  currentLens: Lens
  
  // Transition settings
  transitionDuration?: number
  transitionEasing?: (t: number) => number
  
  // Force simulation settings per lens
  forceSettings?: {
    affinity?: {
      strength?: number
      distance?: number
    }
    causal?: {
      strength?: number
      levelDistance?: number
    }
    temporal?: {
      strength?: number
      timeScale?: number
    }
  }
}

/**
 * Performance monitoring interface
 */
export interface PerformanceMetrics {
  fps: number
  frameTime: number
  nodeCount: number
  linkCount: number
  renderTime: number
  simulationAlpha?: number
}

/**
 * Export type guards
 */
export const isNodeData = (obj: any): obj is NodeData => {
  return obj && typeof obj === 'object' && 'id' in obj
}

export const isLinkData = (obj: any): obj is LinkData => {
  return obj && typeof obj === 'object' && 'source' in obj && 'target' in obj
}

export const isValidLens = (lens: any): lens is Lens => {
  return lens === 'affinity' || lens === 'causal' || lens === 'temporal'
}