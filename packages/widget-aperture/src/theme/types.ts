export interface ApertureThemeColors {
  primary: string
  primaryHover: string
  primaryActive: string
  secondary: string
  secondaryHover: string
  secondaryActive: string
  
  background: string
  surface: string
  surfaceHover: string
  
  text: string
  textSecondary: string
  textDisabled: string
  
  border: string
  borderFocus: string
  
  success: string
  warning: string
  error: string
  info: string
  
  // Accessibility
  focusRing: string
  highContrast: {
    background: string
    text: string
    border: string
  }
}

export interface ApertureThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
}

export interface ApertureThemeTypography {
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
  }
  fontWeight: {
    normal: number
    medium: number
    semibold: number
    bold: number
  }
  lineHeight: {
    tight: number
    normal: number
    relaxed: number
  }
}

export interface ApertureThemeAnimation {
  duration: {
    fast: string
    normal: string
    slow: string
  }
  easing: {
    linear: string
    easeIn: string
    easeOut: string
    easeInOut: string
    spring: string
  }
}

export interface ApertureThemeShadows {
  sm: string
  md: string
  lg: string
  xl: string
  inner: string
  focus: string
}

export interface ApertureThemeBorderRadius {
  sm: string
  md: string
  lg: string
  full: string
}

export interface ApertureTheme {
  colors: ApertureThemeColors
  spacing: ApertureThemeSpacing
  typography: ApertureThemeTypography
  animation: ApertureThemeAnimation
  shadows: ApertureThemeShadows
  borderRadius: ApertureThemeBorderRadius
}

export type ApertureThemeConfig = DeepPartial<ApertureTheme>

// Utility type for deep partial
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}