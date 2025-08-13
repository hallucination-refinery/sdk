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
  ref?: React.Ref<any>;
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