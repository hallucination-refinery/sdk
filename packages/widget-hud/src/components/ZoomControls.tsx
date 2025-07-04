import React from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { ZoomControlsProps } from '../types'

export function ZoomControls({
  zoom,
  minZoom = 0.1,
  maxZoom = 5,
  zoomStep = 0.1,
  onZoomChange,
  onZoomReset,
  orientation = 'vertical',
  showValue = true,
  className,
}: ZoomControlsProps) {
  const theme = useHUDTheme()
  
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + zoomStep, maxZoom)
    onZoomChange?.(newZoom)
  }
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - zoomStep, minZoom)
    onZoomChange?.(newZoom)
  }
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onZoomChange?.(parseFloat(e.target.value))
  }
  
  const buttonStyle: React.CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    cursor: 'pointer',
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.base,
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    pointerEvents: 'all',
  }
  
  return (
    <div
      className={className}
      role="group"
      aria-label="Zoom controls"
      style={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'column' : 'row',
        gap: theme.spacing.sm,
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.md,
        pointerEvents: 'all',
      }}
    >
      <button
        onClick={handleZoomIn}
        aria-label="Zoom in"
        disabled={zoom >= maxZoom}
        style={{
          ...buttonStyle,
          opacity: zoom >= maxZoom ? theme.opacity.disabled : 1,
          cursor: zoom >= maxZoom ? 'not-allowed' : 'pointer',
        }}
      >
        +
      </button>
      
      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'vertical' ? 'column' : 'row',
          alignItems: 'center',
          gap: theme.spacing.xs,
        }}
      >
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step={zoomStep}
          value={zoom}
          onChange={handleSliderChange}
          aria-label="Zoom level"
          style={{
            width: orientation === 'vertical' ? '40px' : '100px',
            height: orientation === 'vertical' ? '100px' : '40px',
            writingMode: orientation === 'vertical' ? 'vertical-lr' as any : 'initial',
            WebkitAppearance: 'slider-vertical',
          }}
        />
        
        {showValue && (
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
              minWidth: '3em',
              textAlign: 'center',
            }}
          >
            {Math.round(zoom * 100)}%
          </span>
        )}
      </div>
      
      <button
        onClick={handleZoomOut}
        aria-label="Zoom out"
        disabled={zoom <= minZoom}
        style={{
          ...buttonStyle,
          opacity: zoom <= minZoom ? theme.opacity.disabled : 1,
          cursor: zoom <= minZoom ? 'not-allowed' : 'pointer',
        }}
      >
        −
      </button>
      
      {onZoomReset && (
        <button
          onClick={onZoomReset}
          aria-label="Reset zoom"
          style={{
            ...buttonStyle,
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          100%
        </button>
      )}
    </div>
  )
}