import { IdeaNode } from '@refinery/ideanode';
/**
 * Automatically classify a node's form (title/quote) and aspect ratio
 * based on node type and content
 */
export declare function classifyNode(node: Partial<IdeaNode>): {
    form: 'title' | 'quote';
    aspectRatio: '1:1' | '16:9' | '2:3' | '4:3' | '21:9';
};
