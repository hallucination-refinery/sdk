import { z } from 'zod';
/**
 * Schema for 3D vector representation
 * Compatible with three.js Vector3 structure
 */
export const Vector3Schema = z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
});
/**
 * Schema for 2D vector representation
 */
export const Vector2Schema = z.object({
    x: z.number(),
    y: z.number(),
});
/**
 * Re-export as namespace for convenient access
 */
export const Vector3 = Vector3Schema;
export const Vector2 = Vector2Schema;
/**
 * Utility functions for vector operations
 */
export const VectorUtils = {
    /**
     * Create a zero vector
     */
    zero3() {
        return { x: 0, y: 0, z: 0 };
    },
    /**
     * Create a zero 2D vector
     */
    zero2() {
        return { x: 0, y: 0 };
    },
    /**
     * Calculate distance between two 3D points
     */
    distance3(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dz = b.z - a.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    },
    /**
     * Calculate distance between two 2D points
     */
    distance2(a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
    /**
     * Add two 3D vectors
     */
    add3(a, b) {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z,
        };
    },
    /**
     * Subtract two 3D vectors (a - b)
     */
    subtract3(a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y,
            z: a.z - b.z,
        };
    },
    /**
     * Scale a 3D vector by a scalar
     */
    scale3(v, scalar) {
        return {
            x: v.x * scalar,
            y: v.y * scalar,
            z: v.z * scalar,
        };
    },
    /**
     * Normalize a 3D vector to unit length
     */
    normalize3(v) {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        if (length === 0)
            return { x: 0, y: 0, z: 0 };
        return VectorUtils.scale3(v, 1 / length);
    },
    /**
     * Calculate dot product of two 3D vectors
     */
    dot3(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    },
    /**
     * Calculate cross product of two 3D vectors
     */
    cross3(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x,
        };
    },
};
//# sourceMappingURL=vectors.js.map