import * as THREE from 'three';

export type InkFieldPoint =
  | { x: number; y: number; t?: number; pressure?: number }
  | [number, number];

export interface InkField {
  readonly size: number;
  readonly dpr: number;
  drawStroke(points: ReadonlyArray<InkFieldPoint>, pressure?: number): void;
  decay(rate?: number): void;
  toCanvasTexture(renderer: THREE.WebGLRenderer, throttleHz?: number): THREE.CanvasTexture;
  getTexture(): THREE.CanvasTexture | null;
  dispose(): void;
}

const getNow = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

type Canvas2DContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
type CanvasLike = HTMLCanvasElement | OffscreenCanvas;

type CoordinateMode = 'pixel' | 'zeroToOne' | 'minusOneToOne';

type ResolvedInkPoint = { x: number; y: number; t?: number; pressure?: number };

const resolvePoint = (point: InkFieldPoint): ResolvedInkPoint => {
  if (Array.isArray(point)) {
    const [x, y] = point;
    return { x, y };
  }
  const { x, y } = point;
  const t = typeof point.t === 'number' && Number.isFinite(point.t) ? point.t : undefined;
  const pressure =
    typeof point.pressure === 'number' && Number.isFinite(point.pressure)
      ? point.pressure
      : undefined;
  return { x, y, t, pressure };
};

const determineCoordinateMode = (points: Array<{ x: number; y: number }>): CoordinateMode => {
  if (!points.length) {
    return 'pixel';
  }
  const sample = points.slice(0, 8);
  if (sample.every(({ x, y }) => x >= 0 && x <= 1 && y >= 0 && y <= 1)) {
    return 'zeroToOne';
  }
  if (sample.every(({ x, y }) => x >= -1 && x <= 1 && y >= -1 && y <= 1)) {
    return 'minusOneToOne';
  }
  return 'pixel';
};

const mapPoint = (point: ResolvedInkPoint, mode: CoordinateMode, size: number): ResolvedInkPoint => {
  switch (mode) {
    case 'zeroToOne':
      return { ...point, x: point.x * size, y: point.y * size };
    case 'minusOneToOne':
      return {
        ...point,
        x: (point.x * 0.5 + 0.5) * size,
        y: (point.y * 0.5 + 0.5) * size,
      };
    default:
      return point;
  }
};

const DECAY_FLOOR_EPSILON = 1 / 512;
const BRUSH_IDLE_WINDOW_MS = 240;
const MIN_FIELD_SIZE = 256;
const MAX_FIELD_SIZE = 512;
const DEFAULT_FIELD_SIZE = 384;

