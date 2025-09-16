/**
 * Shared GLSL chunks for the Dreamdust renderer.
 *
 * Each chunk is a raw GLSL string intended to be interpolated into shader sources.
 */

/**
 * Branchless 3D hash utilities (based on iq-style hash functions).
 *
 * @glslUniforms None
 */
export const NOISE_HASH = /* glsl */ `
vec3 hash33(vec3 p) {
  const vec3 HASHSCALE3 = vec3(0.1031, 0.1030, 0.0973);
  p = fract(p * HASHSCALE3);
  p += dot(p, p.yzx + 33.33);
  return fract((p.xxy + p.yzz) * p.zyx);
}

float hash13(vec3 p) {
  return hash33(p).x;
}
`;

/**
 * 2D fractal brownian motion built on top of {@link NOISE_HASH} helpers.
 *
 * @glslUniforms None
 */
export const FBM2 = /* glsl */ `
#ifndef FBM2_MAX_OCTAVES
#define FBM2_MAX_OCTAVES 8
#endif

float fbmNoise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  float n00 = hash13(vec3(i, 0.0));
  float n10 = hash13(vec3(i + vec2(1.0, 0.0), 0.0));
  float n01 = hash13(vec3(i + vec2(0.0, 1.0), 0.0));
  float n11 = hash13(vec3(i + vec2(1.0), 0.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  float x1 = mix(n00, n10, u.x);
  float x2 = mix(n01, n11, u.x);

  return mix(x1, x2, u.y);
}

float fbm2(vec2 p, float lacunarity, float gain, int octaves) {
  float amplitude = 0.5;
  float frequency = 1.0;
  float sum = 0.0;
  int cappedOctaves = min(octaves, FBM2_MAX_OCTAVES);

  for (int i = 0; i < FBM2_MAX_OCTAVES; ++i) {
    if (i >= cappedOctaves) {
      break;
    }

    sum += amplitude * fbmNoise2(p * frequency);
    frequency *= lacunarity;
    amplitude *= gain;
  }

  return sum;
}
`;

/**
 * Converts absolute screen-space pixels into clip-space coordinates.
 *
 * @glslUniforms uViewport (vec2) viewport resolution in pixels
 */
export const SCREEN_PX_TO_CLIP = /* glsl */ `
vec2 screenPxToClip(vec2 screenPx) {
  vec2 viewport = max(uViewport, vec2(1.0));
  vec2 clip = (screenPx / viewport) * 2.0 - 1.0;
  clip.y = -clip.y;
  return clip;
}
`;

/**
 * Saturation helper that clamps a scalar to the [0, 1] range.
 *
 * @glslUniforms None
 */
export const SAT = /* glsl */ `
#define SAT(x) clamp(x, 0.0, 1.0)
`;

/**
 * Linear remap helper that transforms a scalar between ranges.
 *
 * @glslUniforms None
 */
export const REMAP = /* glsl */ `
#define REMAP(x, a, b) ((b).x + ((x) - (a).x) * ((b).y - (b).x) / max((a).y - (a).x, 1e-5))
`;

export const glslChunks = {
  hash: NOISE_HASH,
  fbm2: FBM2,
  screenPxToClip: SCREEN_PX_TO_CLIP,
  sat: SAT,
  remap: REMAP,
} as const;

export type GlslChunkKey = keyof typeof glslChunks;
