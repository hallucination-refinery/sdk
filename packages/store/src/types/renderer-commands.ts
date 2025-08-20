/**
 * Renderer commands emitted by store actions for consumption by Canvas/UI layers
 */

import type { IdeaNode, Edge, Node, Vector3 } from '@refinery/schema'

export type RendererCommand =
  | NodeCommand
  | EdgeCommand
  | CameraCommand
  | SelectionCommand
  | LayoutCommand
  | ThemeCommand
  | HighlightCommand
  | MindmapCommand

// Node-related commands
export type NodeCommand =
  | { type: 'ADD_NODE'; payload: { node: IdeaNode } }
  | { type: 'UPDATE_NODE'; payload: { id: string; updates: Partial<IdeaNode> } }
  | { type: 'REMOVE_NODE'; payload: { id: string } }
  | { type: 'BATCH_ADD_NODES'; payload: { nodes: IdeaNode[] } }
  | { type: 'BATCH_UPDATE_NODES'; payload: { updates: Array<{ id: string; updates: Partial<IdeaNode> }> } }
  | { type: 'BATCH_REMOVE_NODES'; payload: { ids: string[] } }

// Edge-related commands
export type EdgeCommand =
  | { type: 'ADD_EDGE'; payload: { edge: Edge } }
  | { type: 'UPDATE_EDGE'; payload: { id: string; updates: Partial<Edge> } }
  | { type: 'REMOVE_EDGE'; payload: { id: string } }
  | { type: 'BATCH_ADD_EDGES'; payload: { edges: Edge[] } }
  | { type: 'BATCH_UPDATE_EDGES'; payload: { updates: Array<{ id: string; updates: Partial<Edge> }> } }
  | { type: 'BATCH_REMOVE_EDGES'; payload: { ids: string[] } }

// Camera/view commands
export type CameraCommand =
  | { type: 'SET_CAMERA_POSITION'; payload: { x: number; y: number; z: number } }
  | { type: 'SET_ZOOM'; payload: { zoom: number } }
  | { type: 'FIT_TO_NODES'; payload: { nodeIds?: string[] } }
  | { type: 'CENTER_ON_NODE'; payload: { nodeId: string } }

// Selection commands
export type SelectionCommand =
  | { type: 'SELECT_NODES'; payload: { nodeIds: string[]; mode: 'replace' | 'add' | 'toggle' } }
  | { type: 'SELECT_EDGES'; payload: { edgeIds: string[]; mode: 'replace' | 'add' | 'toggle' } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_HOVER_NODE'; payload: { nodeId: string | null } }
  | { type: 'SET_HOVER_EDGE'; payload: { edgeId: string | null } }

// Layout commands
export type LayoutCommand =
  | { type: 'SET_LAYOUT'; payload: { layout: 'force' | 'radial' | 'hierarchical' } }
  | { type: 'PAUSE_LAYOUT' }
  | { type: 'RESUME_LAYOUT' }
  | { type: 'RESET_LAYOUT' }

// Theme commands
export type ThemeCommand =
  | { type: 'SET_THEME'; payload: { theme: 'light' | 'dark' | 'custom'; customTheme?: Record<string, unknown> } }
  | { type: 'UPDATE_THEME_PROPERTY'; payload: { property: string; value: unknown } }

// Highlight commands
export type HighlightCommand =
  | { type: 'HIGHLIGHT_NODES'; payload: { nodeIds: string[]; color?: string; intensity?: number } }
  | { type: 'HIGHLIGHT_EDGES'; payload: { edgeIds: string[]; color?: string; intensity?: number } }
  | { type: 'CLEAR_HIGHLIGHTS' }

// Mindmap commands
export type MindmapCommand =
  | { type: 'LOAD_CONCEPTS'; payload: { concepts: Node[] } }
  | { type: 'ADD_CONCEPT'; payload: { concept: Node } }
  | { type: 'REMOVE_CONCEPT'; payload: { conceptId: string } }
  | { type: 'UPDATE_CONCEPT'; payload: { conceptId: string; updates: Partial<Node> } }
  | { type: 'CLEAR_CONCEPTS' }
  | { type: 'SET_BRAIN_VERTICES'; payload: { vertices: Vector3[] } }
  | { type: 'SET_BRAIN_MESH_LOADED'; payload: { loaded: boolean } }
  | { type: 'SELECT_CONCEPTS'; payload: { conceptIds: string[]; mode: 'replace' | 'add' | 'toggle' } }
  | { type: 'CLEAR_CONCEPT_SELECTION' }
  | { type: 'SET_HOVERED_CONCEPT'; payload: { conceptId: string | null } }
  | { type: 'SET_CONCEPT_POSITION'; payload: { conceptId: string; vertexIndex: number; shell?: number } }
  | { type: 'CLEAR_CONCEPT_POSITIONS' }
  | { type: 'UPDATE_CONCEPT_POSITIONS'; payload: { positions: Map<string, { vertexIndex: number; shell: number }> } }
  | { type: 'SET_CONCEPT_VISUAL'; payload: { conceptId: string; visual: { scale?: number; color?: string; visible?: boolean } } }
  | { type: 'RESET_CONCEPT_VISUALS' }
  | { type: 'SET_VISIBLE_CATEGORIES'; payload: { categories: string[] } }
  | { type: 'TOGGLE_CATEGORY'; payload: { category: string } }
  | { type: 'SHOW_ALL_CATEGORIES' }
  | { type: 'UPDATE_RENDER_METRICS'; payload: { metrics: { renderTime: number; frameRate: number } } }