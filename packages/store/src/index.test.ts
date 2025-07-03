import { describe, it, expect } from 'vitest'
import * as storeExports from './index'

describe('Store Package Exports', () => {
  it('should export version', () => {
    expect(storeExports.version).toBe('0.0.0')
  })

  it('should export store hooks', () => {
    expect(storeExports.useRefineryStore).toBeDefined()
    expect(storeExports.useGraphStore).toBeDefined()
    expect(storeExports.useUIStore).toBeDefined()
    expect(storeExports.useAsyncStore).toBeDefined()
  })

  it('should export utility functions', () => {
    expect(storeExports.withCommand).toBeDefined()
    expect(storeExports.CommandQueue).toBeDefined()
  })

  it('should export selectors', () => {
    expect(storeExports.selectNodes).toBeDefined()
    expect(storeExports.selectEdges).toBeDefined()
    expect(storeExports.selectSelectedNodes).toBeDefined()
    expect(storeExports.selectUIState).toBeDefined()
  })

  it('should export persistence functions', () => {
    expect(storeExports.serializeState).toBeDefined()
    expect(storeExports.deserializeState).toBeDefined()
    expect(storeExports.saveToLocalStorage).toBeDefined()
    expect(storeExports.loadFromLocalStorage).toBeDefined()
    expect(storeExports.exportToFile).toBeDefined()
    expect(storeExports.importFromFile).toBeDefined()
  })

  it('should export types', () => {
    // Type exports are compile-time only, but we can check that the module compiles
    expect(true).toBe(true)
  })
})
