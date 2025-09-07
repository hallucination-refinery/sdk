"use client";

import { useEffect, useState } from 'react';
import DoodleCanvas from './canvas/DoodleCanvas';
import { make28x28Canvas } from './canvas/preprocess';
import { classify, loadDoodleNet } from './ml/doodlenet';
import FormationView from './renderer/FormationView';
import HUD from './ui/HUD';

const seeded = new Set([
  'balloon',
  'bird',
  'car',
  'cat',
  'cup',
  'fish',
  'flower',
  'house',
  'phone',
  'tree',
]);

const map: Record<string, string> = {
  ship: 'boat',
  cellphone: 'phone',
  mobile: 'phone',
  leaf: 'flower',
};

function fallbackFormation(count = 8, scale = 1.8): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    arr[i * 3] = Math.cos(angle) * scale;
    arr[i * 3 + 1] = Math.sin(angle) * scale;
    arr[i * 3 + 2] = 0;
  }
  return arr;
}

export default function AppHost() {
  const [positions, setPositions] = useState<Float32Array | null>(null);
  const [ready, setReady] = useState(false);
  const [loadMs, setLoadMs] = useState(0);
  const [inferMs, setInferMs] = useState(0);
  const [fps, setFps] = useState(0);

  // simple fps tracker
  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let raf: number;
    const loop = (t: number) => {
      frame++;
      const delta = t - last;
      if (delta >= 1000) {
        setFps(Math.round((frame * 1000) / delta));
        frame = 0;
        last = t;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleEnd = async (c: HTMLCanvasElement) => {
    const off = make28x28Canvas(c);
    const ctx = off.getContext('2d');
    if (ctx) {
      const img = ctx.getImageData(0, 0, 28, 28);
      const { data } = img;
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      ctx.putImageData(img, 0, 0);
    }

    let lMs = loadMs;
    if (!ready) {
      const loadStart = performance.now();
      await loadDoodleNet();
      lMs = performance.now() - loadStart;
      setLoadMs(lMs);
      setReady(true);
    }

    const inferStart = performance.now();
    const [pred] = await classify(off, 1);
    const iMs = performance.now() - inferStart;
    setInferMs(iMs);

    const label = pred?.label ?? '';
    const normalized = map[label] ?? (seeded.has(label) ? label : 'cat');

    try {
      const res = await fetch(`/formations/${normalized}.json`);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const json = await res.json();
      const data = Array.isArray(json) ? json : json.positions;
      setPositions(new Float32Array(data));
    } catch {
      setPositions(fallbackFormation());
    }
  };

  return (
    <div>
      <HUD
        ready={ready}
        loadMs={Math.round(loadMs)}
        inferMs={Math.round(inferMs)}
        fps={fps}
        instances={positions ? positions.length / 3 : 0}
      />
      <DoodleCanvas onEnd={handleEnd} />
      {positions && <FormationView positions={positions} />}
    </div>
  );
}
