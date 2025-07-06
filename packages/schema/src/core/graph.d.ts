import { z } from 'zod';
import { type IdeaNode } from './idea-node';
import { type Edge } from './edge';
/**
 * Schema for graph metadata
 */
export declare const GraphMetadataSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
/**
 * Schema for the complete graph structure
 * Represents a collection of nodes and edges
 */
export declare const GraphSchema: z.ZodObject<{
    /**
     * Unique identifier for the graph
     */
    id: z.ZodOptional<z.ZodString>;
    /**
     * Name/title of the graph
     */
    name: z.ZodOptional<z.ZodString>;
    /**
     * Description of the graph
     */
    description: z.ZodOptional<z.ZodString>;
    /**
     * Array of nodes in the graph
     */
    nodes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
        velocity: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
        color: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
        hovered: z.ZodOptional<z.ZodBoolean>;
        fixed: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }, {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }>, "many">;
    /**
     * Array of edges connecting nodes
     */
    edges: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        target: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>>;
        label: z.ZodOptional<z.ZodString>;
        strength: z.ZodDefault<z.ZodNumber>;
        directed: z.ZodDefault<z.ZodBoolean>;
        color: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
        hovered: z.ZodOptional<z.ZodBoolean>;
        visible: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodString>;
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
    }>, "many">;
    /**
     * Open metadata field for extensibility
     */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    /**
     * Timestamp when the graph was created
     */
    createdAt: z.ZodOptional<z.ZodString>;
    /**
     * Timestamp when the graph was last updated
     */
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    nodes: {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }[];
    edges: {
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
    }[];
    id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
}, {
    nodes: {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }[];
    edges: {
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
    }[];
    id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
}>;
/**
 * TypeScript type for the graph structure
 */
export type Graph = z.infer<typeof GraphSchema>;
/**
 * Schema for partial Graph updates
 */
export declare const PartialGraphSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    nodes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        content: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
        velocity: z.ZodOptional<z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            z: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            z: number;
        }, {
            x: number;
            y: number;
            z: number;
        }>>;
        color: z.ZodOptional<z.ZodString>;
        size: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
        hovered: z.ZodOptional<z.ZodBoolean>;
        fixed: z.ZodOptional<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodString>;
        updatedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }, {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }>, "many">>;
    edges: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        source: z.ZodString;
        target: z.ZodString;
        type: z.ZodDefault<z.ZodEnum<["relates-to", "depends-on", "contains", "references", "conflicts-with", "supports", "opposes", "derived-from", "implements", "extends", "custom"]>>;
        label: z.ZodOptional<z.ZodString>;
        strength: z.ZodDefault<z.ZodNumber>;
        directed: z.ZodDefault<z.ZodBoolean>;
        color: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        selected: z.ZodOptional<z.ZodBoolean>;
        hovered: z.ZodOptional<z.ZodBoolean>;
        visible: z.ZodDefault<z.ZodBoolean>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        createdAt: z.ZodOptional<z.ZodString>;
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
    }>, "many">>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    nodes?: {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }[] | undefined;
    edges?: {
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
    }[] | undefined;
}, {
    id?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    name?: string | undefined;
    description?: string | undefined;
    nodes?: {
        id: string;
        label: string;
        content?: string | undefined;
        position?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        velocity?: {
            x: number;
            y: number;
            z: number;
        } | undefined;
        color?: string | undefined;
        size?: number | undefined;
        selected?: boolean | undefined;
        hovered?: boolean | undefined;
        fixed?: boolean | undefined;
        metadata?: Record<string, unknown> | undefined;
        createdAt?: string | undefined;
        updatedAt?: string | undefined;
    }[] | undefined;
    edges?: {
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
    }[] | undefined;
}>;
/**
 * Type for partial Graph updates
 */
export type PartialGraph = z.infer<typeof PartialGraphSchema>;
/**
 * Schema for graph statistics
 */
export declare const GraphStatsSchema: z.ZodObject<{
    nodeCount: z.ZodNumber;
    edgeCount: z.ZodNumber;
    connectedComponents: z.ZodNumber;
    density: z.ZodNumber;
    averageDegree: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    nodeCount: number;
    edgeCount: number;
    connectedComponents: number;
    density: number;
    averageDegree: number;
}, {
    nodeCount: number;
    edgeCount: number;
    connectedComponents: number;
    density: number;
    averageDegree: number;
}>;
export type GraphStats = z.infer<typeof GraphStatsSchema>;
/**
 * Schema for node neighbors
 */
export declare const NodeNeighborsSchema: z.ZodObject<{
    nodeId: z.ZodString;
    incoming: z.ZodArray<z.ZodString, "many">;
    outgoing: z.ZodArray<z.ZodString, "many">;
    undirected: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    nodeId: string;
    incoming: string[];
    outgoing: string[];
    undirected: string[];
}, {
    nodeId: string;
    incoming: string[];
    outgoing: string[];
    undirected: string[];
}>;
export type NodeNeighbors = z.infer<typeof NodeNeighborsSchema>;
/**
 * Utility class for graph operations
 */
export declare class GraphUtils {
    /**
     * Create an empty graph
     */
    static empty(): Graph;
    /**
     * Get a node by ID
     */
    static getNode(graph: Graph, nodeId: string): IdeaNode | undefined;
    /**
     * Get an edge by ID
     */
    static getEdge(graph: Graph, edgeId: string): Edge | undefined;
    /**
     * Get all edges connected to a node
     */
    static getNodeEdges(graph: Graph, nodeId: string): Edge[];
    /**
     * Get neighbor node IDs for a given node
     */
    static getNodeNeighbors(graph: Graph, nodeId: string): NodeNeighbors;
    /**
     * Calculate basic graph statistics
     */
    static getStats(graph: Graph): GraphStats;
    /**
     * Add a node to the graph (returns new graph)
     */
    static addNode(graph: Graph, node: IdeaNode): Graph;
    /**
     * Add an edge to the graph (returns new graph)
     */
    static addEdge(graph: Graph, edge: Edge): Graph;
    /**
     * Remove a node and all connected edges (returns new graph)
     */
    static removeNode(graph: Graph, nodeId: string): Graph;
    /**
     * Remove an edge (returns new graph)
     */
    static removeEdge(graph: Graph, edgeId: string): Graph;
    /**
     * Update a node (returns new graph)
     */
    static updateNode(graph: Graph, nodeId: string, updates: Partial<IdeaNode>): Graph;
    /**
     * Update an edge (returns new graph)
     */
    static updateEdge(graph: Graph, edgeId: string, updates: Partial<Edge>): Graph;
    /**
     * Validate that all edges reference existing nodes
     */
    static validateReferences(graph: Graph): boolean;
    /**
     * Get orphaned nodes (nodes with no edges)
     */
    static getOrphanedNodes(graph: Graph): IdeaNode[];
}
//# sourceMappingURL=graph.d.ts.map