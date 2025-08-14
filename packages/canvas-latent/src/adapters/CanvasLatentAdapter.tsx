import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import type { CanvasLatentProps, CanvasLatentRef } from '../types';

const CanvasLatentAdapter = forwardRef<CanvasLatentRef, CanvasLatentProps>((props, ref) => {
  const {
    graphData,
    onNodeClick,
    onNodeHover,
    onNodeRightClick,
    onLinkClick,
    onLinkHover,
    onBackgroundClick,
    onBackgroundRightClick,
    
    // Props to accept but ignore (for compatibility)
    nodeThreeObject,
    nodeThreeObjectExtend,
    
    // Other props
    ...restProps
  } = props;

  // Internal refs for implementation
  const internalGraphData = useRef(graphData);
  const sceneRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);

  // Update internal graph data when prop changes
  useEffect(() => {
    internalGraphData.current = graphData;
  }, [graphData]);

  // Ref API implementation
  const refMethods: CanvasLatentRef = {
    // Graph data methods
    graphData: () => internalGraphData.current,
    
    // Camera methods
    cameraPosition: (position, lookAt, duration) => {
      // Stub implementation - return current position
      return { x: 0, y: 0, z: 100 };
    },
    
    zoomToFit: (duration, padding, nodeFilter) => {
      // Stub implementation
      console.log('zoomToFit called', { duration, padding });
    },
    
    // Node methods
    centerAt: (x = 0, y = 0, duration) => {
      // Stub implementation
      return { x, y };
    },
    
    zoom: (zoomLevel, duration) => {
      // Stub implementation
      return zoomLevel || 1;
    },
    
    // Force simulation methods (no-ops)
    d3Force: (forceName, force) => {
      // No-op for canvas-latent
      return null;
    },
    
    d3ReheatSimulation: () => {
      // No-op for canvas-latent
    },
    
    d3AlphaTarget: (target) => {
      // No-op for canvas-latent
      return target || 0;
    },
    
    d3AlphaDecay: (decay) => {
      // No-op for canvas-latent
      return decay || 0.0228;
    },
    
    d3VelocityDecay: (decay) => {
      // No-op for canvas-latent
      return decay || 0.4;
    },
    
    // Utility methods
    refresh: () => {
      console.log('refresh called');
    },
    
    pauseAnimation: () => {
      console.log('pauseAnimation called');
    },
    
    resumeAnimation: () => {
      console.log('resumeAnimation called');
    },
    
    // Scene access
    scene: () => sceneRef.current,
    camera: () => cameraRef.current,
    renderer: () => rendererRef.current,
    controls: () => controlsRef.current,
    
    // Screen/world coordinate conversion
    screen2GraphCoords: (x, y, distance = 0) => {
      // Stub implementation
      return { x, y, z: distance };
    },
    
    graph2ScreenCoords: (x, y, z = 0) => {
      // Stub implementation
      return { x, y };
    },
    
    // Node position methods
    getGraphBbox: (nodeFilter) => {
      // Stub implementation
      const nodes = internalGraphData.current.nodes;
      const filteredNodes = nodeFilter ? nodes.filter(nodeFilter) : nodes;
      
      if (filteredNodes.length === 0) {
        return { x: [0, 0], y: [0, 0], z: [0, 0] };
      }
      
      // Calculate bounding box from filtered nodes
      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;
      let minZ = Infinity, maxZ = -Infinity;
      
      filteredNodes.forEach((node: any) => {
        const x = node.x || 0;
        const y = node.y || 0;
        const z = node.z || 0;
        
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
      });
      
      return {
        x: [minX, maxX],
        y: [minY, maxY],
        z: [minZ, maxZ]
      };
    }
  };

  // Expose ref methods
  useImperativeHandle(ref, () => refMethods, [graphData]);

  // Expose to window.__FG for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__FG = refMethods;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__FG;
      }
    };
  }, []);

  // Wire store callbacks with raycaster interaction
  const handleNodeInteraction = (type: 'click' | 'hover' | 'rightClick', node: any, event?: any) => {
    // Get node object from graphData
    const nodeFromData = internalGraphData.current.nodes.find((n: any) => n.id === node?.id) || node;
    
    switch (type) {
      case 'click':
        onNodeClick?.(nodeFromData, event);
        break;
      case 'hover':
        onNodeHover?.(nodeFromData);
        break;
      case 'rightClick':
        onNodeRightClick?.(nodeFromData, event);
        break;
    }
  };

  const handleBackgroundInteraction = (type: 'click' | 'rightClick', event?: any) => {
    switch (type) {
      case 'click':
        onBackgroundClick?.(event);
        break;
      case 'rightClick':
        onBackgroundRightClick?.(event);
        break;
    }
  };

  // Placeholder component - actual implementation would integrate with canvas-latent core
  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onClick={(e) => {
        // Simulate interaction for now
        // In real implementation, this would be handled by RaycastHandler
        if (e.target === e.currentTarget) {
          handleBackgroundInteraction('click', e);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        if (e.target === e.currentTarget) {
          handleBackgroundInteraction('rightClick', e);
        }
      }}
      {...restProps}
    >
      {/* Canvas-latent implementation would go here */}
      <canvas style={{ width: '100%', height: '100%' }} />
    </div>
  );
});

CanvasLatentAdapter.displayName = 'CanvasLatentAdapter';

export default CanvasLatentAdapter;