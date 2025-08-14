'use client';

import React, { useEffect, useRef } from 'react';
import { CanvasLatentAdapter } from '@pond/canvas-latent';
import type { CanvasLatentRef } from '@pond/canvas-latent';

export default function LatentHarnessPage() {
  const graphRef = useRef<CanvasLatentRef>(null);
  
  // Dev toggles from environment variables
  const debugGraph = process.env.NEXT_PUBLIC_DEBUG_GRAPH === '1';
  const latentTrace = process.env.NEXT_PUBLIC_LATENT_TRACE === '1';
  
  // Minimal graphData stub - one-burst configuration
  const graphData = {
    nodes: [
      { id: 'node-1', x: 0, y: 0, z: 0, label: 'Node 1', category: 'primary' },
      { id: 'node-2', x: 50, y: 30, z: 0, label: 'Node 2', category: 'secondary' },
      { id: 'node-3', x: -40, y: 20, z: 10, label: 'Node 3', category: 'primary' }
    ],
    links: [
      { source: 'node-1', target: 'node-2' },
      { source: 'node-2', target: 'node-3' }
    ]
  };
  
  // HUD mount check - immediate on load
  useEffect(() => {
    console.log('[HARNESS] HUD Mount Check - Immediate');
    
    if (debugGraph) {
      console.log('[DEBUG_GRAPH] GraphData:', graphData);
    }
    
    if (latentTrace) {
      console.log('[LATENT_TRACE] Component mounted with ref:', graphRef.current);
    }
    
    // Trigger one-burst animation on load
    if (graphRef.current) {
      console.log('[HARNESS] Triggering one-burst animation');
      // The adapter should handle the burst internally
    }
    
    // Expose ref to window for debugging
    if (typeof window !== 'undefined' && debugGraph) {
      (window as any).__HARNESS_REF = graphRef.current;
    }
    
    return () => {
      if (typeof window !== 'undefined' && debugGraph) {
        delete (window as any).__HARNESS_REF;
      }
    };
  }, [debugGraph, latentTrace]);
  
  // Event handlers with debug logging
  const handleNodeClick = (node: any, event?: any) => {
    if (debugGraph) {
      console.log('[DEBUG_GRAPH] Node clicked:', node);
    }
  };
  
  const handleNodeHover = (node: any | null) => {
    if (latentTrace) {
      console.log('[LATENT_TRACE] Node hover:', node);
    }
  };
  
  const handleBackgroundClick = (event?: any) => {
    if (debugGraph) {
      console.log('[DEBUG_GRAPH] Background clicked');
    }
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      {/* Dev toggle indicators */}
      {(debugGraph || latentTrace) && (
        <div style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          {debugGraph && <div>🔍 DEBUG_GRAPH</div>}
          {latentTrace && <div>📊 LATENT_TRACE</div>}
        </div>
      )}
      
      {/* Canvas Latent Adapter - direct import from @pond/canvas-latent, no @refinery/canvas-r3f */}
      <CanvasLatentAdapter
        ref={graphRef}
        graphData={graphData}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        onBackgroundClick={handleBackgroundClick}
        nodeColor={(node: any) => node.category === 'primary' ? '#ff6b6b' : '#4ecdc4'}
        nodeRelSize={8}
        enableNavigationControls={true}
        enablePointerInteraction={true}
      />
    </div>
  );
}