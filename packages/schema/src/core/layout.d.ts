import { z } from 'zod';
/**
 * Schema for layout types
 */
export declare const LayoutTypeSchema: z.ZodEnum<["force-directed", "hierarchical", "circular", "grid", "radial", "random", "custom"]>;
export type LayoutType = z.infer<typeof LayoutTypeSchema>;
/**
 * Schema for force-directed layout parameters
 */
export declare const ForceLayoutParamsSchema: z.ZodObject<{
    /**
     * Strength of node repulsion
     */
    chargeStrength: z.ZodDefault<z.ZodNumber>;
    /**
     * Maximum distance for charge force
     */
    chargeMaxDistance: z.ZodOptional<z.ZodNumber>;
    /**
     * Strength of edge links
     */
    linkStrength: z.ZodDefault<z.ZodNumber>;
    /**
     * Desired edge length
     */
    linkDistance: z.ZodDefault<z.ZodNumber>;
    /**
     * Center force strength
     */
    centerStrength: z.ZodDefault<z.ZodNumber>;
    /**
     * Collision radius multiplier
     */
    collisionRadius: z.ZodDefault<z.ZodNumber>;
    /**
     * Alpha decay rate (controls simulation cooling)
     */
    alphaDecay: z.ZodDefault<z.ZodNumber>;
    /**
     * Velocity decay (friction)
     */
    velocityDecay: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    chargeStrength: number;
    linkStrength: number;
    linkDistance: number;
    centerStrength: number;
    collisionRadius: number;
    alphaDecay: number;
    velocityDecay: number;
    chargeMaxDistance?: number | undefined;
}, {
    chargeStrength?: number | undefined;
    chargeMaxDistance?: number | undefined;
    linkStrength?: number | undefined;
    linkDistance?: number | undefined;
    centerStrength?: number | undefined;
    collisionRadius?: number | undefined;
    alphaDecay?: number | undefined;
    velocityDecay?: number | undefined;
}>;
export type ForceLayoutParams = z.infer<typeof ForceLayoutParamsSchema>;
/**
 * Schema for hierarchical layout parameters
 */
export declare const HierarchicalLayoutParamsSchema: z.ZodObject<{
    /**
     * Direction of hierarchy
     */
    direction: z.ZodDefault<z.ZodEnum<["top-down", "bottom-up", "left-right", "right-left"]>>;
    /**
     * Spacing between levels
     */
    levelSpacing: z.ZodDefault<z.ZodNumber>;
    /**
     * Spacing between nodes at same level
     */
    nodeSpacing: z.ZodDefault<z.ZodNumber>;
    /**
     * Alignment of nodes within levels
     */
    alignment: z.ZodDefault<z.ZodEnum<["start", "center", "end"]>>;
}, "strip", z.ZodTypeAny, {
    direction: "top-down" | "bottom-up" | "left-right" | "right-left";
    levelSpacing: number;
    nodeSpacing: number;
    alignment: "start" | "center" | "end";
}, {
    direction?: "top-down" | "bottom-up" | "left-right" | "right-left" | undefined;
    levelSpacing?: number | undefined;
    nodeSpacing?: number | undefined;
    alignment?: "start" | "center" | "end" | undefined;
}>;
export type HierarchicalLayoutParams = z.infer<typeof HierarchicalLayoutParamsSchema>;
/**
 * Schema for circular layout parameters
 */
export declare const CircularLayoutParamsSchema: z.ZodObject<{
    /**
     * Radius of the circle
     */
    radius: z.ZodDefault<z.ZodNumber>;
    /**
     * Start angle in radians
     */
    startAngle: z.ZodDefault<z.ZodNumber>;
    /**
     * Whether to sort nodes by degree
     */
    sortByDegree: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    radius: number;
    startAngle: number;
    sortByDegree: boolean;
}, {
    radius?: number | undefined;
    startAngle?: number | undefined;
    sortByDegree?: boolean | undefined;
}>;
export type CircularLayoutParams = z.infer<typeof CircularLayoutParamsSchema>;
/**
 * Schema for grid layout parameters
 */
export declare const GridLayoutParamsSchema: z.ZodObject<{
    /**
     * Number of columns (auto-calculated if not provided)
     */
    columns: z.ZodOptional<z.ZodNumber>;
    /**
     * Spacing between nodes
     */
    spacing: z.ZodDefault<z.ZodNumber>;
    /**
     * Center the grid at origin
     */
    center: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    center: boolean;
    spacing: number;
    columns?: number | undefined;
}, {
    center?: boolean | undefined;
    columns?: number | undefined;
    spacing?: number | undefined;
}>;
export type GridLayoutParams = z.infer<typeof GridLayoutParamsSchema>;
/**
 * Schema for layout configuration
 */
