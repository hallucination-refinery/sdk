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

/**
 * DREAMDUST_* chunks — public exports expected by DreamdustMaterial (PR #129)
 * These are defined here so both the new material and any future shaders can
 * consume a consistent set of helper snippets. We retain our existing helper
 * snippets above (NOISE_HASH/FBM2/SCREEN_PX_TO_CLIP/SAT/REMAP) for reuse.
 */

export const DREAMDUST_NOISE_CHUNK = /* glsl */ `
float dreamdustHash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z + 1.0));
}

float dreamdustNoise3d(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float n000 = dreamdustHash(i + vec3(0.0, 0.0, 0.0));
  float n100 = dreamdustHash(i + vec3(1.0, 0.0, 0.0));
  float n010 = dreamdustHash(i + vec3(0.0, 1.0, 0.0));
  float n110 = dreamdustHash(i + vec3(1.0, 1.0, 0.0));
  float n001 = dreamdustHash(i + vec3(0.0, 0.0, 1.0));
  float n101 = dreamdustHash(i + vec3(1.0, 0.0, 1.0));
  float n011 = dreamdustHash(i + vec3(0.0, 1.0, 1.0));
  float n111 = dreamdustHash(i + vec3(1.0, 1.0, 1.0));

  float nx00 = mix(n000, n100, f.x);
  float nx10 = mix(n010, n110, f.x);
  float nx01 = mix(n001, n101, f.x);
  float nx11 = mix(n011, n111, f.x);

  float nxy0 = mix(nx00, nx10, f.y);
  float nxy1 = mix(nx01, nx11, f.y);

  return mix(nxy0, nxy1, f.z);
}

float dreamdustFbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += dreamdustNoise3d(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
`;

export const DREAMDUST_DRIFT_CHUNK = /* glsl */ `
vec3 dreamdustDrift(vec3 pos, float time, float scale, float speed, float amp) {
  vec3 base = pos * scale + vec3(0.0, 0.0, time * speed);
  float nx = dreamdustFbm(base + vec3(37.2, 11.8, 5.4));
  float ny = dreamdustFbm(base + vec3(5.3, 27.1, 19.7));
  float nz = dreamdustFbm(base + vec3(11.1, 41.3, 7.9));
  vec3 dir = vec3(nx, ny, nz) * 2.0 - 1.0;
  float len = max(1e-3, length(dir));
  dir /= len;
  return dir * amp;
}
`;

export const DREAMDUST_INK_SAMPLE_CHUNK = /* glsl */ `
struct DreamdustInkSample {
  vec2 offset;
  float swell;
  float intensity;
  vec3 tint;
};

DreamdustInkSample dreamdustSampleInk(sampler2D tex, vec2 uv) {
  vec4 ink = texture2D(tex, uv);
  DreamdustInkSample sample;
  sample.offset = ink.rg * 2.0 - 1.0;
  sample.swell = ink.b;
  sample.intensity = ink.a;
  sample.tint = ink.rgb;
  return sample;
}
`;

export const DREAMDUST_DEPTH_FADE_CHUNK = /* glsl */ `
float dreamdustDepthFade(float viewDist, float bias) {
  if (bias <= 0.0) {
    return 1.0;
  }
  return clamp(exp(-viewDist * bias), 0.0, 1.0);
}
`;

export const DREAMDUST_POINT_SHAPE_CHUNK = /* glsl */ `
float dreamdustPointShape(vec2 coord) {
  vec2 delta = coord * 2.0 - 1.0;
  float r2 = dot(delta, delta);
  float core = smoothstep(1.0, 0.0, r2);
  float feather = smoothstep(1.0, 0.6, r2);
  return core * feather;
}
`;

export const DREAMDUST_COLOR_CHUNK = /* glsl */ `
vec3 dreamdustApplyInkTint(vec3 baseColor, vec3 tintColor, float amount) {
  float mixAmt = clamp(amount, 0.0, 1.0);
  vec3 tinted = baseColor + tintColor * mixAmt;
  return mix(baseColor, tinted, mixAmt);
}
`;
