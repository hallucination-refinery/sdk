/**
 * Dreamdust GLSL helper snippets.
 *
 * Each snippet is a pure GLSL string literal that can be injected into shader sources.
 */

/**
 * Saturation helper macro.
 *
 * @glslUniforms None
 */
export const DD_SAT = /* glsl */ `
#define DD_SAT(dd_x) clamp(dd_x, 0.0, 1.0)
` as const;

/**
 * Linear remap helper macro.
 *
 * @glslUniforms None
 */
export const DD_REMAP = /* glsl */ `
#define DD_REMAP(dd_x, dd_inRange, dd_outRange) ((dd_outRange).x + ((dd_x) - (dd_inRange).x) * ((dd_outRange).y - (dd_outRange).x) / max((dd_inRange).y - (dd_inRange).x, 1e-5))
` as const;

/**
 * Branchless 3D hash function helpers.
 *
 * @glslUniforms None
 */
export const DD_HASH3 = /* glsl */ `
vec3 dd_hash3(vec3 dd_p) {
  vec3 dd_hashScale3 = vec3(0.1031, 0.1030, 0.0973);
  dd_p = fract(dd_p * dd_hashScale3);
  dd_p += dot(dd_p, dd_p.yzx + 33.33);
  return fract((dd_p.xxy + dd_p.yzz) * dd_p.zyx);
}

float dd_hash1(vec3 dd_p) {
  return dd_hash3(dd_p).x;
}
` as const;

/**
 * 2D fractal brownian motion built on the hash helpers.
 *
 * @glslUniforms None
 */
export const DD_NOISE2_FBM = /* glsl */ `
float dd_noise2Base(vec2 dd_p) {
  vec2 dd_i = floor(dd_p);
  vec2 dd_f = fract(dd_p);

  float dd_n00 = dd_hash1(vec3(dd_i, 0.0));
  float dd_n10 = dd_hash1(vec3(dd_i + vec2(1.0, 0.0), 0.0));
  float dd_n01 = dd_hash1(vec3(dd_i + vec2(0.0, 1.0), 0.0));
  float dd_n11 = dd_hash1(vec3(dd_i + vec2(1.0), 0.0));

  vec2 dd_u = dd_f * dd_f * (3.0 - 2.0 * dd_f);

  float dd_x1 = mix(dd_n00, dd_n10, dd_u.x);
  float dd_x2 = mix(dd_n01, dd_n11, dd_u.x);

  return mix(dd_x1, dd_x2, dd_u.y);
}

float dd_noise2Fbm(vec2 dd_p, float dd_lacunarity, float dd_gain, int dd_octaves) {
  float dd_amplitude = 0.5;
  float dd_frequency = 1.0;
  float dd_sum = 0.0;

  for (int dd_octave = 0; dd_octave < dd_octaves; ++dd_octave) {
    dd_sum += dd_amplitude * dd_noise2Base(dd_p * dd_frequency);
    dd_frequency *= dd_lacunarity;
    dd_amplitude *= dd_gain;
  }

  return dd_sum;
}
` as const;

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
` as const;

/**
 * Depth-based alpha falloff helper.
 *
 * @glslUniforms uDepthNormScale (float) multiplier to normalize view distance
 */
export const DD_DEPTH_ALPHA = /* glsl */ `
float dd_depthAlpha(float dd_viewDist, float dd_k) {
  float dd_distNorm = clamp(dd_viewDist * uDepthNormScale, 0.0, 10.0);
  return exp(-dd_k * dd_distNorm);
}
` as const;

export const glslChunks = {
  sat: DD_SAT,
  remap: DD_REMAP,
  hash3: DD_HASH3,
  fbm2: DD_NOISE2_FBM,
  screenPxToClip: DD_SCREEN_PX_TO_CLIP,
  depthAlpha: DD_DEPTH_ALPHA,
} as const;

export type GlslChunkKey = keyof typeof glslChunks;
