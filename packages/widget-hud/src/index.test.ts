import { describe, it, expect } from 'vitest'
import * as exports from './index'

describe('@refinery/widget-hud exports', () => {
  it('should export version', () => {
    expect(exports.version).toBe('0.0.0')
  })
  
  it('should export core HUD components', () => {
    expect(exports.HUDOverlay).toBeDefined()
    expect(exports.HUDPanel).toBeDefined()
    expect(exports.HUDToolbar).toBeDefined()
    expect(exports.HUDStatusBar).toBeDefined()
  })
  
  it('should export control components', () => {
    expect(exports.NodeInspector).toBeDefined()
    expect(exports.GraphNavigator).toBeDefined()
    expect(exports.ZoomControls).toBeDefined()
    expect(exports.VisualizationSettings).toBeDefined()
  })
  
  it('should export hooks', () => {
    expect(exports.useHUDPosition).toBeDefined()
    expect(exports.useHUDVisibility).toBeDefined()
  })
  
  it('should export theme system', () => {
    expect(exports.HUDThemeProvider).toBeDefined()
    expect(exports.useHUDTheme).toBeDefined()
    expect(exports.defaultHUDTheme).toBeDefined()
    expect(exports.darkHUDTheme).toBeDefined()
  })
})