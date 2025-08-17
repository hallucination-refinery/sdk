import { Sprite } from 'three';
import { IdeaNode } from '@refinery/ideanode';
export declare const SpritePerformanceStats: {
    textureLoads: number;
    textureHits: number;
    materialCreations: number;
    materialHits: number;
    canvasCreations: number;
    getStats(): {
        textureLoads: number;
        textureHits: number;
        materialCreations: number;
        materialHits: number;
        canvasCreations: number;
        cacheHitRate: {
            textures: number;
            materials: number;
        };
    };
    reset(): void;
};
/**
 * Creates a THREE.Sprite for image nodes using cached texture and material loading.
 * PERFORMANCE: Now shares materials between sprites with same URL, color, aspect ratio, and tier.
 */
export declare function buildImageSprite(imageUrl: string, node: Partial<IdeaNode>, // Pass full node for access to all properties
selectionColor?: number): Sprite;
/**
 * Creates a simple text sprite with transparent background - just colored text
 * PERFORMANCE: Now caches canvas textures and shares materials for identical text.
 * Note: Text sprites only support 1:1 and 16:9 aspect ratios
 */
export declare function buildSimpleTextSprite(text: string, node: Partial<IdeaNode>, selectionColor?: string): Sprite;
/**
 * PERFORMANCE: Clean up unused cached materials (call periodically or on unmount)
 */
export declare function cleanupSpriteCache(): void;
