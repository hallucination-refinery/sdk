'use client';

import { useEffect, useRef, useState } from 'react';
import DoodleCanvas from './canvas/DoodleCanvas';
import { get28x28Gray } from './canvas/preprocess';
import { classify, loadDoodleNet } from './ml/doodlenet';
import FormationView from './renderer/FormationView';
import HUD from './ui/HUD';
import { useFormation as fetchFormation } from './data/useFormation';

export default function AppHost() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

  // wire draw end pipeline
  useEffect(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    canvasRef.current = canvas as HTMLCanvasElement;

    const handleEnd = async () => {
      const c = canvasRef.current;
      if (!c) return;

      const preStart = performance.now();
      get28x28Gray(c);
      const preMs = performance.now() - preStart;

      let lMs = loadMs;
      if (!ready) {
        const loadStart = performance.now();
        await loadDoodleNet();
        lMs = performance.now() - loadStart;
        setLoadMs(lMs);
        setReady(true);
      }

      const inferStart = performance.now();
      const [pred] = await classify(c, 1);
      const iMs = performance.now() - inferStart;
      setInferMs(iMs);

      console.log(
        `pre ${preMs.toFixed(1)}ms load ${lMs.toFixed(1)}ms infer ${iMs.toFixed(1)}ms`
      );

      const label = pred?.label;
      if (label) {
        const form = await fetchFormation(label);
        setPositions(form);
      }
    };

    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('touchend', handleEnd);
    return () => {
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [ready, loadMs]);

  return (
    <div>
      <HUD
        ready={ready}
        loadMs={Math.round(loadMs)}
        inferMs={Math.round(inferMs)}
        fps={fps}
        instances={positions ? positions.length / 3 : 0}
      />
      <DoodleCanvas />
      {positions && <FormationView positions={positions} />}
    </div>
  );
}
