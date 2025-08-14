import type { Ref } from 'react';

export interface NodeData {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  category?: string;
  tags?: string[];
  timestamp?: number;
}

export interface AnimationConfig {
  burstDuration: number;
  morphDuration: number;
  fadeTransition: number;
}

export interface CanvasLatentProps {
  ref?: Ref<any>;
  graphData: { nodes: any[]; links: any[] };

  nodeId?: string;
  linkSource?: string;
  linkTarget?: string;

  onNodeClick?: (node: any, event?: any) => void;
  onNodeHover?: (node: any | null) => void;
  onNodeRightClick?: (node: any, event?: any) => void;
  onLinkClick?: (link: any, event?: any) => void;
  onLinkHover?: (link: any | null) => void;
  onBackgroundClick?: (event?: any) => void;
  onBackgroundRightClick?: (event?: any) => void;

  /**
   * @deprecated No-op in canvas-latent implementation. Included for compatibility.
   */
  nodeThreeObject?: (node: any) => any;
  /**
   * @deprecated No-op in canvas-latent implementation. Included for compatibility.
   */
  nodeThreeObjectExtend?: (obj: any, node: any) => boolean;
  nodeVisibility?: (node: any) => boolean;
  nodeColor?: (node: any) => string;
  nodeOpacity?: number;
  nodeRelSize?: number;
  nodeVal?: (node: any) => number;
  nodeLabel?: (node: any) => string;
  nodeDesc?: (node: any) => string;

  linkVisibility?: (link: any) => boolean;
  linkColor?: (link: any) => string;
  linkWidth?: (link: any) => number;
  linkCurvature?: number | ((link: any) => number);
  linkCurveRotation?: number | ((link: any) => number);
  linkMaterial?: any;
  linkOpacity?: number;
  linkResolution?: number;

  enableNodeDrag?: boolean;
  enableNavigationControls?: boolean;
  enablePointerInteraction?: boolean;
  enableZoomPanInteraction?: boolean;

  disableLinkForce?: boolean;

  activeCategories?: Set<string>;
  activeTags?: Set<string>;

  [key: string]: any;
}

export interface CanvasLatentRef {
  // Graph data methods
  graphData: () => { nodes: any[]; links: any[] };
  
  // Camera methods
  cameraPosition: (position?: { x?: number; y?: number; z?: number }, lookAt?: { x?: number; y?: number; z?: number }, duration?: number) => { x: number; y: number; z: number };
  zoomToFit: (duration?: number, padding?: number, nodeFilter?: (node: any) => boolean) => void;
  
  // Node methods
  centerAt: (x?: number, y?: number, duration?: number) => { x: number; y: number };
  zoom: (zoomLevel?: number, duration?: number) => number;
  
  // Force simulation methods (no-ops for canvas-latent)
  d3Force: (forceName: string, force?: any) => any;
  d3ReheatSimulation: () => void;
  d3AlphaTarget: (target?: number) => number;
  d3AlphaDecay: (decay?: number) => number;
  d3VelocityDecay: (decay?: number) => number;
  
  // Utility methods
  refresh: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
  
  // Scene access
  scene: () => any;
  camera: () => any;
  renderer: () => any;
  controls: () => any;
  
  // Screen/world coordinate conversion
  screen2GraphCoords: (x: number, y: number, distance?: number) => { x: number; y: number; z: number };
  graph2ScreenCoords: (x: number, y: number, z?: number) => { x: number; y: number };
  
  // Node position methods
  getGraphBbox: (nodeFilter?: (node: any) => boolean) => { x: [number, number]; y: [number, number]; z: [number, number] };
}