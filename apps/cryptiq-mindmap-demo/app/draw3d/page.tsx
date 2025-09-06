'use client';

import React, { useRef } from 'react';
import DoodleCanvas, { DoodleCanvasHandle } from './DoodleCanvas';

export default function Draw3DPage() {
  const ref = useRef<DoodleCanvasHandle>(null);

  const logData = () => {
    if (ref.current) {
      console.log(ref.current.get28x28Gray());
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 p-4">
      <DoodleCanvas ref={ref} />
      <div className="flex gap-2">
        <button onClick={() => ref.current?.undo()} className="px-2 py-1 border">Undo</button>
        <button onClick={() => ref.current?.clear()} className="px-2 py-1 border">Clear</button>
        <button onClick={logData} className="px-2 py-1 border">Log 28x28</button>
      </div>
    </div>
  );
}
