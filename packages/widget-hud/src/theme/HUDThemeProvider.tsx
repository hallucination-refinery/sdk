import React, { createContext, useContext, useMemo } from 'react'
import type { HUDTheme } from '../types'
import { defaultHUDTheme } from './defaultTheme'

interface HUDThemeContextValue {
  theme: HUDTheme
}

const HUDThemeContext = createContext<HUDThemeContextValue | null>(null)

export interface HUDThemeProviderProps {
  children: React.ReactNode
  theme?: HUDTheme
}

export function HUDThemeProvider({ children, theme = defaultHUDTheme }: HUDThemeProviderProps) {
  const value = useMemo(() => ({ theme }), [theme])
  
  return (
    <HUDThemeContext.Provider value={value}>
      {children}
    </HUDThemeContext.Provider>
  )
}

export function useHUDTheme() {
  const context = useContext(HUDThemeContext)
  if (!context) {
    throw new Error('useHUDTheme must be used within a HUDThemeProvider')
  }
  return context.theme
}