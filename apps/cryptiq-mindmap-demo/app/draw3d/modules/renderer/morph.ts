export function pairAndMorph(
  source: Float32Array,
  target: Float32Array,
  count: number
): { source: Float32Array; target: Float32Array; indexMap: Uint32Array } {
  const resample = (input: Float32Array, inCount: number, outCount: number, map?: Uint32Array) => {
    const out = new Float32Array(outCount * 3)
    if (inCount === outCount) {
      out.set(input.subarray(0, outCount * 3))
      if (map) {
        for (let i = 0; i < outCount; i++) map[i] = i
      }
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
        if (map) map[i] = i0
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
      if (map) map[i] = idx
    }
    return out
  }

  const srcCount = Math.floor(source.length / 3)
  const tgtCount = Math.floor(target.length / 3)
  const indexMap = new Uint32Array(count)
  const src = resample(source, srcCount, count, indexMap)
  const tgt = resample(target, tgtCount, count)

  const sortAndNormalize = (arr: Float32Array, map?: Uint32Array) => {
    const centroid = [0, 0, 0]
    for (let i = 0; i < count; i++) {
      centroid[0] += arr[i * 3]
      centroid[1] += arr[i * 3 + 1]
      centroid[2] += arr[i * 3 + 2]
    }
    centroid[0] /= count
    centroid[1] /= count
    centroid[2] /= count

    const indices = Array.from({ length: count }, (_, i) => i)
    indices.sort((a, b) => {
      const ax = arr[a * 3] - centroid[0]
      const ay = arr[a * 3 + 1] - centroid[1]
      const bx = arr[b * 3] - centroid[0]
      const by = arr[b * 3 + 1] - centroid[1]
      return Math.atan2(ay, ax) - Math.atan2(by, bx)
    })

    const copy = arr.slice()
    for (let i = 0; i < count; i++) {
      const idx = indices[i]
      arr[i * 3] = copy[idx * 3]
      arr[i * 3 + 1] = copy[idx * 3 + 1]
      arr[i * 3 + 2] = copy[idx * 3 + 2]
      if (map) map[i] = map[idx]
    }

    let maxR = 0
    for (let i = 0; i < count; i++) {
      const x = arr[i * 3] - centroid[0]
      const y = arr[i * 3 + 1] - centroid[1]
      const z = arr[i * 3 + 2] - centroid[2]
      const r = Math.sqrt(x * x + y * y + z * z)
      if (r > maxR) maxR = r
    }
    const scale = maxR > 0 ? 1 / maxR : 1
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (arr[i * 3] - centroid[0]) * scale
      arr[i * 3 + 1] = (arr[i * 3 + 1] - centroid[1]) * scale
      arr[i * 3 + 2] = (arr[i * 3 + 2] - centroid[2]) * scale
    }
  }

  sortAndNormalize(src, indexMap)
  sortAndNormalize(tgt)

  return { source: src, target: tgt, indexMap }
}

export default pairAndMorph
