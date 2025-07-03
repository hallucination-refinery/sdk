import React from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { HUDOverlayProps } from '../types'

export function HUDOverlay({
  children,
  visible = true,
  className,
  'aria-label': ariaLabel = 'HUD overlay',
}: HUDOverlayProps) {
  const theme = useHUDTheme()
  
  if (!visible) return null
  
  return (
    <div
      className={className}
      role="region"
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  )
}