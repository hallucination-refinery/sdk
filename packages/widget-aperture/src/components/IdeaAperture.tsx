import React, { useCallback, useState, useRef, useEffect } from 'react'
import type { Graph, IdeaNode, Edge } from '@refinery/schema'
import { useApertureTheme } from '../theme/ApertureThemeProvider'
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation'
import { useFocusManagement } from '../hooks/useFocusManagement'
import { announceToScreenReader, formatNodeLabel, getKeyboardInstructions } from '../utils/accessibility'
import type { ApertureNode, ApertureEdge, ApertureViewport, ApertureInteractionState } from '../types'

export interface IdeaApertureProps {
  /** The graph data to visualize */
  graph: Graph
  /** Currently selected node IDs */
  selectedNodeIds?: string[]
  /** Callback when node selection changes */
  onSelectionChange?: (nodeIds: string[]) => void
  /** Callback when a node is activated (double-click/Enter) */
  onNodeActivate?: (nodeId: string) => void
  /** Enable keyboard navigation */
  enableKeyboardNavigation?: boolean
  /** Custom class name */
  className?: string
  /** Accessibility label for the aperture */
  ariaLabel?: string
  /** Show help instructions */
  showHelp?: boolean
}

export function IdeaAperture({
  graph,
  selectedNodeIds = [],
  onSelectionChange,
  onNodeActivate,
  enableKeyboardNavigation = true,
  className,
  ariaLabel = 'Idea aperture visualization',
  showHelp = false,
}: IdeaApertureProps) {
  const theme = useApertureTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showHelpDialog, setShowHelpDialog] = useState(showHelp)
  
  // Interaction state
  const [interactionState, setInteractionState] = useState<ApertureInteractionState>({
    selectedNodes: new Set(selectedNodeIds),
    hoveredNode: null,
    focusedNode: null,
    isDragging: false,
    isPanning: false,
  })
  
  // Viewport state
  const [viewport, setViewport] = useState<ApertureViewport>({
    center: { x: 0, y: 0 },
    zoom: 1,
    rotation: 0,
  })
  
  // Convert graph nodes to aperture nodes with UI state
  const apertureNodes: ApertureNode[] = graph.nodes.map(node => ({
    ...node,
    isHighlighted: interactionState.selectedNodes.has(node.id) || interactionState.hoveredNode === node.id,
    isFocused: interactionState.focusedNode === node.id,
    animationState: 'idle' as const,
  }))
  
  // Focus management
  const { focusedId, focusById, moveFocus } = useFocusManagement({
    initialFocusId: interactionState.focusedNode,
    onFocusChange: (id) => {
      setInteractionState(prev => ({ ...prev, focusedNode: id }))
      if (id) {
        const node = graph.nodes.find(n => n.id === id)
        if (node) {
          announceToScreenReader(formatNodeLabel(node.label, undefined, getNodeConnectionCount(node.id)))
        }
      }
    },
  })
  
  // Keyboard navigation
  useKeyboardNavigation({
    enabled: enableKeyboardNavigation,
    onNavigate: (direction) => {
      // Navigate between nodes based on spatial position
      const currentNode = graph.nodes.find(n => n.id === interactionState.focusedNode)
      if (!currentNode || !currentNode.position) return
      
      const candidates = graph.nodes.filter(n => n.id !== currentNode.id && n.position)
      let nextNode: IdeaNode | undefined
      
      switch (direction) {
        case 'up':
          nextNode = candidates
            .filter(n => n.position!.y < currentNode.position!.y)
            .sort((a, b) => b.position!.y - a.position!.y)[0]
          break
        case 'down':
          nextNode = candidates
            .filter(n => n.position!.y > currentNode.position!.y)
            .sort((a, b) => a.position!.y - b.position!.y)[0]
          break
        case 'left':
          nextNode = candidates
            .filter(n => n.position!.x < currentNode.position!.x)
            .sort((a, b) => b.position!.x - a.position!.x)[0]
          break
        case 'right':
          nextNode = candidates
            .filter(n => n.position!.x > currentNode.position!.x)
            .sort((a, b) => a.position!.x - b.position!.x)[0]
          break
      }
      
      if (nextNode) {
        focusById(nextNode.id)
      }
    },
    onSelect: () => {
      if (interactionState.focusedNode) {
        toggleNodeSelection(interactionState.focusedNode)
      }
    },
    onCancel: () => {
      clearSelection()
    },
    onHelp: () => {
      setShowHelpDialog(true)
      announceToScreenReader(getKeyboardInstructions())
    },
  })
  
  // Helper functions
  function getNodeConnectionCount(nodeId: string): number {
    return graph.edges.filter(e => e.source === nodeId || e.target === nodeId).length
  }
  
  function toggleNodeSelection(nodeId: string) {
    setInteractionState(prev => {
      const newSelectedNodes = new Set(prev.selectedNodes)
      if (newSelectedNodes.has(nodeId)) {
        newSelectedNodes.delete(nodeId)
        announceToScreenReader('Node deselected')
      } else {
        newSelectedNodes.add(nodeId)
        announceToScreenReader('Node selected')
      }
      return { ...prev, selectedNodes: newSelectedNodes }
    })
    
    const newSelection = Array.from(interactionState.selectedNodes)
    onSelectionChange?.(newSelection)
  }
  
  function clearSelection() {
    setInteractionState(prev => ({
      ...prev,
      selectedNodes: new Set(),
      focusedNode: null,
    }))
    onSelectionChange?.([])
  }
  
  // Render the aperture (simplified for this example)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Apply viewport transformation
    ctx.save()
    ctx.translate(canvas.width / 2 + viewport.center.x, canvas.height / 2 + viewport.center.y)
    ctx.scale(viewport.zoom, viewport.zoom)
    ctx.rotate(viewport.rotation)
    
    // Draw edges
    graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.find(n => n.id === edge.source)
      const targetNode = graph.nodes.find(n => n.id === edge.target)
      if (!sourceNode?.position || !targetNode?.position) return
      
      ctx.beginPath()
      ctx.moveTo(sourceNode.position.x, sourceNode.position.y)
      ctx.lineTo(targetNode.position.x, targetNode.position.y)
      ctx.strokeStyle = theme.colors.border
      ctx.lineWidth = 1
      ctx.stroke()
    })
    
    // Draw nodes
    apertureNodes.forEach(node => {
      if (!node.position) return
      
      ctx.beginPath()
      ctx.arc(node.position.x, node.position.y, 20, 0, Math.PI * 2)
      
      if (node.isHighlighted) {
        ctx.fillStyle = theme.colors.primary
      } else {
        ctx.fillStyle = theme.colors.surface
      }
      ctx.fill()
      
      if (node.isFocused) {
        ctx.strokeStyle = theme.colors.borderFocus
        ctx.lineWidth = 3
        ctx.stroke()
      } else {
        ctx.strokeStyle = theme.colors.border
        ctx.lineWidth = 1
        ctx.stroke()
      }
      
      // Draw label
      ctx.fillStyle = node.isHighlighted ? theme.colors.background : theme.colors.text
      ctx.font = `${theme.typography.fontWeight.medium} ${theme.typography.fontSize.sm} ${theme.typography.fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.position.x, node.position.y)
    })
    
    ctx.restore()
  }, [graph, apertureNodes, viewport, theme])
  
  return (
    <div
      ref={containerRef}
      className={className}
      role="application"
      aria-label={ariaLabel}
      tabIndex={0}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          width: '100%',
          height: '100%',
        }}
        aria-hidden="true"
      />
      
      {/* Screen reader description */}
      <div className="sr-only" role="status" aria-live="polite">
        {`Graph with ${graph.nodes.length} nodes and ${graph.edges.length} connections. ${
          interactionState.selectedNodes.size
        } nodes selected.`}
      </div>
      
      {/* Help dialog */}
      {showHelpDialog && (
        <div
          role="dialog"
          aria-labelledby="aperture-help-title"
          style={{
            position: 'absolute',
            top: theme.spacing.md,
            right: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            boxShadow: theme.shadows.lg,
            maxWidth: '300px',
          }}
        >
          <h3
            id="aperture-help-title"
            style={{
              margin: 0,
              marginBottom: theme.spacing.sm,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
            }}
          >
            Keyboard Navigation
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: theme.typography.fontSize.sm,
              lineHeight: theme.typography.lineHeight.relaxed,
              whiteSpace: 'pre-line',
            }}
          >
            {getKeyboardInstructions()}
          </p>
          <button
            onClick={() => setShowHelpDialog(false)}
            style={{
              marginTop: theme.spacing.sm,
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              backgroundColor: theme.colors.primary,
              color: theme.colors.background,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}