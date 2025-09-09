export function rasterToCloud(
  src: HTMLCanvasElement,
  opts?: { max?: number; threshold?: number; jitter?: number }
): Float32Array {
  const max = opts?.max ?? 256
  const threshold = opts?.threshold ?? 250
  const jitter = opts?.jitter ?? 1 / 256
  const w = src.width
  const h = src.height
  if (!w || !h) return new Float32Array(0)
  const ctx = src.getContext('2d')
  if (!ctx) return new Float32Array(0)
  const { data } = ctx.getImageData(0, 0, w, h)
  const step = Math.max(1, Math.sqrt((w * h) / max))
  const half = step / 2
  const rnd = mulberry32(1)
  const out: number[] = []
  for (let y = half; y < h; y += step) {
    const yi = Math.floor(y)
    for (let x = half; x < w; x += step) {
      const xi = Math.floor(x)
      const idx = (yi * w + xi) * 4
      const a = data[idx + 3]
      const isWhite =
        data[idx] === 255 && data[idx + 1] === 255 && data[idx + 2] === 255
      if (a >= threshold && !isWhite) {
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
        if (out.length / 3 >= max) return new Float32Array(out)
      }
    }
  }
  return new Float32Array(out)
}

export function resampleCloud(pts: Float32Array, count: number): Float32Array {
  const n = pts.length / 3
  if (n <= count) return pts.slice()
  const rnd = mulberry32(2)
  const idx = Array.from({ length: n }, (_, i) => i)
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    const t = idx[i]
    idx[i] = idx[j]
    idx[j] = t
  }
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const k = idx[i] * 3
    out[i * 3] = pts[k]
    out[i * 3 + 1] = pts[k + 1]
    out[i * 3 + 2] = pts[k + 2]
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

