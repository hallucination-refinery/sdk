export type BBox = { minX: number; minY: number; maxX: number; maxY: number }

export function fitPositionsToBBox(
  positions: Float32Array,
  bbox: BBox,
): Float32Array {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  const w = maxX - minX
  const h = maxY - minY
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2

  const bw = bbox.maxX - bbox.minX
  const bh = bbox.maxY - bbox.minY
  const bcx = (bbox.minX + bbox.maxX) / 2
  const bcy = (bbox.minY + bbox.maxY) / 2

  const s = Math.max(bw, bh) / (Math.max(w, h) || 1)

  const out = new Float32Array(positions.length)
  for (let i = 0; i < positions.length; i += 3) {
    out[i] = (positions[i] - cx) * s + bcx
    out[i + 1] = (positions[i + 1] - cy) * s + bcy
    out[i + 2] = positions[i + 2] * s
  }
  return out
}
