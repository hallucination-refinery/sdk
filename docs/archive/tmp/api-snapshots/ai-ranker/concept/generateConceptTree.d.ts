import { ConceptNode } from './jsonSchema';
/**
 * Generate a personalized concept tree using GPT-4o function calling
 *
 * @param refinedPrompt - The clarified user intent from the clarify dialogue
 * @returns Promise<ConceptNode[]> - Array with root + exactly 6 children
 */
export declare function generateConceptTree(refinedPrompt: string): Promise<ConceptNode[]>;
//# sourceMappingURL=generateConceptTree.d.ts.map