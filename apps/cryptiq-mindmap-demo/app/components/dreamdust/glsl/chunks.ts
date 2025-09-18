/**
 * Unified Dreamdust GLSL chunks
 * - Provides DD_* helpers used by newer shaders
 * - Retains DREAMDUST_* exports consumed by DreamdustMaterial
 */

// Noise/hash helpers (2D value noise, 3D fbm), and screen helpers
export const DREAMDUST_NOISE_CHUNK = /* glsl */ `
// Branchless IQ-style hashes
vec3 dd_hash33(vec3 dd_p) {
  vec3 dd_hashScale3 = vec3(0.1031, 0.1030, 0.0973);
  vec3 dd_q = fract(dd_p * dd_hashScale3);
  dd_q += dot(dd_q, dd_q.yzx + 33.33);
  return fract((dd_q.xxy + dd_q.yzz) * dd_q.zyx);
}

float dd_hash13(vec3 dd_p) {
  return dd_hash33(dd_p).x;
}

float dd_hash12(vec2 dd_p) {
  return dd_hash13(vec3(dd_p, 0.0));
}

// 2D value noise used by reveal flow
float dd_noise2(vec2 dd_p) {
  vec2 dd_i = floor(dd_p);
  vec2 dd_f = fract(dd_p);
  vec2 dd_u = dd_f * dd_f * (3.0 - 2.0 * dd_f);

  float dd_n00 = dd_hash12(dd_i);
  float dd_n10 = dd_hash12(dd_i + vec2(1.0, 0.0));
  float dd_n01 = dd_hash12(dd_i + vec2(0.0, 1.0));
  float dd_n11 = dd_hash12(dd_i + vec2(1.0, 1.0));

  float dd_x0 = mix(dd_n00, dd_n10, dd_u.x);
  float dd_x1 = mix(dd_n01, dd_n11, dd_u.x);
  return mix(dd_x0, dd_x1, dd_u.y);
}

float dd_noise2(vec3 dd_p) {
  return dd_noise2(dd_p.xy + vec2(dd_p.z));
}

// Smoothed value noise for drift fields
float dreamdustNoise3d(vec3 dd_p) {
  vec3 dd_i = floor(dd_p);
  vec3 dd_f = fract(dd_p);
  vec3 dd_u = dd_f * dd_f * (3.0 - 2.0 * dd_f);

  float dd_n000 = dd_hash13(dd_i);
  float dd_n100 = dd_hash13(dd_i + vec3(1.0, 0.0, 0.0));
  float dd_n010 = dd_hash13(dd_i + vec3(0.0, 1.0, 0.0));
  float dd_n110 = dd_hash13(dd_i + vec3(1.0, 1.0, 0.0));
  float dd_n001 = dd_hash13(dd_i + vec3(0.0, 0.0, 1.0));
  float dd_n101 = dd_hash13(dd_i + vec3(1.0, 0.0, 1.0));
  float dd_n011 = dd_hash13(dd_i + vec3(0.0, 1.0, 1.0));
  float dd_n111 = dd_hash13(dd_i + vec3(1.0, 1.0, 1.0));

  float dd_nx00 = mix(dd_n000, dd_n100, dd_u.x);
  float dd_nx10 = mix(dd_n010, dd_n110, dd_u.x);
  float dd_nx01 = mix(dd_n001, dd_n101, dd_u.x);
  float dd_nx11 = mix(dd_n011, dd_n111, dd_u.x);
  float dd_nxy0 = mix(dd_nx00, dd_nx10, dd_u.y);
  float dd_nxy1 = mix(dd_nx01, dd_nx11, dd_u.y);
  return mix(dd_nxy0, dd_nxy1, dd_u.z);
}

float dreamdustFbm(vec3 dd_p) {
  float dd_value = 0.0;
  float dd_amplitude = 0.5;
  const int dd_octaves = 4;
  for (int dd_i = 0; dd_i < dd_octaves; ++dd_i) {
    dd_value += dreamdustNoise3d(dd_p) * dd_amplitude;
    dd_p *= 2.0;
    dd_amplitude *= 0.5;
  }
  return dd_value;
}
`

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
`

export const DREAMDUST_INK_SAMPLE_CHUNK = /* glsl */ `
struct DreamdustInkSample {
  vec2 offset;
  float swell;
  float intensity;
  vec3 tint;
};

