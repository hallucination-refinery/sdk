import React, { type MouseEvent as ReactMouseEvent } from 'react';
import type { NodeObject } from 'r3f-forcegraph';
import { IdeaNode } from '@refinery/ideanode';
import { IdeaEdge } from '@refinery/thinkable';
export declare const RenderPerformanceStats: {
    frameCount: number;
    lastTime: number;
    fps: number;
    frameTime: number;
    update(): void;
    getStats(): {
        fps: number;
        frameTime: number;
        spriteStats: {
            textureLoads: number;
            textureHits: number;
            materialCreations: number;
            materialHits: number;
            canvasCreations: number;
            cacheHitRate: {
                textures: number;
                materials: number;
            };
        };
    };
};
declare global {
    interface Window {
        RenderPerformanceStats?: typeof RenderPerformanceStats;
    }
}
export type GraphNode = NodeObject<IdeaNode>;
interface AnimusSceneProps {
    data: {
        nodes: IdeaNode[];
        links: IdeaEdge[];
    };
    onNodeClick?: (node: GraphNode, event: ReactMouseEvent<Element, MouseEvent>) => void;
    onNodeHoverProp?: (nodeId: string | null) => void;
    mouseSelectedNodeId_prop?: string | null;
    searchResultOutlineIds_prop?: string[];
    currentInteractionMode_prop?: 'mouse' | 'gesture';
    gesturedNodeId_prop?: string | null;
    rootId?: string | string[];
    onBackgroundClickRequest?: () => void;
    imageUrlMap?: Map<string, string>;
}
declare const AnimusScene: React.FC<AnimusSceneProps>;
export default AnimusScene;
