import { describe, it, expect } from 'vitest'
import * as exports from './index'

describe('Package exports', () => {
  it('should export forgeGraph function', () => {
    expect(exports.forgeGraph).toBeDefined()
    expect(typeof exports.forgeGraph).toBe('function')
  })

  it('should export format-specific forge functions', () => {
    expect(exports.forgeFromJSON).toBeDefined()
    expect(exports.forgeFromYAML).toBeDefined()
    expect(exports.forgeFromCSV).toBeDefined()
    expect(exports.forgeFromGraphML).toBeDefined()
  })

  it('should export ForgeError class', () => {
    expect(exports.ForgeError).toBeDefined()
    expect(typeof exports.ForgeError).toBe('function')
  })

  it('should export schemas', () => {
    expect(exports.ForgeConfigSchema).toBeDefined()
    expect(exports.ForgeResultSchema).toBeDefined()
  })

  it('should export all expected exports and nothing more', () => {
    const expectedExports = [
      'forgeGraph',
      'forgeFromJSON',
      'forgeFromYAML',
      'forgeFromCSV',
      'forgeFromGraphML',
      'ForgeError',
      'ForgeConfigSchema',
      'ForgeResultSchema',
    ]
    
    const actualExports = Object.keys(exports)
    expect(actualExports.sort()).toEqual(expectedExports.sort())
  })
})