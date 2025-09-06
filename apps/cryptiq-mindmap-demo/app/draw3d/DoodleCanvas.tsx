'use client';

import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

export function get28x28Gray(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const off = document.createElement('canvas');
  off.width = 28;
  off.height = 28;
  const octx = off.getContext('2d');
  if (!octx) return new Uint8ClampedArray(28 * 28);
  octx.drawImage(canvas, 0, 0, 28, 28);
  const data = octx.getImageData(0, 0, 28, 28).data;
  const gray = new Uint8ClampedArray(28 * 28);
  for (let i = 0; i < 28 * 28; i++) {
    const idx = i * 4;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3] / 255;
    gray[i] = (r + g + b) / 3 * a;
  }
  return gray;
}

export interface DoodleCanvasHandle {
  clear: () => void;
  undo: () => void;
  get28x28Gray: () => Uint8ClampedArray;
}

const DoodleCanvas = forwardRef<DoodleCanvasHandle>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const history = useRef<ImageData[]>([]);
  const drawing = useRef(false);
  const last = useRef<{x: number; y: number} | null>(null);

  const getCtx = () => canvasRef.current?.getContext('2d', { willReadFrequently: true });

  const clear = useCallback(() => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    history.current = [];
  }, []);

  const undo = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const img = history.current.pop();
    if (img) {
      ctx.putImageData(img, 0, 0);
    } else {
      clear();
    }
  }, [clear]);

  useImperativeHandle(ref, () => ({
    clear,
    undo,
    get28x28Gray: () => get28x28Gray(canvasRef.current!),
  }));

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const pointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    history.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
    drawing.current = true;
    ctx.lineCap = 'round';
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#000';
    const { x, y } = getPos(e);
    last.current = { x, y };
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const pointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = getPos(e);
    const l = last.current;
    if (!l) return;
    const dist = Math.hypot(x - l.x, y - l.y);
    const steps = Math.ceil(dist / 2);
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const nx = lerp(l.x, x, t);
      const ny = lerp(l.y, y, t);
      ctx.lineTo(nx, ny);
    }
    ctx.stroke();
    last.current = { x, y };
  };

  const pointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    drawing.current = false;
    last.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerLeave={pointerUp}
      style={{ touchAction: 'none' }}
      className="border border-gray-300 bg-white"
    />
  );
});

DoodleCanvas.displayName = 'DoodleCanvas';

export default DoodleCanvas;
