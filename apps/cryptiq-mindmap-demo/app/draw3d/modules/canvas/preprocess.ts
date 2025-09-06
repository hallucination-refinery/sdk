export function get28x28Gray(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const size = 28;
  const off =
    canvas.ownerDocument?.createElement("canvas") ||
    new (canvas.constructor as any)(size, size);
  off.width = size;
  off.height = size;
  const ctx = off.getContext("2d");
  if (!ctx) return new Uint8ClampedArray(size * size);
  ctx.drawImage(canvas, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const gray = new Uint8ClampedArray(size * size);
  for (let i = 0; i < size * size; i++) {
    const idx = i * 4;
    gray[i] = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
  }
  return gray;
}
