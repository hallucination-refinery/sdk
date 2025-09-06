"use client";

import { useEffect, useRef, useState } from "react";
import { loadDoodleNet, classify } from "./doodlenet";

export default function Draw3DPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadMs, setLoadMs] = useState<number | null>(null);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(80, 80);
      ctx.stroke();
    }

    loadDoodleNet().then(({ loadMs }) => {
      setLoadMs(loadMs);
      classify(canvas).then(({ results, inferenceMs }) => {
        setInferenceMs(inferenceMs);
        setResults(results);
      });
    });
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={100}
        height={100}
        style={{ border: "1px solid #000" }}
      />
      <div id="hud">
        <div id="load">model: {loadMs ? `${loadMs.toFixed(1)}ms` : "..."}</div>
        <div id="infer">inference: {inferenceMs ? `${inferenceMs.toFixed(1)}ms` : "..."}</div>
      </div>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