DreamdustInkSample dreamdustSampleInk(sampler2D tex, vec2 uv) {
  vec4 ink = texture2D(tex, uv);
  DreamdustInkSample inkS;
  inkS.offset = ink.rg * 2.0 - 1.0;
  inkS.swell = ink.b;
  inkS.intensity = ink.a;
  inkS.tint = ink.rgb;
  return inkS;
}
`

export const DREAMDUST_DEPTH_FADE_CHUNK = /* glsl */ `
float dreamdustDepthFade(float viewDist, float bias) {
  if (bias <= 0.0) {
    return 1.0;
  }
  return clamp(exp(-viewDist * bias), 0.0, 1.0);
}

float dreamdustViewDepthNorm(vec3 posMV, float scale) {
  return clamp(-posMV.z * scale, 0.0, 10.0);
}

float dreamdustDepthAlpha(float depthNorm, float bias) {
  if (bias <= 0.0) {
    return 1.0;
  }
  return clamp(exp(-depthNorm * bias), 0.0, 1.0);
}

#define DD_DEPTH_ALPHA(depthNorm, bias) dreamdustDepthAlpha(depthNorm, bias)
`

export const DREAMDUST_SOFT_SPRITE_CHUNK = /* glsl */ `
float dreamdustSoftSprite(vec2 coord) {
  vec2 delta = coord * 2.0 - 1.0;
  float r2 = dot(delta, delta);
  float inner = smoothstep(0.95, 0.0, r2);
  float fringe = smoothstep(1.3, 0.3, r2);
  return clamp(inner * fringe, 0.0, 1.0);
}
`

export const DREAMDUST_COLOR_CHUNK = /* glsl */ `
vec3 dreamdustApplyInkTint(vec3 baseColor, vec3 tintColor, float amount) {
  float mixAmt = clamp(amount, 0.0, 1.0);
  vec3 tinted = mix(baseColor, tintColor, mixAmt);
  return mix(baseColor, tinted, mixAmt);
}

vec3 dreamdustApplyGamma(vec3 color, float gamma) {
  float g = max(gamma, 1e-3);
  vec3 safe = max(color, vec3(0.0));
  return pow(safe, vec3(1.0 / g));
}
`

// (registry removed; DREAMDUST_* chunks are imported directly by consumers)
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
 * 3D fractal brownian motion helper built on top of {@link dd_hash33}.
 *
 * @glslUniforms None
 */
export const DD_FBM3 = /* glsl */ `
float dd_noise3Value(vec3 dd_p) {
  vec3 dd_i = floor(dd_p);
  vec3 dd_f = fract(dd_p);
  vec3 dd_u = dd_f * dd_f * (3.0 - 2.0 * dd_f);

  float dd_n000 = dd_hash13(dd_i);
  float dd_n100 = dd_hash13(dd_i + vec3(1.0, 0.0, 0.0));
  float dd_n010 = dd_hash13(dd_i + vec3(0.0, 1.0, 0.0));
  float dd_n110 = dd_hash13(dd_i + vec3(1.0, 1.0, 0.0));
  float dd_n001 = dd_hash13(dd_i + vec3(0.0, 0.0, 1.0));
  float dd_n101 = dd_hash13(dd_i + vec3(1.0, 0.0, 1.0));
  float dd_n011 = dd_hash13(dd_i + vec3(0.0, 1.0, 1.0));
  float dd_n111 = dd_hash13(dd_i + vec3(1.0, 1.0, 1.0));

  float dd_nx00 = mix(dd_n000, dd_n100, dd_u.x);
  float dd_nx10 = mix(dd_n010, dd_n110, dd_u.x);
  float dd_nx01 = mix(dd_n001, dd_n101, dd_u.x);
  float dd_nx11 = mix(dd_n011, dd_n111, dd_u.x);
  float dd_nxy0 = mix(dd_nx00, dd_nx10, dd_u.y);
  float dd_nxy1 = mix(dd_nx01, dd_nx11, dd_u.y);
  return mix(dd_nxy0, dd_nxy1, dd_u.z);
}

