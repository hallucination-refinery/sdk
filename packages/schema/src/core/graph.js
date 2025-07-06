import { z } from 'zod';
import { IdeaNodeSchema } from './idea-node';
import { EdgeSchema } from './edge';
/**
 * Schema for graph metadata
 */
export const GraphMetadataSchema = z.record(z.string(), z.unknown());
/**
 * Schema for the complete graph structure
 * Represents a collection of nodes and edges
 */
export const GraphSchema = z.object({
    /**
     * Unique identifier for the graph
     */
    id: z.string().optional(),
    /**
     * Name/title of the graph
     */
    name: z.string().optional(),
    /**
     * Description of the graph
     */
    description: z.string().optional(),
    /**
     * Array of nodes in the graph
     */
    nodes: z.array(IdeaNodeSchema),
    /**
     * Array of edges connecting nodes
     */
    edges: z.array(EdgeSchema),
    /**
     * Open metadata field for extensibility
     */
    metadata: GraphMetadataSchema.optional(),
    /**
     * Timestamp when the graph was created
     */
    createdAt: z.string().datetime().optional(),
    /**
     * Timestamp when the graph was last updated
     */
    updatedAt: z.string().datetime().optional(),
});
/**
 * Schema for partial Graph updates
 */
export const PartialGraphSchema = GraphSchema.partial();
/**
 * Schema for graph statistics
 */
export const GraphStatsSchema = z.object({
    nodeCount: z.number().int().nonnegative(),
    edgeCount: z.number().int().nonnegative(),
    connectedComponents: z.number().int().nonnegative(),
    density: z.number().min(0).max(1),
    averageDegree: z.number().nonnegative(),
});
/**
 * Schema for node neighbors
 */
export const NodeNeighborsSchema = z.object({
    nodeId: z.string(),
    incoming: z.array(z.string()),
    outgoing: z.array(z.string()),
    undirected: z.array(z.string()),
});
/**
 * Utility class for graph operations
 */
export class GraphUtils {
    /**
     * Create an empty graph
     */
    static empty() {
        return {
            nodes: [],
            edges: [],
        };
    }
    /**
     * Get a node by ID
     */
    static getNode(graph, nodeId) {
        return graph.nodes.find(node => node.id === nodeId);
    }
    /**
     * Get an edge by ID
     */
    static getEdge(graph, edgeId) {
        return graph.edges.find(edge => edge.id === edgeId);
    }
    /**
     * Get all edges connected to a node
     */
    static getNodeEdges(graph, nodeId) {
        return graph.edges.filter(edge => edge.source === nodeId || edge.target === nodeId);
    }
    /**
     * Get neighbor node IDs for a given node
     */
    static getNodeNeighbors(graph, nodeId) {
        const incoming = [];
        const outgoing = [];
        const undirected = [];
        for (const edge of graph.edges) {
            if (edge.directed) {
                if (edge.target === nodeId) {
                    incoming.push(edge.source);
                }
                else if (edge.source === nodeId) {
                    outgoing.push(edge.target);
                }
            }
            else {
                if (edge.source === nodeId) {
                    undirected.push(edge.target);
                }
                else if (edge.target === nodeId) {
                    undirected.push(edge.source);
                }
            }
        }
        return { nodeId, incoming, outgoing, undirected };
    }
    /**
     * Calculate basic graph statistics
     */
    static getStats(graph) {
        const nodeCount = graph.nodes.length;
        const edgeCount = graph.edges.length;
        // Calculate density (for undirected graph)
        const maxPossibleEdges = (nodeCount * (nodeCount - 1)) / 2;
        const density = nodeCount > 1 ? edgeCount / maxPossibleEdges : 0;
        // Calculate average degree
        const degrees = new Map();
        for (const edge of graph.edges) {
            degrees.set(edge.source, (degrees.get(edge.source) || 0) + 1);
            degrees.set(edge.target, (degrees.get(edge.target) || 0) + 1);
        }
        const totalDegree = Array.from(degrees.values()).reduce((sum, deg) => sum + deg, 0);
        const averageDegree = nodeCount > 0 ? totalDegree / nodeCount : 0;
        // Connected components calculation would require graph traversal
        // For now, return 1 as a placeholder (assume connected)
        const connectedComponents = nodeCount > 0 ? 1 : 0;
        return {
            nodeCount,
            edgeCount,
            connectedComponents,
            density,
            averageDegree,
        };
    }
    /**
     * Add a node to the graph (returns new graph)
     */
    static addNode(graph, node) {
        return {
            ...graph,
            nodes: [...graph.nodes, node],
            updatedAt: new Date().toISOString(),
        };
    }
    /**
     * Add an edge to the graph (returns new graph)
     */
    static addEdge(graph, edge) {
        return {
            ...graph,
            edges: [...graph.edges, edge],
            updatedAt: new Date().toISOString(),
        };
    }
    /**
     * Remove a node and all connected edges (returns new graph)
     */
    static removeNode(graph, nodeId) {
        return {
            ...graph,
            nodes: graph.nodes.filter(node => node.id !== nodeId),
            edges: graph.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
            updatedAt: new Date().toISOString(),
        };
    }
    /**
     * Remove an edge (returns new graph)
     */
    static removeEdge(graph, edgeId) {
        return {
            ...graph,
            edges: graph.edges.filter(edge => edge.id !== edgeId),
            updatedAt: new Date().toISOString(),
        };
    }
    /**
     * Update a node (returns new graph)
     */
    static updateNode(graph, nodeId, updates) {
        return {
            ...graph,
            nodes: graph.nodes.map(node => node.id === nodeId
                ? { ...node, ...updates, id: nodeId, updatedAt: new Date().toISOString() }
                : node),
            updatedAt: new Date().toISOString(),
        };
    }
    /**
     * Update an edge (returns new graph)
     */
    static updateEdge(graph, edgeId, updates) {
        return {
            ...graph,
            edges: graph.edges.map(edge => edge.id === edgeId
                ? { ...edge, ...updates, id: edgeId, updatedAt: new Date().toISOString() }
                : edge),
            updatedAt: new Date().toISOString(),
        };
    }
    /**
     * Validate that all edges reference existing nodes
     */
    static validateReferences(graph) {
        const nodeIds = new Set(graph.nodes.map(node => node.id));
        return graph.edges.every(edge => nodeIds.has(edge.source) && nodeIds.has(edge.target));
    }
    /**
     * Get orphaned nodes (nodes with no edges)
     */
    static getOrphanedNodes(graph) {
        const connectedNodeIds = new Set();
        for (const edge of graph.edges) {
            connectedNodeIds.add(edge.source);
            connectedNodeIds.add(edge.target);
        }
        return graph.nodes.filter(node => !connectedNodeIds.has(node.id));
    }
}
//# sourceMappingURL=graph.js.map