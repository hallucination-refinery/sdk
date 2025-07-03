import React from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { HUDStatusBarProps } from '../types'

export function HUDStatusBar({
  items,
  position = 'bottom',
  className,
  'aria-label': ariaLabel = 'Status bar',
}: HUDStatusBarProps) {
  const theme = useHUDTheme()
  
  return (
    <div
      className={className}
      role="status"
      aria-label={ariaLabel}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        [position]: 0,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.md,
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        backgroundColor: theme.colors.surface,
        borderTop: position === 'bottom' ? `1px solid ${theme.colors.border}` : undefined,
        borderBottom: position === 'top' ? `1px solid ${theme.colors.border}` : undefined,
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        pointerEvents: 'all',
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <span
              style={{
                width: '1px',
                height: '16px',
                backgroundColor: theme.colors.border,
              }}
              aria-hidden="true"
            />
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              cursor: item.onClick ? 'pointer' : 'default',
            }}
            onClick={item.onClick}
            role={item.onClick ? 'button' : undefined}
            tabIndex={item.onClick ? 0 : undefined}
            aria-label={item['aria-label'] || `${item.label}: ${item.value || ''}`}
            title={item.tooltip}
          >
            {item.icon && <span>{item.icon}</span>}
            <span>{item.label}</span>
            {item.value !== undefined && (
              <span style={{ fontWeight: theme.typography.fontWeight.medium }}>
                {item.value}
              </span>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}