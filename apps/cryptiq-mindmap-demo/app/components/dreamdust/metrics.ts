/**
 * Internal registry of log keys that have been emitted.
 * Using a {@link Set} keeps the implementation lightweight and tree-shakable.
 */
const emittedLogs = new Set<string>();

export type DreamdustCapsFanoutSource = 'stage' | 'context' | 'host' | 'metrics';

type CapsFanoutState = Record<DreamdustCapsFanoutSource, boolean>;

const capsFanoutState: CapsFanoutState = {
  stage: false,
  context: false,
  host: false,
  metrics: false,
};

let capsFanoutLogged = false;
let capsFanoutTimer: number | null = null;

const CAPS_FANOUT_TIMEOUT_MS = 2000;

function logCapsFanout(): void {
  if (capsFanoutLogged) {
    return;
  }

  capsFanoutLogged = true;

  if (capsFanoutTimer !== null && typeof window !== 'undefined') {
    window.clearTimeout(capsFanoutTimer);
    capsFanoutTimer = null;
  }

  try {
    console.info(
      `[dreamdust] caps-fanout { stage: ${capsFanoutState.stage}, context: ${capsFanoutState.context}, host: ${capsFanoutState.host}, metrics: ${capsFanoutState.metrics} }`,
    );
  } catch {
    // Swallow logging failures to avoid interrupting runtime flow.
  }
}

function scheduleCapsFanoutTimeout(): void {
  if (capsFanoutLogged || capsFanoutTimer !== null || typeof window === 'undefined') {
    return;
  }

  capsFanoutTimer = window.setTimeout(() => {
    capsFanoutTimer = null;
    logCapsFanout();
  }, CAPS_FANOUT_TIMEOUT_MS);
}

export function ackDreamdustCapsFanout(source: DreamdustCapsFanoutSource): void {
  if (capsFanoutLogged) {
    return;
  }

  if (!capsFanoutState[source]) {
    capsFanoutState[source] = true;
  }

  if (capsFanoutState.stage) {
    scheduleCapsFanoutTimeout();
  }

  if (capsFanoutState.stage && capsFanoutState.context && capsFanoutState.host && capsFanoutState.metrics) {
    logCapsFanout();
  }
}

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
  if (typeof key !== 'string' || key.trim().length === 0) {
    return;
  }

  if (!isDebugEnabled() || emittedLogs.has(key)) {
    return;
  }

  emittedLogs.add(key);
  console.info(`[dreamdust] ${key}`, payload);
}

if (typeof window !== 'undefined') {
  ackDreamdustCapsFanout('metrics');
}

export function logOnceKeyExists(key: string): boolean {
  return emittedLogs.has(key);
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

const DREAMDUST_TUNABLE_STORAGE_KEY = 'dreamdust:tunables';

export type DreamdustTunables = {
  curlFreq: number;
  curlAmp: number;
  tapGain: number;
  tapTau: number;
  decay: number;
  revealMs: number;
};

const DEFAULT_TUNABLES: DreamdustTunables = {
  curlFreq: 0.0025,
  curlAmp: 8,
  tapGain: 1,
  tapTau: 900,
  decay: 0.98,
  revealMs: 2000,
};

type TunablesListener = (tunables: DreamdustTunables) => void;

const tunablesListeners = new Set<TunablesListener>();

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function sanitizeTunables(update: Partial<DreamdustTunables>): Partial<DreamdustTunables> {
  const next: Partial<DreamdustTunables> = {};
  if (Object.prototype.hasOwnProperty.call(update, 'curlFreq')) {
    const value = Number(update.curlFreq);
    if (Number.isFinite(value)) {
      next.curlFreq = clamp(value, 0.0005, 0.02);
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, 'curlAmp')) {
    const value = Number(update.curlAmp);
    if (Number.isFinite(value)) {
      next.curlAmp = clamp(value, 0, 16);
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, 'tapGain')) {
    const value = Number(update.tapGain);
    if (Number.isFinite(value)) {
      next.tapGain = clamp(value, 0, 3);
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, 'tapTau')) {
    const value = Number(update.tapTau);
    if (Number.isFinite(value)) {
      next.tapTau = clamp(value, 120, 6000);
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, 'decay')) {
    const value = Number(update.decay);
    if (Number.isFinite(value)) {
      next.decay = clamp(value, 0.9, 0.9999);
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, 'revealMs')) {
    const value = Number(update.revealMs);
    if (Number.isFinite(value)) {
      next.revealMs = clamp(value, 300, 8000);
    }
  }
  return next;
}

function readStoredTunables(): Partial<DreamdustTunables> {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const stored = window.localStorage?.getItem(DREAMDUST_TUNABLE_STORAGE_KEY);
    if (!stored) {
      return {};
    }
    const parsed = JSON.parse(stored) as Partial<DreamdustTunables>;
    return sanitizeTunables(parsed);
  } catch {
    return {};
  }
}

let currentTunables: DreamdustTunables = {
  ...DEFAULT_TUNABLES,
  ...readStoredTunables(),
};

function persistTunables(tunables: DreamdustTunables) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage?.setItem(
      DREAMDUST_TUNABLE_STORAGE_KEY,
      JSON.stringify(tunables),
    );
  } catch {
    // Ignore persistence failures (e.g., private mode, SSR).
  }
}

function emitTunables(next: DreamdustTunables) {
  if (tunablesListeners.size === 0) {
    return;
  }
  const snapshot = { ...next };
  tunablesListeners.forEach((listener) => {
    try {
      listener(snapshot);
    } catch {
      // Ignore listener errors to avoid breaking other subscribers.
    }
  });
}

