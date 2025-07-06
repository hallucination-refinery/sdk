import { z } from 'zod';
/**
 * Base schema for IdeaNode metadata
 * Allows for arbitrary key-value pairs while maintaining type safety
 */
export declare const IdeaNodeMetadataSchema: z.ZodRecord<z.ZodString, z.ZodUnknown>;
/**
 * Schema for the core IdeaNode type
 * Represents a node in the idea graph with position, content, and metadata
 */
export declare const IdeaNodeSchema: z.ZodObject<{
    /**
     * Unique identifier for the node
     */
    id: z.ZodString;
    /**
     * Display label for the node
     */
    label: z.ZodString;
    /**
     * Full content/description of the idea
     */
    content: z.ZodOptional<z.ZodString>;
    /**
     * 3D position in space
     */
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
    /**
     * Velocity vector for physics simulation
     */
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
    /**
     * Node color (hex or CSS color string)
     */
    color: z.ZodOptional<z.ZodString>;
    /**
     * Node size/radius
     */
    size: z.ZodOptional<z.ZodNumber>;
    /**
     * Whether the node is currently selected
     */
    selected: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the node is currently hovered
     */
    hovered: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the node position is fixed (not affected by physics)
     */
    fixed: z.ZodOptional<z.ZodBoolean>;
    /**
     * Open metadata field for extensibility
     * Allows any additional properties without breaking the schema
     */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    /**
     * Timestamp when the node was created
     */
    createdAt: z.ZodOptional<z.ZodString>;
    /**
     * Timestamp when the node was last updated
     */
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
}>;
/**
 * TypeScript type generated from the Zod schema
 */
export type IdeaNode = z.infer<typeof IdeaNodeSchema>;
/**
 * Schema for partial IdeaNode updates
 */
export declare const PartialIdeaNodeSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    label: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    position: z.ZodOptional<z.ZodOptional<z.ZodObject<{
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
    }>>>;
    velocity: z.ZodOptional<z.ZodOptional<z.ZodObject<{
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
    }>>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    size: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    selected: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    hovered: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    fixed: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    id?: string | undefined;
    label?: string | undefined;
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
    id?: string | undefined;
    label?: string | undefined;
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
}>;
/**
 * Type for partial IdeaNode updates
 */
export type PartialIdeaNode = z.infer<typeof PartialIdeaNodeSchema>;
/**
 * Type for IdeaNode creation (requires only essential fields)
 */
export declare const CreateIdeaNodeSchema: z.ZodObject<Pick<{
    /**
     * Unique identifier for the node
     */
    id: z.ZodString;
    /**
     * Display label for the node
     */
    label: z.ZodString;
    /**
     * Full content/description of the idea
     */
    content: z.ZodOptional<z.ZodString>;
    /**
     * 3D position in space
     */
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
    /**
     * Velocity vector for physics simulation
     */
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
    /**
     * Node color (hex or CSS color string)
     */
    color: z.ZodOptional<z.ZodString>;
    /**
     * Node size/radius
     */
    size: z.ZodOptional<z.ZodNumber>;
    /**
     * Whether the node is currently selected
     */
    selected: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the node is currently hovered
     */
    hovered: z.ZodOptional<z.ZodBoolean>;
    /**
     * Whether the node position is fixed (not affected by physics)
     */
    fixed: z.ZodOptional<z.ZodBoolean>;
    /**
     * Open metadata field for extensibility
     * Allows any additional properties without breaking the schema
     */
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    /**
     * Timestamp when the node was created
     */
    createdAt: z.ZodOptional<z.ZodString>;
    /**
     * Timestamp when the node was last updated
     */
    updatedAt: z.ZodOptional<z.ZodString>;
}, "id" | "label"> & {
    content: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    position: z.ZodOptional<z.ZodOptional<z.ZodObject<{
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
    }>>>;
    velocity: z.ZodOptional<z.ZodOptional<z.ZodObject<{
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
    }>>>;
    color: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    size: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    selected: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    hovered: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    fixed: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    createdAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updatedAt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
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
}>;
export type CreateIdeaNode = z.infer<typeof CreateIdeaNodeSchema>;
/**
 * Type guard to check if an object is an IdeaNode
 */
export declare function isIdeaNode(obj: unknown): obj is IdeaNode;
/**
 * Validate and parse an IdeaNode
 */
export declare function parseIdeaNode(obj: unknown): IdeaNode;
/**
 * Safely parse an IdeaNode, returning undefined on failure
 */
export declare function safeParseIdeaNode(obj: unknown): IdeaNode | undefined;
//# sourceMappingURL=idea-node.d.ts.map