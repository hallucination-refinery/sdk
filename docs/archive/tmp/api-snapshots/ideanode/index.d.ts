export interface IdeaNode {
    id: string;
    type: 'pureThought' | 'liveMedia' | 'longDocument' | 'collapsedCluster' | 'annotation' | 'summary' | 'placeholder' | 'image' | 'text';
    label: string;
    payloadRef?: string | object;
    links: string[];
    meta: {
        source: 'userUpload' | 'llmGenerated' | 'externalCrawl' | 'system';
        created: number;
        relevanceScore?: number;
        originalType?: IdeaNode['type'];
        [key: string]: unknown;
    };
    history?: unknown[];
    state: {
        isCollapsed?: boolean;
        isSelected?: boolean;
        isHidden?: boolean;
        isLinkingStart?: boolean;
        currentLOD?: 'Far' | 'Mid' | 'Close' | 'Selected';
        [key: string]: unknown;
    };
    x?: number;
    y?: number;
    z?: number;
    vx?: number;
    vy?: number;
    vz?: number;
    group?: string;
    thumbURL?: string;
    tier?: number;
    aspectRatio?: '1:1' | '16:9' | '2:3' | '4:3' | '21:9';
    kind?: 'reference' | 'concept' | 'prospect';
    form?: 'title' | 'quote';
}
export interface IdeaEdge {
    source: string;
    target: string;
    tier: 0 | 1 | 2 | 3;
    synthetic?: boolean;
    confidence?: number;
    classes?: string[];
}
export declare const originalPlaceholderNodes: IdeaNode[];
export declare const originalPlaceholderLinks: IdeaEdge[];
export declare function generateStressTestData(nodeCount?: number): {
    nodes: IdeaNode[];
    links: IdeaEdge[];
};
export declare const stressTestData: {
    nodes: IdeaNode[];
    links: IdeaEdge[];
};
export declare const placeholderInitialNodes: IdeaNode[];
export declare const placeholderInitialLinks: IdeaEdge[];
export declare const PERFORMANCE_THRESHOLDS: {
    readonly OPTIMAL_NODE_COUNT: 25;
    readonly WARNING_NODE_COUNT: 75;
    readonly CRITICAL_NODE_COUNT: 150;
};
export declare function checkNodeCountPerformance(nodeCount: number): {
    level: 'optimal' | 'warning' | 'critical';
    message: string;
};
export declare const ideanodeVersion = "0.0.1";
//# sourceMappingURL=index.d.ts.map