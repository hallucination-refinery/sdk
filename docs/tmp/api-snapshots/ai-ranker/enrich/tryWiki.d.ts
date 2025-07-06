import type { ConceptNode } from '../concept/jsonSchema';
export interface ImageHit {
    url: string;
    credit: string;
}
/**
 * Try to fetch an image from Wikipedia using the concept label as the page title.
 * Returns null if no suitable thumbnail (>=200px) is found.
 */
export declare function tryWiki(concept: ConceptNode): Promise<ImageHit | null>;
//# sourceMappingURL=tryWiki.d.ts.map