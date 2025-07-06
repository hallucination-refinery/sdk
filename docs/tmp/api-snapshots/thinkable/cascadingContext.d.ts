import type { IdeaNode } from '@refinery/ideanode';
export interface IdeaEdge {
    id: string;
    source: string;
    target: string;
    tier: number;
    confidence?: number;
}
export declare function getEdgeProps(edge: IdeaEdge, currentMode: 0 | 1 | 2 | 3): {
    opacity: number;
    width: number;
};
export declare function getNodeProps(node: IdeaNode): {
    scale: number;
    classes: string[];
};
export declare function memoEdgeProps(edge: IdeaEdge, mode: 0 | 1 | 2 | 3): {
    opacity: number;
    width: number;
};
//# sourceMappingURL=cascadingContext.d.ts.map