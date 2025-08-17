/**
 * Simple ingestion pipeline returning graph nodes and links for front-end.
 *
 * Example:
 *   const { nodes, links } = await ingestFlow([fileOrText]);
 */
import { IdeaNode, IdeaEdge } from '@refinery/ideanode';
export interface Artifact {
    text: string;
}
export declare function ingestFlow(input: (File | string)[]): Promise<{
    nodes: IdeaNode[];
    links: IdeaEdge[];
}>;
//# sourceMappingURL=ingestFlow.d.ts.map