export function getDreamdustTunables(): DreamdustTunables {
  return currentTunables;
}

export function updateDreamdustTunables(
  update: Partial<DreamdustTunables>,
): DreamdustTunables {
  if (!update || typeof update !== 'object') {
    return currentTunables;
  }
  const sanitized = sanitizeTunables(update);
  if (Object.keys(sanitized).length === 0) {
    return currentTunables;
  }
  currentTunables = {
    ...currentTunables,
    ...sanitized,
  };
  persistTunables(currentTunables);
  emitTunables(currentTunables);
  return currentTunables;
}

export function subscribeDreamdustTunables(
  listener: TunablesListener,
): () => void {
  tunablesListeners.add(listener);
  try {
    listener({ ...currentTunables });
  } catch {
    // Ignore listener errors on initial emit.
  }
  return () => {
    tunablesListeners.delete(listener);
  };
}

type InkLatencyState = {
  start: number | null;
  measured: boolean;
  rafId: number | null;
  resetTimer: ReturnType<typeof setTimeout> | null;
};

const inkLatencyState: InkLatencyState = {
  start: null,
  measured: false,
  rafId: null,
  resetTimer: null,
};

function nowMs(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

function finalizeInkLatency(endTime: number) {
  if (inkLatencyState.start === null || inkLatencyState.measured) {
    return;
  }
  const deltaMs = Math.max(0, endTime - inkLatencyState.start);
  inkLatencyState.measured = true;
  inkLatencyState.start = null;
  if (inkLatencyState.resetTimer) {
    clearTimeout(inkLatencyState.resetTimer);
    inkLatencyState.resetTimer = null;
  }
  if (inkLatencyState.rafId !== null && typeof window !== 'undefined') {
    try {
      window.cancelAnimationFrame(inkLatencyState.rafId);
    } catch {
      // Ignore cancellation failures.
    }
    inkLatencyState.rafId = null;
  }
  const frames = deltaMs / 16.6667;
  logOnce('ink-latency', {
    ms: Number(deltaMs.toFixed(3)),
    frames: Number(frames.toFixed(2)),
  });
}

export function markInkPenDown(timestamp: number = nowMs()): void {
  if (inkLatencyState.measured) {
    return;
  }
  inkLatencyState.start = timestamp;
  if (inkLatencyState.resetTimer) {
    clearTimeout(inkLatencyState.resetTimer);
  }
  if (typeof setTimeout === 'function') {
    inkLatencyState.resetTimer = setTimeout(() => {
      inkLatencyState.resetTimer = null;
      if (!inkLatencyState.measured) {
        inkLatencyState.start = null;
      }
    }, 2000);
  }
}

export function markInkFrameCandidate(): void {
  if (inkLatencyState.measured || inkLatencyState.start === null) {
    return;
  }
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
    finalizeInkLatency(nowMs());
    return;
  }
  if (inkLatencyState.rafId !== null) {
    return;
  }
  inkLatencyState.rafId = window.requestAnimationFrame(() => {
    inkLatencyState.rafId = null;
    finalizeInkLatency(nowMs());
  });
}

type FrameSampleState = {
  last: number | null;
  samples: number[];
  rafId: number | null;
  logged: boolean;
};

const frameSampleState: FrameSampleState = {
  last: null,
  samples: [],
  rafId: null,
  logged: false,
};

function logFramePercentiles(samples: number[]): void {
  if (!isDebugEnabled() || samples.length === 0) {
    return;
  }
  const sorted = [...samples].sort((a, b) => a - b);
  const p50Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.5));
  const p90Index = Math.min(sorted.length - 1, Math.floor(sorted.length * 0.9));
  const p50 = sorted[p50Index];
  const p90 = sorted[p90Index];
  logOnce('frame-percentiles', {
    sampleCount: sorted.length,
    p50Ms: Number(p50.toFixed(3)),
    p90Ms: Number(p90.toFixed(3)),
  });
}

function sampleFrameTimes(): void {
  if (typeof window === 'undefined') {
    return;
  }
  const { requestAnimationFrame } = window;
  if (typeof requestAnimationFrame !== 'function') {
    return;
  }

  const maxSamples = 240;

  const step = (timestamp: number) => {
    if (frameSampleState.last !== null) {
      const delta = timestamp - frameSampleState.last;
      if (Number.isFinite(delta) && delta > 0) {
        frameSampleState.samples.push(delta);
      }
    }
    frameSampleState.last = timestamp;

    if (!frameSampleState.logged && frameSampleState.samples.length >= maxSamples) {
      frameSampleState.logged = true;
      logFramePercentiles(frameSampleState.samples);
    }

    if (!frameSampleState.logged) {
      frameSampleState.rafId = requestAnimationFrame(step);
    } else {
      frameSampleState.rafId = null;
    }
  };

  frameSampleState.rafId = requestAnimationFrame(step);
}

if (typeof window !== 'undefined') {
  if (typeof window.requestAnimationFrame === 'function') {
    sampleFrameTimes();
  }
  if (typeof window !== 'undefined') {
    try {
      (window as typeof window & { __dreamdustTunables?: unknown }).__dreamdustTunables = {
        get: getDreamdustTunables,
        set: updateDreamdustTunables,
      };
    } catch {
      // Ignore assignment failures (e.g., read-only globals).
    }
  }
}
