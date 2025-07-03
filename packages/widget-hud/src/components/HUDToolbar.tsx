import React from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { HUDToolbarProps } from '../types'

const positionStyles: Record<string, React.CSSProperties> = {
  top: { top: 0, left: 0, right: 0 },
  bottom: { bottom: 0, left: 0, right: 0 },
  left: { top: 0, bottom: 0, left: 0 },
  right: { top: 0, bottom: 0, right: 0 },
}

export function HUDToolbar({
  children,
  position = 'top',
  alignment = 'center',
  vertical = false,
  className,
  'aria-label': ariaLabel = 'Toolbar',
}: HUDToolbarProps) {
  const theme = useHUDTheme()
  const isHorizontal = position === 'top' || position === 'bottom'
  
  const alignmentValue = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  }[alignment]
  
  return (
    <div
      className={className}
      role="toolbar"
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        display: 'flex',
        flexDirection: (isHorizontal && !vertical) || (!isHorizontal && vertical) ? 'row' : 'column',
        justifyContent: alignmentValue,
        alignItems: 'center',
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        borderBottom: position === 'top' ? `1px solid ${theme.colors.border}` : undefined,
        borderTop: position === 'bottom' ? `1px solid ${theme.colors.border}` : undefined,
        borderRight: position === 'left' ? `1px solid ${theme.colors.border}` : undefined,
        borderLeft: position === 'right' ? `1px solid ${theme.colors.border}` : undefined,
        boxShadow: theme.shadows.sm,
        pointerEvents: 'all',
      }}
    >
      {children}
    </div>
  )
}