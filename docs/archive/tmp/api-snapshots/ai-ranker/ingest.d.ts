import { IdeaNode } from '@refinery/ideanode';
export interface YourLinkType {
    source: string;
    target: string;
}
export declare function ingest(file: File): Promise<{
    nodes: IdeaNode[];
    links: YourLinkType[];
}>;
//# sourceMappingURL=ingest.d.ts.map