float dd_fbm3(vec3 dd_p, float dd_lacunarity, float dd_gain, int dd_octaves) {
  const int dd_maxOctaves = 8;
  int dd_capped = min(dd_octaves, dd_maxOctaves);
  float dd_amplitude = 0.5;
  float dd_frequency = 1.0;
  float dd_sum = 0.0;

  for (int dd_index = 0; dd_index < dd_maxOctaves; ++dd_index) {
    if (dd_index >= dd_capped) {
      break;
    }

    dd_sum += dd_amplitude * dd_noise3Value(dd_p * dd_frequency);
    dd_frequency *= dd_lacunarity;
    dd_amplitude *= dd_gain;
  }

  return dd_sum;
}

#define DD_FBM3(p, lacunarity, gain, octaves) dd_fbm3(p, lacunarity, gain, octaves)
`;

/**
 * Curl noise derived from {@link dd_fbm3} for divergence-free advection.
 *
 * @glslUniforms None
 */
export const DD_CURL3 = /* glsl */ `
vec3 dd_fbm3Vec(vec3 dd_p) {
  return vec3(
    dd_fbm3(dd_p + vec3(37.1, 17.3, 91.7), 2.0, 0.5, 5) - 0.5,
    dd_fbm3(dd_p + vec3(11.7, 41.3, 27.9), 2.0, 0.5, 5) - 0.5,
    dd_fbm3(dd_p + vec3(23.9, 7.1, 61.3), 2.0, 0.5, 5) - 0.5
  );
}

vec3 dd_curl3(vec3 dd_p) {
  const float dd_eps = 0.1;
  const float dd_inv2eps = 0.5 / dd_eps;
  vec3 dd_dx = vec3(dd_eps, 0.0, 0.0);
  vec3 dd_dy = vec3(0.0, dd_eps, 0.0);
  vec3 dd_dz = vec3(0.0, 0.0, dd_eps);

  vec3 dd_flowXPos = dd_fbm3Vec(dd_p + dd_dx);
  vec3 dd_flowXNeg = dd_fbm3Vec(dd_p - dd_dx);
  vec3 dd_flowYPos = dd_fbm3Vec(dd_p + dd_dy);
  vec3 dd_flowYNeg = dd_fbm3Vec(dd_p - dd_dy);
  vec3 dd_flowZPos = dd_fbm3Vec(dd_p + dd_dz);
  vec3 dd_flowZNeg = dd_fbm3Vec(dd_p - dd_dz);

  float dd_dFz_dy = (dd_flowYPos.z - dd_flowYNeg.z) * dd_inv2eps;
  float dd_dFy_dz = (dd_flowZPos.y - dd_flowZNeg.y) * dd_inv2eps;
  float dd_dFx_dz = (dd_flowZPos.x - dd_flowZNeg.x) * dd_inv2eps;
  float dd_dFz_dx = (dd_flowXPos.z - dd_flowXNeg.z) * dd_inv2eps;
  float dd_dFy_dx = (dd_flowXPos.y - dd_flowXNeg.y) * dd_inv2eps;
  float dd_dFx_dy = (dd_flowYPos.x - dd_flowYNeg.x) * dd_inv2eps;

  vec3 dd_curl = vec3(
    dd_dFz_dy - dd_dFy_dz,
    dd_dFx_dz - dd_dFz_dx,
    dd_dFy_dx - dd_dFx_dy
  );

  float dd_len = length(dd_curl);
  if (dd_len < 1e-5) {
    return vec3(0.0);
  }
  return dd_curl / dd_len;
}

#define DD_CURL3(p) dd_curl3(p)
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
  fbm3: DD_FBM3,
  curl3: DD_CURL3,
  screenPxToClip: DD_SCREEN_PX_TO_CLIP,
  depthAlpha: DD_DEPTH_ALPHA,
} as const;

export type GlslChunkKey = keyof typeof glslChunks;
