export type Stroke = Array<{ x: number; y: number }>

export function strokeToCloud(
  strokes: Stroke[],
  opts?: { targetCount?: number; clampMobile?: number }
): { positions: Float32Array; centroid: { x: number; y: number }; radius: number } {
  const target = opts?.targetCount ?? 320
  const clamp = opts?.clampMobile ?? 240
  const isMobile =
    typeof navigator !== 'undefined' && /Mobi|Android|iP(ad|hone)/i.test(navigator.userAgent)
  const count = isMobile ? Math.min(target, clamp) : target

  const segments: Array<{ p0: { x: number; y: number }; p1: { x: number; y: number }; len: number }> = []
  let totalLength = 0
  for (const stroke of strokes) {
    for (let i = 1; i < stroke.length; i++) {
      const p0 = stroke[i - 1]
      const p1 = stroke[i]
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      const len = Math.hypot(dx, dy)
      if (len > 0) {
        segments.push({ p0, p1, len })
        totalLength += len
      }
    }
  }

  if (totalLength === 0 || segments.length === 0 || count === 0) {
    const zeroPositions = new Float32Array((count || 0) * 3)
    return { positions: zeroPositions, centroid: { x: 0, y: 0 }, radius: 1 }
  }

  const spacing = totalLength / count
  const samples: Array<{ x: number; y: number }> = []
  let distAcc = 0
  let nextDist = spacing
  for (const seg of segments) {
    const { p0, p1, len } = seg
    const dx = p1.x - p0.x
    const dy = p1.y - p0.y
    if (samples.length === 0) samples.push({ x: p0.x, y: p0.y })
    while (distAcc + len >= nextDist && samples.length < count) {
      const t = (nextDist - distAcc) / len
      samples.push({ x: p0.x + dx * t, y: p0.y + dy * t })
      nextDist += spacing
    }
    distAcc += len
  }

  if (samples.length < count) {
    const last = segments[segments.length - 1].p1
    while (samples.length < count) samples.push({ x: last.x, y: last.y })
  }

  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const pt of samples) {
    if (pt.x < minX) minX = pt.x
    if (pt.x > maxX) maxX = pt.x
    if (pt.y < minY) minY = pt.y
    if (pt.y > maxY) maxY = pt.y
  }
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const radius = Math.max((maxX - minX) / 2, (maxY - minY) / 2) || 1

  const positions = new Float32Array(samples.length * 3)
  for (let i = 0; i < samples.length; i++) {
    positions[i * 3] = (samples[i].x - cx) / radius
    positions[i * 3 + 1] = (samples[i].y - cy) / radius
    positions[i * 3 + 2] = 0
  }

  return { positions, centroid: { x: cx, y: cy }, radius }
}
