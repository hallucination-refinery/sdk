/**
 * Clarify GPT stub.
 *
 * Input: array of artifact text strings, e.g. from OCR or other extraction.
 * Output: object containing a refined prompt and user preference hints.
 *
 * Example:
 *   const result = await runClarify(['hello', 'world']);
 *   // result.refinedPrompt => 'hello world'
 */
export interface UserPreferences {
    tone?: string;
    [key: string]: unknown;
}
export interface ClarifyResult {
    refinedPrompt: string;
    userPrefs: UserPreferences;
}
/**
 * TODO: connect to GPT or other LLM service to refine the prompt
 * and derive user preferences.
 */
export declare function runClarify(artifactsText: string[]): Promise<ClarifyResult>;
//# sourceMappingURL=runClarify.d.ts.map