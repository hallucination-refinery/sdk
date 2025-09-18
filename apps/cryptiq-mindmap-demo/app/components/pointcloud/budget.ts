/**
 * UA fragments that hint at a handheld or touch-first device. The list is not exhaustive
 * but prioritises modern iOS and Android browsers plus a few legacy fallbacks.
 */
const MOBILE_USER_AGENT_PATTERN = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i

function parseBudgetOverride(value: string | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

function parsePositiveNumber(value: string | undefined): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
}

const ENV_MOBILE_POINT_CAP = parseBudgetOverride(process.env.NEXT_PUBLIC_POINTCLOUD_BUDGET_MOBILE)
const ENV_DESKTOP_POINT_CAP = parseBudgetOverride(process.env.NEXT_PUBLIC_POINTCLOUD_BUDGET_DESKTOP)
const ENV_MAX_DPR = parsePositiveNumber(process.env.NEXT_PUBLIC_POINTCLOUD_MAX_DPR)

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
 *
 * Defaults can be overridden via `NEXT_PUBLIC_POINTCLOUD_BUDGET_MOBILE` and
 * `NEXT_PUBLIC_POINTCLOUD_BUDGET_DESKTOP` environment variables.
 */
export function pointCap({
  mobile = ENV_MOBILE_POINT_CAP ?? 60_000,
  desktop = ENV_DESKTOP_POINT_CAP ?? 150_000,
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
 * Defaults can be overridden via the `NEXT_PUBLIC_POINTCLOUD_MAX_DPR`
 * environment variable.
 *
 * @returns The pixel ratio that was applied to the renderer.
 */
export function clampDPR<T extends PixelRatioController>(gl: T, max = ENV_MAX_DPR ?? 2): number {
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

export type CapInstancesOptions = {
  count: number
  budget: number
  keep?: number
}

export type CapInstancesResult = {
  keep: number
  step: number
  count: number
  capped: boolean
}

export function capInstances({ count, budget, keep = 1 }: CapInstancesOptions): CapInstancesResult {
  const total = Math.max(0, Math.floor(count))
  if (total <= 0) {
    return { keep: 0, step: 1, count: 0, capped: false }
  }

  const cap = Math.max(1, Math.floor(budget))
  const desiredKeep = Math.min(1, Math.max(0, keep))
  const budgetKeep = Math.min(1, cap / total)
  const effectiveKeep = Math.min(desiredKeep, budgetKeep)

  if (effectiveKeep >= 0.999) {
    return { keep: 1, step: 1, count: total, capped: false }
  }

  const step = Math.max(1, Math.ceil(1 / Math.max(effectiveKeep, 1e-6)))
  const cappedCount = Math.max(1, Math.floor(total / step))

  return {
    keep: effectiveKeep,
    step,
    count: Math.min(total, cappedCount),
    capped: cappedCount < total,
  }
}

type InterleavedArray = Float32Array | Uint8Array | Uint16Array

export function decimateInterleaved<T extends InterleavedArray>(
  source: T,
  components: number,
  step: number,
  targetCount?: number,
): T {
  const elems = Math.max(1, Math.floor(components))
  const total = Math.floor(source.length / elems)
  if (total <= 0 || step <= 1) return source

  const maxCount = Math.max(1, Math.floor(total / Math.max(1, step)))
  const nextCount = Math.min(total, Math.max(1, targetCount ?? maxCount))
  if (nextCount >= total) return source

  const Ctor = source.constructor as { new (length: number): T }
  const out = new Ctor(nextCount * elems)

  for (let i = 0, j = 0; i < total && j < nextCount; i += step, j++) {
    const srcIndex = i * elems
    const dstIndex = j * elems
    for (let c = 0; c < elems; c++) {
      out[dstIndex + c] = source[srcIndex + c]
    }
  }

  return out
}
