import { z } from 'zod';
/**
 * Base schema for Edge metadata
 * Allows for arbitrary key-value pairs while maintaining type safety
 */
export declare const EdgeMetadataSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
/**
 * Schema for edge types/relationships
 */
export declare const EdgeTypeSchema: z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>;
/**
 * Schema for edge strength/weight
 */
export declare const EdgeStrengthSchema: z.ZodDefault<z.ZodNumber>;
/**
 * Schema for the core Edge type
 * Represents a connection between two nodes in the idea graph
 */
export declare const EdgeSchema: z.ZodObject<{
    /**
     * Unique identifier for the edge
     */
    id: z.ZodString;
    /**
     * Source node ID
     */
    source: z.ZodString;
    /**
     * Target node ID
     */
    target: z.ZodString;
    /**
     * Type of relationship
     */
    type: z.ZodDefault<z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>>;
    /**
     * Optional label for the edge
     */
    label: z.ZodOptional<z.ZodString>;
    /**
     * Strength/weight of the connection (0-1)
     */
    strength: z.ZodDefault<z.ZodNumber>;
    /**
     * Whether the edge is directed (has a specific direction)
     */
    directed: z.ZodDefault<z.ZodBoolean>;
    /**
     * Edge color (hex or CSS color string)
     */
    color: z.ZodOptional<z.ZodString>;
    /**
     * Edge line width
     */
    width: z.ZodOptional<z.ZodNumber>;
    /**
     * Whether the edge is currently selected
     */
    selected: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the edge is currently hovered
     */
    hovered: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the edge should be visible
     */
    visible: z.ZodDefault<z.ZodBoolean>;
    /**
     * Open metadata field for extensibility
     */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    /**
     * Timestamp when the edge was created
     */
    createdAt: z.ZodOptional<z.ZodString>;
    /**
     * Timestamp when the edge was last updated
     */
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "relates-to" | "depends-on" | "contains" | "references" | "conflicts-with" | "supports" | "opposes" | "derived-from" | "implements" | "extends" | "custom";
    id: string;
    source: string;
    target: string;
    strength: number;
    directed: boolean;
    visible: boolean;
    label?: string | undefined;
    color?: string | undefined;
    selected?: boolean | undefined;
    hovered?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    width?: number | undefined;
}, {
    id: string;
    source: string;
    target: string;
    type?: "relates-to" | "depends-on" | "contains" | "references" | "conflicts-with" | "supports" | "opposes" | "derived-from" | "implements" | "extends" | "custom" | undefined;
    label?: string | undefined;
    color?: string | undefined;
    selected?: boolean | undefined;
    hovered?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    strength?: number | undefined;
    directed?: boolean | undefined;
    width?: number | undefined;
    visible?: boolean | undefined;
}>;
/**
 * TypeScript type generated from the Zod schema
 */
export type Edge = z.infer<typeof EdgeSchema>;
/**
 * TypeScript type for edge types
 */
export type EdgeType = z.infer<typeof EdgeTypeSchema>;
/**
 * Schema for partial Edge updates
 */
export declare const PartialEdgeSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    target: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodDefault<z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>>>;
    label: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    strength: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    directed: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    width: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    selected: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    hovered: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type?: "relates-to" | "depends-on" | "contains" | "references" | "conflicts-with" | "supports" | "opposes" | "derived-from" | "implements" | "extends" | "custom" | undefined;
    id?: string | undefined;
    label?: string | undefined;
    color?: string | undefined;
    selected?: boolean | undefined;
    hovered?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    source?: string | undefined;
    target?: string | undefined;
    strength?: number | undefined;
    directed?: boolean | undefined;
    width?: number | undefined;
    visible?: boolean | undefined;
}, {
    type?: "relates-to" | "depends-on" | "contains" | "references" | "conflicts-with" | "supports" | "opposes" | "derived-from" | "implements" | "extends" | "custom" | undefined;
    id?: string | undefined;
    label?: string | undefined;
    color?: string | undefined;
    selected?: boolean | undefined;
    hovered?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    source?: string | undefined;
    target?: string | undefined;
    strength?: number | undefined;
    directed?: boolean | undefined;
    width?: number | undefined;
    visible?: boolean | undefined;
}>;
/**
 * Type for partial Edge updates
 */
