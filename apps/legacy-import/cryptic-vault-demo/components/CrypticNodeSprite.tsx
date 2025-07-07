import * as THREE from 'three';
import {
  NODE_TYPE_COLORS,
  CLUSTER_COLORS,
  OPACITY_VALUES,
} from '@/utils/clusterPalette';

// A cache for generated textures to avoid re-creating them on every render
const textureCache = new Map<string, THREE.Texture>();

function getCachedTexture(
  key: string,
  generator: () => THREE.Texture,
): THREE.Texture {
  if (!textureCache.has(key)) {
    textureCache.set(key, generator());
  }
  return textureCache.get(key)!;
}

export function buildCrypticNodeSprite(
  label: string,
  conceptType: string,
  cluster: string,
  isSecret: boolean,
  selectionColor?: string,
): THREE.Sprite {
  const primaryColor =
    selectionColor ||
    NODE_TYPE_COLORS[conceptType] ||
    CLUSTER_COLORS[cluster] ||
    '#ffffff';

  // --- Text wrapping preparation ---
  const font = 'bold 20px Arial';
  const lineHeight = 24;
  const maxWidth = 128 - 8; // canvas size minus some padding

  // Helper to wrap text and get lines
  const getWrappedLines = (
    text: string,
    context: CanvasRenderingContext2D,
    maxWidth: number,
  ): string[] => {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (const word of words) {
      const testLine = line + word + ' ';
      if (context.measureText(testLine).width > maxWidth && line.length > 0) {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    return lines;
  };

  // Create a temporary context to measure text without creating a full canvas yet
  const tempCtx = document.createElement('canvas').getContext('2d')!;
  tempCtx.font = font;
  const lines = getWrappedLines(label, tempCtx, maxWidth);
  const numLines = lines.length;
  // --- End of text wrapping preparation ---

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  const size = 128;
  const textAreaHeight = numLines * lineHeight; // Dynamic height for text area
  canvas.width = size;
  canvas.height = size + textAreaHeight; // extra space for label below

  // Key for caching based on all variable inputs
  const cacheKey = `${label}-${conceptType}-${cluster}-${isSecret}-${selectionColor}`;

  const texture = getCachedTexture(cacheKey, () => {
    // Redraw the canvas content for the new texture
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = font; // Ensure font is set on the actual context

    // Main filled circle (orb)
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2 - 4, 0, 2 * Math.PI); // orb centered in upper square
    context.fillStyle = primaryColor; // Fully filled orb
    context.fill();

    // Stroke for definition (slightly darker)
    context.strokeStyle = primaryColor;
    context.lineWidth = isSecret ? 8 : 4;
    context.stroke();

    // Secret indicator (dashed overlay stroke)
    if (isSecret) {
      context.setLineDash([8, 8]);
      context.stroke();
      context.setLineDash([]); // Reset for other drawings
    }

    // Text label (black for better contrast on colored fill)
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw wrapped text lines
    for (let i = 0; i < lines.length; i++) {
      const lineY = size + i * lineHeight + lineHeight / 2;
      context.fillText(lines[i], size / 2, lineY);
    }

    return new THREE.CanvasTexture(canvas);
  });

  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    color: primaryColor,
    transparent: true,
    opacity: OPACITY_VALUES.full,
    depthWrite: false, // Prevents z-fighting issues
    depthTest: true,
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  // Scale sprite preserving aspect ratio with extra height
  const baseScale = 32;
  sprite.scale.set(baseScale, baseScale * (canvas.height / size), 1);

  return sprite;
}

// Function to clear the cache, e.g., on component unmount
export function cleanupCrypticSpriteCache() {
  textureCache.forEach((texture) => texture.dispose());
  textureCache.clear();
}
