'use client';

import { useMemo, useEffect } from 'react';
import { useCategory } from '@/contexts/CategoryContext';
import { type IdeaNode } from '@refinery/schema';
import { ClusterVisualization } from './ClusterVisualization';
import CrypticAnimusScene from './CrypticAnimusScene';
import { BrainMeshView } from './BrainMeshView';
import { type TraversalResult } from '@/utils/graphTraversal';

// Extended IdeaNode type with position for 3D visualization
export interface IdeaNodeWithPosition extends IdeaNode {
  position?: number[];
  links?: string[];
  state?: {
    isCollapsed?: boolean;
    isHidden?: boolean;
    isSelected?: boolean;
    currentLOD?: string;
    isLinkingStart?: boolean;
  };
}

interface SceneContentProps {
  viewMode: 'nodes' | 'clusters' | 'brain';
  nodes: IdeaNodeWithPosition[];
  links: { source: string; target: string; tier: 0 }[];
  visibleIds: Set<string>;
  handleNodeClick: (node: any) => void;
  handleNodeHover: (nodeId: string | null) => void;
  handleBackgroundClick: () => void;
  enrichedImages: Map<string, string>;
  interactionState: any;
  highlightState: TraversalResult | null;
  highlightActiveTime: number;
}

// Deep-clone helper – falls back to JSON for older browsers
const deepClone = <T,>(obj: T): T => {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj)) as T;
};

// Scene content component that renders based on view mode
export default function SceneContent({
  viewMode,
  nodes,
  links,
  visibleIds,
  handleNodeClick,
  handleNodeHover,
  handleBackgroundClick,
  enrichedImages,
  interactionState,
  highlightState,
  highlightActiveTime,
}: SceneContentProps) {
  // Add console log to track mount/unmount behavior
  useEffect(() => {
    console.log('[SceneContent] Component mounted');
    return () => {
      console.log('[SceneContent] Component unmounted');
    };
  }, []);

  const { activeCategories } = useCategory();
  // Transform nodes and links inside the component to prevent unnecessary recreations
  const transformedData = useMemo(() => {
    // Deep clone nodes and links before transformation to allow d3-force mutation
    const clonedNodes = nodes.map(node => deepClone(node));
    const clonedLinks = links.map(link => deepClone(link));
    
    const transformedNodes: any[] = clonedNodes.map((node) => ({
      ...node,
      childLinks: [],
      state: {
        ...node.state,
        isCollapsed: node.state?.isCollapsed ?? false,
        isHidden: node.state?.isHidden ?? false,
      },
    }));

    const transformedLinks: any[] = clonedLinks.map((link) => ({
      id: `${link.source}-${link.target}`,
      source: link.source,
      target: link.target,
      tier: link.tier,
      confidence: 0.8,
    }));

    // Return a stable object matching ForceGraph3D's expected shape
    return { nodes: transformedNodes, links: transformedLinks };
  }, [nodes, links]);

  return (
    <>
      {/* Nodes View: Individual memory nodes */}
      {viewMode === 'nodes' &&
        interactionState.masterGraphData?.nodes?.length > 0 && (
          <CrypticAnimusScene
            data={transformedData}
            onNodeClick={handleNodeClick}
            onNodeHoverProp={handleNodeHover}
            mouseSelectedNodeId={interactionState.mouseSelectedNodeId}
            searchResultOutlineIds={interactionState.searchResultNodeIds || []}
            currentInteractionMode={
              interactionState.currentInteractionMode || 'mouse'
            }
            gesturedNodeId={interactionState.gesturedNodeId || null}
            activeCategories={activeCategories}
            onBackgroundClickRequest={handleBackgroundClick}
            highlightState={highlightState}
            visibleIds={visibleIds}
          />
        )}

      {/* Clusters View: Grouped patterns */}
      {viewMode === 'clusters' && (
        <ClusterVisualization nodes={nodes} opacity={1} visible={true} />
      )}

      {/* Brain View: Brain mesh visualization */}
      {viewMode === 'brain' && (
        <BrainMeshView nodes={nodes} opacity={1} visible={true} />
      )}

      {/* EnergyRippleOverlay disabled for now */}
    </>
  );
}