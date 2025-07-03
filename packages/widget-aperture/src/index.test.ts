import { describe, it, expect } from 'vitest'
import * as exports from './index'

describe('@refinery/widget-aperture exports', () => {
  it('should export version', () => {
    expect(exports.version).toBe('0.0.0')
  })
  
  it('should export IdeaAperture component', () => {
    expect(exports.IdeaAperture).toBeDefined()
  })
  
  it('should export theme providers', () => {
    expect(exports.ApertureThemeProvider).toBeDefined()
    expect(exports.useApertureTheme).toBeDefined()
  })
  
  it('should export hooks', () => {
    expect(exports.useKeyboardNavigation).toBeDefined()
    expect(exports.useFocusManagement).toBeDefined()
  })
  
  it('should export accessibility utilities', () => {
    expect(exports.announceToScreenReader).toBeDefined()
  })
})