const clamp01 = (value: number) => {
  if (!Number.isFinite(value)) return 0;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const resolvePointPressure = (point: ResolvedInkPoint | undefined, fallback: number) => {
  if (!point) {
    return fallback;
  }
  if (typeof point.pressure === 'number' && Number.isFinite(point.pressure)) {
    return clamp01(point.pressure);
  }
  return fallback;
};

const resolvePointTime = (point: ResolvedInkPoint | undefined) => {
  if (!point) return undefined;
  if (typeof point.t === 'number' && Number.isFinite(point.t)) {
    return point.t;
  }
  return undefined;
};

const quantizeFieldSize = (size: number) => {
  if (size >= 480) return 512;
  if (size >= 352) return 384;
  return 256;
};

const chooseFieldSize = (requestedSize: number, dpr: number) => {
  const clamped = Math.min(Math.max(requestedSize, MIN_FIELD_SIZE), MAX_FIELD_SIZE);
  let target = quantizeFieldSize(clamped);

  if (typeof navigator !== 'undefined') {
    const cores = navigator.hardwareConcurrency ?? 4;
    if (cores <= 2) {
      target = 256;
    } else if (cores <= 4) {
      target = Math.min(target, 384);
    }
  }

  if (typeof window !== 'undefined') {
    const width = window.innerWidth || 0;
    const height = window.innerHeight || 0;
    const maxDim = Math.max(width, height);
    if (maxDim > 0 && maxDim < 900) {
      target = Math.min(target, 384);
    }
  }

  if (dpr > 1.6) {
    target = Math.min(target, 384);
  }

  return Math.min(Math.max(target, MIN_FIELD_SIZE), MAX_FIELD_SIZE);
};

const computeVelocityScale = (distance: number, deltaMs: number) => {
  if (!(Number.isFinite(distance) && Number.isFinite(deltaMs))) {
    return 1;
  }
  const ms = Math.max(4, deltaMs);
  const pxPerFrame = (distance / ms) * 16;
  const bonus = Math.min(1.75, Math.max(0, pxPerFrame) * 0.03);
  return 0.85 + bonus;
};

const computeRadius = (baseRadius: number, pressure: number, velocityScale: number) => {
  const pressureScale = 0.55 + pressure * 0.75;
  const dynamic = baseRadius * pressureScale * velocityScale;
  return Math.max(1.5, dynamic);
};

const computeStampIntensity = (pressure: number, velocityScale: number) => {
  const base = 0.55 + pressure * 0.4;
  const velocityBonus = Math.min(0.25, Math.max(0, velocityScale - 1) * 0.12);
  return Math.min(0.95, base + velocityBonus);
};

const createCanvas = (size: number, dpr: number): { canvas: CanvasLike | null; context: Canvas2DContext | null } => {
  const width = Math.max(1, Math.round(size * dpr));
  const height = width;

  let canvas: CanvasLike | null = null;
  if (typeof OffscreenCanvas !== 'undefined') {
    canvas = new OffscreenCanvas(width, height);
  } else if (typeof document !== 'undefined') {
    const element = document.createElement('canvas');
    element.width = width;
    element.height = height;
    canvas = element;
  }

  if (!canvas) {
    return { canvas: null, context: null };
  }

  const context = canvas.getContext('2d');
  if (!context) {
    return { canvas: null, context: null };
  }

  if (dpr !== 1) {
    context.scale(dpr, dpr);
  }
  context.clearRect(0, 0, size, size);

  return { canvas, context };
};

export const createInkField = (size = DEFAULT_FIELD_SIZE, dpr = 1): InkField => {
  const requestedSize = Math.max(1, size);
  const resolvedDpr = Math.max(0.5, dpr);
  const resolvedSize = chooseFieldSize(requestedSize, resolvedDpr);
  const { canvas, context } = createCanvas(resolvedSize, resolvedDpr);

  let texture: THREE.CanvasTexture | null = null;
  let dirty = true;
  let lastUploadTime = 0;
  let lastBrushTime = 0;
  let decayFloor = 0;
  let disposed = false;

  const ensureContext = (): { canvas: CanvasLike; context: Canvas2DContext } => {
    if (!canvas || !context) {
      throw new Error('InkField requires a 2D canvas context.');
    }
    return { canvas, context };
  };

  const drawStroke = (points: ReadonlyArray<InkFieldPoint>, pressure = 1) => {
    if (disposed || !context || !canvas) {
      return;
    }
    if (!points.length) {
      return;
    }

    const normalizedPressure = Math.max(pressure, 0);
    if (normalizedPressure === 0) {
      return;
    }

    lastBrushTime = getNow();
    decayFloor = Math.max(decayFloor, Math.min(normalizedPressure, 1));

    const resolvedPoints = points.map(resolvePoint);
    const mode = determineCoordinateMode(resolvedPoints);
    const baseRadius = Math.max(resolvedSize * 0.06, 5);

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = 1;

    const stamp = (sx: number, sy: number, stampRadius: number, strength: number) => {
      const clampedStrength = Math.min(Math.max(strength, 0), 1);
      const gradient = context.createRadialGradient(sx, sy, 0, sx, sy, stampRadius);
      gradient.addColorStop(0, `rgba(255,255,255,${clampedStrength.toFixed(3)})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(sx, sy, stampRadius, 0, Math.PI * 2);
      context.fill();
    };

    let previous = mapPoint(resolvedPoints[0], mode, resolvedSize);
    const initialPressure = resolvePointPressure(previous, normalizedPressure);
    const initialRadius = computeRadius(baseRadius, initialPressure, 1);
    const initialIntensity = computeStampIntensity(initialPressure, 1);
    stamp(previous.x, previous.y, initialRadius, initialIntensity);

    for (let i = 1; i < resolvedPoints.length; i += 1) {
      const current = mapPoint(resolvedPoints[i], mode, resolvedSize);
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (!distance || !Number.isFinite(distance)) {
        previous = current;
        continue;
      }

      const currentTime = resolvePointTime(current);
      const previousTime = resolvePointTime(previous);
      const deltaMs = currentTime !== undefined && previousTime !== undefined ? currentTime - previousTime : NaN;
      const velocityScale = computeVelocityScale(distance, Number.isFinite(deltaMs) ? deltaMs : 16);
      const previousPressure = resolvePointPressure(previous, normalizedPressure);
      const currentPressure = resolvePointPressure(current, normalizedPressure);
      const segmentPressure = (previousPressure + currentPressure) * 0.5;
      const radiusForSegment = computeRadius(baseRadius, segmentPressure, velocityScale);
      const intensityForSegment = computeStampIntensity(segmentPressure, velocityScale);
      const step = Math.max(radiusForSegment * 0.35, 0.85);
      const segments = Math.max(1, Math.ceil(distance / step));
      for (let segment = 1; segment <= segments; segment += 1) {
        const t = segment / segments;
        const sx = previous.x + dx * t;
        const sy = previous.y + dy * t;
        const falloff = 0.85 + Math.min(0.15, (1 - Math.abs(0.5 - t) * 2) * 0.15);
        stamp(sx, sy, radiusForSegment * falloff, intensityForSegment);
      }
      previous = current;
    }

    context.restore();
    dirty = true;
  };

  const decay = (rate = 0.96) => {
    if (disposed || !context || !canvas) {
      return;
    }
    const clamped = Math.min(Math.max(rate, 0), 1);
    if (clamped >= 1) {
      return;
    }

    const alpha = 1 - clamped;
    if (alpha <= 0) {
      return;
    }

    context.save();
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = alpha;
    context.fillStyle = '#000000';
    context.fillRect(0, 0, resolvedSize, resolvedSize);
    context.restore();

    const now = getNow();
    const idle = now - lastBrushTime > BRUSH_IDLE_WINDOW_MS;
    const previousFloor = decayFloor;
    decayFloor = previousFloor > 0 ? Math.min(previousFloor * clamped, 1) : 0;

    if (!idle || previousFloor > DECAY_FLOOR_EPSILON) {
      dirty = true;
    }
  };

  /**
   * Upload throttle timeline (not to scale):
   *   t0 ─ drawStroke ─┐  dirty ← true
   *   t0 + Δ ─ decay ──┤  throttle window (1000 / min(throttleHz, 60))
   *   t0 + Δ ≥ interval ──► upload & reset dirty
   *   idle ≥ window & decayFloor ≤ ε ─┬─► skip uploads (GPU stays steady)
   */
  const toCanvasTexture = (renderer: THREE.WebGLRenderer, throttleHz = 60) => {
    if (disposed) {
      throw new Error('InkField has been disposed.');
    }
    const { canvas: activeCanvas } = ensureContext();

    const now = getNow();
    const cappedHz = throttleHz > 0 ? Math.min(throttleHz, 60) : 0;
    const brushActive = now - lastBrushTime <= BRUSH_IDLE_WINDOW_MS;
    const idleHz = cappedHz > 0 ? Math.min(24, cappedHz) : 0;
    const effectiveHz = brushActive ? cappedHz : idleHz;
    const interval = effectiveHz > 0 ? 1000 / effectiveHz : 0;
    const pendingBrushUpload = lastBrushTime > lastUploadTime;

    if (!texture) {
      texture = new THREE.CanvasTexture(activeCanvas as unknown as HTMLCanvasElement);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.needsUpdate = true;
      lastUploadTime = now;
      dirty = false;
      return texture;
    }

    if (dirty) {
      const uploadDue = interval === 0 || now - lastUploadTime >= interval;
      if (uploadDue || (brushActive && pendingBrushUpload)) {
        texture.needsUpdate = true;
        lastUploadTime = now;
        dirty = false;
      }
    }

    return texture;
  };

  const getTexture = () => texture;

  const dispose = () => {
    if (disposed) {
      return;
    }
    disposed = true;
    texture?.dispose();
    texture = null;
  };

  return {
    size: resolvedSize,
    dpr: resolvedDpr,
    drawStroke,
    decay,
    toCanvasTexture,
    getTexture,
    dispose,
  };
};
