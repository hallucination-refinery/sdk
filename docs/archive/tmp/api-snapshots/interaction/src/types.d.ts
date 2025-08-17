import { IdeaNode, IdeaEdge } from '@refinery/ideanode';
import { GraphMethods } from 'r3f-forcegraph';
export interface InteractionState {
    masterGraphData: {
        nodes: IdeaNode[];
        links: IdeaEdge[];
    };
    mouseSelectedNodeId: string | null;
    highlightedNodeIds: string[];
    linkMode: {
        isActive: boolean;
        sourceNodeId: string | null;
    };
    mouseHoveredNodeId: string | null;
    gestureHoveredNodeId: string | null;
    currentInteractionMode: 'mouse' | 'gesture';
    gesturedNodeId: string | null;
    searchQuery: string | null;
    searchPending: boolean;
    searchError: string | null;
    searchResultNodeIds: string[];
    isGestureCursorVisible: boolean;
    gestureCursorOpacity: number;
    focusNodeId: string | null;
    forceGraphRef: React.MutableRefObject<GraphMethods<IdeaNode, IdeaEdge> | null> | null;
    contextualNodeId: string | null;
    dialState: {
        interwingleMode: 0 | 1 | 2;
        searchDepth: 1 | 2 | 3;
    };
    activeLens: 'causal' | 'affinity' | 'temporal';
    timelineDate: string;
    timeIndex: number;
}
export type InteractionAction = {
    type: 'MOUSE_SELECT_NODE';
    payload: {
        nodeId: string | null;
    };
} | {
    type: 'COLLAPSE_NODE';
    payload: {
        nodeId: string;
    };
} | {
    type: 'DECOMPOSE_NODE';
    payload: {
        nodeId: string;
    };
} | {
    type: 'FOCUS_NODE';
    payload: {
        nodeId: string | null;
    };
} | {
    type: 'LINK_BEGIN';
    payload: {
        nodeId: string;
    };
} | {
    type: 'LINK_END';
    payload: {
        targetNodeId: string;
    };
} | {
    type: 'SEARCH_INITIATE';
    payload: {
        query: string;
    };
} | {
    type: 'SEARCH_PENDING';
    payload: {
        query: string;
    };
} | {
    type: 'SEARCH_RESULTS';
    payload: {
        query: string;
        results: string[];
    };
} | {
    type: 'SEARCH_ERROR';
    payload: {
        query?: string;
        error: string;
    };
} | {
    type: 'SEARCH_CLEAR';
} | {
    type: 'SET_MASTER_GRAPH_DATA';
    payload: {
        nodes: IdeaNode[];
        links: IdeaEdge[];
    };
} | {
    type: 'SET_MOUSE_HOVERED_NODE';
    payload: {
        nodeId: string | null;
    };
} | {
    type: 'SET_GESTURE_HOVERED_NODE';
    payload: {
        nodeId: string | null;
    };
} | {
    type: 'SET_INTERACTION_MODE';
    payload: {
        mode: 'mouse' | 'gesture';
    };
} | {
    type: 'SET_GESTURED_NODE';
    payload: {
        nodeId: string | null;
    };
} | {
    type: 'GESTURE_SELECT_NODE';
    payload: {
        nodeId: string | null;
    };
} | {
    type: 'SET_GESTURE_CURSOR_VISIBILITY';
    payload: {
        isVisible: boolean;
    };
} | {
    type: 'SET_GESTURE_CURSOR_OPACITY';
    payload: {
        opacity: number;
    };
} | {
    type: 'SET_FORCE_GRAPH_REF';
    payload: {
        ref: React.MutableRefObject<GraphMethods<IdeaNode, IdeaEdge> | null> | null;
    };
} | {
    type: 'SET_DIAL_STATE';
    payload: {
        interwingleMode: 0 | 1 | 2;
        searchDepth: 1 | 2 | 3;
    };
} | {
    type: 'SET_ACTIVE_LENS';
    payload: {
        lens: 'causal' | 'affinity' | 'temporal';
    };
} | {
    type: 'SET_TIME_INDEX';
    payload: {
        index: number;
    };
} | {
    type: 'SET_TIMELINE_DATE';
    payload: {
        date: string;
    };
};
//# sourceMappingURL=types.d.ts.map