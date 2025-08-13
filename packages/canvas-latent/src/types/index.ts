import * as THREE from 'three';

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
  ref?: React.Ref<HTMLDivElement>;
  graphData: { nodes: NodeData[]; links: LinkData[] };

  nodeId?: string;
  linkSource?: string;
  linkTarget?: string;

  onNodeClick?: (node: NodeData, event?: MouseEvent) => void;
  onNodeHover?: (node: NodeData | null) => void;
  onNodeRightClick?: (node: NodeData, event?: MouseEvent) => void;
  onLinkClick?: (link: LinkData, event?: MouseEvent) => void;
  onLinkHover?: (link: LinkData | null) => void;
  onBackgroundClick?: (event?: MouseEvent) => void;
  onBackgroundRightClick?: (event?: MouseEvent) => void;

  /**
   * @deprecated No-op in canvas-latent implementation. Included for compatibility.
   */
  nodeThreeObject?: (node: NodeData) => THREE.Object3D;
  /**
   * @deprecated No-op in canvas-latent implementation. Included for compatibility.
   */
  nodeThreeObjectExtend?: (obj: THREE.Object3D, node: NodeData) => boolean;
  nodeVisibility?: (node: NodeData) => boolean;
  nodeColor?: (node: NodeData) => string;
  nodeOpacity?: number;
  nodeRelSize?: number;
  nodeVal?: (node: NodeData) => number;
  nodeLabel?: (node: NodeData) => string;
  nodeDesc?: (node: NodeData) => string;

  linkVisibility?: (link: LinkData) => boolean;
  linkColor?: (link: LinkData) => string;
  linkWidth?: (link: LinkData) => number;
  linkCurvature?: number | ((link: LinkData) => number);
  linkCurveRotation?: number | ((link: LinkData) => number);
  linkMaterial?: THREE.Material;
  linkOpacity?: number;
  linkResolution?: number;

  enableNodeDrag?: boolean;
  enableNavigationControls?: boolean;
  enablePointerInteraction?: boolean;
  enableZoomPanInteraction?: boolean;

  disableLinkForce?: boolean;

  activeCategories?: Set<string>;
  activeTags?: Set<string>;
  
  // Additional props for extensibility
  [key: string]: unknown;
}

export interface LinkData {
  source: string;
  target: string;
  [key: string]: unknown;
}