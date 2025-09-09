import { describe, it, expect } from 'vitest'
import { rasterToCloud, resampleCloud } from '../rasterToCloud'

function makeCanvas(w: number, h: number, rgba: [number, number, number, number]) {
  const data = new Uint8ClampedArray(w * h * 4)
  for (let i = 0; i < w * h; i++) {
    const idx = i * 4
    data[idx] = rgba[0]
    data[idx + 1] = rgba[1]
    data[idx + 2] = rgba[2]
    data[idx + 3] = rgba[3]
  }
  return {
    width: w,
    height: h,
    getContext: () => ({ getImageData: () => ({ data }) })
  } as unknown as HTMLCanvasElement
}

describe('rasterToCloud', () => {
  it('returns no points for empty canvas', () => {
    const c = makeCanvas(16, 16, [0, 0, 0, 0])
    const pts = rasterToCloud(c)
    expect(pts.length).toBe(0)
  })

  it('samples dense stroke with grid stride deterministically', () => {
    const c = makeCanvas(32, 32, [0, 0, 0, 255])
    const pts = rasterToCloud(c, { gridStride: 8, minCount: 0 })
    expect(pts.length % 3).toBe(0)
    const count = pts.length / 3
    expect(count).toBe(16)
    for (const v of pts) {
      expect(v).toBeGreaterThanOrEqual(-1)
      expect(v).toBeLessThanOrEqual(1)
    }
    // determinism
    const pts2 = rasterToCloud(c, { gridStride: 8, minCount: 0 })
    expect(Array.from(pts)).toEqual(Array.from(pts2))
  })

  it('keeps fully saturated colored strokes', () => {
    const c = makeCanvas(16, 16, [255, 0, 0, 255])
    const pts = rasterToCloud(c)
    expect(pts.length).toBeGreaterThan(0)
  })
})

describe('resampleCloud', () => {
  it('reduces point count deterministically', () => {
    const src = Float32Array.from({ length: 30 }, (_, i) => (i % 3) - 1)
    const out = resampleCloud(src, 5)
    expect(out.length).toBe(15)
  })
})

