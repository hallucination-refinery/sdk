import React from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { GraphNavigatorProps } from '../types'

export function GraphNavigator({
  graph,
  viewportCenter = { x: 0, y: 0, z: 0 },
  onNavigate,
  miniMapEnabled = true,
  className,
}: GraphNavigatorProps) {
  const theme = useHUDTheme()
  
  // Placeholder implementation
  return (
    <div
      className={className}
      role="navigation"
      aria-label="Graph navigator"
      style={{
        padding: theme.spacing.md,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <h4
        style={{
          margin: 0,
          marginBottom: theme.spacing.sm,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text,
        }}
      >
        Graph Navigator
      </h4>
      <p
        style={{
          margin: 0,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.textSecondary,
        }}
      >
        Nodes: {graph.nodes.length} | Edges: {graph.edges.length}
      </p>
    </div>
  )
}