import React from 'react'
import { useHUDTheme } from '../theme/HUDThemeProvider'
import type { VisualizationSettingsProps, VisualizationSettings } from '../types'

export function VisualizationSettings({
  settings,
  onSettingsChange,
  className,
}: VisualizationSettingsProps) {
  const theme = useHUDTheme()
  
  const handleChange = (key: keyof VisualizationSettings, value: any) => {
    onSettingsChange?.({
      ...settings,
      [key]: value,
    })
  }
  
  const sectionStyle: React.CSSProperties = {
    marginBottom: theme.spacing.lg,
  }
  
  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text,
    cursor: 'pointer',
  }
  
  const checkboxStyle: React.CSSProperties = {
    marginLeft: theme.spacing.sm,
  }
  
  return (
    <div className={className}>
      <div style={sectionStyle}>
        <h4
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text,
          }}
        >
          Display Options
        </h4>
        
        <label style={labelStyle}>
          Show Labels
          <input
            type="checkbox"
            checked={settings.showLabels}
            onChange={(e) => handleChange('showLabels', e.target.checked)}
            style={checkboxStyle}
          />
        </label>
        
        <label style={labelStyle}>
          Show Edges
          <input
            type="checkbox"
            checked={settings.showEdges}
            onChange={(e) => handleChange('showEdges', e.target.checked)}
            style={checkboxStyle}
          />
        </label>
        
        <label style={labelStyle}>
          Show Arrows
          <input
            type="checkbox"
            checked={settings.showArrows}
            onChange={(e) => handleChange('showArrows', e.target.checked)}
            style={checkboxStyle}
          />
        </label>
        
        <label style={labelStyle}>
          Enable Animations
          <input
            type="checkbox"
            checked={settings.animationsEnabled}
            onChange={(e) => handleChange('animationsEnabled', e.target.checked)}
            style={checkboxStyle}
          />
        </label>
        
        <label style={labelStyle}>
          Performance Mode
          <input
            type="checkbox"
            checked={settings.performanceMode}
            onChange={(e) => handleChange('performanceMode', e.target.checked)}
            style={checkboxStyle}
          />
        </label>
      </div>
      
      <div style={sectionStyle}>
        <h4
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text,
          }}
        >
          Appearance
        </h4>
        
        <div style={{ marginBottom: theme.spacing.md }}>
          <label
            style={{
              display: 'block',
              marginBottom: theme.spacing.xs,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Node Size
          </label>
          <select
            value={settings.nodeSize}
            onChange={(e) => handleChange('nodeSize', e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        <div style={{ marginBottom: theme.spacing.md }}>
          <label
            style={{
              display: 'block',
              marginBottom: theme.spacing.xs,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.textSecondary,
            }}
          >
            Color Scheme
          </label>
          <select
            value={settings.colorScheme}
            onChange={(e) => handleChange('colorScheme', e.target.value)}
            style={{
              width: '100%',
              padding: theme.spacing.sm,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.background,
              color: theme.colors.text,
              fontSize: theme.typography.fontSize.sm,
            }}
          >
            <option value="default">Default</option>
            <option value="monochrome">Monochrome</option>
            <option value="high-contrast">High Contrast</option>
          </select>
        </div>
      </div>
    </div>
  )
}