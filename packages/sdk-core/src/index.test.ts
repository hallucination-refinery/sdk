import { describe, it, expect } from 'vitest'
import * as exports from './index'

describe('sdk-core exports', () => {
  it('should export Animus component', () => {
    expect(exports.Animus).toBeDefined()
    expect(typeof exports.Animus).toBe('function')
  })

  it('should export CanvasProvider', () => {
    expect(exports.CanvasProvider).toBeDefined()
    expect(typeof exports.CanvasProvider).toBe('function')
  })

  it('should export useCanvas hook', () => {
    expect(exports.useCanvas).toBeDefined()
    expect(typeof exports.useCanvas).toBe('function')
  })

  it('should export intent bus functions', () => {
    expect(exports.createInitialCanvasState).toBeDefined()
    expect(exports.processCanvasCommand).toBeDefined()
    expect(typeof exports.createInitialCanvasState).toBe('function')
    expect(typeof exports.processCanvasCommand).toBe('function')
  })

  it('should re-export types', () => {
    // Type exports are compile-time only, but we can check they don't break the module
    expect(Object.keys(exports)).toContain('Animus')
    expect(Object.keys(exports)).toContain('CanvasProvider')
    expect(Object.keys(exports)).toContain('useCanvas')
  })
})