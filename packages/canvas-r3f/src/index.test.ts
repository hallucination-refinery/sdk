import { describe, it, expect } from 'vitest'
import * as exports from './index'

describe('canvas-r3f Package', () => {
  it('should export version', () => {
    expect(exports.version).toBe('0.0.0')
  })

  it('should export NodeSprite component', () => {
    expect(exports.NodeSprite).toBeDefined()
    expect(typeof exports.NodeSprite).toBe('function')
  })

  it('should export PerfProbe utility', () => {
    expect(exports.PerfProbe).toBeDefined()
    expect(typeof exports.PerfProbe).toBe('function')
  })

  it('should only export low-level adapters and utilities', () => {
    const expectedExports = ['version', 'NodeSprite', 'PerfProbe']
    const actualExports = Object.keys(exports)
    
    expect(actualExports.sort()).toEqual(expectedExports.sort())
  })
})
