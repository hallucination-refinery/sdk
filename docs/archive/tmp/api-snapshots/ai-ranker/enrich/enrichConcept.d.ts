import type { ConceptNode } from '../concept/jsonSchema';
import type { ImageHit } from './tryWiki';
export type EnrichedConcept = ConceptNode & {
    image?: ImageHit;
};
/**
 * Attempt to attach an image to the concept using Wikipedia first,
 * falling back to Unsplash.
 */
export declare function enrichConcept(concept: ConceptNode): Promise<EnrichedConcept>;
//# sourceMappingURL=enrichConcept.d.ts.map