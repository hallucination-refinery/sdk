const SIZE = 28;

export function make28x28Canvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const off =
    src.ownerDocument?.createElement('canvas') ||
    new (src.constructor as any)(SIZE, SIZE);
  off.width = SIZE;
  off.height = SIZE;
  const ctx = off.getContext('2d');
  ctx?.drawImage(src, 0, 0, SIZE, SIZE);
  return off;
}

export function get28x28Gray(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const off = make28x28Canvas(canvas);
  const ctx = off.getContext('2d');
  if (!ctx) return new Uint8ClampedArray(SIZE * SIZE);
  const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
  const gray = new Uint8ClampedArray(SIZE * SIZE);
  for (let i = 0; i < SIZE * SIZE; i++) {
    const idx = i * 4;
    gray[i] = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
  }
  return gray;
}
