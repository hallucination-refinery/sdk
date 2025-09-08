export function get28x28Gray(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const size = 28
  const off =
    canvas.ownerDocument?.createElement('canvas') || new (canvas.constructor as any)(size, size)
  off.width = size
  off.height = size
  const ctx = off.getContext('2d')
  if (!ctx) return new Uint8ClampedArray(size * size)
  ctx.drawImage(canvas, 0, 0, size, size)
  const { data } = ctx.getImageData(0, 0, size, size)
  const gray = new Uint8ClampedArray(size * size)
  for (let i = 0; i < size * size; i++) {
    const idx = i * 4
    gray[i] = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
  }
  return gray
}

export function make28x28Canvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const size = 28
  const off = src.ownerDocument?.createElement('canvas') || new (src.constructor as any)(size, size)
  off.width = size
  off.height = size
  const ctx = off.getContext('2d')
  if (!ctx) return off

  // Compute tight bounding box of non-white pixels, with padding
  const sctx = src.getContext('2d')!
  const sData = sctx.getImageData(0, 0, src.width, src.height)
  let minX = src.width,
    minY = src.height,
    maxX = 0,
    maxY = 0
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const i = (y * src.width + x) * 4
      const r = sData.data[i]
      const g = sData.data[i + 1]
      const b = sData.data[i + 2]
      const v = r | g | b
      if (v !== 255) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)

  if (minX <= maxX && minY <= maxY) {
    const bw = maxX - minX + 1
    const bh = maxY - minY + 1
    const side = Math.max(bw, bh)
    const pad = Math.round(side * 0.15)
    const sx = Math.max(0, minX - pad)
    const sy = Math.max(0, minY - pad)
    const sw = Math.min(src.width - sx, side + pad * 2)
    const sh = Math.min(src.height - sy, side + pad * 2)

    ctx.drawImage(src, sx, sy, sw, sh, 0, 0, size, size)
  }

  const img = ctx.getImageData(0, 0, size, size)
  const data = img.data
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
    data[i] = data[i + 1] = data[i + 2] = avg
    data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return off
}
