import * as THREE from 'three';

export type InkFieldPoint = { x: number; y: number } | [number, number];

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

const resolvePoint = (point: InkFieldPoint): { x: number; y: number } => {
  if (Array.isArray(point)) {
    const [x, y] = point;
    return { x, y };
  }
  return point;
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

const mapPoint = (
  point: { x: number; y: number },
  mode: CoordinateMode,
  size: number,
): { x: number; y: number } => {
  switch (mode) {
    case 'zeroToOne':
      return { x: point.x * size, y: point.y * size };
    case 'minusOneToOne':
      return { x: (point.x * 0.5 + 0.5) * size, y: (point.y * 0.5 + 0.5) * size };
    default:
      return point;
  }
};

const DECAY_FLOOR_EPSILON = 1 / 512;
const BRUSH_IDLE_WINDOW_MS = 240;

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

export const createInkField = (size = 128, dpr = 1): InkField => {
  const resolvedSize = Math.max(1, size);
  const resolvedDpr = Math.max(0.5, dpr);
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
    const baseRadius = Math.max(resolvedSize * 0.10, 1);
    const radius = Math.max(baseRadius * normalizedPressure, 0.5);
    const step = Math.max(radius * 0.5, 1);

    context.save();
    context.globalCompositeOperation = 'lighter';
    context.globalAlpha = 1;

    const stamp = (sx: number, sy: number) => {
      const gradient = context.createRadialGradient(sx, sy, 0, sx, sy, radius);
      gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = gradient;
      context.beginPath();
      context.arc(sx, sy, radius, 0, Math.PI * 2);
      context.fill();
    };

    let previous = mapPoint(resolvedPoints[0], mode, resolvedSize);
    stamp(previous.x, previous.y);

    for (let i = 1; i < resolvedPoints.length; i += 1) {
      const current = mapPoint(resolvedPoints[i], mode, resolvedSize);
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (!distance || !Number.isFinite(distance)) {
        previous = current;
        continue;
      }
      const segments = Math.max(1, Math.ceil(distance / step));
      for (let segment = 1; segment <= segments; segment += 1) {
        const t = segment / segments;
        const sx = previous.x + dx * t;
        const sy = previous.y + dy * t;
        stamp(sx, sy);
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
    const interval = cappedHz > 0 ? 1000 / cappedHz : 0;
    const brushActive = now - lastBrushTime <= BRUSH_IDLE_WINDOW_MS;
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
