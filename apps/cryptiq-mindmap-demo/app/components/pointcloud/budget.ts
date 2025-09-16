/**
 * UA fragments that hint at a handheld or touch-first device. The list is not exhaustive
 * but prioritises modern iOS and Android browsers plus a few legacy fallbacks.
 */
const MOBILE_USER_AGENT_PATTERN = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

/**
 * Detect whether the provided user-agent string represents a mobile device.
 *
 * The helper defaults to the current runtime's `navigator.userAgent` when no
 * override is given, allowing deterministic tests by passing a string.
 */
export function detectMobile(userAgent?: string | null): boolean {
  const ua =
    typeof userAgent === 'string'
      ? userAgent
      : typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string'
        ? navigator.userAgent
        : ''

  if (!ua) return false
  return MOBILE_USER_AGENT_PATTERN.test(ua)
}

/** Configuration for {@link pointCap}. */
export type PointCapOptions = {
  /** Point count to use for mobile-class hardware. */
  mobile?: number
  /** Point count to use for desktop-class hardware. */
  desktop?: number
  /** Optional user-agent override forwarded to {@link detectMobile}. */
  userAgent?: string | null
}

/**
 * Pick an appropriate point budget for the current device class.
 */
export function pointCap({
  mobile = 60_000,
  desktop = 150_000,
  userAgent,
}: PointCapOptions = {}): number {
  return detectMobile(userAgent) ? mobile : desktop
}

/** Minimal interface for a renderer that can have its pixel ratio clamped. */
export type PixelRatioController = {
  setPixelRatio: (value: number) => unknown
  getPixelRatio?: () => number
}

/**
 * Clamp a renderer's pixel ratio to avoid excessive DPR on high-density screens.
 *
 * The function chooses the tightest bound between the window's `devicePixelRatio`
 * (when available) and the provided `max`. The previous DPR, if exposed, is used as
 * a fallback to keep the renderer consistent in non-browser contexts.
 *
 * @returns The pixel ratio that was applied to the renderer.
 */
export function applyDprClamp<T extends PixelRatioController>(gl: T, max = 2): number {
  const requestedDpr =
    typeof window !== 'undefined' && typeof window.devicePixelRatio === 'number'
      ? window.devicePixelRatio
      : typeof gl.getPixelRatio === 'function'
        ? gl.getPixelRatio()
        : 1

  const safeMax = Number.isFinite(max) && max > 0 ? max : 1
  const nextDpr = Math.min(Math.max(requestedDpr, 1), safeMax)
  gl.setPixelRatio(nextDpr)
  return nextDpr
}
