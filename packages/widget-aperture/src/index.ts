// @refinery/widget-aperture - Entry point
export const version = '0.0.0'

// Core components
export { IdeaAperture } from './components/IdeaAperture'
export type { IdeaApertureProps } from './components/IdeaAperture'

// Theme system
export { ApertureThemeProvider, useApertureTheme } from './theme/ApertureThemeProvider'
export type { ApertureTheme, ApertureThemeConfig } from './theme/types'

// Hooks
export { useKeyboardNavigation } from './hooks/useKeyboardNavigation'
export { useFocusManagement } from './hooks/useFocusManagement'

// Accessibility utilities
export { announceToScreenReader } from './utils/accessibility'

// Types
export type { ApertureNode, ApertureEdge } from './types'