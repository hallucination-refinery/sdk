'use client';

import { useEffect, useState } from 'react';

export default function ControlsHUD() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-8 left-8 transition-opacity duration-1000 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-black/90 backdrop-blur-md rounded-lg p-4 border border-white/50">
        <h3 className="text-sm font-medium text-white mb-2">Controls</h3>
        <div className="space-y-1 text-xs text-white">
          <div>WASD/Arrows - Pan camera</div>
          <div>Q/E or Mouse wheel - Zoom</div>
          <div>Space - Auto-zoom to brain</div>
          <div>R - Reset camera</div>
          <div>H - Hippocampus easter egg</div>
        </div>
      </div>
    </div>
  );
}
