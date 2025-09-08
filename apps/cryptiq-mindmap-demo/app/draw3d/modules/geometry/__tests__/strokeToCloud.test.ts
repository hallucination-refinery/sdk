import { describe, it, expect, afterEach } from 'vitest'
import { strokeToCloud, type Stroke } from '../strokeToCloud'

afterEach(() => {
  delete (globalThis as any).navigator
})

describe('strokeToCloud', () => {
  it('resamples and normalizes stroke points', () => {
    const strokes: Stroke[] = [[{ x: 0, y: 0 }, { x: 2, y: 0 }]]
    const { positions, centroid, radius } = strokeToCloud(strokes, { targetCount: 3 })
    expect(Array.from(positions)).toEqual([-1, 0, 0, 0, 0, 0, 1, 0, 0])
    expect(centroid).toEqual({ x: 1, y: 0 })
    expect(radius).toBe(1)
  })

  it('clamps target count on mobile', () => {
    ;(globalThis as any).navigator = { userAgent: 'Mobi' }
    const strokes: Stroke[] = [[{ x: 0, y: 0 }, { x: 1, y: 0 }]]
    const { positions } = strokeToCloud(strokes, { targetCount: 500 })
    expect(positions.length / 3).toBe(240)
  })
})
