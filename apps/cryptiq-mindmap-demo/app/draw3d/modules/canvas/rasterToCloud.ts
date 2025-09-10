let effectiveConfig = {
  threshold: 180,
  stride: 2,
  minCount: 200,
  jitter: 1 / 256
}

export function getEffectiveRasterConfig() {
  return effectiveConfig
}

export function rasterToCloud(
  src: HTMLCanvasElement,
  opts?: {
    threshold?: number
    stride?: number
    minCount?: number
    jitter?: number
  }
): Float32Array {
  const threshold = opts?.threshold ?? 180
  const stride = opts?.stride ?? 2
  const minCount = Math.max(opts?.minCount ?? 200, 200)
  const jitter = opts?.jitter ?? 1 / 256
  effectiveConfig = { threshold, stride, minCount, jitter }
  const w = src.width
  const h = src.height
  if (!w || !h) return new Float32Array(0)
  const ctx = src.getContext('2d', { willReadFrequently: true })
  if (!ctx) return new Float32Array(0)
  const { data } = ctx.getImageData(0, 0, w, h)
  const half = stride / 2
  const rnd = mulberry32(1)
  const out: number[] = []
  for (let y = half; y < h; y += stride) {
    const yi = Math.floor(y)
    for (let x = half; x < w; x += stride) {
      const xi = Math.floor(x)
      const idx = (yi * w + xi) * 4
      const a = data[idx + 3]
      // Treat any sufficiently opaque pixel as ink; do NOT exclude white
      if (a >= threshold) {
        const nx = (x / w) * 2 - 1
        const ny = (y / h) * 2 - 1
        const jx = (rnd() - 0.5) * jitter
        const jy = (rnd() - 0.5) * jitter
        const jz = (rnd() - 0.5) * jitter
        out.push(
          clamp(nx + jx),
          clamp(ny + jy),
          clamp(jz)
        )
      }
    }
  }
  let pts = new Float32Array(out)
  if (pts.length / 3 < minCount) pts = resampleCloud(pts, minCount)
  return pts
}

export function resampleCloud(pts: Float32Array, count: number): Float32Array {
  const n = pts.length / 3
  if (n === 0) return new Float32Array(0)
  const rnd = mulberry32(2)
  const out = new Float32Array(count * 3)
  if (n >= count) {
    const idx = Array.from({ length: n }, (_, i) => i)
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1))
      const t = idx[i]
      idx[i] = idx[j]
      idx[j] = t
    }
    for (let i = 0; i < count; i++) {
      const k = idx[i] * 3
      out[i * 3] = pts[k]
      out[i * 3 + 1] = pts[k + 1]
      out[i * 3 + 2] = pts[k + 2]
    }
  } else {
    for (let i = 0; i < count; i++) {
      const j = Math.floor(rnd() * n) * 3
      out[i * 3] = pts[j]
      out[i * 3 + 1] = pts[j + 1]
      out[i * 3 + 2] = pts[j + 2]
    }
  }
  return out
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function clamp(v: number) {
  return v < -1 ? -1 : v > 1 ? 1 : v
}

