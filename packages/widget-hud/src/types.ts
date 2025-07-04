import type { IdeaNode, Graph, Vector3 } from '@refinery/schema'

// HUD positioning types
export type HUDPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
export type HUDAlignment = 'start' | 'center' | 'end'

// Core HUD component props
export interface HUDOverlayProps {
  children: React.ReactNode
  visible?: boolean
  className?: string
  'aria-label'?: string
}

export interface HUDPanelProps {
  title: string
  children: React.ReactNode
  position?: HUDPosition
  closable?: boolean
  draggable?: boolean
  resizable?: boolean
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onClose?: () => void
  className?: string
  'aria-label'?: string
}

export interface HUDToolbarProps {
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  alignment?: HUDAlignment
  vertical?: boolean
  className?: string
  'aria-label'?: string
}

export interface HUDStatusBarProps {
  items: StatusBarItem[]
  position?: 'top' | 'bottom'
  className?: string
  'aria-label'?: string
}

export interface StatusBarItem {
  id: string
  label: string
  value?: string | number
  icon?: React.ReactNode
  tooltip?: string
  onClick?: () => void
  'aria-label'?: string
}

// Control component props
export interface NodeInspectorProps {
  node: IdeaNode | null
  onNodeUpdate?: (nodeId: string, updates: Partial<IdeaNode>) => void
  onClose?: () => void
  readonly?: boolean
  className?: string
}

export interface GraphNavigatorProps {
  graph: Graph
  viewportCenter?: Vector3
  onNavigate?: (target: Vector3) => void
  miniMapEnabled?: boolean
  className?: string
}

export interface ZoomControlsProps {
  zoom: number
  minZoom?: number
  maxZoom?: number
  zoomStep?: number
  onZoomChange?: (zoom: number) => void
  onZoomReset?: () => void
  orientation?: 'horizontal' | 'vertical'
  showValue?: boolean
  className?: string
}

export interface VisualizationSettingsProps {
  settings: VisualizationSettings
  onSettingsChange?: (settings: VisualizationSettings) => void
  className?: string
}

export interface VisualizationSettings {
  showLabels: boolean
  showEdges: boolean
  showArrows: boolean
  nodeSize: 'small' | 'medium' | 'large'
  edgeThickness: number
  labelSize: 'small' | 'medium' | 'large'
  colorScheme: 'default' | 'monochrome' | 'high-contrast'
  animationsEnabled: boolean
  performanceMode: boolean
}

// Theme types
export interface HUDTheme {
  colors: {
    background: string
    backgroundHover: string
    surface: string
    surfaceHover: string
    text: string
    textSecondary: string
    textDisabled: string
    border: string
    borderFocus: string
    primary: string
    primaryHover: string
    secondary: string
    secondaryHover: string
    success: string
    warning: string
    error: string
    info: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
    }
    fontWeight: {
      normal: number
      medium: number
      bold: number
    }
  }
  shadows: {
    sm: string
    md: string
    lg: string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
  }
  opacity: {
    disabled: number
    hover: number
    backdrop: number
  }
}