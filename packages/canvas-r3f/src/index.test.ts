import { describe, it, expect } from 'vitest'
import { version } from './index'

describe('canvas-r3f Package', () => {
  it('should export version', () => {
    expect(version).toBe('0.0.0')
  })
})
