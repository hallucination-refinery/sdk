// @refinery/widget-hud - Entry point
export const version = '0.0.0'

// Core HUD components
export { HUDOverlay } from './components/HUDOverlay'
export { HUDPanel } from './components/HUDPanel'
export { HUDToolbar } from './components/HUDToolbar'
export { HUDStatusBar } from './components/HUDStatusBar'

// HUD Controls
export { NodeInspector } from './components/NodeInspector'
export { GraphNavigator } from './components/GraphNavigator'
export { ZoomControls } from './components/ZoomControls'
export { VisualizationSettings } from './components/VisualizationSettings'

// Types
export type {
  HUDOverlayProps,
  HUDPanelProps,
  HUDToolbarProps,
  HUDStatusBarProps,
  NodeInspectorProps,
  GraphNavigatorProps,
  ZoomControlsProps,
  VisualizationSettingsProps,
  HUDPosition,
  HUDTheme,
} from './types'

// Hooks
export { useHUDPosition } from './hooks/useHUDPosition'
export { useHUDVisibility } from './hooks/useHUDVisibility'

// Theme
export { HUDThemeProvider, useHUDTheme } from './theme/HUDThemeProvider'
export { defaultHUDTheme, darkHUDTheme } from './theme/defaultTheme'