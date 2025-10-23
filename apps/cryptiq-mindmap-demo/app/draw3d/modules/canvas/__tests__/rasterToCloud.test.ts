import { describe, it, expect } from 'vitest'
import {
  rasterToCloud,
  resampleCloud,
  getEffectiveRasterConfig
} from '../rasterToCloud'

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

  it('enforces minCount and remains deterministic', () => {
    const c = makeCanvas(32, 32, [0, 0, 0, 255])
    const pts = rasterToCloud(c, { stride: 8, minCount: 0 })
    expect(pts.length % 3).toBe(0)
    const count = pts.length / 3
    expect(count).toBeGreaterThanOrEqual(200)
    for (const v of pts) {
      expect(v).toBeGreaterThanOrEqual(-1)
      expect(v).toBeLessThanOrEqual(1)
    }
    const cfg = getEffectiveRasterConfig()
    expect(cfg.stride).toBe(8)
    expect(cfg.minCount).toBeGreaterThanOrEqual(200)
    // determinism
    const pts2 = rasterToCloud(c, { stride: 8, minCount: 0 })
    expect(Array.from(pts)).toEqual(Array.from(pts2))
  })

  it('keeps fully saturated colored strokes', () => {
    const c = makeCanvas(16, 16, [255, 0, 0, 255])
    const pts = rasterToCloud(c)
    expect(pts.length / 3).toBeGreaterThanOrEqual(200)
  })
})

describe('resampleCloud', () => {
  it('reduces point count deterministically', () => {
    const src = Float32Array.from({ length: 30 }, (_, i) => (i % 3) - 1)
    const out = resampleCloud(src, 5)
    expect(out.length).toBe(15)
  })
})

