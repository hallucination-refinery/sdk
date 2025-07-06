import { z } from 'zod';
/**
 * Schema for selection state
 * Tracks which nodes and edges are currently selected
 */
export declare const SelectionSchema: z.ZodObject<{
    /**
     * Set of selected node IDs
     */
    nodeIds: z.ZodSet<z.ZodString>;
    /**
     * Set of selected edge IDs
     */
    edgeIds: z.ZodSet<z.ZodString>;
    /**
     * Primary/active selection (for operations that need a single target)
     */
    primaryNodeId: z.ZodOptional<z.ZodString>;
    /**
     * Timestamp when selection was last modified
     */
    lastModified: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    nodeIds: Set<string>;
    edgeIds: Set<string>;
    primaryNodeId?: string | undefined;
    lastModified?: string | undefined;
}, {
    nodeIds: Set<string>;
    edgeIds: Set<string>;
    primaryNodeId?: string | undefined;
    lastModified?: string | undefined;
}>;
/**
 * TypeScript type for selection state
 */
export type Selection = z.infer<typeof SelectionSchema>;
/**
 * Schema for selection operations
 */
export declare const SelectionOperationSchema: z.ZodEnum<["set", "add", "remove", "toggle", "clear"]>;
export type SelectionOperation = z.infer<typeof SelectionOperationSchema>;
/**
 * Schema for selection change event
 */
export declare const SelectionChangeEventSchema: z.ZodObject<{
    operation: z.ZodEnum<["set", "add", "remove", "toggle", "clear"]>;
    nodeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    edgeIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    previousSelection: z.ZodObject<{
        /**
         * Set of selected node IDs
         */
        nodeIds: z.ZodSet<z.ZodString>;
        /**
         * Set of selected edge IDs
         */
        edgeIds: z.ZodSet<z.ZodString>;
        /**
         * Primary/active selection (for operations that need a single target)
         */
        primaryNodeId: z.ZodOptional<z.ZodString>;
        /**
         * Timestamp when selection was last modified
         */
        lastModified: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    }, {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    }>;
    newSelection: z.ZodObject<{
        /**
         * Set of selected node IDs
         */
        nodeIds: z.ZodSet<z.ZodString>;
        /**
         * Set of selected edge IDs
         */
        edgeIds: z.ZodSet<z.ZodString>;
        /**
         * Primary/active selection (for operations that need a single target)
         */
        primaryNodeId: z.ZodOptional<z.ZodString>;
        /**
         * Timestamp when selection was last modified
         */
        lastModified: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    }, {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    operation: "set" | "add" | "remove" | "toggle" | "clear";
    previousSelection: {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    };
    newSelection: {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    };
    nodeIds?: string[] | undefined;
    edgeIds?: string[] | undefined;
}, {
    operation: "set" | "add" | "remove" | "toggle" | "clear";
    previousSelection: {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    };
    newSelection: {
        nodeIds: Set<string>;
        edgeIds: Set<string>;
        primaryNodeId?: string | undefined;
        lastModified?: string | undefined;
    };
    nodeIds?: string[] | undefined;
    edgeIds?: string[] | undefined;
}>;
export type SelectionChangeEvent = z.infer<typeof SelectionChangeEventSchema>;
/**
 * Utility functions for selection operations
 */
export declare class SelectionUtils {
    /**
     * Create an empty selection
     */
    static empty(): Selection;
    /**
     * Check if selection is empty
     */
    static isEmpty(selection: Selection): boolean;
    /**
     * Check if a node is selected
     */
    static isNodeSelected(selection: Selection, nodeId: string): boolean;
    /**
     * Check if an edge is selected
     */
    static isEdgeSelected(selection: Selection, edgeId: string): boolean;
    /**
     * Select nodes (replace current selection)
     */
    static selectNodes(nodeIds: string[]): Selection;
    /**
     * Select edges (replace current selection)
     */
    static selectEdges(edgeIds: string[]): Selection;
    /**
     * Add nodes to selection
     */
    static addNodes(selection: Selection, nodeIds: string[]): Selection;
    /**
     * Add edges to selection
     */
    static addEdges(selection: Selection, edgeIds: string[]): Selection;
    /**
     * Remove nodes from selection
     */
    static removeNodes(selection: Selection, nodeIds: string[]): Selection;
    /**
     * Remove edges from selection
     */
    static removeEdges(selection: Selection, edgeIds: string[]): Selection;
    /**
     * Toggle node selection
     */
    static toggleNodes(selection: Selection, nodeIds: string[]): Selection;
    /**
     * Toggle edge selection
     */
    static toggleEdges(selection: Selection, edgeIds: string[]): Selection;
    /**
     * Clear all selections
     */
    static clear(): Selection;
    /**
     * Get selection counts
     */
    static getCounts(selection: Selection): {
        nodes: number;
        edges: number;
    };
}
//# sourceMappingURL=selection.d.ts.map