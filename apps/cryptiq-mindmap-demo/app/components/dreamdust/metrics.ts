/**
 * Internal registry of log keys that have been emitted.
 * Using a {@link Set} keeps the implementation lightweight and tree-shakable.
 */
const emittedLogs = new Set<string>();

/**
 * Cached query string that was last evaluated for debug logging.
 */
let cachedSearch: string | undefined;

/**
 * Cached result of the debug flag evaluation for the associated {@link cachedSearch}.
 */
let cachedDebugEnabled: boolean | undefined;

/**
 * Checks whether debug logging is enabled via the `?debug=1` query string.
 */
function isDebugEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const { search } = window.location;

  if (cachedSearch === search && typeof cachedDebugEnabled !== 'undefined') {
    return cachedDebugEnabled;
  }

  try {
    const params = new URLSearchParams(search);
    cachedDebugEnabled = params.get('debug') === '1';
  } catch {
    // If URL parsing fails for any reason, fall back to disabled logging.
    cachedDebugEnabled = false;
  }

  cachedSearch = search;
  return cachedDebugEnabled ?? false;
}

/**
 * Logs the provided payload once per key, but only when the page is in debug mode.
 *
 * @param key - Unique identifier for the log entry.
 * @param payload - Data to log when debug mode is enabled.
 *
 * @example
 * ```ts
 * logOnce('init', { ready: true });
 * ```
 */
export function logOnce<T>(key: string, payload: T): void {
  if (!isDebugEnabled() || emittedLogs.has(key)) {
    return;
  }

  emittedLogs.add(key);
  // eslint-disable-next-line no-console
  console.info(`[dreamdust] ${key}`, payload);
}

/**
 * A function invoked with the latest frames-per-second estimate.
 */
export type FpsListener = (fps: number) => void;

/**
 * Starts a lightweight frames-per-second meter using `requestAnimationFrame`.
 *
 * @param onFps - Callback invoked roughly once per second with the measured FPS.
 * @returns A cleanup function that stops the meter.
 *
 * @example
 * ```ts
 * const stop = fpsMeter((fps) => console.log('fps', fps));
 *
 * // Later, when you no longer need to measure FPS:
 * stop();
 * ```
 */
const noop = () => {};

export function fpsMeter(onFps: FpsListener): () => void {
  if (typeof window === 'undefined') {
    return noop;
  }

  const { requestAnimationFrame, cancelAnimationFrame, performance } = window;

  if (typeof requestAnimationFrame !== 'function' || typeof cancelAnimationFrame !== 'function') {
    return noop;
  }

  let frameCount = 0;
  let lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
  let rafId: number | undefined;
  let active = true;

  const tick = (timestamp: number) => {
    if (!active) {
      return;
    }

    frameCount += 1;
    const now = timestamp ?? (typeof performance !== 'undefined' ? performance.now() : Date.now());
    const elapsed = now - lastTime;

    if (elapsed >= 1000) {
      const fps = (frameCount * 1000) / elapsed;
      onFps(fps);
      frameCount = 0;
      lastTime = now;
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    if (!active) {
      return;
    }

    active = false;

    if (typeof rafId === 'number') {
      cancelAnimationFrame(rafId);
    }
  };
}
