import type { WebGLRenderer } from 'three'

// Clamp device pixel ratio to reduce GPU load (default max 2)
export function clampDpr(gl: WebGLRenderer, max = 2): void {
  if (typeof window !== 'undefined') {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, max))
  }
}

// Read instance caps from env (falls back to sensible defaults)
function readCap(env: string | undefined, fallback: number): number {
  const cap = parseInt(env ?? '', 10)
  return Number.isNaN(cap) ? fallback : cap
}
const MOBILE_CAP = readCap(process.env.NEXT_PUBLIC_DRAW3D_MOBILE_CAP, 200)
const DESKTOP_CAP = readCap(process.env.NEXT_PUBLIC_DRAW3D_DESKTOP_CAP, 20000)

// Limit instanced rendering counts based on device class.
export function capInstances(
  count: number,
  mobileCap = MOBILE_CAP,
  desktopCap = DESKTOP_CAP
): number {
  const isMobile =
    typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)
  const cap = isMobile ? mobileCap : desktopCap
  return Math.min(count, cap)
}

