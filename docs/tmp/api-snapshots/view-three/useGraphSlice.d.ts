import { IdeaNode } from '@refinery/ideanode';
import { IdeaEdge } from '@refinery/thinkable';
interface ManagedNode extends IdeaNode {
    childLinks?: IdeaEdge[];
    parentId?: string;
    state: {
        isCollapsed: boolean;
        isHidden: boolean;
        isSelected?: boolean;
        isLinkingStart?: boolean;
        currentLOD?: 'Far' | 'Mid' | 'Close' | 'Selected' | undefined;
    };
}
interface GraphSliceParams {
    masterGraphData: {
        nodes: ManagedNode[];
        links: IdeaEdge[];
    };
    interwingleMode: 0 | 1 | 2 | 3;
    searchDepth: number;
    rootIds: string[];
    activeLens?: 'causal' | 'affinity' | 'temporal';
    timelineDate?: string;
}
interface GraphSliceResult {
    derivedEdges: IdeaEdge[];
    visibleIDs: Set<string>;
    filteredGraphData: {
        nodes: ManagedNode[];
        links: IdeaEdge[];
    };
    nodesById: {
        [id: string]: ManagedNode;
    };
}
export declare function useGraphSlice({ masterGraphData, interwingleMode, searchDepth, rootIds, activeLens, timelineDate, }: GraphSliceParams): GraphSliceResult;
export {};
