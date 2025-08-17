export interface Graph {
    nodes: {
        id: string;
        state?: {
            isHidden?: boolean;
        };
    }[];
    links: {
        source: string;
        target: string;
    }[];
}
/**
 * Breadth-first search returning visible node IDs up to specified depth.
 * Pure function, O(V + E).
 * Nodes flagged `state.isHidden` are ignored in traversal.
 */
export declare function bfsSearch(graph: Graph, seeds: string[], depth: number): Set<string>;
//# sourceMappingURL=search.d.ts.map