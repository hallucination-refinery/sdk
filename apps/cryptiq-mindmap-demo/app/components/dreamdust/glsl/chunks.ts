/**
 * Shared Dreamdust GLSL chunks for shader composition.
 *
 * Each chunk is exported as a raw GLSL string and is intended to be interpolated
 * into shader sources. Helper identifiers follow the `dd_` / `DD_` naming
 * convention to avoid collisions with reserved names.
 */

/**
 * Saturation helper that clamps a scalar to the [0, 1] range.
 *
 * @glslUniforms None
 */
export const DD_SAT = /* glsl */ `
float dd_saturate(float dd_value) {
  return clamp(dd_value, 0.0, 1.0);
}

#define DD_SAT(x) dd_saturate(x)
`;

/**
 * Linear remap helper that transforms a scalar between ranges.
 *
 * @glslUniforms None
 */
export const DD_REMAP = /* glsl */ `
float dd_remap(float dd_value, vec2 dd_fromRange, vec2 dd_toRange) {
  float dd_range = max(dd_fromRange.y - dd_fromRange.x, 1e-5);
  float dd_normalized = (dd_value - dd_fromRange.x) / dd_range;
  return mix(dd_toRange.x, dd_toRange.y, dd_normalized);
}

#define DD_REMAP(value, fromRange, toRange) dd_remap(value, fromRange, toRange)
`;

/**
 * Branchless 3D hash utilities (based on IQ-style hash functions).
 *
 * @glslUniforms None
 */
export const DD_HASH3 = /* glsl */ `
vec3 dd_hash33(vec3 dd_p) {
  vec3 dd_hashScale3 = vec3(0.1031, 0.1030, 0.0973);
  vec3 dd_q = fract(dd_p * dd_hashScale3);
  dd_q += dot(dd_q, dd_q.yzx + 33.33);
  return fract((dd_q.xxy + dd_q.yzz) * dd_q.zyx);
}

float dd_hash13(vec3 dd_p) {
  return dd_hash33(dd_p).x;
}

#define DD_HASH3(p) dd_hash33(p)
`;

/**
 * 2D fractal brownian motion built on top of {@link DD_HASH3} helpers.
 *
 * @glslUniforms None
 */
export const DD_NOISE2_FBM = /* glsl */ `
float dd_noise2Value(vec2 dd_p) {
  vec2 dd_i = floor(dd_p);
  vec2 dd_f = fract(dd_p);

  float dd_n00 = dd_hash13(vec3(dd_i, 0.0));
  float dd_n10 = dd_hash13(vec3(dd_i + vec2(1.0, 0.0), 0.0));
  float dd_n01 = dd_hash13(vec3(dd_i + vec2(0.0, 1.0), 0.0));
  float dd_n11 = dd_hash13(vec3(dd_i + vec2(1.0), 0.0));

  vec2 dd_u = dd_f * dd_f * (3.0 - 2.0 * dd_f);

  float dd_x1 = mix(dd_n00, dd_n10, dd_u.x);
  float dd_x2 = mix(dd_n01, dd_n11, dd_u.x);

  return mix(dd_x1, dd_x2, dd_u.y);
}

float dd_noise2Fbm(vec2 dd_p, float dd_lacunarity, float dd_gain, int dd_octaves) {
  const int dd_maxOctaves = 8;
  int dd_capped = min(dd_octaves, dd_maxOctaves);
  float dd_amplitude = 0.5;
  float dd_frequency = 1.0;
  float dd_sum = 0.0;

  for (int dd_index = 0; dd_index < dd_maxOctaves; ++dd_index) {
    if (dd_index >= dd_capped) {
      break;
    }

    dd_sum += dd_amplitude * dd_noise2Value(dd_p * dd_frequency);
    dd_frequency *= dd_lacunarity;
    dd_amplitude *= dd_gain;
  }

  return dd_sum;
}

#define DD_NOISE2_FBM(p, lacunarity, gain, octaves) dd_noise2Fbm(p, lacunarity, gain, octaves)
`;

/**
 * Converts absolute screen-space pixels into clip-space coordinates.
 *
 * @glslUniforms uViewport (vec2) viewport resolution in pixels
 */
export const DD_SCREEN_PX_TO_CLIP = /* glsl */ `
vec2 dd_screenPxToClip(vec2 dd_screenPx) {
  vec2 dd_viewport = max(uViewport, vec2(1.0));
  vec2 dd_clip = (dd_screenPx / dd_viewport) * 2.0 - 1.0;
  dd_clip.y = -dd_clip.y;
  return dd_clip;
}

#define DD_SCREEN_PX_TO_CLIP(px) dd_screenPxToClip(px)
`;

/**
 * Depth fade helper that normalizes camera-space distance before attenuation.
 *
 * @glslUniforms uDepthNormScale (float) depth normalization scale
 */
export const DD_DEPTH_ALPHA = /* glsl */ `
float dd_depthNorm(float dd_viewDist) {
  return clamp(dd_viewDist * uDepthNormScale, 0.0, 10.0);
}

float dd_depthAlpha(float dd_distNorm, float dd_k) {
  return exp(-dd_k * dd_distNorm);
}

#define DD_DEPTH_ALPHA(distNorm, k) dd_depthAlpha(distNorm, k)
`;

export const glslChunks = {
  sat: DD_SAT,
  remap: DD_REMAP,
  hash3: DD_HASH3,
  fbm2: DD_NOISE2_FBM,
  screenPxToClip: DD_SCREEN_PX_TO_CLIP,
  depthAlpha: DD_DEPTH_ALPHA,
} as const;

export type GlslChunkKey = keyof typeof glslChunks;
