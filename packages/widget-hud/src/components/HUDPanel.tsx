import React, { useState, useRef } from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { HUDPanelProps } from '../types'

const positionStyles: Record<string, React.CSSProperties> = {
  'top-left': { top: '1rem', left: '1rem' },
  'top-right': { top: '1rem', right: '1rem' },
  'bottom-left': { bottom: '1rem', left: '1rem' },
  'bottom-right': { bottom: '1rem', right: '1rem' },
  'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
}

export function HUDPanel({
  title,
  children,
  position = 'top-right',
  closable = true,
  draggable = false,
  resizable = false,
  minWidth = 200,
  minHeight = 100,
  maxWidth = 800,
  maxHeight = 600,
  onClose,
  className,
  'aria-label': ariaLabel,
}: HUDPanelProps) {
  const theme = useHUDTheme()
  const panelRef = useRef<HTMLDivElement>(null)
  const [_isDragging, _setIsDragging] = useState(false)
  const [_isResizing, setIsResizing] = useState(false)
  const [panelPosition, _setPanelPosition] = useState({ x: 0, y: 0 })
  const [panelSize, _setPanelSize] = useState({ width: minWidth, height: minHeight })
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && closable) {
      onClose?.()
    }
  }
  
  return (
    <div
      ref={panelRef}
      className={className}
      role="dialog"
      aria-labelledby={`${title}-title`}
      aria-label={ariaLabel || `${title} panel`}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        ...positionStyles[position],
        ...(draggable && panelPosition.x !== 0 ? {
          transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
        } : {}),
        width: resizable ? panelSize.width : 'auto',
        height: resizable ? panelSize.height : 'auto',
        minWidth,
        minHeight,
        maxWidth,
        maxHeight,
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.lg,
        pointerEvents: 'all',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Panel Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.surface,
          cursor: draggable ? 'move' : 'default',
        }}
      >
        <h3
          id={`${title}-title`}
          style={{
            margin: 0,
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text,
          }}
        >
          {title}
        </h3>
        
        {closable && (
          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              background: 'none',
              border: 'none',
              padding: theme.spacing.xs,
              cursor: 'pointer',
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.lg,
              lineHeight: 1,
              borderRadius: theme.borderRadius.sm,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.surfaceHover
              e.currentTarget.style.color = theme.colors.text
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = theme.colors.textSecondary
            }}
          >
            ×
          </button>
        )}
      </div>
      
      {/* Panel Content */}
      <div
        style={{
          flex: 1,
          padding: theme.spacing.md,
          overflow: 'auto',
        }}
      >
        {children}
      </div>
      
      {/* Resize Handle */}
      {resizable && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '10px',
            height: '10px',
            cursor: 'nwse-resize',
            pointerEvents: 'all',
          }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}
    </div>
  )
}