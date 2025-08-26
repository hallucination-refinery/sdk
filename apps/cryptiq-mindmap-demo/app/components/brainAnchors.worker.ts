/*
  Lightweight worker to compute anchorPool indices for concept display mapping.
  Algorithm mirrors the /brain approach:
  1) Compute region boundaries by sorting vertices by y and slicing target quotas
  2) Region-wise farthest-point sampling to pick evenly spaced anchors per region
  3) Top up from full set if we are short, using a deterministic shuffle
*/

export interface Vec3 {
  x: number
  y: number
  z: number
}

type Incoming = { vertices: Vec3[]; count: number }
type Outgoing = { anchors: number[] } | { error: string }

// Deterministic RNG helpers (mulberry32)
function hashSeed(s: string): number {
  let h = 1779033703 ^ s.length
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(h ^ s.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return h >>> 0
}

function mulberry32(aInit: number) {
  let a = aInit >>> 0
  return () => {
    a += 0x6d2b79f5
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleDeterministic<T>(arr: T[], seed: string): T[] {
  const rnd = mulberry32(hashSeed(seed))
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function computeBoundaries(vertices: Vec3[]) {
  const sorted = [...vertices].sort((a, b) => b.y - a.y)
  const N = sorted.length
  const frontalCount = Math.floor(N * 0.3)
  const parietalCount = Math.floor(N * 0.25)
  const temporalCount = Math.floor(N * 0.25)
  const yMax = sorted[0]?.y ?? 0
  const yMin = sorted[N - 1]?.y ?? 0
  const frontalBoundary = sorted[Math.max(0, frontalCount - 1)]?.y ?? yMax
  const parietalBoundary = sorted[Math.max(0, frontalCount + parietalCount - 1)]?.y ?? yMax
  const temporalBoundary =
    sorted[Math.max(0, frontalCount + parietalCount + temporalCount - 1)]?.y ?? yMax
  return {
    frontal: { min: frontalBoundary, max: yMax },
    parietal: { min: parietalBoundary, max: frontalBoundary },
    temporal: { min: temporalBoundary, max: parietalBoundary },
    occipital: { min: yMin, max: temporalBoundary },
  }
}

function getRegionIndices(vertices: Vec3[], regionIndex: number, boundaries: any): number[] {
  const ranges = [
    boundaries.frontal,
    boundaries.parietal,
    boundaries.temporal,
    boundaries.occipital,
  ]
  const range = ranges[regionIndex]
  const out: number[] = []
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i]
    if (regionIndex === 0) {
      if (v.y > range.min && v.y <= range.max) out.push(i)
    } else if (regionIndex === 3) {
      if (v.y >= range.min && v.y < range.max) out.push(i)
    } else {
      if (v.y > range.min && v.y <= range.max) out.push(i)
    }
  }
  return out
}

function dist2(a: Vec3, b: Vec3) {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return dx * dx + dy * dy + dz * dz
}

function farthestSample(vertices: Vec3[], indices: number[], k: number, seed: string): number[] {
  if (indices.length === 0 || k <= 0) return []
  const rnd = mulberry32(hashSeed(seed))
  const picked: number[] = []
  picked.push(indices[Math.floor(rnd() * indices.length)])
  while (picked.length < Math.min(k, indices.length)) {
    let bestIndex = -1
    let bestDist = -1
    for (const idx of indices) {
      let minD = Infinity
      const p = vertices[idx]
      for (const sel of picked) {
        const q = vertices[sel]
        const d = dist2(p, q)
        if (d < minD) minD = d
      }
      if (minD > bestDist) {
        bestDist = minD
        bestIndex = idx
      }
    }
    if (bestIndex === -1) break
    picked.push(bestIndex)
  }
  return picked
}

self.onmessage = (e: MessageEvent<Incoming>) => {
  try {
    const { vertices, count } = e.data
    const boundaries = computeBoundaries(vertices)
    const R0 = getRegionIndices(vertices, 0, boundaries)
    const R1 = getRegionIndices(vertices, 1, boundaries)
    const R2 = getRegionIndices(vertices, 2, boundaries)
    const R3 = getRegionIndices(vertices, 3, boundaries)

    const q0 = Math.max(0, Math.floor(count * 0.3))
    const q1 = Math.max(0, Math.floor(count * 0.25))
    const q2 = Math.max(0, Math.floor(count * 0.25))
    const q3 = Math.max(0, count - (q0 + q1 + q2))

    const a0 = farthestSample(vertices, R0, q0, 'fp-0')
    const a1 = farthestSample(vertices, R1, q1, 'fp-1')
    const a2 = farthestSample(vertices, R2, q2, 'fp-2')
    const a3 = farthestSample(vertices, R3, q3, 'fp-3')
    let pool = [...a0, ...a1, ...a2, ...a3]
    if (pool.length < count) {
      const all = Array.from({ length: vertices.length }, (_, i) => i)
      pool = pool.concat(shuffleDeterministic(all, 'anchors-all').slice(0, count - pool.length))
    }

    const msg: Outgoing = { anchors: pool }
    ;(self as any).postMessage(msg)
  } catch (err: any) {
    const msg: Outgoing = { error: err?.message || String(err) }
    ;(self as any).postMessage(msg)
  }
}
