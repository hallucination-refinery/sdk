import 'dotenv/config';
/**
 * Encodes a single string or an array of strings into embedding vectors using the OpenAI API.
 * This function batches requests for arrays of strings for efficiency.
 * @param text The text or array of texts to encode.
 * @returns A promise that resolves to an array of embedding vectors (number[][]).
 */
export declare function encode(text: string | string[]): Promise<number[][]>;
/**
 * Calculates the cosine similarity between two vectors.
 * Assumes vectors are of the same length.
 * @param vecA The first vector.
 * @param vecB The second vector.
 * @returns The cosine similarity, a value between -1 and 1.
 */
export declare function cosineSimilarity(vecA: number[], vecB: number[]): number;
//# sourceMappingURL=index.d.ts.map