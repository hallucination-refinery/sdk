import { z } from 'zod';
/**
 * Schema for layout types
 */
export const LayoutTypeSchema = z.enum([
    'force-directed',
    'hierarchical',
    'circular',
    'grid',
    'radial',
    'random',
    'custom',
]);
/**
 * Schema for force-directed layout parameters
 */
export const ForceLayoutParamsSchema = z.object({
    /**
     * Strength of node repulsion
     */
    chargeStrength: z.number().default(-300),
    /**
     * Maximum distance for charge force
     */
    chargeMaxDistance: z.number().positive().optional(),
    /**
     * Strength of edge links
     */
    linkStrength: z.number().min(0).max(1).default(1),
    /**
     * Desired edge length
     */
    linkDistance: z.number().positive().default(100),
    /**
     * Center force strength
     */
    centerStrength: z.number().min(0).max(1).default(0.1),
    /**
     * Collision radius multiplier
     */
    collisionRadius: z.number().positive().default(1.5),
    /**
     * Alpha decay rate (controls simulation cooling)
     */
    alphaDecay: z.number().min(0).max(1).default(0.02),
    /**
     * Velocity decay (friction)
     */
    velocityDecay: z.number().min(0).max(1).default(0.4),
});
/**
 * Schema for hierarchical layout parameters
 */
export const HierarchicalLayoutParamsSchema = z.object({
    /**
     * Direction of hierarchy
     */
    direction: z.enum(['top-down', 'bottom-up', 'left-right', 'right-left']).default('top-down'),
    /**
     * Spacing between levels
     */
    levelSpacing: z.number().positive().default(150),
    /**
     * Spacing between nodes at same level
     */
    nodeSpacing: z.number().positive().default(100),
    /**
     * Alignment of nodes within levels
     */
    alignment: z.enum(['start', 'center', 'end']).default('center'),
});
/**
 * Schema for circular layout parameters
 */
export const CircularLayoutParamsSchema = z.object({
    /**
     * Radius of the circle
     */
    radius: z.number().positive().default(200),
    /**
     * Start angle in radians
     */
    startAngle: z.number().default(0),
    /**
     * Whether to sort nodes by degree
     */
    sortByDegree: z.boolean().default(false),
});
/**
 * Schema for grid layout parameters
 */
export const GridLayoutParamsSchema = z.object({
    /**
     * Number of columns (auto-calculated if not provided)
     */
    columns: z.number().positive().optional(),
    /**
     * Spacing between nodes
     */
    spacing: z.number().positive().default(100),
    /**
     * Center the grid at origin
     */
    center: z.boolean().default(true),
});
/**
 * Schema for layout configuration
 */
export const LayoutConfigSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('force-directed'),
        params: ForceLayoutParamsSchema.optional(),
    }),
    z.object({
        type: z.literal('hierarchical'),
        params: HierarchicalLayoutParamsSchema.optional(),
    }),
    z.object({
        type: z.literal('circular'),
        params: CircularLayoutParamsSchema.optional(),
    }),
    z.object({
        type: z.literal('grid'),
        params: GridLayoutParamsSchema.optional(),
    }),
    z.object({
        type: z.literal('radial'),
        params: z.object({
            focusNodeId: z.string().optional(),
            levelSpacing: z.number().positive().default(100),
        }).optional(),
    }),
    z.object({
        type: z.literal('random'),
        params: z.object({
            bounds: z.object({
                min: z.number().default(-500),
                max: z.number().default(500),
            }).optional(),
        }).optional(),
    }),
    z.object({
        type: z.literal('custom'),
        params: z.record(z.unknown()).optional(),
    }),
]);
/**
 * Schema for layout state
 */
export const LayoutStateSchema = z.object({
    /**
     * Current layout configuration
     */
    config: LayoutConfigSchema,
    /**
     * Whether layout is currently running
     */
    isRunning: z.boolean().default(false),
    /**
     * Progress of layout computation (0-1)
     */
    progress: z.number().min(0).max(1).default(0),
    /**
     * Whether to animate transitions
     */
    animate: z.boolean().default(true),
    /**
     * Animation duration in milliseconds
     */
    animationDuration: z.number().positive().default(1000),
});
/**
 * Default layout configurations
 */
export const DefaultLayouts = {
    forceDirected: () => ({
        type: 'force-directed',
        params: ForceLayoutParamsSchema.parse({}),
    }),
    hierarchical: (direction) => ({
        type: 'hierarchical',
        params: HierarchicalLayoutParamsSchema.parse({ direction }),
    }),
    circular: () => ({
        type: 'circular',
        params: CircularLayoutParamsSchema.parse({}),
    }),
    grid: () => ({
        type: 'grid',
        params: GridLayoutParamsSchema.parse({}),
    }),
    radial: (focusNodeId) => ({
        type: 'radial',
        params: { focusNodeId, levelSpacing: 100 },
    }),
    random: () => ({
        type: 'random',
        params: { bounds: { min: -500, max: 500 } },
    }),
};
//# sourceMappingURL=layout.js.map