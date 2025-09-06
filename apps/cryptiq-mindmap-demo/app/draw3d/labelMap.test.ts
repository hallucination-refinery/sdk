import { describe, expect, it } from 'vitest'
import { getFormationId } from './labelMap'

describe('labelMap', () => {
  it('maps known label to formation id', () => {
    expect(getFormationId('frontal lobe')).toBeGreaterThan(0)
  })

  it('falls back for unknown labels', () => {
    expect(getFormationId('not-a-label')).toBe(0)
  })
})
