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

type TypedArray =
  | Float32Array
  | Float64Array
  | Int32Array
  | Int16Array
  | Int8Array
  | Uint32Array
  | Uint16Array
  | Uint8Array
  | Uint8ClampedArray

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
  cap: number
  keepRatio?: number
  minCount?: number
}

export type CapInstancesResult = {
  source: number
  cap: number
  requestedKeep: number
  appliedKeep: number
  count: number
  step: number
}

export function capInstances(
  sourceCount: number,
  { cap, keepRatio = 1, minCount = 1 }: CapInstancesOptions,
): CapInstancesResult {
  const source = Math.max(0, Math.floor(sourceCount))
  const safeCap = Math.max(0, Math.floor(cap))
  const clampKeep = Math.min(Math.max(keepRatio, 0), 1)

  if (source === 0 || safeCap === 0) {
    return {
      source,
      cap: safeCap,
      requestedKeep: clampKeep,
      appliedKeep: 0,
      count: 0,
      step: 1,
    }
  }

  const capKeep = Math.min(1, safeCap / source)
  const requestedKeep = Math.min(clampKeep, capKeep)

  if (requestedKeep >= 0.999) {
    const count = Math.min(source, safeCap)
    return {
      source,
      cap: safeCap,
      requestedKeep,
      appliedKeep: count / source,
      count,
      step: 1,
    }
  }

  const safeKeep = Math.max(requestedKeep, 1e-6)
  const step = Math.max(1, Math.ceil(1 / safeKeep))
  let count = Math.floor(source / step)
  const minSafe = Math.max(0, Math.floor(minCount))
  if (minSafe > 0) count = Math.max(count, minSafe)
  count = Math.min(count, safeCap, source)
  const appliedKeep = source > 0 ? count / source : 0

  return {
    source,
    cap: safeCap,
    requestedKeep,
    appliedKeep,
    count,
    step,
  }
}

export function decimateInterleaved<T extends TypedArray>(
  source: T,
  itemSize: number,
  step: number,
  targetCount: number,
): T {
  const safeItemSize = Math.max(1, Math.floor(itemSize))
  const sourceCount = Math.floor(source.length / safeItemSize)
  const count = Math.max(0, Math.min(targetCount, sourceCount))
  if (count === 0) {
    const Ctor = source.constructor as { new (length: number): T }
    return new Ctor(0)
  }
  if (step <= 1 || count >= sourceCount) {
    return source
  }

  const Ctor = source.constructor as { new (length: number): T }
  const out = new Ctor(count * safeItemSize)

  for (let srcIndex = 0, dstIndex = 0; dstIndex < count && srcIndex < sourceCount; srcIndex += step, dstIndex++) {
    const srcOffset = srcIndex * safeItemSize
    const dstOffset = dstIndex * safeItemSize
    for (let k = 0; k < safeItemSize; k++) {
      out[dstOffset + k] = source[srcOffset + k]
    }
  }

  return out
}
