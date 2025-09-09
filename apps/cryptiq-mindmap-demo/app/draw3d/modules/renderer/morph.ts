// Utility functions for point-cloud morphing and easing

// Resample a point cloud to a specific number of points.
// Points are interleaved as [x, y, z]. When upsampling, points are
// linearly interpolated; when downsampling, points are evenly picked.
export function resampleCloud(input: Float32Array, outCount: number): Float32Array {
  const inCount = Math.floor(input.length / 3)
  const out = new Float32Array(outCount * 3)

  if (inCount === 0 || outCount === 0) return out

  if (inCount === outCount) {
    out.set(input.subarray(0, outCount * 3))
    return out
  }

  if (inCount < outCount) {
    for (let i = 0; i < outCount; i++) {
      const t = (i * (inCount - 1)) / (outCount - 1)
      const i0 = Math.floor(t)
      const i1 = Math.min(i0 + 1, inCount - 1)
      const f = t - i0
      const b0 = i0 * 3
      const b1 = i1 * 3
      out[i * 3] = input[b0] * (1 - f) + input[b1] * f
      out[i * 3 + 1] = input[b0 + 1] * (1 - f) + input[b1 + 1] * f
      out[i * 3 + 2] = input[b0 + 2] * (1 - f) + input[b1 + 2] * f
    }
    return out
  }

  const stride = inCount / outCount
  for (let i = 0; i < outCount; i++) {
    const idx = Math.floor(i * stride)
    const b = idx * 3
    out[i * 3] = input[b]
    out[i * 3 + 1] = input[b + 1]
    out[i * 3 + 2] = input[b + 2]
  }
  return out
}

// Sort point indices by increasing radius (distance from origin),
// then by polar angle in the XY plane. Returns a mapping of sorted indices.
export function orderRadial(points: Float32Array): Uint32Array {
  const count = Math.floor(points.length / 3)
  const indices = Array.from({ length: count }, (_, i) => i)
  indices.sort((a, b) => {
    const ax = points[a * 3]
    const ay = points[a * 3 + 1]
    const az = points[a * 3 + 2]
    const bx = points[b * 3]
    const by = points[b * 3 + 1]
    const bz = points[b * 3 + 2]

    const ra = ax * ax + ay * ay + az * az
    const rb = bx * bx + by * by + bz * bz
    if (ra !== rb) return ra - rb

    const aa = Math.atan2(ay, ax)
    const ab = Math.atan2(by, bx)
    return aa - ab
  })
  return Uint32Array.from(indices)
}

// Compute a mapping from target indices to source indices. The source and
// destination clouds are first resampled to the same size, then each is
// sorted radially. Points with the same sort rank are paired together.
export function computeMorphMap(
  src: Float32Array,
  dst: Float32Array
): Uint32Array {
  const count = Math.max(src.length, dst.length) / 3
  const resSrc = resampleCloud(src, count)
  const resDst = resampleCloud(dst, count)
  const srcOrder = orderRadial(resSrc)
  const dstOrder = orderRadial(resDst)
  const map = new Uint32Array(count)
  for (let i = 0; i < count; i++) {
    map[dstOrder[i]] = srcOrder[i]
  }
  return map
}

// Easing functions used for animation timing
export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

export function easeOutBack(t: number): number {
  const c1 = 1.70158
  const c3 = c1 + 1
  const p = t - 1
  return 1 + c3 * p * p * p + c1 * p * p
}

export default computeMorphMap

