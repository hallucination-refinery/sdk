import { IdeaNode, IdeaEdge } from '@refinery/ideanode';
export interface Concept {
    id: string;
    label: string;
    summary: string;
    searchTerms: string[];
    parentId?: string;
}
export interface NodeLinkResult {
    nodes: IdeaNode[];
    links: IdeaEdge[];
}
export declare function jsonToNodesLinks(concepts: Concept[]): NodeLinkResult;
//# sourceMappingURL=jsonToNodesLinks.d.ts.map