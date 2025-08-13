export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerp3(origin: Vec3, target: Vec3, t: number): Vec3 {
  return {
    x: lerp(origin.x, target.x, t),
    y: lerp(origin.y, target.y, t),
    z: lerp(origin.z, target.z, t)
  };
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}