export declare const LayoutConfigSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"force-directed">;
    params: z.ZodOptional<z.ZodObject<{
        /**
         * Strength of node repulsion
         */
        chargeStrength: z.ZodDefault<z.ZodNumber>;
        /**
         * Maximum distance for charge force
         */
        chargeMaxDistance: z.ZodOptional<z.ZodNumber>;
        /**
         * Strength of edge links
         */
        linkStrength: z.ZodDefault<z.ZodNumber>;
        /**
         * Desired edge length
         */
        linkDistance: z.ZodDefault<z.ZodNumber>;
        /**
         * Center force strength
         */
        centerStrength: z.ZodDefault<z.ZodNumber>;
        /**
         * Collision radius multiplier
         */
        collisionRadius: z.ZodDefault<z.ZodNumber>;
        /**
         * Alpha decay rate (controls simulation cooling)
         */
        alphaDecay: z.ZodDefault<z.ZodNumber>;
        /**
         * Velocity decay (friction)
         */
        velocityDecay: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        chargeStrength: number;
        linkStrength: number;
        linkDistance: number;
        centerStrength: number;
        collisionRadius: number;
        alphaDecay: number;
        velocityDecay: number;
        chargeMaxDistance?: number | undefined;
    }, {
        chargeStrength?: number | undefined;
        chargeMaxDistance?: number | undefined;
        linkStrength?: number | undefined;
        linkDistance?: number | undefined;
        centerStrength?: number | undefined;
        collisionRadius?: number | undefined;
        alphaDecay?: number | undefined;
        velocityDecay?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "force-directed";
    params?: {
        chargeStrength: number;
        linkStrength: number;
        linkDistance: number;
        centerStrength: number;
        collisionRadius: number;
        alphaDecay: number;
        velocityDecay: number;
        chargeMaxDistance?: number | undefined;
    } | undefined;
}, {
    type: "force-directed";
    params?: {
        chargeStrength?: number | undefined;
        chargeMaxDistance?: number | undefined;
        linkStrength?: number | undefined;
        linkDistance?: number | undefined;
        centerStrength?: number | undefined;
        collisionRadius?: number | undefined;
        alphaDecay?: number | undefined;
        velocityDecay?: number | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"hierarchical">;
    params: z.ZodOptional<z.ZodObject<{
        /**
         * Direction of hierarchy
         */
        direction: z.ZodDefault<z.ZodEnum<["top-down", "bottom-up", "left-right", "right-left"]>>;
        /**
         * Spacing between levels
         */
        levelSpacing: z.ZodDefault<z.ZodNumber>;
        /**
         * Spacing between nodes at same level
         */
        nodeSpacing: z.ZodDefault<z.ZodNumber>;
        /**
         * Alignment of nodes within levels
         */
        alignment: z.ZodDefault<z.ZodEnum<["start", "center", "end"]>>;
    }, "strip", z.ZodTypeAny, {
        direction: "top-down" | "bottom-up" | "left-right" | "right-left";
        levelSpacing: number;
        nodeSpacing: number;
        alignment: "start" | "center" | "end";
    }, {
        direction?: "top-down" | "bottom-up" | "left-right" | "right-left" | undefined;
        levelSpacing?: number | undefined;
        nodeSpacing?: number | undefined;
        alignment?: "start" | "center" | "end" | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "hierarchical";
    params?: {
        direction: "top-down" | "bottom-up" | "left-right" | "right-left";
        levelSpacing: number;
        nodeSpacing: number;
        alignment: "start" | "center" | "end";
    } | undefined;
}, {
    type: "hierarchical";
    params?: {
        direction?: "top-down" | "bottom-up" | "left-right" | "right-left" | undefined;
        levelSpacing?: number | undefined;
        nodeSpacing?: number | undefined;
        alignment?: "start" | "center" | "end" | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"circular">;
    params: z.ZodOptional<z.ZodObject<{
        /**
         * Radius of the circle
         */
        radius: z.ZodDefault<z.ZodNumber>;
        /**
         * Start angle in radians
         */
        startAngle: z.ZodDefault<z.ZodNumber>;
        /**
         * Whether to sort nodes by degree
         */
        sortByDegree: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        radius: number;
        startAngle: number;
        sortByDegree: boolean;
    }, {
        radius?: number | undefined;
        startAngle?: number | undefined;
        sortByDegree?: boolean | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "circular";
    params?: {
        radius: number;
        startAngle: number;
        sortByDegree: boolean;
    } | undefined;
}, {
    type: "circular";
    params?: {
        radius?: number | undefined;
        startAngle?: number | undefined;
        sortByDegree?: boolean | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"grid">;
    params: z.ZodOptional<z.ZodObject<{
        /**
         * Number of columns (auto-calculated if not provided)
         */
        columns: z.ZodOptional<z.ZodNumber>;
        /**
         * Spacing between nodes
         */
        spacing: z.ZodDefault<z.ZodNumber>;
        /**
         * Center the grid at origin
         */
        center: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        center: boolean;
        spacing: number;
        columns?: number | undefined;
    }, {
        center?: boolean | undefined;
        columns?: number | undefined;
        spacing?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "grid";
    params?: {
        center: boolean;
        spacing: number;
        columns?: number | undefined;
    } | undefined;
}, {
    type: "grid";
    params?: {
        center?: boolean | undefined;
        columns?: number | undefined;
        spacing?: number | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"radial">;
    params: z.ZodOptional<z.ZodObject<{
        focusNodeId: z.ZodOptional<z.ZodString>;
        levelSpacing: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        levelSpacing: number;
        focusNodeId?: string | undefined;
    }, {
        levelSpacing?: number | undefined;
        focusNodeId?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "radial";
    params?: {
        levelSpacing: number;
        focusNodeId?: string | undefined;
    } | undefined;
}, {
    type: "radial";
    params?: {
        levelSpacing?: number | undefined;
        focusNodeId?: string | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"random">;
    params: z.ZodOptional<z.ZodObject<{
        bounds: z.ZodOptional<z.ZodObject<{
            min: z.ZodDefault<z.ZodNumber>;
            max: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            min: number;
            max: number;
        }, {
            min?: number | undefined;
            max?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        bounds?: {
            min: number;
            max: number;
        } | undefined;
    }, {
        bounds?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    type: "random";
    params?: {
        bounds?: {
            min: number;
            max: number;
        } | undefined;
    } | undefined;
}, {
    type: "random";
    params?: {
        bounds?: {
            min?: number | undefined;
            max?: number | undefined;
        } | undefined;
    } | undefined;
}>, z.ZodObject<{
    type: z.ZodLiteral<"custom">;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: "custom";
    params?: Record<string, unknown> | undefined;
}, {
    type: "custom";
    params?: Record<string, unknown> | undefined;
}>]>;
export type LayoutConfig = z.infer<typeof LayoutConfigSchema>;
/**
 * Schema for layout state
 */
export declare const LayoutStateSchema: z.ZodObject<{
    /**
     * Current layout configuration
     */
    config: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"force-directed">;
        params: z.ZodOptional<z.ZodObject<{
            /**
             * Strength of node repulsion
             */
            chargeStrength: z.ZodDefault<z.ZodNumber>;
            /**
             * Maximum distance for charge force
             */
            chargeMaxDistance: z.ZodOptional<z.ZodNumber>;
            /**
             * Strength of edge links
             */
            linkStrength: z.ZodDefault<z.ZodNumber>;
            /**
             * Desired edge length
             */
            linkDistance: z.ZodDefault<z.ZodNumber>;
            /**
             * Center force strength
             */
            centerStrength: z.ZodDefault<z.ZodNumber>;
            /**
             * Collision radius multiplier
             */
            collisionRadius: z.ZodDefault<z.ZodNumber>;
            /**
             * Alpha decay rate (controls simulation cooling)
             */
            alphaDecay: z.ZodDefault<z.ZodNumber>;
            /**
             * Velocity decay (friction)
             */
            velocityDecay: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            chargeStrength: number;
            linkStrength: number;
            linkDistance: number;
            centerStrength: number;
            collisionRadius: number;
            alphaDecay: number;
            velocityDecay: number;
            chargeMaxDistance?: number | undefined;
        }, {
            chargeStrength?: number | undefined;
            chargeMaxDistance?: number | undefined;
            linkStrength?: number | undefined;
            linkDistance?: number | undefined;
            centerStrength?: number | undefined;
            collisionRadius?: number | undefined;
            alphaDecay?: number | undefined;
            velocityDecay?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "force-directed";
        params?: {
            chargeStrength: number;
            linkStrength: number;
            linkDistance: number;
            centerStrength: number;
            collisionRadius: number;
            alphaDecay: number;
            velocityDecay: number;
            chargeMaxDistance?: number | undefined;
        } | undefined;
    }, {
        type: "force-directed";
        params?: {
            chargeStrength?: number | undefined;
            chargeMaxDistance?: number | undefined;
            linkStrength?: number | undefined;
            linkDistance?: number | undefined;
            centerStrength?: number | undefined;
            collisionRadius?: number | undefined;
            alphaDecay?: number | undefined;
            velocityDecay?: number | undefined;
        } | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"hierarchical">;
        params: z.ZodOptional<z.ZodObject<{
            /**
             * Direction of hierarchy
             */
            direction: z.ZodDefault<z.ZodEnum<["top-down", "bottom-up", "left-right", "right-left"]>>;
            /**
             * Spacing between levels
             */
            levelSpacing: z.ZodDefault<z.ZodNumber>;
            /**
             * Spacing between nodes at same level
             */
            nodeSpacing: z.ZodDefault<z.ZodNumber>;
            /**
             * Alignment of nodes within levels
             */
            alignment: z.ZodDefault<z.ZodEnum<["start", "center", "end"]>>;
        }, "strip", z.ZodTypeAny, {
            direction: "top-down" | "bottom-up" | "left-right" | "right-left";
            levelSpacing: number;
            nodeSpacing: number;
            alignment: "start" | "center" | "end";
        }, {
            direction?: "top-down" | "bottom-up" | "left-right" | "right-left" | undefined;
            levelSpacing?: number | undefined;
            nodeSpacing?: number | undefined;
            alignment?: "start" | "center" | "end" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "hierarchical";
        params?: {
            direction: "top-down" | "bottom-up" | "left-right" | "right-left";
            levelSpacing: number;
            nodeSpacing: number;
            alignment: "start" | "center" | "end";
        } | undefined;
    }, {
        type: "hierarchical";
        params?: {
            direction?: "top-down" | "bottom-up" | "left-right" | "right-left" | undefined;
            levelSpacing?: number | undefined;
            nodeSpacing?: number | undefined;
            alignment?: "start" | "center" | "end" | undefined;
        } | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"circular">;
        params: z.ZodOptional<z.ZodObject<{
            /**
             * Radius of the circle
             */
            radius: z.ZodDefault<z.ZodNumber>;
            /**
             * Start angle in radians
             */
            startAngle: z.ZodDefault<z.ZodNumber>;
            /**
             * Whether to sort nodes by degree
             */
            sortByDegree: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            radius: number;
            startAngle: number;
            sortByDegree: boolean;
        }, {
            radius?: number | undefined;
            startAngle?: number | undefined;
            sortByDegree?: boolean | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "circular";
        params?: {
            radius: number;
            startAngle: number;
            sortByDegree: boolean;
        } | undefined;
    }, {
        type: "circular";
        params?: {
            radius?: number | undefined;
            startAngle?: number | undefined;
            sortByDegree?: boolean | undefined;
        } | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"grid">;
        params: z.ZodOptional<z.ZodObject<{
            /**
             * Number of columns (auto-calculated if not provided)
             */
            columns: z.ZodOptional<z.ZodNumber>;
            /**
             * Spacing between nodes
             */
            spacing: z.ZodDefault<z.ZodNumber>;
            /**
             * Center the grid at origin
             */
            center: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            center: boolean;
            spacing: number;
            columns?: number | undefined;
        }, {
            center?: boolean | undefined;
            columns?: number | undefined;
            spacing?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "grid";
        params?: {
            center: boolean;
            spacing: number;
            columns?: number | undefined;
        } | undefined;
    }, {
        type: "grid";
        params?: {
            center?: boolean | undefined;
            columns?: number | undefined;
            spacing?: number | undefined;
        } | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"radial">;
        params: z.ZodOptional<z.ZodObject<{
            focusNodeId: z.ZodOptional<z.ZodString>;
            levelSpacing: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            levelSpacing: number;
            focusNodeId?: string | undefined;
        }, {
            levelSpacing?: number | undefined;
            focusNodeId?: string | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "radial";
        params?: {
            levelSpacing: number;
            focusNodeId?: string | undefined;
        } | undefined;
    }, {
        type: "radial";
        params?: {
            levelSpacing?: number | undefined;
            focusNodeId?: string | undefined;
        } | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"random">;
        params: z.ZodOptional<z.ZodObject<{
            bounds: z.ZodOptional<z.ZodObject<{
                min: z.ZodDefault<z.ZodNumber>;
                max: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                min: number;
                max: number;
            }, {
                min?: number | undefined;
                max?: number | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            bounds?: {
                min: number;
                max: number;
            } | undefined;
        }, {
            bounds?: {
                min?: number | undefined;
                max?: number | undefined;
            } | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        type: "random";
        params?: {
            bounds?: {
                min: number;
                max: number;
            } | undefined;
        } | undefined;
    }, {
        type: "random";
        params?: {
            bounds?: {
                min?: number | undefined;
                max?: number | undefined;
            } | undefined;
        } | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"custom">;
        params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: "custom";
        params?: Record<string, unknown> | undefined;
    }, {
        type: "custom";
        params?: Record<string, unknown> | undefined;
    }>]>;
    /**
     * Whether layout is currently running
     */
    isRunning: z.ZodDefault<z.ZodBoolean>;
    /**
     * Progress of layout computation (0-1)
     */
    progress: z.ZodDefault<z.ZodNumber>;
    /**
     * Whether to animate transitions
     */
    animate: z.ZodDefault<z.ZodBoolean>;
    /**
     * Animation duration in milliseconds
     */
    animationDuration: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    config: {
        type: "force-directed";
        params?: {
            chargeStrength: number;
            linkStrength: number;
            linkDistance: number;
            centerStrength: number;
            collisionRadius: number;
            alphaDecay: number;
            velocityDecay: number;
            chargeMaxDistance?: number | undefined;
        } | undefined;
    } | {
        type: "hierarchical";
        params?: {
            direction: "top-down" | "bottom-up" | "left-right" | "right-left";
            levelSpacing: number;
            nodeSpacing: number;
            alignment: "start" | "center" | "end";
        } | undefined;
    } | {
        type: "circular";
        params?: {
            radius: number;
            startAngle: number;
            sortByDegree: boolean;
        } | undefined;
    } | {
        type: "grid";
        params?: {
            center: boolean;
            spacing: number;
            columns?: number | undefined;
        } | undefined;
    } | {
        type: "radial";
        params?: {
            levelSpacing: number;
            focusNodeId?: string | undefined;
        } | undefined;
    } | {
        type: "random";
        params?: {
            bounds?: {
                min: number;
                max: number;
            } | undefined;
        } | undefined;
    } | {
        type: "custom";
        params?: Record<string, unknown> | undefined;
    };
    isRunning: boolean;
    progress: number;
    animate: boolean;
    animationDuration: number;
}, {
    config: {
        type: "force-directed";
        params?: {
            chargeStrength?: number | undefined;
            chargeMaxDistance?: number | undefined;
            linkStrength?: number | undefined;
            linkDistance?: number | undefined;
            centerStrength?: number | undefined;
            collisionRadius?: number | undefined;
            alphaDecay?: number | undefined;
            velocityDecay?: number | undefined;
        } | undefined;
    } | {
        type: "hierarchical";
        params?: {
            direction?: "top-down" | "bottom-up" | "left-right" | "right-left" | undefined;
            levelSpacing?: number | undefined;
            nodeSpacing?: number | undefined;
            alignment?: "start" | "center" | "end" | undefined;
        } | undefined;
    } | {
        type: "circular";
        params?: {
            radius?: number | undefined;
            startAngle?: number | undefined;
            sortByDegree?: boolean | undefined;
        } | undefined;
    } | {
        type: "grid";
        params?: {
            center?: boolean | undefined;
            columns?: number | undefined;
            spacing?: number | undefined;
        } | undefined;
    } | {
        type: "radial";
        params?: {
            levelSpacing?: number | undefined;
            focusNodeId?: string | undefined;
        } | undefined;
    } | {
        type: "random";
        params?: {
            bounds?: {
                min?: number | undefined;
                max?: number | undefined;
            } | undefined;
        } | undefined;
    } | {
        type: "custom";
        params?: Record<string, unknown> | undefined;
    };
    isRunning?: boolean | undefined;
    progress?: number | undefined;
    animate?: boolean | undefined;
    animationDuration?: number | undefined;
}>;
export type LayoutState = z.infer<typeof LayoutStateSchema>;
/**
 * Default layout configurations
 */
export declare const DefaultLayouts: {
    forceDirected: () => LayoutConfig;
    hierarchical: (direction?: HierarchicalLayoutParams["direction"]) => LayoutConfig;
    circular: () => LayoutConfig;
    grid: () => LayoutConfig;
    radial: (focusNodeId?: string) => LayoutConfig;
    random: () => LayoutConfig;
};
//# sourceMappingURL=layout.d.ts.map