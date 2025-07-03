import React, { createContext, useContext, useMemo } from 'react'
import type { ApertureTheme, ApertureThemeConfig } from './types'
import { defaultApertureTheme } from './defaultTheme'

interface ApertureThemeContextValue {
  theme: ApertureTheme
}

const ApertureThemeContext = createContext<ApertureThemeContextValue | null>(null)

export interface ApertureThemeProviderProps {
  children: React.ReactNode
  theme?: ApertureThemeConfig
}

export function ApertureThemeProvider({
  children,
  theme: themeConfig,
}: ApertureThemeProviderProps) {
  const theme = useMemo(() => {
    if (!themeConfig) {
      return defaultApertureTheme
    }
    
    // Deep merge theme config with default theme
    return deepMerge(defaultApertureTheme, themeConfig) as ApertureTheme
  }, [themeConfig])
  
  const value = useMemo(() => ({ theme }), [theme])
  
  return (
    <ApertureThemeContext.Provider value={value}>
      {children}
    </ApertureThemeContext.Provider>
  )
}

export function useApertureTheme() {
  const context = useContext(ApertureThemeContext)
  if (!context) {
    throw new Error('useApertureTheme must be used within an ApertureThemeProvider')
  }
  return context.theme
}

// Helper function to deep merge objects
function deepMerge(target: any, source: any): any {
  if (!source) return target
  
  const output = { ...target }
  
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key])
      } else {
        output[key] = source[key]
      }
    } else {
      output[key] = source[key]
    }
  })
  
  return output
}