import type { WebGLRenderer } from 'three';

// Clamp device pixel ratio to reduce GPU load (default max 2)
export function clampDpr(gl: WebGLRenderer, max = 2): void {
  if (typeof window !== 'undefined') {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, max));
  }
}

// Limit instanced rendering counts based on device class.
// Mobile devices are capped at 200 instances to maintain ~30fps.
export function capInstances(count: number, mobileCap = 200, desktopCap = 20000): number {
  const isMobile =
    typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
  const cap = isMobile ? mobileCap : desktopCap;
  return Math.min(count, cap);
}