export type PartialEdge = z.infer<typeof PartialEdgeSchema>;
/**
 * Type for Edge creation (requires only essential fields)
 */
export declare const CreateEdgeSchema: z.ZodObject<Pick<{
    /**
     * Unique identifier for the edge
     */
    id: z.ZodString;
    /**
     * Source node ID
     */
    source: z.ZodString;
    /**
     * Target node ID
     */
    target: z.ZodString;
    /**
     * Type of relationship
     */
    type: z.ZodDefault<z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>>;
    /**
     * Optional label for the edge
     */
    label: z.ZodOptional<z.ZodString>;
    /**
     * Strength/weight of the connection (0-1)
     */
    strength: z.ZodDefault<z.ZodNumber>;
    /**
     * Whether the edge is directed (has a specific direction)
     */
    directed: z.ZodDefault<z.ZodBoolean>;
    /**
     * Edge color (hex or CSS color string)
     */
    color: z.ZodOptional<z.ZodString>;
    /**
     * Edge line width
     */
    width: z.ZodOptional<z.ZodNumber>;
    /**
     * Whether the edge is currently selected
     */
    selected: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the edge is currently hovered
     */
    hovered: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the edge should be visible
     */
    visible: z.ZodDefault<z.ZodBoolean>;
    /**
     * Open metadata field for extensibility
     */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    /**
     * Timestamp when the edge was created
     */
    createdAt: z.ZodOptional<z.ZodString>;
    /**
     * Timestamp when the edge was last updated
     */
    updatedAt: z.ZodOptional<z.ZodString>;
}, "id" | "source" | "target"> & {
    type: z.ZodOptional<z.ZodDefault<z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>>>;
    label: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    selected: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    hovered: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    strength: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    directed: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    width: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    visible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    source: string;
    target: string;
    type?: "relates-to" | "depends-on" | "contains" | "references" | "conflicts-with" | "supports" | "opposes" | "derived-from" | "implements" | "extends" | "custom" | undefined;
    label?: string | undefined;
    color?: string | undefined;
    selected?: boolean | undefined;
    hovered?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    strength?: number | undefined;
    directed?: boolean | undefined;
    width?: number | undefined;
    visible?: boolean | undefined;
}, {
    id: string;
    source: string;
    target: string;
    type?: "relates-to" | "depends-on" | "contains" | "references" | "conflicts-with" | "supports" | "opposes" | "derived-from" | "implements" | "extends" | "custom" | undefined;
    label?: string | undefined;
    color?: string | undefined;
    selected?: boolean | undefined;
    hovered?: boolean | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    strength?: number | undefined;
    directed?: boolean | undefined;
    width?: number | undefined;
    visible?: boolean | undefined;
}>;
export type CreateEdge = z.infer<typeof CreateEdgeSchema>;
/**
 * Type guard to check if an object is an Edge
 */
export declare function isEdge(obj: unknown): obj is Edge;
/**
 * Validate and parse an Edge
 */
export declare function parseEdge(obj: unknown): Edge;
/**
 * Safely parse an Edge, returning undefined on failure
 */
export declare function safeParseEdge(obj: unknown): Edge | undefined;
/**
 * Check if an edge connects two specific nodes (in either direction)
 */
export declare function edgeConnects(edge: Edge, nodeId1: string, nodeId2: string): boolean;
/**
 * Get the other node ID from an edge given one node ID
 */
export declare function getOtherNode(edge: Edge, nodeId: string): string | undefined;
//# sourceMappingURL=edge.d.ts.map