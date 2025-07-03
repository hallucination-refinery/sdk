import type { ApertureTheme } from './types'

export const defaultApertureTheme: ApertureTheme = {
  colors: {
    primary: '#3b82f6',
    primaryHover: '#2563eb',
    primaryActive: '#1d4ed8',
    secondary: '#8b5cf6',
    secondaryHover: '#7c3aed',
    secondaryActive: '#6d28d9',
    
    background: '#ffffff',
    surface: '#f9fafb',
    surfaceHover: '#f3f4f6',
    
    text: '#111827',
    textSecondary: '#6b7280',
    textDisabled: '#9ca3af',
    
    border: '#e5e7eb',
    borderFocus: '#3b82f6',
    
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    focusRing: 'rgba(59, 130, 246, 0.5)',
    highContrast: {
      background: '#000000',
      text: '#ffffff',
      border: '#ffffff',
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    focus: '0 0 0 3px rgba(59, 130, 246, 0.5)',
  },
  
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
}

// Dark theme variant
export const darkApertureTheme: ApertureTheme = {
  ...defaultApertureTheme,
  colors: {
    ...defaultApertureTheme.colors,
    primary: '#60a5fa',
    primaryHover: '#93bbfc',
    primaryActive: '#3b82f6',
    secondary: '#a78bfa',
    secondaryHover: '#c4b5fd',
    secondaryActive: '#8b5cf6',
    
    background: '#0f172a',
    surface: '#1e293b',
    surfaceHover: '#334155',
    
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    textDisabled: '#64748b',
    
    border: '#334155',
    borderFocus: '#60a5fa',
    
    focusRing: 'rgba(96, 165, 250, 0.5)',
  },
}