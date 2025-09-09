import type { WebGLRenderer } from 'three'

// Clamp device pixel ratio to reduce GPU load (default max 2)
export function clampDpr(gl: WebGLRenderer, max = 2): void {
  if (typeof window !== 'undefined') {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, max))
  }
}

// Read instance caps from env (falls back to sensible defaults)
const MOBILE_CAP =
  parseInt(process.env.NEXT_PUBLIC_DRAW3D_MOBILE_CAP ?? '', 10) || 200
const DESKTOP_CAP =
  parseInt(process.env.NEXT_PUBLIC_DRAW3D_DESKTOP_CAP ?? '', 10) || 20000

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

