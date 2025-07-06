import { z } from 'zod';
/**
 * Schema for 3D vector representation
 * Compatible with three.js Vector3 structure
 */
export declare const Vector3Schema: z.ZodObject<{
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
}>;
/**
 * TypeScript type for 3D vectors
 */
export type Vector3 = z.infer<typeof Vector3Schema>;
/**
 * Schema for 2D vector representation
 */
export declare const Vector2Schema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
/**
 * TypeScript type for 2D vectors
 */
export type Vector2 = z.infer<typeof Vector2Schema>;
/**
 * Re-export as namespace for convenient access
 */
export declare const Vector3: z.ZodObject<{
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
}>;
export declare const Vector2: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
}, {
    x: number;
    y: number;
}>;
/**
 * Utility functions for vector operations
 */
export declare const VectorUtils: {
    /**
     * Create a zero vector
     */
    zero3(): Vector3;
    /**
     * Create a zero 2D vector
     */
    zero2(): Vector2;
    /**
     * Calculate distance between two 3D points
     */
    distance3(a: Vector3, b: Vector3): number;
    /**
     * Calculate distance between two 2D points
     */
    distance2(a: Vector2, b: Vector2): number;
    /**
     * Add two 3D vectors
     */
    add3(a: Vector3, b: Vector3): Vector3;
    /**
     * Subtract two 3D vectors (a - b)
     */
    subtract3(a: Vector3, b: Vector3): Vector3;
    /**
     * Scale a 3D vector by a scalar
     */
    scale3(v: Vector3, scalar: number): Vector3;
    /**
     * Normalize a 3D vector to unit length
     */
    normalize3(v: Vector3): Vector3;
    /**
     * Calculate dot product of two 3D vectors
     */
    dot3(a: Vector3, b: Vector3): number;
    /**
     * Calculate cross product of two 3D vectors
     */
    cross3(a: Vector3, b: Vector3): Vector3;
};
//# sourceMappingURL=vectors.d.ts.map