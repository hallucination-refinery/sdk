/**
 * Derive synthetic connections between trails according to interwingle mode.
 *
 * This function generates synthetic edges based on structural similarities between
 * different trails. The overall complexity is generally O(N), where N is the total
 * number of symbols, but can approach O(T^2 * L) in worst-case scenarios for
 * certain modes if many trails are structurally identical. In typical sparse usage,
 * performance is much closer to linear.
 */
export interface TrailSymbol {
    /** unique id of this symbol */
    id: string;
    /** GPS/hash allowing comparison across trails */
    gps: string;
}
export type Trail = TrailSymbol[];
export interface Edge {
    source: string;
    target: string;
    synthetic?: boolean;
    tier?: number;
}
/**
 * Create synthetic edges between trails depending on the selected mode.
 * The function is pure and does not mutate its inputs.
 */
export declare function deriveInterwingle(mode: 0 | 1 | 2 | 3, trails: Trail[], edges: Edge[]): Edge[];
//# sourceMappingURL=deriveInterwingle.d.ts.map